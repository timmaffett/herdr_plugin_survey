import json
import os
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

REPOS_DIR = "repos"
os.makedirs(REPOS_DIR, exist_ok=True)

with open("top200_plugins.json") as f:
    plugins = json.load(f)

# Handle the earlier test clone
if os.path.exists("repos/oh-my-opencode-slim") and not os.path.exists("repos/alvinunreal__oh-my-opencode-slim"):
    os.rename("repos/oh-my-opencode-slim", "repos/alvinunreal__oh-my-opencode-slim")

def get_target_dir(fullName):
    clean_name = fullName.replace("/", "__")
    return os.path.join(REPOS_DIR, clean_name)

def clone_one(p):
    full_name = p["fullName"]
    target = get_target_dir(full_name)
    url = p["url"] + ".git"
    
    if os.path.exists(target) and os.path.isdir(os.path.join(target, ".git")):
        return {"name": full_name, "status": "cached", "duration": 0, "path": target}
    
    t0 = time.time()
    cmd = ["git", "clone", "--depth", "1", "--single-branch", url, target]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
        dur = round(time.time() - t0, 2)
        if res.returncode == 0:
            return {"name": full_name, "status": "success", "duration": dur, "path": target}
        else:
            return {"name": full_name, "status": "error", "duration": dur, "error": res.stderr.strip()[:200]}
    except subprocess.TimeoutExpired:
        return {"name": full_name, "status": "timeout", "duration": 90, "error": "Timeout after 90s"}
    except Exception as e:
        return {"name": full_name, "status": "exception", "duration": 0, "error": str(e)}

print(f"Starting shallow clone of {len(plugins)} repositories into '{REPOS_DIR}/'...")
t_start = time.time()

results = []
completed_count = 0

with ThreadPoolExecutor(max_workers=8) as pool:
    futures = {pool.submit(clone_one, p): p for p in plugins}
    for fut in as_completed(futures):
        res = fut.result()
        results.append(res)
        completed_count += 1
        if completed_count % 20 == 0 or completed_count == len(plugins):
            elapsed = round(time.time() - t_start, 1)
            successes = sum(1 for r in results if r["status"] in ("success", "cached"))
            print(f"Progress: {completed_count}/{len(plugins)} in {elapsed}s (Success: {successes})")

total_time = round(time.time() - t_start, 1)
success_count = sum(1 for r in results if r["status"] in ("success", "cached"))
error_count = len(results) - success_count

print(f"\nCompleted cloning in {total_time}s: {success_count} succeeded/cached, {error_count} failed.")

with open("clone_results.json", "w") as f:
    json.dump(results, f, indent=2)
