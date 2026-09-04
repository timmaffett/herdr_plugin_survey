# Herdr Plugins: Continuous Updating, Sync & Historical Growth Guide
*Operational manual for tracking upstream commits, detecting staleness, collecting growth timelines, and keeping plugins.db fresh.*

---

## 1. Overview & Architecture

Every Herdr plugin is an independent public GitHub repository. To survey the ecosystem and track growth over time without overwhelming network bandwidth, we track both current state and historical growth:

1. **`surveyed_commit_hash`**: The exact 40-character SHA of the commit we cloned and analyzed (`git rev-parse HEAD`).
2. **`surveyed_commit_date`**: The commit timestamp (`git log -1 --format=%cI`).
3. **`surveyed_version`**: The plugin manifest version at survey time.
4. **`upstream_head_commit`**: The latest commit SHA on the default branch reported by GitHub or the Herdr marketplace index.
5. **`upstream_pushed_at`**: The timestamp of the latest push to the repository.
6. **`is_out_of_date`**: A boolean flag (`1` or `0`) computed automatically when `surveyed_commit_hash != upstream_head_commit` or when `upstream_pushed_at > surveyed_commit_date`.
7. **`plugin_history` Table**: 36 weekly historical milestone buckets tracking cumulative **Commits**, **Stars**, **Forks**, **Issues**, and **Downloads** from the launch of Herdr (January 2026) to present.

```
┌──────────────────────────────────────────────────────────┐
│                   CONTINUOUS SYNC PIPELINE               │
├─────────────────────────┬────────────────────────────────┤
│ Fast Metadata Sync      │ Refresh stars, forks, issues,  │
│ (No git operations)     │ trending deltas in <2 seconds. │
├─────────────────────────┼────────────────────────────────┤
│ Staleness Detection     │ Compare surveyed_commit_hash   │
│ (Zero git operations)   │ against upstream_head_commit.  │
├─────────────────────────┼────────────────────────────────┤
│ Historical Growth Scan  │ Fetch commit dates compactly   │
│ (git blob:none)         │ via `scripts/collect_history.py│
│                         │ & populate 36-week timelines.  │
├─────────────────────────┼────────────────────────────────┤
│ Targeted Selective Pull │ Only git pull and re-analyze   │
│ (Outdated repos only)   │ repositories where commits     │
│                         │ have changed.                  │
└─────────────────────────┴────────────────────────────────┘
```

---

## 2. Interactive Growth Rate Graphing (Apache ECharts)

The web explorer at **[http://localhost:3000](http://localhost:3000)** features an interactive **Growth Timelines** view:
- **X-Axis**: Time spanning the launch of Herdr (January 4, 2026) to present (September 2026) across 36 weekly intervals.
- **Y-Axis Metric Switcher**: Toggle dynamically between:
  - ⭐ **Stars** (Cumulative stargazer growth curves)
  - 🔨 **Commits** (Cumulative git commits)
  - ⑂ **Forks** (Cumulative forks)
  - 📋 **Issues** (Open issues)
  - 📦 **Downloads** (Estimated installs)
- **Rainbow 360° HSL Spectrum**: Every line is rendered with a distinct hue (`hsl((idx * 360) / total, 80%, 55%)`).
- **Scale Switcher**: Toggle between **Linear** and **Logarithmic** scales.
- **Scope Buttons**: Focus on `Top 10`, `Top 25`, `Top 50`, `Top 100`, `Top 250`, or `All (903)`.
- **Faceted Filters**: Drill down by category, language, AI agent (`Claude Code`, `OpenCode`, `Cursor`, `Codex`, `Amp`, etc.), and feature traits (`TUI`, `Mobile`, `Web`, `Comms`, `Worktree`, `Cross-Platform`, `Tests`, `Trending`).
- **Interactive Scrubber (`dataZoom`)**: Drag the bottom timeline slider to zoom into any month or week.
- **Line Hover Isolation**: Hovering over any line dims the other 902 lines and displays a detailed tooltip with the plugin's rank, category, language, and exact metric count.

---

## 3. Using the TypeScript / Node Sync Utility

For Node.js and TypeScript environments, [`scripts/sync-plugins.ts`](file:///Users/tim/source/herdr_plugins/scripts/sync-plugins.ts) (and [`scripts/sync-plugins.js`](file:///Users/tim/source/herdr_plugins/scripts/sync-plugins.js)) can be run via npm or node:

### Check Staleness
```bash
# Report which plugins have new commits upstream:
npm run check
# or: node scripts/sync-plugins.js --check
```

### Fast-Update Stars, Forks & Trending Metrics
```bash
# Refreshes stars, forks, and trending deltas for all 903 plugins in ~20 seconds:
npm run sync
# or: node scripts/sync-plugins.js --update
```

---

## 4. Collecting & Refreshing Historical Growth Timelines

To refresh or collect the 36-week historical timeline across all 903 plugins:

```bash
# Collect full historical timelines for all 903 plugins:
python3 scripts/collect_history.py --workers 16

# If you have a GitHub Personal Access Token (for direct Stargazer API events):
python3 scripts/collect_history.py --token YOUR_GITHUB_TOKEN
```

### How `collect_history.py` works:
1. Runs `git -C <repo> fetch --filter=blob:none --unshallow` to pull only commit objects without heavy file content blobs (takes ~1-2 seconds per batch).
2. Extracts exact commit dates via `git log --format="%cI"`.
3. If `GITHUB_TOKEN` is present, queries GitHub's `/stargazers` event API for exact starred timestamps.
4. If no token is provided, derives growth curves using repository creation dates, first seen dates, commit activity density, and 7-day velocity.
5. Populates `plugin_history` with 32,508 milestone rows (36 weeks $\times$ 903 plugins).

---

## 5. Using the Python Sync Utility

```bash
# Check which plugins have newer upstream commits:
python3 scripts/sync_metadata.py --check-staleness

# Fast refresh of stars, forks, and issues across all plugins:
python3 scripts/sync_metadata.py --update-stats

# Automatically git pull and re-analyze all out-of-date plugins:
python3 scripts/sync_metadata.py --pull-outdated
```

---

## 6. How to Ingest a Brand New Plugin

```bash
# Ingest by GitHub owner/repo shorthand:
python3 scripts/ingest_plugin.py owner/new-plugin

# Ingest by full GitHub URL with stars specified:
python3 scripts/ingest_plugin.py https://github.com/owner/new-plugin --stars 45

# Re-analyze an existing checkout:
python3 scripts/ingest_plugin.py owner/existing-plugin --reanalyze
```

---

## 7. Remote Infrastructure & Access Intelligence

Many developers wish to interact with Herdr agents remotely (from mobile devices, laptops outside the office, or remote environments). We scan all manifests, docs, and source code for infrastructure setup prerequisites:

| Column in `plugins.db` | Description | Hits Across 903 Repos |
|---|---|---|
| `requires_remote_infra` | Plugin references or requires remote infrastructure | **219 plugins (24.2%)** |
| `uses_ssh` | References SSH tunnels, keys, config, or `sshd` | **136 plugins** |
| `mentions_vps_gateway` | References hosting on a cloud VPS (EC2, Hetzner, DigitalOcean) | **91 plugins** |
| `mentions_router_setup` | References home router configuration, NAT traversal, or DDNS | **38 plugins** |
| `uses_vpn_tailscale` | References VPNs, Tailscale, WireGuard, Headscale, ZeroTier | **30 plugins** |
| `mentions_port_mapping`| References port forwarding, port mapping, UPnP | **14 plugins** |
| `uses_mosh` | References Mosh UDP mobile shell roaming | **7 plugins** |

### Useful SQL Queries for Remote Infrastructure:
```sql
-- Plugins requiring Tailscale or VPN mesh access:
SELECT repo_full_name, stars, remote_infra_details 
FROM plugins WHERE uses_vpn_tailscale = 1 ORDER BY stars DESC;

-- Plugins mentioning port forwarding or home router configuration:
SELECT repo_full_name, stars, remote_infra_details 
FROM plugins WHERE mentions_port_mapping = 1 OR mentions_router_setup = 1 ORDER BY stars DESC;

-- Full remote infrastructure breakdown:
SELECT remote_infra_details, COUNT(*) as count 
FROM plugins WHERE requires_remote_infra = 1 
GROUP BY remote_infra_details ORDER BY count DESC LIMIT 15;
```

---

## 8. Advanced Visualizer Capabilities

The interactive application at `http://localhost:3000` includes several advanced analysis features:

### 1. Herdr Core Benchmark Overlay
- Toggle **`[🐑 Include Herdr Core]`** to overlay the baseline growth curve of `herdrdev/herdr` itself (34,953 stars, 1,515 commits).
- Rendered in Catppuccin Gold/Mauve (`#cba6f7`) with a distinct dashed line style.

### 2. Outlier Suppression (Skip Top 10 / Skip Top 20)
- Outlier giants like `alvinunreal/oh-my-opencode-slim` (8,590 stars) can compress the Y-axis.
- Click **`[Skip Top 10]`** or **`[Skip Top 20]`** to eliminate the top outliers from the query (`OFFSET 10` or `OFFSET 20`). The Y-axis automatically rescales to the 50–500 star range, making the growth curves of all mid-tier plugins vividly visible.

### 3. Layered Dual-Axis Release Velocity Chart
- Renders directly below the growth curves:
  - **Left Axis (Purple Bar)**: Number of brand new plugins released per week.
  - **Right Axis (Teal Step Line)**: Cumulative total plugins published across the ecosystem (growing from launch to 903).
  - Hovering over any week displays both metrics simultaneously.

### 4. Comprehensive Endpoints Catalog & Official Documentation Links
- In the **Analytics** view, toggle between **`[Top 20 Endpoints]`** and **`[All Endpoints (80+)]`** to explore every Herdr socket method and CLI command ever invoked.
- Every endpoint in charts, badges, and modal drawers is an active hyperlink (`target="_blank"`), taking developers directly to the official documentation on `https://github.com/herdrdev/herdr`.

### 5. Interactive Popup Tooltips & New-Tab Navigation
- Hovering over any line or point triggers an **interactive `enterable` popup tooltip**:
  - Displays plugin name, description, stars, forks, language, category, agents, and remote infrastructure requirements.
  - Contains a direct **`🐙 Open GitHub Repo ↗`** hyperlink (`target="_blank"`), enabling users to jump straight to the plugin's code in a new tab.
  - Contains a **`🔍 View Profile Modal`** button to open the in-depth modal drawer.
- Clicking directly on any line or point automatically opens the plugin's profile modal.

### 6. Trackpad Wheel Scroll Protection & Universal Line Tooltips
- **Universal Tooltip Hit-Testing**: Every line series configures `triggerLineEvent: true` and `showSymbol: true`, ensuring hover events trigger anywhere along the line curve as well as at discrete weekly points.
- **Trackpad Scroll Hijack Protection**: By default, inside-canvas mouse wheel zoom is disabled (`wheelZoom: false`). Users on Mac trackpads can smoothly scroll down the web page without the chart capturing their scroll gesture.
- **Bottom Timeline Slider**: Zooming and panning across weeks is performed using the dedicated timeline scrubber slider at the bottom.
- **Optional Wheel Zoom Checkbox**: A `[ ] Respond to Mouse Wheel` checkbox in the toolbar allows users who explicitly want canvas wheel zooming to enable it on demand.

---

## 9. Complete Official Core Endpoints & Zero-Usage Ecosystem Analysis

In addition to recording endpoints that community plugins actively invoke, we maintain a complete master catalog of **ALL official Herdr CLI commands, Socket RPC methods, and Lifecycle Events** extracted directly from Herdr core (`repos/herdrdev__herdr`):

### 1. Database Table: `herdr_official_endpoints`
- **Schema**: `(endpoint TEXT PRIMARY KEY, endpoint_type TEXT, category TEXT, description TEXT, doc_url TEXT)`
- **Catalog Population**: `python3 scripts/catalog_official_endpoints.py` (or `python3 scripts/sync_metadata.py --catalog-endpoints`)
- **Total Official Endpoints Cataloged**: **233**
  - **101 Socket Methods**: Extracted from `docs/next/api/herdr-api.schema.json`
  - **103 CLI Subcommands**: Extracted from `src/cli/spec.rs`
  - **29 Lifecycle Events**: Extracted from `EventKind` & `SubscriptionEventKind` schema definitions

### 2. Ecosystem Adoption vs. Zero Usage Breakdown
- **Active in Community Plugins**: **133 Endpoints (57.1%)**
- **Zero Usage in Entire Ecosystem (0 Calls)**: **100 Endpoints (42.9%)**

### 3. Key Findings: What Official Capabilities Have 0 Plugin Usage?
- **Agent RPC Control**: Advanced agent inspection socket endpoints such as `agent.explain`, `agent.focus`, `agent.read`, `agent.rename`, and `agent.view.clear` are not yet called by any community plugin.
- **Raw CLI Terminal & Channel Control**: Commands such as `herdr channel set`, `herdr terminal control`, `herdr terminal clear`, and `herdr pane input` have zero community adoption.
- **Agent Lifecycle Reporting**: `cli:report-agent`, `cli:report-agent-session`, and `cli:release-agent` are completely untouched by third-party plugins.

### 4. Interactive Endpoints Explorer in UI
- Navigate to **Analytics View** at `http://localhost:3000`:
  - **Scope Filters**: `[Top 20 Used]`, `[All Official (233)]`, `[Active in Plugins (133)]`, and `[⚠️ Zero Usage (100)]`
  - **Type Filters**: `[All Types]`, `[⚡ Socket]`, `[💻 CLI]`, `[🔔 Events]`
  - **Instant Search**: Search through endpoint names and descriptions in real time.
  - **Visual Indicator**: Zero-usage endpoints are highlighted with an amber `0 plugins (Unused)` badge and linked directly to official documentation.
  - **SQL Preset**: Click preset `⚠️ Zero-Usage Endpoints (0 Calls)` in the SQL console to execute an outer join and inspect all unused APIs.

---

## 10. Raw Socket API & Agent Skill Integration Layer Survey

We statically scanned all 903 community repositories for two architectural integration dimensions:

### 1. Herdr Raw Socket API (`uses_raw_socket`)
- **Metric**: **352 Plugins (39.0%)** connect directly to Herdr's Unix domain socket (`$HERDR_SOCKET_PATH` or `/tmp/herdr.sock`).
- **Implementation Mechanism**: Rather than executing CLI subprocess commands (`herdr <cmd>`), these plugins open a raw Unix domain socket stream (`net.createConnection`, `AF_UNIX`, or `UnixStream::connect`), speaking NDJSON or binary IPC directly to Herdr for high-performance low-latency multiplexing.
- **Top Plugins**:
  - `zenbu-labs/terminal-browser` (★ 2,506) - connects directly in `terminals/src/terminals/herdr.ts` and `engine/crates/pixel-core/src/herdr.rs`
  - `AltanS/collie` (★ 693) - implements direct socket transport for its agent workspace multiplexer
  - `persiyanov/herdr-reviewr` (★ 580) - listens to socket event streams
  - `dcolinmorgan/herdr-remote` (★ 310) - establishes reverse socket relay
  - `cloudmanic/herdr-plus` (★ 281) - native Go socket dialer (`herdrdial_other.go`)

### 2. Agent Skill Integration Layer (`uses_agent_skills`)
- **Metric**: **228 Plugins (25.2%)** implement, bundle, or integrate with Herdr's Agent Skill layer.
- **Implementation Mechanism**:
  - Bundling agent skill manifests (`SKILL.md`, `.agents/skills/`, `.claude/skills/`, `.opencode/skills/`)
  - Interfacing with Herdr's integration commands (`herdr --skill`, `herdr integration install`, `cli:integration`)
  - Registering agent state hooks (`herdr-agent-state.ts`, `herdr-agent-state.sh`)
- **Top Plugins**:
  - `alvinunreal/oh-my-opencode-slim` (★ 8,590) - fine-tuned multi-agent skill suite (`.agents/skills/release-smoke-test/SKILL.md`)
  - `zenbu-labs/terminal-browser` (★ 2,506) - bundles Claude & OpenCode skills in `skill/skills.json`
  - `openclaw/crabbox` (★ 1,354) - multi-agent skills in `.agents/skills/crabbox/SKILL.md`
  - `AltanS/collie` (★ 693) - hooks agent state into `web/src/lib/journal-agents.ts`
  - `smarzban/herdr-file-viewer` (★ 517) - bundles `skills/herdr-file-viewer/SKILL.md`

### 3. Survey Script
To re-run the multi-core socket and skill scanner:
```bash
python3 scripts/survey_socket_and_skills.py
```
