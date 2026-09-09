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

### [2026-06-15] devskale/herdr-flist
- **Overview**: `herdr-flist` (`herdr-flist` / `Filelist Row`, v0.4.1) is a single-file Python Herdr pane plugin that renders a live file listing of the currently focused pane's working directory. Locally it follows Herdr-reported `cwd` (OSC 7) with a `process-info` fallback; over SSH — where Herdr drops remote OSC 7 — it infers the remote `cwd` from the focused pane's shell prompt and lists it via non-interactive `ssh`. It docks as a right sidebar via self-resize on startup and is explicitly a passive follower: it does not manage pane lifecycle after creation.
- **Key Features**: **Declared surface:** one pane entrypoint + one action, no event hooks:  * `panes.row` (`Files`, `placement = split`, `command = ["uv","run","filelist.py"]`). * `actions.open` (`Open filelist row`, `c

### [2026-06-19] rmarganti/herdr-pluck
- **Overview**: **Herdr Pluck** (`rmarganti.herdr-pluck`, `0.3.1`, `min_herdr_version 0.7.4`, `linux`/`macos`) is a Rust, `tmux-fingers`-inspired picker for Herdr panes. While a pane is focused the user invokes an action, sees a monochrome copy of the visible viewport with short destructive keyboard hints overlaid on recognizable tokens, types a 1–2 character hint, and the token is copied to the system clipboard or opened in a browser.
- **Key Features**: **Declared surface in `herdr-plugin.toml`:**  * `actions.pluck` — `Pluck visible token`, `contexts=["pane","workspace"]`, `command=["./bin/herdr-pluck","open"]` * `actions.open-url` — `Open visible UR

### [2026-06-19] ramarivera/herdr-pretty-which
- **Overview**: `ramarivera.pretty-which` (`Pretty Which`, v0.1.5) is a read-only, which-key style training overlay for Herdr keybindings. It loads the user's real `config.toml`, merges configured values over a compiled-in table of Herdr defaults, auto-discovers unknown actions via `herdr --default-config`, and renders a searchable Ratatui TUI in a Herdr `overlay` pane.
- **Key Features**: **Viewer modes:** * `LIST` vs `TREE` navigation (`Ctrl+T` toggles, persisted). Tree groups by curated paths like `Panes / Focus`, `Workspaces / Worktrees`, `Tabs / Navigation`, `Agents / Focus`, `Cust

### [2026-06-19] ppggff/herdr-plugin
- **Overview**: `ppggff.input-method-keeper` (`Input Method Keeper`, v0.4.0, `min_herdr_version 0.7.4`, `macos` only) is a per-pane macOS input-source memory for Herdr.
- **Key Features**: **Core behavior:**  * On `pane.focused`: record what source the *previous* pane was left in, look up stored source for the *new* pane, and `select` it if different. New panes without memory use `defau

### [2026-06-19] carsonjones/herdr-plugin-tiles
- **Overview**: **Tiles** (`local.tiles`, `0.1.0`) is a minimal pane-layout utility for Herdr. It tiles the currently focused pane into a preset proportion on either the horizontal (`left | right`) or vertical (`top / bottom`) axis, keeping the current pane as the leading section. Each ratio is offered as a pair with a flip — e.g. `6/10` vs `4/10` — plus an even `50/50` revert.
- **Key Features**: No background service, event hooks, panes, or API endpoints. The entire surface is six stateless `actions` in `herdr-plugin.toml`, all delegating to the same script with different arguments:  * `h-eve

### [2026-06-23] zom-2018/herdr-ntfy-notify
- **Overview**: `zom-2018.herdr-ntfy-notify` (`Herdr ntfy Notification Plugin`, v`0.1.0`, `min_herdr_version 0.7.0`) is a minimal, stateless push-notification bridge for Herdr agents. On every `pane.agent_status_changed` event it filters for terminal states (`done` / `blocked`), formats a short human-readable title + body with workspace/tab/pane location, and POSTs it to an [ntfy](https://ntfy.sh) topic.
- **Key Features**: Declared surface in `herdr-plugin.toml` is exactly one action + one event — no panes, overlays, or background services:  * **Event hook:** `on = "pane.agent_status_changed"` → `["node", "notify.mjs"]`

### [2026-06-23] 0x5c0f/herdr-insight
- **Overview**: **Herdr Insight** (`herdr-insight`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a read-only observability pane for Herdr agents. It renders a live Ratatui TUI that aggregates `herdr pane list` output across all workspaces into one deduplicated entry per agent pane, showing when agents are `working` / `blocked` / `idle` with duration and session tracking.
- **Key Features**: Documented in `README.md` / `README_zh-CN.md` and confirmed in `crates/tui/src/timeline/`:  * **Real-time timeline:** polls every 2s, renders header + scrolling rows + footer (`q quit ↑↓ scroll`). * *

### [2026-06-23] kkckkc/herdr-plugin-gh-workflow
- **Overview**: This is a GitHub-centered workspace automation plugin for Herdr. It provides two user-invoked workspace actions, each rendered as an `overlay` pane: **Start GitHub Issue** automates `issue -> branch -> git worktree -> Herdr workspace + tabs` in one step, and **Branch Info** is a live status dashboard for the current checkout showing branch, linked PR + CI checks, dirty files, and unpushed commits with contextual follow-up actions.
- **Key Features**: Declared surface in `herdr-plugin.toml` is exactly 2x `actions` + 2x `panes`, no hooks:  * `actions.gh-issue-develop` (`Start GitHub Issue`, `contexts=["workspace"]`, `node action-gh-develop.js`) -> o

### [2026-06-23] tiny-send/tinysend-herdr
- **Overview**: **tinysend → herdr** is a bidirectional email bridge for Herdr agents. Outbound, it emails you when an agent in any pane transitions to `blocked`, `done`, or `failed`, including what the agent is asking or just did and where it is running. Inbound, you reply to that email from any Mail client — notably a phone over SSH with no inbound webhook — and the reply is typed back into the originating pane to unblock it or give it its next instruction.
- **Key Features**: **Outbound notify (`notify.mjs`, event hook):**  * Fires on every `pane.agent_status_changed`, filters to `NOTIFY_ON` (default `blocked,done,failed`, lower-cased, comma-split from `.env`). * Presence 

### [2026-06-24] madarco/agentbox-herdr-plugin
- **Overview**: **`madarco/agentbox-herdr-plugin` (`agentbox`, v0.2.0, `min_herdr_version 0.7.0`)** is a thin marketplace adapter for **AgentBox** — an external sandbox manager distributed as `@madarco/agentbox` via npm. It adds three affordances to a Herdr session: a live boxes overlay, workspace shortcuts to list/create boxes, and a `Ctrl+click` handler for `agentbox://` URLs that opens a box web app.
- **Key Features**: Declared surface in `herdr-plugin.toml` is 1x `build` + 1x `panes` + 3x `actions` + 1x `link_handlers`. No event hooks, no API endpoints:  **Pane:** * `panes.boxes` — `AgentBox`, `placement = overlay`

### [2026-06-24] ryonakae/shepherd
- **Overview**: `ryonakae/shepherd` is not a standalone Herdr action script. It is a TypeScript daemon + CLI observability system for coding agents running in Herdr, with the Herdr plugin (`packages/shepherd-herdr-plugin`, id `shepherd.agents`, `Shepherd Agents`, v`0.6.0`) as a thin companion viewer.
- **Key Features**: **Herdr plugin declared surface (`packages/shepherd-herdr-plugin/herdr-plugin.toml`):**  * `actions.agent-list` — `Show Shepherd agents`, `contexts=["workspace"]`, `command=["node","index.mjs","agent-

### [2026-06-25] krystof018/herdr-git-status
- **Overview**: `krystof018/herdr-git-status` — manifest id `gitlab-ci-status`, name `GitLab & GitHub CI + Review Status`, v`0.4.0`, `min_herdr_version 0.7.0`, `linux`/`macos` — is a pure-Bash Herdr plugin (~1286 LOC) that surfaces CI and code-review state inside Herdr. It auto-detects provider from each repo's `origin` host (`*gitlab*` → GitLab via `glab`, `*github*` → GitHub via `gh`) and presents it two ways: an always-live background poller that prefixes each space's sidebar label with a colored dot + open `!MR` / `#PR` number + review glyph, and two on-demand split detail panes.
- **Key Features**: **Two visual surfaces, no event hooks or API endpoints:**  * **Sidebar dots (poller):** every poll cycle rewrites each workspace label to `<emoji> [<badge>!iid|#num] <original>`, e.g. `🟢 ✅!123 my-ser

### [2026-06-26] dot/herdr-terminal-notifier
- **Overview**: `dot.terminal-notifier` (`terminal-notifier notifications`, v`0.1.0`, `min_herdr_version 0.7.0`, `macos` only) is a macOS desktop-notification bridge for Herdr agents. When a pane's agent transitions to a terminal/attention state — `blocked` and `done` by default — it posts a native Notification Center toast via a bundled, rebranded `terminal-notifier` copy (`assets/HerdrNotify.app`) whose bundle id and icon make the toast appear “from herdr” with the herdr logo on the left.
- **Key Features**: Stateless, event-driven notifier with no panes, overlays, or long-lived service:  * **Trigger filtering:** `TRIGGER_STATUSES` (default `"blocked done"`) gates `pane.agent_status_changed`. Non-matching

### [2026-06-26] x0d7x/herdr-fzf-url
- **Overview**: **FZF URL Picker** (`url.fzf-picker`, `0.1.0`) is a minimal, stateless Herdr plugin that scans the visible text of all Herdr terminal panes for URLs and lets the user interactively select one via `fzf`. Explicitly inspired by `tmux-fzf-url`, it is the `fzf`-based counterpart to the hint-overlay approach already surveyed in `rmarganti/herdr-pluck`: instead of overlaying hints in-place, it aggregates candidates and delegates selection to an external fuzzy finder. The entire implementation is a single-file Go binary (~200 LOC in `main.go`) with no daemon, hooks, or persistence.
- **Key Features**: Declared surface in `herdr-plugin.toml` is two entrypoints backed by the same binary:  * `actions.pick-url` — `Pick URL from Panes`, `contexts=["pane"]`, `command=["./herdr-fzf-url"]` * `panes.url-pic

### [2026-06-27] yankewei/herdr-focus-notify
- **Overview**: `herdr-focus-notify` is a macOS-only Rust CLI binary that turns Herdr agent terminal states into **clickable desktop notifications that focus the originating pane**. On `pane.agent_status_changed` for `blocked` or `done` it posts via `alerter`; clicking `Focus` activates the workspace-bound terminal (`open -b <bundle>`) and execs `herdr agent focus <pane_id>`.
- **Key Features**: **Declared surface in `herdr-plugin.toml` (`min_herdr_version 0.7.5`, `platforms=["macos"]`):**  * `[[build]]`: `cargo build --release` * `[[startup]]`: `target/release/herdr-focus-notify --cleanup` *

### [2026-06-28] kamaaina/herdr_sync
- **Overview**: **Sync Plugin** (`id = "sync-plugin"`, v`0.1.0`) is a Developer Workflow utility whose stated purpose is to **send the same command to all panes in the current tab**. The entire surveyable surface is a single `herdr-plugin.toml` declaring one user-invoked action (`sync-panes`) backed by a prebuilt Zig binary at `./zig-out/bin/herdr_sync`. No implementation source, documentation, hooks, panes, or configuration were provided in this bundle, so behavior beyond that one-sentence description cannot be verified from code.
- **Key Features**: Verifiable capabilities are limited to what the manifest declares:  * **Single action: `sync-panes`**   * `title = "Sync Panes"`   * `description = "Executes the same command in all panes in tab"`   *

### [2026-06-29] JanTvrdik/herdr-command-palette
- **Overview**: **JanTvrdik/herdr-command-palette** (`jt.command-palette`, `Command Palette (fzf)`, v0.1.0) is a meta-utility for Herdr: a VS Code / fzf-style command palette that aggregates **every action exposed by every installed plugin** into one fuzzy-searchable popup. The user binds a key to `jt.command-palette.open`, picks an entry like `gitlab-ci-status.open Open CI status pane`, and the plugin dispatches it via the Herdr CLI. It is stateless, TTY-aware, and leaves no pane behind — when the picker exits Herdr tears down the overlay.
- **Key Features**: Verifiable surface is minimal — one user-invoked action + one interactive pane, no hooks or services:  * **Action `open` — `Command palette (all plugin actions)`:** `contexts=["workspace"]`, `command=

### [2026-06-29] arjenblokzijl/herdr-launcher
- **Overview**: **Launcher** (`arjenblokzijl.herdr-launcher`, `0.3.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a generic workflow launcher for Herdr in the Developer Workflow & Utilities domain.
- **Key Features**: Verifiable surface is one action + one pane, no event hooks, no background service, no HTTP API:  * `actions.pick` — `Launcher: pick & run`, `command = ["sh","-c","exec \"$HERDR_PLUGIN_ROOT/bin/herdr-

### [2026-06-30] Phoobobo/herdr-traex-integration
- **Overview**: **TraeX Integration** (`com.traex.herdr-integration`, v`0.1.4`, `min_herdr_version 0.7.0`) is a standalone bridge that makes the external TraeX coding agent visible in Herdr's sidebar and agents view. Herdr has no built-in process or screen detector for `traex`, so this plugin installs TraeX-native `command` hooks that push semantic state (`idle` / `working` / `blocked` / `release`) to Herdr over its local socket. It ships no Herdr core changes, no panes, and no long-lived daemon — just two global install/uninstall actions and two runtime shell scripts copied into `~/.trae/hooks/`.
- **Key Features**: Verifiable surface is minimal — `herdr-plugin.toml` declares exactly two `actions`, no `panes`, no Herdr event subscriptions, no HTTP API:  * `actions.install` — `Install TraeX integration hook`, `con

### [2026-07-01] lachieh/herdr-plugin-cmux
- **Overview**: `lachieh.cmux-bridge` (`cmux agent sidebar bridge`, v0.1.0, `macos` only) solves a nesting problem: herdr itself runs inside a single cmux tab, so N herdr agents collapse to one cmux sidebar entry. This plugin mirrors **one cmux workspace row per herdr agent**, with a live status pill (`Working` / `Needs input` / `Idle` / `Done`), a second `task` status line showing what the agent is doing, and click-through back to the agent.
- **Key Features**: **Declared surface in `herdr-plugin.toml`:** 4x `[[events]]` + 2x `[[actions]]` + 1x `[[panes]]`, no `link_handlers`, no `build`:  * Events (all `command = ["node", "bin/reconcile.mjs"]`): `pane.agent

### [2026-07-01] cdc-lst/herdr-wait
- **Overview**: `cdc-lst/herdr-wait` (`herdr-wait`, v`0.1.0`) is a rule-driven sidebar enrichment for Herdr agent panes. Herdr derives `idle` / `working` / `blocked` / `done` largely from screen activity, so an agent blocked in `herdr wait` or running a sub-CLI reviewer (`codex`, `opencode`) as a child process looks `idle` — misleading in a multi-agent sidebar.
- **Key Features**: **Declared surface is one event + one action, no panes/overlays/services/API:**  * `[[events]] on = "pane.agent_status_changed"` → `["bun", "bin/enrich.ts"]` — re-classifies the `pane_id` named in the

### [2026-07-02] Phoobobo/herdr-agent-config-manager
- **Overview**: **Agent Config Manager** (`com.herdr.agent-config-manager`, `0.1.0`) is a hybrid inventory and centralization tool for the skill/MCP/plugin/hook sprawl across per-agent home directories (`.claude`, `.codex`, `.cursor`, `.trae`, `.trae-cn`, `.pi`, `.omp`, `.hermes`, `.aiden`, `.osadk`, `.openclaw`).
- **Key Features**: **Detect (read-only):** `agentcfg detect [--skills] [--json]` scans all `KNOWN_AGENT_DIRS` via `inventory.scan_all()`. Human output is a `agent / skills / mcp / plugins / hooks` table with totals; `--

### [2026-07-02] hitaishi2222/herdr-llama
- **Overview**: **hitaishi2222/herdr-llama** (`herdr-llama`, `Llama Server Agent`, v`0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) turns a local `llama-server` binary from `llama.cpp` into a Herdr-visible agent.
- **Key Features**: Verifiable surface is one `action` + one `pane` + one keybind, no `[[events]]`:  * `actions.open-dashboard` — `Llama Server Dashboard`, `command = ["./bin/herdr-llama"]` * `panes.dashboard` — `placeme

### [2026-07-03] horn553/herdr-ntfy
- **Overview**: `horn553/herdr-ntfy` (`horn553.herdr-ntfy`, `Herdr ntfy`, v`0.1.3`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a minimal POSIX-shell push bridge from Herdr agents to [ntfy](https://ntfy.sh).
- **Key Features**: Verifiable surface is one event hook + two manual actions, all backed by the single script `notify.sh`:  * **Event notification:** `[[events]] on = "pane.agent_status_changed"` → `["sh", "notify.sh"]`

### [2026-07-03] yoshiori/herdr-configurable-picker
- **Overview**: `yoshiori.herdr-configurable-picker` (`herdr-configurable-picker`, v1.0.0, `min_herdr_version 0.7.0`, `linux`/`macos`) is a drop-in alternative to Herdr's built-in goto (`prefix+g`, `Mode::Navigator`). It is a single Rust binary rendered as an `overlay` pane that presents a `workspace → tab → pane` tree and lets the user jump to any node — workspaces, tabs, and panes including agentless shells.
- **Key Features**: Verifiable surface is one action + one pane, no event hooks, background service, or HTTP API:  * **Navigation tree:** `Tree::build` in `src/tree.rs` joins `workspace.list` + `tab.list` + `pane.list` s

### [2026-07-04] AkashJana18/herdr-scratch
- **Overview**: `herdr-scratch` is a persistent, named scratchpad manager for Herdr, explicitly modeled on the Floax workflow for tmux. It gives each user a fast, long-lived place to keep shells, notes, REPLs, logs, and one-shot TUIs like `lazygit` alive across normal workspace navigation.
- **Key Features**: **What it does:**  * Named scratchpads with `toggle`, `open`, `focus`, `hide`, `close`, plus `list`/`status` with human or `--json` output. `toggle` shows the default (`scratch`) or returns to previou

### [2026-07-04] plotarmordev/tendwire
- **Overview**: **Tendwire** (`plotarmordev.tendwire`, `0.1.0rc5`, `min_herdr_version 0.7.0`, `platforms = ["linux"]`) is a local-first, durable control-plane for Herdr coding agents. It does not provide a Herdr pane UI; it observes Herdr via CLI + Unix-socket, normalizes workspaces/agents/panes into neutral `Space` / `Worker` models, persists snapshots, turns, and pending-input in SQLite, and exposes that state through a `tendwire` CLI and a `tendwired` socket daemon for external apps, automations, and local systems.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): no panes, no `[[events]]`, no `[[startup]]`, no `[[build]]`. Only:**  * `doctor` — `Check Tendwire` → `python3 scripts/herdr_plugin.py doctor` → `tendwi

### [2026-07-05] osolmaz/herdr-branch-cleanup
- **Overview**: `branch-cleanup` (`Branch Cleanup`, v`0.2.1`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a Developer Workflow utility that prevents Herdr panes from being stranded on dead branches. A background poller enumerates every pane's `cwd` via `herdr pane list`, groups panes by git repo root, and when the pane's branch has been `merged` or `deleted` on GitHub, checks out the remote's authoritative default branch — provided every safety gate passes.
- **Key Features**: **User-visible surface declared in `herdr-plugin.toml`:**  * 4x `actions`: `start` / `stop` / `toggle` (`target/release/herdr-branch-cleanup start|stop|toggle`) to manage the poller, plus `cleanup-now

### [2026-07-05] jeromychu23/herdr-popupx
- **Overview**: This plugin provides **persistent, native floating scratch popups for Herdr**. Herdr composites an 85% x 80% `popup` over the active pane without disturbing the tiled layout, while a private `tmux` server preserves the shell, cwd, running process, and viewport while hidden.
- **Key Features**: Verifiable surface is 2x `panes` + 4x `actions`, no `[[events]]`, no `[[startup]]`, no HTTP API:  * **Panes (both `placement = "popup"`, `width="85%"`, `height="80%"`):**   * `workspace-scratch` — `⌂ 

### [2026-07-06] maro114510/herdr-toggle-popup
- **Overview**: `maro114510.toggle-popup` (`Toggle Popup`, v`0.4.1`, `min_herdr_version 0.7.0`) is a persistent scratch-shell utility for Herdr. A single keybinding toggles an `overlay` popup pane; hiding the popup closes the Herdr pane completely so no border or zoom chrome remains, while the actual shell survives in a named `tmux` session keyed by scope and entrypoint.
- **Key Features**: Verifiable surface is one action + one pane + two event hooks + a multi-subcommand Go CLI. No HTTP API, no background daemon, no link handlers:  **Declared in `herdr-plugin.toml`:** * `actions.toggle-

### [2026-07-06] poweroutlet2/herdr-confirm-close-pane
- **Overview**: `confirm-close-pane` (v`0.1.0`, `min_herdr_version 0.7.0`) is a minimal safety guard for Herdr pane management. It replicates tmux's `prefix+x` `confirm-before` behavior: a user-bound key opens a modal `Close this pane? (y/n):` prompt, closing the originally focused pane only on `y`, otherwise cancelling with no side effects.
- **Key Features**: Verifiable surface is exactly **1x `action` + 1x `pane`**, no events or API endpoints:  * **`actions.confirm-close-pane` — `Close pane (with confirmation)`:** `contexts = ["pane"]`, `command = ["sh", 

### [2026-07-06] gw31415/herdr-amphetamine-macos
- **Overview**: **`amphetamine-macos` (`Amphetamine macOS Sleep Guard`, v0.2.0, `macos` only, `min_herdr_version 0.7.0`)** is a macOS sleep-prevention guard for Herdr coding agents.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 4x `actions` + 1x `pane`, no `[[events]]`, `[[startup]]`, `[[build]]`, or `link_handlers`:**  * `actions.status` (`contexts=["workspace"]`): `python3 sc

### [2026-07-06] trapple/herdr-focus
- **Overview**: **Herdr Focus** (`trapple.herdr-focus`, `1.1.0`, `macos` only, `min_herdr_version 0.7.0`) is a navigation aid for parallel agents: it focuses the next agent pane in `blocked` (needs input) or `done` (finished/unread) state and brings the hosting terminal app to the front via AppleScript. If nothing needs attention it still activates the terminal. An optional, fully opt-in global hotkey daemon (default `Ctrl+Shift+O`) triggers the same action from any macOS app.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **3x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **`actions.focus` — `Focus next agent pane needi

### [2026-07-07] speardragon/herdr-yazi
- **Overview**: **`speardragon/herdr-yazi` (`ray.file-explorer` / `Yazi Explorer`, v1.1.0, `min_herdr_version 0.7.0`, `linux`/`macos`)** is a thin, stateless wrapper that hosts the external [Yazi](https://yazi-rs.github.io/) terminal file manager inside a Herdr pane.
- **Key Features**: Verifiable surface is minimal — **1x `[[build]]` + 1x `[[panes]]` + 2x `[[actions]]`**. No `[[events]]`, no `[[startup]]`, no `link_handlers`, no HTTP API, no background daemon, no keymap:  * **`panes

### [2026-07-07] The-Dave-Stack/herdr-keymap
- **Overview**: **The-Dave-Stack/herdr-keymap** (`tds.keymap`, `Keymap Palette`, v`0.7.1`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a discoverability and execution shim for Herdr keybindings.
- **Key Features**: Declared surface is minimal: **1x `panes` + 1x `actions`**, no `[[events]]`, no `[[startup]]`, no `link_handlers`, no HTTP API:  * `panes.palette` — `Keybindings`, `placement = overlay`, `command = ["

### [2026-07-07] juninaba/herdr-slack-notify
- **Overview**: **`agent-slack-notify` (`Agent Slack Notify`, v`0.1.0`, `min_herdr_version 0.7.0`)** is a minimal event-driven notifier in the Developer Workflow & Utilities domain. On every `pane.agent_status_changed` event it checks whether an agent reached `done` or `blocked`, and if so `POST`s a two-line plain-text message to a configured Slack incoming webhook.
- **Key Features**: Verifiable surface is **3x `actions` + 1x `[[events]]`**, no panes/overlays, no background service, no HTTP API:  * **Event hook:** `on = "pane.agent_status_changed"` → `["node", "notify.mjs"]`. Filte

### [2026-07-08] hotchpotch/herdr-tiny-fingers
- **Overview**: `hotchpotch.herdr-tiny-fingers` (`hotchpotch.herdr-tiny-fingers`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a `tmux-fingers`-style visible-screen picker for Herdr. Invoked as `prefix+f` -> `hotchpotch.herdr-tiny-fingers.open`, it opens an `overlay` pane that snapshots the previously focused pane via `pane.read(source="visible")`, redraws that text with short keyboard hints overlaid on recognized tokens, and copies the selected token via OSC 52 or pastes it directly into the origin pane.
- **Key Features**: **Declared surface is minimal: 1x `action` + 1x `pane`, no events/services/API:**  * `actions.open` — `Open fingers mode` — `sh -c exec "${HERDR_BIN_PATH:-herdr}" plugin pane open --plugin hotchpotch.

### [2026-07-08] milkyskies/herdr-attention
- **Overview**: **Attention Jump** (`attention.jump`, `0.1.0`, `min_herdr_version 0.7.0`) is a minimal, stateless navigation utility in the Developer Workflow & Utilities domain. It implements IDE-style "go to next problem" for parallel agents: one keypress (`prefix+a`) warps focus to the most urgent agent needing human attention — `blocked` before `done` — across all workspaces/tabs/panes. It is the cross-platform, zero-daemon counterpart to heavier surveyed focus plugins like `trapple/herdr-focus` (macOS + AppleScript + hotkey daemon) and `yankewei/herdr-focus-notify`.
- **Key Features**: Verifiable surface is exactly **one action + one suggested keybinding**. No panes, overlays, event hooks, background services, or HTTP endpoints:  * **`actions.next` — `Jump to next agent needing atte

### [2026-07-09] ragamo/herdr-flock
- **Overview**: **Flock** (`flock.farm`, `0.1.0`, `min_herdr_version 0.7.0`) is a Rust TUI Herdr plugin that visualizes live AI coding agents as pixel-art sheep on a procedurally generated top-down farm. Each active `pane_id` gets a wandering sheep whose animation reflects Herdr `agent_status`; when the pane disappears the sheep dies and moves to a persistent Graveyard log backed by SQLite.
- **Key Features**: Verifiable surface is **1x `panes` + 1x `actions`**, no `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * **Farm pane (`panes.farm`):** `Flock Farm`, `placement = split`, `command = ["./ta

### [2026-07-09] 0xGosu/herdr-auto-pilot
- **Overview**: **Herd Auto Prompter (`hap`)** is a Developer Workflow & Utilities plugin that keeps a whole Herdr herd unblocked hands-free. It watches every agent pane in every workspace, classifies the on-screen situation when an agent goes `idle` / `blocked` / `done`, and either auto-supplies the next prompt or response the way the operator would, or escalates to the operator when confidence or safety gates fail.
- **Key Features**: **Monitor and reconcile the herd:** * Subscribes to Herdr's local event socket for `pane.created` / `pane.agent_detected` / `pane.exited` / `pane.agent_status_changed`, plus authoritative `pane.list` 

