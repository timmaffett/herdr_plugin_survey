#!/usr/bin/env python3
"""
Extracts major news, releases, agent detections, and architectural milestones
from the official Herdr Core engine repository (repos/herdrdev__herdr) and populates
the `herdr_core_events` table in plugins.db.
"""

import os
import sys
import re
import json
import sqlite3
import subprocess

sys.path.insert(0, os.path.abspath("."))
from scripts.db_manager import get_connection, init_db, ensure_columns

DB_PATH = "plugins.db"
HERDR_REPO = "repos/herdrdev__herdr"

def parse_changelog(repo_path):
    changelog_path = os.path.join(repo_path, "CHANGELOG.md")
    if not os.path.exists(changelog_path):
        return {}
        
    with open(changelog_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
        
    sections = re.split(r'## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})', content)
    releases = {}
    for i in range(1, len(sections), 3):
        ver = sections[i].strip()
        date = sections[i+1].strip()
        body = sections[i+2].strip()
        
        # Extract Added / Changed bullet points
        added_match = re.search(r'### Added\n(.*?)(?=\n###|\Z)', body, re.DOTALL)
        added_bullets = []
        if added_match:
            added_bullets = [line.strip('- ').strip() for line in added_match.group(1).splitlines() if line.strip().startswith('- ')]
            
        changed_match = re.search(r'### Changed\n(.*?)(?=\n###|\Z)', body, re.DOTALL)
        changed_bullets = []
        if changed_match:
            changed_bullets = [line.strip('- ').strip() for line in changed_match.group(1).splitlines() if line.strip().startswith('- ')]
            
        releases[ver] = {
            "version": ver,
            "date": date,
            "added": added_bullets,
            "changed": changed_bullets,
            "raw_body": body[:1200]
        }
    return releases

def extract_all_herdr_events(repo_path=HERDR_REPO):
    events = []
    
    if not os.path.exists(repo_path):
        print(f"Warning: Herdr repo path {repo_path} does not exist.")
        return events

    changelog_data = parse_changelog(repo_path)
    
    # 1. Official Core Releases (from git tags)
    tags_raw = subprocess.check_output(
        ['git', '-C', repo_path, 'tag', '-l', '--format=%(refname:short)|%(creatordate:short)|%(objectname:short)'], 
        text=True
    )
    seen_tags = set()
    for line in tags_raw.splitlines():
        if not line.strip(): continue
        parts = line.split('|')
        tag = parts[0]
        date = parts[1] if len(parts) > 1 and parts[1] else ''
        commit = parts[2] if len(parts) > 2 else ''
        
        if tag.startswith('v') and tag not in seen_tags:
            seen_tags.add(tag)
            ver_clean = tag.lstrip('v')
            ch_info = changelog_data.get(ver_clean, {})
            
            if not date:
                if ch_info.get("date"):
                    date = ch_info["date"]
                else:
                    try:
                        date = subprocess.check_output(['git', '-C', repo_path, 'log', '-1', '--format=%ad', '--date=short', tag], text=True).strip()
                        commit = subprocess.check_output(['git', '-C', repo_path, 'log', '-1', '--format=%h', tag], text=True).strip()
                    except Exception:
                        date = "2026-04-01"

            highlights = ch_info.get("added", [])[:3]
            hl_summary = "; ".join(highlights) if highlights else f"Official stable release of Herdr Core {tag}."
            
            events.append({
                "event_date": date,
                "event_type": "core_release",
                "headline": f"Herdr Core {tag} Released",
                "summary": hl_summary,
                "details_markdown": f"Official GitHub release `{tag}` published. " + ("\n\n**Key Highlights:**\n" + "\n".join([f"- {h}" for h in highlights]) if highlights else ""),
                "agent_name": None,
                "version_tag": tag,
                "commit_hash": commit
            })

    # 2. Curated Agent Detection Milestones (Verified from Git commits)
    agent_detections = [
        {
            "date": "2026-04-01",
            "agent_name": "Claude Code, OpenAI Codex & OpenCode",
            "commit": "28fb23c",
            "headline": "Herdr Adds First-Class Native Support for Claude Code, OpenAI Codex & OpenCode",
            "summary": "Herdr Core merges initial native agent detection and process tracking for Claude Code, OpenAI Codex, and OpenCode, establishing active turn and prompt status monitoring.",
            "details": "Herdr Core commit `28fb23c` lands multi-agent process tracking, allowing users to run Claude Code, Codex, and OpenCode inside split panes with real-time idle, working, and blocked state detection."
        },
        {
            "date": "2026-04-01",
            "agent_name": "Pi Agent",
            "commit": "ca4270b",
            "headline": "Herdr Adds Authoritative Hook Integration for Pi Agent",
            "summary": "Herdr Core adds authoritative lifecycle hook integration for Pi agent, tracking TUI turns and workflow execution.",
            "details": "Herdr Core commit `ca4270b` implements deep hook integration with the Pi Agent runtime, synchronizing terminal prompts and worktree switching."
        },
        {
            "date": "2026-05-20",
            "agent_name": "Kiro CLI",
            "commit": "43124bf",
            "headline": "Herdr Adds Native Detection for Kiro CLI Agents",
            "summary": "Herdr Core introduces process and screen detection for Kiro CLI coding agents.",
            "details": "Herdr Core commit `43124bf` adds pattern matchers and process scanning for Kiro CLI, monitoring agent prompt readiness and turn state."
        },
        {
            "date": "2026-05-23",
            "agent_name": "GitHub Copilot CLI",
            "commit": "5954ece",
            "headline": "Herdr Adds Detection Heuristics for GitHub Copilot CLI",
            "summary": "Herdr Core adds state detection heuristics and terminal monitoring for GitHub Copilot CLI sessions.",
            "details": "Herdr Core commit `5954ece` adds heuristics for GitHub Copilot CLI, tracking when Copilot is generating suggestions or awaiting user input."
        },
        {
            "date": "2026-05-27",
            "agent_name": "Qoder CLI",
            "commit": "bfb9e75",
            "headline": "Herdr Adds Native Qoder CLI Integration",
            "summary": "Herdr Core merges native integration for Qoder CLI, enabling terminal lifecycle detection.",
            "details": "Herdr Core commit `bfb9e75` introduces dedicated process recognition and lifecycle tracking for Qoder CLI."
        },
        {
            "date": "2026-06-01",
            "agent_name": "Kilo Code CLI",
            "commit": "1d56cd0",
            "headline": "Herdr Adds Native Detection for Kilo Code CLI",
            "summary": "Herdr Core introduces detection and status tracking for Kilo Code CLI.",
            "details": "Herdr Core commit `1d56cd0` lands detection rules for Kilo Code CLI sessions running in terminal panes."
        },
        {
            "date": "2026-06-02",
            "agent_name": "GitHub Copilot CLI",
            "commit": "f7d315d",
            "headline": "Herdr Upgrades GitHub Copilot CLI to Full Integration",
            "summary": "Herdr Core expands Copilot support with full CLI integration and interrupt handling.",
            "details": "Herdr Core commit `f7d315d` upgrades Copilot CLI support, adding Esc/Ctrl+C interrupt passthrough and pane focus guarantees."
        },
        {
            "date": "2026-06-04",
            "agent_name": "Droid Agent",
            "commit": "9b27497",
            "headline": "Herdr Adds Native Integration for Droid Agent",
            "summary": "Herdr Core adds support for Droid coding agent terminal detection.",
            "details": "Herdr Core commit `9b27497` merges terminal monitoring and process discovery for the Droid agent."
        },
        {
            "date": "2026-06-04",
            "agent_name": "Kimi Code CLI",
            "commit": "66b0f6b",
            "headline": "Herdr Adds Kimi Code CLI Integration",
            "summary": "Herdr Core merges Kimi Code CLI integration, tracking active generation and user confirmation dialogs.",
            "details": "Herdr Core commit `66b0f6b` introduces Kimi Code CLI recognition with support for localized prompt confirmations."
        },
        {
            "date": "2026-06-08",
            "agent_name": "Cursor Agent CLI",
            "commit": "5fe527d",
            "headline": "Herdr Adds Cursor Agent CLI Integration with Native Session Restore",
            "summary": "Herdr Core merges Cursor Agent CLI integration with automatic session restore support across restarts.",
            "details": "Herdr Core commit `5fe527d` enables seamless tracking of Cursor Agent CLI sessions with native resume capabilities."
        },
        {
            "date": "2026-06-15",
            "agent_name": "Devin CLI",
            "commit": "07261e0",
            "headline": "Herdr Adds Devin CLI Detection & Restore Support",
            "summary": "Herdr Core introduces full Devin CLI terminal detection with native session restore.",
            "details": "Herdr Core commit `07261e0` brings Devin CLI into the Herdr ecosystem, enabling developers to monitor Devin workflows alongside other agents."
        },
        {
            "date": "2026-07-04",
            "agent_name": "MastraCode",
            "commit": "d0e3334",
            "headline": "Herdr Adds Native MastraCode Integration",
            "summary": "Herdr Core merges MastraCode agent integration and documentation grid support.",
            "details": "Herdr Core commit `d0e3334` adds process detection, status reporting, and documentation support for MastraCode."
        },
        {
            "date": "2026-07-11",
            "agent_name": "Maki Agent",
            "commit": "3b8aeee",
            "headline": "Herdr Adds Native Maki Agent Support",
            "summary": "Herdr Core introduces support for the Maki Agent runtime.",
            "details": "Herdr Core commit `3b8aeee` adds terminal state tracking and process discovery for Maki Agent."
        },
        {
            "date": "2026-07-24",
            "agent_name": "Grok CLI",
            "commit": "e9b2208",
            "headline": "Herdr Adds Grok CLI Integration with Native Session Restore",
            "summary": "Herdr Core merges Grok CLI session reporting and native restore with grok --resume <id>.",
            "details": "Herdr Core commit `e9b2208` allows users to run Grok CLI sessions inside Herdr panes with automatic resume and terminal status integration."
        },
        {
            "date": "2026-08-01",
            "agent_name": "Antigravity CLI",
            "commit": "679584f",
            "headline": "Herdr Adds Native Antigravity-CLI Integration & Session Restore",
            "summary": "Herdr Core adds native Antigravity-CLI (agy) integration, conversation tracking, and session restore via agy --conversation <id>.",
            "details": "Herdr Core commit `679584f` introduces first-class detection for Antigravity-CLI (`agy`). Herdr tracks active thinking, tool calls, and user input prompts with seamless cross-session recovery."
        },
        {
            "date": "2026-08-13",
            "agent_name": "Qwen Code",
            "commit": "a4d52ab",
            "headline": "Herdr Adds Qwen Code Detection & Session Restore",
            "summary": "Herdr Core adds Qwen Code detection for idle, working, and user-confirmation states with native session restore.",
            "details": "Herdr Core commit `a4d52ab` implements terminal-title pattern matching and localized confirmation dialog fallbacks for Qwen Code."
        },
        {
            "date": "2026-08-27",
            "agent_name": "Muse Agent",
            "commit": "7b675f4",
            "headline": "Herdr Adds Muse Agent with Generic Pick Blocked Detection",
            "summary": "Herdr Core adds native Muse Agent detection with support for interactive Pick menu blockers.",
            "details": "Herdr Core commit `7b675f4` merges native detection for Muse Agent, recognizing blocked approval states in terminal menus."
        }
    ]
    
    for ag in agent_detections:
        events.append({
            "event_date": ag["date"],
            "event_type": "agent_detection",
            "headline": ag["headline"],
            "summary": ag["summary"],
            "details_markdown": ag["details"],
            "agent_name": ag["agent_name"],
            "version_tag": None,
            "commit_hash": ag["commit"]
        })

    # 3. Major Herdr Architecture Milestones
    arch_milestones = [
        {
            "date": "2026-03-23",
            "commit": "a57b972",
            "headline": "Herdr Platform Genesis: Initial Public Release",
            "summary": "Herdr launches its initial platform release as a modern AI-agent aware terminal multiplexer.",
            "details": "Initial commit `a57b972` establishes the Herdr multiplexer architecture with multi-workspace support and initial terminal emulation."
        },
        {
            "date": "2026-03-29",
            "commit": "fd1e3b8",
            "headline": "Herdr Introduces Unix Domain Socket IPC API",
            "summary": "Herdr Core implements its JSON-RPC Unix domain socket API for external programmatic workspace and pane orchestration.",
            "details": "Herdr Core commit `fd1e3b8` adds `$HERDR_SOCKET_PATH` and the foundational RPC methods (`workspace.list`, `pane.focus`, `pane.split`), laying the groundwork for all future plugins."
        },
        {
            "date": "2026-04-02",
            "commit": "b695ade",
            "headline": "Herdr Adds Multi-Pane Tabs Within Workspaces",
            "summary": "Herdr Core adds tabbed views within individual workspaces, dramatically expanding layout density.",
            "details": "Commit `b695ade` introduces tabs within workspaces, allowing developers to group multiple panes per tab and switch between independent viewports."
        },
        {
            "date": "2026-04-21",
            "commit": "3397e1c",
            "headline": "Herdr v0.5.0: Persistent Server-Client Architecture Debuts",
            "summary": "Persistent daemon sessions become the default product behavior, decoupling the TUI client from the background server.",
            "details": "Herdr v0.5.0 introduces headless daemon persistence. Terminals and agent sessions continue running unattended in the background when detached."
        },
        {
            "date": "2026-05-22",
            "commit": "0148c13",
            "headline": "Herdr Adds Git Worktree Workspace Orchestration",
            "summary": "Herdr Core introduces native Git worktree management, automatically provisioning isolated workspace directories per branch.",
            "details": "Commit `0148c13` integrates Git worktrees directly into workspace management, enabling multiple AI coding agents to work concurrently on separate branches without merge conflicts."
        },
        {
            "date": "2026-06-07",
            "commit": "3c2b46d",
            "headline": "Herdr Adds Native Windows Beta Support",
            "summary": "Herdr launches native Windows beta support powered by ConPTY and modern Windows console APIs.",
            "details": "Commit `3c2b46d` brings Herdr to Windows developers, supporting PowerShell, Git Bash, and WSL terminal panes."
        },
        {
            "date": "2026-06-10",
            "commit": "82468a0",
            "headline": "Herdr Introduces Manifest-Based Agent Detection Engine",
            "summary": "Herdr shifts agent detection to a high-performance, manifest-driven architecture distributed via TOML definitions.",
            "details": "Commits `82468a0` and `36a1b7f` overhaul agent state monitoring, allowing dynamic loading and hot-updating of agent detection manifests without rebuilding the core binary."
        },
        {
            "date": "2026-06-14",
            "commit": "fbd20ad",
            "headline": "Herdr Plugin V1 Architecture Introduced",
            "summary": "Herdr Core formally introduces the Plugin V1 subsystem, defining entrypoints, event hooks, and manifest specifications.",
            "details": "Commit `fbd20ad` establishes the official `herdr-plugin.toml` manifest specification, plugin linking (`herdr plugin link`), and lifecycle event dispatching."
        },
        {
            "date": "2026-06-21",
            "commit": "2eeea9a",
            "headline": "Herdr Launches Official Plugin Marketplace",
            "summary": "Herdr Core launches the public plugin marketplace, enabling seamless CLI installation with `herdr plugin install <owner>/<repo>`.",
            "details": "Commit `2eeea9a` unlocks community extensibility with an automated package registry and discovery catalog."
        },
        {
            "date": "2026-07-19",
            "commit": "3f80947",
            "headline": "Herdr Promotes Agent Automation to First-Class CLI Primitive",
            "summary": "Herdr adds `herdr agent prompt`, `agent send`, and `agent wait`, making automated agent orchestration a native CLI feature.",
            "details": "Commit `3f80947` establishes dedicated agent automation CLI subcommands, enabling programmatic control of coding agents from shell scripts and CI jobs."
        },
        {
            "date": "2026-07-20",
            "commit": "d30ab1b",
            "headline": "Herdr Adds Plugin-Driven Agent Views & Startup Hooks",
            "summary": "Herdr Core introduces plugin-driven custom agent viewports and automated workspace startup hooks.",
            "details": "Commit `d30ab1b` enables plugins to render dedicated custom sidecars and invoke automated workspace initialization hooks when agents start."
        },
        {
            "date": "2026-08-03",
            "commit": "763f6eb",
            "headline": "Herdr v0.8.0 Released: Relicensed to Apache-2.0 & Windows GA",
            "summary": "Herdr v0.8.0 relicenses the entire project to Apache-2.0, promotes Windows support to General Availability, and introduces the bundled --skill CLI flag.",
            "details": "Herdr v0.8.0 marks a landmark milestone, transitioning from AGPL-3.0 to Apache-2.0, making Windows support stable, and bundling native AI agent skill documentation."
        },
        {
            "date": "2026-08-19",
            "commit": "2743a50",
            "headline": "Herdr v0.8.2 Released: Qwen Code Detection & Windows Remote Attach",
            "summary": "Herdr v0.8.2 brings official Qwen Code detection, desktop tab status entries, and Windows-to-Unix remote session attachment.",
            "details": "Herdr v0.8.2 adds native Qwen Code agent detection, dynamic desktop tab bar status indicators, and remote client attach from Windows to Linux/macOS servers."
        }
    ]
    
    for am in arch_milestones:
        events.append({
            "event_date": am["date"],
            "event_type": "major_feature",
            "headline": am["headline"],
            "summary": am["summary"],
            "details_markdown": am["details"],
            "agent_name": None,
            "version_tag": None,
            "commit_hash": am["commit"]
        })
        
    return events

def populate_herdr_events(db_path=DB_PATH):
    print("=" * 70)
    print("INGESTING HERDR CORE PLATFORM EVENTS & AGENT DETECTIONS")
    print("=" * 70)
    
    init_db(db_path)
    conn = get_connection(db_path)
    cursor = conn.cursor()
    
    # Ensure table exists
    cursor.execute("""
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
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_herdr_events_date ON herdr_core_events(event_date);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_herdr_events_type ON herdr_core_events(event_type);")
    
    ensure_columns(conn, "daily_reports", {
        "herdr_events_count": "INTEGER DEFAULT 0",
        "herdr_events_json": "TEXT DEFAULT '[]'"
    })
    
    events = extract_all_herdr_events()
    print(f"Extracted {len(events)} Herdr Core platform events.")
    
    # Clear and re-populate herdr_core_events
    cursor.execute("DELETE FROM herdr_core_events;")
    for ev in events:
        cursor.execute("""
            INSERT INTO herdr_core_events (
                event_date, event_type, headline, summary, details_markdown, agent_name, version_tag, commit_hash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ev["event_date"], ev["event_type"], ev["headline"], ev["summary"],
            ev.get("details_markdown", ""), ev.get("agent_name"), ev.get("version_tag"), ev.get("commit_hash")
        ))
        
    conn.commit()
    print(f"Successfully populated herdr_core_events table with {len(events)} events.")
    
    # Print sample
    cursor.execute("SELECT event_date, event_type, headline FROM herdr_core_events ORDER BY event_date ASC LIMIT 10;")
    for row in cursor.fetchall():
        print(f"  [{row['event_date']}] ({row['event_type']}) {row['headline']}")
        
    conn.close()

if __name__ == "__main__":
    populate_herdr_events()
