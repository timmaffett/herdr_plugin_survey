# Herdr Plugins Intelligence Survey, Growth Visualizer & Remote Infra Engine (All 903 Plugins)

An exhaustive survey, static code analysis, and live interactive query and graphing platform covering the **entire universe of 903 Herdr community plugins** from [herdr.dev](https://herdr.dev).

Every plugin repository has been shallow checked out (`--depth 1`), analyzed across **8,716,978 lines of code**, and indexed into an SQLite database (`plugins.db`). An interactive Node.js web application is included to explore, filter, run live SQL queries, visualize **historical growth rate line plots** with **trending velocity**, inspect **remote infrastructure setup requirements**, analyze **layered weekly plugin release rates**, and explore **official Herdr Core API socket and CLI endpoints** with official `herdr.dev` styling.

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
- **🌐 Remote Infrastructure Intelligence**: Filter by plugins that require or reference **SSH Tunnels**, **Mosh**, **VPN / Tailscale**, **Port Forwarding**, **Home Router / NAT Setup**, or **VPS / Cloud Gateway Hosting**.
- **🧩 Herdr Core Integration Census**: Filter by plugins using the direct **⚡ Raw Socket API** (352 plugins, 39.0%) or bundling **🧩 Agent Skills** (228 plugins, 25.2%).
- **💻 Live SQL Console**: Execute custom read-only SQL queries directly against `plugins.db` with sub-millisecond execution times.

### 2. Fast Sync & Staleness Commands
```bash
# Check which plugins have newer upstream commits:
npm run check

# Fast update stars, forks, and trending deltas (<20s):
npm run sync

# Collect/refresh 36-week historical growth timelines:
python3 scripts/collect_history.py --workers 16

# Re-catalog official Herdr Core CLI & Socket endpoints:
python3 scripts/catalog_official_endpoints.py
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
| **Repositories Surveyed** | 969 (100% of marketplace) |
| **Total Lines of Code Scanned** | 9,767,742 LOC |
| **Cumulative Stars** | 23,184 ★ |
| **Cumulative Forks** | 1,895 ⑂ |
| **Historical Milestone Records** | 34,884 rows in `plugin_history` (36 weeks $\times$ 969 plugins) |
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
| **Top Languages** | Rust (220), Shell (214), Python (165), JavaScript (129), Go (109), TypeScript (90) |
| **TUI-based Plugins** | 773 (79.8%) |
| **Web / Browser-capable** | 406 (41.9%) |
| **Mobile & Remote Relays** | 220 (22.7%) |
| **External Comms (Telegram/Push)** | 262 (27.0%) |
| **Git Worktree / VCS Aware** | 328 (33.9%) |
| **Cross-Platform (Win/Mac/Linux)** | 139 (14.3%) |
| **Contains Automated Tests** | 626 (64.6%) |
| **CI Workflows (GitHub Actions)** | 424 (43.8%) |

---

## Architectural & Engineering Documentation

- 🏛️ **[`ARCHITECTURE.md`](./ARCHITECTURE.md)**: Authoritative system architecture, component topology, static analysis engine, SQLite data model, sticky controls mechanics, ECharts coordinate mapping, and official documentation routing specification.
- 📡 **[`API_USAGE.md`](./API_USAGE.md)**: Comprehensive Herdr Core API & CLI endpoint usage census across all 233 official endpoints, 903 community plugins, adoption rankings, and in-depth analysis of the 100 zero-usage endpoints.
- 📖 **[`docs/ENGINEERING_GUIDE.md`](./docs/ENGINEERING_GUIDE.md)**: Deep technical architecture, static analysis AST/regex engine, dynamic SQLite migrations, and component extension guides.
- 📖 **[`docs/UPDATING_AND_SYNC_GUIDE.md`](./docs/UPDATING_AND_SYNC_GUIDE.md)**: Details commit tracking, remote infrastructure dimensions, staleness detection, growth collection, and sync utilities.

---

## License & Attribution
- Plugins and manifests are copyrighted by their respective open-source authors on GitHub.
- Herdr is maintained by the Herdr team at [herdr.dev](https://herdr.dev).
