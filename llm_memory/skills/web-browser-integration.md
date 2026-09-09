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

