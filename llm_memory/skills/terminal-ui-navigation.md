# Architectural Memory: Terminal UI & Navigation

This document tracks architectural patterns and previously surveyed extensions within the **Terminal UI & Navigation** domain.

## Surveyed Extensions Ledger

### [2026-06-17] wyattjoh/herdr-plugin-gh-pr
- **Overview**: `wyattjoh/herdr-plugin-gh-pr` is a small, dependency-free Herdr plugin written in TypeScript for Bun (~1,737 LOC). Its sole job is to label the focused **agent pane's** sidebar row with the GitHub PR status for that pane's current git branch, in a compact form like `#123 ✓`.
- **Key Features**: **What the user sees:**  * Persistent sidebar token `#<number> <symbol>` on the focused agent pane, where the symbol encodes CI/state: `✓` pass, `✗` fail, `●` pending, `◆` merged, `⊘` closed, no symbo

