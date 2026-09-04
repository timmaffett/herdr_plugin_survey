"""
Master Survey Runner for Top 500 Herdr Plugins.
Analyzes repositories, extracts multi-dimensional traits, evolves SQLite schema,
and writes comprehensive analytics.
"""

import sys
import os
import json
import time

sys.path.insert(0, os.path.abspath("."))
from scripts.analyzer import analyze_repository
from scripts.db_manager import init_db, get_connection, upsert_plugin, get_summary_stats

def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else "top500_plugins.json"
    
    print("=" * 70)
    print(f"Herdr Plugins Ecosystem Survey: Processing {input_file}")
    print("=" * 70)
    
    init_db("plugins.db")
    conn = get_connection("plugins.db")
    
    with open(input_file) as f:
        plugins_meta = json.load(f)
        
    print(f"Loaded metadata for {len(plugins_meta)} repositories.")
    
    t0 = time.time()
    successful = 0
    errors = []
    
    for idx, meta in enumerate(plugins_meta, 1):
        full_name = meta["fullName"]
        clean_name = full_name.replace("/", "__")
        repo_path = os.path.join("repos", clean_name)
        
        if not os.path.exists(repo_path):
            print(f"[{idx}/{len(plugins_meta)}] Warning: {repo_path} missing. Skipping.")
            errors.append((full_name, "Repo path missing"))
            continue
            
        try:
            record = analyze_repository(repo_path, meta)
            plugin_id = upsert_plugin(conn, record)
            successful += 1
            if idx % 50 == 0 or idx == len(plugins_meta):
                elapsed = round(time.time() - t0, 1)
                print(f"[{idx}/{len(plugins_meta)}] Analyzed {full_name} -> ID {plugin_id} ({elapsed}s)")
        except Exception as e:
            print(f"[{idx}/{len(plugins_meta)}] Error analyzing {full_name}: {e}")
            errors.append((full_name, str(e)))
            
    total_time = round(time.time() - t0, 2)
    print(f"\nSuccessfully analyzed and cataloged {successful}/{len(plugins_meta)} plugins in {total_time}s.")
    if errors:
        print(f"Encountered {len(errors)} issues:")
        for err in errors[:5]:
            print("  -", err)
            
    stats = get_summary_stats(conn)
    conn.close()
    
    print("\n" + "=" * 70)
    print("TOP 500 HERDR ECOSYSTEM SURVEY SUMMARY")
    print("=" * 70)
    print(f"Total Plugins Analyzed: {stats['total_plugins']}")
    print(f"Total LOC Scanned:     {stats['total_loc']:,}")
    print(f"Total Stars:           {stats['total_stars']:,} ★")
    print(f"Total Forks:           {stats['total_forks']:,} ⑂")
    
    print("\nBroad Category Breakdown:")
    for cat in stats["categories"]:
        print(f"  - {cat['broad_category']}: {cat['cnt']}")
        
    print("\nPrimary Language Breakdown:")
    for l in stats["languages"]:
        print(f"  - {l['primary_language']}: {l['cnt']} ({l['loc']:,} LOC)")

    print("\nKey Architecture Traits:")
    f = stats["features"]
    print(f"  - TUI Interfaces:             {f['tui']}")
    print(f"  - Web / HTML Display:         {f['web']}")
    print(f"  - Mobile & Remote Relays:     {f['mobile']}")
    print(f"  - External Comms:             {f['comms']}")
    print(f"  - Git Worktree / VCS Aware:   {f['worktree']}")
    print(f"  - Direct LLM Invocations:     {f['direct_ai']}")
    print(f"  - MCP Protocol Support:       {f['mcp']}")
    print(f"  - Cross-Platform (All 3 OS):  {f['cross_platform']}")
    print(f"  - Modal Popups:               {f['modal_popup']}")
    print(f"  - Automated Startup Hooks:    {f['startup_hook']}")
    print(f"  - Build Steps Declared:       {f['build_steps']}")
    print(f"  - Contains Automated Tests:   {f['tests']}")
    print(f"  - CI Workflows (GitHub):      {f['ci']}")

    print("\nTop AI Agents Supported:")
    for a in stats["agents"]:
        print(f"  - {a['agent_name']}: {a['cnt']}")

    print("\nTop Invoked Herdr Endpoints:")
    for ep in stats["top_endpoints"][:15]:
        print(f"  - {ep['endpoint']}: {ep['cnt']}")

    with open("survey_summary.json", "w") as out:
        json.dump(stats, out, indent=2)
    print("\nSaved comprehensive stats to survey_summary.json")

if __name__ == "__main__":
    main()
