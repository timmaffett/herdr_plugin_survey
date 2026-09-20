# Architectural Memory: Terminal UI & Navigation

This document tracks architectural patterns and previously surveyed extensions within the **Terminal UI & Navigation** domain.

## Surveyed Extensions Ledger

### [2026-06-17] wyattjoh/herdr-plugin-gh-pr
- **Overview**: `wyattjoh/herdr-plugin-gh-pr` is a small, dependency-free Herdr plugin written in TypeScript for Bun (~1,737 LOC). Its sole job is to label the focused **agent pane's** sidebar row with the GitHub PR status for that pane's current git branch, in a compact form like `#123 ✓`.
- **Key Features**: **What the user sees:**  * Persistent sidebar token `#<number> <symbol>` on the focused agent pane, where the symbol encodes CI/state: `✓` pass, `✗` fail, `●` pending, `◆` merged, `⊘` closed, no symbo

### [2026-06-21] paulbkim-dev/vim-herdr-navigation
- **Overview**: `vim-herdr-navigation` is a small, Shell-primary plugin (~378 LOC) that makes `Ctrl+h/j/k/l` navigate seamlessly across herdr panes and Vim/Neovim splits as if they were one layout. It is an explicit port of `vim-tmux-navigator` to herdr's CLI, with two cooperating sides: a herdr-side dispatcher (`navigate.sh`) and editor-side shims (`editor/nvim.lua`, `editor/vim.vim`).
- **Key Features**: **What the user sees:** `Ctrl+h/j/k/l` moves within Vim splits while in Vim, crosses into a neighboring herdr pane when Vim is at a split edge, and moves directly between herdr panes everywhere else. 

### [2026-06-22] iurysza/termscope
- **Overview**: `termscope` (v0.3.0, `min_herdr_version 0.7.4`, `linux`/`macos` only) turns already-visible terminal output into a jump list. It captures the visible text of every pane in the current Herdr tab/window, extracts real on-disk file paths (with `file:line` preserved) and `http(s)` URLs, and presents them in a bounded `80% x 60%` session-modal Television (`tv`) popup. Selecting a file opens it in a new Neovim split beside the source pane; selecting a URL opens it with the OS default opener. The same single-file Python core (`termscope`, no extension) also runs standalone under `tmux`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * 2 `workspace`-context actions:   * `termscope.open` → `python3 termscope_herdr.py --open-pane` — visible-file picker.   * `termscope.open-links` → 

### [2026-06-26] lmilojevicc/herdr-splits.nvim
- **Overview**: `lmilojevicc/herdr-splits.nvim` (v0.5.3, `min_herdr_version 0.7.0`, `linux`/`macos` only) provides seamless navigation (`Ctrl+h/j/k/l`) and resizing (`Alt+h/j/k/l`) across Herdr terminal panes and Neovim splits as if they were one layout. It is an explicit port of `smart-splits.nvim` / `vim-tmux-navigator` to Herdr's CLI, with two cooperating halves: Herdr-side `bash` dispatchers (`scripts/herdr-nav.sh`, `scripts/herdr-resize.sh`) and a Neovim-side Lua plugin (`lua/herdr-splits/`).
- **Key Features**: **What the user sees:** same keys move within Neovim, cross into a neighboring Herdr pane at a Neovim edge, move directly between plain Herdr panes elsewhere, and resize whichever layer owns the borde

### [2026-07-02] willfish/herdr-navigator
- **Overview**: `willfish/herdr-navigator` (v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is the Herdr-side half of a `vim-tmux-navigator`-style workflow. It provides four Vim-aware pane-navigation actions bound by convention to `Alt+h/j/k/l`: if the active Herdr pane's foreground process is Vim/Neovim-like, it forwards the keystroke into that pane; otherwise it moves Herdr pane focus directionally.
- **Key Features**: What the user sees is a two-way branch per keypress, documented in `README.md`:  | Active pane foreground | Executed effect | |---|---| | `nvim`, `vim`, `view`, `lvim`, `nvim-*` | `herdr pane send-key

### [2026-07-08] markhuot/herdr-equalize-splits
- **Overview**: `herdr-equalize-splits` is a tiny, dependency-free Herdr plugin that rebalances **every divider in the current tab** so each pane receives an equal share of its row or column. It is the Herdr analogue of tmux's `select-layout even` or Ghostty's `equalize_splits`, scoped to Herdr's binary BSP layout tree.
- **Key Features**: What the user sees is a single keystroke fix for a lopsided layout. The `README.md` canonical example is `70% / 7% / 22%` → `33% / 33% / 33%` after invoking `prefix+=` (`Ctrl+b =` by default).  Declar

### [2026-07-09] ismaelosuna7824/herdr-file-viewer
- **Overview**: `ismaelosuna.file-viewer` (`v0.4.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a full file explorer, code viewer, and git client hosted in a single Herdr pane. Written in Go with Bubble Tea (~15.5k LOC), it is an order of magnitude larger than prior Terminal UI & Navigation plugins surveyed — which were small navigators, equalizers, or pickers — and aims for a VS Code tree + fuzzy finder + ripgrep search + lazygit hybrid in the terminal.
- **Key Features**: **Browse workspace:** * Lazily-expanded directory tree (`internal/explorer/tree.go: Tree`) with VS Code-style git decorations (`M/U/A/D/R/!` + dirty-directory tinting from `internal/gitstatus`). Sorts

### [2026-07-10] makyinmars/herdr-context.nvim
- **Overview**: `makyinmars/herdr-context.nvim` (`herdr-context`, v0.5.0, `min_herdr_version 0.7.5`) is a dual-surface plugin: a full Neovim Lua plugin (~12.5k LOC) plus a tiny Herdr companion popup for pinning a default target.
- **Key Features**: **Neovim user surface (`plugin/herdr-context.lua`, `README.md`, `lua/herdr-context/init.lua`):**  * One-shot staging: `:HerdrContextReference` (`@path#L10-L20`), `:HerdrContextSend` (reference + code)

### [2026-07-12] shoaibkhanz/herdr-active-agent-jump
- **Overview**: `Active Agent Jump` (`active-agent.jump`, v0.1.0, `min_herdr_version 0.7.0`) is a minimal, stateless navigation plugin for supervising a fleet of agents. It provides two workspace actions — `next` and `previous` — that move focus to the neighboring *active* agent in `pane_id` order, wrapping at the ends.
- **Key Features**: **User-visible behavior:**  * `Jump to next active agent` (`node jump.js next`) — focuses the active agent after the currently focused one; wraps to first; if focus is not on an active agent, lands on

### [2026-07-13] jomarmontuya/herdr-file-viewer
- **Overview**: `jomarmontuya/herdr-file-viewer` — manifest ID `medianeth.file-viewer`, name `File Tree`, `v0.7.1`, `min_herdr_version 0.7.0`, `linux`/`macos` only — is a Go + Bubble Tea terminal UI that provides a clickable, mouse-enabled project file tree for Herdr.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 3 `[[panes]]`: `viewer` (`split`, `./bin/file-viewer --tree-only`, title `File Tree`); `file` (`tab`, `sh -c exec "$HERDR_PLUGIN_ROOT/bin/file-view

### [2026-07-15] ezcorp-org/herdr-git-status
- **Overview**: `ezcorp-org/herdr-git-status` (`ez-corp.git-status`, v1.5.0) is a small, static Rust binary that reports each Herdr space's git working-tree status in the sidebar. For every workspace it runs `git status --porcelain=v1 --branch` in the first pane's `cwd`, reduces it to `+staged ~modified ?untracked !conflicted` or `✓` when fully clean, and surfaces it either as a `git` pseudo-agent row in the agents panel or as workspace metadata in the spaces card.
- **Key Features**: **Status model (`src/git.rs`, `src/model.rs`):**  * Per-space `GitStatus`: `is_repo, branch, ahead/behind, staged/modified/untracked/conflicts`. * Compact token via `token()`: `+N / ~N / ?N / !N` with

### [2026-07-15] devoc09/herdr-equalize-vsplit
- **Overview**: `devoc09/herdr-equalize-vsplit` (`devoc09.equalize-vsplit`, v0.1.0, `min_herdr_version 0.7.0`) is a small, dependency-free Go plugin (~665 LOC) for Terminal UI & Navigation. It implements a single one-shot workflow: split the invoking pane to the `right`, then rebalance all `right`-direction splits in the current tab so columns have equal width.
- **Key Features**: **Declared surface (`herdr-plugin.toml`):** one `pane`-context action:  * `split` — `Split and equalize columns` → `./bin/herdr-equalize-vsplit`  **User-visible behavior (per `README.md` + `main.go`):

### [2026-07-16] Crokily/herdr-lazygit
- **Overview**: `herdr-lazygit` (`v0.3.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) hosts upstream `lazygit` inside a Herdr pane as a narrow 42-column `Git` sidebar beside the user's work, with on-demand expansion to a full layout. Its differentiator in the Terminal UI & Navigation cohort is a second layer on top of the TUI: AI-assisted conventional commit messages via lazygit `customCommands` that open companion `GitCommit` / `GitSettings` panes, plus a four-layer `LG_CONFIG_FILE` model and machine-checked keybindings. The pane appears only on explicit action — there are no event hooks.
- **Key Features**: **Launchers — idempotent open/focus/toggle:** * `open` (`scripts/open-lazygit.sh`): split `right` in current tab. No match → `plugin pane open --entrypoint lazygit --placement split`; unfocused match 

### [2026-07-16] dwarvesf/herdr-quicklook
- **Overview**: `herdr-quicklook` (`v0.7.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only, ~7.6k LOC Shell) is a **Quick Look for herdr**: open whatever path or URL is on screen without leaving the terminal.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 4 `[[panes]]` (all `overlay`): `preview` (`scripts/preview-pane.sh`), `recents-pick` (`scripts/recents-pane.sh`), `hint-pane` (`scripts/hint-pane.s

### [2026-07-16] cinco/herdr-grep-nvim
- **Overview**: `cinco/herdr-grep-nvim` (`grep-nvim`, v1.0.3, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a pure-shell, dependency-free-at-install Herdr plugin for live repository search. Invoked as a single action, it splits the focused pane and runs an `fzf + ripgrep` live-grep picker in the new pane; `Enter` `exec`s `nvim` on the selected `path:line`, and quitting `nvim` (or `Esc` in `fzf`) auto-closes the split.
- **Key Features**: **Declared surface (`herdr-plugin.toml`):** exactly one action:  * `grep-nvim.open` — title `grep → nvim (split)`, `contexts = ["pane", "workspace"]`, `command = ["bash", "scripts/open.sh"]`. No `[[pa

### [2026-07-17] maedana/herdr-hint
- **Overview**: `maedana/hint` (`maedana.hint`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a Vimium-style quick-jump picker for Herdr tabs and agents. Pressing `prefix+f` opens a tiny `popup` pane that owns keyboard input while a transparent, always-on-top GUI window renders the selectable list; typing a 1-2 character label or moving with `hjkl`/arrows immediately focuses that tab/agent. It is ~1,447 LOC of Rust, distinct in the Terminal UI & Navigation cohort for using a native `egui` overlay instead of an in-terminal TUI or directional pane navigator.
- **Key Features**: **What the user sees:**  * Centered overlay list grouped by workspace for tabs (two columns) plus a trailing single-column `Agents` section. Tabs show `display_name`; agents show `status` + `repo:bran

### [2026-07-19] bojackduy/nvim-herdr-navigation
- **Overview**: `bojackduy/nvim-herdr-navigation` is a two-sided `vim-tmux-navigator` port for Herdr, providing seamless `ctrl+h/j/k/l` movement across Neovim splits and Herdr panes. The repository contains two cooperating plugins: `herdr-vim-navigator/` (Herdr-side Bash dispatcher) and `nvim-herdr-navigation/` (Neovim-side Lua plugin). Together they implement Neovim-first from inside Vim and Herdr-first from outside Vim, with no Herdr core patches.
- **Key Features**: **Herdr-side — Vim-aware dispatch:**  * Four `pane`-context actions defined in `herdr-vim-navigator/herdr-plugin.toml`: `left/down/up/right` → `bin/herdr-vim-navigator left|down|up|right` titled `Navi

### [2026-07-19] ArteenHD/herdr-cache-timer
- **Overview**: `ArteenHD/herdr-cache-timer` (`cache-timer`, v0.1.0) is a sidebar-augmentation plugin for Herdr that shows when each agent pane's prompt cache expires. It renders nothing itself; on every `pane.agent_status_changed` event a short-lived Node reporter recomputes a countdown anchored to the `working → idle|blocked|done` edge and writes it into one of three pre-styled sidebar metadata tokens (`$cache` / `$cache_urgent` / `$cache_expired`) via `herdr pane report-metadata`.
- **Key Features**: **Live countdown display:** * `working` → clears all three tokens (cache mid-write, row empty). * `idle` / `blocked` / `done` with known anchor → `⧗ 3:42pm` absolute local 12h expiry time. `blocked` i

### [2026-07-21] aorumbayev/herdr-ctx
- **Overview**: `herdr-ctx` (`herdr-ctx` v0.1.0, `min_herdr_version 0.7.4`, `linux`/`macos`) is a per-pane Claude Code context-window indicator for the Herdr sidebar. After each Claude assistant message, a Claude `statusLine` hook reads the exact `context_window.used_percentage` from status-line JSON on stdin and reports a `ctx` metadata token to the owning Herdr pane: hidden below warning, `◐ N%` in warning band, `● N%` plus a one-shot desktop notification at/above critical. There is no daemon, no polling, and no transcript parsing.
- **Key Features**: What the user sees is defined in `README.md` and `src/report.ts:marker()`:  * **Below warning (default 75%):** token cleared via `pane report-metadata --clear-token ctx`. Sidebar row empty. * **Warnin

### [2026-07-21] CowboyVang/herdr-tab-badges
- **Overview**: `CowboyVang/herdr-tab-badges` (`herdr-tab-badges` v0.2.0, `min_herdr_version 0.7.4`, `macos` only) is a tiny, binary-free sidebar augmentation plugin. Its sole job is to make multi-tab Herdr spaces stand out in the spaces sidebar by maintaining a custom workspace metadata token named `tabs`.
- **Key Features**: **User-visible behavior:**  * Multi-tab badge: e.g. `api [5]  web [3]  notes` (README example). Only qualifying spaces show a token; others are cleared to blank. * Three glyph styles controlled by con

### [2026-07-23] miiraheart/herdr-beads
- **Overview**: `miiraheart/herdr-beads` is a task board for [beads](https://github.com/steveyegge/beads) (`bd`) hosted inside Herdr. It is a single Rust / `ratatui` binary (~3.6k LOC) that renders the current repo's `bd` issues as a **List**, **Table**, or **Kanban** and exposes it on two Herdr surfaces: a narrow docked sidebar pinned to the left edge of a tab, and a large floating popup board.
- **Key Features**: **Views — one binary, in-process switching via `K` / `Tab` / `Shift+Tab`:**  * **List** (`src/views/list.rs`): grouped by status, collapsible (`h`/`l`), one bead per line with `P0-P4` priority, type g

### [2026-07-23] linvald/herdr-cmux-file-viewer
- **Overview**: `linvald/herdr-cmux-file-viewer` (`linvald.herdr-cmux-file-viewer`, `cmux File Viewer Sync`, `v0.1.0`) is a bridge plugin, not a viewer itself. Herdr multiplexes many spaces/panes inside a single `cmux` terminal surface, but cmux's native right-side file viewer only tracks the last-reported directory. This plugin keeps that viewer following the user by reporting the currently-visible Herdr space's directory to cmux on every focus change and every `cd`.
- **Key Features**: **What the user sees:** switching Herdr spaces moves the cmux file viewer to that space's repo; `cd`-ing inside the visible space keeps it following; `cd`-ing in a background pane does not steal it.  

### [2026-07-24] khatriafaz/herdr-plugin-agent-repo
- **Overview**: This is a tiny, dependency-free sidebar/header augmentation plugin in the **Terminal UI & Navigation** cohort — closest to `wyattjoh/herdr-plugin-gh-pr`, `ArteenHD/herdr-cache-timer`, `aorumbayev/herdr-ctx`, `CowboyVang/herdr-tab-badges`, and `ezcorp-org/herdr-git-status` — not to the full TUIs (`file-viewer`, `beads`) or directional navigators (`vim-tmux-navigator` ports).
- **Key Features**: **User-visible behavior:**  * Pane top-border title set to `formatTitle()` in `index.js`: `[agent, repo, branch].filter(Boolean).join(" - ")`. Branch is omitted outside git (`pi - repo`); repo falls b

### [2026-07-26] ablause/herdr-flutter
- **Overview**: `ablause.herdr-flutter` (`Herdr Flutter`, `v0.3.0`, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a full Terminal UI sidebar for Flutter development inside Herdr. It attaches to the Dart VM Service of a `flutter run` that is already running in the workspace and shows its unified logs / structured `Flutter.Error`s, widget tree, and `dart:io` HTTP traffic beside the agent, with VM-Service hot reload / restart and a one-key handoff that writes a markdown report and drops a pointer into the agent's input.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 1 `[[panes]]`: `sidebar` (`title: flutter`, `placement: split`, `command: sh -c exec "$HERDR_PLUGIN_ROOT/bin/herdr-flutter"`). Cwd is the project u

### [2026-07-28] jsmenzies/mergr
- **Overview**: `mergr` (`id: mergr`, `v0.3.2`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. It does not open panes, move focus, or host a TUI; it runs one background daemon that shows open GitHub pull-request status in Herdr Space sidebar rows.
- **Key Features**: **What the user sees:**  * `PRs N` count token plus `maxRows` (1–5, default 3) rows per Space, each as `title + glyph`:   * Red `✕`: failed checks, `mergeStateStatus == DIRTY`, or `CHANGES_REQUESTED` 

### [2026-07-28] Shi1xin/herdr-gitui
- **Overview**: `Shi1xin/herdr-gitui` (`herdr-gitui`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a thin Herdr shell around stock upstream `gitui`. It does not reimplement git: Herdr owns open/focus/toggle, worktree-aware reuse, and column geometry, while all staging, diffing, and committing stay inside the `gitui` binary running in a Herdr pane. This places it in the sidebar-TUI branch of the **Terminal UI & Navigation** cohort, directly parallel to `Crokily/herdr-lazygit` but deliberately smaller — no AI commit helpers, no `customCommands`, no daemon or event hooks.
- **Key Features**: What the user sees is three on-demand actions, conventionally bound to `prefix+g / prefix+shift+g / prefix+u`:  * **`open` (`scripts/open-gitui.sh`):** idempotent split in the current tab. First invok

### [2026-07-29] kaar/nvim-herdr-navigator
- **Overview**: `kaar/nvim-herdr-navigator` (`herdr-navigator`, `v0.1.0`) is a two-sided port of `vim-tmux-navigator` for Herdr. It makes `ctrl+h/j/k/l` behave as a single layout across Herdr terminal panes and Neovim splits: Herdr owns the chords outside Vim, Neovim owns them inside Vim and hands off to Herdr at a split edge.
- **Key Features**: **Herdr side — Vim-aware dispatch (`h-nav left|down|up|right`):**  * Per keypress, one stateless decision: if the focused pane's foreground process is Vim-like, pass the chord through via `herdr pane 

### [2026-07-29] ericcparsons/herdr-vitals
- **Overview**: `herdr-vitals` is a macOS-only, Bun+TypeScript sidebar-augmentation plugin (~2.1k LOC) that answers two live operational questions: *which agent is eating my machine* and *which Space has a dev server on `:3000`*. A singleton background daemon polls `ps` + `lsof` + Herdr state every ~5s and reports a `$usage` token (`25% · 502M`) onto each agent pane and a `$ports` token (`:3001 :5173`) onto each workspace, plus a floating `fzf` popup for inspecting and killing listeners.
- **Key Features**: **What the user sees:**  * **Per-agent `$usage` badge:** `CPU · RAM` e.g. `0.8% · 109M`, `36% · 835M`, or RAM-only (`142M`) on first poll when CPU is unmeasurable. Hidden entirely when tree RSS `< min

### [2026-08-02] aimdevlee/herdr-nvim-nav
- **Overview**: `herdr-nvim-nav` — manifest ID `herdr-nvim-nav`, name `Vim Nav`, `v0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux` only — is a two-sided port of `vim-tmux-navigator` for Herdr. It makes `Ctrl+h/j/k/l` behave as a single layout across Herdr terminal panes and Neovim splits: inside Neovim the chord moves between `wincmd h/j/k/l` windows and falls through to Herdr at a split edge; outside Neovim the same chord either forwards into Neovim or moves Herdr pane focus.
- **Key Features**: **What the user sees:** seamless directional navigation bound by convention to `Ctrl+h/j/k/l` (plus `Ctrl+Arrows` on the Neovim side). From a plain Herdr pane the chord moves Herdr focus; from a Neovi

### [2026-08-04] szrenwei/herdr-space-tab-metadata
- **Overview**: `szrenwei/herdr-space-tab-metadata` (`herdr-space-tab-metadata`, `v0.1.0`, `min_herdr_version 0.8.0`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. It does not open panes, move focus, or host a TUI; its sole job is to expose each Space's active Tab label and Tab count as workspace metadata tokens (`$active_tab`, `$tab_count`) so the expanded spaces sidebar can render a second line like `tab: write release notes`.
- **Key Features**: **What the user sees:**  * `$active_tab` — `tab: <label>` for the Space's active Tab, cleared to blank when there is no Tab or the label is empty/whitespace. * `$tab_count` — `1 tab` / `N tabs`, clear

### [2026-08-05] bayoudhi/herdr-shell-progress
- **Overview**: `bayoudhi.shell-progress` (`Shell Progress`, `v0.3.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) fills a gap in Herdr's sidebar: Herdr natively shows live status for recognized coding-agent CLIs, but a plain `cargo build --release` or `sleep 60` shows nothing.
- **Key Features**: **Threshold-gated reporting:** Default `threshold_ms=2000`, `tick_ms=2000`, both floored to `MIN_INTERVAL_MS=250` in `src/config.rs:sanitize()`. `src/state.rs:Machine::next_wake_ms()` waits out the re

### [2026-08-10] limars874/herdr-pane-id-metadata
- **Overview**: `Pane ID Metadata` (`limars874.pane-id-metadata`, `v0.4.0`, `min_herdr_version 0.7.5`) is a minimal, dependency-free sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. Its sole job is to expose Herdr's canonical, immutable `pane_id` (e.g. `w5:p1`) and compact tab-location strings as sidebar metadata tokens, without renaming panes.
- **Key Features**: What the user sees is three per-pane tokens, documented in `README.md` and emitted by `src/core.mjs:reportPaneMetadata()`:  * `$pane_id` — raw canonical ID, e.g. `w5:p1`. * `$tab_pane` — `formatTabPan

### [2026-08-13] bayoudhi/herdr-prayer-times
- **Overview**: `bayoudhi/herdr-prayer-times` (`bayoudhi.prayer-times`, `v0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a **sidebar-augmentation + popup** plugin in the Terminal UI & Navigation cohort — closest to `bayoudhi.shell-progress`, `ArteenHD/herdr-cache-timer`, `aorumbayev/herdr-ctx`, `CowboyVang/herdr-tab-badges`, and `ezcorp-org/herdr-git-status`, not to the full TUIs or `vim-tmux-navigator` ports.
- **Key Features**: **What the user sees:**  * **Sidebar line:** `prayer` token rendered as `{icon} {Name} {HH:MM} · in {countdown}`, e.g. `🕌 Asr 17:15 · in 4h 15m`. Icon swaps to `⚠` when `Urgency::Imminent` (`<=30m`);

### [2026-08-13] kazimshah39/herdr-suffix-agent-filter
- **Overview**: `Suffix Agent Filter` (`suffix-agent-filter`, `v0.3.0`, `min_herdr_version 0.8.2`, `macos` only) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. It toggles Herdr's built-in **Agents** sidebar between an exact Space-suffix group — all Spaces sharing everything after the final separator in the focused Space label, e.g. `frontend-acme` / `backend-acme` / `worker-acme` — and Herdr's default Agent view.
- **Key Features**: **What the user sees:**  * **Suffix filtering (default/initial mode):** selecting `frontend-acme` shows agents only from Spaces whose label ends in `-acme`. Matching is exact and case-sensitive (`acme

### [2026-08-15] winoooops/herdr-agent-watcher
- **Overview**: `herdr-agent-watcher` — product name **Agent Watcher** — is coding-agent observability for Herdr. A long-running background daemon polls Herdr pane state, binds live agent panes to per-agent transcript watchers, and reflects what each agent is doing back into Herdr's own UI and into its own live sidebar.
- **Key Features**: **What the user sees:**  * **Stock Herdr UI without sidebar:** lifecycle notifications plus six stable pane-metadata tokens: `agent_watcher_state`, `agent_watcher_phase`, `agent_watcher_model`, `agent

### [2026-08-15] qapquiz/herdr-sidekick
- **Overview**: `herdr.sidekick` (`Sidekick`, `v0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a small Shell-primary plugin (~671 LOC) that keeps one persistent **sidekick agent pane** one keystroke away while coding in a terminal editor.
- **Key Features**: Three user-visible surfaces, all declared in `herdr-plugin.toml`:  * **`toggle` — `Toggle sidekick agent pane` → `sh sidekick.sh toggle`:** Create on first use (`pane split right + rename + agent star

### [2026-08-17] hamidi-dev/herdr-opentab
- **Overview**: `herdr-opentab` (`id: opentab`, `v0.1.0`) puts live per-agent spend in the Herdr sidebar. Each agent pane gains a `$cost` token showing the total cost of the session running in that pane, sub-agents included, priced from local transcripts by the external `opentab` CLI.
- **Key Features**: **What the user sees:** a price leading the agent row, e.g. `~$4.20 · claude`, padded to a common width so amounts and following labels line up in a column. Prices renew on a lease; if the daemon dies

### [2026-08-20] KoalaVim/herdr-nvim-aware
- **Overview**: `herdr-nvim-aware` (`Nvim Aware`, `v0.1.0`, `min_herdr_version 0.7.0`) is a `vim-tmux-navigator`-style dispatcher for Herdr. Its sole job is to make one set of keybindings do the right thing depending on who owns the focused pane: if a live Neovim owns `HERDR_PANE_ID`, forward the keystroke into Neovim via `pane.send_keys`; otherwise perform the equivalent Herdr action natively.
- **Key Features**: Declared surface is 10 `global`-context actions in `herdr-plugin.toml`, each `["./bin/herdr-nvim-aware", "<name>"]`:  * **Directional navigation:** `left` / `down` / `up` / `right` — README binds to `

### [2026-08-22] jackfrancisdalton/herdr-chromatic-spaces
- **Overview**: Chromatic Spaces gives every Herdr Space a persistent, ID-keyed colour identity. That single colour drives three surfaces: a coloured dot in the Spaces/Agents sidebars via pre-styled metadata tokens, a native space-ordered Agent View, and an optional chrome tint that rewrites `theme.custom.*` + `ui.accent` on every space switch.
- **Key Features**: **What the user sees:**  * **Spaces sidebar dot:** `●` (default `■` in `settings.json`, overridable to `◆/▊/◉/█`) inserted after `state_icon`, before `workspace`. Existing `branch`/`git_status` rows p

### [2026-08-24] maedana/herdr-normal-mode
- **Overview**: `maedana/herdr-normal-mode` (`maedana.normal-mode`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Vim-style modal navigator for the Herdr sidebar, not a picker.
- **Key Features**: **Declared surface (`herdr-plugin.toml`):** exactly one `[[panes]]`:  * `normal` — `placement = "popup"`, `title = "NORMAL"`, `command = ["sh","-c","${HERDR_PLUGIN_ROOT}/target/release/herdr-normal-mo

### [2026-08-24] MorganCollins/herdr-last-used
- **Overview**: `MorganCollins/herdr-last-used` (`morgancollins.last-used`, `Last Used`, `v0.1.0`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. It answers *which agents are alive vs. abandoned* by stamping every live agent pane with an absolute, day-aware `Last used <time>` label — green if used within a day, orange if idle over a day, red if idle over a week — and by letting one keypress filter the Agents sidebar to a single activity bucket for cleanup.
- **Key Features**: **What the user sees:**  * Per-agent third row under `state_text`: e.g. `Last used 10:58` (today), `Last used Sat 09:07` (this week), `Last used 12 Aug` (older). Implemented in `src/lib.sh:format_stam

### [2026-08-25] caoool/herdr-sidebar-plugin
- **Overview**: `caoool.sidebar` (`Sidebar`, `v0.2.0`, `min_herdr_version 0.8.0`, `macos`/`linux`, ~10.8k LOC TypeScript) is a right-hand Herdr sidebar for supervising coding-agent panes.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * `[[panes]] sidebar`: `placement=split`, `command=["bash","bin/pane.sh"]`. Placement/direction/width overridden at open time. * `[[actions]] toggle`

### [2026-08-25] reobin/herdr-close-other-panes
- **Overview**: `reobin/herdr-close-other-panes` (`reobin.close-other-panes`, v0.1.0) is a minimal, stateless layout-mutation plugin in the **Terminal UI & Navigation** cohort. Its sole job is the tmux `kill-pane -a` / editor `Close Others` operation for Herdr: close every pane in the current tab except the pane the action was invoked from, leaving other tabs untouched.
- **Key Features**: Declared surface is exactly one user-visible capability:  * **`close-others` — `Close other panes`**: closes every other pane in the invoking pane's tab. Invoked from the command palette, via the docu

### [2026-08-27] youguanxinqing/herdr-flash
- **Overview**: Herdr Flash (`youguanxinqing.herdr-flash`, `v0.3.0`, `min_herdr_version 0.7.4`, `linux`/`macos` only, ~10.4k LOC Rust) brings the `flash.nvim` copy flow to Herdr terminal panes. It captures the exact visible viewport of the focused pane, opens a full-screen picker in a hidden temporary tab, and runs a three-phase loop: **Search** (incremental literal search with one-key labels), **Cursor** (label/Enter lands a bare cursor), **Select and yank** (vim motions + `v`/`V` + `y`/Enter to system clipboard).
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):** one `pane`+`workspace` action:  * `flash` — `Flash: search visible text, select, and yank` → `./bin/herdr-flash flash`  **CLI (`src/cli.rs`, `clap` de

### [2026-08-27] hasuwini77/herdr-tab-git
- **Overview**: `Tab Git Status` (`hasuwini77.tab-git`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. Its sole purpose is to show git branch and working-tree status in the **Spaces** sidebar that follow the *active tab's focused pane*, rather than Herdr's built-ins (`branch` / `git_status`) which are pinned to the workspace identity cwd — `tabs.first()` + `tab.root_pane` in `src/workspace.rs:resolved_identity_cwd_from`.
- **Key Features**: **What the user sees:**  * Second sidebar row configured in `~/.config/herdr/config.toml` as `[["$gitbranch", "$gitstatus"]]` under `[ui.sidebar.spaces]`. * Branch token: `git rev-parse --abbrev-ref H

### [2026-08-28] solidsnakedev/herdr-pane-tools
- **Overview**: `pane-tools` (`Pane Tools`, v1.0.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a dependency-free, Shell-primary Terminal UI & Navigation plugin for directional pane management. It bundles three familiar workflows in one package: `vim-tmux-navigator`-style vim-aware `ctrl+h/j/k/l` navigation, `aerospace`/`i3`-style pane moves that restructure the layout at container edges, and `tmux rotate-window`-style cyclic rotation of all panes in a tab.
- **Key Features**: Declared surface in `herdr-plugin.toml` is 10 stateless, one-shot actions — no `[[panes]]`, no daemons, no event hooks:  **Vim-aware navigation (4x `contexts=["pane"]`):** - `nav-left / nav-down / nav

### [2026-08-28] jtnovellis/herdr-nvim
- **Overview**: `herdr-nvim` (`Herdr Neovim`, `v0.2.3`, `min_herdr_version 0.8.2`, `linux`/`macos` only, ~17k LOC, Rust-primary) is a two-sided Neovim integration for Herdr. Each Herdr tab gets its own full-height Neovim sidebar backed by a detached headless `nvim --headless --listen <sock>` daemon that survives hide/show.
- **Key Features**: **Sidebar lifecycle (Rust `sidebar`, `daemon`):** * `toggle` / `open` / `close` (`contexts=["tab"]`): first open spawns a daemon in the focused pane's cwd, parks other panes in a temp tab, rebuilds th

### [2026-08-28] ubuntudroid/herdr-git-stack
- **Overview**: `ubuntudroid/herdr-git-stack` (`ubuntudroid.git-stack`, `Git branch stacks`, `v0.3.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort.
- **Key Features**: What the user sees, per `README.md`, `lib.sh:gs_token/gs_token_tail`, and `poller-ctl.sh:gs_publish`:  * **Head token `gstk_stack`:** `┌pos/size` for the stack root, `├pos/size` for every deeper membe

### [2026-08-29] NachoPal/herdr-pane-agent-unread
- **Overview**: `nachopal.pane-unread` (`Per-pane unread notifier`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort — closest to `ArteenHD/herdr-cache-timer`, `aorumbayev/herdr-ctx`, `CowboyVang/herdr-tab-badges`, `ezcorp-org/herdr-git-status`, and `hamidi-dev/herdr-opentab`, not to the full TUIs or `vim-tmux-navigator` ports.
- **Key Features**: **Core watcher (`watch.py:Watcher`):**  * **Pane-granularity attention detection:** `working -> done` (background-tab finish), `working -> idle` (same-tab-sibling finish — the core bug Herdr misses), 

### [2026-08-29] yojahny55/herdr-space-groups
- **Overview**: `Space Groups` (`yojahny55.space-groups`, `v0.1.0`, `min_herdr_version 0.8.2`) groups Herdr **Spaces** into named, colored collections — explicitly modeled as browser tab-groups for workspaces. It has two cooperating surfaces: a `popup` picker TUI (`picker.js`) where groups are created, colored, assigned, and jumped-to, and a background reconciler (`sync.js` / `lib.js:sync()`) that materializes each group as a dummy header Space (e.g. `🔵 TOOLS`) and reorders the sidebar so each group's members stay contiguous, ungrouped Spaces last. State is a small user-editable `groups.json` keyed by Space **label**. Zero dependencies, Node.js only, no build step.
- **Key Features**: **Declared surface (`herdr-plugin.toml`):**  * 2 `workspace`-context actions:   * `open-picker` — `herdr plugin pane open --plugin yojahny55.space-groups --entrypoint picker`   * `sync` — `node sync.j

### [2026-09-02] mike-bronner/herdr-plugin-recent-spaces
- **Overview**: `Recent Spaces` (`mikebronner.recent-spaces`, `v0.3.0`, `min_herdr_version 0.8.0`) keeps the Herdr Spaces sidebar in most-recently-used order. On every `workspace.focused` event it notes which workspace gained focus; if focus stays there for a configurable dwell (default 10s) that workspace is moved to just below a pinned home workspace (label `~` by default) at index 1.
- **Key Features**: Single capability, no user-invoked actions or panes:  * **Dwell-gated promotion:** `bin/promote-recent --await <gen>` sleeps `HERDR_RECENT_DWELL` then calls `workspace.move {workspace_id, insert_index

### [2026-09-04] bshearrer/herdr-project-filter
- **Overview**: `bshearrer/herdr-project-filter` (`bshearrer.project-filter`, `Project Filter`, `v0.1.0`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. Its sole job is to scope Herdr's **Agents** sidebar to one git repository at a time.
- **Key Features**: **Three `workspace`-context actions + startup + auto-refresh:**  * `cycle` (`node index.js cycle`): advance `null → first repo → … → untracked → null`. Persisted then pushed via `agent.view.set` / `ag

### [2026-09-04] jwanga/herdr-plugin-github-status
- **Overview**: `jwanga/herdr-plugin-github-status` (`jwanga.github-status`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a full Terminal UI sidebar for Herdr, not a badge plugin. It docks a narrow `26`-column `ratatui` pane on the right edge of the current tab that shows live GitHub project state for the workspace's focused pane: a `NOW` working-set header, open/closed milestones → issues, unassigned/recently-closed issues, open/recent PRs with review + checks, latest Actions workflow runs + per-PR check runs, and an `ACTIVITY` transition feed.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 1 `[[panes]]`: `status`, `title: status`, `placement: split`, `command: sh -c exec "$HERDR_PLUGIN_ROOT/herdr/launch.sh"`. * 3 `workspace`+`pane` ac

### [2026-09-06] lararosekelley/dotfiles
- **Overview**: This is not a Herdr plugin in the normal registry sense. It is Lara Kelley's personal, Linux-oriented **dotfiles repository** (~6.5k LOC per scanner, Shell-primary), whose tracked files live under `content/` and are materialized into `$HOME` by a small purpose-built Rust CLI (`[[bin]] dotfiles`, `bin/main.rs`).
- **Key Features**: ### Rust sync CLI  The only executable code in the surveyed slice is the `dotfiles` CLI defined in `bin/cli.rs` and `bin/commands/`:  * `sync to-home [--symlink] [--yes] [--dry-run] [--backup] [--root

### [2026-09-06] tifandotme/dotfiles
- **Overview**: This is not a standalone registry plugin, it is a single prototype plugin embedded in a personal `chezmoi` dotfiles monorepo for macOS + Ubuntu `box`.
- **Key Features**: **Core plugin — no actions, no panes, one event:**  * `herdr-plugin.toml`: single `[[events]] on = "pane.agent_status_changed"` → `["bun", "run", "src/index.ts"]`. * `working`: spawns a detached per-t

### [2026-09-07] dkbo/herdr-model-badge
- **Overview**: `herdr-model-badge` (v0.4.0, ~3.8k LOC, Python-only) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. It does not open panes, move focus, or host a TUI; its sole job is to answer *which model/effort, how full the context is, what the session cost, and how close rate-limits are* for each live agent pane.
- **Key Features**: **What the user sees:** per-agent sidebar rows such as `opus 5 · high · 21%`, `5h:6% · →02:10`, `wk:4% · →09-14`, `$4.10`, as documented in `README.md` and `config.example.toml`.  Token inventory (`he

### [2026-09-07] bonkey/herdr-pr-emoji
- **Overview**: `bonkey/herdr-pr-emoji` (`bonkey.pr-emoji`, `PR Emoji`, `v0.5.0`, `min_herdr_version 0.8.2`, `macos`/`linux`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. Its sole job is to publish one glyph per sidebar row that summarizes the GitHub pull-request state of that workspace's current branch.
- **Key Features**: **What the user sees:** a `$pr_emoji` token rendered wherever the user wires `{ token = "$pr_emoji" }` in `[ui.sidebar.agents]` and/or `[ui.sidebar.spaces]`. The plugin itself renders nothing; it only

### [2026-09-08] robbyrussell/herdr-ohmyzsh
- **Overview**: `ohmyzsh.shell` (`Oh My Zsh`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a dual-identity plugin: a normal Oh My Zsh custom plugin (`herdr.plugin.zsh` at repo root) plus a thin Herdr wrapper (`herdr-plugin.toml` + `bin/`) that links that checkout into `$ZSH_CUSTOM/plugins/herdr`. Outside a Herdr pane it does nothing except install `herdr` completions; inside a pane (`HERDR_ENV=1` + `HERDR_PANE_ID`) it reports slow shell commands to the Herdr sidebar with agent-like `working` → `idle` lifecycle plus background-toast notifications, and provides `hsplit` / `htab` / `hagent` / `hworktree` / `hreload` shorthands for common Herdr CLI invocations.
- **Key Features**: **Completions everywhere:** * If `herdr` is on `PATH` and `$ZSH_CACHE_DIR` is set, binds `_herdr` via `_comps[herdr]` on first load and regenerates `$ZSH_CACHE_DIR/completions/_herdr` in a fully silen

### [2026-09-08] xzedx/herdr-easyjump
- **Overview**: `xzedx.easyjump` (`EasyJump`, `v0.8.0`, `min_herdr_version 0.8.2`, `linux`/`macos` only, ~2k LOC Rust) is Vimium / EasyMotion / `vim-choosewin`-style hint-jump for Herdr. Press `prefix+f`, every space row and agent row **in the Herdr sidebar itself** gets a yellow `[x]` label; type the label and focus lands there.
- **Key Features**: **Two modes, one binary:**  * **Sidebar mode (default):** labels live where the eye already is. Spaces + agents in sidebar, panes of current tab on pane borders, tabs of current workspace in tab bar. 

### [2026-09-08] newro/herdr-agent-nav
- **Overview**: `newro/herdr-agent-nav` (`newro.agent-nav`, `Agent Nav`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`, ~1.1k LOC Python) is a **sidebar-augmentation + directional navigation** plugin in the Terminal UI & Navigation cohort.
- **Key Features**: **What the user sees:**  * `$num` on each agent row: 1-based index in `agent.list` order, documented as identical to sidebar order and `focus_agent` index, so the number shown is the number typed. * `

### [2026-09-08] SpidySamurai/claude-vezmex-team-tree
- **Overview**: This plugin provides subagent visibility for agent CLIs inside Herdr without ever reading terminal output. It has two complementary surfaces: a compact sidebar tree published as per-pane metadata tokens, and an expanded interactive dashboard pane.
- **Key Features**: **Sidebar summary — `src/herdr_agent_tree.py`:** * Publishes `subagent_1` … `subagent_6` tokens plus `session_summary` per leader pane via `pane report-metadata --source plugin:<id>:agent-tree`. Beyon

### [2026-09-09] WerrySs/herdr-graphical-apps
- **Overview**: `werryss.herdr-graphical-apps` (`Graphical Apps`, `v0.1.1`, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a **graphical terminal-app launcher** for Herdr, not a navigator, sidebar badge, or file TUI like the rest of the Terminal UI & Navigation cohort.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 9 `[[actions]]`, all `python3 scripts/graphical_apps.py ...`:   * `launcher` — `menu-open` in `global,workspace,tab,pane`.   * `browser-right` / `b

### [2026-09-10] poislagarde/herdr-branch-labels
- **Overview**: `poislagarde.branch-labels` (`Branch Labels`, `v0.2.0`, `min_herdr_version 0.9.0`, `linux`/`macos` only, ~1,657 LOC Rust) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. Its sole job is to format Git branch names for display in the Spaces sidebar with a user-configured regular expression and replacement.
- **Key Features**: **User-visible behavior:**  * Root / non-grouped spaces keep their directory-derived label in `$short_space` and show the formatted branch in `$short_branch` (second sidebar row). * Grouped linked wor

### [2026-09-11] houz42/herdr-whichkey
- **Overview**: `houz42/herdr-whichkey` (`houz42.whichkey`, `Which-Key`, `v0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) is a `which-key.nvim`-style discovery popup for the Herdr prefix key.
- **Key Features**: **What the user sees** (`README.md`, `whichkey.py:render()`):  * Root view `f12 — which-key for herdr` with groups in magenta/bold, actionable leaves in cyan, native-only leaves greyed with `(native p

### [2026-09-14] hanbong5938/herdr-omp-subagents
- **Overview**: `omp-subagents` (`OMP Subagent Models`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a **sidebar-augmentation plugin** in the Terminal UI & Navigation cohort. Its sole job is to display live OMP subagent models in Herdr's native agents sidebar as a `$subagents` metadata token, e.g. `[scout:flash-3 | researcher:sonnet-4-6]`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** two `workspace`-context actions, no `[[panes]]`, no `[[events]]`:  * `install-bridge` — `Install OMP model bridge` → `sh scripts/plugin.sh install` * 

### [2026-09-07] rchougule/herdr-agents-info
- **Overview**: `rchougule/herdr-agents-info` — manifest ID `rchougule.agents-info`, name `Agents Info`, `v0.1.0`, `min_herdr_version 0.8.2` — is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. It does not open panes, move focus, or host a TUI.
- **Key Features**: **What the user sees:** per Claude pane, configured via a 5-line `rows_by_agent.claude` recipe in `README.md`:  * Line 1: Herdr-native `workspace` bold leader alone — never crowded. * Lines 2-3: `$tab

### [2026-09-11] reobin/herdr-link-hints
- **Overview**: `herdr-link-hints` (`Link Hints`, `v1.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) is a Vimium-style keyboard link opener for Herdr. Invoked on the focused pane (README binds `prefix+f` to `herdr-link-hints.hints`), it scans the visible text of every pane on the current screen for openable URLs, draws a short typeable code beside each one as a graphics overlay directly over the terminal cells, and opens the selected URL on code completion.
- **Key Features**: **What the user sees:** press the action, every link on screen gains a 1–2 character badge (`a`, `s`, `d`… from home-row-first alphabet `asdfghjklqwertyuiopzxcvbnm`); typing narrows (ruled-out badges 

### [2026-09-15] eliasstravik/herdr-agent-progress
- **Overview**: `agent-progress` (`Agent Progress`, `v0.1.0`, `min_herdr_version 0.9.0`, `platforms = ["macos"]`) is a **sidebar-augmentation** plugin in the Terminal UI & Navigation cohort — closest to `ArteenHD/herdr-cache-timer`, `aorumbayev/herdr-ctx`, `bayoudhi/herdr-shell-progress`, `hamidi-dev/herdr-opentab`, and `NachoPal/herdr-pane-agent-unread`, not to the full TUIs or `vim-tmux-navigator` ports.
- **Key Features**: **User-visible display:** one dimmed summary row `$agent_progress_summary` rendered as `~65% · Testing changes`, `~65% · stale · Testing changes`, `Assessing task` (unknown), or `100% · Done`. The thr

### [2026-09-16] aman0singh/herdr-subs
- **Overview**: `subs` is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. Its sole job is to answer *what AI harnesses am I paying for / logged into, and how close am I to their rate limits* — for Claude Code, Codex, Pi, and OpenCode — with one glance at the Herdr Spaces sidebar.
- **Key Features**: **Two CLI entrypoints in `subs.py` (no arguments = `refresh`):**  * `refresh` — full workflow: `detect_all()` → `ensure_workspace()` → `report()` → prints `{workspace_id, tokens, subscriptions}` JSON 

### [2026-09-17] adihex/herdr-agent-icons
- **Overview**: `local.agent-icons` (`Agent Icons`, `v0.3.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a sidebar-augmentation plugin in the **Terminal UI & Navigation** cohort. Its sole job is to report a per-agent glyph as the custom `$icon` sidebar token for every live agent pane.
- **Key Features**: What the user sees is one extra cell in the Agents sidebar, wired manually in `~/.config/herdr/config.toml`:  ```toml [ui.sidebar.agents] rows = [["state_icon","machine","workspace","tab"],["$icon","a

### [2026-09-17] EdTheBearded/herdbake
- **Overview**: `EdTheBearded/herdbake` (`herdbake`, `v0.2.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) routes Yocto / OpenEmbedded `bitbake` interactive terminal spawns — `menuconfig`, `devshell`, `ccmake` — into Herdr-managed `popup` / `split` / `tab` panes instead of external terminal windows.
- **Key Features**: **Automatic routing:** * Any `bitbake -c menuconfig / devshell` run in an injected pane is intercepted via `OE_TERMINAL_CUSTOMCMD` and opened as a Herdr pane running the real command. `README.md` repo

### [2026-09-18] webdavis/herdr-smart-nav
- **Overview**: `webdavis/herdr-smart-nav` is a `vim-tmux-navigator`-style dispatcher for Herdr. Its sole job is to make one `Ctrl-h/j/k/l` press do the right thing: if the focused Herdr pane has Neovim in the foreground, forward the chord to Neovim to move a split; otherwise move Herdr pane focus directionally.
- **Key Features**: Declared surface is exactly four one-shot actions, no `[[panes]]`, no `[[events]]`, no hooks:  * `nav_left` / `nav_down` / `nav_up` / `nav_right` → `./target/release/herdr-smart-nav left|down|up|right

### [2026-09-18] NathanymousFu/nvim-ascii-on-focus
- **Overview**: `NathanymousFu.nvim-ascii-on-focus` (`Neovim ASCII on Focus`, `v0.1.0`, `min_herdr_version 0.9.1`, `macos` only) is a tiny, stateless, event-only Herdr plugin (~127 LOC, Shell-primary). Its sole job is to normalize the macOS input source back to Latin/ASCII when a Herdr pane running a Neovim remote UI gains focus while Neovim is already in Normal mode.
- **Key Features**: What the user sees is invisible — no picker, pane, badge, or keybinding:  * **Focus-triggered normalize:** On every `pane.focused` event, if the newly focused pane's foreground process is `nvim --serv

