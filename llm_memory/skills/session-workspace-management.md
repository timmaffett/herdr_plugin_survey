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

### [2026-06-16] andrewchng/herdr-sessionizer
- **Overview**: `andrewchng/herdr-sessionizer` (`sessionizer`, v0.8.1) is a Herdr Session & Workspace Management plugin inspired by ThePrimeagen's `tmux-sessionizer`. It provides fuzzy pickers — backed by `fzf` — to focus an existing Herdr workspace or bootstrap a new project or Git-worktree workspace with a declarative tab/pane layout.
- **Key Features**: **Two user flows, documented in `README.md`:**  * **Sessionizer (`sessionizer.open` → `sessionizer` pane):** workspace picker first. `Enter` focuses existing workspace; `Esc` falls back to projects un

### [2026-06-16] razajamil/herdr-plugin-workspace-manager
- **Overview**: **Workspace Manager** is a Session & Workspace Management plugin that turns every new git worktree into a fully-arranged Herdr workspace. The user declares tabs, panes, splits, sizes, environment, shell commands, and interactive agents once in `config.yml` and maps repos to a default layout; the plugin then builds that layout automatically on `worktree.created` / `workspace.created` / `workspace.focused`, and ships a companion `remove-gone` CLI to clean up worktrees whose upstream branch was deleted.
- **Key Features**: **Automatic layout application:** * Declarative `layouts[].tabs[].panes[]` with `title`, `command`, `persist` (default `true`), `env`, `split: vertical|horizontal|right|down`, `size` (cells `40` / per

### [2026-06-17] shizlie/herdr-setup-bootstrap
- **Overview**: `shizlie/herdr-setup-bootstrap` (`setup-bootstrap`, v0.1.2) is a minimal Shell-based Session & Workspace Management plugin that bootstraps newly created Herdr linked worktrees from a project-local `worktree_init.toml`. When a worktree workspace is created or focused, it runs a configured `setup` shell command inside the new checkout and copies gitignored locals (e.g. `.env*`, `.dev.vars`, `public/`) from the main repo root, then marks that checkout as done so it is only bootstrapped once.
- **Key Features**: The plugin provides no user-invoked commands, panes, or HTTP endpoints — it is purely event-driven:  * **Bootstrap on `workspace.created`:** catches worktrees created via Herdr CLI/API path. Declared 

