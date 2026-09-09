# Architectural Memory: Session & Workspace Management

This document tracks architectural patterns and previously surveyed extensions within the **Session & Workspace Management** domain.

## Surveyed Extensions Ledger

### [2026-03-17] EzraCerpac/jj-waltz
- **Overview**: `EzraCerpac/jj-waltz` is a Rust workspace manager for Jujutsu (`jj`), distributed as the `jw` CLI plus a bundled Herdr UI adapter (`herdr-jj-waltz`). The core project is ~14.5k LOC in Rust.
- **Key Features**: **Core `jw` CLI (`src/cli.rs`, `src/main.rs` -> `jj_waltz::cli::run`):**  * `jw add <name>... [--at REVSET] [-b/--bookmark NAME] [--no-bookmark] [--no-links]` — create one or more workspaces without s

### [2026-03-29] ChrisPachulski/session-sounds
- **Overview**: `ChrisPachulski/session-sounds` is a Rust Herdr plugin that gives each detected agent session a stable audible identity. Instead of Herdr's single shared background notification, parallel Claude, Codex, Amp, and OpenCode sessions each keep a distinct tone, and that tone is also reflected in Herdr's agent label as `agent · Sound Name` plus a `sound=Name` metadata token.
- **Key Features**: **Distinct per-session sounds:** - First seven concurrent assignments get different bundled WAVs from `sounds/themes/default/`: `bright_cascade`, `warm_bell`, `pulse_bounce`, `glass_chime`, `synth_sta

