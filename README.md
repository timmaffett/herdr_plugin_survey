# Herdr Plugins Intelligence Survey, Growth Visualizer & Remote Infra Engine (All 903 Plugins)

An exhaustive survey, static code analysis, and live interactive query and graphing system covering the **entire universe of 903 Herdr community plugins** from [herdr.dev](https://herdr.dev).

Every plugin repository has been shallow checked out (`--depth 1`), analyzed across **8,716,978 lines of code**, and indexed into an SQLite database (`plugins.db`). An interactive Node.js web application is included to explore, filter, run live SQL queries, visualize **historical growth rate line plots** with **trending velocity**, inspect **remote infrastructure setup requirements**, and analyze **layered weekly plugin release rates** using Apache ECharts with official `herdr.dev` styling.

---

## Quick Start

### 1. Launch the Interactive Explorer & Growth Graph
```bash
# Starts the server on port 3000
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to:
- **📈 Growth Timelines & Trending Velocity (Apache ECharts)**: Multi-line plot spanning the launch of Herdr (Jan 2026) to present across 36 weekly intervals.
  - Switch Y-axis between **Trending Velocity (★/Week)**, **Cumulative Stars**, **Commit Velocity**, **Cumulative Commits**, **Forks**, **Issues**, or **Downloads**.
  - **🐑 Include Herdr Core**: Toggle the core multiplexer baseline (`herdrdev/herdr`, 34,953 stars) on/off the chart.
  - **Outlier Suppression**: Click **`[Skip Top 10]`** or **`[Skip Top 20]`** to eliminate runaway outliers and rescale the Y-axis to view all mid-tier community plugins.
  - **Interactive Hover Tooltip & Jump to New Tab**: Hovering over any line reveals an `enterable` popup with full metadata and a clickable **`🐙 Open GitHub Repo ↗`** link that jumps straight to the plugin's repository in a new tab.
- **📦 Layered Release Cadence Chart**: View weekly new plugin launches (Bar chart on left axis) layered with total cumulative ecosystem growth (Step line on right axis).
- **🌐 Remote Infrastructure Intelligence**: Filter by plugins that require or reference **SSH Tunnels**, **Mosh**, **VPN / Tailscale**, **Port Forwarding**, **Home Router / NAT Setup**, or **VPS / Cloud Gateway Hosting**.
- **⚡ Interactive Endpoints Catalog**: Toggle between **Top 20** and **All Endpoints** in Analytics, with every endpoint linked directly to its official documentation in a new tab (`target="_blank"`).
- **💻 Live SQL Console**: Execute custom read-only SQL queries directly against `plugins.db` with sub-millisecond execution times.

### 2. Fast Sync & Staleness Commands
```bash
# Check which plugins have newer upstream commits:
npm run check

# Fast update stars, forks, and trending deltas (<20s):
npm run sync

# Collect/refresh 36-week historical growth timelines:
python3 scripts/collect_history.py --workers 16
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
| **Repositories Surveyed** | 903 (100% of marketplace) |
| **Total Lines of Code Scanned** | 8,716,978 LOC |
| **Cumulative Stars** | 22,006 ★ |
| **Cumulative Forks** | 1,783 ⑂ |
| **Historical Milestone Records** | 32,508 rows in `plugin_history` (36 weeks $\times$ 903 plugins) |
| **Remote Infrastructure Required** | **219 plugins (24.2%)** |
| **SSH Tunnel / Keys Referenced** | **136 plugins** |
| **VPS / Cloud Gateway Hosting** | **91 plugins** |
| **Home Router / NAT Setup** | **38 plugins** |
| **VPN / Tailscale Mesh** | **30 plugins** |
| **Port Forwarding / UPnP** | **14 plugins** |
| **Mosh Mobile Shell** | **7 plugins** |
| **Top Languages** | Rust (208), Shell (199), Python (150), JavaScript (125), Go (103), TypeScript (82) |
| **TUI-based Plugins** | 725 (80.3%) |
| **Web / Browser-capable** | 384 (42.5%) |
| **Mobile & Remote Relays** | 203 (22.5%) |
| **External Comms (Telegram/Push)** | 242 (26.8%) |
| **Git Worktree / VCS Aware** | 307 (34.0%) |
| **Cross-Platform (Win/Mac/Linux)** | 129 (14.3%) |
| **Contains Automated Tests** | 589 (65.2%) |
| **CI Workflows (GitHub Actions)** | 391 (43.3%) |

---

## Documentation for Future AI Agents & Engineers

- 📖 **[`docs/UPDATING_AND_SYNC_GUIDE.md`](./docs/UPDATING_AND_SYNC_GUIDE.md)**: Details commit tracking, remote infrastructure dimensions, staleness detection, growth collection, and sync utilities.
- 📖 **[`docs/ENGINEERING_GUIDE.md`](./docs/ENGINEERING_GUIDE.md)**: Deep technical architecture, static analysis AST/regex engine, and dynamic SQLite migrations.

---

## License & Attribution
- Plugins and manifests are copyrighted by their respective open-source authors on GitHub.
- Herdr is maintained by the Herdr team at [herdr.dev](https://herdr.dev).
