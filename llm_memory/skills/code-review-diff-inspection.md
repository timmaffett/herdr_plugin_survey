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

