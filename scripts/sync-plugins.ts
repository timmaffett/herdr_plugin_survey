/**
 * Herdr Plugins Sync & Staleness Checker (TypeScript)
 * Inspects plugins.db for out-of-date plugins, tracks commit hashes,
 * and updates stars, forks, and trending metrics from live data.
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as https from 'https';

export interface PluginStalenessRecord {
  id: number;
  repo_full_name: string;
  surveyed_version: string;
  surveyed_commit_hash: string;
  surveyed_commit_date: string;
  upstream_head_commit: string;
  upstream_pushed_at: string;
  is_out_of_date: number;
}

export interface LivePluginMetadata {
  id: number;
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  starsDelta7d?: number;
  headCommit?: string;
  pushedAt?: string;
}

export class HerdrPluginSync {
  private dbPath: string;

  constructor(dbPath: string = path.resolve(__dirname, '../plugins.db')) {
    this.dbPath = dbPath;
  }

  private query(sql: string): any[] {
    const escaped = sql.replace(/"/g, '""');
    const cmd = `sqlite3 -json "${this.dbPath}" "${escaped}"`;
    const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });
    if (!out || !out.trim()) return [];
    return JSON.parse(out);
  }

  private execute(sql: string): void {
    const escaped = sql.replace(/"/g, '""');
    const cmd = `sqlite3 "${this.dbPath}" "${escaped}"`;
    execSync(cmd);
  }

  /**
   * Returns all plugins that are out of date compared to their recorded upstream commits.
   */
  public checkStaleness(): { total: number; outdatedCount: number; outdated: PluginStalenessRecord[] } {
    const rows: PluginStalenessRecord[] = this.query(`
      SELECT id, repo_full_name, surveyed_version, surveyed_commit_hash, 
             surveyed_commit_date, upstream_head_commit, upstream_pushed_at, is_out_of_date
      FROM plugins
      ORDER BY is_out_of_date DESC, stars DESC;
    `);

    const outdated = rows.filter(r => r.is_out_of_date === 1);
    return {
      total: rows.length,
      outdatedCount: outdated.length,
      outdated
    };
  }

  /**
   * Fetches latest marketplace JSON from https://assets.herdr.dev/plugins/index.json
   */
  public async fetchMarketplaceData(): Promise<LivePluginMetadata[]> {
    try {
      const jsonStr = execSync('curl -sL https://assets.herdr.dev/plugins/index.json', { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.plugins) && data.plugins.length > 0) {
        return data.plugins;
      }
    } catch (e) {
      console.warn('[Sync] Primary assets.herdr.dev/plugins/index.json failed, trying fallback...');
    }

    const html = execSync('curl -sL https://herdr.dev/plugins/', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    const match = html.match(/const initialData = (\{.*?\});/);
    if (!match) throw new Error('Failed to find marketplace data on herdr.dev/plugins/');
    const data = JSON.parse(match[1]);
    return data.plugins || [];
  }

  /**
   * Updates stars, forks, issues, and trending deltas in plugins.db without re-cloning.
   */
  public async updateStats(): Promise<number> {
    console.log('[Sync] Fetching live marketplace metadata...');
    const plugins = await this.fetchMarketplaceData();
    let updated = 0;
    const now = new Date().toISOString();

    for (const p of plugins) {
      if (!p.fullName) continue;
      const stars = p.stars || 0;
      const forks = p.forks || 0;
      const issues = p.openIssues || 0;
      const delta7 = p.starsDelta7d || 0;
      const popScore = (stars * 1.0 + forks * 2.5 + delta7 * 1.5).toFixed(2);
      const isTrending = delta7 > 5 ? 1 : 0;
      const uHash = p.headCommit || '';
      const uPushed = p.pushedAt || '';

      const sql = `
        UPDATE plugins SET
          stars = ${stars},
          forks = ${forks},
          open_issues = ${issues},
          stars_delta_7d = ${delta7},
          popularity_score = ${popScore},
          is_trending_weekly = ${isTrending},
          upstream_head_commit = '${uHash}',
          upstream_pushed_at = '${uPushed}',
          is_out_of_date = CASE 
            WHEN surveyed_commit_hash != '' AND '${uHash}' != '' AND surveyed_commit_hash != '${uHash}' THEN 1
            ELSE 0
          END,
          last_synced_at = '${now}'
        WHERE repo_full_name = '${p.fullName}';
      `;
      try {
        this.execute(sql);
        updated++;
      } catch (err) {
        // Skip individual SQL escaping edge cases
      }
    }

    console.log(`[Sync] Successfully updated statistics for ${updated} plugins.`);
    return updated;
  }
}

// CLI runner if executed directly
if (require.main === module) {
  const sync = new HerdrPluginSync();
  const arg = process.argv[2] || '--check';

  if (arg === '--update') {
    sync.updateStats().then(cnt => {
      console.log(`Finished updating ${cnt} plugins.`);
    }).catch(console.error);
  } else {
    const report = sync.checkStaleness();
    console.log(`\n============================================================`);
    console.log(`STALENESS REPORT: ${report.outdatedCount} / ${report.total} plugins out of date`);
    console.log(`============================================================`);
    if (report.outdatedCount > 0) {
      report.outdated.slice(0, 15).forEach(p => {
        console.log(` - ${p.repo_full_name.padEnd(35)} (Surveyed: ${p.surveyed_commit_hash.slice(0, 7)} -> Upstream: ${p.upstream_head_commit.slice(0, 7)})`);
      });
      if (report.outdatedCount > 15) {
        console.log(`   ... and ${report.outdatedCount - 15} more`);
      }
    } else {
      console.log('All surveyed commit hashes match upstream HEAD.');
    }
  }
}
