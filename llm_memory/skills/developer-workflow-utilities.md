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

### [2026-07-25] sf1tzp/herdr-pane-orientation-switcher
- **Overview**: **Pane Orientation Switcher** (`sf1tzp.herdr-pane-orientation-switcher`, `0.3.0`, `min_herdr_version 0.7.0`) is a tiny Developer Workflow layout utility. It toggles a two-pane Herdr split between side-by-side (`split right`) and stacked (`split down`) while preserving running processes, pane order, focus, and split ratio, and it ships zoom-aware replacements for the built-in `split-right` / `split-down` actions that unzoom instead of silently creating a hidden pane.
- **Key Features**: Verifiable surface is exactly **3x `actions`, no `panes`, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API**:  * `toggle` — `Toggle split orientation` (`contexts=["pa

### [2026-07-25] keinstn/drover-notify
- **Overview**: `drover.notify` (`Drover Notify`, `0.1.0`, `min_herdr_version 0.7.0`) is a minimal, event-driven push bridge in the **Developer Workflow & Utilities** notifier family. When any Herdr agent pane transitions to `blocked`, it `POST`s a small JSON payload to a pre-paired Drover backend URL, which in turn pushes to the [Drover](https://github.com/keinstn/drover) iOS app.
- **Key Features**: **Event hook — the only runtime Herdr surface:** * `[[events]] on = "pane.agent_status_changed"` → `["node", "bin/handle-blocked.mjs"]` in `herdr-plugin.toml`. No `actions`, `panes`, `startup`, `build

### [2026-07-26] speardragon/herdr-command-center
- **Overview**: `speardragon/herdr-command-center` (`cdragon.command-center` / `Command Center`, v1.2.0, `min_herdr_version 0.7.5`, `macos`+`linux`) is a single-key command palette that replaces a drawer of `prefix+<key>` bindings.
- **Key Features**: **Declared Herdr surface — no events, daemons, or HTTP:** * `panes.palette`: `Command Center`, `placement=popup`, `90%x70%`, `["node","bin/popup.mjs"]`. * `actions.open`: `Command Center: Open the com

### [2026-07-26] 4Born/herdr-pane-id-labeler
- **Overview**: **4Born/herdr-pane-id-labeler** (`io.github.4born.pane-id-labeler`, `0.1.0`, `min_herdr_version 0.7.5`) is a tiny event-driven utility that keeps each Herdr **pane label** equal to its current public pane ID — e.g. `w1:p1`, `w1:p2`, `w3:p1`.
- **Key Features**: Verifiable runtime behavior is three paths backed by two Herdr CLI calls:  * **Startup reconciliation:** `[[startup]] command = ["node", "src/sync-existing.mjs"]` enumerates the whole session via `her

### [2026-07-26] calorie/herdr-auto-focus
- **Overview**: **Herdr Auto Focus** (`calorie.herdr-auto-focus`, `v0.1.2`, `min_herdr_version 0.7.0`, `platforms = ["macos"]`) is a macOS-only, Go-built Herdr plugin that automatically focuses an agent pane after it needs attention once the whole system has gone idle.
- **Key Features**: Verifiable surface is minimal: **one `[[build]]` + one `[[events]]`**. No `actions`, `panes`, `overlays`, `startup`, `link_handlers`, or HTTP API.  * **Event hook:** `on = "pane.agent_status_changed"`

### [2026-07-26] tumf/conflux-herdr
- **Overview**: **Conflux** (`tumf.cflx`, `0.5.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a thin Herdr adapter that makes the external **Conflux TUI** (`cflx tui`) a first-class Herdr agent. It provides a single `tab` pane that `exec`s a shell wrapper (`cflx`) instead of the real `cflx` binary directly.
- **Key Features**: Verifiable surface is minimal — **1x `panes`, no `actions`, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API**:  * **Managed TUI pane (`panes.tui`):** `title="Conflux

### [2026-07-26] gilvanecesar/herdr-attach
- **Overview**: **`gilvanecesar/herdr-attach` (`gilvanecesar.attach`, `Attach files`, `0.1.0`, `min_herdr_version 0.7.4`)** is a file-to-agent context bridge for Herdr.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `panes` + 3x `actions` + 1x `link_handlers`**. No `[[events]]`, `[[startup]]`, `[[build]]`, or HTTP API:  * **`panes.picker` — `Attach files`:** `plac

### [2026-07-27] dzwduan/herdr-convo-index
- **Overview**: **Conversation Index** (`convo.index`, v`0.7.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a read-only navigation aid for long Claude Code and Codex sessions.
- **Key Features**: **Index pane (`bin/convo_index.py`):**  * One line per user turn: `NN HH:MM <size-bar> <first-line-of-prompt>`, e.g. `3 11:40 ▂ 这里是我对 pref…`. * Size bar (`▁▂▃▄▅▆▇█` over thresholds `200…60000` chars) 

### [2026-07-27] nyanyaon/github-issue-herdr-plugin
- **Overview**: **`nyanyaon.herdr-issues` (`GitHub Issues`, `0.1.0`, `min_herdr_version 0.7.0`)** is a read-only GitHub issue viewer that runs as a Herdr `split` pane for the repo behind the active workspace.
- **Key Features**: **Declared Herdr surface — one pane + one action, nothing else:**  * `panes.issues` — `title="Issues"`, `placement="split"`, `command=["./bin/herdr-issues"]`. * `actions.open` — `title="Open issues pa

### [2026-07-28] SerHappy/herdr-achievements
- **Overview**: **SerHappy/herdr-achievements** (`herdr-achievements`, `Herdr Achievements`, v`0.4.0`, `min_herdr_version 0.7.5`, `macos`/`linux`) is a gamification toy in the Developer Workflow & Utilities domain: a cozy terminal trophy room for parallel coding agents.
- **Key Features**: Verifiable capability is five achievements defined in `internal/achievements/reducer.go:Catalog`:  * **FIRST HOOF** — first `pane.agent_detected` (non-released) joins the herd. * **FIRST DELIVERY** — 

### [2026-07-28] m2selfA/herdr-alias-setter
- **Overview**: `alias-setter` (`id = "alias-setter"`, `v1.1.0`, `min_herdr_version 0.7.4`) is a Developer Workflow & Utilities pane-management utility. Its sole job is to set a Herdr **pane display name and agent alias together in one step** from the focused pane.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **4x `actions` + 4x `panes`**, Unix/Windows twins, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **Actions (`contexts=["pan

### [2026-07-28] maxBRT/herdr-omarchy-theme-sync
- **Overview**: **`omarchy-theme-sync` (`Omarchy Theme Sync`, v0.1.2, `min_herdr_version 0.7.5`, `linux` only)** is a cosmetic sync utility, not an agent, navigation, or notification tool typical of the Developer Workflow & Utilities ledger. In 2 sentences: it reads the active [Omarchy](https://omarchy.org/) Quattro palette from `~/.local/state/omarchy/current/theme/colors.toml` and writes a matching `[theme]` + `[theme.custom]` block into `~/.config/herdr/config.toml`. It runs once at Herdr server start and installs an Omarchy `theme-set` hook so subsequent `omarchy theme set "<name>"` invocations re-sync Herdr without user intervention.
- **Key Features**: Verifiable surface is **1x `[[startup]]` + 2x `[[actions]]`**, no `[[events]]`, `[[panes]]`, `link_handlers`, `[[build]]`, or HTTP API:  * **`sync-now` (`Sync Herdr theme from Omarchy`, `contexts=["gl

### [2026-07-28] perlporter/herdr-apple-music-plugin
- **Overview**: **`apple-music-toast` / `Apple Music Now Playing` (`0.1.0`, `min_herdr_version 0.7.1`, `macos` only)** is a tiny, unofficial macOS amenity plugin: it shows a Herdr toast every time the track changes in `Music.app` (Apple Music).
- **Key Features**: Verifiable surface is **1x `[[startup]]` + 1x `[[actions]]`**, no `[[events]]`, `[[panes]]`, `link_handlers`, `[[build]]`, or HTTP API:  * **Automatic now-playing toast (`poll_loop.sh` + `lib.sh:notif

### [2026-07-28] willian/herdr-fzf-url
- **Overview**: **`herdr-fzf-url` (`Herdr fzf URL`, v0.1.0, `min_herdr_version 0.7.5`, `linux`/`macos`)** is a direct Herdr port of `wfxr/tmux-fzf-url`. It extracts URLs from the currently focused pane and presents them in an `fzf` picker running in a Herdr `popup` so the user can open (`Enter`), copy (`ctrl-y`), or multi-open (`ctrl-a`) without disturbing pane layout.
- **Key Features**: Verifiable surface is **1x `action` + 1x `pane`**. No event hooks, startup daemons, builds, link handlers, or HTTP API.  * **Action `pick` — `Pick URL from focused pane`:** `command = ["bash", "open-p

### [2026-07-28] scheron/herdr-want-to-sleep
- **Overview**: `want-to-sleep` (`scheron.want-to-sleep`, `0.2.0`, `min_herdr_version 0.7.0`, `platforms=["macos"]`) is a bedtime sleep-watch for Herdr. You arm it at night; it polls `herdr agent list` until no agent has been `working` for a continuous quiet period, the keyboard has been idle, and an optional `HH:MM-HH:MM` window allows it — then puts the Mac to sleep (or optionally shuts down) and appends a Markdown journal of what every agent was doing, explicitly calling out `blocked` agents that did not finish.
- **Key Features**: **Core watch (`herdr/wts.sh`, self-contained, also usable from a shell):**  * `wts.sh arm [minutes] [sleep|shutdown] [HH:MM-HH:MM]` — validates `jq` present and `herdr agent list` reachable, writes `$

### [2026-07-29] Soemii/herdr-jetbrains
- **Overview**: `Soemii/herdr-jetbrains` (`id = "jetbrains"`, `JetBrains`, `v0.1.0`, `min_herdr_version 0.7.5`) is a Developer Workflow launcher that opens the focused Herdr space in an external JetBrains IDE. `prefix+j` (`jetbrains.open`) auto-detects project type from top-level marker files and launches the first installed matching IDE; `prefix+shift+j` (`jetbrains.pick`) opens a popup to choose explicitly. It is a stateless, on-demand Go binary (~1307 LOC) with no daemon, event hooks, or background polling — all logic runs inside the `open` / `pick` / `picker` invocations.
- **Key Features**: **Declared surface in `herdr-plugin.toml` — 2x `actions` + 1x `panes`, no `[[events]]`, `[[startup]]`, or `link_handlers`:**  * `actions.open` — `Open space in JetBrains IDE`, `contexts=["workspace"]`

### [2026-07-29] nwarwick/herdr-caffeinate
- **Overview**: **Herdr Caffeinate** (`herdr-caffeinate`, `0.1.0`, `min_herdr_version 0.7.5`, `macos` only) is a fully automatic sleep guard: it holds a macOS idle-system-sleep assertion while at least one Herdr agent in the current Herdr session reports `agent_status: working`, and releases it ~30s after all agents stop working.
- **Key Features**: Verifiable surface is minimal: **1x `[[startup]]` + 4x `[[events]]`**, all invoking the same `sh scripts/reconcile.sh`. No `actions`, `panes`, `link_handlers`, `[[build]]`, or HTTP API.  Key behaviors

### [2026-07-29] kaar/herdr-fzf-url
- **Overview**: `kaar/herdr-fzf-url` (`kaar.fzf-url` / `fzf-url`, v`0.2.0`) is a direct Herdr port of `wfxr/tmux-fzf-url`. It scans the currently focused pane's recent scrollback for URL-like tokens, presents them deduped with newest-first in an `fzf` popup, and lets the user open (`Enter`) or copy (`ctrl-y`) the selection, with `tab` for multi-select.
- **Key Features**: No daemons, event hooks, or HTTP endpoints. The entire runtime is one user-invoked action + one interactive popup + one extractor + one test script:  **Picker workflow (`fzf-url.sh` running in popup):

### [2026-07-29] shivammehta25/herdr-file-picker
- **Overview**: `shivammehta25/herdr-file-picker` (`herdr.file-picker`, `File Picker`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a filesystem-to-prompt inserter for parallel agent work.
- **Key Features**: Verifiable surface is **6x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * `actions.pick` → `bash open.sh` — paths relative to pane directory. *

### [2026-07-29] johnlindquist/herdr-pane-update-timestamps
- **Overview**: **Pane Update Timestamps** (`johnlindquist.pane-update-timestamps`, `0.1.0`, `min_herdr_version 0.7.5`, `platforms = ["macos"]`) is a standalone Rust TUI that watches **one** Herdr pane and answers *when was output last observed* with a scrollable, timestamped transcript.
- **Key Features**: Verifiable surface is minimal: one `[[build]]` + one `[[actions]]` + one `[[panes]]`, no `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Two subcommands in one binary (`src/main.rs`):*

### [2026-07-30] jeph/herdr-pane-balancer
- **Overview**: **Balance Panes** (`herdr-pane-balancer`, `0.5.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a single-script Developer Workflow utility whose sole job is to **keep every pane in a Herdr tab equally sized**. It runs `python3 balance.py` on `pane.created`, `pane.closed`, and `pane.exited`, plus on-demand via a `workspace` action of the same script. If the current split-tree can already represent an equal layout it only evens `ratio` values; otherwise it rebuilds the tab into a tmux-style tiled shape while preserving on-screen row-major order and focus.
- **Key Features**: **Two-tier balancing strategy** (`balance.py` + `README.md` examples):  * **Fast path — even ratios only:** when `conforms(root, n)` is true — a pure same-direction chain, or a grid matching `target_s

### [2026-07-30] CowboyVang/herdr-which-key
- **Overview**: `CowboyVang/herdr-which-key` (`cowboyvang.which-key`, `0.2.0`, `min_herdr_version 0.7.5`, `macos`/`linux`) is a deliberately-invoked which-key overlay for Herdr. Press one bound key, see every `prefix+<chord>` binding grouped and labelled, press a second key to run it.
- **Key Features**: No event hooks, no daemon, no HTTP API. Verifiable surface is `[[build]]` + 2x `[[panes]]` + 4x `[[actions]]` in `herdr-plugin.toml`, all backed by `bin/which-key` (`src/whichkey/cli.py:main`):  * `sh

### [2026-07-30] jrswab/herdr-status
- **Overview**: `herdr-status` (`Status`, v`0.1.0`, `min_herdr_version 0.7.5`, `platforms = ["linux"]`) is an ambient, read-only machine-context pane for Herdr. Once linked or installed and enabled, it shows a live, ~1 Hz four-line stack — `user@host`, `CPU + MEM`, `LOAD 1/5/15m`, `time date` — in a pane titled `Status`, and it auto-opens that pane on session start/restore via a one-shot startup opener.
- **Key Features**: ### What the user sees  * **Live Status pane** (`[[panes]] id=status`): paints immediately on spawn, then repaints about every second. Per-field failure shows `--` without crashing or clearing other f

### [2026-07-31] funsaized/herdr-mise
- **Overview**: **Mise** (`mise.kitchen`, `0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a localhost-only, read-only visualizer that renders Herdr-detected coding agents as pixel-art line cooks in a restaurant kitchen.
- **Key Features**: ### Herdr-declared surface — minimal  `herdr-plugin.toml` declares exactly:  * `panes.kitchen` — `Mise Kitchen`, `placement = split`, `command = ["./target/herdr-plugin/herdr-mise/current/bin/herdr-mi

### [2026-07-31] aneym/herdr-voice
- **Overview**: `aneym/herdr-voice` (`id: herdr-voice`, `name: Voice`, `v0.2.0` in `herdr-plugin.toml`, `macos` only, `min_herdr_version 0.7.0`) is voice control for Herdr via the OpenAI Realtime API (`gpt-realtime-2.1` by default).
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * `[[build]]`: `npm install --omit=dev --no-fund --no-audit` — installs single runtime dep `ws`. * `panes.hud`: `title=voice`, `placement=popup`, `66

### [2026-07-31] mariotmc/herdr-source-control
- **Overview**: `herdr-source-control` (`id = "herdr-source-control"`, `v0.2.1`, `min_herdr_version 0.7.5`, `linux` only) is a lightweight, terminal-native Git status tab for Herdr. It shows changed files grouped as `Merge Changes / Staged Changes / Changes`, current branch + upstream ahead/behind, and offers safe branch checkout/creation and conservative upstream sync — explicitly not a full Git client.
- **Key Features**: **User-visible surface declared in `herdr-plugin.toml`:**  * `panes.source-control` — `Source Control`, `placement = tab`, `command = [sh -c exec "$HERDR_PLUGIN_ROOT/bin/herdr-source-control" tui]`. *

### [2026-07-31] atm028/herdr-panes
- **Overview**: This plugin — manifest id `local.pane-cycle`, name `Pane Cycle`, v`0.1.0` — is a pane-layout utility for Herdr in the **Developer Workflow & Utilities** domain. It does two related jobs in the active window (tab): positional shuffling of existing panes (`swap-previous` / `swap-next` / `rotate`), and wholesale geometric rebuilding of the split-tree through 12 tmux-style presets (`even-horizontal`, `tiled`, `golden-ratio`, etc.) via cycling, direct apply, or a single-key popup picker.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **17x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Position operations (`bin/pane-cycle.sh`):** 

### [2026-07-31] TheMetalStorm/herdr-cline-plugin
- **Overview**: `cline.integration` / `Cline CLI` (`0.2.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) makes a plain `cline` invocation from any Herdr pane look like a native Herdr agent with `source=cline` / `agent=cline`.
- **Key Features**: **Declared surface in `herdr-plugin.toml`:** one `panes.task` + two `actions`, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * `panes.task` — `Cline`, `placement=split`, 

### [2026-08-01] vercel-labs/herdr-vercel-sandbox-plugin
- **Overview**: **`vercel.sandbox` (`Vercel Sandbox`, `0.6.0`, `min_herdr_version 0.7.5`, `linux`/`macos`)** runs one coding-agent CLI per persistent, named Vercel Sandbox while keeping Herdr as the local terminal and attention-management surface.
- **Key Features**: Verifiable surface is **9x `[[actions]]` + 1x `[[panes]]`**, no events, startup, build, or HTTP API:  * **Onboarding (no Sandbox side-effects):** `connect-vercel` and `link-vercel-project` open a loca

### [2026-08-01] retroaalto/herdr-smartnav
- **Overview**: **`smartnav` / Smart Pane Navigation (`0.1.2`, `min_herdr_version 0.7.5`, `linux`/`macos`)** is a direction-aware replacement for Herdr's built-in `focus_pane_left/right/up/down`.
- **Key Features**: Verifiable surface is **1x `[[startup]]` + 4x `[[actions]]`** in `herdr-plugin.toml`, both backed by a single Go binary `herdr-smartnav`:  * **Actions (all `contexts=["workspace"]`, short-lived per-ke

### [2026-08-01] vgreg/herdr-padio
- **Overview**: **`vgreg/herdr-padio` (`padio.bridge` / `PadIO bridge`, v0.1.0, `min_herdr_version 0.7.0`, `macos` only)** is a context bridge, not a notifier, picker, or dashboard typical of the Developer Workflow & Utilities ledger. Its sole job is to report which app is running in Herdr's currently focused pane to the external [PadIO](https://github.com/vgreg/PadIO) controller mapper, so a game controller switches mode automatically — e.g. `claude` pane → agent mode, `zsh` → shell mode, `nvim` → vim mode.
- **Key Features**: Verifiable surface is minimal: **one `[[startup]]`, no `actions`, no `panes`, no `[[events]]`, no `[[build]]`, no `link_handlers`, no HTTP API.**  * **Continuous watch (default mode):** `python3 padio

### [2026-08-02] joshka0/herdr-watcher
- **Overview**: `herdr-watcher` is a durable supervision daemon for Herdr agents. It lets an agent arm background work from inside its own pane, end its turn immediately, and be resumed in the *same terminal* when a condition is met or when a closed roster of detached workers has reported.
- **Key Features**: **No event hooks, panes, or link handlers.** `herdr-plugin.toml` declares only lifecycle/status surface. All dynamic behavior is direct CLI invoked inside an agent pane:  * `herdr-watcher daemon` — ru

### [2026-08-03] Pimpmuckl/herdr-streamdeck
- **Overview**: **Herdr Stream Deck+** (`dev.herdr.streamdeck`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`/`windows`) is a physical triage and control panel for Herdr on Elgato Stream Deck+ hardware, not a terminal notifier, picker, or dashboard in the style of most Developer Workflow & Utilities plugins.
- **Key Features**: **What the user can do, verified in `src/plugin.ts`, `src/model.ts`, `src/render.ts`:**  * **Pin / focus / unpin threads (6 keys, UUID `dev.herdr.streamdeck.pin`):** tap empty slot pins `herdr.snapsho

### [2026-08-03] kay-ws/herdr-island
- **Overview**: **Island (`id = "island"`, `1.0.0`, `min_herdr_version 0.7.5`, `linux`/`macos`)** answers one triage question: *which agents are waiting on me, and why?*
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **2x `panes` + 5x `actions` + 1x `[[events]]` + 1x `[[startup]]`**. No `link_handlers`, `[[build]]`, or HTTP API.  **Display the stop reason:**  * `bin/app

### [2026-08-04] neon-solutions/neon-herdr
- **Overview**: **`neon.herdr` / `Neon` (`0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`)** is a terminal dashboard for managing Neon Postgres projects without leaving Herdr.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **5x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * `actions.dashboard` — `Open Neon dashboard in a split` (`co

### [2026-08-04] talent-factory/herdr-linear
- **Overview**: `herdr-linear` is a dual-purpose Rust crate: a pure-Rust `LinearClient` for Linear's GraphQL API, and — behind the `plugin` Cargo feature — a Herdr TUI plugin that renders a **"My Issues" panel** in a Herdr `split` or `tab` pane.
- **Key Features**: **Linear API client (`src/lib.rs`, `client.rs`/`models.rs`/`queries.rs` per README):**  * `get_viewer`, `get_teams` / `get_all_teams`, `get_team`, `get_team_issues` / `get_all_team_issues` * `get_issu

### [2026-08-04] RenKoya1/herdr-approve-all
- **Overview**: **RenKoya1/herdr-approve-all** (`renkoya1.approve-all`, `Approve All`, v`0.3.0`, `min_herdr_version 0.7.4`, `linux`/`macos`) is a Developer Workflow & Utilities plugin that solves permission-prompt pile-up across a fleet of parallel coding agents.
- **Key Features**: Verifiable surface is minimal: **3x `actions` + 1x `[[events]]`**, no `panes`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API. All logic is Bash:  * **`actions.approve-blocked` — `A

### [2026-08-04] nytafar/herdr-cache-ttl
- **Overview**: `cache-ttl` (`Cache TTL Countdown`, v`0.3.2`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a Developer Workflow utility that tracks LLM prompt-cache TTL per Herdr agent pane and surfaces it as a live countdown in the sidebar.
- **Key Features**: **What the user sees:**  * **Live countdown in agent sidebar:** `herdr.rs:format_remaining()` renders `Nm` above `seconds_threshold` (default 300s) and `m:ss` below it, `0m` when expired. `set_pane_to

### [2026-08-04] szrenwei/herdr-traex
- **Overview**: `herdr-traex` (`TraeX Agent Integration`, `v0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a bridge that makes external TraeX coding sessions visible in Herdr's Agent sidebar. It does not embed TraeX, poll processes, or add a Herdr pane UI. It installs TraeX-native `command` hooks that push lifecycle state over Herdr's local Unix socket when TraeX itself fires events.
- **Key Features**: Verifiable surface is exactly **3x `actions` in `herdr-plugin.toml`**, no `panes`, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API:  * `actions.setup` — `Set up Trae

### [2026-08-04] abtris/herdr-plugin-jira-pr
- **Overview**: `abtris.jira-pr` (`Jira PR`, `0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a pure-Bash Herdr plugin that answers one operational question for parallel-agent work: *did the agent carry the assigned Jira ticket into the PR it opened?*
- **Key Features**: **What the user sees:**  * **Sidebar line:** `#<pr-number> <KEY> <summary> · <status>`. Without Jira lookups: `#3346 KR-14644` bare. Failure modes: `⚠ #48 KR-9999 not in Jira` (candidates but none exi

### [2026-08-04] linuxing3/herdr-nnn
- **Overview**: `linuxing3/herdr-nnn` (manifest id `efwmc.file-explorer`, name `File Explorer`, v`0.1.0`, `min_herdr_version 0.7.0`, `platforms=["linux"]`) is a thin, stateless wrapper that hosts the external `nnn` terminal file manager inside a Herdr pane. It is explicitly `inspired by herdr-yazi` per `README.md` and follows the same pattern already surveyed in `speardragon/herdr-yazi` (2026-07-07): no editor code, no daemon, no event handling — just open `nnn` in the right directory via `herdr plugin pane open --cwd`.
- **Key Features**: Verifiable surface is **1x `[[panes]]` + 2x `[[actions]]` + 1x `[[build]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, background service, or HTTP API.  * **Pane `explorer`:** `title="Explorer

### [2026-08-05] allmight-ai/herdr-pet
- **Overview**: **Herdr Pet** is a companion V-Pet for Herdr: a 1-bit LCD house rendered in ANSI in a Herdr `split` pane that mirrors the status and current task of the user's coding agents. Species, rarity, shiny, name and combat stats are not rolled locally — they are deterministically forged as `HMAC(APP_SALT, github_id)` → `HMAC(root_seed, "pet:N")`, so wiping state re-derives the same pet.
- **Key Features**: **What the user sees:**  * **Mirror with moods:** `working → treinando`, `done → comemorando`, `blocked → curioso`, `idle → dormindo`, `unknown → confuso`, plus bounce/flair animation, rarity color, s

### [2026-08-05] napalmpapalam/herdr-quotr
- **Overview**: `napalmpapalam.quotr` (`quotr`, v`0.2.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a quote-back utility for parallel-agent work. One key over a focused Claude Code pane opens a full-screen `overlay` picker holding that session's whole transcript; the user drag-selects what the agent said, attaches a one-line question with `c`, banks multiple quote+question pairs, and presses `s` to type the batch into the agent's input box **without submitting**.
- **Key Features**: Verifiable surface is minimal: **1x `[[build]]` + 1x `[[panes]]` + 1x `[[actions]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Picker pane (`panes.picker`):** `title="quotr"

### [2026-08-05] hexsprite/herdr-beads
- **Overview**: **Beads Popover** (`beads.popover`, `0.1.0`, `min_herdr_version 0.7.4`, `linux`/`macos`) is a Ctrl-click detail viewer for [beads](https://github.com/steveyegge/beads) issue IDs appearing in any Herdr pane.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is exactly **1x `actions` + 1x `panes` + 1x `link_handlers`**. No `[[events]]`, `[[startup]]`, `[[build]]`, or HTTP API:  * **Link handler `bead` — `Show bead

### [2026-08-05] dio16/herdr-auto-update
- **Overview**: `dio16/herdr-auto-update` (`herdr-auto-update`, v`1.0.12`, `min_herdr_version 0.7.0`, `linux`/`macos`/`windows`) is a self-updating maintenance utility for Herdr itself. Herdr plugin v1 has no dedicated `plugin update` command, so this plugin implements update-as-reinstall: it enumerates installed plugins via the Herdr CLI, checks each GitHub-sourced plugin against its upstream ref via `git ls-remote`, classifies the relation via the GitHub compare API, and reinstalls outdated ones via `herdr plugin install <owner>/<repo> [--ref] --yes`.
- **Key Features**: Verifiable surface is a single Rust binary (`herdr-auto-update`) invoked 9 ways, plus human and `--json` output with scriptable exit codes (`0` ok/up-to-date, `1` updates-available / would-apply / ins

### [2026-08-05] a-curious-coder/herdr-iris
- **Overview**: **Iris** (`cmc.iris`, `0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a fuzzy cheatsheet for AI-agent skills/rules. Press a key, get an `fzf` popup listing skills, pick one, and Iris types its invocation string back into the pane you came from.
- **Key Features**: Verifiable surface is minimal: **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, background daemon, or HTTP API.  * **Action `open` — `Skills che

### [2026-08-05] nnexai/herdr-action-launcher
- **Overview**: `nnexai/herdr-action-launcher` (`nnex.action-launcher` / `Workspace Action Launcher`, `0.1.1`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a repository-aware fuzzy picker for manual workspace actions.
- **Key Features**: Verifiable surface is **1x `actions` + 1x `panes`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **`actions.open` — `Open workspace action picker`:** `contexts=["glob

### [2026-08-06] atomsbaza/herdr-ios-build-status-plugin
- **Overview**: **iOS Build Status** (`dev.herdr.ios-build-status`, `0.1.0`, `macos` only) is an on-demand build-and-test status pane for a single Xcode target. Configure once per workspace via an interactive action, then open the `iOS Build` split pane to run `xcodebuild build` followed by `xcodebuild test` against a booted iOS Simulator, getting back a one-line `✓/✗` summary with duration plus a tailed log.
- **Key Features**: Verifiable surface is minimal: **1x `actions` + 1x `panes`** in `herdr-plugin.toml`, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Configure iOS Build Target (`actions.

### [2026-08-06] marius-se/herdr-brainrot
- **Overview**: **Brainrot** (`id: brainrot`, `v0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a distraction-as-a-service Herdr plugin. Its stated mechanic — the “Chad-IDE mechanic” in code comments — is to automatically split open an entertainment pane when a coding agent in the focused workspace goes `working`, and close it when no agent is `working` anymore.
- **Key Features**: **Auto mode (on by default):** * Subscribes to `pane.agent_status_changed`. On `working` it sleeps `open_delay_ms` (default 6000ms), re-validates live state, then opens the pane with `--no-focus` next

### [2026-08-07] Efeguclu1/herdr-town
- **Overview**: Agent Town is a visualization and triage pane for Herdr parallel agents. Each Herdr workspace renders as a **town**, each distinct agent task-title as a **building under construction**, and each live agent pane as an animated 8-bit **worker** whose pose, building state, and speech bubble reflect Herdr `agent_status` (`working` / `blocked` / `done` / `idle`).
- **Key Features**: **Two map views + two interaction views**, all in `src/main.js:App`:  * **Town view (`mode='town'`):** scrollable skyline for one workspace. Buildings sorted urgent-first (`blocked > working > done > 

### [2026-08-07] jwkicklighter/herdr-prompt-library
- **Overview**: **Prompt Library** (`herdr.prompt-library`, `0.1.0`, `min_herdr_version 0.7.5`, `macos`/`linux`) is a file-backed reusable-prompt manager for Herdr. It merges two optional Markdown libraries — project-local `.herdr/prompts/` under the focused pane's project root and global `$(herdr plugin config-dir herdr.prompt-library)/prompts/` — into a single `popup` (85% x 80%) picker that inserts the selected prompt body literally into the pane that was focused when the picker was opened.
- **Key Features**: **Two CLI subcommands, one binary (`bin/herdr-prompt-library`):**  * `open` — invoked as Herdr `actions.open` (`Open Prompt Library`, `contexts=["pane"]`). Parses `HERDR_PLUGIN_CONTEXT_JSON`, requires

### [2026-08-07] RizRiyz/pixtui
- **Overview**: **`riz.pixtui` (`pixtui`, `0.1.0` in `herdr-plugin.toml`, `0.2.0 (PIX-1..6)` in `pixtui.py`)** is a full-screen, mouse-first pixel-art editor that runs inside a terminal pane. It is not an agent, notifier, or workflow utility like most of the Developer Workflow ledger — it *is* the pane content: canvas, Aseprite-style tools, palettes, layers, animation timeline, and PNG/GIF export, implemented in ~4.2k lines of pure-Python stdlib with no install step. The Herdr packaging is a thin wrapper around a pre-existing `bohay` module: one `tab` pane running `python3 pixtui.py` plus one right-click action to open it.
- **Key Features**: Verifiable surface is **1x `panes` + 1x `actions`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Editor (`pixtui.py:App`, `TOOLS`, `App._KEYS`, `HelpDialog.LINES`):**

### [2026-08-07] fabiogaliano/herdr-command-palette
- **Overview**: This is a **fuzzy command palette for Herdr**, in the VS Code / `fzf` tradition. It is already distinct from the earlier-surveyed `JanTvrdik/herdr-command-palette` (`jt.command-palette`): same problem, different implementation and richer presentation.
- **Key Features**: Verifiable runtime behavior lives almost entirely in `bin/palette.py`:  * **Live-agent group on top:** `agent_entries()` joins `agent list` with `workspace list` to get human `number`/`label`, tildes 

### [2026-08-08] opsydyn/herdr-questmancer
- **Overview**: `opsydyn/herdr-questmancer` (`opsydyn.questmancer`, `questmancer` v`0.1.8`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a cozy fantasy guild and dungeon control room for coding agents. Herdr workspaces become **campaigns** and Herdr agents become **adventurers**; one live model is rendered as an RGB pixel world with two rooms — **Guild Hall** (whole-party home) and **Delve** (active work in connected chambers).
- **Key Features**: **Two rooms, one selection.** `1`/`F1` Guild Hall, `2`/`F2` Delve. Both share selection, an in-world selection rune, and contextual parchment overlays for counsel, search, scrying, Chronicle, and adve

### [2026-08-08] narumiruna/herdr-plugins
- **Overview**: This repository is a single-plugin monorepo containing `github-pr-viewer` (`narumiruna.github-pr-viewer`, `0.1.0`, `min_herdr_version = "0.7.4"`, `linux`/`macos` only). It is a **read-only GitHub Pull Request Viewer** for Herdr: invoked from a workspace or by Control-clicking a `github.com/.../pull/<n>` URL, it opens a session-modal `popup` (90% x 85%) showing one PR's title, description, status, chronological conversation, and checks.
- **Key Features**: **What the user gets — three views in one popup:**  * `Overview`: repository, number, title, `state`, `DRAFT` flag, `reviewDecision`, `mergeStateStatus`, author, `base <- head`, `updatedAt`, URL, and 

### [2026-08-09] carellano/herdr-dev-servers
- **Overview**: **Herdr Dev Servers** (`id = carellano.dev-servers`, `min_herdr_version 0.8.0`, `linux`/`macos`) discovers local TCP `LISTEN` sockets that belong to development servers and presents them in a safe, evidence-backed Herdr `popup`. It keeps all discovery, correlation, revisioning, and destructive-action validation in a plugin-owned daemon; the CLI (`list`/`inspect`/`doctor`) and Bubble Tea TUI are thin clients of that daemon over a private JSONL IPC socket.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * `[[build]]`: `sh ./scripts/install.sh 0.1.2` * `[[startup]]`: `./herdr-dev-servers ensure-watch` * `[[events]] on = pane.created`: `./herdr-dev-ser

### [2026-08-10] blaxel-ai/herdr-blaxel-sandbox-plugin
- **Overview**: **`blaxel.sandbox` / `Blaxel Sandbox` (`0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`)** runs one coding-agent CLI per persistent, named Blaxel Sandbox while keeping Herdr as the local terminal and triage surface.
- **Key Features**: **No event hooks, background daemon, or HTTP API.** Verifiable surface in `herdr-plugin.toml` is `1x [[build]] + 11x [[actions]] + 7x [[panes]]`:  **Actions (all `command = ["node","src/action.mjs"]`,

### [2026-08-10] mikeyobrien/herdr-agent-profiles
- **Overview**: `herdr-agent-profiles` is a data-driven launcher for CLI coding-agent harnesses inside Herdr. Instead of hard-coding support for Pi, Hermes, Codex, or any specific provider/model, it turns opaque `command = [...]` argv arrays in `profiles.toml` into named launch targets with a Herdr-recognized `kind` and live agent `name`.
- **Key Features**: Verifiable surface is minimal by design — **2x `actions` + 1x `panes`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **`actions.launch` — `Agents: launch profile` (`c

### [2026-08-10] GHJQ/capslock-herdr-prefix
- **Overview**: `GHJQ/capslock-herdr-prefix` (`capslock-herdr-prefix` / `Caps Lock prefix`, v`0.2.0`, `min_herdr_version 0.7.0`, `platforms=["macos"]`) makes Caps Lock usable as the Herdr prefix key on macOS.
- **Key Features**: Verifiable surface is minimal and fully declarative in `herdr-plugin.toml`: **1x `[[startup]]` + 4x `[[actions]]`**. No `panes`, `[[events]]`, `[[build]]`, `link_handlers`, background daemon, or HTTP 

### [2026-08-10] tyler-jewell/herdr-plugins
- **Overview**: `tyler-jewell/herdr-plugins` is a public Herdr plugin **monorepo**, not a single plugin. It ships six independently installable, self-contained plugins under `jewell.*` ids (`min_herdr_version 0.8.0`, `macos`/`linux`): three LSP-equipping language plugins (`go-lang`, `rust-lang`, `lua-lang`), a `docs-wiki` per-repo `docs/*` wiki doctor + hooks, a `rules-steward` CAPS-policy to Herdr rules-agent bridge + harness migrator, and a Rust `agent-browser` wrapper around `vercel-labs/agent-browser`.
- **Key Features**: **`jewell.agent-browser` v0.2.0 (Rust):** multi-browser automation. Subcommands in `src/main.rs`: `open [url]` (default `https://example.com`), `snapshot|screenshot [--show] [--path]`, `show [--path] 

### [2026-08-10] zap0xfce2/herdr-pane-restart
- **Overview**: **Pane Restart** (`herdr-pane-restart`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a session-restore utility in the Developer Workflow & Utilities domain. Herdr restores workspace shape — tabs, panes, layout, `cwd` — on server restart, but not the processes that were running inside each pane.
- **Key Features**: Verifiable surface is minimal by design: **one `[[startup]]` hook, no `actions`, no `panes`, no `[[events]]`, no `link_handlers`, no HTTP API.**  What it does, per `src/main.py` + `README.md`:  * **La

### [2026-08-10] lfsmoura/led-agent-status
- **Overview**: **`led-agent-status` (`LED Agent Status`, `0.1.0`, `min_herdr_version 0.8.0`, `macos` only)** is an ambient physical notifier for Herdr parallel agents. It mirrors the aggregate status of all Herdr-detected agents onto a cheap BLE LED strip driven by the **ELK-BLEDOB** controller (sold as Lotus Lantern / duoCol Strip): solid blue for `working`, blinking red for `blocked`, solid green for `done`, soft white for `idle`/no agents.
- **Key Features**: No panes, overlays, background daemons, or HTTP endpoints. The verifiable surface is one startup hook, three event hooks, and three manual actions, all backed by the same script:  **Lifecycle / events

### [2026-08-10] klukacin/herdr-finder-reveal
- **Overview**: **Finder Reveal** (`klukacin.finder-reveal`, `0.2.0`, `min_herdr_version 0.7.5`, `platforms = ["macos"]`) is a single-purpose Developer Workflow utility: **Ctrl-click a local file path in a Herdr pane and reveal it in Finder**.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is exactly **1x `actions` + 1x `link_handlers`**. No `panes`, `[[events]]`, `[[startup]]`, `[[build]]`, or HTTP API.  * **`actions.reveal` — `Reveal in Finder

### [2026-08-10] tamdogood/herdr-pr-workflow
- **Overview**: **PR Workflow** (`tam.pr-workflow`, `0.1.1`, `min_herdr_version 0.8.0`) is a single-action prompt-router for GitHub pull requests. Invoked from a focused agent pane, it inspects the worktree's current PR state with `gh pr view` and then injects a long, prescriptive workflow prompt into that same agent via `herdr agent prompt` — either to create a tested, non-duplicate PR, or to drive an already-open PR to a safe merge.
- **Key Features**: Verifiable runtime surface is exactly **one user-invoked action, no panes, no events, no background service**:  * `actions.pr` — `Create or merge PR`, `contexts=["pane"]`, `command=["node","index.mjs"

### [2026-08-11] Unayung/herdr-watch
- **Overview**: `herdr-watch` (`id = "herdr-watch"`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) serves Herdr's live agent roster to an Apple Watch — and secondarily to a phone browser and to push notification — so an operator can see who is `blocked`/`done`/`working`/`idle`, read a cleaned pane screen, and answer a blocked agent from the wrist.
- **Key Features**: **Roster bridge (`bridge.js`, default `127.0.0.1:7860`):**  * `GET /health` — unauthenticated `{ok:true}` for systemd / `curl` checks. * `GET /` (`web/index.html`) + `GET /icon.png` — unauthenticated 

### [2026-08-11] Only-Moon/herdr-yazi-windows
- **Overview**: `moon.file-explorer` (`File Explorer`, v`0.3.0`, `min_herdr_version 0.7.0`) is a thin, stateless launcher that hosts the external **Yazi** terminal file manager inside a Herdr pane. It contains no file-browsing logic of its own; all tree navigation, preview, and file operations are delegated to the `yazi` binary run as `command = ["yazi"]`.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **2x `[[build]]` + 1x `[[panes]]` + 2x `[[startup]]` + 4x `[[actions]]`**. No `[[events]]`, no `link_handlers`, no HTTP API, no daemon, no keymap.  **Pane:

### [2026-08-11] cesarferreira/herdr-palette
- **Overview**: **`cesarferreira.herdr-palette` (`Herdr Palette`, v0.3.5, `min_herdr_version 0.7.0`, `linux`/`macos`)** is a fuzzy command palette and shortcut-learning aid for Herdr.
- **Key Features**: Verifiable surface is **one `[[build]]` + one `[[panes]]`**. No `[[actions]]`, `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  **Catalog (`src/catalog.ts:defaultItems()`): ~42 items in 6 c

### [2026-08-11] WillowMist/herdr-bitwarden
- **Overview**: **WillowMist/herdr-bitwarden** (`id = "bitwarden"`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a credential picker for Herdr.
- **Key Features**: Verifiable surface is minimal: **1x `panes` + 1x `actions`** in `herdr-plugin.toml`, no `[[events]]`, `[[startup]]`, `[[build]]`, or `link_handlers`.  * **Action `open-picker` — `Open Bitwarden picker

### [2026-08-11] wraithyy/herdr-hintr
- **Overview**: **`wraithyy/herdr-hintr` (`hintr` / `Hintr`, `0.1.0`, `min_herdr_version 0.7.0`)** is a which-key style cheatsheet for Herdr. One user-invoked action opens a small centered float that lists every `prefix+` binding parsed from the user's `config.toml`, with description. Pressing a listed key runs that binding directly (`plugin_action` / `shell`), `esc`/`q` closes with no side-effects.
- **Key Features**: Verifiable surface is **1x `actions` + 1x `panes`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **`actions.show` — `Hintr: show keybinding overlay`** (`contexts=["gl

### [2026-08-11] shrivatsas/herdr-model-capacity
- **Overview**: `shrivatsas/herdr-model-capacity` (`shrivatsa.model-capacity`, `Model Capacity`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a persistent, read-only Herdr split-pane that answers one question: how much usable quota or credit headroom remains on each explicitly configured model billing account, and when subscription windows reset.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is one `[[build]]` plus four `[[actions]]` plus one `[[panes]]`. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * `actions.probe` — `Show norm

### [2026-08-11] spywhere/herdr-now-playing
- **Overview**: `spywhere.now-playing` (`now-playing`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a status-line amenity, not an agent or workflow tool. It polls the host's music players once per invocation — or continuously via a detached background loop — and publishes the current track as `$now_playing_*` sidebar tokens for Herdr to render.
- **Key Features**: **Poll + report (no persistent UI):** * `monitor` (`scripts/music.sh` with no args): probes players in fixed order, extracts `state / position / duration / title / artist / app`, interpolates icons an

### [2026-08-11] clawsouls/clawsouls-herdr-plugin
- **Overview**: **ClawSouls** (`id = "clawsouls"`, `name = "ClawSouls"`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is an agent-identity viewer for Herdr. Where Herdr natively shows *what state* an agent is in (`working`/`blocked`/`done`), this plugin shows *who it is* by surfacing Soul Spec files (`SOUL.md`, `IDENTITY.md`, etc.) from the focused workspace.
- **Key Features**: Verifiable surface is exactly **3x `[[panes]]` in `herdr-plugin.toml`**, nothing else — no `[[actions]]`, `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **`panes.persona` —

### [2026-08-12] gambtho/herdr-devcontainer
- **Overview**: `gambtho/herdr-devcontainer` (`id = "devcontainer"`, `Dev Container`, `v0.2.0`, `min_herdr_version = "0.8.0"`, `platforms = ["linux"]`) lets Herdr panes run **inside the repository's existing Dev Container**. It does not define a new container format and does not parse `devcontainer.json`: a small Rust wrapper binary `herdr-devc` resolves the current repo, runs `devcontainer up`, maps the user's directory to `remoteWorkspaceFolder`, then replaces itself with `docker exec`.
- **Key Features**: Verifiable surface is **3x `[[panes]]` + 3x `[[actions]]` + 1x `[[build]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  | Pane `id` | Action `id` | Binary invocation | |---|---|--

### [2026-08-12] candypoets/buzzr
- **Overview**: `buzzr` (`id = "buzzr"`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a Rust Herdr plugin that mirrors the herd you already run into Buzz chat. In two sentences: it discovers Herdr Spaces and live agent panes via `herdr api snapshot`, creates or adopts one private Buzz channel per project Space, and binds each live agent label to a stable Nostr identity owned by a configured human pubkey. It does not launch agents; it provisions identities, reconciles channel membership and Nostr profiles, and routes explicit `@mention`s from Buzz back into the originating Herdr pane as a prompt with a credential-free, one-use reply command.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]]`: `bash scripts/install.sh` — prefers local `target/release/buzzr`, otherwise downloads `buzzr-v{version}-{os}-{arch}` + `.sha256` from 

### [2026-08-12] happyeric77/agent-keep-awake
- **Overview**: **`happyeric77/agent-keep-awake` (`herdr.keep-awake` / `Keep Awake`, `0.1.0`, `min_herdr_version 0.7.0`, `platforms=["macos"]`)** is a macOS-only sleep guard for Herdr.
- **Key Features**: Verifiable surface is **1x `[[startup]]` + 3x `[[actions]]`**. No `[[panes]]`, `[[events]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Lifecycle:** * `start.mjs` (startup): exits quietly if `modeE

### [2026-08-12] nkwork9999/ayatsumugi
- **Overview**: **`nkwork9999.ayatsumugi` (`Ayatsumugi`, `0.1.0`, `min_herdr_version 0.7.0`)** is a thin Herdr wrapper around a much larger local React-inspection system. From Herdr it does one thing: open a `zoomed` pane that prompts for a runtime source (`ayatori` vs `tsumugi`) and an absolute trace/snapshot path, then runs `npx --yes @noobknotsdev/ayatsumugi-terminal snapshot` to render React DOM, state-graph, and diagnostics as text in that pane.
- **Key Features**: **Herdr-declared surface is minimal: 2x `actions` + 2x `panes`, nothing else.**  * `actions.doctor` (linux/macos): `["npx","--yes","@noobknotsdev/ayatsumugi-terminal","doctor"]` * `actions.doctor-wind

### [2026-08-12] ram4-dev/herdr-notify-center
- **Overview**: **Notify Center (`ram4.herdr-notify-center`, `0.2.3`, `min_herdr_version 0.8.0`, `linux`/`macos`)** is a server-wide, durable inbox for Herdr agent attention. It subscribes to `pane.agent_status_changed` across all workspaces/tabs/panes, persists only terminal states (`blocked` / `done`) to a capped JSON queue, and exposes them in a manually-opened `popup` curses UI where `Enter` focuses the originating pane.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **2x `actions` + 2x `[[events]]` + 1x `[[panes]]`**. No `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **User-invoked actions (both `contexts=[

### [2026-08-13] gejiliang/herdr-openclaw
- **Overview**: `herdr-openclaw` (`id = "herdr-openclaw"`, `OpenClaw for Herdr`, `v0.1.0`) makes **OpenClaw TUI panes first-class Herdr agents**. Herdr's native agent detection is manifest-driven but silently ignores manifests for unknown agent ids — there is no way to add `openclaw.toml` — so this plugin takes the only viable route documented in `docs/findings-2026-08-12.md`: a detached Node watcher discovers panes whose foreground process is `openclaw-tui`, parses the TUI status line, and actively reports `idle / working / blocked / unknown` via `herdr pane report-agent`.
- **Key Features**: **Discovery and state reporting (core loop in `bin/watch.mjs`):**  * Polls `herdr pane list` every `HERDR_OPENCLAW_POLL_MS` (default 1200ms). Discovery of *new* panes via `pane process-info` runs on a

### [2026-08-13] third774/herdr-sidepulse
- **Overview**: **SidePulse** (`third774.sidepulse`, `0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos`/`windows`) is an ambient hardware notifier for Herdr in the Developer Workflow & Utilities domain. It reduces the agent roster from **every workspace** to a single aggregate display state and writes the corresponding LED program to every confirmed SidePulse Pro (8-LED SD) and SidePulse Dot (2-LED USB-C) device.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 3x `[[actions]]` + 1x `[[events]]`**. No `[[panes]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **Refresh (`refresh` / `Refresh Si

### [2026-08-13] ram4-dev/herdr-automations
- **Overview**: `ram4.herdr-automations` (`Automations`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a declarative job system for Herdr. Users author `automations.yaml` (`version: 1`) with `cron` (five-field + timezone), `interval` (`Ns`/`Nm`/`Nh`), and Herdr-event triggers, each bound to one `command` or `agent` action.
- **Key Features**: **Triggers:** * `cron`: `expr: "0 9 * * 1-5"` + `timezone`, via `croner@10` (`src/triggers/cron.ts`). Helpers `nextCronRunMs`, `previousCronRunMs` (uses stable `previousRuns(1)`), `latestDueCronOccurr

### [2026-08-13] a-curious-coder/herdr-plugin-manager
- **Overview**: **`a-curious-coder/herdr-plugin-manager` (`cmc.plugins` / `Plugins`, v0.7.0, `min_herdr_version 0.7.0`, `linux`/`macos` only)** is an in-Herdr package manager for Herdr itself. It replaces CLI-only `herdr plugin list|enable|disable|install|uninstall` and manual GitHub browsing with a single floating `popup` TUI (85%x85%): an **Installed** view to manage what you have and a **Browse** view to discover/install from the public registry, plus inspection, update, per-plugin action invocation/binding, and repo opening — all without leaving Herdr.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is minimal: **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]`**.  * **Action `open` — `Plugins` (`contexts=["workspace"]`, `command=["bash","open.sh"]`):**

### [2026-08-13] nimrc/herdr-git-pull
- **Overview**: **`git-pull` (`Git Pull`, v`0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`)** is a minimal Developer Workflow utility that adds the one Git mutation Herdr itself deliberately avoids: `git pull`.
- **Key Features**: Verifiable surface is exactly **1x `action` + 1x `pane`**. No event hooks, `startup`, `build`, `link_handlers`, background daemon, or HTTP API.  * **`actions.pull` — `Pull workspace repo`:** user-invo

### [2026-08-13] cdpath/herdr-warp
- **Overview**: `herdr-warp` drives the interactive Warp Agent CLI (`warp`) inside a Herdr pane. Warp has no headless/one-shot mode and Herdr has no built-in process detector or lifecycle hooks for it, so the plugin treats the terminal itself as the control surface: it opens a persistent `warp` TUI in a sibling split, submits prompts via `pane run`, answers approval cards via `send-keys`, and scrapes `pane read` to derive `idle / working / blocked / unknown / absent`.
- **Key Features**: Declared surface in `herdr-plugin.toml`: **1x `[[startup]]` + 1x `[[panes]]` + 13x `[[actions]]`**. No `[[events]]`, no `link_handlers`, no API endpoints.  * **Pane `agent` — `Warp Agent`, `placement 

### [2026-08-13] marcjfj-vmlyr/quickTUI
- **Overview**: **quickTUI** is not a workflow automation in the usual Herdr sense. It is a small TypeScript TUI framework — snap-together declarative primitives on top of OpenTUI's native `CliRenderer` — explicitly designed for coding agents: one `app({...})` object, plain-object mutable state, and a headless test harness.
- **Key Features**: Verifiable Herdr surface in `herdr-plugin.toml` is minimal — 1x `[[build]]` + 1x `[[startup]]` + 1x `[[actions]]` + 1x `[[panes]]`. No `[[events]]`, `link_handlers`, startup daemon, or HTTP API:  * `a

### [2026-08-14] alastairsounds/herdr-plugins
- **Overview**: `alastairsounds/herdr-plugins` is not one plugin but a monorepo of four small, independently installable Herdr utilities, all `min_herdr_version 0.8.0`. `herdr-starship` renders `starship` prompt modules into the workspace sidebar via `report-metadata`. `yazi-popup` opens Yazi in a `popup` and types picks back as unsubmitted `@path` references. `speak-status` speaks `done / waiting` aloud when any Herdr-detected agent changes status. `tally` stamps display-order `$num` tokens onto workspaces and panes to match sidebar order and `switch_workspace`.
- **Key Features**: **herdr-starship (`id = herdr-starship`, `macos,linux`):** * Renders composite `$starship` (`starship prompt`) plus per-module tokens (`$directory`, `$git_branch`, `$git_status`, `$git_state`, `$rust`

### [2026-08-14] fraction12/herdr-rainfrog
- **Overview**: **Rainfrog** (`id = "rainfrog"`, `v0.3.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a launcher and lifecycle wrapper that runs the external [Rainfrog](https://github.com/achristmascarl/rainfrog) database TUI inside a managed Herdr pane. It owns no database logic, no credential store, no connection parser, and no background service.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **2x `panes` + 6x `actions`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Panes:**  * `panes.rainfrog` — `Rainfrog`, `pl

### [2026-08-14] tareqmlx/herdr-lazygit-viewer
- **Overview**: **Lazygit** (`tareqmlx.lazygit-viewer`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a thin launcher that opens the external `lazygit` TUI on the repository behind the invoking Herdr pane. It offers four lazygit panels — Files (`status`), Branches (`branch`), Commits (`log`), Stash (`stash`) — in four Herdr surfaces — `split`, `tab`, `overlay`, `popup` — for sixteen declarative actions backed by a single Rust binary, `herdr-lazygit`. It owns no Git UI itself; all rendering and interaction are delegated to `lazygit` started in the resolved `cwd`.
- **Key Features**: Verifiable surface is **1x `[[build]]` + 1x `[[panes]]` + 16x `[[actions]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, background daemon, or HTTP API.  * **Sixteen user actions:** `status|bra

### [2026-08-14] AlexSamarsky/herdr-simple-prompts
- **Overview**: **Simple Prompts** (`herdr.simple-prompts`, `0.3.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a source-only Rust overlay for Herdr that shows only real user prompts and final Codex / Claude answers — and nothing else. It leaves the native agent pane untouched and running, follows that pane's on-disk JSONL transcript through agent-specific adapters, and provides a calm Ratatui history + multiline composer whose input is forwarded to the unchanged source pane. The mode is toggled with a user-bound `prefix+m` (`plugin_action herdr.simple-prompts.toggle`); a second invocation closes the view and refocuses the source.
- **Key Features**: Verifiable surface is minimal by design: **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  **Two binary modes (`src/main.rs`, `src/

### [2026-08-14] waynewu411/herdr-event-log
- **Overview**: `waynewu411.herdr-event-log` — **Herdr Event Log, v0.1.0, `min_herdr_version 0.7.0`** — is a durability shim for Herdr agent lifecycle observability.
- **Key Features**: **Event capture — no filtering, no daemon:**  * Single hook registration: `on = "pane.agent_status_changed"` -> `["./hook"]`. No `actions`, `panes`, `startup`, `build`, or `link_handlers` in `herdr-pl

### [2026-08-14] adamwangxx/herdr-codex-resume
- **Overview**: **Codex Resume** (`adam.herdr-codex-resume`, `0.1.1`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a tiny, stateless Developer Workflow utility with one job: resume a Codex session in a new Herdr-managed split without losing live Herdr context.
- **Key Features**: Verifiable surface is exactly **2x `actions`** in `herdr-plugin.toml`, no `panes`, `events`, `startup`, `build`, `link_handlers`, or HTTP API:  * **`actions.open` — `Codex: resume in a new split` (`co

### [2026-08-14] Brutheron/Renderd
- **Overview**: **Brutheron/Renderd (`brutheron.renderd`, `Renderd`, v0.4.0, `min_herdr_version 0.8.0`, `macos`/`linux`)** is a live-updating Markdown reader for *completed* agent responses.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):** one build, one action, one pane. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * `actions.open` — `Open response history`, `contexts=

### [2026-08-14] WerrySs/herdr-cmux-cwd-sync
- **Overview**: **WerrySs/herdr-cmux-cwd-sync** (`werryss.herdr-cmux-cwd-sync`, `cmux Safe CWD Sync`, v`0.1.1`, `min_herdr_version 0.7.0`, `platforms=["macos"]`) is a focus-driven bridge between Herdr and cmux.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 1x `[[actions]]` + 1x `[[events]]`**, all backed by the same stdlib-only script `scripts/sync_cmux_cwd.py`. No `panes`, `link_handlers

### [2026-08-15] A1exthegreat/herdr-agent-notify
- **Overview**: `A1exthegreat/herdr-agent-notify` (`herdr-agent-notify`, v1.1.0, `min_herdr_version 0.8.0`, `platforms = ["windows"]`) is a Windows-only, event-driven desktop notifier for Herdr agents.
- **Key Features**: **Core notification rule:** only `prev == working` and `cur in {idle, done, blocked}` notifies. First-seen panes never notify. `unknown` never notifies and never overwrites stored state. This filters 

### [2026-08-15] terafin/herdr-restart-always
- **Overview**: `herdr-restart-always` (`Herdr Restart Always`, v`0.1.2`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a supervision / self-healing utility in the **Developer Workflow & Utilities** domain. It closes a specific gap in Herdr: native agent session restore only fires on **server restart**, leaving an agent whose process dies inside a **running** server dead forever.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 4x `[[events]]` + 4x `[[actions]]`**. No `[[panes]]`, `[[build]]`, `link_handlers`, or HTTP API:  **Lifecycle / triggers (all `["/usr/

### [2026-08-15] donghaolicd/herdr-teams-notify
- **Overview**: **Herdr Teams Notify** (`local.herdr-teams-notify`, `0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos`/`windows`) is a dependency-free Node.js (`>=18`, ~1061 LOC JavaScript) event-bridge that sends bounded Microsoft Teams Workflow webhook notifications for Herdr agent lifecycle changes.
- **Key Features**: **Declared surface in `herdr-plugin.toml`: 5x `actions` + 3x `[[events]]`, no `panes`, `startup`, `build`, `link_handlers`, or inbound HTTP API:**  * `actions.status` → `node status.mjs`: prints `enab

### [2026-08-16] neyham/herdr-paddock
- **Overview**: Paddock is a full-screen Go Bubble Tea TUI that turns the live Herdr agent roster into a content-first card wall — described in `README.md` as a xiaohongshu-style waterfall feed. Each card is one agent tab, sorted `blocked > working > done > idle`, showing cleaned agent output rather than just a name and status dot.
- **Key Features**: **Declared Herdr surface is minimal — no events, no startup daemon, no HTTP API:**  * `panes.wall` (linux/macos, `placement=popup`, `command=["./paddock"]`) + `panes.wall-windows` (windows, `pwsh ... 

### [2026-08-16] moneycaringcoder/herdr-redact
- **Overview**: **`moneycaringcoder/redact` (`moneycaringcoder.redact`, `Redact`, v0.1.3, `min_herdr_version 0.8.0`, `linux`/`macos`)** is a read-only credential-exposure guard for Herdr agent panes.
- **Key Features**: **What it does:**  * **Polling scanner over agent panes:** one `session.snapshot` per cycle to enumerate panes, then one `pane.read` (`source: recent_unwrapped`, default 400 lines, default 5,000-line 

### [2026-08-16] AltanS/herdr-pouch
- **Overview**: **Pouch** (`herdr.pouch`, `0.4.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a prompt-stashing utility for Herdr parallel agents. The operator queues the next instructions while an agent is still `working`, then hands them over one at a time with a keypress or click.
- **Key Features**: **Declared Herdr surface in `herdr-plugin.toml`:**  * **2x `panes`:** `strip` (`placement=split`, `scripts/run.sh strip`, shrunk to 3 rows post-open) — three-row indicator pinned under an agent pane; 

### [2026-08-16] gdli6177/herdr-agent-team
- **Overview**: `gdli6177/herdr-agent-team` (`ligd.agent-team`, `Herdr Agent Team`, v`0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a project-scaffolding and launcher plugin for Markdown-defined agent teams. Running `init` copies a user-owned team definition — `playbook.md` plus `roles/leader.md`, `researcher.md`, `implementer.md`, `reviewer.md` under `.agents/team/` — into the current project and appends a managed block to `AGENTS.md`; running `start` launches or focuses a single workspace-scoped leader agent that reads owner instructions, the playbook, and the official `herdr` Skill before delegating work through Herdr.
- **Key Features**: Verifiable surface is exactly **3x `[[actions]]` in `herdr-plugin.toml`**, all `contexts=["workspace"]`, all `node src/*.mjs`. No `[[panes]]`, `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`

### [2026-08-17] catoncat/herdr-trail
- **Overview**: **Trail** (`envvar.herd-trail`, `0.2.2`, `min_herdr_version 0.8.0`) is a herd-wide shared memo list, not a per-session todo. Agents jot follow-ups mid-conversation via `trail_add` / `bin/herd-trail add` with automatic provenance capture, humans manage one global list in a floating `popup` TUI, and every entry links back to the conversation that created it via focus-or-resume.
- **Key Features**: **What the user gets:**  * **Global memo store:** single JSON file `todos.json` with short ids `t-xxxx` (4x base36, collision re-roll), `open|done` status, `created_at/done_at/updated_at`, and rich `s

### [2026-08-17] CristianPeralta/herdr-api-credit-bar
- **Overview**: **CristianPeralta/herdr-api-credit-bar** (`api-credit-bar` / `API Credit Bar`, v`0.1.1`, `min_herdr_version 0.7.0`, `platforms=["linux"]`) is a cost-visibility utility in the **Developer Workflow & Utilities** domain.
- **Key Features**: Verifiable surface is minimal: **1x `[[actions]]`, no `[[panes]]`, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API**.  * **`actions.open-alibaba` — `Open Alibaba cre

### [2026-08-17] haisi/herdr-plugin-command-palette
- **Overview**: This is a **keybinding command palette for Herdr**, not a plugin-action palette. It opens as an 80%x80% `popup` pane, resolves the user's *effective* `[keys.*]` set — Herdr built-in defaults overlaid with `~/.config/herdr/config.toml` overrides plus `[[keys.command]]` customs — offers it through `fzf`, and executes the selection via the `herdr` CLI where a server-side equivalent exists.
- **Key Features**: Verifiable surface is **one popup pane, no actions, no event hooks, no background service, no HTTP API**.  **What it can do:**  * **Effective-keymap resolution:** runs `herdr --default-config`, parses

### [2026-08-17] codingfragments/herdr-flash
- **Overview**: `herdr-flash` (`id: herdr-flash`, `0.1.0` in `herdr-plugin.toml` / `0.2.1` in `Cargo.toml`) is a Herdr port of `zellij-flash`: a floating scrollback selector for copying text out of a terminal pane that has scrolled past.
- **Key Features**: **Declared Herdr surface — 1 pane + 4 actions, no events:**  * `panes.flash`: `title: flash`, `placement: popup`, `command: ["./target/release/herdr-flash"]`. * Four thin launcher `actions`, all `herd

### [2026-08-17] VoidAxon/herdr-lens
- **Overview**: Herdr Lens is a Python, stdlib-only Herdr plugin that answers selected terminal text with AI in a popup. Select text with the mouse, press `prefix+alt+t/e/s`, and the same key translates a passage, gives a dictionary entry for a single word, identifies a bare identifier like `SIGTERM` or `--global`, or summarises a screenful of build output.
- **Key Features**: **Declared surface in `herdr-plugin.toml`:** 5x `actions` + 1x `panes`. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or inbound HTTP API.  * `actions.lens-translate` (`selection,pane,

### [2026-08-17] asumaran/herdr-confirm-close
- **Overview**: `asumaran.confirm-close` (`confirm-close`, `0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a pane-close safety guard for Herdr. It replaces the native `close_pane` key (`prefix+x`): an idle shell pane closes immediately, while a pane whose foreground job holds anything else — a coding agent, `vim`, `webpack serve`, a test run — opens a session-modal `popup` naming the process and only closes on `y`.
- **Key Features**: Verifiable surface is exactly **1x `action` + 1x `pane`**. No `[[events]]`, `[[startup]]`, `link_handlers`, background daemon, or HTTP API.  **`actions.close` — `Close pane (confirm if busy)`, `contex

### [2026-08-17] codingfragments/herdr-zextract
- **Overview**: `herdr-zextract` is a Herdr port of `zellij-zextract` (itself in the `extrakto` / `tmux-fingers` / `fzf-links` family). Press a keybind, a popup scans the previously-focused pane's scrollback — or the whole tab's — for typed entities, and presents them in a fuzzy-filterable picker for type-aware action.
- **Key Features**: **Declared Herdr surface:** `1x [[build]]` + `1x [[panes]]` + `14x [[actions]]`. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Pane `zextract`:** `title: zextract`, `placement: po

### [2026-08-18] aigorahub/herdr-lantern
- **Overview**: Lantern is a Herdr-hosted chat-operator for parallel coding agents. It opens as a `Lantern` tab in its own `🔥 lantern` workspace and `exec`s one user-chosen helper CLI — Cursor `agent`, `devin`, `claude`, `codex`, `grok`, or `pi` — with a large injected prompt that teaches that CLI to drive the herd via `herdr`.
- **Key Features**: **Declared Herdr surface is minimal:** one `panes.helper` (`placement = tab`, `command = ["sh","launch.sh"]`) and one `actions.open` (`Open lantern`, `command = ["sh","open.sh"]`). No `[[events]]`, `[

### [2026-08-18] wazum/herdr-polyglot
- **Overview**: **`wazum.polyglot` (`polyglot`, v0.3.0, `min_herdr_version 0.8.0`, `macos`/`linux`)** is a prompt-translation overlay for Herdr agent panes.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`): 1x `[[build]]` + 1x `[[startup]]` + 1x `[[panes]]` + 2x `[[actions]]`. No `[[events]]`, no `link_handlers`, no HTTP API.**  * `actions.prompt` — `polygl

### [2026-08-18] zackshen/herdr-telescope
- **Overview**: `zackshen/herdr-telescope` (`telescope` / `Herdr Telescope`, `0.1.2`, `min_herdr_version 0.8.0`, `linux`/`macos`) is an `fzf` command telescope for Herdr, implemented in Rust (~4k LOC, single binary `herdr-telescope`). It merges three previously separate ideas — the native tab/pane/workspace/agent list surfaced by `herdr-quick-actions`, the every-installed-plugin list surfaced by `jt.command-palette`, and a file finder — into one centered `70%x70%` `popup` that runs `fzf` in a real TTY. Typing `@` in place switches the list to files under the origin `cwd`; typing `/` switches to live `ripgrep` content search with a `bat`-highlighted preview.
- **Key Features**: Verifiable surface is minimal by design: **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, background daemon, socket server, or HTTP API.  * **Ac

### [2026-08-18] Slimydog21/herdr-nixos-vm
- **Overview**: **NixOS VM (`herdr-nixos-vm`, `0.1.0`, `min_herdr_version 0.8.0`, `macos` only)** is a thin Herdr operator for an *external* macOS-host + NixOS-guest workflow. It does not ship, build, or provision a VM.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 2x `[[panes]]` + 4x `[[actions]]`**. No `[[events]]`, `[[build]]`, `link_handlers`, or HTTP API. No socket calls were discovered.  **P

### [2026-08-18] bkarpinos/herdr-locksmith
- **Overview**: **herdr locksmith** (`herdr.locksmith`, `0.1.0`, `min_herdr_version 0.7.5`, `linux`/`macos`) is a stateless command palette for Herdr. Invoked as `herdr.locksmith.open` (README suggests `prefix+space`), it opens a `60% x 50%` `popup` running a single Go Bubble Tea binary (`bin/herdr-locksmith`).
- **Key Features**: **Declared surface is minimal:** one `[[actions]]` (`open`) + one `[[panes]]` (`palette`) + one `[[build]]`. No `[[events]]`, `[[startup]]`, `link_handlers`, background daemon, or HTTP API.  Key featu

### [2026-08-19] aorumbayev/herdr-canvas
- **Overview**: `herdr-canvas` is a dead-simple ASCII diagram canvas that is simultaneously a standalone Go binary and a Herdr plugin. There is one JSON file per diagram under `~/.local/share/herdr-canvas/`; the binary always re-renders the grid from those elements, never stores the grid.
- **Key Features**: **What the user can do:**  * **Draw in TUI (`internal/tui`):** mouse drag to place box/line/arrow/draw, click to select, `shift+click` to toggle, marquee select, drag-move with live preview + ghost (`

### [2026-08-19] qintmb/herdr-theme-picker
- **Overview**: `herdr-theme-picker` (`id = "herdr-theme-picker"`, `name = "Theme Picker"`, `v0.8.1`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a cosmetic utility for Herdr. It lets the user pick any [terminalcolors.com](https://terminalcolors.com) Ghostty-format palette from an `fzf` popup (`prefix+t`) and applies it to Herdr's UI chrome by rewriting the `[theme.custom]` block in `~/.config/herdr/config.toml` followed by `herdr server reload-config`.
- **Key Features**: Verifiable surface is **1x `panes` + 1x `actions` + 1x `keys.command`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **Picker popup (`panes.picker`, `placement = popu

### [2026-08-19] jorge07RD/herdr-ssh-manager
- **Overview**: `jorge07RD/herdr-ssh-manager` (`herdr-ssh-manager` / `SSH Manager`, v`0.7.1`, `min_herdr_version 0.8.0`, `linux`/`macos`/`windows`) is a saved-connection manager for SSH, not an agent, notifier, or multiplexer utility.
- **Key Features**: **Declared Herdr surface: 4x `panes` + 8x `actions` + 2x `[[build]]`. No `[[events]]`, `[[startup]]`, `link_handlers`, daemons, or HTTP API.**  * **Picker popup (`panes.picker` / `picker-windows`, `70

### [2026-08-19] GNURub/herdr-prompt-bucket
- **Overview**: **Prompt Bucket** (`dev.gnurub.prompt-bucket`, `0.1.0`, `min_herdr_version 0.8.0`) is a durable, ordered prompt queue for coding agents running in Herdr. Instead of coupling to one harness hook format, it subscribes to Herdr's normalized `idle` / `working` / `blocked` / `done` / `unknown` lifecycle and delivers user-authored follow-up prompts only when a target is stably settled.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is `2x build + 1x startup + 2x events + 3x actions + 2x panes`. No HTTP server, no link handlers.  **Triggers (`src/model.ts:TriggerSchema`):**  * `agent_sett

### [2026-08-19] gabriel-laet/herdr-cursor
- **Overview**: `cursor.cloud` (`Cursor Cloud Agents`, `0.2.0`, `min_herdr_version 0.8.0`) makes Cursor cloud agents (`bc-` ids) visible inside Herdr as roster and per-agent attach panes, plus local Cursor sessions as a secondary source.
- **Key Features**: **What the user gets:**  * **Roster TUI** (`herdr-cursor` / `roster`): live cloud-agent list via Ink + React. Re-polls every 5s (`HERDR_CURSOR_POLL_MS`). Keys documented in `README.md`: `↑/↓` select, 

### [2026-08-19] shanefully-done/herdr-pane-equalizer
- **Overview**: **Pane Equalizer** (`id = "pane-equalizer"`, `v0.3.0`, `min_herdr_version 0.8.0`) is a pane-layout utility in the Developer Workflow & Utilities domain. Its sole job is to keep Herdr tab splits uniformly sized without restructuring the layout tree, so running processes are never disturbed.
- **Key Features**: Verifiable surface is **3x `actions` + 4x `[[events]]`**. No `panes`, `startup`, `build`, `link_handlers`, or HTTP API.  **On-demand actions (`herdr-plugin.toml`, all `contexts = ["workspace"]`, all `

### [2026-08-19] oppenheimor/herdr-prompts
- **Overview**: **Herdr Prompts** (`oppenheimor.herdr-prompts`, `Herdr Prompts`, v`0.1.2`, `min_herdr_version 0.8.0`, `platforms=["macos"]`) is a keyboard-first, local-only reusable prompt library for Herdr.
- **Key Features**: Verifiable surface is minimal: **1x `action` + 1x `pane`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **Action `open` — `Open Prompt Picker`:** `contexts=["pane"]`,

### [2026-08-19] wenPKtalk/herdr-translate
- **Overview**: **`wenpktalk.translate` / Selection Translate (`0.2.0`, `min_herdr_version 0.8.0`, `macos`/`linux`)** is a minimal selection-translation utility in the Developer Workflow & Utilities domain.
- **Key Features**: Verifiable surface is **2x `actions` + 1x `panes`**, no events, startup, build, link handlers, or HTTP API:  * **`actions.zh` — `Translate selection to Chinese`:** `contexts=["selection"]`, `command=[

### [2026-08-20] xlinx/herdr-auto-yes-sir
- **Overview**: **`xlinx.herdr-auto-yes-sir` (`Herdr Auto Yes Sir`, v0.1.1, `min_herdr_version 0.8.2`, `linux`/`macos`)** is a Developer Workflow & Utilities auto-responder for parallel agents. When any watched Herdr agent enters `blocked` — the red needs-input state — a background Node monitor reads its recent output, classifies the prompt as a numbered-menu (`1`) or yes/no (`y`) shape, and auto-sends a single-character key after a 3-second cancellable countdown in a split pane.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **2x `actions` + 2x `panes` + 2x `keys.command`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  **User-invoked actions:** * 

### [2026-08-20] eliasstravik/herdr-chat
- **Overview**: **Herdr Chat** (`id = "herdr-chat"`, `Herdr Chat`, `1.0.0`, `min_herdr_version 0.8.2`, `platforms = ["macos"]`) is a rich, local-only chat overlay for live **Codex and Claude Code** sessions running inside Herdr.
- **Key Features**: Verifiable surface is minimal by manifest — **1x `[[actions]]` + 1x `[[panes]]` + 3x `[[build]]`** — all richness is runtime behavior:  * **Action `open` — `Open chat` (`contexts=["pane","tab","worksp

### [2026-08-20] timjonez/herdr-agent-notes
- **Overview**: **Agent Notes** (`id = "agent-notes"`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a sticky-note layer for Herdr agents in the Developer Workflow & Utilities domain. It answers *why is this agent idle* — `waiting on stakeholder`, `waiting on PR approval`, `blocked on review`, `parked` — by attaching a short, human-authored string to the focused agent pane and rendering it in the sidebar as a `$note` token.
- **Key Features**: Verifiable surface from `herdr-plugin.toml` is **1x `[[startup]]` + 3x `[[events]]` + 2x `[[actions]]` + 2x `[[panes]]`**:  **Popups (interactive):** * `panes.edit` — `Agent note`, `placement = popup`

### [2026-08-20] wynemo/herdr-agent-topic
- **Overview**: `herdr-agent-topic` (`Herdr Agent Topic`, `0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a Developer Workflow & Utilities sidebar-enrichment plugin. It reads the recent terminal output of each Herdr-detected agent pane, extracts the latest **user-submitted prompt** — not the model's reply or status line — and publishes it as the `agent_topic` metadata token so agent cards show *what you asked*.
- **Key Features**: Verifiable surface is one compiled binary invoked three ways; no `[[actions]]`, `[[panes]]`, `link_handlers`, or HTTP API:  * **Topic extraction from scrollback (`main.go:readPaneTopic`, `extractTopic

### [2026-08-20] AZenking/herdr-nodejs-center
- **Overview**: Server Center is a read-only, macOS-only Developer Workflow & Utilities panel for monitoring local JavaScript runtimes. It discovers live `node` / `bun` / `deno` processes via the system `ps` and `lsof`, enriches them with TCP `LISTEN` addresses, working directory, and uptime, and presents the result in a session-modal `popup` (90% x 80%) that auto-refreshes every 2 seconds.
- **Key Features**: Verifiable surface is **1x `actions` + 1x `panes`**, no events, startup, build, or link handlers:  * `actions.open` — `Open Server Center`, `contexts=["global"]`, `command=["node","src/open.js"]`. * `

### [2026-08-20] Yukaii/herdr-kakoune-popup
- **Overview**: `kakoune-popup` (`Kakoune Popup`, v`0.1.1`, `min_herdr_version 0.7.4`, `linux`/`macos`) is the Herdr-side companion for the external [`herdr.kak`](https://github.com/Yukaii/herdr.kak) Kakoune plugin. It provides a single native, session-modal `popup` (80% x 80%) where Kakoune can run arbitrary terminal commands — e.g. `herdr-terminal-popup lazygit` from Kakoune — without disturbing Herdr's tiled layout. The entire runtime is ~155 LOC of Shell: one manifest plus one `run.sh` runner, with no daemon, events, or agent logic.
- **Key Features**: Verifiable surface is **one `[[panes]]` entry, no `actions`, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API**:  * **Popup entrypoint (`herdr-plugin.toml: [[panes]] 

### [2026-08-21] guidodinello/herdr-routines
- **Overview**: `herdr-routines` (`id = "herdr-routines"`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a cron-style unattended scheduler that drives Herdr from the outside, not a conventional in-Herdr UI utility. It runs as systemd user timers with no resident daemon of its own, reads a YAML job list from `jobs.d/` or `jobs.yaml`, decides which jobs are due with catch-up-after-downtime semantics, and then shells out to the `herdr` CLI to create a pane/tab, start a coding agent (`claude`, `opencode`, and 20 other declared kinds), send it one prompt, wait for settle, and verify a `$ROUTINE_REPORT` file.
- **Key Features**: **Herdr-declared surface — actions only:**  * `actions.run` — `Run routine` → `sh scripts/herdr-plugin-run.sh`. Fixed argv, no parameter interpolation in plugin v1, so job name arrives via `HERDR_PLUG

### [2026-08-21] macintacos/herdr-scratch
- **Overview**: `user.scratch` / **Scratch Shell** (`0.6.1`, `min_herdr_version 0.8.0`, `macos`+`linux`) is a persistent, per-space scratch shell for Herdr.
- **Key Features**: Verifiable surface is one pane + one action + one event, backed by a six-subcommand Go CLI (`bin/herdr-scratch`):  * **`toggle` — `Toggle scratch shell`:** user-bound in `~/.config/herdr/config.toml` 

### [2026-08-21] husniadil/herdr-mail
- **Overview**: `husniadil/herdr-mail` (`herdr-mail` / `Mail`, `0.6.4`, `min_herdr_version 0.8.0`, `macos`/`linux`) is the async mailbox between agents running in Herdr panes.
- **Key Features**: What the operator / agent can do is the verb registry in `internal/verbs` — fourteen verbs exposed identically on CLI and MCP, sixteen CLI commands including `daemon`, `mcp`, `version`:  * `hmail send

### [2026-08-21] barnuri/herdr-auto-update
- **Overview**: `barnuri.auto-update` (`Auto Update`, `0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a self-maintenance utility for Herdr itself — not for Herdr plugins. A persistent Node.js watcher checks the installed `herdr --version` against the latest `herdrdev/herdr` GitHub release on a configurable interval and runs `herdr update [--handoff]` automatically, with independent `patch` / `minor` / `major` toggles (all on by default), one-time skip notifications, a tab-bar status line, and a log viewer.
- **Key Features**: **Core update loop:**  * `bin/watch.js` — long-lived `[[startup]]` process: checks immediately on Herdr server boot, then `setInterval(runSafely, checkIntervalMinutes * 60000)`. Handles `SIGTERM`/`SIG

### [2026-08-21] hidekingerz/herdr-plugin-mado
- **Overview**: `hidekingerz/herdr-plugin-mado` is not one plugin but a monorepo of three independently installable Herdr plugins that put the external TUI markdown viewer [`mado`](https://github.com/hidekingerz/mado) beside a working agent:
- **Key Features**: No HTTP API, no background service, no link handler (explicitly shelved — see §6).  **docs-peek — 1x `action` + 1x `pane`:** * `actions.peek` (`Peek at docs with mado`, `contexts=[pane,workspace]`, `s

### [2026-08-21] sd2k/herdr-thumbs
- **Overview**: `sd2k/herdr-thumbs` (`sd2k.thumbs`, `Thumbs`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a Herdr port of [tmux-thumbs](https://github.com/fcsonline/tmux-thumbs). Press a key over a focused pane, every URL, path, SHA, UUID and IP visible on screen gets a one-letter hint, press that hint and the match is copied, typed into the originating pane, or opened.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **3x `actions` + 1x `panes`**, no `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * `actions.pick` — `Pick text (copy)`, `contexts=["pane"]`, `

### [2026-08-21] abelfubu/herdr-popup
- **Overview**: `herdr-popup` is a minimal, stateless utility in the **Developer Workflow & Utilities** domain that fills one gap in Herdr core: Herdr has `[[keys.command]] type = "popup"` for keybindings but no built-in CLI/tool to open an ad-hoc shell command in a session-modal popup. This plugin provides a single generic `popup` pane entrypoint that executes whatever shell string the caller passes via `HERDR_POPUP_CMD`, with optional working directory and post-exit pause.
- **Key Features**: Verifiable surface is **1x `[[panes]]`, nothing else** — no `[[actions]]`, `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **`panes.popup` — `title = "popup"`, `placement = 

### [2026-08-21] H3xept/git-shepherd
- **Overview**: **H3xept/git-shepherd** (`h3xept.git-shepherd`, `git shepherd`, v`1.0.0`, `min_herdr_version 0.8.0`) is a sidebar-enrichment plugin for Herdr Spaces. In 2-3 sentences: for every Space it resolves the checkout/branch that Space sits on, asks GitHub whether that branch has an upstream pull request, and reports a single icon — `◌` draft, `●` open, `✔` merged, `✖` closed — as Herdr workspace metadata so the Space sidebar shows PR state at a glance without per-worktree `gh pr view` calls.
- **Key Features**: **What the user sees:** exactly one of four sidebar tokens per Space, styled in the user's own `config.toml`:  ```toml { token = "$pr_draft", fg = "#9198a1" } { token = "$pr_open", fg = "#3fb950" } { 

### [2026-08-22] Razz21/herdr-devserver-status
- **Overview**: `herdr-devserver-status` (`id = "herdr-devserver-status"`, v`0.2.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a dev-server lifecycle reporter for Herdr panes. A long-lived Rust daemon polls `herdr pane list`, confirms whether a newly-seen pane is running a known frontend dev server by resolving its foreground-process `argv` against a package-ownership check, then tracks that pane's terminal output to report `working` / `idle` / `blocked` agent state plus sidebar metadata (display label, `*_url`, `*_port`, `*_has_errors`).
- **Key Features**: **Detection (four seed specs in `frameworks/`):**  * `vite.yml` (`custom:vite` / `vite`): `bin_path_pattern: '(^|/)vite/bin/vite\.js$'`, `package_name: "vite"`. Richest signal table: `VITE v` (startin

### [2026-08-22] herdr-go/herdr-go
- **Overview**: **HerdrGo** (`id = "herdrgo"`, `name = "HerdrGo"`, `v0.2.1`, `min_herdr_version = "0.8.2"`, `linux`/`macos`) is a **native mobile remote-control bridge for Herdr**, not an in-Herdr TUI or notifier.
- **Key Features**: ### What the user invokes in Herdr  `herdr-plugin.toml` declares **7x `actions` (all `contexts=["workspace"]`) + 4x `panes`**, no `[[events]]`, `[[startup]]`, `link_handlers`:  * `setup` / `pair` / `s

### [2026-08-22] astwys/herdr-quick-prompt
- **Overview**: `herdr-quick-prompt` is a prompt-router for parallel agents. It turns sentences you re-type into agents over and over into plain files under `<plugin config-dir>/prompts/` — filename is the picker label, file content is the text — and sends the chosen text to a live agent pane with one keystroke, without manually focusing that pane.
- **Key Features**: Verifiable surface is **1x `action` + 1x `pane`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **`actions.send-prompt` — `Send a prompt to an agent…`**, `contexts=["w

### [2026-08-22] gridness/herdr-random-sounds
- **Overview**: **Random Notification Sounds** (`random-notification-sounds`, `0.1.0`, `min_herdr_version 0.7.0`, `macos` only) is a minimal, stateless audio notifier for parallel Herdr agents. When any agent pane transitions to `blocked` (needs input) it plays a random file from `~/.config/herdr-sounds/request`, and when it transitions to `done` (turn complete) it plays a random file from `~/.config/herdr-sounds/done`, using only Python stdlib + macOS `/usr/bin/afplay`.
- **Key Features**: Verifiable surface is exactly **one event hook, nothing else**:  * **Event:** `[[events]] on = "pane.agent_status_changed"` → `["python3", "random_sound.py"]` in `herdr-plugin.toml`. No `actions`, `pa

### [2026-08-23] rcosteira79/herdr-account-switch
- **Overview**: **`rcosteira.account-switch` / `Account Switch` (`0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`)** is a credential-swap utility for parallel-agent work.
- **Key Features**: **Profile lifecycle:**  * `save` — snapshot live login(s) into new profile(s). Bare `save` iterates `claude,codex` where `present()` is true; `save <kind> [label]` saves one. Refuses to duplicate an a

### [2026-08-23] giacolees/herdr-openlogi
- **Overview**: **OpenLogi Mouse** (`openlogi.herdr-mouse`, `0.3.0`, `min_herdr_version 0.7.0`) canonizes an ad-hoc Logitech mouse → Herdr integration into a versioned repo. While the Ghostty terminal (`com.mitchellh.ghostty`) is focused, OpenLogi mouse inputs — Back/Forward, GestureButton, DpiToggle, thumb-wheel, optional GestureUp/Down — fire `RunShellCommand` to a single POSIX `sh` Dispatcher (`bin/herdr-mouse`) that translates each input into a Herdr pane/tab/workspace CLI call.
- **Key Features**: **Dispatcher hot path (`bin/herdr-mouse`, 9 subcommands):**  * `focus-left / focus-right / focus-up / focus-down` → `herdr pane focus --direction <dir>`, parses `.result.focus.changed / .focused_pane_

### [2026-08-23] rcosteira79/herdr-readpending
- **Overview**: `rcosteira79/herdr-readpending` (`rcosteira.readpending` / `Read Pending`, `0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux`) is a manual triage marker for parallel agents.
- **Key Features**: Verifiable surface is minimal and fully declared in `herdr-plugin.toml`: **2x `actions` + 1x `panes` + 1x `[[events]]`**. No `[[startup]]`, `[[build]]`, `link_handlers`, daemon, or HTTP API.  * **`act

### [2026-08-23] rcosteira79/herdr-idle-shell-badge
- **Overview**: **`rcosteira79/herdr-idle-shell-badge`** (`rcosteira.idle-shell-badge` / `Idle Shell Badge`, `0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux`) badges Herdr agents that are holding a background shell.
- **Key Features**: Verifiable surface is **3x `actions` + 1x `[[events]]`**. No `panes`, no `startup`, no `build`, no `link_handlers`, no HTTP API:  * **Badge / clear:** `herdr pane report-metadata <pane_id> --source rc

### [2026-08-23] gbaeke/hrdr-azure-plugin
- **Overview**: **Azure Resources** (`baeke.azure-resources`, `0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a read-only cloud-inventory browser for Herdr. It lists the resource groups in the subscription currently selected by the Azure CLI, drills into one group to list its resources, and opens the selected resource as a deep link in the Azure portal.
- **Key Features**: Verifiable surface is **1x `panes` + 2x `actions`**, no events, startup, build, or link handlers:  * **Browse resource groups:** `az group list` sorted by name via JMESPath `sort_by([].{name:name, loc

### [2026-08-23] andischerer/herdr-plugin-echo
- **Overview**: `andischerer/herdr-plugin-echo` (`herdr-plugin-echo` / `Echo`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a tab-scoped keystroke broadcaster for parallel terminal work.
- **Key Features**: Verifiable surface is **3x `actions` + 1x `panes`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **`actions.mark` — `Echo: toggle focused pane`** (`contexts=["pane"]`

### [2026-08-24] AltanS/herdr-cache-alert
- **Overview**: Cache Alert is a prompt-cache observability plugin for Herdr parallel-agent work. It puts a live countdown on every agent pane — `⚡ 44m left`, `⚠ 4m left`, `❄ COLD` — telling the operator how much idle time remains before the LLM provider's cached prefix expires, and marking turns that already missed the cache and were billed at full input price.
- **Key Features**: **What the operator sees:**  * **Badge strings (`src/badge.ts`):** `⚡ Nm left` warm, `⚠ Nm left` expiring, `❄ COLD` cold, nothing for `unknown`. `humanLeft()` caps at 3 cells (`<1m`, `38m`, `2h`), rou

### [2026-08-24] jakekroon/herdr-pr-tracker
- **Overview**: `herdr-pr-tracker` (`PR Tracker`, `0.4.0`, `min_herdr_version 0.8.0`, `macos`/`linux`, Bun + TypeScript ~10k LOC) is a read-only GitHub pull-request widget for Herdr.
- **Key Features**: **Two views, one pane at a time:** * `authored` (default, pane title `My PRs`): `is:pr is:open author:@me archived:false` by default, ordered oldest-first, stable order that never re-sorts on status f

### [2026-08-24] choplin/herdr-next-agent
- **Overview**: **Next Agent** (`choplin.next-agent`, `0.1.1`, `min_herdr_version 0.8.2`, `linux`/`macos`) is a minimal, stateless navigation utility in the **Developer Workflow & Utilities** domain. It moves focus forward or backward through Herdr Agents whose semantic state matches a user configuration, across all workspaces and tabs.
- **Key Features**: Verifiable runtime surface is exactly **2x `actions` + 1x `[[build]]`**. No `panes`, `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * `actions.next` — `Focus next matching Agent`, `contex

### [2026-08-24] KarthusLorin/herdr-turn-coordinator
- **Overview**: **Turn Coordinator** (`karthuslorin.turn-coordinator`, `0.7.1`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a single-file Python supervisor for running **one blocking interactive-agent turn without model-driven polling**.
- **Key Features**: Verifiable runtime surface is **3x `actions` + 1x standalone CLI**, no panes, events, startup, build, or HTTP API:  * **`install-cli / uninstall-cli / doctor`** in `herdr-plugin.toml` (`contexts=["wor

### [2026-08-24] choplin/herdr-agent-metadata
- **Overview**: `herdr-agent-metadata` is a stateless-until-history Developer Workflow utility that adds two derived tokens to Herdr's Agents sidebar: `$updated` — the wall-clock time of an Agent's last semantic state change — and `$title` — a de-noised terminal title with workspace names, paths, and agent names stripped out.
- **Key Features**: **Two tokens, two independent pipelines:**  * **`$updated` (`internal/updated`):** History-dependent. Tracks `working | blocked | done | idle | unknown` plus `state_change_seq`. First detection stamps

### [2026-08-24] Andreslvc/herdr_plugin
- **Overview**: **`klv.pane-tools` / Pane tools (`Andreslvc/herdr_plugin`, v0.3.0, `min_herdr_version 0.8.0`)** is a small, stateless Developer Workflow utility with three jobs and nothing else: open the focused pane's working directory in VS Code, copy that directory to the system clipboard, and open an arbitrary folder as a new Herdr space via a native folder picker.
- **Key Features**: Verifiable surface is **6x `[[actions]]` in `herdr-plugin.toml`, nothing else**. No `[[panes]]`, `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **Open in VS Code (`open-vsc

### [2026-08-24] Efeguclu1/herdr-process-guard
- **Overview**: **Process Guard** (`herdr.process-guard`, `0.1.3`, `min_herdr_version 0.8.0`, `macos` only) is an agent-process inspector and lifecycle guard, not a generic cleaner. It attributes long-running workloads — Vite, `next dev`, `uvicorn`, `python -m http.server`, `node server.js`, and similar dev servers, test runners, and helpers — to the exact Herdr workspace, tab, pane, and coding agent that created them, explains in plain language whether they are `RELATED` and whether they are a `LEFTOVER`, and offers an explicitly confirmed graceful (`SIGTERM`) or follow-up force (`SIGKILL`) stop with a full tree preview.
- **Key Features**: **What the operator gets:**  * **Read-only audit:** `herdr-process-guard scan [--json]` via the `audit` action (`Process Guard: audit agent leftovers`). Renders `RELATED: YES/LIKELY/POSSIBLE/UNPROVEN`

### [2026-08-24] vigneshwerv/herdr-golden-ratio
- **Overview**: Golden Ratio is a pane-layout utility in the Developer Workflow & Utilities family — alongside `atm028/herdr-panes`, `jeph/herdr-pane-balancer`, `shanefully-done/herdr-pane-equalizer`, and `carsonjones/herdr-plugin-tiles` — whose sole job is to resize the focused pane to ~61.8% of its tab, in place.
- **Key Features**: Verifiable surface is minimal: **1x `[[build]]` + 1x `[[actions]]` + 1x `[[events]]`**. No `[[panes]]`, `[[startup]]`, `link_handlers`, or HTTP API.  **Manual `apply`:** `actions.apply` — `Golden rati

### [2026-08-24] choplin/herdr-quickselect
- **Overview**: **Quick Select** (`choplin.quickselect`, `0.1.1`, `min_herdr_version 0.8.2`, `linux`/`macos`) brings a Vim EasyMotion / `tmux-fingers`-style hint picker to Herdr terminal text. Invoked on the focused pane, it snapshots only the visible viewport, re-renders that snapshot in a mirrored temporary tab with 1–2 character hints (`asdfghjklqwertyuiopzxcvbnm`) overlaid on matched tokens, and on selection immediately runs a configured action — copy to clipboard, open in browser, or exec an external argv.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):** exactly 1× `[[build]]` + 2× `[[actions]]`, nothing else:  - `actions.copy` — `Copy visible item`, `contexts=["pane","workspace"]`, `["./herdr-quicksel

### [2026-08-24] choplin/herdr-split-pane
- **Overview**: **`choplin.split-pane` / Split Pane (`0.1.1`, `min_herdr_version 0.8.2`, `linux`/`macos`)** is a content-agnostic split-pane executor for Herdr. It exposes a single `split` pane that runs whatever shell string the caller passes in `HERDR_SPLIT_COMMAND`, then lets Herdr's native pane lifecycle close the split when that process exits.
- **Key Features**: Verifiable runtime surface is exactly **one `[[panes]]`, nothing else**:  * `panes.command` — `title = "Command"`, `placement = "split"`, no `[[actions]]`, no `[[events]]`, no `[[startup]]`, no `[[bui

### [2026-08-25] gokay-ai/sheep
- **Overview**: Sheep is **undo for AI coding agents** running inside Herdr. The standalone Rust binary (`sheep`, v`0.1.1`, `min_herdr_version 0.8.0`, `linux`/`macos` only) turns every finished agent turn into a restorable git checkpoint, and the Herdr adapter in `herdr-plugin/` makes that visible as a persistent timeline.
- **Key Features**: **Core CLI (`src/main.rs` over `src/ops.rs`):**  * `sheep doctor` — `repo::inspect` health: `Blocker::{UnmergedPaths, OperationInProgress, TooLarge, NestedRepositoryWithoutCommit}` refuses, `Warning::

### [2026-08-25] nikok6/herdr-pet
- **Overview**: **Herdr Pet** is a Developer Workflow amenity, not a productivity tool: a Codex-style animated sprite that floats over Herdr panes and acts out what the underlying coding agent is doing. It reuses the Codex pet atlas format (`pet.json` + `spritesheet.webp`) verbatim, so the 750+ community pets installable via `petdex`, `codexpet.top`, or `hatch-pet` work as-is; no pets are bundled.
- **Key Features**: **What the user sees:**  * **Status-mirroring with one-shot transitions:** `working → Running (typing)`, `blocked → Waiting (waves first)`, `done → Jumping then Review`, `idle/unknown → Idle (naps)`, 

### [2026-08-25] IsaiasZc/herdr-a2a
- **Overview**: `herdr-a2a` (`id = "herdr-a2a"`, `v0.0.2`, `min_herdr_version 0.8.2`) is an **A2A v1.0 delegation gateway for coding agents running under Herdr**. It lets one agent delegate work to another — `codex`, `claude`, `opencode`, `cursor`, `agy`, `amp`, plus any other kind Herdr reports — without managing panes, processes, or delivery timing.
- **Key Features**: **Operator surface — `herdr-plugin.toml`:** * `[[startup]]`: `node dist/main.js serve` — per-session daemon, idempotent. * `actions.doctor` (`contexts=["global"]`): `node dist/main.js doctor` — readin

### [2026-08-25] arvmaan/herdr-glance
- **Overview**: Herdr Glance is an **always-on-top macOS desktop widget for live Herdr agent status**, not an in-Herdr pane or notifier. It runs as a detached Tauri 2 + Rust application outside the Herdr TUI, stays visible across macOS workspaces, and answers one triage question at a glance: *who is `working` / `blocked` / `idle` / `done`, and how do I jump to them?*
- **Key Features**: **What the user gets:**  * **Three density modes**, cycled from the view button (`ui/app.js:VIEW_MODES = ["compact","list","detail"]`):   * `Compact` — priority agent pill + status color + `+N` overfl

### [2026-08-25] susomejias/herdr-awake
- **Overview**: **Herdr Awake** (`herdr.awake`, `0.2.2`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a sleep-guard for parallel-agent work. A single POSIX-sh daemon launched from a `[[startup]]` hook polls `herdr agent list` and holds an OS-level sleep inhibitor while any agent is `working`/`blocked`/`unknown`, releasing it when all agents are `idle`/`done` so the machine can sleep normally.
- **Key Features**: Verifiable runtime surface is **one startup hook + two CLI verbs, nothing else**. No `actions`, `panes`, `[[events]]`, `link_handlers`, `[[build]]`, or HTTP API.  **Busy/idle decision (`agent_state()`

### [2026-08-25] jerryfane/herdr-plan-approve
- **Overview**: **Plan Approve** (`jerryfane.plan-approve`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a single-purpose auto-responder for parallel-agent work. It exists to close one specific loop: an agent tasked "in plan mode" researches and writes a plan, Claude Code then stops on its `Ready to code? / 1. Yes, and use auto mode` modal waiting for a human keypress, and this plugin presses `Enter` for you so planning flows straight into execution.
- **Key Features**: Verifiable runtime surface is exactly **one global event hook, nothing else**. No `actions`, no `panes`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API, no daemon.  **Event handler 

### [2026-08-25] zackshen/herdr-translate
- **Overview**: **`herdr-translate` / Herdr Translate (`v0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos`)** is a select-to-translate utility for Herdr, in the Developer Workflow & Utilities family alongside `wenpktalk.translate` and `VoidAxon/herdr-lens`.
- **Key Features**: Verifiable surface is **2x `actions` + 1x `panes` + 1x `[[startup]]` + 1x `[[build]]`**. No `[[events]]`, `link_handlers`, or HTTP server.  **User-invoked:**  * `herdr-translate.toggle` (`contexts=[wo

### [2026-08-25] barnuri/herdr-command-palette
- **Overview**: `barnuri/herdr-command-palette` (`barnuri.command-palette`, `Command Palette`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is an F1-style fuzzy command palette for Herdr.
- **Key Features**: **What the user sees:**  * Unified searchable list, grouped visually by source label (plugin display name or `Herdr` for natives). Columns are `▸ title | source | key-chord`, with `visible/total` coun

### [2026-08-25] gwelican/herdr-keybinds
- **Overview**: `gwelican/herdr-keybinds` (`gwelican.keybinds` / Keybind Browser, `0.2.0`, `min_herdr_version 0.7.0`) is a read-only discoverability utility in the Developer Workflow & Utilities family. It provides a single live-filterable popup that merges Herdr's built-in key defaults, the user's `[keys]` overrides, `[[keys.command]]` customs, legacy `[keys.indexed]` entries, and every user-bound `plugin_action` into one searchable list.
- **Key Features**: Verifiable surface is minimal by design: **1x `panes` + 1x `actions`**, no events, startup, build, link handlers, or HTTP API.  * **Browser popup (`panes.browser`):** `title="Keybind Browser"`, `place

### [2026-08-26] vjeantet/herdr-palette
- **Overview**: This is a Sublime-Text / VS Code-style command palette for Herdr. One key (`plugin_action vjeantet.palette.open`) opens a session-modal `popup` picker that fuses three halves in one fuzzy list: 38 built-in Herdr operations (workspace/tab/pane/worktree/agent/config), every action of every other installed plugin, and the operator's own `[[command]]` / `[[prompt]]` entries from the plugin config file.
- **Key Features**: **Picker:** Typed query on top line, dim rule underneath (doubles as warning channel), fuzzy-filtered results with matched chars bold, key-hint column right-aligned dim with `prefix+` faded, selection

### [2026-08-26] TinocoAI/scp-explorer
- **Overview**: **SCP Explorer** (`id = "scp-explorer"`, `name = "SCP Explorer"`, `v1.1.1`, `min_herdr_version 0.7.0`) is a MobaXterm-style remote file browser for Herdr. In 2-3 sentences: you focus a pane where `ssh` is the foreground process and press `prefix+f`; the plugin opens a `split` pane alongside it that lists the remote host's filesystem, lets you navigate with keyboard or mouse, preview files, and `c` (get) / `p` (push) files and directories between remote and local. It reuses the existing SSH session via normal `ssh`/`scp` invocation — with optional `ControlMaster` reuse noted in comments — rather than implementing its own transport.
- **Key Features**: Verifiable surface is **1x `panes` + 1x `actions` + 1x `keys.command`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP/socket API.  **Launcher (`bin/scp-explorer-action`):**  *

### [2026-08-26] neospeed83/herdr-standup
- **Overview**: **Herdr Standup** (`id = "herdr-standup"`, `min_herdr_version 0.8.0`, `linux`/`macos`/`windows`) answers the daily-standup question — *what did you work on yesterday?* — from local Git evidence plus Herdr context. It collects yesterday's commits (in the operator's local timezone) that match each repository's configured `user.email` across all branches and worktrees, merges them with optional user-authored `today` / `blockers` notes from `config.json`, and renders a focused three-question Markdown report.
- **Key Features**: Verifiable surface is **3x `actions` + 1x `panes` + 3x `[[build]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, background daemon, or HTTP/socket API — consistent with the scanner finding of ze

### [2026-08-26] DeepRuparel/herdr-spotify
- **Overview**: **Spotify for Herdr** (`id = dev.spotify-herdr`, `v0.3.2`, `min_herdr_version 0.8.0`, `linux/macos/windows`) is a music-amenity plugin in the Developer Workflow & Utilities ledger — in the same family as `spywhere.now-playing`, `perlporter/apple-music-plugin`, and `gridness/random-sounds`, not a notifier, picker, or agent orchestrator.
- **Key Features**: **Declared Herdr surface in `herdr-plugin.toml`: 11x `actions` + 2x `panes` + 1x `[[startup]]` + 3x `[[build]]`. No `[[events]]`, no `link_handlers`, no HTTP API.**  Actions (all `contexts=["workspace

### [2026-08-26] aneym/unblock
- **Overview**: `aneym/unblock` (`id: unblock`, `Unblock`, `0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a human-in-the-loop ask queue for parallel coding agents, in the **Developer Workflow & Utilities** domain.
- **Key Features**: **Two-call agent contract (`src/mcp.js`, `hermes.py`, `skills/unblock/SKILL.md`):**  * `unblock_file` — non-blocking, unlimited open per agent. Returns `ticket`, agent keeps working, later `unblock_ch

### [2026-08-26] gustavocaiano/herdr-desktop-switcher
- **Overview**: `gustavocaiano/herdr-desktop-switcher` (`herdr-desktop-switcher`, `0.1.0`, `min_herdr_version 0.8.2`, `platforms=["macos"]`) is a macOS-only endpoint switcher for Herdr, not a session discoverer or generic launcher.
- **Key Features**: **Declared Herdr surface is minimal:** one `[[build]]` + one `[[panes]]` + one `[[actions]]`. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * `actions.open` → `/bin/bash scripts/summo

### [2026-08-27] tkmct/herdr-wsl-notify
- **Overview**: **WSL Windows Notify** (`tkmct.wsl-notify`, `0.1.0`, `min_herdr_version 0.7.0`, `platforms=["linux"]`) solves one narrow deployment mismatch: Herdr itself runs as the Linux binary inside WSL2, but the operator sits on the Windows 11 host and wants a native desktop toast the moment a parallel agent finishes or blocks for input.
- **Key Features**: Verifiable surface is **1x `[[events]]` + 4x `[[actions]]`**. No `panes`, `startup`, `build`, `link_handlers`, daemon, or HTTP API.  **Event hook — `notify.mjs`:** - Fires on all `pane.agent_status_ch

### [2026-08-27] iamgp/herdr-overview
- **Overview**: **Herdr Overview** (`herdr-overview`, `0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux`) is Mission Control / Exposé for Herdr: a live, tiled, read-only mirror of every space (workspace) in the current session, rendered as a terminal TUI in a session-modal `94% x 94%` `popup`.
- **Key Features**: Verifiable surface is minimal by manifest: **1x `actions` + 1x `panes`**, no declarative `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API. All liveness is runtime polling + runti

### [2026-08-27] ivorpad/herdr-tunnel
- **Overview**: `herdr-tunnel` is a Developer Workflow & Utilities plugin that puts a local TCP port on the public internet from inside Herdr. It lists what is actually listening on the machine with a project-aware label, starts a `cloudflared` quick tunnel (or `ngrok`) for the selected port as a detached process, scrapes the public URL out of that process's log, and shows it in-row for copy/open until explicitly stopped.
- **Key Features**: **Interactive popup (`./tunnels.py` with no args, what `panes.tunnels` runs):**  80%x70% `popup` TUI with header `⇅ Tunnels — N exposed · M services/ports`, sortable table `PORT | WHAT | KIND | LOCAL 

### [2026-08-27] hasuwini77/herdr-spinner
- **Overview**: **`hasuwini77/herdr-spinner` (`hasuwini77.spinner` / `Agent Spinner`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`)** is a cosmetic attention aid for parallel-agent work.
- **Key Features**: Verifiable surface is minimal by design: **1x `[[startup]]` + 2x `[[actions]]`**. No `[[panes]]`, `[[events]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **Animate `working` panes:** `spinner.js:f

### [2026-08-27] tmastalirsch/herdr-claude-safe-compact
- **Overview**: **Claude Safe Compact** (`tlv.claude-safe-compact`, `0.1.0`) is a Herdr startup daemon that types `/compact` into idle Claude Code panes — but deliberately later than an unconditional auto-compacter would.
- **Key Features**: Verifiable runtime behavior is a single polling loop plus a dry-run action. There are no panes, overlays, events, link handlers, or HTTP endpoints.  **Poll-and-compact loop (`safe-compact.sh` with no 

### [2026-08-27] ivorpad/herdr-reap
- **Overview**: `reap` (`Reap Agents`, `0.1.0`, `min_herdr_version 0.7.5`) is a lifecycle-triage utility for parallel-agent sprawl. It opens an `80% x 70%` `popup` that lists every Herdr-detected agent sorted with reapable agents first, and lets the operator focus one agent or close panes that are sitting idle at a prompt.
- **Key Features**: **Interactive TUI (`./reap.py` with no args, what `panes.agents` runs):**  * Header: `◆ Agents` + live right-side status `N agents · M finished · reap first|by workspace`, replaced by error text or tr

### [2026-08-28] KennethWKZ/herdr-ccs
- **Overview**: `herdr-ccs` (`kennethwkz.herdr-ccs`, `0.1.1`, `min_herdr_version 0.7.0`, `macos`/`linux`) is a launcher-compatibility shim for Herdr's built-in Claude Code integration. `ccs claude` (`@kaitranntt/ccs`) runs Claude Code inside a proxy/router whose foreground process is `node`/`ccs`, not `claude`, so Herdr does not detect the pane as a Claude agent and Herdr's canonical agent-level resume (`agent start --kind claude`) would relaunch bare `claude` and bypass `ccs`.
- **Key Features**: Verifiable runtime surface is three CLI verbs, exposed both as direct shell commands and as Herdr workspace actions. There are no panes, event subscriptions, startup hooks, link handlers, builds, or H

### [2026-08-28] polidog/herdr-gh-issue-label
- **Overview**: `polidog/herdr-gh-issue-label` (`GitHub Issue Label`, v`0.1.0`) is a small Bash-only Herdr plugin for the `1 issue = 1 worktree = 1 space` workflow. It resolves the GitHub issue corresponding to the branch checked out in the current Herdr workspace, fetches its title with `gh`, and surfaces `#<number> <title>` in the sidebar — either as a `$issue` metadata token or by rewriting the space name.
- **Key Features**: **Declared surface in `herdr-plugin.toml` is 2x `[[events]]` + 2x `[[actions]]`, nothing else:**  * `actions.label` — `Issue ラベルを貼り直す`, `contexts=["workspace","pane","global"]` → `bash bin/label.sh la

### [2026-08-28] liamwh/herdr-rich-notifications
- **Overview**: `liamwh/herdr-rich-notifications` (`Herdr Rich Notifications`, v`0.3.0`, `min_herdr_version 0.8.0`) is a native OS desktop notifier for Herdr agent lifecycle. On `pane.agent_status_changed` to `blocked` or `done` it builds a rich, deterministic title/body from Herdr's own metadata — agent kind, workspace/tab labels, stripped terminal title, `agent explain` matched rule, and a small excerpt from the detection snapshot — with **no LLM/model/network calls, ever**.
- **Key Features**: **Trigger and filtering:** * Single event hook: `on = "pane.agent_status_changed"` → `target/release/herdr-notifications event`. The binary itself gates to actionable states via `StatusKind::from_stat

### [2026-08-29] kukv/herdr-plugin-github-dash
- **Overview**: **GitHub Dash** (`kukv.github-dash`, `0.2.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) is a workspace-scoped GitHub browser for Herdr. Opened as an `overlay` pane for the current workspace's repository, it lists open pull requests and issues, renders a Markdown detail view with comments, and allows limited writes — posting comments, close/reopen, and retargeting labels/assignees — all delegated to the authenticated `gh` CLI.
- **Key Features**: Verifiable runtime surface is **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]` + 1x `[[link_handlers]]`**. No `[[events]]`, `[[startup]]`, background daemon, or HTTP/socket server.  **List view (`

### [2026-08-29] Phoobobo/herdr-bot
- **Overview**: **`Phoobobo/herdr-bot` (`phoobobo.herdr-bot`, `0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux`)** is a team-chat abstraction over live Herdr agents. One bot-team owns one Herdr session — in practice the default team `default` ↔ session `default` — with persistent roster, tags, harness bodies, DMs, and shared channels.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **8x `actions` + 1x `panes`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * `actions.bots` — `Resume default team` → `bun ru

### [2026-08-29] thesimonharms/herdr-cmd-agent-plugin
- **Overview**: This plugin makes the external **CommandCode (`cmd`) TUI a Herdr-recognized agent** with `idle` / `working` / `blocked` lifecycle. The core artifact is `agent-detection/cmd.toml`, a screen-scraping manifest that is installed as a local override to `~/.config/herdr/agent-detection/cmd.toml`.
- **Key Features**: **Declarative detection (`agent-detection/cmd.toml`, v1.0.0):**  * `blocked` (high priority, `region=whole_recent`, `visible_blocker=true`):   * `trust_dialog` p990: `Do you trust the files in this fo

### [2026-08-30] diegopzz/herdr-updater
- **Overview**: `diegopzz/herdr-updater` (`herdr-updater` / `Herdr Updater`, v`0.3.0`, `min_herdr_version 0.8.2`, `linux`/`macos`/`windows`) is a safe updater for Herdr itself, not a notifier, picker, or dashboard in the style of most Developer Workflow & Utilities plugins.
- **Key Features**: Verifiable surface is a single Rust binary (`herdr-updater`) invoked as Herdr actions, panes, and startup, plus a marketplace TUI. No `[[events]]`, no background daemon owned by Herdr, no HTTP/socket 

### [2026-08-30] 1Morganmore/herdr-activity-age
- **Overview**: **`activity-age.sidebar` / Activity Age (`0.1.0`, `min_herdr_version 0.8.2`, `platforms = ["windows"]`)** is a Windows-only sidebar-enrichment utility in the Developer Workflow & Utilities domain.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 2x `[[events]]` + 2x `[[actions]]`**. No `[[panes]]`, `[[build]]`, `link_handlers`, or network endpoints.  **Lifecycle hooks:**  * One

### [2026-08-31] abhishek944/herdr-pets
- **Overview**: Herdr Pets turns every live Herdr agent into a small animated citizen in a transparent village strip along the bottom of the desktop. It is a **Tauri v2 application built from scratch** — Rust backend plus TypeScript/CSS WebView — using **one lightweight window for the whole village**, never one window per agent.
- **Key Features**: Verifiable runtime surface is minimal: **1x `[[startup]]` + 3x `[[actions]]`**. No `[[events]]`, `[[panes]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **Lifecycle actions (`herdr-plugin.toml` → `

### [2026-08-31] shaozk/herdr-shadow-pane
- **Overview**: **Shadow Pane** (`shaozk.herdr-shadow-pane`, `0.0.1`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a tmux `synchronize-panes` port for Herdr. The `sync` action opens a session-modal `overlay` called the **Console**; every keystroke typed there is broadcast to all other panes of the current tab, while each target's visible screen is mirrored live side-by-side with a blinking reverse-video **Shadow Cursor** at the inferred input point. `CONTEXT.md` is explicit that this vocabulary is normative: `sync` is only the action id, the verb is **Broadcast**, the receivers are frozen **Targets**, the overlay is the **Console**.
- **Key Features**: Verifiable surface is minimal: **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Launcher (`actions.sync` — `Shadow Pane: broad

### [2026-08-31] aorumbayev/herdr-hyprland
- **Overview**: `herdr-hyprland` (`id = "herdr-hyprland"`, `name = "Hyprland Keys"`, `v0.1.0`, `min_herdr_version 0.8.2`, `platforms = ["linux", "macos"]`) ports Hyprland window-management *semantics* into Herdr without any Hyprland dependency — no `hyprctl`, no compositor, no window-manager integration.
- **Key Features**: What the user gets is a keymap plus one smart mover:  **Navigation (native Herdr actions, installed via config patch):** - `alt+←↑↓→` → `focus_pane_left/down/up/right` (keeps `prefix+h/j/k/l` defaults

### [2026-08-31] huketo/herdr-sheep
- **Overview**: **Herdr Sheep** (`id = "huketo.sheep"`, `v0.3.1`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a read-only observability pane for parallel coding agents. It turns every live agent in the current Herdr session into an animated ASCII sheep standing in a fenced pasture, where position and motion encode `agent_status` so a glance answers *who needs me*.
- **Key Features**: **Pasture visualization — the core capability:**  * One zone per Herdr state, top-down by urgency, empty zones omitted: `blocked → GATE`, `done → PEN`, `working → PADDOCK`, `idle → MEADOW`, `unknown →

### [2026-09-01] viko16/herdr-git-dirty
- **Overview**: `viko16.git-dirty` (`Git Dirty`, `0.1.0`, `min_herdr_version 0.7.5`, `macos`/`linux`) is a minimal sidebar-enrichment utility in the Developer Workflow & Utilities domain. It answers one question at a glance: *which Herdr Space has uncommitted work, and how much?*
- **Key Features**: Verifiable runtime behavior lives entirely in two Bash scripts (`bin/start.sh`, `bin/poll.sh`):  * **Dirty-count token:** `LC_ALL=C git --no-optional-locks -C "$cwd" status --porcelain=v1 --untracked-

### [2026-09-01] daocoding/herdr-claude-lifecycle
- **Overview**: `daocoding.claude-lifecycle` (`Claude Lifecycle`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a **hook-first lifecycle reporter for Claude Code panes**, not a pane UI, notifier, or launcher.
- **Key Features**: **Reporter mapping (`hooks/claude-lifecycle.py:decide()`):**  * `SessionStart` → `idle` + session identity. * `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `ElicitationResult`

### [2026-09-01] jovylle/herdr-pane-mark
- **Overview**: **`jovylle.pane-mark` / Pane Mark (`0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`/`windows`)** is a sidebar-enrichment utility for parallel-agent triage, not a launcher, notifier, or agent harness.
- **Key Features**: Verifiable runtime surface is **2x `actions` + 1x `panes`**, no `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API:  * **`actions.edit` — `Edit pane mark` (`contexts=["pane"]`, `["

### [2026-09-01] DillonWall/herdr-agent-numbers
- **Overview**: **Agent Numbers** (`agent-numbers`, `0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`) fills a single missing Herdr primitive: Herdr exposes a `number` ordinal for spaces and tabs but no `agent_index` for the agents panel, so `focus_agent` (`prefix+1..9`) cannot be visually matched.
- **Key Features**: Verifiable surface is **2x `actions` + 7x `[[events]]`**, no `panes`, `startup`, `build`, `link_handlers`, or HTTP API:  * **`actions.renumber` — `Renumber agents` (`contexts=["global"]`, `./renumber.

### [2026-09-01] MarlonPassos-git/herdr-ai-memory
- **Overview**: **Herdr AI Memory** (`marlonpassos.herdr-ai-memory`, v`0.3.3`, `min_herdr_version 0.8.0`, `linux` only) is a Herdr frontend for the external [AI Memory](https://github.com/akitaonrails/ai-memory) workstream system. Invoked from inside a Herdr pane via `herdr-ai-memory [--agent <harness>]`, it opens an 80% x 70% modal picker filtered to the current checkout, then resumes, fresh-starts, creates, or fail-closed terminates an `ai-memory run` session in a reproduced `hdl` layout (editor + agent + terminal).
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * `panes.picker` — `AI Memory`, `placement=popup`, `80% x 70%`, `command=["herdr-ai-memory-picker"]`. * `panes.restart-fresh-confirm` — `Restart Code

### [2026-09-02] cantona/herdr-triggers
- **Overview**: `herdr-triggers` (`id = "herdr-triggers"`, `v0.1.0`, `min_herdr_version = "0.8.2"`, `linux`/`macos`) is a resident regex-trigger daemon for Herdr.
- **Key Features**: **Daemon control — also the plugin actions:** `herdr-plugin.toml` declares six `global` actions, each a thin wrapper over the same `herdr-triggersd` subcommand: `triggers-start` → `start`, `triggers-r

### [2026-09-02] briankeegan1/herdkit
- **Overview**: **`briankeegan1/herdkit` (`herdkit`, v1.4.3, `min_herdr_version 0.7.0`, `macos`/`linux`)** is governance and parallelism for Herdr-based agent workflows, not a single-purpose notifier, picker, or dashboard.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`): 1x `[[build]]` + 6x `[[actions]]` + 1x `[[panes]]`. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.**  * `init` — `herd init` — interactiv

### [2026-09-02] huketo/herdr-cron
- **Overview**: `herdr-cron` v`0.2.2` (`min_herdr_version 0.8.2`, `linux`/`macos`/`windows`) is a scheduler for unattended work inside Herdr. In 2-3 sentences: it runs shell commands as direct child processes and coding-agent prompts inside Herdr panes on `cron` / `every` / `at` schedules, with catch-up, jitter, spend guardrails, and history. It is one pure-Go binary (`CGO_ENABLED=0`, no server, no database) with a JSON-first CLI designed as an agent's primary caller and a mouse-driven Bubble Tea TUI for the human asking "why did this not run at 03:00".
- **Key Features**: **Two job kinds, three schedule forms, three drivers over one primitive.**  * Jobs: `kind: shell` (`shell.command` + `shell: auto|none|<path>`) and `kind: agent` (`agent.prompt` + `agent_kind` default

### [2026-09-02] itsmistermoon/bindr
- **Overview**: `bindr` (`itsmistermoon.bindr`, `0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a keymap-profile manager for Herdr in the **Developer Workflow & Utilities** domain. It implements Zellij-style presets: each profile is a TOML snippet under `HERDR_PLUGIN_CONFIG_DIR/profiles/<name>.toml` holding only the `[keys]` table, and switching surgically replaces just that table in the live `~/.config/herdr/config.toml`.
- **Key Features**: Verifiable surface is **3x `actions` + 2x `panes` + 1x `[[build]]`**, no `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP/socket API:  * **`actions.switch-profile` — `bindr: switch profile` (`con

### [2026-09-02] OmarDadabhoy/herdr-agent-links
- **Overview**: **Agent Links** (`omardadabhoy.agent-links`, `0.1.0`, `min_herdr_version 0.7.4`, `linux`/`macos`) solves one narrow Developer Workflow gap: Herdr can Ctrl-click visible `http://`/`https://` text, but coding agents render `[useful label](https://target)` as styled text, leaving the target out of `pane read`.
- **Key Features**: Verifiable surface is **1x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, daemons, or HTTP/socket API (scanner confirms `Discovered Socket Calls: []`).  * **Ac

### [2026-09-02] Haichiu/herdr-pane-id-border
- **Overview**: **Pane ID Border** (`pane-id-border`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a minimal Developer Workflow & Utilities plugin that labels every tiled pane's border with its canonical public pane ID — e.g. `wD:p2` — preserving full workspace qualification and exact case so the ID can be copied verbatim into `herdr pane` / `herdr agent` commands.
- **Key Features**: Verifiable runtime capability is exactly one behavior, invoked from four entrypoints:  * **Full list-validate-rename pass (`sync.sh`):** calls `herdr pane list`, requires `.result.panes` to be an arra

### [2026-09-03] parker-brown-family/omarchy-crook
- **Overview**: Crook is a two-sided attention bridge, not an in-Herdr dashboard. The Herdr half — two POSIX `sh` scripts under `crook/` — publishes Herdr's live agent roster to a single JSON file at `~/.local/state/omarchy/crook/crook.json`. The Omarchy half — `Panel.qml` referenced by `manifest.json` as a `bar-widget`, not included in this bundle — renders that file as one bar icon plus a tray.
- **Key Features**: Verifiable runtime is exactly two scripts plus declarative manifest wiring:  **`crook-sync.sh` — publish + notify (short-lived, event-driven):** - Calls `herdr agent list` over the local socket on eve

### [2026-09-03] jimididit/herdr-open-editor
- **Overview**: `jimididit/herdr-open-editor` (`jdi.open-editor` / `open-editor`, v`0.1.0`, `min_herdr_version 0.7.4`, `macos`/`linux`) is a minimal Developer Workflow file-opener: fuzzy-pick a file with `fzf` and open it in the user's configured `$EDITOR`.
- **Key Features**: Verifiable surface is exactly **2x `actions` + 2x `panes`**, no events, startup, build, link handlers, or HTTP API:  * **`actions.pick` — `open-editor: pick file`** (`contexts=["pane","workspace"]`): 

### [2026-09-03] pauljohnchamberlain/herdr-guard
- **Overview**: Herdr Guard is a **guarded external-control bridge** for Herdr, not a dashboard, notifier, picker, or agent harness. Its stated purpose in `README.md` is to let an agent running **outside** the Herdr session — the author cites Codex Desktop managing a remote Herdr session — inspect that session and make a small set of explicit, reviewable workspace/tab changes without relying on the focused pane.
- **Key Features**: Verifiable surface is **2x `[[actions]]`, 0x `[[panes]]`, 0x `[[events]]`, 0x `[[startup]]`, 0x `link_handlers`**, no HTTP/socket server:  * `herdr-plugin.toml`: `actions.doctor` → `node dist/cli.js d

### [2026-09-03] enisbu/herdr-kitty-theme-sync
- **Overview**: **`enisbu/herdr-kitty-theme-sync` (`kitty-theme-sync` / `Kitty Theme Sync`, `0.1.0`, `min_herdr_version 0.8.0`, `platforms = ["linux"]`)** is a cosmetic sync utility in the Developer Workflow & Utilities domain.
- **Key Features**: Verifiable surface is minimal: **1x `[[startup]]` + 1x `[[actions]]`**, no `[[panes]]`, no `[[events]]`, no `[[build]]`, no `link_handlers`, no HTTP API. Total bundle is ~372 LOC, primarily Shell.  * 

### [2026-09-04] corygforsythe/herdr-flight-radar
- **Overview**: **Flight Radar** (`dev.coryforsythe.herdr-flight-radar`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a real-time ADS-B flight radar rendered as a Herdr `split` pane. It is backed by an external `dump1090` receiver (tested against `dump1090-fa`) and centered on an explicit user-configured lat/lon.
- **Key Features**: Verifiable surface is minimal: **1x `action` + 1x `pane` + 1x `keys.command`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API.  * **Action `open` — `Open Flight Radar` (`co

### [2026-09-04] gcgo/herdr-plugin-pane-id-namer
- **Overview**: **`local.pane-id-namer` / Pane ID + Agent Namer (`0.1.0`, `min_herdr_version 0.8.0`, `platforms = ["linux"]`)** is a tiny stateless housekeeping utility for Herdr parallel-agent sessions.
- **Key Features**: Verifiable surface is **1x `[[startup]]` + 3x `[[events]]` + 1x `[[actions]]`**, all invoking the same script. No panes, overlays, `[[build]]`, `link_handlers`, or HTTP/socket server:  * **Pane-label 

### [2026-09-04] parker-brown-family/herdr-auto-warm-cache
- **Overview**: This plugin is a cost-avoidance timer for LLM prompt-cache TTL. Most providers cache the conversation prefix server-side for ~1 hour: a cache *read* bills at ~0.1x input, a *re-write* after expiry at ~2.0x, so the first turn after an hour of silence costs ~20x. The header comment and `README.md` quantify this on one machine — 32,037 turns / 30 days, 87 cold returns, 24.2M tokens re-written, ~$230 wasted.
- **Key Features**: Key runtime behavior lives entirely in `keepalive.sh`:  **Three-beat schedule (all tunable via `config.env`):** * `DROWSY_AT=3000` (50 min) — pane marked `drowsy` in published `state.json` so an exter

### [2026-09-04] peterwiebe/herdr-plugin-agent-attention
- **Overview**: **Agent Attention** (`id = "agent-attention"`, `v0.2.0`, `min_herdr_version 0.7.5`) is a navigation triage utility for parallel-agent work. Pressing a hotkey cycles focus through only the agents that need human attention — `blocked` (waiting for approval/response) first, then `done` (finished-unseen) — in least-recently-viewed order, with an optional one-shot sort of the Agents panel to the same `blocked`/`done` filter.
- **Key Features**: Verifiable surface is **3x `actions` + 1x `[[events]]` + 1x `[[startup]]`**. No `panes`, `link_handlers`, `[[build]]`, or HTTP API.  **`actions.goto` — `Cycle to next agent needing attention` (`contex

### [2026-09-04] michmos/herdr-pomodoro
- **Overview**: `herdr-pomodoro` (`id: herdr-pomodoro`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a Pomodoro timing system for Herdr. It runs a single long-lived timer daemon per Herdr session, publishes a one-line status (`F: / B:`) that the user wires into `tab_bar_right`, and provides an `fzf` menu plus discrete start/pause/next/end/restart actions for control.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 1x `[[panes]]` + 7x `[[actions]]`**. No `[[events]]`, `[[build]]`, `link_handlers`, or HTTP API.  **Actions (all `contexts=["workspace

### [2026-09-04] yuloop/herdr-plugin-pane-move
- **Overview**: `yuloop/herdr-plugin-pane-move` (`yuloop.pane-move` / `Pane Move Shortcut`, `0.1.0`, `min_herdr_version 0.8.0`) is a minimal pane-layout utility in the **Developer Workflow & Utilities** domain. In 2-3 sentences: invoked on demand from a workspace, it snapshots the current pane and all other panes, lets the operator interactively pick a destination pane, then relocates the current pane into the destination's tab adjacent to that pane via `herdr pane move`. The `README.md` frames it explicitly as a downgraded port for upstream Herdr users — `调 pane.move + layout.rearrange` — with the fuller right-click-menu version remaining in the `yuloop/herdr` fork.
- **Key Features**: Verifiable surface is **one action, no panes, no events, no startup, no build**:  * `actions.move-pane` — `移动窗格`, `contexts=["workspace"]`, `command=["bash", "pane-move.sh"]`. Description: `交互式选择目标窗格并

### [2026-09-04] yuloop/herdr-plugin-win-terminal
- **Overview**: **`yuloop.win-terminal` / Win Terminal Profile (`0.1.0`, `min_herdr_version 0.7.0`, `windows`-only)** is a one-click installer for a Windows Terminal profile for Herdr — description: `一键安装 Windows Terminal herdr 配置`.
- **Key Features**: Verifiable capability is exactly **one user-invoked action, nothing else**:  * `actions.install` — `安装 Windows Terminal 配置`, `contexts = ["workspace"]`, `command = ["powershell", "-File", "scripts/ins

### [2026-09-04] akshat12/herdr-muse
- **Overview**: `herdr-muse` (`Herdr Muse integration`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a **lifecycle bridge that makes Muse Code (`muse`) a first-class Herdr agent**. Without it Herdr sees `muse` panes as `unknown`; with it they report `idle` / `working` / `blocked` with session identity.
- **Key Features**: Verifiable surface is minimal: **2x `actions`, no `panes`, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP API**.  * **Actions in `herdr-plugin.toml` (both `contexts=["w

### [2026-09-05] TawfiqAbubaker/scoopr
- **Overview**: **Scoopr** (`id = "scoopr"`, `v0.1.0`, `min_herdr_version 0.7.0`) is a fuzzy-searchable scrollback picker for Herdr, explicitly inspired by `extrakto` for tmux. Opened from a focused pane via `prefix+shift+c`, it extracts words, lines, paths, URLs, hashes, and quoted strings from terminal history in the current tab, space, or whole server, then either copies the selection via OSC 52 or inserts it back into the originating pane. It is ephemeral and stateless: no database, no background daemon, no network, single self-contained Rust binary rendered as an `80% x 80%` `popup`.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):** 1x `[[build]]` + 3x `[[actions]]` + 1x `[[panes]]`. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * `actions.open` — `Scoop text from

### [2026-09-05] Rockheung/herdr-kaku-bell
- **Overview**: **Kaku Tab Bell** (`rockheung.kaku-bell`, `0.1.0`, `min_herdr_version 0.8.0`, `platforms=["macos"]`) lights a dot on a [kaku](https://github.com/tw93/Kaku) outer-terminal tab when a Herdr agent starts waiting for a human. Herdr itself only toasts on `blocked` / `done` and only forwards `TerminalBell` for the focused pane when the in-pane program emits BEL, so background tabs — especially across `herdr --remote` servers — stay silent. This plugin works from outside Herdr: it finds the tty each `herdr` client occupies via `ps` and writes `\a` directly to `/dev/<tty>`, which kaku renders as an orange tab dot (plus optional Dock badge).
- **Key Features**: Verifiable surface is two CLI subcommands in one Python script, plus one startup hook and one (currently dormant) event hook. No panes, actions, link handlers, or HTTP API.  **`bin/kaku-bell ring [--l

### [2026-09-05] kuwa72/herdr-focus-attention
- **Overview**: `kuwa72.focus-attention` (`Focus Attention`, `0.1.0`, `min_herdr_version 0.7.0`) is a minimal, stateless navigation utility for parallel-agent triage. On each invocation it pulls `herdr agent list`, ranks agents by a user-configured status priority (default `blocked > done > idle`) and, within the same status, most-recent `state_change_seq` first, then focuses the next (or previous) pane in that queue so repeated presses cycle the whole attention queue. If nothing qualifies it shows a passive `No agent needs attention` toast instead of moving focus or failing silently.
- **Key Features**: Verifiable runtime surface is exactly **2x `actions`, no panes, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP/socket server**:  * `actions.next` — `Focus next agent ne

### [2026-09-05] youguanxinqing/herdr-hop
- **Overview**: **Herdr Hop** (`youguanxinqing.herdr-hop`, `0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`) is a pane-navigation utility: invoke a keybinding, read a large label drawn over each visible pane in the current tab, press that label's key to focus the pane.
- **Key Features**: Verifiable runtime surface is minimal by design: **1x `action` + 1x `pane`**, no `[[events]]`, no `[[startup]]`, no `link_handlers`, no HTTP API, no daemon.  * **Two subcommands in one binary (`src/cl

### [2026-09-05] Austinsuyoyo/herdr-autoreload
- **Overview**: **`autoreload` / `Config Autoreload` (`0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`)** is a tiny operational convenience: reload Herdr's `config.toml` the moment you save it, without restarting the server or pressing a key.
- **Key Features**: Verifiable surface is **1x `[[build]]` + 1x `[[startup]]` + 4x `[[actions]]`**. No `[[panes]]`, `[[events]]`, `link_handlers`, or HTTP API.  **Actions (all `contexts=["global"]`, all `./target/release

### [2026-09-05] Ghost-LZW/pane-identity
- **Overview**: **Pane Identity** (`id = "pane-identity"`, `v0.1.0`, `min_herdr_version 0.8.2`, `linux`/`macos`) is a display-only Developer Workflow utility that makes every Herdr pane self-identifying.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is `1x [[startup]] + 2x [[actions]] + 5x [[events]]`:  * **Actions (user-invoked, `contexts=["workspace"]`):**   * `refresh` — `Refresh pane identities` → `py

### [2026-09-05] zlj-zz/herdr-harbor
- **Overview**: **Harbor** (`herdr.harbor`, `0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux`) is a layout capture-and-relaunch system for Herdr workspaces. A single static Rust binary (`herdr-harbor`, ~8.7k LOC) snapshots the focused workspace — tabs, nested splits, pane commands, agent kind + session reference — into `~/.herdr/layouts/<name>.json`, rebuilds it later in a fresh workspace, keeps the store in sync via a resident daemon, and provides fuzzy navigation and stored-vs-live diff.
- **Key Features**: Verifiable surface is `[[build]] + [[startup]] + 3x [[actions]]` plus a rich CLI invoked directly. No `[[panes]]`, `[[events]]`, `link_handlers`, or HTTP API.  **Manifest-declared actions (all `contex

### [2026-09-05] moosingin3space/herdr-sleep-inhibit
- **Overview**: **Sleep Inhibit** (`herdr.sleep-inhibit`, `0.1.0`, `min_herdr_version 0.8.2`, `linux` only) is a Linux sleep-guard for Herdr parallel-agent work. It prevents desktop idle-sleep and suspend while at least one Herdr-detected agent reports `agent_status == working`, and releases the hold as soon as all agents go idle/done/blocked, the plugin is disabled/unlinked, or the Herdr server disappears.
- **Key Features**: **Core inhibit loop:** a detached Rust broker polls `herdr agent list` every 2s. If any agent is `working` it holds one `org.freedesktop.portal.Inhibit` request with `Idle + Suspend` and reason `A Her

### [2026-09-05] rchougule/herdr-highlights
- **Overview**: No source files were provided in the `CODE:` bundle for this survey, so a definitive functional assessment is not possible from code. By name, `herdr-highlights` suggests a Developer Workflow & Utilities amenity related to highlighting — e.g., surfacing, marking, or visually emphasizing terminal content — but that cannot be confirmed without a manifest, README, or implementation. The automated survey scanner recorded only `Primary Language: Rust` and `Supported Agent Scope: ["claude-code"]`, with no socket calls and no CLI commands discovered.
- **Key Features**: No verifiable capabilities can be listed from the provided bundle:  * **Features / commands / hooks / API endpoints:** None observed. The `CODE:` section was empty. * **Scanner facts:** `Discovered So

### [2026-09-05] assawalhy/herdr-stay-awake
- **Overview**: **`assawalhy/herdr-stay-awake` (`assawalhy.stay-awake`, `Stay Awake`, v`0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`/`windows`)** keeps the host machine from sleeping while any Herdr agent pane is `working`, and releases the hold as soon as the working-set goes empty.
- **Key Features**: Declared surface in `herdr-plugin.toml` is **1x `[[startup]]` + 1x `[[events]]` + 5x `[[actions]]` + 1x `[[panes]]`**, all backed by the same `node index.js` (~950 LOC JavaScript):  * **Working-set tr

### [2026-09-06] kedwards/herdr-awst
- **Overview**: `herdr-awst` (`id = "herdr-awst"`, `AWST` v`0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos` only) is a thin Herdr adapter for the external `awst` AWS toolkit (`github.com/kedwards/aws-tools`, developed against 3.15.0).
- **Key Features**: Verifiable surface is **3x `[[actions]]`, no `[[panes]]`, no `[[events]]`, no `[[startup]]`, no `[[build]]`, no `link_handlers`, no HTTP/socket server**:  * `actions.login` — `AWS login (awst)` → `["b

### [2026-09-06] alkevintan/deepseek-counter-herdr
- **Overview**: **`alkevintan/deepseek-counter-herdr` (`deepseek.status`, `DeepSeek Status`, v`0.3.0`)** is a cost-visibility utility for Herdr in the Developer Workflow & Utilities family, alongside `api-credit-bar` and `model-capacity`.
- **Key Features**: Verifiable runtime is a single Python CLI, `deepseek_status.py`, with six subcommands:  * **`status` — the statusline poll.** Fetches, `fold()`s, saves, then prints one line for Herdr to render. Imple

### [2026-09-07] TinyWhite1997/herdr-flash-picker
- **Overview**: **TinyWhite1997/herdr-flash-picker** (`herdr-flash-picker`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a fast, keyboard-only pane navigator for Herdr. It mirrors Herdr's built-in `prefix+g` navigator as a `100% x 80%` `popup` showing a `workspace → tab → pane` tree with aligned one- or two-letter labels, and focuses the target pane via `pane.focus` as soon as its label is typed. It is in the same family as surveyed `yoshiori.herdr-configurable-picker`, `youguanxinqing.herdr-hop`, `choplin.quickselect`, and `rmarganti.herdr-pluck`, but distinct in being prefix-free, pagination-based, and snapshot-driven with no daemon or event hooks.
- **Key Features**: Verifiable surface is minimal by design: **1x `[[build]]` + 1x `[[actions]]` + 1x `[[panes]]`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  * **Launcher (`actions.open` — `Open fla

### [2026-09-07] 8liang/herdr-gotify
- **Overview**: **`8liang/herdr-gotify` (`Herdr Gotify Notifications`, v0.2.0, `min_herdr_version 0.7.0`, `macos`/`linux`)** is a stateless push-notification bridge in the Developer Workflow & Utilities notifier family.
- **Key Features**: Verifiable surface is exactly **one `[[events]]` hook, no `actions`, `panes`, `startup`, `build`, or `link_handlers`**:  * **Terminal-state filter:** `notify.sh` lowercases the status and notifies onl

### [2026-08-14] AlexanderGrooff/herdr-pane-switcher
- **Overview**: **Pane Switcher** (`herdr.pane-switcher`, `0.1.0`, `min_herdr_version 0.7.5`) is a navigation utility for Herdr parallel-agent sessions. It does two jobs in one stateless-per-invocation Rust binary (`bin/herdr-mru-cycle`): **MRU cycle** — return to the most-recently-focused pane across all workspaces and keep stepping backward on rapid re-press — and **attention jump** — focus the first or next agent pane by `blocked > done > idle > working` priority.
- **Key Features**: **User-visible actions** — all three declared in `herdr-plugin.toml` with `contexts = ["global","workspace","tab","pane"]` and identical `command = ["sh","-c","exec \"$HERDR_PLUGIN_ROOT/bin/herdr-mru-

### [2026-09-05] Roshvan/herdr-plugin-shortcut-shepherd
- **Overview**: **Shortcut Shepherd** (`roshvan.shortcut-shepherd`, `0.0.1`, `min_herdr_version 0.8.0`) is a Herdr port of IntelliJ's Key Promoter X idea, stated explicitly in `README.md`. It starts automatically, watches tab / pane / workspace lifecycle, infers which Herdr action the user just performed with the mouse, and shows a `herdr notification show` toast with the configured shortcut.
- **Key Features**: **Declared surface in `herdr-plugin.toml`:** 1x `[[build]]` + 1x `[[startup]]` + 7x `[[actions]]` + 1x `[[panes]]`. No `[[events]]`, no `link_handlers`, no HTTP API.  * `actions.stats` (`Show shortcut

### [2026-09-07] thewtex/herdr-mem-cpu-load
- **Overview**: `thewtex.mem-cpu-load` (`Mem CPU Load`, `0.1.2`, `min_herdr_version 0.8.0`, `linux`/`macos`/`windows`) is a system-resource monitor for Herdr, ported in Rust from `tmux-mem-cpu-load`.
- **Key Features**: **Herdr-declared surface (`herdr-plugin.toml`):**  * `[[build]] x2`: `cargo build --release --locked`, then `target/release/herdr-mem-cpu-load --write-sidebar-rows` to seed `[ui.sidebar.spaces]`. * `[

### [2026-09-07] jeffbking/herdr-agent-prompt
- **Overview**: `herdr-agent-prompt` (`Agent Prompt Viewer`, `v0.1.0`, `min_herdr_version 0.7.0`, `linux`/`macos`) answers one question from inside Herdr: *what did I originally ask this agent?* Pressing `prefix+p` on a focused agent pane opens a session-modal `overlay` that renders the first user turn extracted from that agent's on-disk transcript, with multi-turn navigation, scrolling, and one-key copy.
- **Key Features**: **Declared Herdr surface is minimal: 1x `actions` + 1x `panes`:**  * `actions.open` — `Show agent original prompt`, `contexts=["pane","workspace","global"]`, `command=["python3","plugin.py","open"]`. 

### [2026-09-07] Aktrov/herdr-tts
- **Overview**: **herdr-tts** (`aktrov.herdr-tts`, `Herdr TTS`, v`0.2.5`, `min_herdr_version 0.8.0`, `linux`/`macos`) is an on-demand selection reader for Herdr. Select terminal text, invoke a keybinding, and hear it spoken in a local neural voice via Piper; a second binding stops playback.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[build]]` + 3x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP/socket API (scanner confirms `Discovered Socket Ca

### [2026-09-07] j1nn0/herdr-harvest
- **Overview**: **Harvest** (`j1nn0.herdr-harvest`, `0.1.1`, `min_herdr_version 0.8.2`, `linux/macos/windows`) is a completion-capture utility for parallel-agent work in the **Developer Workflow & Utilities** domain.
- **Key Features**: **Completion detection with foreground awareness:** `src/capture/completion.ts:decideCompletion()` admits only `done` and `idle` from `pane.agent_status_changed` as candidates. `shouldCaptureCompletio

### [2026-09-08] hmu332233/herdr-agent-restart
- **Overview**: **Agent Restart** (`dev.minung.agent-restart`, `1.0.0`, `min_herdr_version 0.7.4`, `linux`/`macos`) is a tiny, stateless Developer Workflow utility with one job: restart an `idle` coding-agent pane in place and resume the same conversation.
- **Key Features**: Verifiable surface is exactly **1x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, background daemon, or HTTP/socket server.  * **`actions.restart` — `Restart A

### [2026-09-08] LoriKarikari/kubeflock
- **Overview**: **Kubeflock** (`kubeflock`, `0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) provisions persistent AI-agent workspaces on Kubernetes and connects them to Herdr as remote machines.
- **Key Features**: Verifiable surface is **9x `actions` + 2x `panes` + 1x `build`** in `herdr-plugin.toml`. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API.  Actions (all `contexts=["workspace","pane"]`, al

### [2026-09-08] superfly/herdr-sprites-plugin
- **Overview**: **Sprites** runs Claude Code, Codex, OpenCode, or a custom coding-agent CLI in a persistent remote [Sprite](https://sprites.dev) while keeping Herdr as the local terminal and triage surface. Each Herdr agent pane gets its own dedicated Sprite named `herdr-<agent>-<hex>` (or `ci-` prefix for restricted credentials).
- **Key Features**: Declared surface in `herdr-plugin.toml` (`min_herdr_version 0.9.0`, `linux`/`macos` only) is **11x `actions` + 1x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP API. 

### [2026-09-08] lebryk/herdr-events
- **Overview**: **Herdr Events** (`herdr-events`, `0.3.0`, `min_herdr_version 0.9.0`, `macos`/`linux`) is a local, same-user event-delivery queue for coding agents. It lets an external program on the same machine and OS account submit a JSON payload once via CLI, then fans it out through each harness's **native** ingestion path — never by typing into the terminal or rewriting the editor.
- **Key Features**: **Core queue semantics (`events.py`):**  * **Immutable session binding:** `register <target> --harness <codex|claude|claude-channel|pi|opencode|mailbox> --session <id> [--endpoint --directory]` valida

### [2026-09-08] 8liang/herdr-ai-notify
- **Overview**: **Herdr AI Notify** (`8liang.herdr-ai-notify`, `0.2.0`, `min_herdr_version 0.7.0`) is a stateless event-bridge in the **Developer Workflow & Utilities** notifier family. It does not implement any notification transport itself. On every `pane.agent_status_changed` to `done` or `blocked` it formats a one-line task description and shells out to an external, pre-configured dispatcher — `ai-cli-complete-notify` (`ai-reminder.js`) — which owns Webhook / Telegram / Email / Desktop / Sound / Gotify delivery and optional AI summarization.
- **Key Features**: Verifiable surface is exactly **one `[[events]]` hook, nothing else**. No `actions`, `panes`, `startup`, `build`, `link_handlers`, or HTTP server.  Key behaviors, all in `notify.sh`:  * **Terminal-sta

### [2026-09-08] azyu/herdr-agent-auto-naming
- **Overview**: `azyu/herdr-agent-auto-naming` (`azyu.agent-auto-naming`, `Agent Auto Naming`, v`0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) solves addressability for parallel agents: `herdr agent prompt green-cow "..."` is typable from memory, `herdr agent prompt w15:p8 "..."` is not.
- **Key Features**: Verifiable runtime is one script invoked three ways with identical logic:  * **Event naming:** `[[events]] on = "pane.agent_detected"` → `["python3", "auto_name.py"]`. Names the single `pane_id` carri

### [2026-09-08] sazardev/herdr-pomodoro
- **Overview**: `sazardev/herdr-pomodoro` (`sazardev.pomodoro`, `Pomodoro`, v`0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a minimal, elegant Pomodoro timer for Herdr. It is a single static Rust binary (~900KB, `opt-level="z"` + LTO + stripped) rendered with `ratatui` as a dockable `split` pane, a transient `44x14` `popup` for a quick glance, and headless one-shot subcommands bound to global shortcuts.
- **Key Features**: **Four static, text-only moods, no icons/emoji/animation/borders:**  * `minimal` (`src/ui/minimal.rs`): one-line drawer strip — `WORK 24:59 running` + optional progress bar + toast. Usable in a narrow

### [2026-09-08] benbrackenbury/herder-zsh-refresh
- **Overview**: **Zsh refresh** (`benbrackenbury.zsh-refresh`, `1.0.0`) is a single-purpose Developer Workflow utility: after you edit `~/.zshrc` or other zsh startup config, one keypress runs `exec zsh` in every Herdr pane that is sitting idle at a zsh prompt.
- **Key Features**: Verifiable surface is exactly **one user-invoked action, nothing else**:  * **`actions.refresh` — `Reload zsh panes`**, `contexts=["workspace"]`, `command=["bash", "refresh.sh"]`. No `[[panes]]`, `[[e

### [2026-09-09] zetlen/herdr-bleatr
- **Overview**: **Herdr Bleatr** (`bleatr`, `Herdr Bleatr`, v`0.1.0`, `min_herdr_version 0.9.0`, `macos`/`linux`) is a spoken-notification plugin for parallel Herdr agents. When an agent in a tab the user is *not* looking at reaches `done` or `blocked`, it says one short sentence aloud — e.g. `Claude in herdr-bleatr finished the notifications plugin` — via macOS `say` or a Linux speech tool.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[events]]` + 1x `[[startup]]` + 1x `[[panes]]` + 5x `[[actions]]`**. No `link_handlers`, no HTTP/socket server.  **Event hook:** `on = "pane.agent_s

### [2026-09-09] testy-cool/herdr-open-nemo
- **Overview**: **Herdr Open Nemo Keybind** (`local.open-nemo`, `0.1.0`, `min_herdr_version 0.8.2`, `linux` only) is a single-purpose Developer Workflow utility: open the currently focused Herdr pane's working directory in a new **Nemo** file-manager window and bring that window to the foreground on Linux/X11 (tested on Cinnamon).
- **Key Features**: Verifiable surface is exactly **one user-invoked action, nothing else**:  * `actions.open` — `Open folder in Nemo` (`contexts=["pane"]`, `command=["/usr/bin/python3", "open.py"]`). No `[[panes]]`, `[[

### [2026-09-09] muretai/muretai-herdr-plugin
- **Overview**: **Muretai for Herdr** (`muretai.network`, `0.1.1`, `min_herdr_version 0.9.0`, `linux`/`macos`) gives every Herdr-managed coding agent a portable address on the Muretai network — signed, end-to-end-encrypted messaging between agents that belong to different people.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **7x `actions` + 7x `panes` + 1x `link_handlers` + 1x `[[events]]` + 1x `[[startup]]`**. No `[[build]]`, no background daemon, no HTTP API:  **User-invoked

### [2026-09-10] reobin/herdr-auto-name-pane
- **Overview**: This plugin gives every Herdr pane a short, human-memorable **callsign** (`neon`, `mars`, `lima`) so operators and agents can say `check the mars pane` instead of `wFB:p1`. It has two halves: a tiny POSIX-shell auto-namer that assigns the pane `label` on creation and backfills unlabeled panes at startup, and a checked-in agent `SKILL.md` that teaches harnesses to resolve that `label` back to a `pane_id` before calling `herdr pane|agent`.
- **Key Features**: Verifiable runtime is deliberately narrow — one job, two triggers, one manual action:  * **Auto-name on `pane.created`:** `scripts/name.sh` parses `HERDR_PLUGIN_EVENT_JSON` for `.pane.pane_id // .data

### [2026-09-10] t4t5/herdr-forkr
- **Overview**: **`forkr` (`0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`)** is a branch-an-agent utility in Developer Workflow & Utilities. One keypress on a focused pane running Claude Code, Codex, Pi, or OpenCode opens an independent copy of that conversation in a new tab, right/down split, or workspace in the same working directory, while the original keeps running.
- **Key Features**: Verifiable surface is **4x `[[actions]]`, nothing else** — no `[[panes]]`, `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP/socket server:  * `forkr.tab` — `Fork conversation into a 

### [2026-09-10] flowreaction/herdr-state-icons
- **Overview**: **State Icons** (`flowreaction.state-icons`, `0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux`) is a sidebar-enrichment utility in the Developer Workflow & Utilities family. It publishes one exclusive, colorable sidebar token per agent pane and per Space encoding lifecycle state — animated Braille spinner for `working`, static Nerd Font glyphs for `done` / `blocked` / `idle` / `unknown` — plus a short `done` hold after work completes.
- **Key Features**: Verifiable surface from `herdr-plugin.toml` is minimal: **1x `[[startup]]` + 2x `[[events]]` + 2x `[[actions]]`**. No `[[panes]]`, `[[build]]`, `link_handlers`, or HTTP/socket server.  **Lifecycle tri

### [2026-09-10] StGerman/herdr-claude-memories
- **Overview**: **`stgerman.claude-memories` / Claude Memories (`0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`)** is a Herdr plugin that surfaces and curates Claude Code's auto-memory.
- **Key Features**: Verifiable runtime is one Rust binary (`bin/herdr-claude-memories`) with four subcommands:  * **`reconcile` — landed, wired to `[[startup]]`.** Converges `~/.claude/settings.json` (or `$CLAUDE_CONFIG_

### [2026-09-10] Operator-create/herdr-kitchen-brigade
- **Overview**: **Kitchen Brigade** (`id = "kitchen-brigade"`, `v0.1.0`, `min_herdr_version 0.9.0`, `platforms = ["linux"]`) is a post-hoc verification gate for parallel coding agents.
- **Key Features**: **Declared Herdr surface in `herdr-plugin.toml`: 3x `actions` + 1x `[[events]]` + 1x `[[panes]]`. No `[[startup]]`, `[[build]]`, `link_handlers`.**  * `actions.expedite` — `Kitchen Brigade: expedite t

### [2026-09-10] natori-hrj/herdr-docs
- **Overview**: `herdr-docs` (`id = "herdr-docs"`, `Herdr Docs`, v`0.3.0`, `min_herdr_version 0.7.5`, `linux`/`macos` only) is a normalized document reader for Herdr. It answers the moment when a parallel agent produces a Markdown file, design note, PDF, or office document and the operator wants to read it without leaving Herdr.
- **Key Features**: **What the user gets:**  * **Reader TUI (`./target/release/herdr-docs reader [PATH]`):** alternate-screen, mouse-aware Ratatui app defined in `src/ui.rs:ReaderApp`. Four vertical sections: 3-row heade

### [2026-09-11] michaellandi/herdr-office
- **Overview**: Herdr Office (`id: office.view`, `v0.1.0`, `min_herdr_version 0.9.0`, `macos`/`linux`) is a Developer Workflow & Utilities attention-triage viewer. It renders every Herdr-detected agent as a person at a desk in an open-plan office in a full-screen terminal UI: `working` types, `idle` dozes, `done` celebrates, `unknown` shrugs, and `blocked` raises a waving hand with a speech bubble containing the actual approval question scraped from its screen.
- **Key Features**: **Floor + compact + empty layouts:**  * Tiled desk grid (`TILE_W 33 x TILE_H 16`) when the pane fits: nameplate (`Ada, Bo, Cass...` in floor order + `*` if focused + agent kind), tab-name wall card, s

### [2026-09-11] vika2603/herdr-machine-manager
- **Overview**: **Machine Manager** (`herdr.machine-manager`, `0.1.3`, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a Herdr plugin that manages Herdr's saved SSH machines from a session-modal popup.
- **Key Features**: Verifiable surface is minimal by manifest: **1x `[[startup]]` + 1x `[[panes]]` + 1x `[[actions]]`**, all invoking the same Go binary `./bin/machine-manager`. No `[[events]]`, `link_handlers`, or HTTP 

### [2026-09-11] lfsmoura/herdr-haptic-alert
- **Overview**: `lfsmoura/herdr-haptic-alert` (`mx-master.haptic-alert` / `MX Master Haptic Alert`, `0.1.0`, `min_herdr_version 0.7.0`, `platforms=["macos"]`) is a physical notifier for parallel-agent work in the **Developer Workflow & Utilities** domain.
- **Key Features**: Verifiable surface is **3x `actions` + 1x `[[events]]` + 1x `[[build]]`**. No `panes`, `startup`, `link_handlers`, or HTTP API.  **Event-driven alerts (`index.mjs event` path):**  * Subscribes to `pan

### [2026-09-11] yakovlevs01/herdr-yazi-links
- **Overview**: `local.yazi-links` / `Open file links in Yazi` (`0.4.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) is a file-navigation bridge for Herdr, not a file manager itself. In its stock mode, Ctrl-clicking a terminal OSC 8 hyperlink with a `file://` target opens the external Yazi TUI in a `split` to the right of the source pane with that file selected; `q` closes it.
- **Key Features**: **Stock plugin — hyperlink to Yazi:** * `link_handlers.files`: `pattern = "^file://"` → `actions.open` (`python3 open.py click`). * Validates URI with `urlsplit`/`unquote`: `scheme == file`, authority

### [2026-09-11] RadeJR/herdr-plugins
- **Overview**: **RadeJR/herdr-plugins** currently contains a single surveyable plugin: `project-picker` (`Project Picker`, `0.1.0`, `min_herdr_version 0.7.0`, `platforms = ["linux"]`).
- **Key Features**: Verifiable surface in `project-picker/herdr-plugin.toml` is exactly **2x `actions` + 2x `panes`**. No `[[events]]`, `[[startup]]`, `[[build]]`, `link_handlers`, or HTTP/socket API:  * **`actions.open`

### [2026-09-11] inoribea/herdr-goose-bridge
- **Overview**: **`goose.bridge` (`goose state bridge`, v`0.2.1`, `min_herdr_version 0.9.0`)** is a lifecycle-state bridge that makes `goose` panes visible to Herdr as real agents. Herdr has no native detector for `goose` — verified live on Windows where a running `goose` session still shows `powershell.exe` as the foreground process because `goose` is a line-mode CLI, not a full-screen TUI — so `goose` panes otherwise stay `unknown`.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 1x `[[panes]]` + 3x `[[actions]]`**. No `[[events]]`, `[[build]]`, `link_handlers`, or HTTP/socket server.  * **Watcher pane (`panes.w

### [2026-09-11] yonatangross/herdr-desktop-bridge
- **Overview**: **`floor.desktopbridge` / `Desktop Floor Bridge` (`0.1.0`, `min_herdr_version 0.9.0`, `macos`/`linux`)** is a dependency-free stdio MCP server that lets **Claude Desktop** observe a Herdr floor and leave it messages.
- **Key Features**: Verifiable surface is **exactly five MCP tools + one Herdr action + two dev scripts**, no panes, events, or HTTP:  **MCP tools (`bin/hq_floor_mcp.py:TOOLS`, `HANDLERS`):** - `floor_status` (read): con

### [2026-09-06] arvemy/herdr-convo
- **Overview**: `convo.herdr-convo` (`Herdr Convo`, `0.1.1`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a read-only conversation layer for Herdr. Herdr knows which agent occupies a pane and whether it is `working`/`blocked`/`done`, but does not read transcript contents; this plugin does.
- **Key Features**: **Herdr-declared surface is minimal:** exactly two `[[actions]]` in `herdr-plugin.toml`, no `[[panes]]`, `[[events]]`, `[[startup]]`, `[[build]]`, or `link_handlers`:  * `read-new-turns` — `Read new c

### [2026-09-10] GiorgiTarsaidze/herdr-profiles
- **Overview**: `GiorgiTarsaidze/herdr-profiles` (`herdr-profiles` / `Profiles`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) implements Chrome-style profiles for Herdr.
- **Key Features**: **User-visible surface declared in `herdr-plugin.toml`:**  * `[[build]]`: `sh scripts/install.sh` — install `bin/herdr-profiles` + bind hotkey. * `[[startup]]`: `./bin/herdr-profiles startup` — auto-o

### [2026-09-10] reobin/herdr-callsigns
- **Overview**: **Callsigns** (`herdr-callsigns`, `0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) auto-names every Herdr pane with a short, human-memorable callsign (`neon`, `mars`, `lima`) so humans and agents can say `check the mars pane` instead of `wFB:p1`.
- **Key Features**: Verifiable runtime is deliberately narrow — one job, two triggers, one manual action. No panes, overlays, daemons, or HTTP endpoints.  **Auto-naming:** - On `pane.created`, `scripts/name.sh` names the

### [2026-09-11] dmazlum/herdr-fleece
- **Overview**: **Fleece** (`id = "fleece"`, `0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) frames a coding agent's last answer for reading, copying, saving, or re-sending.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **7x `actions` + 2x `panes` + 2x `[[build]]`**. No `[[events]]`, `[[startup]]`, or `link_handlers` are declared; all eventing is runtime socket use from `d

### [2026-09-11] abhishekrana/herdr-dictate
- **Overview**: **`abhishekrana.dictate` / `Dictate` (v0.2.0, `min_herdr_version 0.9.0`, `platforms=["linux"]`)** is local speech-to-text dictation into the focused Herdr pane.
- **Key Features**: **User-visible Herdr surface (`herdr-plugin.toml`):**  * `actions.toggle` — `Dictate: toggle` (`workspace,pane`): start recording, or stop and insert transcript. Implemented as `./target/release/herdr

### [2026-09-11] utahta/herdr-codex-confirm
- **Overview**: `utahta.codex-confirm` (`Codex Confirm`, `0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a confirmation gate for selected Codex shell commands. Codex invokes it synchronously as a `PreToolUse` command hook before running a shell tool call; if the submitted command matches user-authored prefix patterns, the plugin opens a Herdr `popup` showing the full command, working directory, source pane, and matched rules, waits for Approve-once / Deny / Deny-with-feedback, and returns that verdict to Codex.
- **Key Features**: **What the user gets:**  * **Pattern-gated confirmation.** `examples/permissions.json` ships `git commit|push` plus selected `gh pr create|merge|close` and `gh issue create|edit|close`. Matching opens

### [2026-09-11] sevenzing/herdr-not-a-plugin
- **Overview**: **`sevenzing/herdr-not-a-plugin`** (`sevenzing.not-a-plugin`, `0.1.0`, `min_herdr_version 0.7.0`) is not a functional Herdr plugin. By its own manifest `name` — *"This is not a plugin, but rather a test for indexer or plugins"* — and its `README.md` — *"Just a test, nothing more"* — it is a negative-test fixture intended to exercise a plugin indexer, registry crawler, or install pipeline. It declares identity and a trivially succeeding build step and nothing else.
- **Key Features**: There are no verifiable capabilities. The surveyable bundle contains exactly two files with 8 total lines:  * `herdr-plugin.toml`: identity fields only + one `[[build]]`. * `README.md`: one sentence, 

### [2026-09-11] AdriaBA/herdr-hermes-bridge
- **Overview**: **AdriaBA/herdr-hermes-bridge (`hermes.live-state`, `0.2.0`, `min_herdr_version 0.9.0`)** is a lifecycle-authority bridge, not a screen-scraper enhancement.
- **Key Features**: **Hermes-side reporting (`hermes/herdr-live-state/__init__.py:register(ctx)`):**  | Hermes hook | Handler | Effect | |---|---|---| | `on_session_start`, `on_session_reset`, `on_session_end`, `on_sessi

### [2026-09-12] matdac12/herdr-prompt-deck
- **Overview**: **`matdac12/herdr-prompt-deck` (`prompt-deck`, `0.2.0`, `min_herdr_version 0.8.0`)** is a staging bar for the next agent turn.
- **Key Features**: No event hooks, no background daemon, no panes declared in the manifest, no HTTP/socket API. The entire Herdr surface is two toggle actions that run the same Rust binary in `launch` mode.  **Three too

### [2026-09-12] julianbonomini/herdr-agent-nav
- **Overview**: **`julianbonomini/herdr-agent-nav` (`herdr.agent-nav`, `0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`)** is an opinionated, keyboard-first navigation and naming aid for parallel Herdr agents.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **1x `[[startup]]` + 3x `[[actions]]` + 2x `[[panes]]`**. No `[[events]]`, `[[build]]`, or `link_handlers`.  **Actions (thin `node` shims):**  * `toggle-ac

### [2026-09-12] sergiopx/tmurdr
- **Overview**: **tmurdr** (`id = "tmurdr"`, v`0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a tmux muscle-memory shim for Herdr. It does not run a service, pane, or agent integration; it rewrites the user's `~/.config/herdr/config.toml` `[keys]` block to a tmux-parity keymap with `ctrl+space` as prefix, mapping tmux sessions → Herdr workspaces and tmux windows → Herdr tabs.
- **Key Features**: Verifiable surface is exactly **2x `actions`**, no `panes`, `events`, `startup`, `build`, `link_handlers`, or HTTP/socket API (scanner confirms `Discovered Socket Calls: []`):  * **`actions.apply` — `

### [2026-09-12] asermax/herdr-priority-view
- **Overview**: `asermax.priority-view` (`Priority View`, `0.5.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) reorders Herdr's **agent panel** by need-for-attention instead of recency.
- **Key Features**: **What the user sees:**  * Ordered agent sidebar. Implemented not by client-side filtering but by registering a server-wide agent view (`agent.view.set`, `label: "priority"`) that sorts by a plugin-ow

### [2026-09-13] gkzhb/herdr-plugins
- **Overview**: This bundle is a `pnpm` monorepo containing a single surveyable Herdr plugin: `herdr-plugins.agent-ntfy` (`Agent ntfy Notify`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`/`windows`). Its sole job is to send an `ntfy` push notification when a Herdr agent finishes a turn — `working → idle` for a viewed tab, or entry to `done` for background completion — enriched with workspace/tab/pane identity and, for Pi, the last assistant text.
- **Key Features**: **Declared Herdr surface (`plugins/agent-ntfy/herdr-plugin.toml`):**  * `[[events]] on = "pane.agent_status_changed"` → `["node", "src/index.ts"]` * `[[actions]] id = "test"` (`Send test ntfy notifica

### [2026-08-03] JJLiebig/herdr-streamdeck
- **Overview**: `JJLiebig/herdr-streamdeck` (`dev.herdr.streamdeck`, `Herdr Stream Deck+`, `0.1.0`, `min_herdr_version 0.8.0`) is a physical triage and control panel for Herdr on Elgato Stream Deck+ hardware, not an in-Herdr pane, notifier, or dashboard. It pins up to six Herdr threads per named page to the six left LCD keys, mirrors live `idle / working / blocked / done / unknown / offline` state with Herdr-themed OLED rendering, and exposes an `INBOX` attention key, one-shot `ACTIONS` mode, and four dial-strip regions for page, inbox, recent-thread, and settings control. Distribution is a prebuilt Stream Deck bundle (`dev.herdr.streamdeck.sdPlugin/bin/plugin.js`, built by Rollup from `src/*.ts`) installed by Herdr `[[build]]` scripts into Stream Deck (Windows/macOS) or OpenDeck (Linux).
- **Key Features**: **Herdr-declared surface is minimal:** two platform-twinned `[[actions]]` and two `[[build]]` entries, no `[[panes]]`, `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP API:  * `pin-focused-pane` 

### [2026-09-12] Nofuture123/herdr-zcode
- **Overview**: **ZCode (`id=zcode`, `v0.7.2`, `min_herdr_version 0.8.0`)** brings Zhipu/Z.AI's ZCode coding agent into Herdr in two complementary ways. First as a **native TUI**: `Open ZCode here` splits the focused pane and `exec`s the ZCode binary (`zcode` on `PATH`, `ZCODE_BIN`, or `.../glm/zcode.cjs` via `node`) in the workspace `cwd`. Second as a **delegation bridge**: any CLI agent (Codex / Claude Code / pi, per `SKILL.md` and `Supported Agent Scope`) sends a one-line task over the Herdr pane protocol to a persistent `zcode-bridge` executor pane, which runs it headless via a pinned `native-agent-router (NAR)` kernel and persists file-based evidence.
- **Key Features**: **Declared Herdr surface (`herdr-plugin.toml`):**  * `[[panes]] tui` (`ZCode`, `placement=split`, `python scripts/tui_entry.py`) — interactive ZCode. * `[[panes]] executor` (`zcode-bridge`, `placement

### [2026-09-13] NakasamaJ/herdr-pane-memo
- **Overview**: `NakasamaJ/herdr-pane-memo` (`id: herdr-pane-memo`, v`0.3.0`) is a per-pane scratchpad memo for Herdr. Pressing a user-bound key (`prefix+m` in the documented example) opens a Markdown file unique to the calling pane in a modal `popup` (75% x 70%), edits it in the user's terminal editor, and closes the popup on editor exit.
- **Key Features**: **Core memo lifecycle:**  * **Isolated per pane:** one file per Herdr `pane_id`, named `memo-<sanitized_id>.md` where `:` → `_` (e.g. `w1:p1` → `memo-w1_p1.md`). Stored under `${XDG_STATE_HOME:-~/.loc

### [2026-09-13] dirien/herdr-sbx-plugin
- **Overview**: `dirien/herdr-sbx-plugin` (`sbx.sandbox` / `Docker Sandboxes (sbx)`, `0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) runs **one coding agent per Docker Sandbox microVM**, driven by the external `sbx` CLI.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is **14x `actions` + 1x `[[events]]` + 2x `[[panes]]` + 1x `link_handlers`**. No HTTP API, no daemon, no `[[startup]]`.  **Actions** — all `command = ["sh","b

### [2026-09-14] liambern/herdr-math
- **Overview**: `herdr-math` v0.6.0 (`min_herdr_version 0.8.2`, `linux`/`macos`) typesets LaTeX found in the visible text of the active Herdr terminal pane as Kitty-graphics image overlays. It is a follow-the-focus renderer: a single long-lived Node worker watches the focused pane, parses inline `$...$` / `\(...\)` and display `$$...$$` / `\[...\]` / `equation|align|gather|multline` blocks, rasterizes them with MathJax + Resvg, and paints them over their source cells via `pane.graphics.stream` layer `herdr-math`. A checked-in agent skill (`skills/herdr-math/SKILL.md`) teaches `opencode` / `codex` / `amp` harnesses to emit ordinary LaTeX; the plugin itself is harness-agnostic and reads terminal text literally.
- **Key Features**: **User-visible actions:** * `start` — `Start equation rendering (follows active pane)`, `contexts=["pane"]`, `command=["node","src/main.mjs"]`. Starts or re-uses the singleton renderer. * `toggle` — `

### [2026-09-14] ibanks42/herdr-rbw
- **Overview**: `ibanks42/herdr-rbw` (`id = "bitwarden"`, `Bitwarden`, `0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos`) is a credential picker for Herdr: fuzzy-search your Bitwarden vault and paste or copy username, password, or TOTP into the pane you came from.
- **Key Features**: Verifiable surface is minimal by manifest: **1x `[[panes]]` + 1x `[[actions]]`**.  * **Picker popup (`panes.picker`):** `title = "Bitwarden picker"`, `placement = "popup"`, `80% x 80%`, `command = ["b

### [2026-09-14] pangpond/herdr-theme-cobalt2
- **Overview**: `pangpond/herdr-theme-cobalt2` (`herdr-theme-cobalt2` / `Cobalt2 Theme`, v`0.3.0`, `min_herdr_version 0.9.0`, `macos`/`linux`) is a cosmetic theme plugin for Herdr, not a notifier, picker, or agent orchestrator. In 2-3 sentences: it writes a Wes Bos Cobalt2-derived `[theme]` + `[theme.custom]` block and a `[ui.sidebar.agents]` row layout into `~/.config/herdr/config.toml`, and reports a per-harness `$cobalt2_logo` sidebar token for every pane so agent rows show a sized, per-harness colored mark beside Herdr's own `state_icon`. A bundled `HerdrHarnessLogos-Regular.ttf` (`U+E1A0-U+E1A8`) plus borrowed Nerd Font glyphs cover every harness Herdr can report, with a companion font-resizer for Ghostty/iTerm2 where terminal rendering would otherwise shrink the marks to ~50%.
- **Key Features**: Verifiable surface in `herdr-plugin.toml` is `1x [[startup]] + 1x [[events]] + 4x [[actions]] + 1x [[keys.command]]`. No `[[panes]]`, `[[build]]`, `link_handlers`, background daemon, or HTTP API.  **T

### [2026-09-14] pve-homelab/lazy-herd
- **Overview**: **`pve-homelab/lazy-herd` (`lazy-herd`, v0.1.0, `min_herdr_version 0.9.0`, `linux`/`macos`/`windows`)** is a bundler plugin, not a single-purpose utility. It ships one Rust `ratatui` binary (`bin/lazy-herd`, ~5.8k LOC) launched as a `90% x 80%` `popup` pane that hosts eleven in-process sub-plugins — Docs, Git, Workspace, Board, Secrets, Connect, Agents, Bootstrap, Search, Doctor, Config — behind a single split-pane menu (`Sub-plugins` left, description right).
- **Key Features**: Verifiable Herdr surface is minimal: **2x `actions` (`open` Unix, `open-windows` Windows) + 2x `panes` (`menu` Unix, `menu-windows` Windows)**. No `[[events]]`, `[[startup]]`, `link_handlers`, or HTTP

### [2026-09-14] netresearch/herdr-bg-activity
- **Overview**: `netresearch.bg-activity` (`Background Activity`, `0.2.0`, `min_herdr_version 0.9.0`, `linux`/`macos`) is a presentation-only sidebar enrichment for parallel-agent work. Herdr reports a Claude Code pane as `idle` as soon as its turn ends, even when a monitor or background shell it started is still running (`herdrdev/herdr#1217`).
- **Key Features**: Verifiable surface is one `[[startup]]` entrypoint, no `actions`, `panes`, `[[events]]`, `link_handlers`, or HTTP API:  * **Background-work marker:** pane token `bg` e.g. `⧗ 1 monitor, 2 shells`; work

