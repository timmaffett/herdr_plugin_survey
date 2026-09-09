const fs = require('fs');
const path = require('path');

const META_COMPLETIONS_URL = process.env.META_API_URL || 'https://api.meta.ai/v1/chat/completions';
const DEFAULT_MODEL = process.env.META_MODEL || 'muse-spark-1.3-contributor';
const MAX_CODE_CHARS = 48000;

function getApiKey() {
  let key = process.env.META_API_KEY;
  if (!key) {
    const keyPath = path.resolve(__dirname, '../meta_llm_key.txt');
    if (fs.existsSync(keyPath)) {
      key = fs.readFileSync(keyPath, 'utf8').trim();
    }
  }
  if (!key) {
    throw new Error('Missing META_API_KEY environment variable (or meta_llm_key.txt)');
  }
  return key;
}

function scoreFilePriority(filePath) {
  const norm = filePath.toLowerCase();
  const base = path.basename(norm);
  if (base === 'herdr-plugin.toml' || base.startsWith('herdr-plugin')) return 100;
  if (base === 'readme.md' || base.startsWith('readme')) return 90;
  if (base === 'agents.md' || base === 'claude.md' || base === 'architecture.md') return 85;
  if (base === 'package.json' || base === 'cargo.toml' || base === 'pyproject.toml') return 80;
  if (norm.includes('/herdr/') || base.includes('herdr') || base.includes('socket') || base.includes('pane')) return 75;
  if (base.startsWith('main.') || base.startsWith('index.') || base.startsWith('lib.') || base.startsWith('mod.')) return 70;
  if (base.endsWith('.rs') || base.endsWith('.ts') || base.endsWith('.js') || base.endsWith('.py') || base.endsWith('.go')) return 60;
  if (base.endsWith('.sh')) return 55;
  if (base.endsWith('.json') || base.endsWith('.toml')) return 40;
  if (norm.includes('test') || norm.includes('fixture') || norm.includes('mock')) return 10;
  return 30;
}

async function collectFiles(dir) {
  const results = [];

  async function walk(currentDir) {
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.name.startsWith('.') && ent.name !== '.env.example') continue;
      if (['node_modules', 'dist', 'target', 'build', 'vendor', '.git', 'fixtures', '.cache'].includes(ent.name)) continue;

      const fullPath = path.join(currentDir, ent.name);
      if (ent.isDirectory()) {
        await walk(fullPath);
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (ent.name.endsWith('.lock') || ent.name.includes('lock.json')) continue;
        if (['.ts', '.js', '.mjs', '.json', '.md', '.toml', '.rs', '.py', '.go', '.sh'].includes(ext)) {
          const relPath = path.relative(dir, fullPath);
          try {
            const stats = await fs.promises.stat(fullPath);
            if (stats.size > 250000) continue;
            const content = await fs.promises.readFile(fullPath, 'utf8');
            results.push({
              path: relPath,
              content,
              priority: scoreFilePriority(relPath)
            });
          } catch (e) {}
        }
      }
    }
  }

  await walk(dir);
  results.sort((a, b) => b.priority - a.priority);
  return results.map(r => ({ path: r.path, content: r.content }));
}

function formatCodeDump(files) {
  let totalChars = 0;
  const chunks = [];

  for (const f of files) {
    const header = `// ==== FILE: ${f.path} ====\n`;
    const avail = MAX_CODE_CHARS - totalChars - header.length;
    if (avail <= 200) break;

    let contentToAdd = f.content;
    if (contentToAdd.length > avail) {
      contentToAdd = contentToAdd.slice(0, avail) + '\n\n... [TRUNCATED DUE TO CONTEXT LIMIT] ...\n';
    }

    chunks.push(header + contentToAdd);
    totalChars += header.length + contentToAdd.length;
    if (totalChars >= MAX_CODE_CHARS) break;
  }

  return chunks.join('\n\n');
}

function parseSections(markdown) {
  const sections = {
    overview: '',
    capabilities: '',
    architecture: '',
    herdrIntegration: '',
    dependencies: '',
    extensibilityLimitations: ''
  };

  const getSection = (titleRegex, nextRegex) => {
    const match = markdown.match(titleRegex);
    if (!match || match.index === undefined) return '';
    const startIndex = match.index + match[0].length;
    const rest = markdown.slice(startIndex);
    const nextMatch = rest.match(nextRegex);
    const endIndex = nextMatch && nextMatch.index !== undefined ? nextMatch.index : rest.length;
    return rest.slice(0, endIndex).trim();
  };

  sections.overview = getSection(/(?:^|\n)#+\s*(?:1\.\s*)?Overview[^\n]*/i, /(?:^|\n)#+\s*(?:2\.\s*)?Capabilities/i);
  sections.capabilities = getSection(/(?:^|\n)#+\s*(?:2\.\s*)?Capabilities[^\n]*/i, /(?:^|\n)#+\s*(?:3\.\s*)?Architecture/i);
  sections.architecture = getSection(/(?:^|\n)#+\s*(?:3\.\s*)?Architecture[^\n]*/i, /(?:^|\n)#+\s*(?:4\.\s*)?Herdr Integration/i);
  sections.herdrIntegration = getSection(/(?:^|\n)#+\s*(?:4\.\s*)?Herdr Integration[^\n]*/i, /(?:^|\n)#+\s*(?:5\.\s*)?Dependencies/i);
  sections.dependencies = getSection(/(?:^|\n)#+\s*(?:5\.\s*)?Dependencies[^\n]*/i, /(?:^|\n)#+\s*(?:6\.\s*)?Extensibility/i);
  sections.extensibilityLimitations = getSection(/(?:^|\n)#+\s*(?:6\.\s*)?Extensibility[^\n]*/i, /(?:^|\n)#+\s*7\./i);

  if (!sections.overview) {
    const firstLines = markdown.split('\n\n').slice(0, 3).join('\n\n');
    sections.overview = firstLines;
  }

  return sections;
}

async function generatePluginReport(input) {
  const apiKey = getApiKey();
  const pluginName = input.pluginName;

  let files = input.files;
  if (!files || files.length === 0) {
    if (!input.pluginPath || !fs.existsSync(input.pluginPath)) {
      throw new Error(`Plugin path does not exist: ${input.pluginPath}`);
    }
    files = await collectFiles(input.pluginPath);
  }

  const concatenatedFiles = formatCodeDump(files);

  const systemPrompt = "You are a senior staff software architect doing a code survey. Evaluate the provided Herdr plugin code. You are not writing code, you are analyzing it. Generate a clear prose report for a human developer.";

  let memorySnippet = '';
  if (input.categoryMemory) {
    memorySnippet = `\nEcosystem Category Memory (${input.category || 'General'}):\n${input.categoryMemory}\n`;
  }

  let deterministicSnippet = '';
  if (input.deterministicFacts) {
    deterministicSnippet = `\nDeterministic Facts Recorded by Survey Scanner:
- Primary Language: ${input.deterministicFacts.primary_language || 'N/A'}
- Lines of Code: ${input.deterministicFacts.total_loc || 'N/A'}
- Discovered Socket Calls: ${JSON.stringify(input.deterministicFacts.herdr_socket_methods || [])}
- Discovered CLI Commands: ${JSON.stringify(input.deterministicFacts.herdr_cli_commands || [])}
- Supported Agent Scope: ${JSON.stringify(input.deterministicFacts.supported_agents || [])}
`;
  }

  const userPrompt = `Plugin name: ${pluginName}
${memorySnippet}${deterministicSnippet}
Task: Survey all files below and generate a prose report with these sections:
1. Overview - What is this plugin for in 2-3 sentences?
2. Capabilities - What can it do? List key features, commands, hooks, API endpoints.
3. Architecture - How is it structured? Entry points, key classes/functions, data flow.
4. Herdr Integration - How does it use Herdr plugin APIs, lifecycle, events, config?
5. Dependencies - External deps and internal cross-plugin deps.
6. Extensibility & Limitations - How to extend it, and current gaps/risks.

Write in professional prose + markdown headers. Be specific to the code, do not hallucinate APIs that aren't in the code.

CODE:
${concatenatedFiles}`;

  let modelToUse = DEFAULT_MODEL;
  async function makeRequest(model) {
    const res = await fetch(META_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 6000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (res.status === 401) {
      throw new Error('Meta API Authentication Failed (401): Check META_API_KEY');
    }
    if (res.status === 429) {
      throw new Error('Meta API Rate Limit Exceeded (429): Quota exhausted or rate limited');
    }
    if (res.status === 404) {
      throw new Error(`Meta API Model Not Found (404): ${model}`);
    }
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Meta API Error (${res.status}): ${errText}`);
    }

    return await res.json();
  }

  let data;
  try {
    data = await makeRequest(modelToUse);
  } catch (err) {
    if (err.message.includes('404') && modelToUse !== 'meta-spark-1.3-contributor') {
      data = await makeRequest('meta-spark-1.3-contributor');
    } else {
      throw err;
    }
  }

  const choice = data.choices && data.choices[0];
  if (!choice || !choice.message || !choice.message.content) {
    throw new Error('Meta API returned empty choices or null content');
  }

  const reportMarkdown = choice.message.content;
  const usage = data.usage || {};

  return {
    markdown: reportMarkdown,
    model: data.model || modelToUse,
    reasoningTokens: usage.completion_tokens_details?.reasoning_tokens || 0,
    completionTokens: usage.completion_tokens || 0,
    totalTokens: usage.total_tokens || 0
  };
}

module.exports = {
  generatePluginReport: async function(input) {
    const res = await generatePluginReport(input);
    return typeof res === 'string' ? res : res.markdown;
  },
  generatePluginReportFull: generatePluginReport,
  parseSections,
  collectFiles,
  formatCodeDump
};
