#!/usr/bin/env python3
"""
Single Plugin Ingestion CLI Tool for Herdr Plugins Survey.
Allows adding and analyzing a specific new Herdr plugin repository into plugins.db.

Usage:
    python3 scripts/ingest_plugin.py owner/repo
    python3 scripts/ingest_plugin.py https://github.com/owner/repo --stars 120
"""

import sys
import os
import argparse
import json
import subprocess
import time

sys.path.insert(0, os.path.abspath("."))
from scripts.analyzer import analyze_repository
from scripts.db_manager import init_db, get_connection, upsert_plugin

def parse_repo_identifier(arg):
    arg = arg.strip().rstrip("/")
    if arg.startswith("https://github.com/"):
        arg = arg.replace("https://github.com/", "")
    elif arg.startswith("git@github.com:"):
        arg = arg.replace("git@github.com:", "").replace(".git", "")
    if arg.endswith(".git"):
        arg = arg[:-4]
    parts = arg.split("/")
    if len(parts) != 2:
        raise ValueError(f"Invalid repository identifier: '{arg}'. Expected 'owner/repo' or GitHub URL.")
    return parts[0], parts[1], f"{parts[0]}/{parts[1]}"

def fetch_github_meta(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    meta = {
        "fullName": f"{owner}/{repo}",
        "name": repo,
        "owner": owner,
        "url": f"https://github.com/{owner}/{repo}",
        "stars": 0,
        "forks": 0,
        "openIssues": 0,
        "language": "Unknown",
        "topics": [],
        "createdAt": None,
        "updatedAt": None,
        "pushedAt": None
    }
    try:
        cmd = ["curl", "-sL", "-H", "User-Agent: Herdr-Ingest-Tool", url]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if res.returncode == 0 and res.stdout.strip().startswith("{"):
            data = json.loads(res.stdout)
            if "name" in data and "stargazers_count" in data:
                meta["stars"] = data.get("stargazers_count", 0)
                meta["forks"] = data.get("forks_count", 0)
                meta["openIssues"] = data.get("open_issues_count", 0)
                meta["language"] = data.get("language") or "Unknown"
                meta["topics"] = data.get("topics", [])
                meta["createdAt"] = data.get("created_at")
                meta["updatedAt"] = data.get("updated_at")
                meta["pushedAt"] = data.get("pushed_at")
                meta["description"] = data.get("description") or ""
    except Exception as e:
        print(f"[Warning] Could not fetch GitHub API metadata: {e}")
    return meta

def main():
    parser = argparse.ArgumentParser(description="Ingest and analyze a specific Herdr plugin into plugins.db")
    parser.add_argument("repo", help="Repository in 'owner/repo' format or full GitHub URL")
    parser.add_argument("--stars", type=int, help="Override star count")
    parser.add_argument("--depth", type=int, default=1, help="Git clone depth (default: 1)")
    parser.add_argument("--reanalyze", action="store_true", help="Reanalyze existing directory without re-cloning")
    args = parser.parse_args()

    owner, repo, full_name = parse_repo_identifier(args.repo)
    clean_name = f"{owner}__{repo}"
    repo_dir = os.path.join("repos", clean_name)
    os.makedirs("repos", exist_ok=True)

    print(f"\n[Ingest] Processing plugin: {full_name}")

    if not os.path.exists(repo_dir) or not args.reanalyze:
        if not os.path.exists(repo_dir):
            clone_url = f"https://github.com/{full_name}.git"
            print(f"[Git] Shallow cloning {clone_url} into {repo_dir} (depth={args.depth})...")
            cmd = ["git", "-c", "filter.lfs.process=", "-c", "filter.lfs.required=false", "clone", "--depth", str(args.depth), "--single-branch", clone_url, repo_dir]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
            if res.returncode != 0:
                print(f"[Error] Git clone failed: {res.stderr.strip()}")
                sys.exit(1)
        else:
            print(f"[Git] Directory {repo_dir} already exists. Using existing checkout.")

    meta = fetch_github_meta(owner, repo)
    if args.stars is not None:
        meta["stars"] = args.stars

    print(f"[Analyzer] Running static and semantic code analysis...")
    record = analyze_repository(repo_dir, meta)

    init_db("plugins.db")
    conn = get_connection("plugins.db")
    plugin_id = upsert_plugin(conn, record)
    conn.close()

    print("\n" + "=" * 60)
    print(f"SUCCESSFULLY INGESTED PLUGIN #{plugin_id}")
    print("=" * 60)
    print(f"Repository:       {record['repo_full_name']}")
    print(f"Stars:            {record['stars']} ★")
    print(f"Primary Language: {record['primary_language']}")
    print(f"Broad Category:   {record['broad_category']}")
    print(f"Sub Category:     {record['sub_category']}")
    print(f"Sub-Sub Category: {record['sub_sub_category']}")
    print(f"TUI Interface:    {'Yes' if record['presents_tui'] else 'No'}")
    print(f"Mobile Interface: {'Yes' if record['interfaces_mobile'] else 'No'}")
    print(f"Web Display:      {'Yes' if record['uses_web_display'] else 'No'}")
    print(f"Comms / Relay:    {'Yes' if record['adds_communications'] else 'No'}")
    print(f"Herdr Endpoints:  {len(json.loads(record['herdr_socket_methods']))} detected")
    print(f"Agent Scope:      {record['agent_scope']}")
    print(f"Supported Agents: {record['supported_agents']}")
    print("=" * 60)

if __name__ == "__main__":
    main()
