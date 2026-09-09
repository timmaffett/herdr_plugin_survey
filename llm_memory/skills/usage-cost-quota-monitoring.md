# Architectural Memory: Usage, Cost & Quota Monitoring

This document tracks architectural patterns and previously surveyed extensions within the **Usage, Cost & Quota Monitoring** domain.

## Surveyed Extensions Ledger

### [2026-01-01] nicosuave/memex
- **Overview**: `memex` is a Rust binary (~83k LOC) for fast, local history search over coding-agent transcripts. It indexes conversation logs left by Claude Code, Codex CLI, Cursor, OpenCode, Pi, Oh My Pi, OpenClaw, Copilot CLI, Grok, Jcode, Muse, plus Hermes usage records and Claude/Codex project memories, then exposes them via CLI, TUI, local web UI, and MCP.
- **Key Features**: **Indexing and search core:** * Incremental `memex index`, `index rebuild`, `index gc [--dry-run --offline]`, `index embed`, `index stats`. Copy-on-write generations; searches keep reading the last co

