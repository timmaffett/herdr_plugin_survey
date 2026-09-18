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

### [2026-07-25] iYassr/shahi
- **Overview**: **Shahi (`id = shahi`, `v0.2.0`, `min_herdr_version 0.8.2`, `linux, macos`)** is a **Remote Access & Mobile Control** plugin with the tagline *"See and answer your terminal agents from your phone."*
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]] x2`: `sh plugin/bun.sh install --frozen-lockfile` + `sh plugin/bun.sh run build:web` — vendors deps and bakes the archived web client so

### [2026-07-27] LoneExile/merino
- **Overview**: Merino (`id = herdr.merino`, `v0.4.2`, `min_herdr_version 0.8.2`, `macos,linux`) is a **remote tunnel dashboard for Herdr coding agents**, not a conventional in-process Herdr shim. It is a menu-bar + phone companion: live agent list with blocked-first ordering, streaming pane output in colour, and remote answer / type / interrupt from a browser or PWA over LAN, Tailscale, or tunnel.
- **Key Features**: **Herd visibility:** - Whole-herd projection sorted most-urgent-first via `AgentsService.List()`, `Counts()`, `Connection()`. Tray label shows `N!` when blocked, `N` when working, empty when idle, `no

### [2026-07-29] kosuketut/herdr-remotedownloder
- **Overview**: `kosuketut/herdr-remotedownloder` (`id = kosukeyano.remote-download`, `v0.5.0`, `min_herdr_version 0.7.0`, `platforms = linux, macos`) is a bidirectional file-transfer plugin for `herdr --remote` sessions.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]]`: `cargo build --release --locked` — builds two Rust binaries. * `[[actions]] id=pick`, `contexts=[pane]`: `herdr plugin pane open --plu

### [2026-07-30] go-min/herdr-fwd
- **Overview**: `herdr.fwd` (`Herdr Fwd`, `v0.1.5`, `min_herdr_version 0.8.0`, `linux,macos` only) is automatic loopback port-forwarding for `herdr --remote` sessions. It discovers `localhost` dev servers listening inside remote Herdr panes and asks the local side to open matching `ssh -L 127.0.0.1:*` forwards so they are browsable locally.
- **Key Features**: **Local `hfwd` session wrapper (`src/bin/local/cli.rs`):** * `hfwd <target> [--open] [--verbose] [--no-auto-detect] [--local-bind 127.0.0.1] -- [herdr arguments]` — starts SSH `ControlMaster`, probes 

### [2026-07-30] timofey-TK/herdr-open-in-editor
- **Overview**: `timofey-TK/herdr-open-in-editor` (`timofey-tk.open-in-editor`, `0.1.0`, `min_herdr_version 0.7.0`) is a minimal local-opener plugin for Herdr workspaces. Its single purpose is to open the active workspace checkout in VS Code or Zed, working both when Herdr runs locally and when Herdr runs on a remote host via `herdr --remote`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml` only, no `[[startup]]`, `[[events]]`, `[[panes]]`, `[[build]]`):**  * `open` — `Open in editor` — `workspace` context — `python3 open_in_editor.py request

### [2026-08-02] benkraus/herdr-plugin-mobile-relay
- **Overview**: `benkraus/herdr-plugin-mobile-relay` — packaged as `herdr.control` / `Herdr Control` `v0.1.0`, `min_herdr_version 0.7.0`, `linux,macos` only — is a host-side companion relay for remote operation of Herdr coding agents.
- **Key Features**: **Operator surface:**  * Responsive browser control plane served from `web/dist` by the bridge itself, plus a separate native-client API for `Herdr Mobile`. * Live herd snapshot, multi-session navigat

### [2026-08-05] eliasstravik/herdr-call
- **Overview**: `herdr-call` (`id = herdr-call`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos,linux` only) is **voice-first Remote Access & Mobile Control** for Herdr. Unlike Telegram-bot, TUI, or dashboard peers in this ledger, it puts the operator on a live private call with an ElevenLabs conversational agent that can observe, narrate, steer, and reshape Herdr workspaces/tabs/panes/agents hands-free from any Tailnet device.
- **Key Features**: **User-facing flow (per `README.md`, `docs/getting-started.md`, `src/server/main.ts`):**  1. `herdr plugin install eliasstravik/herdr-call && herdr plugin action invoke start --plugin herdr-call` buil

### [2026-08-06] scott-the-programmer/vscode-devcontainers-herdr
- **Overview**: This plugin — `id = devcontainer-status`, `v0.6.0`, `min_herdr_version 0.8.0` — makes VS Code devcontainers visible to Herdr and lets an agent running *inside* a container show up as a normal tracked Herdr agent. It is a single Rust host binary (`bin/herdr-devcontainer-status`, ~3.9k LOC) with three jobs: report per-pane devcontainer state (`running`/`stopped`/`none`/`error`) as a sidebar token, run commands inside the container as the calling pane's agent via `exec`, and maintain the socket plumbing (`bridge`/`relay`) that lets container-side hooks talk back to Herdr's control socket on the host.
- **Key Features**: **Status detection (`refresh` / `hook [--all]`):** Prints `{"status": "...", "project_root": "...", "container": "..."}` as JSON to stdout and best-effort publishes it as display metadata. Detection w

### [2026-08-06] hkdom/herdr-telegram-gate
- **Overview**: `hkdom/herdr-telegram-gate` (`id = telegram-gate`, `v0.1.0`, `min_herdr_version 0.7.0`, `macos,linux`) is a **Telegram approval inbox + risk-tiered auto-approval gate** for a local Herdr agent fleet.
- **Key Features**: **What the operator gets:**  * **Approval inbox:** On `blocked`, a Telegram card with `✅ Approve / ❌ Deny` inline buttons (`callback_data: app:<id> / den:<id>`). Approve sends `Enter` via `herdr agent

### [2026-08-06] black-atom-industries/helm.herdr
- **Overview**: Helm for Herdr is a single-binary Rust fuzzy navigator for Herdr. It runs its own `ratatui` picker inside a Herdr-managed pane and lets the operator type what they remember to **focus, create, attach, hand off, invoke, or run** — without remembering which Herdr surface owns the destination.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * 3 `[[actions]]` in `workspace,global` contexts, all via `./target/release/helm-herdr`: `open`, `open-side`, `jump-back`. * 2 `[[panes]]`: `picker` 

### [2026-08-07] powerfooI/herdr-studio
- **Overview**: Herdr Studio is a **browser + PWA client for a running Herdr server** — workspaces, tabs, panes, live terminals, agent status, session inspection, file explorer, diffs, and review annotations. It is the largest plugin in the Remote Access & Mobile Control ledger (~103k LOC TypeScript): a React/Vite frontend served by a local Bun bridge that translates same-origin HTTP/WebSocket into Herdr's Unix-socket / named-pipe protocols.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`) — deliberately thin:**  * `[[build]]`: `bun scripts/studio-plugin.ts build` — downloads checksum-verified prebuilt `herdr-gui` matching checkout version.

### [2026-08-09] miko-misa/herdr-portfwd
- **Overview**: `herdr-portfwd` (`id = portfwd`, `v0.2.1`, `min_herdr_version 0.8.0`, `macos,linux` only) forwards dev-server ports listening on remote Herdr hosts to `localhost` on the machine the user sits at, without leaving Herdr.
- **Key Features**: **Declared Herdr surface in `herdr-plugin.toml`:**  * `[[build]]`: `bash scripts/install.sh` — fetch prebuilt `target/release/herdr-portfwd` from GitHub Releases, SHA256-verified. No cargo fallback; `

### [2026-08-09] bsorescu/herdr-mobile
- **Overview**: `herdr-mobile` (`id = herdr-mobile`, `v0.1.0`, `min_herdr_version 0.7.3`) is a **phone-first TUI for triaging and driving Herdr coding agents over SSH**. The operator SSHes from a phone client like Termius into the machine running Herdr and runs `herdr-mobile` to get a portrait-narrow list of live agents, live ANSI output per agent, a prompt box, and a tappable key-row for answering `blocked` approval dialogs — without opening the full Herdr TUI and without a physical keyboard.
- **Key Features**: **Triage list (`AgentListScreen`):** - `DataTable` with columns `st | agent | project | pane`, where `st` is `STATUS_ICONS` (`🔴 blocked`, `🟢 done`, `🔵 working`, `⚪ idle`, `⚫ unknown`), `agent` is `

### [2026-08-13] egemenyildiz/herdr-slack
- **Overview**: `herdr-slack` (`id = herdr-slack`, `v0.1.0` in `herdr-plugin.toml` / `1.1.0` in `package.json`, `min_herdr_version 0.8.0`, `linux,macos`) is a Slack control plane for a local Herdr instance. A long-lived Node ≥22 daemon holds one outbound Slack Socket Mode WebSocket and one Herdr Unix-socket `events.subscribe` tail; from a phone or Slack client the user browses agents, answers blocked prompts, sends follow-ups, and launches new agents.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]] x2`: `npm ci --omit=dev` + `npm run build` — `typescript` + `@types/node` are kept as runtime deps so a clean clone builds. * `[[startup

### [2026-08-14] Northern-Lighthouse/herdr-fleet
- **Overview**: `herdr-fleet` (`id = dev.northernlighthouse.fleet`, `v0.3.0`, `min_herdr_version 0.8.0`, `macos,linux` only) is a **cockpit/worker fleet manager for Herdr over Tailscale**, not a phone bot or browser mirror like most peers in the **Remote Access & Mobile Control** ledger.
- **Key Features**: Declared Herdr surface is minimal — one action + one pane in `herdr-plugin.toml`:  * `open-dashboard` (`global`): `./bin/fleet plugin-open` * `dashboard` pane (`popup`, `85%x80%`): `./bin/fleet dashbo

### [2026-08-15] alex-devdone/herdr-cursor-open
- **Overview**: This is a **display-side opener**, not a mobile / Telegram remote-control plugin like most peers in the Remote Access & Mobile Control ledger. Its sole job is: *open the focused Herdr pane's working directory in Cursor / VS Code / Windsurf / JetBrains on the Mac that owns the display*.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`) is minimal — 1 action + 1 startup, no events / panes / build / link_handlers:**  * `actions.id = open` — `cursor: open focused pane`, `contexts = ["pane"

### [2026-08-15] chano-gpt/setnet
- **Overview**: `setnet` is a **mobile-first web UI for herding Herdr coding agents from a phone, served over Tailscale**. It is in the Remote Access & Mobile Control family alongside `herdr-remote`, `collie`, `herdr-mobile-relay`, `herdr-connect`, and Telegram bridges, but architecturally distinct: no bot, no in-TUI pane, no cloud relay.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** one `[[build]]` + eight `workspace`-context `[[actions]]`, nothing else. No `[[startup]]`, `[[events]]`, `[[panes]]`, `link_handlers`.  - `build`: `ba

### [2026-08-18] zlxlabs/herdweb
- **Overview**: `zlxlabs.herdweb` (`herdweb` `1.20.0`, `min_herdr_version 0.8.2`, `linux,macos`) is a **mobile-first Web UI for driving Herdr coding-agent servers from a phone**. Tagline in manifest: *“Monitor and drive your coding agents from your phone — built for thumbs, not a shrunken terminal.”*
- **Key Features**: **What the user gets:**  * **Phone terminal for Herdr:** full Herdr TUI in browser via xterm.js (`@xterm/xterm` + `addon-fit`, `addon-web-links`, `addon-unicode11`, `@xterm/headless` mirror in spikes)

### [2026-08-20] barnuri/herdr-web
- **Overview**: `barnuri.herdr-web` (`Herdr Web`, `v0.1.1`, `min_herdr_version 0.7.0`, `linux,macos` only) is a **mobile-first web UI for Herdr** in the Remote Access & Mobile Control family. Unlike Telegram/Slack-bot peers, it does not re-implement agent control: each browser tab gets its own server-side PTY running the real `herdr` TUI, streamed to xterm.js over WebSocket, so tabs, panes, sidebar, prefix-keys and mouse work identically to a local terminal.
- **Key Features**: **User-visible:**  * **Full TUI in browser:** `node-pty` spawn of `herdr` per WebSocket client, resize-aware, `xterm-256color` + `truecolor`. Client is React + `@xterm/xterm` + `@xterm/addon-fit`, bui

### [2026-08-20] radres/herdr-plugin-call-me
- **Overview**: `/call-me` (`id = radres.call-me`, `v0.1.0`) is a **voice-first remote-access plugin** for Herdr: when Herdr classifies a pane as `blocked` (or `done`), it rings the operator's real phone, speaks the on-screen question, transcribes the spoken reply, and types that reply back into the originating pane. Unlike Telegram/Slack-bot, TUI, or browser-mirror peers in the Remote Access & Mobile Control ledger, there is no bot to poll, no tunnel/VPN, and no dashboard — the loop is `blocked → phone call → keystroke`, backed by the hosted `https://serdaroztetik.com/aiphone` service and an iPhone companion app.
- **Key Features**: **Event hook — the whole product:** * `[[events]] on = pane.agent_status_changed → ["node", "on-status.mjs"]`. Only `blocked` and `done` are acted on; `working`/`idle` are ignored. `onBlocked` default

### [2026-08-22] Poor-Plebs/herdr-remote-panes
- **Overview**: `herdr-remote-panes` (`id = poorplebs.remote-panes`, `v0.4.31`, `min_herdr_version 0.8.0`, `linux,macos`) lets one local Herdr session work on other machines over SSH.
- **Key Features**: **Declared Herdr surface in `herdr-plugin.toml`:**  * `[[build]]`: `sh build.sh` — builds `bin/herdr-remote-panes` from source. * `[[startup]]`: `./bin/herdr-remote-panes daemon` — reconciler for life

### [2026-08-23] alex-devdone/herdr-hub
- **Overview**: This is a **session-portability utility, not a remote-control plane**. A "hub" session in this author's vocabulary is an aggregation view: mostly bridge panes running `herdrl --remote <HOST> --session <S>` that mirror Herdrs living on other machines (laptop, mini, VPS, cloud workstation), plus a few ordinary local panes.
- **Key Features**: Declared Herdr surface in `herdr-plugin.toml` is minimal: 3 `workspace`-context actions, no `[[startup]]`, `[[events]]`, `[[panes]]`, `[[build]]`, or `link_handlers`:  * `hub: save this session to the

### [2026-08-23] barnuri/herdr-telegram-notifications
- **Overview**: `barnuri.telegram-notifications` (`v0.1.0`, `min_herdr_version 0.7.0`, `linux,macos`) is a **poll-only, one-way notifier with an opt-in two-way relay** for Herdr coding agents. A persistent Node.js watcher (`bin/watch.js` via `[[startup]]`) polls `herdr agent list`, diffs `agent_status` per `pane_id`, and sends Telegram `sendMessage` notifications for `idle / blocked / done` transitions. With `relay.enabled: true` it additionally captures blocked-pane output and lets the configured `chatId` answer approval menus from a phone via inline buttons or replies — still via Telegram `getUpdates` long-poll, with no webhook, tunnel, or Herdr event subscription.
- **Key Features**: **Notify path (`lib/notifier.js` + `lib/state-watcher.js` + `lib/telegram.js`):**  * Watches three transitions only: `working → idle`, `* → blocked`, `* → done`. All other transitions (`idle → working

### [2026-08-24] caner-akca/herdr-plugin-atomic-workflows
- **Overview**: `atomic.workflows` (`Atomic Workflows`, `v0.9.3`, `min_herdr_version 0.8.2`, `linux,macos` only) is a campaign cockpit for running **Atomic** workflows under **Herdr**. It ranks a GitHub issue queue, launches one isolated Atomic project + Herdr tab per selected issue/PR (capped at 5), then continuously reconciles each task-private `.atomic/workflows/status.json` into sidebar tokens, a popup board, a durable cost/history ledger, and an optional Telegram cockpit.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * `[[startup]] x2`: `node bin/start-watcher.mjs`, `node bin/start-telegram.mjs`. * `[[actions]] x5` (all `contexts=["workspace"]`): `open-board`, `st

### [2026-08-25] elkraps/herdr-telegram-notify
- **Overview**: `elkraps.herdr-telegram-notify` (`id = elkraps.herdr-telegram-notify`, `min_herdr_version 0.7.5`, `linux,macos,windows`) is a dependency-free Node.js 18+ notifier for Herdr coding agents. On every `pane.agent_status_changed` event it sends a templated plain-text Telegram `sendMessage` to one or more chats, with opt-in enrichment: the blocking question for `blocked` panes and the final answer for `done` panes.
- **Key Features**: **Declared Herdr surface in `herdr-plugin.toml`:**  * `[[startup]]`: `["node", "actions/watch.mjs"]` — auto-start callback watcher. * `[[events]] on = pane.agent_status_changed`: `["node", "src/notify

### [2026-08-28] nengqi/herdr-session-sync
- **Overview**: `session-sync` is a zero-dependency Python Herdr plugin whose sole job is **pane-title hygiene**. When Herdr fires lifecycle events, it resolves a human-meaningful task name for each pane — preferring Claude Code's authoritative `custom-title.json` / transcript `customTitle`, then first-turn intent, then PTY / CWD fallback — and writes that name back to Herdr via `pane.rename` and `pane.report_metadata`.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`, `min_herdr_version 0.7.5`, `linux,macos` only):**  * 3x `[[actions]]`, all `python3 src/sync.py`:   * `sync-all` (`global,workspace,tab,pane`): `--all` —

### [2026-08-28] DecampsRenan/herdr-plugin-env-sync
- **Overview**: **Env Sync** (`id = decampsrenan.env-sync`, `v0.11.0`, `min_herdr_version 0.8.2`, `linux, macos`) is worktree-lifecycle automation, not remote access. Despite being filed under **Remote Access & Mobile Control**, it has no relay, bot, tunnel, dashboard, or phone client.
- **Key Features**: Declared surface in `herdr-plugin.toml` is two event hooks only, no actions, startup, panes, or build:  * `[[events]] on = worktree.created -> ["bash", "sync-env.sh"]` — full pipeline. * `[[events]] o

### [2026-08-29] teasec4/herdr-mobile-app
- **Overview**: Herdr Mobile (`id = herdrelay.events`, `v0.5.0`, `min_herdr_version 0.8.0`) is **remote access and mobile control for Herdr coding agents from a phone**. It installs a standalone Go relay on the developer machine that tails Herdr state over the Unix socket and exposes it to a Flutter mobile app (Android APK today, iOS roadmap) over WebSocket with HTTP/SSE fallback.
- **Key Features**: **What the phone user gets (per `README.md`, `INSTALL.md`, `CHANGELOG.md`):**  * Home list of agents/panes with `idle|working|blocked|done` status, sorted blocked-first; tap to open. * Live terminal v

### [2026-09-01] huketo/herdr-hitl
- **Overview**: `herdr-hitl` (`id = huketo.hitl`, `v0.2.0`, `min_herdr_version 0.8.0`) is a **human-in-the-loop blocking primitive** for coding agents, not a dashboard, relay, or fleet viewer like most peers in **Remote Access & Mobile Control**.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml` only):**  * `[[build]]`: `go build -trimpath -ldflags "-s -w" -o bin/herdr-hitl ./cmd/herdr-hitl` * `[[startup]]`: `bin/herdr-hitl daemon start` — spawn d

### [2026-09-02] permgps/herdr-telegram-agents
- **Overview**: `permgps.telegram-agents` (`Telegram Agents`, `v0.10.0`, `min_herdr_version 0.7.5`) mirrors the Herdr **Agents panel into a Telegram forum supergroup**: one forum topic per live Herdr agent, status in the topic icon, questions and tails posted into the topic, and replies typed back into the agent.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]] x2`: `sh scripts/install.sh` (linux/macos) + `powershell scripts/install.ps1` (windows). Downloads `herdr-tg_<os>_<arch>` for `v<version

### [2026-09-02] fulanto/herdr-oncall
- **Overview**: `fulanto/herdr-oncall` (`com.codreamer.herdr.oncall`, `v0.3.2`, `min_herdr_version 0.7.0`) is a **host-side Telegram control plane** for Herdr coding agents, not a dashboard, TUI, or phone app.
- **Key Features**: **Outbound notify (`src/hooks/notify.mjs`):**  * Filters to `NOTIFY_ON=blocked,done` by default; `working`/`idle` ignored via `gate.mjs:shouldNotify`. * `blocked`: waits `BLOCKED_DELAY_SEC` (default 6

### [2026-09-02] T0mSIlver/hither
- **Overview**: `hither` (`id = hither`, `v0.1.0`, `min_herdr_version 0.8.0`) is a display-side opener, not a remote-control plane. Press `prefix+i` in a Herdr pane on a remote Linux box and Zed opens on the attached Mac as an SSH project rooted at that pane's directory — for a Claude Code session that entered a worktree, the worktree.
- **Key Features**: **What the user gets:**  * `prefix+i` (configurable via `HITHER_KEY`, default `prefix+i`) in any pane → Zed opens `zed://ssh/<host><path>` on the Mac, with Herdr toast feedback (path on success, reaso

### [2026-09-04] martebytes/herdr-mobile
- **Overview**: `herdr-mobile` (`id = herdr-mobile`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux, macos`) is a **mobile-first web UI for driving Herdr coding agents from a phone**. It runs as a standalone Python web server on the developer machine, tails Herdr over the local socket API, and exposes session list, live terminal, and chat views to a browser / installable PWA.
- **Key Features**: What a phone user gets, per `README.md` and `server.py` routing:  * **Session list grouped by workspace:** `GET /api/panes` returns a canonicalized projection built in `_pane_list()` — `pane_id`, `ter

### [2026-09-06] dibin666/herdr-remote
- **Overview**: `herdr-remote` is a **browser-access remote terminal for Herdr workspaces**, in the Remote Access & Mobile Control family. It lets a phone or second browser drive the full `herdr` TUI from anywhere via WebSocket, with touch controls, low-latency ANSI streaming, and single-use 6-character pairing.
- **Key Features**: **Workstation CLI — `packages/cli/bin/herdr-remote.js`:**  * Bare invocation: opens Ink TUI if `stdin/stdout.isTTY`, otherwise prints `lifecycle.fullStatus()` as JSON — the path Herdr panes/actions us

### [2026-09-07] naturalmoods/herdr-telegram-notify
- **Overview**: `herdr-telegram-notify` is a one-way Telegram notifier for Herdr-managed coding agents with an opt-in reply path. On every `pane.agent_status_changed` event it records the transition, filters to `done`/`blocked` by default, and sends a richly-enriched HTML message — session title, turn prompt, workspace/branch/cwd, git dirtiness, duration, token/cost, herd summary, and the agent's last message or blocked screen tail — then optionally routes a Telegram reply back into the originating pane.
- **Key Features**: **Event hook — notify:** - Fires on `pane.agent_status_changed`. Records *every* status (`working` starts a clock, any other status stops it) for duration measurement, but only sends for `NOTIFY_STATU

### [2026-07-18] ZingerLittleBee/Heeler
- **Overview**: Heeler is an **SSH-native remote-access companion for Herdr**, not a Telegram bot or hosted dashboard. The surveyed repo contains a small Node.js Herdr plugin (`id = heeler`, `v0.4.0`, `min_herdr_version 0.7.5`, `linux,macos` only) plus a native iOS app (~237k LOC, Swift primary) and a stateless push relay.
- **Key Features**: **Pairing ceremony (ADR 0007):** * `Pair a mobile device` global action (`src/pair-action.js`) that shells to `herdr plugin pane open --plugin heeler --entrypoint pair`. * Fullscreen `pair` popup (`sr

### [2026-08-23] barnuri/herdr-notifications
- **Overview**: `barnuri/herdr-notifications` (`id = barnuri.notifications`, `v0.2.0`, `min_herdr_version 0.7.0`, `linux,macos`) is a **poll-only, multi-provider notifier with an opt-in two-way relay** for Herdr coding agents.
- **Key Features**: **Notification types** (`lib/notification-event.js`, `lib/state-watcher.js`): - `idle` — only `working → idle`, rendered `🟡 is idle (finished working)`. - `blocked` — any transition into `blocked`, r

### [2026-08-28] arronKler/pairfob
- **Overview**: `arronKler/pairfob` (`id = pairfob`, `v0.1.0`, `min_herdr_version 0.8.2`, `linux,macos` only) is a **Remote Access & Mobile Control** plugin in the same family as `Heeler`, `herdr-mobile-relay`, `herdr-connect`, and `collie`, but architecturally the most complete: a full end-to-end-encrypted phone surface for live Herdr sessions.
- **Key Features**: **What the Herdr user sees:** - `Pairfob: Pair a device` — installs verified binary if missing, ensures user service is live, then `exec pairfob pair` in an `overlay` pane for QR + SAS/code approval. 

### [2026-08-30] frizynn/nenu
- **Overview**: Nenu — manifest `id = herdr.collie`, `name = Nenu` — is a mobile-first agent workbench for Herdr coding agents, served over Tailscale. Unlike Telegram-bot or SSH-TUI peers in this ledger, it is a full phone PWA + local bridge: a Bun server tails Herdr state over the local socket and exposes snapshot, terminal mirror, conversation history, model/skill menus, and push to a Vite/React client reachable at `https://<tailnet-name>`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):** no `[[startup]]`, `[[events]]`, `[[panes]]`, `link_handlers`. One `[[build]]` (`bash scripts/collie-ctl.sh build`) + 11 actions:  * `start / stop / re

### [2026-09-05] fuad-daoud/relay
- **Overview**: `relay` (`id = fuad-daoud.relay`, `v0.1.0`, `min_herdr_version 0.8.2`) is a **planner/builder handoff automator for Herdr agent panes**, not a remote-access dashboard, bot, or tunnel despite its filing under Remote Access & Mobile Control.
- **Key Features**: **Herdr-declared surface is deliberately thin — no `[[events]]` or `link_handlers`:**  * `[[build]] x2`: `sh scripts/plugin-fetch.sh` (release variant) or `sh ../scripts/plugin-build.sh` (from-source 

### [2026-09-08] korvyashka/herdr-pr-relay
- **Overview**: `korvyashka/herdr-pr-relay` (`pr-relay`, `0.1.0`, `min_herdr_version 0.9.0`) is a GitHub-to-agent prompt relay, not a remote-access plane. It opens a full-screen Ratatui board of pull requests sourced from configurable GitHub searches, lets the operator multi-select PRs across views, type a one-to-many-line instruction, and injects the composed text plus PR links as a single prompt into a chosen running Herdr agent pane.
- **Key Features**: **PR views:** * Three default `[[views]]` in `config.rs` / `DEFAULT_CONFIG_TOML`: `Needs my review` (`review-requested:@me`), `Mine` (`author:@me`), `Involves me` (`involves:@me`). Any GitHub PR searc

### [2026-09-09] ArtMoreno/shep
- **Overview**: Shep `artmoreno.shep` `0.2.0` (`min_herdr_version 0.9.0`, `windows,macos,linux`) is a **phone companion for Herdr terminals**, in the Remote Access & Mobile Control family alongside `collie`, `herdweb`, `herdr-mobile-relay`, and `Heeler`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml` only):** 6 `workspace`-context `[[actions]]`, no `[[startup]]`, `[[events]]`, `[[panes]]`, `[[build]]`:  * `open-windows/macos/linux` — `Open Shep setup`:

### [2026-09-10] mrzzmrzz/herdr-opendde-harness
- **Overview**: `ddeharness.sidebar` (`v0.2.0`, `min_herdr_version 0.9.0`, `linux` only) is a tiny, server-side display observer for `ddeharness` / `opendde_harness`. It does not run agents, relay to phones, or send notifications. Every ~2s it checks which Herdr panes have `ddeharness` in the foreground, infers `working / blocked / idle / unknown` from terminal title + visible screen text, and publishes that as Herdr's native lifecycle state plus an animated `display_agent` string like `⠋ ddeharness · Input: Design candidates` in the default `agent` row. Because it uses server-reported `display_agent` with a TTL, remote `herdr --remote` clients see the spinner with no client-side install.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`) — 1 startup + 2 actions, nothing else:**  * `[[startup]] ["python3", "sidebar.py", "start"]` — re-establish observer on server start. * `start` (`workspa

### [2026-08-07] powerfooI/roamgate
- **Overview**: `powerfooI/roamgate` (`id = roamgate`, `v0.7.1`, `min_herdr_version 0.7.2`, `linux,macos,windows`) is a **browser + PWA client for a running Herdr server** — workspaces, tabs, panes, live terminals, agent status, session inspection, file explorer, diffs, and review annotations. It is the largest plugin in the Remote Access & Mobile Control ledger at ~127.5k LOC TypeScript.
- **Key Features**: **Herdr-declared surface:** one `[[build]]` (`bun scripts/studio-plugin.ts build`), one `[[panes]]` (`panel`, `popup 72%x12`, `bun scripts/studio-plugin.ts panel`), and six `workspace`-context `[[acti

### [2026-09-12] kaikidd/herdr-bark-notify
- **Overview**: `herdr-bark-notify` is a one-way, event-driven notifier in the **Remote Access & Mobile Control** family. When Herdr reports a coding agent as `done` or `blocked`, it POSTs a bilingual (`zh-CN` default, `en` optional) Bark push to an iPhone — with agent, workspace, and pane identity so multiple Claude Code / Codex sessions stay distinguishable.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml` only):**  * `[[events]] on = pane.agent_status_changed` → `["node", "notify.mjs"]` * 4x `[[actions]]` → `["node", "notify.mjs", ...]`:   * `check` — Valid

### [2026-09-13] jjuraszek/herdr-ntfy-notify
- **Overview**: `jjuraszek/herdr-ntfy-notify` (`ntfy Notify`, `v1.1.0`, `min_herdr_version 0.9.0`, `linux,macos` only) is a one-way, event-driven notifier in the **Remote Access & Mobile Control** family. When a Herdr coding agent transitions to `blocked` or `done`, it `POST`s a short, generic push to an [ntfy](https://ntfy.sh) topic the operator subscribes to on a phone.
- **Key Features**: **Event hook — notify:** * `pane.agent_status_changed` -> `/bin/sh run.sh notify.mjs` (`notify.mjs`). * Parses `HERDR_PLUGIN_EVENT_JSON` + `HERDR_PLUGIN_CONTEXT_JSON`, derives status via `statusFromEv

