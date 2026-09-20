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

### [2026-07-09] ismaelosuna7824/herdr-recent-workspaces
- **Overview**: **Recent Workspaces** (`ismaelosuna.recent-workspaces`, `v0.1.3`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Session & Workspace Management plugin that gives Herdr a missing primitive: **recent-folder memory**.
- **Key Features**: Declared surface in `herdr-plugin.toml`: **1 pane, 2 actions, 2 default keybindings, 0 events, 0 endpoints.**  * **Picker pane `picker` (`placement = "split"`, `command = ["./bin/recent-workspaces"]`)

### [2026-07-10] osamahbeig/herdr-pane-mover
- **Overview**: **Pane Mover** (`osamahbeig.pane-mover`, v0.2.0) is a Session & Workspace Management utility for rearranging layout, not for creating workspaces. It provides a single mouse-clickable overlay menu that operates on the currently focused pane: re-split it within its tab, swap it with a neighbor, or migrate it to another tab, another workspace, a new tab, or a new workspace.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **1 action + 1 pane, 0 events, 0 HTTP endpoints.**  * **Action `open` (`Move this pane…`, `contexts=["workspace"]`):** launcher `node open.js`. Inte

### [2026-07-10] kakigakki/herdr-auto-namer
- **Overview**: `kakigakki/herdr-auto-namer` (`auto-namer`, `v1.0.0`, `min_herdr_version 0.7.0`) is a zero-UI, event-driven Session & Workspace Management plugin that eliminates Herdr's wall of identical `claude` rows.
- **Key Features**: No user-invoked actions, panes, pickers, or HTTP endpoints. The entire surface is three event subscriptions in `herdr-plugin.toml`, all invoking the same handler:  * `pane.agent_status_changed -> ["ba

### [2026-07-10] haphamdev/herdr-simple-switcher
- **Overview**: `haphamdev/herdr-simple-switcher` (`simple-switcher`, v0.4.0) is a pure-Bash Session & Workspace Management plugin that provides four fuzzy-search popups for navigating a Herdr session: **Switch Workspace**, **Switch Tab**, **Switch Agent**, and **Open Project**. The first three are thin `herdr CLI → jq → fzf → herdr focus` loops with no state; Open Project discovers git checkouts under a user-configured root with `fd` and opens the selection in a new tab, creating the parent workspace if needed. It is deliberately minimal (~478 LOC Shell, no build step) and overlaps heavily with ledger peers like `alon-z/herdr-command-palette`, `willfish/herdr-workspacex`, `nicolasvasquez/herdr-smart-workspace`, and `nicolegros/herdr-launcher`, differentiated by splitting navigation into four single-purpose popups and by enforcing a strict `<workspace>/<project>` directory convention.
- **Key Features**: No daemons, HTTP endpoints, sockets, or background services. Declared surface is 4 actions + 4 panes + 1 startup hook:  * **Switch Workspace (`switch-workspace`):** Lists `herdr workspace list`, forma

### [2026-07-10] uuie/reasonix-herdr
- **Overview**: `reasonix-herdr` (`Reasonix for Herdr`, `v0.1.0`, `min_herdr_version 0.7.3`) is a bidirectional bridge between the external `reasonix` agent runtime and Herdr. From the Herdr side it is a launcher + status integration: two actions open `reasonix` in a split or new tab, and a `doctor` action verifies both registrations. From the Reasonix side it is a lifecycle reporter plus a bundled `herdr` skill that lets a Reasonix session running inside Herdr inspect and control workspaces, tabs, panes, and sibling agents.
- **Key Features**: **Herdr manifest surface (`herdr-plugin.toml`): 1 pane + 3 actions, no events, no HTTP endpoints.**  * Pane `reasonix` (`Reasonix`, `placement="split"`, `command=["reasonix"]`): the raw agent binary, 

### [2026-07-11] tanshio/herdr-worktreeinclude
- **Overview**: `herdr-worktreeinclude` (`tanshio.worktreeinclude`, `v0.1.0`) is a minimal, zero-UI Session & Workspace Management plugin that solves the cold-start problem for Herdr linked worktrees: a fresh `git worktree` contains only tracked files, so gitignored local state like `.env`, `.env.local`, or `config/secrets.json` is missing.
- **Key Features**: Declared surface in `herdr-plugin.toml` is a single event subscription, no `[[actions]]`, `[[panes]]`, or HTTP endpoints:  * **Hook:** `worktree.created -> ["bash", "copy-worktreeinclude.sh"]` * **Tri

### [2026-07-11] noctaIO/herdr-plugin-aos
- **Overview**: `noctaio.aos` is a minimal, Shell-only Session & Workspace Management launcher. Its sole job is to spawn a Claude Code agent booted inside an external Agentic OS (`agentic-os`) checkout, in a Herdr split pane, from any current workspace.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 pane + 1 action + 1 keybinding. No events, no HTTP endpoints, no pickers, no daemons.**  * **Action `noctaio.aos.launch` (`Launch AOS agent`, `contexts =

### [2026-07-12] jugyo/herdr-nav-history
- **Overview**: `jugyo/herdr-nav-history` (`jugyo.nav-history`, `v0.1.0`) is a Session & Workspace Management plugin that adds browser-style **Back / Forward** navigation over Herdr focus history. It records every `pane.focused` event to a per-session stack, then lets the user walk that stack with two headless actions. It is the multi-step generalization of the one-step toggle in `third774/herdr-last-workspace` and Herdr's built-in `last_pane`.
- **Key Features**: * **Passive history recording:** no UI. The `record` subcommand is invoked on every `pane.focused` event. Because tab and workspace switches always terminate in a pane focus, one subscription covers a

### [2026-07-13] iurysza/herdr-tab-smart-rename
- **Overview**: Smart Rename is a **Session & Workspace Management** plugin that keeps Herdr workspace, tab, and agent-pane labels aligned with the current task. A detached Bun worker watches lifecycle activity in the background and renames automatic targets, while manual CLI actions allow on-demand rename, reset, and AI-provider setup.
- **Key Features**: **What the user sees:**  * **Background automatic naming:** detached `worker.ts` evaluates tabs on Herdr events + 60s sweep. Known commands get deterministic labels without AI (`Run Tests`, `Dev Serve

### [2026-07-13] Phoobobo/herdr-workboard
- **Overview**: `phoobobo.workboard` (`Workboard`, `v0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a kanban workboard that lives **inside** Herdr rather than mirroring it. The mapping is literal and stated in `herdr-plugin.toml` and `README.md`: **Board = Workspace, Column / task-state = Tab, Task session = Pane, Board view = first tab**.
- **Key Features**: **Plugin manifest surface (`herdr-plugin.toml`): 4 actions + 1 pane, no `[[events]]`, no HTTP endpoints.**  * `init` — `bun run src/actions.ts init` (`global,workspace`): create or reuse a dedicated b

### [2026-07-13] tomasvarga/herdr-e2b
- **Overview**: `herdr-e2b` (v0.1.1, `min_herdr_version 0.7.0`, `macos`/`linux`) sends a Herdr git worktree to a fresh E2B cloud sandbox **on demand**. It performs a snapshot upload of the live tree — tracked files plus uncommitted edits and untracked files, honoring `.gitignore` — with no push, clone, or credentials.
- **Key Features**: **CLI — `bin/e2b-box` (symlinked to `~/.local/bin` by `install.sh`):**  * `open` (default, no args also works): ensure-live + attach shell. Includes optimistic fast-path, spinner, and on-close `[p]ull

### [2026-07-14] ImArtisann/zed-herdr
- **Overview**: `artisann.zed-herdr` / **Zed Workspace Sync** (`v0.1.0`, `min_herdr_version 0.7.3`, `macos`/`linux` only) keeps the active Herdr workspace available in Zed without taking ownership of either application.
- **Key Features**: **User-visible plugin surface (`herdr-plugin.toml`):**  * **Action `toggle` — `Toggle Zed Workspace Sync`, `contexts=["workspace"]`:** `bun ./dist/index.js toggle`. Pauses/resumes live synchronization

### [2026-07-14] ctbaum/herdr-deck
- **Overview**: herdr-deck is a Rust, terminal-UI workspace launcher that runs inside a Herdr pane and recreates the author's opinionated working "deck" around a selected project, worktree, directory, or saved agent conversation.
- **Key Features**: **Browse / search:** * Live Herdr workspaces sorted `blocked (0) < done (1) < other (2)`, then clustered by project basename in first-appearance order (`ext::workspaces()`). * Remote entries from `$HE

### [2026-07-15] salkhalil/herdr-sessionizer
- **Overview**: `salkhalil/herdr-sessionizer` (`sessionizer`, v0.5.0) is a Shell (`bash`, ~282 LOC) port of ThePrimeagen's `tmux-sessionizer` for Herdr. One keybind opens an `fzf` overlay over two sources — live Herdr workspaces and `zoxide` directory history — where selecting an open workspace focuses it and selecting a directory creates a new focused workspace with pre-configured template tabs.
- **Key Features**: No daemons, event hooks, HTTP endpoints, or sockets. Declared surface is **2 actions + 1 pane**:  * `sessionizer.pick` → `bash bin/open-picker` — opens workspace view. * `sessionizer.agents` → `bash b

### [2026-07-15] serhii-chernenko/herdr-worktreeinclude
- **Overview**: `serhii-chernenko.worktreeinclude` (`Project-local Worktrees`, `v0.2.2`, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a Session & Workspace Management plugin that fixes two Herdr worktree cold-start problems at once.
- **Key Features**: **What the user gets:**  * **Transparent relocation of native worktrees:** Use Herdr's normal **New worktree** UI. `scripts/on-worktree-created.sh` (on `worktree.created`) moves the just-created check

### [2026-07-15] LeonardoTrapani/herdr-js-worktree-bootstrap
- **Overview**: `LeonardoTrapani/herdr-js-worktree-bootstrap` (`leonardotrapani.js-worktree-bootstrap`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a zero-UI, event-driven Session & Workspace Management plugin that makes Herdr-created JavaScript/TypeScript linked worktrees immediately usable.
- **Key Features**: **Declared surface in `herdr-plugin.toml` — 2 actions + 1 event, no panes, no HTTP endpoints, no daemon:**  * `bootstrap` (`Bootstrap this JavaScript worktree`, `contexts=["workspace"]`): `["node", "s

### [2026-07-16] crafts69guy/herdr-switchboard
- **Overview**: Switchboard (`switchboard`, v3.0.0, `min_herdr_version 0.8.0`, `macos`/`linux`) is a multi-picker terminal control surface for Herdr, not a narrow workspace switcher. It provides searchable Projects (live agents + workspaces + `ghq` repos + linked worktrees), AI-agent launcher, shell-command recall, TCP-port inspector, Node-version manager, Git review menu, Usage quota dashboard, and Zen focus mode — all as modes of a single Rust TUI (`herdr-switchboard`) hosted in Herdr popup/overlay panes and launched from Bash shims.
- **Key Features**: **Manifest surface: 17 actions + 13 panes, no events/endpoints.**  Actions in `herdr-plugin.toml` (all `contexts=["global","pane"]`, all `["bash","bin/action.sh"]`): `menu`, `projects`, `agents`, `usa

### [2026-07-16] ImArtisann/herdr-workspace-launcher
- **Overview**: `ImArtisann/herdr-workspace-launcher` (`herdr-workspace-launcher` / `Workspace Launcher`, `v0.1.0`, `min_herdr_version 0.7.0`, `platforms=["macos"]`) is a narrow Session & Workspace Management launcher. It opens a searchable, directory-only filesystem picker in a session-modal popup and creates a new focused Herdr workspace at the chosen path.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 action + 1 pane, 0 events, 0 HTTP endpoints**:  * **Action `open-picker` (`Open workspace picker`, `contexts=["workspace"]`):** `["bun","run","index.ts"]

### [2026-07-17] beyondlex/herdr-recent-navigator
- **Overview**: **Herdr Recent Navigator** (`beyondlex.herdr-recent-navigator`, `v0.6.2`, `min_herdr_version 0.7.4`, `macos`/`linux`) is a Rust single-binary MRU switcher for Herdr. It opens as a `popup` (60% width) listing recently-focused **Workspaces, Tabs, Agents, and Panes** in most-recently-used order, with fuzzy search, keyboard navigation, and live agent-status indicators.
- **Key Features**: **Four-category picker UI (`src/mru.rs`, `src/ui.rs`):**  * **Workspaces tab:** grouped by `workspace_id`, shows workspace name + per-pane agent status dots (`●`/`○`/`·`), sorted by workspace-level MR

### [2026-07-17] timofey-TK/herdr-worktree-hooks
- **Overview**: `timofey-TK/herdr-worktree-hooks` (`worktree-hooks`, v0.2.0) is a zero-dependency Python plugin that fills Herdr's missing worktree hook system. Herdr natively creates/opens/removes linked checkouts but does no bootstrap; this plugin runs user-configured `bash -c` commands on `worktree.created`, `worktree.opened`, and `worktree.removed` — e.g. `cp {repo_root}/.env .env`, `uv sync`, `docker rm -f devdb-{branch_slug}` — routed per-repo via `config.toml`.
- **Key Features**: **Event hooks — no daemon, no HTTP endpoints:**  * `worktree.created -> ["python3", "wthooks.py", "event-created"]` — opens a visible split pane in the new workspace to run `created` commands with liv

### [2026-07-17] y-hirakaw/herdr-launcher-pane
- **Overview**: `y-hirakaw/herdr-launcher-pane` (`launcher-pane`, v0.5.0) is a **Session & Workspace Management** launcher, not a workspace creator. It provides a docked (or popup) curses pane that lists every live Herdr workspace nested under a user-configurable menu — by default `Open in Finder / Explorer / File Manager` plus `Open in VS Code (new window)` — so the user can click a workspace to run an external OS-level command against that workspace's directory without leaving Herdr or remembering paths.
- **Key Features**: **User surface: 1 pane + 1 action, no events, no HTTP endpoints:**  * **Pane `launcher` (`Launcher`, `placement="split"`, `command=["python3", "app.py"]`):** stdlib-`curses` TUI, ~767 LOC Python total

### [2026-07-17] shelken/herdr-plugins
- **Overview**: ` shelken/herdr-plugins` is a Herdr plugin monorepo that currently ships a single independent plugin: `shelken.auto-pi` (`Auto Pi`, v0.3.0) under `auto-pi/`. It is a narrow Session & Workspace Management utility for the `pi` coding agent (badlogic/pi-mono): it launches fresh `pi` sessions into the largest available idle shell pane, and it restores prior `pi` sessions for the focused pane's directory via a fuzzy picker.
- **Key Features**: **Declared surface in `auto-pi/herdr-plugin.toml` (2 actions + 1 pane, 0 events, 0 endpoints):**  * `enter-pi` (`Open pi in next free pane (by area)`) → `bash bin/open-pi-cascade.sh`. Scans the active

### [2026-07-18] mrcndz/herdr-routines
- **Overview**: `mrcndz/herdr-routines` (`Herdr Routines`, `v0.1.0`) is a cron scheduler for Herdr. The user declares `[[routine]]` blocks in `routines.toml`; a detached Python daemon wakes every 15s and fires due routines.
- **Key Features**: Three routine types, inferred unless stated explicitly:  * `pane` (default when `command` is present): resolve/create workspace + tab, then `herdr pane run <pane> <cmd>`. Fire-and-forget by design. * 

### [2026-07-18] shoaibkhanz/herdr-nav-plus
- **Overview**: `shoaibkhanz/herdr-nav-plus` (`herdr-nav-plus`, `Herdr Nav Plus v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a narrow Session & Workspace Management navigator. It provides direct `Ctrl+h/j/k/l` movement that falls through three layers in one chord: `Vim split -> Herdr pane -> workspace`.
- **Key Features**: No pickers, panes, daemons, or HTTP endpoints. The entire user surface is 8 headless `global`-context actions in `herdr-plugin.toml`, all `["node", "navigate.js", <dir>]`:  * `left / down / up / right

### [2026-07-19] Tomatio13/herdr-google-calendar
- **Overview**: `herdr-gog-calendar` is a Shell-based Google Calendar integration for Herdr, not a session/workspace orchestrator in the conventional sense. It provides a single `fzf`-driven TUI panel hosted in a Herdr `split` pane that browses the user's Google Calendar by month via the external `gogcli` (`gog`) binary, previews event details, opens Meet/Calendar links in the OS browser, and optionally bootstraps a Herdr workspace from an event title via `git worktree` + `herdr workspace create`.
- **Key Features**: **Declared surface: 1 pane + 1 action, 0 events, 0 HTTP endpoints:**  * Pane `gog-calendar` (`split`, `bash -c exec bash "$HERDR_PLUGIN_ROOT/scripts/panel.sh"`). * Action `open-gog-calendar` (`Open Go

### [2026-07-20] Tomatio13/herdr-google-gmail
- **Overview**: `Tomatio13/herdr-google-gmail` (`herdr-google-gmail` v0.1.0) is a Gmail integration for Herdr, not a session/workspace orchestrator. It provides an `fzf`-driven inbox browser hosted in a Herdr `split` pane plus a detached background poller that raises Herdr popup notifications for new unread mail.
- **Key Features**: **TUI inbox browser (`scripts/panel.sh`):** - Lists top 30 `label:INBOX` messages via `gog gmail messages search "label:INBOX" --max 30 --json --results-only`. - Renders TSV rows `[id, threadId, unrea

### [2026-07-20] aclima01/herdr-powershell-title-sync
- **Overview**: PowerShell Title Sync is a Windows-only, zero-runtime port of Joel (Moshi)'s `rjyo/herdr-window-title-sync`. It mirrors Herdr state outward: on every workspace / tab / pane focus, rename, or agent-status transition it recomputes a short human-readable string from the focused workspace, tab, and agent session and writes it to the outer terminal window/tab title.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 headless action + 11 event subscriptions, no panes, no HTTP endpoints, no sockets, no daemon:**  **Manual action:** - `refresh` (`Refresh terminal title`

### [2026-07-21] thomasschafer/herdr-kiosk
- **Overview**: `thomasschafer.herdr-kiosk` (`Kiosk`, `v0.1.0`, `min_herdr_version 0.7.4`) is a **Session & Workspace Management** picker in the same family as `command-palette`, `workspacex`, `smart-workspace`, and `herdr-launcher`, but scoped to **repos → branches → worktrees**.
- **Key Features**: **User surface (`herdr-plugin.toml`):**  * `open-picker` (`workspace,global`, `sh scripts/open-picker.sh` → `herdr plugin pane open --plugin thomasschafer.herdr-kiosk --entrypoint picker`) + `open-pic

### [2026-07-21] mroth/herdr-jj-status
- **Overview**: `mroth/herdr-jj-status` (`mroth.jj-status`, v0.1.1) is a stateless, Shell-based Session & Workspace Management augmentation — not a workspace orchestrator. It gives Jujutsu (`jj`) checkouts the equivalent of Herdr's built-in `branch` / `git_status` sidebar row by computing two custom metadata tokens, `$jj_bookmark` and `$jj_status`, and reporting them per-workspace for display in `ui.sidebar.spaces.rows`. For plain-git workspaces it is explicitly a no-op that clears its tokens.
- **Key Features**: **What the user sees:** a third sidebar row, e.g. `[["$jj_bookmark", "$jj_status"]]`, that is empty/collapsed for non-`jj` workspaces and populated for `jj` workspaces. Display grammar is defined in `

### [2026-07-21] abrose/herdr-numbered-workspaces
- **Overview**: `abrose/herdr-numbered-workspaces` (`numbered-workspaces`, `v0.3.0`) is a minimal Session & Workspace Management utility, not a workspace creator. It solves one display gap: `herdr workspace list` already reports each space's 1-based ordinal as `number`, but Herdr has no built-in sidebar row token for it.
- **Key Features**: **What the user sees:** a leading number in the spaces sidebar, e.g. `1 ● feat-...`, `2 ● dotfiles-chezmoi`, kept in sync as spaces are created, closed, or reordered.  **Declared surface in `herdr-plu

### [2026-07-22] dmnkf/herdr-omnisearch
- **Overview**: Herdr OmniSearch is a **fast, local, keyboard-driven search engine for live Herdr panes and archived agent conversations**. It is packaged as `herdr.omnisearch` (`min_herdr_version 0.7.5`, `linux`/`macos` only) and implemented primarily in Python (~9k LOC).
- **Key Features**: ### Live search * Index current snapshot: `herdr-omnisearch index --lines 350 [--include-empty] [--include-wrappers]`. * Headless search: `herdr-omnisearch search <terms> [--status] [--agent] [--all-s

### [2026-07-22] iQua/herdr-flakes
- **Overview**: **Flakes** (`id: flakes`, `v0.1.0`) is a thin launcher shim in the **Session & Workspace Management** domain. It does not implement workspace management itself; it starts, stops, and queries an external implementation already shipped by the Flakes CLI (`flakes herdr daemon` / `flakes herdr status`).
- **Key Features**: What the user actually gets is minimal and fully declared in `herdr-plugin.toml`:  **Three headless actions (all `contexts = ["workspace", "global"]`):** * `start` — `Flakes: start mirror` → `node shi

### [2026-07-23] douglascorrea/herdr-agent-inbox
- **Overview**: `herdr-agent-inbox` turns Herdr's Agents sidebar into an email-style inbox. A long-lived stdlib-Python daemon derives ChatGPT-like session titles from native agent transcripts, computes an attention rank (`blocked → unseen → working → idle → settled`), reports running-time and flag tokens, and asserts an `agent.view.set` sort so settled threads sink to the bottom.
- **Key Features**: **Inbox triage model:** * Rank tiers in `daemon.py:rank_for`: `0 blocked`, `1 done/unread`, `2 working`, `3 idle`, `4 unknown`, `5 settled`. Settling is explicit and sticky; transitions into `working/

### [2026-07-23] calebcauthon/herdr-theos-settler
- **Overview**: **Herdr Inbox** (`herdr-plugins.inbox`, `0.4.0`, from `calebcauthon/herdr-theos-settler`) turns Herdr's native **Agents** and **Spaces** lists into an active-work inbox.
- **Key Features**: **Four headless actions + one popup:**  * `toggle-agent` (`pane,workspace`): settle/restore the agent in the focused pane. Preserves underlying `agent` identity (`claude`, `codex`, etc.); if a tab hos

### [2026-07-24] ChmaraX/herdr-nvim
- **Overview**: `chmarax.herdr-nvim` (`herdr-nvim` v1.0.0, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a two-halved editor bridge, not a workspace orchestrator.
- **Key Features**: **Herdr manifest surface (`herdr-plugin.toml`):**  * 4 headless actions (all `sh -c exec bash herdr/run.sh ...`):   * `toggle` (`pane,workspace`): open/close sidebar in current tab.   * `pick-file` (`

### [2026-07-24] quan-meng/herdr-slurm
- **Overview**: `herdr-slurm` is a Linux-only, zero-dependency Python plugin that makes Herdr usable on Slurm login nodes. When the user opens an ordinary new Herdr tab inside a Space that already has an `srun --jobid=<id>` attachment in a sibling pane, the plugin replaces that new tab's login shell with an interactive `srun --jobid=<same-id>` re-attachment, optionally tagging the host-side `srun` process with `HERDR_AGENT=<name>` so Herdr's agent monitoring sees in-job activity.
- **Key Features**: **What the user sees:**  * **Automatic inheritance on new tab:** Create a tab with Herdr's native new-tab command starting from a tab running e.g. `srun --jobid=2875600 --pty --overlap zsh -l`. If exa

### [2026-07-24] speardragon/herdr-ask-inbox
- **Overview**: `Ask Inbox` is a Herdr plugin that collects pending Claude `AskUserQuestion` calls from every Herdr workspace into a single FIFO modal popup where they can be answered in place. When an agent invokes `AskUserQuestion`, a Claude `PreToolUse` hook enqueues the structured request and opens the popup itself; picking an answer returns it verbatim to only the originating agent via the hook-response protocol.
- **Key Features**: **What the user gets:**  * **Centralized question queue:** multiple stalled `AskUserQuestion` calls across workspaces land in one ordered queue. Header shows `Ask Inbox · 1/2`; answering immediately p

### [2026-07-24] khatriafaz/herdr-plugin-auto-rename
- **Overview**: **Auto Rename** (`afaz.auto-rename`, `v0.4.0`, `min_herdr_version 0.7.0`, `macos`/`linux` only) automatically renames a fresh Herdr linked-worktree workspace and its current Git branch from the coding agent's first prompt — e.g. `worktree-silver-river-3547` → workspace `Stripe webhook retries` + branch `feat/stripe-webhook-retries`.
- **Key Features**: **Automatic first-prompt rename (Pi):** - `pi.on("session_start")` seeds an `attempted` flag via `sessionAlreadyStarted()` — true if the session branch already contains a `herdr-auto-rename-attempt` c

### [2026-07-24] filoozom/herdr-title
- **Overview**: Herdr Title is a zero-UI, event-driven Session & Workspace Management utility that mirrors Herdr state outward into the outer terminal window/tab title via OSC 0. It always shows the selected location — worktree checkout basename if present, otherwise focused workspace `label` — suffixed with the Herdr server hostname, e.g. `feature-a (devbox.local)`.
- **Key Features**: **What the user sees:**  * **Base title:** `selected_location (+ hostname)`. `selected_location()` in `src/lib.rs` finds the `focused==true` workspace in `session.snapshot`, prefers `worktree.checkout

### [2026-07-24] iagogfe/herdr-ai-memory
- **Overview**: `herdr-ai-memory` is a zero-dependency Node.js launcher that starts coding agents **through** the external `ai-memory run` workstream manager instead of as bare panes. A Herdr action either resumes the current workstream (`ai-memory run` bare) or starts a harness-specific session (`ai-memory run <harness>`) in a new focused tab, so one logical conversation can move between Claude, Codex, OpenCode, Pi, Crush, Kimi, OMP, and Grok without re-explaining context. It belongs in **Memory (Session & Workspace Management)**, but unlike ledger peers that create/rename/snapshot workspaces (`sessionizer`, `workspace-manager`, `resurrect`, `auto-namer`), it creates no workspace abstraction of its own — it is a thin Herdr-to-`ai-memory` bridge enforcing `ai-memory`'s one-lease-per-workstream rule.
- **Key Features**: **What the user gets: 10 headless actions + 1 popup picker, no events, no HTTP endpoints, no daemon.**  Declared in `herdr-plugin.toml` (all `contexts = ["workspace","tab","pane"]`):  * `continue` → `

### [2026-07-25] HexSleeves/herdr-warp
- **Overview**: **HexSleeves/herdr-warp** (`hexsleeves.warp` / `Warp Native Agent View`, `v0.1.0`, `min_herdr_version 0.7.5`, `macos` only) is a ~402 LOC Shell plugin that mirrors a Herdr workspace outward. On demand it snapshots every live agent in the focused workspace and opens them as native panes in a single Warp tab, leaving Herdr as the owner of agent processes, persistence, and IPC while Warp owns visible layout and navigation.
- **Key Features**: Single user surface, no daemons, panes, or background sync:  * **Action `open-workspace` (`Open workspace in Warp`, `contexts=["workspace"]` → `bash scripts/open-workspace.sh`):** select a workspace i

### [2026-07-25] yuritada/numberer-manager
- **Overview**: `yuritada/numberer-manager` is a zero-UI, event-driven Session & Workspace Management utility that keeps Herdr's `prefix + 1..9` jump muscle-memory intact. On every tab or workspace lifecycle change it rewrites the underlying `name`/`label` to `"<position>: <cleaned-name>"` (e.g. `1: space`, `2: tab`), stripping any prior numeric prefix first.
- **Key Features**: **What the user sees:** no commands, no panes, no picker, no HTTP endpoints. Numbering is automatic and unconditional.  **Event hooks — all in `herdr-plugin.toml`, all `command = ["python3", "numberer

### [2026-07-25] pedrobarco/herdr-lastfocus
- **Overview**: **Last Focus** (`id: lastfocus`, `v0.1.0`) is a Go, stdlib-only Herdr plugin that adds tmux-style `last-active` toggles at three scopes: pane-within-tab, tab-within-workspace, and global workspace. A small background daemon subscribes to Herdr focus events and maintains per-scope `current / previous` history as JSON files, so three headless actions can bounce `A↔B` regardless of how focus changed — keybind, mouse, sidebar, or agent-initiated focus.
- **Key Features**: **User-visible surface — 3 headless actions, no panes, no HTTP endpoints, no picker UI:**  | Action ID (`herdr-plugin.toml`) | Binary invocation | Behaviour in `main.go` | |---|---|---| | `last-pane` 

### [2026-07-25] hadeson/herdr-harpoon
- **Overview**: `hadeson/herdr-harpoon` (`harpoon`, `v0.1.0`) is a Harpoon-style bookmark manager for Herdr **panes**, not workspaces. It lets the user pin the focused pane to slots `1-9` and jump back to it across tabs and workspaces with `prefix+1..9`, cycling, or a popup picker.
- **Key Features**: **What the user gets:** pin, jump, cycle, list, edit, diagnose.  Manifest surface in `herdr-plugin.toml` is **16 headless actions + 3 popup panes, no `[[events]]`, no HTTP endpoints**:  * `add` → `./h

### [2026-07-26] sanirudh17/herdr-agent-handoff
- **Overview**: **Agent Handoff** (`agent-handoff`, `v0.2.0`) transfers an in-progress task from the agent running in the focused Herdr pane to a fresh session of another installed agent, carrying the complete source session with it. The source pane is never closed, interrupted, modified, or sent input; if complete context cannot be retrieved the handoff refuses to start rather than degrading to a summary or truncated transcript.
- **Key Features**: **User-visible surface — 4 actions + 1 pane, no events, no HTTP endpoints:**  From `herdr-plugin.toml`: * `handoff` / `handoff-split` (`contexts=["pane"]` → `node bin/handoff-split.js`): open target i

### [2026-07-26] thuanlm215/advanced-herdr-file-viewer
- **Overview**: `advanced-herdr-file-viewer` is a **git-aware, read-only file viewer** that runs as a keyboard-driven TUI inside a Herdr split pane. It presents a directory tree on the left and a content pane on the right that automatically selects the right presentation — working-tree diff for changed files, rendered Markdown, or syntax-highlighted source.
- **Key Features**: **Core viewing:** * Two-column tree + content with independent scrolling, resizable split (`<`/`>` keys and divider drag), tree side configurable, zoom (`z` in-plugin zoom, `Z` host `pane zoom` full-s

### [2026-07-26] mikedclarke/herdr-shepherd
- **Overview**: Shepherd (`mikedclarke.herdr-shepherd`, `v0.8.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a scheduled-agent runner for Herdr. It runs coding agents on a schedule — inbox triage hourly, digest at 06:15, repo sync overnight — where each run opens as a real, visible Herdr workspace the user can watch, unblock, and review.
- **Key Features**: **Scheduling primitives (`action.go`, `schedule.go`, `wake.go`, `gate.go`):**  * `heartbeat.interval_minutes` + optional `[heartbeat.working_hours]` (`days 0=Sun..6=Sat`, `start_hour 0-23`, `end_hour 

### [2026-07-26] go-min/herdr-pane-name
- **Overview**: `herdr.pane-name` (`Pane Name`, `0.1.1` in `herdr-plugin.toml` / `0.1.0` in `Cargo.toml`, `min_herdr_version 0.8.0`) is a cross-platform Rust plugin that automatically derives Herdr **workspace, tab, and pane labels from the foreground process**.
- **Key Features**: **Automatic naming:**  * Panes: `sync_panes()` in `src/sync.rs` names each pane from its own `pane process-info` foreground process. * Tabs: `sync_tabs()` names each tab from the focused pane in that 

### [2026-07-27] danilolucasmd/herdr-clone-layout
- **Overview**: `herdr-clone-layout` (`Clone Layout`, v0.8.0, `min_herdr_version 0.7.0`) is a zero-configuration geometry cloner. Every new Herdr workspace or linked worktree inherits the tab labels/order and pane split directions/ratios of the workspace you were just in.
- **Key Features**: **Core clone:**  * Rebuilds tabs in display order with labels preserved, and replays splits with direction + ratio via `pane split --direction --ratio --no-focus`. * Reuses the target's root tab when 

### [2026-07-27] eightHundreds/herdr-worktreeinclude
- **Overview**: `eightHundreds/herdr-worktreeinclude` (`herdr-worktreeinclude` / `Worktree Include`, `v0.2.0`, `min_herdr_version 0.7.0`) is a zero-UI, event-driven Session & Workspace Management plugin that fixes the Git worktree cold-start problem. Fresh `git worktree` checkouts contain only tracked files; this plugin restores selected **gitignored** local state — `.env`, `.env.local`, `config/secrets.json` — from the source checkout into the new worktree according to a project-local `.worktreeinclude` file using Claude Code's `.worktreeinclude` convention.
- **Key Features**: **What the user gets:**  * **Automatic copy on `worktree.created`:** `herdr-plugin.toml` declares a single subscription: `worktree.created -> ["./bin/herdr-worktreeinclude", "on-worktree-created"]`. I

### [2026-07-28] aliou/herdr-cast
- **Overview**: `aliou/herdr-cast` (`id: ad.cast`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a personal, unpublished omnibus plugin for Herdr. It is not a single-purpose workspace switcher in the style of most Session & Workspace Management ledger peers; it bundles five concerns into one Rust binary plus a Pi agent extension: agent `blocked`/`done` desktop notifications with remote-forwarding, per-session terminal-window title ownership, Space sidebar metadata (`org`/`repos`/`host`/`hostkind`/`pad`), keyboard-first fuzzy pickers for workspaces and directories, and a small layout palette plus `lazygit`/`yazi` popups.
- **Key Features**: **Agent notifications (`src/notify.rs`, `notify` / `clear-notification` / `forward-notify` / `focus`):** - Triggers only on hard-coded `TRIGGER_STATUSES = ["blocked","done"]` from `pane.agent_status_c

### [2026-07-28] mejiasd3v/herdr-farm
- **Overview**: Herdr Farm (`dev.herdr-farm`, `v0.1.0`) is a visualization toy in the **Session & Workspace Management** domain. It renders live Herdr state as a 3D farm in an external browser: each **workspace becomes a fenced paddock** and each **pane becomes an animal** whose species encodes the detected agent and whose ground-ring color and animation encode `agent_status`.
- **Key Features**: **What the user sees (per `README.md` + `public/farm.js`):**  * **Paddock per workspace:** dirt square (`14x14` units, `7` unit gap), post-and-two-rail fence, and a canvas-sprite sign showing `${numbe

### [2026-07-28] disintegrator/trunkr
- **Overview**: `disintegrator/trunkr` (`disintegrator.trunkr`, `trunkr v0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a Session & Workspace Management plugin that delegates git-worktree lifecycle to the external Worktrunk `wt` CLI, then re-imports the result as a native Herdr workspace.
- **Key Features**: Declared surface in `herdr-plugin.toml`: **4 actions + 1 pane, no `[[events]]`, no HTTP endpoints.**  | Action | Command | Behavior in code | |---|---|---| | `create` — “Worktree: create” | `bin/trunk

### [2026-07-28] crexi/herdr-worktree-copy
- **Overview**: **Worktree Copy** (`crexi.worktree-copy`, `v0.2.0`) is a minimal, zero-UI, event-driven plugin in the **Session & Workspace Management** cold-start family. Its sole job is to seed each Herdr-created linked worktree with gitignored local state that `git worktree` does not carry over.
- **Key Features**: No user-invoked surface. No `[[actions]]`, `[[panes]]`, keybindings, HTTP endpoints, sockets, daemons, or pickers.  **Single capability: manifest-driven seed on creation.**  * **Hook:** `worktree.crea

### [2026-07-28] eabadim/herdr-context-namer
- **Overview**: `herdr-context-namer` — manifested as `Context Auto Namer` — is a zero-UI, event-driven Session & Workspace Management plugin that gives Herdr tabs and workspaces ChatGPT-style automatic titles.
- **Key Features**: **Automatic naming on agent settle:** * Subscribed in `herdr-plugin.toml` to `pane.agent_status_changed -> python3 scripts/auto_name.py`. `execute()` in `scripts/auto_name.py` ignores all statuses exc

### [2026-07-28] redsquiggle/herdr-browser
- **Overview**: `redsquiggle/herdr-browser` (`herdr browser`, `v0.5.0`, `min_herdr_version 0.7.2`, `platforms = ["macos"]`) links one Herdr session to one Chromium window and maps each Herdr workspace to a tab-group inside that window.
- **Key Features**: **Declared Herdr surface (`plugin/herdr-plugin.toml`):**  * 3 `[[actions]]`: `setup` → `../install.sh --skip-plugin-link`; `toggle-dashboard` → `herdr-browser action toggle-dashboard`; `open-link` → `

### [2026-07-29] bengemine/herdr-hibernate
- **Overview**: **Herdr Hibernate** (`bengemine.hibernate`, `v1.1.1`) is a Session & Workspace Management utility for reclaiming RAM from idle AI coding-agent panes. Instead of closing panes/tabs, it kills the idle agent's full process tree (500MB–2GB for Claude/Codex + MCP servers) and leaves a tiny `bash` stub in-place; pressing `Enter` resumes the exact session (`claude --resume`, `codex resume`, `grok --resume`) with full history.
- **Key Features**: No panes, no event subscriptions, no HTTP endpoints, no daemon socket. Surface is six declared actions in `herdr-plugin.toml` (all `./herdr-hibernate <subcommand>`) plus hidden operational subcommands

### [2026-07-29] m4salah/herdr-plugin-last
- **Overview**: `m4salah/herdr-plugin-last` (`m4salah.last`, `Last v0.2.0`) is a minimal Rust Session & Workspace Management plugin that adds tmux-style `last-window` / `switch-client -l` navigation to Herdr. It maintains a small most-recently-used history for tabs (per-workspace) and for workspaces (global to the session), then exposes two toggle actions to bounce back and forth.
- **Key Features**: **What the user gets: two toggles.**  * `last-tab` (`Last tab`, `contexts=["workspace"]`): jump to most recently visited tab *in the current workspace*. Press twice to return. * `last-workspace` (`Las

### [2026-07-29] victor-software-house/herdr-stash
- **Overview**: Stash (`vsh.stash`, `v0.0.1`) is a Session & Workspace Management plugin that provides the missing middle between Herdr's two native options: leave a workspace live forever, or close it and lose it. Stashing records a workspace's tabs, split-tree with ratios, per-pane `cwd` / labels, agent conversations, and adjacent plugin panes to `$HERDR_PLUGIN_STATE_DIR/stashes/<epoch>-<workspace_id>.json`, then closes the workspace to stop all processes and reclaim RAM. A two-column popup later restores that record into a new workspace by replaying splits, resuming agents, and reopening plugin panes.
- **Key Features**: **User verbs (from `README.md`, `src/main.rs`, `src/app.rs`):**  * **Stash:** `vsh.stash.stash` — record current `workspace_id` from `herdr_sdk::plugin_context()` then `workspace.close`. Refuses if an

### [2026-07-29] jmarcelomb/herdr-nav
- **Overview**: `jmarcelomb/herdr-nav` (`herdr-nav` / `Nav`, `0.1.0` in `herdr-plugin.toml` / `0.2.0` in `Cargo.toml`) is a stateless, keyboard-driven spatial navigation plugin for Herdr. It treats panes, tabs, and workspaces as a continuous left/right strip: moving past a pane edge slides into the adjacent tab entry-aligned, and moving past a tab edge slides into the adjacent workspace's entry tab.
- **Key Features**: No UI, daemon, picker, HTTP endpoint, or event subscription. The entire surface is six headless actions invoking one binary in three modes:  **Mode `nav <left|right>` (`nav-left`, `nav-right`):** - Qu

### [2026-07-29] untalfranfernandez/herdr-worktreeinclude
- **Overview**: **Worktree Include** (`id: worktreeinclude`, `v0.1.0`) is a zero-UI, event-driven Session & Workspace Management plugin that solves the git-worktree cold-start problem. A fresh `git worktree` contains only tracked files; this plugin copies gitignored local state — `.env*`, `settings.local.json`, local fixtures — from the primary checkout into every Herdr-created worktree at creation time.
- **Key Features**: No daemons, sockets, or HTTP endpoints. Declared surface in `herdr-plugin.toml` is **3 events + 2 actions + 1 pane**:  **Automatic copy on creation (`bin/event.mjs`):** * `worktree.created -> ["node",

### [2026-07-30] mackt/herdr-window-title
- **Overview**: `mackt/herdr-window-title` (`mackt.window-title`, `Window Title` v0.2.1, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a configurable outer-terminal title manager for Herdr. Instead of a static `herdr` or `herdr session attach ...` title, it renders a template-driven string like `herdr:personal`, `herdr:personal (devbox)`, `⠙ herdr:personal`, or `●2 herdr:personal` that reflects session name, focus context, SSH remoteness, and aggregate agent attention state.
- **Key Features**: **Title rendering:**  * Default template `{indicator}herdr:{session}[ ({host})]` — collapses to `herdr:personal` locally, `herdr:personal (devbox)` when the server was reached over SSH. * 7 tokens: `{

### [2026-07-30] zhangzujian/herdr-auto-session-title
- **Overview**: `zhangzujian/herdr-auto-session-title` (`zhangzujian.auto-session-title`, `0.1.0`, `min_herdr_version 0.7.0`) is a zero-UI, event-driven Session & Workspace Management utility. On `pane.agent_detected`, useful `pane.agent_status_changed`, and `pane.focused` it derives a ≤36-character title from the first usable user prompt in the active Codex or Claude Code session, writes it to Herdr pane metadata plus a `tab rename`, and — for Codex only — mirrors it to the native Codex thread via `thread/name/set`. It is strictly ownership-safe: it never overwrites a Herdr or Codex title that diverges from the last value it wrote.
- **Key Features**: **Declared surface — 1 action, 3 events, no panes, no HTTP endpoints:**  * Action `refresh` (`Refresh session title`, `contexts=["pane"]`): `node src/auto-title.mjs`. Forces regeneration for the pane 

### [2026-07-30] the-inconvenience-store/herdr-agent-session-title
- **Overview**: **Agent Session Title** is a title-mirroring bridge, not a workspace manager. Its sole job is to take the human-visible session title already maintained by an AI coding agent — `/rename` in Claude Code / Codex / OMP, `/title` in Hermes, or an auto-generated summary — normalize it to Herdr's `agent-name` grammar (lowercase, `32` chars), and apply it to the matching Herdr agent via `agent.rename` over `HERDR_SOCKET_PATH`.
- **Key Features**: **Manifest surface (`herdr-plugin.toml`):**  * `build = ["sh", "scripts/integrations.sh", "install"]` — auto-installs every detected agent on GitHub `herdr plugin install`. Explicitly does not run on 

### [2026-07-31] GavinTomlins/herdr-oh-my-agent
- **Overview**: `gavintomlins.herdr-oh-my-agent` (`Oh My Agent Subagent Panes`, `v0.2.0`) is a distribution wrapper around an **OpenCode plugin** that makes `oh-my-openagent` (`omo`) delegations visible in Herdr.
- **Key Features**: **Runtime mirroring (`packages/herdr-subagent-panes/index.ts`):**  * Detects subagents via OpenCode `event` hook: `session.created` (logged) and `session.updated` (silent fallback) where `properties.i

### [2026-07-31] iiii1224/herdr-statusline
- **Overview**: `herdr-statusline` (manifest `id: herdr-statusline`, `v0.1.2`, `min_herdr_version 0.7.5`, `platforms = ["linux"]`) does not manage workspaces, tabs, or agents like most Session & Workspace Management ledger peers. It provides chrome around Herdr: an `hsl` command that wraps *interactive* Herdr sessions in a disposable, status-line-only `tmux` server, while passing utility commands straight through to `herdr`.
- **Key Features**: **`hsl` launcher (`~/.local/bin/hsl`, generated):**  * Drop-in `herdr` replacement for interactive use: `hsl`, `hsl --session dev`, `hsl session list`, etc. * `hsl uninstall` — `herdr plugin uninstall

### [2026-07-31] joshuadavidthomas/hrd
- **Overview**: `hrd` (`id: hrd`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is not an in-Herdr pane or automation. It is a standalone Go terminal picker that runs **outside** Herdr and gathers **local Herdr sessions + Sprites sandboxes** into one herd.
- **Key Features**: **Local inventory:** * `herdr session list --json` via `internal/herdr/herdr.go:Client.ListSessions` with 5s deadline, bounded stdout (1 MiB) / stderr (4 KiB), sanitized `ListError{Missing,Timeout,Mal

### [2026-07-31] steig/worktender
- **Overview**: `steig/worktender` (`id: steig.worktender`, `v0.9.1`, `min_herdr_version 0.7.5`) is a **git-worktree fleet manager for Herdr**, not a picker or layout tool. Its thesis, stated in `README.md` and `herdr-plugin.toml`: making a directory is trivial; the round-trip — GitHub issue → branch-named worktree → Herdr workspace → briefed coding agent → completion detection → safe cleanup — is what is missing.
- **Key Features**: Single Go binary `bin/worktender` with 12 subcommands dispatched in `main.go:run()`:  * **`start <issue> --repo --base --json`** — Issue-number in, working agent out. Reads issue via `gh`, derives bra

### [2026-07-31] shadowfax92/herdr-scratch
- **Overview**: `shadowfax92/herdr-scratch` (`shadowfax.scratch` / `Herdr Scratch`, `v0.2.0`) is a **Session & Workspace Management** plugin that gives every Herdr pane its own persistent scratch popup.
- **Key Features**: No daemons, pickers, HTTP endpoints, sockets, or event subscriptions. Surface is **2 headless actions + 1 popup pane + 1 diagnostic subcommand**:  **Actions (`herdr-plugin.toml`, all `contexts=["pane"

### [2026-07-31] zerodice0/herdr-plugin-worktree-bootstrap
- **Overview**: `zerodice0.worktree-bootstrap` (`Worktree Bootstrap`, `v0.4.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a conservative, opt-in cold-start plugin for Herdr Git worktrees plus a post-removal janitor.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 7 actions, 2 events, 3 panes. No HTTP endpoints, sockets, or daemons.**  Actions (all `contexts=["workspace"]` except last):  * `bootstrap` → `python3 worktr

### [2026-07-31] cedrus-8864/herdr-sidebar-numbers
- **Overview**: **Sidebar Numbers** (`cedrus.sidebar-numbers`, `v0.4.0`) is a display-only augmentation in Session & Workspace Management, not a workspace creator. On every relevant lifecycle event it publishes each workspace's and each agent's 1-based sidebar position as a `num` metadata token — the same positions `switch_workspace` and `focus_agent` bind to `1..9` — so the user can render `$num` in `ui.sidebar.*.rows` and see which digit to press.
- **Key Features**: **What the user sees:**  * `$num` on workspaces: `String(w.number)` straight from `herdr api snapshot`, correct under any sort. * `$num` on agents: `String(i+1)` list position, but **only** when `agen

### [2026-07-31] asermax/herdr-suspend-workspace
- **Overview**: `asermax/herdr-suspend-workspace` (`Suspend Workspace`, `v0.2.0`) is a hibernate-style utility for Herdr workspaces. **Suspend** snapshots the current workspace — label, `cwd`, per-tab split trees from `layout.export`, and per-pane agent sessions from `pane.list` — to a JSON file under `HERDR_PLUGIN_STATE_DIR/suspended/`, then calls `workspace.close` so the workspace and its agents disappear from the sidebar. **Resume** re-creates a fresh workspace and replays the snapshot via `layout.apply`, re-launching agent panes with their resume `argv` and restoring focus and zoom state. It is the close cousin of `vsh.stash`, `herdr-resurrect`, `herdr-session-parker`, and `bengemine.hibernate` in this ledger, but distinguished by exclusive use of the `layout.export` / `layout.apply` primitives rather than manual split replay.
- **Key Features**: No daemons, event hooks, or HTTP endpoints. Declared surface is **2 headless actions + 1 popup pane**:  * `suspend` (`Suspend workspace`, `contexts=["workspace"]`, `["bun", "bin/suspend.ts"]`): snapsh

### [2026-08-01] 3mmdrew/herdr-layout
- **Overview**: `3mmdrew/herdr-layout` (`herdr-layout` / `Layouts`, `v0.1.0`) is a minimalist, declarative workspace builder for Herdr. You describe `tabs[].panes[]` plus startup `cmd`s once in a Lua file that returns a table, then bring the whole workspace up with one invocation — idempotently focused if it already exists.
- **Key Features**: **Two user flows:**  * **Direct apply:** `bin/herdr-layout [config.lua | name] [--name LABEL] [--force] [--list]`. No argument uses `.herdr-layout.lua` in the invoking workspace's directory. A path lo

### [2026-08-01] Anthodev/herdr-context
- **Overview**: `herdr-context` (`id: herdr-context`, `v0.19.5`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a **per-tab project context dock** for Herdr. It runs as a single narrow `split` Ratatui process docked to the right of the active terminal or coding agent, with two views: a **Files** browser colored by Git/Jujutsu status, and a **History** browser for LLM conversations tied to the current project.
- **Key Features**: **Declared surface in `herdr-plugin.toml` is minimal — 1 pane + 1 action, no events, no HTTP endpoints:**  * `panes.dock` — `title: herdr-context`, `placement: split`, `command: ["./target/release/her

### [2026-08-01] asumaran/gotopr
- **Overview**: `gotopr` (`asumaran.gotopr`, `v0.2.0`) is a Session & Workspace Management navigator popup for GitHub pull requests. It lists the user's open PRs where they are author or assignee, across all GitHub clones found directly under `~/Developer` (overridable via `GOTOPR_ROOT`), grouped by repo with fuzzy search and a markdown preview of the PR body.
- **Key Features**: **User surface: one action + one pane, no hooks, no endpoints.**  * `open` action (`Open PR switcher`, `contexts=["global"]`): `scripts/open-pane.sh` launcher. Intended binding `prefix+d` / `ctrl+alt+

### [2026-08-01] iskwyuki/herdr-control-panel
- **Overview**: `iskwyuki/herdr-control-panel` (`herdr-control-panel` v0.3.0) is a minimal, dependency-light launcher panel for Herdr. Press one bound key and an `fzf` menu offers `New workspace` from MRU history or any on-disk path, a live-derived `Keybindings` cheat-sheet, and user-appended `[[actions]]`, plus `Add action...` and `Language` maintenance entries.
- **Key Features**: No daemons, sockets, HTTP endpoints, or `[[events]]` subscriptions. Declared surface is **1 pane + 1 action**:  * `control-panel` pane (`placement="overlay"`, `bash scripts/panel.sh`) — the interactiv

### [2026-08-01] sergeybataev/herdr-codex-session-title
- **Overview**: `dev.bataev.herdr-codex-session-title` (`Codex Session Title`, `v0.0.5`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a narrow Session & Workspace Management bridge: it mirrors the current Codex chat name into the matching Herdr agent and pane display name.
- **Key Features**: **What the user gets:**  * **Automatic per-turn rename:** Codex `thread-id` → Herdr `agent.rename` (lowercase 32-char alias) + `pane.report_metadata` (readable ≤40-char `display_agent`/`title` with `s

### [2026-08-02] mikedclarke/herdr-workspaces
- **Overview**: `mikedclarke/herdr-workspaces` (`Workspaces`, `v0.3.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a directory-registry for Herdr. The user registers the places they work — repos, client folders, agent directories — as one TOML file per directory, then fuzzy-picks one from a single keybinding to get a focused, named Herdr workspace rooted at that path.
- **Key Features**: **Registry model:** each workspace is `~/.config/herdr/plugins/config/mikedclarke.herdr-workspaces/workspaces/<slug>.toml` with `name` (defaults to directory basename), `dir` (required, `~` and `$VAR`

### [2026-08-02] itayo-m/herdr-tab-session-name-sync
- **Overview**: This is a zero-dependency, event-driven naming utility for Herdr, not a workspace orchestrator. It watches Herdr agent-lifecycle events, extracts the human-readable session name that Copilot CLI (`<name> - GitHub Copilot`) and OpenCode (`OC | <name>`) publish as OSC terminal titles, and mirrors that name onto the Herdr tab label, per-pane label, and agent-sidebar `display_agent` row.
- **Key Features**: **What gets named:**  * **Tab label** — tracks the *focused* pane's session in that tab (follows focus). Configurable via `target: tab | workspace | both` to also rename the parent workspace. * **Pane

### [2026-08-03] mr04vv/herdr-pane-navigator
- **Overview**: **Pane Navigator** (`id: pane-navigator`, `v0.3.1`) is a Session & Workspace Management navigator that presents all Herdr workspaces, tabs, and panes as a single fuzzy-searchable tree inside an `overlay` pane. Its differentiator from Herdr's built-in navigator is that it leads with each pane's **terminal title** (with an override for `tokens.codex_title`) rather than `workspace -> tab -> agent`, so three `claude` panes become distinguishable by task.
- **Key Features**: **What the user gets is one picker with triage and in-place control:**  * **Unified tree list (`list`):** `workspace -> tab -> pane` rows built from `herdr workspace list`, `herdr tab list`, `herdr pa

### [2026-08-03] jattento/herdr-multirepo
- **Overview**: `herdr-multirepo` (`id: multirepo`, `v0.1.0`) solves a gap in Herdr's native model: Herdr maps **one Git worktree → one workspace**. This plugin maps **many worktrees → one workspace** for changes that span several repositories at once.
- **Key Features**: No daemons, no event hooks, no HTTP endpoints, no background polling. Two user flows, both interactive `fzf` pickers running in a session-modal popup (required because actions run without a TTY):  **`

### [2026-08-03] kenchan/herdr-ghq-open-agent
- **Overview**: `kenchan/herdr-ghq-open-agent` (`kenchan.ghq-open-agent` / `ghq Open Agent`, `v0.1.0`) is a Session & Workspace Management launcher for `ghq` users. It provides an incremental `fzf` search over `ghq list --full-path` and opens the selected repository in Herdr — reusing an existing workspace if one already covers that path, otherwise creating a new focused workspace — then auto-starts `claude` in the new pane. The entire plugin is ~282 LOC of Shell: one manifest plus `picker.sh`, with no build step, no config file, and no background daemon.
- **Key Features**: **Single user-visible surface — one popup picker, no actions/hooks/endpoints:**  * `picker` pane (`title: ghq`, `placement: popup`, `80% x 80%`, `command: ["bash", "picker.sh"]`): the only declared en

### [2026-08-03] zetlen/herdr-hud
- **Overview**: Herdr HUD (`id: hud`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a dismissable, keybound `popup` that answers “which box / session / load am I looking at?” at a glance. On open it takes a one-shot snapshot of eight facts — `host, fqdn, ip, session, uptime, connection, agents, load` — renders them as colored rows, appends optional user-script output, then blocks on `press any key to close`.
- **Key Features**: **User surface is one pane + one action:**  * Pane `popup` (`Herdr HUD`, `placement = popup`, `width = 56`, `height = 24`, `command = ["sh","-c",'exec "$HERDR_PLUGIN_ROOT/bin/hud"']`). Border supplies

### [2026-08-03] JLighter/herdr-spawn
- **Overview**: `JLighter/herdr-spawn` (`herdr-spawn` / `Spawn`, `v0.6.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Shell-only Session & Workspace Management plugin for launching coding agents with a task prompt. By default every launch creates an isolated git worktree + Herdr workspace on a conventional-commit branch (`<type>/<slug>`), starts the configured agent in the new root pane, and submits the prompt with `--wait`; `--here` is the explicit opt-out that splits the current workspace instead. A companion reaper (`spawn done`) inventories and deletes spawn-created worktrees + branches.
- **Key Features**: **Launcher popup (`launcher` pane, `ui.sh`):** * Two-field raw-mode editor: `prompt` line + `branch` line shown in the header. Branch auto-regenerates on every keystroke via `conventional_branch()` + 

### [2026-08-04] T0mSIlver/herdr-title-wrap
- **Overview**: `T0mSIlver/herdr-title-wrap` (`Title Wrap`, `v0.1.0`) is a zero-UI, event-driven Session & Workspace Management utility. It does not create or arrange workspaces; it makes long Claude Code session names readable in Herdr's Agents sidebar by republishing each Claude pane's `terminal_title_stripped` as word-wrapped pane-metadata tokens `title_l1..title_lN` that the user renders as multiple `["$title_lN"]` rows.
- **Key Features**: **Title wrapping and republishing:** * Watches live pane state and, for panes where `pane.agent == "claude"` or `pane.agent_session.agent == "claude"`, wraps `terminal_title_stripped` with Python `tex

### [2026-08-05] Tyru5/herdr-agent-state
- **Overview**: `herdr-agent-state` (`v1.1.0`, ~5750 LOC Rust) is a realtime, glanceable status dashboard for Herdr. One keybinding toggles a persistent right `split` pane in the current workspace that shows one card per agent pane — agent/model, status with time-in-status, terminal title, grouped tool-call activity, last assistant response, and token usage.
- **Key Features**: **Plugin surface is minimal by design:**  * `status` pane (`title: ⏱ state`, `placement: split`, `command: ./target/release/herdr-agent-state`) — the Ratatui app. * `toggle` action (`Toggle agent stat

### [2026-08-05] shadowfax92/herdr-ferry
- **Overview**: **Herdr Ferry** (`shadowfax.ferry`, `v0.2.0`, `min_herdr_version 0.8.0`, `platforms=["macos"]`) is a native Rust popup for deliberate, infrequent re-arrangement: **move live panes, move whole tabs with layout preserved, or merge one workspace into another**.
- **Key Features**: Manifest surface is minimal — **2 headless actions + 1 popup pane**, no `[[events]]`:  * `open` (`Open Ferry`, `contexts=["pane"]`): `./target/release/herdr-ferry open`. Reads `HERDR_PLUGIN_CONTEXT_JS

### [2026-08-05] gabrielbarretoo/herdr-medieval
- **Overview**: **Herdr Medieval** (`gabrielbarretoo.herdr-medieval`, `1.0.0`, `min_herdr_version 0.7.5`) is a visualization toy in Session & Workspace Management, not a workspace orchestrator. It renders the live Herdr session as a hexagonal medieval continent in an external browser via vendored three.js: each **workspace is a kingdom / fenced camp slot**, each **pane is an adventurer** (Knight/Barbarian/Mage/Rogue) whose `agent_status` drives where it walks and what animation routine it performs.
- **Key Features**: **Herdr manifest surface is minimal:** one `[[panes]]` entry, no `[[actions]]`, no `[[events]]`, no HTTP endpoints declared to Herdr:  ```toml [[panes]] id="camp" title="Herdr Medieval" placement="tab

### [2026-08-06] davidolrik/herdr-titles
- **Overview**: `davidolrik.titles` (`Herdr Titles`, `v0.15.0`, Go, ~10k LOC) is a dual-purpose titling plugin for Herdr. It composes the outer terminal window title from a user-configurable HCL template fed by Herdr state plus shell environment, and it automatically names tabs after what is actually running — foreground process, agent session title, or pane terminal title.
- **Key Features**: **Window title from HCL template:** Template variables are `session`, `workspace`, `tab`, `attention`, `counts.{idle,working,blocked,done,unknown}`, and `env` object. Functions are `file(path)` (tilde

### [2026-08-06] wraithyy/herdr-waypoint
- **Overview**: **`wraithyy/herdr-waypoint` (`waypoint`, v0.2.0)** is a minimal bookmark manager for Herdr in the Session & Workspace Management family. It saves frequently-used folders under a short name with one keypress — no prompt — then re-opens any saved entry as a new focused Herdr workspace from a fuzzy picker.
- **Key Features**: Declared surface in `herdr-plugin.toml`: **3 actions + 1 pane + 1 startup hook. No `[[events]]`, no HTTP endpoints, no daemon, no sockets.**  * **`waypoint.add` (`Waypoint: save current folder`, `cont

### [2026-08-07] DnzzL/herdr-automations
- **Overview**: `dnzzl.automations` (`Automations`, `v0.7.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a cron-scheduled trigger layer for Herdr agents. The user declares `automations:` in a single `automations.yaml`; every 30s a long-lived daemon compares wall-clock time against each cron expression and fires due occurrences by provisioning a Herdr workspace and starting an agent with a prompt.
- **Key Features**: **CLI (`main.go`):**  * `daemon` — scheduler, launched by `[[startup]]`. Not for interactive use. * `add` — interactive stdin wizard (`internal/wizard/wizard.go`): validates cron, previews next 3 runs

### [2026-08-07] lmilojevicc/herdr-last
- **Overview**: `herdr-last` (`id: herdr-last`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a Session & Workspace Management plugin that adds `tmux`-style `last-window` toggling to Herdr.
- **Key Features**: No panes, pickers, daemons managed by Herdr, or HTTP endpoints. Declared surface in `herdr-plugin.toml` is **2 actions + 2 events**:  * `herdr-last.toggle-workspace` (`Toggle Last Workspace` → `./bin/

### [2026-08-07] jatingargiitk/herdr-memory
- **Overview**: `herdr-memory` is a thin Shell wrapper that puts a per-folder long-term memory — the external `coding-brain` npm CLI — inside Herdr. It auto-distills what agents did when an agent pane settles, and provides on-demand recall via a search popup and a web-viewer split pane.
- **Key Features**: **Declared surface in `herdr-plugin.toml` (no HTTP endpoints, no daemon, no sockets):**  * **3 panes:**   * `brain-ui` (`Brain`, `placement=split`, `scripts/ui-pane.sh`) — runs `npx coding-brain ui` f

### [2026-08-07] btorresgil/herdr-hermes-session-title
- **Overview**: `btorresgil/herdr-hermes-session-title` (`hermes.session-title`, `v0.1.1`) is a narrow, read-only metadata bridge for the Hermes agent. It reads the human-visible session `title` from Hermes's local SQLite database (`~/.hermes/state.db` by default) and publishes it as Herdr's `$title` custom-metadata token via `pane report-metadata`, so the Herdr Agents sidebar can render `hermes = [["state_icon","workspace"],["$title"]]`. Until Hermes assigns a title — or when Herdr has not yet supplied a session ID — it publishes the fallback token `title=hermes`. It explicitly does not rename panes/tabs/workspaces, change terminal titles, or manage agent lifecycle.
- **Key Features**: **What the user sees:**  * Sidebar shows per-Hermes-pane session title once `ui.sidebar.agents.rows_by_agent` is configured per `README.md`; otherwise no visible UI. * Manual refresh: action `refresh`

### [2026-08-07] Gareth-Rouse/herdr-plugin-session-pruner
- **Overview**: **Session Pruner** (`garethrouse.session-pruner`, `v0.1.0`) is a Shell-based janitor for Herdr sessions. Herdr restores every workspace in `session.json` on start — each pane spawning a fresh shell and, with `session.resume_agents_on_restore`, a resumed agent — so a month of one-off workspaces comes back forever.
- **Key Features**: **Lifecycle tracking, no UI except one popup:**  * **Last-use ledger:** `touch` on `workspace.focused`, `workspace.created`, `pane.focused`; `sync` (adopt unknown as `now`, forget dead ids, prune dead

### [2026-08-08] htlin222/herdr-gamepad
- **Overview**: `herdr-gamepad` (`id: gamepad`, `v0.1.0`, `min_herdr_version 0.7.0`, `platforms = ["macos"]`) is a **human-input device bridge**, not a workspace orchestrator. It lets the user drive Herdr from the couch with any HID game controller: patrol AI agents, cycle tabs/workspaces, focus panes, fire the user's own Herdr keybindings, and synthesize keyboard/mouse-wheel input into the focused pane.
- **Key Features**: **Five user-invoked headless actions, no panes, no events, no HTTP endpoints:**  | Action (`herdr-plugin.toml`) | Command | Purpose per README | |---|---|---| | `gamepad.setup` | `bin/herdr-gamepad se

### [2026-08-08] ryanlewis/herdr-tab-renamer
- **Overview**: Tab Renamer is a narrow, event-driven Session & Workspace Management utility that keeps default-named Herdr tabs self-describing. Every invocation does a global, idempotent reconcile of all tabs: an agent tab becomes `<position> · <title>` — e.g. `1 · pr reviews`, falling back to `1 · claude` until a real session title exists — and a shell-only tab becomes `<position> ⌂ <~cwd>` — e.g. `1 ⌂ ~/dev/myapp`.
- **Key Features**: No panes, pickers, daemons, sockets, or HTTP endpoints. One script, six event triggers, one manual action:  **Event subscriptions (`herdr-plugin.toml`, all `-> ["node", "rename.mjs"]`):** - `pane.agen

### [2026-08-08] Angel-O/herdr-agent-resume
- **Overview**: `angel-o.agent-resume` (`Agent Resume`, `v0.1.1`, `min_herdr_version 0.7.5`) is a minimal, stateless Rust utility in **Memory (Session & Workspace Management)**. It solves one narrow resumption problem: after an agent CLI exits, it finds the newest resume command printed in the focused pane's retained scrollback and either inserts it at the shell prompt for review or copies it to the clipboard on explicit request. It supports four CLIs — OpenCode (`opencode -s ses_...`), Codex (`codex resume ...`), Claude Code (`claude --resume ...`), and Factory Droid (`droid --resume ...`) — and never executes the command automatically.
- **Key Features**: **User surface: 2 headless `pane`-context actions, same binary, no panes/hooks/endpoints:**  ```toml [[actions]] id="insert-resume" title="Insert agent resume command" [[actions]] id="copy-resume" tit

### [2026-08-08] tjg184/herdr-worktree
- **Overview**: `tjg184/herdr-worktree` (`Herdr Worktree`, `v1.1.2`, `min_herdr_version 0.7.0`) is an interactive Git-worktree picker and remover for Herdr. It does not bootstrap worktrees (no copy of `.env`, no `install`, no layout) — unlike the cold-start family in this ledger (`worktree-seed`, `worktreeinclude`, `worktree-setup`, `provisioner`) — it solves selection and lifecycle: fuzzy-filter existing branches/worktrees, guide creation of a new branch from `HEAD` or another base, open a `pr:`/`mr:`/URL reference, and safely remove the focused worktree.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 2 actions + 2 panes, no events, no HTTP endpoints.**  * `open` — `New worktree` (`contexts=[workspace,global]`, `./target/release/herdr-worktree open`): focu

### [2026-08-08] ryanlewis/herdr-workspace-renamer
- **Overview**: **`ryanlewis/herdr-workspace-renamer` (`io.rlew.workspace-renamer`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`)** is a narrow, event-driven Session & Workspace Management utility that syncs user-assigned agent session names onto Herdr workspace labels.
- **Key Features**: No panes, pickers, daemons, sockets, or HTTP endpoints. One script, three event triggers, one manual action:  **Triggers (`herdr-plugin.toml`):** * `pane.agent_detected -> ["node", "sync.mjs"]` — sess

### [2026-08-08] rstacruz/herdr-workspace-description
- **Overview**: `rstacruz/herdr-workspace-description` (v0.1.0) is a minimal Session & Workspace Management augmentation, not a workspace orchestrator. It adds a user-set, one-line *what* annotation under each Herdr space in the sidebar — e.g. `fix billing edge case` under `main` — via a single custom sidebar token `$description`.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 1 action + 1 pane + 1 startup hook. No `[[events]]`, no sockets, no HTTP.**  * **Action `edit` — `Edit workspace description` (`contexts = ["workspace","tab"

### [2026-08-09] Zamua/openloc.nvim
- **Overview**: `openloc.nvim` (Herdr adapter `openloc` v0.4.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) solves one routing problem: a clicked `src/main.rs:42` in a terminal pane should land on that line in the Neovim that already belongs to the current workspace, not in a new editor or a browser.
- **Key Features**: **CLI router (`nvim -l bin/openloc`, implemented in `lua/openloc/cli.lua`):**  * `open <path>[:line[:col]] [--ws ID] [--session PID] [--cwd PATH] [--line N] [--col N] [--addr SOCKET] [--choose auto|ne

### [2026-08-09] neilwashere/herdr-unrecoverable
- **Overview**: `herdr-unrecoverable` (`Herdr Unrecoverable`, `v0.1.1`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a watchdog for Pi coding-agent sessions that have settled on a terminal provider error. When a supported pane ends in `idle` or `done` and its durable transcript ends in an assistant message with `stopReason: "error"`, a detached worker publishes a live `⏳ retry in M:SS` countdown via display-only Herdr metadata, submits `continue` via `herdr agent prompt` after 10 minutes by default, and repeats up to three times before publishing `⚠ retry limit reached`. It never types into the terminal or transcript, never switches model/provider, and stays outside agent transcripts — activity is only in plugin state logs.
- **Key Features**: **Detection — four-gate check, transcript-authoritative:** Only fires when all hold: Herdr identifies pane as `pi`; status is in `eligibleStates = ["idle","done"]`; `agent_session.agent==="pi"`, `kind

### [2026-08-09] capt-marbles/herdr-jcode-integration
- **Overview**: `capt-marbles/herdr-jcode-integration` (`capt-marbles.jcode-integration`, `Jcode Integration`, `v0.1.0`) is a minimal installer shim, not a workspace manager or agent detector in its own right.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **3 headless `workspace`-context actions, no panes, no events, no HTTP endpoints, no daemon**:  * `capt-marbles.jcode-integration.install` — `Install Jcode l

### [2026-08-09] potatoQi/herdr-focused-codex-fork
- **Overview**: **Focused Codex Fork** (`qixing.focused-codex-fork`, `v0.1.2`) is a minimal, single-action Session & Workspace Management plugin that clones the Codex thread running in the currently focused Herdr pane into a new right-hand pane via `codex fork <THREAD_ID>`.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 action, 0 panes, 0 events, 0 HTTP endpoints**:  * `fork-right` — `Fork focused Codex to the right`, `contexts=["pane"]` → `["bash", "bin/fork-focused-cod

### [2026-08-10] dmangla3/herdr-fork-from-message
- **Overview**: **Fork from Message** (`dmangla3.fork-from-message`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a narrow Session & Workspace Management utility for branching live AI work. From a focused Codex or Claude Code pane it forks the exact session ID reported by Herdr's trusted agent integration into a new tab, split pane, or workspace, then auto-opens that agent's native earlier-message picker so the user can choose where to continue.
- **Key Features**: Three headless `contexts=["pane"]` actions in `herdr-plugin.toml`, all invoking `scripts/fork_from_message.py` with different `--destination`:  * `fork` — `Fork agent from message` → new tab (default 

### [2026-08-10] xheisenbugx/herdr-sesh
- **Overview**: `herdr-sesh` (`herdr.sesh`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Go port of `joshmedeski/sesh` for Herdr. It merges three sources — live Herdr workspaces, explicitly configured `[[session]]` entries in `sesh.toml`, and frecency history (zoxide by default) — into a single fuzzy picker with create-or-focus semantics: picking a live workspace focuses it, picking a directory creates and focuses a new workspace rooted there.
- **Key Features**: **Picker UI (`./bin/herdr-sesh ui` hosted in `picker` popup, `85% x 75%`):** - Powered by external `fzf`, not a built-in TUI. `pickerLines()` emits `base64(candidate)\tdisplayName\tpath` rows; `picker

### [2026-08-10] m1sk9/herdr-worktree-hooks-plugin
- **Overview**: `m1sk9.worktree-hooks` (`Worktree Hooks`, `v0.1.1`, `min_herdr_version 0.8.0`) is a zero-UI, event-driven cold-start plugin in **Session & Workspace Management**. Its sole job is to make a newly created Herdr linked git worktree immediately usable: copy gitignored local files (default `.env`, `.env.local`) from the main checkout into the new checkout, then run user-configured shell setup commands inside the new checkout.
- **Key Features**: **What the user gets:**  * **File seeding on creation:** `copy_files()` in `src/actions.rs` copies each configured entry from `repo_root` to `checkout_path`. Properties enforced in code and documented

### [2026-08-10] bleedingfight/herdr-agent-manager
- **Overview**: `herdr-agent-manager` (`local.agent-manager`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a **dual-picker Session & Workspace Management utility** for Herdr. It does not run a daemon, expose HTTP endpoints, or subscribe to Herdr events; it is two interactive `fzf` front-ends over the Herdr CLI.
- **Key Features**: ### Agent picker (`picker` action → `bin/agent-manager.py`)  * **List:** `herdr agent list` normalized by `normalize_agent()` (falls back to `terminal_id`/`pane_id` when `name` is omitted on newer Her

### [2026-08-10] Joxtacy/herdr-plugin-vault
- **Overview**: `vault` (v0.1.0, `min_herdr_version 0.8.0`, `macos`/`linux`) is a narrow Session & Workspace Management utility: browse past **Claude Code** sessions and resume one in Herdr. It turns the pile of transcripts in `~/.claude/projects/*.jsonl` into a searchable `fzf` popup showing age + project + first prompt, with a live conversation preview. Picking a row either focuses the already-running pane for that session ID or creates a new tab in the session's original `cwd` and launches `claude --resume <id>` there. It is ~263 LOC of Shell, Claude-specific by design, with no daemon, no events, and no HTTP surface.
- **Key Features**: **Picker (default entrypoint, no args):** - Streams newest-first rows into `fzf` with `vault> ` prompt, header `enter: resume in new tab / esc: cancel`. - Display format built in `row()`: `"<age:5><pr

### [2026-08-10] AsgardMuninn/herdr-plugin-orbstack
- **Overview**: **OrbStack VM Workspaces** (`asgardmuninn.orbstack`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos` only) opens OrbStack Linux VMs as Herdr workspaces. It is a zero-build, stdlib-only Python plugin (~200 LOC in `main.py` + manifest + README): on startup it mirrors the current `orb list` inventory into `orbstack:<vm>`-labeled workspaces, and on demand it focuses/creates a workspace whose root pane runs either `orb shell -m <vm>` or `ssh <vm>.orb.local`.
- **Key Features**: **Four headless `contexts=["workspace"]` actions + one popup pane, all `python3 main.py <verb>`:**  * `sync` — Idempotent reconcile: create a `--no-focus` workspace for every `orb`-reported VM missing

### [2026-08-10] skinp/herdr-cwd-control
- **Overview**: `skinp/herdr-cwd-control` (`CWD Control`, `v0.1.0`, `min_herdr_version 0.7.0`) is a minimal, stateless Session & Workspace Management shim. Herdr exposes a single global `new_cwd` that governs new panes, tabs, **and** workspaces alike; this plugin emulates the missing `new_tab_cwd` / `new_workspace_cwd` / `new_pane_cwd` split by letting each operation resolve its own policy independently.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **4 headless actions, 0 panes, 0 events, 0 HTTP endpoints**:  | Action ID | Title | Invokes | |---|---|---| | `new-tab` | `New tab (cwd policy)` | `python3 c

### [2026-08-11] wraithyy/herdr-openr
- **Overview**: `wraithyy/herdr-openr` (`openr`, `v0.3.0`) is a Shell (`bash` + `zsh`, ~331 LOC) navigation utility, not a workspace orchestrator. One keypress opens a fuzzy picker over file paths and URLs mentioned in the current pane: `prefix+o` scans the visible viewport of any pane, `prefix+shift+o` reads the full Claude Code session transcript.
- **Key Features**: **Four headless actions + one popup pane, no HTTP endpoints, no event subscriptions:**  * `openr.pick` → `bash bin/open.sh` (auto: Claude pane → transcript, otherwise viewport). Left unbound by defaul

### [2026-08-11] scoussens-nthplusio/herdr-worktree-include
- **Overview**: **Worktree Include** (`scoussens.worktree-include`, `v0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a zero-UI, event-driven cold-start fix for Herdr linked worktrees. A fresh `git worktree` contains only tracked files, so gitignored local state like `.env` stays behind; on `worktree.created` this plugin copies selected ignored files from the source checkout into the new checkout.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **one event + one pane, no `[[actions]]`, no HTTP endpoints, no daemon, no picker**.  * **Automatic seeding on creation:**   `worktree.created -> ["

### [2026-08-11] princejoogie/herdr-repo-picker
- **Overview**: `princejoogie.repo-picker` (`Repository Picker`, `v0.1.0`, `min_herdr_version 0.8.0`) is a Session & Workspace Management launcher for opening local Git checkouts as Herdr workspaces. It searches user-configured roots to a bounded depth for main clones, presents them in a searchable OpenTUI popup, and either focuses the existing workspace for that path or creates a new focused workspace. It is explicitly inspired by the author's `tms` tool but has no `tms` runtime dependency.
- **Key Features**: **Single user flow: filter → open-or-focus.**  * **Action `open` (`Open repository`, `contexts=["workspace"]`):** thin launcher `bun run src/open.ts` → `openPicker()`. Documented binding `prefix+p` as

### [2026-08-12] OliverGilan/herdr-jj
- **Overview**: `OliverGilan/herdr-jj` (`olivergilan.herdr-jj`, `Herdr JJ v0.1.0`) is a Rust, single-binary Herdr plugin that brings native Jujutsu (`jj`) workspace lifecycle to Herdr Spaces. It discovers the `jj` repo containing the focused workspace, creates new `jj workspace add` checkouts under a configured `workspace_root/<repo>/<slug>/` tree on `trunk()`, and mirrors each checkout as a normal Herdr workspace.
- **Key Features**: **What the user gets, per `herdr-plugin.toml` + `README.md`:**  * **3 popup workflows + 1 headless refresh:**   * `create` — `New JJ workspace` (`contexts=[workspace]`, popup `58x10`): generated `adje

### [2026-08-12] cyperx84/herdr-notes
- **Overview**: `herdr-notes` (`id: herdr-notes`, `Herdr Notes v0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a per-workspace Markdown scratchpad for Herdr. It presents one canonical page beside agents in a right-side `split` pane, backed by a plain directory of Markdown files on disk.
- **Key Features**: **What the user gets: one pane + two actions, no events, no HTTP endpoints.**  From `herdr-plugin.toml`:  * `[[panes]] notes` — `title: Notes`, `placement: split`, `direction: right`, `command: ["./bi

### [2026-08-12] sebcbi1/herdr-edge-nav
- **Overview**: **Herdr Edge Nav** (`herdr-edge-nav`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a stateless directional navigation and resizing plugin for Herdr. Pressing a bound chord moves focus one pane in that direction, and when the focused pane is already at the layout edge it crosses into the adjacent tab (for `left`/`right`) or adjacent workspace (for `up`/`down`), with optional wrap-around.
- **Key Features**: No daemons, panes, event subscriptions, sockets, or HTTP endpoints. The entire Herdr surface is **8 `global`-context headless actions** in `herdr-plugin.toml`, all without default keybindings — the us

### [2026-08-12] klukacin/herdr-hub-worktrees
- **Overview**: **`klukacin/herdr-hub-worktrees` (`klukacin.hub-worktrees` / Hub Worktrees, `v0.1.0`)** is a zero-UI, Shell-only Session & Workspace Management plugin for the `ws-project-hub` layout: a hub repo that tracks docs/tooling while git-ignoring sibling primary clones (e.g. `talkyto-project/` + `talkyto-firebase-backend/`, `talkyto-business-backend/`, ...).
- **Key Features**: No panes, pickers, daemons, sockets, or HTTP endpoints. Surface is **3 event subscriptions + 4 workspace actions**, all thin shims over `mirror.sh`:  **Automatic (from `herdr-plugin.toml` `[[events]]`

### [2026-08-13] tmn73/herdr-claude-tab-title
- **Overview**: `claude-tab-title` (`Claude Tab Title`, `v0.3.0`) is a Session & Workspace Management titling utility. It mirrors each Claude Code session's self-maintained `ai-title` — read locally from `~/.claude/projects/*/​*.jsonl` — onto its Herdr tab label, prefixed with a glyph for Herdr's `agent_status` (`working`/`blocked`/`done`/`idle`).
- **Key Features**: **What the user sees:**  * Automatic tab naming: `✅ Fix the booking total`, `🟡 <title>`, `🔴 <title>`, `⚪ <title>` in the default `color` palette, or `✓ / ◐ / × / ○` in the `symbols` palette that mir

### [2026-08-13] bfreed/herdr-corral
- **Overview**: **Corral** (`id: corral`, `v1.0.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a Session & Workspace Management plugin for Git-worktree fleet workflow. It replaces a `workmux`-style tmux workflow for Herdr users who run one coding agent per checkout.
- **Key Features**: No HTTP endpoints, sockets, or daemons. All interaction is CLI + 3 Herdr actions + 2 popup panes + 3 event hooks.  **Manifest surface (`herdr-plugin.toml`):**  * Events (all `python3 hwt.py event`): `

### [2026-08-13] pjs-0457/herdr-yazi-explorer
- **Overview**: `pjs-0457/herdr-yazi-explorer` (`bjs.yazi-explorer` / Yazi Explorer, `v0.1.0`) is a thin, Shell-only chrome plugin in Session & Workspace Management. It does not implement file management itself — it opens the external `yazi` terminal file manager inside a Herdr pane, rooted at the folder the user invoked it from, labeled `🗂  yazi`.
- **Key Features**: Declared surface is minimal: **1 pane + 2 actions, no events, no HTTP endpoints, no daemon, no picker logic of its own.**  * **Pane `explorer` (`🗂  yazi`, `placement = "tab"`):** `bash -c 'f="${TMPDI

### [2026-08-13] hasuwini77/herdr-follow-cwd
- **Overview**: `hasuwini77/herdr-follow-cwd` (`hasuwini77.follow-cwd`, `Follow CWD`, `v0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a zero-UI, event-driven Session & Workspace Management utility. Herdr names a workspace once from the source pane's `cwd` at creation time; if an agent later scaffolds a project and `cd`s elsewhere, the sidebar is left showing `dev`, `dev`, `dev`. This plugin closes that gap with a short, one-shot reconcile that renames workspace labels to follow where their root pane actually lives.
- **Key Features**: **Core function: stale-label repair.** On each invocation `follow-cwd.js` lists all workspaces and panes, picks an anchor pane per workspace, derives a `desiredName(cwd)`, and calls `herdr workspace r

### [2026-08-13] connerohnesorge/herdr-vaultr
- **Overview**: `conner.vaultr` (`vaultr sessions`, `v0.1.0`) is the official Herdr adapter for the external `vaultr` CLI — captured agent-session storage for Claude Code, Codex, and Pi. It solves one routing problem: Herdr already tracks which agent session ID is running in each pane, so the plugin resolves the focused pane's exact vault session ID from that metadata and targets every operation at “the session you’re looking at” with no manual ID lookup.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **4 `contexts=["pane"]` actions, 0 `[[panes]]`, 0 `[[events]]`, 0 HTTP endpoints, 0 startup hooks.**  | Action ID | Script | What it does | |---|---

### [2026-08-14] revanp/herdr-discord-presence
- **Overview**: `herdr-discord-presence` (`Discord Presence`, `v0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is an outward-mirroring utility, not a workspace orchestrator. A small detached Node daemon polls `herdr api snapshot` every few seconds and mirrors the live session to Discord Rich Presence via local IPC: focused project in `details`, agent name + status + `working/total` count in `state`.
- **Key Features**: No panes, no `[[events]]`, no HTTP endpoints, no picker or daemon socket. Declared surface in `herdr-plugin.toml` is one `[[startup]]` + three headless actions:  * `start` (`node dist/launcher.js`, al

### [2026-08-14] kiitosu/herdr-jira-board
- **Overview**: `kiitosu/herdr-jira-board` is a Jira kanban TUI that runs inside Herdr as a `tab` pane. It fetches issues by JQL from Jira Cloud and renders them in three status-category columns — To Do / In Progress / Done — tolerant of mixed custom workflows.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): no events, no HTTP endpoints.**  * 1 pane: `board` (`Jira Board`, `placement="tab"`, `bin/jira-board`). * 3 actions:   * `open-board` (`workspace`): `he

### [2026-08-14] TheThoughtagen/attic
- **Overview**: `attic` (`id: attic`, `v0.1.0`, `min_herdr_version 0.8.0`) is a **herdr agent archiver and inventory keeper** in Session & Workspace Management. It snapshots live pane inventory on a 5-minute timer and archives-then-closes provably-idle Claude agent panes — draining scrollback to disk with a `claude --resume <uuid>` manifest before calling `pane close` — so RAM is reclaimed without losing recoverable work.
- **Key Features**: **Core lifecycle — `attic.cli:main`:** - `attic tick` — what `launchd/com.attic.plist` runs every 300s: snapshot inventory unconditionally, then reap only if all guards pass. Always exits `0`, even on

### [2026-08-14] malone-c/herdr-agent-smart-rename
- **Overview**: `malone-c/herdr-agent-smart-rename` — manifested as `chrismalone.agent-smart-rename / Agent Smart Rename v0.1.0` — names each live agent session from what it is actually doing, so Herdr's Agents sidebar reads `Scrape Tweets` / `scrape-tweets` instead of N identical `claude` rows.
- **Key Features**: **Automatic naming, no picker UI:** - `pane.agent_detected -> uv run --script rename.py` — first attempt, usually abstains as thin. - `pane.agent_detected -> sh watch.sh` — starts a per-pane 60s poll 

### [2026-08-16] moneycaringcoder/herdr-shear
- **Overview**: Shear (`moneycaringcoder.shear`, `Shear v0.2.0`) is a **git-worktree janitor** for Herdr. Long-lived agent sessions accumulate linked checkouts; Shear enumerates every worktree the session knows about, classifies how dead each one looks (`safe / review / keep / blocked`) and what disk it costs, and removes only explicitly selected checkouts — never branches or commits.
- **Key Features**: **Verbs (single `target/release/shear` binary):**  * `--list` (default): settled inventory table + summary. Dry-run by construction, no import of `remove`. * `--json`: same inventory machine-readable.

### [2026-08-16] moneycaringcoder/herdr-standup
- **Overview**: `moneycaringcoder.standup` (`Standup` v0.2.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a read-only reporting plugin in Session & Workspace Management. It answers “what did my agents actually produce?” in one invocation: it takes a single `session.snapshot`, discovers every git checkout behind every workspace via pane `cwd`s, asks `git` what happened there over a time window, and groups the result by repository.
- **Key Features**: **User surface — 8 panes + 8 actions, all on-demand:**  Declared in `herdr-plugin.toml`. All panes are `placement = "overlay"` invoking `./target/release/standup`:  - `digest` → `--tui` — interactive 

### [2026-08-16] moneycaringcoder/herdr-pulse
- **Overview**: Pulse (`moneycaringcoder.pulse`, `v0.1.1`) is a **Session & Workspace Management observability augmentation**, not a workspace creator.
- **Key Features**: **User-visible surface is one binary, one overlay, eight headless actions, one startup hook. No `[[events]]`:**  From `herdr-plugin.toml`:  * `[[panes]] activity` — `Pulse: activity`, `placement = "ov

### [2026-08-16] hota911/herdr-command-palette
- **Overview**: `hota911/herdr-command-palette` — manifested as `hota911.command-palette / Command Palette (built-ins) v0.1.0` — is an `fzf` command palette for Herdr's built-in operations over Workspaces, Tabs, Panes, Agents, and server Config. It deliberately complements rather than replaces Jan Tvrdík's `jt.command-palette`: that plugin lists plugin actions, this one lists `herdr workspace/tab/pane/agent/server` CLI operations.
- **Key Features**: **What the user gets:** one keybind (`prefix+shift+p` suggested in `README.md`, not declared in the manifest) opens a popup listing all 31 catalogued commands in `commands.json` order, fuzzy-searchabl

### [2026-08-16] tp6gw94/herdr-jump
- **Overview**: `tp6gw94/herdr-jump` (`herdr.jump`, `Herdr Jump v0.1.2`) is a keyboard-first navigator for live Herdr state. It provides five popup pickers — `all` (`jump`), `workspace`, `tab`, `pane`, and `agent` — that list the current `session.snapshot` and focus the selection on `Enter`-equivalent.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 5 actions + 5 panes, no events, no endpoints.**  * Actions `jump / workspace / tab / pane / agent` (all `["node","src/action.js"]`) are thin launchers. They 

### [2026-08-18] e2b-dev/herdr-e2b-sandbox
- **Overview**: `herdr-e2b-sandbox` (`e2b-dev.herdr-e2b`, `v0.4.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) sends a live git checkout to a fresh E2B cloud sandbox on demand. It uploads a snapshot of the working tree — tracked files plus uncommitted edits and untracked files, honoring `.gitignore` — with no push, clone, or git hosting round-trip, then drops the user into that box's shell.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): 10 actions + 4 panes + 1 event, no HTTP endpoints.**  Actions (all `bash -lc "$HERDR_PLUGIN_ROOT/bin/..."`, most `contexts=["workspace"]`): - `open` → `

### [2026-08-18] qintmb/herdr-icon-agent-ui
- **Overview**: `qintmb/herdr-icon-agent-ui` is a display-only sidebar augmentation for Herdr, not a workspace orchestrator. It does two things: publishes a static per-pane harness logo as `$harness_logo`, and publishes an animated lifecycle-state line as one of `$state_working` / `$state_done` / `$state_blocked` / `$state_idle` / `$state_unknown`.
- **Key Features**: **Icon reporting — `agent_icons.py`:**  * Variant system `auto | font | text | none`: `font` = PUA glyph from `PUA_LOGOS`; `text` = fallback from `TEXT_LOGOS` (e.g. `claude §`, `codex Λ`, `pi π`, `kim

### [2026-08-18] imtim/herdr-pane-id
- **Overview**: `pane-id` (`Pane ID`, `v0.9.1`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a zero-UI, event-driven labeling plugin in **Session & Workspace Management**. It makes every Herdr addressable object self-identifying: panes become `pF` or `pi | pF`, single-pane tabs become `1_t1:p1`, multi-pane tabs become `1_t1(2)`, and workspaces become `Projects:wP`.
- **Key Features**: No `[[actions]]`, `[[panes]]`, or HTTP endpoints. Surface is 11 `[[events]]` + 3 `[[startup]]` hooks, all reconciling labels idempotently:  **Pane labels (`on-pane-event.sh` + `workspace-sync.py:recon

### [2026-08-19] coryshaw1/herdr-cliamp
- **Overview**: `herdr-cliamp` is a Herdr wrapper around `cliamp` — an external terminal TUI for music, podcasts, and audiobooks. It solves a specific lifecycle problem: `cliamp` keeps audio inside the TUI process, so a normal Herdr `popup` would kill playback on close.
- **Key Features**: Declared surface in `herdr-plugin.toml` (`id: herdr-cliamp`, `v0.1.1`): **5 `global`-context actions + 1 `popup` pane, no `[[events]]`, no `[[startup]]`, no HTTP endpoints.**  | Action | `cliamp.sh` s

### [2026-08-19] andybarilla/herdr-scuttlebutt
- **Overview**: `andybarilla/herdr-scuttlebutt` (`andybarilla.scuttlebutt`, `v0.2.6`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a **shared chat room for the agents in a Herdr session**, not a workspace switcher, launcher, or bootstrap hook like most of the Session & Workspace Management ledger.
- **Key Features**: **User surface declared in `herdr-plugin.toml`: 1 pane + 5 actions, no events, no HTTP endpoints.**  * Pane `chat` (`Scuttlebutt`, `placement="split"`, `command=["bash","scripts/pane-chat.sh"]`). * `o

### [2026-08-19] chandrasekharan98/herdr-workspace-save
- **Overview**: `chandrasekharan98/herdr-workspace-save` (`workspace-save`, `0.1.0`) is a manual save / restore utility for Herdr workspaces. `wss.py save` snapshots the focused workspace — per-tab split trees, per-pane `cwd`, foreground command, and Herdr-reported agent session ref — to `$HERDR_PLUGIN_STATE_DIR/workspaces/<slug>.json`; `wss.py pick` (via the `open` action) re-creates that workspace later from an `fzf` picker with every command **typed but not run**.
- **Key Features**: No daemons, no `[[events]]`, no HTTP endpoints. Declared surface in `herdr-plugin.toml` is **3 actions + 2 panes**:  * `workspace-save.save` → `python3 wss.py save` — snapshot focused workspace, slugi

### [2026-08-19] AgentTeamsRun/herdr
- **Overview**: **AgentTeams worktree notifier** (`id: agentteams`, `v0.1.0`, `min_herdr_version 0.8.0`) is a zero-UI, event-driven bridge in **Session & Workspace Management**. It does not create, lay out, bootstrap, or display worktrees itself. Its sole job is to tell the external AgentTeams control plane immediately when Herdr creates or removes a git worktree, so the RunnerBox list updates at once instead of waiting for the next periodic Runner Git reconciliation.
- **Key Features**: No user-invoked surface. There are no `[[actions]]`, `[[panes]]`, keybindings, pickers, daemons, sockets, or HTTP endpoints declared to Herdr.  The entire functional surface is two event subscriptions

### [2026-08-20] momentohq/mo-herdr
- **Overview**: `momentohq/mo-herdr` (`momento.mo` / `mo`, `v0.2.1`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a companion shim for the external `mo` binary (`mfunc-llm-gw`), not a reimplementation of it. State reporting comes from `mo` itself — per `README.md` and `docs/agent-lifecycle.md` in the mo repo, `mo` natively reports `working` / `blocked` / `idle` and releases its Herdr row on every exit short of `kill -9`.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: one `[[startup]]` (`startup.sh`) and two `[[actions]]`, no `[[panes]]`, no `[[events]]`, no HTTP endpoints:  * **`launch` (`Launch mo in this pane`,

### [2026-08-20] barnuri/herdr-project-manager
- **Overview**: `barnuri/herdr-project-manager` (`barnuri.project-manager`, `v0.1.1`) is a VSCode Project-Manager-inspired directory registry for Herdr. It maintains a user list of projects — auto-discovered via `~/sandbox/*/.git`-style globs plus manual pins — and lets the user jump into any entry as a focused Herdr `workspace` or `tab` from a fuzzy picker.
- **Key Features**: **Project sources (`lib/config.js`, `lib/discover.js`, `README.md`):**  * `globs[]` — expanded on every refresh via `fs.promises.glob(expandHomePath(pattern))`. A match ending in `.git` registers its 

### [2026-08-20] 0xthc/herdr-plugin-pr-board
- **Overview**: `0xthc/herdr-plugin-pr-board` is a pure-Shell Herdr plugin that brings the current repo's GitHub PRs inside Herdr. It provides a persistent read-only board, an `fzf` picker with live preview, and an explicit garbage-collector for worktrees whose PR has merged or closed.
- **Key Features**: No daemon, no HTTP endpoints, no `[[events]]`. Declared surface is 3 panes + 3 actions + 1 link handler:  **Panes (`herdr-plugin.toml`):** - `board` — `PRs`, `placement="split"`, `bash bin/board.sh`. 

### [2026-08-20] goofansu/herdr-notebook
- **Overview**: `goofansu/herdr-notebook` is a minimal, zero-dependency Python plugin that gives every Herdr workspace one permanent, user-owned Markdown scratch file. Invoking its single action opens that file in the user's `$VISUAL` / `$EDITOR` / `vi` in a temporary `overlay` pane over the active pane; closing the editor returns focus. The notebook is keyed to the workspace's canonical directory — not the ephemeral workspace ID — so it survives workspace close/reopen.
- **Key Features**: Declared surface is intentionally tiny — verified both in `herdr-plugin.toml` and by a manifest-invariant test:  * **Action `herdr-notebook.open-notebook`:** `Open this workspace's notebook`, `context

### [2026-08-21] vishnutskumar/herdr-memex-analytics
- **Overview**: `vishnutskumar.memex-analytics` (`memex-analytics`, `v0.3.1`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a Rust (~9.4k LOC) efficiency-analytics plugin for Herdr, backed by `memex` history. It does not create, lay out, or bootstrap workspaces like most Session & Workspace Management ledger peers (`sessionizer`, `workspace-manager`, `sesh`, `spreader`). It is read-only observability + realtime guidance: a retro report on where sessions, tokens, cost, and cache-waste went, plus a background daemon that watches live agent status and nags when agents block, loop, run long, or burn budget.
- **Key Features**: **Retro report (`analytics report`):** Per-project session counts, message volume, summed wall-time (`active_ms`), last-activity, and source breakdown (`Claude:2 Codex:1`). When `token_usage = true` i

### [2026-08-21] zackshen/herdr-workspace
- **Overview**: `herdr-workspace` (`Herdr Workspace`, `v0.1.2`, `min_herdr_version 0.8.0`) is a Rust Session & Workspace Management plugin that creates a new Herdr workspace **or** a linked Git worktree from a centered popup and then applies a declarative layout profile. Profiles — tabs, pane splits, pane labels, shell `command`s, and named agents (`agent` + `kind` + `args`) — live in `$HERDR_PLUGIN_CONFIG_DIR/config.yaml`, seeded on first run from `config.example.yaml` and documented in `docs/profiles.md`. It is in the same family as `spreader`, `workspace-manager`, `sessionizer`, and `sesh` in the ledger, but distinguished by its two-wizard Ratatui UI, deferred agent-start design, and worktree fast-forward onto `origin/<base>`.
- **Key Features**: No daemons, event subscriptions, HTTP endpoints, sockets, or background polling. Declared surface in `herdr-plugin.toml` is **2 actions + 2 panes + 1 `[[build]]`**:  * **Actions (both `contexts=["work

### [2026-08-21] 0xthc/herdr-plugin-worktree-bootstrap
- **Overview**: `0xthc/herdr-plugin-worktree-bootstrap` (`Worktree Bootstrap`, `v0.1.0`) is a minimal Shell cold-start fix for Herdr linked worktrees. A fresh `git worktree` contains only tracked files, so this plugin seeds each new checkout with the untracked local state needed to run immediately — by default `.env`, `.env.local`, `.env.*.local` plus a hardlinked `node_modules` — sourced from the main checkout.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 event + 1 action**. No panes, no pickers, no daemons, no HTTP endpoints, no link handlers:  * **Automatic seed on creation:** `worktree.created -> ["bash

### [2026-08-21] hassox/herdr-kanban
- **Overview**: `herdr-kanban` (`Kanban`, `v0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`) is a **workspace-local kanban board for Herdr panes**. Each pane in the current workspace (`$HERDR_WORKSPACE_ID`) is rendered as a card in a Bubble Tea `split` pane; the card's column is the pane-metadata token `kanban_column` with source `plugin:herdr-kanban`.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 1 pane + 2 actions, no `[[events]]`, no HTTP endpoints.**  * `board` pane (`Kanban`, `placement="split"`, `command=["./bin/herdr-kanban"]`) — the interactive

### [2026-08-21] BASHBOP/otito-herdr-plugin
- **Overview**: **Otito Trust** (`bashbop.otito`, `v0.1.0`) is a thin Herdr adapter for the external Otito CLI (`@bashbop/otito@1.8.0`). It brings local-first repository context building, change-impact ranking, composite review, and exact staged-tree gate validation into the Herdr workspace that already hosts coding agents.
- **Key Features**: Declared surface in `herdr-plugin.toml`: **5 headless actions + 1 interactive popup pane**. No daemons, sockets, HTTP endpoints, event subscriptions, or startup hooks.  **Actions — all `["node", "acti

### [2026-08-22] July24/pier
- **Overview**: `pier` (`pi` × `herdr`) is a **two-half workspace fusion system**, not a conventional picker/switcher. The `pi` half (`packages/pier-ext`) injects a `todo_write` loop, interactive `subagent` / `terminal` / `ask_user_question` tools, and live pane-title projection into a `pi` coding-agent session. The `herdr` half (`packages/pier-workbench`) is a zero-UI, event-driven plugin that gives those sessions a visual substrate: it auto-bootstraps a `main` master tab per workspace, raises a human-gate `notification.show` when a `pi` subagent goes `blocked`, restores the last-booted layout after session restore, and continuously reflows split ratios so the focused pane grows in place.
- **Key Features**: ### Herdr half — no actions, no panes, no HTTP  `packages/pier-workbench/herdr-plugin.toml` declares **0 `[[actions]]`, 0 `[[panes]]`, 1 `[[startup]]`, 7 `[[events]]` (×2 platforms)**. Commented-out `

### [2026-08-22] mcuste/herdr-workspacer
- **Overview**: **Herdr Workspacer** (`herdr-workspacer`, `v0.3.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is an MRU fuzzy workspace picker in the Session & Workspace Management domain.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 1 action + 1 pane + 1 event, no HTTP endpoints, no sockets, no daemon:**  * `open` — `Open workspace picker`, `contexts=[global, workspace]`, `bin/herdr

### [2026-08-22] ShoMasegi/herdr-worktree-nav
- **Overview**: `herdr-worktree-nav` (`id: herdr-worktree-nav`, `v0.1.0`, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a Session & Workspace Management navigator for Herdr sessions that have outgrown manual `goto`.
- **Key Features**: **Panes view (`panes` pane / `open-panes` action):**  * Unified tree built from `session.snapshot` + `worktree.list` + `git`: repos labelled `owner/repo` when `origin` is GitHub, otherwise Herdr's `re

### [2026-08-23] ronly2460/herdr-pane-mover
- **Overview**: **Pane Mover** (`ronly2460.pane-mover`, `v0.1.1`, `min_herdr_version 0.8.0`) is a minimal POSIX-`sh` utility for Session & Workspace Management. It does one thing: move the currently focused pane, live and without restarting its terminal process, into a new tab in a *different* workspace, then focus it.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 action + 1 pane, 0 events, 0 endpoints**:  * **Action `open` — `Move pane to workspace` (`contexts = ["workspace","tab","pane"]`):** `sh -c exec sh "${HE

### [2026-08-23] ZingerLittleBee/herdr-agent-pins
- **Overview**: **Agent Pins** (`dev.bybee.pins`, `0.1.0`, `min_herdr_version 0.7.5`) persistently pins chosen Herdr Agent Sessions to the top of the Agents sidebar. It treats a Pin as durable user intent — focus, activity, and read state never remove or reorder it — and stores that intent in `pins.json` under `HERDR_PLUGIN_STATE_DIR`, projecting it on demand through transient Herdr view state that can always be rebuilt.
- **Key Features**: **User-visible actions** — all `node src/cli.js <command>`, declared in `herdr-plugin.toml`:  * `toggle-pin` (`contexts=["pane"]`): add the focused Agent Session to the top of the pinned group (positi

### [2026-08-24] bigbug16/herdr-topbar
- **Overview**: `bigbug16/herdr-topbar` is a **macOS-only menu-bar companion for herdr**, not an in-herdr pane or workspace orchestrator. Herdr's plugin host can only run processes — it cannot draw an `NSStatusItem` itself — so this plugin compiles, installs, and feeds a tiny `LSUIElement` AppKit app, `HerdrBar.app` (`dev.herdr.topbar`, `v0.1.0`, `min_herdr_version 0.8.0`), that lives in `~/Applications`.
- **Key Features**: **Menu-bar presence:**  * Always-on dark ram icon in either system appearance. Deliberately *not* an AppKit template image so resting look never inverts; only the blink moves. * Left-click → resolve `

### [2026-08-24] ukwhatn/taskherd
- **Overview**: Taskherd is a local-first kanban board for parallel coding-agent work. Tasks live as a single `tasks.json` file on the machine; each task can carry free-form notes, agent `SessionRef`s, and GitHub PR/Issue and Jira links.
- **Key Features**: **Task core — all scriptable with `--json` and never prompting under it:**  * `add <title> [--status --due --note --link --session --cwd]` — creates `#id`; `--session current|<uuid>` resolves and link

### [2026-08-24] eduardoborges/herdr-claude-title-hook
- **Overview**: `eduardoborges/herdr-claude-title-hook` (`Herdr Claude Title Hook`, `v0.3.0`) is a **Claude Code plugin distributed via Herdr**, not a conventional Herdr runtime plugin. Its sole job is to mirror the Claude Code session title — auto-generated `ai-title` or user-set `/rename` `custom-title` — onto the current Herdr tab label via `herdr tab rename`.
- **Key Features**: Key features, all narrowly scoped to `claude-code`:  * **Automatic tab rename from transcript:** parses the session JSONL transcript for `"type":"ai-title"` (`aiTitle`) and `"type":"custom-title"` (`c

### [2026-08-24] christiangroth/herdr-tab-title-from-terminal
- **Overview**: **Tab Title from Terminal** (`chrgroth.tab-title-from-terminal`, `v0.3.0`) is a zero-dependency Python utility in Session & Workspace Management that names every Herdr tab after the live terminal title of the agent running inside it.
- **Key Features**: No panes, pickers, daemons managed by Herdr, or HTTP endpoints. One reconciler exposed three ways:  **Manual action:** - `sync` (`Tab-Labels jetzt abgleichen`, `python3 sync.py`) — full walk of all pa

### [2026-08-24] spiritsack/herdr-jira-worktree
- **Overview**: **Jira Worktree Starter** (`spiritsack.jira-worktree`, `v0.3.0`) is a single-popup Session & Workspace Management plugin that turns a Jira ticket reference into a ready-to-work Herdr workspace. The user types a ticket ID or URL, the plugin opens or reuses a git worktree named for that ticket, starts a coding agent in the worktree's root pane, and types the raw ticket string into the agent's input without submitting it.
- **Key Features**: Declared Herdr surface is minimal — **1 pane, 0 actions, 0 events, 0 HTTP endpoints**:  - `[[panes]] start` (`Start ticket`, `placement="popup"`, `width="70%"`, `height=14`, `command=["sh","start.sh"]

### [2026-08-24] BjoernSchotte/herdr-worktree-picker
- **Overview**: `worktree-picker` (`Worktree Picker`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a Shell-only Session & Workspace Management plugin that replaces Herdr's built-in *New worktree* prompt with a fuzzy picker where you type the branch name.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **3 headless actions + 1 overlay pane, 0 events, 0 HTTP endpoints, 0 startup hooks**:  * `worktree-picker.workspace` (`contexts=[workspace,pane,global]` → `b

### [2026-08-24] choplin/herdr-repository-identity
- **Overview**: `Repository Identity` (`choplin.repository-identity`, `v0.1.1`) is a minimal, stateless Session & Workspace Management augmentation, not a workspace orchestrator. Its sole job is to answer “which Git repository does this workspace belong to?” in Herdr’s Space sidebar.
- **Key Features**: **Single capability: worktree-aware repo naming.**  * **Git common-dir resolution (`RepositoryIdentity` in `internal/identity/identity.go`):** runs `git rev-parse --path-format=absolute --git-common-d

### [2026-08-26] yoyoyeti/multitrunk-herdr-plugin
- **Overview**: **Multitrunk** (`id: multitrunk`, `v0.1.1`, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a Herdr UI front-end for the external `mt` (multitrunk) CLI, which itself coordinates multi-repo Worktrunk (`wt`) worktrees. A **task** is a named group of worktrees under `<workspace>/trees/<task>/`; this plugin collects task name / repo / branch choices in interactive popups, runs `mt new` / `mt attach` / `mt rm`, then lays out the resulting Herdr workspace — agent pane, per-repo tabs, command panes — from `multitrunk.layout.toml` via `mt --json` / `--events` output.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 3 actions + 4 panes, no `[[events]]`, no `[[startup]]`, no HTTP endpoints.**  * Actions (all `./target/release/mt-herdr <verb>`):   * `new-task` (`globa

### [2026-08-26] jovylle/herdr-session-title-name
- **Overview**: This is a zero-UI, event-plus-poller persistence utility in Session & Workspace Management, not a workspace creator or picker. Its sole job is to copy Herdr's ephemeral `terminal_title_stripped` — the OSC title published by the foreground agent, e.g. `hermes --tui -c "hey what is 1 plus 1"` — onto the parent Herdr tab label via `herdr tab rename`, so the human-readable title survives after the agent process exits.
- **Key Features**: **What the user sees:**  * **Automatic tab persistence:** a numeric tab becomes `hey what is 1 plus 1` within ~1.5s of the agent setting its terminal title, and stays that way after `pane.exited`. * *

### [2026-08-26] gurronen/herdr-looper
- **Overview**: **Herdr Automations** (`local.herdr-automations`, `v0.1.0`) launches repeatable, machine-local **Pi** jobs into fresh Herdr-native resources. One global action opens a searchable `70% x 60%` popup; picking an automation creates a new workspace or Herdr-managed git worktree with `--no-focus`, starts Pi in its root pane, and submits a literal prompt.
- **Key Features**: **User surface is 1 action + 1 pane, no events, no HTTP endpoints, no daemon:**  * `open` (`Open automation launcher`, `contexts=["global"]`): `./bin/herdr-automations open` — executes `HERDR_BIN_PATH

### [2026-08-26] Dimon94/herdr-context-locator
- **Overview**: **Herdr Context Locator** (`dimon.context-locator`, `0.1.0`) is a single-action, zero-state utility for multi-agent Herdr sessions. When invoked from a focused agent pane it copies one self-describing English prompt — the **Context Locator** — containing the live pane ID plus a validated snapshot of Herdr's native `agent_session` reference.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **1 action, 0 panes, 0 events, 0 HTTP endpoints, 0 daemons, 0 startup hooks**.  * **Action `copy-focused-context`** (`Copy focused agent context loc

### [2026-08-27] 42lizard/herdr-sessionizer
- **Overview**: `42lizard.sessionizer` (`Sessionizer`, `v0.1.3`) is a minimal Shell-based fuzzy workspace picker in the heavily-populated Session & Workspace Management picker family — alongside `andrewchng/herdr-sessionizer`, `salkhalil/herdr-sessionizer`, `willfish.herdr-workspacex`, `alon-z/herdr-command-palette`, and others.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 action + 1 pane, 0 events, 0 endpoints**:  * **Action `open` — `Find or create workspace` (`contexts=[workspace,tab,pane]`, `command=["./bin/sessionizer"

### [2026-08-27] jtnovellis/herdr-worktree-setup
- **Overview**: `jtnovellis/herdr-worktree-setup` (`worktree-setup`, `v0.1.3`) is a Rust cold-start plugin for Herdr linked worktrees. On `worktree.created` it opens a live Ratatui split beside the new checkout and runs an auto-detected pipeline — copy gitignored dev state (`.env*`, IDE config), CoW-clone dependency caches (`node_modules`, `target`, `.venv`), `mise trust` / `direnv allow`, dependency install, plus repo-defined `[[steps]]` — so the worktree is immediately usable with zero configuration.
- **Key Features**: **Lifecycle surface — no daemon, HTTP endpoint, or socket:**  * `[[events]]`: `worktree.created -> sh -c exec sh "$HERDR_PLUGIN_ROOT/scripts/run.sh" hook` * `[[panes]]`: `setup` (`Worktree Setup`, `pl

### [2026-08-27] 42lizard/workspace-basename
- **Overview**: `42lizard.basename` (`Basename`, `v0.1.0`) is a minimal, zero-UI Session & Workspace Management utility. It listens for Herdr's `workspace.created` event and renames the new workspace to the basename of its root pane's launch directory — e.g. `/home/me/Developer/example-project` → `example-project` — while leaving any non-empty, explicitly chosen label untouched.
- **Key Features**: No user-invoked surface. There are no `[[actions]]`, `[[panes]]`, keybindings, HTTP endpoints, sockets, or daemons declared in `herdr-plugin.toml`.  Single capability — **stable basename naming on cre

### [2026-08-27] tmastalirsch/herdr-workspace-board
- **Overview**: Workspace Board answers one question across every git checkout you own: **where did I leave something unfinished?** It scans all repositories under configured roots (`~/workspaces` by default), classifies each repo with open work by how likely that work is to be forgotten — `staged, never committed > changed > unpushed > generated-only` — and renders one line per repo in a Herdr `tab` pane, newest-first within each rank.
- **Key Features**: **Ranking and triage, not just listing:**  * `lib/classify.sh:repo_state()` implements the rank: any staged source file → `staged`; else any changed source file → `wip`; else any `rev-list @{u}..HEAD`

### [2026-08-28] solidsnakedev/herdr-jump
- **Overview**: `jump` is a leader-key fuzzy navigation plugin for Herdr in the Session & Workspace Management domain. It provides Neovim / tmux-sessionizer style jumping: `prefix + <mnemonic>` opens an `fzf` popup over live Herdr state, `Enter` focuses the selection, `Esc` closes as if never opened.
- **Key Features**: Declared in `herdr-plugin.toml` as 8 `global`-context actions + 6 `popup` panes + 1 event:  **Pickers (action → popup entrypoint):**  * `jump.workspaces` → `pick-workspace.sh` (`w`): fuzzy-pick a work

### [2026-08-29] sazardev/herdr-code-board
- **Overview**: **Herdr Code Board** (`herdr-code-board`, `v0.7.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only, ~16.9k LOC Rust) is a kanban queue for agentic prompts inside Herdr. Users capture prompts once as cards — each with repo, agent kind, model, and placement policy — and the engine dispatches real agents into Herdr panes, tabs, workspaces, or git worktrees, delivers the prompt, tracks lifecycle, and chains cards via rules (`when this is done, start that`).
- **Key Features**: ### Board model  Nine lanes defined in `src/model.rs:Column`: `backlog → ready → running → waiting → blocked → review → done / failed / cancelled`. `is_live()` (`running|waiting|blocked`) owns a pane 

### [2026-08-30] thuanlm215/herdr-grid
- **Overview**: `herdr-grid` (`herdr-grid` v0.4.0, `min_herdr_version 0.8.2`, `linux`/`macos` only) is a **visual, in-popup layout editor for the active Herdr tab**. It mirrors live pane topology into a local binary-split model, lets the user drag to swap/re-parent, drag dividers to resize, preview new shell panes as drafts, and apply built-in or saved geometry presets — all without restarting PTYs or losing scrollback.
- **Key Features**: **Declared Herdr surface — 1 pane + 1 action, no events/endpoints:**  * `grid` pane (`Layout grid`, `placement="popup"`, `bash scripts/run-pane.sh`) — hosts the Ratatui TUI. * `open` action (`Open lay

### [2026-08-30] chenyao0910/herdr-jetbrains
- **Overview**: **`herdr.jetbrains` / "Open in JetBrains IDE" (`v0.2.0`)** is a minimal, single-action bridge that opens the *currently active* Herdr workspace in an external JetBrains IDE. It prefers the linked-worktree checkout root when Herdr provides it, otherwise falls back to the workspace `cwd`, infers Rider / WebStorm / IntelliJ IDEA / GoLand from top-level project markers, and hands the directory to the IDE's native launcher before exiting.
- **Key Features**: Declared surface in `herdr-plugin.toml` is intentionally tiny: **1 action, 0 panes, 0 events, 0 startup hooks, 0 HTTP endpoints, 0 sockets.**  * **Action `open` (`Open in JetBrains IDE`, `contexts=["w

### [2026-08-31] vjeantet/herdr-mission-control
- **Overview**: Mission Control is a Herdr **exposé-style overview** for the current workspace. On a single key (`prefix+e` in docs) it opens a full-screen `popup` that renders every pane in the workspace as a live tile — styled ANSI content preview plus agent status — grouped by tab, and selecting a tile switches Herdr focus to that pane.
- **Key Features**: **Declared surface is minimal: 1 action + 1 pane, no events, no HTTP endpoints.**  * `herdr-plugin.toml`: action `open` (`Open Mission Control`, `contexts=["workspace"]` → `sh scripts/open.sh`) and pa

### [2026-08-31] ardasevinc/herdr-codex-bridge
- **Overview**: `Herdr Codex Bridge` (`herdr-codex-bridge`, `v0.1.5`, `min_herdr_version 0.8.2`) restores native Herdr pane identity to Codex sessions that run through a persistent centralized app-server.
- **Key Features**: **Caller-aware CLI (`bin/herdr-self` / `cmd/herdr-self/main.go` -> `internal/app/app.go`):**  * `herdr-self [--json]` — print live association: `thread / workspace / tab / pane / source`. `native-env`

### [2026-08-31] danieljvdm/herdr-composer
- **Overview**: Herdr Composer (`id: composer`, `v0.3.4`, `min_herdr_version 0.8.2`, `macos`/`linux`) is a task-to-agent launcher for Herdr. From a Ratatui overlay editor or a headless CLI it resolves repository + provider + agent/model/effort/speed + branch/base into a frozen `TaskRequest`, prepares a new native Herdr worktree, Worktrunk checkout, custom-provider checkout, or shared-checkout tab in the background, starts the selected coding agent there with one `agent prompt`, and later removes that session through the same recorded receipt.
- **Key Features**: **User entrypoints:**  * `herdr-composer` — opens the `New task` overlay editor. `Ctrl+S` launch, `Ctrl+R` refresh catalog, `Esc` save draft and close, `Tab/Shift+Tab` move fields, `Enter` open picker

### [2026-08-31] softwarecrafts/herdr-tab-new
- **Overview**: `softwarecrafts.tab-new` is a dual-mode launcher for starting or resuming a coding-agent session in the Herdr workspace that owns the current project. Run as a CLI from a Zed terminal it resolves project → Herdr session → workspace → tab, creates a `--no-focus` tab and starts an agent (`claude` by default), then replaces itself with `herdr agent attach --takeover` so that terminal *becomes* the session. Run as a Herdr plugin it exposes the same logic on a keybinding via a single `pick` action + `popup` picker that resumes an existing live agent or creates-and-focuses a new one.
- **Key Features**: **Plugin surface — one action, one pane, no events, no HTTP:** * `[[actions]] pick` — `Agent session: resume or start`, `contexts=[workspace,tab,pane]`, `sh -c exec "$HERDR_PLUGIN_ROOT/bin/herdr-tab-n

### [2026-08-31] WillHeather/herdr-grid
- **Overview**: `WillHeather/herdr-grid` (`herdr-grid` / `Herdr Grid`, `v0.1.0`, `min_herdr_version 0.8.0`) is a reversible layout utility for Herdr workspaces. A workspace that has spread one agent per tab is unreadable in aggregate; the `grid` action moves all detected agent panes into one — or paged `Grid 1/N` — tiled tabs sized to the current terminal, and `restore` rebuilds the original tabs.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **2 `workspace`-context actions, 0 panes, 0 events, 0 HTTP endpoints, 0 startup hooks**:  * `herdr-grid.grid` → `python3 herdr_grid.py grid` — `Grid

### [2026-09-01] cyperx84/herdr-tab-jump
- **Overview**: `cyperx84/herdr-tab-jump` (`tab-jump`, `Tab Jump v0.1.0`) is a minimal, headless navigator in **Session & Workspace Management**. Its sole job is to focus the Nth tab of the currently focused workspace **by visual position as shown in the sidebar**, so users can bind only a subset of the number row (e.g. `alt+1..6` for tabs, leaving `7..9` for workspaces) — something Herdr's built-in `switch_tab = "prefix+1..9"` does not allow. The entire implementation is ~162 LOC of Shell: a manifest plus one `jump.sh` script.
- **Key Features**: What the user gets is nine independent, bind-any-subset actions and no UI of its own:  * **9 headless actions `1` through `9`:** each titled `Focus tab N` in `herdr-plugin.toml`, each invoking `["sh",

### [2026-09-01] sagmans/herdr-pickers
- **Overview**: `herdr-pickers` (`Herdr Pickers`, `v0.2.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a Bun/TypeScript, source-only Herdr plugin for fuzzy navigation. Every interactive mode opens in a centered Herdr `popup` (`75% x 75%`, geometry owned by `herdr-plugin.toml`) and provides mouse-aware, `fzf`-ranked selection over projects, workspaces, worktrees, and agents.
- **Key Features**: **Picker actions — all via `bun src/actions/open.ts <mode>` → `plugin pane open --plugin <id> --entrypoint picker --env HERDR_PICKERS_MODE=<mode>`:**  * `all`: combined projects + workspaces + worktre

### [2026-09-01] lancodev/herdr-jump
- **Overview**: `lancodev/herdr-jump` (`lancodev.jump`, `Jump v0.3.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a Session & Workspace Management navigator. It is a flat, two-pane alternative to Herdr's built-in session navigator: workspaces on the left, agents on the right, in a single session-modal popup.
- **Key Features**: What the user gets is one action that opens one popup:  * **Two-pane fuzzy switcher:** left list is Herdr workspaces, right list is Herdr agents. Both panes are always visible. `h`/`l`/`Tab` swap the 

### [2026-09-02] Binb1/herdr-palette
- **Overview**: **Palette** (`binb1.palette`, `v0.3.0`, `min_herdr_version 0.8.0`) is a Go + Bubble Tea command palette for Herdr in the **Session & Workspace Management** picker family. It opens as a centered `popup` (`72x20`), merges live workspaces/agents, all installed plugin actions, and a small set of built-in Herdr verbs into one fuzzy-filterable list, and executes the selection on `Enter`/click.
- **Key Features**: ### Palette (`main.go`)  Three ordered groups, built fresh on every open by `loadItems()`:  * **Jump:** derived from `herdr api snapshot`:   * `Next blocked agent · <title>` — only first non-focused `

### [2026-09-02] utahta/herdr-hop
- **Overview**: **Hop** (`utahta.hop`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a Session & Workspace Management picker in the crowded workspace-switcher family (`sessionizer`, `workspacex`, `command-palette`, `sesh`, `kiosk`).
- **Key Features**: Declared Herdr surface in `herdr-plugin.toml` is **2 popup panes + 3 global actions, 0 events, 0 endpoints**:  * `hop` pane → `./herdr-hop tui --mode hop` — unified picker. * `worktree` pane → `./herd

### [2026-09-02] mike-bronner/herdr-plugin-project-finder
- **Overview**: Project Finder is a **Session & Workspace Management** picker that treats the set of open Herdr workspaces as desired-state to be reconciled. A single `fzf` popup lists every git repo up to three levels under `HERDR_PICKER_ROOT` (default `~`), pre-checks what is already open, and on `Enter` closes what was unchecked and creates workspaces for what was newly checked — empty means close everything except the pinned home workspace. Each created workspace gets a standardized `agent` tab split Claude-left / shell-right.
- **Key Features**: **What the user gets:**  * **Repo discovery:** `repos()` globs `*/.git`, `*/*/.git`, `*/*/*/.git` shallowest-first, de-duplicates nested checkouts (`p.startswith(o + os.sep)`), and skips a fourth leve

### [2026-09-02] lancodev/herdr-checkpoint
- **Overview**: `lancodev/herdr-checkpoint` (`lancodev.checkpoint`, `Checkpoint v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a **tmux-resurrect for Herdr**. It captures an exact, restorable snapshot of the live session — every workspace, tab, pane split-tree, `cwd`, and foreground program — and can later force the live session to *match* that snapshot.
- **Key Features**: No daemons, event subscriptions, HTTP endpoints, or background polling. The entire surface is 7 user actions + 1 internal action + 1 popup pane:  **Actions (`herdr-plugin.toml`, all `contexts=["worksp

### [2026-09-03] andrewbrannan/herdr-workspace-prs
- **Overview**: `herdr-workspace-prs` is a Bun/TypeScript Session & Workspace Management plugin that answers “what PRs and links belong to this workspace?” It runs a detached background daemon that maps each Herdr workspace’s pane `cwd`s to Git branches to GitHub PRs via `gh`, publishes a fixed set of sidebar tokens (`$pr_1_repo`, `$pr_1_num`, `$pr_1_open`, etc.), and persists the same data plus `LINKS.md`-derived links/notes to a JSON state file consumed by a popup picker.
- **Key Features**: **User-visible features (per `README.md` + code):**  * **Sidebar PR status (daemon-driven):** Up to `MAX_PRS_PER_WORKSPACE = 5` PRs per workspace. `daemon.ts:runPollOnce()` emits `pr_{1..5}_{repo,num,

### [2026-09-03] HalloSouf/subherd
- **Overview**: `HalloSouf/subherd` (`hallosouf.subherd`, `v0.2.2`) is a Go (~3.7k LOC) observability plugin for Herdr that answers “what is every Claude Code subagent doing right now?” Herdr natively shows one row per agent; once those agents fan out subagents and agent-team teammates, that row is opaque. `subherd` reads Claude Code’s on-disk transcripts, sidecars, and team configs, joins them to the Herdr workspace that owns each session, and renders a live tree grouped by workspace.
- **Key Features**: **Live and one-shot views:**  * Two Herdr panes from `herdr-plugin.toml`: `overview` (`Subagents`, `placement="split"`, `./bin/subherd`) — parkable live tree; `peek` (`Subagents (peek)`, `placement="o

### [2026-09-03] RickyMarou/herdr-display-workspace
- **Overview**: `RickyMarou/herdr-display-workspace` — manifested as `workspace.status / Workspace Status v0.1.0` — is a minimal display augmentation in **Session & Workspace Management**, not a workspace orchestrator. Its sole job is to resolve the currently active Herdr workspace ID to its human-readable `label` (verbatim, including emoji/spaces) and print it for rendering on the right side of the bottom tab bar. The entire implementation is POSIX `sh` (~272 LOC total): one manifest plus `status.sh`, with no UI, daemon, picker, or background process of its own.
- **Key Features**: What the user gets is one read-only lookup with graceful degradation:  * **Active-label resolution (`status.sh`):** implements a 4-step ID resolution order: 1) `HERDR_ACTIVE_WORKSPACE_ID` (injected by

### [2026-09-04] MovieHolic-Plex/herdr-wish
- **Overview**: `MovieHolic-Plex/herdr-wish` — manifested as `local.wish / wish v0.2.2` — is a single-file Node.js launcher for the external `omo` coding agent and its `/wish` slash-skill from `DevNewbie1826/omo-wish`. It has two spells: `wish` creates one new git worktree from the focused git space, writes the wish to `WISH.md`, starts `omo` in the new root pane and forces the prompt `/wish {text} and commit and make pr`; `omo-10` bulk-creates 10 worktrees (`omo-1..omo-10`) and starts `omo` in each with no prompt.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 3 actions + 1 pane, no events, no endpoints.**  * `spawn` / `omo-10` (`contexts=["workspace"]` → `node wish.js spawn`): bulk-create `count` worktrees, `

### [2026-09-04] tupton/herdr-worktree-include
- **Overview**: `Worktree Include` (`id: dev.tupton.worktree-include`, `v0.5.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a zero-UI, event-driven cold-start fix for Herdr linked worktrees.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **one event, no actions, no panes, no HTTP endpoints, no daemon, no picker**.  * **Hook:** `worktree.created -> ["bash", "src/include.sh"]`  What th

### [2026-09-05] victor-software-house/herdr-restore-notice
- **Overview**: Restore Notice is a standalone, zero-runtime-dependency Herdr plugin that annotates Herdr-native session restore without waking agents. After a `session stop → session attach` or crash recovery, Herdr's `startup` hook fires once; this plugin writes a compact, colored, 3-line notice into the scrollback of each restored shell that still holds a retained native `agent_session` — e.g. `pi · paused · Restore notice polish / [Resume] · [Transcript] · [Directory] · Ctrl-click Resume`.
- **Key Features**: **User-visible notice:**  * Heading `<agent> · paused [· <Pi name>]` in ANSI (`cyan` agent, `dim` paused, `bold` name). Pi name comes only from explicit `session_info` metadata in a retained transcrip

### [2026-09-06] bonkey/herdr-wt-purpose
- **Overview**: `bonkey.wt-purpose` (`Worktree from purpose`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a Shell (~522 LOC) Session & Workspace Management plugin for frictionless git-worktree creation. The user types **what the work is for** — free text like `fix crash when opening settings` or a single Linear / Jira / GitHub ticket URL — an on-device model turns it into a branch slug, and the plugin creates the worktree and opens it as a Herdr worktree workspace in the background while the user keeps working.
- **Key Features**: No daemons, sockets, HTTP endpoints, or `[[events]]` subscriptions. Declared surface is **2 actions + 2 panes**:  **Actions (`herdr-plugin.toml`, all `contexts=["workspace"]`, all `bash open.sh <mode>

### [2026-09-06] MDsniper/herdr-plugin-starter
- **Overview**: `MDsniper/herdr-plugin-starter` presents as a starter / scaffolding repository, not a functional Session & Workspace Management plugin. No source files, manifest, README, or scripts were provided in the `CODE:` block for this survey, and the deterministic scanner record is effectively empty (`Lines of Code: N/A`, no socket calls, no CLI commands, no agent scope). In 2-3 sentences: there is nothing to evaluate as runtime behavior. At best this is a placeholder from which a real Herdr plugin would be built; as surveyed it provides no user-facing value and cannot be compared functionally to the ledger peers in this domain.
- **Key Features**: No capabilities can be confirmed from code.  * **Features / commands:** None discovered. Scanner reports `Discovered CLI Commands: []`. * **Hooks / events:** None discovered. No `worktree.created`, `w

### [2026-09-06] maxguzenski/herdr-pr-watch
- **Overview**: `pr-watch` (`PR Watch`, `v0.1.0`, `min_herdr_version 0.8.2`) is a zero-dependency Python display augmentation in Session & Workspace Management. It does not create, move, or bootstrap workspaces — it labels what already exists: each Herdr workspace and each agent-occupied pane gets a `$pr` token (`#123 ✓/✗/●/◆/⊘`) derived from its checkout's current branch via `gh`, plus a `$dirty` token (`±N`) derived from `git status --porcelain`.
- **Key Features**: **Two sidebar tokens, written to both levels:**  * `pr`: `#123 ✓` (open + passing), `#123 ✗` (open + failing), `#123 ●` (open + pending), `#123` (open + no checks), `#123 ◆` (MERGED), `#123 ⊘` (CLOSED

### [2026-09-07] oddurs/namesync
- **Overview**: `oddurs/namesync` — repo `herdr-namesync`, manifest `id: namesync v0.2.0, min_herdr_version 0.8.0` — is an intent-mirroring renamer for Herdr Spaces, tabs and agents. It does not generate names by default; it moves the name the coding agent already published as its OSC terminal title (`terminal_title_stripped`) onto `workspace.rename / tab.rename / agent.rename`, and continuously revises it.
- **Key Features**: **Continuous naming, not one-shot:** Reads `agent.terminal_title_stripped` via `session.snapshot`, normalizes glyph/spinner prefix, rejects junk, renders through `templates.workspace/tab/agent`, slugi

### [2026-07-05] simoncrypta/bercail
- **Overview**: `simoncrypta/bercail` — installed as `bercail v0.5.2`, Herdr plugin `agentic-dev.layout v0.5.1` named “Agentic Layout” — is a **Session & Workspace Management distribution**, not a single pane. It imposes an opinionated three-column workspace on Herdr: sticky agent on the left (`5/12`), review-or-shell center (`5/12`), files/git sidebar on the right (`1/6`), plus Shell/`worktrunk` glue that makes every `wt` worktree appear as a correctly-labeled Herdr workspace.
- **Key Features**: **Agentic layout plugin (`plugins/agentic-layout/herdr-plugin.toml`):**  * 28 workspace-context actions, all `bash layout.sh <verb>`: `create`, `apply`, `start-agent`, `handoff-agent`, `focus-agent`, 

### [2026-07-28] voice0726/herdr-jump-number
- **Overview**: `voice0726/herdr-jump-number` (`Jump Number`, `v0.1.0`, `min_herdr_version 0.8.2`) is a Session & Workspace Management display augmentation that makes Herdr's `prefix+1..9` jump targets visible. It publishes workspaces as a display-only sidebar token `$jumpnum` (default `[1]`–`[9]`) and prefixes user-named tabs (default `2:review`), without ever calling `workspace rename` — which in Herdr would pin the label and break automatic `cwd`-following.
- **Key Features**: **What the user sees:**  - **Workspace numbers via `$jumpnum`:** `desiredWorkspaceToken()` formats position as `workspace_token` (default `"[{n}]"`). Labels are untouched. User must add `$jumpnum` to 

### [2026-08-18] furkankly/zoetrope
- **Overview**: `furkankly/zoetrope` is not a workspace manager in the conventional Session & Workspace Management sense. It is a read-only observability bridge: it asks Herdr which agent and native session id occupies the focused pane, then opens that session in `zoe` as a live flow graph.
- **Key Features**: **Herdr plugin surface (`herdr-plugin/herdr-plugin.toml`):**  * 1 pane: `graph` (`title: zoetrope`, `placement: overlay`, `command: ["bash", "herdr/open.sh"]`). * 5 headless actions, no `[[events]]`, 

### [2026-09-05] oddurs/herdr-namesync
- **Overview**: `oddurs/herdr-namesync` (manifest `id: namesync`, `v0.2.0`, `min_herdr_version 0.8.0`) is an **intent-mirroring renamer** for Herdr Spaces, tabs and agents. It does not compose names by default; it moves the name the coding agent already published as its OSC terminal title (`terminal_title_stripped`) onto `workspace.rename / tab.rename / agent.rename`, and continuously revises it.
- **Key Features**: **No panes, no HTTP endpoints, no manifest `[[events]]`.** The manifest declares 1 `[[startup]]` + 10 `workspace`-context headless actions, all `node src/cli.js <verb>`:  `rename-now` (current workspa

### [2026-09-06] Cainiaooo/sessmark
- **Overview**: `sessmark` (`id: sessmark`, `Session Marks v0.1.0`) is a **session annotation system, not a workspace orchestrator**. It lets a human tag an agent *session object* (`review:problem`, `keep`, `harvest:doc`, …) and attach free-text notes, then emits a machine-readable reference package (`sessmark.context.v1`) that agents and pipelines can resolve later.
- **Key Features**: ### Core CLI (`sessmark`, `src/sessmark/cli.py`)  Host-independent; requires explicit identity (`--id` or `--harness + --session-id`), never guesses “newest file”:  * `register / tag <tags> / untag <t

### [2026-09-07] hhdebb/herdr-radar
- **Overview**: `herdr-radar` (`Herdr Radar`, `v1.2.1`, `min_herdr_version 0.9.0`, `linux/macos/windows`) is a **Session & Workspace Management display augmentation** for Herdr. It does not create workspaces, launch agents, or bootstrap worktrees like most ledger peers (`sessionizer`, `sesh`, `workspace-manager`, `spreader`).
- **Key Features**: **What the user sees:**  * **Vendor logos:** `$harness_logo` per pane via `bin/agent-icons.js` + daemon loop. Font variant uses PUA `U+E1A0–E1B1` from `dist/HerdrAgentIconsMax-Regular.ttf`; text varia

### [2026-09-07] testy-cool/herdr-sidebar-config
- **Overview**: Herdr Sidebar Config is a display-only **Session & Workspace Management** preset that turns Herdr's native Agents and Spaces lists into a compact workspace → tab → agent task tree. It does not launch agents, generate summaries, implement Herdr's renderer, or add a file explorer.
- **Key Features**: **User-visible actions (3, all `contexts=["global"]`, all via `sh run.sh`):**  * `settings` — Change preferences without restart. `run.sh --settings-open` opens the `settings` popup. * `refresh` — `ru

### [2026-09-07] leonardoacosta/herdr-jcode
- **Overview**: `leonardoacosta.herdr-jcode` (`Jcode session hooks`, `v0.1.0`, `min_herdr_version 0.8.2`, `linux` only) is a standalone Rust Herdr plugin that reports Jcode agent lifecycle into Herdr. It installs itself as four Jcode `[hooks]` — `session_start`, `turn_start`, `turn_end`, `session_end` — and on each invocation calls back into the Herdr CLI to set custom `working`/`idle` state or release the agent.
- **Key Features**: **User-visible surface is three headless actions, no panes, no Herdr `[[events]]`, no HTTP endpoints:**  * `setup` — `Configure Jcode session hook` → `./target/release/herdr-jcode setup`. Resolves tar

### [2026-09-07] bonkey/herdr-stack-icon
- **Overview**: `bonkey/herdr-stack-icon` (`bonkey.stack-icon`, `Stack icon v0.6.0`) is a display-only augmentation in Session & Workspace Management, not a workspace orchestrator. It detects the technology stack of each Herdr workspace's repository from on-disk marker files and publishes it as a `$stack` sidebar token on both the workspace (Space row) and each of its panes (Agent row).
- **Key Features**: **Stack detection from files:** `stack-icon.py:detect()` / `icon_for()` / `markers()` walk down to depth 3, skipping dot-directories and `node_modules, Pods, DerivedData, Carthage, vendor, target, bui

### [2026-09-07] ferretorres/herdr-plugin-space-colors
- **Overview**: Space Colors is a Peacock-for-Herdr plugin: each workspace gets a named palette, and the visible chrome follows it. On `workspace.focused` the focused workspace's palette is written into Herdr's global `[theme.custom]`, every pane and Space is tagged with a per-palette `$sc_<name>` sidebar token via `report-metadata`, each pane self-tints via OSC 11, and the outer Apple Terminal window is retinted via AppleScript.
- **Key Features**: **What the user sees:** one palette, four surfaces at once.  * **Theme follows focus:** `accent`, `sidebar_bg`, `active_row_bg` (plus any of 19 allowlisted `theme.custom` tokens) rewritten for the foc

### [2026-09-07] muscaiu/resume-globally
- **Overview**: `resume-globally` (`Resume Globally`, `v0.3.1`, `min_herdr_version 0.8.0`, `platforms=["macos"]`) is a **cross-harness session resumer** in Memory (Session & Workspace Management). It answers “what was I working on in Claude Code, Cursor, or OpenCode, and get me back into it” from inside Herdr.
- **Key Features**: **What the user gets is one popup picker with three CLI modes:**  * **Interactive picker (default): `resume-globally [filter]`** — Opens focused in a search box. Live type-to-search matches `harness/m

### [2026-09-07] rrg/herdr-park-agents
- **Overview**: **Park Agents** is a Session & Workspace Management hibernation utility for Herdr. It parks a live coding-agent pane — stopping the agent process tree and closing its pane/tab to reclaim RAM — while persisting enough identity (`session_id`, `cwd`, transcript path, origin workspace label) to resume it later as a new tab via `agent start`.
- **Key Features**: **User verbs — 4 `[[actions]]`, no `[[panes]]`, no `[[events]]`:**  * `park` (`pane,tab`): `python3 park_agents.py park` — resolve the focused pane's session, append a row to `parked.json`, close the 

### [2026-09-08] newro/herdr-window-util
- **Overview**: `newro/herdr-window-util` (`Window Util`, `v0.1.0`, `linux`/`macos`, `min_herdr_version 0.8.0`) is a tmux-ergonomics gap-filler for Herdr, not a workspace orchestrator.
- **Key Features**: Declared surface in `herdr-plugin.toml`: **1 `[[startup]]` + 1 `[[events]]` + 1 `[[panes]]` + 19 `[[actions]]`**. No HTTP endpoints, sockets, or link handlers.  **Create (mirror-aware):** - `new-works

### [2026-09-08] bonkey/herdr-keep-root
- **Overview**: `bonkey/herdr-keep-root` (`bonkey.keep-root`, `Keep root`, `v0.1.0`) is a Shell-only Session & Workspace Management plugin that preserves Herdr's Spaces-panel grouping. A repository's main-checkout workspace — the *root* — is kept open, unfocused, while any of its linked-worktree workspaces is open; without it worktree spaces flatten to top-level. When the root is the last space of its repository it is allowed to stay closed normally.
- **Key Features**: What the user gets is automatic repair, not a picker or layout:  * **API-close repair:** `workspace.closed` hook re-opens the root immediately when the closed workspace was a root and other worktree s

### [2026-09-08] benbrackenbury/open-project
- **Overview**: **Open Project** (`benbrackenbury.open-project`, `v0.1.1`) is a minimal Session & Workspace Management launcher. It fuzzy-picks a top-level folder under `~/Projects` (via `fzf`) and opens it as a Herdr workspace, focusing the existing workspace if one already carries the derived label instead of creating a duplicate.
- **Key Features**: **Single user flow: pick → focus-or-create.**  * **Action `open` (`Open project`, `contexts=["workspace"]`):** thin launcher. No picker logic itself; just opens the `picker` pane. * **Pane `picker` (`

### [2026-09-08] marcelpanse/herdr-osx-menubar
- **Overview**: `marcelpanse/herdr-osx-menubar` (`herdr-osx-menubar` v0.2.0, `min_herdr_version 0.8.2`, `platforms=["macos"]`) is a **macOS menu-bar companion for Herdr**, not an in-Herdr pane or workspace orchestrator.
- **Key Features**: **What the user sees — all outside Herdr:**  * **Menu-bar icon + badge + blink:** At rest an AppKit template image (auto light/dark, inverted when open). Overlay count badge when any agent is not `idl

### [2026-09-09] upstash/herdr-upstash-box
- **Overview**: `upstash/herdr-upstash-box` (`upstash.box`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a **Session & Workspace Management** plugin that runs a coding agent in a remote Upstash Box instead of locally.
- **Key Features**: **Declared Herdr surface: 16 actions + 7 panes, no `[[events]]`, no HTTP endpoints, no daemon.**  Actions (all `node dist/action.js`, dispatched via `HERDR_PLUGIN_ACTION_ID` in `src/action.ts` → `src/

### [2026-09-09] hamzahraihan/herdr-better-workspace
- **Overview**: `hamzahraihan/herdr-better-workspace` (`herdr-better-workspace`, `Better Workspace v0.1.0`) is an interactive **Open Workspace folder picker** for Herdr. Instead of typing `herdr workspace create --label … --cwd …`, the user presses `prefix+space`, browses the filesystem in a fullscreen mouse-capable Bubble Tea TUI, and opens the chosen directory as a focused Herdr workspace — or as a new `herdr worktree create` checkout.
- **Key Features**: **What the user sees:**  * **Folder browser TUI (`internal/ui/model.go`):** pinned rows `✓ Open this folder`, `⎇ Open with new worktree`, `⌂ Home`, `↑ ..`, then alpha-sorted directories (`▪ name/`), t

### [2026-09-09] nicksenap/grove-herdr
- **Overview**: `grove-herdr` is a thin bidirectional bridge between the external **Grove (`gw`) workspace manager** and Herdr, not a workspace orchestrator in its own right. Pressing `prefix+shift+g` in Herdr opens a minimal `Grove` popup that prompts for a name and `exec`s `gw create <name>`; Grove then calls back into Herdr via `post_create` / `pre_delete` hooks to open/focus or close a matching Herdr workspace at that checkout path.
- **Key Features**: **What the user sees is one popup and two lifecycle side-effects:**  * **Create popup (`[[panes]] id=create`):** `title: Grove`, `placement: popup`, `72x18`, `command: ["./hooks/herdr-create.sh"]`. No

### [2026-09-09] timmo001/herdr-workflow-watch
- **Overview**: `Workflow Watch` is a display-augmentation plugin in Session & Workspace Management, not a workspace orchestrator. It watches the **current pushed branch of every open Git-backed Herdr workspace** and publishes a single sidebar token `$timmo_workflow_watch` per workspace: `CI: !2` for runs needing attention, `CI: ?` unavailable, `CI: …` loading, `CI: ↻` queued/running, `CI: ✓` success (opt-in), `CI: ○` idle (opt-in).
- **Key Features**: **Background watcher (`start` / `watch`):**  * Discovers all workspaces on every `pollSeconds` (default 30s). Resolves checkout via `workspace.worktree.checkoutPath` else focused pane `cwd` (`services

### [2026-09-09] poislagarde/herdr-worktree-cleanup
- **Overview**: `poislagarde.worktree-cleanup` (`Worktree Cleanup`, `v0.4.0`, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a conservative, fail-closed janitor for Herdr linked Git worktrees. It reclaims explicitly-approved disposable ignored files on every close, and removes the checkout itself only when Git reports no tracked dirt, no non-ignored untracked files, and no protected ignored files.
- **Key Features**: **What the user sees:** seven headless commands, no panes, no picker, no daemon, no HTTP endpoints.  From `herdr-plugin.toml`:  * `check` (`workspace`): dry-run filesystem eligibility for the current 

### [2026-09-09] dkbo/herdr-scm
- **Overview**: `herdr-scm` (`id: herdr-scm`, `v0.2.0`, `min_herdr_version 0.9.0`, `platforms = ["linux"]`) is a **read-only, multi-repo source-control overview panel** for the current Herdr workspace. It is the VS Code Source Control sidebar generalized to a whole workspace tree: every `git` repo discovered under the workspace's live pane `cwd`s, with branch / ahead-behind, grouped changed files (`Staged` / `Changes` / `Untracked`), and a diff for the selected file.
- **Key Features**: **Declared Herdr surface — 1 pane + 2 actions, 0 events, 0 endpoints:**  * `[[panes]] scm` (`title: SCM`, `placement: split`, `command: ["./target/release/herdr-scm"]`). * `open-scm` → `bash scripts/o

### [2026-09-09] CedarVerse/herdr-vergent
- **Overview**: `herdr-vergent` is a convergent, declarative session seeder for Herdr. The user authors one TOML file — `projects.toml` in `HERDR_PLUGIN_CONFIG_DIR`, schema v3: `[[workspace]] -> [[workspace.tab]] -> [[workspace.tab.pane]]` — and vergent converges the live server toward that file on every server boot.
- **Key Features**: **Desired-state model (`load_model` in `bin/vergent.py`, `projects.example.toml`):**  * `name` required at every level, unique in scope (workspace global, tab per-workspace, pane per-tab). Model keeps

### [2026-09-10] vika2603/herdr-client
- **Overview**: `vika2603/herdr-client` is not a Session & Workspace Management end-user plugin in the sense of the ledger peers (`sessionizer`, `sesh`, `workspace-manager`, `spreader`, `resurrect`). It is the **Go SDK and plugin framework for Herdr** itself — generated against `herdr 0.9.0 / protocol 22`.
- **Key Features**: ### Full socket API coverage  `herdr` exposes one typed `Params` + `Result` pair per method. The scanner's socket-call list and `internal/e2e` confirm coverage of:  * **Session:** `session.snapshot`, 

### [2026-09-10] wxomi/herdr-session-titles
- **Overview**: `wxomi/herdr-session-titles` (`Session Titles`, `v0.4.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a zero-dependency Python titling utility in Session & Workspace Management. It does not create workspaces, launch agents, or provide UI of its own.
- **Key Features**: **What the user sees:** two bold/dim sidebar rows configured in `config.toml`: ```toml [ui.sidebar.agents] rows = [["state_icon", {token="$session", bold=true}], [{token="$location", dim=true}]] ``` e

### [2026-09-10] poislagarde/herdr-pr-worktree
- **Overview**: `poislagarde.pr-worktree` (`PR Worktree`, `v0.1.1`, `min_herdr_version 0.9.0`) is a narrow, on-demand Session & Workspace Management launcher that answers one question: given a pasted `https://github.com/owner/repo/pull/123` URL, open that PR's exact head branch and commit as a native Herdr linked worktree beneath the repository's existing space.
- **Key Features**: **Single user flow: paste URL → focused worktree space.**  * **Action `open` (`New worktree from GitHub PR`):** thin launcher (`plugin.py`). No picker logic itself. * **Pane `prompt` (`placement="popu

### [2026-09-11] vika2603/herdr-palette
- **Overview**: `herdr.palette` (`Command Palette`, `v0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) is an editor-style command palette for Herdr. One key-bound action opens a centered `popup` that merges four sources into a single fuzzy-filterable list — Herdr's own built-ins, `[[keys.command]]` custom commands, every other installed plugin's actions, and live `workspace:` / `tab:` / `pane:` / `agent:` go-to targets — and runs the selection.
- **Key Features**: **What the list contains (`internal/palette/source.go`, `session.go`, `custom.go`, `internal/catalog/catalog.go`):**  * ** `herdr:` built-ins — hand-maintained in `catalog.Entries()`:** `workspace.new

### [2026-09-11] metcalfc/herdr-exe
- **Overview**: `metcalfc/herdr-exe` (`id: exedev`, `v0.1.1`, `min_herdr_version 0.9.0`) is a Shell (`bash`, ~1240 LOC) plugin that treats **exe.dev VMs as Herdr workspaces companions** — not disposable sandboxes. The thesis, stated in `README.md` and enforced in code and tests, is that VMs are persistent (many run 24/7) and the plugin must **never stop, restart, or delete a VM on its own**.
- **Key Features**: No daemons, HTTP endpoints, or sockets. All capability is 7 headless actions + 5 interactive popup panes + 1 startup + 7 event subscriptions + 1 link handler, all implemented in `bin/exe-herdr`.  **Ac

### [2026-09-11] odiumuniverse/herdr-smart-nav
- **Overview**: `smart-nav` (`Smart Nav`, `v0.1.0`, `min_herdr_version 0.7.0`) is a Session & Workspace Management navigator that ports `vim-tmux-navigator` to Herdr and then extends it past panes. One key family — `Ctrl+h/j/k/l` — moves through four levels in order: Neovim windows → Herdr panes → Herdr tabs → Herdr workspaces (spaces).
- **Key Features**: What the user gets is directional movement with no picker, pane, daemon, or background service:  **Four global actions (from `herdr-plugin.toml`):** - `smart-nav.left` — `Smart navigate left (nvim/pan

### [2026-09-12] umutciloglu/herdr-session-manager
- **Overview**: **Session Manager (`herdr-session-manager`, `v0.1.1`, `min_herdr_version 0.9.0`, `linux`/`macos` only)** is two products in one Rust workspace (~27.8k LOC):
- **Key Features**: ### `hsm` surface  From `crates/hsm/README.md` + `crates/hsm/src/cli.rs` / `commands/`:  ``` hsm browse [--pane-mode] | ask [--pane-mode] hsm open <address-or-prefix> [--target current|split|split-dow

### [2026-09-12] alexeyco/herdr-open-in-zed
- **Overview**: `open-in-zed` (`id: open-in-zed`, `v0.1.0`) is a minimal, single-purpose bridge in **Session & Workspace Management**: one keypress inside a Herdr workspace opens that same directory in the Zed editor in a new window via `zed -n <dir>`.
- **Key Features**: Declared surface in `herdr-plugin.toml` is intentionally tiny: **1 action, 0 panes, 0 events, 0 startup hooks, 0 HTTP endpoints.**  * **Action `open` (`Open in Zed`, `contexts=["workspace"]`):** `comm

### [2026-09-12] ruttydm/herdr-espalier
- **Overview**: **Espalier** (`espalier.worktree`, `0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a Session & Workspace Management cold-start plugin. Install it once; each repository opts in with a repo-owned YAML file.
- **Key Features**: What the user gets, verified in `herdr-plugin.toml`, `hook.sh`, and `README.md`:  **Automatic setup on create:** - Subscriptions: `worktree.created -> bash hook.sh`, `workspace.created -> bash hook.sh

### [2026-09-13] deepshape-ai/herdr-hive
- **Overview**: **Herdr Hive** is not a picker, renamer, or worktree bootstrapper like most Session & Workspace Management ledger peers. It is a **team session-sharing system** with two halves:
- **Key Features**: ### Bee user surface  `bee/plugin/herdr-plugin.toml` declares:  * `[[startup]] command = ["./bee", "restore"]` * 4 headless actions: `configure` (`Bee: configure sharing` → `./bee open`), `enable`, `d

### [2026-09-13] rapha4lx/herdr-worktree-stack
- **Overview**: `worktree-stack` (`Worktree Stack`, `v0.3.0`) is a Linux-only, Shell-based Session & Workspace Management plugin that closes the Docker lifecycle gap around Herdr linked worktrees. Herdr's native `worktree remove` deletes only the git checkout, leaving any `docker compose` containers, networks, and volumes orphaned; this plugin tears that per-worktree stack down by Docker label on `worktree.removed`, and — per its manifest and `setup.sh` — mounts an isolated stack on `worktree.created` / manual `up`.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **2 events + 3 headless actions**. No `[[panes]]`, no `[[startup]]`, no HTTP endpoints, no picker UI, no daemon.  **Automatic hooks:**  * `worktree.created -

### [2026-09-13] dimitri4d/herdr-pane-mover
- **Overview**: `dimitri4d/herdr-pane-mover` — manifested as `herdr-pane-mover / Herdr Pane Mover v0.1.0` — is a narrow layout-rearrangement utility in Session & Workspace Management. It does not create projects, bootstrap worktrees, launch agents, or manage sessions. Its sole job is to move the currently running pane, live without restarting its PTY/process, beside another tab or pane, into a new tab, or into a new workspace via Herdr's `pane move` API.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **3 actions + 1 pane, 0 events, 0 startup hooks, 0 HTTP endpoints**:  * `move` — `Move pane (picker)`, `./bin/pane-mover move`. Captures the calling pane via

### [2026-09-13] dima-m711/herdr-links
- **Overview**: `dima-m711/herdr-links` (`Herdr Links`, `v0.4.0`, `min_herdr_version 0.7.5`, `platforms=["macos"]`) is a narrow Session & Workspace Management utility, not a workspace orchestrator, picker, or bootstrapper like most ledger peers.
- **Key Features**: No panes, no `[[events]]`, no `[[startup]]`, no HTTP endpoints, no daemon, no picker UI.  Manifest surface in `herdr-plugin.toml`:  * 3 `[[actions]]`, all `["node", "./dist/cli.js", <verb>]`:   * `set

### [2026-09-14] lamngockhuong/herdr-worktree-setup
- **Overview**: `lamngockhuong/herdr-worktree-setup` (`lamngockhuong.worktree-setup`, `0.1.0`) is a zero-UI, event-driven cold-start fix for Herdr linked worktrees. `git worktree add` only materializes tracked files, so per-checkout ignored state like `.env.local`, `.npmrc`, or Rails credentials is left behind; on `worktree.created` this plugin copies that state across, optionally links shared directories, seeds from committed `.example` placeholders, and runs trust-gated setup commands.
- **Key Features**: No panes, pickers, daemons, HTTP endpoints, or sockets. Surface is one event plus one manual action:  **Hook:** `worktree.created -> ["node", "src/index.mjs"]`  **Action:** `init-config` (`Create .her

### [2026-09-14] expnn/herdr-plugin-jj-workspace
- **Overview**: This is a **Session & Workspace Management** plugin that brings native Jujutsu (`jj`) workspace lifecycle into Herdr, mirroring Herdr's built-in git-worktree flow. Triggering `prefix+a` creates a new `jj workspace add` checkout under `~/.herdr/workspaces/<repo>/<slug>` and opens it as a new Herdr tab with the coding agent on the left and a setup terminal on the right; `prefix+d` opens a review-then-confirm dialog that safely unregisters, deletes, and closes that checkout.
- **Key Features**: **Declared surface in `herdr-plugin.toml` (v0.5.0, `min_herdr_version 0.7.0`, `linux`/`macos` only):** 3 headless actions + 2 overlay panes, no `[[events]]`, no `[[startup]]`, no HTTP endpoints.  * `n

### [2026-09-14] rapha4lx/herdr-secrets
- **Overview**: `rapha4lx/herdr-secrets` (`secrets` / `Secrets`, `v0.2.0`) is a workspace-scoped `.env` viewer for Herdr, not a workspace orchestrator. Per `README.md` and `herdr-plugin.toml`, it adds a **Secrets** modal (`popup`) and a fixed side panel (`split`) that list `.env` and `.env.<suffix>` files in the focused project's root, show `KEY | value` pairs masked by default, and allow deliberate reveal and OSC52 clipboard copy without polluting scrollback or logs.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 2 actions + 2 panes, no events, no HTTP endpoints.**  * `secrets.open` — `Secrets: open modal`, `contexts=["workspace"]`, `command=["bash","open.sh"]`. 

### [2026-08-19] SpaceK33z/herdr-worktrees
- **Overview**: `herdr-worktrees` (`id: worktrees`, `v0.2.0`, `min_herdr_version 0.7.4`, `macos`/`linux`) is a Rust single-binary Herdr plugin for git-worktree fleet work from inside Herdr. It replaces Herdr's built-in `New worktree` prompt with a fuzzy `fzf` popup to switch, create, update, and remove worktrees with live branch-sync, PR review, and dirty-state context.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 3 actions + 3 panes, no `[[events]]`, no HTTP endpoints.**  * `worktrees.open` → `./target/release/herdr-worktrees open picker` — switch or create. * `w

### [2026-08-28] piesuke/herdr-worktree-bootstrap
- **Overview**: `piesuke.herdr.worktree.bootstrap` (`WorktreeBootstrap`, `v0.1.0`, `min_herdr_version 0.7.1`, `linux`/`macos` only) is a Rust cold-start plugin for Herdr linked worktrees. It is entirely passive: on `worktree.created` it runs `./target/release/herdr-worktree-init`, which reads per-repo settings from `.herdr/worktree-bootstrap.{toml,yaml,yml}` in the source repo and bootstraps the new checkout through a fixed pipeline — `git update → pre hooks → copy → install → post hooks` — fail-fast, with a toast on completion and a full report pane plus optional rollback on failure.
- **Key Features**: **Lifecycle — five phases in `src/lib.rs::run()`:**  * `git update` (`bootstrap::git_update`): opt-in via `[git] update = true`. Default `git fetch --all --prune`; overridable via `command`, e.g. `["g

### [2026-09-04] thejiajun/herdr-autoname
- **Overview**: `thejiajun/herdr-autoname` (`thejiajun.autoname`, `Herdr Autoname`) is a Python, stdlib-only automatic-naming plugin in **Memory (Session & Workspace Management)**. It renames Herdr **workspaces, tabs, and panes** from the content of recent coding-agent conversations, rather than from directory names or static rules.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`, `min_herdr_version 0.9.0`, `macos`/`linux` only):**  * **Actions (3, headless except via popup):**   * `rename-now` → `python3 scripts/rename_workspaces.

### [2026-09-10] adriankarlen/herdr-sesh-minimal
- **Overview**: `adriankarlen/herdr-sesh-minimal` (`adriankarlen.sesh-minimal`, `0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`) is a minimal port of `joshmedeski/sesh` for Herdr. It merges live Herdr workspaces, explicitly configured sessions from `sesh.toml` / `config.toml`, `zoxide` frecency, and an ad-hoc directory path into a single ordered list, then either focuses an existing workspace or creates a new one with declarative startup tabs/commands.
- **Key Features**: **User commands (`internal/app/app.go`, `cmd/herdr-sesh-minimal/main.go`):**  * `picker [--config PATH] [--fzf]` — collect all sources, run `picker.Run` (`gum`) or `picker.RunFZF` (`fzf`), then `conne

### [2026-09-12] fru-dev3/glyph
- **Overview**: `fru-dev3/glyph` is two things bundled in one repo: a standalone `zsh` identity wrapper for coding-agent CLIs, plus a thin Herdr adapter (`glyph.usage` / `Glyph Usage` v0.2.0) that surfaces part of it inside Herdr.
- **Key Features**: ### Herdr-declared surface (`herdr-plugin/herdr-plugin.toml`)  No `[[events]]`, no `[[startup]]`, no HTTP endpoints, no sockets. Entire surface is 1 pane + 3 actions:  * **Pane `usage` (`Agent usage`,

### [2026-09-14] karanpatel1993/herdr-nav
- **Overview**: `herdr-nav` is a file-navigation, code-search, and Java-debug assistant that runs inside Herdr popups. It is a single ~large `bash` script (`herdr-nav`) plus three tiny `sh` shims, wiring external Unix tools — `fzf`, `fd`, `bat`, `ripgrep`, optionally `ast-grep` + `jq`, `lf`, and `jdb` — into Herdr-scoped pickers.
- **Key Features**: No daemons, no `[[events]]`, no HTTP server, no sockets — confirmed by empty scanner socket list. Everything is on-demand via 9 popup/split entrypoints plus management commands:  **Navigation / search

### [2026-09-14] arthurnw/herdr-unread
- **Overview**: `arthurnw/herdr-unread` (`arthur.unread` / `Unread`, `v0.1.0`) is a small, manual attention marker for Herdr agent sessions. The user explicitly toggles the focused agent pane to unread; the plugin then prefixes that workspace's sidebar row with `*` until the pane is focused again, its agent status changes, or it is toggled off.
- **Key Features**: **Single user verb:**  * `toggle` — `Toggle unread`, `contexts = ["pane"]`, `["python3", "unread.py", "toggle"]`. Resolves the focused pane (`HERDR_PANE_ID` or `snapshot.focused_pane_id`), inserts or 

### [2026-09-15] mmjang/herdr-omni
- **Overview**: Herdr Omni is a unified fuzzy command palette for Herdr in the Session & Workspace Management picker family. It runs as a single `popup` (`80% x 80%`) Bun + OpenTUI application that merges static Herdr verbs, live workspaces / tabs / agents / unopened worktrees, and saved Codex / Claude / OpenCode sessions into one searchable list with `Enter`-to-jump semantics.
- **Key Features**: **Unified search and browsing:** * Prefix-scoped search: `@` workspaces + worktrees, `>` live + saved agents, `:` static actions; bare query searches all. Implemented in `src/search.ts:searchResults()

### [2026-09-15] edxeth/herdr-pi-tree
- **Overview**: `herdr-pi-tree` (`Herdr Pi Tree`, `v0.1.3`, `min_herdr_version 0.9.0`) is a **Herdr-only sidebar renderer for Pi coding agents**. It replaces Herdr's flat Agents / Spaces lists with a stable project tree: nested subagents to true depth, git-worktree branches hung off their checkout, colored inline git stats, and stable numeric focus indices (`1:`, `2:`).
- **Key Features**: **What the user sees:**  * **Tree Agents panel:** one row per agent (`logo · title`), workspace group headers (`$group` / `$group_stale` / `$group_parent`), `├─`/`└─` corners, `│` guides, `​`-protecte

### [2026-09-15] orcchg/herdr-topstrip
- **Overview**: `orcchg/herdr-topstrip` is a tiny, zero-UI layout enforcer in Session & Workspace Management. Every newly created workspace (space) or tab is automatically split into a narrow top shell strip (`top-strip`, ~15% height) over a wide work pane, both rooted in the space directory.
- **Key Features**: What the user gets, per `README.md` + `herdr-plugin.toml` + `ensure.sh`:  * **Automatic layout on `workspace.created` / `tab.created`:** a one-pane tab becomes top-strip + wide-pane. Already-split tab

### [2026-09-15] logocode/herdr-linear-launcher
- **Overview**: `Linear Launcher` (`logocode.linear-launcher`, `v0.3.1`, `min_herdr_version 0.9.0`, `macos`/`linux` only) is a **Session & Workspace Management** launcher that turns Linear triage into a background worktree flow.
- **Key Features**: No daemons, no Herdr event subscriptions, no HTTP server. All capability is on-demand via CLI verbs in `plugin.mjs:main()`:  * `open` — thin launcher: `herdr plugin pane open --plugin logocode.linear-

### [2026-09-15] dorzey/herdr-sort-spaces-plugin
- **Overview**: `dorzey.sort-spaces` (`Sort Spaces`, `v0.1.0`, `min_herdr_version 0.8.0`) is a minimal Session & Workspace Management utility that keeps Herdr workspaces (Spaces) ordered lexicographically by `label`. It does not create, bootstrap, snapshot, or navigate workspaces like most ledger peers — it only reorders them. The user can sort on demand A-Z / Z-A, or let the plugin re-sort ascending automatically whenever Herdr fires `workspace.created` or `workspace.renamed`.
- **Key Features**: **What the user gets is two verbs plus keybinding maintenance — no panes, pickers, daemons, HTTP endpoints, or agent features:**  * **Manual sort actions (both `contexts = ["workspace"]`):**   * `sort

### [2026-09-15] saiyajosh/herdr-schlepr
- **Overview**: **Schlepr** (`id: schlepr`, `v0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) is a keyboard-first move utility for live Herdr terminals. It does not create layouts, bootstrap worktrees, or manage agents; it relocates what already exists: one live pane to another tab / new tab / new workspace, or one complete tab to another workspace / new workspace.
- **Key Features**: ### User-visible surface  `herdr-plugin.toml` declares **3 actions + 1 pane, no `[[events]]`, no `[[startup]]`, no HTTP endpoints**:  * `schlepr.move` (`Move pane or tab…`, `contexts=[pane]`) → `node 

### [2026-09-15] wyattjoh/herdr-plugin-move
- **Overview**: `wyattjoh/herdr-plugin-move` (`wyattjoh.move-pane` / `Move Pane`, `v0.1.0`) is a narrow Session & Workspace Management utility that relocates the currently focused pane into a different, already-existing Herdr tab.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1 action + 1 pane, 0 events, 0 startup hooks, 0 HTTP endpoints**:  * **Action `move-pane`** (`Move pane`, `contexts=["pane"]`, `["bun","run","src/open.ts"]

### [2026-09-15] ubuntudroid/herdr-worktree-force-remove
- **Overview**: `ubuntudroid.worktree-force-remove` (`Worktree force remove`, `v0.2.0`, `min_herdr_version 0.9.0`) is a narrow Session & Workspace Management janitor for Herdr linked Git worktrees. It exists as a workaround for upstream `herdrdev/herdr#1797`: Git refuses plain `git worktree remove` on any checkout containing a populated submodule, and Herdr's built-in **Delete worktree checkout...** only offers a forced retry on a dirty-tree error, so submodule checkouts dead-end. The plugin provides a single `popup` pane that re-implements Herdr's safety checks, asks for an explicit `y/N`, then runs `herdr worktree remove --workspace <id> --force`. It is ~117 LOC of Shell, with no daemon, picker family, or bootstrap logic.
- **Key Features**: What the user gets is one interactive flow, no background automation:  * **Workspace-to-worktree resolution:** reads the invocation target from Herdr context, then verifies via `herdr worktree list --

### [2026-09-15] LeandroMAcosta/herdr-send-to-machine
- **Overview**: `leandroacosta.send-to-machine` (`Send to machine`, `v0.1.0`) is a small Shell (`418 LOC`) Herdr plugin for **cross-machine work handoff**. From the repository in front of you it pushes the current branch, uncommitted tracked edits, untracked files, and — for Claude Code only — the newest local transcript to a saved Herdr machine over SSH, then creates a workspace there and resumes `claude --resume <uuid>` in its root pane.
- **Key Features**: What the user gets is one keypress flow, not a fleet manager:  * **Action `send` (`Send work to remote machine`, `contexts=[workspace,pane,global]`):** thin launcher. It resolves `focused_pane_cwd || 

### [2026-09-16] lucidstack/herdr-services
- **Overview**: `lucidstack.herdr-services` (`Services`, `v0.1.0`, `min_herdr_version 0.9.0`, `macos`/`linux` only) is a **dev-server / listening-port observer** for Herdr. A detached Rust detector enumerates TCP listeners on the host plus Docker-published ports, attributes each to the owning Herdr workspace by pane ancestry / cwd / command line, probes TCP liveness, and surfaces the result ambiently as `svc_N` sidebar tokens and on-demand in a popup picker for open / copy-URL / kill.
- **Key Features**: **User-visible Herdr surface** (`herdr-plugin.toml`): one `[[startup]]`, three headless actions, one popup pane, one `[[build]]`:  * `pick` — `Services: open picker` (`workspace,pane`) → `bin/herdr-se

### [2026-09-16] rhinoc/herdr-quickpad
- **Overview**: `rhinoc/herdr-quickpad` — manifested as `rhinoc.herdr-workbench / Quickpad v0.1.0` — is a temporary scratch surface for Herdr, not a workspace orchestrator. It opens a single centered `popup` with two full-screen tabs: **Notes**, an auto-saving Markdown scratchpad, and **Terminal**, a persistent home-directory shell that survives popup close/reopen.
- **Key Features**: **Declared Herdr surface — 1 action + 1 pane + 1 startup, no events, no HTTP endpoints:**  * `toggle` (`Toggle Quickpad`, `contexts=["global"]`, `node index.js toggle`): try `popup.close`; if the daem

### [2026-09-16] shunia/herdr-pane-index
- **Overview**: **Pane Index** (`shunia.pane-index`, `0.1.0`, `min_herdr_version 0.9.0`) is a zero-UI, event-driven labeling utility in Session & Workspace Management. On every layout shift it rewrites each pane's top-border label to `w<workspace>:t<tab>:p<pane>` — e.g. `w1:t2:p3 - Refactor auth middleware` — where `w/t/p` are 1-based display positions, not Herdr public ids, and the suffix is the title the pane already carried (typically an agent session name).
- **Key Features**: **Labeling model:**  * Workspace index and tab index are snapshot display order — the same order the tab bar numbers them. Code in `iter_position_groups()` in `pane-index.py` enumerates `snapshot["wor

### [2026-09-16] yafeishi/herdr-session-history
- **Overview**: **Herdr Session History (`herdr-session-history`, v0.2.1, `min_herdr_version 0.9.0`)** is a per-pane conversation-history rail for Herdr. When invoked from a focused agent pane it opens a narrow `split` curses pane that lists the user-turns of *that pane's current session only*, with a hover preview card, live search, and click / `Enter` / `↑↓` to drive the live agent's scrollback to the selected prompt.
- **Key Features**: **Declared Herdr surface — 1 action + 1 pane, no events, no HTTP:**  * `open` (`Open session history`, `python3 herdr_session_history.py open`): resolves the pane to bind, reuses an existing rail if a

### [2026-09-16] leonardoacosta/herdr-menu
- **Overview**: `Herdr Menu` (`leonardoacosta.herdr-menu`, `v0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`) is a pure-POSIX-shell CRUD wrapper over Herdr's native pane, tab, and workspace lifecycle. It provides no new domain model — no worktrees, layouts, sessions, agents, or persistence. It exposes the built-in `herdr pane|tab|workspace` verbs as 15 discrete Herdr actions plus a single hand-rolled `popup` picker that groups those same 13 operational actions for keyboard selection.
- **Key Features**: Declared surface in `herdr-plugin.toml`: **1 `[[startup]]` + 1 `[[panes]]` + 15 `[[actions]]`**. No `[[events]]`, no HTTP endpoints, sockets, daemons, or link handlers — consistent with the scanner fi

### [2026-09-17] shved270189/herdr-worktreeinclude-local
- **Overview**: `herdr-worktreeinclude-local` (`Worktree Include Local`, `v0.1.0`) is a zero-UI, event-driven cold-start fix for Herdr linked worktrees. A fresh `git worktree` contains only tracked files; this plugin restores selected gitignored local state — `.env*`, `node_modules/`, local configs — from the source checkout into each new worktree at creation time.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **one `[[events]]`, no `[[actions]]`, no `[[panes]]`, no HTTP endpoints, no daemon, no picker**.  * **Hook:** `worktree.created -> ["bash", "copy-wo

### [2026-09-17] akpw/herdr-last-workspace
- **Overview**: `akpw/herdr-last-workspace` (`Last Workspace`, `v0.2.0`, `min_herdr_version 0.7.0`) is a Session & Workspace Management plugin that implements tmux-style `last-window` toggling for Herdr workspaces with per-workspace tab restoration. It maintains a Most-Recently-Used (MRU) stack of `workspace_id`s plus a `workspace_id -> tab_id` map, so invoking one action bounces `A ↔ B` and lands on the tab you were previously using in each workspace.
- **Key Features**: **Single user-visible verb:**  * `akpw.last-workspace.toggle` (`Last workspace`, `contexts=[global, workspace]`): `python3 last_workspace.py toggle`. Resolves live workspaces, self-heals the stack hea

### [2026-09-17] rchougule/herdr-pane-reopen
- **Overview**: `rchougule.reopen` (`Reopen`, `v0.1.1`, `min_herdr_version 0.9.1`, `macos`/`linux`) is **undo-close for Herdr**. It captures the pane, tab, or workspace you just closed and recreates it in its original place — same workspace, same tab order, same split geometry and ratios, same `cwd`s and labels — then resumes its occupant.
- **Key Features**: **User verbs — 3 headless `global` actions, no daemon socket, no HTTP:**  * `reopen-last` (`target/release/reopen reopen-last`): pop the newest `closed.json` entry and restore it. Bound by the user to

### [2026-09-17] gAmUssA/herdr-notify
- **Overview**: `gAmUssA/herdr-notify` (`gamussa.notify` / `Agent notifications`, `v0.1.1`, `min_herdr_version 0.9.0`, `macos` only) is a narrow, server-side attention plugin in **Session & Workspace Management**. It exists for one gap explicitly stated in `herdr-plugin.toml` and `notify.sh`: Herdr's built-in `[ui.toast]` / `herdr notification show` returns `{"shown":false,"reason":"no_foreground_client"}` when detached — the normal state for an always-on server and exactly when a finish notice matters most.
- **Key Features**: **What the user gets:**  * **Filtered finish/input banners:** `notify.sh` subscribes only to `pane.agent_status_changed` and notifies only on `done` (`turn complete` + `Glass` sound) and `blocked` (`n

### [2026-09-17] mayaton/herdr-repo-picker
- **Overview**: `herdr-repo-picker` (`v0.2.0`, `min_herdr_version 0.7.4`, `linux`/`macos`) is a **ghq-to-workspace launcher** in Session & Workspace Management. It opens a centered `60% x 60%` popup, fuzzy-searches `ghq list` output with keyboard or mouse, and on pick either focuses an existing workspace with the same basename or creates a new focused workspace and runs a configured launch command (`claude` by default).
- **Key Features**: Single user flow: **filter → open-or-focus**, exposed as one action + one pane, no daemons or background services:  * **Action `open-picker` (`Open repo picker`):** thin launcher `bash scripts/open-pi

### [2026-09-17] ClockworkNet/herdr-claude-finder-scratchpad
- **Overview**: `cw.claude-scratchpad` (`v0.1.0`, `min_herdr_version 0.8.2`, `platforms=["macos"]`) is a narrow, macOS-only, Claude-Code-only utility in Session & Workspace Management. It resolves the filesystem scratchpad for the Claude session running in the focused Herdr pane — `/private/tmp/claude-<uid>/<encoded-cwd>/<session-uuid>/scratchpad` — and surfaces it in macOS Finder, reusing an existing Finder window when possible.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 4 headless `contexts=["pane"]` actions, no panes, no events, no HTTP endpoints, no startup:**  * `open` → `/bin/bash bin/run.sh open --quiet` — focus/op

### [2026-09-17] bearylabs/herdr-autofetch
- **Overview**: `herdr-autofetch` (`Herdr Git Autofetch`, `v0.1.0`, `min_herdr_version 0.9.1`, `linux`-only) is a small Shell maintenance utility in Session & Workspace Management. It keeps every Git repository backing currently-open Herdr workspaces fresh by running read-only `git fetch --all --prune` on a schedule.
- **Key Features**: What is actually in the code — one script (`autofetch.sh`), three headless actions, no panes, no events, no HTTP endpoints:  **Three `contexts=["global"]` actions in `herdr-plugin.toml`:**  * `list` →

### [2026-09-17] ananianatid/herdr-ssh-sessions
- **Overview**: `ananianatid/herdr-ssh-sessions` — installed as `anatide.ssh-sessions / SSH Sessions v0.1.0`, `min_herdr_version 0.9.0` — makes remote shells visible in Herdr.
- **Key Features**: **Detection:** * Inspects `foreground_processes[]` from `pane.process_info` for `commandName == ssh` or — if `DETECT_MOSH=true` — `mosh`. Handles `ssh.exe`, absolute paths, `C:\Windows\...\ssh.exe`. *

### [2026-09-17] kadaliao/herdr-space-index
- **Overview**: `kadaliao.space-index` (`Space index`, `v0.1.0`) is a minimal, display-only augmentation in **Memory (Session & Workspace Management)**. It solves one gap: Herdr's `switch_workspace = "prefix+shift+1..9"` jumps by 1-based sidebar position, but expanded Space rows have no built-in number token — only `state_icon`, `state_text`, `workspace`, `branch`, `git_status`, plus custom `$tokens`.
- **Key Features**: **What the user gets:** numbered Space rows, e.g. `1 ● Douban / 2 ● Downloads`, that track sidebar order.  Declared surface in `herdr-plugin.toml` is intentionally tiny — **1 `[[startup]]` + 4 `[[even

### [2026-09-18] webdavis/herdr-workspace-jump
- **Overview**: `herdr-workspace-jump` (`Workspace Jump`, `v0.1.0`, `min_herdr_version 0.7.0`) is a narrow, personal navigation plugin that fills two gaps the author states Herdr has no built-in for: **create-or-focus by label** and a **most-recently-used workspace toggle**. It is a ~2.5k LOC stable-Rust workspace with no UI of its own — ten headless manifest actions plus one `workspace.focused` event hook — that resolves a baked-in label against the live workspace list and either focuses the match or creates-and-focuses a new workspace at a baked-in `cwd`.
- **Key Features**: **What the user gets is three verbs from one binary (`./target/release/herdr-workspace-jump`):**  * `jump <label> <cwd>` — invoked by nine `[[actions]]` in `herdr-plugin.toml`: `jump_homelab`, `jump_d

### [2026-09-18] caneppelevitor/herdr-tmux-session-navigator
- **Overview**: `caneppelevitor/herdr-tmux-session-navigator` — manifested as `vitor.tmux-session-navigator / tmux Session Navigator v1.0.0` — is a `tmux choose-tree` clone for Herdr. Press `prefix+s` (user-bound), get a collapsible `workspace -> tab` tree with `├─>` / `└─>` connectors, `(attached)` / `*` focus markers, and a live ANSI preview strip underneath. `Enter` or a tmux-style jump key focuses the selection and exits.
- **Key Features**: **What the user sees:**  * **Tree:** one row per workspace plus one row per tab under expanded workspaces. Collapsed workspaces show `+`, expanded show `-`. Workspace rows show `status-dot label: N ta

