# Implementation Plan - Daily Intelligence Reports & Capability Timeline

Build an append-only, chronological **Daily Report** subsystem with backward virtual scrolling, long-form newspaper writeups, and ecosystem novelty/breakthrough tracking from Day 1 (Jan 1, 2026) through Today (Sep 7, 2026).

## User Decisions
- **Calendar Coverage**: Option B — Every single day (all 250 days) gets a report (active release days get full plugin breakdowns; quiet days feature an "Ecosystem Pulse" update).
- **Date Normalization**: Yes — Pre-2026 dotfiles repositories are normalized to their first Herdr commit/marketplace date so they appear accurately in late August 2026.
- **Article Style**: Executive Summary Card + Long-Form Newspaper Layout with detailed architectural writeups.
- **Navigation**: Dedicated top-level primary tab ("📰 Daily Reports") with reverse-chronological infinite scroll, Date Picker jump, and Genesis (Day 1) jump.

---

## Architecture & Implementation Steps

### Step 1: Database Schema Migration
Add two new tables to [`plugins.db`](file:///Users/tim/source/herdr_plugins/plugins.db):
1. `daily_reports`:
   - `report_date TEXT PRIMARY KEY` (`YYYY-MM-DD`)
   - `day_number INTEGER` (1 to 250)
   - `is_quiet_day INTEGER` (0 or 1)
   - `headline TEXT`
   - `executive_summary TEXT`
   - `long_form_content TEXT` (Structured Markdown/HTML newspaper article)
   - `new_capabilities_json TEXT` (JSON array of capabilities first seen on this date)
   - `plugins_released_count INTEGER`
   - `plugins_released_json TEXT`
   - `cumulative_plugins_count INTEGER`
   - `cumulative_stars_count INTEGER`
   - `cumulative_forks_count INTEGER`
   - `generated_at TIMESTAMP`
   - `generated_by TEXT`
2. `ecosystem_capabilities_ledger`:
   - `capability_key TEXT PRIMARY KEY`
   - `capability_type TEXT`
   - `first_seen_date TEXT`
   - `first_plugin_id INTEGER`
   - `first_plugin_name TEXT`
   - `description TEXT`

### Step 2: Generation Engine & Backfill (`scripts/daily_report_generator.py`)
- Walk chronologically day-by-day from Jan 1, 2026 to Sep 7, 2026.
- Detect novel capabilities for each day by diffing against `ecosystem_capabilities_ledger`.
- Generate compelling headlines, executive summaries, and multi-paragraph newspaper articles.
- Append to `daily_reports` (immutable and append-only).
- Support future `--date YYYY-MM-DD` execution for autonomous agent daily cron runs.

### Step 3: Backend API in `server.js`
- `GET /api/daily-reports`:
  - Bidirectional cursor pagination (`before_date`, `after_date`, `limit`).
  - `date` direct jump.
  - `breakthroughs_only` filter.
- `GET /api/daily-reports/stats`: Ecosystem report statistics.

### Step 4: Frontend UI in `public/`
- Add "📰 Daily Reports" navigation tab in [`public/index.html`](file:///Users/tim/source/herdr_plugins/public/index.html).
- Build sticky date navigation bar with date picker, "Today", "Day 1 (Genesis)", and "🌟 Breakthroughs" filter.
- Render executive summary cards and long-form newspaper columns in [`public/app.js`](file:///Users/tim/source/herdr_plugins/public/app.js).
- Add Catppuccin Ink newspaper editorial styling in [`public/style.css`](file:///Users/tim/source/herdr_plugins/public/style.css).

### Step 5: Verification & Commit
- Verify all 250 days backfilled in SQLite.
- Test UI scrolling backwards and forward.
- Stage, commit, and update documentation.

---

## Operational Protocol: Fresh Marketplace Gets & Shallow Repo Retrievals

> [!IMPORTANT]
> **MANDATORY PRE-FLIGHT REQUIREMENT**: Before generating any daily summary or running daily cron reports, the system **MUST** perform fresh marketplace catalog fetches and shallow repository retrievals for anything changed or new.

### 1. The Discrepancy & Metric Accounting
- On [`herdr.dev/plugins`](https://herdr.dev/plugins/), the live index exposes `pluginCount` (986 plugins, previously 985) across `repositoryCount` (969 repositories).
- In the Herdr ecosystem, **one repository can host multiple installable plugins** (e.g., `tyler-jewell/herdr-plugins` provides 6 plugins; `alastairsounds/herdr-plugins` provides 4 plugins).
- Our database [`plugins.db`](file:///Users/tim/source/herdr_plugins/plugins.db) records 977 community repositories and 994 individual plugin extensions.
- When generating reports, both total plugins (manifests) and underlying repositories must be accounted for cleanly, avoiding confusion between repository counts and individual plugin counts.

### 2. Autonomous Daily Cron & Runner Workflow
When generating today's daily dispatch (`python3 scripts/daily_report_generator.py --date <YYYY-MM-DD>` or with `--sync`):
1. **Fresh Marketplace Scrape**:
   ```bash
   curl -sL https://herdr.dev/plugins/ | python3 -c '... extract initialData ...'
   ```
   Save the updated catalog into [`all_plugins.json`](file:///Users/tim/source/herdr_plugins/all_plugins.json).
2. **Detect New Uncataloged Repositories**:
   Compare the live marketplace list against `plugins.db`. If any plugins exist on the marketplace that are missing from `plugins.db`, shallow clone them immediately (`git clone --depth 1 -c filter.lfs.process= ...`) and execute `analyze_repository` to upsert them into `plugins.db`.
3. **Fast-Forward Outdated Repositories**:
   Compare each repository's `surveyed_commit_hash` against `headCommit`. If a newer upstream commit exists, run:
   ```bash
   git -C repos/<owner__repo> fetch --depth 1 origin HEAD && git -C repos/<owner__repo> reset --hard FETCH_HEAD
   ```
   Re-run AST analysis and update metrics in `plugins.db`.
4. **Milestone History Alignment**:
   Run `python3 scripts/collect_history.py --workers 16` to ensure the 36-week milestone timeline (`plugin_history`) includes the new repositories.
5. **Daily Dispatch Generation**:
   Run `python3 scripts/daily_report_generator.py --date <YYYY-MM-DD> --force` (or pass `--sync` to execute steps 1–4 automatically).

