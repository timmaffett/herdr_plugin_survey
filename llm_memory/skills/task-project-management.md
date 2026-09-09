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

