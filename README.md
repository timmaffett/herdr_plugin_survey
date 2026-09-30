# Herdr Plugins Intelligence Observatory, Growth Visualizer & Ecosystem Survey

An exhaustive architectural census, static code analysis platform, and live interactive query and graphing engine covering the **entire universe of 1,479+ Herdr community plugins** from [herdr.dev](https://herdr.dev).

Every plugin repository has been shallow checked out (`--depth 1`), analyzed across **17.0M+ lines of code**, and indexed into a native SQLite database (`plugins.db`). An interactive Node.js web application is included to explore, filter, run live SQL queries, visualize **historical growth rate line plots** with **trending velocity**, inspect **remote infrastructure setup requirements**, analyze **layered weekly plugin release rates**, and explore **official Herdr Core API socket and CLI endpoints** with official `herdr.dev` styling.

---

## Quick Start

### 1. Launch the Interactive Explorer & Growth Graph
```bash
# Starts the server on port 3000
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to explore:
- **📌 Sticky Controls Bar & Collapsible Filter Drawer**:
  - The search and controls bar sticks flush underneath the top navbar as you scroll into the 903-plugin grid.
  - Filter chips automatically collapse into the bar to maximize vertical screen real estate, and smoothly expand when returning to the top.
  - A **`🏷️ Filter Pills [count] ▾`** toggle button allows expanding the drawer at any time while browsing, with an active filter badge counter highlighting when filters are applied.
- **📈 Growth Timelines & Trending Velocity (Apache ECharts)**:
  - Multi-line plot spanning the launch of Herdr (Jan 2026) to present across 36 weekly intervals.
  - Switch Y-axis between **Trending Velocity (★/Week)**, **Cumulative Stars**, **Commit Velocity**, **Cumulative Commits**, **Forks**, **Issues**, or **Downloads**.
  - **🐑 Include Herdr Core**: Toggle the core multiplexer baseline (`herdrdev/herdr`, 34,953 stars) on/off the chart.
  - **Outlier Suppression**: Click **`[Skip Top 10]`** or **`[Skip Top 20]`** to eliminate runaway outliers and rescale the Y-axis to view all mid-tier community plugins.
  - **Continuous Hover Tooltip Tracking**: Cursor coordinates are converted from pixels to milestone indices dynamically, keeping tooltips rock-solid visible along line curves without flickering or disappearing.
  - **Click-to-Drawer Inspection**: Clicking any milestone point or line curve directly opens the comprehensive plugin detail drawer.
- **⚡ Official Herdr Documentation Deep Linking**:
  - Every detected CLI command, socket method, and lifecycle event hook routes directly to its corresponding section in the official documentation at **[herdr.dev/docs](https://herdr.dev/docs/)** (e.g. [`/docs/cli-reference/#plugins`](https://herdr.dev/docs/cli-reference/#plugins), [`/docs/socket-api/#raw-methods`](https://herdr.dev/docs/socket-api/#raw-methods), [`/docs/plugins/#startup-hooks`](https://herdr.dev/docs/plugins/#startup-hooks)).
- **📦 Layered Release Cadence Chart**: View weekly new plugin launches (Bar chart on left axis) layered with total cumulative ecosystem growth (Step line on right axis).
- **📰 Daily Reports & Capability Timeline**: Chronological daily dispatches spanning Day 1 (Jan 1, 2026) to Today (Sep 10, 2026, 253 issues) with reverse-chronological virtual scroll, executive briefs, long-form newspaper articles, automated novelty breakthrough detection, and coverage of official **Herdr Core Platform News** (including native AI agent detections such as Claude Code, OpenAI Codex, OpenCode, Pi, Copilot, Qoder, Kilo, Kimi, Droid, Cursor, Devin, MastraCode, Maki, Grok, Antigravity, Qwen, and Muse).
- **🌐 Remote Infrastructure Intelligence**: Filter by plugins that require or reference **SSH Tunnels**, **Mosh**, **VPN / Tailscale**, **Port Forwarding**, **Home Router / NAT Setup**, or **VPS / Cloud Gateway Hosting**.
- **🧩 Herdr Core Integration Census**: Filter by plugins using the direct **⚡ Raw Socket API** (352 plugins, 36.3%) or bundling **🧩 Agent Skills** (228 plugins, 23.5%).
- **💻 Live SQL Console**: Execute custom read-only SQL queries directly against `plugins.db` with sub-millisecond execution times.

### 2. Autonomous Sync & Incremental Survey Commands
Deterministic data collection and daily reporting automatically **resume exactly where they left off**:

```bash
# 1. Full Autonomous Ecosystem Update (Sync + History + Daily Reports catchup):
npm run update

# 2. Deterministic Code Survey (Instantly skips 969+ already-analyzed plugins in <0.1s):
npm run survey
# (or force full re-scan: python3 scripts/run_survey.py all_plugins.json --force)

# 3. Daily Intelligence Reports (Picks up from MAX(report_date) and generates up to today):
npm run report
# (or single date: python3 scripts/daily_report_generator.py --date 2026-09-08)

# 4. Fast Metadata & Star Sync (<20s, no git cloning):
npm run sync

# 5. Check Upstream Staleness (Detect plugins with newer commits on GitHub):
npm run check

# 6. Full Pipeline + LLM Evaluations (One-Shot):
npm run update:all

# 7. LLM Architectural Evaluations (Decoupled, runs Meta AI reasoning survey):
npm run survey:llm
```

### 3. Ingest a Specific New Plugin
```bash
python3 scripts/ingest_plugin.py <owner/repo>
# Example:
python3 scripts/ingest_plugin.py alvinunreal/oh-my-opencode-slim --reanalyze
```

---

## System Statistics At a Glance

| Metric | Value |
|---|---|
| **Ecosystem Plugins (Manifests)** | **994 plugins** (986 live marketplace index across 969 repositories) |
| **Repositories Surveyed** | **977 repositories** (969 live marketplace + 8 extended survey repos) |
| **Total Lines of Code Scanned** | **9,792,943 LOC** |
| **Cumulative Stars** | **23,285 ★** |
| **Cumulative Forks** | **1,906 ⑂** |
| **Historical Milestone Records** | **35,172 rows** in `plugin_history` (36 weeks $\times$ 977 plugins) |
| **📰 Daily Intelligence Reports** | **253 days** (Jan 1, 2026 – Sep 10, 2026 • **140 active dispatches**, 113 quiet) |
| **⚡ Herdr Core Engine Milestones** | **85 events** across 63 dates (17 Agent Detections, 55 Core Releases, 13 Arch Features) |
| **🌟 Ecosystem Breakthroughs Tracked** | **186 first-occurrence milestones** in capabilities ledger |
| **⚡ Direct Raw Socket API (`$HERDR_SOCKET_PATH`)** | **352 plugins (36.3%)** |
| **🧩 Agent Skill Integration (`SKILL.md` / Agent Hooks)** | **228 plugins (23.5%)** |
| **🌐 Remote Infrastructure Required** | **238 plugins (24.6%)** |
| **SSH Tunnel / Keys Referenced** | **150 plugins** |
| **VPS / Cloud Gateway Hosting** | **94 plugins** |
| **Home Router / NAT Setup** | **40 plugins** |
| **VPN / Tailscale Mesh** | **35 plugins** |
| **Port Forwarding / UPnP** | **15 plugins** |
| **Mosh Mobile Shell** | **9 plugins** |
| **Official Core Endpoints Cataloged** | **233 endpoints** (103 CLI, 101 Socket, 29 Events) |
| **Community-Used Official Endpoints** | **133 endpoints (57.1%)** |
| **Zero-Usage Endpoints (0 calls in 969 repos)** | **100 endpoints (42.9%)** |
| **Top Languages** | Rust (222), Shell (216), Python (167), JavaScript (131), Go (109), TypeScript (91) |
| **TUI-based Plugins** | 780 (79.8%) |
| **Web / Browser-capable** | 410 (42.0%) |
| **Mobile & Remote Relays** | 224 (22.9%) |
| **External Comms (Telegram/Push)** | 266 (27.2%) |
| **Git Worktree / VCS Aware** | 330 (33.8%) |
| **Cross-Platform (Win/Mac/Linux)** | 140 (14.3%) |
| **Contains Automated Tests** | 630 (64.5%) |
| **CI Workflows (GitHub Actions)** | 426 (43.6%) |

---

## ⚡ Operational Protocol: Fresh Scrapes & Repo Sync Before Daily Summaries

> [!IMPORTANT]
> **MANDATORY PRE-FLIGHT FOR DAILY REPORTS & CRON**:
> Before generating any daily summary dispatch or running scheduled updates, the system **MUST** perform fresh marketplace catalog fetches and shallow repository retrievals for anything changed or new.
>
> 1. **Plugin vs. Repository Distinction**: The live marketplace on [herdr.dev](https://herdr.dev/plugins/) indexes individual plugin manifests (`pluginCount: 986`), while repositories may contain multiple manifests (e.g. monorepos with multiple plugin tools).
> 2. **Pre-flight Execution**: Run `python3 scripts/daily_report_generator.py --sync` (or run `python3 scripts/full_sync_pipeline.py` first) so that:
>    - Live marketplace catalog is refreshed (`curl -sL https://herdr.dev/plugins/`).
>    - New repositories are cloned (`git clone --depth 1 -c filter.lfs.process= ...`) and analyzed into `plugins.db`.
>    - Outdated repositories are fast-forwarded to upstream HEAD (`git fetch --depth 1 && git reset --hard FETCH_HEAD`).
>    - Weekly growth milestones are updated (`python3 scripts/collect_history.py --workers 16`).
>    - Daily reports accurately capture all newly released plugins, capabilities, and metrics.

---

## Architectural & Engineering Documentation

- 🏛️ **[`ARCHITECTURE.md`](./ARCHITECTURE.md)**: Authoritative system architecture, component topology, static analysis engine, SQLite data model, sticky controls mechanics, ECharts coordinate mapping, and official documentation routing specification.
- 📡 **[`API_USAGE.md`](./API_USAGE.md)**: Comprehensive Herdr Core API & CLI endpoint usage census across all 233 official endpoints, 903 community plugins, adoption rankings, and in-depth analysis of the 100 zero-usage endpoints.
- 📖 **[`docs/ENGINEERING_GUIDE.md`](./docs/ENGINEERING_GUIDE.md)**: Deep technical architecture, static analysis AST/regex engine, dynamic SQLite migrations, and component extension guides.
- 📖 **[`docs/UPDATING_AND_SYNC_GUIDE.md`](./docs/UPDATING_AND_SYNC_GUIDE.md)**: Details commit tracking, remote infrastructure dimensions, staleness detection, growth collection, and sync utilities.

---

## License & Attribution
- Licensed under the [Apache License 2.0](./LICENSE) (matching Herdr's license).
- Plugins and manifests are copyrighted by their respective open-source authors on GitHub.
- Herdr is maintained by the Herdr team at [herdr.dev](https://herdr.dev).
