# Architectural Memory: Developer Workflow & Utilities

This document tracks architectural patterns and previously surveyed extensions within the **Developer Workflow & Utilities** domain.

## Surveyed Extensions Ledger

### [2026-03-02] second-state/vibetty
- **Overview**: **Vibetty** (`vibetty`, v0.4.1) is a Rust terminal-sharing tool that runs an interactive program in a PTY, renders the terminal screen, and publishes it over MQTT so remote devices — ESP32/MCU, another machine, or a browser — can view the live screen and send keystrokes back without exposing any port on the host PC. As a Herdr plugin it narrows that generic capability to one workflow: a `share` action on a focused agent pane opens a 1-row `herdr-share` status pane running `vibetty herdr`, which `herdr agent attach`es to that pane and bridges it to MQTT.
- **Key Features**: **Core sharing model:** * PTY execution via `portable-pty` (`portable-pty-psmux`): `vibetty -- claude`, `vibetty -- codex`, or in Herdr mode `herdr agent attach <target>` at 80x40, parsed through `vt1

### [2026-03-02] HikaruEgashira/say-hook
- **Overview**: `hikaruegashira.say-hook` (v0.4.2, `macos` only, requires Herdr `>=0.7.0`) is a voice-notification counterpart to a push notification for parallel agent panes. When a Herdr agent reaches a terminal state (`done` / `blocked` by default) it speaks the agent's opening excerpt aloud through the `say-hook` CLI — ElevenLabs V3 TTS with fallback to macOS `/usr/bin/say`. The excerpt contract is shared everywhere: normalize whitespace, stop at the first `.`, `,`, or `。` inclusive, capped at 200 characters.
- **Key Features**: **Core TTS (`index.ts`, Bun + TypeScript):** - `say-hook "Hello, world!"` synthesizes via `ElevenLabsClient.textToSpeech.convert(voiceId, { text, model_id: "eleven_v3", output_format: "mp3_44100_128",

### [2026-05-31] osolmaz/ghzinga
- **Overview**: `dutifuldev.ghzinga` (`Ghzinga for Herdr`, v0.1.0 in `plugins/herdr/herdr-plugin.toml`) is a thin Herdr adapter for `ghzinga` — a ~55k LOC Rust Ratatui/Crossterm terminal UI (`gzg` / `ghzinga` binaries, v0.5.1 in `Cargo.toml`) for viewing a single GitHub issue or pull request on the side while you work.
- **Key Features**: **Manifest-declared surface (`herdr-plugin.toml`):**  * `actions.open`: title `Open in ghzinga`, `contexts = ["pane"]`, `command = ["gzg", "herdr-plugin", "open"]`. * `panes.viewer`: title `ghzinga`, 

### [2026-06-05] dev-town/harbr
- **Overview**: **Harbr** (`dev-town.harbr`, `0.1.0`, `min_herdr_version 0.8.2`) is a terminal-native workspace orchestrator, not an IDE, multiplexer, Git client, or agent tool. Its core model is `Project -> Workspace -> Module -> Runtime`, with Git as source of truth for repo state and tmux or Herdr as the selectable runtime provider.
- **Key Features**: **Herdr plugin surface — no hooks, no background services:**  * `actions.open`: title `Open Harbr`, `contexts = ["workspace"]`, `command = ["sh", "scripts/open.sh"]`. Invoked by user as `plugin_action

### [2026-06-15] ogulcancelik/herdr-plugin-github-start
- **Overview**: `ogulcancelik.github-start` (`GitHub Start`, v0.2.0, `min_herdr_version 0.7.5`) is a named-session finder and launcher for three native harnesses: **Pi, Codex, and Claude Code**. Invoked from any workspace/tab/pane, it opens a popup that accepts an exact session name, bare number (`1158`, `#1158`, `pr 1158`), or full GitHub URL, searches only the explicit naming records of each harness on disk, then either focuses a live Herdr pane, resumes a saved native session in a new tab, or starts a new named session.
- **Key Features**: **Search and match:**  * `parseTarget()` in `launcher.js` classifies input as `name` vs GitHub `issue/discussion/pr`. URLs are normalized to `https://github.com/{repo}/{kind}/{number}`; `pr` maps to `

