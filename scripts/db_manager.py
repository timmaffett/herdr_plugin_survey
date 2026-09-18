"""
Database manager for Herdr plugins SQLite database (plugins.db).
Supports initial schema setup, dynamic column creation/migrations, upserts, and analytics.
"""

import sqlite3
import json
import os

DB_PATH = "plugins.db"

SCHEMA_PLUGINS = """
CREATE TABLE IF NOT EXISTS plugins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_full_name TEXT UNIQUE NOT NULL,
    repo_name TEXT NOT NULL,
    repo_owner TEXT NOT NULL,
    repo_url TEXT NOT NULL,
    surveyed_commit_hash TEXT,
    surveyed_commit_date TEXT,
    surveyed_version TEXT,
    upstream_head_commit TEXT,
    upstream_pushed_at TEXT,
    is_out_of_date INTEGER DEFAULT 0,
    last_synced_at TEXT,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    open_issues INTEGER DEFAULT 0,
    stars_delta_7d INTEGER DEFAULT 0,
    popularity_score REAL DEFAULT 0.0,
    is_trending_weekly INTEGER DEFAULT 0,
    primary_language TEXT,
    created_at TEXT,
    updated_at TEXT,
    pushed_at TEXT,
    topics TEXT,
    total_files INTEGER DEFAULT 0,
    total_dirs INTEGER DEFAULT 0,
    total_loc INTEGER DEFAULT 0,
    file_language_dist TEXT,
    loc_language_dist TEXT,
    contributors_count INTEGER DEFAULT 1,
    has_tests INTEGER DEFAULT 0,
    has_ci_workflows INTEGER DEFAULT 0,
    has_license INTEGER DEFAULT 0,
    has_dockerfile INTEGER DEFAULT 0,
    readme_summary TEXT,
    description TEXT,
    has_manifest INTEGER DEFAULT 1,
    manifest_id TEXT,
    manifest_name TEXT,
    manifest_version TEXT,
    min_herdr_version TEXT,
    platforms TEXT,
    is_cross_platform INTEGER DEFAULT 0,
    manifest_actions_count INTEGER DEFAULT 0,
    manifest_panes_count INTEGER DEFAULT 0,
    manifest_events_count INTEGER DEFAULT 0,
    manifest_startup_count INTEGER DEFAULT 0,
    manifest_build_count INTEGER DEFAULT 0,
    manifest_link_handlers_count INTEGER DEFAULT 0,
    has_build_steps INTEGER DEFAULT 0,
    has_startup_hook INTEGER DEFAULT 0,
    has_link_handlers INTEGER DEFAULT 0,
    has_modal_popup INTEGER DEFAULT 0,
    pane_placement_types TEXT,
    manifest_raw_json TEXT,
    broad_category TEXT,
    sub_category TEXT,
    sub_sub_category TEXT,
    category_tags TEXT,
    adds_communications INTEGER DEFAULT 0,
    presents_tui INTEGER DEFAULT 0,
    interfaces_mobile INTEGER DEFAULT 0,
    uses_web_display INTEGER DEFAULT 0,
    uses_ai_model_directly INTEGER DEFAULT 0,
    git_worktree_aware INTEGER DEFAULT 0,
    network_protocol TEXT DEFAULT 'none',
    tunnel_service TEXT DEFAULT 'none',
    state_storage_type TEXT DEFAULT 'none',
    auth_strategy TEXT DEFAULT 'none',
    integrates_editor TEXT DEFAULT 'none',
    terminal_multiplexers_supported TEXT,
    is_token_optimizer INTEGER DEFAULT 0,
    is_quota_manager INTEGER DEFAULT 0,
    has_prebuilt_binaries INTEGER DEFAULT 0,
    mcp_support INTEGER DEFAULT 0,
    uses_herdr_state_dir INTEGER DEFAULT 0,
    uses_herdr_config_dir INTEGER DEFAULT 0,
    uses_ssh INTEGER DEFAULT 0,
    uses_mosh INTEGER DEFAULT 0,
    uses_vpn_tailscale INTEGER DEFAULT 0,
    mentions_port_mapping INTEGER DEFAULT 0,
    mentions_router_setup INTEGER DEFAULT 0,
    mentions_vps_gateway INTEGER DEFAULT 0,
    requires_remote_infra INTEGER DEFAULT 0,
    remote_infra_details TEXT,
    herdr_socket_methods TEXT,
    herdr_cli_commands TEXT,
    herdr_env_vars TEXT,
    agent_scope TEXT DEFAULT 'general',
    supported_agents TEXT,
    agent_data_collection TEXT,
    agent_data_details TEXT,
    last_analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

SCHEMA_AUXILIARY = """
CREATE TABLE IF NOT EXISTS plugin_endpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plugin_id INTEGER,
    repo_full_name TEXT,
    endpoint TEXT,
    source_type TEXT,
    FOREIGN KEY(plugin_id) REFERENCES plugins(id)
);

CREATE TABLE IF NOT EXISTS plugin_agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plugin_id INTEGER,
    repo_full_name TEXT,
    agent_name TEXT,
    collection_methods TEXT,
    FOREIGN KEY(plugin_id) REFERENCES plugins(id)
);

CREATE TABLE IF NOT EXISTS plugin_manifest_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plugin_id INTEGER,
    repo_full_name TEXT,
    item_type TEXT,
    item_id TEXT,
    title TEXT,
    placement TEXT,
    command TEXT,
    FOREIGN KEY(plugin_id) REFERENCES plugins(id)
);

CREATE INDEX IF NOT EXISTS idx_plugins_stars ON plugins(stars DESC);
CREATE INDEX IF NOT EXISTS idx_plugins_popularity ON plugins(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_plugins_broad_cat ON plugins(broad_category);
CREATE INDEX IF NOT EXISTS idx_plugins_lang ON plugins(primary_language);
CREATE INDEX IF NOT EXISTS idx_endpoints_name ON plugin_endpoints(endpoint);
CREATE INDEX IF NOT EXISTS idx_agents_name ON plugin_agents(agent_name);
"""

SCHEMA_DAILY_REPORTS = """
CREATE TABLE IF NOT EXISTS daily_reports (
    report_date TEXT PRIMARY KEY,
    day_number INTEGER,
    is_quiet_day INTEGER DEFAULT 0,
    headline TEXT,
    executive_summary TEXT,
    long_form_content TEXT,
    new_capabilities_json TEXT,
    plugins_released_count INTEGER DEFAULT 0,
    plugins_released_json TEXT,
    cumulative_plugins_count INTEGER DEFAULT 0,
    cumulative_stars_count INTEGER DEFAULT 0,
    cumulative_forks_count INTEGER DEFAULT 0,
    herdr_events_count INTEGER DEFAULT 0,
    herdr_events_json TEXT DEFAULT '[]',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_daily_reports_day ON daily_reports(day_number);
CREATE INDEX IF NOT EXISTS idx_daily_reports_quiet ON daily_reports(is_quiet_day);

CREATE TABLE IF NOT EXISTS herdr_core_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_date TEXT NOT NULL,
    event_type TEXT NOT NULL,
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    details_markdown TEXT,
    agent_name TEXT,
    version_tag TEXT,
    commit_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_herdr_events_date ON herdr_core_events(event_date);
CREATE INDEX IF NOT EXISTS idx_herdr_events_type ON herdr_core_events(event_type);

CREATE TABLE IF NOT EXISTS ecosystem_capabilities_ledger (
    capability_key TEXT PRIMARY KEY,
    capability_type TEXT,
    first_seen_date TEXT,
    first_plugin_id INTEGER,
    first_plugin_name TEXT,
    description TEXT,
    FOREIGN KEY(first_plugin_id) REFERENCES plugins(id)
);

CREATE INDEX IF NOT EXISTS idx_ledger_date ON ecosystem_capabilities_ledger(first_seen_date);
CREATE INDEX IF NOT EXISTS idx_ledger_type ON ecosystem_capabilities_ledger(capability_type);

CREATE TABLE IF NOT EXISTS daily_report_plugins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_date TEXT,
    plugin_id INTEGER,
    repo_full_name TEXT,
    is_breakthrough INTEGER DEFAULT 0,
    breakthrough_reasons_json TEXT,
    FOREIGN KEY(report_date) REFERENCES daily_reports(report_date),
    FOREIGN KEY(plugin_id) REFERENCES plugins(id)
);

CREATE INDEX IF NOT EXISTS idx_drp_date ON daily_report_plugins(report_date);
CREATE INDEX IF NOT EXISTS idx_drp_plugin ON daily_report_plugins(plugin_id);
"""

def get_connection(db_path=DB_PATH):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path=DB_PATH):
    conn = get_connection(db_path)
    cursor = conn.cursor()
    cursor.executescript(SCHEMA_PLUGINS)
    cursor.executescript(SCHEMA_AUXILIARY)
    cursor.executescript(SCHEMA_DAILY_REPORTS)
    conn.commit()
    conn.close()

def ensure_columns(conn, table_name, columns_dict):
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name});")
    existing_cols = {row["name"] for row in cursor.fetchall()}
    
    for col_name, col_type in columns_dict.items():
        if col_name not in existing_cols:
            cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type};")
            
    conn.commit()

def upsert_plugin(conn, record):
    cursor = conn.cursor()
    
    type_map = {}
    for k, v in record.items():
        if isinstance(v, bool):
            type_map[k] = "INTEGER DEFAULT 0"
        elif isinstance(v, int):
            type_map[k] = "INTEGER DEFAULT 0"
        elif isinstance(v, float):
            type_map[k] = "REAL DEFAULT 0.0"
        else:
            type_map[k] = "TEXT"
            
    ensure_columns(conn, "plugins", type_map)
    
    keys = list(record.keys())
    placeholders = ", ".join([f":{k}" for k in keys])
    update_clause = ", ".join([f"{k} = :{k}" for k in keys if k != "repo_full_name"])
    
    sql = f"""
    INSERT INTO plugins ({', '.join(keys)})
    VALUES ({placeholders})
    ON CONFLICT(repo_full_name) DO UPDATE SET
    {update_clause},
    last_analyzed_at = CURRENT_TIMESTAMP;
    """
    
    cursor.execute(sql, record)
    
    cursor.execute("SELECT id FROM plugins WHERE repo_full_name = ?", (record["repo_full_name"],))
    plugin_row = cursor.fetchone()
    plugin_id = plugin_row["id"]
    
    cursor.execute("DELETE FROM plugin_endpoints WHERE plugin_id = ?", (plugin_id,))
    cursor.execute("DELETE FROM plugin_agents WHERE plugin_id = ?", (plugin_id,))
    cursor.execute("DELETE FROM plugin_manifest_items WHERE plugin_id = ?", (plugin_id,))
    
    endpoints = json.loads(record.get("herdr_socket_methods", "[]"))
    for ep in endpoints:
        cursor.execute("""
            INSERT INTO plugin_endpoints (plugin_id, repo_full_name, endpoint, source_type)
            VALUES (?, ?, ?, ?)
        """, (plugin_id, record["repo_full_name"], ep, "socket_or_event"))
        
    cli_cmds = json.loads(record.get("herdr_cli_commands", "[]"))
    for cmd in cli_cmds:
        cursor.execute("""
            INSERT INTO plugin_endpoints (plugin_id, repo_full_name, endpoint, source_type)
            VALUES (?, ?, ?, ?)
        """, (plugin_id, record["repo_full_name"], f"cli:{cmd}", "cli"))

    agents = json.loads(record.get("supported_agents", "[]"))
    collection_methods = record.get("agent_data_collection", "[]")
    for ag in agents:
        cursor.execute("""
            INSERT INTO plugin_agents (plugin_id, repo_full_name, agent_name, collection_methods)
            VALUES (?, ?, ?, ?)
        """, (plugin_id, record["repo_full_name"], ag, collection_methods))
        
    try:
        manifest_raw = json.loads(record.get("manifest_raw_json", "[]"))
        for mf in manifest_raw:
            if not isinstance(mf, dict):
                continue
            for act in mf.get("actions", []):
                if isinstance(act, dict):
                    cursor.execute("""
                        INSERT INTO plugin_manifest_items (plugin_id, repo_full_name, item_type, item_id, title, placement, command)
                        VALUES (?, ?, 'action', ?, ?, NULL, ?)
                    """, (plugin_id, record["repo_full_name"], act.get("id"), act.get("title"), json.dumps(act.get("command", []))))
            for pne in mf.get("panes", []):
                if isinstance(pne, dict):
                    cursor.execute("""
                        INSERT INTO plugin_manifest_items (plugin_id, repo_full_name, item_type, item_id, title, placement, command)
                        VALUES (?, ?, 'pane', ?, ?, ?, ?)
                    """, (plugin_id, record["repo_full_name"], pne.get("id"), pne.get("title"), pne.get("placement", "overlay"), json.dumps(pne.get("command", []))))
    except Exception:
        pass
        
    conn.commit()
    return plugin_id

def get_summary_stats(conn):
    cursor = conn.cursor()
    
    stats = {}
    cursor.execute("SELECT COUNT(*) as cnt, SUM(total_loc) as total_loc, SUM(stars) as total_stars, SUM(forks) as total_forks FROM plugins;")
    row = cursor.fetchone()
    stats["total_plugins"] = row["cnt"]
    stats["total_loc"] = row["total_loc"] or 0
    stats["total_stars"] = row["total_stars"] or 0
    stats["total_forks"] = row["total_forks"] or 0
    
    cursor.execute("SELECT broad_category, COUNT(*) as cnt FROM plugins GROUP BY broad_category ORDER BY cnt DESC;")
    stats["categories"] = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("SELECT primary_language, COUNT(*) as cnt, SUM(total_loc) as loc FROM plugins GROUP BY primary_language ORDER BY cnt DESC;")
    stats["languages"] = [dict(r) for r in cursor.fetchall()]

    cursor.execute("""
        SELECT 
            SUM(adds_communications) as comms,
            SUM(presents_tui) as tui,
            SUM(interfaces_mobile) as mobile,
            SUM(uses_web_display) as web,
            SUM(git_worktree_aware) as worktree,
            SUM(uses_ai_model_directly) as direct_ai,
            SUM(mcp_support) as mcp,
            SUM(is_token_optimizer) as token_opt,
            SUM(is_quota_manager) as quota_mgr,
            SUM(has_modal_popup) as modal_popup,
            SUM(has_startup_hook) as startup_hook,
            SUM(has_build_steps) as build_steps,
            SUM(is_cross_platform) as cross_platform,
            SUM(uses_ssh) as ssh,
            SUM(uses_mosh) as mosh,
            SUM(uses_vpn_tailscale) as vpn,
            SUM(mentions_port_mapping) as port_mapping,
            SUM(mentions_router_setup) as router,
            SUM(mentions_vps_gateway) as vps,
            SUM(requires_remote_infra) as remote_infra,
            SUM(has_tests) as tests,
            SUM(has_ci_workflows) as ci
        FROM plugins;
    """)
    stats["features"] = dict(cursor.fetchone())

    cursor.execute("SELECT agent_name, COUNT(*) as cnt FROM plugin_agents GROUP BY agent_name ORDER BY cnt DESC;")
    stats["agents"] = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT endpoint, COUNT(*) as cnt FROM plugin_endpoints GROUP BY endpoint ORDER BY cnt DESC LIMIT 20;")
    stats["top_endpoints"] = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT tunnel_service, COUNT(*) as cnt FROM plugins WHERE tunnel_service != 'none' GROUP BY tunnel_service ORDER BY cnt DESC;")
    stats["tunnels"] = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT state_storage_type, COUNT(*) as cnt FROM plugins WHERE state_storage_type != 'none' GROUP BY state_storage_type ORDER BY cnt DESC;")
    stats["storage"] = [dict(r) for r in cursor.fetchall()]

    return stats
