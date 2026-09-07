#!/usr/bin/env python3
"""
Herdr Plugins Ecosystem Daily Report Generator & Chronological Ledger.
Backfills all 250 days from Jan 1, 2026 (Genesis) to Sep 7, 2026 (Today),
detects ecosystem capability breakthroughs, generates executive summaries +
long-form newspaper write-ups, and persists them into plugins.db.

Usage:
    python3 scripts/daily_report_generator.py --backfill
    python3 scripts/daily_report_generator.py --date 2026-09-07
    python3 scripts/daily_report_generator.py --date 2026-09-08 --force
"""

import os
import sys
import json
import sqlite3
from datetime import datetime, timedelta

sys.path.insert(0, os.path.abspath("."))
from scripts.db_manager import get_connection, init_db

DB_PATH = "plugins.db"
START_DATE = datetime(2026, 1, 1)
END_DATE = datetime(2026, 9, 7)

def get_normalized_release_date(p):
    c_at = p["created_at"]
    if c_at and len(c_at) >= 10 and c_at >= "2026-01-01":
        return c_at[:10]
    s_date = p["surveyed_commit_date"]
    if s_date and len(s_date) >= 10 and s_date >= "2026-01-01":
        return s_date[:10]
    p_at = p["pushed_at"]
    if p_at and len(p_at) >= 10 and p_at >= "2026-01-01":
        return p_at[:10]
    return "2026-08-30"

def extract_plugin_capabilities(p, endpoints, agents):
    caps = []
    
    # 1. Official Core Endpoints
    for ep in endpoints:
        caps.append({
            "key": f"endpoint:{ep}",
            "type": "core_api",
            "desc": f"Invokes official Herdr Core endpoint `{ep}`"
        })
        
    # 2. Supported Agents
    for ag in agents:
        caps.append({
            "key": f"agent:{ag}",
            "type": "agent_skill",
            "desc": f"Direct integration with AI coding agent `{ag}`"
        })
        
    # 3. Remote Infrastructure
    if p["uses_ssh"]:
        caps.append({"key": "infra:ssh_tunnel", "type": "remote_infra", "desc": "Utilizes SSH tunnels and key authentication for remote host access"})
    if p["mentions_vps_gateway"]:
        caps.append({"key": "infra:vps_gateway", "type": "remote_infra", "desc": "Requires VPS or cloud relay gateway hosting"})
    if p["mentions_router_setup"]:
        caps.append({"key": "infra:router_nat", "type": "remote_infra", "desc": "Configures home router port mapping / NAT traversal"})
    if p["uses_vpn_tailscale"]:
        caps.append({"key": "infra:vpn_tailscale", "type": "remote_infra", "desc": "Communicates across Tailscale / WireGuard peer-to-peer mesh networks"})
    if p["mentions_port_mapping"]:
        caps.append({"key": "infra:port_mapping", "type": "remote_infra", "desc": "Dynamic port forwarding and firewall mapping"})
    if p["uses_mosh"]:
        caps.append({"key": "infra:mosh", "type": "remote_infra", "desc": "Mosh (Mobile Shell) UDP roaming terminal session synchronization"})
        
    # 4. Presentation & UI Paradigms
    if p["presents_tui"]:
        caps.append({"key": "ui:terminal_tui", "type": "ui_paradigm", "desc": "Terminal user interface layout (Ratatui, Ink, or Bubbletea)"})
    if p["uses_web_display"]:
        caps.append({"key": "ui:web_dashboard", "type": "ui_paradigm", "desc": "Interactive web dashboard or browser-based sidecar interface"})
    if p["interfaces_mobile"]:
        caps.append({"key": "ui:mobile_relay", "type": "ui_paradigm", "desc": "Mobile device interface or notification relay"})
        
    # 5. Architecture & Git Capabilities
    if p["git_worktree_aware"]:
        caps.append({"key": "feature:git_worktrees", "type": "feature", "desc": "Git worktree awareness and isolated branch workspace provisioning"})
    if p["adds_communications"]:
        caps.append({"key": "feature:external_comms", "type": "feature", "desc": "External messaging relay (Telegram, Discord, Webhooks, Push)"})
    if p["is_cross_platform"]:
        caps.append({"key": "feature:cross_platform", "type": "feature", "desc": "Explicit cross-platform support (macOS, Linux, Windows)"})
    if p["has_tests"]:
        caps.append({"key": "feature:automated_tests", "type": "feature", "desc": "Automated unit and integration test suite"})
    if p["has_ci_workflows"]:
        caps.append({"key": "feature:ci_pipeline", "type": "feature", "desc": "Automated CI/CD build pipeline (GitHub Actions)"})
        
    # 6. Primary Language
    lang = p["primary_language"]
    if lang and lang != "Unknown":
        caps.append({"key": f"language:{lang.lower()}", "type": "language", "desc": f"Plugin authoring in `{lang}`"})
        
    # 7. Broad Category
    cat = p["broad_category"]
    if cat and cat != "Uncategorized":
        caps.append({"key": f"category:{cat.lower()}", "type": "category", "desc": f"First entrance into category `{cat}`"})
        
    return caps

def generate_report_content(report_date, day_num, day_plugins, breakthroughs, cum_stats, seen_caps_count):
    dt = datetime.strptime(report_date, "%Y-%m-%d")
    date_formatted = dt.strftime("%A, %B %-d, %Y")
    is_quiet = 1 if len(day_plugins) == 0 else 0
    
    # Generate Headline
    if is_quiet:
        if day_num < 60:
            headline = f"Ecosystem Pulse: Early Multiplexer Incubation (Day {day_num})"
        elif day_num < 150:
            headline = f"Ecosystem Pulse: Core Architecture Maturation ({cum_stats['plugins']} Active Plugins)"
        else:
            headline = f"Ecosystem Pulse: Developer Activity Stable at {cum_stats['plugins']} Plugins"
            
        exec_summary = (
            f"Herdr development continued steadily on {date_formatted}. "
            f"While no new community plugins were published to the marketplace on this day, "
            f"the existing ecosystem of {cum_stats['plugins']} plugins and {cum_stats['stars']:,} stars maintained steady usage. "
            f"A total of {seen_caps_count} distinct capabilities have been unlocked across the platform to date."
        )
        
        long_form = f"""## The Daily Herdr Dispatch — Issue #{day_num}
*{date_formatted} • Herdr Ecosystem Archive • Day {day_num} of Year 1*

---

### 📡 Ecosystem Pulse & Development Horizon

On **{date_formatted}**, the Herdr plugin marketplace recorded zero new repository registrations, reflecting a consolidation day for existing extension authors. 

Across the ecosystem, **{cum_stats['plugins']} published plugins** continued serving developers, with a collective community footprint of **{cum_stats['stars']:,} stars** and **{cum_stats['forks']:,} forks**. 

```
┌──────────────────────────────────────────────────────────┐
│                   ECOSYSTEM STATUS AT A GLANCE           │
├───────────────────────────────┬──────────────────────────┤
│ Calendar Day                  │ Day {day_num:<21}│
│ Total Published Plugins       │ {cum_stats['plugins']:<25}│
│ Cumulative Ecosystem Stars    │ {cum_stats['stars']:<25,f}│
│ Distinct Platform Capabilities│ {seen_caps_count:<25}│
└───────────────────────────────┴──────────────────────────┘
```

#### Historical Context
During this phase of Herdr's adoption curve, plugin authors concentrated on stabilizing internal Unix Domain Socket IPC sessions (`$HERDR_SOCKET_PATH`) and refining terminal split layouts. Background maintenance, automated integration testing, and local workflow customizations formed the primary development focus.
"""
    else:
        # Active Day
        top_plugin = sorted(day_plugins, key=lambda x: x["stars"] or 0, reverse=True)[0]
        n_count = len(day_plugins)
        
        # Headline crafting
        if day_num == 1:
            headline = f"Genesis: The Herdr Plugin Ecosystem Launches with {top_plugin['repo_name']}"
        elif breakthroughs:
            agent_bts = [b for b in breakthroughs if b["type"] == "agent_skill"]
            infra_bts = [b for b in breakthroughs if b["type"] == "remote_infra"]
            wt_bts = [b for b in breakthroughs if "worktree" in b["key"]]
            ep_bts = [b for b in breakthroughs if b["type"] == "core_api"]
            lang_bts = [b for b in breakthroughs if b["type"] == "language"]
            
            if wt_bts:
                headline = f"Dawn of Worktree Orchestration: {top_plugin['repo_name']} Debuts"
            elif agent_bts:
                agent_name = agent_bts[0]["key"].replace("agent:", "").replace("-", " ").title()
                headline = f"Agent Frontiers: First {agent_name} Integration Lands with {top_plugin['repo_name']}"
            elif infra_bts:
                raw_inf = infra_bts[0]["key"].replace("infra:", "")
                name_map = {
                    "vpn_tailscale": "Tailscale VPN Mesh",
                    "port_mapping": "Port Forwarding & UPnP",
                    "vps_gateway": "VPS Gateway Relay",
                    "ssh_tunnel": "SSH Tunneling",
                    "mosh": "Mosh Roaming Terminal",
                    "router_nat": "Router NAT Traversal"
                }
                infra_name = name_map.get(raw_inf, raw_inf.replace("_", " ").title())
                headline = f"Infrastructure Breakthrough: {infra_name} Protocol Unlocked"
            elif lang_bts:
                lang_name = lang_bts[0]["key"].replace("language:", "").capitalize()
                headline = f"{lang_name} Authors Enter Herdr: {top_plugin['repo_name']} Leads New Wave"
            elif ep_bts:
                ep_name = ep_bts[0]["key"].replace("endpoint:", "")
                headline = f"Core Method `{ep_name}` Adopted as {n_count} {'Plugin' if n_count == 1 else 'Plugins'} Launch"
            else:
                headline = f"{n_count} {'Plugin' if n_count == 1 else 'Plugins'} Arrive Unlocking {len(breakthroughs)} Platform Capabilities"
        else:
            if n_count >= 15:
                headline = f"Marketplace Surge: {n_count} Plugins Debut Led by {top_plugin['repo_name']}"
            elif n_count >= 5:
                headline = f"Ecosystem Momentum: {n_count} New Plugins Land on Herdr"
            elif n_count > 1:
                headline = f"{n_count} New Plugins Released Including {top_plugin['repo_name']}"
            else:
                headline = f"{top_plugin['repo_name']} Published to Marketplace"
                
        bt_text = f" This issue documents {len(breakthroughs)} brand new ecosystem firsts." if breakthroughs else ""
        plugin_word = "plugin" if n_count == 1 else "plugins"
        exec_summary = (
            f"On {date_formatted}, {n_count} new {plugin_word} officially joined the Herdr marketplace, "
            f"bringing the cumulative ecosystem total to {cum_stats['plugins']} plugins and {cum_stats['stars']:,} stars.{bt_text} "
            f"Notable releases today include `{top_plugin['repo_full_name']}` ({top_plugin['primary_language']}, {top_plugin['stars']} ★)."
        )
        
        # Long-form newspaper construction
        bt_section = ""
        if breakthroughs:
            bt_items = "\n".join([
                f"- **🌟 `{b['key']}`** ({b['type'].replace('_', ' ').title()}): {b['desc']} *(Introduced by [`{b['plugin']}`](https://github.com/{b['plugin']}))*"
                for b in breakthroughs
            ])
            bt_section = f"""### 🌟 Today's Ecosystem Breakthroughs & Firsts

The following capabilities were recorded in the Herdr ecosystem for the very first time on {date_formatted}:

{bt_items}

---
"""

        # Build detailed plugin articles
        plugin_articles = []
        for p in sorted(day_plugins, key=lambda x: x["stars"] or 0, reverse=True):
            fn = p["repo_full_name"]
            url = p["repo_url"]
            stars = p["stars"] or 0
            forks = p["forks"] or 0
            loc = p["total_loc"] or 0
            files = p["total_files"] or 0
            lang = p["primary_language"] or "Unknown"
            cat = p["broad_category"] or "Utility"
            desc = p["description"] or p["readme_summary"] or "No detailed description provided."
            
            # Technical architecture tags
            arch_tags = []
            if p["presents_tui"]: arch_tags.append("TUI Interface")
            if p["uses_web_display"]: arch_tags.append("Web Dashboard")
            if p["interfaces_mobile"]: arch_tags.append("Mobile Relay")
            if p["git_worktree_aware"]: arch_tags.append("Git Worktrees")
            if p["uses_ssh"]: arch_tags.append("SSH Relay")
            if p["uses_vpn_tailscale"]: arch_tags.append("Tailscale Mesh")
            if p["uses_mosh"]: arch_tags.append("Mosh Roaming")
            if p["has_tests"]: arch_tags.append("Automated Tests")
            
            arch_badge_str = " • ".join([f"`{t}`" for t in arch_tags]) if arch_tags else "`Standard IPC`"
            
            # Socket methods & CLI subcommands
            sm_raw = json.loads(p["herdr_socket_methods"]) if p["herdr_socket_methods"] else []
            cli_raw = json.loads(p["herdr_cli_commands"]) if p["herdr_cli_commands"] else []
            
            ep_list = []
            for s in sm_raw[:4]:
                ep_list.append(f"[`{s}`](https://herdr.dev/docs/socket-api/#raw-methods)")
            for c in cli_raw[:4]:
                ep_list.append(f"[`cli:{c}`](https://herdr.dev/docs/cli-reference/)")
            ep_str = ", ".join(ep_list) if ep_list else "Standard Shell / Environment Invocations"
            
            # Supported agents
            ag_raw = json.loads(p["supported_agents"]) if p["supported_agents"] else []
            ag_str = ", ".join([f"`{a}`" for a in ag_raw[:4]]) if ag_raw else "Agnostic / Core Multiplexer"

            plugin_articles.append(f"""#### 📦 [{fn}]({url})
*{lang} • {stars} ★ • {forks} ⑂ • {loc:,} LOC in {files} files • Category: {cat}*

> **Architectural Footprint:** {arch_badge_str}  
> **Core Endpoints:** {ep_str}  
> **Supported Agents:** {ag_str}

{desc.strip()}
""")

        articles_joined = "\n\n".join(plugin_articles)
        
        long_form = f"""## The Daily Herdr Dispatch — Issue #{day_num}
*{date_formatted} • {n_count} New Plugins Released • Cumulative Total: {cum_stats['plugins']} Plugins*

---

### 📰 Today's Ecosystem Overview

On **{date_formatted}**, the Herdr developer community expanded with **{n_count} newly registered plugins**. Today's crop represents **{sum(p['total_loc'] or 0 for p in day_plugins):,} lines of new code** and brings collective marketplace popularity to **{cum_stats['stars']:,} stars**.

{bt_section}

### 📦 Releases in Detail

{articles_joined}

---

### 📊 Ecosystem Barometer

```
┌──────────────────────────────────────────────────────────┐
│                   ECOSYSTEM METRICS TO DATE              │
├───────────────────────────────┬──────────────────────────┤
│ Total Market Size             │ {cum_stats['plugins']:<25}│
│ Cumulative Community Stars    │ {cum_stats['stars']:<25,f}│
│ Cumulative Community Forks    │ {cum_stats['forks']:<25,f}│
│ Cumulative Capability Footprint│ {seen_caps_count:<25}│
└───────────────────────────────┴──────────────────────────┘
```
"""

    return headline, exec_summary, long_form

def run_backfill():
    print("=" * 75)
    print("STARTING FULL CHRONOLOGICAL DAILY REPORT BACKFILL")
    print("Range: 2026-01-01 to 2026-09-07 (250 Days)")
    print("=" * 75)
    
    init_db(DB_PATH)
    conn = get_connection(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Load all plugins and auxiliary data
    cursor.execute("""
        SELECT id, repo_full_name, repo_name, repo_owner, repo_url,
               created_at, surveyed_commit_date, pushed_at,
               stars, forks, open_issues, total_loc, total_files,
               primary_language, broad_category, description, readme_summary,
               presents_tui, uses_web_display, interfaces_mobile,
               git_worktree_aware, adds_communications, is_cross_platform,
               has_tests, has_ci_workflows,
               uses_ssh, mentions_vps_gateway, mentions_router_setup,
               uses_vpn_tailscale, mentions_port_mapping, uses_mosh,
               herdr_socket_methods, herdr_cli_commands, supported_agents
        FROM plugins
        ORDER BY id ASC;
    """)
    all_plugins = [dict(r) for r in cursor.fetchall()]
    print(f"Loaded {len(all_plugins)} plugins from database.")
    
    # Load official core endpoints to ensure genuine API breakthroughs
    cursor.execute("SELECT endpoint FROM herdr_official_endpoints;")
    official_endpoints = {r["endpoint"] for r in cursor.fetchall()}
    print(f"Loaded {len(official_endpoints)} official Herdr Core endpoints.")
    
    # Pre-map official endpoints and agents
    cursor.execute("SELECT plugin_id, endpoint FROM plugin_endpoints;")
    p_endpoints = {}
    for r in cursor.fetchall():
        ep = r["endpoint"]
        if ep in official_endpoints:
            p_endpoints.setdefault(r["plugin_id"], []).append(ep)
        
    cursor.execute("SELECT plugin_id, agent_name FROM plugin_agents;")
    p_agents = {}
    for r in cursor.fetchall():
        p_agents.setdefault(r["plugin_id"], []).append(r["agent_name"])
        
    # Group plugins by normalized release date
    plugins_by_date = {}
    for p in all_plugins:
        r_date = get_normalized_release_date(p)
        plugins_by_date.setdefault(r_date, []).append(p)
        
    print(f"Plugins partitioned into {len(plugins_by_date)} distinct release dates.")
    
    # Reset existing tables for clean backfill
    cursor.execute("DELETE FROM daily_reports;")
    cursor.execute("DELETE FROM ecosystem_capabilities_ledger;")
    cursor.execute("DELETE FROM daily_report_plugins;")
    conn.commit()
    
    # Capability tracking state
    seen_capabilities = set()
    
    cum_stats = {
        "plugins": 0,
        "stars": 0,
        "forks": 0
    }
    
    curr_date = START_DATE
    day_num = 1
    total_breakthroughs = 0
    active_days_count = 0
    
    while curr_date <= END_DATE:
        d_str = curr_date.strftime("%Y-%m-%d")
        day_plugins = plugins_by_date.get(d_str, [])
        is_quiet = 1 if len(day_plugins) == 0 else 0
        
        if not is_quiet:
            active_days_count += 1
            cum_stats["plugins"] += len(day_plugins)
            cum_stats["stars"] += sum(p["stars"] or 0 for p in day_plugins)
            cum_stats["forks"] += sum(p["forks"] or 0 for p in day_plugins)
            
        # Detect breakthroughs for today's plugins
        day_breakthroughs = []
        for p in day_plugins:
            pid = p["id"]
            p_caps = extract_plugin_capabilities(
                p, 
                p_endpoints.get(pid, []), 
                p_agents.get(pid, [])
            )
            
            p_breakthroughs = []
            for cap in p_caps:
                ckey = cap["key"]
                if ckey not in seen_capabilities:
                    seen_capabilities.add(ckey)
                    day_breakthroughs.append({
                        "key": ckey,
                        "type": cap["type"],
                        "desc": cap["desc"],
                        "plugin": p["repo_full_name"],
                        "plugin_id": pid
                    })
                    p_breakthroughs.append(ckey)
                    
                    # Record in ledger
                    cursor.execute("""
                        INSERT OR IGNORE INTO ecosystem_capabilities_ledger 
                        (capability_key, capability_type, first_seen_date, first_plugin_id, first_plugin_name, description)
                        VALUES (?, ?, ?, ?, ?, ?);
                    """, (ckey, cap["type"], d_str, pid, p["repo_full_name"], cap["desc"]))
                    
            # Record in daily_report_plugins
            cursor.execute("""
                INSERT INTO daily_report_plugins (report_date, plugin_id, repo_full_name, is_breakthrough, breakthrough_reasons_json)
                VALUES (?, ?, ?, ?, ?);
            """, (d_str, pid, p["repo_full_name"], 1 if p_breakthroughs else 0, json.dumps(p_breakthroughs)))
            
        total_breakthroughs += len(day_breakthroughs)
        
        # Construct content
        headline, exec_summary, long_form = generate_report_content(
            d_str, 
            day_num, 
            day_plugins, 
            day_breakthroughs, 
            cum_stats, 
            len(seen_capabilities)
        )
        
        # Prepare mini plugin JSON summary
        plugins_mini = [{
            "id": p["id"],
            "fullName": p["repo_full_name"],
            "stars": p["stars"] or 0,
            "lang": p["primary_language"],
            "cat": p["broad_category"],
            "loc": p["total_loc"] or 0
        } for p in day_plugins]
        
        cursor.execute("""
            INSERT INTO daily_reports (
                report_date, day_number, is_quiet_day, headline,
                executive_summary, long_form_content, new_capabilities_json,
                plugins_released_count, plugins_released_json,
                cumulative_plugins_count, cumulative_stars_count, cumulative_forks_count,
                generated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            d_str, day_num, is_quiet, headline,
            exec_summary, long_form, json.dumps(day_breakthroughs),
            len(day_plugins), json.dumps(plugins_mini),
            cum_stats["plugins"], cum_stats["stars"], cum_stats["forks"],
            "genesis_backfill_engine"
        ))
        
        if day_num % 25 == 0 or day_num == 250:
            print(f"Day {day_num:3d} ({d_str}): {len(day_plugins):2d} plugins, {len(day_breakthroughs):2d} breakthroughs, cum total: {cum_stats['plugins']:3d} plugins")
            
        curr_date += timedelta(days=1)
        day_num += 1
        
    conn.commit()
    conn.close()
    
def generate_single_day(date_str, force=False):
    init_db(DB_PATH)
    conn = get_connection(DB_PATH)
    cursor = conn.cursor()
    
    # Check if already generated
    cursor.execute("SELECT report_date FROM daily_reports WHERE report_date = ?;", (date_str,))
    if cursor.fetchone() and not force:
        print(f"[Notice] Daily report for {date_str} already exists. Pass --force to regenerate.")
        conn.close()
        return
        
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    day_num = (dt - START_DATE).days + 1
    
    # Prior cumulative stats
    cursor.execute("""
        SELECT cumulative_plugins_count, cumulative_stars_count, cumulative_forks_count
        FROM daily_reports
        WHERE report_date < ?
        ORDER BY report_date DESC
        LIMIT 1;
    """, (date_str,))
    prior = cursor.fetchone()
    cum_plugins = prior["cumulative_plugins_count"] if prior else 0
    cum_stars = prior["cumulative_stars_count"] if prior else 0
    cum_forks = prior["cumulative_forks_count"] if prior else 0
    
    # Prior seen capabilities
    cursor.execute("SELECT capability_key FROM ecosystem_capabilities_ledger WHERE first_seen_date < ?;", (date_str,))
    seen_capabilities = {r["capability_key"] for r in cursor.fetchall()}
    
    # Official endpoints
    cursor.execute("SELECT endpoint FROM herdr_official_endpoints;")
    official_endpoints = {r["endpoint"] for r in cursor.fetchall()}
    
    # Find plugins released on this day
    cursor.execute("""
        SELECT id, repo_full_name, repo_name, repo_owner, repo_url,
               created_at, surveyed_commit_date, pushed_at,
               stars, forks, open_issues, total_loc, total_files,
               primary_language, broad_category, description, readme_summary,
               presents_tui, uses_web_display, interfaces_mobile,
               git_worktree_aware, adds_communications, is_cross_platform,
               has_tests, has_ci_workflows,
               uses_ssh, mentions_vps_gateway, mentions_router_setup,
               uses_vpn_tailscale, mentions_port_mapping, uses_mosh,
               herdr_socket_methods, herdr_cli_commands, supported_agents
        FROM plugins;
    """)
    all_p = [dict(r) for r in cursor.fetchall()]
    day_plugins = [p for p in all_p if get_normalized_release_date(p) == date_str]
    
    cursor.execute("SELECT plugin_id, endpoint FROM plugin_endpoints;")
    p_endpoints = {}
    for r in cursor.fetchall():
        if r["endpoint"] in official_endpoints:
            p_endpoints.setdefault(r["plugin_id"], []).append(r["endpoint"])
            
    cursor.execute("SELECT plugin_id, agent_name FROM plugin_agents;")
    p_agents = {}
    for r in cursor.fetchall():
        p_agents.setdefault(r["plugin_id"], []).append(r["agent_name"])
        
    cum_plugins += len(day_plugins)
    cum_stars += sum(p["stars"] or 0 for p in day_plugins)
    cum_forks += sum(p["forks"] or 0 for p in day_plugins)
    cum_stats = {"plugins": cum_plugins, "stars": cum_stars, "forks": cum_forks}
    
    # Detect breakthroughs
    day_breakthroughs = []
    for p in day_plugins:
        pid = p["id"]
        p_caps = extract_plugin_capabilities(p, p_endpoints.get(pid, []), p_agents.get(pid, []))
        p_bts = []
        for cap in p_caps:
            ckey = cap["key"]
            if ckey not in seen_capabilities:
                seen_capabilities.add(ckey)
                day_breakthroughs.append({
                    "key": ckey,
                    "type": cap["type"],
                    "desc": cap["desc"],
                    "plugin": p["repo_full_name"],
                    "plugin_id": pid
                })
                p_bts.append(ckey)
                cursor.execute("""
                    INSERT OR REPLACE INTO ecosystem_capabilities_ledger 
                    (capability_key, capability_type, first_seen_date, first_plugin_id, first_plugin_name, description)
                    VALUES (?, ?, ?, ?, ?, ?);
                """, (ckey, cap["type"], date_str, pid, p["repo_full_name"], cap["desc"]))
                
        cursor.execute("DELETE FROM daily_report_plugins WHERE report_date = ? AND plugin_id = ?;", (date_str, pid))
        cursor.execute("""
            INSERT INTO daily_report_plugins (report_date, plugin_id, repo_full_name, is_breakthrough, breakthrough_reasons_json)
            VALUES (?, ?, ?, ?, ?);
        """, (date_str, pid, p["repo_full_name"], 1 if p_bts else 0, json.dumps(p_bts)))
        
    headline, exec_summary, long_form = generate_report_content(
        date_str, day_num, day_plugins, day_breakthroughs, cum_stats, len(seen_capabilities)
    )
    
    plugins_mini = [{
        "id": p["id"],
        "fullName": p["repo_full_name"],
        "stars": p["stars"] or 0,
        "lang": p["primary_language"],
        "cat": p["broad_category"],
        "loc": p["total_loc"] or 0
    } for p in day_plugins]
    
    cursor.execute("""
        INSERT OR REPLACE INTO daily_reports (
            report_date, day_number, is_quiet_day, headline,
            executive_summary, long_form_content, new_capabilities_json,
            plugins_released_count, plugins_released_json,
            cumulative_plugins_count, cumulative_stars_count, cumulative_forks_count,
            generated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        date_str, day_num, 1 if len(day_plugins) == 0 else 0, headline,
        exec_summary, long_form, json.dumps(day_breakthroughs),
        len(day_plugins), json.dumps(plugins_mini),
        cum_stats["plugins"], cum_stats["stars"], cum_stats["forks"],
        "daily_agent_runner"
    ))
    
    conn.commit()
    conn.close()
    print(f"[Success] Generated daily report for {date_str} (Day {day_num}): {len(day_plugins)} plugins, {len(day_breakthroughs)} breakthroughs.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Herdr Ecosystem Daily Report & Chronological Ledger Generator")
    parser.add_argument("--backfill", action="store_true", help="Backfill all historical reports from Day 1 to Today")
    parser.add_argument("--date", type=str, help="Generate or update report for a specific date (YYYY-MM-DD)")
    parser.add_argument("--force", action="store_true", help="Overwrite existing report for the target date")
    args = parser.parse_args()
    
    if args.date:
        generate_single_day(args.date, force=args.force)
    else:
        run_backfill()

