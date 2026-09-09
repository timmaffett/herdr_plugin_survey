# Architectural Memory: Session & Workspace Management

This document tracks architectural patterns and previously surveyed extensions within the **Session & Workspace Management** domain.

## Surveyed Extensions Ledger

### [2026-03-17] EzraCerpac/jj-waltz
- **Overview**: `EzraCerpac/jj-waltz` is a Rust workspace manager for Jujutsu (`jj`), distributed as the `jw` CLI plus a bundled Herdr UI adapter (`herdr-jj-waltz`). The core project is ~14.5k LOC in Rust.
- **Key Features**: **Core `jw` CLI (`src/cli.rs`, `src/main.rs` -> `jj_waltz::cli::run`):**  * `jw add <name>... [--at REVSET] [-b/--bookmark NAME] [--no-bookmark] [--no-links]` — create one or more workspaces without s

### [2026-03-29] ChrisPachulski/session-sounds
- **Overview**: `ChrisPachulski/session-sounds` is a Rust Herdr plugin that gives each detected agent session a stable audible identity. Instead of Herdr's single shared background notification, parallel Claude, Codex, Amp, and OpenCode sessions each keep a distinct tone, and that tone is also reflected in Herdr's agent label as `agent · Sound Name` plus a `sound=Name` metadata token.
- **Key Features**: **Distinct per-session sounds:** - First seven concurrent assignments get different bundled WAVs from `sounds/themes/default/`: `bright_cascade`, `warm_bell`, `pulse_bounce`, `glass_chime`, `synth_sta

### [2026-06-01] j0urneyk/herdrctx
- **Overview**: `herdrctx` is a standalone, keyboard-driven terminal UI for managing local Herdr sessions — not an in-Herdr pane or action. Run from a terminal outside Herdr, it lists sessions with auto-refresh, lets the user search by name or directory, and attach, create, stop, and delete sessions from one screen, returning to the list on detach from Herdr.
- **Key Features**: **Session lifecycle via Herdr CLI:**  * **List:** `herdr session list --json` polled on a configurable interval (default `3s`, minimum `500ms`). Failures surface in the status line, not a modal. * **A

### [2026-06-11] lmilojevicc/seshagy
- **Overview**: `seshagy` (`lmilojevicc/seshagy`, v0.6.0) is an agent-aware terminal dashboard for jumping between project directories, multiplexer sessions, and terminal-based AI coding agents. It presents a single Bubble Tea TUI that merges `zoxide`/`fd` directory sources with live `tmux` sessions or `herdr` workspaces plus per-pane agent state (`working`/`blocked`/`done`/`idle`).
- **Key Features**: **Dashboard (TUI):** * List, attach/focus, create-from-directory, rename (`R`), kill (`x`), and preview sessions/workspaces. * Directory sources: `zoxide` frecency (`z`), `fd` discovery (`f`), `yazi` 

