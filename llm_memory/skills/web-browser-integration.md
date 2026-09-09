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

