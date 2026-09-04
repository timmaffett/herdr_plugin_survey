#!/usr/bin/env python3
"""
Surveys all 903 Herdr community plugins for:
1. Herdr Raw Socket API usage (connecting directly to HERDR_SOCKET_PATH / Unix domain socket).
2. Agent Skill Integration layer (SKILL.md files, skills/ directories, herdr --skill, herdr-agent-state, cli:integration).
Updates `plugins.db` with columns:
  - uses_raw_socket (INTEGER)
  - raw_socket_details (TEXT)
  - uses_agent_skills (INTEGER)
  - agent_skills_details (TEXT)
"""

import os, sys, glob, re, json, sqlite3
from concurrent.futures import ProcessPoolExecutor

DB_PATH = "plugins.db"
REPOS_DIR = "repos"

# Patterns for Raw Socket API detection
RAW_SOCKET_CONNECT_REGEX = re.compile(
    r"(?:net\.createConnection|net\.connect|UnixStream::connect|UnixStream|AF_UNIX|net\.Dial\(\"unix\"|std::os::unix::net|fs\.createWriteStream.*sock|socket\.connect|ipcRenderer\.send.*socket|createSocketConnection)",
    re.IGNORECASE
)

RAW_SOCKET_PROTOCOL_REGEX = re.compile(
    r"(?:HERDR_SOCKET_PATH|\.sock|herdr\.sock)",
    re.IGNORECASE
)

# Patterns for Agent Skill Integration detection
SKILL_CMD_REGEX = re.compile(
    r"(?:herdr\s+--skill|herdr\s+integration|cli:integration|integration\.install|\.claude/skills|\.opencode/skills|skills/herdr|agent-state\.ts|agent-state\.sh|herdr-agent-state|\/skills|AgentSkill|skill_manifest)",
    re.IGNORECASE
)

def inspect_plugin(repo_dir):
    repo_name = os.path.basename(repo_dir)
    full_name = repo_name.replace("__", "/", 1)

    uses_raw_socket = 0
    raw_socket_reasons = []

    uses_agent_skills = 0
    skill_reasons = []

    # 1. Check directory & file tree
    for root, dirs, files in os.walk(repo_dir):
        # Skip noise directories
        for skip in [".git", "node_modules", "dist", "build", "target", "vendor", "__pycache__", ".next"]:
            if skip in dirs:
                dirs.remove(skip)

        rel_root = os.path.relpath(root, repo_dir)
        lower_root = rel_root.lower()

        # Check for skills directory
        if "skill" in lower_root and not lower_root.startswith("."):
            if not uses_agent_skills:
                uses_agent_skills = 1
                skill_reasons.append(f"Directory: {rel_root}")

        for f in files:
            lower_f = f.lower()
            rel_file = os.path.relpath(os.path.join(root, f), repo_dir)

            # Check for SKILL.md or skills config
            if lower_f in ("skill.md", "skills.json", "skills.yaml", "skills.yml") or lower_f.endswith(".skill.md"):
                uses_agent_skills = 1
                skill_reasons.append(f"Skill file: {rel_file}")

            # Check for agent state hook scripts
            if "herdr-agent-state" in lower_f or "agent-state" in lower_f:
                uses_agent_skills = 1
                skill_reasons.append(f"Agent state hook: {rel_file}")

            # Check relevant source files for raw socket and skill integration
            if f.endswith((".ts", ".js", ".mjs", ".cjs", ".py", ".rs", ".go", ".sh", ".bash", ".toml", ".json", ".md")):
                filepath = os.path.join(root, f)
                try:
                    with open(filepath, "r", errors="ignore") as fo:
                        text = fo.read(256 * 1024) # read up to 256KB per file

                        # Raw Socket Detection
                        if "HERDR_SOCKET_PATH" in text:
                            # Does it actually connect to the socket, or just reference it?
                            if RAW_SOCKET_CONNECT_REGEX.search(text):
                                uses_raw_socket = 1
                                raw_socket_reasons.append(f"Unix socket connect in {rel_file}")
                            elif "createConnection" in text or "connect" in text or "send" in text:
                                uses_raw_socket = 1
                                raw_socket_reasons.append(f"Socket transport in {rel_file}")
                            else:
                                # Direct socket env access
                                uses_raw_socket = 1
                                raw_socket_reasons.append(f"HERDR_SOCKET_PATH in {rel_file}")

                        elif "herdr.sock" in text and RAW_SOCKET_CONNECT_REGEX.search(text):
                            uses_raw_socket = 1
                            raw_socket_reasons.append(f"Socket path connect in {rel_file}")

                        # Agent Skill Integration Detection
                        m_skill = SKILL_CMD_REGEX.search(text)
                        if m_skill:
                            uses_agent_skills = 1
                            if len(skill_reasons) < 3:
                                skill_reasons.append(f"{m_skill.group(0)} in {rel_file}")

                except Exception:
                    pass

    # Deduplicate and format reasons
    raw_socket_details = "; ".join(list(dict.fromkeys(raw_socket_reasons))[:4]) if raw_socket_reasons else "None (CLI/Standard IPC only)"
    agent_skills_details = "; ".join(list(dict.fromkeys(skill_reasons))[:4]) if skill_reasons else "None (Independent of agent skills)"

    return {
        "repo_name": repo_name,
        "full_name": full_name,
        "uses_raw_socket": uses_raw_socket,
        "raw_socket_details": raw_socket_details,
        "uses_agent_skills": uses_agent_skills,
        "agent_skills_details": agent_skills_details
    }

def main():
    repos = [
        os.path.join(REPOS_DIR, d) 
        for d in os.listdir(REPOS_DIR) 
        if os.path.isdir(os.path.join(REPOS_DIR, d)) and not d.endswith("herdrdev__herdr")
    ]
    print(f"Starting multi-core scan of {len(repos)} repositories for Raw Socket & Agent Skills...")

    with ProcessPoolExecutor(max_workers=16) as executor:
        results = list(executor.map(inspect_plugin, repos))

    print(f"Completed analysis of {len(results)} plugins.")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Ensure columns exist in plugins table
    cursor.execute("PRAGMA table_info(plugins);")
    cols = [r[1] for r in cursor.fetchall()]

    new_cols = [
        ("uses_raw_socket", "INTEGER DEFAULT 0"),
        ("raw_socket_details", "TEXT DEFAULT 'None (CLI/Standard IPC only)'"),
        ("uses_agent_skills", "INTEGER DEFAULT 0"),
        ("agent_skills_details", "TEXT DEFAULT 'None (Independent of agent skills)'")
    ]

    for col_name, col_def in new_cols:
        if col_name not in cols:
            print(f"Adding column {col_name} to plugins table...")
            cursor.execute(f"ALTER TABLE plugins ADD COLUMN {col_name} {col_def};")

    # Update database records
    raw_sock_count = 0
    skills_count = 0

    for r in results:
        if r["uses_raw_socket"]: raw_sock_count += 1
        if r["uses_agent_skills"]: skills_count += 1

        cursor.execute("""
            UPDATE plugins
            SET uses_raw_socket = ?,
                raw_socket_details = ?,
                uses_agent_skills = ?,
                agent_skills_details = ?
            WHERE repo_full_name = ?;
        """, (r["uses_raw_socket"], r["raw_socket_details"], r["uses_agent_skills"], r["agent_skills_details"], r["full_name"]))

    conn.commit()

    print("\n" + "="*60)
    print("SURVEY RESULTS SUMMARY:")
    print("="*60)
    print(f"Total Plugins Scanned:               {len(results)}")
    print(f"Plugins Using Herdr Raw Socket API:  {raw_sock_count} ({round((raw_sock_count/len(results))*100, 1)}%)")
    print(f"Plugins Using Agent Skills Layer:    {skills_count} ({round((skills_count/len(results))*100, 1)}%)")
    print("="*60)

    # Show top raw socket plugins
    cursor.execute("""
        SELECT repo_full_name, stars, raw_socket_details 
        FROM plugins WHERE uses_raw_socket = 1 
        ORDER BY stars DESC LIMIT 5;
    """)
    print("\nTop Plugins using Herdr Raw Socket API:")
    for row in cursor.fetchall():
        print(f" - {row[0]} (★ {row[1]}): {row[2]}")

    # Show top agent skill plugins
    cursor.execute("""
        SELECT repo_full_name, stars, agent_skills_details 
        FROM plugins WHERE uses_agent_skills = 1 
        ORDER BY stars DESC LIMIT 5;
    """)
    print("\nTop Plugins using Agent Skill Integration Layer:")
    for row in cursor.fetchall():
        print(f" - {row[0]} (★ {row[1]}): {row[2]}")

    conn.close()

if __name__ == "__main__":
    main()
