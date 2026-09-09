# Architectural Memory: Usage, Cost & Quota Monitoring

This document tracks architectural patterns and previously surveyed extensions within the **Usage, Cost & Quota Monitoring** domain.

## Surveyed Extensions Ledger

### [2026-01-01] nicosuave/memex
- **Overview**: `memex` is a Rust binary (~83k LOC) for fast, local history search over coding-agent transcripts. It indexes conversation logs left by Claude Code, Codex CLI, Cursor, OpenCode, Pi, Oh My Pi, OpenClaw, Copilot CLI, Grok, Jcode, Muse, plus Hermes usage records and Claude/Codex project memories, then exposes them via CLI, TUI, local web UI, and MCP.
- **Key Features**: **Indexing and search core:** * Incremental `memex index`, `index rebuild`, `index gc [--dry-run --offline]`, `index embed`, `index stats`. Copy-on-write generations; searches keep reading the last co

### [2026-04-28] uwuclxdy/clauth
- **Overview**: `clauth` is a Claude Code multi-account manager and usage monitor, packaged as a Rust CLI + TUI (`clauth` binary, v0.15.1). The `herdr-plugin/` subdirectory is a thin Herdr adapter: it opens the full `clauth` dashboard in a Herdr popup, labels every Herdr pane running Claude Code with the account that pane is spending, and surfaces delegate-run state as pane metadata.
- **Key Features**: **Dashboard popup:** * `clauth.open` — opens `clauth` TUI in a popup (`quit with q`). Herdr allows one popup per session; a second open while one is up is treated as no-op, not error. * Placement is k

### [2026-06-25] Davidcreador/herdr-token-dashboard
- **Overview**: The Token Dashboard is a Go-based Herdr plugin that provides live cost and token observability across agent panes. Its single binary (`bin/token-dashboard`, built from `cmd/token-dashboard`) opens as a tab-placed Bubble Tea TUI that polls `herdr pane list` every 3 seconds, reads per-agent session files or a local server API, and renders a summary table plus per-agent detail cards. A second mode sends a Herdr native toast when an agent finishes, with cost and token totals.
- **Key Features**: **Live dashboard TUI (default mode, no flags):** Bubble Tea v2 `model` with `Init/Update/View`, `AltScreen=true`, ticking via `tea.Tick(3*time.Second)`. Controls are `q`/`esc`/`ctrl+c` to quit and `r`

### [2026-06-28] fkiene/llmtrim-herdr
- **Overview**: `fkiene/llmtrim-herdr` (`id: llmtrim.proxy`, `v0.1.0`) is a thin Herdr adapter for the external `llmtrim` binary — a local MITM HTTPS proxy that compresses outbound LLM requests to cut token cost. It does not implement compression itself; on `workspace.created` it idempotently runs `llmtrim setup` + `llmtrim start` so every Herdr agent pane inherits `HTTPS_PROXY`/`SSL_CERT_FILE`/`NODE_EXTRA_CA_CERTS` automatically, then surfaces savings via a sidebar badge, a live dashboard pane, and one-shot notifications.
- **Key Features**: **Lifecycle hooks (three, each with `linux/macos` `.sh` + `windows` `.ps1` twins):**  * `workspace.created` → `bin/bootstrap.sh` / `bin/bootstrap.ps1`: resolve `llmtrim` via `command -v`/`Get-Command`

### [2026-07-07] qq88976321/herdr-copy-search
- **Overview**: `qq88976321/herdr-copy-search` (`id: copy-search`, `v0.1.5`) is a Rust TUI that brings tmux-copycat / extrakto ergonomics to Herdr. It snapshots the focused pane's scrollback via `herdr pane read`, offers incremental regex search, predefined + user-defined pattern search, and fuzzy token extraction, then lands in a vim-style copy mode for refining and yanking via OSC 52.
- **Key Features**: **Three overlay entrypoints, same binary:**  * `copy` — idle vim-style viewer. `--mode copy`. * `search` — same viewer opened with `/` prompt active. `--mode search`. * `extract` — extrakto-style `fzf

### [2026-07-12] ezcorp-org/herdr-pc-ram-and-cpu-usage-overlay
- **Overview**: This plugin shows **live PC CPU and RAM usage per Herdr space (workspace)**. For every workspace it resolves each pane's shell PID over the Herdr socket, walks that PID's process subtree (`/proc` on Linux, `libproc` on macOS, Toolhelp32 + `GetProcessTimes` on Windows), samples CPU jiffies over a window and sums RSS, then groups the result under the space's git branch name.
- **Key Features**: **Per-space measurement:** * CPU% as share of whole machine (`ΣΔjiffies / CLK_TCK / elapsed / NPROC * 100`, 0–100%, not per-core), RAM in MB + proc count, refreshed every 5s by default (`interval_seco

### [2026-07-16] senna-lang/herdr-agent-usage
- **Overview**: `herdr-agent-usage` is a Go-based Usage, Cost & Quota Monitoring plugin that surfaces per-pane context occupancy and per-account rate-limit headroom inside Herdr. It publishes sidebar metadata tokens (`$context`, `$cache_*`, `$limit`, `$provider`, `$title`) for open agent panes, renders a live `Agent Usage` pane with 5h / 7d / 30d subscription windows plus pay-as-you-go spend blocks, and emits threshold-based toasts before limits exhaust.
- **Key Features**: **Sidebar meters (event-driven + periodic):** * `$context`: `⛁ 13% (130k)` when window known, absolute `130k` otherwise; `⛁ compacted (14k)` after Claude compaction; width-degraded candidates via `cor

### [2026-07-20] alejodelosrios/herdr-claude-usage
- **Overview**: `alejodelosrios/herdr-claude-usage` (`id: unit1.claude-usage`, `v0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a minimal Usage Monitoring plugin that keeps Claude plan consumption always visible in Herdr.
- **Key Features**: **What the user sees:**  * **Sidebar line:** `Session 65% | Week 9%` rendered via a `$claude_usage` row in `[ui.sidebar.spaces]`. The daemon reports the token only to the dedicated mini-space, so the 

### [2026-07-21] maedana/herdr-whereami
- **Overview**: `Where Am I` (`id: maedana.whereami`) is a small Rust Herdr plugin that answers “which repo/branch is this pane in?” in two places at once: the **tab title** and the **agent sidebar**. Inside a git repository the label is `repo-name/branch`; outside a repository it falls back to the current directory basename.
- **Key Features**: Key user-visible behavior, all driven by the same compiled binary:  **Auto-rename on focus:** On every `pane.focused` event the plugin resolves the focused pane’s working directory, runs git detection

### [2026-07-23] silverwolfdoc/herdr-usage-bar
- **Overview**: `Herdr Usage Bar` (`id: usagebar`, `v0.1.1`, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring** plugin for Herdr agent panes. It keeps per-pane context occupancy (`$context`), shortest subscription window remaining (`$limit`), and harness-vs-backend identity (`$provider`) always visible in the sidebar, adds a full `Herdr Usage Bar` limits pane and a thin bottom `statusbar` pane with reset countdowns, and fires threshold toasts before rate limits exhaust.
- **Key Features**: **User-visible surfaces:**  * **Sidebar meters via Herdr 0.7.4 configurable rows:** `$context` e.g. `⛁ 13% (130k)` or absolute `130k` when window unknown, `⛁ compacted (14k)` handling, `⚠️` at >=80%; 

### [2026-07-23] Coolsik/herdr-codex-cost
- **Overview**: `herdr-codex-cost` (`id: dev.herdr-codex-cost`, `v0.3.2`) is a **Usage, Cost & Quota Monitoring** plugin scoped exclusively to Codex. It calculates an estimated public Standard-API-equivalent cost for the Codex thread running in each Herdr pane — including descendant sub-agent threads — by parsing local Codex `rollout-*.jsonl` token counters and applying a hard-coded price table, then publishes the result as a `$cost` sidebar token via `pane report-metadata`.
- **Key Features**: **User-visible display values** (documented in `README.md` / `README.ko.md`, produced by `bin/codex-cost` + `bin/update-cost`):  * `$1.23` — clean calculation. * `!!$1.23` — partial exclusion due to u

### [2026-07-24] gecm0/herdr-plugin-agents-usage
- **Overview**: `gecm.agents-usage` (`v0.1.0`, `min_herdr_version 0.7.4`, `linux`/`macos` only) is a **Usage, Cost & Quota Monitoring** plugin that shows current provider consumption in a Herdr modal popup. It aggregates four independent sources — Claude Code OAuth, Codex CLI local snapshots, OpenCode Go local SQLite history, and Neuralwatt quota API — into a single ANSI bar view with plan type and reset countdowns.
- **Key Features**: **Two user-visible entrypoints, one binary:**  * `usage` pane (`placement = popup`, `width 70%`, `height 24`, `command = ["python3", "usage.py", "pane"]`): renders `Provider usage` with one colored he

