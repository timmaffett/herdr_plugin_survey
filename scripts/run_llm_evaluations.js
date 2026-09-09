const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { generatePluginReportFull, parseSections } = require('./survey_plugin');

const DB_PATH = path.resolve(__dirname, '../plugins.db');
const REPOS_DIR = path.resolve(__dirname, '../repos');
const MEMORY_DIR = path.resolve(__dirname, '../llm_memory');
const SKILLS_DIR = path.resolve(MEMORY_DIR, 'skills');

function queryDb(sql) {
  try {
    const out = execFileSync('sqlite3', ['-json', DB_PATH, sql], {
      maxBuffer: 35 * 1024 * 1024,
      encoding: 'utf8'
    });
    if (!out || !out.trim()) return [];
    return JSON.parse(out);
  } catch (err) {
    throw new Error(err.stderr || err.message);
  }
}

function runSql(sql) {
  try {
    execFileSync('sqlite3', [DB_PATH, sql], {
      encoding: 'utf8'
    });
  } catch (err) {
    throw new Error(err.stderr || err.message);
  }
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function categoryToSlug(cat) {
  if (!cat) return 'general';
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getCategoryMemory(category) {
  const slug = categoryToSlug(category);
  const memFile = path.join(SKILLS_DIR, `${slug}.md`);
  if (fs.existsSync(memFile)) {
    return fs.readFileSync(memFile, 'utf8');
  }
  return '';
}

function appendCategoryMemory(category, pluginName, dateStr, overview, capabilities) {
  fs.mkdirSync(SKILLS_DIR, { recursive: true });
  const slug = categoryToSlug(category);
  const memFile = path.join(SKILLS_DIR, `${slug}.md`);

  let content = '';
  if (fs.existsSync(memFile)) {
    content = fs.readFileSync(memFile, 'utf8');
  } else {
    content = `# Architectural Memory: ${category}\n\nThis document tracks architectural patterns and previously surveyed extensions within the **${category}** domain.\n\n## Surveyed Extensions Ledger\n\n`;
  }

  const cleanOverview = overview ? overview.split('\n')[0].replace(/^#+\s*/, '') : 'No overview';
  const entry = `### [${dateStr}] ${pluginName}\n- **Overview**: ${cleanOverview}\n- **Key Features**: ${capabilities ? capabilities.slice(0, 200).replace(/\n/g, ' ') : 'N/A'}\n\n`;

  if (!content.includes(`] ${pluginName}`)) {
    content += entry;
    fs.writeFileSync(memFile, content, 'utf8');
  }
}

function findRepoPath(repoFullName) {
  const parts = repoFullName.split('/');
  if (parts.length !== 2) return null;
  const folderName = `${parts[0]}__${parts[1]}`;
  const directPath = path.join(REPOS_DIR, folderName);
  if (fs.existsSync(directPath)) return directPath;

  // Case-insensitive fallback
  const entries = fs.readdirSync(REPOS_DIR);
  const lower = folderName.toLowerCase();
  for (const ent of entries) {
    if (ent.toLowerCase() === lower) {
      return path.join(REPOS_DIR, ent);
    }
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  let targetDate = null;
  let limit = null;
  let targetPlugin = null;
  let force = false;

  for (const arg of args) {
    if (arg.startsWith('--date=')) targetDate = arg.split('=')[1];
    else if (arg.startsWith('--limit=')) limit = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--plugin=')) targetPlugin = arg.split('=')[1];
    else if (arg === '--force') force = true;
  }

  console.log('===============================================================');
  console.log('HERDR ECOSYSTEM LLM ARCHITECT EVALUATION ENGINE');
  console.log('===============================================================');

  // Query un-evaluated or target plugins
  let query = `
    SELECT 
      dr.report_date,
      p.id as plugin_id,
      p.repo_full_name,
      p.repo_name,
      p.repo_owner,
      p.broad_category,
      p.primary_language,
      p.total_loc,
      p.stars,
      p.forks,
      p.herdr_socket_methods,
      p.herdr_cli_commands,
      p.supported_agents,
      p.readme_summary,
      p.description
    FROM daily_reports dr
    JOIN plugins p ON 1=1
    WHERE dr.plugins_released_count > 0
      AND dr.plugins_released_json LIKE '%' || p.repo_full_name || '%'
  `;

  if (targetDate) {
    query += ` AND dr.report_date = ${escapeSql(targetDate)}`;
  }
  if (targetPlugin) {
    query += ` AND p.repo_full_name = ${escapeSql(targetPlugin)}`;
  }
  if (!force) {
    query += ` AND NOT EXISTS (
      SELECT 1 FROM plugin_llm_evaluations e 
      WHERE e.plugin_id = p.id AND e.report_date = dr.report_date
    )`;
  }

  query += ` ORDER BY dr.report_date ASC, p.stars DESC`;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  const items = queryDb(query);
  console.log(`Discovered ${items.length} plugin(s) scheduled for LLM architectural evaluation.\n`);

  if (items.length === 0) {
    console.log('No pending plugins match the criteria.');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`---------------------------------------------------------------`);
    console.log(`[${i + 1}/${items.length}] Processing: ${item.repo_full_name} (Date: ${item.report_date})`);
    console.log(`Category: ${item.broad_category} | Lang: ${item.primary_language} | LOC: ${item.total_loc}`);

    const repoPath = findRepoPath(item.repo_full_name);
    if (!repoPath) {
      console.error(`❌ Local repo folder not found in repos/ for ${item.repo_full_name}. Skipping.`);
      failCount++;
      continue;
    }

    const catMemory = getCategoryMemory(item.broad_category);
    const deterministicFacts = {
      primary_language: item.primary_language,
      total_loc: item.total_loc,
      herdr_socket_methods: JSON.parse(item.herdr_socket_methods || '[]'),
      herdr_cli_commands: JSON.parse(item.herdr_cli_commands || '[]'),
      supported_agents: JSON.parse(item.supported_agents || '[]')
    };

    const t0 = Date.now();
    try {
      const result = await generatePluginReportFull({
        pluginName: item.repo_full_name,
        pluginPath: repoPath,
        category: item.broad_category,
        releaseDate: item.report_date,
        categoryMemory: catMemory,
        deterministicFacts
      });

      const durationSec = ((Date.now() - t0) / 1000).toFixed(1);
      const sections = parseSections(result.markdown);

      console.log(`✅ Generation completed in ${durationSec}s`);
      console.log(`   Model: ${result.model}`);
      console.log(`   Tokens: ${result.totalTokens} (Reasoning: ${result.reasoningTokens}, Completion: ${result.completionTokens})`);

      // Store in SQLite
      const insertSql = `
        INSERT OR REPLACE INTO plugin_llm_evaluations (
          report_date, plugin_id, repo_full_name, model_name,
          overview, capabilities, architecture, herdr_integration,
          dependencies, extensibility_limitations, full_markdown,
          reasoning_tokens, completion_tokens, total_tokens
        ) VALUES (
          ${escapeSql(item.report_date)},
          ${item.plugin_id},
          ${escapeSql(item.repo_full_name)},
          ${escapeSql(result.model)},
          ${escapeSql(sections.overview)},
          ${escapeSql(sections.capabilities)},
          ${escapeSql(sections.architecture)},
          ${escapeSql(sections.herdrIntegration)},
          ${escapeSql(sections.dependencies)},
          ${escapeSql(sections.extensibilityLimitations)},
          ${escapeSql(result.markdown)},
          ${result.reasoningTokens},
          ${result.completionTokens},
          ${result.totalTokens}
        );
      `;
      runSql(insertSql);

      // Append to progressive memory
      appendCategoryMemory(
        item.broad_category,
        item.repo_full_name,
        item.report_date,
        sections.overview,
        sections.capabilities
      );

      successCount++;
    } catch (err) {
      console.error(`❌ Failed to evaluate ${item.repo_full_name}: ${err.message}`);
      failCount++;
      if (err.message.includes('429')) {
        console.warn('⚠️ Rate limit hit. Pausing execution.');
        break;
      }
    }
  }

  console.log('===============================================================');
  console.log(`RUN COMPLETE: ${successCount} succeeded, ${failCount} failed.`);
  console.log('===============================================================');
}

main().catch(err => {
  console.error('Fatal error in runner:', err);
  process.exit(1);
});
