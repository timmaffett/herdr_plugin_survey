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

### [2026-07-09] KonstantinKai/herdr-harpoon
- **Overview**: **Herdr Harpoon** (`herdr-harpoon`, `0.5.0`, `min_herdr_version 0.7.3`, `linux`/`macos`) is a Bash-only, zero-build port of ThePrimeagen Harpoon / tmux-harpoon for Herdr. It lets you **mark** the current pane — optionally a tab or workspace — into a small ordered list and **jump back by index** (`alt+1`..`alt+9`), pick from a fuzzy list, or edit the list in `$EDITOR`.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **14x `actions` + 2x `panes`**, no `[[events]]`, `[[startup]]`, `[[build]]`, or `link_handlers`:  **Marking:** * `add` (`Harpoon: mark pane`, `contexts=["pan

### [2026-07-09] JYasha11/herdr-in-your-face
- **Overview**: **In Your Face** (`jyasha11.in-your-face`, `0.1.0`, `min_herdr_version 0.7.3`, `linux`/`macos`) is a Developer Workflow joke-that-works: when any Herdr agent stays in `blocked` past a grace period, it covers the Herdr window with a giant escalating ASCII face until you answer the agent or press `q`.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is exactly **1x `[[events]]` + 1x `[[panes]]`**. No `actions`, `startup`, `build`, `link_handlers`, or HTTP API:  * **Event hook:** `on = "pane.agent_status_c

### [2026-07-09] BowlOfSoup/herdr-stoplight
- **Overview**: **Stoplight** (`herdr-stoplight`, v`0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a standalone Go daemon that aggregates the status of **all** Herdr agents into a physical Arduino 3-LED traffic-light module over USB serial. It polls `herdr agent list`, maps `working → yellow`, `blocked → red`, `finished-but-unreviewed → flickering green`, and `calm → solid green`, encoding agent counts as countable flicks. As a Herdr plugin it has no pane or UI — it autostarts on early workspace/tab events and auto-exits when Herdr stops.
- **Key Features**: **What it does, verifiably:**  * **Aggregate polling:** `internal/herdr.Poller.Poll()` shells `herdr agent list` every `--interval` (default `750ms`) and parses `{"result":{"agents":[...]}}`. * **Revi

### [2026-07-10] aashishd/herdr-agent-messenger
- **Overview**: **Messenger** (`herdr-agent-messenger`, `0.2.2`, `min_herdr_version 0.7.5`, `macos`/`linux`) is agent-to-agent messaging between live Herdr panes on the same machine/server, across harnesses. Each live agent pane gets an ephemeral two-word call-sign like `quiet-heron`; any agent can then coordinate with another via an interactive board, a natural-language skill request, or direct shell `msg <call-sign> '<message>'` without exposing either full conversation.
- **Key Features**: **User-visible entrypoints:**  * `msg whoami [pane_id]` → prints this pane's call-sign, assigning if new. Backed by `scripts/whoami.sh` → `scripts/msg_names.py whoami`. * `msg <target> <message> [--no

### [2026-07-10] JYasha11/herdr-shame-report
- **Overview**: **Shame Report** (`jyasha11.shame-report`, `0.1.0`, `min_herdr_version 0.7.3`, `linux`/`macos`) is a retrospective accountability ledger for parallel Herdr agents. Every time any agent enters `blocked` — waiting on approval, an answer, or input — the plugin timestamps the start of the wait; when the pane leaves `blocked` it appends the duration to a persistent log. A manual `Show the shame report` action renders an overlay with today / all-time totals, longest abandonment, and a per-agent Hall of Shame.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is exactly **1x `[[events]]` + 1x `[[panes]]` + 1x `[[actions]]`**. No `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **Wait tracking (event hoo

### [2026-07-12] joelhooks/herdr-pings
- **Overview**: **Herdr Pings (`herdr-pings`, v0.2.0, `min_herdr_version 0.7.4`, `macos`/`linux`)** is a turn-level orchestration primitive for Herdr panes, not a UI or notifier in the style of the other surveyed Developer Workflow plugins.
- **Key Features**: **Turn wake (`herdr-turn-ping/index.ts`):** Caches `agent_end` (last assistant message, `sessionManager.getSessionId()`) and `turn_end` (`turnIndex`), then on `agent_settled` (Pi 0.80.6 public API) ap

### [2026-07-12] JacquesvanWyk/herdr-keys
- **Overview**: **`herdr-keys` (`JacquesvanWyk/herdr-keys`, v0.2.0, `min_herdr_version 0.7.0`, `linux`/`macos`)** is a fuzzy-searchable keybinding cheatsheet for Herdr itself and the tools around it.
- **Key Features**: Verifiable surface is **3x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * `actions.open-keys` — `Keybinding cheatsheet` → `bash scripts/open-ke

### [2026-07-13] usrivastava92/herdr-wakeup
- **Overview**: **Herdr Wakeup** keeps a macOS or Linux host awake while Herdr-managed agents are `working`, and restores normal sleep shortly after work stops. It does this with a detached, per-Herdr-session background watcher (`wakeup-herdr`, Rust) that observes Herdr over its Unix socket and holds/releases a system assertion by spawning the standalone `wakeup` binary as `wakeup -i -w <watcher-pid>` (optionally `-di` for display).
- **Key Features**: **User-invoked actions** — all declared in `plugin/herdr-plugin.toml` with `contexts=["global","workspace","pane"]`, all thin `bash bin/*` wrappers:  * `start` — launch one detached watcher for curren

### [2026-07-15] malone-c/herdr-keybind-search
- **Overview**: **Keybind Search** (`chrismalone.keybind-search`, `0.1.0`, `min_herdr_version 0.7.0`) is a minimal, stateless Developer Workflow utility that adds a fuzzy-searchable overlay for Herdr keybindings. Herdr's built-in `prefix+?` help is static and read-only; this plugin builds the user's *effective* keymap — shipped defaults overlaid with `config.toml` overrides plus `[[keys.command]]` customs — and pipes it into `fzf` inside an `overlay` pane for type-to-filter / `esc`-to-close lookup.
- **Key Features**: Verifiable surface is **1x `panes` + 1x `actions`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, panes beyond the overlay, or HTTP API:  * **`actions.open` — `Search keybinds` (`cont

### [2026-07-15] Sawakee/herdr-imebox
- **Overview**: **Sawakee/herdr-imebox** (`herdr-imebox`, v0.1.3, `min_herdr_version 0.7.0`, `linux`/`macos`) is an IME-friendly pop-up text box for composing CJK — Japanese/Chinese/Korean — text and sending it to the currently focused agent pane.
- **Key Features**: Verifiable surface is minimal: one `[[actions]]`, one `[[build]]`, no `[[panes]]`, no `[[events]]`, no HTTP API:  * **Action `open-imebox`:** `Open IME text box`, `command = ["./bin/imebox", "launch"]

### [2026-07-15] martin-ro/herdr-next-agent
- **Overview**: **Next Agent** (`martinro.next-agent`, `0.1.0`) is a minimal, stateless navigation utility for Herdr. It implements a priority-ranked alternative to Herdr's built-in `next_agent` / `previous_agent` panel-order cycling: on each invocation it pulls `herdr agent list`, ranks agents by urgency (`blocked` > `done` > `idle` by default), and focuses the top candidate — or the next one after the currently focused agent, so repeated presses cycle the whole attention queue. If nothing qualifies, it shows a passive toast instead of moving focus.
- **Key Features**: Verifiable surface is exactly **one user-invoked action, no panes, no event hooks, no background service, no HTTP API**:  * **`actions.jump` — `Jump to next agent needing attention`**: `contexts = ["g

### [2026-07-15] Risingtides-dev/ocean-herdr
- **Overview**: **Ocean for Herdr** (`risingtides.ocean`, `Ocean`, v`0.1.1`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a thin, lifecycle-aware launcher that opens the external [Ocean](https://github.com/Risingtides-dev/ocean-os) TUI in a Herdr-managed workspace `tab` pane.
- **Key Features**: Verifiable surface is **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, background daemon, or HTTP API in this package:  * **`actions.start` — `S

### [2026-07-16] mo-arvan/herdr-claude-auto-retry
- **Overview**: **Claude Auto Retry** (`claude-auto-retry`, v1.3.0, `min_herdr_version 0.7.5`, `linux`/`macos`) is a herdr-native auto-resume for Claude Code panes. It waits out Anthropic subscription rate limits for their real reset time and retries transient server errors with exponential backoff, then types a configured resume message as discrete keystrokes.
- **Key Features**: **Lifecycle coverage:** * Detached per-pane `monitor` processes, one per `terminal_id`. Self-healing via three paths: `[[startup]]` → `watch-all` on session restore, `pane.agent_detected` → `hook-agen

### [2026-07-16] rvalledorjr/herdr-fresh
- **Overview**: `herdr-fresh` is a thin launcher plugin that runs **Fresh (`https://getfresh.dev`), the terminal IDE, as a real editor inside a Herdr pane** — not a viewer, TUI, or re-implementation. It ships no editor code of its own: only a `herdr-plugin.toml` manifest plus `bash` / PowerShell glue that opens Fresh in a split or tab, keeps one persistent named Fresh daemon per workspace (`fresh -a <daemon>`), and pushes `path:line:col` into that live daemon.
- **Key Features**: **Declared surface in `herdr-plugin.toml` (`min_herdr_version 0.7.0`, `linux/macos/windows`):**  * **1x `[[panes]]` (Unix only):** `fresh` — `title Fresh`, `placement split`, `command ["bash", "script

### [2026-07-16] hmu332233/herdr-plugins-labs
- **Overview**: `herdr-plugins-labs` is a `pnpm` monorepo incubator for experimental Herdr plugins, not a single plugin. It currently contains four active Node.js ESM plugins in two families: **agent lifecycle launchers** — `dev.minung.quick-agent` (v0.2.0) to split open Codex/Claude beside the origin pane, and `dev.minung.agent-restart` (v0.1.0) to safely stop an `idle` Codex/Claude and resume the same session in-place — and **Space sidebar metadata reporters** — `dev.minung.space-stats` (v0.1.0) and `dev.minung.space-tab-count` (v0.1.0) that expose `workspace list` counts as `$space_stats` / `$tab_count` tokens. A fifth plugin, Symlink Worktree, has already graduated to `hmu332233/herdr-symlink-worktree`.
- **Key Features**: **Quick Agent (`quick-agent/`):** * User-invoked `actions.open` (`Open Quick Agent`, `contexts=["workspace"]`) -> `node src/open.mjs`. * Interactive `panes.quick-agent` (`placement=popup`, `44x10`) ->

### [2026-07-16] y-hirakaw/herdr-cc-mac-notify
- **Overview**: `cc-mac-notify` (`Claude Code Mac Notify`, v`0.2.0`, `macos` only) is a minimal, stateless event-bridge that turns Claude Code agent terminal states into native macOS Notification Center toasts. On `pane.agent_status_changed` to `blocked` or `done` it posts `display notification` via `osascript` with three parts: title (`<agent> <status>`), subtitle (Herdr workspace label), and body (the agent's actual last reply or question, truncated to 200 chars).
- **Key Features**: Verifiable surface is **one event hook, no actions, no panes/overlays, no background service, no HTTP API**:  * **Event hook:** `[[events]] on = "pane.agent_status_changed"` → `["python3", "notify.py"

### [2026-07-16] lancodev/herdr-laravel-tinker
- **Overview**: `lancodev.laravel-tinker` (`Laravel Tinker`, `0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a framework-specific REPL bridge for Laravel development. Invoked from any workspace pane inside a Laravel project, it opens a `scratch.tinker.php` file in the project root beside a live results surface; every save re-executes the file inside a fully booted Laravel app.
- **Key Features**: Verifiable surface is **1x `action` + 1x `pane`**, no event hooks, no startup daemon, no HTTP API:  * **`actions.open` — `Open tinker REPL` (`contexts=["workspace"]`):** resolves the Laravel root by w

### [2026-07-17] Hanyang-Li/herdr-espresso
- **Overview**: **Espresso Guard (`id = "espresso"`, `v0.1.0`, `macos` only, `min_herdr_version 0.7.0`)** keeps a Mac awake while a Herdr pane's coding agent is active.
- **Key Features**: Verifiable surface is minimal: two user actions backed by one Rust binary (`herdr-espresso`), plus one hidden internal subcommand:  * **`actions.toggle` — `Espresso: toggle monitor on focused pane`** 

### [2026-07-17] aclima01/herdr-notify-windows
- **Overview**: **Herdr Notify for Windows** (`aclima.herdr-notify-windows`, `0.1.0`, `min_herdr_version 0.7.0`, `platforms = ["windows"]`) is a native **Windows 11 toast notifier** for Herdr agents.
- **Key Features**: Verifiable surface is minimal: **1x `[[events]]` + 1x `[[actions]]`**. No panes, overlays, background daemon, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Event-driven notification:** 

### [2026-07-17] ugurtarlig/herdr-agent-recency
- **Overview**: **Agent Recency** (`ugurtarlig.agent-recency`, `0.1.0`, `min_herdr_version 0.7.0`, `platforms=["macos"]`) is a cross-workspace MRU picker for Herdr agents.
- **Key Features**: Verifiable surface is **1x `action` + 3x `events` + 1x `pane`**, all backed by the single file `agent_recency.py`. No HTTP API, link handlers, startup daemon, or build step.  **User-visible:**  * `act

### [2026-07-17] JoanGil/herdr-unread-marker
- **Overview**: **JoanGil/herdr-unread-marker** (`unread-marker` / `Unread Marker`, v`0.4.0`, `min_herdr_version 0.7.3`, `linux`/`macos`) is a tiny manual flag for parallel-agent triage. It lets you mark the currently focused agent pane as `● unread` with a keybinding and clear it later with the same key (toggle) or a dedicated clear key.
- **Key Features**: Verifiable surface is exactly **2x `actions`**, no panes, overlays, events, startup, build, link handlers, or HTTP API:  * **`actions.mark` — `Toggle focused agent unread`**, `contexts=["workspace"]`,

### [2026-07-17] maedana/herdr-agents-status
- **Overview**: `maedana.agents-status` (`Agents Status`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is an always-on-top, transparent status overlay for Herdr agents. It is described in `README.md` as a spiritual successor to `claudeye`, rebuilt for Herdr instead of tmux.
- **Key Features**: Declared surface is minimal — **1x `[[build]]` + 1x `[[actions]]`**. No `[[events]]`, `[[panes]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * **`actions.toggle` — `Toggle Agents Status Overlay`**

### [2026-07-17] raghu-nandan-bs/herdr-deck-navigation
- **Overview**: **Deck** is a fast, keyboard-driven workspace and pane navigator for Herdr. It answers the triage question — *who needs me, and what finished while I was gone?* — rather than *where is pane N*.
- **Key Features**: **Declared Herdr surface is minimal — one action + one pane, no event hooks, no background service, no HTTP API:**  * `actions.open` — `Open deck navigator`, `contexts=["workspace"]`, `command=["sh","

### [2026-07-17] yigitkg/herdr-open-local-paths
- **Overview**: **`yigitkg.local-path-actions` / `Local Path Actions` (`0.4.0`, `min_herdr_version 0.7.4`)** is a stateless Developer Workflow utility that turns local paths visible in Herdr terminal output into actionable operations.
- **Key Features**: No event hooks, background service, or HTTP API. Verifiable surface is **8x `actions` + 1x `link_handlers` + 1x `panes`** (duplicated in `herdr-plugin.toml` for `platforms=["linux"]` and `windows/herd

### [2026-07-17] ugurtarlig/herdr-pane-picker
- **Overview**: **Pane Picker** (`ugurtarlig.pane-picker`, `0.1.1`, `min_herdr_version 0.7.4`, `platforms=["macos"]`) is a WezTerm-style spatial pane switcher for Herdr. It draws a single-character badge directly over every pane in the current tab — `a,s,d,f,...` in visual top-to-bottom, left-to-right order — and focuses the pane whose key the user types, without writing into pane PTYs.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):** no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API. Only:  * `actions.open` — `Pick a pane` (`contexts=["workspace"]`): `python

### [2026-07-17] EricBois/herdr-nudge
- **Overview**: `herdr-nudge` is a small, stateless-until-armed Developer Workflow utility that lets you **pre-arm a "continue" poke against a specific agent pane** and walk away. From the focused pane you pick one of three one-shot triggers — at a wall-clock time (`HH:MM`), when the agent next goes `idle`, or when it next goes `blocked` — plus a prompt string (default `continue`), and a detached waiter delivers it later by typing into the real session.
- **Key Features**: Verifiable surface is **2x `actions` + 2x `panes`**, no event hooks, no startup daemon, no build step, no HTTP API, no `link_handlers`:  * **`actions.arm` — `Nudge: arm continue-nudge on this agent` (

### [2026-07-17] Tatendaz/herdr-launcher
- **Overview**: **Herdr Launcher** (`tatendaz.herdr-launcher`, v`1.2.1`, `min_herdr_version 0.7.5`, `platforms=["macos"]`) is a macOS Dock icon for herdr, not a runtime Herdr extension. It builds a stay-open AppleScript applet (`dist/Herdr.app`) wrapped around a single shell script that opens the `herdr` TUI in the user's preferred terminal.
- **Key Features**: No panes, overlays, event hooks, background Herdr service, or HTTP API. Verifiable surface is one `[[build]]` + two `[[actions]]` in `herdr-plugin.toml`, all delegating to host-OS tooling:  * **Launch

### [2026-07-18] osolmaz/pi-workflows
- **Overview**: `osolmaz.pi-workflows` (`pi-workflows`, v`0.16.8`, `min_herdr_version 0.7.0`, `linux`/`macos`) is not a standalone Herdr utility. It is the Herdr-facing slice of a much larger Pi-agent workflow system (~182k LOC TypeScript + Rust).
- **Key Features**: **Herdr-declared surface is minimal — one pane, nothing else:**  * `herdr-plugin.toml`: single `[[panes]] id="piw"`, `title="piw"`, `placement="split"`, `command=["node","plugins/herdr/viewer.mjs"]`. 

### [2026-07-18] natori-hrj/herdr-hail
- **Overview**: Herdr Hail is a **two-way Slack + Discord bridge for Herdr coding agents**. It watches all local agents, posts a message the moment one transitions to `blocked` (or `done` by default) with enough terminal excerpt to triage from chat, and routes a reply in that thread — or a tap on a rendered approval button — back into the originating pane via `agent.send` to unblock it.
- **Key Features**: **Notify on status transition:** * Polls `agent.list` every `pollIntervalMs` (default `1500ms`) and emits only live `from → to` changes. First snapshot after boot is primed and suppressed so every exi

### [2026-07-19] natori-hrj/herdr-triage
- **Overview**: **Herdr Triage** (`id = "triage"`, `Herdr Triage v0.2.1`, `min_herdr_version 0.7.0`, `linux`/`macos`) is an attention-triage viewer for parallel coding agents. It polls `agent.list` on a loop, scores every agent by status + time-in-status — a `blocked` agent waiting 10 minutes outranks a freshly-blocked one — and redraws a live, self-refreshing ranked list in a `split` pane so the operator always knows who to deal with first.
- **Key Features**: Verifiable surface is minimal: **one `[[build]]` + one `[[panes]]`**. No `[[actions]]`, `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Live pane `triage/list`:** `title = "Triage"`, `

### [2026-07-19] mattyan1053/herdr-compose
- **Overview**: **`compose` (`Compose`, v`0.2.0`, `min_herdr_version 0.7.4`, `linux`/`macos`)** is a pure-Bash Developer Workflow utility that binds Docker Compose v2 lifecycle to Herdr workspaces (spaces).
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `panes` + 8x `actions` + 5x `[[events]]`**. No `[[build]]`, `[[startup]]`, `link_handlers`, or HTTP API.  **Pane — interactive picker:** * `panes.ps` 

### [2026-07-19] natori-hrj/herdr-standup
- **Overview**: **Herdr Standup** (`id = "standup"`, `Herdr Standup v0.2.0`, `min_herdr_version 0.7.5`, `linux/macos/windows`) is a per-agent work digest for parallel coding agents. For every agent Herdr knows about it reads that agent's working directory with read-only `git` and reports two things: commits landed in a configurable window (default last 12h) and uncommitted work still sitting in the tree.
- **Key Features**: **Digest pane:** `herdr plugin pane open standup/digest` runs `./target/release/herdr-standup digest` (default with no args). `digest::format_digest()` filters to meaningful repos (commits OR dirty fi

### [2026-07-20] natori-hrj/herdr-lazy
- **Overview**: `herdr-lazy` v0.37.0 (`id = "herdr-lazy"`, `min_herdr_version = "0.7.5"`, `linux`/`macos`/`windows`) is a declarative plugin **manager + curated distro** for Herdr. It replaces imperative `herdr plugin install <owner/repo>` with one user-owned file — `plugins.list` (`owner/repo[@ref]` per line) — plus a generated `plugins.lock` that pins exact commits.
- **Key Features**: **Bundle lifecycle (CLI in `src/main.rs`):**  * `init [--force] [--extras <id,…>] [--from <owner/repo[@ref]>] [--dry-run]` — writes curated `DEFAULT_BUNDLE` via `default_bundle_body()` or adopts someo

### [2026-07-20] aorumbayev/herdr-workflows
- **Overview**: `herdr-workflows` (`id = "herdr-workflows"`, v`0.13.1`, `min_herdr_version = "0.8.2"`) is a **linear YAML workflow runner for Herdr panes**. Where most plugins in the Developer Workflow & Utilities ledger are single-purpose utilities — notifiers, pickers, launchers of a few hundred lines — this is a ~79k LOC Go platform: it lets users author declarative `version: v1alpha1` workflows with `inputs:` + `run:` (shell) and `herdr:` (socket) steps, then launch them from any workspace/pane/selection into real Herdr layout.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`, duplicated in `embed/herdr-plugin.toml`):**  * `actions.launch` — `Launch herdr-workflows workflow`, `contexts = ["workspace","pane","selection"]`, `comm

### [2026-07-20] TheMetalStorm/herdr-commandcode-plugin
- **Overview**: **Command Code** (`id = "commandcode.integration"`, `v0.1.0`, `min_herdr_version 0.7.0`) makes the external `cmd` agent ([commandcode.ai](https://commandcode.ai)) a first-class Herdr agent. It provides three split-pane launchers (new task, resume-last, resume-named) that `exec cmd` inside a real Herdr PTY, plus a Command Code-side hook (`cmd-hooks/herdr-status.sh`) that reports `idle` / `working` / `blocked` and session identity back to Herdr from inside the live `cmd` process.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 3x `panes` + 2x `actions`:**  * `panes.task` — `Command Code`, `placement = split`, `["sh","scripts/launch.sh","task"]` → `exec cmd` with no args. * `pa

### [2026-07-20] meerzulee/herdr-float
- **Overview**: **`meerzulee/herdr-float` (`herdr-float` / `Herdr Float`, v0.1.1, `min_herdr_version 0.7.4`, `linux`/`macos`)** is a persistent, per-Space floating shell for Herdr.
- **Key Features**: Verifiable surface is minimal — **2x `actions` + 1x `[[events]]` + 1x `[[panes]]`**, all Bash:  * **`actions.toggle` — `Toggle floating shell` (`contexts=["workspace"]`, `scripts/toggle.sh`):** Intend

### [2026-07-20] elliotekj/herdr-easymotion
- **Overview**: **Herdr EasyMotion** (`com.elliotekj.herdr-easymotion`, `0.1.0`, `min_herdr_version 0.7.4`, `linux`/`macos`/`windows`) is a pane-navigation utility in the **Developer Workflow & Utilities** domain. It implements Vim EasyMotion / `tmux-fingers`-style jumping for the active Herdr tab: invoke one action, every visible pane gets a large, centered, color-coded single-character hint rendered directly onto the pane via Herdr's experimental Kitty graphics layer, press the matching key, and focus moves to that pane.
- **Key Features**: Verifiable surface is minimal: **1x `action` + 1x `pane`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **`actions.pane` — `Select pane`** (`contexts=["pane","tab","w

### [2026-07-20] Numbered-com/herdr-ports
- **Overview**: **Ports** (`numbered.ports`, `0.1.2`) is a Developer Workflow utility that answers “which Space has a live dev server?” at a glance. It attributes host TCP listeners to Herdr Spaces by matching listener-process `cwd` against workspace pane `cwd`s, posts a generic `↯` `$ports` badge as workspace sidebar metadata while at least one server lives, and provides a `popup` to inspect and `TERM`/`KILL` those servers.
- **Key Features**: **Declared surface:** 1x `panes.main` + 1x `actions.open` + 1x `[[events]]`. No `[[build]]`, `[[startup]]`, `link_handlers`.  * **Interactive kill popup (default, no args → `popup()`):** full-screen-i

### [2026-07-20] phine-apps/mux-prompter
- **Overview**: **Mux Prompter** (`Mux Prompter`, v`0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a prompt-injection productivity utility for terminal multiplexers. It opens an `fzf` picker as a Herdr `overlay`, lets the user fuzzy-pick a reusable prompt template with live preview, resolves `{{placeholders}}` against git / scrollback / selection / filesystem context, then types the result into the originating pane — or executes it immediately if the title is `!`-prefixed.
- **Key Features**: Verifiable surface is minimal: **1x `panes` + 1x `actions`**, no events, startup, build, or HTTP API. All behavior lives in `prompter.sh`:  * **Picker UI:** `fzf --layout=reverse --preview-window=righ

### [2026-07-20] oullin/herdr-plugins
- **Overview**: `oullin/herdr-plugins` is a TypeScript monorepo of focused, independently installable Herdr plugins for Developer Workflow & Utilities, plus a private shared runtime. It ships three plugins — `oullin.tab-numbers` (v0.1.8), `oullin.tmux-keybindings` (v0.2.0), and `oullin.pane-navigation-hints` (v0.1.0) — all strict, dependency-free Node 24 ESM executed as `node index.ts` and all sharing the repository-local SDK `@oullin/herdr-plugin-core` (v0.1.1) via `file:../../package/core`.
- **Key Features**: No HTTP API endpoints, background daemons, or link handlers exist in the surveyed code. All capability is exposed as Herdr `actions`, `events`, and one `panes` entrypoint:  **Tab Numbers (`plugins/tab

### [2026-07-20] Qu4tro/herdr-whichkey
- **Overview**: `herdr-whichkey` is a blezz/which-key-style single-keystroke action menu for Herdr. One trigger key — README suggests `prefix+space` — opens a hint strip, then each subsequent press is a single keystroke with no typing and no Enter, walking nested groups (`g s`, `r h`) or firing leaves.
- **Key Features**: **Declared surface is minimal:** one `[[panes]] menu` + one `[[actions]] open`, no `[[events]]`, no `[[startup]]`, no `link_handlers`, no HTTP API.  * **Menu navigation:** `Esc` ascends (closes from r

### [2026-07-20] MartinBspheroid/herdr-agent-dash
- **Overview**: Herdr Agent Board is a local, keyboard-first operational dashboard for parallel coding agents in one Herdr session. It compresses workspaces, tabs, panes, and agents into one live table answering who exists, who needs attention, where each agent runs, which repo/branch it can affect, and what the freshest trustworthy signal is — then jumps to the selected agent with one key.
- **Key Features**: **Declared Herdr surface is minimal:** no `[[events]]`, `[[startup]]`, or `link_handlers` in `herdr-plugin.toml`. Only:  * `actions.open` — `Open Agent Board` → `bun run scripts/open-board-pane.ts pop

### [2026-07-20] TaylorFinklea/herdr-ask
- **Overview**: **Herdr Ask** (`dev.herdr-ask`, `0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a lightweight command-generation and terminal-chat assistant that lives as a session-modal Herdr popup but also runs standalone from any terminal.
- **Key Features**: **Two interaction modes:**  * `COMMAND` (default): generates shell snippets. Output passes through `src/output/normalize.rs`: CRLF normalization, blank-line trim, `HERDR_ASK_ERROR:` sentinel detection

### [2026-07-20] quinnjr/herdr-claude-profile
- **Overview**: `quinnjr/herdr-claude-profile` (`quinnjr.claude-profile`, `Claude Profile Switcher`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a thin Herdr wrapper around an external `~/.local/bin/claude-profile` CLI and its on-disk store at `~/.local/share/claude-profiles/<name>` (selected via `CLAUDE_CONFIG_DIR`).
- **Key Features**: Verifiable surface is **1x `[[build]]` + 1x `[[panes]]` + 1x `[[actions]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Action `open_palette` — `Open Claude profile switcher`:

### [2026-07-21] speardragon/herdr-plugin-manager
- **Overview**: `speardragon/herdr-plugin-manager` (`ray.plugin-manager` / `Plugin Manager`, v`0.2.1`, `min_herdr_version 0.7.4`, `macos`/`linux`) is an interactive plugin manager for Herdr itself.
- **Key Features**: Verifiable surface is minimal: **1x `panes` + 1x `actions`** in `herdr-plugin.toml`. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Main view (`bin/manager.sh` + `bin/pa

### [2026-07-21] TheMetalStorm/herdr-freebuff-plugin
- **Overview**: **TheMetalStorm/herdr-freebuff-plugin** (`freebuff.integration`, `0.1.0`, `min_herdr_version 0.7.0`) makes the external [Freebuff](https://freebuff.com) coding agent a first-class Herdr agent. It provides three split-pane launchers (new task, resume-last, resume-named) that `exec` the `freebuff` TUI inside a real Herdr PTY, plus a detached poller that reports `idle` / `working` / `blocked` lifecycle state to Herdr.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **3x `panes` + 2x `actions`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **Panes (all `placement = split`, `command = [

### [2026-07-21] aclima01/herdr-edit-windows
- **Overview**: `aclima01/herdr-edit-windows` (`aclima.edit` / `herdr-edit`, v`0.1.4`, `platforms = ["windows"]`) is a small, self-contained TUI text editor that runs as a Herdr `split` pane beside a coding agent. It provides a file tree rooted at the pane's working directory, a modeless syntax-highlighted editor for a single open file, and an uncommitted-diff viewer with one-key `git add`. It is deliberately non-IDE: no LSP, autocomplete, multi-file search, or multi-buffer management.
- **Key Features**: Verifiable surface is **1x `panes` + 3x `actions` + 1x `[[build]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  **Pane:** * `panes.edit` — `title = "edit"`, `placement = "split"`,

### [2026-07-22] ShankyJS/herdr-space-scoped-agents
- **Overview**: **`herdr-space-scoped-agents` (`Space-Scoped Agents`, v`0.6.0`, `min_herdr_version 0.7.5`)** is a Developer Workflow & Utilities plugin that scopes Herdr's **agent panel** to the currently focused space. Without it the panel lists every agent across every space; with it only `workspace_id == current_workspace_id` is shown, with the header reading `Current space`.
- **Key Features**: **Two persistent modes, no config key:**  * `current` (default) — filter panel to focused space. * `all` — clear filter, show every space.  Mode is stored as a one-line file in `$HERDR_PLUGIN_STATE_DI

### [2026-07-22] to4iki/herdr-unread-jump
- **Overview**: **`to4iki.unread-jump` (`Unread Jump`, v0.1.0, `min_herdr_version 0.7.5`)** is a minimal, stateless navigation utility for parallel-agent triage. It answers one question: *which agent needs me next?* On each invocation it lists all Herdr agents, prefers `blocked` over `done`, and moves focus to the next pane in that priority group, wrapping around on repeated invocations. It is functionally in the same family as surveyed `milkyskies/herdr-attention` and `martin-ro/herdr-next-agent`, but with the smallest possible surface: one action backed by one ~50-line Bash script.
- **Key Features**: Verifiable capability is exactly **one user-invoked action, no more**:  * **`actions.next` — `Jump to next unread agent`**: `command = ["bash", "next.sh"]` in `herdr-plugin.toml`. No `contexts` restri

### [2026-07-22] phin-tech/herdr-phin-util
- **Overview**: `phin-util` (`Phin Util`, `0.10.5`, `min_herdr_version 0.7.4`, `macos`/`linux`) is a grab-bag Developer Workflow utility: one Go binary (`bin/herdr-phin-util`, ~25k LOC) exposing many small Herdr conveniences rather than one feature.
- **Key Features**: No event hooks, daemons, or HTTP endpoints. Verifiable surface is **4x `actions` + 3x `panes`** in `herdr-plugin.toml`, all thin shims over binary subcommands:  * `actions.promote` — `Promote pane to 

### [2026-07-23] suisya-systems/herdr-agent-office
- **Overview**: **Agent Office** (`herdr-agent-office`, `0.1.0`) is a Developer Workflow & Utilities plugin that renders the Herdr agent fleet as a pixel-art office inside a Herdr pane: every pane with a detected agent becomes a character at a desk, grouped by workspace into islands, animated by `AgentStatus` (`idle` / `working` / `blocked` / `done` / `unknown`). It is a read-only observer with two interventions — jump-to-pane focus and blocked-agent escalation toasts — designed to work with any agent Herdr itself detects, with zero per-agent integration, over local and `--remote` sessions.
- **Key Features**: **Resident fleet view (`panes.office`, `placement = tab`):** * Full view groups desks by workspace with `[ room ]` headers, wraps to terminal width, scrolls vertically to keep selection visible. Falls

### [2026-07-23] StructuPath/herdr-guard
- **Overview**: **`structupath.guard` (`Guard`, v0.2.0, `min_herdr_version 0.7.5`, `macos`/`linux`)** is a cross-agent command policy layer for Herdr. It watches every pane for risky command text against a single shared policy, then audits all matches, notifies on `alert`-tier matches, and makes a best-effort `Ctrl+C` interrupt request for `interrupt`-tier matches in classified shells.
- **Key Features**: **User-invoked actions (`herdr-plugin.toml` → `scripts/action.sh` → `src/command.mjs`):**  * `open` — `herdr plugin pane open --plugin structupath.guard --entrypoint guard --placement split --focus` *

### [2026-07-23] calebcauthon/herdr-birdseye
- **Overview**: **Birdseye** (`herdr-plugins.birdseye`, `Birdseye`, v`0.6.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a live fleet-mirror for Herdr agents in the Developer Workflow & Utilities domain.
- **Key Features**: Verifiable surface is **1x `actions` + 1x `panes` + 1x `build`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Action `show` — `Show Birdseye`:** `contexts=["pane","workspace"]`,

### [2026-07-23] saeedrahimi/herdr-notify-wsl
- **Overview**: **`saeedrahimi.herdr-notify-wsl` (`Herdr Notify for Windows (WSL)`, v0.1.0)** is a WSL adaptation of the upstream `aclima01/herdr-notify-windows` plugin. It solves one narrow deployment mismatch: Herdr itself runs as the Linux binary inside WSL, but the operator sits on the Windows 11 host and wants a native desktop toast the moment a parallel agent finishes its turn or blocks for input.
- **Key Features**: Verifiable surface is exactly **one event hook + one manual action**, both backed by `notify.sh`:  * **Turn-finished notification:** `working -> done | idle` produces a toast with body `Turn finished`

### [2026-07-23] cedrus-8864/herdr-prompt-reply
- **Overview**: This is a macOS-only, actionable notifier in the **Developer Workflow & Utilities** domain. When Herdr marks an agent pane `blocked` — which Herdr does exactly when an approval / question UI is visible — the plugin reads the visible screen, parses the bottom-most numbered option list and question above it (plus a newer `Enter to confirm · Esc to cancel` footer shape), and posts a native macOS notification whose buttons carry the prompt's own answers.
- **Key Features**: **User-visible behavior:**  * **Answer from notification:** option digit / key name (`enter`, `esc`) is typed into the pane after re-checking the pane is still `blocked`, so answering in the terminal 

### [2026-07-24] alasano/house-of-herdr
- **Overview**: This repo (`house-of-herdr`, monorepo with `pnpm-workspace.yaml`) ships a single Herdr plugin: **Codex Micro for Herdr** (`alasano.codex-micro`, `0.1.0`, `macOS`-only). It makes the Work Louder Codex Micro (OpenAI edition) hardware keypad a native Herdr controller: the six Agent Keys mirror live Herdr agent status via LEDs and focus agents on press, while dial, joystick, and `ACT06-ACT12` command keys drive workspaces, tabs, panes, and scrolling.
- **Key Features**: **Status lights:** * Six slots mapped to `AgentStatus`: `blocked` = amber solid, `done` (unseen) = green solid, `working` = blue breathing, `idle` = white dim, `unknown` = white faint, empty = off (`s

### [2026-07-24] nhclink16/herdr-announcer
- **Overview**: **`nhclink16/herdr-announcer` (`nhclink16.announcer`, v0.9.1, `min_herdr_version 0.7.0`, `macos`/`linux`)** is a voice-notification plugin for parallel Herdr agents.
- **Key Features**: **Event-driven announcement pipeline (`announce.py:process_invocation`):**  * Status filter against `announce = ["done","blocked"]` configurable to `done/blocked/idle/working/unknown`. Non-subscribed 

### [2026-07-24] Yemeni/herdr-agent-timer
- **Overview**: **`yemeni.agent-timer` (`Agent Timer`, v0.2.4, `min_herdr_version 0.8.0`, `platforms=["linux"]`)** is a persistent, reboot-safe stopwatch that rewrites Herdr agent status labels in place.
- **Key Features**: Verifiable surface is minimal — no panes, overlays, link handlers, or HTTP API:  * **Rotating state labels via `pane report-metadata`:** `timer.sh:run_daemon` emits `herdr pane report-metadata <pane_i

### [2026-07-24] calebcauthon/herdr-agent-copy-paste-fork
- **Overview**: **Fork** is a small, stateless-until-used Bash utility for branching a live agent conversation without disturbing the original. From a focused pane running Claude Code or Codex, one hotkey opens a resumed-as-fork copy in a new tab or vertical split; a second copy/paste pair decouples capture from placement, letting you capture a session once and type its resume command into any number of other panes sitting at a shell prompt.
- **Key Features**: Verifiable surface is **4x `actions` + 1x `panes`** in `herdr-plugin.toml`, no `[[events]]`, `[[startup]]`, `[[build]]`, or `link_handlers`:  * `actions.fork` — `Fork agent conversation into a tab`: `

