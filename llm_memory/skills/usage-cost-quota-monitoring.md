# Architectural Memory: Usage, Cost & Quota Monitoring

This document tracks architectural patterns and previously surveyed extensions within the **Usage, Cost & Quota Monitoring** domain.

## Surveyed Extensions Ledger

### [2026-01-01] nicosuave/memex
- **Overview**: `memex` is a Rust binary (~83k LOC) for fast, local history search over coding-agent transcripts. It indexes conversation logs left by Claude Code, Codex CLI, Cursor, OpenCode, Pi, Oh My Pi, OpenClaw, Copilot CLI, Grok, Jcode, Muse, plus Hermes usage records and Claude/Codex project memories, then exposes them via CLI, TUI, local web UI, and MCP.
- **Key Features**: **Indexing and search core:** * Incremental `memex index`, `index rebuild`, `index gc [--dry-run --offline]`, `index embed`, `index stats`. Copy-on-write generations; searches keep reading the last co

### [2026-04-28] uwuclxdy/clauth
- **Overview**: `clauth` is a Claude Code multi-account manager and usage monitor, packaged as a Rust CLI + TUI (`clauth` binary, v0.15.1). The `herdr-plugin/` subdirectory is a thin Herdr adapter: it opens the full `clauth` dashboard in a Herdr popup, labels every Herdr pane running Claude Code with the account that pane is spending, and surfaces delegate-run state as pane metadata.
- **Key Features**: **Dashboard popup:** * `clauth.open` — opens `clauth` TUI in a popup (`quit with q`). Herdr allows one popup per session; a second open while one is up is treated as no-op, not error. * Placement is k

### [2026-06-25] Davidcreador/herdr-token-dashboard
- **Overview**: The Token Dashboard is a Go-based Herdr plugin that provides live cost and token observability across agent panes. Its single binary (`bin/token-dashboard`, built from `cmd/token-dashboard`) opens as a tab-placed Bubble Tea TUI that polls `herdr pane list` every 3 seconds, reads per-agent session files or a local server API, and renders a summary table plus per-agent detail cards. A second mode sends a Herdr native toast when an agent finishes, with cost and token totals.
- **Key Features**: **Live dashboard TUI (default mode, no flags):** Bubble Tea v2 `model` with `Init/Update/View`, `AltScreen=true`, ticking via `tea.Tick(3*time.Second)`. Controls are `q`/`esc`/`ctrl+c` to quit and `r`

### [2026-06-28] fkiene/llmtrim-herdr
- **Overview**: `fkiene/llmtrim-herdr` (`id: llmtrim.proxy`, `v0.1.0`) is a thin Herdr adapter for the external `llmtrim` binary — a local MITM HTTPS proxy that compresses outbound LLM requests to cut token cost. It does not implement compression itself; on `workspace.created` it idempotently runs `llmtrim setup` + `llmtrim start` so every Herdr agent pane inherits `HTTPS_PROXY`/`SSL_CERT_FILE`/`NODE_EXTRA_CA_CERTS` automatically, then surfaces savings via a sidebar badge, a live dashboard pane, and one-shot notifications.
- **Key Features**: **Lifecycle hooks (three, each with `linux/macos` `.sh` + `windows` `.ps1` twins):**  * `workspace.created` → `bin/bootstrap.sh` / `bin/bootstrap.ps1`: resolve `llmtrim` via `command -v`/`Get-Command`

### [2026-07-07] qq88976321/herdr-copy-search
- **Overview**: `qq88976321/herdr-copy-search` (`id: copy-search`, `v0.1.5`) is a Rust TUI that brings tmux-copycat / extrakto ergonomics to Herdr. It snapshots the focused pane's scrollback via `herdr pane read`, offers incremental regex search, predefined + user-defined pattern search, and fuzzy token extraction, then lands in a vim-style copy mode for refining and yanking via OSC 52.
- **Key Features**: **Three overlay entrypoints, same binary:**  * `copy` — idle vim-style viewer. `--mode copy`. * `search` — same viewer opened with `/` prompt active. `--mode search`. * `extract` — extrakto-style `fzf

### [2026-07-12] ezcorp-org/herdr-pc-ram-and-cpu-usage-overlay
- **Overview**: This plugin shows **live PC CPU and RAM usage per Herdr space (workspace)**. For every workspace it resolves each pane's shell PID over the Herdr socket, walks that PID's process subtree (`/proc` on Linux, `libproc` on macOS, Toolhelp32 + `GetProcessTimes` on Windows), samples CPU jiffies over a window and sums RSS, then groups the result under the space's git branch name.
- **Key Features**: **Per-space measurement:** * CPU% as share of whole machine (`ΣΔjiffies / CLK_TCK / elapsed / NPROC * 100`, 0–100%, not per-core), RAM in MB + proc count, refreshed every 5s by default (`interval_seco

### [2026-07-16] senna-lang/herdr-agent-usage
- **Overview**: `herdr-agent-usage` is a Go-based Usage, Cost & Quota Monitoring plugin that surfaces per-pane context occupancy and per-account rate-limit headroom inside Herdr. It publishes sidebar metadata tokens (`$context`, `$cache_*`, `$limit`, `$provider`, `$title`) for open agent panes, renders a live `Agent Usage` pane with 5h / 7d / 30d subscription windows plus pay-as-you-go spend blocks, and emits threshold-based toasts before limits exhaust.
- **Key Features**: **Sidebar meters (event-driven + periodic):** * `$context`: `⛁ 13% (130k)` when window known, absolute `130k` otherwise; `⛁ compacted (14k)` after Claude compaction; width-degraded candidates via `cor

### [2026-07-20] alejodelosrios/herdr-claude-usage
- **Overview**: `alejodelosrios/herdr-claude-usage` (`id: unit1.claude-usage`, `v0.1.0`, `min_herdr_version 0.7.0`, `macos`/`linux` only) is a minimal Usage Monitoring plugin that keeps Claude plan consumption always visible in Herdr.
- **Key Features**: **What the user sees:**  * **Sidebar line:** `Session 65% | Week 9%` rendered via a `$claude_usage` row in `[ui.sidebar.spaces]`. The daemon reports the token only to the dedicated mini-space, so the 

### [2026-07-21] maedana/herdr-whereami
- **Overview**: `Where Am I` (`id: maedana.whereami`) is a small Rust Herdr plugin that answers “which repo/branch is this pane in?” in two places at once: the **tab title** and the **agent sidebar**. Inside a git repository the label is `repo-name/branch`; outside a repository it falls back to the current directory basename.
- **Key Features**: Key user-visible behavior, all driven by the same compiled binary:  **Auto-rename on focus:** On every `pane.focused` event the plugin resolves the focused pane’s working directory, runs git detection

### [2026-07-23] silverwolfdoc/herdr-usage-bar
- **Overview**: `Herdr Usage Bar` (`id: usagebar`, `v0.1.1`, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring** plugin for Herdr agent panes. It keeps per-pane context occupancy (`$context`), shortest subscription window remaining (`$limit`), and harness-vs-backend identity (`$provider`) always visible in the sidebar, adds a full `Herdr Usage Bar` limits pane and a thin bottom `statusbar` pane with reset countdowns, and fires threshold toasts before rate limits exhaust.
- **Key Features**: **User-visible surfaces:**  * **Sidebar meters via Herdr 0.7.4 configurable rows:** `$context` e.g. `⛁ 13% (130k)` or absolute `130k` when window unknown, `⛁ compacted (14k)` handling, `⚠️` at >=80%; 

### [2026-07-23] Coolsik/herdr-codex-cost
- **Overview**: `herdr-codex-cost` (`id: dev.herdr-codex-cost`, `v0.3.2`) is a **Usage, Cost & Quota Monitoring** plugin scoped exclusively to Codex. It calculates an estimated public Standard-API-equivalent cost for the Codex thread running in each Herdr pane — including descendant sub-agent threads — by parsing local Codex `rollout-*.jsonl` token counters and applying a hard-coded price table, then publishes the result as a `$cost` sidebar token via `pane report-metadata`.
- **Key Features**: **User-visible display values** (documented in `README.md` / `README.ko.md`, produced by `bin/codex-cost` + `bin/update-cost`):  * `$1.23` — clean calculation. * `!!$1.23` — partial exclusion due to u

### [2026-07-24] gecm0/herdr-plugin-agents-usage
- **Overview**: `gecm.agents-usage` (`v0.1.0`, `min_herdr_version 0.7.4`, `linux`/`macos` only) is a **Usage, Cost & Quota Monitoring** plugin that shows current provider consumption in a Herdr modal popup. It aggregates four independent sources — Claude Code OAuth, Codex CLI local snapshots, OpenCode Go local SQLite history, and Neuralwatt quota API — into a single ANSI bar view with plan type and reset countdowns.
- **Key Features**: **Two user-visible entrypoints, one binary:**  * `usage` pane (`placement = popup`, `width 70%`, `height 24`, `command = ["python3", "usage.py", "pane"]`): renders `Provider usage` with one colored he

### [2026-07-25] iamhouser/herdr-claude-usage-multi
- **Overview**: `iamhouser/herdr-claude-usage-multi` (`houser.claude-usage`, `v0.2.2`, `min_herdr_version 0.7.5`) puts Claude plan consumption on every Herdr space row. It reports the exact `five_hour` / `seven_day` utilization percentages Claude Code shows in `/status`, rendered as a 10-cell gauge plus `session/week` numbers, with color escalation and a reset countdown when a window is exhausted.
- **Key Features**: **Sidebar gauges (primary surface):** * Per-workspace text like `■■■■■□□□□□ 51/17` where the bar is the 5-hour session window and numbers are `session/week %`. * Four mutually-exclusive tokens to work

### [2026-07-25] mgh3326/scopefuel
- **Overview**: `mgh3326/scopefuel` (`id: scopefuel.gauge`, `v0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a **scope-aware headroom gauge for AI coding-plan quotas**.
- **Key Features**: **What the user sees in Herdr:**  * `actions.check`: `scopefuel --brief` — one-line summary for statusline/pane. * `actions.check-now`: `scopefuel --brief --horizon now` — 5h-window only. * `panes.gau

### [2026-07-26] getpipher/herdr-sysmon
- **Overview**: `Herdr Sysmon` (`id: getpipher.herdr-sysmon`, `min_herdr_version: 0.7.0`, `platforms: ["macos"]`) puts host system metrics in the Herdr sidebar as per-workspace tokens (`$sys_*`). It is an explicit, faithful port of a `tmux-cpu` / `tmux-battery` / `tmux-online-status` + custom `memory.sh` tmux status-bar into Herdr.
- **Key Features**: **What the user sees:** ten workspace tokens pushed under `--source sysmon`, intended to be rendered via `config/sidebar.toml.snippet` as `$sys_*`:  * `sys_cpu` — `100 - idle` from `top -l1 -n0`, inte

### [2026-07-30] benkraus/herdr-plugin-codex-subs
- **Overview**: `benkraus.codex-subs` v0.2.0 is a host-local **Usage, Cost & Quota Monitoring** dashboard for Codex OAuth subscriptions managed by `CLIProxyAPI`. It does not proxy, compress, or manage quotas itself: it scans the host's `CLIProxyAPI` auth directory for `type: codex` JSON credentials, calls OpenAI's `wham` quota endpoints directly with each credential's access token, and renders every quota window, reset time, plan, and reset-credit in a Bubble Tea popup.
- **Key Features**: **User-visible surfaces defined in `herdr-plugin.toml`:**  * `panes.dashboard` — `Codex subscriptions`, `placement = popup`, `92% x 88%`, `command = ["./bin/herdr-codex-subs"]`. * `actions.open` — `Co

### [2026-08-01] yuuta1219/herdr-gekiatsu-plugin
- **Overview**: This is a **gamified usage counter for the Usage, Cost & Quota Monitoring category** — not a real token/cost meter. It renders a pachislot (`pachislo`) cabinet in the Herdr sidebar and maps **one Claude/Codex interaction to one slot spin**: the daemon starts the reels when a watched pane enters `working` and lands them when it leaves `working`. Spin count is the day's usage count, reset daily at **10:00 JST** (pachinko-parlor opening time).
- **Key Features**: **Core counting loop:**  * Watches `claude` and `codex` pseudo-agents (`SPIN_AGENTS = ("claude","codex")` in `slot.py`). `watch_agents()` polls `agent.list` every 1s and emits `("start", pane_id)` on 

### [2026-08-01] yuuta1219/claude-usage
- **Overview**: This is a **Claude Code plan-consumption monitor pinned to the bottom of the Herdr sidebar**. It reads the same `five_hour` / `seven_day` utilization numbers that `/status` shows — directly from Anthropic's OAuth usage endpoint using the host's existing Claude Code credentials — and renders them as a persistent `Claude 使用量` block in the agents panel plus a detail popup. Implementation is a single-file Python daemon (~545 LOC, `flex.py`) with no pip dependencies that owns a tiny shared mini-workspace as its display host.
- **Key Features**: **What the user sees:**  * **Always-on sidebar block:** `S █░░░░░░░░░ 14%` (5-hour session) and `W ██░░░░░░░░ 18%` under a `Claude 使用量` heading at the bottom of the agents panel. Rendered via two pane

### [2026-08-04] szrenwei/herdr-agent-metrics
- **Overview**: `herdr-agent-metrics` (`id: herdr-agent-metrics`, `v0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a deliberately minimal **Usage, Cost & Quota Monitoring** plugin. It reports current context occupancy and cumulative session tokens for **Claude Code (`claude`), Codex (`codex`), and TraeX (`traex`)** panes — plus the shortest account-limit window when local agent data exposes one.
- **Key Features**: **User-visible tokens (via `format_tokens()`):**  * `$context`: `25% · 50k/200k` when window known, bare `130k`-style compact count otherwise. Percent capped at `999%`. Compact helper `compact_count()

### [2026-08-05] enekos/herdr-quick-actions
- **Overview**: `enekos/herdr-quick-actions` (`id: es.quick-actions`, `v0.2.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is an `fzf` picker over Herdr's **native** tab/pane/workspace/worktree/agent CLI commands, plus live jump targets for existing tabs, workspaces, running agents, and unopened worktrees.
- **Key Features**: **36 static native actions** defined in `STATIC_ACTIONS` in `palette.sh` (`id|title|config-key|keywords|hint`):  * **Tabs:** `new_tab`, `new_tab_named…`, `rename_tab`, `close_tab` * **Panes:** `split_

### [2026-08-05] sfroment/herdr-git-detail
- **Overview**: `sfroment/herdr-git-detail` is a minimal Herdr sidebar plugin that surfaces rich, starship-style git status per workspace. A single POSIX shell script polls every workspace on a fixed interval, computes seven per-category counts via `git status --porcelain=v2`, and publishes them as independent `$git_*` workspace metadata tokens so each can be styled separately in `[ui.sidebar.spaces]`. It deliberately does not report the branch — Herdr's native `branch` token already covers that.
- **Key Features**: What the user sees is seven sidebar tokens, each empty (hidden by Herdr) when its count is zero:  | Token | Format | Meaning | |---|---|---| | `$git_modified` | `!<n>` | modified/unstaged files | | `$

### [2026-08-06] samuelbaldwin05/herdr-burn
- **Overview**: `herdr-burn` is a local, offline cost/quota monitor scoped exclusively to **Claude Code** running inside herdr panes. On every assistant message, Claude's own `statusLine` hook prices the current session transcript (`~/.claude/projects/**/*.jsonl`) against a bundled rate table and pushes a compact badge (`$1.42 · 340K` in API mode, `42% · 340K` in quota mode) to that pane's sidebar row.
- **Key Features**: **Core pipeline: transcript → parse → price → report → aggregate.**  * **Parsing (`src/parse.py`):** `iter_records()`, `normalize_record()`, `deduplicate()`. Reads session JSONL, keeps only `type == a

### [2026-08-10] cpcloud/herdr-agentsview
- **Overview**: `herdr-agentsview` (`id: local.agentsview`, `v0.1.0`, `min_herdr_version 0.7.4`) is a terminal-native Herdr plugin for the external **AgentsView Activity dashboard**. It is a ~15k LOC Rust crate that renders one busy Ratatui TUI — date, filters, summary, concurrency timeline, sortable sessions table, and project/model/agent breakdowns — by consuming the existing AgentsView REST API over HTTP(S). It does not embed, launch, migrate, or modify AgentsView; authentication is runtime-only via environment.
- **Key Features**: **Herdr-visible surfaces — two entrypoints, one binary (`target/release/herdr-agentsview`):**  * `actions.open` — `Open AgentsView`, `contexts = ["workspace"]`, `command = ["./target/release/herdr-age

### [2026-08-12] themuuln/herdr-ghostty-theme-sync
- **Overview**: This plugin keeps Herdr visually in sync with Ghostty and keeps the sidebar populated across restarts. `theme-sync.py` reads the active `theme = ...` from `~/.config/ghostty/config`, resolves that Ghostty theme file, and rewrites Herdr's `[theme.custom]` plus all sidebar token `fg` colors in `~/.config/herdr/config.toml` to match. `refresh.sh` separately re-pushes ephemeral sidebar tokens for workspaces and panes from a live `herdr api snapshot`, because Herdr wipes that server-side metadata on restart.
- **Key Features**: **Two global actions + one startup hook** defined in `herdr-plugin.toml` (`id: ghostty-theme-sync`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only):  * `sync` (`python3 theme-sync.py`): ful

### [2026-08-13] chantlong/herdr-habitat
- **Overview**: `herdr-habitat` (`id: herdr-habitat`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a **living terminal vivarium that visualizes Herdr agent activity as plants and wildlife**, not a usage / cost / quota meter despite its ledger categorization.
- **Key Features**: **Two entrypoints, same engine (`herdr-plugin.toml` declares only `[[panes]]`):**  * `habitat` → `node bin/habitat.mjs` — live view bound to real Herdr agents, state persisted per-theme. * `demo` → `n

### [2026-08-15] levi-qiao/herdr-agent-quota
- **Overview**: `levi-qiao/herdr-agent-quota` is a credential-scoped quota, context, cache, and model monitor for Herdr agent panes. It shows the subscription that is actually serving each pane — not a global account — for eight harnesses: `claude`, `codex`, `grok`, `agy`, `opencode`, `pi`, `omp`, `devin`.
- **Key Features**: **User-visible surfaces:**  * **Sidebar rows** in `[ui.sidebar.agents].rows` + `rows_by_agent`: provider/model identity (`$quota_provider`, `$quota_model`, `$quota_provider_model`), `$quota_topic` (la

### [2026-08-17] terry-li-hm/herdr-model-lanes
- **Overview**: `Model Lanes` (`id: terry.herdr-model-lanes`, `v3.8.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring + router** plugin. It shows remaining subscription capacity for seven providers — Codex (`Cx`), Claude Max (`Cl`), Grok (`Gk`), GLM/Z.ai (`Gl`), Antigravity/Google `agy` (`Ag`), Kimi Code (`Km`), and Cursor (`Cu`) — in the focused workspace row, and routes new agent tabs to a model-class lane defined in `classes.toml` based on remaining quota.
- **Key Features**: **Display:**  * Full one-line quota string on `refresh` stdout, e.g. `Cx 6%!! · 2d17h | Cl 91% · 5d13h | Gk ... | Gl ... | Ag ... | Km ... | Cu ...`. `!` = <20% left, `!!` = <10%, `~` = stale, `·2d0h/

### [2026-08-19] kvkenyon/herdr-quota
- **Overview**: `herdr-quota` (`id: herdr-quota`, `name: AI Quota`, `v0.4.0`, `min_herdr_version 0.7.3`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring** plugin that provides a slim, right-side terminal view of remaining local AI subscription quota.
- **Key Features**: **User-visible surfaces:**  * `panes.dashboard` — `AI Quota`, `placement = split`, `command = sh -c exec "$HERDR_PLUGIN_ROOT/target/release/herdr-quota" dashboard`. Live pane-owned TUI targeting 36 ce

### [2026-08-19] JefeLabs/herdr-web-broker
- **Overview**: `jefelabs.web-broker` (`v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux`) is a **self-hosted remote-access and federation gateway for herdr**, not a usage/cost meter despite its ledger categorization under *Usage, Cost & Quota Monitoring*.
- **Key Features**: **What the user/operator gets:**  * **Network projection of herdr:** `GET /health` (only unauthenticated route), `GET /instances`, `GET /instances/{instance}`, `GET .../sessions`, `GET .../sessions/{s

### [2026-08-22] LZHcode1986/herdr-link
- **Overview**: `LZHcode1986/herdr-link` (`herdr-link`, `Herdr Link`) is not a usage / cost meter despite its ledger categorization — it is an **on-demand cross-agent interoperability layer for Herdr sessions**. Agents sharing the same Herdr workspace discover each other by live Agent Name, exchange minimal `herdr-link/1` envelopes, explicitly start new agents in existing panes, and close finished panes.
- **Key Features**: **Core operations (identical semantics across all runtimes):**  * `herdr_link {}` — idempotent activation. Returns `{ status: "active", capabilities: ["start","peers","send","close"] }`. Does no disco

### [2026-08-22] jordanhawkes/herdr-metrics
- **Overview**: This is a deliberately minimal **Usage, Cost & Quota Monitoring** plugin that reports live context occupancy and cumulative session-token consumption for **Claude Code (`claude`), Codex (`codex`), and TraeX (`traex`)** panes. When local agent data exposes subscription windows, it also reports remaining allowance.
- **Key Features**: **Sidebar tokens (`format_tokens()` in `agent_metrics.py`):**  * `$context`: `25% · 50k/200k` when window known, bare `130k`-style `compact_count()` otherwise. Percent capped at `999%`. Includes cache

### [2026-08-22] Efeguclu1/herdr-usage
- **Overview**: `Herdr Usage` (`id: herdr-usage`, `v0.2.0`, `min_herdr_version 0.7.4`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring** plugin that puts compact account-usage marks on Herdr agent tabs.
- **Key Features**: ### What the user sees  * **Sidebar token `$limit`:** third row under Herdr's default agent rows (`["state_icon","workspace","tab"] / ["agent"] / ["$limit"]`). Produced by `collect.sidebar_limit_text(

### [2026-08-23] rcosteira79/herdr-autocontinue
- **Overview**: `rcosteira.autocontinue` (`Auto Continue`, `v0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring + auto-recovery** plugin for Herdr agent panes.
- **Key Features**: Two halves, as `autocontinue.py` docstring frames it:  **Detect (free observability):** * Polls every watched pane via `herdr pane read --source visible --lines 60`, considers only last `TAIL_LINES=15

### [2026-08-26] kwanwooi25/herdr-plugin-agent-quota
- **Overview**: `Agent Quota` (`id: herdr-plugin-agent-quota`, `v0.1.0`, `min_herdr_version 0.8.0`, `linux`/`macos` only) is a zero-dependency Node.js (≥18) **Usage, Cost & Quota Monitoring** plugin for **Claude Code, Codex, and Grok**. It has two complementary data planes: a historical token/cost aggregator that parses local session logs on disk, and a live rate-limit snapshotter that queries each vendor's own OAuth endpoints with fallback to local files. It surfaces results in three Herdr surfaces: an 85% popup dashboard TUI, a docked split statusbar pane, and per-pane sidebar gauge tokens pushed via pane metadata.
- **Key Features**: **Historical usage dashboard (`index.js`, default pane `dashboard`):**  * Totals table for last N days (`input`, `output`, `cache-read`, `cache-write`, `cost`) per agent plus `all` row. `tok = input+o

### [2026-08-26] speardragon/herdr-status-ui-bar
- **Overview**: `speardragon.herdr-status-ui-bar` (`id: speardragon.herdr-status-ui-bar`, `v0.3.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring** plugin that renders AI plan-usage gauges in Herdr's `tab_bar_right`. Its polled widget `agent_usage.py` prints a single line like `claude ████░░░░░░ 39%/40% │ codex ███░░░░░░░ 32%* │ grok █░░░░░░░░░ 8% │ @13:04`, omitting any agent with no local data. It also owns the entire `tab_bar_right` array via a `layout.toml` source-of-truth plus a curses `customize` popup, a `weather` block, and a `herdr-tab-id` block.
- **Key Features**: **Core gauge widget — `agent_usage.py` (no pip deps, `python3 >=3.9`):**  * `claude 5h%/7d%`: reads `~/.claude/.last-statusline.json` (`rate_limits.five_hour.used_percentage` / `seven_day.used_percent

### [2026-08-26] TheBrunoPetkovic/herdr-context-display
- **Overview**: This plugin does one thing: it puts a colour-coded context-window gauge on every Claude Code agent row in the Herdr sidebar, e.g. `ctx 75% (150k)` in green / amber / red.
- **Key Features**: **Sensor (`dist/sensor.js`, invoked by Claude Code):**  * Reads the `statusLine` JSON from stdin (`readStdin()` returns `""` on TTY). Parses `session_id`, `model.{id,display_name}`, `workspace.current

### [2026-08-26] w784415/pi-agent-usage
- **Overview**: `Pi Agent Usage` (`id: w784415.pi-agent-usage`, `v0.1.0`, `min_herdr_version 0.7.0`) is a dual-runtime quota monitor, not a native Herdr meter. Its real logic is a Pi coding-agent extension (`agent-usage.ts`, ~427 LOC TypeScript total) that shows OpenAI Codex subscription consumption in the Pi TUI status bar. The Herdr side is a deliberately thin launcher: a single `tab` pane that spawns `pi -e <plugin-dir>` in the current workspace so that Pi session automatically loads the extension, without touching the user's global Pi configuration.
- **Key Features**: What the user actually sees is entirely inside Pi:  **Status-bar widget:** When the active Pi model has `provider === "openai-codex"`, the extension sets status slot `agent-usage` via `ctx.ui.setStatu

### [2026-08-27] tmastalirsch/herdr-claude-context-meter
- **Overview**: `tmastalirsch/herdr-claude-context-meter` (`tlv.claude-context-meter`, `v0.1.0`) is a narrow-scope **Usage Monitoring** plugin that visualizes Claude Code context-window occupancy. It does two things: renders a text bar in Claude Code's own `statusLine`, and aggregates those readings into a live Herdr `tab` pane with one row per Claude agent. Implementation is ~738 LOC of POSIX-oriented `bash` + inline `python3`/`awk`, with no daemon, no socket client, and no network calls.
- **Key Features**: **Status-line meter (`meter-statusline.sh`):** Reads Claude Code `statusLine` JSON from `stdin`, extracts `session_id`, `model.display_name`, `workspace.current_dir|cwd`, `context_window.remaining_per

### [2026-08-31] peria-ai/precc-herdr-plugin
- **Overview**: This plugin is a **control + telemetry shell for PRECC** (`https://precc.cc`) inside Herdr. PRECC itself is an external cross-agent command-correction / token-saving tool; this plugin does not re-implement any of that logic.
- **Key Features**: What the user sees in Herdr, all declared in `herdr-plugin.toml`:  **Panes (2):** - `savings` — `PRECC · savings`, `placement = split`, `sh scripts/savings-pane.sh`. Auto-refresh loop (default 30s) ar

### [2026-08-31] ryus1234/provider-usage
- **Overview**: `provider-usage` (`id: provider-usage`, `name: Usage`, `v0.1.0`) is an independent, bottom-split usage bar for Herdr. It renders local usage snapshots for **Claude (5h/7d), ChatGPT/Codex (5h/7d), OpenCode Go (5h/7d/30d estimates), and an optional Fable model window** in a non-focused terminal pane, refreshed in place.
- **Key Features**: **What the user sees:** a single `Usage` split pane per tab, e.g. `󰊤 Claude  5h 22% used · 3h 12m  ·  7d 3% used · 4d 0h  ·  󰊥 ChatGPT  5h 10% used ...`, with ANSI brand colors when color is support

### [2026-09-01] anyaachan/herdr-claude-usage
- **Overview**: `anyaachan/herdr-claude-usage` (`id: herdr-claude-usage`, `v0.1.0`, `min_herdr_version 0.8.0`, `macos`/`linux` only) is a global Claude Code plan-consumption monitor for Herdr.
- **Key Features**: **What the user sees:**  * `bar` — one-line tab-bar summary, polled every 30s. Shows `5h <pct> ↻<reset-hour>` + `wk <pct>` + per-model weeks + spend currency. Appends `!!` when pct > `BAR_HOT` (defaul

### [2026-09-04] wazum/herdr-grazr
- **Overview**: `wazum/herdr-grazr` (`wazum.grazr`, `v0.3.0`) is automatic Claude Code account rotation for Herdr. It parks the OAuth credentials for two or more user-owned Claude subscriptions, watches the `five_hour` / `seven_day` headroom Claude hands to its own status-line command after every message, and — when remaining headroom drops below configured thresholds — swaps which credential the unmodified `claude` binary reads on its next request, mid-turn, with no prompt.
- **Key Features**: **Sensing without polling:** * `grazr.py statusline` runs as Claude's `statusLine` command. It prints the previously-configured bar unchanged (via `statusline.previous.json` + 5s subprocess timeout), 

### [2026-09-04] ArtMoreno/quota-deck
- **Overview**: QuotaDeck is a **credential-scoped quota, context, cache, and model monitor** for Herdr agent panes. It attributes each pane to the subscription actually serving it — for Claude, Codex, Grok, Agy, OpenCode, Pi, `omp` (oh-my-pi), Hermes, plus dashboard-only OpenRouter — and surfaces remaining 5h/7d/30d windows, context occupancy, cache/TTL diagnostics, and provider/model identity.
- **Key Features**: **What the user sees:**  * **Sidebar meters:** ~40 `$quota_*` tokens declared in `src/configure/herdr.rs` (`QUOTA_ROW_MARKERS`): `$quota_provider/_model/_provider_model`, `$quota_context/_cache/_cache

### [2026-09-04] KeithMoc/herdr-tokenlens
- **Overview**: `kmoc.tokenlens` (`v0.1.0`) is a **live carrying-cost and compact-breakeven meter** for the agent session in the current Herdr workspace. It tails the agent's own local transcript — Claude Code JSONL or opencode SQLite — prices every turn, attributes cost per human task (`promptId`), and renders a continuously refreshing split pane whose sole headline is a task-boundary verdict: `START FRESH`, `CACHE EXPIRES IN Nm`, or `KEEP GOING`.
- **Key Features**: **Live pane (`bin/tokenlens` with no flags):**  * Header: `tokenlens · <agent:dir> · <model> · task N · turn M  $spent`, plus dim `session <id> · <branch> · v<ver> · <cwd> · since HH:MM` identity row 

### [2026-09-04] btj93/herdr-tokens
- **Overview**: `herdr-tokens` is **not a usage, cost, or quota meter**, despite its ledger categorization. It is a minimal conditional-styling bridge for the Herdr sidebar.
- **Key Features**: **Token production — 8 workspace-scoped keys, `source = "herdr-tokens"`:**  Exactly one of six status tokens is set per workspace per tick, the other five explicitly cleared via JSON `null`:  | Token 

### [2026-09-05] DongHyunnn/ai-share-usage-herdr
- **Overview**: `ai-share-usage-herdr` is not a local-only meter. It is a **team-shared Codex quota monitor** with a Herdr sidecar.
- **Key Features**: **Team onboarding and auth:** * `ais join <invite>` — parses invite token or `vscode://DongHyunnn.ai-share-usage/join?token=...` link, configures Supabase URL + anon key + group code. Interactive prom

### [2026-09-05] jpwallace22/herdr-glab-status
- **Overview**: `glab-status` (`id: glab-status`, `v0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a GitLab merge-request presence indicator for Herdr workspaces. Despite its filing under Usage/Cost/Quota Monitoring, it meters no tokens, cost, or quota: it resolves each workspace's current git branch to a GitLab MR via `glab` and publishes a compact `$mr` workspace token like `!575 ✔ ✎2`, `!67 draft ↻`, `!12 merged ✔`.
- **Key Features**: **User-visible token:**  Label grammar implemented in `src/label.ts:formatLabel()` is stable and documented in `README.md`: `!<iid>[ draft][ merged][ closed][ <pipeline>][ ✎<unresolved>]`. `parseMrVie

### [2026-06-26] pinkpixel-dev/quota
- **Overview**: `pinkpixel.quota` (`v0.1.0`, `min_herdr_version 0.9.0`, `linux/macos/windows`) is a **Usage, Cost & Quota Monitoring** plugin that shows remaining AI quota in the Herdr agents sidebar.
- **Key Features**: **What the user sees:**  A single `$quota` token rendered wherever the user places it in `~/.config/herdr/config.toml`, e.g. `[["agent","$quota"]]`. Per `herdr-plugin/README.md`:  | Agent kind | Token

### [2026-09-01] ZviBaratz/herdr-draft
- **Overview**: `herdr-draft` (`id: zvibaratz.draft`, `v0.1.0`, `min_herdr_version 0.9.0`) is a **new-session creation dialog for herdr**, not a Usage / Cost / Quota meter despite its filing in that ledger category.
- **Key Features**: **Manifest surfaces (`herdr-plugin.toml`):**  * `panes.open` — `New session`, `placement = popup`, `width 104`, `height 32`, `command = ["./bin/herdr-draft"]`. Fixed 104×32 card, clamped down by Herdr

### [2026-09-07] gregsantos/herdr-agent-kind
- **Overview**: `gregsantos.agent-kind` (`Agent Kind`, `v0.5.3`, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a minimal sidebar-token bridge, not a usage meter despite its ledger categorization. Herdr's built-in `agent` token shows the Herdr agent name when one exists and only falls back to the kind (`claude`, `codex`, ...) when it does not — since every `herdr agent start <name>` session has a name, the kind effectively disappears. This plugin republishes that kind verbatim as a separate `$agent_kind` pane-metadata token so a `[ui.sidebar.agents]` row can show both name and kind. It is a single POSIX `sh` script with no daemon, no polling, and no binary.
- **Key Features**: What the user sees is one token plus three triggers that fill it:  * **`$agent_kind` token:** value is Herdr's canonical kind string as returned by Herdr itself (e.g. `claude`, `codex`, `gemini`, `pi`

### [2026-09-08] ArnaudRinquin/herdr-quotabar
- **Overview**: `ArnaudRinquin/herdr-quotabar` (`id: quotabar.tabbar`, `v0.1.0`, `min_herdr_version 0.8.2`, `macos`/`linux` only) is a **Usage, Cost & Quota Monitoring** plugin that surfaces AI plan quotas as a single compact text line. Out of the box it ships only a Claude provider: the same `5h` session, `7d` all-models, and per-model weekly caps (e.g. `Fable`) that Claude Code `/status` shows, e.g. `5h 28% 1h6m | 7d 17% 3d22h | Fable 20% 3d22h`.
- **Key Features**: **What the user sees:**  * **Tab-bar line (`quota.py status`):** plain text `"{label} {pct}% {reset} | ..."` with no color (Herdr strips it). Fallback is `quota: <note|n/a>` when no cache exists. Exam

### [2026-09-08] cheoljoo/herdr-space-activity-monitor
- **Overview**: `cheoljoo/herdr-space-activity-monitor` (`cheoljoo.space-activity-monitor`, `v0.2.0`) is a tiny Shell-only Herdr plugin that rolls per-pane terminal output activity up to the **Space (workspace) row** in the sidebar. It runs a background `bash` poller that hashes each pane's visible screen, infers whether a Space is `printing now` vs. has `unseen output`, and publishes that as a custom `$activity` sidebar token via `workspace report-metadata`. It is display-only: it creates no new Herdr core concept, it just makes background Spaces noticeable without decorating individual panes or agents.
- **Key Features**: The entire user-visible contract is four values of the `$activity` token, documented identically in `monitor.sh` header comments and `README.md`:  * `""` (empty / cleared): idle — no visual change fro

### [2026-09-08] e-kotov/herdr-cache-hit
- **Overview**: `cache-hit` is a **prompt-cache HUD and expiration monitor** for Herdr agent panes. It does not meter cost, quota, or total tokens; it answers one question per pane: *is the provider's prompt-prefix cache still hot, when does it likely expire, and how much of the last request hit it?*
- **Key Features**: **Live HUD tokens (via `pane report-metadata --source herdr-plugin.cache-hit`):** * `$cache` — unified display string, no middle dots. Hot/expiring include clock + pct + counters; cold suppresses pct 

### [2026-09-08] xyanwert/herdr-burnout
- **Overview**: `xyanwert/herdr-burnout` (`xyanwert.burnout`, `v0.1.0`) is a thin Herdr wrapper around an external program — upstream `claude_monitor.py` from `xyanwert/usage-monitor` — not a meter implemented in this repo.
- **Key Features**: What the user gets is three entrypoints in a single file, two exposed to Herdr:  * `burnout.py open` — `Toggle Burnout dock`. Opens the dock to the right of the focused pane with `--no-focus`, or clos

### [2026-09-09] HungNth/herdr-cliproxyapi-quotas
- **Overview**: `herdr-cliproxyapi-quotas` (`id: herdr-cliproxyapi-quotas`, `v0.1.2`, `min_herdr_version 0.9.0`) is a **Usage, Cost & Quota Monitoring** plugin for operators who front multiple provider accounts behind a self-hosted **CLIProxyAPI** instance.
- **Key Features**: **Quota View (`panes.quotas`):** * Right-hand `split` pane (`50/50` by convention) beside the invoking work pane. Normal Herdr pane — draggable, re-splittable, closable via `q`/`Esc` or manual close. 

### [2026-09-09] ummoftgo/herdr-quota-theme
- **Overview**: `herdr-quota-theme` (`id: herdr-quota-theme`, `name: Quota Theme Companion`, `v0.1.0`, `min_herdr_version 0.9.0`, `macos`/`linux` only) is not a usage meter itself. It is a **theming companion for `levi-qiao/herdr-agent-quota`**.
- **Key Features**: **What the user sees:**  * Themed quota text: `model` (`$quota_provider`, `$quota_model`, `$quota_provider_model`) defaults to `accent`; `normal→green`, `warning/caution→yellow`, `danger→red`, `error→

### [2026-09-10] hanbong5938/herdr-usage-line
- **Overview**: `Usage Line` (`id: hanbong5938.usage-line`, `v0.2.0`, `min_herdr_version 0.7.5`, `macos`/`linux` only) is a local-only **Usage, Cost & Quota Monitoring** plugin. It renders subscription rate-limit headroom as a single sidebar line — e.g. `Claude 5h 86% (3h0m) · 7d 97% (6d7h) · Codex 7d 90% (2d4h)` — plus a per-pane context meter (`⛁ 18% (184k)`) and session-cumulative cache hit-rate (`cache 95%`).
- **Key Features**: **What the user sees — four sidebar tokens:**  * `$usage_line` / `$usage_line_2`: account summary, published to a **single anchor pane** so it renders once. Percentages are **remaining** headroom (`10

### [2026-09-10] bonkey/herdr-bookmark
- **Overview**: `herdr-bookmark` is a workspace-annotation plugin, not a usage / cost meter despite its filing under Usage, Cost & Quota Monitoring. It provides three independent, user-toggled bookmarks per Herdr workspace, published as a single `$bookmark` sidebar token on both Space rows and Agent rows.
- **Key Features**: **Core model:** each workspace holds any subset of marks `{1,2,3}`. Token is glyphs concatenated lowest-first, e.g. `[1,3]` -> `−≡`. Empty set clears the token.  **Mutating operations (`bookmark.py` C

### [2026-09-11] Kamyil/herdr-usage-popup
- **Overview**: `Kamyil/herdr-usage-popup` (`herdr-usage-popup`, `0.3.0`, `min_herdr_version 0.7.4`) is a minimal **Usage, Cost & Quota Monitoring** plugin that shows subscription quota headroom as plain-text bars in an on-demand Herdr popup. It covers three providers — OpenAI Codex, Claude Code, and OpenCode Go — by asking each provider's own CLI for its limits, and explicitly never reads, writes, or refreshes credential files. Compared to sidebar-meter and daemon plugins in this ledger, it is ephemeral and read-only: no background poller, no `$context`/`$limit` tokens, no history or cost math.
- **Key Features**: **One popup, three collectors, two hook actions:**  * `panes.usage` — `Model usage`, `placement = popup`, `70 x 18`, `command = ["sh", "-c", "exec \"$HERDR_PLUGIN_ROOT/usage.sh\""]`. Renders e.g. `5h 

### [2026-09-11] azyu/herdr-agent-cli
- **Overview**: `azyu/herdr-agent-cli` (`id: azyu.agent-cli`, `v0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a display-only identity plugin. It publishes Herdr's already-detected agent runtime (e.g. `claude`, `codex`, `omp`, `agy`) as a per-pane sidebar token `$cli` so the sidebar can show `claude · chewy-tofu` instead of just the display name `chewy-tofu`.
- **Key Features**: **What the user sees:** one new token `$cli` rendered next to Herdr's built-in `agent` token. Adjacent tokens are joined by Herdr with `·` (not configurable), yielding `claude · chewy-tofu`. The first

### [2026-09-11] harpal-singh-qp/herdr-footprint
- **Overview**: `harpal-singh-qp/herdr-footprint` (`id: footprint`, `v0.4.1`, `min_herdr_version 0.7.5`, `linux`/`macos` only) answers per-space cost in the Herdr sidebar: how much disk a space's git worktree occupies (`$disk`, e.g. `⛁ 840M`) and how much context the busiest agent in that space has burned (`$ctx`, e.g. `◐ 7%`).
- **Key Features**: **Sidebar meters — one push per space per cycle (`bin/collect.sh`):**  * `$disk`: size of the space's git worktree root via cached `du -sk`, rendered by `human_bytes()` in `bin/lib.sh` as `0B / 1023B 

### [2026-09-15] JunSeo99/herdr-plan-meter
- **Overview**: `junseo99.plan-meter` (`Plan Meter`, `v0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a **Usage, Cost & Quota Monitoring** plugin scoped to **Claude Code and Codex subscription plans**. It keeps the tightest `5h` / weekly window per plan in Herdr's `tab_bar_right` with a reset countdown, and opens a `popup` detail view with every window, usage bars, and reset clocks.
- **Key Features**: **Tab-bar line (`meter.py bar`):** Single line like `Claude 21% used 3d 10h   Codex 4% used 4d 5h`. Per provider it picks `headline()` — max `used`, tie-break on `resets_at` — and appends `left()` cou

### [2026-09-16] VibrantClouds/herdr-gsd-core
- **Overview**: `herdr-gsd-core` (`id: herdr-gsd-core`, `name: GSD-Core`, `v0.1.0`, `min_herdr_version 0.9.0`, `linux`/`macos` only) is a **GSD-Core project observer and supervised-run launcher**, not a Usage/Cost/Quota meter despite its filing in that ledger category.
- **Key Features**: **Observe-only projection (always on):**  * **Workspace tokens** — documented in `README.md` and asserted in `scripts/e2e-herdr.cjs`: `gsd_phase` (`03 auth`), split form `gsd_phase_num`/`gsd_phase_nam

