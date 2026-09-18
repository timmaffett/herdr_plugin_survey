# Architectural Memory: Web & Browser Integration

This document tracks architectural patterns and previously surveyed extensions within the **Web & Browser Integration** domain.

## Surveyed Extensions Ledger

### [2026-06-30] alexjsp/herdr-scrollback-capture
- **Overview**: This is a small, single-purpose Herdr utility plugin that dumps the **focused pane's scrollback to a file on disk** for archiving, sharing, or grepping later. It exposes two manual actions — save as self-contained colored HTML or as unwrapped plain text — and posts a Herdr desktop notification with the resulting path. The entire implementation is ~281 lines of POSIX `sh` plus a two-action manifest; there are no background services, hooks, or sockets.
- **Key Features**: **Two user-invoked actions (no automatic triggers):**  * `capture` — `Save scrollback as HTML` → runs `sh dump-scrollback.sh html` * `capture-text` — `Save scrollback as text` → runs `sh dump-scrollba

### [2026-07-06] zenbu-labs/terminal-browser
- **Overview**: `terminal-browser` is a full Chromium browser that renders inside a terminal pane using the Kitty graphics protocol. The Herdr wrapper itself is trivial — ~2 files: a `herdr-plugin.toml` manifest and `open-split.sh` — whose only job is to install the prebuilt binary via `https://terminal-browser.sh/install` and expose one manual action to open the browser in a right split.
- **Key Features**: **Herdr plugin surface (only what `herdr-plugin/` declares):**  * One action: `open-split` — *“Open terminal-browser (right split)”*, `contexts = ["global"]`, `command = ["bash", "open-split.sh"]`. * 

### [2026-07-07] iikjl/herdr-spotify
- **Overview**: `iikjl/herdr-spotify` (`spotify-now-playing`, v1.0.0, `macos` only, requires Herdr `>=0.7.0`) is an interactive overlay for the Spotify desktop app. It shows now-playing metadata, album art, progress bar, volume/shuffle/repeat state in a Herdr `overlay` pane with full keyboard control, plus an optional Spotify Web API layer for search, queue inspection, and library likes. Core playback works with zero account setup via AppleScript; the Web API is strictly opt-in via a one-time OAuth PKCE flow.
- **Key Features**: **Now-playing overlay (`player` pane):** * Live 1-second refresh of track, artist, album, position/duration, volume, shuffle/repeat, artwork URL. * Truecolor half-block album art by default (`COLORTER

### [2026-07-11] Orchard-Robotics/herdview
- **Overview**: `herdview` (`orchard.herdview`, v0.6.3, `min_herdr_version 0.7.3`, `linux`/`macos`) is a **phone-first web mirror of an existing herdr session**. It does not spawn a new remote-control agent; it reflects agents already running in herdr into a mobile-friendly web UI served over local HTTP (default `0.0.0.0:8848`) where you can watch state, read transcripts as chat, and steer blocked agents.
- **Key Features**: **What the user sees (per `README.md` + e2e specs):**  * **Live agent grid:** all agents across all running herdr sessions, blocked-first with “N need you” count, state pill, `cwd`, git branch, sessio

### [2026-07-18] StructuPath/herdr-browser
- **Overview**: `structupath.browser` (`Browser`, v0.7.0, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a driveable browser pane for Herdr. It provides a human-visible, interactive view into the same headless Chromium session a coding agent is driving via `agent-browser`, while also supporting two pane-owned modes: attaching read-mostly to any external Chrome DevTools Protocol (CDP) browser, or launching and owning a local Chromium.
- **Key Features**: **Workspace browser viewer (`view` pane, `scripts/pane.sh` -> `bin/renderer.mjs`):**  * Live screenshot + URL/title header + appended console/page-error/failed-request feed. Adaptive rendering: `kitty

### [2026-07-22] chouxcreams/herdr-url-picker
- **Overview**: `chouxcreams/herdr-url-picker` (`chouxcreams.url-picker`, v0.1.0) is a minimal, single-purpose Herdr utility that replicates tmux `urlview`-style workflow: extract `http://` / `https://` URLs from the focused pane and open the user-selected one in the system browser. The entire plugin is two POSIX `bash` scripts plus a manifest (~286 lines of Shell total) with one manual action and one session-modal popup pane. There are no daemons, hooks, sockets, or background services.
- **Key Features**: **What the user experiences:**  * **One manual action:** `pick` — *“Pick URL from focused pane”* (`open-popup.sh`). No automatic triggers. * **Popup picker pane:** `picker` (`picker.sh`), `placement =

### [2026-07-22] abrose/herdr-url-picker
- **Overview**: `abrose/herdr-url-picker` (`url-picker`, v0.1.0) is a minimal, single-purpose Herdr utility that replicates `urlview`-style workflow: extract `http://` / `https://` / `ftp://` URLs (plus bare `www.`) from the focused pane's scrollback and open the user-selected one in the system browser. It is implemented entirely as three POSIX `bash` scripts plus a manifest — one non-interactive action that launches one session-modal popup — with no daemons, hooks, sockets, or background services. This is functionally the same design as the previously surveyed `chouxcreams/herdr-url-picker`, with explicit documentation of the two-stage action+popup split.
- **Key Features**: What the user experiences:  * **One manual action:** `pick` — *“Pick a URL from the pane”* (`./pick.sh`). No automatic triggers, no events, no HTTP API endpoints. * **One interactive popup pane:** `pi

### [2026-07-28] RanolP/herdr-handsfree
- **Overview**: `RanolP/herdr-handsfree` (`ranolp.handsfree`, v0.2.0, `macOS` only) is a hands-free input plugin for Herdr on Apple Silicon. It provides two on-device pipelines in a single Rust binary: microphone voice dictation transcribed locally and typed into the focused Herdr pane, and a webcam-driven gaze mouse that moves the system cursor. There are no cloud services; audio and video never leave the machine.
- **Key Features**: **User-visible surface:**  * **Two manual actions:** `toggle-dictation` — start/stop dictation; `toggle-gaze` — start/stop gaze mouse. Both invoke `target/release/herdr-handsfree toggle <dictation|gaz

### [2026-07-29] pedroloch/herdr-undo-close
- **Overview**: `pedroloch/herdr-undo-close` (`undo-close`, v0.3.0) is a Chrome-style `Cmd+Shift+T` for Herdr. It reopens the last-closed tab **or** pane — same label, split tree and ratios, per-pane `cwd`s, position, and what was running in it.
- **Key Features**: **Two user actions + one popup pane + one plain CLI:**  * `reopen-last` — *Reopen closed tab or pane* (`cli reopen` → `restore.reopen_last`): restores index `0`. * `pick` — *Reopen ... from list...* (

### [2026-08-08] zenbu-labs/terminal-code
- **Overview**: `zenbu-labs/terminal-code` — shipped as `zenbu-labs.tode`, `Terminal Code v0.1.1` — is VS Code running inside a terminal pane. It combines two pinned upstreams: `coder/code-server` serves the workbench locally, and `zenbu-labs/terminal-browser` draws it with the Kitty graphics protocol. The Herdr wrapper itself is intentionally trivial — the same pattern as the previously surveyed `zenbu-labs/terminal-browser`: install a prebuilt binary via `curl | bash` and expose one manual split action.
- **Key Features**: What the user gets from Herdr is a single action:  * `open-split` — *“Open terminal-code (right split)”*: `exec tode --split right`.  What `tode` itself can do — all implemented in `src/main.ts` + `RE

### [2026-08-11] happyeric77/agent-webhook-notify
- **Overview**: `herdr.agent-webhook-notify` (`Agent Webhook Notify`, v0.1.0, `min_herdr_version 0.7.0`) is a minimal, zero-dependency Node.js plugin that POSTs a JSON payload to a user-configured `WEBHOOK_URL` when a Herdr agent reaches `done` or `blocked`. It has no UI, panes, or daemons: one declarative event handler (`notify.mjs` on `pane.agent_status_changed`) does the work, plus three manual actions (`toggle` / `enable` / `disable`) that flip a persistent on-disk enabled flag.
- **Key Features**: **What the user gets:**  * **Automatic notification on terminal agent states:** subscribes to `pane.agent_status_changed`. `notify.mjs` resolves a status and exits silently unless it is `done` or `blo

### [2026-08-12] lurepos/herdr-vscode-tasks
- **Overview**: `herdr.vscode-tasks` (v0.1.0, `min_herdr_version 0.7.0`) brings VS Code `tasks.json` execution to Herdr. It searches upward from the current workspace for `.vscode/tasks.json`, presents tasks in a terminal popup picker, resolves VS Code-style variables and inputs, then runs the selected task — including `dependsOn` chains — in a new Herdr tab, split pane, or the current pane via the `herdr` CLI.
- **Key Features**: **User surface is minimal:**  * One action: `open-picker` (`contexts = ["workspace"]`, title `open picker`) that opens the `picker` pane with `herdr plugin pane open --plugin herdr.vscode-tasks --entr

### [2026-08-20] playsthisgame/herdr-x
- **Overview**: `herdr-x` v0.3.0 (`min_herdr_version 0.8.0`, `linux`/`macos`) is a thin Herdr wrapper around `terminal-browser` for reading `x.com` and drafting posts. Browsing renders real Chromium in a Herdr pane via the Kitty graphics protocol; composing opens `$EDITOR` on a temp file and then opens the public `https://x.com/intent/post?text=…` intent URL pre-filled.
- **Key Features**: **Herdr surface — 5 manual actions, 2 panes, no triggers:**  * Actions (all `contexts = ["global"]`, invoked as `herdr-x.<id>`):   * `browse` — `scripts/open-browse.sh` — x.com in a split beside curre

### [2026-08-24] husniadil/herdr-sched
- **Overview**: `herdr-sched` (`Sched`, v0.2.4, `min_herdr_version 0.8.0`, `macos`/`linux`) is the scheduler and trigger plugin for a Herdr fleet, sibling to `herdr-tasks` / `herdr-dispatch` / `herdr-mail`.
- **Key Features**: **Jobs — cron half (`internal/cron`, `internal/job`, `daemon/jobs.go`):**  * `job add <id> <"5-field expr"> <action> --args '{...}' [--catch_up]`, `job list`, `job remove`, `job enable`, `job disable`

### [2026-09-02] jefflau/herdr-webhook
- **Overview**: `jefflau.herdr-webhook` (`Herdr Webhook`, v0.1.0, `min_herdr_version 0.7.5`, `linux`/`macos` only) is an event-driven notifier that POSTs a JSON envelope to a user-owned `WEBHOOK_URL` when a pane agent transitions into a notify status — `done` or `blocked` by default. It has no UI, panes, actions, or daemons: a single manifest `[[events]]` entry invokes `python3 hook.py` on `pane.agent_status_changed`, and all deduplication, settling, and delivery logic lives in that one Python file.
- **Key Features**: **Trigger:** one declarative hook, no manual commands:  * `on = "pane.agent_status_changed"` → `command = ["python3", "hook.py"]`. Accepts both `pane.agent_status_changed` and `pane_agent_status_chang

### [2026-08-30] to4iki/herdr-fzf-terminal-browser
- **Overview**: `to4iki/herdr-fzf-terminal-browser` (`fzf terminal-browser`, v0.1.0, `min_herdr_version 0.8.2`, `macos`/`linux`) is a focused Herdr utility: press a key in any pane, fuzzy-pick a URL visible on that pane with `fzf`, and open it in [terminal-browser](https://terminal-browser.com/) without leaving the terminal.
- **Key Features**: **User-visible surface: one action + two panes, no automatic triggers:**  * `pick` action (`contexts = ["pane"]`, title `Open URL in terminal-browser`): the keybinding target (`prefix+f` in docs). Has

### [2026-09-07] bonkey/herdr-link-browser
- **Overview**: `bonkey/herdr-link-browser` (`bonkey.link-browser`, v0.2.0, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a minimal glue plugin that makes `http(s)` URLs Ctrl-clickable. Ctrl-clicking any `https?://` link in any pane opens that URL in [terminal-browser](https://terminal-browser.sh) as an unfocused split to the right of the clicked pane.
- **Key Features**: What the user gets:  * **Ctrl-click to browse:** A `[[link_handlers]]` entry named `web` (`pattern = "(?i)https?://"` ) routes Herdr's built-in modified-click (Ctrl on all platforms, including macOS) 

### [2026-09-07] Eslsamu/herdr-tasks
- **Overview**: `Eslsamu/herdr-tasks` (`herdr-tasks`, `Tasks`, v0.3.3) is an agent-owned work queue for Herdr. Agents in a Herdr space `join` a named board and maintain tasks via a local CLI; humans get passive awareness via a Herdr tab-bar summary and a read-only local browser viewer, plus an optional terminal split.
- **Key Features**: **Queue semantics (`Store` in `herdr_tasks.py`):**  * Statuses `queued/doing/blocked/done/cancelled`. Priority `0` (highest) to `9`, oldest-first within priority. * One `doing` task per owner per boar

