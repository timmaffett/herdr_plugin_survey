"""
Taxonomy and classification engine for Herdr plugins.
Defines broad, sub, and sub-sub categories, and categorization heuristics.
"""

BROAD_CATEGORIES = [
    "Agent Orchestration & Swarms",
    "Code Review & Diff Inspection",
    "Remote Access & Mobile Control",
    "Session & Workspace Management",
    "Terminal UI & Navigation",
    "Usage, Cost & Quota Monitoring",
    "Developer Workflow & Utilities",
    "Window, Tab & Layout Automation",
    "Web & Browser Integration",
    "Task & Project Management"
]

def classify_plugin(meta, manifest_data, readme_text, detected_apis, detected_agents):
    """
    Intelligently assigns broad, sub, and sub-sub categories, plus searchable tags.
    """
    name = (meta.get("name") or "").lower()
    full_name = (meta.get("fullName") or "").lower()
    desc = (meta.get("description") or "").lower()
    topics = [t.lower() for t in meta.get("topics", [])]
    readme = readme_text.lower()
    
    tags = set(topics)
    
    # 1. Agent Orchestration & Swarms
    if any(k in desc or k in name or k in topics for k in ["swarm", "orchestrat", "dag", "multi-agent", "multiplex", "oh-my-opencode", "delegate"]):
        broad = "Agent Orchestration & Swarms"
        if "dag" in name or "dag" in desc or "graph" in desc:
            sub = "DAG & Workflow Graphs"
            sub_sub = "Directed Acyclic Graph Task Execution"
        elif "kanban" in desc or "board" in name:
            sub = "Visual Dispatch & Boards"
            sub_sub = "Kanban Card Agent Dispatcher"
        elif "workflow" in desc or "pi-workflows" in name:
            sub = "Workflow Engines"
            sub_sub = "Multi-step Pipeline Automation"
        else:
            sub = "Multi-Agent Multiplexers"
            sub_sub = "Concurrent Agent Pane Management"
        tags.update(["orchestration", "multi-agent", "subagents"])
        return broad, sub, sub_sub, list(tags)

    # 2. Remote Access & Mobile Control
    if any(k in desc or k in name or k in topics for k in ["mobile", "phone", "telegram", "remote", "collie", "relay", "pwa", "tailscale", "qr"]):
        broad = "Remote Access & Mobile Control"
        if "telegram" in desc or "telegram" in name:
            sub = "Chatbot Bridges"
            sub_sub = "Telegram Remote Control & Notifications"
        elif "qr" in desc or "webrtc" in desc or "cloudflare" in desc or "relay" in name:
            sub = "Tunnel & Relay Gateways"
            sub_sub = "WebRTC / Cloudflare Secure Tunnel"
        elif "tailscale" in desc or "pwa" in desc or "collie" in name:
            sub = "Mobile PWA Dashboards"
            sub_sub = "Tailnet-Accessible Web Companion"
        else:
            sub = "Remote Notification Relays"
            sub_sub = "Push Notifications & Approvals"
        tags.update(["remote", "mobile", "notifications"])
        return broad, sub, sub_sub, list(tags)

    # 3. Code Review & Diff Inspection
    if any(k in desc or k in name or k in topics for k in ["diff", "review", "reviewr", "hunk", "annotate", "annotat"]):
        broad = "Code Review & Diff Inspection"
        if "annotate" in name or "annotation" in desc:
            sub = "Terminal & Code Annotation"
            sub_sub = "Inline Feedback & Agent Correction"
        elif "hunk" in name or "hunk" in desc:
            sub = "Hunk-level Inspection"
            sub_sub = "Interactive Patch & Hunk Reviewer"
        else:
            sub = "Diff Viewer Sidebars"
            sub_sub = "Agent Turn & Diff Review Pane"
        tags.update(["code-review", "diff", "annotation"])
        return broad, sub, sub_sub, list(tags)

    # 4. Usage, Cost & Quota Monitoring
    if any(k in desc or k in name or k in topics for k in ["quota", "usage", "token", "cost", "compress", "llmtrim", "clauth", "rate-limit"]):
        broad = "Usage, Cost & Quota Monitoring"
        if "compress" in desc or "llmtrim" in name or "proxy" in desc:
            sub = "Token Compression Proxies"
            sub_sub = "Transparent LLM Request/Response Shrinker"
        elif "account" in desc or "clauth" in name or "switcher" in desc:
            sub = "Multi-Account Switchers"
            sub_sub = "OAuth & Usage Limit Balancer"
        else:
            sub = "Quota & Token Dashboards"
            sub_sub = "Real-time Context & Credit Monitoring"
        tags.update(["token-efficiency", "quota", "monitoring"])
        return broad, sub, sub_sub, list(tags)

    # 5. Session & Workspace Management
    if any(k in desc or k in name or k in topics for k in ["session", "workspace", "worktree", "sesh", "sessionizer", "worktrunk", "spreader", "jj"]):
        broad = "Session & Workspace Management"
        if "worktree" in name or "worktree" in desc or "worktrunk" in name or "jj" in name:
            sub = "Git Worktree & VCS Isolation"
            sub_sub = "Branch-to-Workspace Instant Scaffolding"
        elif "sesh" in name or "sessionizer" in name or "fzf" in desc:
            sub = "Fuzzy Session Pickers"
            sub_sub = "Zoxide & Path-based Workspace Spawner"
        elif "spreader" in name or "layout" in desc or "declarative" in desc:
            sub = "Declarative Layout Bootstrappers"
            sub_sub = "YAML/TOML Workspace Templates"
        else:
            sub = "Session Desks & History"
            sub_sub = "Session Search, Restore & Reattachment"
        tags.update(["workspace", "sessions", "worktrees"])
        return broad, sub, sub_sub, list(tags)

    # 6. Terminal UI & Navigation
    if any(k in desc or k in name or k in topics for k in ["sidebar", "file-viewer", "navigator", "nvim", "vim", "termscope", "splits"]):
        broad = "Terminal UI & Navigation"
        if "nvim" in name or "vim" in name or "splits" in name:
            sub = "Editor & Split Navigation"
            sub_sub = "Seamless Vim/Neovim Split Traversal"
        elif "sidebar" in name or "file" in name or "viewer" in name:
            sub = "TUI File Explorers"
            sub_sub = "Git-aware Tree & Syntax Viewer"
        elif "navigator" in name or "fuzzy" in desc:
            sub = "Workspace Navigators"
            sub_sub = "Omni-search Jump Palette"
        else:
            sub = "Terminal Screen Scrapers"
            sub_sub = "Link & File Terminal Matcher"
        tags.update(["tui", "navigation", "terminal"])
        return broad, sub, sub_sub, list(tags)

    # 7. Web & Browser Integration
    if any(k in desc or k in name or k in topics for k in ["browser", "web", "html", "terminal-browser", "terminal-code", "vscode"]):
        broad = "Web & Browser Integration"
        if "vscode" in desc or "terminal-code" in name:
            sub = "Embedded Code Editors"
            sub_sub = "Headless VS Code in Terminal"
        else:
            sub = "Embedded Terminal Browsers"
            sub_sub = "In-Terminal Web Rendering & DOM Access"
        tags.update(["browser", "web", "dom"])
        return broad, sub, sub_sub, list(tags)

    # 8. Window, Tab & Layout Automation
    if any(k in desc or k in name or k in topics for k in ["rename", "title", "tab", "auto-title", "smart-rename", "window-title", "layout"]):
        broad = "Window, Tab & Layout Automation"
        if "rename" in name or "title" in name:
            sub = "Contextual Tab Naming"
            sub_sub = "AI & Process-driven Dynamic Tab Titles"
        else:
            sub = "Pane Arrangement"
            sub_sub = "Automated Split & Grid Layouts"
        tags.update(["tab-titles", "window-management", "automation"])
        return broad, sub, sub_sub, list(tags)

    # 9. Task & Project Management
    if any(k in desc or k in name or k in topics for k in ["task", "todo", "project", "board", "plus"]):
        broad = "Task & Project Management"
        sub = "Project Toolkits"
        sub_sub = "Quick Actions & Project Templates"
        tags.update(["projects", "tasks"])
        return broad, sub, sub_sub, list(tags)

    # Default: Developer Workflow & Utilities
    broad = "Developer Workflow & Utilities"
    sub = "Terminal Helpers"
    sub_sub = "Workflow Enhancements"
    tags.update(["developer-tools", "utilities"])
    return broad, sub, sub_sub, list(tags)
