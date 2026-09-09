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

### [2026-07-10] moneycaringcoder/herdr-tether
- **Overview**: Tether for Herdr (`id = moneycaringcoder.tether`, `v0.8.0`, `min_herdr_version 0.8.0`, `linux,macos` only) is a durable-workload manager, not a remote-view or mobile bot.
- **Key Features**: **Core lifecycle — “closing the view leaves it running; Stop ends it; Enter brings it back”:**  * `prefix+t` picker workflow: choose `local` or configured SSH host → open running, restart ended, attac

### [2026-07-10] ditwrd/herdr-remote-worktrunk
- **Overview**: `ditwrd/herdr-remote-worktrunk` (`remote-worktrunk`, `v0.1.0`) is a pure-Bash Herdr plugin that pulls remote Git state — GitHub issues, `origin` branches, and open PRs — into Herdr workspaces via `worktrunk` (`wt`) worktrees.
- **Key Features**: Declared surface in `herdr-plugin.toml` is minimal — 2 workspace-context actions, 2 overlay panes, no daemon, events, or HTTP endpoints:  * `Remote Worktrunk: pull branch/PR/issue` (`open`) → opens `p

### [2026-07-10] lsisoft/herdr-telegram-slack-bridge
- **Overview**: `herdr-telegram-slack-bridge` (`v0.2.3`, `min_herdr_version 0.7.0`, `linux,macos`) is a bidirectional notification and reply transport for Herdr, Codex, and Claude agent sessions. It does not own workspaces, tabs, panes, or agent lifecycle — `lsisoft/herdr` does.
- **Key Features**: **Herdr-declared surface — one hook only in `herdr-plugin.toml`:**  * `[[events]] on = pane.agent_status_changed` → `["python3", "-m", "agent_telegram_bridge", "herdr-event"]` * No `[[startup]]`, `[[a

### [2026-07-11] tigorlazuardi/herdr-web-tui
- **Overview**: `herdr-web-tui` (`tigorlazuardi.herdr-web-tui`, `0.5.3`, `min_herdr_version 0.7.4`, `linux` only) is browser-based remote access for a running Herdr session, in the **Remote Access & Mobile Control** family alongside Telegram relays, `collie`, and `herdr-remote`.
- **Key Features**: **What the consumer gets:**  * **Live terminal in browser:** Full Herdr TUI rendering via xterm.js (`@xterm/xterm` + `addon-fit` + `addon-webgl`) over `/ws`. Binary frame protocol shared by `internal/

### [2026-07-13] mvallebr/herdr-telegram-plugin
- **Overview**: `herdr-telegram-plugin` (`id = herdr-telegram-plugin`, `Herdr Telegram Bridge`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux` only) is a **zero-LLM Telegram bridge for Herdr coding agents**.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]]`: `npm ci` + `npm run build` (TypeScript → `dist/`, Node `>=22.5.0`). * `[[actions]]`: `bootstrap` → `node dist/index.js --daemon`; `sta

### [2026-07-15] OiAnthony/herdr-plugin-telegram-notify
- **Overview**: `OiAnthony/herdr-plugin-telegram-notify` (`oipsanthony.telegram-notify`, `0.1.0`) is a standalone, one-way notifier for Herdr coding agents. On every `pane.agent_status_changed` event it checks whether the agent transitioned to `done` or `blocked`, enriches the event with pane metadata and the last semantic assistant answer, and POSTs a short plain-text message to Telegram via `sendMessage`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[events]] on = pane.agent_status_changed` → `["node", "notify.mjs"]` * `[[actions]] id = toggle` → `["node", "toggle.mjs"]` (no args = invert cur

### [2026-07-16] LuYanFCP/herdr-wechat-plugin
- **Overview**: `herdr.wechat` (`Herdr WeChat Remote`, `v0.1.1`, `min_herdr_version 0.7.0`, `macos,linux` only) is a native Rust plugin for **Remote Access & Mobile Control** that lets a single linked WeChat account monitor and drive Herdr coding agents from a phone. Interaction is explicitly modeled on `dcolinmorgan/herdr-remote`, while QR-login and the iLink HTTP JSON protocol are ported from Tencent's `openclaw-weixin` (credited in `NOTICE`). The plugin connects outbound from the dev machine to `https://ilinkai.weixin.qq.com`; no `herdr`, SSH, or WebSocket port is exposed publicly.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * 7 `[[actions]]`, all via `sh run.sh <verb>`: `init` (create default `config.toml`), `start` / `stop` / `status`, `doctor` (config + `herdr` connect

### [2026-07-17] Tomyail/herdr-connect
- **Overview**: `Herdr Connect` is a **LAN-first mobile companion for Herdr coding agents**, in the Remote Access & Mobile Control family. Unlike Telegram-bot or web-dashboard peers in the ledger (`herdr-remote`, `herdr-whistle`, `collie`), it has no cloud relay, accounts, or bots: a Go daemon runs on the developer machine, shells out to the `herdr` CLI, and serves state to a native iOS app (Expo/React-Native, TestFlight beta) over direct HTTPS on the local network or Tailscale.
- **Key Features**: **What the user gets:**  * **Agent oversight:** list all agents with `display_name`, `workspace_label`/`tab_label`, `agent_name`, `revision`, `interaction_state` (`working|blocked|ready_input|unknown`

### [2026-07-17] osuki-dev/muqun-gateway
- **Overview**: Muqun Gateway is a token-protected mobile gateway that lets the Muqun phone app reach terminal workspaces on the developer's own machine, with no vendor account or cloud server in between. It runs as a standalone Rust binary/daemon on macOS/Linux, drives **both Herdr and tmux backends concurrently** behind a backend-neutral port, and exposes them over a Herdr-shaped HTTP/SSE contract designed for Tailscale use. The Herdr plugin shim itself is tiny — four actions + two panes that shell out to `./target/release/muqun-gateway` — the bulk is the gateway application.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]]`: `sh scripts/fetch-binary.sh` * 4x `[[actions]]` in `workspace` context, all via `./target/release/muqun-gateway`: `setup --backend her

### [2026-07-18] maedana/herdr-agents-bridge
- **Overview**: `Agents Bridge` (`id = maedana.agents-bridge`, `v0.1.0`, `min_herdr_version 0.7.5`, `linux,macos`) is a **Remote Access & Mobile Control** plugin in the same family as `collie`, `herdr-mobile-relay`, `herdr-connect`, and `muqun-gateway`, but with a deliberately minimal footprint: a single Rust binary that runs a local mobile-friendly web server for Herdr coding agents.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** no `[[startup]]` or `[[events]]`.  * `[[build]]`: `cargo build --release` * 3x `[[panes]]` (`placement=popup`, `50%x60%`, all `sh -c ${HERDR_PLUGIN_RO

### [2026-07-23] cokekitten/herdr-telegram-bridge
- **Overview**: `telegram.bridge` (`v0.3.0`, `min_herdr_version 0.7.0`, `macos,linux`) is a bidirectional Telegram bridge for Herdr coding agents. The event hook pushes a rendered notification when an agent hits `done`/`blocked` — including that agent's last reply scraped from its own transcript storage — and a long-polling daemon routes Telegram replies, plain messages, `/commands`, and file attachments back into the originating pane via the `herdr` CLI.
- **Key Features**: **Notifications ( `notify.py` as `pane.agent_status_changed` hook):** * One-line header `emoji agent · folder · title` + agent's final reply. Header kept short for phone notification previews. * Trans

### [2026-07-24] matheus3301/herdr-phone
- **Overview**: **Herdr Phone** (`id = matheus3301.phone`, `v0.4.0`, `min_herdr_version 0.7.5`, `macos` only) lets one authenticated operator supervise the Herdr session running on their Mac from a phone. It is a loopback-only Go relay with a React/TypeScript PWA embedded into a single static binary, exposed to the internet outbound-only via a supervised `cloudflared` tunnel — named tunnel + Cloudflare Access for real use, opt-in Quick Tunnel for testing.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** one `[[build]]` (`sh scripts/build.sh`) and 7 `global`-context `[[actions]]`, no `[[startup]]`, `[[events]]`, `[[panes]]`, no default keybinding:  * `

