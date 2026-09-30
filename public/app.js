/**
 * Herdr Plugins Intelligence & Growth Explorer - Client SPA Application
 * Full Ecosystem Index (994 Plugins across 977 Repositories) + Interactive Apache ECharts Growth Timelines.
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
function switchView(viewName) {
  const links = document.querySelectorAll('.nav-link[data-view]');
  const views = {
    browse: document.getElementById('view-browse'),
    reports: document.getElementById('view-reports'),
    growth: document.getElementById('view-growth'),
    sql: document.getElementById('view-sql'),
    analytics: document.getElementById('view-analytics')
  };

  links.forEach(l => {
    if (l.dataset.view === viewName) l.classList.add('active');
    else l.classList.remove('active');
  });

  Object.keys(views).forEach(k => {
    if (views[k]) {
      views[k].style.display = (k === viewName) ? 'block' : 'none';
    }
  });

  if (viewName === 'growth') {
    setTimeout(renderGrowthChart, 50);
  } else if (viewName === 'analytics') {
    renderAnalyticsCharts();
  }
}
window.switchView = switchView;

function setupNavigation() {
  const links = document.querySelectorAll('.nav-link[data-view]');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const viewName = link.dataset.view;
      switchView(viewName);
      if (viewName === 'reports') {
        initDailyReports();
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

    const totalPlugins = data.total_plugins || 0;
    const totalRepos = data.total_repos || 0;
    const totalLoc = data.total_loc || 0;
    const totalStars = data.total_stars || 0;
    const totalForks = data.total_forks || 0;

    // Synchronize page title
    document.title = `Herdr Plugins Intelligence & Ecosystem Survey (${totalPlugins.toLocaleString()} Plugins)`;

    // Synchronize stat boxes
    const elPlugins = document.getElementById('stat-total-plugins');
    if (elPlugins) elPlugins.textContent = totalPlugins.toLocaleString();

    const elLoc = document.getElementById('stat-total-loc');
    if (elLoc) {
      elLoc.textContent = totalLoc >= 1000000 
        ? (totalLoc / 1000000).toFixed(1) + 'M' 
        : (totalLoc >= 1000 ? (totalLoc / 1000).toFixed(1) + 'K' : totalLoc.toLocaleString());
    }

    const elStars = document.getElementById('stat-total-stars');
    if (elStars) {
      elStars.textContent = totalStars >= 1000 
        ? (totalStars / 1000).toFixed(1) + 'K' 
        : totalStars.toLocaleString();
    }

    const elForks = document.getElementById('stat-total-forks');
    if (elForks) {
      elForks.textContent = totalForks >= 1000 
        ? (totalForks / 1000).toFixed(1) + 'K' 
        : totalForks.toLocaleString();
    }

    // Synchronize nav button tag text
    const navTag = document.getElementById('nav-tag-total-plugins') || document.querySelector('.nav-tag');
    if (navTag) {
      navTag.textContent = `Complete Marketplace Index (${totalPlugins.toLocaleString()} Plugins)`;
    }

    // Synchronize hero eyebrow
    const heroEyebrow = document.getElementById('hero-eyebrow') || document.querySelector('.hero-eyebrow');
    if (heroEyebrow && totalRepos > 0) {
      heroEyebrow.textContent = `Ecosystem Intelligence · All ${totalPlugins.toLocaleString()} Plugins across ${totalRepos.toLocaleString()} Repositories`;
    }

    // Synchronize hero intro text paragraph (100% dynamic live numbers)
    const heroIntro = document.getElementById('hero-intro-text');
    if (heroIntro) {
      const locFormatted = totalLoc >= 1000000 
        ? `${(totalLoc / 1000000).toFixed(1)}M+` 
        : `${totalLoc.toLocaleString()}+`;
      heroIntro.innerHTML = `An exhaustive architectural census of the entire universe of <strong id="hero-intro-plugins">${totalPlugins.toLocaleString()}</strong> published Herdr community plugins across <strong id="hero-intro-repos">${totalRepos.toLocaleString()}</strong> repositories. Every repository was shallow checked out, statically scanned across <strong id="hero-intro-loc">${locFormatted}</strong> LOC, and cataloged with exact Herdr socket/CLI endpoints, commit timestamps, and AI agent integrations.`;
    }

    // Synchronize search input placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.placeholder = `Search ${totalPlugins.toLocaleString()} plugins by name, owner, description, API endpoint, or topic...`;
    }

    // Synchronize growth timelines 'All' button
    const growthBtnAll = document.getElementById('growth-btn-all') || document.querySelector('#growth-scope-group button[data-limit="all"]');
    if (growthBtnAll) {
      growthBtnAll.dataset.limit = totalPlugins;
      growthBtnAll.textContent = `All (${totalPlugins.toLocaleString()})`;
    }

    // Synchronize filter chips with live feature counts
    if (data.features) {
      const chipRaw = document.querySelector('.chip[data-filter="raw_socket"]');
      if (chipRaw && data.features.raw_socket != null) {
        chipRaw.textContent = `⚡ Raw Socket (${data.features.raw_socket.toLocaleString()})`;
      }
      const chipAgent = document.querySelector('.chip[data-filter="agent_skills"]');
      if (chipAgent && data.features.agent_skills != null) {
        chipAgent.textContent = `🧩 Agent Skills (${data.features.agent_skills.toLocaleString()})`;
      }
    }

    // Synchronize Endpoints Explorer summary and buttons if available
    if (data.endpoints_summary) {
      const s = data.endpoints_summary;
      const summaryBar = document.getElementById('endpoints-summary-bar');
      if (summaryBar) {
        summaryBar.innerHTML = `Official Core Endpoints: <strong>${s.total}</strong> · Active in Plugins: <strong style="color: var(--done);">${s.used_count}</strong> (${((s.used_count/s.total)*100).toFixed(1)}%) · Zero Usage in Ecosystem: <strong style="color: #fab387;">${s.zero_count}</strong> (${((s.zero_count/s.total)*100).toFixed(1)}%)`;
      }
      const epBtnAll = document.querySelector('#endpoints-scope-group button[data-ep-scope="all"]');
      if (epBtnAll) epBtnAll.textContent = `All Official (${s.total})`;
      const epBtnUsed = document.querySelector('#endpoints-scope-group button[data-ep-scope="used"]');
      if (epBtnUsed) epBtnUsed.textContent = `Active in Plugins (${s.used_count})`;
      const epBtnZero = document.querySelector('#endpoints-scope-group button[data-ep-scope="zero"]');
      if (epBtnZero) epBtnZero.textContent = `⚠️ Zero Usage (${s.zero_count})`;
    }

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
      updateActiveChipsBadge();
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
      updateActiveChipsBadge();
      loadPlugins();
    });
  });

  // Active filter pills badge counter
  function updateActiveChipsBadge() {
    const activeCount = document.querySelectorAll('#filter-chips-container .chip.active').length;
    const badge = document.getElementById('chips-active-badge');
    const toggleBtn = document.getElementById('toggle-chips-btn');
    if (badge && toggleBtn) {
      if (activeCount > 0) {
        badge.textContent = activeCount;
        badge.style.display = 'inline-flex';
        toggleBtn.classList.add('has-active');
      } else {
        badge.style.display = 'none';
        toggleBtn.classList.remove('has-active');
      }
    }
  }
  updateActiveChipsBadge();

  // Collapsible toggle button for filter chips
  const toggleChipsBtn = document.getElementById('toggle-chips-btn');
  const chipsWrapper = document.getElementById('filter-chips-wrapper');
  let userManuallyToggled = false;

  if (toggleChipsBtn && chipsWrapper) {
    toggleChipsBtn.addEventListener('click', () => {
      userManuallyToggled = true;
      const isCollapsed = chipsWrapper.classList.toggle('collapsed');
      toggleChipsBtn.classList.toggle('expanded', !isCollapsed);
    });
  }

  // Dynamic --nav-height CSS variable to ensure sticky bar sits directly beneath the navbar
  const hdNav = document.querySelector('.hd-nav');
  function updateNavHeight() {
    if (hdNav) {
      const h = hdNav.offsetHeight;
      document.documentElement.style.setProperty('--nav-height', `${h}px`);
    }
  }
  updateNavHeight();
  window.addEventListener('resize', updateNavHeight);

  // Sticky detection on scroll: auto-collapse pills when scrolling into list, restore at top
  const controlsBar = document.getElementById('controls-bar');
  const sentinel = document.getElementById('controls-sentinel');

  function checkStickyState() {
    if (!controlsBar || !sentinel) return;
    const navH = hdNav ? hdNav.offsetHeight : 58;
    const sentinelRect = sentinel.getBoundingClientRect();
    const isSticky = sentinelRect.top <= navH;

    if (isSticky) {
      if (!controlsBar.classList.contains('is-sticky')) {
        controlsBar.classList.add('is-sticky');
        // Auto-collapse pills to maximize screen real estate when scrolling into plugins list
        if (!userManuallyToggled && chipsWrapper && !chipsWrapper.classList.contains('collapsed')) {
          chipsWrapper.classList.add('collapsed');
          if (toggleChipsBtn) toggleChipsBtn.classList.remove('expanded');
        }
      }
    } else {
      if (controlsBar.classList.contains('is-sticky')) {
        controlsBar.classList.remove('is-sticky');
        userManuallyToggled = false; // Reset manual toggle state when returning to top
        // Re-expand pills when scrolled back to the top of the page
        if (chipsWrapper && chipsWrapper.classList.contains('collapsed')) {
          chipsWrapper.classList.remove('collapsed');
          if (toggleChipsBtn) toggleChipsBtn.classList.add('expanded');
        }
      }
    }
  }

  window.addEventListener('scroll', checkStickyState, { passive: true });
  checkStickyState();
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
      <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
        ${p.has_llm_eval ? `<span class="tag-badge" style="color: #89b4fa; background: rgba(137,180,250,0.14); border: 1px solid rgba(137,180,250,0.3); font-weight: 600;" title="Full 6-section AI Architectural Code Survey available">🤖 AI Surveyed</span>` : ''}
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

    let aiSurveyHtml = '';
    if (p.llm_evaluation) {
      const ev = p.llm_evaluation;
      aiSurveyHtml = `
        <div class="detail-section" style="border: 1px solid rgba(137, 180, 250, 0.35); background: linear-gradient(180deg, rgba(24, 24, 37, 0.85) 0%, rgba(17, 17, 27, 0.98) 100%); margin-top: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(137, 180, 250, 0.2); padding-bottom: 0.8rem;">
            <div>
              <h3 style="color: #89b4fa; margin: 0 0 0.3rem 0; display: flex; align-items: center; gap: 0.4rem;">
                <span>🤖</span> AI Architectural Code Survey
              </h3>
              <div style="font-family: var(--mono); font-size: 0.74rem; color: var(--faint2); display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
                <span>Model: <strong style="color: var(--ink);">${escapeHtml(ev.model_name || 'Meta Muse')}</strong></span>
                <span>·</span>
                <span>Daily Dispatch: <strong style="color: var(--ink);">${escapeHtml(ev.report_date || '')}</strong></span>
                <span>·</span>
                <span>Survey Tokens: <strong style="color: var(--spot);">${(ev.total_tokens || 0).toLocaleString()}</strong></span>
              </div>
            </div>
            <button onclick="jumpToDailyReportDate('${escapeHtml(ev.report_date)}', '${escapeHtml(p.repo_full_name)}')" class="btn btn-sm" style="background: rgba(137, 180, 250, 0.15); color: #89b4fa; border: 1px solid rgba(137, 180, 250, 0.35); font-family: var(--mono); font-size: 0.76rem; padding: 5px 12px; cursor: pointer; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
              <span>📅</span> View in Daily Report (${escapeHtml(ev.report_date)}) ↗
            </button>
          </div>

          <div class="llm-card-body" style="padding: 0; display: flex; flex-direction: column; gap: 1.1rem;">
            <div class="llm-section">
              <h5>1. Overview</h5>
              <div>${parseMarkdownToHtml(ev.overview)}</div>
            </div>
            <div class="llm-section">
              <h5>2. Capabilities</h5>
              <div>${parseMarkdownToHtml(ev.capabilities)}</div>
            </div>
            <div class="llm-section">
              <h5>3. Architecture</h5>
              <div>${parseMarkdownToHtml(ev.architecture)}</div>
            </div>
            <div class="llm-section">
              <h5>4. Herdr Integration</h5>
              <div>${parseMarkdownToHtml(ev.herdr_integration)}</div>
            </div>
            <div class="llm-section">
              <h5>5. Dependencies</h5>
              <div>${parseMarkdownToHtml(ev.dependencies)}</div>
            </div>
            <div class="llm-section">
              <h5>6. Extensibility & Limitations</h5>
              <div>${parseMarkdownToHtml(ev.extensibility_limitations)}</div>
            </div>
          </div>

          <div style="margin-top: 1.25rem; padding-top: 0.8rem; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
            <span style="font-family: var(--mono); font-size: 0.72rem; color: var(--faint2);">
              Generated via Herdr Plugin Survey Suite · Reasoning: ${(ev.reasoning_tokens || 0).toLocaleString()} · Completion: ${(ev.completion_tokens || 0).toLocaleString()}
            </span>
            <button onclick="jumpToDailyReportDate('${escapeHtml(ev.report_date)}', '${escapeHtml(p.repo_full_name)}')" class="btn btn-sm" style="background: transparent; color: #89b4fa; border: none; font-family: var(--mono); font-size: 0.76rem; text-decoration: underline; cursor: pointer; padding: 0;">
              Open ${escapeHtml(ev.report_date)} Dispatch in Daily Reports ↗
            </button>
          </div>
        </div>
      `;
    } else {
      aiSurveyHtml = `
        <div class="detail-section" style="border: 1px dashed var(--line2); background: var(--mass); text-align: center; padding: 1.6rem 1.2rem; margin-top: 1.25rem;">
          <h3 style="justify-content: center; color: var(--faint2); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>🤖</span> AI Architectural Code Survey
          </h3>
          <p style="font-size: 0.82rem; color: var(--faint); max-width: 520px; margin: 0.4rem auto 1rem; line-height: 1.5;">
            This plugin is queued in the retrospective AI code survey pipeline. Chronological deep-dives are generated daily starting from Genesis (Jan 1, 2026).
          </p>
          <button onclick="jumpToDailyReportDate('2026-01-01')" class="btn btn-sm" style="background: var(--surface); color: var(--spot); border: 1px solid var(--line2); font-family: var(--mono); font-size: 0.75rem; padding: 5px 12px; cursor: pointer; border-radius: 4px;">
            Browse Published Daily Reports Feed ↗
          </button>
        </div>
      `;
    }

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

      ${aiSurveyHtml}
    `;
  } catch (err) {
    modalContent.innerHTML = `<div style="color: var(--danger); text-align: center; padding: 3rem;">Failed to load details: ${err.message}</div>`;
  }
}

function closeModal() {
  document.getElementById('detail-modal').classList.remove('open');
}

async function jumpToDailyReportDate(dateStr, pluginFullName) {
  closeModal();
  switchView('reports');

  // If jumping to a specific plugin on that day, don't snap scroll to top, center on plugin
  const shouldScrollToTop = !pluginFullName;
  await initDailyReports(dateStr, shouldScrollToTop);

  if (pluginFullName) {
    setTimeout(() => {
      let targetEl = document.querySelector(`.plugin-llm-card[data-plugin="${pluginFullName}"]`);
      if (!targetEl) {
        targetEl = document.querySelector(`[data-plugin="${pluginFullName}"]`);
      }
      if (!targetEl) {
        const allH4 = document.querySelectorAll('#reports-feed-container h4');
        for (const h4 of allH4) {
          if (h4.textContent.includes(pluginFullName)) {
            targetEl = h4;
            break;
          }
        }
      }

      if (targetEl) {
        if (targetEl.classList.contains('llm-hidden')) {
          targetEl.classList.remove('llm-hidden');
        }
        targetEl.style.transition = 'box-shadow 0.4s ease';
        targetEl.style.boxShadow = '0 0 0 2px #89b4fa, 0 8px 30px rgba(137, 180, 250, 0.4)';
        setTimeout(() => {
          targetEl.style.boxShadow = '';
        }, 3000);
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
window.jumpToDailyReportDate = jumpToDailyReportDate;

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

    // Track active hovered plugin and milestone for instant line hover tooltips
    let hoveredPlugin = null;
    let lastTipSeries = -1;
    let lastTipDataIdx = -1;
    let hideTipTimer = null;

    function triggerLineTip(params) {
      if (!params || params.componentType !== 'series') return;
      const sIndex = params.seriesIndex;
      if (sIndex === undefined || !seriesList[sIndex]) return;

      // Cancel any pending hide action immediately
      if (hideTipTimer) {
        clearTimeout(hideTipTimer);
        hideTipTimer = null;
      }

      hoveredPlugin = seriesList[sIndex];

      // If hovering the line curve (not an explicit milestone point), calculate nearest week milestone
      if (params.dataIndex === undefined || params.dataIndex < 0) {
        const ev = params.event;
        const offsetX = ev?.offsetX ?? ev?.event?.offsetX;
        const offsetY = ev?.offsetY ?? ev?.event?.offsetY;

        if (offsetX !== undefined && offsetY !== undefined) {
          let dataIdx = weeks.length - 1;
          try {
            const pt = growthChartInstance.convertFromPixel({ seriesIndex: sIndex }, [offsetX, offsetY]);
            if (pt && !isNaN(pt[0])) {
              dataIdx = Math.round(pt[0]);
              dataIdx = Math.max(0, Math.min(weeks.length - 1, dataIdx));
            }
          } catch (err) {}

          // Update tooltip immediately as the cursor moves over the line
          if (lastTipSeries !== sIndex || lastTipDataIdx !== dataIdx) {
            lastTipSeries = sIndex;
            lastTipDataIdx = dataIdx;
            growthChartInstance.dispatchAction({
              type: 'showTip',
              seriesIndex: sIndex,
              dataIndex: dataIdx,
              x: offsetX,
              y: offsetY
            });
          }
        }
      } else {
        lastTipSeries = params.seriesIndex;
        lastTipDataIdx = params.dataIndex;
      }
    }

    // Trigger tooltip as soon as the line is touched or cursor moves along it
    growthChartInstance.off('mouseover');
    growthChartInstance.on('mouseover', triggerLineTip);

    growthChartInstance.off('mousemove');
    growthChartInstance.on('mousemove', triggerLineTip);

    // Keep tooltip visible across line segments. Do NOT call hideTip on local mouseout between segments or points!
    growthChartInstance.off('mouseout');

    // Canvas background mousemove: if cursor moves into empty chart space away from all lines, smoothly dismiss
    growthChartInstance.getZr().off('mousemove');
    growthChartInstance.getZr().on('mousemove', (e) => {
      const isOverSeries = e.target && (e.target.eventData || e.target.seriesIndex !== undefined || e.target.type === 'ec-polyline');
      if (!isOverSeries) {
        if (!hideTipTimer && hoveredPlugin) {
          hideTipTimer = setTimeout(() => {
            growthChartInstance.dispatchAction({ type: 'hideTip' });
            lastTipSeries = -1;
            lastTipDataIdx = -1;
            hoveredPlugin = null;
            hideTipTimer = null;
          }, 250);
        }
      } else {
        if (hideTipTimer) {
          clearTimeout(hideTipTimer);
          hideTipTimer = null;
        }
      }
    });

    growthChartInstance.off('globalout');
    growthChartInstance.on('globalout', () => {
      if (hideTipTimer) clearTimeout(hideTipTimer);
      lastTipSeries = -1;
      lastTipDataIdx = -1;
      growthChartInstance.dispatchAction({ type: 'hideTip' });
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

  // Update summary bar and scope buttons
  if (stats.endpoints_summary) {
    const s = stats.endpoints_summary;
    const summaryBar = document.getElementById('endpoints-summary-bar');
    if (summaryBar) {
      summaryBar.innerHTML = `Official Core Endpoints: <strong>${s.total}</strong> · Active in Plugins: <strong style="color: var(--done);">${s.used_count}</strong> (${((s.used_count/s.total)*100).toFixed(1)}%) · Zero Usage in Ecosystem: <strong style="color: #fab387;">${s.zero_count}</strong> (${((s.zero_count/s.total)*100).toFixed(1)}%)`;
    }
    const epBtnAll = document.querySelector('#endpoints-scope-group button[data-ep-scope="all"]');
    if (epBtnAll) epBtnAll.textContent = `All Official (${s.total})`;
    const epBtnUsed = document.querySelector('#endpoints-scope-group button[data-ep-scope="used"]');
    if (epBtnUsed) epBtnUsed.textContent = `Active in Plugins (${s.used_count})`;
    const epBtnZero = document.querySelector('#endpoints-scope-group button[data-ep-scope="zero"]');
    if (epBtnZero) epBtnZero.textContent = `⚠️ Zero Usage (${s.zero_count})`;
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
    const docUrl = (e.doc_url && !e.doc_url.includes('github.com/herdrdev/herdr/blob')) ? e.doc_url : getEndpointDocUrl(e.endpoint);

    // Type badge label & style
    let typeBadge = '';
    if (e.endpoint.startsWith('cli:') || e.endpoint_type === 'cli_command') {
      typeBadge = `<span class="tag-badge" style="font-size: 0.65rem; padding: 1px 4px; color: #89b4fa; background: rgba(137, 180, 250, 0.12); margin-left: 6px;">CLI</span>`;
    } else if (e.endpoint.startsWith('event:') || e.endpoint_type === 'event_hook') {
      typeBadge = `<span class="tag-badge" style="font-size: 0.65rem; padding: 1px 4px; color: #f9e2af; background: rgba(249, 226, 175, 0.12); margin-left: 6px;">Event</span>`;
    } else {
      typeBadge = `<span class="tag-badge" style="font-size: 0.65rem; padding: 1px 4px; color: #a6e3a1; background: rgba(166, 227, 161, 0.12); margin-left: 6px;">Socket</span>`;
    }

    const totalEcoPlugins = window._ecosystemStats?.total_plugins || 1;
    const valueHtml = (e.cnt === 0)
      ? `<span style="color: #fab387; background: rgba(250, 179, 135, 0.15); border: 1px solid rgba(250, 179, 135, 0.25); padding: 1px 7px; border-radius: 4px; font-family: var(--mono); font-size: 0.72rem; font-weight: 700;">0 plugins (Unused)</span>`
      : `<span style="font-family: var(--mono); font-size: 0.8rem; color: var(--ink);">${e.cnt} <span style="color: var(--faint2); font-size: 0.7rem;">(${((e.cnt / totalEcoPlugins) * 100).toFixed(1)}%)</span></span>`;

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


// Get official documentation URL on herdr.dev for any Herdr endpoint
function getEndpointDocUrl(endpoint) {
  if (!endpoint) return "https://herdr.dev/docs/";
  const raw = String(endpoint).trim();
  const ep = raw.toLowerCase();

  // CLI Commands (e.g. "cli:plugin install", "plugin pane", "pane split")
  if (ep.startsWith('cli:') || ep.startsWith('herdr ')) {
    const cleanCmd = ep.replace(/^cli:\s*/, '').replace(/^herdr\s+/, '').trim();
    const rootCmd = cleanCmd.split(/[\s-]+/)[0];

    switch (rootCmd) {
      case 'plugin':
      case 'plugins':
        return "https://herdr.dev/docs/cli-reference/#plugins";
      case 'pane':
      case 'panes':
        return "https://herdr.dev/docs/cli-reference/#panes";
      case 'tab':
      case 'tabs':
        return "https://herdr.dev/docs/cli-reference/#tabs";
      case 'session':
      case 'sessions':
        return "https://herdr.dev/docs/cli-reference/#sessions";
      case 'workspace':
      case 'workspaces':
        return "https://herdr.dev/docs/cli-reference/#workspaces";
      case 'worktree':
      case 'worktrees':
        return "https://herdr.dev/docs/cli-reference/#worktrees";
      case 'agent':
      case 'agents':
      case 'report':
      case 'release':
        return "https://herdr.dev/docs/cli-reference/#agents";
      case 'server':
        return "https://herdr.dev/docs/cli-reference/#server";
      case 'notification':
      case 'notifications':
        return "https://herdr.dev/docs/cli-reference/#notifications";
      case 'status':
      case 'launch':
        return "https://herdr.dev/docs/cli-reference/#launch-and-status";
      case 'completion':
      case 'completions':
        return "https://herdr.dev/docs/cli-reference/#shell-completions";
      case 'terminal':
      case 'attach':
        return "https://herdr.dev/docs/cli-reference/#direct-terminal-attach";
      case 'wait':
        return "https://herdr.dev/docs/cli-reference/#output-waits";
      case 'integration':
      case 'integrations':
        return "https://herdr.dev/docs/cli-reference/#integrations";
      case 'config':
        return "https://herdr.dev/docs/config-reference/";
      case 'api':
        return "https://herdr.dev/docs/socket-api/";
      default:
        return "https://herdr.dev/docs/cli-reference/";
    }
  }

  // Event hooks (e.g. "event:startup", "event:pane_opened")
  if (ep.startsWith('event:')) {
    return "https://herdr.dev/docs/plugins/#startup-hooks";
  }

  // Socket API methods (e.g. "server.stop", "agent.explain", "ping")
  if (ep.includes('.') || ep === 'ping') {
    if (ep.startsWith('plugin.')) {
      return "https://herdr.dev/docs/socket-api/#plugin-apis";
    }
    if (ep.startsWith('agent.')) {
      return "https://herdr.dev/docs/socket-api/#agent-view-queries";
    }
    if (ep.startsWith('pane.read') || ep.startsWith('read.')) {
      return "https://herdr.dev/docs/socket-api/#reading-panes";
    }
    if (ep.startsWith('wait.')) {
      return "https://herdr.dev/docs/socket-api/#waiting-for-state";
    }
    return "https://herdr.dev/docs/socket-api/#raw-methods";
  }

  // Check if string starts with a known CLI root command without prefix
  const firstWord = ep.split(/[\s-]+/)[0];
  const knownCliRoots = [
    'plugin', 'plugins', 'pane', 'panes', 'tab', 'tabs', 'session', 'sessions',
    'workspace', 'workspaces', 'worktree', 'worktrees', 'agent', 'agents',
    'server', 'notification', 'notifications', 'status', 'launch', 'completion',
    'completions', 'terminal', 'attach', 'wait', 'integration', 'integrations', 'config'
  ];
  if (knownCliRoots.includes(firstWord)) {
    return getEndpointDocUrl('cli:' + ep);
  }

  return "https://herdr.dev/docs/";
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

    const releasesStatus = document.getElementById('releases-status-text');
    if (releasesStatus && weeks.length > 0) {
      releasesStatus.textContent = `Timeline: Launch of Herdr (${weeks[0]}) to Present (${weeks[weeks.length - 1]}) · ${weeks.length} Weekly Intervals`;
    }

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

/* ==============================================================
   Daily Reports & Chronological Capability Timeline Subsystem
   ============================================================== */

let reportsState = {
  reports: [],
  beforeDate: null,
  afterDate: null,
  minDate: '2026-01-01',
  maxDate: '2026-09-15',
  isLoading: false,
  hasMore: true,
  viewMode: 'newspaper', // 'newspaper' or 'compact'
  breakthroughsOnly: false,
  herdrNewsOnly: false,
  agentDetectionOnly: false,
  search: '',
  showLlmEvals: localStorage.getItem('herdr_show_llm_evals') !== 'false',
  observer: null,
  initialized: false
};

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function parseMarkdownToHtml(md) {
  if (!md) return '';
  let html = md;

  // Convert legacy ASCII Barometer block to beautiful HTML table (for backward compatibility)
  html = html.replace(/```[^\n]*\n┌[^\n]+┐\n│([^\n]+)│\n├[^\n]+┤\n([\s\S]*?)\n└[^\n]+┘\n```/g, (match, headerText, rowsText) => {
    const rows = rowsText.split('\n').filter(r => r.includes('│')).map(r => {
      const parts = r.split('│').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        let valHtml = parts[1];
        if (parts[0].includes('Stars')) valHtml = `<span class="barometer-num star">★ ${valHtml.replace(/^★\s*/, '')}</span>`;
        else if (parts[0].includes('Forks')) valHtml = `<span class="barometer-num fork">⑂ ${valHtml.replace(/^⑂\s*/, '')}</span>`;
        else if (parts[0].includes('Plugins')) valHtml = `<span class="barometer-num spot">${valHtml}</span> plugins`;
        else if (parts[0].includes('Repositories')) valHtml = `<span class="barometer-num">${valHtml}</span> repos`;
        else if (parts[0].includes('Capabilities')) valHtml = `<span class="barometer-num cap">${valHtml}</span> distinct APIs`;
        else valHtml = `<span class="barometer-num">${valHtml}</span>`;

        return `      <tr>
        <td class="barometer-label">${parts[0]}</td>
        <td class="barometer-value">${valHtml}</td>
      </tr>`;
      }
      return '';
    }).filter(Boolean).join('\n');

    return `<div class="ecosystem-barometer-card">
  <div class="barometer-header">
    <span class="barometer-title">📊 ${headerText.trim()}</span>
  </div>
  <table class="barometer-table">
    <tbody>
${rows}
    </tbody>
  </table>
</div>`;
  });

  // Code blocks ```lang ... ```
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });

  // Inline code `...`
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
  });

  // Headers
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 ↗</a>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Unordered Lists
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr style="border:none; border-top:1px solid var(--line); margin: 1.25rem 0;">');

  // Paragraphs
  const paras = html.split('\n\n');
  return paras.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<ul') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr') || trimmed.startsWith('<div') || trimmed.startsWith('<table')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
}

function renderReportDayCard(report, viewMode) {
  const isQuiet = report.is_quiet_day === 1;
  const breakthroughs = report.new_capabilities || [];
  const plugins = report.plugins_released || [];
  const herdrEvents = report.herdr_events || [];
  const dateFormatted = formatDisplayDate(report.report_date);
  
  let cardClass = 'report-day-card';
  if (breakthroughs.length > 0) cardClass += ' has-breakthroughs';
  if (herdrEvents.length > 0) cardClass += ' has-herdr-events';

  // Badges Right
  let badgesRight = [];
  
  // 1. Herdr event badges
  if (herdrEvents.length > 0) {
    const agentEvents = herdrEvents.filter(e => e.event_type === 'agent_detection');
    const releaseEvents = herdrEvents.filter(e => e.event_type === 'core_release');
    const featureEvents = herdrEvents.filter(e => e.event_type === 'major_feature');

    if (agentEvents.length > 0) {
      const names = agentEvents.map(e => e.agent_name || 'AI Agent').join(', ');
      badgesRight.push(`<span class="badge-herdr-agent" title="${escapeHtml(names)}">🤖 Agent Detection: ${escapeHtml(names)}</span>`);
    }
    if (releaseEvents.length > 0) {
      const vers = releaseEvents.map(e => e.version_tag || 'Release').join(', ');
      badgesRight.push(`<span class="badge-herdr-release">🏛️ Herdr Core ${escapeHtml(vers)}</span>`);
    }
    if (featureEvents.length > 0 && agentEvents.length === 0 && releaseEvents.length === 0) {
      badgesRight.push(`<span class="badge-herdr-feature">⚡ Herdr Core Milestone</span>`);
    }
  }

  // 2. Breakthrough badge
  if (breakthroughs.length > 0) {
    badgesRight.push(`<span class="breakthrough-count-badge">🌟 ${breakthroughs.length} Breakthrough${breakthroughs.length === 1 ? '' : 's'}</span>`);
  }

  // 3. Quiet or Releases count
  if (isQuiet) {
    badgesRight.push(`<span class="quiet-day-badge">Quiet Incubation Day</span>`);
  } else if (report.plugins_released_count > 0) {
    badgesRight.push(`<span class="report-chip" style="font-size: 0.72rem;">${report.plugins_released_count} Releases</span>`);
  }

  const badgeRightHtml = badgesRight.join(' ');

  // Breakthrough Pills
  let btHtml = '';
  if (breakthroughs.length > 0) {
    const pills = breakthroughs.map(b => `
      <div class="breakthrough-item">
        <span class="breakthrough-pill">${escapeHtml(b.key)}</span>
        <span>${escapeHtml(b.desc)}</span>
      </div>
    `).join('');

    btHtml = `
      <div class="report-breakthroughs-container">
        <div style="font-family: var(--mono); font-size: 0.75rem; color: #fab387; font-weight: 700; margin-bottom: 0.2rem;">
          🌟 ECOSYSTEM BREAKTHROUGHS & NOVEL CAPABILITIES:
        </div>
        ${pills}
      </div>
    `;
  }

  // Herdr Core Callout in Executive Card
  let herdrCardHtml = '';
  if (herdrEvents.length > 0) {
    const topHe = herdrEvents[0];
    const isAgent = topHe.event_type === 'agent_detection';
    const cardModClass = isAgent ? 'report-herdr-dispatch-card agent-detection' : 'report-herdr-dispatch-card';
    const typeLabel = isAgent ? 'AGENT DETECTION MILESTONE' : (topHe.event_type === 'core_release' ? 'OFFICIAL CORE RELEASE' : 'HERDR CORE DISPATCH');
    const commitHtml = topHe.commit_hash ? `<div class="herdr-dispatch-commit"><a href="https://github.com/herdrdev/herdr/commit/${topHe.commit_hash}" target="_blank" rel="noopener">Herdr Core Commit <code>${escapeHtml(topHe.commit_hash.slice(0, 7))}</code> ↗</a></div>` : '';
    
    herdrCardHtml = `
      <div class="${cardModClass}">
        <div class="herdr-dispatch-header">
          <span class="herdr-pulse-dot"></span>
          <strong>⚡ ${typeLabel}</strong>
          <span class="herdr-event-type-tag">${escapeHtml(topHe.event_type.replace('_', ' ').toUpperCase())}</span>
        </div>
        <div class="herdr-dispatch-title">${escapeHtml(topHe.headline)}</div>
        <div class="herdr-dispatch-summary">${escapeHtml(topHe.summary)}</div>
        ${commitHtml}
      </div>
    `;
  }

  // Helper: render LLM evaluation card
  function renderPluginLlmCard(ev, isHidden) {
    if (!ev) return '';
    const hiddenClass = isHidden ? 'llm-hidden' : '';
    return `
      <div class="plugin-llm-card ${hiddenClass}" data-plugin="${escapeHtml(ev.repo_full_name)}">
        <div class="llm-card-header">
          <span class="llm-badge">🤖 ARCHITECT'S CODE SURVEY · ${escapeHtml(ev.repo_full_name)}</span>
          <span class="llm-model-tag">Meta Muse · ${escapeHtml(ev.model_name)}</span>
        </div>
        <div class="llm-card-body">
          <div class="llm-section">
            <h5>1. Overview</h5>
            <div>${parseMarkdownToHtml(ev.overview)}</div>
          </div>
          <div class="llm-section">
            <h5>2. Capabilities</h5>
            <div>${parseMarkdownToHtml(ev.capabilities)}</div>
          </div>
          <div class="llm-section">
            <h5>3. Architecture</h5>
            <div>${parseMarkdownToHtml(ev.architecture)}</div>
          </div>
          <div class="llm-section">
            <h5>4. Herdr Integration</h5>
            <div>${parseMarkdownToHtml(ev.herdr_integration)}</div>
          </div>
          <div class="llm-section">
            <h5>5. Dependencies</h5>
            <div>${parseMarkdownToHtml(ev.dependencies)}</div>
          </div>
          <div class="llm-section">
            <h5>6. Extensibility & Limitations</h5>
            <div>${parseMarkdownToHtml(ev.extensibility_limitations)}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Body content based on view mode
  let bodyContent = '';
  if (viewMode === 'newspaper') {
    let newspaperHtml = parseMarkdownToHtml(report.long_form_content);
    if (report.llm_evaluations && report.llm_evaluations.length > 0) {
      report.llm_evaluations.forEach(ev => {
        const cardHtml = renderPluginLlmCard(ev, !reportsState.showLlmEvals);
        const safeName = ev.repo_full_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(<h4[^>]*>[\\s\\S]*?${safeName}[\\s\\S]*?<\\/h4>[\\s\\S]*?)(?=<h4|<h3|$)`, 'i');
        if (regex.test(newspaperHtml)) {
          newspaperHtml = newspaperHtml.replace(regex, `$1\n${cardHtml}\n`);
        } else {
          newspaperHtml += cardHtml;
        }
      });
    }

    bodyContent = `
      <div class="report-newspaper-body">
        ${newspaperHtml}
      </div>
    `;
  } else {
    // Compact mode: show list of plugins released on this day or a quiet pulse row
    if (isQuiet && herdrEvents.length === 0) {
      bodyContent = `
        <div class="report-compact-list">
          <div style="font-family: var(--mono); color: var(--faint2); font-size: 0.82rem; padding: 0.5rem 0;">
            No new plugins published on this calendar date. Existing ${report.cumulative_plugins_count} plugins maintained steady operations.
          </div>
        </div>
      `;
    } else {
      const pluginRows = plugins.map(p => {
        const ev = (report.llm_evaluations || []).find(e => e.repo_full_name === p.fullName || e.plugin_id === p.id);
        const cardHtml = ev ? renderPluginLlmCard(ev, !reportsState.showLlmEvals) : '';
        return `
          <div class="compact-plugin-item" style="margin-bottom: 0.75rem;">
            <div class="compact-plugin-row" onclick="openPluginModalByName('${escapeHtml(p.fullName)}')" style="cursor: pointer;">
              <div class="compact-plugin-left">
                <span style="font-size: 1.1rem;">📦</span>
                <div>
                  <span class="compact-plugin-name">${escapeHtml(p.fullName)}</span>
                  <span style="font-size: 0.75rem; color: var(--faint2); margin-left: 0.5rem;">${escapeHtml(p.cat || 'Utility')}</span>
                </div>
              </div>
              <div class="compact-plugin-right">
                <span class="lang-tag" style="background: ${LANG_COLORS[p.lang] || '#888'}; color: #000; font-size: 0.7rem; padding: 0.15rem 0.4rem; border-radius: 3px; font-weight: 600;">${p.lang || 'Unknown'}</span>
                <span style="color: var(--spot); font-weight: 700;">★ ${p.stars || 0}</span>
                <span>${(p.loc || 0).toLocaleString()} LOC</span>
                <span style="color: var(--spot);">Details ↗</span>
              </div>
            </div>
            ${cardHtml}
          </div>
        `;
      }).join('');

      bodyContent = `
        <div class="report-compact-list">
          ${pluginRows}
        </div>
      `;
    }
  }

  return `
    <article class="${cardClass}" id="day-${report.report_date}" data-date="${report.report_date}">
      <div class="report-day-header">
        <div class="report-date-badge">
          <span class="report-day-num">DAY ${report.day_number}</span>
          <span>${dateFormatted}</span>
        </div>
        <div class="report-badges-right">
          ${badgeRightHtml}
        </div>
      </div>

      <div class="report-exec-card">
        <h3 class="report-headline">${escapeHtml(report.headline)}</h3>
        
        <div class="report-meta-chips">
          <span class="report-chip spotlight">${report.plugins_released_count} New Releases</span>
          <span class="report-chip">${(report.cumulative_plugins_count || 0).toLocaleString()} Total Ecosystem</span>
          <span class="report-chip">★ ${(report.cumulative_stars_count || 0).toLocaleString()} Cumulative Stars</span>
          <span class="report-chip">⑂ ${(report.cumulative_forks_count || 0).toLocaleString()} Forks</span>
          ${herdrEvents.length > 0 ? `<span class="report-chip" style="color: #cba6f7; border-color: rgba(203,166,247,0.4);">⚡ ${herdrEvents.length} Herdr Milestone${herdrEvents.length === 1 ? '' : 's'}</span>` : ''}
        </div>

        <p class="report-summary-text">${escapeHtml(report.executive_summary)}</p>

        ${herdrCardHtml}
        ${btHtml}
      </div>

      ${bodyContent}
    </article>
  `;
}

function openPluginModalByName(fullName) {
  const plugin = allPlugins.find(p => p.repo_full_name === fullName);
  if (plugin) {
    openDetailModal(plugin.id);
  } else {
    fetch(`/api/plugins?q=${encodeURIComponent(fullName)}&limit=1`)
      .then(r => r.json())
      .then(data => {
        if (data.plugins && data.plugins.length > 0) {
          openDetailModal(data.plugins[0].id);
        }
      });
  }
}
window.openPluginModalByName = openPluginModalByName;

async function loadReportsBatch(reset = false, customParams = '', scrollToTop = true) {
  if (reportsState.isLoading) return;
  reportsState.isLoading = true;

  const loaderEl = document.getElementById('reports-loader');
  if (loaderEl) loaderEl.style.display = 'block';

  let url = `/api/daily-reports?limit=5`;

  if (customParams) {
    url += customParams;
  } else if (!reset && reportsState.beforeDate) {
    url += `&before_date=${reportsState.beforeDate}`;
  }

  if (reportsState.breakthroughsOnly) {
    url += `&breakthroughs_only=true`;
  }
  if (reportsState.herdrNewsOnly) {
    url += `&herdr_news_only=true`;
  }
  if (reportsState.agentDetectionOnly) {
    url += `&agent_detection_only=true`;
  }
  if (reportsState.search) {
    url += `&search=${encodeURIComponent(reportsState.search)}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    const feed = document.getElementById('reports-feed-container');

    if (reset) {
      feed.innerHTML = '';
      reportsState.reports = [];
    }

    if (!data.reports || data.reports.length === 0) {
      reportsState.hasMore = false;
      if (reset) {
        feed.innerHTML = `
          <div style="text-align: center; padding: 4rem 1rem; color: var(--faint2); font-family: var(--mono);">
            No daily reports match the current query criteria.
          </div>
        `;
        if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (loaderEl) loaderEl.style.display = 'none';
      reportsState.isLoading = false;
      return;
    }

    reportsState.reports.push(...data.reports);
    reportsState.beforeDate = data.next_cursor;
    reportsState.hasMore = !!data.next_cursor;

    const cardsHtml = data.reports.map(r => renderReportDayCard(r, reportsState.viewMode)).join('');
    if (reset) {
      feed.innerHTML = cardsHtml;
      const datePickerEl = document.getElementById('reports-date-picker');
      if (datePickerEl && data.reports[0] && data.reports[0].report_date && !customParams.includes('&date=')) {
        datePickerEl.value = data.reports[0].report_date;
      }
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      feed.insertAdjacentHTML('beforeend', cardsHtml);
    }

    if (!reportsState.hasMore && loaderEl) {
      loaderEl.style.display = 'none';
    }
  } catch (err) {
    console.error('Failed to load daily reports:', err);
  } finally {
    reportsState.isLoading = false;
  }
}

async function initDailyReports(targetDate = null, scrollToTop = true) {
  const isFirstInit = !reportsState.initialized;
  if (isFirstInit) {
    reportsState.initialized = true;

    try {
      const statsRes = await fetch('/api/daily-reports/stats');
      const stats = await statsRes.json();
      if (stats.end_date) {
        reportsState.maxDate = stats.end_date;
      }
      if (stats.start_date) {
        reportsState.minDate = stats.start_date;
      }
      const statsBar = document.getElementById('reports-stats-bar');
      if (statsBar) {
        statsBar.innerHTML = `
          <span>📅 Calendar Coverage: ${formatDisplayDate(stats.start_date || '2026-01-01')} – ${formatDisplayDate(stats.end_date || '2026-09-15')} (${stats.total_days || 258} Days)</span>
          <span>Total Ecosystem: <strong>${stats.total_plugins || 1140} Plugins</strong> (${stats.total_repos || 1133} Repositories) · Active Dispatch Days: ${stats.active_days || 148} · Herdr Core Milestones: ${stats.total_herdr_events || 85} · Breakthroughs: ${stats.total_breakthroughs || 187}</span>
        `;
      }

      const datePicker = document.getElementById('reports-date-picker');
      if (datePicker) {
        datePicker.min = stats.start_date || '2026-01-01';
        datePicker.max = stats.end_date || '2026-09-15';
        if (!targetDate) {
          datePicker.value = stats.end_date || '2026-09-15';
        }
      }

      const btnToday = document.getElementById('btn-jump-today');
      if (btnToday && stats.end_date) {
        const dParts = stats.end_date.split('-');
        if (dParts.length === 3) {
          const dObj = new Date(parseInt(dParts[0], 10), parseInt(dParts[1], 10) - 1, parseInt(dParts[2], 10));
          const shortDate = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          btnToday.textContent = `Today (${shortDate})`;
        }
      }
    } catch (err) {
      console.error('Failed to load reports stats:', err);
    }

    // Setup Date Picker
    const datePicker = document.getElementById('reports-date-picker');
    if (datePicker) {
      datePicker.addEventListener('change', (e) => {
        const selected = e.target.value;
        if (selected) {
          reportsState.beforeDate = null;
          loadReportsBatch(true, `&date=${selected}`, true);
        }
      });
    }

    // Button: Today
    const btnToday = document.getElementById('btn-jump-today');
    if (btnToday) {
      btnToday.addEventListener('click', () => {
        const todayVal = reportsState.maxDate || '2026-09-15';
        if (datePicker) datePicker.value = todayVal;
        reportsState.beforeDate = null;
        loadReportsBatch(true, '', true);
      });
    }

    // Button: Genesis
    const btnGenesis = document.getElementById('btn-jump-genesis');
    if (btnGenesis) {
      btnGenesis.addEventListener('click', () => {
        if (datePicker) datePicker.value = '2026-01-01';
        reportsState.beforeDate = null;
        loadReportsBatch(true, `&date=2026-01-01`, true);
      });
    }

    // Button: Next Active Day
    const btnNextActive = document.getElementById('btn-next-active-day');
    if (btnNextActive) {
      btnNextActive.addEventListener('click', async () => {
        let cur = datePicker ? datePicker.value : null;
        const visibleArticles = document.querySelectorAll('#reports-feed-container article[data-date]');
        for (const art of visibleArticles) {
          const rect = art.getBoundingClientRect();
          if (rect.bottom > 100) {
            cur = art.getAttribute('data-date');
            break;
          }
        }
        if (!cur) cur = '2026-01-01';

        try {
          const res = await fetch(`/api/daily-reports/next-active?date=${encodeURIComponent(cur)}`);
          const data = await res.json();
          if (data.found && data.next_date) {
            if (datePicker) datePicker.value = data.next_date;
            reportsState.beforeDate = null;
            await loadReportsBatch(true, `&date=${data.next_date}`, true);
          }
        } catch (err) {
          console.error('Failed to navigate to next active day:', err);
        }
      });
    }

    // Breakthroughs Filter Toggle
    const btToggle = document.getElementById('reports-breakthroughs-toggle');
    if (btToggle) {
      btToggle.addEventListener('change', (e) => {
        reportsState.breakthroughsOnly = e.target.checked;
        reportsState.beforeDate = null;
        loadReportsBatch(true, '', true);
      });
    }

    // Herdr Core News Filter Toggle
    const herdrToggle = document.getElementById('reports-herdr-news-toggle');
    if (herdrToggle) {
      herdrToggle.addEventListener('change', (e) => {
        reportsState.herdrNewsOnly = e.target.checked;
        reportsState.beforeDate = null;
        loadReportsBatch(true, '', true);
      });
    }

    // Agent Detections Filter Toggle
    const agentToggle = document.getElementById('reports-agent-detect-toggle');
    if (agentToggle) {
      agentToggle.addEventListener('change', (e) => {
        reportsState.agentDetectionOnly = e.target.checked;
        reportsState.beforeDate = null;
        loadReportsBatch(true, '', true);
      });
    }

    // Search Input
    const searchInput = document.getElementById('reports-search-input');
    let searchTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          reportsState.search = e.target.value.trim();
          reportsState.beforeDate = null;
          loadReportsBatch(true, '', true);
        }, 300);
      });
    }

    // View Mode: Newspaper vs Compact
    const btnNewspaper = document.getElementById('btn-view-newspaper');
    const btnCompact = document.getElementById('btn-view-compact');

    if (btnNewspaper && btnCompact) {
      btnNewspaper.addEventListener('click', () => {
        if (reportsState.viewMode === 'newspaper') return;
        reportsState.viewMode = 'newspaper';
        btnNewspaper.classList.add('active');
        btnCompact.classList.remove('active');
        const feed = document.getElementById('reports-feed-container');
        if (feed && reportsState.reports.length > 0) {
          feed.innerHTML = reportsState.reports.map(r => renderReportDayCard(r, 'newspaper')).join('');
        }
      });

      btnCompact.addEventListener('click', () => {
        if (reportsState.viewMode === 'compact') return;
        reportsState.viewMode = 'compact';
        btnCompact.classList.add('active');
        btnNewspaper.classList.remove('active');
        const feed = document.getElementById('reports-feed-container');
        if (feed && reportsState.reports.length > 0) {
          feed.innerHTML = reportsState.reports.map(r => renderReportDayCard(r, 'compact')).join('');
        }
      });
    }

    // Toggle AI Code Survey
    const btnToggleLlm = document.getElementById('btn-toggle-llm-eval');
    if (btnToggleLlm) {
      const updateLlmBtn = () => {
        if (reportsState.showLlmEvals) {
          btnToggleLlm.classList.add('active');
          const badge = btnToggleLlm.querySelector('.toggle-status-badge');
          if (badge) badge.textContent = 'ON';
        } else {
          btnToggleLlm.classList.remove('active');
          const badge = btnToggleLlm.querySelector('.toggle-status-badge');
          if (badge) badge.textContent = 'OFF';
        }
      };
      updateLlmBtn();

      btnToggleLlm.addEventListener('click', () => {
        reportsState.showLlmEvals = !reportsState.showLlmEvals;
        localStorage.setItem('herdr_show_llm_evals', reportsState.showLlmEvals ? 'true' : 'false');
        updateLlmBtn();
        document.querySelectorAll('.plugin-llm-card').forEach(card => {
          if (reportsState.showLlmEvals) {
            card.classList.remove('llm-hidden');
          } else {
            card.classList.add('llm-hidden');
          }
        });
      });
    }

    // Setup Infinite Scroll IntersectionObserver
    const loaderEl = document.getElementById('reports-loader');
    if (loaderEl && 'IntersectionObserver' in window) {
      reportsState.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !reportsState.isLoading && reportsState.hasMore) {
          loadReportsBatch(false);
        }
      }, { rootMargin: '400px' });
      reportsState.observer.observe(loaderEl);
    }
  }

  // Handle batch loading:
  const datePicker = document.getElementById('reports-date-picker');
  if (targetDate) {
    if (datePicker) datePicker.value = targetDate;
    reportsState.beforeDate = null;
    return loadReportsBatch(true, `&date=${targetDate}`, scrollToTop);
  } else if (isFirstInit && reportsState.reports.length === 0) {
    return loadReportsBatch(true, '', true);
  }
}

