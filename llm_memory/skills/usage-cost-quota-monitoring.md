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

