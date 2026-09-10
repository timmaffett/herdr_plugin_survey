# Herdr Plugins Intelligence & Pipeline Engineering Guide
*A comprehensive operational guide for current and future AI coding assistants (Claudes, Agys, and human engineers).*

---

## 1. System Architecture Overview

The Herdr Plugins Survey is an automated pipeline that discovers, clones, parses, statically analyzes, and catalogs community plugins for [Herdr](https://herdr.dev).

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌──────────────────────┐
│ https://herdr.dev/     │ ───> │ scripts/clone_repos.py  │ ───> │ repos/<owner>__<repo>│
│ plugins/ marketplace   │      │ (parallel git checkout) │      │ (903 shallow clones) │
└────────────────────────┘      └─────────────────────────┘      └──────────────────────┘
                                                                            │
                                                                            ▼
┌────────────────────────┐      ┌─────────────────────────┐      ┌──────────────────────┐
│ plugins.db (SQLite)    │ <─── │ scripts/db_manager.py   │ <─── │ scripts/analyzer.py  │
│ 50+ dynamic attributes │      │ (schema auto-migration) │      │ (AST/manifest/scan)  │
└────────────────────────┘      └─────────────────────────┘      └──────────────────────┘
           │
           ▼
┌────────────────────────┐      ┌─────────────────────────┐
│ server.js (Express)    │ <──> │ public/ (SPA Web App)   │
│ http://localhost:3000  │      │ Catppuccin Ink Theme    │
└────────────────────────┘      └─────────────────────────┘
```

---

## 2. Directory & Script Index

All analysis, ingestion, and management scripts are collected in [`scripts/`](file:///Users/tim/source/herdr_plugins/scripts/):

| Script | Purpose | CLI Example |
|---|---|---|
| [`scripts/run_survey.py`](file:///Users/tim/source/herdr_plugins/scripts/run_survey.py) | Master survey orchestrator; automatically skips already-analyzed plugins | `npm run survey` or `python3 scripts/run_survey.py all_plugins.json` |
| [`scripts/daily_report_generator.py`](file:///Users/tim/source/herdr_plugins/scripts/daily_report_generator.py) | Generates chronological daily reports & breakthroughs; resumes incrementally | `npm run report` or `python3 scripts/daily_report_generator.py` |
| [`scripts/full_sync_pipeline.py`](file:///Users/tim/source/herdr_plugins/scripts/full_sync_pipeline.py) | Full autonomous pipeline: marketplace sync, new repo ingest, pulls & updates | `npm run update` |
| [`scripts/ingest_plugin.py`](file:///Users/tim/source/herdr_plugins/scripts/ingest_plugin.py) | Ingest & analyze a single new plugin repository | `python3 scripts/ingest_plugin.py owner/repo` |
| [`scripts/analyzer.py`](file:///Users/tim/source/herdr_plugins/scripts/analyzer.py) | Static/semantic code analyzer, manifest reader, endpoint detector | Imported by survey and ingest scripts |
| [`scripts/db_manager.py`](file:///Users/tim/source/herdr_plugins/scripts/db_manager.py) | SQLite database manager with dynamic column migration | `python3 -c "import scripts.db_manager as db; db.init_db()"` |
| [`scripts/taxonomy.py`](file:///Users/tim/source/herdr_plugins/scripts/taxonomy.py) | Classification heuristics for Broad, Sub, and Sub-Sub categories | Imported by analyzer |
| [`scripts/clone_repos.py`](file:///Users/tim/source/herdr_plugins/scripts/clone_repos.py) | Multi-threaded shallow cloner for any batch of repositories | `python3 scripts/clone_repos.py top200_plugins.json 12` |
| [`scripts/collect_history.py`](file:///Users/tim/source/herdr_plugins/scripts/collect_history.py) | Collects 36-week historical adoption milestones (stars, forks, commits) | `python3 scripts/collect_history.py --workers 16` |
| [`scripts/catalog_official_endpoints.py`](file:///Users/tim/source/herdr_plugins/scripts/catalog_official_endpoints.py) | Catalogs official Herdr Core CLI/Socket endpoints & maps official doc URLs | `python3 scripts/catalog_official_endpoints.py` |
| [`scripts/sync-plugins.js`](file:///Users/tim/source/herdr_plugins/scripts/sync-plugins.js) | Fast marketplace metadata sync from `herdr.dev/plugins/` | `npm run sync` |

---

## 3. How to Ingest a Specific New Plugin

To add any new Herdr plugin to the survey database:

```bash
# Ingest by GitHub owner/repo shorthand:
python3 scripts/ingest_plugin.py owner/new-plugin

# Ingest by full repository URL:
python3 scripts/ingest_plugin.py https://github.com/owner/new-plugin

# Override star count if offline or rate-limited:
python3 scripts/ingest_plugin.py owner/new-plugin --stars 250

# Re-analyze an already checked out repository without re-cloning:
python3 scripts/ingest_plugin.py owner/new-plugin --reanalyze
```

### What `ingest_plugin.py` does automatically:
1. Clones the repo with `--depth 1 --single-branch` into `repos/<owner>__<repo>`.
2. Queries GitHub API for stars, forks, issues, and topics (with graceful fallback).
3. Parses `herdr-plugin.toml` wherever located in the repo.
4. Walks all files, calculating total files, directories, and LOC breakdown by language.
5. Scans code for Herdr socket endpoints (e.g. `workspace.list`, `pane.read`), CLI commands, and environment variables.
6. Evaluates Herdr Core integration architecture:
   - **⚡ Raw Socket API**: Direct connections to `$HERDR_SOCKET_PATH` (IPC Unix socket).
   - **🧩 Agent Skills**: Inclusion of `SKILL.md`, `.claude/skills/`, `.opencode/skills/`, or agent state lifecycle hooks.
7. Evaluates remote infrastructure requirements (SSH tunnels, Mosh, VPN/Tailscale, port forwarding, NAT routers, cloud VPS gateways).
8. Classifies into Broad, Sub, and Sub-Sub categories and tags.
9. Automatically detects and adds any missing schema columns in `plugins.db`.
10. Upserts into `plugins.db` and updates auxiliary relational tables (`plugin_endpoints`, `plugin_agents`, `plugin_manifest_items`).

---

## 4. How to Expand the Dataset with Bulk Ingestions

If you want to survey additional batches:

1. **Extract new repositories to JSON** (e.g. `all_plugins.json`).
2. **Run Survey Aggregation with Automatic Resume**:
   ```bash
   npm run survey
   # or: python3 scripts/run_survey.py all_plugins.json
   ```
   *Note: The orchestrator queries `plugins.db` first and automatically skips all already-analyzed plugins in milliseconds, cloning and analyzing only newly queued repos.*
3. **Generate Daily Dispatches**:
   ```bash
   npm run report
   # or: python3 scripts/daily_report_generator.py
   ```
   *Note: Automatically picks up from the last recorded date up to today, carrying forward cumulative stats without wiping past reports.*

---

## 5. Dynamic Schema Evolution Guide

To add a new attribute to the survey database:

1. Open [`scripts/analyzer.py`](file:///Users/tim/source/herdr_plugins/scripts/analyzer.py).
2. Inside `detect_features()` or `analyze_repository()`, add your detection logic.
3. Open [`scripts/db_manager.py`](file:///Users/tim/source/herdr_plugins/scripts/db_manager.py).
   The `ensure_columns()` function will automatically detect new keys in `record` and execute:
   ```sql
   ALTER TABLE plugins ADD COLUMN <new_column> <type>;
   ```
4. Run `python3 scripts/run_survey.py top200_plugins.json`.
   All plugins will be re-analyzed and the new column will be back-filled across all existing records without data loss!

---

## 6. Official Herdr Documentation Resolution

Official documentation URLs for Herdr CLI subcommands, JSON-RPC socket methods, and lifecycle event hooks must route to the official Astro Starlight documentation on `https://herdr.dev/docs/` rather than broken GitHub blob anchors.

### Implementation Pattern

Both [`public/app.js`](file:///Users/tim/source/herdr_plugins/public/app.js) (`getEndpointDocUrl`) and [`scripts/catalog_official_endpoints.py`](file:///Users/tim/source/herdr_plugins/scripts/catalog_official_endpoints.py) (`resolve_doc_url`) share the canonical resolution table:

- **CLI Commands (`cli:<subcommand>`)**:
  - `plugin` -> `https://herdr.dev/docs/cli-reference/#plugins`
  - `pane` -> `https://herdr.dev/docs/cli-reference/#panes`
  - `tab` -> `https://herdr.dev/docs/cli-reference/#tabs`
  - `session` -> `https://herdr.dev/docs/cli-reference/#sessions`
  - `workspace` -> `https://herdr.dev/docs/cli-reference/#workspaces`
  - `worktree` -> `https://herdr.dev/docs/cli-reference/#worktrees`
  - `agent` -> `https://herdr.dev/docs/cli-reference/#agents`
  - `server` -> `https://herdr.dev/docs/cli-reference/#server`
  - `notification` -> `https://herdr.dev/docs/cli-reference/#notifications`
  - `status` -> `https://herdr.dev/docs/cli-reference/#launch-and-status`
  - `completion` -> `https://herdr.dev/docs/cli-reference/#shell-completions`
  - `terminal` / `attach` -> `https://herdr.dev/docs/cli-reference/#direct-terminal-attach`
  - `wait` -> `https://herdr.dev/docs/cli-reference/#output-waits`
  - `integration` -> `https://herdr.dev/docs/cli-reference/#integrations`
  - `config` -> `https://herdr.dev/docs/config-reference/`
- **Lifecycle Event Hooks (`event:<name>`)**:
  - `https://herdr.dev/docs/plugins/#startup-hooks`
- **Socket API Methods**:
  - `plugin.*` -> `https://herdr.dev/docs/socket-api/#plugin-apis`
  - `agent.*` -> `https://herdr.dev/docs/socket-api/#agent-view-queries`
  - `pane.read*` -> `https://herdr.dev/docs/socket-api/#reading-panes`
  - `wait.*` -> `https://herdr.dev/docs/socket-api/#waiting-for-state`
  - `server.*`, `ping` -> `https://herdr.dev/docs/socket-api/#raw-methods`

---

## 7. Frontend UI Mechanics

### Sticky Controls Bar & Collapsible Drawer
- **Dynamic Docking**: In `public/app.js`, `--nav-height` tracks `.hd-nav.offsetHeight` on resize. `.controls-bar` is styled with `position: sticky; top: var(--nav-height); z-index: 90;`.
- **Sentinel Geometric Detection**: `#controls-sentinel` triggers sticky state transition (`sentinelRect.top <= navH`) reliably without scroll jitter.
- **Drawer State**: Filter chips are wrapped in `.filter-chips-wrapper` with smooth transition on `max-height`. Entering sticky state automatically collapses the drawer. Scrolled back to top, it auto-expands.
- **Manual Toggle & Active Badge**: `#toggle-chips-btn` toggles the drawer anytime, with `#chips-active-badge` displaying the active filter count.

### ECharts Coordinate Mapping & Hover Persistence
- Continuous line hovering uses `growthChartInstance.convertFromPixel({ seriesIndex }, [offsetX, offsetY])` to resolve the closest weekly milestone index dynamically.
- Tooltips stay visible while cursor moves along curves; clicking any point or line dispatches `showPluginDetail(plugin)` to open the detail drawer.

---

## 8. Running and Extending the Node.js Web Server

### Starting the Server
```bash
# Starts Express server on port 3000:
npm start
# Or directly:
node server.js
```
The application will be accessible at `http://localhost:3000`.

### Available REST Endpoints
- `GET /api/stats`: Ecosystem aggregate counts, category distributions, language shares, top official endpoints, all endpoints catalog, and zero-usage summary.
- `GET /api/plugins`: Filterable plugin listing supporting query parameters: `q`, `category`, `language`, `agent`, `sort`, `raw_socket`, `agent_skills`, `remote_infra`, `ssh`, `mosh`, `vpn`, `tui`, `mobile`, `web`.
- `GET /api/plugins/:id`: Full profile of a specific plugin including manifest items, endpoints, and agent collection architecture.
- `GET /api/history`: 36-week historical growth timeseries matrix for Apache ECharts (`?metric=stars|velocity|commits`).
- `GET /api/releases`: Weekly plugin release cadence (new per week vs cumulative total).
- `POST /api/query`: Live read-only SQL query runner. Pass JSON `{"sql": "SELECT ... FROM plugins ..."}`.

---

## 9. Useful SQL Recipes for Intelligence Work

```sql
-- Top 10 Plugins by Composite Popularity (Stars + 2.5*Forks + 1.5*WeeklyTrending)
SELECT repo_full_name, stars, forks, stars_delta_7d, popularity_score, primary_language, broad_category 
FROM plugins ORDER BY popularity_score DESC LIMIT 10;

-- Plugins Using Direct Raw Socket API with High Adoption
SELECT repo_full_name, stars, forks, primary_language, raw_socket_details 
FROM plugins WHERE uses_raw_socket = 1 ORDER BY stars DESC LIMIT 10;

-- Plugins Bundling AI Agent Skills
SELECT repo_full_name, stars, primary_language, agent_skills_details 
FROM plugins WHERE uses_agent_skills = 1 ORDER BY stars DESC LIMIT 10;

-- Plugins with Automated Tests and Cross-Platform Support
SELECT repo_full_name, primary_language, total_loc, has_tests, is_cross_platform 
FROM plugins WHERE has_tests = 1 AND is_cross_platform = 1 ORDER BY stars DESC LIMIT 10;

-- Top Official Herdr Endpoints Never Called by Any Community Plugin (Zero-Usage)
SELECT e.endpoint, e.endpoint_type, e.category, e.doc_url 
FROM herdr_official_endpoints e
LEFT JOIN (SELECT endpoint, COUNT(DISTINCT plugin_id) as cnt FROM plugin_endpoints GROUP BY endpoint) pe 
  ON e.endpoint = pe.endpoint 
WHERE COALESCE(pe.cnt, 0) = 0 
ORDER BY e.endpoint ASC LIMIT 15;
```
