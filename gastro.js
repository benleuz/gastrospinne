/* Gastroführer – gastro.js */
'use strict';

const GF_VERSION = '0.4.1';

// ---------- Konstanten ----------
const LABELS = ['Preisniveau', 'Ambiente', 'Weinkarte', 'Essen', 'Sehen und gesehen werden', 'Günstig', 'Weitere Option 2'];
const SHORT = ['Preis', 'Ambiente', 'Wein', 'Essen', 'Gesehen werden', 'Günstig', 'Option 2'];
const N = LABELS.length;
const LEVELS = 5;
const DEFAULT_VALUE = 3;
const EXCLUSIVE = [[0, 5]]; // Preisniveau <-> Günstig
function partnerOf(i) { for (const [a, b] of EXCLUSIVE) { if (i === a) return b; if (i === b) return a; } return -1; }

const EMOJI = {
  'Schweizerisch': '🫕', 'Italienisch': '🍝', 'Französisch': '🥐', 'Spanisch': '🥘', 'Griechisch': '🫒',
  'Japanisch': '🍣', 'Chinesisch': '🥟', 'Thailändisch': '🌶️', 'Vietnamesisch': '🍜', 'Indisch': '🍛',
  'Mexikanisch': '🌮', 'Vegetarisch/Vegan': '🥗', 'Steakhouse': '🥩', 'Fisch': '🐟'
};
const ART_ORDER = Object.keys(EMOJI);

const LS_THEME = 'gf-theme';
const LS_WISH = 'gf-wunsch';
const LS_ART = 'gf-art';
const LS_OWN = 'gf-own';        // eigene Bewertungen: { [id]: values[] }
const LS_MINE = 'gf-mine';      // eigene Restaurants: [ {id, name, ort, art, link, note, values} ]

const CX = 410, CY = 320;
let R = 235, LABEL_R = R + 36;
// Mobile: kürzere Titel, grössere Knöpfe/Punkte
function isMobile() { return window.innerWidth <= 600; }
function geo() {
  const m = isMobile();
  R = m ? 210 : 235; LABEL_R = R + (m ? 34 : 36);
  return { m, W: m ? 64 : 40, H: m ? 28 : 18, stepR: m ? 8 : 5, dotR: m ? 10 : 7, hit: m ? 40 : 26 };
}

// ---------- Zustand ----------
let base = [];                                              // Gastroführer-Daten (restaurants.json)
let wish = loadJSON(LS_WISH, null);
if (!Array.isArray(wish) || wish.length !== N) wish = Array(N).fill(DEFAULT_VALUE);
let own = loadJSON(LS_OWN, {}); if (!own || typeof own !== 'object') own = {};
let mine = loadJSON(LS_MINE, []); if (!Array.isArray(mine)) mine = [];
let artFilter = ''; try { artFilter = localStorage.getItem(LS_ART) || ''; } catch {}
let selectedId = null;
let pendingShare = null;

// Migration v0.3: eigene Einträge aus gf-restaurants übernehmen
(function migrate() {
  const old = loadJSON('gf-restaurants', null);
  if (Array.isArray(old)) {
    for (const r of old) if (r?.name && !String(r.id).startsWith('demo-') && !mine.some(m => m.id === r.id)) mine.push(r);
    try { localStorage.removeItem('gf-restaurants'); } catch {}
    save();
  }
})();

function loadJSON(key, fb) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function save() {
  try {
    localStorage.setItem(LS_WISH, JSON.stringify(wish));
    localStorage.setItem(LS_OWN, JSON.stringify(own));
    localStorage.setItem(LS_MINE, JSON.stringify(mine));
    localStorage.setItem(LS_ART, artFilter);
  } catch {}
}

// ---------- Theme ----------
function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem(LS_THEME, t); } catch {} }
(function () {
  let t = null; try { t = localStorage.getItem(LS_THEME); } catch {}
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
document.getElementById('btn-theme').addEventListener('click', () =>
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// ---------- Hilfen ----------
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.getElementById('toasts').appendChild(el); setTimeout(() => el.remove(), 2400);
}
function uid() { return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

function allRestaurants() {
  return [...base.map(r => ({ ...r, source: 'gf' })), ...mine.map(r => ({ ...r, source: 'mine' }))];
}
function effectiveValues(r) { return own[r.id] || r.values; }
function arten() {
  const set = new Set(ART_ORDER);
  allRestaurants().forEach(r => { if (r.art) set.add(r.art); });
  const extra = [...set].filter(a => !ART_ORDER.includes(a)).sort((a, b) => a.localeCompare(b, 'de'));
  return [...ART_ORDER, ...extra];
}
function score(values) {
  let sum = 0, n = 0;
  for (let i = 0; i < N; i++) {
    if (wish[i] === null) continue;
    const v = values?.[i]; if (typeof v !== 'number') continue;
    sum += Math.abs(wish[i] - v); n++;
  }
  return n ? Math.round(100 * (1 - sum / (n * (LEVELS - 1)))) : null;
}

// ---------- Schritt 1: Kacheln ----------
function drawTiles() {
  const box = document.getElementById('tiles');
  box.innerHTML = '';
  const all = allRestaurants();
  const counts = {};
  all.forEach(r => { counts[r.art] = (counts[r.art] || 0) + 1; });
  const mk = (art, label, emoji, count) => {
    const b = document.createElement('button');
    b.className = 'tile' + (artFilter === art ? ' active' : '');
    b.innerHTML = `<span class="emoji">${emoji}</span><span class="name">${esc(label)}</span><span class="count">${count} ${count === 1 ? 'Lokal' : 'Lokale'}</span>`;
    b.addEventListener('click', () => {
      artFilter = art; save(); render();
      document.getElementById('step-wish').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    box.appendChild(b);
  };
  mk('', 'Überrasch mich', '🎲', all.length);
  arten().forEach(a => mk(a, a, EMOJI[a] || '🍽️', counts[a] || 0));
  document.getElementById('art-word').textContent = artFilter ? artFilter : '…';
}

// ---------- Schritt 2: Netz ----------
const svg = document.getElementById('radar');
function angle(i) { return -Math.PI / 2 + (2 * Math.PI * i) / N; }
function point(i, level) { const r = (R * level) / LEVELS, a = angle(i); return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
}
function drawRadar() {
  svg.innerHTML = '';
  const G = geo();
  svg.classList.toggle('mobile', G.m);
  for (let l = 1; l <= LEVELS; l++) {
    const pts = []; for (let i = 0; i < N; i++) pts.push(point(i, l).join(','));
    svgEl('polygon', { class: 'ring', points: pts.join(' ') }, svg);
    const [x, y] = point(0, l);
    svgEl('text', { class: 'level-num', x: x + 6, y: y + 4 }, svg).textContent = l;
  }
  for (let i = 0; i < N; i++) {
    const off = wish[i] === null;
    const [x, y] = point(i, LEVELS);
    svgEl('line', { class: 'axis' + (off ? ' off' : ''), x1: CX, y1: CY, x2: x, y2: y }, svg);
    svgEl('line', { class: 'axis-hit', x1: CX, y1: CY, x2: x, y2: y, 'data-axis': i, 'stroke-width': G.hit }, svg).addEventListener('pointerdown', onAxisPointerDown);
    for (let l = 1; l <= LEVELS; l++) {
      const [sx, sy] = point(i, l);
      svgEl('circle', { class: 'step-pt' + (off ? ' off' : ''), cx: sx, cy: sy, r: G.stepR, 'data-axis': i, 'data-level': l }, svg).addEventListener('pointerdown', onAxisPointerDown);
    }
    const a = angle(i), cos = Math.cos(a), sin = Math.sin(a);
    const anchor = Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end';
    const lx = CX + LABEL_R * cos, ly = CY + LABEL_R * sin + 5;
    const t = svgEl('text', { class: 'label' + (off ? ' off' : ''), x: lx, y: ly, 'text-anchor': anchor }, svg);
    t.textContent = G.m ? SHORT[i] : LABELS[i];
    t.addEventListener('click', () => toggleOff(i));
    const W = G.W, H = G.H;
    const by = sin < -0.05 ? ly - 14 - H : ly + 8;
    const bx = anchor === 'start' ? lx : anchor === 'end' ? lx - W : lx - W / 2;
    const g = svgEl('g', { class: 'egal-btn' + (off ? ' on' : '') }, svg);
    svgEl('title', {}, g).textContent = off ? 'Wieder werten' : 'Ist mir egal';
    svgEl('rect', { x: bx, y: by, width: W, height: H, rx: 9 }, g);
    svgEl('text', { x: bx + W / 2, y: by + H * 0.72, 'text-anchor': 'middle' }, g).textContent = 'egal';
    g.addEventListener('click', () => toggleOff(i));
  }
  const sel = allRestaurants().find(r => r.id === selectedId);
  if (sel) drawPoly(effectiveValues(sel), own[sel.id] ? cssVar('--own') : cssVar('--rest'), false);
  drawPoly(wish, cssVar('--wish'), true);
}
function drawPoly(values, col, isWish) {
  const pts = [];
  for (let i = 0; i < N; i++) if (typeof values[i] === 'number') pts.push(point(i, values[i]));
  if (pts.length >= 2) svgEl(pts.length >= 3 ? 'polygon' : 'polyline', { class: 'poly' + (isWish ? '' : ' rest'), points: pts.map(q => q.join(',')).join(' '), fill: col, stroke: col }, svg);
  for (let i = 0; i < N; i++) {
    if (typeof values[i] !== 'number') continue;
    const [dx, dy] = point(i, values[i]);
    const d = svgEl('circle', { class: 'dot' + (isWish ? ' wish' : ''), cx: dx, cy: dy, r: isWish ? geo().dotR : 4, fill: col, stroke: 'var(--card)', 'stroke-width': isWish ? 2 : 1, 'data-axis': i }, svg);
    if (isWish) d.addEventListener('pointerdown', onAxisPointerDown);
  }
}
let drag = null;
function svgPoint(evt) { const pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); return [p.x, p.y]; }
function levelFromPointer(axis, evt) {
  const [px, py] = svgPoint(evt), a = angle(axis);
  const proj = (px - CX) * Math.cos(a) + (py - CY) * Math.sin(a);
  return Math.max(1, Math.min(LEVELS, Math.round((proj / R) * LEVELS)));
}
function onAxisPointerDown(evt) {
  evt.preventDefault();
  const axis = +evt.currentTarget.dataset.axis;
  const explicit = evt.currentTarget.dataset.level;
  const level = explicit ? +explicit : levelFromPointer(axis, evt);
  setWish(axis, level, false);
  drag = { axis, last: level };
  svg.setPointerCapture?.(evt.pointerId);
}
svg.addEventListener('pointermove', evt => {
  if (!drag) return;
  const l = levelFromPointer(drag.axis, evt);
  if (l !== drag.last) { drag.last = l; setWish(drag.axis, l, false); }
});
function endDrag() { if (drag) { drag = null; save(); } }
svg.addEventListener('pointerup', endDrag);
svg.addEventListener('pointercancel', endDrag);

function setWish(axis, level, persist = true) {
  wish[axis] = level;
  const p = partnerOf(axis);
  if (p >= 0 && wish[p] !== null) { wish[p] = null; if (persist) toast(`«${LABELS[p]}» auf egal gesetzt`); }
  if (persist) save();
  render();
}
function toggleOff(axis) {
  if (wish[axis] === null) {
    wish[axis] = DEFAULT_VALUE;
    const p = partnerOf(axis);
    if (p >= 0 && wish[p] !== null) { wish[p] = null; toast(`«${LABELS[p]}» auf egal gesetzt`); }
  } else wish[axis] = null;
  save(); render();
}
document.getElementById('btn-reset').addEventListener('click', () => { wish = Array(N).fill(DEFAULT_VALUE); save(); render(); toast('Wunschprofil zurückgesetzt'); });

function drawOverlayInfo() {
  const box = document.getElementById('overlay-info');
  const sel = allRestaurants().find(r => r.id === selectedId);
  box.innerHTML = `<span><span class="swatch" style="background:${cssVar('--wish')}"></span>Mein Wunsch</span>`;
  if (sel) {
    const isOwn = !!own[sel.id];
    const s = score(effectiveValues(sel));
    box.innerHTML += `<span><span class="swatch dash" style="background:${isOwn ? cssVar('--own') : cssVar('--rest')}"></span>${esc(sel.name)}${isOwn ? ' (deine Bewertung)' : ''}${s === null ? '' : ' · ' + s + ' %'}</span>
      <button class="btn small" id="btn-clear-overlay">Ausblenden</button>`;
    box.querySelector('#btn-clear-overlay').addEventListener('click', () => { selectedId = null; render(); });
  }
}

// ---------- Schritt 3: Ranking ----------
function ringSVG(s) {
  const r = 24, c = 2 * Math.PI * r, off = s === null ? c : c * (1 - s / 100);
  return `<svg class="ring" viewBox="0 0 58 58"><circle class="track" cx="29" cy="29" r="${r}"/><circle class="val" cx="29" cy="29" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${off}"/><text x="29" y="29">${s === null ? '–' : s}</text></svg>`;
}
function barsHTML(values, cls) {
  return `<div class="bars ${cls}" title="${LABELS.map((l, i) => l + ': ' + (values[i] ?? '–')).join(', ')}">` +
    values.map((v, i) => `<i class="${wish[i] === null ? 'off' : ''}" style="height:${(v / LEVELS) * 100}%"></i>`).join('') + '</div>';
}
function drawList() {
  const box = document.getElementById('rest-list');
  box.innerHTML = '';
  const all = allRestaurants();
  const rows = all.filter(r => !artFilter || r.art === artFilter)
    .map(r => ({ r, s: score(effectiveValues(r)) }))
    .sort((a, b) => (b.s ?? -1) - (a.s ?? -1) || a.r.name.localeCompare(b.r.name, 'de'));
  document.getElementById('rest-count').textContent = artFilter ? `${rows.length} × ${artFilter}` : `${rows.length} Lokale`;
  if (!rows.length) {
    box.innerHTML = `<div class="empty">${all.length ? 'Kein Lokal dieser Art. Erfasse eines mit «＋ Eigenes Restaurant».' : 'Daten werden geladen …'}</div>`;
    return;
  }
  rows.forEach(({ r, s }, idx) => {
    const isOwn = !!own[r.id];
    const div = document.createElement('div');
    div.className = 'row' + (r.id === selectedId ? ' selected' : '');
    div.tabIndex = 0;
    const meta = [r.art, r.ort].filter(Boolean).map(esc).join(' · ');
    div.innerHTML = `
      <div class="rank r${idx + 1}">${idx + 1}</div>
      ${ringSVG(s)}
      <div>
        <div class="name">${esc(r.name)}${r.source === 'mine' ? '<span class="badge mine">eigenes</span>' : ''}${isOwn ? '<span class="badge own">deine Bewertung</span>' : ''}</div>
        <div class="meta">${meta}${r.link ? (meta ? ' · ' : '') + `<a href="${esc(r.link)}" target="_blank" rel="noopener">Link</a>` : ''}</div>
        ${r.note ? `<div class="meta">${esc(r.note)}</div>` : ''}
        ${isOwn ? barsHTML(own[r.id], 'own') : barsHTML(r.values, '')}
      </div>
      <div class="actions">
        <button class="btn small icon" data-rate title="${isOwn ? 'Deine Bewertung ändern' : 'Selbst bewerten'}">✎</button>
        ${r.source === 'mine' ? '<button class="btn small icon danger" data-del title="Löschen">✕</button>' : ''}
      </div>`;
    div.addEventListener('click', e => {
      if (e.target.closest('a,button')) return;
      selectedId = selectedId === r.id ? null : r.id; render();
      if (selectedId) document.getElementById('step-wish').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); } });
    div.querySelector('[data-rate]').addEventListener('click', () => openDialog(r));
    div.querySelector('[data-del]')?.addEventListener('click', () => {
      if (!confirm(`«${r.name}» löschen?`)) return;
      mine = mine.filter(x => x.id !== r.id); delete own[r.id];
      if (selectedId === r.id) selectedId = null;
      save(); render(); toast(`«${r.name}» gelöscht`);
    });
    box.appendChild(div);
  });
}

// ---------- Dialog: eigenes Restaurant / eigene Bewertung ----------
const dlg = document.getElementById('dlg');
let dlgValues = Array(N).fill(DEFAULT_VALUE), dlgTarget = null; // null = neu, sonst Restaurant

function openDialog(r) {
  dlgTarget = r || null;
  const editableFields = !r || r.source === 'mine';
  document.getElementById('dlg-fields').style.display = editableFields ? '' : 'none';
  document.getElementById('dlg-title').textContent = !r ? 'Eigenes Restaurant erfassen' : r.source === 'mine' ? `${r.name} bearbeiten` : `${r.name} selbst bewerten`;
  document.getElementById('rating-hint').textContent = !r || r.source === 'mine' ? 'Bewertung (1 tief … 5 hoch)' : 'Deine Bewertung ersetzt die des Gastroführers (1 tief … 5 hoch)';
  document.getElementById('f-name').value = r?.name || '';
  document.getElementById('f-ort').value = r?.ort || '';
  document.getElementById('f-art').value = r?.art || artFilter || '';
  document.getElementById('f-link').value = r?.link || '';
  document.getElementById('f-note').value = r?.note || '';
  const src = r ? (own[r.id] || r.values) : null;
  dlgValues = src?.length === N ? [...src] : Array(N).fill(DEFAULT_VALUE);
  document.getElementById('dlg-remove-own').hidden = !(r && r.source === 'gf' && own[r.id]);
  document.getElementById('art-list').innerHTML = arten().map(a => `<option value="${esc(a)}">`).join('');
  drawRatingRows();
  dlg.showModal();
  if (editableFields) document.getElementById('f-name').focus();
}
function drawRatingRows() {
  const box = document.getElementById('rating-rows'); box.innerHTML = '';
  LABELS.forEach((lab, i) => {
    const row = document.createElement('div'); row.className = 'rating-row';
    row.innerHTML = `<span>${esc(lab)}</span><span class="vals"></span>`;
    const vals = row.querySelector('.vals');
    for (let l = 1; l <= LEVELS; l++) {
      const b = document.createElement('button'); b.type = 'button';
      b.className = 'btn small' + (dlgValues[i] === l ? ' active' : ''); b.textContent = l;
      b.addEventListener('click', () => { dlgValues[i] = l; drawRatingRows(); });
      vals.appendChild(b);
    }
    box.appendChild(row);
  });
}
document.getElementById('btn-add').addEventListener('click', () => openDialog(null));
document.getElementById('dlg-cancel').addEventListener('click', () => dlg.close());
document.getElementById('dlg-remove-own').addEventListener('click', () => {
  if (dlgTarget) { delete own[dlgTarget.id]; save(); render(); toast('Eigene Bewertung entfernt'); }
  dlg.close();
});
document.getElementById('dlg-save').addEventListener('click', () => {
  if (dlgTarget && dlgTarget.source === 'gf') {
    own[dlgTarget.id] = [...dlgValues];
    toast(`Deine Bewertung für «${dlgTarget.name}» gespeichert`);
  } else {
    const name = document.getElementById('f-name').value.trim();
    if (!name) { document.getElementById('f-name').focus(); toast('Name fehlt'); return; }
    const data = { name, ort: document.getElementById('f-ort').value.trim(), art: document.getElementById('f-art').value.trim(), link: document.getElementById('f-link').value.trim(), note: document.getElementById('f-note').value.trim(), values: [...dlgValues] };
    if (dlgTarget) { Object.assign(mine.find(x => x.id === dlgTarget.id), data); toast(`«${name}» gespeichert`); }
    else { const r = { id: uid(), ...data }; mine.push(r); selectedId = r.id; toast(`«${name}» erfasst`); }
  }
  dlg.close(); save(); render();
});

// ---------- Teilen (URL-Hash) ----------
function encodeShare() {
  const payload = { v: 1, w: wish, a: artFilter, o: own, m: mine };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
function decodeShare(str) { return JSON.parse(decodeURIComponent(escape(atob(str)))); }
document.getElementById('btn-share').addEventListener('click', async () => {
  const url = location.origin + location.pathname + '#s=' + encodeShare();
  try { await navigator.clipboard.writeText(url); toast('Link kopiert – einfach weiterschicken'); }
  catch { prompt('Link zum Teilen:', url); }
});
(function checkShare() {
  const m = location.hash.match(/^#s=(.+)$/);
  if (!m) return;
  try {
    pendingShare = decodeShare(m[1]);
    const nOwn = Object.keys(pendingShare.o || {}).length, nMine = (pendingShare.m || []).length;
    document.getElementById('share-text').textContent =
      `Jemand hat dir eine Auswahl geschickt: Wunschprofil${pendingShare.a ? ' (' + pendingShare.a + ')' : ''}, ${nOwn} eigene Bewertungen, ${nMine} eigene Restaurants.`;
    document.getElementById('share-banner').classList.add('show');
  } catch { toast('Geteilter Link konnte nicht gelesen werden'); }
  history.replaceState(null, '', location.pathname);
})();
document.getElementById('share-accept').addEventListener('click', () => {
  const p = pendingShare; if (!p) return;
  if (Array.isArray(p.w) && p.w.length === N) wish = p.w;
  if (typeof p.a === 'string') artFilter = p.a;
  if (p.o && typeof p.o === 'object') Object.assign(own, p.o);
  for (const r of p.m || []) if (r?.name && !mine.some(x => x.id === r.id)) mine.push(r);
  pendingShare = null; document.getElementById('share-banner').classList.remove('show');
  save(); render(); toast('Auswahl übernommen');
});
document.getElementById('share-dismiss').addEventListener('click', () => { pendingShare = null; document.getElementById('share-banner').classList.remove('show'); });

// ---------- Sichern / Laden (eigene Daten) ----------
document.getElementById('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ version: GF_VERSION, wish, own, mine }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'gastrofuehrer-meins-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click(); URL.revokeObjectURL(a.href); toast('Gesichert');
});
document.getElementById('btn-import').addEventListener('click', () => document.getElementById('file-import').click());
document.getElementById('file-import').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (Array.isArray(d.wish) && d.wish.length === N) wish = d.wish;
    if (d.own && typeof d.own === 'object') Object.assign(own, d.own);
    for (const r of d.mine || d.restaurants || []) if (r?.name && !mine.some(x => x.id === r.id)) mine.push({ ...r, id: r.id || uid() });
    save(); render(); toast('Geladen');
  } catch (err) { toast('Datei konnte nicht gelesen werden: ' + err.message); }
  e.target.value = '';
});

// ---------- Gastroführer-Daten laden ----------
async function loadBase() {
  try {
    const res = await fetch('restaurants.json?v=' + GF_VERSION);
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    base = (Array.isArray(d) ? d : d.restaurants || []).filter(r => r?.name && Array.isArray(r.values) && r.values.length === N);
  } catch { toast('restaurants.json nicht gefunden – nur eigene Restaurants sichtbar'); }
  render();
}

// ---------- Render ----------
function render() { drawTiles(); drawRadar(); drawOverlayInfo(); drawList(); }
let resizeT; window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(drawRadar, 120); });

// Mobil: Sprungknopf zu den Treffern, wenn die Liste nicht im Bild ist
(function jumpBtn() {
  const btn = document.getElementById('jump'), list = document.getElementById('step-list');
  btn.addEventListener('click', () => list.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => btn.classList.toggle('show', !e.isIntersecting && window.scrollY > 200), { threshold: 0.05 }).observe(list);
})();
document.getElementById('app-version').textContent = 'v' + GF_VERSION;
document.getElementById('footer-version').textContent = 'Gastroführer v' + GF_VERSION;
render();
loadBase();
