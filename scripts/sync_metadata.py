#!/usr/bin/env python3
"""
Herdr Plugins Metadata Sync & Staleness Checker.
Compares surveyed git commit hashes and dates against live marketplace / GitHub upstream data,
refreshes stars, forks, open issues, and detects which plugins need re-surveying.

Usage:
    python3 scripts/sync_metadata.py --check-staleness
    python3 scripts/sync_metadata.py --update-stats
    python3 scripts/sync_metadata.py --pull-outdated
"""

import sys
import os
import argparse
import json
import sqlite3
import subprocess
import urllib.request
import re
from datetime import datetime

sys.path.insert(0, os.path.abspath("."))
from scripts.db_manager import get_connection, upsert_plugin
from scripts.analyzer import analyze_repository

DB_PATH = "plugins.db"

def fetch_live_marketplace_data():
    url = "https://herdr.dev/plugins/"
    try:
        cmd = ["curl", "-sL", url]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        if res.returncode == 0 and "initialData" in res.stdout:
            m = re.search(r"const initialData = (\{.*?\});", res.stdout)
            if m:
                return json.loads(m.group(1)).get("plugins", [])
    except Exception as e:
        print(f"[Warning] Could not fetch live marketplace data: {e}")
    return None

def check_staleness(conn):
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, repo_full_name, surveyed_version, surveyed_commit_hash, 
               surveyed_commit_date, upstream_head_commit, upstream_pushed_at, is_out_of_date
        FROM plugins
        ORDER BY is_out_of_date DESC, stars DESC;
    """)
    rows = cursor.fetchall()
    outdated = [r for r in rows if r["is_out_of_date"] == 1]
    
    print("\n" + "=" * 75)
    print(f"STALENESS REPORT: {len(outdated)} / {len(rows)} plugins are out of date")
    print("=" * 75)
    
    if outdated:
        print(f"{'Repository':<36} | {'Surveyed Commit':<12} | {'Upstream Commit':<12} | Status")
        print("-" * 75)
        for r in outdated[:20]:
            s_hash = (r["surveyed_commit_hash"] or "")[:8]
            u_hash = (r["upstream_head_commit"] or "")[:8]
            print(f"{r['repo_full_name']:<36} | {s_hash:<12} | {u_hash:<12} | ⚠️ Update Available")
        if len(outdated) > 20:
            print(f"... and {len(outdated) - 20} more plugins.")
    else:
        print("All plugins in database match their recorded upstream HEAD commits!")
    return outdated

def update_repo_stats(conn, live_plugins=None):
    if live_plugins is None:
        print("[Sync] Fetching latest marketplace metadata from https://herdr.dev/plugins/...")
        live_plugins = fetch_live_marketplace_data()
        
    if not live_plugins:
        print("[Error] No live metadata available to sync.")
        return 0
        
    cursor = conn.cursor()
    updated_count = 0
    now = datetime.utcnow().isoformat() + "Z"
    
    for p in live_plugins:
        full_name = p.get("fullName")
        if not full_name:
            continue
            
        stars = p.get("stars") or 0
        forks = p.get("forks") or 0
        issues = p.get("openIssues") or 0
        delta7d = p.get("starsDelta7d") or 0
        upstream_hash = p.get("headCommit") or ""
        upstream_pushed = p.get("pushedAt") or ""
        pop_score = round(stars * 1.0 + forks * 2.5 + delta7d * 1.5, 2)
        is_trending = 1 if delta7d > 5 else 0

        # Check existing surveyed commit to recompute staleness
        cursor.execute("SELECT surveyed_commit_hash, surveyed_commit_date FROM plugins WHERE repo_full_name = ?", (full_name,))
        existing = cursor.fetchone()
        if not existing:
            continue
            
        s_hash = existing["surveyed_commit_hash"] or ""
        s_date = existing["surveyed_commit_date"] or ""
        
        is_out_of_date = 0
        if upstream_hash and s_hash and upstream_hash != s_hash:
            is_out_of_date = 1
        elif upstream_pushed and s_date and upstream_pushed > s_date:
            is_out_of_date = 1

        cursor.execute("""
            UPDATE plugins SET
                stars = ?,
                forks = ?,
                open_issues = ?,
                stars_delta_7d = ?,
                popularity_score = ?,
                is_trending_weekly = ?,
                upstream_head_commit = ?,
                upstream_pushed_at = ?,
                is_out_of_date = ?,
                last_synced_at = ?
            WHERE repo_full_name = ?;
        """, (stars, forks, issues, delta7d, pop_score, is_trending, upstream_hash, upstream_pushed, is_out_of_date, now, full_name))
        
        updated_count += 1
        
    conn.commit()
    print(f"[Sync] Successfully refreshed stars, forks, and trending metrics for {updated_count} plugins.")
    return updated_count

def pull_outdated(conn):
    outdated = check_staleness(conn)
    if not outdated:
        print("Nothing to pull. Database is completely up to date.")
        return
        
    print(f"\n[Pull] Updating and re-analyzing {len(outdated)} out-of-date plugins...")
    reanalyzed = 0
    
    for r in outdated:
        full_name = r["repo_full_name"]
        clean_name = full_name.replace("/", "__")
        repo_path = os.path.join("repos", clean_name)
        
        if not os.path.exists(repo_path):
            continue
            
        print(f" - Pulling latest commit for {full_name}...")
        try:
            pull_env = {**os.environ, "GIT_TERMINAL_PROMPT": "0", "GIT_ASKPASS": "echo"}
            pull_res = subprocess.run(
                ["git", "-C", repo_path, "pull", "--depth", "1"],
                capture_output=True,
                text=True,
                timeout=15,
                env=pull_env
            )
            if pull_res.returncode != 0:
                print(f"   [Notice] git pull failed ({pull_res.stderr.strip()[:60] if pull_res.stderr else 'code ' + str(pull_res.returncode)}), proceeding with analysis...")
        except Exception as e:
            print(f"   [Warning] git pull timed out/skipped for {full_name}: {e}")
        
        # Build mock meta for re-analysis
        meta = {
            "fullName": full_name,
            "name": r["repo_full_name"].split("/")[1],
            "owner": r["repo_full_name"].split("/")[0],
            "url": f"https://github.com/{full_name}",
            "headCommit": r["upstream_head_commit"],
            "pushedAt": r["upstream_pushed_at"]
        }
        
        record = analyze_repository(repo_path, meta)
        record["is_out_of_date"] = 0
        upsert_plugin(conn, record)
        reanalyzed += 1
        
    print(f"\n[Pull] Successfully updated and re-analyzed {reanalyzed} plugins.")

def main():
    parser = argparse.ArgumentParser(description="Herdr Plugins Staleness Checker & Fast Metadata Syncer")
    parser.add_argument("--check-staleness", action="store_true", help="Check for out-of-date plugins against upstream commits")
    parser.add_argument("--update-stats", action="store_true", help="Refresh stars, forks, and trending metrics from live marketplace")
    parser.add_argument("--pull-outdated", action="store_true", help="Git pull and re-analyze all out-of-date repositories")
    parser.add_argument("--catalog-endpoints", action="store_true", help="Re-scan core Herdr repo and update official endpoints database")
    args = parser.parse_args()

    conn = get_connection(DB_PATH)
    
    if args.catalog_endpoints:
        subprocess.run([sys.executable, "scripts/catalog_official_endpoints.py"])
    elif args.update_stats:
        update_repo_stats(conn)
    elif args.pull_outdated:
        pull_outdated(conn)
    else:
        # Default action: check staleness
        check_staleness(conn)
        
    conn.close()

if __name__ == "__main__":
    main()
