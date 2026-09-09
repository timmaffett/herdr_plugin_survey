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
- Up to **100,000 characters** (`MAX_CODE_CHARS = 100000`) of code are bundled per prompt.
- Files are scored and prioritized so the most critical architectural files are always included:
  1. `herdr-plugin.toml` (Score: 100)
  2. `README.md` (Score: 90)
  3. `AGENTS.md` / `architecture.md` (Score: 85)
  4. `package.json` / `Cargo.toml` / `pyproject.toml` (Score: 80)
  5. Socket/IPC integration files (Score: 75)
  6. Core entrypoints (`main`, `index`, `lib`, `mod`) (Score: 70)
  7. Implementation source code (`.rs`, `.ts`, `.js`, `.py`, `.go`) (Score: 60)
  8. Excluded: lockfiles, minified bundles, binary fixtures, tests.

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
    plugin_name TEXT PRIMARY KEY,
    first_seen_date TEXT,
    category TEXT,
    model_used TEXT,
    overview TEXT,
    capabilities TEXT,
    architecture TEXT,
    herdr_integration TEXT,
    dependencies TEXT,
    extensibility_limitations TEXT,
    raw_markdown TEXT,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    reasoning_tokens INTEGER,
    total_tokens INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
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

### 6.1 Evaluate Plugins Incrementally (Recommended)
Run the runner to process the next batch of un-evaluated plugins in chronological order:
```bash
# Process the next 5 unanalyzed plugins (chronological order from Genesis)
npm run survey:llm -- --limit 5

# Or via node directly
node scripts/run_llm_evaluations.js --limit 5
```

### 6.2 Evaluate a Specific Plugin by Name
```bash
node scripts/run_llm_evaluations.js --plugin nicosuave/memex
```

### 6.3 Force Re-evaluation
If prompt instructions or the model change and you wish to re-evaluate existing plugins:
```bash
node scripts/run_llm_evaluations.js --plugin nicosuave/memex --force
```

### 6.4 Dry-Run Inspection
To inspect what files would be read and what prompt would be constructed without calling the Meta API:
```bash
node scripts/run_llm_evaluations.js --limit 1 --dry-run
```

### 6.5 Environment Variables
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
sqlite3 plugins.db "SELECT plugin_name, first_seen_date, completion_tokens, reasoning_tokens, created_at FROM plugin_llm_evaluations ORDER BY first_seen_date ASC;"
```

As of September 8, 2026, the genesis plugins have been evaluated, cross-referenced, and persisted:
- `2026-01-01`: `nicosuave/memex` (5,169 completion tokens, 1,542 reasoning tokens)
- `2026-01-15`: `alvinunreal/oh-my-opencode-slim` (3,509 completion tokens, 1,152 reasoning tokens)
- `2026-01-16`: `eugenioenko/ttt` (3,899 completion tokens, 1,321 reasoning tokens)
- `2026-02-24`: `VilfredSikker/easy-review` (3,284 completion tokens, 1,497 reasoning tokens)
- `2026-03-02`: `second-state/vibetty` (5,615 completion tokens, 2,002 reasoning tokens)
- `2026-03-02`: `HikaruEgashira/say-hook` (4,484 completion tokens, 1,654 reasoning tokens)
