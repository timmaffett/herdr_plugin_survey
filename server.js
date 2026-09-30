/**
 * Herdr Plugins Survey - Interactive Explorer & Historical Growth Server
 * Full Ecosystem Index (All 994 Community Plugins across 977 Repositories) + 36-Week Growth Timelines + Remote Infra Intelligence.
 */

const express = require('express');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.resolve(__dirname, 'plugins.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function queryDb(sql) {
  try {
    const output = execFileSync('sqlite3', ['-json', DB_PATH, sql], {
      maxBuffer: 35 * 1024 * 1024,
      encoding: 'utf8'
    });
    if (!output || !output.trim()) return [];
    return JSON.parse(output);
  } catch (err) {
    throw new Error(err.stderr || err.message);
  }
}

app.get('/api/stats', (req, res) => {
  try {
    const totalRow = queryDb("SELECT COUNT(*) as count, SUM(total_loc) as total_loc, SUM(stars) as total_stars, SUM(forks) as total_forks, SUM(CASE WHEN manifest_raw_json IS NOT NULL AND json_valid(manifest_raw_json) THEN json_array_length(manifest_raw_json) ELSE 1 END) as total_manifests FROM plugins;")[0];
    const latestReport = queryDb("SELECT cumulative_plugins_count, cumulative_stars_count, cumulative_forks_count FROM daily_reports ORDER BY report_date DESC LIMIT 1;")[0];
    const categories = queryDb("SELECT broad_category, COUNT(*) as cnt FROM plugins GROUP BY broad_category ORDER BY cnt DESC;");
    const languages = queryDb("SELECT primary_language, COUNT(*) as cnt, SUM(total_loc) as loc FROM plugins GROUP BY primary_language ORDER BY cnt DESC;");
    const features = queryDb(`
      SELECT 
        SUM(adds_communications) as comms,
        SUM(presents_tui) as tui,
        SUM(interfaces_mobile) as mobile,
        SUM(uses_web_display) as web,
        SUM(git_worktree_aware) as worktree,
        SUM(uses_ai_model_directly) as direct_ai,
        SUM(mcp_support) as mcp,
        SUM(is_token_optimizer) as token_opt,
        SUM(is_quota_manager) as quota_mgr,
        SUM(has_modal_popup) as modal_popup,
        SUM(has_startup_hook) as startup_hook,
        SUM(has_build_steps) as build_steps,
        SUM(is_cross_platform) as cross_platform,
        SUM(has_tests) as tests,
        SUM(has_ci_workflows) as ci,
        SUM(is_out_of_date) as outdated,
        SUM(uses_ssh) as ssh,
        SUM(uses_mosh) as mosh,
        SUM(uses_vpn_tailscale) as vpn,
        SUM(mentions_port_mapping) as port_mapping,
        SUM(mentions_router_setup) as router,
        SUM(mentions_vps_gateway) as vps,
        SUM(requires_remote_infra) as remote_infra,
        SUM(uses_raw_socket) as raw_socket,
        SUM(uses_agent_skills) as agent_skills
      FROM plugins;
    `)[0];
    const agents = queryDb("SELECT agent_name, COUNT(*) as cnt FROM plugin_agents GROUP BY agent_name ORDER BY cnt DESC;");
    const topEndpoints = queryDb(`
      SELECT e.endpoint, e.endpoint_type, e.category, e.doc_url, COALESCE(pe.cnt, 0) as cnt 
      FROM herdr_official_endpoints e
      LEFT JOIN (
        SELECT endpoint, COUNT(DISTINCT plugin_id) as cnt 
        FROM plugin_endpoints 
        GROUP BY endpoint
      ) pe ON e.endpoint = pe.endpoint
      ORDER BY cnt DESC, e.endpoint ASC 
      LIMIT 20;
    `);

    const allEndpoints = queryDb(`
      SELECT e.endpoint, e.endpoint_type, e.category, e.doc_url, COALESCE(pe.cnt, 0) as cnt 
      FROM herdr_official_endpoints e
      LEFT JOIN (
        SELECT endpoint, COUNT(DISTINCT plugin_id) as cnt 
        FROM plugin_endpoints 
        GROUP BY endpoint
      ) pe ON e.endpoint = pe.endpoint
      ORDER BY cnt DESC, e.endpoint ASC;
    `);

    const endpointsSummary = queryDb(`
      SELECT 
        COUNT(e.endpoint) as total,
        SUM(CASE WHEN pe.cnt > 0 THEN 1 ELSE 0 END) as used_count,
        SUM(CASE WHEN pe.cnt IS NULL OR pe.cnt = 0 THEN 1 ELSE 0 END) as zero_count
      FROM herdr_official_endpoints e
      LEFT JOIN (
        SELECT endpoint, COUNT(DISTINCT plugin_id) as cnt 
        FROM plugin_endpoints 
        GROUP BY endpoint
      ) pe ON e.endpoint = pe.endpoint;
    `)[0];

    const tunnels = queryDb("SELECT tunnel_service, COUNT(*) as cnt FROM plugins WHERE tunnel_service != 'none' GROUP BY tunnel_service ORDER BY cnt DESC;");

    const totalPlugins = totalRow.total_manifests || (latestReport ? latestReport.cumulative_plugins_count : totalRow.count);
    const totalStars = totalRow.total_stars || (latestReport ? latestReport.cumulative_stars_count : 0);
    const totalForks = totalRow.total_forks || (latestReport ? latestReport.cumulative_forks_count : 0);

    res.json({
      total_plugins: totalPlugins,
      total_repos: totalRow.count,
      total_loc: totalRow.total_loc,
      total_stars: totalStars,
      total_forks: totalForks,
      categories,
      languages,
      features,
      agents,
      top_endpoints: topEndpoints,
      all_endpoints: allEndpoints,
      endpoints_summary: endpointsSummary,
      tunnels
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/plugins', (req, res) => {
  try {
    const { 
      q, category, language, agent, 
      tui, mobile, web, comms, worktree, 
      cross_platform, tests, trending, outdated,
      ssh, mosh, vpn, port_mapping, router, vps, remote_infra,
      raw_socket, agent_skills, ai_surveyed, surveyed,
      endpoint, tunnel, sort = 'popularity', order = 'desc', 
      limit = 1000, offset = 0 
    } = req.query;

    let whereClauses = [];

    if (q) {
      const cleanQ = q.replace(/'/g, "''");
      whereClauses.push(`(
        repo_full_name LIKE '%${cleanQ}%' OR 
        description LIKE '%${cleanQ}%' OR 
        broad_category LIKE '%${cleanQ}%' OR 
        sub_category LIKE '%${cleanQ}%' OR 
        sub_sub_category LIKE '%${cleanQ}%' OR
        topics LIKE '%${cleanQ}%' OR
        readme_summary LIKE '%${cleanQ}%' OR
        remote_infra_details LIKE '%${cleanQ}%'
      )`);
    }

    if (category) {
      const cleanCat = category.replace(/'/g, "''");
      whereClauses.push(`broad_category = '${cleanCat}'`);
    }

    if (language) {
      const cleanLang = language.replace(/'/g, "''");
      whereClauses.push(`primary_language = '${cleanLang}'`);
    }

    if (agent) {
      const cleanAgent = agent.replace(/'/g, "''");
      whereClauses.push(`id IN (SELECT plugin_id FROM plugin_agents WHERE agent_name = '${cleanAgent}')`);
    }

    if (endpoint) {
      const cleanEp = endpoint.replace(/'/g, "''");
      whereClauses.push(`id IN (SELECT plugin_id FROM plugin_endpoints WHERE endpoint = '${cleanEp}')`);
    }

    if (tunnel) {
      const cleanTunnel = tunnel.replace(/'/g, "''");
      whereClauses.push(`tunnel_service = '${cleanTunnel}'`);
    }

    if (ai_surveyed === 'true' || surveyed === 'true') {
      whereClauses.push(`id IN (SELECT plugin_id FROM plugin_llm_evaluations)`);
    }

    if (tui !== undefined && tui !== '') whereClauses.push(`presents_tui = ${Number(tui)}`);
    if (mobile !== undefined && mobile !== '') whereClauses.push(`interfaces_mobile = ${Number(mobile)}`);
    if (web !== undefined && web !== '') whereClauses.push(`uses_web_display = ${Number(web)}`);
    if (comms !== undefined && comms !== '') whereClauses.push(`adds_communications = ${Number(comms)}`);
    if (worktree !== undefined && worktree !== '') whereClauses.push(`git_worktree_aware = ${Number(worktree)}`);
    if (cross_platform !== undefined && cross_platform !== '') whereClauses.push(`is_cross_platform = ${Number(cross_platform)}`);
    if (tests !== undefined && tests !== '') whereClauses.push(`has_tests = ${Number(tests)}`);
    if (trending !== undefined && trending !== '') whereClauses.push(`is_trending_weekly = ${Number(trending)}`);
    if (outdated !== undefined && outdated !== '') whereClauses.push(`is_out_of_date = ${Number(outdated)}`);

    // Remote infrastructure filters
    if (ssh !== undefined && ssh !== '') whereClauses.push(`uses_ssh = ${Number(ssh)}`);
    if (mosh !== undefined && mosh !== '') whereClauses.push(`uses_mosh = ${Number(mosh)}`);
    if (vpn !== undefined && vpn !== '') whereClauses.push(`uses_vpn_tailscale = ${Number(vpn)}`);
    if (port_mapping !== undefined && port_mapping !== '') whereClauses.push(`mentions_port_mapping = ${Number(port_mapping)}`);
    if (router !== undefined && router !== '') whereClauses.push(`mentions_router_setup = ${Number(router)}`);
    if (vps !== undefined && vps !== '') whereClauses.push(`mentions_vps_gateway = ${Number(vps)}`);
    if (remote_infra !== undefined && remote_infra !== '') whereClauses.push(`requires_remote_infra = ${Number(remote_infra)}`);
    if (raw_socket !== undefined && raw_socket !== '') whereClauses.push(`uses_raw_socket = ${Number(raw_socket)}`);
    if (agent_skills !== undefined && agent_skills !== '') whereClauses.push(`uses_agent_skills = ${Number(agent_skills)}`);

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const allowedSorts = {
      popularity: 'popularity_score',
      stars: 'stars',
      forks: 'forks',
      trending: 'stars_delta_7d',
      loc: 'total_loc',
      files: 'total_files',
      name: 'repo_name',
      updated: 'pushed_at'
    };
    const sortCol = allowedSorts[sort] || 'popularity_score';
    const sortDir = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const countSql = `SELECT COUNT(*) as total FROM plugins ${whereSql};`;
    const totalCount = queryDb(countSql)[0]?.total || 0;

    const selectSql = `
      SELECT 
        id, repo_full_name, repo_name, repo_owner, repo_url, 
        stars, forks, open_issues, stars_delta_7d, popularity_score, is_trending_weekly,
        surveyed_commit_hash, surveyed_commit_date, surveyed_version,
        upstream_head_commit, upstream_pushed_at, is_out_of_date, last_synced_at,
        primary_language, total_files, total_loc, contributors_count,
        has_tests, has_ci_workflows, is_cross_platform,
        manifest_id, manifest_version, min_herdr_version,
        broad_category, sub_category, sub_sub_category, category_tags,
        adds_communications, presents_tui, interfaces_mobile, uses_web_display,
        uses_ai_model_directly, git_worktree_aware,
        tunnel_service, network_protocol, auth_strategy, integrates_editor,
        is_token_optimizer, is_quota_manager, mcp_support,
        uses_ssh, uses_mosh, uses_vpn_tailscale, mentions_port_mapping,
        mentions_router_setup, mentions_vps_gateway, requires_remote_infra, remote_infra_details,
        uses_raw_socket, raw_socket_details, uses_agent_skills, agent_skills_details,
        agent_scope, supported_agents, agent_data_collection, agent_data_details,
        herdr_socket_methods, herdr_cli_commands,
        description, readme_summary, pushed_at,
        (SELECT COUNT(1) FROM plugin_llm_evaluations e WHERE e.plugin_id = plugins.id) as has_llm_eval
      FROM plugins
      ${whereSql}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT ${Math.min(Number(limit), 1000)} OFFSET ${Number(offset)};
    `;

    const plugins = queryDb(selectSql);
    res.json({ total: totalCount, count: plugins.length, plugins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/history - Historical timeline series for multi-line growth graph + Trending Velocity

// GET /api/releases - Number of plugins released per week + cumulative total by week
app.get('/api/releases', (req, res) => {
  try {
    const summaryPath = path.join(__dirname, 'all_plugins.json');
    const plugins = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    
    // 36 weeks from 2026-01-04 to 2026-09-06
    const weeks = [
      "2026-01-04", "2026-01-11", "2026-01-18", "2026-01-25",
      "2026-02-01", "2026-02-08", "2026-02-15", "2026-02-22",
      "2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29",
      "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26",
      "2026-05-03", "2026-05-10", "2026-05-17", "2026-05-24", "2026-05-31",
      "2026-06-07", "2026-06-14", "2026-06-21", "2026-06-28",
      "2026-07-05", "2026-07-12", "2026-07-19", "2026-07-26",
      "2026-08-02", "2026-08-09", "2026-08-16", "2026-08-23", "2026-08-30",
      "2026-09-06"
    ];

    const createdDates = plugins.map(p => (p.createdAt || "2026-01-01").slice(0, 10)).sort();

    const weeklyNew = [];
    const cumulativeTotal = [];
    let cum = 0;

    for (let i = 0; i < weeks.length; i++) {
      const w = weeks[i];
      const prevW = (i > 0) ? weeks[i - 1] : "2025-12-01";
      const cnt = createdDates.filter(d => d > prevW && d <= w).length;
      cum += cnt;
      weeklyNew.push(cnt);
      cumulativeTotal.push(cum);
    }

    res.json({
      weeks,
      weekly_new: weeklyNew,
      cumulative_total: cumulativeTotal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history', (req, res) => {
  try {
    const {
      metric = 'stars',
      limit = 50,
      skip = 0,
      include_core = '0',
      q, category, language, agent,
      tui, mobile, web, comms, worktree,
      cross_platform, tests, trending, outdated,
      ssh, mosh, vpn, port_mapping, router, vps, remote_infra,
      raw_socket, agent_skills
    } = req.query;

    const allowedMetrics = {
      stars: 'stars_cumulative',
      velocity: 'stars_cumulative',
      commits: 'commits_cumulative',
      commit_velocity: 'commits_cumulative',
      forks: 'forks_cumulative',
      issues: 'issues_cumulative',
      downloads: 'downloads_cumulative'
    };
    const metricCol = allowedMetrics[metric] || 'stars_cumulative';

    let whereClauses = [];
    if (q) {
      const cleanQ = q.replace(/'/g, "''");
      whereClauses.push(`(p.repo_full_name LIKE '%${cleanQ}%' OR p.description LIKE '%${cleanQ}%' OR p.broad_category LIKE '%${cleanQ}%')`);
    }
    if (category) {
      const cleanCat = category.replace(/'/g, "''");
      whereClauses.push(`p.broad_category = '${cleanCat}'`);
    }
    if (language) {
      const cleanLang = language.replace(/'/g, "''");
      whereClauses.push(`p.primary_language = '${cleanLang}'`);
    }
    if (agent) {
      const cleanAgent = agent.replace(/'/g, "''");
      whereClauses.push(`p.id IN (SELECT plugin_id FROM plugin_agents WHERE agent_name = '${cleanAgent}')`);
    }
    if (tui !== undefined && tui !== '') whereClauses.push(`p.presents_tui = ${Number(tui)}`);
    if (mobile !== undefined && mobile !== '') whereClauses.push(`p.interfaces_mobile = ${Number(mobile)}`);
    if (web !== undefined && web !== '') whereClauses.push(`p.uses_web_display = ${Number(web)}`);
    if (comms !== undefined && comms !== '') whereClauses.push(`p.adds_communications = ${Number(comms)}`);
    if (worktree !== undefined && worktree !== '') whereClauses.push(`p.git_worktree_aware = ${Number(worktree)}`);
    if (cross_platform !== undefined && cross_platform !== '') whereClauses.push(`p.is_cross_platform = ${Number(cross_platform)}`);
    if (tests !== undefined && tests !== '') whereClauses.push(`p.has_tests = ${Number(tests)}`);
    if (trending !== undefined && trending !== '') whereClauses.push(`p.is_trending_weekly = ${Number(trending)}`);
    if (outdated !== undefined && outdated !== '') whereClauses.push(`p.is_out_of_date = ${Number(outdated)}`);

    // Infrastructure filters
    if (ssh !== undefined && ssh !== '') whereClauses.push(`p.uses_ssh = ${Number(ssh)}`);
    if (mosh !== undefined && mosh !== '') whereClauses.push(`p.uses_mosh = ${Number(mosh)}`);
    if (vpn !== undefined && vpn !== '') whereClauses.push(`p.uses_vpn_tailscale = ${Number(vpn)}`);
    if (port_mapping !== undefined && port_mapping !== '') whereClauses.push(`p.mentions_port_mapping = ${Number(port_mapping)}`);
    if (router !== undefined && router !== '') whereClauses.push(`p.mentions_router_setup = ${Number(router)}`);
    if (vps !== undefined && vps !== '') whereClauses.push(`p.mentions_vps_gateway = ${Number(vps)}`);
    if (remote_infra !== undefined && remote_infra !== '') whereClauses.push(`p.requires_remote_infra = ${Number(remote_infra)}`);
    if (raw_socket !== undefined && raw_socket !== '') whereClauses.push(`p.uses_raw_socket = ${Number(raw_socket)}`);
    if (agent_skills !== undefined && agent_skills !== '') whereClauses.push(`p.uses_agent_skills = ${Number(agent_skills)}`);

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const seriesLimit = Math.min(Math.max(Number(limit) || 50, 1), 2000);

    // 1. Get ordered list of matching plugins
    const sortOrderCol = (metric === 'commits' || metric === 'commit_velocity') ? 'p.total_loc' : 
                         ((metric === 'velocity') ? 'p.stars_delta_7d' : 
                         ((metric === 'forks') ? 'p.forks' : 'p.stars'));
    const pluginsSql = `
      SELECT p.id, p.repo_full_name, p.repo_owner, p.repo_name, p.primary_language, p.broad_category, 
             p.stars, p.forks, p.open_issues, p.stars_delta_7d, p.repo_url, p.description,
             p.uses_raw_socket, p.raw_socket_details, p.uses_agent_skills, p.agent_skills_details,
             p.remote_infra_details, p.supported_agents
      FROM plugins p
      ${whereSql}
      ORDER BY ${sortOrderCol} DESC
      LIMIT ${seriesLimit} OFFSET ${Math.max(0, Number(skip) || 0)};
    `;
    const matchedPlugins = queryDb(pluginsSql);

    if (matchedPlugins.length === 0) {
      return res.json({ metric, weeks: [], series: [] });
    }

    const pluginIds = matchedPlugins.map(p => p.id);
    const inClause = pluginIds.join(',');

    // 2. Query history data for these plugins
    const historySql = `
      SELECT plugin_id, week_date, ${metricCol} as val
      FROM plugin_history
      WHERE plugin_id IN (${inClause})
      ORDER BY week_date ASC;
    `;
    const histRows = queryDb(historySql);

    const weeksSet = new Set();
    const map = {};
    pluginIds.forEach(id => { map[id] = {}; });

    histRows.forEach(r => {
      weeksSet.add(r.week_date);
      if (map[r.plugin_id]) {
        map[r.plugin_id][r.week_date] = r.val;
      }
    });

    const sortedWeeks = Array.from(weeksSet).sort();

    // 3. Build series with rainbow hues
    const totalSeries = matchedPlugins.length;
    const series = matchedPlugins.map((p, idx) => {
      const hue = Math.round((idx * 360) / Math.max(totalSeries, 1));
      const color = `hsl(${hue}, 80%, 55%)`;

      let dataPoints = sortedWeeks.map(w => {
        return (map[p.id] && map[p.id][w] !== undefined) ? map[p.id][w] : 0;
      });

      // If velocity requested, compute weekly rate of change (delta per week)
      if (metric === 'velocity' || metric === 'commit_velocity') {
        const vel = [];
        for (let i = 0; i < dataPoints.length; i++) {
          vel.push(i === 0 ? dataPoints[0] : Math.max(0, dataPoints[i] - dataPoints[i - 1]));
        }
        dataPoints = vel;
      }

      let agentsList = [];
      try { agentsList = JSON.parse(p.supported_agents || '[]'); } catch (e) {}

      return {
        id: p.id,
        name: p.repo_full_name,
        owner: p.repo_owner,
        repo: p.repo_name,
        url: p.repo_url || `https://github.com/${p.repo_full_name}`,
        language: p.primary_language,
        category: p.broad_category,
        stars: p.stars || 0,
        forks: p.forks || 0,
        agents: agentsList,
        infra: p.remote_infra_details || 'None required (Local only)',
        uses_raw_socket: p.uses_raw_socket,
        raw_socket_details: p.raw_socket_details,
        uses_agent_skills: p.uses_agent_skills,
        agent_skills_details: p.agent_skills_details,
        description: p.description || '',
        color,
        current_value: dataPoints[dataPoints.length - 1] || 0,
        data: dataPoints
      };
    });

    // Optionally overlay Herdr core benchmark
    if (include_core === '1' || include_core === 'true') {
      const corePath = path.join(__dirname, 'herdr_core_history.json');
      if (fs.existsSync(corePath)) {
        const coreInfo = JSON.parse(fs.readFileSync(corePath, 'utf8'));
        let coreSeriesData = coreInfo[metric] || coreInfo.stars || [];
        if (metric === 'velocity' && coreInfo.velocity) {
          coreSeriesData = coreInfo.velocity;
        }
        series.unshift({
          id: 0,
          name: "🐑 herdrdev/herdr (Core)",
          owner: "herdrdev",
          repo: "herdr",
          url: "https://github.com/herdrdev/herdr",
          language: "Rust",
          category: "Herdr Terminal Multiplexer Core",
          stars: 34953,
          forks: 2555,
          agents: ["Claude Code", "OpenCode", "Codex", "Amp", "Cursor"],
          infra: "Multiplexer Core Host",
          description: "Core Herdr Terminal Multiplexer & Multi-Agent Workspace Platform",
          color: "#cba6f7",
          is_core: true,
          current_value: coreSeriesData[coreSeriesData.length - 1] || 34953,
          data: coreSeriesData
        });
      }
    }

    res.json({
      metric,
      weeks: sortedWeeks,
      series_count: series.length,
      series
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/plugins/:id', (req, res) => {
  try {
    const pluginId = Number(req.params.id);
    const plugins = queryDb(`SELECT * FROM plugins WHERE id = ${pluginId};`);
    if (!plugins || plugins.length === 0) {
      return res.status(404).json({ error: 'Plugin not found' });
    }
    const plugin = plugins[0];
    
    const endpoints = queryDb(`SELECT endpoint, source_type FROM plugin_endpoints WHERE plugin_id = ${pluginId};`);
    const agents = queryDb(`SELECT agent_name, collection_methods FROM plugin_agents WHERE plugin_id = ${pluginId};`);
    const manifestItems = queryDb(`SELECT item_type, item_id, title, placement, command FROM plugin_manifest_items WHERE plugin_id = ${pluginId};`);

    const cleanRepo = (plugin.repo_full_name || '').replace(/'/g, "''");
    const llmEvals = queryDb(`SELECT * FROM plugin_llm_evaluations WHERE plugin_id = ${pluginId} OR repo_full_name = '${cleanRepo}' ORDER BY report_date DESC LIMIT 1;`);

    res.json({
      ...plugin,
      endpoints,
      agents,
      manifest_items: manifestItems,
      llm_evaluation: (llmEvals && llmEvals.length > 0) ? llmEvals[0] : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/daily-reports', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '7', 10), 30);
    const beforeDate = req.query.before_date;
    const afterDate = req.query.after_date;
    const specificDate = req.query.date;
    const breakthroughsOnly = req.query.breakthroughs_only === 'true' || req.query.breakthroughs_only === '1';
    const herdrNewsOnly = req.query.herdr_news_only === 'true' || req.query.herdr_news_only === '1' || req.query.herdr_news === 'true' || req.query.herdr_news === '1';
    const agentDetectionOnly = req.query.agent_detection_only === 'true' || req.query.agent_detection_only === '1' || req.query.agent_only === 'true';
    const search = (req.query.search || '').trim().replace(/'/g, "''");

    let whereClauses = [];

    if (specificDate) {
      whereClauses.push(`report_date = '${specificDate.replace(/'/g, '')}'`);
    } else if (beforeDate) {
      whereClauses.push(`report_date < '${beforeDate.replace(/'/g, '')}'`);
    } else if (afterDate) {
      whereClauses.push(`report_date > '${afterDate.replace(/'/g, '')}'`);
    }

    if (breakthroughsOnly) {
      whereClauses.push(`new_capabilities_json != '[]' AND new_capabilities_json IS NOT NULL`);
    }

    if (herdrNewsOnly) {
      whereClauses.push(`herdr_events_count > 0`);
    }

    if (agentDetectionOnly) {
      whereClauses.push(`herdr_events_json LIKE '%agent_detection%'`);
    }

    if (search) {
      whereClauses.push(`(headline LIKE '%${search}%' OR executive_summary LIKE '%${search}%' OR long_form_content LIKE '%${search}%')`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderSql = afterDate ? 'ORDER BY report_date ASC' : 'ORDER BY report_date DESC';

    const sql = `
      SELECT 
        report_date, day_number, is_quiet_day, headline,
        executive_summary, long_form_content, new_capabilities_json,
        plugins_released_count, plugins_released_json,
        cumulative_plugins_count, cumulative_stars_count, cumulative_forks_count,
        herdr_events_count, herdr_events_json,
        generated_at, generated_by
      FROM daily_reports
      ${whereSql}
      ${orderSql}
      LIMIT ${limit};
    `;

    const rows = queryDb(sql);

    const reportDates = rows.map(r => `'${r.report_date}'`);
    let evalsByDate = {};
    if (reportDates.length > 0) {
      try {
        const evals = queryDb(`
          SELECT id, report_date, plugin_id, repo_full_name, model_name,
                 overview, capabilities, architecture, herdr_integration,
                 dependencies, extensibility_limitations, full_markdown,
                 reasoning_tokens, completion_tokens, total_tokens, generated_at
          FROM plugin_llm_evaluations
          WHERE report_date IN (${reportDates.join(',')});
        `);
        evals.forEach(ev => {
          if (!evalsByDate[ev.report_date]) evalsByDate[ev.report_date] = [];
          evalsByDate[ev.report_date].push(ev);
        });
      } catch (e) {}
    }

    const formatted = rows.map(r => ({
      ...r,
      new_capabilities: JSON.parse(r.new_capabilities_json || '[]'),
      plugins_released: JSON.parse(r.plugins_released_json || '[]'),
      herdr_events: JSON.parse(r.herdr_events_json || '[]'),
      llm_evaluations: evalsByDate[r.report_date] || []
    }));

    const results = afterDate ? formatted.reverse() : formatted;
    const bounds = queryDb("SELECT MIN(report_date) as min_date, MAX(report_date) as max_date, COUNT(*) as total_days FROM daily_reports;")[0] || {};

    res.json({
      reports: results,
      count: results.length,
      limit,
      min_date: bounds.min_date,
      max_date: bounds.max_date,
      total_days: bounds.total_days,
      next_cursor: results.length > 0 ? results[results.length - 1].report_date : null,
      prev_cursor: results.length > 0 ? results[0].report_date : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/daily-reports/stats', (req, res) => {
  try {
    const stats = queryDb(`
      SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN is_quiet_day = 0 THEN 1 ELSE 0 END) as active_days,
        SUM(CASE WHEN is_quiet_day = 1 THEN 1 ELSE 0 END) as quiet_days,
        MIN(report_date) as start_date,
        MAX(report_date) as end_date,
        MAX(cumulative_plugins_count) as total_plugins,
        MAX(cumulative_stars_count) as total_stars,
        SUM(CASE WHEN herdr_events_count > 0 THEN 1 ELSE 0 END) as herdr_news_days
      FROM daily_reports;
    `)[0] || {};

    const breakthroughsCount = (queryDb("SELECT COUNT(*) as cnt FROM ecosystem_capabilities_ledger;")[0] || {}).cnt || 0;
    const topBreakthroughs = queryDb(`
      SELECT capability_key, capability_type, first_seen_date, first_plugin_name, description
      FROM ecosystem_capabilities_ledger
      ORDER BY first_seen_date ASC
      LIMIT 15;
    `);

    const herdrStats = queryDb(`
      SELECT 
        COUNT(*) as total_herdr_events,
        SUM(CASE WHEN event_type = 'agent_detection' THEN 1 ELSE 0 END) as total_agent_detections,
        SUM(CASE WHEN event_type = 'core_release' THEN 1 ELSE 0 END) as total_core_releases,
        SUM(CASE WHEN event_type = 'major_feature' THEN 1 ELSE 0 END) as total_major_features
      FROM herdr_core_events;
    `)[0] || {};

    const totalRepos = (queryDb("SELECT COUNT(*) as cnt FROM plugins;")[0] || {}).cnt || 977;

    res.json({
      ...stats,
      total_repos: totalRepos,
      total_breakthroughs: breakthroughsCount,
      sample_breakthroughs: topBreakthroughs,
      ...herdrStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/daily-reports/next-active', (req, res) => {
  try {
    const fromDate = (req.query.date || '2026-01-01').replace(/'/g, '');
    const row = queryDb(`
      SELECT report_date FROM daily_reports 
      WHERE report_date > '${fromDate}' AND (is_quiet_day = 0 OR plugins_released_count > 0 OR herdr_events_count > 0)
      ORDER BY report_date ASC LIMIT 1;
    `)[0];
    res.json({ found: !!row, next_date: row ? row.report_date : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/daily-reports/:date', (req, res) => {
  try {
    const dateStr = req.params.date.replace(/'/g, '');
    const row = queryDb(`SELECT * FROM daily_reports WHERE report_date = '${dateStr}';`)[0];
    if (!row) {
      return res.status(404).json({ error: `Daily report for ${dateStr} not found.` });
    }
    const plugins = queryDb(`
      SELECT p.* 
      FROM plugins p
      JOIN daily_report_plugins drp ON p.id = drp.plugin_id
      WHERE drp.report_date = '${dateStr}'
      ORDER BY p.stars DESC;
    `);

    let llmEvals = [];
    try {
      llmEvals = queryDb(`
        SELECT id, report_date, plugin_id, repo_full_name, model_name,
               overview, capabilities, architecture, herdr_integration,
               dependencies, extensibility_limitations, full_markdown,
               reasoning_tokens, completion_tokens, total_tokens, generated_at
        FROM plugin_llm_evaluations
        WHERE report_date = '${dateStr}';
      `);
    } catch (e) {}

    res.json({
      ...row,
      new_capabilities: JSON.parse(row.new_capabilities_json || '[]'),
      plugins_released: JSON.parse(row.plugins_released_json || '[]'),
      herdr_events: JSON.parse(row.herdr_events_json || '[]'),
      detailed_plugins: plugins,
      llm_evaluations: llmEvals
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/plugins/:id/evaluation', (req, res) => {
  try {
    const pid = Number(req.params.id);
    const rows = queryDb(`SELECT * FROM plugin_llm_evaluations WHERE plugin_id = ${pid} ORDER BY report_date DESC;`);
    res.json({ count: rows.length, evaluations: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/herdr-events', (req, res) => {
  try {
    const eventType = req.query.type;
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
    let whereSql = '';
    if (eventType) {
      whereSql = `WHERE event_type = '${eventType.replace(/'/g, '')}'`;
    }
    const events = queryDb(`
      SELECT id, event_date, event_type, headline, summary, details_markdown, agent_name, version_tag, commit_hash
      FROM herdr_core_events
      ${whereSql}
      ORDER BY event_date ${order};
    `);
    res.json({
      count: events.length,
      events
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/query', (req, res) => {
  const { sql } = req.body;
  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ error: 'Missing SQL query parameter' });
  }

  const trimmed = sql.trim().toLowerCase();
  const forbidden = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'replace', 'truncate'];
  if (forbidden.some(word => trimmed.startsWith(word) || trimmed.includes(` ${word} `))) {
    return res.status(403).json({ error: 'Security constraint: Only SELECT and PRAGMA read-only queries are permitted.' });
  }

  const t0 = Date.now();
  try {
    const results = queryDb(sql);
    const durationMs = Date.now() - t0;
    res.json({
      success: true,
      duration_ms: durationMs,
      row_count: results.length,
      columns: results.length > 0 ? Object.keys(results[0]) : [],
      rows: results
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  let statsStr = '';
  try {
    const row = queryDb("SELECT COUNT(*) as repos, SUM(CASE WHEN manifest_raw_json IS NOT NULL AND json_valid(manifest_raw_json) THEN json_array_length(manifest_raw_json) ELSE 1 END) as plugins FROM plugins;")[0];
    if (row) statsStr = ` (All ${row.plugins} Community Plugins across ${row.repos} Repositories)`;
  } catch (e) {}
  console.log(`====================================================`);
  console.log(`Herdr Plugins Intelligence & Growth Server is live!`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Survey Scope: Entire Ecosystem${statsStr}`);
  console.log(`Database: ${DB_PATH}`);
  console.log(`====================================================`);
});
