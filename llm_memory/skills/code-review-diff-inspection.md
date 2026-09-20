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

### [2026-07-09] robert-flo/herdr-terminal-file-manager
- **Overview**: This plugin — manifest ID `robert-flo.elio`, display name `File Explorer` v0.1.0 — is a thin Herdr wrapper around **elio**, an external batteries-included terminal file manager (rich previews, inline images, bulk actions, trash support). It does not implement any browsing, previewing, or file-operation logic itself; its only job is to ensure `elio` is installed and to open it in a Herdr pane rooted at the directory the user was just working in.
- **Key Features**: What is actually implemented in `herdr-plugin.toml` + `bin/resolve-dir.sh`:  * **1 pane — `explorer`:** `title: Explorer`, `placement: split`, `command: ["bash", "-c", "exec elio"]`. No arguments; inh

### [2026-07-10] Volpestyle/herdr-plugin-mermaid-preview
- **Overview**: `dev.volpestyle.mermaid-preview` (`Mermaid Preview` v0.1.0, `min_herdr_version 0.7.1`, `macos`/`linux` only) renders Mermaid fenced blocks emitted by the native Claude Code or Codex session behind a selected Herdr pane in a live Herdr tab.
- **Key Features**: Declarative surface in `herdr-plugin.toml` is minimal — **1 action + 1 pane, no hooks, no HTTP API endpoints:**  * `open` — `Open Mermaid preview`, `contexts=["pane"]`, `command=["node","src/open-prev

### [2026-07-11] JacquesvanWyk/herdr-hunk
- **Overview**: `herdr-hunk` (`herdr-hunk` v0.1.1, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a pure-Shell Herdr plugin that wraps the external **hunk** diff TUI (`hunk.dev`). It does not implement diffing itself.
- **Key Features**: **Declarative surface in `herdr-plugin.toml`: 2 panes + 4 actions + 1 event. No hooks beyond that event, no HTTP API.**  Panes (spawned directly by Herdr, `cwd` = `--cwd` at open time):  * `hunk-diff`

### [2026-07-12] tomasvarga/herdr-pickr
- **Overview**: `tomasvarga/herdr-pickr` (`pickr` / `herdr-pickr` v0.1.2, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a **PR/MR review router**, not a diff renderer. Ctrl+clicking a GitHub `.../pull/NN` or GitLab `.../-/merge_requests/NN` link in any Herdr pane opens an `overlay` chooser pane that lets the user pick *how* to review — `tuicr`, `hunk`, plain `diff` via `bat`, browser, or a custom command — then `exec`s that reviewer in place.
- **Key Features**: **What the user sees:**  * **Link-click routing:** Two `[[link_handlers]]` fire the same `route` action:   * `github-pr`: `^https://github\.com/[^/]+/[^/]+/pull/[0-9]+([/#?].*)?$`   * `gitlab-mr`: `^h

### [2026-07-12] tomasvarga/herdr-sniffr
- **Overview**: `herdr-sniffr` (`sniffr` / `herdr-sniffr` v0.8.0, `min_herdr_version 0.7.0`, `macos`/`linux` only) is an **AI pre-review launcher** for the Code Review & Diff Inspection domain. Point `sniffr <pr>` at a GitHub PR and it opens the PR in your terminal reviewer — `tuicr` by default, `hunk`, or a custom tool — while a detached agent reviews the diff in the background and injects findings as **local-draft, line-anchored comments** before you start reading.
- **Key Features**: What is declaratively defined in `herdr-plugin.toml` is minimal: **1 build hook + 1 action, no panes, no hooks, no link handlers, no HTTP API:**  * `[[build]] command = ["bash", "install.sh"]` — boots

### [2026-07-15] jorge-huxley/herdr-git-graph
- **Overview**: `jorge-huxley/herdr-git-graph` (`herdr-git-graph` v0.1.4, `min_herdr_version 0.7.0`) is a **read-only git commit-graph viewer** for the Code Review & Diff Inspection domain.
- **Key Features**: **Herdr-declared surface in `herdr-plugin.toml` — 1 pane + 4 actions, no hooks, no events, no HTTP API:**  * Pane `git-graph`: `title: Git Graph`, `placement: split`, `command: ["./target/release/herd

### [2026-07-15] Allianaab2m/herdr-hunk-gh-diff
- **Overview**: `Allianaab2m/herdr-hunk-gh-diff` (`hunk.gh-diff` / `Hunk GitHub PR Diff` v0.1.0) is a thin, PR-aware launcher in the **Code Review & Diff Inspection** domain. Given the branch checked out in the focused Herdr pane, it asks the GitHub CLI for that branch's PR and its `baseRefName`, resolves the base to a local ref, and opens `hunk diff <base>...<head>` in a new Herdr split or tab.
- **Key Features**: What the user gets is exactly two manual actions, no persistent UI:  * `hunk.gh-diff.pr-split` — `Hunk PR diff in split`: opens right-hand split in current workspace. * `hunk.gh-diff.pr-tab` — `Hunk P

### [2026-07-16] jagzmz/herdr-annotations
- **Overview**: Herdr Annotations is a local-first, private capture tool for the **Code Review & Diff Inspection** domain, but it is not a diff renderer or forge integration. Where surveyed peers like `eugenioenko/ttt`, `VilfredSikker/easy-review`, `edmundmiller/herdr-plugin-hunk`, `JacquesvanWyk/herdr-hunk`, or `persiyanov/herdr-reviewr` launch an external TUI (`ttt`, `er`, `hunk`, `reviewr`) to inspect `git diff` or a GitHub PR, this plugin solves a narrower workflow: plain-drag terminal text, open a session-modal popup, write why it matters, and either insert that quote+note immediately or accumulate an ordered local collection for one-shot paste.
- **Key Features**: **Declarative surface — 2 actions, 10 pane entrypoints, no hooks/events/API:**  * `jagzmz.herdr-annotations.annotate-selection` (`contexts=["selection","pane"]`, `node src/annotate-selection.mjs`): va

### [2026-07-16] Javamomma/herdr-scribe
- **Overview**: `herdr-scribe` (`scribe` v0.2.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a **live, no-recording meeting transcription plugin** for Herdr. It pipes microphone audio — plus an optional second stream for remote call participants — straight through a local speech-to-text worker into a RAM-only transcript, with a live rolling analyst brief alongside.
- **Key Features**: What is actually implemented in `scribe.sh`, `scribe-transcribe.py`, `scribe-analyst.sh`, `scribe-notes`, `scribe-doc2text`, `scribe-artifacts*`, and `herdr/*.sh`:  * **Meeting lifecycle (`scribe.sh s

### [2026-07-17] alexarthurs/herdr-sidebar
- **Overview**: `herdr-sidebar` v0.11.0 (`min_herdr_version 0.8.0`, `linux`/`macos`/`windows`) is a VS Code-style sidebar for Herdr: file explorer + source control in one dockable pane.
- **Key Features**: **Explorer view (`src/explorer_app.rs`, `src/tree.rs`, `src/actions.rs`):**  * Real tree with chevrons, indentation, two icon themes (Material Nerd-Font / emoji, auto-detected, `i` to toggle, persiste

### [2026-07-17] arvindparmar-me/herdr-markdown-viewer
- **Overview**: `arvindparmar-me/herdr-markdown-viewer` (`herdr.markdown-viewer` / `Markdown Viewer` v0.1.0, `min_herdr_version 0.7.4`, `linux`/`macos` only) is a minimal two-script Shell plugin for previewing a single local Markdown file in a right-hand Herdr split.
- **Key Features**: Declarative surface in `herdr-plugin.toml` is **1 action + 1 pane, no hooks, events, link handlers, or HTTP API endpoints**:  * **Action `preview` — `Preview markdown file`, `command = ["bash", "open.

### [2026-07-18] alexarthurs/herdr-notes
- **Overview**: `herdr-notes` is a self-contained Rust TUI plugin that provides **one persistent markdown scratch note per Herdr workspace** in a right-docked split pane. It is not a diff renderer or forge integration like most peers in the **Code Review & Diff Inspection** ledger (`hunk`, `reviewr`, `easy-review`); it is a companion surface — rendered preview plus plain-text editing that lives beside running agents and survives pane closes, server restarts, and reboots via atomic per-workspace JSON autosave.
- **Key Features**: **User-visible surface is minimal by design: 1 pane + 2 toggle actions, no hooks, events, link handlers, or HTTP endpoints.**  * **Pane `notes` (`title: Notes`, `placement: split`, `command: ["./targe

### [2026-07-18] yuucu/herdr-hunk
- **Overview**: `yuucu/herdr-hunk` (`yuucu.hunk`, `Hunk Review` v0.4.1, `min_herdr_version 0.7.0`) brings the external [Hunk](https://hunk.dev) diff TUI into Herdr agent workspaces. It does not implement diffing itself; a single stdlib-only Go binary resolves the repo behind the focused pane and opens a live `hunk diff --watch` session in a Herdr pane.
- **Key Features**: **What is declaratively defined in `herdr-plugin.toml` is minimal: 1 build hook + 1 action + 1 pane + 1 event. No link handlers, no HTTP API endpoints.**  * **Action `open-review` — `Open Hunk review`

### [2026-07-18] yxhta/herdr-agents-picker
- **Overview**: `yxhta.agents-picker` (`Agents Picker` v0.1.0, `min_herdr_version 0.7.2`, `macos`/`linux` only) is a Rust + `ratatui` modal popup for navigating Herdr-detected agent panes. It mimics the built-in workspace picker: fuzzy-filter as you type, live-preview the selected agent's terminal on the right, `Enter` to focus it.
- **Key Features**: **User-visible surface is 1 action + 1 popup pane + 1 background event:**  * `open` (`Open agents picker`, `contexts=["workspace"]`, `./target/release/agents-picker --open`) — intended to be bound as 

### [2026-07-18] IgorWarzocha/herdr-annotations
- **Overview**: This plugin collects human feedback on terminal text and stages it into the originating agent without submitting it. The workflow is: copy/drag-select terminal output, invoke capture to attach a free-text note, repeat to build an ordered per-pane “round,” then review that round and paste it as Markdown into the agent’s input for final review/submission.
- **Key Features**: **What the user sees:**  * `capture` — “Annotate selection” (`contexts = ["pane","selection"]`, `node src/action.mjs capture`): sanitizes `selected_text` or falls back to OS clipboard, stashes a `pend

### [2026-07-18] leonho/herdr-idle-panes
- **Overview**: `leonho.idle-panes` (`Idle Panes` v0.3.0, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a **pane-session janitor and navigator**, not a diff/review renderer despite its ledger category. It opens an `fzf`-powered `popup` that lists panes hidden across tabs/workspaces in two modes: `Active` (busy panes to jump to) and `Idle` (shells sitting at a prompt to bulk-close).
- **Key Features**: **Declarative surface in `herdr-plugin.toml`: 2 actions + 3 panes, no hooks/events/API:**  * Actions (`contexts = ["pane","workspace"]`):   * `open` — `Panes: jump to active pane / close idle panes` →

### [2026-07-20] ChmaraX/herdr-gitview
- **Overview**: `ChmaraX/herdr-gitview` (`chmarax.gitview` / `gitview` v0.3.0, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a two-process Rust TUI for Code Review & Diff Inspection. It shows changed files in a `list` pane and a syntax-highlighted structured diff in a `preview` pane. `Enter` turns the preview pane's PTY into a real `nvim` session opened at the first changed line; `:wq` restores the diff.
- **Key Features**: **What the user sees:**  * **Grouped worktree view:** `merge conflicts` / `staged changes` / `changes` sections. Partially-staged files appear in both. Directory rows are collapsible, fold single-chil

### [2026-07-20] krzysztoff1/herdr-cull
- **Overview**: `krzysztoff1/herdr-cull` (`herdr-cull` / `Cull (idle agent panes)` v0.4.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a **pane-session janitor for agent panes**, not a diff renderer.
- **Key Features**: What is actually implemented in `herdr-plugin.toml` + `open.sh` + `cull.sh` (382 LOC Shell):  **User surface: 1 action + 1 pane, no hooks, no events, no link handlers, no HTTP API:**  * `herdr-cull.op

### [2026-07-21] phin-tech/herdr-roborev
- **Overview**: `roborev` is a minimal Herdr shim that opens the external **roborev review TUI** in a Herdr pane scoped to the active project. It implements no review, diff, or Git logic itself; its entire job is to resolve the caller's workspace directory from Herdr context and launch `roborev tui --repo --branch` there. This follows the established Code Review & Diff Inspection pattern in this ledger (`ttt`, `easy-review`, `hunk` variants, `yuucu/herdr-hunk`): thin declarative wrapper around a full external TUI binary.
- **Key Features**: What is explicitly defined in `herdr-plugin.toml` + `action-open.sh`:  * **1 action — `open` (`Open Roborev`):** Launcher only. `contexts = ["global", "workspace"]`, `command = ["sh", "action-open.sh"

### [2026-07-22] loopkeep/herdr-plugin-loopreview
- **Overview**: `loopkeep/herdr-plugin-loopreview` (`loopkeep.loopreview` v0.1.2, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a worktree + GitHub PR router for the **Code Review & Diff Inspection** domain. It provides a single keyboard-driven `ratatui` popup that lists local `git worktrees` immediately, streams open PRs via `gh` in the background, and opens the selection in `lr` (`loopreview`) inside one reused, named `loopreview` pane per Herdr tab. Unlike the thin `hunk`/`er`/`ttt` shims in the ledger, it adds pane-reuse state, branch-base resolution, and a guarded bulk worktree-cleanup workflow.
- **Key Features**: **What the user sees:**  * **Picker TUI (`picker` action):** fuzzy-filtered list of worktrees + PRs + dynamic “open this PR” row. Keys: `Enter` open in default view, `Ctrl-B` open in alternate view, `

### [2026-07-23] chouxcreams/herdr-dashboard
- **Overview**: `chouxcreams.herdr-dashboard` (`PR Dashboard` v0.1.0, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a **workspace-grouped PR status dashboard** for Herdr. When multiple coding-agent sessions each own a pane/branch/PR, it aggregates all of them into one terminal UI: PR state, CI verdict, review decision/approvals, repo/branch, grouped under `Workspace label (id) — N PR(s)`.
- **Key Features**: **Herdr-declared surface is minimal: 1 `[[build]]` + 1 `[[panes]]` + 1 `[[actions]]`. No hooks, events, `link_handlers`, or HTTP API endpoints.**  * `dashboard` pane: `title: PR Dashboard`, `placement

### [2026-07-24] azizuysal/herdr-workbench
- **Overview**: `azizuysal/herdr-workbench` (`Herdr Workbench` v1.0.7, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a full, local-first project sidebar for Herdr, not a thin shim around an external TUI.
- **Key Features**: **Declared Herdr surface in `herdr-plugin.toml`:**  * `[[build]]`: `["mise", "exec", "--", "cargo", "build", "--release", "--locked"]` * `[[startup]]`: `["./target/release/herdr-workbench", "restore"]

### [2026-07-24] bkarpinos/herdr-picker
- **Overview**: `bkarpinos/herdr-picker` — manifest `herdr.picker` / `herdr picker` `v0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only — is a workspace / agent / tab navigator, not a diff renderer despite its filing under **Code Review & Diff Inspection**.
- **Key Features**: Declarative surface is minimal: **1 build + 1 action + 1 pane, no hooks, events, `link_handlers`, or HTTP API endpoints.**  * **Action `open` — `open herdr picker`:** `contexts = ["workspace","tab","p

### [2026-07-26] bredebjorhovd/herdr-board
- **Overview**: This plugin is a **task board that runs inside Herdr: Linear/GitHub in, Herdr panes out**. It polls Linear (read-write, system of record) and GitHub issues/PRs into a local SQLite database, renders them as a `BLOCKED / WORKING / READY / REVIEW / FAILED / DONE` queue in a Herdr split pane, and dispatches the selected row into a Herdr workspace as a git worktree + agent pane. It then reconciles Herdr pane/agent state back to board state, delivers PR reviews and settle notices, and exposes a CLI contract (`list --json`, `dispatch`, `wait`) explicitly designed for orchestrator agents to self-queue.
- **Key Features**: What the user and agents actually get:  **Interactive surfaces:** * `board` pane (`title: Board`, `placement: split`): global queue beside current work. Pure renderer over `board.db`; logs to file onl

### [2026-07-26] rytkmt/herdr-diff-review.nvim
- **Overview**: `rytkmt/herdr-diff-review.nvim` (`diff-review` / `Diff Review` v0.1.0, `min_herdr_version 0.7.4`, `linux` only) is a **gating pre-write reviewer**, not a passive diff viewer.
- **Key Features**: **What the user sees:**  * **Per-edit blocking review:** Every qualifying `Edit`/`Write` (Claude) or `strReplace`/`create`/`insert` (Kiro) pauses the agent for up to `DIFF_REVIEW_TIMEOUT` (default 180

### [2026-07-27] quantk/herdr-review
- **Overview**: `quantk/herdr-review` — manifest ID `quantick.hunk-review`, display name `Native Review` v0.2.7, `min_herdr_version 0.7.0`, `linux`/`macos` only — is a human-in-the-loop review companion for agent worktrees. Focus a detected coding agent, press `F6` to open a live native diff in a dedicated `Review` tab, save line/range comments, then press `F7` to insert those comments as an unsubmitted draft into the exact source agent.
- **Key Features**: **Declared Herdr surface is minimal: 2 actions + 1 pane, no hooks, events, `link_handlers`, or HTTP endpoints:**  * `open-review` — `Review changes`, `contexts=["pane"]`, `node src/open-review.mjs`. R

### [2026-07-27] RufusLin/herdr-openmd
- **Overview**: `openmd` (`openmd` v0.1.2, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a thin launcher shim that opens the external **openmd Qt markdown viewer** as a detached GUI window from Herdr context. It implements no rendering, diffing, or markdown parsing itself.
- **Key Features**: Declared surface is minimal: **1 action, 0 panes, 0 hooks, 0 events, 0 link handlers, 0 HTTP endpoints.**  * `openmd.open` — `Open openmd` / `Open selected .md path or markdown text in openmd; otherwi

### [2026-07-28] plannotator/herdr-plannotator
- **Overview**: `plannotator/herdr-plannotator` (`official.plannotator`, `0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a configuration + presenter bridge, not a diff renderer.
- **Key Features**: Declared Herdr surface in `herdr-plugin.toml` is minimal: **1 `[[build]]` + 3 `[[actions]]`, no `[[panes]]`, no hooks, events, `link_handlers`, or HTTP endpoints:**  * `configure` — `Configure Plannot

### [2026-07-28] brianh20/herdr-stagr
- **Overview**: `brianh20/herdr-stagr` (`brianh20.stagr`, `stagr` v0.2.0) is a **Source Control sidebar for Herdr** — the VS Code / Cursor-style Changes panel for agent worktrees.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): 1 pane + 3 actions + 1 event, no HTTP API, no link handlers:**  * Pane `sidebar` (`title: stagr`, `placement: split`, `command: ["sh","-c","exec \"$HERD

### [2026-07-28] cevr/herdr-hunk
- **Overview**: `cvr.herdr-hunk` (`Hunk Review` v0.1.0, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a review-bridge plugin in the **Code Review & Diff Inspection** ledger. It does not implement diffing: it launches the external **Hunk** TUI (`hunk diff --watch`) in a dedicated Herdr `tab`, remembers which agent pane opened that tab, then copies saved Hunk `user` notes into that exact source pane as a single-line prompt.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **2 actions + 1 pane, no hooks, events, link_handlers, or HTTP API**:  * `open` — `Open Hunk review`, `contexts=["pane"]`, `command=["bin/herdr-hunk","open"]

### [2026-07-30] vonzelle-vzt/herdr-extensions
- **Overview**: `herdr-extensions` v0.18.0 (`min_herdr_version 0.7.0`, `linux`/`macos`) is an **installer that makes Herdr behave like a tiny VS Code**. One Python CLI installs the editor, source-control UI, fonts, formatters and language servers, renders a Herdr plugin manifest with absolute binary paths, injects collision-checked keybindings, and auto-opens a project-scoped editor beside every new workspace.
- **Key Features**: **Herdr surface declared in `plugin/herdr-plugin.toml`: 16 panes + 20 actions + 1 event.**  Panes (`placement: split` except `editor-tab: tab`): `Edit` (x2: `editor` split + `editor-tab` tab), `Git` (

### [2026-07-30] aleslanger/herdr-strays
- **Overview**: `aleslanger.strays` (`strays` v1.1.1, `min_herdr_version 0.7.0`) is a **live, read-only worktree monitor** for Herdr. It keeps one split pane beside the current work that lists every file that “strayed from HEAD” — staged, unstaged, untracked, renamed, deleted, unmerged and submodule gitlinks — across the current workspace or all workspaces, with the selected file’s diff immediately readable.
- **Key Features**: **Herdr-declared surface is minimal — 1 pane + 1 action, no hooks/events/link_handlers/HTTP API:**  * `panes.strays`: `title: strays`, `placement: split`, `command: ["./bin/herdr-strays"]`. * `actions

### [2026-07-31] flupke/herdr-progressive-reviewer
- **Overview**: `herdr.progressive-reviewer` (`Progressive reviewer` v0.2.0, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a full native review workbench for Herdr, not a thin launcher.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): no hooks, events, link handlers, or HTTP API.**  - 3 actions: `open` / `close` / `toggle` — `contexts=["workspace"]`, `command=["bin/reviewer-control", 

### [2026-07-31] shadowfax92/herdr-comments
- **Overview**: `shadowfax.comments` (`Herdr Comments` v0.1.0, `min_herdr_version 0.7.5`, `macos` only) is a local-first annotation collector for the **Code Review & Diff Inspection** domain. It turns passages of terminal history into quote-first Markdown (`> quote` + comment) for pasting into an agent prompt.
- **Key Features**: **User surface — 3 actions + 2 popup panes, no hooks/events/link handlers/HTTP API:**  * `capture` — `Annotate pane history`, `contexts=["pane","selection"]`, `["./target/release/herdr-comments","capt

### [2026-07-31] baotran01/herdr-agent-diff
- **Overview**: `herdr-agent-diff` (`Herdr Agent Diff` v0.1.3, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a self-contained, read-only Git and source viewer for Herdr agent panes. It opens a split (or tab) beside a running agent, shows combined staged/unstaged/renamed/deleted/untracked diff vs `HEAD` plus committed-but-unpushed diff vs `@{upstream}`, and provides a second tab for browsing current file contents with syntax highlighting.
- **Key Features**: **What the user sees:**  * **Changes tab (default, `Git diff` mode):** grouped, collapsible tree by `staged/` / `unstaged/` / `mixed/` / `untracked/` status, then by folder. Selecting a file renders a

### [2026-08-01] caoer/ccc-herdr-layout
- **Overview**: `ccc-layout` (`ccc-layout` / `Layout Picker` v0.1.2, `min_herdr_version 0.7.5`) is a **live tab-layout switcher for Herdr, not a code-review tool** despite its filing under Code Review & Diff Inspection. Pressing the bound key opens a `popup` with thumbnail previews of candidate BSP arrangements for the panes in the current tab; moving the highlight reshapes the real tab in-place, `Enter` commits, `Escape` restores the starting tree. All pane processes and scrollback survive because the plugin never recreates panes — it only re-parents them via `pane.move`.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 1 action + 1 pane, no hooks/events/link_handlers/HTTP API:**  * `pick` — `Layout: pick layout`, `contexts=["tab","pane"]`, `command=["./bin/ccc-layout",

### [2026-08-07] mikhail-angelov/herdr-review-loop
- **Overview**: `herdr-review-loop` (`herdr-review-loop` v0.1.0, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a workflow-orchestration plugin, not a diff renderer. It pairs the agent in the focused pane as **author** with a second, different-kind agent in the same workspace as **reviewer**, then drives `reviewer → author → reviewer` rounds over the uncommitted working tree until the review parses as `clean`, the `max_iterations` budget is spent, the pair deadlocks, or a human is needed.
- **Key Features**: **What the user sees is 7 Herdr actions + 3 panes, no hooks/events/link-handlers/HTTP:**  Declared in `herdr-plugin.toml`:  * Actions (all `bash bin/run.sh …`): `review` (`review`), `pair` (`review --

### [2026-08-09] plannotator/herdr-annotate
- **Overview**: `plannotator/herdr-annotate` (`annotate` / `Annotate` v`0.3.0`, `min_herdr_version 0.8.0`) is a local-first annotation collector in the **Code Review & Diff Inspection** ledger. Unlike diff-renderers (`hunk`, `reviewr`, `gitview`) it never renders `git diff` and never posts to a forge.
- **Key Features**: **Terminal annotation flow — what is implemented:**  * `capture` (`Annotate selection`, `contexts=["pane"]`, `bun src/capture.ts` / `herdr-annotate.exe capture`): resolves selection in precedence orde

### [2026-08-09] cyperx84/herdr-sesh-bro
- **Overview**: `sesh-bro` (`Sesh Bro` v0.3.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a `sesh`-style fuzzy session picker for Herdr. It merges three sources — Herdr workspaces, Herdr agents grouped by status, and `zoxide` directories — into one `fzf` popup with live terminal previews, git-branch enrichment, and connect-or-create semantics.
- **Key Features**: **Picker UX (`picker`, `list`, `preview`, `open`):** * `sesh-bro picker [flags]` opens `fzf` with `--ansi --delimiter=\t --with-nth=3.. --layout=reverse --tiebreak=index`, prompt `sesh> `, and a heade

### [2026-08-09] tareqmlx/herdr-hunk-viewer
- **Overview**: `Hunk Diff` (`tareqmlx.hunk-viewer` v`0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a self-contained Rust launcher that opens the external **Hunk** diff TUI inside Herdr. It implements no diff rendering itself.
- **Key Features**: **What the user sees is 12 actions + 1 pane, no hooks, events, link handlers, or HTTP API:**  | Diff | split | tab | overlay | popup | |---|---|---|---|---| | uncommitted worktree | `worktree-split` |

### [2026-08-09] AlexanderMakarov/herdr-preview
- **Overview**: `herdr-preview` (`herdr-preview` v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a **visible-text hint picker**, not a diff renderer or file renderer. From the focused pane's visible text it tokenizes path-like spans and `http(s)` URLs, paints a letter-hint overlay, and routes the pick elsewhere: existing files to peer `smarzban/herdr-file-viewer` when installed else to a `less` overlay, directories to an owned browse overlay, URLs to the system browser.
- **Key Features**: **Herdr-declared surface is 1 action + 3 overlays, no hooks/events/link_handlers/HTTP API:**  * `hint` action — `Hint-pick openable file paths on screen`, `command = ["bash","scripts/run-hint.sh"]`. *

### [2026-08-10] andschneider/roboherd
- **Overview**: `roboherd` is a Herdr integration for **roborev** (`kenn-io/roborev`, requires `>=0.63`), an external AI review daemon + TUI. It is not a diff renderer itself.
- **Key Features**: **Declarative surface in `herdr-plugin.toml`:** 1 `[[build]]` + 1 `[[startup]]` + 3 `[[panes]]` + 3 `[[actions]]`. No hooks, events, `link_handlers`, or HTTP API.  * `review-commit` (`workspace,pane` 

### [2026-08-10] txmed82/herdr-code-review
- **Overview**: `herdr-code-review` (`Herdr Code Review` v0.2.0, `min_herdr_version 0.7.5`) is a structured AI code-review launcher for Herdr. Invoked from the focused pane or workspace, it snapshots staged + unstaged `git diff` around the worktree, opens a dedicated `REVIEW // CODE` split or tab, runs a non-interactive reviewer there, prints findings in that pane, and auto-submits the result back into the originating agent pane.
- **Key Features**: What is explicitly implemented in `bin/code-review.js` + `herdr-plugin.toml` + `README.md`:  **Two manual actions, no declarative panes, hooks, events, link handlers, or HTTP API:** * `review-split` —

### [2026-08-10] Idan-Levin/herdr-implement-review
- **Overview**: This is a workflow-orchestration plugin, not a diff renderer. One pane-context action (`run`) turns the invoking Claude or Codex pane into a persistent **mother process** — planner, reviewer, and final approver — and spawns two sibling panes beside it: a **Codex Implementer** that edits the repo and a read-only **Codex Security** pane that runs `npx @openai/codex-security scan`.
- **Key Features**: Declared Herdr surface is minimal by design: **1 action, 0 panes, 0 hooks, 0 events, 0 `link_handlers`, 0 HTTP endpoints.**  * `idan.implement-review.run` — `Implement with Codex + Codex Security`, `c

### [2026-08-11] elKei24/herdr-co-review
- **Overview**: `elKei24/herdr-co-review` (`elkei24.co-review` / `co-review` v1.8.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is an interactive, split-screen PR co-review system for a human paired with an AI coding agent inside Herdr.
- **Key Features**: **Session lifecycle (`src/orchestrate.rs`, `src/commands.rs`, `src/cli.rs`):**  * `start <pr>` — resolves `123`, `#123`, `PR123`, `owner/repo#123`, `owner/repo/pull/123`, or full `github.com/.../pull/

### [2026-08-12] jhochenbaum/herdr-hunk-diff
- **Overview**: `jhochenbaum.hunkdiff` (`hunk` v0.2.0, `min_herdr_version 0.8.0`, `macos`/`linux`/`windows`) is a full round-trip review bridge for the **Code Review & Diff Inspection** domain. It does not re-implement diff rendering: it launches the external **hunk** TUI (`hunkdiff` 0.19.0) in a Herdr `split` pane rooted at the reviewed worktree, then collects human-authored inline comments via `hunk session comment list` and submits them as a single prompt to the agent that authored the changes via `herdr agent prompt`.
- **Key Features**: **Review modes — 5 actions × 2 pane twins (POSIX + Windows):**  * `review` — config `default_target`; `auto` shows `branch (<base>...HEAD)` when ahead of base, otherwise `working`. `contexts=["workspa

### [2026-08-13] goofansu/herdr-hunk
- **Overview**: `goofansu/herdr-hunk` (`herdr-hunk` / `Hunk review` v0.3.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a thin, stdlib-only Python launcher that opens the external **Hunk** diff TUI (`github.com/modem-dev/hunk`) in a temporary Herdr `overlay`. It implements no diff rendering itself.
- **Key Features**: **What the user gets is 3 actions + 3 overlay panes, no hooks, events, link handlers, or HTTP API:**  | Action (`contexts=["pane"]`) | Pane entrypoint | Hunk invocation in pane | |---|---|---| | `revi

### [2026-08-13] dleen/herdr-agents
- **Overview**: `dleen/herdr-agents` (`Agent picker` v0.3.1, `min_herdr_version 0.8.0`) is an **agent-pane picker and launcher**, not a diff renderer. It reads `herdr pane list`, resolves true agent state even for panes Herdr's ~30-column sidebar drops, groups one row per live agent pane by full `cwd`, and shows a transcript-reconstructed preview of what each session actually did.
- **Key Features**: **Herdr surface is intentionally narrow: 1 popup pane + 2 actions, no hooks, events, `link_handlers`, or HTTP API.**  What the user gets:  * **Picker (`picker` pane + `open` action):** `fzf --with-nth

### [2026-08-14] JonasBaeumer/herdr-file-annotator
- **Overview**: `jonasbaeumer.file-annotator` (`File Annotator` v0.9.0, `min_herdr_version 0.8.0`, `macos`/`linux` only) is an **agent-summoned, blocking diff review** plugin. The coding agent registers the bundled binary as a stdio MCP server; when it calls `review_changes` a `Review` split pane opens beside the agent, the agent blocks, and the human returns a verdict (`approve` / `request_changes` / `reject` / `cancelled`) plus structured line-anchored annotations.
- **Key Features**: **Herdr-declared surface is minimal: 1 build hook + 1 pane, no actions, no hooks/events/link_handlers/HTTP API:**  * `review` pane: `title: Review`, `placement: split`, `command: ["sh","-c","exec \"$H

### [2026-08-14] damianpoole/herdr-opencode-sessions
- **Overview**: This plugin is a session-history finder and re-opener for OpenCode, not a diff renderer. It reads the local OpenCode SQLite store read-only via `opencode db`, presents root sessions in an `fzf` overlay with live preview, and re-attaches the selected session via `opencode --session [--fork]` inside a new Herdr tab or workspace.
- **Key Features**: What is actually implemented in `herdr-plugin.toml` + `src/main.ts` + `src/lib.ts` + `README.md`:  **Single user surface: 1 action + 1 overlay pane:** * `search` — `Search OpenCode sessions`, `context

### [2026-08-15] moneycaringcoder/herdr-collide
- **Overview**: `Collide` (`moneycaringcoder.collide` v0.2.0, `min_herdr_version 0.8.0`, `linux`/`macos`) warns when concurrent agents in different `git worktree` checkouts of the **same repository** are editing the same files. It groups Herdr workspaces by canonical `--git-common-dir` identity, compares **every pair** in a repo, and separates `overlap` (shared file, merges clean) from `conflict` (merge-tree predicts a conflict), plus `runaway` (oversize change-set) and `unknown` (could not prove an answer).
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** 1 `[[build]]` (`cargo build --release --locked`), 1 `[[startup]] (`--restore`), 4 `[[events]]` (`worktree.created/opened/removed`, `workspace.closed` 

### [2026-08-15] sushidesu/herdr-tabpick
- **Overview**: ` sushidesu/herdr-tabpick` (`sushidesu.tabpick`, `tabpick` v0.1.0, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a cross-workspace tab picker with most-recently-used ordering. One `popup` pane runs an `fzf` UI listing every existing Herdr tab MRU-first with a live preview, plus optional not-yet-created tabs derived from configured project-root directories; selecting a directory creates and focuses a new tab there.
- **Key Features**: What is actually implemented in `herdr-plugin.toml` + `bin/tabpick` (131 LOC `bash`) + `README.md`:  **Picker pane (`panes.open`):** `title: tabpick`, `placement: popup`, `width: 90%`, `height: 80%`, 

### [2026-08-20] itisbryan/herdr-gh-checks
- **Overview**: `itisbryan/herdr-gh-checks` (`herdr-gh-checks` / `GH Checks` v0.2.2, `min_herdr_version 0.7.0`) is a full native review workbench for the **Code Review & Diff Inspection** domain, not a thin launcher shim. A single Go + Charm (Bubble Tea / Bubbles / Lipgloss) binary provides three modes: a live 5s-polled PR/CI pane, an interactive merge popup, and a background sidebar daemon.
- **Key Features**: **What is declared:** 2 panes + 2 actions, 1 `[[startup]]`, 2 `[[build]]`. No hooks, events, `link_handlers`, or HTTP API.  - `panes.panel` (`GH Checks`, `split`, `./herdr-gh-checks`) + `actions.show`

### [2026-08-21] husniadil/herdr-dispatch
- **Overview**: `herdr-dispatch` (`Dispatch` v0.10.7, `min_herdr_version 0.8.0`, `macos`/`linux` only) is the execution policy for the `herdr-tasks` (`htask`) board. It watches for `ready` tasks, brings up one Herdr worker pane per task in its own tab and checkout, delivers a `/goal` prompt, tracks `agent_status`, re-nudges silent workers, and stops at `review` where the board's own review gate takes over — it never runs `approve`/`reject`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** * `[[build]] binary`: `go build -o ./bin/hdis ./cmd/hdis` * `[[startup]] daemon`: `./scripts/start.sh` — `nohup .../bin/hdis daemon`, detaches so it o

### [2026-08-21] husniadil/herdr-tasks
- **Overview**: `herdr-tasks` (`Tasks` v0.10.1, `min_herdr_version 0.8.0`, `macos`/`linux`) is a task backlog and notes board for agents running on Herdr. One statically-linked Go binary, `htask`, is the daemon, the CLI, the stdio MCP server, and the popup TUI board.
- **Key Features**: **Task lifecycle:** `create`, `list`, `get`, `claim`, `touch` (renew lease), `release`, `submit --report --evidence --evidence-for`, `amend`, `approve`, `reject`, `cancel`, `update`, `delete`, `archiv

### [2026-08-21] neospark-sol/agentflock
- **Overview**: **AgentFlock** (`neospark.agentflock`, `0.1.0-beta.0` in `herdr-plugin.toml` / `0.1.0-beta.2` in `package.json`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a durable **builder + reviewer + cheap coordinator** orchestration system, not a diff renderer.
- **Key Features**: ### Herdr-declared surface — intentionally minimal  `herdr-plugin.toml` declares **no hooks, events, `link_handlers`, or HTTP endpoints**. Only:  * `[[build]]`: `npm ci` + `npm run build` * `[[actions

### [2026-08-21] devops-fj/herdr-handoff
- **Overview**: `devops-fj.herdr-handoff` (`Herdr Handoff` v`0.2.0`, `min_herdr_version 0.7.5`) is a **local, preview-first agent-to-agent context transporter**, not a diff renderer. It picks a source Herdr coding agent and a target agent, collects the source's recent terminal output plus `git` working-tree state, renders the exact Markdown prompt that will be delivered, and sends it only after the user types literal `SEND` (interactive) or passes explicit `--yes` (CLI).
- **Key Features**: **Herdr-declared surface is minimal: 1 `[[build]]` + 1 `[[actions]]` + 1 `[[panes]]`.** No hooks, events, `link_handlers`, or HTTP API endpoints.  * `open` action — `Hand off to another agent`, `conte

### [2026-08-21] woshahua/herdr-github-pr
- **Overview**: `woshahua/herdr-github-pr` (`github-pr` / `GitHub PR Sync` v0.1.0, `min_herdr_version 0.7.4`, `linux`/`macos` only) is a read-only GitHub PR observer for Herdr. For the branch checked out in the focused pane it resolves the PR with `gh`, rolls up CI checks / review decision / mergeability, fetches conversation comments plus review submissions and inline threads via GraphQL, caches the result, and surfaces it in two places: sidebar tokens and a dedicated `GitHub PR` split pane.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 1 `[[startup]]` + 3 `[[events]]` + 3 `[[actions]]` + 1 `[[panes]]` + 1 `[[link_handlers]]`. No hooks, no HTTP API.**  * **Auto-sync (`bin/sync.js`):** runs o

### [2026-08-21] codingfragments/herdr-nav
- **Overview**: `herdr-nav` is a modal popup switcher for Herdr: one keystroke opens it, you aim, `Enter` moves you, it closes. It unifies five target kinds — live Session panes/tabs/workspaces, Agents, Pinned dirs, `zoxide` frecency dirs, and installed Plugins — into two modes (`Browse` tree / `Search` flat fuzzy list) with a single-shape live preview for every kind.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 2 panes + 2 actions, nothing else.** No `[[hooks]]`, `[[events]]`, `[[link_handlers]]`, `[[startup]]`, or HTTP API:  * `panes.switcher` — `title: herdr 

### [2026-08-26] ubuntudroid/herdr-coder-sessions
- **Overview**: `ubuntudroid/coder-sessions` (`ubuntudroid.coder-sessions`, `Coder Agent Sessions` v0.1.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a **remote-session bridge** in the Code Review & Diff Inspection domain. It browses running Coder task workspaces — which have no tmux/screen, only `agentapi` on port 3284 — and opens each as its own Herdr workspace.
- **Key Features**: ### `coder-sessions.py` — picker, builder, mirror, takeover  Single stdlib-only Python entrypoint with explicit sub-modes:  * **Picker (default pane + action):** `coder-sessions.py` runs an `fzf` popu

### [2026-08-26] skellleks/lasso
- **Overview**: `lasso` (`Lasso` v0.1.0, `min_herdr_version 0.7.5`, `macos`/`linux` only) is a native Rust TUI review pane for Herdr. Each window pins permanently to one agent pane and shows that agent's live working-tree diff with a file tree, whole-file syntax-highlighted diff, and separate file viewer.
- **Key Features**: What the user gets is 1 pane + 1 action, no HTTP API, no `link_handlers`, no event declarations in TOML:  * **Pane `review`:** `title: Lasso review`, `placement: split`, `command: sh -c exec "$HERDR_P

### [2026-08-27] 0xfelixli/herdr-notes
- **Overview**: `0xfelixli.herdr-notes` (`Herdr Notes` v0.1.0, `min_herdr_version 0.7.4`, `macos` only) is a transient annotation collector for the **Code Review & Diff Inspection** domain, not a diff renderer.
- **Key Features**: What is actually implemented in `herdr-plugin.toml` + `src/main.rs` + `README.md`:  **2 actions, 1 overlay pane, no hooks/events/link_handlers/HTTP API:**  * `annotate-selection` — `Add a note to sele

### [2026-08-30] chasereyn/Vincent
- **Overview**: Vincent (`chasereyn.vincent` / `Vincent` v1.0.2, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a full, mouse-first terminal review client for code that AI agents wrote, packaged as a Herdr plugin. Forked from `spice-edit` at `5b4adc5` (MIT, Cloudmanic LLC — upstream headers intentionally retained), it presents a file tree on the left, file-or-diff in the middle, and a Zed-shaped Changes panel on the right.
- **Key Features**: **Herdr-declared surface — no hooks, events, `link_handlers`, or HTTP API:**  * Pane `vincent` (`title: Vincent`, `placement: tab`, `command: ["sh","-c","exec \"$HERDR_PLUGIN_ROOT/bin/vincent\""]`). *

### [2026-09-07] hilmimuktitama/herdr-jira-peek
- **Overview**: `hilmimuktitama/herdr-jira-peek` (`jira-peek` / `Peek for Jira` v0.2.4, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a **read-only Jira Cloud preview plugin** for Herdr, filed in the Code Review & Diff Inspection ledger but unlike the `hunk`/`reviewr`/`gitview` diff-renderers.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 6 actions + 2 panes. No `hooks`, `events`, `link_handlers`, or HTTP API endpoints.**  * `peek` (`scripts/peek.sh`, `contexts=["workspace"]`): Acquires state 

### [2026-09-08] cupsadarius/herdr-pr-glance
- **Overview**: Glance PR is a read-only GitHub PR observer for Herdr. It tracks the working pane in the current tab, resolves its git checkout and branch locally, then reads PR identity, exact counts, CI `statusCheckRollup`, review decision, stack membership, comments and review threads through the user's authenticated `gh`.
- **Key Features**: **Declared Herdr surface — `herdr-plugin.toml` only:** 1 `[[build]]` + 2 `[[actions]]` + 1 `[[panes]]`. No hooks, events, `link_handlers`, or HTTP endpoints.  * `open` — `Glance PR: open`, `contexts=[

### [2026-09-09] Deetss/herdr-review-panel
- **Overview**: `deetss.review-panel` (`Review Queue` v0.1.0, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a local-first handoff queue for agent-to-human review. A Claude Code `Stop`/`SubagentStop` hook watches replies for `<user_review>path</user_review>` and `<user_command>cmd</user_command>` tags, appends them to `~/.claude/review.log`, and auto-opens a Herdr `split` panel.
- **Key Features**: **What the user sees:**  * **Review Queue sidebar:** timestamp + repo `GroupHeader`, `FileItem` rows (yellow underlined, absolute path if resolvable), `CommandItem` rows (magenta, `[ ]`/`[x]` checkbox

### [2026-09-09] YmlyZA/herdr-review-pack
- **Overview**: `herdr-review-pack` (`Review Pack` v0.1.0, `min_herdr_version 0.9.0`, `macos`/`linux` only) is a local, explicit review-preparation tool, not a diff renderer or agent orchestrator.
- **Key Features**: Declared Herdr surface is minimal: **1 action + 1 popup pane, no hooks, events, `link_handlers`, startup, build, or HTTP API.**  * **Action `open` — `Review Pack: open`:** `contexts=["pane","workspace

### [2026-09-10] anthonykimm/herdr-pr-status
- **Overview**: `pr-status` (`PR Status` v0.1.0, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a minimal, read-only GitHub PR observer for the **Code Review & Diff Inspection** domain.
- **Key Features**: What is actually implemented in `herdr-plugin.toml` + `pr_status.py` + `README.md`:  **Sidebar tokens (the only user-visible output):**  * `pr` — e.g. ` #12 approved · conflicts`, produced by `pr_labe

### [2026-08-10] rodeyseijkens/codey
- **Overview**: `codey` is a **review-first git TUI that sits beside a coding agent**. It presents staged vs. unstaged changes as two sections, lets a human walk hunks, attach transient line/range comments, do real `git` staging/discarding, and hand notes back to the agent.
- **Key Features**: **Herdr-declared surface is intentionally minimal — 1 pane + 3 actions + 1 event, no hooks, no `link_handlers`, no HTTP endpoints:**  * `panes.pane`: `title: codey`, `placement: split`, `command: [sh 

### [2026-09-11] odiumuniverse/herdr-diff-viewer
- **Overview**: `odiumuniverse/herdr-diff-viewer` (`odiumuniverse.diff-viewer` / `Diff Viewer` v0.1.0, `min_herdr_version 0.9.0`, `macos`/`linux` only) is a self-contained, native Rust git-diff sidebar for Herdr. It is not a thin launcher around `hunk`/`er`/`ttt` like many ledger peers; it implements its own mouse-driven TUI that lives in a right-hand `split` beside a coding agent, shows changed files with red/green hunks, and lets the user click-to-jump or drag lines to inject `file:line` + code into the agent prompt.
- **Key Features**: **User surface is minimal by manifest: 1 action + 1 pane + 3 background events, no hooks or HTTP API:**  * `toggle` — `Diff viewer: toggle git diff sidebar`, `contexts=["pane"]`, `command=["./target/r

### [2026-09-12] sjlee06/herdr-git-graph
- **Overview**: `herdr.git-graph` (`Herdr Git Graph` v0.4.2, `min_herdr_version 0.9.0`, `macos`/`linux` only) is a **read-only, native Rust TUI for browsing local Git history beside code**. It provides two complementary surfaces: a 40-column graph-only `sidebar` split for ambient history, and a full `graph` tab with branches + history + commit-inspector.
- **Key Features**: **User-visible surface — 2 actions + 2 panes, no hooks/events/link_handlers/HTTP:**  * `open` (`--open-pane`): open full view in new tab, `--focus`, scoped to `--workspace` when known. * `sidebar` (`-

### [2026-09-12] mvaios/herdr-scratchdock
- **Overview**: `mvaios.scratchdock` (`Scratchpad Dock` v0.3.0, `min_herdr_version 0.9.0`, `macos`/`linux`) docks a coding agent's working files in a `split` pane beside the agent while it works.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): 1 pane + 2 events + 7 actions. No `[[build]]`, `[[startup]]`, hooks, `link_handlers`, or HTTP API.**  * Pane `dock` (`title: Scratchpad`, `placement: sp

### [2026-09-13] hx-w/herdr-visuals
- **Overview**: `hx-w.visuals` (`Visuals` `0.1.3`, `min_herdr_version 0.9.0`, `macos`/`linux` only) is a local-first preview pane for visual content produced by a coding agent. Pressing `prefix+v` opens a right-hand `split` beside the focused pane that renders complete fenced `mermaid` diagrams, display math (`$$…$$`, `\[…\]`, `math`/`latex`/`tex` fences), and local images referenced by or embedded in the bound conversation.
- **Key Features**: **Declared Herdr surface is `2 actions + 1 pane`, no hooks, events, `link_handlers`, `startup`, or HTTP API:**  * `open` — `Visual previews` (`node src/launch.mjs`): open beside current pane; focus ex

### [2026-09-14] mikhail-angelov/herdr-revdiff
- **Overview**: `herdr-revdiff` (`v0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a thin, Shell-only Herdr wrapper around the external [`umputun/revdiff`](https://github.com/umputun/revdiff) terminal diff reviewer. It does not implement diffing itself.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal: **1 `[[build]]` + 1 `[[panes]]` + 1 `[[actions]]`. No hooks, events, `link_handlers`, `startup`, or HTTP API endpoints.**  * **Action `open` — `revd

### [2026-09-14] ekropotin/herdr-tuicr
- **Overview**: `ekropotin/herdr-tuicr` (`herdr-tuicr` v`0.0.1`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a pure-Shell plugin that runs the external [`tuicr`](https://github.com/agavra/tuicr) interactive review TUI in a Herdr `split` pane and hands the result back to the exact agent pane that invoked it.
- **Key Features**: **User surface is 2 actions + 1 programmatic pane. No hooks, events, `link_handlers`, `startup`, `build`, or HTTP API:**  * `review-paste` — `tuicr review (paste to agent)`, `contexts=["pane"]`, `bin/

### [2026-09-16] shved270189/herdr-worktree-status
- **Overview**: `shved270189.worktree-status` (`Worktree Status` v0.1.0, `min_herdr_version 0.7.5`) is a tiny, dependency-free Shell plugin that lets a human assign a workflow state — Planning / In progress / Review / Blocked / Done / Clear — to a Herdr worktree workspace and see it as an emoji prefix in the Herdr sidebar.
- **Key Features**: What the user actually gets is one action, one popup pane, and one background re-applier. There are no HTTP endpoints, no `link_handlers`, no hooks beyond `[[startup]]` + one `[[events]]`.  **Statuses

### [2026-09-16] TarasKovalenko/herdiff
- **Overview**: `taraskovalenko.herdiff` (`herdiff` v0.2.0, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a **full native review workbench**, not a thin launcher shim.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): 2 panes + 2 actions, no hooks/events/API:**  * `viewer` pane: `title: herdiff`, `placement: split`, `command: ["target/release/herdiff"]` * `popup` pane

### [2026-09-16] dlv-gold/herdr-tasks
- **Overview**: `herdr-tasks` (`Herdr Tasks` v0.1.0, `min_herdr_version 0.9.0`, `linux` only) is a persistent personal productivity plugin for Herdr: a right-edge task board for **daily tasks + weekly missions** coupled to an **overnight scheduled reporting pipeline**.
- **Key Features**: **User-visible board (`src/herdr_tasks/ui.py:TaskApp`):**  * `Today` / `Week` / `Reports` tabs in a narrow `split` pane. Today/Week show manual + accepted tasks with checkbox complete/reopen, `Edit`, 

### [2026-09-17] hlouis/herdr-glab
- **Overview**: `hlouis.glab` (`GitLab MR` v0.1.0, `min_herdr_version 0.9.0`, `macos`/`linux` only) is a **GitLab merge-request companion** for Herdr, filed in **Code Review & Diff Inspection**.
- **Key Features**: What is declaratively guaranteed by `herdr-plugin.toml`:  **2 overlay panes (no `split`/`tab`/`popup`):**  * `panel` — `title: GitLab MRs`, `placement: overlay`, `command: ["bin/herdr-glab", "panel"]`

### [2026-09-18] cantona/herdr-revive
- **Overview**: `cantona.herdr-revive` (`herdr-revive` v0.1.0, `min_herdr_version 0.9.1`, `linux` only) is a native Rust session persistence plugin for Herdr. It saves pane programs, working directories, split/tab layout, and exact agent conversation IDs into retained JSON snapshots, then restores them either in-place by re-typing commands into matching idle panes or by rebuilding whole workspaces from scratch as new workspaces.
- **Key Features**: **What the user sees is 10 actions + 5 panes, no HTTP API:**  Panes in `herdr-plugin.toml`: - `manage` — `title: herdr-revive`, `placement: popup`, `80%x80%`, `sh scripts/manage.sh` — interactive numb

