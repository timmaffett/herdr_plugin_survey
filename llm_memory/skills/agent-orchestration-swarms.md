# Architectural Memory: Agent Orchestration & Swarms

This document tracks architectural patterns and previously surveyed extensions within the **Agent Orchestration & Swarms** domain.

## Surveyed Extensions Ledger

### [2026-01-15] alvinunreal/oh-my-opencode-slim
- **Overview**: `oh-my-opencode-slim` v2.2.14 is an **agent orchestration plugin for OpenCode**. It provides a built-in team of specialized agents under a central Orchestrator that plans work, dispatches specialists as parallel background tasks, and reconciles results to balance quality, speed, and cost across mixed model providers.
- **Key Features**: What the surveyed `README.md` / docs index confirms:  **Seven core agents + one optional (`src/agents/*.ts`):** - `orchestrator.ts` — master delegator and strategic coordinator; owns scheduler rules, 

### [2026-06-12] m-mohamed/sheprd
- **Overview**: Sheprd `0.4.2` is a small, Rust-based **Herdr project router**, not an orchestrator. It discovers canonical Git checkouts from configured roots, resolves a human name or path to a `name-agent` workspace label, and either focuses the existing Herdr workspace or creates a new one with an optional sample layout.
- **Key Features**: **Own CLI (`src/cli.rs` + `src/main.rs`, via `clap` derive):**  * Global flags: `--agent <pi|claude|codex|opencode>`, `--json`, `--no-attach`. * `init [--print] [--force] [--root DIR...]` — print or w

### [2026-07-01] ribbons-digital/pi-herd
- **Overview**: `ribbons-digital/pi-herd` v0.1.0 is a **visible Pi session orchestrator for Herdr**. Instead of hiding workers inside one parent process, it creates a lead session plus visible `planner / implementer / reviewer / tester` panes in Herdr, isolates source-changing roles in git worktrees, and persists all run state and handoff artifacts under `.pi-herd/runs/{run_id}` in the target repository.
- **Key Features**: **Herdr manifest (`herdr-plugin.toml`):**  * 5 actions, all `contexts = ["workspace","tab","pane"]` via `node dist/herdr-plugin-action.js`: `doctor`, `start` (mapped to `start-help`), `status`, `colle

### [2026-07-10] darjss/herdr-orchestrate
- **Overview**: `darjss/herdr-orchestrate` v0.1.2 is a **Pi-native, visible orchestration plugin for Herdr**. It keeps the current user-facing Pi session as a strategic "god" agent and delegates research, implementation, review, and proof to visible Pi worker sessions running in isolated Git worktrees inside one persistent `<project>-orchestrate` Herdr workspace.
- **Key Features**: **User-facing concept:** scout → analyst → author → reviewer → proof pipeline with fan-out/fan-in gates, driven entirely from durable worker reports ending in `orch-verdict: done | blocked <reason>`. 

### [2026-07-10] afogel/shepherdr
- **Overview**: `shepherdr` (`afogel.shepherdr`, v0.1.0, Rust, ~2471 LOC) is a **visible subagent dispatcher for Herdr**. Instead of running delegated coding agents in-process and opaque, it shepherds them into Herdr terminal panes you can watch, audit, resume, and take over.
- **Key Features**: **Headless `dispatch` (primary, agent-initiated):** Called by overlays as `shepherdr dispatch --role implementer|reviewer --context-file <file> --from-pane <id> --task-id <id> --scratch <dir>`. Writes

### [2026-07-14] a2u/herdr-jira
- **Overview**: `a2u/herdr-jira` v0.3.2 is a Rust, keyboard-driven **Jira TUI that runs inside a Herdr pane**. It is not a swarm orchestrator in the sense of `pi-herd` / `herdr-orchestrate` / `shepherdr`; it is a task-source bridge: browse configurable JQL filters, search, expand epics inline, view details and apply status transitions, then hand an issue to an AI agent with one key.
- **Key Features**: **Issue browsing:**  * Named JQL `[[filters]]` with `{project}` expansion, switched via `f` picker or `1`-`9`. Defaults to `My open issues` (+ `Project {project}` if `default_project` set) when empty.

### [2026-07-16] Elio2000/herdr-peer-review
- **Overview**: `herdr-peer-review` (`herdr-peer-review`, v0.1.0) is a minimal two-agent collaboration plugin, not a full swarm orchestrator. Its job is to open a **second, watchable coding agent in a Herdr pane next to your own** — either as a one-shot reviewer of your uncommitted `git diff`, or as an interactive consult TUI parked at its composer.
- **Key Features**: **Two bindable plugin actions (no hooks, no HTTP endpoints):**  * `review-diff` (`scripts/review.sh`): Reviews the focused pane's uncommitted changes.   1. Resolves cwd via `peer_cwd`, verifies `git -

### [2026-07-17] maedana/herdr-agents-preview
- **Overview**: `maedana/herdr-agents-preview` (`maedana.agents-preview`, v0.1.0) is a **read-only multi-agent observability dashboard** for Herdr, not an orchestrator.
- **Key Features**: **Dashboard rendering:**  * Live preview of all agents discovered via `herdr agent list`, each tile showing the last 80 rows (`PREVIEW_LINES`) re-fetched every 50ms. * `MainVertical` tiling implemente

### [2026-07-18] RooseveltAdvisors/herdr-leap
- **Overview**: `herdr-leap` is a **terminal-navigation utility plugin for Herdr, not an agent orchestrator**. It provides two independent features in one Rust binary: a `schasse/tmux-jump`-inspired one-pick word-start jump that places the invoking pane's Herdr copy-mode cursor, and one-shot Vim/fzf-aware smart pane navigation in the style of `vim-tmux-navigator`.
- **Key Features**: **No hooks, no HTTP endpoints, no background daemons.** Five actions + one popup pane:  * `open` (`./scripts/open-leap`): opens full-size popup picker over the focused pane's unchanged `visible` buffe

### [2026-07-20] quaywin/agys
- **Overview**: `agys` is not a swarm orchestrator in the sense of `pi-herd`, `herdr-orchestrate`, or `shepherdr`. It is a **multi-profile sandbox switcher and live telemetry provider for the Google Antigravity ecosystem** (`agy` CLI, Antigravity IDE, Antigravity 2.0 GUI, Remote Control) with first-class Herdr visibility.
- **Key Features**: **Herdr plugin surface (`herdr-plugin.toml`):**  * **Popup pane `quota`:** `agys quota; read-to-close`, `85%` width, height `22`, `macos/linux` only. * **5 actions:**   * `quota` — `herdr plugin pane 

### [2026-07-21] Tetat-Chulchue/meadow
- **Overview**: Meadow (`meadow.file-explorer`, v0.1.0) is a **mouse-driven file-explorer pane for the Herdr terminal multiplexer**, not an agent orchestrator despite being filed under Agent Orchestration & Swarms.
- **Key Features**: What the code actually implements:  **Two pane layouts:** * `explorer` (normal): plain file tree. Click / arrows navigate and highlight; no action on click alone. * `sidebar`: same tree, but docks as 

### [2026-07-22] StructuPath/herdr-swarm
- **Overview**: `structupath.swarm` (`Swarm`, `0.3.0`, `min_herdr_version 0.7.4`, `macos/linux`) is a **worktree-per-agent fan-out and review-first harvest plugin for Herdr**.
- **Key Features**: **Five actions + three panes (`herdr-plugin.toml`):**  * `fanout` → `scripts/fanout.sh` → opens `fanout-pane` (`Swarm Fan-out`). Interactive flow lives in `scripts/fanout-pane.sh` because actions get 

### [2026-07-24] eyalev/herdr-web
- **Overview**: `herdr-web` is a **mobile-first remote-control web UI for Herdr**, not a swarm orchestrator. It is a thin Node bridge on `127.0.0.1:7930` that exposes Herdr's persistent PTY panes, semantic agent states, and local dev-servers to a phone browser as a PWA, so Claude Code (and other shell-launched agents) can be watched, prompted, and approved from off-desk.
- **Key Features**: **Terminal driving from phone:**  * Live pane view as native DOM rows (no xterm). Bridge polls `pane.read {source: visible, format: ansi}` at 300ms for the watched pane only; `pane.scroll_changed` pok

### [2026-07-24] StructuPath/herdr-conductor
- **Overview**: `structupath.conductor` `0.4.0` is an **attended, strict-contract coordination plugin for exactly Herdr `0.7.5`**, not an autonomous swarm orchestrator. It coordinates task-bound producer roles (`builder`) and exact-SHA gate roles (`reviewer`/`validator`) through immutable tasks, private report outboxes, deterministic Git integration with zero-or-one compare-and-swap, and — in Stage 3 — a single-ref fast-forward apply with explicit preview / approve / consume / publish.
- **Key Features**: **Seven attended actions + one passive pane (`herdr-plugin.toml`):**  * `assemble` — `scripts/assemble.sh` → publishes strict producer sources, immutable tasks, and empty private outboxes *before* cre

