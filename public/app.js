/**
 * Herdr Plugins Intelligence & Growth Explorer - Client SPA Application
 * Full Ecosystem Index (903 Plugins) + Interactive Apache ECharts Growth Timelines.
 */

const LANG_COLORS = {
  "TypeScript": "#3178c6",
  "JavaScript": "#f1e05a",
  "Rust": "#dea584",
  "Python": "#3572A5",
  "Go": "#00ADD8",
  "Lua": "#000080",
  "Shell": "#89e051",
  "C++": "#f34b7d",
  "C": "#555555",
  "Ruby": "#701516",
  "PowerShell": "#012456",
  "Swift": "#F05138",
  "Perl": "#0298c3",
  "Dart": "#00B4AB",
  "HTML": "#e34c26",
  "Zig": "#ec915c",
  "Other": "#888888"
};

let allPlugins = [];
let growthChartInstance = null;
let releasesChartInstance = null;
let endpointsScope = 'top20';
let endpointsType = 'all';
let endpointsSearch = '';

let activeFilters = {
  q: '',
  category: '',
  language: '',
  sort: 'popularity',
  tui: null,
  mobile: null,
  web: null,
  comms: null,
  worktree: null,
  cross_platform: null,
  tests: null,
  trending: null,
  outdated: null,
  remote_infra: null,
  vps: null,
  router: null,
  port_mapping: null,
  vpn: null,
  mosh: null,
  ssh: null,
  raw_socket: null,
  agent_skills: null,
  agent: null
};

let growthConfig = {
  metric: 'stars',
  limit: 25,
  scale: 'linear',
  skip: 0,
  include_core: 0,
  wheelZoom: false,
  q: '',
  category: '',
  language: '',
  agent: null,
  filters: {}
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupFilters();
  setupGrowthControls();
  setupSqlConsole();
  await loadStats();
  await loadPlugins();
});

// View switching
function setupNavigation() {
  const links = document.querySelectorAll('.nav-link[data-view]');
  const views = {
    browse: document.getElementById('view-browse'),
    growth: document.getElementById('view-growth'),
    sql: document.getElementById('view-sql'),
    analytics: document.getElementById('view-analytics')
  };

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const viewName = link.dataset.view;

      Object.keys(views).forEach(k => {
        views[k].style.display = (k === viewName) ? 'block' : 'none';
      });

      if (viewName === 'growth') {
        setTimeout(renderGrowthChart, 50);
      } else if (viewName === 'analytics') {
        renderAnalyticsCharts();
      }
    });
  });

  // Modal close handlers
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('detail-modal').addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal') closeModal();
  });

  window.addEventListener('resize', () => {
    if (growthChartInstance) growthChartInstance.resize();
    if (releasesChartInstance) releasesChartInstance.resize();
  });
}

// Load stats and initialize dropdowns
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();

    document.getElementById('stat-total-plugins').textContent = data.total_plugins || 903;
    document.getElementById('stat-total-loc').textContent = (Math.round((data.total_loc || 8700000) / 100000) / 10).toFixed(1) + 'M';
    document.getElementById('stat-total-stars').textContent = (Math.round((data.total_stars || 22000) / 100) / 10).toFixed(1) + 'K';
    document.getElementById('stat-total-forks').textContent = (Math.round((data.total_forks || 1780) / 100) / 10).toFixed(1) + 'K';

    const catSelect = document.getElementById('category-select');
    const growthCatSelect = document.getElementById('growth-category-select');
    (data.categories || []).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.broad_category;
      opt.textContent = `${c.broad_category} (${c.cnt})`;
      catSelect.appendChild(opt);

      const optG = opt.cloneNode(true);
      growthCatSelect.appendChild(optG);
    });

    const langSelect = document.getElementById('language-select');
    const growthLangSelect = document.getElementById('growth-language-select');
    (data.languages || []).forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.primary_language;
      opt.textContent = `${l.primary_language} (${l.cnt})`;
      langSelect.appendChild(opt);

      const optG = opt.cloneNode(true);
      growthLangSelect.appendChild(optG);
    });

    window._ecosystemStats = data;
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

// Filters setup for Browse view
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  let debounceTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      activeFilters.q = e.target.value.trim();
      loadPlugins();
    }, 200);
  });

  document.getElementById('category-select').addEventListener('change', (e) => {
    activeFilters.category = e.target.value;
    loadPlugins();
  });

  document.getElementById('language-select').addEventListener('change', (e) => {
    activeFilters.language = e.target.value;
    loadPlugins();
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    activeFilters.sort = e.target.value;
    loadPlugins();
  });

  // Toggle chips
  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.filter;
      if (activeFilters[key] === 1) {
        activeFilters[key] = null;
        chip.classList.remove('active');
      } else {
        activeFilters[key] = 1;
        chip.classList.add('active');
      }
      loadPlugins();
    });
  });

  // Agent chips
  document.querySelectorAll('.chip[data-agent]').forEach(chip => {
    chip.addEventListener('click', () => {
      const agent = chip.dataset.agent;
      if (activeFilters.agent === agent) {
        activeFilters.agent = null;
        chip.classList.remove('active');
      } else {
        document.querySelectorAll('.chip[data-agent]').forEach(c => c.classList.remove('active'));
        activeFilters.agent = agent;
        chip.classList.add('active');
      }
      loadPlugins();
    });
  });
}

// Fetch and render plugins for Browse view
async function loadPlugins() {
  const container = document.getElementById('plugins-container');
  container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--faint);">Loading plugins...</div>`;

  const params = new URLSearchParams();
  if (activeFilters.q) params.set('q', activeFilters.q);
  if (activeFilters.category) params.set('category', activeFilters.category);
  if (activeFilters.language) params.set('language', activeFilters.language);
  if (activeFilters.sort) params.set('sort', activeFilters.sort);
  if (activeFilters.agent) params.set('agent', activeFilters.agent);
  if (activeFilters.tui !== null) params.set('tui', activeFilters.tui);
  if (activeFilters.mobile !== null) params.set('mobile', activeFilters.mobile);
  if (activeFilters.web !== null) params.set('web', activeFilters.web);
  if (activeFilters.comms !== null) params.set('comms', activeFilters.comms);
  if (activeFilters.worktree !== null) params.set('worktree', activeFilters.worktree);
  if (activeFilters.cross_platform !== null) params.set('cross_platform', activeFilters.cross_platform);
  if (activeFilters.tests !== null) params.set('tests', activeFilters.tests);
  if (activeFilters.trending !== null) params.set('trending', activeFilters.trending);
  if (activeFilters.outdated !== null) params.set('outdated', activeFilters.outdated);
  if (activeFilters.ssh !== null) params.set('ssh', activeFilters.ssh);
  if (activeFilters.mosh !== null) params.set('mosh', activeFilters.mosh);
  if (activeFilters.vpn !== null) params.set('vpn', activeFilters.vpn);
  if (activeFilters.port_mapping !== null) params.set('port_mapping', activeFilters.port_mapping);
  if (activeFilters.router !== null) params.set('router', activeFilters.router);
  if (activeFilters.vps !== null) params.set('vps', activeFilters.vps);
  if (activeFilters.remote_infra !== null) params.set('remote_infra', activeFilters.remote_infra);
  if (activeFilters.raw_socket !== null) params.set('raw_socket', activeFilters.raw_socket);
  if (activeFilters.agent_skills !== null) params.set('agent_skills', activeFilters.agent_skills);


  try {
    const res = await fetch(`/api/plugins?${params.toString()}`);
    const data = await res.json();
    allPlugins = data.plugins || [];

    if (allPlugins.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--faint);">No plugins found matching your filter criteria.</div>`;
      return;
    }

    container.innerHTML = '';
    allPlugins.forEach(p => {
      container.appendChild(createPluginCard(p));
    });
  } catch (err) {
    container.innerHTML = `<div style="grid-column: 1/-1; color: var(--danger); text-align: center; padding: 3rem;">Error loading plugins: ${err.message}</div>`;
  }
}

// Create single plugin card
function createPluginCard(p) {
  const card = document.createElement('div');
  card.className = 'plugin-card';
  card.addEventListener('click', () => openDetailModal(p.id));

  const langColor = LANG_COLORS[p.primary_language] || 'var(--faint2)';

  let agents = [];
  try { agents = JSON.parse(p.supported_agents || '[]'); } catch (e) {}

  let endpoints = [];
  try { endpoints = JSON.parse(p.herdr_socket_methods || '[]'); } catch (e) {}

  const delta7 = p.stars_delta_7d || 0;

  card.innerHTML = `
    <div class="card-top">
      <div>
        <div class="card-owner">${escapeHtml(p.repo_owner)}/</div>
        <div class="card-title">${escapeHtml(p.repo_name)}</div>
      </div>
      <div style="display: flex; gap: 0.35rem; align-items: center;">
        ${p.is_out_of_date ? `<span class="tag-badge" style="color: var(--wait); background: rgba(211,160,39,0.15);" title="Upstream commits available">⚠️ Update</span>` : ''}
        ${delta7 > 0 ? `<span class="tag-badge" style="color: var(--spot); background: var(--spot-glow);">+${delta7}★</span>` : ''}
        <div class="card-stars">★ ${p.stars.toLocaleString()}</div>
        ${p.forks > 0 ? `<div class="tag-badge" style="color: var(--faint2);">⑂ ${p.forks}</div>` : ''}
      </div>
    </div>

    <div class="card-desc">${escapeHtml(p.description || p.readme_summary || 'No description provided.')}</div>

    <div class="card-taxonomy">
      <div class="tax-broad">${escapeHtml(p.broad_category)}</div>
      <div class="tax-sub">${escapeHtml(p.sub_category || '')} · ${escapeHtml(p.sub_sub_category || '')}</div>
    </div>

    <div class="card-tags">
      ${p.presents_tui ? '<span class="tag-badge accent">🖥 TUI</span>' : ''}
      ${p.interfaces_mobile ? '<span class="tag-badge accent">📱 Mobile</span>' : ''}
      ${p.uses_web_display ? '<span class="tag-badge accent">🌐 Web</span>' : ''}
      ${p.adds_communications ? '<span class="tag-badge accent">💬 Comms</span>' : ''}
      ${p.is_cross_platform ? '<span class="tag-badge">🌐 Win/Mac/Linux</span>' : ''}
      ${p.has_tests ? '<span class="tag-badge">🧪 Tests</span>' : ''}
      ${p.git_worktree_aware ? '<span class="tag-badge">🌿 Worktree</span>' : ''}
      ${p.uses_raw_socket ? `<span class="tag-badge" style="color: #f38ba8; background: rgba(243,139,168,0.14); border: 1px solid rgba(243,139,168,0.3);" title="${escapeHtml(p.raw_socket_details || '')}">⚡ Raw Socket</span>` : ''}
      ${p.uses_agent_skills ? `<span class="tag-badge" style="color: #cba6f7; background: rgba(203,166,247,0.14); border: 1px solid rgba(203,166,247,0.3);" title="${escapeHtml(p.agent_skills_details || '')}">🧩 Agent Skill</span>` : ''}
      ${p.requires_remote_infra ? `<span class="tag-badge" style="color: #fab387; background: rgba(250,179,135,0.15);" title="${escapeHtml(p.remote_infra_details || '')}">🌐 ${escapeHtml((p.remote_infra_details || 'Remote Infra').split(',')[0])}</span>` : ''}
      ${p.uses_ssh ? '<span class="tag-badge">🔑 SSH</span>' : ''}
      ${p.uses_vpn_tailscale ? '<span class="tag-badge">🔒 Tailscale/VPN</span>' : ''}
      ${agents.slice(0, 2).map(a => `<span class="tag-badge">${escapeHtml(a)}</span>`).join('')}
      ${endpoints.length > 0 ? `<span class="tag-badge" style="color: var(--spot);">${endpoints.length} APIs</span>` : ''}
    </div>

    <div class="card-footer">
      <div class="card-lang">
        <span class="lang-dot" style="background: ${langColor};"></span>
        <span>${escapeHtml(p.primary_language || 'Other')}</span>
        ${p.manifest_version ? `<span>v${escapeHtml(p.manifest_version)}</span>` : ''}
      </div>
      <div class="card-metrics">
        <span>${(p.total_loc || 0).toLocaleString()} LOC</span>
        <span>${p.total_files || 0} files</span>
      </div>
    </div>
  `;
  return card;
}

// Open Detail Modal
async function openDetailModal(pluginId) {
  const modal = document.getElementById('detail-modal');
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--faint);">Loading detailed profile...</div>`;
  modal.classList.add('open');

  try {
    const res = await fetch(`/api/plugins/${pluginId}`);
    const p = await res.json();

    document.getElementById('modal-owner').textContent = p.repo_owner + ' /';
    document.getElementById('modal-name').textContent = p.repo_name;

    let endpoints = [];
    try { endpoints = JSON.parse(p.herdr_socket_methods || '[]'); } catch (e) {}

    let cliCmds = [];
    try { cliCmds = JSON.parse(p.herdr_cli_commands || '[]'); } catch (e) {}

    let agents = [];
    try { agents = JSON.parse(p.supported_agents || '[]'); } catch (e) {}

    let collectionMethods = [];
    try { collectionMethods = JSON.parse(p.agent_data_collection || '[]'); } catch (e) {}

    let langLoc = {};
    try { langLoc = JSON.parse(p.loc_language_dist || '{}'); } catch (e) {}

    modalContent.innerHTML = `
      <div class="detail-section">
        <h3>📋 Summary & Overview</h3>
        <p>${escapeHtml(p.description || '')}</p>
        <p style="margin-top: 0.6rem; color: var(--faint);">${escapeHtml(p.readme_summary || '')}</p>
        <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.8rem; align-items: center;">
          <a href="${p.repo_url}" target="_blank" style="color: var(--spot); text-decoration: underline;">View on GitHub ↗</a>
          <span style="color: var(--faint2);">★ ${p.stars.toLocaleString()} Stars</span>
          <span style="color: var(--faint2);">⑂ ${p.forks} Forks</span>
          <span style="color: var(--faint2);">${p.open_issues} Issues</span>
          ${p.stars_delta_7d > 0 ? `<span class="tag-badge" style="color: var(--spot); background: var(--spot-glow);">+${p.stars_delta_7d} stars this week</span>` : ''}
        </div>
      </div>

      <div class="detail-section">
        <h3>⚡ Herdr Interface & API Endpoints</h3>
        <p><strong>Socket Methods & Events:</strong></p>
        <div class="code-pill-list">
          ${endpoints.length > 0 ? endpoints.map(e => `<a href="${getEndpointDocUrl(e)}" target="_blank" style="text-decoration: none;"><span class="code-pill" style="color: var(--spot); cursor: pointer;" title="Open doc for ${escapeHtml(e)}">${escapeHtml(e)} ↗</span></a>`).join('') : '<span style="color: var(--faint2);">None detected</span>'}
        </div>

        <p style="margin-top: 0.8rem;"><strong>CLI Commands Invoked:</strong></p>
        <div class="code-pill-list">
          ${cliCmds.length > 0 ? cliCmds.map(c => `<a href="${getEndpointDocUrl('cli:' + c)}" target="_blank" style="text-decoration: none;"><span class="code-pill" style="cursor: pointer;" title="Open CLI doc for ${escapeHtml(c)}">${escapeHtml(c)} ↗</span></a>`).join('') : '<span style="color: var(--faint2);">None detected</span>'}
        </div>
        
        <p style="margin-top: 0.8rem;"><strong>Quick Install Command:</strong></p>
        <div class="code-box">herdr plugin install ${escapeHtml(p.repo_full_name)}</div>
      </div>

      <div class="detail-section">
        <h3>🤖 AI Agent Support & Data Collection</h3>
        <p><strong>Scope:</strong> <span class="tag-badge accent">${escapeHtml(p.agent_scope || 'general')}</span></p>
        <div class="code-pill-list" style="margin-top: 0.5rem;">
          ${agents.map(a => `<span class="code-pill">${escapeHtml(a)}</span>`).join('')}
        </div>
        <p style="margin-top: 0.8rem;"><strong>Data Collection Architecture:</strong></p>
        <p style="color: var(--spot);">${escapeHtml(p.agent_data_details || 'Generic process monitoring')}</p>
        <div class="code-pill-list" style="margin-top: 0.4rem;">
          ${collectionMethods.map(m => `<span class="code-pill" style="background: var(--line-strong);">${escapeHtml(m)}</span>`).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h3>⚡ Herdr Core Integration Architecture</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-family: var(--mono); font-size: 0.8rem; margin-bottom: 0.6rem;">
          <div style="background: var(--mass); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--line2);">
            <div style="color: var(--faint2); font-size: 0.72rem;">Raw Socket API:</div>
            <div style="margin-top: 3px;">${p.uses_raw_socket ? '<strong style="color: #f38ba8;">⚡ Direct Unix Socket Connect</strong>' : '<span style="color: var(--faint);">CLI wrapper / None</span>'}</div>
          </div>
          <div style="background: var(--mass); padding: 0.6rem; border-radius: 4px; border: 1px solid var(--line2);">
            <div style="color: var(--faint2); font-size: 0.72rem;">Agent Skill Layer:</div>
            <div style="margin-top: 3px;">${p.uses_agent_skills ? '<strong style="color: #cba6f7;">🧩 Active Skill / Hooks Layer</strong>' : '<span style="color: var(--faint);">No skill files</span>'}</div>
          </div>
        </div>
        ${p.uses_raw_socket && p.raw_socket_details ? `<div style="font-family: var(--mono); font-size: 0.75rem; color: #f38ba8; background: rgba(243,139,168,0.08); padding: 6px 10px; border-radius: 4px; margin-bottom: 4px;"><strong>Socket Details:</strong> ${escapeHtml(p.raw_socket_details)}</div>` : ''}
        ${p.uses_agent_skills && p.agent_skills_details ? `<div style="font-family: var(--mono); font-size: 0.75rem; color: #cba6f7; background: rgba(203,166,247,0.08); padding: 6px 10px; border-radius: 4px;"><strong>Skills Details:</strong> ${escapeHtml(p.agent_skills_details)}</div>` : ''}
      </div>

      <div class="detail-section">
        <h3>🌐 Remote Access & Infrastructure Setup</h3>
        <p><strong>Setup Required:</strong> ${p.requires_remote_infra ? '<span class="tag-badge" style="color: #fab387; background: rgba(250,179,135,0.15);">Required / Documented</span>' : '<span class="tag-badge" style="color: var(--done);">Local Only (No Remote Infra Required)</span>'}</p>
        <p style="margin-top: 0.5rem; color: var(--spot);"><strong>Infrastructure Requirements:</strong> ${escapeHtml(p.remote_infra_details || 'None')}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-top: 0.8rem; font-family: var(--mono); font-size: 0.78rem;">
          <div>🔑 SSH Tunnel / Config: <strong>${p.uses_ssh ? 'Yes' : 'No'}</strong></div>
          <div>📡 Mosh Mobile Shell: <strong>${p.uses_mosh ? 'Yes' : 'No'}</strong></div>
          <div>🔒 VPN / Tailscale / WireGuard: <strong>${p.uses_vpn_tailscale ? 'Yes' : 'No'}</strong></div>
          <div>🔀 Port Forwarding / UPnP: <strong>${p.mentions_port_mapping ? 'Yes' : 'No'}</strong></div>
          <div>🏠 Home Router / NAT Setup: <strong>${p.mentions_router_setup ? 'Yes' : 'No'}</strong></div>
          <div>☁️ VPS / Gateway Hosting: <strong>${p.mentions_vps_gateway ? 'Yes' : 'No'}</strong></div>
        </div>
      </div>

      <div class="detail-section">
        <h3>🏗 Manifest & Architectural Primitives</h3>
        <div style="background: var(--mass); padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--line2); margin-bottom: 0.8rem; font-family: var(--mono); font-size: 0.78rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span>Git Commit Tracking:</span>
            ${p.is_out_of_date ? "<span class='tag-badge' style='color: var(--wait); background: rgba(211,160,39,0.15);'>⚠️ Upstream Commits Ahead</span>" : "<span class='tag-badge' style='color: var(--run);'>✅ Up to Date</span>"}
          </div>
          <div>Surveyed Commit: <code>${(p.surveyed_commit_hash || "unknown").slice(0, 10)}</code> (${p.surveyed_commit_date ? new Date(p.surveyed_commit_date).toLocaleDateString() : "N/A"})</div>
          <div>Upstream Commit: <code>${(p.upstream_head_commit || p.surveyed_commit_hash || "unknown").slice(0, 10)}</code> (${p.upstream_pushed_at ? new Date(p.upstream_pushed_at).toLocaleDateString() : "N/A"})</div>
        </div>

        <p><strong>Manifest ID:</strong> <code>${escapeHtml(p.manifest_id || 'none')}</code> | <strong>Min Herdr Version:</strong> <code>${escapeHtml(p.min_herdr_version || '0.7.0')}</code></p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.8rem; font-family: var(--mono); font-size: 0.8rem;">
          <div>Actions: <strong>${p.manifest_actions_count}</strong></div>
          <div>Panes: <strong>${p.manifest_panes_count}</strong></div>
          <div>Event Hooks: <strong>${p.manifest_events_count}</strong></div>
          <div>Startup Hooks: <strong>${p.manifest_startup_count}</strong></div>
          <div>Build Steps: <strong>${p.manifest_build_count}</strong></div>
          <div>Link Handlers: <strong>${p.manifest_link_handlers_count}</strong></div>
          <div>Tunnel Service: <strong>${p.tunnel_service || 'none'}</strong></div>
          <div>Auth Strategy: <strong>${p.auth_strategy || 'none'}</strong></div>
          <div>Has Tests: <strong>${p.has_tests ? 'Yes' : 'No'}</strong></div>
          <div>Cross-Platform: <strong>${p.is_cross_platform ? 'Yes' : 'No'}</strong></div>
        </div>
      </div>

      <div class="detail-section">
        <h3>📊 Codebase Statistics</h3>
        <p><strong>Total Files:</strong> ${p.total_files} | <strong>Total Lines of Code:</strong> ${(p.total_loc || 0).toLocaleString()} | <strong>Contributors:</strong> ${p.contributors_count}</p>
        <div style="margin-top: 0.8rem;">
          ${Object.entries(langLoc).slice(0, 6).map(([lang, count]) => `
            <div style="margin-bottom: 0.4rem;">
              <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.75rem;">
                <span>${escapeHtml(lang)}</span>
                <span>${count.toLocaleString()} LOC</span>
              </div>
              <div style="height: 4px; background: var(--bg); border-radius: 2px; overflow: hidden; margin-top: 2px;">
                <div style="height: 100%; width: ${Math.min(100, Math.round((count / (p.total_loc || 1)) * 100))}%; background: ${LANG_COLORS[lang] || 'var(--spot)'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    modalContent.innerHTML = `<div style="color: var(--danger); text-align: center; padding: 3rem;">Failed to load details: ${err.message}</div>`;
  }
}

function closeModal() {
  document.getElementById('detail-modal').classList.remove('open');
}

// -------------------------------------------------------------
// HISTORICAL GROWTH GRAPH ENGINE (Apache ECharts)
// -------------------------------------------------------------

function setupGrowthControls() {
  // Metric selector buttons
  document.querySelectorAll('#growth-metric-group .metric-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#growth-metric-group .metric-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      growthConfig.metric = btn.dataset.metric;
      renderGrowthChart();
    });
  });

  // Limit / Scope selector buttons
  document.querySelectorAll('#growth-scope-group .scope-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#growth-scope-group .scope-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      growthConfig.limit = Number(btn.dataset.limit);
      renderGrowthChart();
    });
  });

  // Scale toggle (linear vs log)
  document.querySelectorAll('#growth-scale-group .scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#growth-scale-group .scale-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      growthConfig.scale = btn.dataset.scale;
      renderGrowthChart();
    });
  });

  // Exclude Outliers (Skip Top 10 / 20)
  document.querySelectorAll('#growth-skip-group .skip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#growth-skip-group .skip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      growthConfig.skip = Number(btn.dataset.skip);
      renderGrowthChart();
    });
  });

  // Herdr Core Benchmark Toggle
  const coreBtn = document.getElementById('toggle-core-btn');
  if (coreBtn) {
    coreBtn.addEventListener('click', () => {
      if (growthConfig.include_core === 1) {
        growthConfig.include_core = 0;
        coreBtn.classList.remove('active');
        coreBtn.textContent = '🐑 Include Herdr Core';
      } else {
        growthConfig.include_core = 1;
        coreBtn.classList.add('active');
        coreBtn.textContent = '🐑 Herdr Core: ON';
      }
      renderGrowthChart();
    });
  }

  // Respond to Mouse Wheel checkbox toggle
  const wheelToggle = document.getElementById('growth-wheel-toggle');
  if (wheelToggle) {
    wheelToggle.checked = growthConfig.wheelZoom;
    wheelToggle.addEventListener('change', (e) => {
      growthConfig.wheelZoom = e.target.checked;
      renderGrowthChart();
    });
  }


  // Search input inside growth view
  const growthSearch = document.getElementById('growth-search-input');
  let growthDebounce;
  growthSearch.addEventListener('input', (e) => {
    clearTimeout(growthDebounce);
    growthDebounce = setTimeout(() => {
      growthConfig.q = e.target.value.trim();
      renderGrowthChart();
    }, 250);
  });

  // Category and language selects inside growth view
  document.getElementById('growth-category-select').addEventListener('change', (e) => {
    growthConfig.category = e.target.value;
    renderGrowthChart();
  });

  document.getElementById('growth-language-select').addEventListener('change', (e) => {
    growthConfig.language = e.target.value;
    renderGrowthChart();
  });

  // Agent chips in growth view
  document.querySelectorAll('.chip[data-growth-agent]').forEach(chip => {
    chip.addEventListener('click', () => {
      const agent = chip.dataset.growthAgent;
      if (growthConfig.agent === agent) {
        growthConfig.agent = null;
        chip.classList.remove('active');
      } else {
        document.querySelectorAll('.chip[data-growth-agent]').forEach(c => c.classList.remove('active'));
        growthConfig.agent = agent;
        chip.classList.add('active');
      }
      renderGrowthChart();
    });
  });

  // Filter chips in growth view
  document.querySelectorAll('.chip[data-growth-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.growthFilter;
      if (growthConfig.filters[key] === 1) {
        delete growthConfig.filters[key];
        chip.classList.remove('active');
      } else {
        growthConfig.filters[key] = 1;
        chip.classList.add('active');
      }
      renderGrowthChart();
    });
  });
}

async function renderGrowthChart() {
  const container = document.getElementById('echarts-growth-container');
  if (!container) return;

  if (!growthChartInstance) {
    growthChartInstance = echarts.init(container, null, { renderer: 'canvas' });
  }

  growthChartInstance.showLoading({
    text: 'Loading Growth Timelines...',
    color: '#cba6f7',
    textColor: '#f5f5f7',
    maskColor: 'rgba(23, 23, 26, 0.7)'
  });

  const params = new URLSearchParams();
    params.set('metric', growthConfig.metric);
  params.set('limit', growthConfig.limit);
  params.set('skip', growthConfig.skip);
  params.set('include_core', growthConfig.include_core);
  if (growthConfig.q) params.set('q', growthConfig.q);
  if (growthConfig.category) params.set('category', growthConfig.category);
  if (growthConfig.language) params.set('language', growthConfig.language);
  if (growthConfig.agent) params.set('agent', growthConfig.agent);
  Object.entries(growthConfig.filters).forEach(([k, v]) => {
    params.set(k, v);
  });

  try {
    const res = await fetch(`/api/history?${params.toString()}`);
    const data = await res.json();
    growthChartInstance.hideLoading();

    const weeks = data.weeks || [];
    const seriesList = data.series || [];

    document.getElementById('chart-legend-summary').textContent = `Plotting ${seriesList.length} plugins · ${growthConfig.metric.toUpperCase()}`;
    document.getElementById('growth-status-text').textContent = 
      `Timeline: Launch of Herdr (${weeks[0] || '2026-01-04'}) to Present (${weeks[weeks.length - 1] || '2026-09-06'}) · ${weeks.length} Weekly Milestones`;

    if (seriesList.length === 0) {
      growthChartInstance.clear();
      growthChartInstance.setOption({
        title: {
          text: 'No plugins match the current filters.',
          left: 'center',
          top: 'middle',
          textStyle: { color: '#888', fontFamily: 'Inter', fontSize: 16 }
        }
      });
      return;
    }

    // Format X-axis dates: "2026-03-15" -> "Mar 15"
    const formattedWeeks = weeks.map(w => {
      const parts = w.split('-');
      if (parts.length < 3) return w;
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const totalLines = seriesList.length;

    // Build series with 360-degree rainbow distribution
    const echartsSeries = seriesList.map((s, idx) => {
      // 360 / N rainbow hue
      const hue = Math.round((idx * 360) / Math.max(totalLines, 1));
      const color = s.is_core ? '#cba6f7' : `hsl(${hue}, 80%, 55%)`;

      return {
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: true,
        triggerLineEvent: true,  // Crucial: enables mouseover and click on the polyline itself!
        cursor: 'pointer',
        showSymbol: totalLines <= 100,  // Visible milestone dots for Top 10/25/50/100
        symbol: s.is_core ? 'diamond' : 'circle',
        symbolSize: s.is_core ? 8 : (totalLines > 50 ? 4 : (totalLines > 25 ? 5 : 6)),
        lineStyle: {
          width: s.is_core ? 3.5 : (totalLines > 100 ? 1.5 : (totalLines > 30 ? 2.0 : 2.5)),
          color: color,
          type: s.is_core ? 'dashed' : 'solid'
        },
        itemStyle: {
          color: color
        },
        emphasis: {
          focus: 'series',
          scale: true,
          lineStyle: {
            width: s.is_core ? 5.5 : 4.0,
            shadowColor: color,
            shadowBlur: 12
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      };
    });

    const metricLabels = {
      stars: 'Cumulative Stars ★',
      velocity: 'Trending Velocity (★/wk)',
      commits: 'Cumulative Git Commits 🔨',
      commit_velocity: 'Commit Velocity (Commits/wk)',
      forks: 'Cumulative Forks ⑂',
      issues: 'Open Issues 📋',
      downloads: 'Estimated Installs 📦'
    };

    const option = {
      backgroundColor: 'transparent',
      animationDuration: 600,
      grid: {
        left: '55px',
        right: '40px',
        top: '40px',
        bottom: '75px',
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: '#18181b',
        borderColor: '#313244',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#f5f5f7', fontFamily: 'Inter', fontSize: 12 },
        extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.6); border-radius: 6px; pointer-events: none;',
        formatter: (params) => {
          if (!params) return '';
          let s = (params.seriesIndex !== undefined && seriesList[params.seriesIndex])
            ? seriesList[params.seriesIndex]
            : (seriesList.find(item => item.name === params.seriesName) || null);

          if (!s) {
            return `<div style="font-weight: 700; color: #fff;">${escapeHtml(params.seriesName || 'Plugin')}</div>`;
          }

          let valNum = params.value;
          if (valNum === undefined || valNum === null || isNaN(Number(valNum))) {
            if (params.dataIndex !== undefined && params.dataIndex >= 0 && s.data && s.data[params.dataIndex] !== undefined) {
              valNum = s.data[params.dataIndex];
            } else {
              valNum = s.current_value || (s.data ? s.data[s.data.length - 1] : 0);
            }
          }
          const val = Number(valNum || 0).toLocaleString();
          const metricTitle = metricLabels[growthConfig.metric] || growthConfig.metric;
          const starsFormatted = (s.stars || 0).toLocaleString();
          const color = s.color || params.color || '#cba6f7';
          let weekLabel = '';
          if (params.dataIndex !== undefined && params.dataIndex >= 0 && formattedWeeks[params.dataIndex]) {
            weekLabel = formattedWeeks[params.dataIndex];
          } else if (params.name && String(params.name).trim() && !params.name.includes('/')) {
            weekLabel = params.name;
          } else {
            weekLabel = formattedWeeks[formattedWeeks.length - 1] ? 'Current (' + formattedWeeks[formattedWeeks.length - 1] + ')' : 'Current';
          }

          // Special treatment for Herdr Core platform benchmark
          if (s.is_core || s.name.includes('Core')) {
            return `
              <div style="font-family: Inter, sans-serif; min-width: 190px; max-width: 290px; line-height: 1.35;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
                  <span style="display: inline-block; width: 10px; height: 10px; transform: rotate(45deg); background: #cba6f7; flex-shrink: 0;"></span>
                  <span style="font-weight: 800; font-size: 13px; color: #cba6f7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(s.name)}</span>
                </div>
                <div style="font-size: 11px; color: #a6adc8; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;">
                  Herdr Core Engine · Rust · ★ 34,953
                </div>
                <div style="background: rgba(203,166,247,0.12); border: 1px solid rgba(203,166,247,0.25); padding: 4px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; display: flex; justify-content: space-between; gap: 10px;">
                  <span style="color: #94e2d5;">${weekLabel}</span>
                  <span style="color: #cba6f7;"><strong>${val}</strong></span>
                </div>
                <div style="margin-top: 5px; font-size: 10px; color: #898da0; text-align: right;">
                  Click to open GitHub repo ↗
                </div>
              </div>
            `;
          }

          // Compact community plugin tooltip
          return `
            <div style="font-family: Inter, sans-serif; min-width: 190px; max-width: 290px; line-height: 1.35;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px;">
                <div style="display: flex; align-items: center; gap: 6px; min-width: 0; overflow: hidden;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${color}; flex-shrink: 0;"></span>
                  <span style="font-weight: 700; font-size: 13px; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(s.name)}</span>
                </div>
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #cba6f7; flex-shrink: 0;">★ ${starsFormatted}</span>
              </div>
              <div style="font-size: 11px; color: #a6adc8; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;">
                ${escapeHtml(s.category || 'Utility')} · ${escapeHtml(s.language || 'Other')}
              </div>
              <div style="background: rgba(255,255,255,0.06); border: 1px solid #26262b; padding: 4px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; display: flex; justify-content: space-between; gap: 10px;">
                <span style="color: #94e2d5;">${weekLabel}</span>
                <span style="color: #fff;"><strong style="color: ${color};">${val}</strong></span>
              </div>
              <div style="margin-top: 5px; font-size: 10px; color: #898da0; text-align: right;">
                Click line to open sidebar details ↗
              </div>
            </div>
          `;
        }
      },
      toolbox: {
        right: 15,
        top: 0,
        feature: {
          dataZoom: { yAxisIndex: 'none', title: { zoom: 'Box Zoom', back: 'Reset Zoom' } },
          restore: { title: 'Reset' },
          saveAsImage: { title: 'Save Image', pixelRatio: 2 }
        },
        iconStyle: {
          borderColor: '#a6adc8'
        }
      },
      xAxis: {
        type: 'category',
        data: formattedWeeks,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#26262b' } },
        axisLabel: {
          color: '#898da0',
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          interval: totalLines > 100 ? 3 : 2
        },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(255, 255, 255, 0.04)', type: 'dashed' }
        }
      },
      yAxis: {
        type: growthConfig.scale === 'log' ? 'log' : 'value',
        name: metricLabels[growthConfig.metric],
        nameTextStyle: { color: '#cba6f7', fontFamily: 'JetBrains Mono', fontSize: 11, padding: [0, 0, 8, 0] },
        axisLine: { lineStyle: { color: '#26262b' } },
        axisLabel: {
          color: '#898da0',
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          formatter: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
        },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(255, 255, 255, 0.05)' }
        }
      },
      dataZoom: (() => {
        const dz = [];
        if (growthConfig.wheelZoom) {
          dz.push({
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true
          });
        }
        dz.push({
          type: 'slider',
          xAxisIndex: [0],
          bottom: 10,
          height: 24,
          borderColor: '#26262b',
          backgroundColor: '#17171a',
          fillerColor: 'rgba(203, 166, 247, 0.18)',
          handleStyle: { color: '#cba6f7', borderColor: '#26262b' },
          textStyle: { color: '#898da0', fontFamily: 'JetBrains Mono', fontSize: 10 }
        });
        return dz;
      })(),
      series: echartsSeries
    };

    growthChartInstance.setOption(option, true);

    // Track active hovered plugin for responsive and reliable click handling
    let hoveredPlugin = null;

    growthChartInstance.off('mouseover');
    growthChartInstance.on('mouseover', (params) => {
      if (params && params.seriesIndex !== undefined && seriesList[params.seriesIndex]) {
        hoveredPlugin = seriesList[params.seriesIndex];
      } else if (params && params.seriesName) {
        hoveredPlugin = seriesList.find(item => item.name === params.seriesName) || hoveredPlugin;
      }
    });

    growthChartInstance.off('globalout');
    growthChartInstance.on('globalout', () => {
      hoveredPlugin = null;
    });

    // Primary click handler: triggers when clicking a line, point, or symbol
    growthChartInstance.off('click');
    growthChartInstance.on('click', (params) => {
      let s = (params && params.seriesIndex !== undefined && seriesList[params.seriesIndex])
        ? seriesList[params.seriesIndex]
        : (params && params.seriesName ? seriesList.find(item => item.name === params.seriesName) : null)
        || hoveredPlugin;

      if (s) {
        if (s.id > 0) {
          openDetailModal(s.id);
        } else if (s.url) {
          window.open(s.url, '_blank');
        }
      }
    });

    // ZRender canvas click fallback: if user clicks while hovering a line, open the modal
    growthChartInstance.getZr().off('click');
    growthChartInstance.getZr().on('click', (event) => {
      if (hoveredPlugin) {
        if (hoveredPlugin.id > 0) {
          openDetailModal(hoveredPlugin.id);
        } else if (hoveredPlugin.url) {
          window.open(hoveredPlugin.url, '_blank');
        }
      }
    });

    renderReleasesChart();
  } catch (err) {
    if (growthChartInstance) growthChartInstance.hideLoading();
    console.error('Error rendering growth chart:', err);
  }
}

// -------------------------------------------------------------
// SQL CONSOLE HANDLERS
// -------------------------------------------------------------

function setupSqlConsole() {
  const sqlInput = document.getElementById('sql-input');
  const runBtn = document.getElementById('btn-run-sql');
  const presets = document.querySelectorAll('.sql-preset-btn');

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      sqlInput.value = btn.dataset.sql;
      runQuery();
    });
  });

  runBtn.addEventListener('click', runQuery);
  sqlInput.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery();
    }
  });

  sqlInput.value = "SELECT id, repo_full_name, stars, forks, popularity_score, primary_language, broad_category FROM plugins ORDER BY popularity_score DESC LIMIT 15;";
}

async function runQuery() {
  const sql = document.getElementById('sql-input').value.trim();
  const meta = document.getElementById('sql-meta');
  const thead = document.getElementById('sql-thead');
  const tbody = document.getElementById('sql-tbody');

  if (!sql) return;

  meta.textContent = 'Executing query...';
  thead.innerHTML = '';
  tbody.innerHTML = '';

  try {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql })
    });
    const data = await res.json();

    if (!data.success) {
      meta.textContent = `Error: ${data.error}`;
      meta.style.color = 'var(--danger)';
      return;
    }

    meta.textContent = `Returned ${data.row_count} rows in ${data.duration_ms}ms.`;
    meta.style.color = 'var(--st-working)';

    if (data.columns && data.columns.length > 0) {
      const tr = document.createElement('tr');
      data.columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        tr.appendChild(th);
      });
      thead.appendChild(tr);

      data.rows.forEach(row => {
        const trRow = document.createElement('tr');
        data.columns.forEach(col => {
          const td = document.createElement('td');
          td.textContent = (row[col] !== null && row[col] !== undefined) ? String(row[col]) : 'NULL';
          trRow.appendChild(td);
        });
        tbody.appendChild(trRow);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">Query succeeded with 0 rows returned.</td></tr>`;
    }
  } catch (err) {
    meta.textContent = `Execution failed: ${err.message}`;
    meta.style.color = 'var(--danger)';
  }
}

// -------------------------------------------------------------
// ANALYTICS VIEW CHARTS
// -------------------------------------------------------------

function renderAnalyticsCharts() {
  const stats = window._ecosystemStats;
  if (!stats) return;

  renderBarChart('chart-categories', stats.categories.map(c => ({
    label: c.broad_category,
    value: c.cnt,
    color: 'var(--spot)'
  })));

  renderBarChart('chart-languages', stats.languages.map(l => ({
    label: l.primary_language,
    value: l.cnt,
    color: LANG_COLORS[l.primary_language] || 'var(--faint)'
  })));

  renderBarChart('chart-agents', stats.agents.map(a => ({
    label: a.agent_name,
    value: a.cnt,
    color: 'var(--st-working)'
  })));

  // Setup Endpoints scope listeners
  document.querySelectorAll('#endpoints-scope-group .scope-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#endpoints-scope-group .scope-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      endpointsScope = btn.dataset.epScope;
      renderEndpointsChart();
    };
  });

  // Setup Endpoints type listeners
  document.querySelectorAll('#endpoints-type-group .scope-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#endpoints-type-group .scope-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      endpointsType = btn.dataset.epType;
      renderEndpointsChart();
    };
  });

  // Setup Endpoints search input
  const searchInput = document.getElementById('endpoints-search-input');
  if (searchInput) {
    let epDebounce;
    searchInput.oninput = (e) => {
      clearTimeout(epDebounce);
      epDebounce = setTimeout(() => {
        endpointsSearch = e.target.value.trim().toLowerCase();
        renderEndpointsChart();
      }, 150);
    };
  }

  // Update summary bar
  if (stats.endpoints_summary) {
    const s = stats.endpoints_summary;
    const summaryBar = document.getElementById('endpoints-summary-bar');
    if (summaryBar) {
      summaryBar.innerHTML = `Official Core Endpoints: <strong>${s.total}</strong> · Active in Plugins: <strong style="color: var(--done);">${s.used_count}</strong> (${((s.used_count/s.total)*100).toFixed(1)}%) · Zero Usage in Ecosystem: <strong style="color: #fab387;">${s.zero_count}</strong> (${((s.zero_count/s.total)*100).toFixed(1)}%)`;
    }
  }

  renderEndpointsChart();
}

function renderEndpointsChart() {
  const stats = window._ecosystemStats;
  if (!stats) return;

  const el = document.getElementById('chart-endpoints');
  if (!el) return;
  el.innerHTML = '';

  let list = stats.all_endpoints || [];

  // 1. Filter by Scope
  if (endpointsScope === 'top20') {
    list = (stats.top_endpoints && stats.top_endpoints.length > 0) ? stats.top_endpoints : list.slice(0, 20);
  } else if (endpointsScope === 'used') {
    list = list.filter(e => e.cnt > 0);
  } else if (endpointsScope === 'zero') {
    list = list.filter(e => e.cnt === 0);
  }

  // 2. Filter by Type
  if (endpointsType === 'socket') {
    list = list.filter(e => e.endpoint_type === 'socket_method' || (!e.endpoint.startsWith('cli:') && !e.endpoint.startsWith('event:')));
  } else if (endpointsType === 'cli') {
    list = list.filter(e => e.endpoint_type === 'cli_command' || e.endpoint.startsWith('cli:'));
  } else if (endpointsType === 'event') {
    list = list.filter(e => e.endpoint_type === 'event_hook' || e.endpoint.startsWith('event:'));
  }

  // 3. Filter by Search Query
  if (endpointsSearch) {
    list = list.filter(e => 
      e.endpoint.toLowerCase().includes(endpointsSearch) ||
      (e.category && e.category.toLowerCase().includes(endpointsSearch)) ||
      (e.description && e.description.toLowerCase().includes(endpointsSearch))
    );
  }

  if (list.length === 0) {
    el.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--faint2); font-family: var(--mono); font-size: 0.85rem;">No endpoints match the current filter criteria.</div>`;
    return;
  }

  const maxVal = Math.max(...list.map(i => i.cnt), 1);

  list.forEach(e => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    const pct = Math.round((e.cnt / maxVal) * 100);
    const docUrl = e.doc_url || getEndpointDocUrl(e.endpoint);

    // Type badge label & style
    let typeBadge = '';
    if (e.endpoint.startsWith('cli:') || e.endpoint_type === 'cli_command') {
      typeBadge = `<span class="tag-badge" style="font-size: 0.65rem; padding: 1px 4px; color: #89b4fa; background: rgba(137, 180, 250, 0.12); margin-left: 6px;">CLI</span>`;
    } else if (e.endpoint.startsWith('event:') || e.endpoint_type === 'event_hook') {
      typeBadge = `<span class="tag-badge" style="font-size: 0.65rem; padding: 1px 4px; color: #f9e2af; background: rgba(249, 226, 175, 0.12); margin-left: 6px;">Event</span>`;
    } else {
      typeBadge = `<span class="tag-badge" style="font-size: 0.65rem; padding: 1px 4px; color: #a6e3a1; background: rgba(166, 227, 161, 0.12); margin-left: 6px;">Socket</span>`;
    }

    const valueHtml = (e.cnt === 0)
      ? `<span style="color: #fab387; background: rgba(250, 179, 135, 0.15); border: 1px solid rgba(250, 179, 135, 0.25); padding: 1px 7px; border-radius: 4px; font-family: var(--mono); font-size: 0.72rem; font-weight: 700;">0 plugins (Unused)</span>`
      : `<span style="font-family: var(--mono); font-size: 0.8rem; color: var(--ink);">${e.cnt} <span style="color: var(--faint2); font-size: 0.7rem;">(${((e.cnt / 903) * 100).toFixed(1)}%)</span></span>`;

    const barColor = (e.cnt === 0) ? 'transparent' : 'var(--done)';

    row.innerHTML = `
      <div class="bar-meta">
        <div style="display: flex; align-items: center; min-width: 0; overflow: hidden; padding-right: 8px;">
          <a href="${escapeHtml(docUrl)}" target="_blank" rel="noopener noreferrer" class="endpoint-link" title="Open official documentation in new tab">
            ${escapeHtml(e.endpoint)} <span class="ext-arrow">↗</span>
          </a>
          ${typeBadge}
          ${e.category ? `<span style="color: var(--faint2); font-size: 0.7rem; font-family: var(--mono); margin-left: 6px;">(${escapeHtml(e.category)})</span>` : ''}
        </div>
        <div>
          ${valueHtml}
        </div>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
      </div>
    `;
    el.appendChild(row);
  });
}

function renderBarChart(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  const maxVal = Math.max(...items.map(i => i.value), 1);

  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    const pct = Math.round((item.value / maxVal) * 100);

    const labelHtml = item.url 
      ? `<a href="${escapeHtml(item.url)}" target="_blank" class="endpoint-link" title="Open documentation for ${escapeHtml(item.label)} in new tab">${escapeHtml(item.label)} <span class="ext-arrow">↗</span></a>`
      : `<span>${escapeHtml(item.label)}</span>`;

    row.innerHTML = `
      <div class="bar-meta">
        ${labelHtml}
        <span>${item.value}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${pct}%; background: ${item.color};"></div>
      </div>
    `;
    el.appendChild(row);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


// Get official documentation URL for any Herdr endpoint
function getEndpointDocUrl(endpoint) {
  if (!endpoint) return "https://herdr.dev/docs";
  const ep = String(endpoint).trim();

  if (ep.startsWith('cli:')) {
    const cmd = ep.replace('cli:', '').trim().replace(/\s+/g, '-');
    return "https://github.com/herdrdev/herdr/blob/main/docs/CLI.md#" + encodeURIComponent(cmd);
  } else if (ep.startsWith('event:')) {
    const ev = ep.replace('event:', '').trim().replace(/\./g, '-');
    return "https://github.com/herdrdev/herdr/blob/main/docs/PLUGINS.md#" + encodeURIComponent(ev);
  } else if (ep.includes('.')) {
    const slug = ep.replace(/\./g, '-');
    return "https://github.com/herdrdev/herdr/blob/main/docs/SOCKET_API.md#" + encodeURIComponent(slug);
  }
  return "https://github.com/herdrdev/herdr/search?q=" + encodeURIComponent(ep);
}

// Render Layered Releases Chart (Weekly New vs Cumulative Total)
async function renderReleasesChart() {
  const container = document.getElementById('echarts-releases-container');
  if (!container) return;

  if (!releasesChartInstance) {
    releasesChartInstance = echarts.init(container, null, { renderer: 'canvas' });
  }

  try {
    const res = await fetch('/api/releases');
    const data = await res.json();
    const weeks = data.weeks || [];
    const weeklyNew = data.weekly_new || [];
    const cumulativeTotal = data.cumulative_total || [];

    const formattedWeeks = weeks.map(w => {
      const parts = w.split('-');
      if (parts.length < 3) return w;
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const option = {
      backgroundColor: 'transparent',
      animationDuration: 800,
      grid: {
        left: '55px',
        right: '65px',
        top: '40px',
        bottom: '60px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1e1e22',
        borderColor: '#26262b',
        borderWidth: 1,
        textStyle: { color: '#f5f5f7', fontFamily: 'JetBrains Mono', fontSize: 12 },
        formatter: (params) => {
          if (!params || params.length === 0) return '';
          const wName = params[0].name;
          const barVal = params.find(p => p.seriesType === 'bar')?.value || 0;
          const lineVal = params.find(p => p.seriesType === 'line')?.value || 0;
          return `
            <div style="padding: 2px 4px;">
              <div style="font-weight: 800; font-size: 13px; color: #cba6f7;">Week: ${wName}</div>
              <div style="margin-top: 6px; border-top: 1px solid #313244; padding-top: 4px;">
                <span style="color: #b4befe;">🟣 New Plugins Released: <strong>${barVal.toLocaleString()}</strong></span><br/>
                <span style="color: #94e2d5;">🟢 Cumulative Total Ecosystem: <strong>${lineVal.toLocaleString()} plugins</strong></span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['New Plugins Released (Weekly)', 'Total Cumulative Ecosystem'],
        textStyle: { color: '#a6adc8', fontFamily: 'Inter', fontSize: 11 },
        top: 5
      },
      xAxis: {
        type: 'category',
        data: formattedWeeks,
        axisLine: { lineStyle: { color: '#26262b' } },
        axisLabel: { color: '#898da0', fontFamily: 'JetBrains Mono', fontSize: 10, interval: 2 },
        splitLine: { show: false }
      },
      yAxis: [
        {
          type: 'value',
          name: 'New / Week',
          nameTextStyle: { color: '#cba6f7', fontFamily: 'JetBrains Mono', fontSize: 10 },
          axisLine: { lineStyle: { color: '#26262b' } },
          axisLabel: { color: '#898da0', fontFamily: 'JetBrains Mono', fontSize: 10 },
          splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.04)' } }
        },
        {
          type: 'value',
          name: 'Cumulative Total',
          nameTextStyle: { color: '#94e2d5', fontFamily: 'JetBrains Mono', fontSize: 10 },
          axisLine: { lineStyle: { color: '#26262b' } },
          axisLabel: { color: '#898da0', fontFamily: 'JetBrains Mono', fontSize: 10 },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'New Plugins Released (Weekly)',
          type: 'bar',
          yAxisIndex: 0,
          data: weeklyNew,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#cba6f7' },
              { offset: 1, color: '#b4befe' }
            ]),
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: 'Total Cumulative Ecosystem',
          type: 'line',
          yAxisIndex: 1,
          step: 'end',
          data: cumulativeTotal,
          itemStyle: { color: '#94e2d5' },
          lineStyle: { width: 3, color: '#94e2d5' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(148, 226, 213, 0.25)' },
              { offset: 1, color: 'rgba(148, 226, 213, 0.02)' }
            ])
          }
        }
      ]
    };

    releasesChartInstance.setOption(option, true);
  } catch (err) {
    console.error('Failed to render releases chart:', err);
  }
}
