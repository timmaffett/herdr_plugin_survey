# Herdr Plugins Intelligence & Pipeline Engineering Guide
*A comprehensive operational guide for current and future AI coding assistants (Claudes, Agys, and human engineers).*

---

## 1. System Architecture Overview

The Herdr Plugins Survey is an automated pipeline that discovers, clones, parses, statically analyzes, and catalogs community plugins for [Herdr](https://herdr.dev).

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌──────────────────────┐
│ https://herdr.dev/     │ ───> │ scripts/clone_repos.py  │ ───> │ repos/<owner>__<repo>│
│ plugins/ marketplace   │      │ (parallel git checkout) │      │ (500 shallow clones) │
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
| [`scripts/ingest_plugin.py`](file:///Users/tim/source/herdr_plugins/scripts/ingest_plugin.py) | Ingest & analyze a single new plugin repository | `python3 scripts/ingest_plugin.py owner/repo` |
| [`scripts/run_survey.py`](file:///Users/tim/source/herdr_plugins/scripts/run_survey.py) | Master orchestrator to scan all repos and update `plugins.db` | `python3 scripts/run_survey.py top500_plugins.json` |
| [`scripts/analyzer.py`](file:///Users/tim/source/herdr_plugins/scripts/analyzer.py) | Static/semantic code analyzer, manifest reader, endpoint detector | Imported by survey and ingest scripts |
| [`scripts/db_manager.py`](file:///Users/tim/source/herdr_plugins/scripts/db_manager.py) | SQLite database manager with dynamic column migration | `python3 -c "import scripts.db_manager as db; db.init_db()"` |
| [`scripts/taxonomy.py`](file:///Users/tim/source/herdr_plugins/scripts/taxonomy.py) | Classification heuristics for Broad, Sub, and Sub-Sub categories | Imported by analyzer |
| [`scripts/clone_repos.py`](file:///Users/tim/source/herdr_plugins/scripts/clone_repos.py) | Multi-threaded shallow cloner for any batch of repositories | `python3 scripts/clone_repos.py top500_plugins.json 12` |

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
6. Detects supported AI agents (Claude Code, OpenCode, Codex, Amp, Cursor, Grok, Agy, Cline, Devin, etc.) and data ingestion methods (`acp`, `log_file_scraping`, `socket_events`, `terminal_snooping`, `cli_proxy`, etc.).
7. Classifies into Broad, Sub, and Sub-Sub categories and tags.
8. Automatically detects and adds any missing schema columns in `plugins.db`.
9. Upserts into `plugins.db` and updates auxiliary relational tables (`plugin_endpoints`, `plugin_agents`, `plugin_manifest_items`).

---

## 4. How to Expand the Dataset with Bulk Ingestions

If you want to survey additional batches:

1. **Extract new repositories to JSON** (e.g. `next_batch.json`).
2. **Run parallel shallow clone**:
   ```bash
   python3 scripts/clone_repos.py next_batch.json 12
   ```
3. **Run Survey Aggregation**:
   ```bash
   python3 scripts/run_survey.py next_batch.json
   ```

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
4. Run `python3 scripts/run_survey.py top500_plugins.json`.
   All plugins will be re-analyzed and the new column will be back-filled across all existing records without data loss!

---

## 6. Running and Extending the Node.js Web Server

### Starting the Server
```bash
# Starts Express server on port 3000:
npm start
# Or directly:
node server.js
```
The application will be accessible at `http://localhost:3000`.

### Available REST Endpoints
- `GET /api/stats`: Ecosystem aggregate counts, category distributions, language shares, and top Herdr endpoints.
- `GET /api/plugins`: Filterable plugin listing supporting `?q=`, `?category=`, `?language=`, `?agent=`, `?tui=1`, `?mobile=1`, `?web=1`, `?cross_platform=1`, `?tests=1`, `?trending=1`, `?sort=popularity`, `?order=desc`.
- `GET /api/plugins/:id`: Full profile of a specific plugin including manifest items, endpoints, and agent collection architecture.
- `POST /api/query`: Live read-only SQL query runner. Pass JSON `{"sql": "SELECT ... FROM plugins ..."}`.

---

## 7. Useful SQL Recipes for Intelligence Work

```sql
-- Top 10 Plugins by Composite Popularity (Stars + 2.5*Forks + 1.5*WeeklyTrending)
SELECT repo_full_name, stars, forks, stars_delta_7d, popularity_score, primary_language, broad_category 
FROM plugins ORDER BY popularity_score DESC LIMIT 10;

-- Plugins with Automated Tests and Cross-Platform Support
SELECT repo_full_name, primary_language, total_loc, has_tests, is_cross_platform 
FROM plugins WHERE has_tests = 1 AND is_cross_platform = 1 ORDER BY stars DESC LIMIT 10;

-- Claude Code Log Scraping vs OpenCode ACP Breakdown
SELECT agent_name, collection_methods, COUNT(*) as plugins_using 
FROM plugin_agents 
GROUP BY agent_name, collection_methods ORDER BY plugins_using DESC LIMIT 15;

-- Top Herdr Socket API Endpoints Across All 500 Plugins
SELECT endpoint, COUNT(*) as usage_count 
FROM plugin_endpoints 
WHERE source_type = 'socket_or_event'
GROUP BY endpoint ORDER BY usage_count DESC LIMIT 15;
```
