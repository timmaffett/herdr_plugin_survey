#!/usr/bin/env python3
"""
Full Autonomous Ecosystem Update Pipeline for Herdr Plugins Survey.
1. Syncs live marketplace catalog and metadata from https://herdr.dev/plugins/
2. Identifies brand new plugins, clones them in parallel, and analyzes them into plugins.db
3. Identifies out-of-date plugins, pulls latest commits, and re-analyzes them
4. Updates all star/fork/issue metrics and staleness flags
5. Re-catalogs official Core endpoints and doc deep-links
6. Regenerates 36-week historical milestone timelines
"""

import sys
import os
import json
import sqlite3
import subprocess
import time
import re
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, os.path.abspath("."))
from scripts.db_manager import get_connection, upsert_plugin, init_db
from scripts.analyzer import analyze_repository
import scripts.catalog_official_endpoints as catalog_script

DB_PATH = "plugins.db"
REPOS_DIR = "repos"
os.makedirs(REPOS_DIR, exist_ok=True)

def fetch_live_marketplace():
    print("[1/6] Fetching live marketplace catalog from https://herdr.dev/plugins/...")
    cmd = ["curl", "-sL", "https://herdr.dev/plugins/"]
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
    if res.returncode != 0 or "initialData" not in res.stdout:
        raise RuntimeError("Failed to download or parse initialData from herdr.dev/plugins/")
    
    m = re.search(r"const initialData = (\{.*?\});", res.stdout)
    if not m:
        raise RuntimeError("Regex match failed for initialData JSON payload")
        
    data = json.loads(m.group(1))
    plugins = data.get("plugins", [])
    print(f"      Successfully fetched {len(plugins)} plugins from marketplace.")
    
    # Save to all_plugins.json
    with open("all_plugins.json", "w") as f:
        json.dump(plugins, f, indent=2)
    print("      Saved updated manifest to all_plugins.json.")
    return plugins

def clone_one_repo(p):
    full_name = p["fullName"]
    clean_name = full_name.replace("/", "__")
    target = os.path.join(REPOS_DIR, clean_name)
    url = p.get("url", f"https://github.com/{full_name}") + ".git"
    
    if os.path.exists(target) and os.path.isdir(os.path.join(target, ".git")):
        return {"name": full_name, "status": "cached", "path": target}
        
    t0 = time.time()
    env = {**os.environ, "GIT_TERMINAL_PROMPT": "0", "GIT_ASKPASS": "echo"}
    cmd = [
        "git",
        "-c", "filter.lfs.process=",
        "-c", "filter.lfs.required=false",
        "-c", "filter.lfs.smudge=",
        "-c", "filter.lfs.clean=",
        "clone",
        "--depth", "1",
        "--single-branch",
        url,
        target
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=60, env=env)
        dur = round(time.time() - t0, 2)
        if res.returncode == 0:
            return {"name": full_name, "status": "success", "duration": dur, "path": target}
        else:
            return {"name": full_name, "status": "error", "duration": dur, "error": res.stderr.strip()[:150]}
    except subprocess.TimeoutExpired:
        return {"name": full_name, "status": "timeout", "duration": 60, "error": "Timeout after 60s"}
    except Exception as e:
        return {"name": full_name, "status": "exception", "duration": 0, "error": str(e)}

def pull_one_repo(r):
    full_name = r["repo_full_name"]
    clean_name = full_name.replace("/", "__")
    target = os.path.join(REPOS_DIR, clean_name)
    
    if not os.path.exists(target):
        return {"name": full_name, "status": "missing_dir"}
        
    # Clear stray index.lock if present from aborted processes
    lock_file = os.path.join(target, ".git", "index.lock")
    if os.path.exists(lock_file):
        try: os.remove(lock_file)
        except: pass
        
    env = {**os.environ, "GIT_TERMINAL_PROMPT": "0", "GIT_ASKPASS": "echo"}
    try:
        f_res = subprocess.run(["git", "-C", target, "fetch", "--depth", "1", "origin", "HEAD"], capture_output=True, text=True, timeout=30, env=env)
        if f_res.returncode == 0:
            r_res = subprocess.run(["git", "-C", target, "reset", "--hard", "FETCH_HEAD"], capture_output=True, text=True, timeout=20, env=env)
            if r_res.returncode == 0:
                return {"name": full_name, "status": "pulled", "path": target}
            else:
                return {"name": full_name, "status": "error", "error": r_res.stderr.strip()[:150], "path": target}
        else:
            return {"name": full_name, "status": "error", "error": f_res.stderr.strip()[:150], "path": target}
    except subprocess.TimeoutExpired:
        return {"name": full_name, "status": "timeout", "path": target}
    except Exception as e:
        return {"name": full_name, "status": "exception", "error": str(e), "path": target}

def main():
    print("=" * 70)
    print("STARTING FULL HERDR ECOSYSTEM UPDATE PIPELINE")
    print("=" * 70)
    
    init_db(DB_PATH)
    conn = get_connection(DB_PATH)
    
    # 1. Fetch live marketplace
    live_plugins = fetch_live_marketplace()
    live_map = {p["fullName"]: p for p in live_plugins if p.get("fullName")}
    
    # 2. Check existing database state
    cursor = conn.cursor()
    cursor.execute("SELECT id, repo_full_name, surveyed_commit_hash, upstream_head_commit FROM plugins")
    db_rows = cursor.fetchall()
    db_map = {r["repo_full_name"]: dict(r) for r in db_rows}
    print(f"[2/6] Comparing DB ({len(db_map)} plugins) against Marketplace ({len(live_map)} plugins)...")
    
    new_plugins = [p for fn, p in live_map.items() if fn not in db_map]
    print(f"      Found {len(new_plugins)} brand new plugins to ingest.")
    
    # 3. Clone and analyze new plugins
    if new_plugins:
        print(f"\n[3/6] Cloning {len(new_plugins)} new repositories in parallel (12 workers)...")
        with ThreadPoolExecutor(max_workers=12) as executor:
            future_to_p = {executor.submit(clone_one_repo, p): p for p in new_plugins}
            cloned_results = []
            for fut in as_completed(future_to_p):
                res = fut.result()
                cloned_results.append(res)
                if res["status"] == "success":
                    print(f"      + Cloned: {res['name']} ({res.get('duration')}s)")
                elif res["status"] == "cached":
                    print(f"      = Cached: {res['name']}")
                else:
                    print(f"      x Failed: {res['name']} ({res.get('error', res['status'])})")
                    
        print(f"\n      Analyzing and inserting {len(new_plugins)} new plugins into database...")
        inserted_count = 0
        for p in new_plugins:
            fn = p["fullName"]
            clean_name = fn.replace("/", "__")
            target = os.path.join(REPOS_DIR, clean_name)
            if not os.path.exists(target):
                continue
            try:
                record = analyze_repository(target, p)
                plugin_id = upsert_plugin(conn, record)
                inserted_count += 1
            except Exception as e:
                print(f"      [Error] Could not analyze {fn}: {e}")
        print(f"      Successfully inserted {inserted_count} new plugins into plugins.db.")
    else:
        print("\n[3/6] No new plugins to clone.")
        
    # 4. Pull and re-analyze outdated existing plugins
    cursor.execute("SELECT id, repo_full_name, surveyed_commit_hash, upstream_head_commit FROM plugins")
    current_db_rows = cursor.fetchall()
    
    to_pull = []
    for r in current_db_rows:
        fn = r["repo_full_name"]
        cur_hash = r["surveyed_commit_hash"] or ""
        live_p = live_map.get(fn)
        if live_p:
            live_hash = live_p.get("headCommit") or ""
            if live_hash and cur_hash and live_hash != cur_hash:
                to_pull.append(r)
                
    print(f"\n[4/6] Updating {len(to_pull)} outdated plugins with newer upstream commits...")
    if to_pull:
        with ThreadPoolExecutor(max_workers=12) as executor:
            pull_results = list(executor.map(pull_one_repo, to_pull))
            
        print(f"      Re-analyzing updated repositories...")
        reanalyzed = 0
        for res in pull_results:
            fn = res["name"]
            target = res.get("path")
            if not target or not os.path.exists(target):
                continue
            meta = live_map.get(fn) or {"fullName": fn}
            try:
                record = analyze_repository(target, meta)
                upsert_plugin(conn, record)
                reanalyzed += 1
            except Exception as e:
                print(f"      [Error] Re-analysis failed for {fn}: {e}")
        print(f"      Successfully re-analyzed {reanalyzed} updated plugins.")
    else:
        print("      All existing plugins match upstream HEAD.")
        
    # 5. Refresh metrics & clear staleness flags across all plugins
    print("\n[5/6] Refreshing live metrics and staleness flags across all plugins...")
    now = datetime.utcnow().isoformat() + "Z"
    cursor = conn.cursor()
    for fn, p in live_map.items():
        stars = p.get("stars") or 0
        forks = p.get("forks") or 0
        issues = p.get("openIssues") or 0
        delta7d = p.get("starsDelta7d") or 0
        upstream_hash = p.get("headCommit") or ""
        upstream_pushed = p.get("pushedAt") or ""
        pop_score = round(stars * 1.0 + forks * 2.5 + delta7d * 1.5, 2)
        is_trending = 1 if delta7d > 5 else 0
        
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
                is_out_of_date = CASE 
                    WHEN surveyed_commit_hash != '' AND ? != '' AND surveyed_commit_hash != ? THEN 1
                    ELSE 0
                END,
                last_synced_at = ?
            WHERE repo_full_name = ?;
        """, (stars, forks, issues, delta7d, pop_score, is_trending, upstream_hash, upstream_pushed, upstream_hash, upstream_hash, now, fn))
    conn.commit()
    print("      Metrics and staleness flags updated.")
    
    # 6. Re-catalog Core endpoints
    print("\n[6/6] Re-cataloging official Core endpoints and doc URLs...")
    catalog_script.main()
    print("      Official endpoints cataloged.")
    
    print("\n" + "=" * 70)
    print("CORE PIPELINE FINISHED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    main()
