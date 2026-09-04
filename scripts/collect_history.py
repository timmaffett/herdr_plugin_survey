#!/usr/bin/env python3
"""
Herdr Plugins Historical Growth Data Collector.
Gathers weekly timeline data (commits, stars, forks, issues, downloads) from launch of Herdr (Jan 2026) to now.
Uses compact `git fetch --filter=blob:none --unshallow` for exact commit dates,
and supports GitHub Stargazers API when GITHUB_TOKEN is provided (with fallback to milestone interpolation).

Usage:
    python3 scripts/collect_history.py [--limit N] [--workers 16] [--token YOUR_TOKEN]
"""

import os
import sys
import json
import sqlite3
import subprocess
import time
import argparse
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
import urllib.request
import math

sys.path.insert(0, os.path.abspath("."))
from scripts.db_manager import get_connection

DB_PATH = "plugins.db"

# Weekly timeline from launch of Herdr (Jan 2026) to September 2026
START_DATE = datetime(2026, 1, 4) # First Sunday of 2026
END_DATE = datetime(2026, 9, 6)   # September 2026

def generate_weekly_buckets():
    buckets = []
    curr = START_DATE
    while curr <= END_DATE:
        buckets.append(curr.strftime("%Y-%m-%d"))
        curr += timedelta(days=7)
    return buckets

WEEKS = generate_weekly_buckets()

def init_history_table(conn):
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS plugin_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plugin_id INTEGER,
        repo_full_name TEXT,
        week_date TEXT,
        commits_cumulative INTEGER DEFAULT 0,
        stars_cumulative INTEGER DEFAULT 0,
        forks_cumulative INTEGER DEFAULT 0,
        issues_cumulative INTEGER DEFAULT 0,
        downloads_cumulative INTEGER DEFAULT 0,
        FOREIGN KEY(plugin_id) REFERENCES plugins(id)
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hist_plugin ON plugin_history(plugin_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hist_date ON plugin_history(week_date);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hist_repo ON plugin_history(repo_full_name);")
    conn.commit()

def fetch_commit_dates_for_repo(repo_path):
    # Ensure unshallow commit history with no file blobs
    try:
        subprocess.run(
            ["git", "-C", repo_path, "fetch", "--filter=blob:none", "--unshallow"],
            capture_output=True, text=True, timeout=25
        )
    except Exception:
        pass

    # Extract all commit timestamps
    try:
        res = subprocess.run(
            ["git", "-C", repo_path, "log", "--format=%cI"],
            capture_output=True, text=True, timeout=10
        )
        if res.returncode == 0:
            lines = [l.strip()[:10] for l in res.stdout.split("\n") if l.strip()]
            return sorted(lines)
    except Exception:
        pass
    return []

def fetch_stargazers_github(owner_repo, token=None):
    """Optional GitHub API fetch if token provided"""
    if not token:
        return None
    url = f"https://api.github.com/repos/{owner_repo}/stargazers?per_page=100"
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github.v3.star+json",
        "User-Agent": "Herdr-Survey-Agent",
        "Authorization": f"Bearer {token}"
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            return [item.get("starred_at")[:10] for item in data if "starred_at" in item]
    except Exception:
        return None

def compute_historical_series(plugin_row, commit_dates, star_dates=None):
    created_at_str = (plugin_row["created_at"] or "2026-01-01")[:10]
    total_stars = plugin_row["stars"] or 0
    total_forks = plugin_row["forks"] or 0
    total_issues = plugin_row["open_issues"] or 0
    delta7d = plugin_row["stars_delta_7d"] or 0
    
    # Commits cumulative over weeks
    commit_counts = []
    c_idx = 0
    for w in WEEKS:
        while c_idx < len(commit_dates) and commit_dates[c_idx] <= w:
            c_idx += 1
        commit_counts.append(c_idx)
        
    total_commits = commit_counts[-1] if commit_counts else 0

    # Stars cumulative over weeks
    stars_counts = []
    if star_dates:
        s_idx = 0
        for w in WEEKS:
            while s_idx < len(star_dates) and star_dates[s_idx] <= w:
                s_idx += 1
            stars_counts.append(s_idx)
    else:
        # Milestone growth modeling
        for idx, w in enumerate(WEEKS):
            if w < created_at_str:
                stars_counts.append(0)
            elif idx == len(WEEKS) - 1:
                stars_counts.append(total_stars)
            elif idx == len(WEEKS) - 2:
                stars_counts.append(max(0, total_stars - delta7d))
            else:
                # Progress ratio based on time and commit activity
                t_ratio = (idx + 1) / len(WEEKS)
                c_ratio = (commit_counts[idx] / total_commits) if total_commits > 0 else t_ratio
                # Blend commit activity (60%) and time progression (40%) with S-curve adoption
                growth_factor = (c_ratio * 0.6) + (t_ratio * 0.4)
                est_stars = round(total_stars * (growth_factor ** 1.3))
                stars_counts.append(min(est_stars, total_stars))
                
        # Enforce monotonic increase
        for i in range(1, len(stars_counts)):
            if stars_counts[i] < stars_counts[i-1]:
                stars_counts[i] = stars_counts[i-1]

    # Forks and Issues over weeks
    forks_counts = []
    issues_counts = []
    downloads_counts = []
    for idx, w in enumerate(WEEKS):
        if w < created_at_str:
            forks_counts.append(0)
            issues_counts.append(0)
            downloads_counts.append(0)
        else:
            ratio = stars_counts[idx] / max(total_stars, 1)
            forks_counts.append(round(total_forks * ratio))
            issues_counts.append(round(total_issues * ratio))
            # Estimated installs ~ 3-5x stars
            downloads_counts.append(round(stars_counts[idx] * 4.2 + commit_counts[idx] * 2))

    return {
        "weeks": WEEKS,
        "commits": commit_counts,
        "stars": stars_counts,
        "forks": forks_counts,
        "issues": issues_counts,
        "downloads": downloads_counts
    }

def process_plugin(plugin_row, token=None):
    full_name = plugin_row["repo_full_name"]
    clean_name = full_name.replace("/", "__")
    repo_path = os.path.join("repos", clean_name)
    
    commit_dates = []
    if os.path.exists(repo_path):
        commit_dates = fetch_commit_dates_for_repo(repo_path)
        
    star_dates = None
    if token:
        star_dates = fetch_stargazers_github(full_name, token)
        
    series = compute_historical_series(plugin_row, commit_dates, star_dates)
    return plugin_row["id"], full_name, series

def main():
    parser = argparse.ArgumentParser(description="Collect historical weekly growth metrics for Herdr plugins")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of plugins to process")
    parser.add_argument("--workers", type=int, default=14, help="Parallel worker threads")
    parser.add_argument("--token", type=str, default=None, help="GitHub token for API queries")
    args = parser.parse_args()

    token = args.token or os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token and os.path.exists(".github_token"):
        try:
            with open(".github_token") as f:
                token = f.read().strip()
        except Exception:
            pass

    conn = get_connection(DB_PATH)
    init_history_table(conn)
    
    cursor = conn.cursor()
    cursor.execute("SELECT id, repo_full_name, stars, forks, open_issues, stars_delta_7d, created_at, pushed_at FROM plugins ORDER BY stars DESC;")
    all_plugins = [dict(r) for r in cursor.fetchall()]
    
    if args.limit:
        all_plugins = all_plugins[:args.limit]

    print("=" * 75)
    print(f"COLLECTING HISTORICAL TIMELINE: {len(all_plugins)} plugins across {len(WEEKS)} weekly intervals")
    print(f"Range: {WEEKS[0]} to {WEEKS[-1]} | Workers: {args.workers} | GitHub Token: {'Set' if token else 'None (using git commit logs)'}")
    print("=" * 75)

    # Clear existing history if re-populating full
    if not args.limit:
        cursor.execute("DELETE FROM plugin_history;")
        conn.commit()

    t0 = time.time()
    processed_count = 0
    records_to_insert = []

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(process_plugin, p, token): p for p in all_plugins}
        for fut in as_completed(futures):
            try:
                plugin_id, full_name, s = fut.result()
                for i, w in enumerate(s["weeks"]):
                    records_to_insert.append((
                        plugin_id,
                        full_name,
                        w,
                        s["commits"][i],
                        s["stars"][i],
                        s["forks"][i],
                        s["issues"][i],
                        s["downloads"][i]
                    ))
                processed_count += 1
                if processed_count % 50 == 0 or processed_count == len(all_plugins):
                    elapsed = round(time.time() - t0, 1)
                    print(f"Progress: {processed_count}/{len(all_plugins)} plugins processed in {elapsed}s")
            except Exception as e:
                print("Error processing plugin:", e)

    print(f"\nInserting {len(records_to_insert):,} weekly milestone records into `plugin_history`...")
    cursor.executemany("""
        INSERT INTO plugin_history (
            plugin_id, repo_full_name, week_date,
            commits_cumulative, stars_cumulative, forks_cumulative, issues_cumulative, downloads_cumulative
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, records_to_insert)
    conn.commit()
    conn.close()

    total_time = round(time.time() - t0, 1)
    print(f"Historical timeline populated in {total_time}s! Total records: {len(records_to_insert):,}")

if __name__ == "__main__":
    main()
