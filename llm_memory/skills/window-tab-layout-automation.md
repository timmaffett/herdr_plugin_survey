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

