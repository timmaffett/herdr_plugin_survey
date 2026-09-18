# Architectural Memory: Task & Project Management

This document tracks architectural patterns and previously surveyed extensions within the **Task & Project Management** domain.

## Surveyed Extensions Ledger

### [2026-06-09] cloudmanic/herdr-plus
- **Overview**: `cloudmanic/herdr-plus` (`cloudmanic.herdr-plus`, v0.1.24, `min_herdr_version 0.7.0`) is a first-class Herdr plugin implemented as a single Go binary (~11k LOC). It adds two user-facing tools to Herdr: **Projects** — declarative TOML workspace templates that build a full workspace of tabs, split panes, and startup commands in one pick — and **Quick Actions** — a fuzzy launcher for one-off shell scripts run in the directory you launched from. A third, silent feature is **worktree auto-layout**, which populates a fresh worktree workspace from a matching layout file.
- **Key Features**: **Projects browser (`projects` / `projects-ui` / `open`):** Declarative templates in `projects/` (`name`, `description`, `working_dir` with `~`/`$VARS`/relative expansion, `group` for headings, ordere

### [2026-06-26] astkaasa/herdr-tokscale-dashboard
- **Overview**: This plugin is a thin Herdr adapter for **Tokscale**, an external token-usage / cost telemetry TUI. It does not implement any scanning, pricing, or analytics itself; it only launches the existing `tokscale` CLI inside a Herdr split pane and exposes two shortcuts for it. The entire implementation is ~187 LOC of Shell plus a declarative `herdr-plugin.toml`, with no background services or bundled binaries.
- **Key Features**: **What it provides:**  * **Tokscale TUI pane (`panes.tui`):** Declared as `title = "Tokscale"`, `placement = "split"`, with `command = ["bash", "open-tokscale.sh", "tui"]`. When opened, this execs `to

### [2026-07-01] hitaishi2222/herdr-fingers
- **Overview**: `herdr-fingers` (`Fingers`, v0.1.0, `min_herdr_version 0.7.0`) is a Herdr terminal-utility plugin inspired by `tmux-fingers`. It scans the **visible text of the focused pane** for structured identifiers — file paths, URLs, IPs, UUIDs, SHAs, colors, hex literals, numbers, Kubernetes DNS names, and `git` output fragments — and lets the user fuzzy-pick one item to copy to the system clipboard.
- **Key Features**: **Extraction:** * 12 regexes defined in `PATTERNS` in `herdr_fingers.py`: `uuid`, `sha` (40-hex), `ip` (strict IPv4 octet check), `url` (`https?|git|ssh|file|ftps?://`), `kubernetes` (hyphenated multi

### [2026-07-01] carsonjones/herdr-agent-dashboard
- **Overview**: This plugin is a single-purpose launcher for a live agents dashboard. It exposes one idempotent keybind — `local.agents.toggle` — that either focuses an existing dashboard tab or creates it, so repeated presses never stack duplicate copies.
- **Key Features**: **What is actually in the surveyed code:**  * **Toggle / jump-to-dashboard (`toggle`):** Declared in `herdr-plugin.toml` as `title = "Agents dashboard (launch / jump)"` with `command = ["python3", "to

### [2026-07-03] marcoskichel/herdr-muster
- **Overview**: `marcoskichel/herdr-muster`, marketed as **Muster**, is an agent-aware project switcher for Herdr. A single keybind opens a zoomed overlay pane running a native Rust TUI: live workspaces appear grouped as `OPEN` with agent state, dormant project directories appear as `PROJECTS`, and `Enter` either focuses the existing workspace or creates-and-focuses a new one.
- **Key Features**: **What the user gets:**  * **Fuzzy grouped switcher (`picker` pane):** `ratatui + nucleo-matcher` list over `name + display-path`. Empty query preserves assembled order and shows `▸ OPEN — LIVE WORKSP

### [2026-07-06] GranamyrBR/herdr-english-coach
- **Overview**: **English Coach** (`granamyrbr.english-coach`, v0.3.0) is a teacher's notebook for non-native English speakers that lives in a Herdr side pane. While the user works with a coding agent in English, the agent — or a background watchdog model — appends color-coded grammar + dev-jargon corrections to a live, accumulating history log.
- **Key Features**: **What the user sees:**  * **Live board pane (`coach.sh`):** Clears the screen, prints a 4-color legend, prints the current DevTOEFL scoreboard via `score.sh show`, then `exec tail -n 500 -f` on the c

### [2026-07-06] Javamomma/herdr-matter-wall
- **Overview**: **Javamomma/herdr-matter-wall** (`javamomma.matter-wall`, v0.3.1, `min_herdr_version 0.7.0`) is a pure-Shell Herdr plugin that builds a glanceable status board from a project's filesystem. It scans the immediate subdirectories of a target project for marker files, ranks them by recency, and opens the top-N (default 5) as full-screen tabs in a dedicated `Matter Wall` workspace, each tab running a read-only `claude` agent that emits a structured brief rendered as a colored, severity-coded card.
- **Key Features**: Declared in `herdr-plugin.toml` as three `contexts=["workspace"]` actions:  * `open`: `bash matter-wall.sh` — build the wall. * `close`: `bash matter-wall.sh --close` — tear down the wall workspace. *

### [2026-07-09] jasonrr/herdr-tally
- **Overview**: `jasonrr/herdr-tally` (`tally`, v0.2.7, `min_herdr_version 0.7.0`) is a project-scoped shared ledger for a human and their coding agents. It keeps four artifacts per repository — **Todos** (follow-ups/blockers), **Scratchpads** (research, plans, handoffs), **Plans** (read-only view of markdown already on disk), and **Comments** (margin notes on any of the above) — in one store keyed by project path so worktrees of the same repo share state and history outlives any single session.
- **Key Features**: **Three adapters over one store:**  * **CLI (`tally todos|scratchpads|comments|sync|dump`):** id-first grammar (`todos update <id> --status x`), hand-rolled `flag`-compatible parser in `src/cli/mod.rs

### [2026-07-10] jwarykowski/shepherd
- **Overview**: Shepherd (`jwarykowski.herdr-shepherd`, v0.20.0, `min_herdr_version 0.7.0`) is a markdown-backed personal todo board that runs two ways: as a standalone Bubble Tea TUI in any terminal, and as a Herdr pane in split, tab, overlay, or zoomed placement. The same Go binary serves an interactive board for humans and a one-shot command API (`list/add/edit/done/watch/stats/...`) designed explicitly for scripts and coding agents, with all persistence in `~/.config/shepherd/*.md`.
- **Key Features**: **Interactive board (TUI):**  * Grouped list with 5 board-local views cycled by `v`: `category / priority / tag / table / lane`, plus `board` grouping in the global view. Lane is kanban — one column p

### [2026-07-14] nelsonPires5/herdr-board
- **Overview**: `herdr-board` (`id = "herdr-board"`, v0.16.1, `min_herdr_version = "0.8.2"`) is a kanban board that sits **above Herdr spaces**: cards are prompts, columns are pipeline stages. Moving a card into an `auto` column dispatches a real AI coding agent into a visible Herdr pane/tab; moving into `manual` parks it.
- **Key Features**: **Board model:** * Multi-project / multi-board scoping by Git-root/CWD. Root and subdir share a board; exact non-Git CWD is isolated. Legacy `Global` project (`project_id=1`, first board `main`) remai

### [2026-07-15] caioniehues/herdmates
- **Overview**: Herdmates is an agent-team orchestration plugin for Herdr, not a todo-list or kanban board. Its pitch in `herdr-plugin.toml` is: `Claude Code agent teams, native in herdr — teammux shim (takeover default), hook-driven signal engine + recorder, sidebar tokens`.
- **Key Features**: What can be verified from the provided files plus scanner-observed socket/CLI usage:  **a) Teammux shim — tmux takeover:** * `src/bin/teammux.rs` is explicitly `the fake tmux executable (issue #85)`. 

### [2026-07-15] jagzmz/herdr-s3-clipboard
- **Overview**: This plugin publishes the current system-clipboard image to S3-compatible storage and inserts the resulting HTTP URL into the focused Herdr pane. It is explicitly a *publishing* workflow — for durable, shareable public or time-limited presigned URLs backed by a bucket you control — as opposed to Herdr's native `remote_image_paste` which only hands pixels to the current remote session.
- **Key Features**: **Two user actions + one pane (declared in `herdr-plugin.toml`):**  * `hsc.s3-clipboard.upload-clipboard-image` — `Publish clipboard image`, `contexts=["workspace"]`, `command=["node", "src/upload-cli

### [2026-07-15] Javamomma/herdr-approval-gate
- **Overview**: **Javamomma/herdr-approval-gate** (`javamomma.approval-gate`, v0.1.0, `min_herdr_version 0.7.0`) is a human sign-off gate for agent actions with an append-only audit trail. It is not a todo-list, kanban, or launcher like prior entries in the Task & Project Management ledger — it is a safety/governance primitive.
- **Key Features**: User-facing CLI (`bin/approval-gate.sh`):  * **`run [--label <name>] [--dry-run] "<task command>"`** — Fire-and-forget gating. Spawns a dedicated `Approval Gate: <label>` workspace/pane, runs the task

### [2026-07-17] speardragon/herdr-agents-history
- **Overview**: Agent Tool History is a Herdr observability pane, not a task manager despite its Ecosystem Category. It answers "what are my agents *doing* while `working`?" by resolving each Herdr pane's native agent session ID to that agent's local transcript file on disk (`~/.claude/projects/...` and `~/.codex/sessions/...`) and streaming parsed tool calls into a single keyboard-driven TUI.
- **Key Features**: **What the user gets — one pane, five views (per `README.md` + `PLAN.md`):**  * **📡 Live Feed (default):** Merged, time-ordered stream of all agents' tool calls, `tail -f` style. Stable per-agent has

### [2026-07-17] aclima01/herdr-todos-windows
- **Overview**: This is a Windows-only, read-mostly observer panel for Herdr. It mirrors the **focused agent's live task list** — derived from Claude Code `TaskCreate` / `TaskUpdate` calls in the session transcript — into a Herdr split pane, with a status header (`working` / `idle` / `blocked`) and a `Now` line, so a human can follow the model's plan without switching panes.
- **Key Features**: Verified from `herdr-plugin.toml` + `README.md` (implementation scripts `todo-panel.ps1` / `panel.ps1` are referenced but not included in this survey bundle):  **One pane:** - `todos` (`title = "todos

### [2026-07-18] leonho/herdr-cmd-marks
- **Overview**: `Cmd Marks` is a per-project command-bookmark launcher for Herdr. Pressing a keybind (`alt+m` in the README example) opens a floating `fzf` popup scoped to the invoking pane's git-root, showing user-curated `global` and `project` bookmarks plus an auto-derived `smart` section.
- **Key Features**: What the user actually gets is one action and one popup:  * **Action `open` — "Cmd marks: bookmarked commands for this project":** Resolves the source pane's `cwd` / `foreground_cwd` and git-root, the

### [2026-07-19] natori-hrj/herdr-green
- **Overview**: Herdr Green (`id = "green"`, v0.2.0, `min_herdr_version 0.7.4`) is a per-pane test-status watcher for Herdr, not a task manager in the conventional sense despite its ledger category.
- **Key Features**: **User-visible surfaces:**  * **Watcher pane `watch` (`split`):** `./target/release/herdr-green watch`. Long-lived process that prints `▶ <pane> <agent> — <argv>` and `🟢/🔴` lines and sits blocked in

### [2026-07-21] phin-tech/herdr-phin-board
- **Overview**: Phin Board (`phin-board`, v0.5.0, `min_herdr_version 0.7.5`) is a global status board over Herdr **spaces/workspaces**, not a per-project todo list. It answers “what have I started, what’s finished, what’s parked waiting on a person” — user-driven statuses (`Triage / Todo / In Progress / Waiting / Done` by default, fully renamable/reorderable/inventable) keyed durably by canonical directory, with Herdr’s live agent state shown only as a dim hint.
- **Key Features**: **Board TUI — three popup layouts + narrow dock:** * `list`: grouped by status with collapsible headers (`space`/`tab`), truncated note/path middle column, right-aligned `·working/·idle/·blocked` hint

### [2026-07-22] Resetnak/herdr-logbook
- **Overview**: Herdr Logbook (`herdr-logbook`, v0.0.13, `min_herdr_version 0.7.0`) is a project-aware, local, offline working-memory plugin for Herdr. It stores an active task (`now.md`), a monthly chronological journal (inbox), standalone notes, and architectural decisions (ADRs) as plain Markdown you own, with a Bubble Tea Hub TUI for humans and a flat CLI (`tui | capture | decision | now | digest | search | init | paths | doctor | index | keybinds | compatibility | resolve-cwd | version`) for scripts and coding agents.
- **Key Features**: **Hub TUI (`herdr-logbook tui [--view now|project|global|all]`):** Six scopes — `Current task` (singleton `now.md`), `Project journal`, `Project notes`, `Project decisions`, `Global journal`, `All not

### [2026-07-23] hmu332233/herdr-f1
- **Overview**: Herdr F1 is a spectator dashboard that visualizes live Herdr agents as a Formula 1 Grand Prix. Each Herdr `workspace` becomes a constructor team and each `agent terminal` becomes a race car: `working` cars race on circuit, `idle` cars wait in pits, `done` cars cool down, `blocked` cars stop on track and trigger yellow / Safety Car.
- **Key Features**: **Herdr actions (`herdr-plugin.toml`):** * `open` — `node bin/herdr-f1.js start --open` — start or reuse daemon and open browser. * `stop` — `node bin/herdr-f1.js stop` — SIGTERM daemon for current so

### [2026-07-23] matheus3301/herdr-shortcut
- **Overview**: **Shortcut** (`matheus3301.shortcut`, v0.1.1, `min_herdr_version 0.7.5`) is a read-only Shortcut task picker and coding-agent launcher for Herdr. It shows the authenticated member's active, non-completed Stories from Shortcut REST API v3 in a Bubble Tea popup, then launches a Herdr-managed coding-agent harness in a new focused tab to work on the selected Story.
- **Key Features**: **Task picker (`tui` pane):** * Fetches `GET /member`, `GET /workflows`, and `POST /search/stories` with query template `owner:{member} is:story !is:done !is:archived` (configurable). Resolves `workfl

### [2026-07-23] rotemb-wond/herdr-copy-hints
- **Overview**: **Copy Hints** (`rotemb-wond.copy-hints`, v1.1.1, `min_herdr_version 0.7.0`) is a keyboard-driven copy utility for Herdr panes, explicitly modeled on `tmux-fingers`. It scans the **visible text** of the focused pane for paths, Git commits/branches/status paths, URLs, IPv4s, UUIDs, hex literals, and long numbers, then overlays compact type-to-select labels directly on top of the pane contents. Typing a label copies the full underlying value to the system clipboard immediately.
- **Key Features**: No background service, hooks, or HTTP API. Two ephemeral entrypoints provide one user workflow:  **Action `open` — "Show copy hints" (`open.py`):** - Pane-context action (`contexts=["pane"]`). Reads `

### [2026-07-26] voodootikigod/adlc-herdr
- **Overview**: `adlc-herdr` (`id = "adlc"`, manifest v0.2.0, npm `@adlc/herdr` v1.11.0) surfaces the ADLC Agentic Development Lifecycle at the terminal-multiplexer layer. It does not enforce lifecycle or implement tickets/gates itself; it observes the shared `.adlc/` file contract written by seven harness plugins and renders that state natively in Herdr — per-pane `ticket`/`phase` tokens, workspace backlog counts, an overlay backlog board, pane-context actions, and `adlc-fleet` run observability.
- **Key Features**: **Watcher daemon `bin/watcher.mjs` (`[[startup]]`):** - Maps every pane to a repo via `foreground_cwd` → `cwd` fallback and `git rev-parse --show-toplevel`. - Publishes per-pane tokens `{ticket, phase

### [2026-07-30] ddfonseca/herdr-paste-image
- **Overview**: `Herdr Paste Image` (`herdr-paste-image`, v0.1.0, `min_herdr_version 0.7.0`) is a minimal, single-action utility plugin that bridges the OS clipboard and a coding agent running in Herdr. On keypress it reads the image currently in the system clipboard, writes it to `~/.cache/herdr-paste-image/image_<timestamp>.png` (configurable), and types that filesystem path into the focused pane **without submitting**, so Claude Code / Codex / Amp-style agents can ingest it as a file reference.
- **Key Features**: What the user gets is one workflow exposed as one action:  * **Action `paste` — "Paste clipboard image as a file path" (`herdr-plugin.toml` `[[actions]]`, `contexts=["global"]`, `command=["bash", "pas

### [2026-07-31] shadowfax92/herdr-talon
- **Overview**: **Talon** (`shadowfax.talon`, v0.2.0, `min_herdr_version 0.7.5`, `platforms = ["macos"]`) is a focused-pane history picker and copy utility, not a task manager despite its Task & Project Management ledger placement. Pressing `prefix+g` freezes up to 1,000 recent rendered rows from the invoking pane, unwraps soft-wraps, and opens them in a centered modal popup where detected values get short keyboard hints to copy.
- **Key Features**: **Two actions + one popup** declared in `herdr-plugin.toml`:  * `launch` — `Open Talon`, `contexts=["pane"]`, `./target/release/herdr-talon launch`: capture focused-pane history and open picker. * `in

### [2026-07-31] zerodice0/herdr-booking-task-plugin
- **Overview**: Herdr Booking Task is a cron-like scheduler for Herdr. It schedules two kinds of work — **a prompt sent to a live Herdr agent** at a future time, or **a local CLI command executed directly** — on weekday, daily, weekly, or one-time schedules.
- **Key Features**: **Two job kinds (`internal/booking/model.go`, `executor.go`):**  * `prompt` (`PromptSpec{Target, Text, WaitTimeoutSec}`): sends text to a unique agent name or pane ID via `herdr agent prompt`. Explici

### [2026-07-31] jmarbutt/herdr-spaces-pr-status
- **Overview**: `jmarbutt/herdr-spaces-pr-status` (`jmarbutt.spaces-pr-status`, v0.1.0, `min_herdr_version 0.7.4`) is a GitHub observability plugin for Herdr spaces, not a task manager despite its ledger category. It maps each Herdr workspace to its git branch / `owner/repo` and reports that branch's pull-request state into the sidebar, plus a Conductor-style board and per-space checks view.
- **Key Features**: **Sidebar tokens (the primary surface):** * `$pr` — e.g. `● #10110`, `◆ #10129 MERGED`. Glyph per rolled state; word suffix only for `merged/closed/draft`. * `$pr_checks` — e.g. `✓ 28/28`, `✗ 2/14`, `

### [2026-08-02] mdetweil/herdr-lazytask
- **Overview**: `mdetweil/herdr-lazytask` (`herdr.lazytask`, v0.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a dual-store task plugin for Herdr. It summons the external `lazytask` TUI — a keyboard-driven TaskChampion client — in an idempotent Herdr split or tab beside current work, and separately ships a small Rust binary for Taskwarrior quick mutations without opening the TUI.
- **Key Features**: **Lazytask pane (explicit action only, no event hooks):**  * `open` → `scripts/open-lazytask.sh`: open-or-focus-or-toggle in the **current tab**. No pane → open split right focused; unfocused match → 

### [2026-08-07] cdowell09/herdr-pr-board
- **Overview**: PR Board (`cdowell09.pr-board`, v0.3.1, `min_herdr_version 0.8.0`) is a config-driven, cross-repository GitHub pull-request dashboard for Herdr. It aggregates multiple `gh search prs` queries into named views in a single reusable Herdr tab named `PR Board`, enriches each PR with aggregate CI status via GraphQL, and optionally mirrors counts into Herdr sidebar tokens.
- **Key Features**: **Views and scopes:** * Three defaults from `config.example.toml` / `DefaultFile`: `authored` (`is:open author:@me`, `scope=global`), `review` (`is:open review-requested:@me`, `global`), `all` (`is:op

### [2026-08-20] the-inconvenience-store/herdr-tilt
- **Overview**: **Tilt** (`id = "herdr.tilt"`, v0.2.0, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a Rust Herdr plugin that controls and monitors [Tilt](https://docs.tilt.dev/) services from a Herdr split pane. It provides a keyboard-and-mouse Ratatui dashboard that lists every Tilt service with a four-color status, grouped by Tilt labels, while keeping the long-lived `tilt up` process in a retained plugin-owned controller so closing the dashboard does not stop Tilt.
- **Key Features**: What the user gets, verified from `herdr-plugin.toml`, `README.md`, `src/main.rs`/`tui.rs`/`session.rs`/`tilt.rs`/`logs.rs`:  **Two workspace actions + one split pane:** - `open` — “Open Tilt status”:

### [2026-08-21] agentience/herdr-plugin-ide-jump
- **Overview**: **IDE Jump** (`agentience.ide-jump`, v0.1.0, `min_herdr_version 0.7.4`, `platforms = ["macos", "windows"]`) is a window-raising utility, not a task manager despite its Task & Project Management ledger placement. From a Herdr pane, one keystroke raises the external editor window belonging to *that pane's project* — either silently (`jump`) or via a filterable popup list preselected to that project (`pick`/`picker`). The entire implementation is ~2.7k LOC of standard-library-only Python with two narrow OS backends: System Events / `osascript` on macOS and `user32` via `ctypes` on Windows.
- **Key Features**: No background service, hooks, or HTTP API. Two user gestures plus three diagnostic entrypoints, all dispatched by `ide_jump.py`:  * **`jump` — "Jump to this project's IDE window" (`[[actions]] jump`, 

### [2026-08-24] wine-fall/herdr-copy-pane-id
- **Overview**: **Copy pane id** (`wine-fall.copy-pane-id`, v0.1.0, `min_herdr_version 0.7.0`) is a minimal, stateless-unless-toggled utility plugin for Herdr on `linux`/`macos`. It solves one addressing problem: Herdr CLI commands require an unambiguous pane handle like `w1:p2`, which is hard to discover visually.
- **Key Features**: Two user-facing actions, both documented in `README.md` and `herdr-plugin.toml`:  **`copy-focused` — "Copy focused pane id" (`scripts/copy-focused.sh`):** - Resolves the focused pane id from `HERDR_PA

### [2026-08-26] yelsed/herdr-pr
- **Overview**: `yelsed/herdr-pr` (`yelsed.pr`, v0.6.0, `min_herdr_version 0.8.0`) is a **Todo list of GitHub pull requests waiting on you, rendered in a Herdr pane**. It ranks everything where the next move is yours — review requested, assigned, changes requested, failing checks, ready-to-merge, already-reviewed, plus capped unreviewed team PRs — each row annotated with *why* it is on the list.
- **Key Features**: **Six tabs, one ranked Todo:**  * `Todo` — derived locally by `todo::rank()` from the other five searches. Seven `Reason` variants in declaration order = ranking: `ReviewRequested > AssignedToYou > Ch

### [2026-08-27] ivorpad/herdr-ports
- **Overview**: `ports` (`Open Ports`, v0.1.1, `min_herdr_version 0.7.5`) is a small, dependency-free Herdr utility for developers fighting port conflicts. It opens a session-modal popup that lists every listening TCP port (optionally UDP), resolves the opaque runtime name like `node` / `beam.smp` / `python3.12` to the actual project and script behind it, and lets you open the URL in a browser or kill the holder with `SIGTERM` / `SIGKILL`.
- **Key Features**: What the user actually gets, verified from `herdr-plugin.toml` + `ports.py` + `README.md`:  **Interactive TUI (`./ports.py`, run by the `ports` popup):** * Live table with columns `PORT / WHAT / CPU /

### [2026-08-28] wavrin/herdr-ferry
- **Overview**: **Ferry** (`herdr-ferry`, `v0.1.0`, `min_herdr_version 0.8.0`) moves files and clipboard content between the machine Herdr runs on (the “server” / Herdr box) and the laptop the user is attached from, over the user’s existing SSH — no cloud bucket, no new listener, no new keys.
- **Key Features**: ### What the user gets in Herdr  Declared in `herdr-plugin.toml` (verified against Herdr `0.8.2` per `docs/herdr-verified.md`):  * **Actions (3):**   * `send` — “Ferry: send file to laptop”, `contexts

### [2026-09-02] mike-bronner/herdr-plugin-project-picker
- **Overview**: This is a minimal workspace reconciler for Herdr, not a project template system. `bin/pick-project` fuzzy-lists every git repo up to two levels under a configured root (default `~`), pre-checks what is already open, and on Enter makes the open set equal the checked set: unchecked workspaces are closed, newly checked repos are created, empty selection leaves only the pinned home workspace, Esc changes nothing.
- **Key Features**: **One user gesture, no background service:**  * **Picker popup (`panes.picker`):** `Find projects to work on`, `placement = "popup"`, `85% x 85%`. This is a pane, not an `[[actions]]` entry, because a

### [2026-09-03] chrisg32/tsk
- **Overview**: `tsk` (`id = "tsk"`, v0.1.0, `min_herdr_version = "0.8.2"`, `linux`/`macos`) is a plain-text task manager in the spirit of PlainTasks / TaskPaper, implemented as a single Rust binary (~4.3k LOC). The same binary runs standalone in any terminal or as a Herdr plugin: it opens a `.todo` / `.taskpaper` / `.tasks` file in a full-screen Ratatui TUI where projects (`Name:`), tasks (`☐` / `✔` / `✘` plus many legacy bullets), `@tags`, and notes are edited in place.
- **Key Features**: **File model:** Parses line-by-line into `Project | Task | Note | Blank`, preserving leading whitespace, trailing newline, and CRLF. Recognizes 16 open bullets (`☐ ❍ ❑ ■ □ ▪ ▫ – — ≡ → › - + * [ ]`), 4

### [2026-09-03] testy-cool/herdr-copy-conversation
- **Overview**: This is a minimal, single-purpose clipboard utility for Herdr, not a task manager despite its placement in the Task & Project Management ledger. In one keystroke it dumps the **entire unwrapped scrollback** of the focused pane — e.g. a Claude Code / Codex / Agy / opencode conversation — to the OS clipboard and fires a confirmation toast with the line count.
- **Key Features**: What the user gets is exactly one workflow:  * **Action `copy` — "Copy Conversation" (`contexts=["pane"]`, `command=["bash", "copy.sh"]`):** Invoked via keybind (README suggests `prefix+y` → `type="pl

### [2026-08-19] smarzban/herdr-tsk
- **Overview**: `herdr-tsk` (`id = "herdr-tsk"`, v0.7.0, `min_herdr_version = "0.7.5"`) is a terminal task queue-board shipped as a Herdr plugin that also runs standalone. The same compiled `tsk` binary renders a full-screen Ratatui board for humans in a Herdr split pane or any terminal, while coding agents drive the same `~/.tsk` / `tsk.json` store headlessly through a scriptable CLI and an installed `SKILL.md`.
- **Key Features**: **Interactive board (`tsk`, no args):** * Three persistent destinations on every normal surface (`1`/`2`/`3`): `desk` (NEEDS YOU + global IN MOTION + desk-only ON DECK), selected-project board, and `p

### [2026-08-28] MatheusBBarni/herdr-tasks
- **Overview**: `htasks` is a repo-local Kanban task runner for Herdr, shipped as a single Bun binary that serves both as a one-shot CLI for humans and coding agents and as a full-screen OpenTUI React board. Tasks are plain Markdown files with YAML frontmatter under `.herdr-tasks/` in the project itself; moving a card to `in_progress`, `review`, or a prompted custom lane creates a Herdr workspace/tab/pane in the task's repo, starts the mapped agent `command` there, and sends the task file plus lane prompt as the first `herdr agent prompt`.
- **Key Features**: **Board + CLI share one store.** Discovery walks up from `HTASKS_ROOT` → `HERDR_PLUGIN_CONTEXT_JSON` workspace/worktree cwd → `process.cwd()` to find `.herdr-tasks/config.toml`. Source of truth is `ta

### [2026-09-08] ArtMoreno/herdr-glance
- **Overview**: **Glance** (`herdr-glance`, v0.1.0, `min_herdr_version 0.8.2`) is a read-mostly, live agent dashboard for Herdr. It answers “who is working, who is waiting, and who needs me” by polling Herdr for agents in the current workspace/session and rendering each as a themed card with state badge, elapsed-observed time, 32-sample activity sparkline, and last output lines — with `blocked` agents sorted first and expanded to show a `detection` excerpt under a `NEEDS YOU` banner.
- **Key Features**: **Dashboard TUI (`glance`, no subcommand):** * Per-agent cards for five native states: `working / idle / blocked / done / unknown` (`STATES` in `src/model.rs`). Unknown covers any unrecognized `agent_

### [2026-09-09] circusvoid/herdr-key-hints
- **Overview**: `circusvoid/herdr-key-hints` (`local.key-hints`, v0.1.0, `min_herdr_version 0.9.0`, `macos`/`linux`) is a post-action teaching aid, not a task manager despite its ledger category.
- **Key Features**: **User-visible actions** — declared in `herdr-plugin.toml` as `[[actions]]`:  * `initialize` — `python3 plugin.py initialize`: baseline snapshot, clear overlay frame, (re)start session watcher. * `pre

