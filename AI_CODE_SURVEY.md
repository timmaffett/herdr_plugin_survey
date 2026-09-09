# Herdr Plugins — AI Architecture Code Survey System

This document outlines the architecture, implementation, configuration, and operational procedures for the **AI Architectural Code Survey Engine** in the Herdr Ecosystem Intelligence portal.

---

## 1. Overview & Objectives

While deterministic AST parsers, regex tokenizers, and metadata sync tools capture concrete factual properties of a plugin (LOC, language, raw star counts, socket bindings, exported CLI commands), they cannot explain:
- **Design Intent & Idiomatic Patterns:** Why the author structured the plugin in a particular way.
- **Architectural Trade-offs:** How the plugin balances concurrency, IPC latency, or memory consumption.
- **Cross-Ecosystem Evolution:** How newly released plugins compare with, borrow from, or surpass earlier plugins released months or weeks prior.

The **AI Architectural Code Survey Engine** pairs static analysis with an advanced reasoning LLM (**Meta AI `muse-spark-1.3-contributor`**) to inspect every plugin's actual source code, understand its architecture, and generate persistent, high-density technical analysis for software architects and developers.

---

## 2. Core Architecture

The evaluation pipeline follows a deterministic-first, LLM-synthesis architecture:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Local Codebase Ingestion (plugins_repos/<author>/<name>) │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌─────────────────────────────┐        ┌─────────────────────────────┐
│ Deterministic Fact Scanner  │        │ Code Prioritization Engine  │
│ - Primary language & LOC    │        │ - herdr-plugin.toml (100)   │
│ - Socket API calls          │        │ - README / AGENTS.md (90-85)│
│ - CLI command definitions   │        │ - Entrypoints & Core logic  │
│ - Supported Agent scopes    │        │ - 100,000 char budget pack  │
└──────────────┬──────────────┘        └──────────────┬──────────────┘
               │                                      │
               └───────────────────┬──────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Progressive Domain Memory Retrieval                         │
│ (llm_memory/skills/<category>.md)                           │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Meta AI Completions Call (muse-spark-1.3-contributor)       │
│ - System prompt: Staff Software Architect role              │
│ - Deterministic facts + Progressive memory + Source files   │
│ - Max tokens: 50,000 (supports 2,000+ reasoning tokens)     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Section Parser & SQLite Storage (plugins.db)                │
│ - Overview, Capabilities, Architecture, Integration,        │
│   Dependencies, Extensibility & Limitations                 │
│ - Completion tokens & Reasoning tokens logged               │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Progressive Memory Distillation                             │
│ - Category memory file updated with new plugin learnings    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Meta LLM Integration & Token Mechanics

### 3.1 Endpoint & Authentication
- **Endpoint:** `https://api.meta.ai/v1/chat/completions`
- **Model:** `muse-spark-1.3-contributor`
- **Key Resolution:**
  1. `process.env.META_API_KEY` (if passed in environment)
  2. Local file: `meta_llm_key.txt` in the project root (strictly gitignored)

### 3.2 Understanding `max_tokens` & Reasoning Tokens
A common point of confusion with LLM APIs is the `max_tokens` parameter:

#### Why was `max_tokens` originally set to 4,000–6,000?
- Standard OpenAI/Anthropic convention historically capped completions at 2,048 or 4,096 tokens to protect against accidental cost overruns or infinite response loops.
- When first scaffolding the Meta API connection, a conservative safeguard of 4,000–6,000 was set.

#### Why is a low `max_tokens` problematic for `muse-spark-1.3-contributor`?
- `muse-spark-1.3-contributor` is a **chain-of-thought reasoning model**.
- Before generating visible response text, it generates extensive internal `reasoning_content`.
- In our live experiments on plugins like `nicosuave/memex`, the model used **1,542 reasoning tokens** just formulating its architectural critique.
- **Crucially:** The Meta API counts **both reasoning tokens and visible completion tokens against `max_tokens`**.
- When `max_tokens` was capped at 4,000, spending 1,500+ tokens on reasoning left only ~2,500 tokens for the actual 6-section technical breakdown. If the codebase was large or complex, the response would hit the ceiling prematurely or return `content: null`.

#### Can `max_tokens` be 50,000 or 100,000?
- **Yes.** We tested the Meta API directly with payloads specifying `8,000`, `16,000`, `32,000`, `50,000`, `65,536`, and `100,000` tokens.
- **The Meta API accepted all of them with HTTP 200.**
- The model only outputs as many tokens as needed to complete the survey (typically 3,500–6,000 completion tokens + ~1,500 reasoning tokens).
- Therefore, setting `max_tokens` to **`50,000`** provides ample headroom so that deep reasoning traces and extensive technical commentary are never truncated.
- You can override this at runtime via `META_MAX_TOKENS`:
  ```bash
  META_MAX_TOKENS=50000 npm run survey:llm
  ```

### 3.3 Code Budget & Smart Prioritization
- Up to **350,000 characters** (`MAX_CODE_CHARS = 350000`) of source code are bundled per prompt (~90,000–110,000 input tokens).
- Files are scored and prioritized so runtime glue and shell hooks are never crowded out:
  1. **Manifest-Referenced Scripts & Files (Score: 100):** `collectFiles` parses `herdr-plugin.toml` up-front. Any script referenced in `command = [...]`, `[[build]]`, or `[[actions]]` (e.g. `scripts/install.sh`, `scripts/open-worktree.sh`, `bin/...`) is automatically assigned top priority.
  2. `herdr-plugin.toml` (Score: 100)
  3. **Shell Scripts & Lifecycle Hooks (Score: 85):** `.sh`, `.bash`, `.zsh` files, and scripts in `/scripts/`, `/bin/`, or `/hooks/`.
  4. Socket & IPC integrations (`/herdr/`, `herdr`, `socket`, `pane`) (Score: 80)
  5. Package definitions (`package.json`, `Cargo.toml`, `pyproject.toml`) (Score: 80)
  6. Documentation (`README.md`, `AGENTS.md`, `ARCHITECTURE.md`) (Score: 75) — *Capped at 12,000 characters per file to prevent doc monopolization.*
  7. Core entrypoints (`main.*`, `index.*`, `lib.*`, `mod.*`) (Score: 70)
  8. Implementation source code (`.rs`, `.ts`, `.js`, `.py`, `.go`, `.lua`, `.c`) (Score: 65)
  9. Excluded: lockfiles, minified bundles, binary fixtures, unit tests.

### 3.4 Network Resilience & Automatic Retry Logic
Long batch runs (e.g. surveying 50–100 plugins sequentially) can encounter transient TCP socket drops, gateway keep-alive timeouts, or rate limits.
- **Root Cause of `terminated` Errors:** In Node.js native `fetch` (powered by `undici`), if a remote server or reverse proxy closes an active socket before the response finishes streaming, an `Error: terminated` or `TypeError: fetch failed` is thrown.
- **Built-in Backoff Engine:** `makeRequest()` wraps all completions calls in a 4-attempt retry loop with exponential backoff (3s, 6s, 9s). It automatically recovers from:
  - Socket resets (`terminated`, `ECONNRESET`, `ETIMEDOUT`)
  - HTTP 429 (Rate Limit Exceeded)
  - HTTP 500/502/503/504 (Upstream server gateway glitches)
- **SQLite Concurrency Defense:** All database transactions enforce `PRAGMA busy_timeout = 10000;` and a 5-attempt retry loop with random backoff, preventing `database is locked` errors during background processing.

---

## 4. Progressive Cross-Plugin Memory System

One of the unique capabilities of this system is **progressive memory**. When analyzing a plugin released in August 2026, the model should know what was built in January and March 2026.

### 4.1 Knowledge Base Directory
All progressive memories are stored in `llm_memory/skills/`:
- `agent-orchestration-swarms.md`: Knowledge regarding multi-agent coordination, subagents, and task graphs.
- `code-review-diff-inspection.md`: Knowledge regarding diff inspection, AST parsing, and linter hooks.
- `developer-workflow-utilities.md`: Knowledge regarding shell helpers, CLI tools, and terminal panes.
- `usage-cost-quota-monitoring.md`: Knowledge regarding token counting, API throttling, and budget monitors.

### 4.2 How Memory Flows
1. **Pre-Evaluation:** The survey runner reads the category memory file corresponding to the plugin's category.
2. **Context Injection:** The memory snippet is prepended to the prompt under `Ecosystem Category Memory (<Category>):`.
3. **Synthesis:** The LLM actively cites prior plugins. (For example, on `2026-02-24`, when evaluating `VilfredSikker/easy-review`, the LLM cited its memory of `eugenioenko/ttt` from `2026-01-16` to compare diff inspection strategies).
4. **Post-Evaluation Distillation:** Key architectural takeaways, hooks used, and limitations are appended back into the category memory file for subsequent runs.

---

## 5. Database Schema & Storage

Evaluations are stored in `plugins.db` in the `plugin_llm_evaluations` table:

```sql
CREATE TABLE IF NOT EXISTS plugin_llm_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_date TEXT NOT NULL,
    plugin_id INTEGER NOT NULL,
    repo_full_name TEXT NOT NULL,
    model_name TEXT NOT NULL,
    overview TEXT,
    capabilities TEXT,
    architecture TEXT,
    herdr_integration TEXT,
    dependencies TEXT,
    extensibility_limitations TEXT,
    full_markdown TEXT NOT NULL,
    reasoning_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(plugin_id) REFERENCES plugins(id),
    UNIQUE(report_date, plugin_id)
);
CREATE INDEX IF NOT EXISTS idx_llm_eval_date ON plugin_llm_evaluations(report_date);
CREATE INDEX IF NOT EXISTS idx_llm_eval_plugin ON plugin_llm_evaluations(plugin_id);
```

### The 6 Standard Survey Sections
Every report is parsed into 6 discrete sections so they can be rendered as structured UI components:
1. **Overview:** 2–3 sentence executive explanation of purpose and design philosophy.
2. **Capabilities:** Concrete features, registered commands, IPC endpoints, and agent hooks.
3. **Architecture:** Internal directory layout, concurrency model, data flow, and state machines.
4. **Herdr Integration:** Specific Herdr socket protocols, event listeners, and manifest hooks.
5. **Dependencies:** External packages, runtime prerequisites, and internal peer dependencies.
6. **Extensibility & Limitations:** Extension points, known edge-cases, error-handling gaps, and security considerations.

---

## 6. Running the Survey Engine (CLI Commands)

The survey runner [`scripts/run_llm_evaluations.js`](file:///Users/tim/source/herdr_plugins/scripts/run_llm_evaluations.js) supports both space-separated (`--limit 5`) and equals-separated (`--limit=5`) arguments.

### 6.1 Evaluate Plugins Incrementally (Recommended)
Processes the next batch of unanalyzed plugins in chronological order from Genesis (Day 1):
```bash
# Process next 5 unanalyzed plugins
npm run survey:llm -- --limit 5

# Or via node directly
node scripts/run_llm_evaluations.js --limit 5

# Process a larger batch (e.g. 50 plugins)
node scripts/run_llm_evaluations.js --limit 50
```

### 6.2 Target a Specific Plugin by Name (and Recover Failed Ones)
If a plugin fails during a marathon run (e.g. due to a network glitch or remote gateway reset), you can immediately isolate and run just that single plugin without re-processing the queue:
```bash
# Evaluate a specific plugin
node scripts/run_llm_evaluations.js --plugin tdi/herdr-worktree-from-linear

node scripts/run_llm_evaluations.js --plugin 0xGosu/herdr-auto-pilot
```

### 6.3 Force Re-evaluation of an Existing Plugin
By default, the runner skips plugins that already have an entry in `plugin_llm_evaluations`. Use `--force` to re-analyze an already surveyed plugin:
```bash
node scripts/run_llm_evaluations.js --plugin eugenioenko/ttt --force
```

### 6.4 Re-evaluate All Previously Surveyed Plugins (`--re-eval`)
When prompt instructions, file scoring logic, or token budgets change, use `--re-eval` to re-evaluate **strictly all plugins that have already been surveyed**, in chronological sequence, without processing new ones:
```bash
node scripts/run_llm_evaluations.js --re-eval
```

### 6.5 Target Plugins Released on a Specific Date
```bash
node scripts/run_llm_evaluations.js --date 2026-07-03
```

### 6.6 Dry-Run Inspection
Inspect which files would be collected, how priority scores are assigned, and the character size of the prompt without making an API call:
```bash
# Dry run for next 5 queued plugins
node scripts/run_llm_evaluations.js --limit 5 --dry-run

# Dry run for a specific plugin
node scripts/run_llm_evaluations.js --plugin tdi/herdr-worktree-from-linear --dry-run
```

### 6.7 Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `META_API_KEY` | Reads `meta_llm_key.txt` | Meta AI API Bearer token |
| `META_API_URL` | `https://api.meta.ai/v1/chat/completions` | Completions endpoint URL |
| `META_MODEL` | `muse-spark-1.3-contributor` | Model ID to invoke |
| `META_MAX_TOKENS` | `50000` | Maximum completion token ceiling |

---

## 7. Frontend User Interface Controls

### 7.1 AI Code Survey Toggle Button
In the Daily Reports view toolbar (`public/index.html`):
- **`[ 🤖 AI Code Survey | ON ]` / `[ OFF ]`**: Toggles visibility of all AI architectural survey accordions across all newspaper cards. State is persisted in `localStorage` (`herdr_llm_eval_enabled`).

### 7.2 Date Navigation & Next Active Day
Located alongside the date picker in the sticky toolbar:
- **`Today (Sep 7)`**: Jumps to the latest date.
- **`⏮ Genesis (Day 1)`**: Jumps to Day 1 (`2026-01-01`).
- **`⏩ Next Active Day`**: Queries `GET /api/daily-reports/next-active?date=<current>` to automatically jump across quiet days to the next calendar date with plugin releases or Herdr news.
- **Infinite Backwards Scroll:** Scrolling down from any selected date automatically fetches subsequent historical reports in reverse chronological order (`&before_date=<cursor>`).

---

## 8. Verifying Current Progress

To inspect currently stored evaluations in SQLite:
```bash
sqlite3 plugins.db "SELECT count(*), min(report_date), max(report_date) FROM plugin_llm_evaluations;"
```

To view token metrics across recent evaluations:
```bash
sqlite3 plugins.db "SELECT report_date, repo_full_name, total_tokens, reasoning_tokens, completion_tokens FROM plugin_llm_evaluations ORDER BY report_date DESC LIMIT 15;"
```

As of September 9, 2026:
- **Total Plugins Surveyed:** **153 plugins**
- **Date Range Covered:** Genesis Day 1 (`2026-01-01`) through `2026-07-09`
- **Average Token Ingestion:** ~75,000–105,000 tokens per plugin (with up to 350,000 characters of prioritized code per prompt)
- **Manifest & Shell Ingestion:** 100% of manifest entrypoints, bash/sh glue scripts, and context parsers are prioritized and analyzed without truncation.
