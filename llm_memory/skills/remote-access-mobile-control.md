# Architectural Memory: Remote Access & Mobile Control

This document tracks architectural patterns and previously surveyed extensions within the **Remote Access & Mobile Control** domain.

## Surveyed Extensions Ledger

### [2026-03-29] ivanarama/PromptPilot
- **Overview**: PromptPilot is a background task-queue for AI coding CLIs — queue, schedule, retry with exponential backoff, and manage prompts via CLI, Web UI, or Telegram bot. The `herdr-plugin/` shim surveyed here is deliberately tiny: it auto-starts `pp worker` when the herdr server starts and adds a `PromptPilot: поставить задачу` action that enqueues the current pane's directory as a task. The bulk of the 28k LOC Python codebase is the standalone PromptPilot application that the plugin shells out to; without an installed `pp` the plugin does nothing but notify.
- **Key Features**: **Herdr plugin surface — `herdr-plugin/herdr-plugin.toml`:**  * `id = promptpilot`, `v0.1.0`, `min_herdr_version 0.7.5`, `platforms = linux, macos` only. * `[[startup]] command = ["bash", "scripts/ens

