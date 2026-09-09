# Architectural Memory: Developer Workflow & Utilities

This document tracks architectural patterns and previously surveyed extensions within the **Developer Workflow & Utilities** domain.

## Surveyed Extensions Ledger

### [2026-03-02] second-state/vibetty
- **Overview**: **Vibetty** (`vibetty`, v0.4.1) is a Rust terminal-sharing tool that runs an interactive program in a PTY, renders the terminal screen, and publishes it over MQTT so remote devices — ESP32/MCU, another machine, or a browser — can view the live screen and send keystrokes back without exposing any port on the host PC. As a Herdr plugin it narrows that generic capability to one workflow: a `share` action on a focused agent pane opens a 1-row `herdr-share` status pane running `vibetty herdr`, which `herdr agent attach`es to that pane and bridges it to MQTT.
- **Key Features**: **Core sharing model:** * PTY execution via `portable-pty` (`portable-pty-psmux`): `vibetty -- claude`, `vibetty -- codex`, or in Herdr mode `herdr agent attach <target>` at 80x40, parsed through `vt1

### [2026-03-02] HikaruEgashira/say-hook
- **Overview**: `hikaruegashira.say-hook` (v0.4.2, `macos` only, requires Herdr `>=0.7.0`) is a voice-notification counterpart to a push notification for parallel agent panes. When a Herdr agent reaches a terminal state (`done` / `blocked` by default) it speaks the agent's opening excerpt aloud through the `say-hook` CLI — ElevenLabs V3 TTS with fallback to macOS `/usr/bin/say`. The excerpt contract is shared everywhere: normalize whitespace, stop at the first `.`, `,`, or `。` inclusive, capped at 200 characters.
- **Key Features**: **Core TTS (`index.ts`, Bun + TypeScript):** - `say-hook "Hello, world!"` synthesizes via `ElevenLabsClient.textToSpeech.convert(voiceId, { text, model_id: "eleven_v3", output_format: "mp3_44100_128",

