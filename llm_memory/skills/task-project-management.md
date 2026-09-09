# Architectural Memory: Task & Project Management

This document tracks architectural patterns and previously surveyed extensions within the **Task & Project Management** domain.

## Surveyed Extensions Ledger

### [2026-06-09] cloudmanic/herdr-plus
- **Overview**: `cloudmanic/herdr-plus` (`cloudmanic.herdr-plus`, v0.1.24, `min_herdr_version 0.7.0`) is a first-class Herdr plugin implemented as a single Go binary (~11k LOC). It adds two user-facing tools to Herdr: **Projects** — declarative TOML workspace templates that build a full workspace of tabs, split panes, and startup commands in one pick — and **Quick Actions** — a fuzzy launcher for one-off shell scripts run in the directory you launched from. A third, silent feature is **worktree auto-layout**, which populates a fresh worktree workspace from a matching layout file.
- **Key Features**: **Projects browser (`projects` / `projects-ui` / `open`):** Declarative templates in `projects/` (`name`, `description`, `working_dir` with `~`/`$VARS`/relative expansion, `group` for headings, ordere

