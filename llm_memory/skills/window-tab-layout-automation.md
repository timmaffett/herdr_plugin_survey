# Architectural Memory: Window, Tab & Layout Automation

This document tracks architectural patterns and previously surveyed extensions within the **Window, Tab & Layout Automation** domain.

## Surveyed Extensions Ledger

### [2026-06-17] alon-z/herdr-devup
- **Overview**: `alon-z/herdr-devup` (`alonz.devup`, v0.1.0) is a Herdr workspace plugin for per-project development layouts. A project declares tabs, split panes, and shell commands in `.herdr/dev.toml` (or a TOML file in the plugin config dir); the plugin spawns that layout via the Herdr CLI, then resolves a tunnel URL and rewrites dotenv-style files so servers that bake `NEXT_PUBLIC_*`-style vars at startup get the correct value.
- **Key Features**: **Three workspace actions** (declared in `herdr-plugin.toml` with `contexts = ["workspace"]`, invoked as `bun src/main.ts <up|sync|down>`):  * `up` — *Devup: start project layout*: builds all `[[tabs]

### [2026-07-02] lmilojevicc/herdr-tab-rename
- **Overview**: `herdr-tab-rename` (`Tab Auto-Rename`, v0.1.0, `min_herdr_version 0.7.0`) is a small Go daemon plugin for Herdr on Linux and macOS. It polls Herdr every 500ms and renames each tab to the basename of its focused pane's working directory (`~/Projects/foo` → `foo`). Once a tab is observed to have been manually renamed mid-session to something the daemon did not set, that tab is permanently locked and left alone until restart.
- **Key Features**: **Core behavior:**  * **Cwd-based auto-rename:** Desired label is `filepath.Base()` of the focused pane's `foreground_cwd`, falling back to `cwd` if empty. Implemented in `daemon.go:desiredLabel()`. *

### [2026-07-04] AVGVSTVS96/herdr-drovr
- **Overview**: `drovr` (`id: drovr`, v0.4.8, `min_herdr_version 0.7.4`, `linux`/`macos` only) is a Window, Tab & Layout Automation plugin for relocating live work instead of recreating it. It provides two keybound operations — move the focused **tab** to another workspace, or move the focused **pane** into any tab — via an `fzf` fuzzy picker running in a floating popup.
- **Key Features**: No background daemon, hooks, HTTP endpoints, or config schema. Capabilities are two headless actions plus one popup pane, all declared in `herdr-plugin.toml`:  * **`drovr.move-tab` — `Move tab to work

### [2026-07-05] furuhashin/herdr-synchronize-panes
- **Overview**: `synchronize-panes` (`Synchronize Panes`, v0.1.0, `min_herdr_version 0.7.0`) is a Window, Tab & Layout Automation plugin that provides a tmux-style `synchronize-panes` equivalent as a **one-shot broadcast** rather than continuous mirroring. The user hits `prefix+a`, types a command once in an overlay prompt, and that string is submitted via `herdr pane run` to every other pane in the current tab.
- **Key Features**: Key behavior is fully contained in two Node scripts plus manifest wiring — no daemon, hooks, or HTTP endpoints:  * **Broadcast to tab siblings:** Lists panes in the invoking tab and runs a single user

### [2026-07-06] blurname/herdr-git-tab-name
- **Overview**: `blurname/herdr-git-tab-name` (`blurname.git-tab-name`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a minimal stateless Herdr plugin that keeps the active tab label in sync with version control state. On every focus / pane / worktree transition it renames the current tab to the focused pane's Git branch, or to `detached:<short-sha>` on detached HEAD. It is explicitly motivated by worktree-heavy workflows where one tab contains panes from different branches and the tab bar should follow the currently focused pane.
- **Key Features**: **Single headless action:** * `blurname.git-tab-name.refresh` — `Refresh tab name from Git branch`, declared with `contexts = ["workspace", "tab", "pane"]`, `command = ["./update-tab-name.sh"]`. Inten

### [2026-07-07] dantehemerson/herdr-last-tab
- **Overview**: `dantehemerson.last-tab` (`Last Tab`, v0.1.0, `min_herdr_version 0.7.0`) is a Window, Tab & Layout Automation plugin that provides tmux-style back-and-forth navigation between Herdr tabs. Focus tab A, move to tab B, invoke the action, and Herdr focuses A; invoke again and it focuses B.
- **Key Features**: Single user-facing capability with two background maintainers — no daemon, popup, HTTP endpoint, or config schema:  * **`dantehemerson.last-tab.toggle` — `Last tab`:** Headless action declared with `c

### [2026-07-08] aarsh21/herdr-tab-title
- **Overview**: `aarsh21.tab-title` (“Tab Title”) is a Window, Tab & Layout Automation plugin that keeps Herdr tab bar labels in sync with pane activity in a tmux-like fashion. If the focused pane in a tab is running a foreground program (`vim`, `cargo`, `node`), the tab is titled with that executable basename; if the pane is at an idle shell, the tab is titled with the trailing component(s) of `foreground_cwd`/`cwd` (e.g. `api` or `me/api`).
- **Key Features**: **User-facing actions (all `contexts = ["workspace"]`, `platforms = ["linux","macos"]` in `herdr-plugin.toml`):**  * `start` → `bin/herdr-tab-title start`: spawn detached `watch` daemon if not already

### [2026-07-08] edouard-andrei/herdr-layout-tools
- **Overview**: `edouard-andrei/herdr-layout-tools` (`edi.layout-tools`, v0.4.0, `min_herdr_version 0.8.0`) is a **Window, Tab & Layout Automation** plugin for rearranging live Herdr panes without restarting them. It provides a visual popup layout editor plus two headless reshapers — equalize and main-left reshape — all applied **in place**: same `tab_id`, same `pane_id`s, processes untouched. The core trick, documented in `README.md` and `SKILL.md`, is to work around the lack of a topology-preserving Herdr primitive by parking panes in a transient scratch tab and replaying them into the original tab with `pane move`.
- **Key Features**: No daemon, hooks, HTTP endpoints, or config schema. Four headless actions + one popup pane declared in `herdr-plugin.toml`:  * **`open-editor` — `Open layout editor`**: `contexts = ["global","workspac

### [2026-07-08] yersonargotev/tabby
- **Overview**: `yersonargotev/tabby` (`yersonargotev.tabby`, v0.1.16, `min_herdr_version 0.8.0`, `macos` only) is a Window, Tab & Layout Automation plugin that keeps the **focused** Herdr tab label meaningful. One lease-owned Session Runtime per Herdr Session prefers a stable Significant Command (`nvim`, `codex`, `pnpm dev`) and falls back to a configured Working Directory Suffix (`/Users/me/dev/tabby` -> `tabby`).
- **Key Features**: **Label policy:** * Priority 1 - Significant Command: built-ins `nvim`, `lazygit`, `codex`, `claude` plus runner pairs `pnpm dev`, `npm test`, `go test`, `cargo run`. Ignores shells/wrappers (`zsh`, `

### [2026-07-08] wg1k/live-sync-panes
- **Overview**: `wg1k/live-sync-panes` (`live-sync-panes`, `1.0.0`, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a **Window, Tab & Layout Automation** plugin for driving every pane in the current tab at once. It offers two complementary modes: one-shot **Broadcast** — type a command once and submit it to all siblings — and continuous **Live Sync** — a dedicated pane you type into that mirrors every keystroke live, the tmux `synchronize-panes` equivalent.
- **Key Features**: No daemon, hooks, HTTP endpoints, or config schema. Two user-visible capabilities, each as a `[[panes]]` entrypoint plus a `[[actions]]` bridge plus a `[[keys.command]]` binding:  * **Broadcast comman

### [2026-07-09] qu8n/herdr-automatic-rename
- **Overview**: `qu8n/herdr-automatic-rename` (`herdr-automatic-rename`, v0.8.0) is a **Window, Tab & Layout Automation** plugin that keeps Herdr labels meaningful without user intervention. It combines two independently toggleable features in one engine: `NAME_TABS=1` auto-names each tab after its foreground program enriched with context — working directory, git branch, SSH host, or a coding-agent's reported task — while `AUTO_INDEX=1` prefixes workspaces, tabs and agents with their `1-9` jump-key number as `[N] <base>`.
- **Key Features**: **Tab auto-naming (`NAME_TABS`, default on):**  * Foreground-program naming via `pane process-info`: group-leader (`pid == pgid`) with `argv0 > argv[0] > name` preference, login-dash stripping, path b

### [2026-07-10] KokiKono/herdr-kanban
- **Overview**: `kokikono.herdr-kanban` (`herdr-kanban`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a terminal-native Kanban board that uses Herdr tabs as the execution side-effect of task state. Tasks live in three columns — `TODO / IN PROGRESS / DONE` — persisted in SQLite; moving a card to `IN PROGRESS` auto-creates a Herdr tab labeled with the task title and stores its `tab_id`, while `o`/`x` focus or close/unlink that tab.
- **Key Features**: No daemon, hooks, HTTP endpoints, or config schema. One overlay UI plus one launcher:  * **Board pane entrypoint `board`:** `title = "Kanban"`, `placement = "overlay"`, runs `exec "$HERDR_PLUGIN_ROOT/

### [2026-07-11] JacquesvanWyk/herdr-lazygit
- **Overview**: `JacquesvanWyk/herdr-lazygit` (`herdr-lazygit`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Window, Tab & Layout Automation launcher for [lazygit](https://github.com/jesseduffield/lazygit). It does not reimplement git UI or manage layouts broadly; it provides two toggle entrypoints — open lazygit beside current work in a right-hand split, or open it full-window in its own tab — with press-once-to-open / press-again-to-focus / press-while-focused-to-close semantics. Quitting lazygit with `q` naturally closes the host pane.
- **Key Features**: No daemon, hooks, HTTP endpoints, or config schema. The entire surface is one reusable pane plus two headless toggle actions declared in `herdr-plugin.toml`:  * **Pane `lazygit`:** `title = "lazygit"`

### [2026-07-11] dev-shimada/herdr-auto-tab-name
- **Overview**: `dev-shimada/herdr-auto-tab-name` (`dev-shimada.auto-tab-name`, v1.0.2, `min_herdr_version 0.7.0`) is a Window, Tab & Layout Automation plugin that keeps Herdr tab-bar labels readable without manual renaming. On every tab / pane / workspace / worktree lifecycle event it walks all workspaces and relabels each tab to the basename of its current working directory (`/tmp/projects/alpha` → `alpha`, `$HOME` → `~`).
- **Key Features**: **Event-driven full sync (no daemon):** * Single headless action `sync` — `Sync tab names now`, `command = ["node", "sync.mts"]`. Invoked manually via `herdr plugin action invoke dev-shimada.auto-tab-

### [2026-07-12] JacquesvanWyk/herdr-linear
- **Overview**: `JacquesvanWyk/herdr-linear` (`herdr-linear`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is an fzf-driven Linear client that lives inside Herdr. It does not talk to the Linear API directly and does not manage generic layouts; it provides a single interactive terminal UI — search My Todos / Projects / All-team issues, drill into an issue, create issues, change status — hosted in a Herdr split or tab that can be toggled with a keybinding.
- **Key Features**: Manifest surface in `herdr-plugin.toml` is minimal: one reusable pane + two headless toggle actions. No daemon, hooks, HTTP endpoints, or config schema.  * **Pane `linear`:** `title = "linear"`, `plac

### [2026-07-14] iurysza/herdr-pane-layouts
- **Overview**: `layouts` (`Pane Layouts`, v0.1.1, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** plugin for tmux-style geometry management. It reshapes the current tab in place — equalizing columns, cycling through five preset trees, or nudging the focused pane 2% in a cardinal direction — without restarting panes or losing scrollback/processes.
- **Key Features**: Manifest `herdr-plugin.toml` declares six fixed actions, all `command = ["python3", "src/cli.py", "<verb>"]`:  * `layouts.equalize` (`contexts = ["tab","pane"]`): arrange current tab as equal-width ve

### [2026-07-16] leonho/herdr-new-task
- **Overview**: `leonho/new-task` (`leonho.new-task`, `New Task`, v0.1.0, `min_herdr_version 0.7.0`, `macos`/`linux`) is a **Window, Tab & Layout Automation** launcher plugin. One keystroke opens a floating popup to fuzzy-pick a project directory, capture a natural-language task prompt and agent choice, then creates a new focused Herdr tab in the correct workspace/`cwd` and starts the agent there.
- **Key Features**: **Single user flow, two manifest entrypoints:**  * `open` action — `New task: pick dir, launch code agent`, `contexts = ["pane","workspace"]`, `command = ["bash","scripts/open.sh"]`. Intended binding 

### [2026-07-17] danbuhler/herdr-pane-topic-sync
- **Overview**: `danbuhler/herdr-pane-topic-sync` (`dan.pane-topic-sync`, `Pane Topic Sync`, v0.3.0, `min_herdr_version 0.7.0`) is a **Window, Tab & Layout Automation** plugin that keeps pane and tab labels semantically meaningful in agent-heavy sessions.
- **Key Features**: No daemon, popup pane, HTTP endpoint, or socket client. One headless script invoked in two ways:  **Manual action:** - `sync` — `Sync pane + tab topics`, `contexts = ["workspace","tab","pane"]`, `comm

### [2026-07-19] riq0h/tab-blank-number
- **Overview**: `riq0h.tab-blank-number` (`Tab Blank Number`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a minimalist Window, Tab & Layout Automation plugin whose entire job is to remove Herdr's default numeric tab labels (`"1"`, `"2"`, ...).
- **Key Features**: No daemon, popup pane, HTTP endpoint, keybinding, or config schema. The observable surface is one idempotent action plus four event subscriptions, all invoking the same script:  * **`riq0h.tab-blank-n

### [2026-07-19] riq0h/tab-process-name
- **Overview**: `riq0h/tab-process-name` (`Tab Process Name`, v0.2.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a minimalist **Window, Tab & Layout Automation** plugin that implements tmux-style `automatic-rename` for Herdr: each tab is labeled with its foreground process name (`zsh` · `nvim` · `claude`).
- **Key Features**: **Event-driven sync (primary path):** * One headless action: `sync` — `Sync tab process names now`, `command = ["node", "sync.mts"]`. Invocable manually via `herdr plugin action invoke riq0h.tab-proce

### [2026-07-22] KazBrekker1/herdr-hasr
- **Overview**: **Hasr** (`kazbrekker1.hasr`, `0.1.0`, `min_herdr_version 0.7.5`, `macos`/`linux`) — from Arabic حصر, “a complete tally” — is a **Window, Tab & Layout Automation** switcher in the `goto` family. One keystroke opens a floating `popup` that enumerates the entire herd as `space → tab → pane`, then lets the user **focus, rename, delete, and create** workspaces (“spaces”), tabs, and panes (both agent panes and bare shells).
- **Key Features**: No daemon, HTTP endpoint, or config schema. One headless action + one popup + two event hooks:  * **Picker (`[[panes]] picker`, `placement=popup`, `60% x 55%`, `bash run.sh`):** animated tree, spinner

### [2026-07-23] toyamarinyon/herdr-thread-to-tab
- **Overview**: `toyamarinyon.thread-to-tab` (`Thread to Tab`, v0.1.5, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a **Window, Tab & Layout Automation** plugin that keeps single-pane Herdr tab labels in sync with coding-agent thread titles.
- **Key Features**: No user-invoked actions, popup panes, keybindings, hooks, HTTP endpoints, or config schema. The manifest declares only:  * `[[startup]] command = ["bin/thread-to-tab", "--listen"]` * `[[build]] comman

### [2026-07-24] jeffarese/herdr-bar
- **Overview**: `jeffarese/herdr-bar` (`herdr-bar`, `Bar`, v0.3.0, `min_herdr_version 0.7.4`, `linux`/`macos`) is a **Window, Tab & Layout Automation** quick-switcher: Cmd+K / `prefix+k` for Herdr. It opens as a short-lived `popup` pane (`74% x 62%`), reads the whole session in one `session.snapshot`, and lets the user fuzzy-jump to any agent, agent-less tab, named pane, or workspace — with live status, running time, and preview — then exits. There is no daemon, no background process, and no persistent UI.
- **Key Features**: **What the user gets:**  * **Fuzzy search over everything jumpable:** one row per agent + one row per tab with no agent + one row per workspace when `>1` workspace exists. Matched on title, summary/de

