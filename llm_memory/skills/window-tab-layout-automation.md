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

### [2026-07-25] aoprisan/hird
- **Overview**: `aoprisan/hird` (`id: hird`, v0.1.2, `min_herdr_version 0.7.5`, `linux`/`macos` only) is not a window/tab/layout automator in the sense of the other entries in this ledger. It is a thin Herdr packaging of `hird` — a ~49k-line Rust binary that implements a cross-harness agent work-queue and shared assertion memory on a local SQLite file.
- **Key Features**: What is declared in `herdr-plugin/herdr-plugin.toml`:  * **`board` pane (`placement = "overlay"`, `sh board.sh`):** `exec hird tui` in the focused project. `board.sh` extracts `focused_pane_cwd` then 

### [2026-07-26] jeffarese/herdr-newtab-plus
- **Overview**: `jeffarese/herdr-newtab-plus` (`herdr-newtab-plus`, `New Tab Plus`, v0.1.0, `min_herdr_version 0.7.4`, `linux`/`macos`) is a replacement for Herdr's built-in new-tab. It opens a short-lived session-modal `popup` (110x30 cells) that asks two questions — **which folder** and **which agent** — then creates either a tab in an existing space or a whole new space and optionally starts an agent there.
- **Key Features**: **Manifest surface (`herdr-plugin.toml`):**  * `open` action (`contexts=["global"]`): `sh -c 'herdr_bin="${HERDR_BIN_PATH:-herdr}"; ... exec "$herdr_bin" plugin pane open --plugin herdr-newtab-plus --

### [2026-07-26] tkuchiki/herdr-plugin-k8s-context
- **Overview**: `herdr-plugin-k8s-context` is a **Window, Tab & Layout Automation** launcher/isolator, not a tab-renamer. It opens a popup form for a Herdr tab label, Kubernetes context, and default namespace, then launches a new focused Herdr tab whose `KUBECONFIG` points at a private, flattened copy.
- **Key Features**: **User-visible surface — one action + one popup, no daemon, no HTTP endpoint, no config schema:**  * `open` — `Open Kubernetes context tab`, `contexts=["workspace"]`, `command=["./herdr-plugin-k8s-con

### [2026-07-27] iuhoay/herdr-break-pane
- **Overview**: `iuhoay.break-pane` (`herdr-break-pane`, v0.2.0, `min_herdr_version 0.7.4`) is a Window, Tab & Layout Automation plugin that relocates live panes without restarting them. It provides tmux-style `break-pane`: move the focused pane into a new tab in the same workspace, or into a new tab in another existing workspace or a brand-new workspace. Both paths preserve the running process, unzoom first if needed, and refocus the moved pane.
- **Key Features**: Two headless pane-context actions plus one popup, all declared in `herdr-plugin.toml`:  * **`break` — `Break pane into new tab`:** `contexts=["pane"]`, `command=["node","break-pane.mjs"]`. Runs immedi

### [2026-07-27] simoncrypta/herdr-dev-layout
- **Overview**: `simoncrypta/herdr-dev-layout` (`agentic-dev.dev-layout`, v0.2.8, `min_herdr_version 0.7.5`, `linux`/`macos`) is an opinionated **Window, Tab & Layout Automation** plugin that enforces a single sticky-agent workspace shape.
- **Key Features**: Manifest in `herdr-plugin.toml` exposes no daemon, popup, or HTTP surface — one `[[startup]]` plus nine headless `contexts=["workspace"]` actions plus two `[[events]]`, all `bash dev-layout.sh <verb>`

### [2026-07-29] omerturhan/herdr-touchbar
- **Overview**: `herdr-touchbar` (`Herdr Touch Bar`, v0.1.0, `min_herdr_version 0.7.5`, `macos` only) is a hardware-specific navigator for Herdr agents, not a generic layout manager.
- **Key Features**: **What the user sees, per `README.md`:**  * **Control Strip badge (always-on):** aggregated state derived from Herdr:   * `⏸ 2` red — blocked / waiting on user   * `⠹ 3` orange — working, with spinnin

### [2026-07-30] lucasleon2107/herdr-tab-title-sync
- **Overview**: `lucasleon2107/herdr-tab-title-sync` (`tab-title-sync`, `Tab Title Sync`, v0.3.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a tiny event-driven Window, Tab & Layout Automation plugin that keeps each Herdr tab label in sync with the AI agent running in it. On `pane.agent_detected` it labels the tab with a friendly agent name (e.g. `Claude Code`); on subsequent `pane.agent_status_changed` events it promotes the label to the agent's conversation title as captured by Herdr from OSC terminal-title sequences (`terminal_title_stripped`); when the agent disappears it resets the tab to the pane directory basename.
- **Key Features**: **What the user observes:**  * **Immediate agent-name label:** first `agent_detected` event before any OSC title exists yields `Claude Code`, `Codex`, `GitHub Copilot`, `OpenCode`, `Cursor`, `Devin`, 

### [2026-07-31] rohankewal/herdr-nerd-font-tab-name
- **Overview**: `rohankewal/herdr-nerd-font-tab-name` (`herdr-nerd-font-tab-name`, v0.1.0, `min_herdr_version 0.7.0`, `macos`/`linux`) is a Window, Tab & Layout Automation plugin that keeps Herdr tab-bar labels meaningful by prefixing them with a Nerd Font glyph for whatever is running in the tab.
- **Key Features**: No popup, keybinding, HTTP endpoint, or socket server. The observable surface is four headless actions plus a stdlib-only CLI and two lifecycle hooks:  **Manifest actions (`herdr-plugin.toml`):** * `r

### [2026-07-31] lucasleon2107/herdr-claude-launcher
- **Overview**: `claude-launcher` (`Claude Launcher`, v0.2.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a minimal Window, Tab & Layout Automation launcher. Its entire job is to open a new, focused Herdr tab with Claude Code already running — no typed command, no shell prompt — in the currently focused workspace and working directory.
- **Key Features**: One user-visible capability, exposed as two manifest objects:  **Headless action `claude-launcher.new-tab` — `New Claude Code tab`:** - `contexts = ["workspace"]`, `command = ["./launch-claude.sh"]`. 

### [2026-07-31] mholtzscher/herdr-focus-or-tab
- **Overview**: `herdr-focus-or-tab` (`Focus or Tab`, v0.2.0, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** navigation plugin. It implements Zellij-style combined pane/tab movement: `next` / `previous` first tries spatial focus left/right within the current tab, and if already at the edge, continues to the adjacent tab by tab-number, wrapping around the active workspace.
- **Key Features**: No daemon, popup/pane, hooks, HTTP endpoints, keybindings, or config schema. The entire surface is two one-shot headless actions declared in `herdr-plugin.toml`:  * **`herdr-focus-or-tab.next` — `Focu

### [2026-08-01] ndom91/herdr-ai-tab-name
- **Overview**: `ndomino.ai-tab-name` (`AI Tab Name`, `v0.1.0`, `min_herdr_version 0.7.5`, `macos`/`linux` only) is a Window, Tab & Layout Automation plugin that renames the focused Herdr tab from live pane context using an OpenAI-compatible LLM. It is a Herdr port of the author's `tmux-ai-window-name`: on `tab.focused` it summarizes recent pane output, git branch, cwd, and foreground command into a short kebab-case title, with a fast path that skips the LLM entirely for idle shells.
- **Key Features**: What the user observes, per `README.md` and `scripts/rename_tab.py`:  * **Focus-triggered rename:** `[[events]] on = "tab.focused"` runs `python3 scripts/rename_tab.py`. No daemon, popup, or persisten

### [2026-08-03] inonprince/herdr-counting-sheep
- **Overview**: **Counting Sheep** (`inon.counting-sheep`, `0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a **Window, Tab & Layout Automation** plugin in the index + navigation family. In 2-3 sentences: it publishes live, one-based Space and Agent positions as the `$sheep_index` sidebar metadata token via `report-metadata`, keeps those numbers fresh on workspace/tab/pane/agent lifecycle events, and provides one-key jumps to the last tab in the active Space, the last Space, and the last Agent.
- **Key Features**: What the user observes, per `herdr-plugin.toml` + `README.md` + `index.mjs`:  * **Live Space index:** each workspace gets `sheep_index="1".."N"` in order returned by `workspace list`. Rendered in side

### [2026-08-03] ralphilius/herdr-pr-tab-renamer
- **Overview**: `herdr.pr-tab-renamer` (`PR Tab Renamer`, v0.1.1, `min_herdr_version 0.7.0`) is a Window, Tab & Layout Automation plugin that keeps agent tabs labeled by outcome rather than location. It watches agent execution, records a scrollback baseline when a turn starts, and renames the containing tab to `PR #42` or `PRs #42, #108` when only the *new* output of a settled turn mentions pull / merge-request numbers.
- **Key Features**: **What the user observes:** tabs are left alone until an agent turn that mentions a PR finishes, then the tab is cumulatively labeled. No popup, keybinding, manual action, HTTP endpoint, or configurat

### [2026-08-03] dnf0/herdr-llm-summary-header
- **Overview**: `danielfisher.summary-header` (`Summary Header`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a **Window, Tab & Layout Automation** plugin in the tab/pane auto-title family — alongside `ndom91/herdr-ai-tab-name`, `qu8n/herdr-automatic-rename`, and `lucasleon2107/herdr-tab-title-sync` in the ledger — but with a distinct strategy.
- **Key Features**: The observable surface is a single event handler; there are no user-invoked actions, popup/overlay panes, keybindings, daemons, HTTP endpoints, or config schema:  * **Done-gated summarizer:** `[[event

### [2026-08-04] wjarka/herdr-ghostty-tab-title
- **Overview**: `ghostty-tab-title` (`Ghostty tab title`, v0.2.0, `min_herdr_version 0.7.4`, `linux`/`macos`) is a **Window, Tab & Layout Automation** plugin, but of a different kind than the tab-renamers in this ledger.
- **Key Features**: **User-visible behavior:**  * **Status rollup in external tab title:** color-coding via emoji glyphs because Ghostty titles are plain text. Defaults in `bin/herdr-ghostty-title:DEFAULTS` are `🔴 block

### [2026-08-04] Royal-lobster/herdr-spinup
- **Overview**: `Spinup` (`royal-lobster.spinup`, v0.3.0, `min_herdr_version 0.8.0`, `linux`/`macos`) is a **Window, Tab & Layout Automation** launcher, not a renamer or reshaper. On every `tab.created` event it injects an interactive menu into the new tab's own pane; picking a tool `exec`s it in that same pane, `esc`/`q`/`Ctrl-C` dismisses to a normal shell.
- **Key Features**: No user-invoked surface in the Herdr sense:  * **No `[[actions]]`, `[[panes]]`, `[[keys]]`, daemon, hooks beyond one event, HTTP endpoints, or config schema.** Manifest contains a single `[[events]] o

### [2026-08-05] dgnsrekt/herdr-yoke
- **Overview**: `yoke` (`dgnsrekt.yoke`, v0.1.0, `min_herdr_version 0.8.0`, `linux`/`macos`) is a **Window, Tab & Layout Automation** plugin that implements Chrome-style split-view for Herdr: pair two existing single-pane tabs side-by-side in one tab, then unpair them.
- **Key Features**: No daemon, hooks, HTTP endpoints, socket server, or config schema. Surface is one popup pane + four headless actions, all implemented by a single `bash` script (`yoke`, ~211 LOC):  * **`toggle` — `Yok

### [2026-08-05] willfish/herdr-balance-panes
- **Overview**: `willfish.herdr-balance-panes` (`Balance Panes`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a minimal **Window, Tab & Layout Automation** plugin that ports tmux's `select-layout -E` to Herdr.
- **Key Features**: **Single user-visible capability:**  * `willfish.herdr-balance-panes.even` — `Evenly size panes`, `contexts = ["pane"]`, `command = ["bin/herdr-balance-panes"]` in `herdr-plugin.toml`. Intended bindin

### [2026-08-07] amiramay/herdr-layout-cycle
- **Overview**: `herdr-layout-cycle` (`Layout Cycle`, `v0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** plugin that ports tmux `prefix+space` layout cycling to Herdr. A keybind invokes `node cycle.mjs --dir 1|-1`, which re-arranges all panes in the focused tab into the next/previous of six presets, wrapping around.
- **Key Features**: Manifest `herdr-plugin.toml` declares exactly two headless actions, both `contexts = ["pane"]`:  * `herdr-layout-cycle.cycle-layout` — `Cycle layout`: `["node", "cycle.mjs", "--dir", "1"]` * `herdr-la

### [2026-08-07] malone-c/herdr-pane-balancer
- **Overview**: `malone-c/herdr-pane-balancer` (`chrismalone.pane-balancer`, `0.1.0`, `min_herdr_version 0.7.5`) is a **Window, Tab & Layout Automation** plugin that keeps every pane in a Herdr tab equally sized. Herdr natively splits the focused pane in half, so a third pane lands at `50/25/25`; this plugin rewrites every `ratio` in the tab's split tree to `33/33/33` (and `N`-way equivalents) whenever a pane opens or closes, with an on-demand keybind as fallback.
- **Key Features**: No daemon, popup, HTTP endpoint, or persistent UI. Observable surface is two lifecycle hooks + two headless actions, all implemented by one script (`balance.py`):  * **Automatic rebalance on open:** `

### [2026-08-08] playsthisgame/herdr-api-client
- **Overview**: `herdr-api-client` (`id: herdr-api-client`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** launcher plugin. Its entire job is to open [ichigo](https://github.com/playsthisgame/ichigo) — an external, general-purpose TUI HTTP/REST client that stores requests as YAML in `.ichigo/` (per-project) or `~/.config/ichigo/` (global) — in a Herdr split pane (`prefix+i`) or full tab (`prefix+shift+i`) rooted at the user's current project directory.
- **Key Features**: Observable surface is minimal and fully explicit — ~393 LOC of Shell, no background process:  * **Pane `api-client` (`title: "API Client"`, `placement: "split"`):** `bash -c 'exec bash "${HERDR_PLUGIN

### [2026-08-08] doggyfish/herdr-tuple-plugin
- **Overview**: **Tuple** (`doggyfish.tuple`, `0.1.0`, `min_herdr_version 0.7.5`) pairs two coding agents side-by-side in a single Herdr tab and moves text between them with a keypress.
- **Key Features**: Manifest declares four headless `contexts = ["pane"]` actions, all `node`:  * `pair` — `Add partner agent pane`: `node bin/pair.js` * `push-right` — `Push right`: `node bin/push.js right` * `push-left

### [2026-08-09] Angel-O/herdr-labels
- **Overview**: `angel-o.labels` (`Labels`, v0.2.7, `min_herdr_version 0.7.5`, `macos`/`linux`) is a **Window, Tab & Layout Automation** plugin that automatically names eligible tabs after their foreground process and prefixes every tab with its one-based workspace position — e.g. `[1] zsh`, `[2] nvim`, `[3] tests`.
- **Key Features**: **Numbering policy (`src/numbering.rs`):** * `numbered_label(position, label)`, `strip_numeric_prefix()`, `is_placeholder()`. * Strips stacked numeric prefixes (`[9] [3] setup` → `[2] setup`), preserv

### [2026-08-09] winoooops/herdr-agent-title-sync
- **Overview**: `herdr-agent-title-sync` (`Agent Title Sync`, v0.2.0, `min_herdr_version 0.7.5`, `linux`/`macos`/`windows`) keeps **Herdr pane labels** synchronized with coding-agent session titles. Unlike most entries in the Window, Tab & Layout Automation ledger — which rename *tabs* from `cwd`, foreground process, or git branch — this plugin renames *panes* from durable, agent-local session stores for Claude, Codex, Kimi Code, and OpenCode, with a filtered terminal-title fallback for any other agent.
- **Key Features**: **What the user observes:**  * **Agent-aware pane titles:** resolves best-available title per pane via `titleForPane()` in `src/adapter/index.ts`. Precedence is durable session state first, terminal t

### [2026-08-10] Only-Moon/herdr-nerd-font-tab-name-windows
- **Overview**: `herdr-nerd-font-tab-name` (`Nerd Font Tab Name`, `v0.1.0`, `min_herdr_version 0.7.0`) replaces Herdr tab-bar labels with a Nerd Font glyph describing what is running in the tab — e.g. ` nvim logs`, or icon-only when the tab still carries Herdr's auto-number.
- **Key Features**: What the user sees is four logical operations, duplicated per-OS in `herdr-plugin.toml` as eight headless actions:  * `refresh` / `refresh-windows` — `Apply icons to every tab immediately`. Unix: `bin

### [2026-08-11] elKei24/herdr-title-sync
- **Overview**: `elKei24/herdr-title-sync` (`elkei24.title-sync`, `title-sync`, v1.0.0, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a **Window, Tab & Layout Automation** plugin in the crowded tab-renamer family.
- **Key Features**: What the user observes is a single background behavior, no interactive surface:  * **Mirror agent title -> tab label:** each cycle computes `plan_renames(agents, current_labels)` and renames. Logic in

### [2026-08-12] tajdien/herdr-confirm-close
- **Overview**: `tajdien/herdr-confirm-close` (`confirm-close`, `Confirm Close`, v0.4.0) is a defensive **Window, Tab & Layout Automation** plugin that adds tmux-style `confirm-before` to Herdr. Bound to `prefix+x` / `prefix+q` in place of the native `close_pane` / `close_tab`, it opens a tiny `Close? (y/n)` popup; `y` closes the focused pane or tab, anything else cancels.
- **Key Features**: No daemon, lifecycle hooks, HTTP endpoints, or background sync. The entire surface is two headless actions + two interactive panes:  * **`confirm-close.confirm-close-pane` — `Close pane (with confirma

### [2026-08-14] crierr/herdr-tmux-layout
- **Overview**: `crierr/herdr-tmux-layout` (`id: herdr-tmux-layout`, `name: Tmux Layout (deprecated)`, `v0.1.1`, `min_herdr_version 0.8.0`, `linux`/`macos` only) ports tmux's preset window layouts to Herdr tabs.
- **Key Features**: What the user sees is seven headless `contexts = ["tab"]` actions in `herdr-plugin.toml`, all `command = ["./bin/herdr-tmux-layout", "<verb>"]`:  * `cycle` — `Cycle pane layout`: tmux `next-layout` eq

### [2026-08-14] kevinWangSheng/herdr-kit
- **Overview**: `herdr-kit` is not a single plugin but a stdlib-only Python toolkit plus two thin installable plugins for Herdr 0.8.0. Its premise, documented in `README.md` and `docs/API-FACTS.md` / `docs/FINDINGS.md`: Herdr answers 90 socket methods but the `herdr` CLI wraps only ~2/3 of them — notably `layout.export` / `layout.apply` and `events.subscribe` have no CLI verb — so this repo supplies the missing client, plus `layout save/apply`, an event `watch` engine, a `doctor`, a raw `call` escape hatch, and two `herdr plugin install`-able wrappers.
- **Key Features**: **`herdr-kit` CLI (`herdrkit/cli.py`, via `bin/herdr-kit`):**  * `layout save [output] --tab --label --with-commands` — export live tab via `layout.export`, convert to portable doc, write JSON or stdo

### [2026-08-17] joo-was-already-taken/herdr-prevtab
- **Overview**: `prevtab` (`PrevTab`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** navigation plugin in the back-and-forth family alongside `dantehemerson.last-tab` in the ledger.
- **Key Features**: No popup, overlay, daemon UI, config schema, keybindings, or HTTP endpoints. Observable surface is one `[[startup]]` + two headless `[[actions]]` in `herdr-plugin.toml`:  * **`prevtab.jump_back` — `Ju

### [2026-08-17] smanickam01/herdr-atuin-plugin
- **Overview**: This is `atuin.history-popup` (`Atuin history popup`, v0.4.1, `min_herdr_version 0.7.0`, `platforms = ["macos"]`). It brings Atuin's interactive shell-history search into Herdr via a session-modal popup.
- **Key Features**: Key user-visible behavior, all implemented in `herdr-atuin.sh` + manifest wiring:  * **Popup history picker:** `[[panes]] history` (`title = "Atuin history"`, `placement = "popup"`, `80% x 80%`, `comm

### [2026-08-18] husniadil/herdr-swipe
- **Overview**: `husniadil/herdr-swipe` (`Herdr Swipe`, v0.1.1, `min_herdr_version 0.8.0`, `macos` only) is a **Window, Tab & Layout Automation** plugin of a kind with no precedent in the ledger: instead of keybindings, popups, or tab-renamers, it adds trackpad gestures for Herdr.
- **Key Features**: What the user feels is four gestures, one meaning each, with no escalation between levels:  * **Pane:** 2-finger horizontal swipe. Moves in sidebar reading order — left-to-right, top-to-bottom sorted 

### [2026-08-18] kokatsu/herdr-tab-numbers
- **Overview**: `kokatsu/herdr-tab-numbers` (`kokatsu.tab-numbers`, `Tab & Workspace Numbers`, v0.3.0, `min_herdr_version 0.8.2`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** plugin in the numbering/navigation sub-family — alongside `Angel-O/herdr-labels` and `inonprince/herdr-counting-sheep` in the ledger, and distinct from the semantic renamers that derive labels from `cwd`, foreground process, git branch, or LLM summary.
- **Key Features**: What the user observes is purely visual and navigational — no launcher, picker, daemon UI, or new layout primitive:  * **Tab position prefix:** `renumber.sh` rewrites every tab in every workspace to `

### [2026-08-19] y4m3/herdr-zen
- **Overview**: `y4m3.herdr-zen` (`Herdr Zen`, v0.1.0, `min_herdr_version 0.8.0`) is a **Window, Tab & Layout Automation** plugin that implements a distraction-free “zen mode” for Herdr. Focus a pane and invoke toggle and the plugin moves that live pane — process and scrollback intact — into a dedicated `Zen` tab flanked by two blank spacer panes so the content is centered at 70% width; invoking toggle again restores it to its original tab and zoom state.
- **Key Features**: Three user-facing headless actions, all `contexts = ["pane"]` in `herdr-plugin.toml`, all `command = ["bin/herdr-zen.exe", "<verb>"]`:  * **`toggle` — Toggle Zen mode:** enter if inactive, leave if ac

### [2026-08-20] EmmetZ/herdr-tab-smart-rename-rs
- **Overview**: `herdr-tab-smart-rename-rs` (`id: tab-smart-rename`, `name: Smart Rename`, `v0.2.0`, `min_herdr_version 0.8.0`) is a **Window, Tab & Layout Automation** plugin in the crowded tab-renamer sub-family — alongside `lmilojevicc/herdr-tab-rename`, `riq0h/tab-process-name`, `qu8n/herdr-automatic-rename`, and `ndom91/herdr-ai-tab-name` in the ledger — but with a distinct strategy.
- **Key Features**: **What the user observes:**  * **Manual rename on demand:** `tab-smart-rename.rename-now` — `Smart Rename: current tab` (`contexts = ["workspace","tab","pane"]`). Reads current tab context and renames

### [2026-08-20] edouard-andrei/herdr-smart-rename
- **Overview**: `herdr-smart-rename` is a **Window, Tab & Layout Automation** plugin in the crowded tab-renamer sub-family, alongside `lmilojevicc/herdr-tab-rename`, `riq0h/tab-process-name`, `qu8n/herdr-automatic-rename`, and `ndom91/herdr-ai-tab-name` in the ledger.
- **Key Features**: Two on-demand headless actions, both implemented by the same script with a flag:  * `edi.smart-rename.rename-tab` — `Smart rename tab`: `["node", "rename.mjs", "--target", "tab"]` * `edi.smart-rename.

### [2026-08-21] shibayu36/herdr-equalize-panes
- **Overview**: `shibayu36/herdr-equalize-panes` (`shibayu36.equalize-panes`, `Equalize Panes`, v0.1.0, `min_herdr_version 0.7.2`, `linux`/`macos`) is a Window, Tab & Layout Automation plugin that ports tmux's `select-layout -E` to Herdr.
- **Key Features**: **Automatic equalize — no keypress required:** * `pane.created` → `./equalize-panes` * `pane.closed` → `./equalize-panes` * `pane.exited` → `./equalize-panes`  All three are `[[events]]` entries in `h

### [2026-08-21] KadenThomp36/herdr-plugin-switcher
- **Overview**: `kthompson.switcher` (`Switcher`, v0.1.0, `min_herdr_version 0.7.0`, `macos` only) is a **Window, Tab & Layout Automation** plugin in the switcher / MRU-navigation sub-family. Hold `Ctrl`, tap `Tab` to cycle Herdr panes most-recently-used-first in an Arc/Zen-style overlay, release `Ctrl` to commit, `Esc` to cancel, `Shift` to reverse.
- **Key Features**: **User-visible behavior (per `README.md` + manifest description):**  * MRU pane cycling: `Ctrl+Tab` advances, `Shift` reverses direction while held. * Commit-on-release: releasing `Ctrl` focuses the s

### [2026-08-22] jackfrancisdalton/herdr-turbo-palette
- **Overview**: **Turbo Palette** (`jackfrancisdalton.turbo-palette`, `1.0.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a cmd+P-style fuzzy finder for Herdr in the **Window, Tab & Layout Automation: switcher/jump** sub-family — alongside `herdr-bar`, `hasr`, and `prevtab`/`last-tab` in the ledger, but broader than all of them.
- **Key Features**: **Find-and-jump core:**  * One-shot fuzzy match across `title + ident + crumb + id` with field weights (`src/index.py:W_TITLE 1.0 / W_IDENT 0.85 / W_CRUMB 0.6 / W_ID 0.5`). Agent title = agent-reporte

### [2026-08-22] k-narusawa/herdr-last-tab
- **Overview**: `k-narusawa/herdr-last-tab` (`k-narusawa.last-tab`, v0.1.0, `min_herdr_version 0.8.0`, `macos`/`linux`) is a minimal **Window, Tab & Layout Automation** navigation plugin. It implements tmux `last-window` semantics for Herdr: remember the previously focused tab and provide a single action to jump back to it, with repeated invocations flip-flopping between the two most recent tabs. It works across workspaces and is the third variant of this pattern in the ledger after `dantehemerson/herdr-last-tab` (2026-07-07) and `joo-was-already-taken/herdr-prevtab` (2026-08-17), and by far the simplest — ~75 LOC of Shell, no daemon, popup, or config.
- **Key Features**: Observable surface is exactly two operations implemented by one script (`herdr/last_tab.sh`):  * **Record history (background, event-driven):** `bash herdr/last_tab.sh record` runs on every `tab.focus

### [2026-08-24] kryptamine/herdr-auto-title
- **Overview**: `herdr-auto-title` is a **Window, Tab & Layout Automation** plugin in the crowded tab auto-renamer sub-family. It is a long-lived Go process that polls the Herdr session twice per second and keeps every tab label in step with the work in it.
- **Key Features**: **What the user observes:**  * **Contextual titles:** `~/work/dashboard → dashboard`, `~/work/dashboard on feat/oauth → dashboard › feat/oauth`, `nvim editing auth.provider.ts → nvim › auth.provider.t

### [2026-08-25] sudoeren/herdr-lazydocker
- **Overview**: `sudoeren/herdr-lazydocker` (`herdr-lazydocker`, `Lazydocker`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** launcher in the `lazygit`/`linear`/`api-client` sub-family. It does not reimplement Docker UI or manage generic layouts; it runs the external `lazydocker` TUI inside Herdr — either side-by-side in a `split` or full-window in its own `tab` — with press-once-to-open / press-again-to-focus / press-while-focused-to-close toggle semantics. Quitting `lazydocker` with `q` naturally closes the host pane.
- **Key Features**: What the user gets is one reusable pane plus two headless toggle actions, all declared in `herdr-plugin.toml`. There is no daemon, popup definition, hooks, HTTP endpoints, config schema, or bundled ke

### [2026-08-25] vjeantet/herdr-scratchpad
- **Overview**: `herdr-scratchpad` (`id: herdr-scratchpad`, v0.2.1, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation + scratch-buffer** plugin: a persistent, always-editable plain-text pane docked at the bottom of the current Herdr tab. It implements one buffer per tab (`scratchpad-<tab_id>.txt` in `$HERDR_PLUGIN_STATE_DIR`), with single-key copy to the local clipboard (OSC 52), file snapshot export, and `Ctrl+E` deposit of draft text into that tab's agent input box without submitting it.
- **Key Features**: Manifest surface is minimal — one fallback `[[panes]]` + one `[[actions]]`, no daemon, hooks, HTTP endpoints, keybindings, or config schema:  * `scratchpad` pane (`placement = split`, `command = ./tar

### [2026-08-25] macintacos/herdr-reshape
- **Overview**: `herdr-reshape` adds two primitives Herdr 0.8.x lacks: **re-orienting the focused pane against its sibling** in the split tree, and **squaring a tab into an even grid**. A new pane in Herdr always lands on a halved split (`50/25/25` for three panes); this plugin corrects that to thirds, and lets `prefix+arrow` move a pane left/right/up/down without killing its process.
- **Key Features**: **Five user actions** in `herdr-plugin.toml`, all `["./bin/herdr-reshape", "<verb>"]`, unbound by default (README suggests `prefix+arrow` + `prefix+=` via `[[keys.command]] type="plugin_action"`):  * 

### [2026-08-27] 42lizard/herdr-dwm-layout
- **Overview**: `42lizard.dwm-layout` (`DWM Layout`, v0.2.1, `min_herdr_version 0.8.2`, `linux`/`macos`) is a **Window, Tab & Layout Automation** plugin that enforces a DWM-style master/stack geometry on a Herdr tab.
- **Key Features**: **Ten headless actions** in `herdr-plugin.toml`, all `command = ["target/release/herdr-dwm-layout", "<verb> ..."]`, no `[[panes]]`, no `[[keys.command]]`, no daemon, no HTTP endpoint:  * `enable` (`co

### [2026-08-27] ponko2/herdr-equalize-panes
- **Overview**: `ponko2.equalize-panes` (`Equalize Panes`, v0.2.2, `min_herdr_version 0.8.2`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** plugin that ports tmux `select-layout -E` to Herdr.
- **Key Features**: **User-visible surface in `herdr-plugin.toml`:**  * `equalize` — `Equalize panes` / `Make every pane in the focused tab the same size`, `contexts = ["tab"]`, `command = ["./bin/equalize-panes"]`. READ

### [2026-08-30] crierr/herdr-arrange
- **Overview**: `herdr-arrange` (`Arrange`, `v0.2.1`) is a **Window, Tab & Layout Automation** plugin for live pane rearrangement. It opens a session-modal popup anchored on the focused pane with two views: **Layout mode** reshapes the current tab in place — directional swap, re-split, tmux-style resize, five presets, even-out — and **Tree mode** sends that pane to any workspace/tab/pane in the session or swaps with it.
- **Key Features**: **Manifest surface (`herdr-plugin.toml`):** two headless `contexts=["pane"]` actions + one `placement="popup"` pane + one `[[startup]]` hook. No `[[events]]`, no `[[keys.command]]`, no config schema, 

### [2026-08-30] juezhong/herdr-positional-tabs
- **Overview**: `herdr-positional-tabs` (`Herdr Positional Tabs`, v0.2.0, `min_herdr_version 0.8.2`, `macos`/`linux` only) keeps Herdr tab labels and numeric navigation aligned with visible tab order.
- **Key Features**: **Label maintenance:**  * `N: title` rendering for every tab in the invoking workspace. `plan_refresh()` in `src/lib.rs` computes the minimal rename set; no-op tabs are left untouched. * Auto mode (`T

### [2026-08-31] kewah/herdr-tab-titles
- **Overview**: `tab-titles` (`Tab Titles`, v0.10.0, `min_herdr_version 0.8.0`, `linux`/`macos`) names Herdr panes and tabs after the first coding-agent prompt, or after the foreground process when there is no chat title. Before: `3 / Claude Code / Pi / bash`; after: `3 / README update / Fix OAuth / nvim`.
- **Key Features**: **User-visible behavior:**  * Agent appears → pane gets a kind placeholder from `kindLabel()`: `Claude Code`, `Pi`, `Codex`, `Cursor`, `OpenCode`, plus generic `Some New Agent` title-casing for any ot

### [2026-08-31] asermax/herdr-tab-command
- **Overview**: `asermax/herdr-tab-command` (`asermax.tab-command`, `Tab Command`, v0.1.0, `min_herdr_version 0.8.2`, `linux`/`macos` only) turns Herdr's mandatory new-tab name into an executor.
- **Key Features**: **Name → action resolution (`src/action.ts:resolveAction`):**  1. `[tab_commands]` exact match after `trim()` — e.g. `tig = "tig"`, `"api logs" = "kubectl logs -f api"`. 2. `[tab_agent_aliases]` exact

### [2026-09-02] enisbu/herdr-swipe-linux
- **Overview**: `enisbu/herdr-swipe-linux` (`herdr-swipe-linux`, `Herdr Swipe (Linux)`, v0.1.0, `min_herdr_version 0.8.0`, `platforms = ["linux"]`) is a Linux port of `husniadil/herdr-swipe` (macOS-only, ledger 2026-08-18, `CGEventTap`-based).
- **Key Features**: What the user feels is four gestures, one meaning each — documented in `README.md` and enforced in `src/gestures.rs`:  * **Pane:** 2-finger horizontal swipe. Moves in sidebar reading order (`y,x` sort

### [2026-09-02] hotnugs/herdr-emoji-time
- **Overview**: `hotnugs.emoji-time` (`Emoji Time`, `0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`) is a manual labeling plugin for the Herdr sidebar. It prefixes a single emoji glyph to the left of a **space**, **tab**, or **agent** display name — e.g. `🚀 api` — so work can be found at a glance.
- **Key Features**: **User-visible surface:**  * Three headless actions in `herdr-plugin.toml`, all shims to the same picker:   * `pick` — `Emoji for this space` (`contexts=["workspace"]`, `python3 pick.py space`)   * `p

### [2026-09-02] rudironsoni/herdr-orca
- **Overview**: `rudironsoni.herdr-orca-sync` (`Herdr Orca Sync`, v0.3.0, `min_herdr_version 0.7.5`) is an outlier in the **Window, Tab & Layout Automation** ledger. Where most entries in this category rename tabs, equalize splits, or provide jump palettes, this plugin is a **bridge to an external terminal**: it attaches stock Orca tabs to Herdr-owned terminals and keeps the mapping synchronized via a persistent local service.
- **Key Features**: Observable surface is defined entirely in `herdr-plugin.toml` — six headless actions plus one popup pane. There are no `[[events]]`, `[[keys.command]]`, link handlers, or config schema in the provided

### [2026-09-03] killerz3/herdr-agent-titler
- **Overview**: `killerz3/herdr-agent-titler` (`herdr.agent-titler`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a **Window, Tab & Layout Automation: tab auto-renamer** plugin in the most crowded sub-family in this ledger — alongside `lmilojevicc/herdr-tab-rename`, `riq0h/tab-process-name`, `qu8n/herdr-automatic-rename`, `ndom91/herdr-ai-tab-name`, `kewah/herdr-tab-titles`, `elKei24/herdr-title-sync` and others.
- **Key Features**: What the user observes:  * **Background polling titler, not event-driven:** `main.py run` → `TitlerEngine.run_daemon()` infinite `scan_once()` + `time.sleep(interval)`. No `[[events]]`, `[[keys.comman

### [2026-09-03] shubham-cpp/herdr-plugins
- **Overview**: This repository is not one plugin but two independent Rust plugins in the **Window, Tab & Layout Automation** category, both `linux`/`macos` only and built with `cargo build --release`:
- **Key Features**: ### `herdr-auto-naming`  * **Tab auto-follow:** `reconcile()` in `src/reconcile.rs` + `cwd_tab_name()` in `src/tabs.rs` names the focused pane's tab from `dir_basename(foreground_cwd || cwd)`. `/work/

### [2026-09-03] followbl/herdr-drover
- **Overview**: `followbl.drover` (`Drover`, v0.3.0, `min_herdr_version 0.7.5`, `linux`/`macos`) is a **Window, Tab & Layout Automation: MRU tab switcher** in the same family as `herdr-bar`, `turbo-palette`, `hasr`, and `kthompson.switcher` in the ledger.
- **Key Features**: **User-visible surface — two headless actions + one popup:**  * `open` — `Open Drover, or cycle to the next tab if it is already open` (`contexts=["global","workspace"]`, `python3 -u open.py`). Intend

### [2026-09-04] RickyMarou/herdr-numbered-tabs
- **Overview**: `numbered.tabs` (`Numbered Tabs`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) prefixes every Herdr tab label with its current 1-based display position within its workspace — e.g. `[1] 🚀launch-prep`, `[2] 🧪experiment-branch`.
- **Key Features**: **Core reconcile (`python3 numbered_tabs.py reconcile [--dry-run] [--force]`):**  * Lists all tabs via `herdr tab list`, groups by `workspace_id` preserving returned display order, enumerates `pos=1..

### [2026-09-04] btj93/herdr-tabline
- **Overview**: `herdr-tabline` (`Herdr Tabline`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** plugin in the crowded tab-renamer family. Unlike one-shot renamers that map `cwd` or `process name -> label`, it renders every Herdr tab label from a user-configurable Go `text/template` with project-aware profile overrides.
- **Key Features**: **What the user observes:**  * **Template-driven labels:** `template = ' {{ .Tab.Number }}: {{ .Pane.Directory }} > ... '` in `config.toml`. Missing file falls back to compatibility defaults compiled 

### [2026-09-05] jone/herdr-wrangler
- **Overview**: `jone/herdr-wrangler` (`wrangler`, `Wrangler`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** plugin that ports tmux-style geometry operations to Herdr.
- **Key Features**: Observable surface is exactly seven headless one-shot actions declared in `herdr-plugin.toml`, all `contexts = ["tab", "pane"]`, all `command = ["python3", "src/wrangler.py", "<verb>"]`:  * **`wrangle

### [2026-09-06] bonkey/herdr-dup-tab
- **Overview**: `bonkey/herdr-dup-tab` (`bonkey.dup-tab`, `Duplicate Tab`, v0.1.0, `min_herdr_version 0.8.0`) is a minimal Window, Tab & Layout Automation plugin that clones work by re-execution rather than by relocation. Press the action in a pane running e.g. `codex --yolo` and it opens a new focused tab in the same workspace and live working directory, labeled after the command binary, and types that same command into the new tab's fresh login shell.
- **Key Features**: Single user-visible capability, no background surface:  * **`bonkey.dup-tab.duplicate` — `Duplicate command in new tab`:** headless action, `contexts = ["pane", "workspace"]`, `command = ["bash", "dup

### [2026-09-07] b12o/herdr-pane-autorename
- **Overview**: `b12o/herdr-pane-autorename` (`herdr-pane-autorename`, `Herdr Pane Autorename`, v0.1.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation** plugin in the auto-title family, but at **pane granularity** rather than tab granularity.
- **Key Features**: Observable behavior is a single background behavior plus two manual lifecycle actions. There are no popup/overlay panes, keybindings, event subscriptions, HTTP endpoints, or config schema.  * **Contin

### [2026-09-08] hamzahraihan/herdr-git-tab
- **Overview**: `herdr-git-tab` (`Git Tab`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`/`windows`) is a **Window, Tab & Layout Automation + GitHub TUI** plugin, not a tab-renamer or layout reshaper like most entries in this ledger.
- **Key Features**: **User-visible surface is minimal by design: one action + one tab pane + one auto-installed keybinding.**  * `open-git-tab` — `Open Git Tab`, `contexts = ["workspace"]`, `command = ["node", "dist/bin/

### [2026-09-09] dvoets/herdr-tagr
- **Overview**: `herdr-tagr` (`id: herdr-tagr`, `v0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a **Window, Tab & Layout Automation: tab auto-renamer** in the most crowded sub-family in this ledger.
- **Key Features**: No popup, overlay, keybinding, HTTP endpoint, or socket server. Observable surface is one daemon plus four headless actions plus two debug CLIs:  **Daemon (`[[startup]]` → `./target/release/herdr-tagr

### [2026-09-10] hanbong5938/herdr-tab-autorun
- **Overview**: `han.tab-autorun` (`Tab Autorun`, `0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) is a **Window, Tab & Layout Automation** plugin that injects work into a newly created tab's root pane. When Herdr fires `tab.created`, the plugin evaluates an ordered `rules.toml` file and performs exactly one operation: run a trusted shell string via the pane's shell, start a Herdr coding agent and optionally send it an initial prompt, or explicitly skip.
- **Key Features**: **Automatic hook:** * `[[events]] on = "tab.created"` → `node src/autorun.mjs`. Splits do not trigger it; only genuine new tabs do. Native restore/handoff does not replay `tab.created`, so restored ta

### [2026-09-10] barrychen38/herdr-assemble
- **Overview**: `Assemble` is a tiny, event-driven **Window, Tab & Layout Automation** plugin whose entire job is cosmetic: replace Herdr's auto-generated numeric tab labels (`1`, `2`, ...) with random Marvel-hero codenames (`thor`, `logan`, `reed`).
- **Key Features**: Key behavior is fully contained in `rename.py` + `herdr-plugin.toml`, with no user-invoked actions:  * **Rename on creation, two triggers:** `[[events]] on = "tab.created"` and `on = "workspace.create

### [2026-09-11] purehate/herdr-plugin-ssh
- **Overview**: `purehate/herdr-plugin-ssh` (`purehate.herdr-ssh`, `SSH Picker`, v0.1.1) is a **Window, Tab & Layout Automation: launcher** plugin. It presents a floating fuzzy picker over the aliases in `~/.ssh/config` (including `Include` chains) and opens an SSH session to the selected host in a new Herdr `split`, `tab`, or `zoomed` pane.
- **Key Features**: **User-visible surface — one action + two panes + one CLI verb:**  * `open-picker` — `Open SSH Picker`, `contexts = ["workspace","pane"]`, `command = ["./bin/herdr-ssh", "plugin", "open-picker"]`. For

### [2026-09-11] blauerberg/herdr-launch-default-agent
- **Overview**: `herdr-launch-default-agent` (`Launch Default Agent`, `v0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a **Window, Tab & Layout Automation: launcher** plugin in the same sub-family as `lucasleon2107/herdr-claude-launcher`, `leonho/herdr-new-task`, and `jeffarese/herdr-newtab-plus` in the ledger — but deliberately simpler than all of them.
- **Key Features**: Single user-visible capability, no background surface:  * **`herdr-launch-default-agent.open` — `Focus or launch default agent`**: headless action, `contexts = ["workspace"]`, `command = ["bash", "bin

### [2026-09-11] dimapanov/herdr-equalize
- **Overview**: `dimapanov/herdr-equalize` (`dimapanov.equalize`, `Equalize Panes`, v0.1.0, `min_herdr_version 0.7.5`) is a **Window, Tab & Layout Automation** plugin that keeps all panes in a Herdr tab equally sized.
- **Key Features**: What the user observes is two manual actions plus fully automatic maintenance — no daemon, popup, keybinding, or HTTP endpoint:  * **`dimapanov.equalize.equalize` — `Equalize pane sizes`:** one-shot h

### [2026-09-11] brunohq/herdr-scratchpad
- **Overview**: `herdr.scratchpad` (`Scratchpad`, v0.9.0, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a minimal per-tab markdown scratchpad with checkbox todos.
- **Key Features**: No daemon, lifecycle hooks, HTTP endpoints, socket server, keybindings, or config schema. Observable surface is exactly one headless action + one split pane:  * **`toggle` — `Toggle scratchpad`:** `co

