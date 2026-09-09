import * as fs from 'fs';
import * as path from 'path';

export interface SurveyInput {
  pluginName: string;
  pluginPath: string; // local path to herdr plugin folder
  files?: { path: string; content: string }[];
  category?: string;
  releaseDate?: string;
  categoryMemory?: string;
  deterministicFacts?: Record<string, any>;
}

export interface ParsedSurveyReport {
  pluginName: string;
  model: string;
  overview: string;
  capabilities: string;
  architecture: string;
  herdrIntegration: string;
  dependencies: string;
  extensibilityLimitations: string;
  fullMarkdown: string;
  reasoningTokens: number;
  completionTokens: number;
  totalTokens: number;
}

const META_COMPLETIONS_URL = process.env.META_API_URL || 'https://api.meta.ai/v1/chat/completions';
const DEFAULT_MODEL = process.env.META_MODEL || 'muse-spark-1.3-contributor';
const MAX_CODE_CHARS = 350000;

function getApiKey(): string {
  let key = process.env.META_API_KEY;
  if (!key) {
    const keyPath = path.resolve(__dirname, '../meta_llm_key.txt');
    if (fs.existsSync(keyPath)) {
      key = fs.readFileSync(keyPath, 'utf8').trim();
    }
  }
  if (!key) {
    throw new Error('Missing META_API_KEY');
  }
  return key;
}

function extractManifestReferences(tomlContent: string): string[] {
  const refs = new Set<string>();
  const regex = /["']([^"']+\.(?:sh|bash|zsh|py|js|ts|rs|go|bin|exe))["']/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(tomlContent)) !== null) {
    refs.add(match[1].toLowerCase().replace(/^\.\//, ''));
  }
  const cmdRegex = /command\s*=\s*\[\s*["'][^"']+["']\s*,\s*["']([^"']+)["']/gi;
  while ((match = cmdRegex.exec(tomlContent)) !== null) {
    refs.add(match[1].toLowerCase().replace(/^\.\//, ''));
  }
  return Array.from(refs);
}

function scoreFilePriority(filePath: string, manifestRefs: string[] = []): number {
  const norm = filePath.toLowerCase();
  const base = path.basename(norm);

  // 1. Files explicitly referenced in herdr-plugin.toml
  if (manifestRefs.some(ref => norm === ref || norm.endsWith('/' + ref) || norm.endsWith(ref))) {
    return 100;
  }
  if (base === 'herdr-plugin.toml' || base.startsWith('herdr-plugin')) return 100;

  // 2. Shell scripts & Lifecycle hooks (high priority for Herdr runtime)
  if (base.endsWith('.sh') || base.endsWith('.bash') || base.endsWith('.zsh')) return 85;
  if (norm.includes('/scripts/') || norm.includes('/bin/') || norm.includes('/hooks/')) return 85;

  // 3. Herdr IPC & Socket integrations
  if (norm.includes('/herdr/') || base.includes('herdr') || base.includes('socket') || base.includes('pane')) return 80;

  // 4. Manifests & Dependencies
  if (base === 'package.json' || base === 'cargo.toml' || base === 'pyproject.toml') return 80;

  // 5. Documentation (README, AGENTS.md, etc.)
  if (base === 'readme.md' || base.startsWith('readme')) return 75;
  if (base === 'agents.md' || base === 'claude.md' || base === 'architecture.md') return 75;

  // 6. Primary entrypoints
  if (base.startsWith('main.') || base.startsWith('index.') || base.startsWith('lib.') || base.startsWith('mod.')) return 70;

  // 7. Core source code
  if (base.endsWith('.rs') || base.endsWith('.ts') || base.endsWith('.js') || base.endsWith('.py') || base.endsWith('.go') || base.endsWith('.lua') || base.endsWith('.c') || base.endsWith('.cpp')) return 65;

  // 8. Configuration
  if (base.endsWith('.json') || base.endsWith('.toml') || base.endsWith('.yaml') || base.endsWith('.yml')) return 40;

  // 9. Tests and fixtures
  if (norm.includes('test') || norm.includes('fixture') || norm.includes('mock')) return 10;

  return 30;
}

async function collectFiles(dir: string): Promise<{ path: string; content: string }[]> {
  const results: { path: string; content: string; priority: number }[] = [];
  const manifestRefs: string[] = [];

  // Pre-pass: Find any herdr-plugin.toml to extract referenced scripts
  async function findManifest(currentDir: string) {
    try {
      const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
      for (const ent of entries) {
        if (ent.name.startsWith('.') || ['node_modules', 'dist', 'target', '.git'].includes(ent.name)) continue;
        const fullPath = path.join(currentDir, ent.name);
        if (ent.isDirectory()) {
          await findManifest(fullPath);
        } else if (ent.isFile() && (ent.name === 'herdr-plugin.toml' || ent.name.startsWith('herdr-plugin'))) {
          try {
            const tomlText = await fs.promises.readFile(fullPath, 'utf8');
            manifestRefs.push(...extractManifestReferences(tomlText));
          } catch (e) {}
        }
      }
    } catch (e) {}
  }
  await findManifest(dir);

  async function walk(currentDir: string) {
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

        const allowedExts = ['.ts', '.js', '.mjs', '.json', '.md', '.toml', '.rs', '.py', '.go', '.sh', '.bash', '.zsh', '.lua', '.yaml', '.yml', '.c', '.h', '.cpp'];
        const relPath = path.relative(dir, fullPath);

        let shouldInclude = allowedExts.includes(ext);
        let content: string | null = null;

        // Check extensionless files in bin/ or scripts/ for shebang
        if (!shouldInclude && (relPath.includes('bin/') || relPath.includes('scripts/') || ext === '')) {
          try {
            const stats = await fs.promises.stat(fullPath);
            if (stats.size < 250000) {
              const head = await fs.promises.readFile(fullPath, 'utf8');
              if (head.startsWith('#!')) {
                shouldInclude = true;
                content = head;
              }
            }
          } catch (e) {}
        }

        if (shouldInclude) {
          try {
            const stats = await fs.promises.stat(fullPath);
            if (stats.size > 500000) continue; // Skip huge binaries or bundles
            if (content === null) {
              content = await fs.promises.readFile(fullPath, 'utf8');
            }

            // Cap individual markdown files at 12,000 characters to prevent doc monopolization
            if (ext === '.md' && content.length > 12000) {
              content = content.slice(0, 12000) + '\n\n... [MARKDOWN DOC TRUNCATED TO PRESERVE CODE BUDGET] ...\n';
            }

            results.push({
              path: relPath,
              content,
              priority: scoreFilePriority(relPath, manifestRefs)
            });
          } catch (e) {
            // Ignore unreadable files
          }
        }
      }
    }
  }

  await walk(dir);
  results.sort((a, b) => b.priority - a.priority);
  return results.map(r => ({ path: r.path, content: r.content }));
}

export function formatCodeDump(files: { path: string; content: string }[]): string {
  let totalChars = 0;
  const chunks: string[] = [];

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

export function parseSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {
    overview: '',
    capabilities: '',
    architecture: '',
    herdrIntegration: '',
    dependencies: '',
    extensibilityLimitations: ''
  };

  const getSection = (titleRegex: RegExp, nextRegex: RegExp): string => {
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

  // Fallbacks if regex boundaries differed
  if (!sections.overview) {
    const firstLines = markdown.split('\n\n').slice(0, 3).join('\n\n');
    sections.overview = firstLines;
  }

  return sections;
}

export async function generatePluginReport(input: SurveyInput): Promise<string> {
  const apiKey = getApiKey();
  const pluginName = input.pluginName;

  // 1. Gather code
  let files = input.files;
  if (!files || files.length === 0) {
    if (!input.pluginPath || !fs.existsSync(input.pluginPath)) {
      throw new Error(`Plugin path does not exist: ${input.pluginPath}`);
    }
    files = await collectFiles(input.pluginPath);
  }

  const concatenatedFiles = formatCodeDump(files);

  // 2. System and User prompts
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

  // 3. API Call
  let modelToUse = DEFAULT_MODEL;
  async function makeRequest(model: string) {
    const res = await fetch(META_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: process.env.META_MAX_TOKENS ? parseInt(process.env.META_MAX_TOKENS, 10) : 50000,
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

  let data: any;
  try {
    data = await makeRequest(modelToUse);
  } catch (err: any) {
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

  return choice.message.content;
}
