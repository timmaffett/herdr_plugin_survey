# Architectural Memory: Session & Workspace Management

This document tracks architectural patterns and previously surveyed extensions within the **Session & Workspace Management** domain.

## Surveyed Extensions Ledger

### [2026-03-17] EzraCerpac/jj-waltz
- **Overview**: `EzraCerpac/jj-waltz` is a Rust workspace manager for Jujutsu (`jj`), distributed as the `jw` CLI plus a bundled Herdr UI adapter (`herdr-jj-waltz`). The core project is ~14.5k LOC in Rust.
- **Key Features**: **Core `jw` CLI (`src/cli.rs`, `src/main.rs` -> `jj_waltz::cli::run`):**  * `jw add <name>... [--at REVSET] [-b/--bookmark NAME] [--no-bookmark] [--no-links]` — create one or more workspaces without s

### [2026-03-29] ChrisPachulski/session-sounds
- **Overview**: `ChrisPachulski/session-sounds` is a Rust Herdr plugin that gives each detected agent session a stable audible identity. Instead of Herdr's single shared background notification, parallel Claude, Codex, Amp, and OpenCode sessions each keep a distinct tone, and that tone is also reflected in Herdr's agent label as `agent · Sound Name` plus a `sound=Name` metadata token.
- **Key Features**: **Distinct per-session sounds:** - First seven concurrent assignments get different bundled WAVs from `sounds/themes/default/`: `bright_cascade`, `warm_bell`, `pulse_bounce`, `glass_chime`, `synth_sta

### [2026-06-01] j0urneyk/herdrctx
- **Overview**: `herdrctx` is a standalone, keyboard-driven terminal UI for managing local Herdr sessions — not an in-Herdr pane or action. Run from a terminal outside Herdr, it lists sessions with auto-refresh, lets the user search by name or directory, and attach, create, stop, and delete sessions from one screen, returning to the list on detach from Herdr.
- **Key Features**: **Session lifecycle via Herdr CLI:**  * **List:** `herdr session list --json` polled on a configurable interval (default `3s`, minimum `500ms`). Failures surface in the status line, not a modal. * **A

### [2026-06-11] lmilojevicc/seshagy
- **Overview**: `seshagy` (`lmilojevicc/seshagy`, v0.6.0) is an agent-aware terminal dashboard for jumping between project directories, multiplexer sessions, and terminal-based AI coding agents. It presents a single Bubble Tea TUI that merges `zoxide`/`fd` directory sources with live `tmux` sessions or `herdr` workspaces plus per-pane agent state (`working`/`blocked`/`done`/`idle`).
- **Key Features**: **Dashboard (TUI):** * List, attach/focus, create-from-directory, rename (`R`), kill (`x`), and preview sessions/workspaces. * Directory sources: `zoxide` frecency (`z`), `fd` discovery (`f`), `yazi` 

### [2026-06-16] andrewchng/herdr-sessionizer
- **Overview**: `andrewchng/herdr-sessionizer` (`sessionizer`, v0.8.1) is a Herdr Session & Workspace Management plugin inspired by ThePrimeagen's `tmux-sessionizer`. It provides fuzzy pickers — backed by `fzf` — to focus an existing Herdr workspace or bootstrap a new project or Git-worktree workspace with a declarative tab/pane layout.
- **Key Features**: **Two user flows, documented in `README.md`:**  * **Sessionizer (`sessionizer.open` → `sessionizer` pane):** workspace picker first. `Enter` focuses existing workspace; `Esc` falls back to projects un

### [2026-06-16] razajamil/herdr-plugin-workspace-manager
- **Overview**: **Workspace Manager** is a Session & Workspace Management plugin that turns every new git worktree into a fully-arranged Herdr workspace. The user declares tabs, panes, splits, sizes, environment, shell commands, and interactive agents once in `config.yml` and maps repos to a default layout; the plugin then builds that layout automatically on `worktree.created` / `workspace.created` / `workspace.focused`, and ships a companion `remove-gone` CLI to clean up worktrees whose upstream branch was deleted.
- **Key Features**: **Automatic layout application:** * Declarative `layouts[].tabs[].panes[]` with `title`, `command`, `persist` (default `true`), `env`, `split: vertical|horizontal|right|down`, `size` (cells `40` / per

### [2026-06-17] shizlie/herdr-setup-bootstrap
- **Overview**: `shizlie/herdr-setup-bootstrap` (`setup-bootstrap`, v0.1.2) is a minimal Shell-based Session & Workspace Management plugin that bootstraps newly created Herdr linked worktrees from a project-local `worktree_init.toml`. When a worktree workspace is created or focused, it runs a configured `setup` shell command inside the new checkout and copies gitignored locals (e.g. `.env*`, `.dev.vars`, `public/`) from the main repo root, then marks that checkout as done so it is only bootstrapped once.
- **Key Features**: The plugin provides no user-invoked commands, panes, or HTTP endpoints — it is purely event-driven:  * **Bootstrap on `workspace.created`:** catches worktrees created via Herdr CLI/API path. Declared 

### [2026-06-19] Matovidlo/herdr-pr-tracker
- **Overview**: `Matovidlo/herdr-pr-tracker` — packaged as `martinv.pr-tracker / Claude PR Tracker v0.1.0` — is a **GitHub PR status board for agent sessions**. It runs in its own Herdr tab and answers: “what PR did each running Claude session produce, is it green / mergeable / reviewed, and what should I do next?”
- **Key Features**: **PR discovery per session:**  * Enumerates sessions via `herdr agent list`. * For each `pane_id`, scrapes `herdr pane read <pane> --source recent --lines 4000` for the last `https://github.com/.../pu

### [2026-06-22] third774/herdr-last-workspace
- **Overview**: `third774/herdr-last-workspace` (`Last Workspace`, `v0.1.0`) is a minimal Rust Session & Workspace Management plugin that implements tmux-style `last-window` behavior for Herdr. It remembers the current and previously-focused workspace IDs and exposes a single user action — `third774.last-workspace.toggle` — that bounces focus back and forth between the two.
- **Key Features**: **One action, two hooks, no UI:**  * **Action `toggle` (`title: Last workspace`, `contexts: [global, workspace]`):** Defined in `herdr-plugin.toml` as `./target/release/herdr-last-workspace toggle`. A

### [2026-06-22] alon-z/herdr-command-palette
- **Overview**: `alon-z/herdr-command-palette` (`alonz.command-palette`, `v0.1.0`) is a JavaScript (Node `>=18`, ~504 LOC) Session & Workspace Management plugin that provides a fuzzy, keyboard-driven overlay for switching workspaces. It merges two sources — currently open Herdr workspaces and project directories discovered by scanning user-configured folders — into one list: selecting an already-open location focuses it, otherwise it creates and focuses a new workspace rooted at that directory.
- **Key Features**: **Single user flow: pick → focus or create.**  * **Action `open` (`Open command palette`, `contexts: ["workspace"]`):** thin launcher in `src/open.js`. No picker logic itself. * **Pane `palette` (`Com

### [2026-06-23] NathanFlurry/herdr-plugin-jj-workspace
- **Overview**: `NathanFlurry/herdr-plugin-jj-workspace` (`nathanflurry.jj-workspace`, `jj workspaces` v0.4.0) is a Rust Session & Workspace Management plugin for Jujutsu (`jj`) users. It creates a new `jj workspace` from a selected Herdr workspace and opens it as a new Herdr tab with Codex on the left and a setup terminal on the right, and removes that checkout on demand. Unlike the general `git-worktree` flow or the standalone `jw` CLI in `EzraCerpac/jj-waltz`, it is narrowly scoped to a Herdr tab-layout flow with a built-in worktree-style picker.
- **Key Features**: **Create flow (`open` + `wizard`):**  * `prefix+a` / `prefix+shift+a` invoke actions `new-tab` and `new` (both `jj-workspace open tab`). They capture caller context and open the `wizard` overlay pane.

### [2026-06-23] rjyo/herdr-window-title-sync
- **Overview**: `rjyo.window-title-sync` (`Window Title Sync`, `v0.1.0`) is a tiny, event-driven utility in the Session & Workspace Management domain — but unlike the workspace creators in the ledger (`jj-waltz`, `sessionizer`, `workspace-manager`, `jj-workspace`), it manages nothing. It mirrors Herdr state outward.
- **Key Features**: No panes, no HTTP endpoints, no interactive UI. One action + eleven event subscriptions, all invoking the same script:  **Action:** - `refresh` (`Refresh terminal title`, `contexts: [workspace, tab, p

### [2026-06-23] edmundmiller/herdr-plugin-dotfiles-dev-layout
- **Overview**: `dotfiles.dev-layout` (`Dotfiles Dev Layout`, `v0.1.0`) is a personal, opinionated Session & Workspace Management plugin that imposes the author's standard 4-tab development layout on a Herdr workspace. Implemented as a single ~200-line Python script (`dev_layout.py`) with no UI of its own, it orchestrates the Herdr CLI to open `pi` (agent), `hunk` (diff viewer), `nvim`, and `shell` tabs, either on-demand via action or automatically when a linked worktree is created.
- **Key Features**: **Bootstrap dev layout:** * Creates up to four focused tabs in sequence in the current workspace, all rooted at the resolved worktree checkout: `pi` (only if `pi` is on `PATH`, runs `pi`), `hunk` (alw

### [2026-06-25] persiyanov/herdr-fresh-worktree
- **Overview**: Fresh Worktree (`persiyanov.fresh-worktree`, v0.1.0) is a zero-UI, event-driven Session & Workspace Management plugin that corrects the base of newly created Herdr worktrees. When Herdr creates a worktree from a stale local base, the plugin moves its new branch to the live tip of `origin`'s default branch (`main`/`master`/whatever `origin HEAD` points at), so work always starts fresh.
- **Key Features**: No user-invoked actions, panes, pickers, or HTTP endpoints. One hook, one operation:  **Hook:** `worktree.created` → `["node", "index.mjs"]`  **Operation on success:** `git -C <worktree.path> fetch or

### [2026-06-26] CodyBontecou/herdr-telemetry-bridge
- **Overview**: **Herdr Telemetry Bridge** (`local.herdr-telemetry-bridge`, `v0.1.0`) is a local-first observability exporter for Herdr, not a workspace manager in the conventional sense. It listens to Herdr lifecycle hooks and/or runs as a persistent daemon pane, then streams normalized telemetry — focused-pane intervals, agent snapshots, repo/model metadata, and best-effort agent-trace summaries — to external clients via NDJSON file, HTTP webhook, or piped stdin to a command.
- **Key Features**: **User-invoked actions (all `contexts = ["workspace"]` in `herdr-plugin.toml`):**  * `snapshot` — `node bin/herdr-telemetry.js snapshot`: emits current agent + trace summaries once. * `init-config` — 

### [2026-06-27] fullerzz/herdr-plugin-sesh
- **Overview**: `fullerzz/herdr-plugin-sesh` (`fullerzz.sesh`, v0.11.0) is a Go (~16.4k LOC) Sesh-inspired smart workspace/session manager for Herdr. It merges live Herdr workspaces, Sesh-style TOML-defined sessions, and `zoxide` directory history into a single searchable native overlay picker.
- **Key Features**: **Picker — two implementations:**  * Native Bubble Tea overlay (`herdr-sesh picker`): searchable list with name-matches-before-path-only-matches, configurable home-directory prioritization (`picker.pr

### [2026-06-27] takemo101/wave-tui
- **Overview**: `wave-tui` is a terminal-first internet-radio player for work-session background music, not a workspace orchestrator. The core binary is a native Rust MP3/AAC player with a real FFT visualizer, curated catalog + Radio Browser search, and local persistence of station, volume, favorites, and theme.
- **Key Features**: **Radio player (primary):** * Native playback pipeline `reqwest -> Symphonia -> CPAL -> played-sample mirror -> RustFFT` (`src/audio/*`, `docs/audio-spike.md`). MP3/AAC-centered HTTP streams; no `ffpl

### [2026-06-28] devashish2203/herdr-worktrunk
- **Overview**: `devashish2203/herdr-worktrunk` (`Worktrunk`, `v0.1.0`) is a Shell-based Session & Workspace Management plugin that delegates git-worktree lifecycle to the external `wt` CLI from [worktrunk](https://github.com/max-sixty/worktrunk). It provides `fzf` pickers to switch/create, remove, and merge worktrees from inside Herdr, then presents the result either as a native Herdr linked-worktree workspace (default) or as a Herdr tab (legacy mode).
- **Key Features**: No daemons, HTTP endpoints, sockets, or event hooks. Six user-invoked workspace-scoped actions, each opening a dedicated transient pane:  * **Switch / create from default branch (`open` → `picker-defa

### [2026-06-29] wyattjoh/herdr-plugin-renamer
- **Overview**: `herdr-plugin-renamer` (`Herdr Renamer`, `v0.1.0`) is a Session & Workspace Management plugin that automatically names a Herdr pane from the coding agent's first prompt. When that pane lives in an auto-generated linked worktree (branch `worktree/*`), it also renames the local git branch to `<prefix>/<slug>` and the Herdr workspace to `<slug>`.
- **Key Features**: **Event hook — no user actions, panes, or HTTP endpoints:**  * Single subscription in `herdr-plugin.toml`: `pane.agent_status_changed -> target/release/herdr-plugin-renamer`. There is no manifest-leve

### [2026-06-29] sohanemon/herdr-helpr
- **Overview**: `herdr-helpr` (`herdr-helpr`, `0.1.0` in `herdr-plugin.toml` / `0.1.6` in `package.json`) is a **swiss-army-knife Session & Workspace Management plugin** for basic Herdr chrome management: create/rename/switch workspaces, create/rename/close tabs, close panes, zoom, and tmux-style floating scratch surfaces.
- **Key Features**: 10 tools are declared in the single source of truth `src/tools.ts` (mirrored in `README.md` and generated into `herdr-plugin.toml`):  **7 interactive overlay panes (`placement = "overlay"`, Ink TUI, `

### [2026-06-29] qdentity/herdr-worktree-lifecycle
- **Overview**: `qdentity/herdr-worktree-lifecycle` (`io.qdentity.worktree-lifecycle`, v0.1.1) is a small Rust Herdr plugin that dispatches worktree lifecycle to repo-owned shell wrappers. It does not implement setup itself: on `worktree.created` / `worktree.opened` it execs `<primary>/scripts/worktree-setup <branch> <worktree> <primary>`, and on `worktree.removed` it execs `scripts/worktree-teardown` with the same positional ABI. Around that it provides per-worktree serialization, private captured logs under `HERDR_PLUGIN_STATE_DIR`, status-marker files, pane custom-status and notification feedback, and a log-viewer action/pane.
- **Key Features**: **Lifecycle hooks — no daemons, HTTP endpoints, or pickers:**  * `worktree.created -> herdr-worktree-lifecycle setup` — setup path. * `worktree.opened -> herdr-worktree-lifecycle setup` — same binary,

### [2026-06-29] josephschmitt/pj-herdr
- **Overview**: `pj-herdr` is a thin Session & Workspace Management bridge between the external project-jumper CLI `pj` (nickel-org/pj) and Herdr workspaces. Pressing a user-bound key (`prefix+o` in docs) opens a floating picker listing `pj` projects; selecting one focuses an existing Herdr workspace for that path or creates a new one.
- **Key Features**: Single user flow: **pick → focus or create**, exposed as one action and one transient UI:  * **Action `pj.open-picker` (`Open project picker`, `contexts=["workspace"]`):** launcher that runs `herdr pl

### [2026-06-30] taxueseek/session-digger
- **Overview**: `Session Digger` (`taxueseek.session-digger`, v0.9.12 in `herdr-plugin.toml`) is a **portable, multi-agent session-mining and recall system**, not a workspace orchestrator. It turns raw agent transcripts — Claude Code, Grok, Kimi/Code, Codex, Cursor, ZCode, WorkBuddy, Trae, DIM/DimCode, Reasonix and others — into a searchable SQLite FTS5 knowledge asset for finding past decisions, errors, trends, and skill gaps.
- **Key Features**: **Herdr user-facing surface (from `herdr-plugin.toml`):**  8 `contexts=["workspace"]` actions: - `sd-search` → `bash scripts/herdr-search.sh` — keyword search or recent list via `sd-recall.py search/s

### [2026-06-30] asumaran/herdr-goto
- **Overview**: `herdr-goto` is a replacement for Herdr's native `goto` navigator. It is a small, single-binary Go TUI that presents a two-level tree — repo (main checkout) → linked worktrees (+ optional panes) — in a session-modal popup, with type-to-fuzzy-search and `Enter`-to-focus semantics.
- **Key Features**: **Plugin surface — one action, one pane, no hooks/endpoints:**  * `open` action (`Open goto switcher`, `contexts=["global"]`, `command=["scripts/open-pane.sh"]`). Because Herdr has no `plugin_pane` ke

### [2026-06-30] anrunt/herdr-pi-reloader
- **Overview**: `herdr-pi-reloader.pi-reloader` (`Herdr Pi Reloader`, `v0.1.2`) is a small Rust Session & Workspace Management utility for in-place maintenance of Pi coding-agent sessions. It does not create, move, or lay out workspaces — unlike the workspace creators in this ledger (`sessionizer`, `workspace-manager`, `jj-workspace`, `sesh`) — it preserves the existing tiled tab layout and either soft-reloads or fully restarts idle Pi agents from a session-modal popup.
- **Key Features**: **User surface — one action, one pane, no hooks/endpoints:**  * **Action `open` (`Open Pi Reloader`, `contexts=["workspace"]`):** `sh -lc exec "${HERDR_BIN_PATH:-herdr}" plugin pane open --plugin "${H

### [2026-07-01] tdi/herdr-worktree-setup
- **Overview**: `tdi.worktree-setup` (“Worktree Setup”) is a zero-UI, event-driven Session & Workspace Management plugin that makes newly created Herdr linked worktrees immediately usable. On `worktree.created` it runs a user-configured list of arbitrary shell steps inside the new checkout — e.g. `cp "$HERDR_MAIN_REPO"/.env*`, `mise trust`, `direnv allow`, `pnpm install` — so per-project bootstrap does not have to be repeated manually.
- **Key Features**: **Single hook, no user surface:**  * `herdr-plugin.toml` declares exactly one subscription: `worktree.created -> ["node", "src/setup.js"]`. There are no `[[actions]]`, `[[panes]]`, HTTP endpoints, soc

### [2026-07-01] ramarivera/herdr-palette
- **Overview**: `ramarivera.palette` (`Herdr Palette`, `v0.1.10`) is a Rust / Ratatui Session & Workspace Management plugin that provides a Raycast / Linear-style fuzzy command palette for Herdr.
- **Key Features**: **User surface — 2 actions, 2 panes, no hooks/endpoints:**  * `open` → `herdr plugin pane open --plugin ramarivera.palette --entrypoint overlay --placement overlay --focus` * `shell` → same with `--en

### [2026-07-02] wilbeibi/herdr-catchup
- **Overview**: `wilbeibi/herdr-catchup` (`wilbeibi.catchup`, `Catchup v0.4.0`) is a thin Herdr wrapper around the external `catchup` CLI for **cross-agent coding-session handoff**.
- **Key Features**: Five user-invoked actions, each with a 1:1 `[[panes]]` entrypoint. No event hooks, no HTTP endpoints, no background daemon:  * `wilbeibi.catchup.summary` — `catchup [--id <sid>] --since-compact`. Read

### [2026-07-02] agustinvalencia/herdr-jump
- **Overview**: `herdr-jump` (`agustinvalencia.herdr-jump`, `Herdr Jump v0.2.0`) is a Session & Workspace Management navigation plugin that provides **two separate overlay pickers** — one for **Spaces** (Herdr workspaces) and one for **Agents** (detected AI terminals) — as an alternative to Herdr's built-in combined session navigator.
- **Key Features**: **User surface: 2 actions + 2 panes, no hooks or endpoints.**  From `herdr-plugin.toml`:  * `agents` action (`Herdr Jump: Agents` → `./bin/herdr-jump agents`) — launcher with no terminal of its own. A

### [2026-07-02] Feasy01/herdr-allow
- **Overview**: `herdr-allow` (`Herdr Allow`, `v0.1.0`) is a minimal Shell-based Session & Workspace Management plugin that solves one narrow worktree-bootstrap problem: Herdr linked worktrees only contain tracked files, so `.env`, secrets, and local configs are left behind. The plugin reads a committed or gitignored `.herdr-allow` allowlist from the source checkout and copies every matching gitignored file into the new worktree, preserving relative paths, permissions, and symlinks.
- **Key Features**: **What the user gets:**  * **Automatic backfill on worktree lifecycle:** `herdr-plugin.toml` declares two `[[events]]` subscriptions, both `["bash", "copy-allowed.sh"]`:   * `worktree.created` — copy 

### [2026-07-02] arjenblokzijl/herdr-worktree-provisioner
- **Overview**: `arjenblokzijl/herdr-worktree-provisioner` (`Worktree Provisioner`, `v0.2.0`) is a minimal, zero-UI Shell plugin for **Session & Workspace Management** that makes a newly created Herdr linked worktree immediately usable. On creation it fires a per-repo setup command — `pnpm install`, `npm ci`, copy of `.env.local`, etc. — inside that worktree's own root pane.
- **Key Features**: No user-invoked actions, panes, pickers, or HTTP endpoints. The entire surface is two event subscriptions + one script:  **Hooks (`herdr-plugin.toml`):** - `worktree.created -> ["bash", "provision.sh"

### [2026-07-02] willfish/herdr-workspacex
- **Overview**: **Workspacex** (`willfish.herdr-workspacex`, `v0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a Rust-native fuzzy workspace switcher in the **Session & Workspace Management** domain. It implements the `tmux-sessionx` loop inside Herdr: open an overlay picker with `prefix+o`, focus an existing inactive workspace immediately, or type a new query and create a focused workspace at the directory resolved by `zoxide query <query>`.
- **Key Features**: **Single user-visible surface — one overlay pane, no hooks or endpoints:**  * `[[panes]] id="picker" / title="Workspacex" / placement="overlay"` invoking `sh -c exec "$HERDR_PLUGIN_ROOT/bin/herdr-work

### [2026-07-02] nicolasvasquez/herdr-smart-workspace
- **Overview**: `nicolasvasquez/herdr-smart-workspace` (`smart-workspace`, v0.1.0) is a minimal Session & Workspace Management plugin for switching Herdr workspaces with `fzf` and `zoxide`. It merges live Herdr workspaces and `zoxide` directory history into a single transient overlay picker: picking a workspace focuses it, picking a directory creates and focuses a new workspace there. A second, headless action implements tmux-style `last-window` behavior by bouncing back to the previously focused workspace.
- **Key Features**: **User-invoked actions (from `herdr-plugin.toml`):**  * `smart-workspace.switch` → `python3 -m smart_workspace.open_pane` — launcher that opens the picker overlay. Documented keybind `prefix+f`. * `sm

### [2026-07-02] mikevalstar/herdr-machine-title
- **Overview**: `mikevalstar/herdr-machine-title` (`mikevalstar.machine-title` / `Machine Title`, `v0.1.0`) is a minimal, stateless Session & Workspace Management utility that solves a fleet-identification problem: stock Herdr pins the outer terminal title to static `herdr`.
- **Key Features**: No UI, no panes, no HTTP endpoints, no picker or daemon. Entire surface is one idempotent script invoked two ways:  **Manual action:** - `refresh` (`Refresh machine title`, `contexts = ["workspace", "

### [2026-07-03] yuk1ty/herdr-spreader
- **Overview**: `herdr-spreader` is a Rust Session & Workspace Management plugin that applies tmuxinator/tmuxp-style declarative layouts from a single YAML file. One invocation creates one or more Herdr workspaces, each with its own tabs, split panes, working directories, environment, startup commands, and focus target, reproducing a full project setup without manual splitting and typing.
- **Key Features**: **Single user surface, no UI:**  * `herdr-plugin.toml` declares one action: `apply` (`Apply layout`, `contexts=["workspace"]`) → `./target/release/herdr-spreader apply`. No `[[panes]]`, `[[events]]`, 

### [2026-07-03] iviaxpow3r/herdr-session-parker
- **Overview**: **Herdr Session Parker** (`herdr-session-parker`, `v0.2.0`) is a Session & Workspace Management plugin for hibernating expensive agent panes. It treats a Herdr tab as a bookmark: `park` captures pane/tab/workspace context, `cwd`, `agent`, `agent_session.value`, and foreground processes into a durable JSON registry, leaves a lightweight shell marker pane behind, and closes the original pane(s); `resume` later re-executes a templated agent-resume command in place without requiring the user to remember session IDs.
- **Key Features**: **User surface: 5 headless actions, no panes, no event hooks, no HTTP endpoints.**  Declared in `herdr-plugin.toml` (all `python3 session_parker.py <subcommand>`):  * `park-current-pane` (`pane,tab,wo

### [2026-07-03] tdi/herdr-worktree-from-pr
- **Overview**: `tdi.worktree-from-pr` (`Worktree from PR`, v0.2.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Session & Workspace Management plugin that turns GitHub PR review into a one-keystroke flow: invoke the action from the current repo, pick an open PR from a fuzzy list, and Herdr creates (or re-opens) a git worktree on that PR's branch and focuses it as a workspace.
- **Key Features**: Manifest surface is minimal — one action, one pane, no event hooks, no HTTP endpoints:  * **Action `pick` (`Worktree from GitHub PR`, `contexts=[workspace,tab,pane]`):** `["node","bin/open.js"]`. Keyb

### [2026-07-03] jlimas/herdr-worktree-seed
- **Overview**: `herdr-worktree-seed` (`dev.limas.worktree-seed`, `v0.3.0`, `min_herdr_version 0.7.1`, `macos`/`linux`) is a zero-UI, event-driven Session & Workspace Management plugin. It solves the cold-start problem for Herdr linked worktrees — which contain only tracked files — by seeding each new checkout with the ignored local state needed to run immediately, and by ensuring the new branch is based on a fresh `origin` rather than a stale local base.
- **Key Features**: No `[[actions]]`, `[[panes]]`, or HTTP endpoints. Entire surface is two `[[events]]` in `herdr-plugin.toml`:  * `worktree.created -> ["bash", "seed-worktree.sh"]` — synchronous config copy + synchrono

### [2026-07-03] langtind/gren-herdr
- **Overview**: `gren-herdr` is a Shell-based Session & Workspace Management plugin that wires the external `gren` worktree manager into Herdr. Herdr already creates and multiplexes worktrees natively, but with no setup step; `gren` supplies lifecycle hooks, env-symlinking, dependency install, and per-worktree templating.
- **Key Features**: **User-invoked actions (from `herdr-plugin.toml`, both `contexts=["workspace"]`):**  * `gren.open` — "Worktree: switch / create (gren)": opens `picker` entrypoint as a session-modal `popup` (`--width 

### [2026-07-04] Tyru5/herdr-floax
- **Overview**: `herdr-floax` (v0.2.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Session & Workspace Management plugin that provides a per-workspace floating scratch shell in the style of `tmux-floax`. A single keybinding (`prefix+f` by default) toggles one instance per workspace through an open → reveal → dismiss cycle.
- **Key Features**: **Single user-visible flow, no daemons or servers:**  * **Action `herdr-floax.toggle` (`Toggle floating pane`):** `bash scripts/toggle-floating.sh`. Scoped to the current workspace, found by pane `lab

### [2026-07-04] hmu332233/herdr-symlink-worktree
- **Overview**: `hmu332233/herdr-symlink-worktree` (`dev.minung.symlink-worktree`, `Symlink Worktree v0.1.0`) is a minimal, zero-UI Session & Workspace Management plugin for Herdr.
- **Key Features**: No user-invoked surface. No `[[actions]]`, `[[panes]]`, HTTP endpoints, pickers, or daemons:  * **Single hook:** `worktree.created -> ["bash", "src/link.sh"]` declared in `herdr-plugin.toml`. * **Decl

### [2026-07-05] den-tanui/herdr-zoxide
- **Overview**: `den-tanui/herdr-zoxide` (`herdr-zoxide` / `Zoxide Navigator`, `v0.1.0`) is a minimal Shell-based Session & Workspace Management plugin that turns the `zoxide` frecency database into a Herdr launcher. It pipes `zoxide query -l` into `fzf` with a live directory preview and lets the user open the selection as a focused workspace, background workspace, tab, or split.
- **Key Features**: **Declared surface in `herdr-plugin.toml` — one action, one pane, no hooks, no HTTP endpoints:**  * `browse` (`Browse zoxide directories`, `contexts=["global"]`): `["bash", "open-picker.sh"]` * `picke

### [2026-07-05] bcihanc/herdr-claude-session-title
- **Overview**: `bcihanc.claude-session-title` (`Claude Session Title`, `v0.1.0`) is a narrow, event-bridging utility in the **Session & Workspace Management** domain. It mirrors the Claude Code session title — set via `/rename` or Claude's auto-generated summary — into Herdr's pane-metadata `title` field so it appears in the navigator/detail view.
- **Key Features**: **User-visible surface: three headless workspace actions, no panes, no Herdr event subscriptions, no HTTP endpoints.**  From `herdr-plugin.toml`:  * `install` — `sh scripts/install.sh` — copy hook int

### [2026-07-05] freethinkel/herdr-plugin-git-worktree-hooks
- **Overview**: `freethinkel.worktree-hooks` (`Worktree Hooks`, `v1.0.0`) is a zero-dependency Node ESM plugin for **Session & Workspace Management** that runs user-defined shell commands when a git worktree is created or removed.
- **Key Features**: **Create path — run `git_worktree_hooks.created` inside the new checkout:**  * Triggered by three subscriptions in `herdr-plugin.toml`, all `-> ["node", "bin/event.mjs"]`: `worktree.created`, `workspa

### [2026-07-05] ycros/herdr-compass
- **Overview**: `herdr-compass` (`Compass`, `v0.1.1`) is a zero-dependency Python plugin for **Session & Workspace Management** that provides unified Vim-style directional navigation across Herdr's hierarchy. Bound by the user to `prefix+h/j/k/l`, `left`/`right` move across panes then wrap to prev/next **tab**, while `up`/`down` move across panes then wrap to prev/next **workspace**.
- **Key Features**: **User surface: 4 headless actions, no panes, no hooks, no HTTP endpoints.**  Declared in `herdr-plugin.toml` (all `contexts=["pane","tab","workspace"]`, all `command=["python3","compass.py","<directi

### [2026-07-05] nicolegros/herdr-launcher
- **Overview**: `nicolegros/herdr-launcher` (`Herdr Launcher`, `v0.2.0`) is a Go, single-binary Herdr plugin for fast project navigation. It provides a fuzzy directory picker that either focuses an existing workspace with a matching label or creates a new focused workspace at the selected path, plus a separate most-recently-used workspace history switcher with next/previous and overlay-list navigation.
- **Key Features**: **Declared surface in `herdr-plugin.toml`:** 4 actions, 2 event subscriptions, 2 overlay panes. No HTTP endpoints, sockets, or background daemon.  * **Actions (all `command = ["./bin/herdr-launcher", 

### [2026-07-06] ntindle/herdr-resurrect
- **Overview**: `herdr-resurrect` snapshots the entire herd — workspaces, tabs, panes, `cwd`, layout rects, running foreground programs, and AI agents with session refs — to versioned JSON on disk, and brings it back after a crash, reboot, or `server stop`.
- **Key Features**: **Whole-herd snapshots (`lib/snapshot.js` + `bin/save.js`):** * `build()` merges `herdr api snapshot` (workspaces/tabs/panes/layouts/focus) with per-pane `pane process-info`, a bulk OS process-tree qu

### [2026-07-06] Newt6611/herdr-tab-title
- **Overview**: `herdr-tab-title` is a minimal, event-driven Session & Workspace Management utility that automatically prefixes every Herdr tab label with its 1-based position inside its parent workspace — e.g. `1. Codex`, `2. Terminal`, `3. Notes`. It is idempotent and self-cleaning: on every tab/workspace lifecycle change it strips its own prior prefix before re-rendering, so titles never nest (`[2] 2 Claude` → `[1] 1 Claude`) and user titles are otherwise preserved.
- **Key Features**: **What the user sees:** one headless action and automatic background maintenance. No panes, pickers, daemons, or HTTP endpoints.  * **Manual action `refresh` (`Refresh tab titles`, `contexts=["workspa

### [2026-07-07] kbrdn1/herdr-plugin-gwm
- **Overview**: `gwm worktrees` (`id: gwm`, `min_herdr_version: 0.7.4`, `macos`/`linux` only) is a glue-only Bash bridge that drives the external `gwm-cli` worktree manager from inside Herdr. It does not reimplement worktree logic: `gwm` remains the single source of truth for creation, removal, bootstrap, exec fan-out, and status, while Herdr only *reflects* results as workspaces/tabs.
- **Key Features**: Manifest declares **7 actions + 7 panes + 1 link handler + 1 event**:  **Actions (all `bash -c` launchers that resolve `cwd` from `$HERDR_PLUGIN_CONTEXT_JSON` and call `herdr plugin pane open`):**  * 

### [2026-07-07] usrivastava92/herdr-rovo-dev
- **Overview**: `herdr-rovo-dev` (`rovo-dev.detector`, v1.2.2) is a Shell-based Herdr detector plugin that makes Atlassian Rovo sessions visible in Herdr's agent dashboard. It detects panes running the new **Rovo CLI** (`rovo`) and legacy **Rovo Dev CLI** (`acli rovodev run` / `atlassian_cli_rovodev`) and reports them as the `rovo-dev` agent via `pane report-agent`, with `working / blocked / idle / unknown` state.
- **Key Features**: **User-invoked actions (all `contexts = ["global","workspace","pane"]` in `herdr-plugin.toml`):** - `scan` (`Scan Rovo panes`) → `./bin/scan-rovo-panes`: manual full rescan. - `install-hooks` (`(Re)in

### [2026-07-09] DIodide/herdr-telemetry
- **Overview**: `herdr-telemetry` (`Herdr Telemetry`, `v0.3.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a local-first observability exporter for Herdr, not a workspace manager. A singleton Go daemon watches Herdr lifecycle + agent state and streams a normalized, privacy-shaped event stream — workspaces/tabs/panes/worktrees, agent status transitions, derived work-runs, optional focus intervals and repo identity, model + token counters — as batched, gzipped NDJSON `POST`s to a user-controlled endpoint, with disk spooling when offline.
- **Key Features**: **User surface is CLI + headless actions, no panes:**  `herdr-plugin.toml` declares 6 actions, all `bin/herdr-telemetry <subcommand>`: - `start` → `ensure-daemon`, `status` → `status`, `flush` → `flus

### [2026-07-03] tdi/herdr-worktree-from-linear
- **Overview**: `tdi/herdr-worktree-from-linear` (`Worktree from Linear`, v0.5.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a zero-dependency Node.js ESM plugin in Session & Workspace Management. It turns Linear triage into a one-keystroke flow: invoke `pick` from any workspace/tab/pane, fuzzy-pick an active Linear issue, and Herdr creates — or re-opens — a git worktree on Linear's own `branchName` and focuses it as a workspace.
- **Key Features**: **User surface — 1 action, 2 panes, no events/endpoints:**  * `pick` (`Worktree from Linear issue`, `contexts=[workspace,tab,pane]` → `node bin/open.js`): launcher that resolves invoking-repo `cwd` an

