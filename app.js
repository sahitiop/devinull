const GITHUB_REPOS_URL = 'https://api.github.com/users/sahitiop/repos?per_page=100&sort=updated';
const EPSS_URL = 'https://api.first.org/data/v1/epss?limit=3&sort=-epss';
const FIRST_NEWS_URL = 'https://api.first.org/data/v1/news?limit=4&sort=-published';
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });

  elements.forEach((element) => observer.observe(element));
}

function setupMenu() {
  const button = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');
  const closeMenu = () => {
    button.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    button.querySelector('span').textContent = '+';
  };

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    button.querySelector('span').textContent = isOpen ? '+' : '×';
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function setupAtmosphere() {
  const canvas = document.getElementById('atmosphere');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let points = [];
  let mouse = { x: -999, y: -999 };
  let animationId = 0;
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * ratio);
    canvas.height = Math.floor(innerHeight * ratio);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(62, Math.floor(innerWidth / 20));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.3 + 0.2,
    }));
    draw(false);
  };

  const draw = (animate) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    points.forEach((point, index) => {
      if (animate) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > innerWidth) point.vx *= -1;
        if (point.y < 0 || point.y > innerHeight) point.vy *= -1;
        const distanceFromPointer = Math.hypot(point.x - mouse.x, point.y - mouse.y);
        if (distanceFromPointer < 180) {
          point.x += (point.x - mouse.x) * 0.002;
          point.y += (point.y - mouse.y) * 0.002;
        }
      }

      ctx.beginPath();
      ctx.fillStyle = 'rgba(170,255,235,.42)';
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();

      for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
        const nextPoint = points[nextIndex];
        const distance = Math.hypot(point.x - nextPoint.x, point.y - nextPoint.y);
        if (distance < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(87,224,201,${0.095 * (1 - distance / 130)})`;
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextPoint.x, nextPoint.y);
          ctx.stroke();
        }
      }
    });

    if (animate) animationId = requestAnimationFrame(() => draw(true));
  };

  const start = () => {
    cancelAnimationFrame(animationId);
    draw(!prefersReducedMotion);
  };
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (event) => {
    mouse = { x: event.clientX, y: event.clientY };
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else start();
  });
  if (!prefersReducedMotion) start();
}

function setupThreatMap() {
  const canvas = document.getElementById('threatMap');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const signals = [
    { x: 0.16, y: 0.38, color: '#5ce5ff', size: 3 },
    { x: 0.32, y: 0.32, color: '#ff9754', size: 4 },
    { x: 0.48, y: 0.45, color: '#c8ff54', size: 3 },
    { x: 0.64, y: 0.31, color: '#ff9754', size: 4 },
    { x: 0.76, y: 0.5, color: '#5ce5ff', size: 3 },
    { x: 0.83, y: 0.25, color: '#c8ff54', size: 2 },
    { x: 0.59, y: 0.72, color: '#ff9754', size: 3 },
  ];
  const land = [
    [0.1, 0.25, 0.17, 0.19, 0.25, 0.22, 0.29, 0.31, 0.25, 0.42, 0.19, 0.4, 0.13, 0.34],
    [0.31, 0.2, 0.42, 0.14, 0.55, 0.18, 0.61, 0.29, 0.55, 0.37, 0.48, 0.35, 0.42, 0.42, 0.36, 0.35],
    [0.59, 0.22, 0.67, 0.17, 0.78, 0.25, 0.86, 0.22, 0.91, 0.31, 0.84, 0.4, 0.76, 0.38, 0.69, 0.48, 0.61, 0.4],
    [0.42, 0.47, 0.51, 0.49, 0.56, 0.63, 0.52, 0.81, 0.45, 0.73, 0.39, 0.58],
    [0.74, 0.53, 0.85, 0.55, 0.88, 0.69, 0.81, 0.79, 0.74, 0.7],
  ];
  let animationId = 0;

  const draw = (time = 0, animate = true) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(rect.width * ratio);
    const height = Math.floor(rect.height * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#081518';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = 'rgba(104,222,206,.12)';
    ctx.lineWidth = 0.6;
    for (let x = 0; x < rect.width; x += rect.width / 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rect.height); ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += rect.height / 7) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rect.width, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(114,246,223,.25)';
    ctx.fillStyle = 'rgba(31,102,95,.20)';
    land.forEach((shape) => {
      ctx.beginPath();
      shape.forEach((value, index) => {
        if (index % 2) ctx.lineTo(shape[index - 1] * rect.width, value * rect.height);
        else ctx.moveTo(value * rect.width, shape[index + 1] * rect.height);
      });
      ctx.closePath(); ctx.fill(); ctx.stroke();
    });

    signals.forEach((point, index) => {
      const pulse = animate ? Math.sin(time / 630 + index) : 0;
      const x = point.x * rect.width;
      const y = point.y * rect.height;
      ctx.beginPath(); ctx.fillStyle = point.color; ctx.shadowBlur = 16; ctx.shadowColor = point.color;
      ctx.arc(x, y, point.size + pulse * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.strokeStyle = point.color; ctx.globalAlpha = animate ? 0.28 + Math.sin(time / 500 + index) * 0.13 : 0.28;
      ctx.arc(x, y, 16 + (animate ? (Math.sin(time / 500 + index) + 1) * 7 : 0), 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      signals.forEach((nextPoint, nextIndex) => {
        if (index >= nextIndex) return;
        ctx.beginPath(); ctx.strokeStyle = 'rgba(104,229,212,.17)'; ctx.setLineDash([3, 6]);
        ctx.lineDashOffset = animate ? -time / 45 : 0;
        ctx.moveTo(x, y); ctx.lineTo(nextPoint.x * rect.width, nextPoint.y * rect.height); ctx.stroke(); ctx.setLineDash([]);
      });
    });

    if (animate) animationId = requestAnimationFrame((nextTime) => draw(nextTime, true));
  };

  const start = () => {
    cancelAnimationFrame(animationId);
    draw(0, !prefersReducedMotion);
  };
  start();
  addEventListener('resize', start);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else start();
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>\'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function formatDate(value, options = { month: 'short', year: 'numeric' }) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'DATE UNAVAILABLE' : date.toLocaleDateString('en-US', options).toUpperCase();
}

function setupCursorEffects() {
  if (matchMedia('(pointer: coarse)').matches || prefersReducedMotion) return;
  const core = document.getElementById('cursorCore');
  const trail = document.getElementById('cursorTrail');
  let targetX = -80; let targetY = -80; let trailX = -80; let trailY = -80;
  let animationId = 0;
  addEventListener('pointermove', (event) => {
    targetX = event.clientX; targetY = event.clientY;
    core.style.left = `${targetX}px`; core.style.top = `${targetY}px`;
  }, { passive: true });
  const animateCursor = () => {
    if (document.hidden) return;
    trailX += (targetX - trailX) * 0.16; trailY += (targetY - trailY) * 0.16;
    trail.style.left = `${trailX}px`; trail.style.top = `${trailY}px`;
    animationId = requestAnimationFrame(animateCursor);
  };
  const setHoverState = (isHovering) => {
    trail.style.width = isHovering ? '48px' : '26px';
    trail.style.height = isHovering ? '48px' : '26px';
    trail.style.borderColor = isHovering ? 'rgba(92,229,255,.9)' : 'rgba(200,255,84,.65)';
    core.style.transform = isHovering ? 'translate(-50%,-50%) scale(.55)' : 'translate(-50%,-50%) scale(1)';
  };
  document.addEventListener('pointerover', (event) => {
    if (event.target.closest('a, button, .github-project-card')) setHoverState(true);
  });
  document.addEventListener('pointerout', (event) => {
    if (event.target.closest('a, button, .github-project-card') && !event.relatedTarget?.closest('a, button, .github-project-card')) setHoverState(false);
  });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(animationId);
    if (!document.hidden) animateCursor();
  });
  animateCursor();
}

function renderGithubProjects(repositories) {
  const grid = document.getElementById('githubProjectGrid');
  grid.innerHTML = repositories.map((repo, index) => {
    const name = escapeHtml(String(repo.name || 'Repository').replace(/[-_]/g, ' '));
    const description = escapeHtml(repo.description || 'A public project from the DeviNull GitHub profile.');
    const language = escapeHtml(repo.language || 'CODE');
    const url = safeHttpsUrl(repo.html_url);
    const updated = formatDate(repo.updated_at);
    const stars = Number.isFinite(Number(repo.stargazers_count)) ? Number(repo.stargazers_count) : 0;
    return `<article class="github-project-card">
      <div class="github-repo-meta"><span>${String(index + 1).padStart(2, '0')} / REPOSITORY</span><span>${language}</span></div>
      <h3>${name}</h3><p>${description}</p>
      <div class="repo-bottom"><span>UPDATED ${updated} · ★ ${stars}</span>${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${name} on GitHub">↗</a>` : ''}</div>
    </article>`;
  }).join('');
}

async function loadGithubProjects() {
  const button = document.getElementById('loadGithubProjects');
  const status = document.getElementById('githubProjectStatus');
  const grid = document.getElementById('githubProjectGrid');
  button.disabled = true;
  button.innerHTML = '<span class="button-icon">◌</span> SYNCHRONISING';
  status.innerHTML = 'CONTACTING GITHUB <span>•</span> PUBLIC REPOSITORY FEED';
  grid.innerHTML = '<p class="github-project-empty">Retrieving public project metadata…</p>';

  try {
    const response = await fetch(GITHUB_REPOS_URL, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const repositories = await response.json();
    const visible = repositories
      .filter((repo) => !repo.fork && !repo.archived && safeHttpsUrl(repo.html_url)?.startsWith('https://github.com/'))
      .slice(0, 6);
    if (!visible.length) throw new Error('No public repositories available');
    renderGithubProjects(visible);
    status.innerHTML = `SYNCHRONISED <span>•</span> ${visible.length} PUBLIC REPOSITORIES`;
    button.innerHTML = '<span class="button-icon">✓</span> PROJECTS UPDATED';
  } catch (error) {
    status.innerHTML = 'SYNC UNAVAILABLE <span>•</span> TRY AGAIN LATER';
    grid.innerHTML = '<p class="github-project-empty">GitHub could not be reached. Your public repositories will appear here when the connection is available.</p>';
    button.innerHTML = '<span class="button-icon">↻</span> RETRY SYNCHRONISATION';
    console.info('GitHub project synchronisation unavailable.', error.message);
  } finally {
    button.disabled = false;
  }
}

function renderVulnerabilities(items, updatedAt) {
  const feed = document.getElementById('vulnerabilityFeed');
  const highest = Math.max(...items.map((item) => Number(item.epss)).filter(Number.isFinite));
  feed.innerHTML = items.map((item) => {
    const cve = /^CVE-\d{4}-\d{4,}$/i.test(item.cve) ? item.cve.toUpperCase() : 'VULNERABILITY RECORD';
    const summary = escapeHtml(item.summary || 'Public vulnerability record with an elevated exploit-likelihood estimate.');
    const score = Number(item.epss);
    const cveUrl = cve.startsWith('CVE-') ? `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(cve)}` : null;
    return `<article class="vuln-item"><strong>${cveUrl ? `<a href="${cveUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(cve)} ↗</a>` : escapeHtml(cve)}</strong><p>${summary}</p><span>EPSS ${Number.isFinite(score) ? `${(score * 100).toFixed(1)}%` : 'N/A'}</span></article>`;
  }).join('');
  document.getElementById('feedStatus').textContent = 'LIVE DATA';
  document.getElementById('epssMetric').textContent = Number.isFinite(highest) ? `${(highest * 100).toFixed(1)}%` : '--';
  document.getElementById('cveMetric').textContent = String(items.length).padStart(2, '0');
  document.getElementById('epssDate').textContent = formatDate(updatedAt, { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderFeedUnavailable(element, message) {
  element.innerHTML = `<p class="feed-empty">${escapeHtml(message)}</p>`;
}

async function loadEpss() {
  const status = document.getElementById('feedStatus');
  const feed = document.getElementById('vulnerabilityFeed');
  status.textContent = 'CONNECTING';
  renderFeedUnavailable(feed, 'Loading FIRST EPSS records…');
  try {
    const response = await fetch(EPSS_URL);
    if (!response.ok) throw new Error(`FIRST returned ${response.status}`);
    const payload = await response.json();
    const items = Array.isArray(payload.data) ? payload.data.slice(0, 3) : [];
    if (!items.length) throw new Error('No EPSS records returned');
    renderVulnerabilities(items, items[0].date || new Date());
  } catch (error) {
    status.textContent = 'UNAVAILABLE';
    document.getElementById('epssDate').textContent = 'FEED OFFLINE';
    document.getElementById('epssMetric').textContent = '--';
    document.getElementById('cveMetric').textContent = '--';
    renderFeedUnavailable(feed, 'FIRST EPSS could not be reached right now. Use the source link below to view the latest records.');
    console.info('FIRST EPSS feed unavailable.', error.message);
  }
}

function renderNews(items) {
  const feed = document.getElementById('securityNews');
  const usable = items.filter((item) => item && (item.title || item.name || item.summary || item.description));
  if (!usable.length) throw new Error('No usable news items returned');
  feed.innerHTML = usable.slice(0, 4).map((item) => {
    const title = escapeHtml(item.title || item.name || item.summary || item.description);
    const details = escapeHtml(item.summary || item.description || 'Open the FIRST item for details.');
    const url = safeHttpsUrl(item.url || item.link || item.href);
    const date = formatDate(item.published || item.date || item.created || item.updated, { month: 'short', day: 'numeric' });
    return `<article class="news-item"><div class="news-meta"><span>${date}</span><span>FIRST</span></div><h3>${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${title} <span aria-hidden="true">↗</span></a>` : title}</h3><p>${details}</p></article>`;
  }).join('');
  document.getElementById('newsStatus').textContent = `${usable.length} ITEMS`;
}

async function loadSecurityNews() {
  const status = document.getElementById('newsStatus');
  const feed = document.getElementById('securityNews');
  status.textContent = 'CONNECTING';
  renderFeedUnavailable(feed, 'Retrieving public security briefings…');
  try {
    const response = await fetch(FIRST_NEWS_URL);
    if (!response.ok) throw new Error(`FIRST returned ${response.status}`);
    const payload = await response.json();
    renderNews(Array.isArray(payload.data) ? payload.data : []);
  } catch (error) {
    status.textContent = 'UNAVAILABLE';
    renderFeedUnavailable(feed, 'FIRST briefings could not be reached. Visit the newsroom link below for recent updates.');
    console.info('FIRST news feed unavailable.', error.message);
  }
}

function refreshIntel() {
  const button = document.getElementById('refreshIntel');
  button.disabled = true;
  button.textContent = 'SYNCING…';
  Promise.all([loadEpss(), loadSecurityNews()]).finally(() => {
    button.disabled = false;
    button.textContent = 'SYNC FEEDS ↻';
  });
}

function updateClock() {
  document.getElementById('map-clock').textContent = `UTC ${new Date().toUTCString().slice(17, 25)}`;
}

setupReveal();
setupMenu();
setupAtmosphere();
setupCursorEffects();
setupThreatMap();
document.getElementById('loadGithubProjects').addEventListener('click', loadGithubProjects);
document.getElementById('refreshIntel').addEventListener('click', refreshIntel);
updateClock();
setInterval(updateClock, 1000);
loadGithubProjects();
refreshIntel();
