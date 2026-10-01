"""
Comprehensive static and semantic code analyzer for Herdr plugins.
Extracts 50+ multidimensional metrics across manifests, source code, Herdr socket/CLI endpoints,
AI agents, protocol architectures, UI traits, and developer tooling.
"""

import os
import re
import json
import glob
import subprocess
from datetime import datetime
try:
    import tomllib as tomli
except ImportError:
    import tomli

from scripts.taxonomy import classify_plugin

LANG_EXT_MAP = {
    ".rs": "Rust",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".js": "JavaScript",
    ".mjs": "JavaScript",
    ".cjs": "JavaScript",
    ".jsx": "JavaScript",
    ".go": "Go",
    ".py": "Python",
    ".sh": "Shell",
    ".bash": "Shell",
    ".zsh": "Shell",
    ".lua": "Lua",
    ".c": "C",
    ".h": "C",
    ".cpp": "C++",
    ".cc": "C++",
    ".cxx": "C++",
    ".hpp": "C++",
    ".html": "HTML",
    ".htm": "HTML",
    ".css": "CSS",
    ".scss": "CSS",
    ".json": "JSON",
    ".toml": "TOML",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".md": "Markdown",
    ".ps1": "PowerShell",
    ".swift": "Swift",
    ".rb": "Ruby",
    ".sql": "SQL",
    ".pl": "Perl",
    ".pm": "Perl"
}

HERDR_SOCKET_METHODS = [
    "workspace.list", "workspace.create", "workspace.focus", "workspace.rename", "workspace.close", 
    "workspace.worktree", "workspace.report_metadata", "workspace.metadata_updated",
    "tab.list", "tab.create", "tab.focus", "tab.rename", "tab.close",
    "pane.list", "pane.split", "pane.read", "pane.send_text", "pane.send_keys", "pane.send_input", 
    "pane.focus", "pane.zoom", "pane.close", "pane.agent_detected", "pane.agent_status_changed", 
    "pane.report_agent", "pane.report_metadata", "pane.process_info", "pane.swap", "pane.move",
    "agent.prompt", "agent.send", "agent.list", "agent.get", "agent.start", "agent.wait", "agent.view.set",
    "events.subscribe", "events.wait", "session.snapshot", "layout.apply", "layout.export",
    "worktree.create", "worktree.list", "worktree.open", "worktree.remove",
    "plugin.action.invoke", "plugin.pane.open", "plugin.pane.close", "popup.close", "notification.show"
]

HERDR_ENV_VARS = [
    "HERDR_SOCKET_PATH", "HERDR_BIN_PATH", "HERDR_PLUGIN_ROOT", "HERDR_PLUGIN_CONFIG_DIR",
    "HERDR_PLUGIN_STATE_DIR", "HERDR_PLUGIN_CONTEXT_JSON", "HERDR_WORKSPACE_ID", 
    "HERDR_TAB_ID", "HERDR_PANE_ID", "HERDR_PLUGIN_EVENT", "HERDR_PLUGIN_EVENT_JSON",
    "HERDR_PLUGIN_ACTION_ID", "HERDR_PLUGIN_ENTRYPOINT_ID"
]

EXPANDED_AGENTS = [
    ("opencode", ["opencode", "oh-my-opencode", "omp"]),
    ("claude-code", ["claude-code", "claude code", "clauth", "~/.claude"]),
    ("cursor", ["cursor"]),
    ("codex", ["codex-cli", "codex", "openai codex"]),
    ("pi", ["pi-workflows", "pi agent", "piw"]),
    ("grok", ["grok"]),
    ("agy", ["agy", "antigravity"]),
    ("copilot", ["github copilot", "copilot"]),
    ("cline", ["cline", "roo-cline", "roo-code"]),
    ("devin", ["devin"]),
    ("amp", ["amp agent", "amp"]),
    ("aider", ["aider"]),
    ("moshi", ["moshi"]),
    ("windsurf", ["windsurf"]),
    ("supermaven", ["supermaven"]),
    ("continue", ["continue.dev", "continue extension"])
]

SKIP_DIRS = {".git", "node_modules", "target", "dist", "vendor", "build", ".out-of-scope", "img", "assets", "public"}

def count_lines_and_files(repo_path):
    total_files = 0
    total_dirs = 0
    total_loc = 0
    lang_files = {}
    lang_loc = {}
    has_tests = 0
    has_ci = 0
    has_dockerfile = 0
    has_license = 0
    
    ci_path = os.path.join(repo_path, ".github", "workflows")
    if os.path.exists(ci_path) and os.listdir(ci_path):
        has_ci = 1
        
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".git")]
        total_dirs += len(dirs)
        
        for f in files:
            total_files += 1
            fl = f.lower()
            if fl in ("license", "license.md", "license.txt"):
                has_license = 1
            if fl.startswith("dockerfile") or fl.endswith(".dockerfile"):
                has_dockerfile = 1
            if "test" in fl or "spec" in fl or "tests" in root:
                has_tests = 1
                
            ext = os.path.splitext(f)[1].lower()
            lang = LANG_EXT_MAP.get(ext, "Other")
            lang_files[lang] = lang_files.get(lang, 0) + 1
            
            if ext in LANG_EXT_MAP:
                p = os.path.join(root, f)
                try:
                    with open(p, "rb") as fl_obj:
                        count = sum(1 for _ in fl_obj)
                        total_loc += count
                        lang_loc[lang] = lang_loc.get(lang, 0) + count
                except Exception:
                    pass

    return {
        "total_files": total_files,
        "total_dirs": total_dirs,
        "total_loc": total_loc,
        "lang_files": lang_files,
        "lang_loc": lang_loc,
        "has_tests": has_tests,
        "has_ci": has_ci,
        "has_dockerfile": has_dockerfile,
        "has_license": has_license
    }

def get_contributors_count(repo_path):
    contrib_file = os.path.join(repo_path, ".all-contributorsrc")
    if os.path.exists(contrib_file):
        try:
            with open(contrib_file) as f:
                data = json.load(f)
                contributors = data.get("contributors", [])
                if contributors:
                    return len(contributors)
        except Exception:
            pass
            
    try:
        res = subprocess.run(
            ["git", "-C", repo_path, "shortlog", "-sn", "--all"],
            capture_output=True, text=True, timeout=5
        )
        if res.returncode == 0 and res.stdout.strip():
            lines = [l for l in res.stdout.strip().split("\n") if l.strip()]
            return max(1, len(lines))
    except Exception:
        pass
    return 1

def find_and_parse_manifests(repo_path):
    manifest_files = glob.glob(f"{repo_path}/**/herdr-plugin.toml", recursive=True)
    manifests = []
    
    for mf in manifest_files:
        rel_path = os.path.relpath(mf, repo_path)
        try:
            with open(mf, "rb") as f:
                parsed = tomli.load(f)
                parsed["_manifest_path"] = rel_path
                manifests.append(parsed)
        except Exception as e:
            manifests.append({
                "_manifest_path": rel_path,
                "_error": str(e)
            })
            
    return manifests

def extract_readme(repo_path):
    readme_patterns = [f"{repo_path}/README.md", f"{repo_path}/README.*.md", f"{repo_path}/readme.md"]
    found = []
    for pat in readme_patterns:
        found.extend(glob.glob(pat))
        
    if not found:
        return "", ""
        
    primary = os.path.join(repo_path, "README.md")
    chosen = primary if primary in found else found[0]
    
    try:
        with open(chosen, "r", errors="ignore") as f:
            text = f.read()
            
        lines = [l.strip() for l in text.split("\n")]
        title = ""
        summary_paras = []
        for l in lines:
            if not title and l.startswith("#"):
                title = l.lstrip("#").strip()
            elif l and not l.startswith("#") and not l.startswith("[!") and not l.startswith("<"):
                summary_paras.append(l)
                if len(summary_paras) >= 3:
                    break
        summary = " ".join(summary_paras)[:450]
        return text, (summary or title)
    except Exception:
        return "", ""

def scan_codebase_for_patterns(repo_path):
    detected_methods = set()
    detected_cli = set()
    detected_envs = set()
    raw_code_text = []
    
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".git")]
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in LANG_EXT_MAP:
                p = os.path.join(root, f)
                try:
                    with open(p, "r", errors="ignore") as file:
                        content = file.read()
                        
                        if len(raw_code_text) < 60:
                            raw_code_text.append(content[:2000])
                            
                        for m in HERDR_SOCKET_METHODS:
                            if m in content:
                                detected_methods.add(m)
                                
                        for ev in HERDR_ENV_VARS:
                            if ev in content:
                                detected_envs.add(ev)
                                
                        if "herdr " in content:
                            cli_matches = re.findall(r"herdr\s+([a-z0-9_-]+(?:\s+[a-z0-9_-]+)?)", content)
                            for cm in cli_matches:
                                detected_cli.add(cm.strip())
                except Exception:
                    pass

    return {
        "socket_methods": sorted(list(detected_methods)),
        "cli_commands": sorted(list(detected_cli)),
        "env_vars": sorted(list(detected_envs)),
        "code_sample": "\n".join(raw_code_text)
    }

def detect_agents_and_collection(meta, manifest_data, readme_text, code_sample):
    combined_text = (
        (meta.get("description") or "") + " " +
        " ".join(meta.get("topics", [])) + " " +
        readme_text + " " +
        code_sample
    ).lower()
    
    detected_agents = []
    for agent_name, aliases in EXPANDED_AGENTS:
        if any(alias in combined_text for alias in aliases):
            detected_agents.append(agent_name)
            
    is_general = len(detected_agents) == 0 or any(k in combined_text for k in ["any agent", "all agents", "general", "process", "multiplexer"])
    
    collection_methods = []
    if any(k in combined_text for k in ["acp", "agent client protocol", "acp-run"]):
        collection_methods.append("acp")
    if any(k in combined_text for k in ["~/.claude", "transcript", ".jsonl", "log file", "history database", "tantivy"]):
        collection_methods.append("log_file_scraping")
    if any(k in combined_text for k in ["events.subscribe", "pane.agent_detected", "agent_status_changed"]):
        collection_methods.append("socket_events")
    if any(k in combined_text for k in ["pane.read", "screen scrap", "pane buffer", "wait_for_output"]):
        collection_methods.append("terminal_snooping")
    if any(k in combined_text for k in ["llmtrim", "proxy", "token compress", "prompt cache"]):
        collection_methods.append("cli_proxy")
    if any(k in combined_text for k in ["annotation", "reviewr", "line comment", "send_text", "agent.prompt"]):
        collection_methods.append("interactive_feedback")
    if any(k in combined_text for k in ["mcp", "model context protocol", "mcp tool"]):
        collection_methods.append("mcp_tool_delegation")
        
    if not collection_methods:
        collection_methods = ["none_or_passive"]
        
    scope = "general" if (is_general and not detected_agents) else ("hybrid" if (is_general and detected_agents) else "specific")
    details = f"Agents: {', '.join(detected_agents) or 'Generic terminal process'}. Ingestion: {', '.join(collection_methods)}."
    
    return scope, detected_agents, collection_methods, details

def detect_features(meta, manifests, readme_text, code_sample, lang_stats, env_vars):
    combined = (
        (meta.get("description") or "") + " " +
        " ".join(meta.get("topics", [])) + " " +
        readme_text + " " +
        code_sample
    ).lower()
    
    # 1. Adds communications
    comms_terms = ["telegram", "discord", "slack", "webrtc", "push notification", "webhook", "sms", "email", "relay", "tailscale serve", "ntfy"]
    adds_communications = 1 if any(t in combined for t in comms_terms) else 0
    
    # 2. Presents TUI
    tui_terms = ["ratatui", "bubbletea", "crossterm", "curses", "tui", "sidebar", "tree view", "terminal popup", "split pane"]
    manifest_has_tui = any(
        any(p.get("placement") in ["split", "popup", "overlay"] for p in m.get("panes", []))
        for m in manifests if isinstance(m, dict)
    )
    presents_tui = 1 if (manifest_has_tui or any(t in combined for t in tui_terms)) else 0
    
    # 3. Interfaces to mobile app
    mobile_terms = ["mobile", "phone", "smartphone", "ios", "android", "pwa", "tailnet", "qr code", "qr pairing", "collie"]
    interfaces_mobile = 1 if any(t in combined for t in mobile_terms) else 0
    
    # 4. Uses HTML / JS / Web Display
    web_terms = ["browser", "webview", "pwa", "localhost:", "http://", "express", "fastify", "vite", "web ui", "html", "terminal-browser"]
    has_web_files = (lang_stats["lang_files"].get("HTML", 0) > 0 or lang_stats["lang_files"].get("CSS", 0) > 0)
    uses_web_display = 1 if (has_web_files or any(t in combined for t in web_terms)) else 0
    
    # 5. Calls AI model directly
    ai_terms = ["openai", "anthropic", "cerebras", "ollama", "groq", "bedrock", "claude 3", "gpt-4", "gemini", "deepmind", "llm api"]
    uses_ai_model = 1 if any(t in combined for t in ai_terms) else 0
    
    # 6. Git worktree aware
    worktree_terms = ["worktree", "worktrunk", "jj workspace", "jujutsu", "worktree.created", "worktree.opened"]
    git_worktree_aware = 1 if any(t in combined for t in worktree_terms) else 0

    # 7. Network protocol
    network_protocol = "none"
    if "webrtc" in combined:
        network_protocol = "webrtc"
    elif "tailscale" in combined:
        network_protocol = "tailscale"
    elif "cloudflare" in combined or "cloudflared" in combined:
        network_protocol = "cloudflare_tunnel"
    elif "websocket" in combined or "ws://" in combined or "wss://" in combined:
        network_protocol = "websocket"
    elif "http://" in combined or "https://" in combined:
        network_protocol = "http_rest"
    elif "HERDR_SOCKET_PATH" in env_vars:
        network_protocol = "unix_socket"

    # 8. Tunnel service
    tunnel_service = "none"
    if "tailscale" in combined:
        tunnel_service = "tailscale"
    elif "cloudflare" in combined or "cloudflared" in combined:
        tunnel_service = "cloudflare"
    elif "ngrok" in combined:
        tunnel_service = "ngrok"
        
    # 9. Storage architecture
    state_storage_type = "none"
    if "sqlite" in combined or ".sqlite" in combined:
        state_storage_type = "sqlite"
    elif "json" in combined or ".json" in combined:
        state_storage_type = "json"
    elif "toml" in combined or ".toml" in combined:
        state_storage_type = "toml"
    elif "yaml" in combined or ".yaml" in combined:
        state_storage_type = "yaml"

    # 10. Auth strategy
    auth_strategy = "none"
    if "qr code" in combined or "qr-code" in combined:
        auth_strategy = "qr_code_pairing"
    elif "oauth" in combined or "oauth2" in combined:
        auth_strategy = "oauth2"
    elif "tailscale whois" in combined or "tailnet" in combined:
        auth_strategy = "tailscale_whois"
    elif "token" in combined or "api_key" in combined or "secret" in combined:
        auth_strategy = "token"

    # 11. Editor integration
    integrates_editor = "none"
    if "neovim" in combined or "nvim" in combined:
        integrates_editor = "neovim"
    elif "vim" in combined:
        integrates_editor = "vim"
    elif "vscode" in combined or "vs code" in combined:
        integrates_editor = "vscode"

    # 12. Terminal multiplexer compatibility
    multiplexers = ["herdr"]
    for mux in ["tmux", "zellij", "kitty", "cmux", "wezterm"]:
        if mux in combined:
            multiplexers.append(mux)

    # 13. Token efficiency & quota
    is_token_optimizer = 1 if any(k in combined for k in ["token compress", "llmtrim", "shrink token", "compress request", "prompt cache"]) else 0
    is_quota_manager = 1 if any(k in combined for k in ["quota", "rate limit", "credit", "usage monitor", "account switch"]) else 0

    # 14. Binary release & MCP
    has_prebuilt_binaries = 1 if any(k in combined for k in ["github release", "prebuilt", "download binary", "bin/herdr"]) else 0
    mcp_support = 1 if any(k in combined for k in ["mcp", "model context protocol", "mcp tool", "mcp server"]) else 0

    # 15. Herdr state directories
    uses_herdr_state_dir = 1 if "HERDR_PLUGIN_STATE_DIR" in env_vars or "herdr_plugin_state_dir" in combined else 0
    uses_herdr_config_dir = 1 if "HERDR_PLUGIN_CONFIG_DIR" in env_vars or "herdr_plugin_config_dir" in combined else 0

    return {
        "adds_communications": adds_communications,
        "presents_tui": presents_tui,
        "interfaces_mobile": interfaces_mobile,
        "uses_web_display": uses_web_display,
        "uses_ai_model_directly": uses_ai_model,
        "git_worktree_aware": git_worktree_aware,
        "network_protocol": network_protocol,
        "tunnel_service": tunnel_service,
        "state_storage_type": state_storage_type,
        "auth_strategy": auth_strategy,
        "integrates_editor": integrates_editor,
        "terminal_multiplexers": json.dumps(sorted(list(set(multiplexers)))),
        "is_token_optimizer": is_token_optimizer,
        "is_quota_manager": is_quota_manager,
        "has_prebuilt_binaries": has_prebuilt_binaries,
        "mcp_support": mcp_support,
        "uses_herdr_state_dir": uses_herdr_state_dir,
        "uses_herdr_config_dir": uses_herdr_config_dir
    }


# Remote Infrastructure & Network Access Analysis
INFRA_PATTERNS = {
    "ssh": [r"\bssh\b", r"ssh -", r"authorized_keys", r"ssh tunnel", r"sshd", r"openssh"],
    "mosh": [r"\bmosh\b", r"mosh-server", r"mobile shell"],
    "vpn_tailscale": [r"\btailscale\b", r"\bwireguard\b", r"\bheadscale\b", r"\bzerotier\b", r"\bvpn\b", r"\bnebula\b", r"tailnet"],
    "port_mapping": [r"port forward", r"port mapping", r"map port", r"upnp", r"forwarding port", r"port-forwarding", r"-p \d+:\d+"],
    "router_setup": [r"router", r"home router", r"nat traversal", r"ddns", r"dynamic dns", r"public ip", r"port forwarding on your router"],
    "vps_gateway": [r"\bvps\b", r"hetzner", r"digitalocean", r"linode", r"ec2", r"bastion", r"gateway", r"reverse proxy", r"cloud server", r"self-host", r"remote server"]
}

def detect_remote_infrastructure(readme_text, code_sample, manifests):
    combined = (readme_text + " " + code_sample).lower()
    
    uses_ssh = 1 if any(re.search(p, combined) for p in INFRA_PATTERNS["ssh"]) else 0
    uses_mosh = 1 if any(re.search(p, combined) for p in INFRA_PATTERNS["mosh"]) else 0
    uses_vpn = 1 if any(re.search(p, combined) for p in INFRA_PATTERNS["vpn_tailscale"]) else 0
    mentions_port = 1 if any(re.search(p, combined) for p in INFRA_PATTERNS["port_mapping"]) else 0
    mentions_router = 1 if any(re.search(p, combined) for p in INFRA_PATTERNS["router_setup"]) else 0
    mentions_vps = 1 if any(re.search(p, combined) for p in INFRA_PATTERNS["vps_gateway"]) else 0
    
    requires_infra = 1 if (uses_ssh or uses_mosh or uses_vpn or mentions_port or mentions_router or mentions_vps) else 0
    
    tags = []
    if uses_ssh: tags.append("SSH Tunnel")
    if uses_mosh: tags.append("Mosh")
    if uses_vpn: tags.append("VPN/Tailscale")
    if mentions_port: tags.append("Port Mapping")
    if mentions_router: tags.append("Router/NAT")
    if mentions_vps: tags.append("VPS/Gateway")
    
    details = ", ".join(tags) if tags else "None required (Local only)"
    
    return {
        "uses_ssh": uses_ssh,
        "uses_mosh": uses_mosh,
        "uses_vpn_tailscale": uses_vpn,
        "mentions_port_mapping": mentions_port,
        "mentions_router_setup": mentions_router,
        "mentions_vps_gateway": mentions_vps,
        "requires_remote_infra": requires_infra,
        "remote_infra_details": details
    }


def analyze_repository(repo_path, meta):
    lang_stats = count_lines_and_files(repo_path)
    contributors_count = get_contributors_count(repo_path)
    manifests = find_and_parse_manifests(repo_path)
    readme_text, readme_summary = extract_readme(repo_path)
    code_scan = scan_codebase_for_patterns(repo_path)
    
    primary_manifest = manifests[0] if manifests and isinstance(manifests[0], dict) else {}
    has_manifest = 1 if manifests and not primary_manifest.get("_error") else 0
    
    agent_scope, supported_agents, collection_methods, agent_details = detect_agents_and_collection(
        meta, primary_manifest, readme_text, code_scan["code_sample"]
    )
    
    features = detect_features(
        meta, manifests, readme_text, code_scan["code_sample"], lang_stats, code_scan["env_vars"]
    )
    
    infra = detect_remote_infrastructure(readme_text, code_scan["code_sample"], manifests)
    broad, sub, sub_sub, tags = classify_plugin(
        meta, primary_manifest, readme_text, code_scan["socket_methods"], supported_agents
    )
    
    # Manifest counts & placements
    actions_count = len(primary_manifest.get("actions", [])) if isinstance(primary_manifest, dict) else 0
    panes_count = len(primary_manifest.get("panes", [])) if isinstance(primary_manifest, dict) else 0
    events_count = len(primary_manifest.get("events", [])) if isinstance(primary_manifest, dict) else 0
    startup_count = len(primary_manifest.get("startup", [])) if isinstance(primary_manifest, dict) else 0
    build_count = len(primary_manifest.get("build", [])) if isinstance(primary_manifest, dict) else 0
    link_handlers_count = len(primary_manifest.get("link_handlers", [])) if isinstance(primary_manifest, dict) else 0
    
    placements = []
    if isinstance(primary_manifest, dict):
        for p in primary_manifest.get("panes", []):
            if isinstance(p, dict) and "placement" in p:
                placements.append(p["placement"])
    has_modal_popup = 1 if "popup" in placements else 0
    
    platforms = primary_manifest.get("platforms", [])
    is_cross_platform = 1 if all(os_name in platforms for os_name in ["linux", "macos", "windows"]) else 0
    
    all_endpoints = set(code_scan["socket_methods"])
    for ev in primary_manifest.get("events", []):
        if isinstance(ev, dict) and "on" in ev:
            all_endpoints.add(f"event:{ev['on']}")
            
    # Git commit hash and date tracking
    surveyed_hash = ""
    surveyed_date = ""
    try:
        r_hash = subprocess.run(["git", "-C", repo_path, "rev-parse", "HEAD"], capture_output=True, text=True, timeout=3)
        if r_hash.returncode == 0:
            surveyed_hash = r_hash.stdout.strip()
        r_date = subprocess.run(["git", "-C", repo_path, "log", "-1", "--format=%cI"], capture_output=True, text=True, timeout=3)
        if r_date.returncode == 0:
            surveyed_date = r_date.stdout.strip()
    except Exception:
        pass

    upstream_hash = meta.get("headCommit") or ""
    upstream_pushed = meta.get("pushedAt") or ""
    
    # Check out-of-date status
    is_out_of_date = 0
    if upstream_hash and surveyed_hash and upstream_hash != surveyed_hash:
        is_out_of_date = 1
    elif upstream_pushed and surveyed_date and upstream_pushed > surveyed_date:
        is_out_of_date = 1

    # Popularity & trending
    stars = meta.get("stars", 0) or 0
    forks = meta.get("forks", 0) or 0
    delta7d = meta.get("starsDelta7d", 0) or 0
    pop_score = round(stars * 1.0 + forks * 2.5 + delta7d * 1.5, 2)
    is_trending = 1 if delta7d > 5 else 0

    return {
        "repo_full_name": meta.get("fullName"),
        "repo_name": meta.get("name"),
        "repo_owner": meta.get("owner"),
        "repo_url": meta.get("url"),
        "surveyed_commit_hash": surveyed_hash,
        "surveyed_commit_date": surveyed_date,
        "surveyed_version": primary_manifest.get("version", ""),
        "upstream_head_commit": upstream_hash,
        "upstream_pushed_at": upstream_pushed,
        "is_out_of_date": is_out_of_date,
        "last_synced_at": datetime.utcnow().isoformat() + "Z",
        "stars": stars,
        "forks": forks,
        "open_issues": meta.get("openIssues", 0) or 0,
        "stars_delta_7d": delta7d,
        "popularity_score": pop_score,
        "is_trending_weekly": is_trending,
        "primary_language": meta.get("language") or "Unknown",
        "created_at": meta.get("createdAt"),
        "updated_at": meta.get("updatedAt"),
        "pushed_at": meta.get("pushedAt"),
        "topics": json.dumps(meta.get("topics", [])),
        "total_files": lang_stats["total_files"],
        "total_dirs": lang_stats["total_dirs"],
        "total_loc": lang_stats["total_loc"],
        "file_language_dist": json.dumps(lang_stats["lang_files"]),
        "loc_language_dist": json.dumps(lang_stats["lang_loc"]),
        "contributors_count": contributors_count,
        "has_tests": lang_stats["has_tests"],
        "has_ci_workflows": lang_stats["has_ci"],
        "has_license": lang_stats["has_license"],
        "has_dockerfile": lang_stats["has_dockerfile"],
        "readme_summary": readme_summary,
        "description": meta.get("description") or primary_manifest.get("description") or "",
        # Manifest
        "has_manifest": has_manifest,
        "manifest_id": primary_manifest.get("id", ""),
        "manifest_name": primary_manifest.get("name", ""),
        "manifest_version": primary_manifest.get("version", ""),
        "min_herdr_version": primary_manifest.get("min_herdr_version") or primary_manifest.get("minHerdrVersion") or "",
        "platforms": json.dumps(platforms),
        "is_cross_platform": is_cross_platform,
        "manifest_actions_count": actions_count,
        "manifest_panes_count": panes_count,
        "manifest_events_count": events_count,
        "manifest_startup_count": startup_count,
        "manifest_build_count": build_count,
        "manifest_link_handlers_count": link_handlers_count,
        "has_build_steps": 1 if build_count > 0 else 0,
        "has_startup_hook": 1 if startup_count > 0 else 0,
        "has_link_handlers": 1 if link_handlers_count > 0 else 0,
        "has_modal_popup": has_modal_popup,
        "pane_placement_types": json.dumps(sorted(list(set(placements)))),
        "manifest_raw_json": json.dumps(manifests),
        # Classification
        "broad_category": broad,
        "sub_category": sub,
        "sub_sub_category": sub_sub,
        "category_tags": json.dumps(tags),
        # Features & Dimensions
        "adds_communications": features["adds_communications"],
        "presents_tui": features["presents_tui"],
        "interfaces_mobile": features["interfaces_mobile"],
        "uses_web_display": features["uses_web_display"],
        "uses_ai_model_directly": features["uses_ai_model_directly"],
        "git_worktree_aware": features["git_worktree_aware"],
        "network_protocol": features["network_protocol"],
        "tunnel_service": features["tunnel_service"],
        "state_storage_type": features["state_storage_type"],
        "auth_strategy": features["auth_strategy"],
        "integrates_editor": features["integrates_editor"],
        "terminal_multiplexers_supported": features["terminal_multiplexers"],
        "is_token_optimizer": features["is_token_optimizer"],
        "is_quota_manager": features["is_quota_manager"],
        "has_prebuilt_binaries": features["has_prebuilt_binaries"],
        "mcp_support": features["mcp_support"],
        "uses_herdr_state_dir": features["uses_herdr_state_dir"],
        "uses_herdr_config_dir": features["uses_herdr_config_dir"],
        # Remote Infrastructure Setup Dimensions
        "uses_ssh": infra["uses_ssh"],
        "uses_mosh": infra["uses_mosh"],
        "uses_vpn_tailscale": infra["uses_vpn_tailscale"],
        "mentions_port_mapping": infra["mentions_port_mapping"],
        "mentions_router_setup": infra["mentions_router_setup"],
        "mentions_vps_gateway": infra["mentions_vps_gateway"],
        "requires_remote_infra": infra["requires_remote_infra"],
        "remote_infra_details": infra["remote_infra_details"],
        # Herdr API
        "herdr_socket_methods": json.dumps(sorted(list(all_endpoints))),
        "herdr_cli_commands": json.dumps(code_scan["cli_commands"]),
        "herdr_env_vars": json.dumps(code_scan["env_vars"]),
        # Agents
        "agent_scope": agent_scope,
        "supported_agents": json.dumps(supported_agents),
        "agent_data_collection": json.dumps(collection_methods),
        "agent_data_details": agent_details
    }