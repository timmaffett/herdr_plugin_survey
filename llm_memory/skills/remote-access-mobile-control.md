# Architectural Memory: Remote Access & Mobile Control

This document tracks architectural patterns and previously surveyed extensions within the **Remote Access & Mobile Control** domain.

## Surveyed Extensions Ledger

### [2026-03-29] ivanarama/PromptPilot
- **Overview**: PromptPilot is a background task-queue for AI coding CLIs — queue, schedule, retry with exponential backoff, and manage prompts via CLI, Web UI, or Telegram bot. The `herdr-plugin/` shim surveyed here is deliberately tiny: it auto-starts `pp worker` when the herdr server starts and adds a `PromptPilot: поставить задачу` action that enqueues the current pane's directory as a task. The bulk of the 28k LOC Python codebase is the standalone PromptPilot application that the plugin shells out to; without an installed `pp` the plugin does nothing but notify.
- **Key Features**: **Herdr plugin surface — `herdr-plugin/herdr-plugin.toml`:**  * `id = promptpilot`, `v0.1.0`, `min_herdr_version 0.7.5`, `platforms = linux, macos` only. * `[[startup]] command = ["bash", "scripts/ens

### [2026-06-19] luminexord/herdres
- **Overview**: Herdres `0.7.0rc4` is a **source-mode-only Telegram connector for Herdr coding agents**. It does not observe or control Herdr directly. Per `README.md` and `herdres.py` docstring, all observation, turn canonicalization, pending-interaction capture, command routing, and backend health are delegated to the external **Tendwire** service (`tendwired.service`); Herdres owns Telegram polling (`herdres-gateway`), topic/message presentation, local state (`state.json` + SQLite spool), and delivery de-duplication (`herdres sync`).
- **Key Features**: **Herdr plugin surface (`herdr-plugin.toml`):** - `id = luminexord.herdres`, `min_herdr_version = 0.7.0`, `platforms = ["linux"]` only. - Two `[[actions]]`, both via `python3 scripts/herdr_plugin.py`:

### [2026-06-21] dcolinmorgan/herdr-remote
- **Overview**: `Herdr Remote` (`id = herdr-remote.relay`, `v0.8.0`, `min_herdr_version 0.7.0`) is a remote-operations stack for Herdr coding agents. A tiny Herdr event shim (`relay/on_event.py`) pushes `pane.agent_status_changed` over UDP to a long-lived Python relay (`relay/herdr_relay.py`), which polls the `herdr` CLI, canonicalizes pane/agent/tab/workspace state, and fans it out over WebSocket to a web app, Textual TUI, native Swift `Herdi` macOS/iOS clients, and a Telegram bot that can read output and approve blocked prompts from a phone.
- **Key Features**: **Herdr plugin surface (only hook):** - `[[events]] on = pane.agent_status_changed` → `uv run --script relay/on_event.py` (root manifest) / `on_event.py` (relay-local manifest). No `[[startup]]` or `[

### [2026-06-23] dcolinmorgan/herdr-push
- **Overview**: `herdr-push` is a minimal companion shim for `dcolinmorgan/herdr-remote`. It does not implement a dashboard, relay, bot, or approval logic itself — it simply forwards Herdr `pane.agent_status_changed` events via HTTP to an externally-hosted `herdr-remote` relay, which then fans out to phone/desktop/Telegram clients where a user can monitor and approve blocked agents. The entire plugin is ~194 LOC of POSIX `sh` in two scripts: a fire-and-forget event forwarder and a manual connectivity test.
- **Key Features**: **Declared surface in `herdr-plugin.toml` (2 hooks only):**  * `[[events]] on = pane.agent_status_changed` -> `["sh", "on_event.sh"]` — automatic push on every agent status transition. * `[[actions]] 

### [2026-06-28] AltanS/collie
- **Overview**: Collie (`id = herdr.collie`, `v1.5.6`, `min_herdr_version 0.7.0`, `linux, macos` only) is a **mobile web UI to monitor and reply to a herd of coding agents, served over Tailscale**.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** one `[[build]]` (`bash scripts/collie-ctl.sh build`) + 11 workspace-context `[[actions]]`, all frozen byte-for-byte as `bash scripts/collie-ctl.sh <ve

### [2026-06-28] thanhdat77/herdr-navigator
- **Overview**: Herdr Navigator (`id = herdr-navigator`, `v0.3.6`, `min_herdr_version 0.7.3`) is a single-binary, Rust/ratatui fuzzy picker that runs inside a Herdr-managed pane. It indexes live Herdr state together with not-yet-open destinations — workspaces, agents, Herdr Plus projects, sessions, remote targets, zoxide history, filesystem roots, Quick Actions, and generic command/JSON integrations — and dispatches an action-aware `Enter`: focus, create, attach, handoff, invoke, or run.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 3 `[[actions]]` in `workspace,global` contexts, all via `./target/release/herdr-navigator`: `open`, `open-side`, `jump-back`. * 2 `[[panes]]`: `pic

### [2026-07-01] maayanyosef/herdr-aws-ssm
- **Overview**: `herdr-aws-ssm` is a pure-Bash transport plugin that lets `herdr --remote` reach EC2 instances with no bastion, public IP, or long-lived SSH keys. It lists running instances across configured AWS profiles, lets the user pick one via `fzf`/numbered menu, auto-detects the SSH login user from the AMI, and tunnels SSH over Session Manager (`AWS-StartSSHSession`) using a short-lived EC2 Instance Connect key push per connection.
- **Key Features**: Declared surface in `herdr-plugin.toml` (`id = herdr-aws-ssm`, `min_herdr_version 0.7.0`, `platforms = linux, macos`): three `workspace`-context `[[actions]]`, no `[[startup]]`, `[[events]]`, `[[panes

### [2026-07-02] amurru/herdr-whistle
- **Overview**: `amurru/herdr-whistle` (`id = herdr-whistle`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux, macos`) is a single-binary Go Herdr plugin that exposes Herdr coding agents to a Telegram bot for remote monitoring and control. The owner can list agents, inspect status/output, send text to unblock a waiting agent, answer interactive selection prompts via inline buttons, close panes, and start new agents — all from a phone. It uses Telegram long-polling (`getUpdates`) and drives Herdr exclusively through the `herdr` CLI via `os/exec`; there is no webhook server, dashboard, TUI, or external supervisor.
- **Key Features**: **Telegram commands (all gated on `owner_id`):**  * `/start`, `/help` — welcome + canonical `commandHelp` string shared by both handlers. * `/agents` — `herdr agent list` rendered as HTML with per-age

### [2026-07-03] 0cv/herdr-mobile-relay
- **Overview**: `herdr-mobile-relay.events` (`v0.20.8`, `min_herdr_version 0.7.5`, `macos,linux` only) is remote mobile control for Herdr coding agents. It runs a local Go relay on the developer machine (`127.0.0.1:8375` by default) that canonicalizes Herdr pane/agent/workspace state and exposes it to a smartphone installable web app (PWA) for monitoring, approving blocked prompts, sending input, and receiving push notifications.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * 9 `[[actions]]` → all via `bash relay/open-plugin-pane.sh <entrypoint>`: `setup`, `quick-start`, `install-service`, `setup-link`, `change-hostname`

### [2026-07-04] nikok6/herdr-mirror
- **Overview**: `herdr-mirror` (`id=mirror`, `v0.4.3`, `min_herdr_version 0.7.2`, `macos,linux`) mirrors one or more **remote `herdr` servers into the local sidebar** as live workspaces named `<prefix>: <name>`.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 1 `[[build]]`: `bash scripts/install.sh` — fetches prebuilt `target/release/herdr-mirror` from GitHub Releases, SHA256-verified. * 1 `[[panes]]` `p

