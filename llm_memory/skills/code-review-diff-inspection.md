# Architectural Memory: Code Review & Diff Inspection

This document tracks architectural patterns and previously surveyed extensions within the **Code Review & Diff Inspection** domain.

## Surveyed Extensions Ledger

### [2026-01-16] eugenioenko/ttt
- **Overview**: `eugenioenko/ttt` packages **TTT Editor — Terminal Text Tool** as a Herdr plugin (`ttt.editor` v0.1.0). TTT itself is a large Go TUI IDE (~155k LOC) — a single-binary alternative to VS Code/Zed/Sublime with editor, LSP, Git, terminal, and Lua plugins. The Herdr wrapper is intentionally thin: it installs the `ttt` binary and opens it in a Herdr `tab` pane pointed at the active worktree/workspace directory.
- **Key Features**: **Herdr surface is minimal — 2 actions + 1 pane:**  * `ttt.editor.open` — “Open TTT” in current workspace * `ttt.editor.open-worktree` — “Open TTT in worktree” * `editor` pane — `title: TTT Editor`, `

### [2026-02-24] VilfredSikker/easy-review
- **Overview**: `easy-review` (`Easy Review` v0.1.0, `min_herdr_version 0.7.0`) is a thin Herdr wrapper around the `er` terminal TUI from the `VilfredSikker/easy-review` monorepo. It does not re-implement review logic; it opens `er` in a Herdr `tab` pane for the current branch/worktree, or `er --remote <url>` for a clicked GitHub PR. This follows the established `Code Review & Diff Inspection` pattern seen in `eugenioenko/ttt`: a minimal declarative shim that launches a full external TUI binary inside the workspace.
- **Key Features**: What is declaratively defined in `tools/herdr-easy-review/herdr-plugin.toml`:  * **Review pane (`panes.review`):** `title: Review`, `placement: tab`, `command: ["bash", "open.sh"]`. Per `tools/herdr-e

