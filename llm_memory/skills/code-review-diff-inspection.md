# Architectural Memory: Code Review & Diff Inspection

This document tracks architectural patterns and previously surveyed extensions within the **Code Review & Diff Inspection** domain.

## Surveyed Extensions Ledger

### [2026-01-16] eugenioenko/ttt
- **Overview**: `eugenioenko/ttt` packages **TTT Editor — Terminal Text Tool** as a Herdr plugin (`ttt.editor` v0.1.0). TTT itself is a large Go TUI IDE (~155k LOC) — a single-binary alternative to VS Code/Zed/Sublime with editor, LSP, Git, terminal, and Lua plugins. The Herdr wrapper is intentionally thin: it installs the `ttt` binary and opens it in a Herdr `tab` pane pointed at the active worktree/workspace directory.
- **Key Features**: **Herdr surface is minimal — 2 actions + 1 pane:**  * `ttt.editor.open` — “Open TTT” in current workspace * `ttt.editor.open-worktree` — “Open TTT in worktree” * `editor` pane — `title: TTT Editor`, `

### [2026-02-24] VilfredSikker/easy-review
- **Overview**: `easy-review` (`Easy Review` v0.1.0, `min_herdr_version 0.7.0`) is a thin Herdr wrapper around the `er` terminal TUI from the `VilfredSikker/easy-review` monorepo. It does not re-implement review logic; it opens `er` in a Herdr `tab` pane for the current branch/worktree, or `er --remote <url>` for a clicked GitHub PR. This follows the established `Code Review & Diff Inspection` pattern seen in `eugenioenko/ttt`: a minimal declarative shim that launches a full external TUI binary inside the workspace.
- **Key Features**: What is declaratively defined in `tools/herdr-easy-review/herdr-plugin.toml`:  * **Review pane (`panes.review`):** `title: Review`, `placement: tab`, `command: ["bash", "open.sh"]`. Per `tools/herdr-e

### [2026-04-30] openclaw/crabbox
- **Overview**: The `crabbox` Herdr plugin (`Crabbox` v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a thin, declarative shell shim around the much larger Crabbox remote-execution control plane. Crabbox itself is a ~972k LOC Go system — CLI + coordinator (Cloudflare Workers/Durable Object or Node.js/PostgreSQL) + SSH-leased runners — for leasing a cloud/local box, syncing the dirty worktree, running a repo command remotely, and streaming evidence back.
- **Key Features**: What is declaratively defined in `plugins/herdr/herdr-plugin.toml` is the entire user surface — 6 panes + 6 matching actions, all scoped to `contexts = ["workspace"]`:  * **Panes (`[[panes]]` → `sh bi

### [2026-06-18] smarzban/herdr-file-viewer
- **Overview**: `herdr-file-viewer` v1.16.0 (`min_herdr_version 0.7.0`, `linux`/`macos`/`windows`) is a **git-aware, read-only file viewer** that runs as a keyboard-driven TUI inside a Herdr split pane. It shows a directory tree on the left and the “right view” for the selected file on the right — working-tree diff if changed, rendered markdown, or syntax-highlighted code.
- **Key Features**: **Herdr surface (from `herdr-plugin.toml`):**  * 1 pane: `file-viewer` (`title: Files`, `placement: split`, `command: ["./target/release/herdr-file-viewer"]`). No Windows pane entry by design. * 4 act

### [2026-06-23] edmundmiller/herdr-plugin-hunk
- **Overview**: `hunk.diff` (`Hunk Diff` v0.1.0, `min_herdr_version 0.7.0`) is a minimal Herdr shim for the external **Hunk** diff TUI (`hunk` / `bunx hunkdiff`). It does not implement diffing itself; it resolves the current Herdr workspace/pane context, builds a `hunk diff ...` shell string for worktree, staged, or branch scope, and opens it in a new Herdr split or tab via the `herdr` CLI.
- **Key Features**: What is explicitly defined in `herdr-plugin.toml` + `hunk_herdr.py` + `README.md`:  **6 actions (3 modes × 2 placements), no declarative panes, hooks, or API endpoints:**  * `hunk.diff.worktree-split`

### [2026-06-23] edmundmiller/herdr-plugin-dotfiles-github-link-preview
- **Overview**: `dotfiles.github-link-preview` (`Dotfiles GitHub Link Preview` v0.1.0, `min_herdr_version 0.7.0`) is a minimal, click-driven Herdr plugin for **Code Review & Diff Inspection**. It registers a `link_handler` for `github.com/<owner>/<repo>/issues|pull/<number>` URLs; when invoked it auto-splits the focused pane to the right and runs `gh {pr|issue} view <url> --comments` there for read-only preview.
- **Key Features**: **What is explicitly declared in `herdr-plugin.toml` + `README.md`:**  * **1 action:** `preview` — `Preview GitHub issue or pull request`, `contexts = ["pane"]`, `command = ["python3", "github_link_pr

### [2026-06-26] persiyanov/herdr-reviewr
- **Overview**: `persiyanov.reviewr` (`reviewr` v0.36.2, `min_herdr_version 0.7.5`, `macos`/`linux` only) is a Rust `ratatui` TUI that runs as a Herdr plugin pane beside a coding agent. It points one persistent pane at one git worktree, shows the agent's diff with syntax highlighting, takes line/range comments, and sends them back into the agent's input — it never edits the worktree and never posts to the forge.
- **Key Features**: **Herdr surface — declaratively minimal:** * 1 pane: `pane` (`title: reviewr`, `placement: split`, `command: ["sh","-c","exec \"$HERDR_PLUGIN_ROOT/bin/herdr-reviewr\""]`). * 3 actions, all `contexts =

### [2026-07-02] inxx/herdr-plan-code-review
- **Overview**: `inxx/herdr-plan-code-review` (`plan-code-review` v0.4.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a workflow-orchestration plugin, not a diff renderer. One action opens a four-pane pipeline — `planner` (Opus, plan-mode) + `coder` (Sonnet) in the current tab, `rev-cc` (Claude Opus) + `rev-cx` (Codex) in a dedicated `review` tab — where handoff happens out-of-band via `plan.md` and `git diff`. Herdr manages only panes and `idle/working/blocked` state; a second optional feature tails Claude Code subagent transcripts into ephemeral viewer panes.
- **Key Features**: No declarative `[[panes]]` and no HTTP API endpoints. The entire surface in `herdr-plugin.toml` is 4 `workspace/tab` actions + 1 event subscription:  * **`layout` (`actions/layout.sh`):** Idempotent c

### [2026-07-05] scott306lr/herdr-plugin-hunk-autodiff
- **Overview**: `hunk.autodiff` (`Hunk Auto Diff` v0.1.0, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a zero-UI automation plugin in the **Code Review & Diff Inspection** domain. Unlike the manual `edmundmiller/herdr-plugin-hunk` shim (6 explicit actions to open `hunk diff` in a split/tab) or the persistent Rust TUI `persiyanov/herdr-reviewr`, this plugin defines no actions or panes at all — it subscribes to `pane.agent_status_changed` and automatically opens a right-hand split running `hunk diff --watch` whenever a coding agent (Claude Code, Codex) goes `idle` with a dirty working tree.
- **Key Features**: Key features as implemented, not as marketed:  * **Idle-triggered auto-diff:** On every `pane.agent_status_changed` event where `data.agent_status == idle`, resolves `data.pane_id` → pane cwd → git to

### [2026-07-07] juninaba/herdr-pr-preview
- **Overview**: `juninaba/herdr-pr-preview` — distributed as **Herdr PR Status `0.2.0`** (`min_herdr_version 0.7.0`, `linux`/`macos` only) — is a small, read-only observer for the **Code Review & Diff Inspection** domain. It shows the GitHub pull request associated with the current Herdr workspace branch, including PR metadata, review decision, commit list, and CI `statusCheckRollup`, in a right-hand split pane.
- **Key Features**: **Declarative surface is 1 action + 1 pane, no hooks, no HTTP API:**  * `open` — “Open PR Status”, `command = ["./open.sh"]`. Launcher only; resolves target pane/cwd context and opens the viewer. * `p

