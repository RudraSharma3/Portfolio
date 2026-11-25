/* Behaviour for the portfolio. Content lives in data.js.
   Motion follows one rule: things fade and rise a little as they scroll in, once. */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const arrowOut = '<span class="arrow" aria-hidden="true">↗</span>';

  /* ---------- scroll reveal (fade + 16px rise, once) ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
  // with reduced motion there is nothing to animate, so show everything straight away
  const watch = (root = document) => $$('[data-reveal], .plate, .langbar, .receipt', root)
    .forEach((el) => (reduce ? el.classList.add('is-in') : revealIO.observe(el)));

  /* ---------- 1. projects as chapters ---------- */
  function plate(p, i) {
    const nodes = p.flow.map((f, k) =>
      (k ? `<span class="link-v" style="--i:${k * 2 - 1}" aria-hidden="true"></span>` : '') +
      `<div class="node${f[2] ? ' hl' : ''}" style="--i:${k * 2}"><b>${esc(f[0])}</b><small>${esc(f[1])}</small></div>`
    ).join('');
    return `<div class="plate" aria-hidden="true">
      <div class="plate-top"><span>Fig. ${pad(i + 1)}</span><span>${esc(p.year)}</span></div>
      <div class="plate-in">${nodes}</div>
      <div class="plate-cap"><span>${esc(p.fig)}</span></div>
      <span class="plate-num">${pad(i + 1)}</span>
    </div>`;
  }

  function linksHTML(p, cls) {
    return p.links.map(([label, url]) => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ${arrowOut}</a>`).join('');
  }

  const chapters = $('#chapters');
  if (chapters && typeof PROJECTS !== 'undefined') {
    chapters.innerHTML = PROJECTS.map((p, i) => `
      <li class="chapter${i % 2 ? ' flip' : ''}" id="p-${p.id}" data-reveal>
        <button class="plate-btn" type="button" data-open="${p.id}" aria-label="Open the full breakdown of ${esc(p.name)}">${plate(p, i)}</button>
        <div class="ch-text">
          <p class="eyebrow">Project ${pad(i + 1)}</p>
          <h3 class="t-h1">${esc(p.name)}</h3>
          <p class="ch-meta">${esc(p.where)} · ${esc(p.year)}</p>
          <p class="t-lead">${esc(p.line)}</p>
          <div class="minis">${p.metrics.map((m) => `<div><b>${esc(m[0])}</b><small>${esc(m[1])}</small></div>`).join('')}</div>
          <div class="ch-links">
            <button class="more" type="button" data-open="${p.id}">Read the breakdown <span class="arrow" aria-hidden="true">→</span></button>
            ${p.links.length ? linksHTML(p, 'ext') : `<span class="note">${esc(p.note || 'Private repository')}</span>`}
          </div>
        </div>
      </li>`).join('');
  }

  /* ---------- 2. habits ---------- */
  const habits = $('#habits-list');
  if (habits && typeof HABITS !== 'undefined') {
    habits.innerHTML = HABITS.map((h, i) => `
      <li data-reveal style="--d:${(i % 4) * 0.06}s">
        <button class="habit" type="button" data-habit="${i}">
          <span class="n">${pad(i + 1)}</span>
          <h3>${esc(h.title)}</h3>
          <p>${esc(h.line)}</p>
          <span class="more">Where it shows up <span class="arrow" aria-hidden="true">→</span></span>
        </button>
      </li>`).join('');
  }

  /* ---------- 3. GitHub archive, by year ---------- */
  const tabs = $('#tabs'), repos = $('#repos'), yearNote = $('#year-note');
  const langColor = (l) => (LANGS.find((x) => x[0] === l) || LANGS[LANGS.length - 1])[2];

  function renderYear(y, animate) {
    const list = ARCHIVE.filter((r) => r.y === y);
    const html = list.map((r) => `
      <li class="repo">
        <h3>${esc(r.name)}${r.tag ? `<em>${esc(r.tag)}</em>` : ''}</h3>
        <div class="go">
          ${r.live ? `<a href="${esc(r.live)}" target="_blank" rel="noopener" aria-label="${esc(r.name)} live site">Live ${arrowOut}</a>` : ''}
          <a href="${GH + esc(r.repo)}" target="_blank" rel="noopener" aria-label="${esc(r.name)} on GitHub">Code ${arrowOut}</a>
        </div>
        <p>${esc(r.line)}</p>
        <div class="meta"><span><i style="background:${langColor(r.lang)}"></i>${esc(r.lang)}</span><span>github.com/RudraSharma3/${esc(r.repo)}</span></div>
      </li>`).join('');
    const swap = () => {
      repos.innerHTML = html;
      yearNote.textContent = YEAR_NOTES[y] || '';
      repos.classList.remove('is-swapping');
    };
    if (animate && !reduce) { repos.classList.add('is-swapping'); setTimeout(swap, 160); } else swap();
    $$('.tab', tabs).forEach((t) => {
      const on = +t.dataset.year === y;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
  }

  if (tabs && typeof ARCHIVE !== 'undefined') {
    const years = [...new Set(ARCHIVE.map((r) => r.y))].sort((a, b) => b - a);
    tabs.innerHTML = years.map((y) => `<button class="tab" type="button" role="tab" id="tab-${y}" aria-controls="repos" data-year="${y}">${y} <span>${ARCHIVE.filter((r) => r.y === y).length}</span></button>`).join('');
    tabs.addEventListener('click', (e) => {
      const t = e.target.closest('.tab');
      if (t && t.getAttribute('aria-selected') !== 'true') renderYear(+t.dataset.year, true);
    });
    tabs.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      const all = $$('.tab', tabs), i = all.indexOf(document.activeElement);
      let n = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : i + (e.key === 'ArrowRight' ? 1 : -1);
      n = (n + all.length) % all.length;
      all[n].focus(); renderYear(+all[n].dataset.year, true); e.preventDefault();
    });
    renderYear(years[0], false);
    $('#repo-count').textContent = ARCHIVE.length;
  }

  const langbar = $('#langbar');
  if (langbar && typeof LANGS !== 'undefined') {
    const total = LANGS.reduce((s, l) => s + l[1], 0);
    langbar.innerHTML = `<div class="bar" role="img" aria-label="${LANGS.map((l) => `${l[0]} ${l[1]}`).join(', ')} repositories">${LANGS.map((l, i) => `<span style="flex:${l[1]};background:${l[2]};--i:${i}"></span>`).join('')}</div>
      <ul>${LANGS.map((l) => `<li><i style="background:${l[2]}"></i>${esc(l[0])} <span class="num">${Math.round((l[1] / total) * 100)}%</span></li>`).join('')}</ul>`;
  }

  /* ---------- 4. badges: filter + show more ---------- */
  const badgeGrid = $('#badges'), chips = $('#chips'), moreBtn = $('#badges-more');
  const FIRST = 12;
  let group = 'All', expanded = false;
  function paintBadges() {
    let shown = 0;
    $$(':scope > li', badgeGrid).forEach((li) => {
      const match = group === 'All' || li.dataset.g === group;
      const visible = match && (expanded || group !== 'All' || shown < FIRST);
      li.hidden = !visible;
      if (visible) shown++;
    });
    const hiddenCount = BADGES.length - FIRST;
    moreBtn.hidden = expanded || group !== 'All';
    moreBtn.textContent = `Show all ${BADGES.length} (${hiddenCount} more)`;
    $$('.chip', chips).forEach((c) => c.setAttribute('aria-pressed', c.dataset.g === group));
  }
  if (badgeGrid && typeof BADGES !== 'undefined') {
    $('#badge-count').textContent = BADGES.length;
    const groups = ['All', ...new Set(BADGES.map((b) => b.g))];
    chips.innerHTML = groups.map((g) => `<button class="chip" type="button" data-g="${esc(g)}" aria-pressed="false">${g === 'All' ? `All ${BADGES.length}` : esc(g)}</button>`).join('');
    badgeGrid.innerHTML = BADGES.map((b, i) => `
      <li data-g="${esc(b.g)}"><button class="badge" type="button" data-badge="${i}" aria-label="${esc(b.n)}: view badge">
        <div class="img"><img src="assets/certificates/thumbs/${esc(b.f)}.webp" alt="" width="440" height="400" loading="lazy" decoding="async"></div>
        <span>${esc(b.n)}</span>
      </button></li>`).join('');
    chips.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) { group = c.dataset.g; paintBadges(); } });
    moreBtn.addEventListener('click', () => { expanded = true; paintBadges(); });
    paintBadges();
  }

  /* ---------- 5. detail sheet (slides up; Esc or backdrop closes) ---------- */
  const sheet = $('#sheet'), sheetBody = $('#sheet-body');
  let opener = null, closeTimer = 0;

  function openSheet(html, label, hash) {
    clearTimeout(closeTimer);
    opener = document.activeElement;
    sheetBody.innerHTML = html;
    $('.sheet-panel', sheet).setAttribute('aria-label', label);
    $('.sheet-panel', sheet).scrollTop = 0;
    sheet.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
    $('.sheet-close', sheet).focus({ preventScroll: true });
    if (hash) history.replaceState(null, '', '#' + hash);
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (/^#(p|how)-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    closeTimer = setTimeout(() => { sheet.hidden = true; sheetBody.innerHTML = ''; }, reduce ? 0 : 400);
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  }
  sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeSheet(); });
  document.addEventListener('keydown', (e) => {
    if (sheet.hidden) return;
    if (e.key === 'Escape') { closeSheet(); return; }
    if (e.key === 'Tab') { // keep focus inside the sheet
      const f = $$('a[href], button:not([disabled])', sheet).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  });

  function projectSheet(id) {
    const i = PROJECTS.findIndex((p) => p.id === id);
    if (i < 0) return;
    const p = PROJECTS[i];
    const flow = p.flow.map((f, k) => (k ? '<span class="to" aria-hidden="true">→</span>' : '') + `<div class="node${f[2] ? ' hl' : ''}"><b>${esc(f[0])}</b><small>${esc(f[1])}</small></div>`).join('');
    openSheet(`
      <p class="eyebrow">Project ${pad(i + 1)} · ${esc(p.where)} · ${esc(p.year)}</p>
      <h2 class="t-h1" id="sheet-title">${esc(p.name)}</h2>
      <p class="t-lead">${esc(p.line)}</p>
      <div class="minis">${p.metrics.map((m) => `<div><b>${esc(m[0])}</b><small>${esc(m[1])}</small></div>`).join('')}</div>
      <div class="cols">
        <div><h4>The problem</h4><p>${esc(p.problem)}</p><h4>What I built</h4><p>${esc(p.built)}</p></div>
        <div><h4>How it works</h4><p>${esc(p.how)}</p><h4>Result</h4><p>${esc(p.result)}</p></div>
      </div>
      ${p.note ? `<p class="callout">${esc(p.note)}</p>` : ''}
      <h4>Architecture</h4><div class="flow">${flow}</div>
      <h4>Stack</h4><div class="tags">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      ${p.links.length ? `<div class="sheet-links">${p.links.map(([l, u], k) => `<a class="btn ${k ? 'btn-quiet' : 'btn-primary'}" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ${arrowOut}</a>`).join('')}</div>` : ''}
    `, p.name, 'p-' + p.id);
  }

  function habitSheet(i) {
    const h = HABITS[i];
    openSheet(`
      <p class="eyebrow">How I work · ${pad(i + 1)}</p>
      <h2 class="t-h1" id="sheet-title">${esc(h.title)}</h2>
      <p class="t-lead">${esc(h.line)}</p>
      <p style="margin-top:1.5rem;max-width:38rem">${esc(h.body)}</p>
      <ul class="proofs">${h.proof.map(([name, url, text]) => `<li><b><a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)} ${arrowOut}</a></b><p>${esc(text)}</p></li>`).join('')}</ul>
    `, h.title, 'how-' + (i + 1));
  }

  function badgeSheet(i) {
    const b = BADGES[i];
    openSheet(`
      <p class="eyebrow">Google Cloud · ${esc(b.g)}</p>
      <h2 class="t-h2" id="sheet-title" style="margin-top:.9rem;padding-right:4rem">${esc(b.n)}</h2>
      <div class="badge-view"><img src="assets/certificates/${esc(b.f)}.png" alt="${esc(b.n)} badge"></div>
    `, b.n);
  }

  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) { projectSheet(o.dataset.open); return; }
    const h = e.target.closest('[data-habit]'); if (h) { habitSheet(+h.dataset.habit); return; }
    const b = e.target.closest('[data-badge]'); if (b) badgeSheet(+b.dataset.badge);
  });

  // deep links: /Portfolio/#p-vox opens that breakdown
  const deep = location.hash.match(/^#p-([\w-]+)$/);
  if (deep && PROJECTS.some((p) => p.id === deep[1])) {
    const ch = $('#p-' + deep[1]);
    if (ch) ch.scrollIntoView();
    projectSheet(deep[1]);
  }

  /* ---------- 6. nav: hide on the way down, show on the way up; progress line ---------- */
  const nav = $('#nav'), bar = $('#progress'), cue = $('#cue');
  const menuBtn = $('#menu-btn'), menu = $('#menu');
  let lastY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    nav.classList.toggle('is-scrolled', y > 8);
    const menuOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    if (!menuOpen) nav.classList.toggle('is-hidden', y > lastY && y > 240);
    if (cue) cue.classList.toggle('is-gone', y > 40);
    lastY = y; ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  // mobile menu
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
    menu.hidden = !open;
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener('click', (e) => { if (!menu.hidden && !e.target.closest('#nav')) setMenu(false); });

  // active section in the nav
  const navLinks = $$('.nav-links a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'receipts', 'work', 'projects', 'how', 'archive', 'credentials', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---------- 7. finale: plays its sequence once it's mostly on screen ---------- */
  const finale = $('#contact');
  if (finale && reduce) finale.classList.add('is-in');
  else if (finale) {
    new IntersectionObserver((entries, io) => {
      if (entries[0].isIntersecting) { finale.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.45 }).observe(finale);
  }

  // copy email
  const copy = $('#copy-email');
  if (copy) copy.addEventListener('click', async () => {
    const email = copy.dataset.email;
    try { await navigator.clipboard.writeText(email); }
    catch (_) {
      const t = document.createElement('textarea'); t.value = email; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (__) {} t.remove();
    }
    copy.textContent = 'Copied';
    setTimeout(() => { copy.textContent = 'Copy'; }, 1800);
  });

  watch();
  onScroll();
})();
