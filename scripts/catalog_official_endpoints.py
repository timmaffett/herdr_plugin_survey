#!/usr/bin/env python3
"""
Catalogs all official Herdr CLI and Socket API endpoints from herdr core (repos/herdrdev__herdr).
Stores them in plugins.db in table `herdr_official_endpoints`.
"""

import json, re, sqlite3, os

DB_PATH = "plugins.db"
CORE_SCHEMA_PATH = "repos/herdrdev__herdr/docs/next/api/herdr-api.schema.json"
CORE_CLI_PATH = "repos/herdrdev__herdr/src/cli/spec.rs"

def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS herdr_official_endpoints (
        endpoint TEXT PRIMARY KEY,
        endpoint_type TEXT,
        category TEXT,
        description TEXT,
        doc_url TEXT
    );
    """)

    endpoints = {}

    # 1. Socket methods from herdr-api.schema.json
    if os.path.exists(CORE_SCHEMA_PATH):
        with open(CORE_SCHEMA_PATH) as f:
            schema = json.load(f)

        for item in schema["schemas"]["request"]["oneOf"]:
            props = item.get("properties", {})
            if "method" in props:
                m = props["method"].get("enum") or props["method"].get("const")
                methods = m if isinstance(m, list) else [m] if m else []
                desc = item.get("description") or props["method"].get("description") or ""
                for method in methods:
                    cat = method.split(".")[0] if "." in method else "general"
                    slug = method.replace(".", "-")
                    endpoints[method] = {
                        "endpoint": method,
                        "endpoint_type": "socket_method",
                        "category": cat.capitalize(),
                        "description": desc,
                        "doc_url": f"https://github.com/herdrdev/herdr/blob/main/docs/SOCKET_API.md#{slug}"
                    }

        # 2. Events from herdr-api.schema.json
        defs = schema["schemas"]["event"].get("$defs", {})
        sub_defs = schema["schemas"]["subscription_event"].get("$defs", {})
        ev_kinds = set()
        if "EventKind" in defs:
            for e in defs["EventKind"].get("enum", []): ev_kinds.add(e)
        if "SubscriptionEventKind" in sub_defs:
            for e in sub_defs["SubscriptionEventKind"].get("enum", []): ev_kinds.add(e)

        for ev in ev_kinds:
            full_name = f"event:{ev}"
            cat = ev.split(".")[0].split("_")[0] if ("." in ev or "_" in ev) else "event"
            slug = ev.replace(".", "-").replace("_", "-")
            endpoints[full_name] = {
                "endpoint": full_name,
                "endpoint_type": "event_hook",
                "category": cat.capitalize(),
                "description": f"Herdr lifecycle event: {ev}",
                "doc_url": f"https://github.com/herdrdev/herdr/blob/main/docs/PLUGINS.md#{slug}"
            }

    # 3. CLI commands from cli/spec.rs
    if os.path.exists(CORE_CLI_PATH):
        with open(CORE_CLI_PATH) as f:
            text = f.read()

        fns = re.split(r"(fn\s+[a-zA-Z0-9_]+_command\s*\(\)\s*->\s*Command)", text)
        fn_map = {}
        for i in range(1, len(fns), 2):
            fn_sig = fns[i]
            fn_body = fns[i+1] if i+1 < len(fns) else ""
            name_m = re.search(r"Command::new\(\"([^\"]+)\"\)", fn_body)
            if name_m:
                primary = name_m.group(1)
                subs = re.findall(r"\.subcommand\(\s*Command::new\(\"([^\"]+)\"\)", fn_body)
                fn_map[primary] = subs

        # Build CLI command paths
        for primary, subs in fn_map.items():
            cmd_root = f"cli:{primary}"
            slug_root = primary
            endpoints[cmd_root] = {
                "endpoint": cmd_root,
                "endpoint_type": "cli_command",
                "category": primary.capitalize(),
                "description": f"herdr {primary} command",
                "doc_url": f"https://github.com/herdrdev/herdr/blob/main/docs/CLI.md#{slug_root}"
            }
            for sub in subs:
                cmd_full = f"cli:{primary} {sub}"
                slug_full = f"{primary}-{sub}"
                endpoints[cmd_full] = {
                    "endpoint": cmd_full,
                    "endpoint_type": "cli_command",
                    "category": primary.capitalize(),
                    "description": f"herdr {primary} {sub} command",
                    "doc_url": f"https://github.com/herdrdev/herdr/blob/main/docs/CLI.md#{slug_full}"
                }

    print(f"Cataloged {len(endpoints)} official Herdr endpoints from core.")

    # Upsert into database
    for ep, d in endpoints.items():
        cursor.execute("""
        INSERT OR REPLACE INTO herdr_official_endpoints (endpoint, endpoint_type, category, description, doc_url)
        VALUES (?, ?, ?, ?, ?)
        """, (d["endpoint"], d["endpoint_type"], d["category"], d["description"], d["doc_url"]))

    conn.commit()

    # Query stats
    cursor.execute("""
    SELECT 
        COUNT(e.endpoint) as total_official,
        SUM(CASE WHEN pe.cnt > 0 THEN 1 ELSE 0 END) as used_endpoints,
        SUM(CASE WHEN pe.cnt IS NULL OR pe.cnt = 0 THEN 1 ELSE 0 END) as zero_usage_endpoints
    FROM herdr_official_endpoints e
    LEFT JOIN (
        SELECT endpoint, COUNT(DISTINCT plugin_id) as cnt
        FROM plugin_endpoints
        GROUP BY endpoint
    ) pe ON e.endpoint = pe.endpoint;
    """)
    row = cursor.fetchone()
    print("--------------------------------------------------")
    print(f"Total Official Core Endpoints: {row[0]}")
    print(f"Endpoints Used by Plugins:     {row[1]} ({round((row[1]/row[0])*100, 1)}%)")
    print(f"Zero-Usage Endpoints (0 calls): {row[2]} ({round((row[2]/row[0])*100, 1)}%)")
    print("--------------------------------------------------")

    cursor.execute("""
    SELECT e.endpoint, e.endpoint_type, e.category, COALESCE(pe.cnt, 0) as cnt
    FROM herdr_official_endpoints e
    LEFT JOIN (
        SELECT endpoint, COUNT(DISTINCT plugin_id) as cnt
        FROM plugin_endpoints
        GROUP BY endpoint
    ) pe ON e.endpoint = pe.endpoint
    WHERE COALESCE(pe.cnt, 0) = 0
    ORDER BY e.endpoint ASC
    LIMIT 20;
    """)
    zero_rows = cursor.fetchall()
    print("Sample Zero-Usage Official Endpoints (0 plugins call them):")
    for r in zero_rows:
        print(f" - {r[0]:<35} ({r[1]}, {r[2]}): 0 calls")

    conn.close()

if __name__ == "__main__":
    main()
