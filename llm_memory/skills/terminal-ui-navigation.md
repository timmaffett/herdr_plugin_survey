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

