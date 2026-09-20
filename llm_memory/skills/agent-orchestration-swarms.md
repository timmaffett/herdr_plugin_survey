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

### [2026-07-29] SoMaCoSF/colloquy
- **Overview**: Colloquy is not a swarm orchestrator in the sense of `pi-herd`, `herdr-orchestrate`, or `shepherdr` surveyed previously in this category. It is a **causal-DAG audit and telemetry layer for sustained multi-agent sessions**.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `mint` — `node bin/mint.mjs --interactive`, contexts `workspace,pane`. Title: Mint Session (0x009). * `fork` — `node bin/fork.mjs`, context `pane`.

### [2026-08-06] jeffory/herdr-walkietalkie
- **Overview**: `jeffory/herdr-walkietalkie` (`jeffory.walkietalkie`, v0.5.1) is a **token-efficient cross-agent delegation tool** for Herdr, not a turnkey swarm orchestrator. The entire plugin is a single ~605-line POSIX-style `bash` script named `wt`.
- **Key Features**: **Session verbs** (require `HERDR_ENV=1` inside a Herdr pane):  * `wt delegate <tier|kind> "<task>" [--model m] [--name x] [--dispose] [--worktree]` — writes `tN.md`, spawns or reuses a worker, prompt

### [2026-08-06] zhenyufu/herdr-cadence
- **Overview**: `herdr-cadence` (`Cadence`, v0.7.0, Rust, ~7.6k LOC) is a **light Lead-plus-fleet orchestrator for Herdr**. Talk to a single conversational Lead tab and it spawns bounded, role-typed worker agents in Herdr tabs or isolated Git worktrees, then reviews, integrates, and cleans them up.
- **Key Features**: **User-facing actions (`herdr-plugin.toml`, all `contexts=["workspace"]` via `bin/herdr-cadence action <id>`):**  * `init` — writes canonical `.cadence.toml` from `src/config.rs::DEFAULT_CONFIG_TOML`;

### [2026-08-10] walcew/herdr-assist
- **Overview**: `herdr-assist` v0.11.0 is a **physical desk panel for Herdr, not a swarm orchestrator**. It pairs an ESP32-S3 3.5" touchscreen (plus a separate M5Stack Cardputer port) with a Python TCP bridge that runs as a Herdr plugin on each host you want to watch.
- **Key Features**: **Host bridge (`plugin/herdr_bridge.py`, stdlib-only, default `TCP 9375`):**  * Push model to panels, newline-delimited JSON: `agents`, `limits`, `cost`, `pane_content`, `avatar_repos`, `bridge_info`,

### [2026-08-10] anhnd3005-infinity/herdr-worker-orchestrator
- **Overview**: `herdr-worker-orchestrator` v0.5.0 is a **single-task dispatcher to visible CLI workers**, not an autonomous swarm. Claude Code acts as cognitive orchestrator, Herdr acts as terminal/process supervisor, and an external CLI agent (`agy`, `codex`, or any `herdr agent`-listed kind) executes in a persistent Herdr pane.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * 4 `contexts=["workspace"]` actions:   * `dispatch` → `python3 skills/dispatching-to-herdr-workers/scripts/dispatch-herdr-worker.py`   * `dispatch-b

### [2026-08-10] GranamyrBR/ezdras-herdr
- **Overview**: EZDRAS (`granamyr.ezdras-herdr`, v1.1.0) is a **live agent observability dashboard for Herdr**, not an orchestrator. One toggle opens a persistent right-split `ratatui` pane that answers “what is every agent working on” for the current tab: status badge, current task/title, tool-call activity, last response, model/context/limits HUD, and one-click jump-to-agent.
- **Key Features**: **Plugin surface — one pane + one action, no hooks:** * `panes.status`: `EZDRAS`, `placement="split"`, `command=["./target/release/ezdras-herdr"]`. * `actions.toggle`: `Toggle agent status pane`, `bas

### [2026-08-11] cyperx84/herdr-loop
- **Overview**: `herdr-loop` is a compiled Go supervisor that turns Herdr's single-agent pane primitives into declarative, event-driven multi-agent loops. The user writes a `loop.toml` — named `slots` (one seat per agent), `rules` (when/then over settled status + handoff files), and loop-wide policy (`max_iterations`, `on_blocked`, `handoff_dir`, `strict`) — and the binary spawns each slot as a real Herdr agent, feeds reconciled status transitions into a rule engine, and routes work via prompts and mechanical `run` gates until `finish`, budget exhaustion, pause, or stream close.
- **Key Features**: **Loop authoring (`loop.toml` via `internal/manifest`):** * `[loop] name, max_iterations, handoff_dir (.herdr-loop/handoff default), on_blocked (escalate|pause|auto), strict, allow_shared_cwd`. * `[[s

### [2026-08-11] tamdogood/herdr-orc
- **Overview**: `herdr-orc` (`Herdr ORC`, `0.1.0`, `min_herdr_version 0.8.0`) is a **profile-driven, visible-agent orchestrator for Herdr**. One plugin serves many custom orchestrators without code generation: a single interactive Pi coordinator runs in a Herdr tab with only ten `orc_*` tools, and delegates all repository work to independent, top-level Herdr agents in visible tabs.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * 3 `contexts=["workspace"]` actions, all `node`-run with no build step:   * `start` → `node src/start.mjs` — doctor-checks, then focuses existing co

### [2026-08-13] noviadi/herdr-layout
- **Overview**: `noviadi/herdr-layout` v0.2.1 is **not an agent orchestrator** despite its filing under Agent Orchestration & Swarms — it is a **pane-layout snapshot and replay utility** for Herdr, explicitly likened in the docs to `tmux-resurrect` beside `tmux`.
- **Key Features**: **Engine CLI (`herdr-layout`, bash, `set -euo pipefail`):**  * `save <name> [-f]` — capture current tab. Validates `^[a-z0-9][a-z0-9_-]*$`, reserves `review`, prompts on overwrite unless `-f`/`-y`. * 

### [2026-08-14] aemrebarut/herdr-dagr
- **Overview**: `aemrebarut/herdr-dagr` `0.3.1` (`min_herdr_version 0.8.0`, `linux/macos/windows`) is a **read-only live DAG viewer for an agent swarm**, not an orchestrator.
- **Key Features**: **CLI — single `dagr` binary (`src/main.rs`):**  * `dagr check <run.json> [--json] [--strict]` — lint against contract v3. Exit `0` clean, `1` findings, `2` usage/IO. Human or JSON (`Finding {level, c

### [2026-08-15] terry-li-hm/herdr-group-chat
- **Overview**: Herdr Group Chat is a **shared local room for full native AI coding agents managed by Herdr**. It does not run models in-process. It keeps one human-facing curses TUI in a Herdr tab and relays turns to independent, visible Herdr agents (`pi`, `claude`, `codex`, `grok` by default, or bounded `astra/fable/grok/opus/glm` profiles) via the `herdr agent ...` CLI.
- **Key Features**: **Ordinary chat:** * `parse_route(text, roster, default)` — `@pi,@grok msg`, `@all msg`, `@Pi` case-insensitive, plain message → sticky focus or lead. Rejects `unknown participant`, `invalid mention s

### [2026-08-16] marcvermeeren/chatter
- **Overview**: `marcvermeeren/chatter` (`chatter`, v0.19.0, `min_herdr_version 0.8.0`) is a **repo-scoped coordination layer for Herdr agents**, not a task-runner or hidden swarm supervisor. Each Git repository gets an isolated universe — shared group chat (`#chat`), direct messages, notes/questions, tasks, handoffs, and roster — backed by per-repo SQLite under the plugin state dir. Its explicit goal, per `README.md` and `bin/chatter.ts`, is cross-harness collaboration: `claude`, `codex`, `pi`, `opencode`, `cursor`, `gemini` and others working in different worktrees/tabs of the same repo can message, hand off, and share memory via `chatter` CLI + popup/tab views, while code itself still moves via normal Git branches/commits.
- **Key Features**: **Roster & identity:** `agents [--all]`, `whoami`, `iam <name>`, `role <agent> <display...>`, `forget <agent>`. Addressable identity is the Herdr handle `@name`; free-text pane label is display-only. 

### [2026-08-19] andthezhang/herdr-dynamic-workflow
- **Overview**: `herdr-dynamic-workflow` is a CLI + authoring-skill runtime for Claude Code's dynamic-workflow dialect (`agent()` / `parallel()` / `pipeline()` scripts), ported from `pi-dynamic-workflows v3.5.1` to drive **real coding-agent CLIs in Herdr panes** instead of in-process Pi subagents.
- **Key Features**: **Plugin surface (`herdr-plugin.toml`):** two `contexts=["global"]` actions, no panes, no hooks, no HTTP endpoints:  * `run` → `node dist/plugin/run.js` — run a workflow. Comment notes Herdr `0.8.x` a

### [2026-08-20] ythx-101/herdr-social-glass
- **Overview**: Herdr Social Glass is **not an agent orchestrator**, despite its filing under Agent Orchestration & Swarms. It is a macOS-only **workspace theming and launcher plugin** that ships two screenshot-friendly, full-file Herdr presets built on the built-in `catppuccin-latte` theme: `Social Glass` (translucent editorial workspace) and `Island Glass` (warm cream / soil-brown / leaf-green variant with card-like spacing).
- **Key Features**: Declared in `herdr-plugin.toml` (`min_herdr_version = "0.8.2"`, `platforms = ["macos"]`):  **Six actions (all `bash scripts/*.sh`, no contexts / hooks declared):**  * `apply` → `scripts/apply.sh`: val

### [2026-08-25] IvoryHeart/herdr-world
- **Overview**: `ivoryheart.herdr-world` (`Herdr World`, `0.1.1`, `min_herdr_version 0.8.2`, `linux/macos`) is a **browser and mobile client for monitoring and controlling Herdr**, not a swarm orchestrator despite its filing under Agent Orchestration & Swarms.
- **Key Features**: **Declared plugin surface (`herdr-plugin.toml`):**  * `[[build]]`: `bash scripts/herdr-world-plugin.sh build` * `[[startup]]`: `bash scripts/herdr-world-plugin.sh startup` — one-shot restore, not a da

### [2026-08-26] neospeed83/herdr-replay
- **Overview**: `herdr-replay` (`Herdr Replay`, v0.3.4, `min_herdr_version 0.8.0`) is a **passive session recorder and replay exporter**, not a swarm orchestrator. Despite its filing under Agent Orchestration & Swarms, it dispatches no workers, owns no planner/reviewer pipeline, and manages no worktrees — unlike `pi-herd`, `herdr-orchestrate`, `shepherdr`, `herdr-cadence`, `herdr-loop`, or `herdr-orc` in the ledger.
- **Key Features**: **What it records:**  * Agent lifecycle transitions derived from `herdr api snapshot` diffing by `pane_id`: `agent.discovered` (new pane), `agent.state` (when `agent_status` or `state_change_seq` chan

### [2026-08-28] chris-yyau/hermes-herdr-auto-reconcile
- **Overview**: `hermes-herdr-auto-reconcile` (Herdr id `chrisyyau.hermes-auto-reconcile`, v1.1.0 in `herdr-plugin.toml` / v1.3.0 in `plugin.yaml`) is **not a swarm orchestrator** in the sense of `pi-herd`, `herdr-orchestrate`, `shepherdr`, `herdr-cadence`, `herdr-loop`, or `herdr-orc` in the ledger. It is an **event-driven liveness companion for a Hermes gateway supervisor** that watches Herdr panes.
- **Key Features**: **Topology liveness:**  * Allowlist filtering: `load_manifest()` strips, dedupes, and validates `owned_panes` against `^w[0-9A-Za-z]+:p[0-9A-Za-z]+$`, dropping `bad\npane` etc. `enabled` requires both

### [2026-08-28] neospeed83/herdr-tournament
- **Overview**: Herdr Tournament `0.3.4` (`min_herdr_version 0.8.0`) is a **review-first, multi-agent adversarial review plugin**, not an implementation swarm. It reviews work that already exists — either the current branch / uncommitted changes from the focused Herdr pane, or a pasted `https://github.com/OWNER/REPO/pull/NUMBER` URL — by running two-or-more independent reviewers in isolated Git worktrees, forcing them to adversarially challenge each other, then having a separately-configured judge synthesize `Must fix / Minor / Nitpicks` findings. It never edits the user's checkout, never merges, and deletes all temporary Herdr workspaces, worktrees, and `herdr-tournament/*` branches on completion or failure.
- **Key Features**: **User-facing surface — 3 actions + 2 popup panes, no hooks, no HTTP endpoints:**  Declared in `herdr-plugin.toml`: * `open` (`workspace`, `bin/herdr-tournament open`) — opens the `tournament` popup v

### [2026-08-29] bon5co/bermuda
- **Overview**: Bermuda `3.0.0` (`bon5co.bermuda`, `min_herdr_version 0.7.0`, `linux/macos`, Go ~58k LOC, module `github.com/bon5co/bermuda/v3`) is an **agent harness, not an agent**: a scheduler, sequencer, and shared record that sits under whatever coding agent you run on Herdr.
- **Key Features**: **Jobs + scheduler:** * `bermuda job add/list/show/edit/remove/prune/pause/resume/run` — prompt-jobs (`--prompt`) or flow-jobs (`--flow <id> --input ...`), with `--cron`, `--interval`, `--model`, `--k

### [2026-08-30] zqkra/cbds
- **Overview**: `cbds` is a **reliable multi-agent orchestration plugin + CLI for Herdr** focused entirely on the receive side: getting an authoritative result back from a worker pane.
- **Key Features**: **Two verbs, enforced in docs/skill/preamble:**  * `say` / `spawn` — plain talk. No run/task/contract, text delivered verbatim via `herdr agent prompt`. * `dispatch start` + `wait` — structured, ID-au

### [2026-09-02] spad-0x/herdr-web-dashboard
- **Overview**: `herdr-web-dashboard` v1.0.0 (`Herdr Web Dashboard`, author Leonardo) is **not a swarm orchestrator** despite its filing under Agent Orchestration & Swarms. It is a **standalone remote-control web UI for Herdr** in the same family as `eyalev/herdr-web` and `IvoryHeart/herdr-world` in the ledger.
- **Key Features**: **Backend (`server.py` + `herdr_client.py` + `set_password.py`):**  * Zero-config HTTPS: `ensure_ssl_certificates()` shells to `openssl` to create `certs/ca.crt` + `ca_key.pem` + `cert.pem/key.pem` wi

### [2026-09-02] spad-0x/herdr-mobile-pro
- **Overview**: `spad-0x/herdr-mobile-pro` — declared in `herdr-plugin.toml` as `herdr-web-dashboard` v1.0.0 by Leonardo — is **not a swarm orchestrator** despite its filing under Agent Orchestration & Swarms. It is a **standalone mobile-first remote-control web UI for Herdr**, in the same family as `eyalev/herdr-web` and `IvoryHeart/herdr-world` already in the ledger, and appears to be a rename/continuation of the `spad-0x/herdr-web-dashboard` v1.0.0 surveyed on 2026-09-02.
- **Key Features**: **What the user can do from the browser:**  * **Watch and drive panes:** read-only xterm.js canvas fed by `pane.read`, plus `pane.send_text` with `auto_enter` and `pane.send_keys` for `enter/ctrl+c/es

### [2026-09-08] ArtMoreno/herdr-swarm
- **Overview**: `ArtMoreno/herdr-swarm` (`herdr-swarm` v0.1.0, `min_herdr_version 0.8.2`, `windows/linux/macos`, Rust ~3.6k LOC) is a **parallel race orchestrator for Herdr**. It fans the same prompt out to N coding agents (`claude,codex` by default), each in its own Herdr pane and — by default — its own Git worktree on a fresh `swarm/<name>` branch, shows a live scoreboard race, then lets the user take one winner's diff back into the root checkout as uncommitted changes via `git apply --3way`.
- **Key Features**: **User-facing CLI (`src/main.rs` via `clap` derive):**  * `start` — interactive `Prompt:` + `Agents [claude,codex]:` prompt, always `worktree:true`, `Direction::Auto`. If `.herdr-swarm/session.json` e

### [2026-09-11] javoscript/herdr-pickr
- **Overview**: Herdr Pickr `0.1.0` (`min_herdr_version 0.9.0`, `macos`/`linux`) is a **fuzzy navigation picker, not a swarm orchestrator**. Despite its filing under Agent Orchestration & Swarms, it dispatches no workers, owns no pipeline, and manages no worktrees — like `noviadi/herdr-layout` or `herdr-leap` in the ledger, versus `pi-herd` / `herdr-orchestrate` / `shepherdr` / `herdr-cadence` / `herdr-loop` / `herdr-orc` / `ArtMoreno/herdr-swarm`.
- **Key Features**: **Declared surface in `herdr-plugin.toml`:** 5 `contexts=["global"]` actions via `lua src/open.lua <action-id>` + 5 `placement="popup"` panes via `lua src/main.lua <kind> <scope>`. No hooks, no HTTP e

### [2026-09-11] Ejlonn/herdr-supervisor
- **Overview**: `ejlonn.herdr-supervisor` `0.3.0-beta.1` (`min_herdr_version 0.9.0`, `linux` only) is a **durable human-in-the-loop supervisor for existing Codex and Claude sessions**, not a fan-out swarm orchestrator. It preserves native Herdr agent conversations, routes turns between `codex-main` and `claude-main` via an explicit in-transcript protocol, enforces typed human gates, waits deterministically on quota, and exposes the whole run to an operator via CLI and an optional Telegram bridge.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** 4 `contexts=["workspace"]` actions, no panes, no hooks, no HTTP endpoints:  * `setup` → `sh install.sh` — stage user-scoped files * `status` → `herdr-

### [2026-09-11] ClockworkNet/herdr-claude-tmux-swarm
- **Overview**: This is not a swarm orchestrator in the sense of `pi-herd`, `herdr-orchestrate`, `shepherdr`, `herdr-cadence`, `herdr-loop`, or `herdr-orc` in the ledger. It does not spawn, prompt, or manage agents.
- **Key Features**: **Automatic watch loop (`bin/swarm_watcher.py:Runtime.loop/cycle`):**  * Polls `tmux_dir()` (`$TMUX_TMPDIR` or `/tmp` + `/tmux-<uid>`) every `interval_seconds` (default 2.0). * Liveness is a triple AN

