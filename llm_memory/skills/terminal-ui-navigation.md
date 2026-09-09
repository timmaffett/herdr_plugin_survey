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

