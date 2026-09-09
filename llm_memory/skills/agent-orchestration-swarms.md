# Architectural Memory: Agent Orchestration & Swarms

This document tracks architectural patterns and previously surveyed extensions within the **Agent Orchestration & Swarms** domain.

## Surveyed Extensions Ledger

### [2026-01-15] alvinunreal/oh-my-opencode-slim
- **Overview**: `oh-my-opencode-slim` v2.2.14 is an **agent orchestration plugin for OpenCode**. It provides a built-in team of specialized agents under a central Orchestrator that plans work, dispatches specialists as parallel background tasks, and reconciles results to balance quality, speed, and cost across mixed model providers.
- **Key Features**: What the surveyed `README.md` / docs index confirms:  **Seven core agents + one optional (`src/agents/*.ts`):** - `orchestrator.ts` — master delegator and strategic coordinator; owns scheduler rules, 

### [2026-06-12] m-mohamed/sheprd
- **Overview**: Sheprd `0.4.2` is a small, Rust-based **Herdr project router**, not an orchestrator. It discovers canonical Git checkouts from configured roots, resolves a human name or path to a `name-agent` workspace label, and either focuses the existing Herdr workspace or creates a new one with an optional sample layout.
- **Key Features**: **Own CLI (`src/cli.rs` + `src/main.rs`, via `clap` derive):**  * Global flags: `--agent <pi|claude|codex|opencode>`, `--json`, `--no-attach`. * `init [--print] [--force] [--root DIR...]` — print or w

