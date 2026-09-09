# Architectural Memory: Usage, Cost & Quota Monitoring

This document tracks architectural patterns and previously surveyed extensions within the **Usage, Cost & Quota Monitoring** domain.

## Surveyed Extensions Ledger

### [2026-01-01] nicosuave/memex
- **Overview**: `memex` is a Rust binary (~83k LOC) for fast, local history search over coding-agent transcripts. It indexes conversation logs left by Claude Code, Codex CLI, Cursor, OpenCode, Pi, Oh My Pi, OpenClaw, Copilot CLI, Grok, Jcode, Muse, plus Hermes usage records and Claude/Codex project memories, then exposes them via CLI, TUI, local web UI, and MCP.
- **Key Features**: **Indexing and search core:** * Incremental `memex index`, `index rebuild`, `index gc [--dry-run --offline]`, `index embed`, `index stats`. Copy-on-write generations; searches keep reading the last co

### [2026-04-28] uwuclxdy/clauth
- **Overview**: `clauth` is a Claude Code multi-account manager and usage monitor, packaged as a Rust CLI + TUI (`clauth` binary, v0.15.1). The `herdr-plugin/` subdirectory is a thin Herdr adapter: it opens the full `clauth` dashboard in a Herdr popup, labels every Herdr pane running Claude Code with the account that pane is spending, and surfaces delegate-run state as pane metadata.
- **Key Features**: **Dashboard popup:** * `clauth.open` — opens `clauth` TUI in a popup (`quit with q`). Herdr allows one popup per session; a second open while one is up is treated as no-op, not error. * Placement is k

