/* Gastroführer – gastro.js */
'use strict';

const GF_VERSION = '0.3.0';

// ---------- Konstanten ----------
const DEFAULT_LABELS = [
  'Preisniveau', 'Ambiente', 'Weinkarte', 'Essen',
  'Sehen und gesehen werden', 'Günstig', 'Weitere Option 2'
];
// Kriterien, die sich gegenseitig ausschliessen (Index-Paare): Preisniveau <-> Günstig
const EXCLUSIVE = [[0, 5]];
function partnerOf(i) { for (const [a, b] of EXCLUSIVE) { if (i === a) return b; if (i === b) return a; } return -1; }
const N = DEFAULT_LABELS.length;
const LEVELS = 5;
const DEFAULT_VALUE = 3;
const DEFAULT_ARTEN = [
  'Schweizerisch', 'Italienisch', 'Französisch', 'Spanisch', 'Griechisch',
  'Japanisch', 'Chinesisch', 'Thailändisch', 'Vietnamesisch', 'Indisch',
  'Mexikanisch', 'Vegetarisch/Vegan', 'Steakhouse', 'Fisch'
];

const LS_THEME = 'gf-theme';
const LS_WISH = 'gf-wunsch';
const LS_LABELS = 'gf-labels';
const LS_REST = 'gf-restaurants';
const LS_ART = 'gf-art';

const SIZE = 640, CX = 320, CY = 320, R = 235, LABEL_R = R + 34;

// ---------- Zustand ----------
let labels = loadJSON(LS_LABELS, null);
if (!Array.isArray(labels) || labels.length !== N) labels = [...DEFAULT_LABELS];
if (labels[5] === 'Weitere Option 1') labels[5] = 'Günstig'; // Migration v0.2 -> v0.3

let wish = loadJSON(LS_WISH, null);                    // 1–5 oder null (= egal)
if (!Array.isArray(wish) || wish.length !== N) wish = Array(N).fill(DEFAULT_VALUE);
for (const [a, b] of EXCLUSIVE) if (wish[a] !== null && wish[b] !== null) wish[b] = null;

let restaurants = loadJSON(LS_REST, []);
if (!Array.isArray(restaurants)) restaurants = [];

let artFilter = '';                                    // '' = Alle
try { artFilter = localStorage.getItem(LS_ART) || ''; } catch {}

let selectedId = null;                                 // Restaurant, das über das Netz gelegt wird
let editingId = null;                                  // im Dialog

// ---------- Speichern / Laden ----------
function loadJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save() {
  try {
    localStorage.setItem(LS_WISH, JSON.stringify(wish));
    localStorage.setItem(LS_LABELS, JSON.stringify(labels));
    localStorage.setItem(LS_REST, JSON.stringify(restaurants));
    localStorage.setItem(LS_ART, artFilter);
  } catch {}
}

// ---------- Theme ----------
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(LS_THEME, t); } catch {}
}
(function initTheme() {
  let t = null;
  try { t = localStorage.getItem(LS_THEME); } catch {}
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
document.getElementById('btn-theme').addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ---------- Toast ----------
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

// ---------- Hilfen ----------
function uid() { return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function arten() {
  const set = new Set(DEFAULT_ARTEN);
  restaurants.forEach(r => { if (r.art) set.add(r.art); });
  return [...set].sort((a, b) => a.localeCompare(b, 'de'));
}

// Passung 0–100 %: mittlere Abweichung über alle nicht-«egal»-Kriterien
function score(r) {
  let sum = 0, n = 0;
  for (let i = 0; i < N; i++) {
    if (wish[i] === null) continue;
    const v = r.values?.[i];
    if (typeof v !== 'number') continue;
    sum += Math.abs(wish[i] - v); n++;
  }
  if (!n) return null;
  return Math.round(100 * (1 - sum / (n * (LEVELS - 1))));
}

// ---------- Geometrie / SVG ----------
const svg = document.getElementById('radar');
function angle(i) { return -Math.PI / 2 + (2 * Math.PI * i) / N; }
function point(i, level) {
  const r = (R * level) / LEVELS, a = angle(i);
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}
function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
}

function drawRadar() {
  svg.innerHTML = '';
  for (let l = 1; l <= LEVELS; l++) {
    const pts = [];
    for (let i = 0; i < N; i++) pts.push(point(i, l).join(','));
    svgEl('polygon', { class: 'ring', points: pts.join(' ') }, svg);
    const [x, y] = point(0, l);
    svgEl('text', { class: 'level-num', x: x + 6, y: y + 4 }, svg).textContent = l;
  }
  for (let i = 0; i < N; i++) {
    const off = wish[i] === null;
    const [x, y] = point(i, LEVELS);
    svgEl('line', { class: 'axis' + (off ? ' off' : ''), x1: CX, y1: CY, x2: x, y2: y }, svg);
    svgEl('line', { class: 'axis-hit', x1: CX, y1: CY, x2: x, y2: y, 'data-axis': i }, svg)
      .addEventListener('pointerdown', onAxisPointerDown);
    for (let l = 1; l <= LEVELS; l++) {
      const [sx, sy] = point(i, l);
      svgEl('circle', { class: 'step' + (off ? ' off' : ''), cx: sx, cy: sy, r: 5, 'data-axis': i, 'data-level': l }, svg)
        .addEventListener('pointerdown', onAxisPointerDown);
    }
    const a = angle(i), cos = Math.cos(a);
    const t = svgEl('text', {
      class: 'label' + (off ? ' off' : ''),
      x: CX + LABEL_R * cos, y: CY + LABEL_R * Math.sin(a) + 5,
      'text-anchor': Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end'
    }, svg);
    t.textContent = labels[i] + (off ? ' (egal)' : '');
    t.addEventListener('click', () => toggleOff(i));
  }

  // Restaurant-Overlay (gestrichelt)
  const sel = restaurants.find(r => r.id === selectedId);
  if (sel) drawPoly(sel.values, cssVar('--rest'), false);
  // Wunschprofil (kräftig, oben)
  drawPoly(wish, cssVar('--wish'), true);
}
function drawPoly(values, col, isWish) {
  const pts = [];
  for (let i = 0; i < N; i++) if (typeof values[i] === 'number') pts.push(point(i, values[i]));
  if (pts.length >= 2) {
    svgEl(pts.length >= 3 ? 'polygon' : 'polyline', {
      class: 'poly' + (isWish ? '' : ' rest'),
      points: pts.map(q => q.join(',')).join(' '), fill: col, stroke: col
    }, svg);
  }
  for (let i = 0; i < N; i++) {
    if (typeof values[i] !== 'number') continue;
    const [dx, dy] = point(i, values[i]);
    const d = svgEl('circle', {
      class: 'dot' + (isWish ? ' wish' : ''), cx: dx, cy: dy,
      r: isWish ? 7 : 4, fill: col, stroke: 'var(--card)', 'stroke-width': isWish ? 2 : 1, 'data-axis': i
    }, svg);
    if (isWish) d.addEventListener('pointerdown', onAxisPointerDown);
  }
}

// ---------- Interaktion Netz ----------
let drag = null;
function svgPoint(evt) {
  const pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  return [p.x, p.y];
}
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
  if (p >= 0 && wish[p] !== null) { wish[p] = null; if (persist) toast(`«${labels[p]}» auf egal gesetzt`); }
  if (persist) save();
  render();
if (!restaurants.length) loadDemo(true); // leere Liste: Beispiele automatisch anbieten
}
function toggleOff(axis) {
  if (wish[axis] === null) {
    wish[axis] = DEFAULT_VALUE;
    const p = partnerOf(axis);
    if (p >= 0 && wish[p] !== null) { wish[p] = null; toast(`«${labels[p]}» auf egal gesetzt`); }
  } else {
    wish[axis] = null;
  }
  save(); render();
}
function drawEgalRow() {
  const box = document.getElementById('egal-row');
  box.innerHTML = '';
  labels.forEach((lab, i) => {
    const b = document.createElement('button');
    b.className = 'crit-chip' + (wish[i] === null ? ' off' : '');
    b.textContent = lab;
    b.title = wish[i] === null ? 'Wieder werten' : 'Ist mir egal';
    b.addEventListener('click', () => toggleOff(i));
    box.appendChild(b);
  });
}
document.getElementById('btn-reset').addEventListener('click', () => {
  wish = Array(N).fill(DEFAULT_VALUE);
  for (const [, b] of EXCLUSIVE) wish[b] = null;
  save(); render(); toast('Wunschprofil zurückgesetzt');
});

// ---------- Overlay-Info ----------
function drawOverlayInfo() {
  const box = document.getElementById('overlay-info');
  const sel = restaurants.find(r => r.id === selectedId);
  box.innerHTML = `<span><span class="swatch" style="background:${cssVar('--wish')}"></span>Wunschprofil</span>`;
  if (sel) {
    const s = score(sel);
    box.innerHTML += `<span><span class="swatch dash" style="background:${cssVar('--rest')}"></span>${esc(sel.name)}${s === null ? '' : ' · ' + s + ' %'}</span>
      <button class="btn small" id="btn-clear-overlay">Ausblenden</button>`;
    box.querySelector('#btn-clear-overlay').addEventListener('click', () => { selectedId = null; render(); });
  }
}

// ---------- Art-Dropdown ----------
function drawArtSelect() {
  const sel = document.getElementById('sel-art');
  const list = arten();
  if (artFilter && !list.includes(artFilter)) artFilter = '';
  sel.innerHTML = '<option value="">Alle Arten</option>' + list.map(a => `<option value="${esc(a)}">${esc(a)}</option>`).join('');
  sel.value = artFilter;
  document.getElementById('art-list').innerHTML = list.map(a => `<option value="${esc(a)}">`).join('');
}
document.getElementById('sel-art').addEventListener('change', e => { artFilter = e.target.value; save(); render(); });

// ---------- Restaurantliste ----------
function drawList() {
  const box = document.getElementById('rest-list');
  box.innerHTML = '';
  const rows = restaurants
    .filter(r => !artFilter || r.art === artFilter)
    .map(r => ({ r, s: score(r) }))
    .sort((a, b) => (b.s ?? -1) - (a.s ?? -1) || a.r.name.localeCompare(b.r.name, 'de'));

  document.getElementById('rest-count').textContent =
    rows.length === restaurants.length ? `${restaurants.length}` : `${rows.length} von ${restaurants.length}`;

  if (!rows.length) {
    box.innerHTML = `<div class="empty">${restaurants.length ? 'Kein Restaurant dieser Art erfasst.' : 'Noch keine Restaurants. Mit «＋ Restaurant» das erste erfassen.'}</div>`;
    return;
  }
  for (const { r, s } of rows) {
    const div = document.createElement('div');
    div.className = 'row' + (r.id === selectedId ? ' selected' : '');
    div.tabIndex = 0;
    const meta = [r.art, r.ort].filter(Boolean).map(esc).join(' · ');
    div.innerHTML = `
      <div class="score">${s === null ? '–' : s + '<small>%</small>'}</div>
      <div>
        <div class="name">${esc(r.name)}</div>
        <div class="meta">${meta}${r.link ? (meta ? ' · ' : '') + `<a href="${esc(r.link)}" target="_blank" rel="noopener">Link</a>` : ''}</div>
        ${r.note ? `<div class="meta">${esc(r.note)}</div>` : ''}
      </div>
      <div class="actions">
        <button class="btn small icon" data-edit title="Bearbeiten">✎</button>
        <button class="btn small icon danger" data-del title="Löschen">✕</button>
      </div>`;
    div.addEventListener('click', e => {
      if (e.target.closest('a,button')) return;
      selectedId = selectedId === r.id ? null : r.id; render();
      if (selectedId) window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); } });
    div.querySelector('[data-edit]').addEventListener('click', () => openDialog(r));
    div.querySelector('[data-del]').addEventListener('click', () => {
      if (!confirm(`«${r.name}» löschen?`)) return;
      restaurants = restaurants.filter(x => x.id !== r.id);
      if (selectedId === r.id) selectedId = null;
      save(); render(); toast(`«${r.name}» gelöscht`);
    });
    box.appendChild(div);
  }
}

// ---------- Dialog Erfassen / Bearbeiten ----------
const dlg = document.getElementById('dlg');
let dlgValues = Array(N).fill(DEFAULT_VALUE);

function openDialog(r) {
  editingId = r ? r.id : null;
  document.getElementById('dlg-title').textContent = r ? 'Restaurant bearbeiten' : 'Restaurant erfassen';
  document.getElementById('f-name').value = r?.name || '';
  document.getElementById('f-ort').value = r?.ort || '';
  document.getElementById('f-art').value = r?.art || (artFilter || '');
  document.getElementById('f-link').value = r?.link || '';
  document.getElementById('f-note').value = r?.note || '';
  dlgValues = r?.values?.length === N ? [...r.values] : Array(N).fill(DEFAULT_VALUE);
  drawRatingRows();
  dlg.showModal();
  document.getElementById('f-name').focus();
}
function drawRatingRows() {
  const box = document.getElementById('rating-rows');
  box.innerHTML = '';
  labels.forEach((lab, i) => {
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
document.getElementById('dlg-save').addEventListener('click', () => {
  const name = document.getElementById('f-name').value.trim();
  if (!name) { document.getElementById('f-name').focus(); toast('Name fehlt'); return; }
  const data = {
    name,
    ort: document.getElementById('f-ort').value.trim(),
    art: document.getElementById('f-art').value.trim(),
    link: document.getElementById('f-link').value.trim(),
    note: document.getElementById('f-note').value.trim(),
    values: [...dlgValues]
  };
  if (editingId) {
    const r = restaurants.find(x => x.id === editingId);
    Object.assign(r, data);
    toast(`«${name}» gespeichert`);
  } else {
    const r = { id: uid(), ...data };
    restaurants.push(r); selectedId = r.id;
    toast(`«${name}» erfasst`);
  }
  dlg.close(); save(); render();
});

// ---------- Sichern / Laden (JSON) ----------
document.getElementById('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ version: GF_VERSION, labels, restaurants }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gastrofuehrer-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click(); URL.revokeObjectURL(a.href);
  toast('JSON gesichert');
});
document.getElementById('btn-import').addEventListener('click', () => document.getElementById('file-import').click());
function mergeData(data) {
  const list = Array.isArray(data) ? data : data.restaurants;
  if (!Array.isArray(list)) throw new Error('Kein Restaurant-Array');
  let added = 0;
  for (const r of list) {
    if (!r?.name) continue;
    const values = Array.isArray(r.values) && r.values.length === N ? r.values.map(v => typeof v === 'number' ? v : DEFAULT_VALUE) : Array(N).fill(DEFAULT_VALUE);
    const existing = restaurants.find(x => x.id === r.id);
    const rec = { id: r.id || uid(), name: r.name, ort: r.ort || '', art: r.art || '', link: r.link || '', note: r.note || '', values };
    if (existing) Object.assign(existing, rec); else restaurants.push(rec);
    added++;
  }
  if (Array.isArray(data.labels) && data.labels.length === N) labels = data.labels;
  return added;
}
document.getElementById('file-import').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const added = mergeData(JSON.parse(await f.text()));
    save(); render(); toast(`${added} Restaurants geladen`);
  } catch (err) {
    toast('Datei konnte nicht gelesen werden: ' + err.message);
  }
  e.target.value = '';
});

// Fiktive Beispieldaten (restaurants.json im Repo)
async function loadDemo(silent) {
  try {
    const res = await fetch('restaurants.json?v=' + GF_VERSION);
    if (!res.ok) throw new Error(res.status);
    const added = mergeData(await res.json());
    save(); render();
    if (!silent) toast(`${added} Beispiel-Restaurants geladen`);
  } catch (err) {
    if (!silent) toast('Beispiele nicht gefunden (restaurants.json fehlt?)');
  }
}
document.getElementById('btn-demo').addEventListener('click', () => {
  const hasDemo = restaurants.some(r => String(r.id).startsWith('demo-'));
  if (hasDemo) {
    if (!confirm('Beispiel-Restaurants entfernen? Eigene Einträge bleiben erhalten.')) return;
    restaurants = restaurants.filter(r => !String(r.id).startsWith('demo-'));
    if (selectedId && !restaurants.some(r => r.id === selectedId)) selectedId = null;
    save(); render(); toast('Beispiele entfernt');
  } else {
    loadDemo(false);
  }
});

// ---------- Tabelle Wunschprofil ----------
function drawTable() {
  const tb = document.getElementById('table-body');
  tb.innerHTML = '';
  labels.forEach((lab, i) => {
    const tr = document.createElement('tr');
    const tdC = document.createElement('td'); tdC.className = 'crit';
    const nameBtn = document.createElement('button');
    nameBtn.textContent = lab; nameBtn.title = 'Umbenennen';
    nameBtn.addEventListener('click', () => renameLabel(i));
    tdC.appendChild(nameBtn); tr.appendChild(tdC);

    const tdV = document.createElement('td'); tdV.className = 'vals';
    const off = document.createElement('button');
    off.className = 'btn small off' + (wish[i] === null ? ' active' : '');
    off.textContent = 'egal';
    off.addEventListener('click', () => { wish[i] = null; save(); render(); });
    tdV.appendChild(off);
    for (let l = 1; l <= LEVELS; l++) {
      const b = document.createElement('button');
      b.className = 'btn small' + (wish[i] === l ? ' active' : ''); b.textContent = l;
      b.addEventListener('click', () => setWish(i, l));
      tdV.appendChild(b);
    }
    tr.appendChild(tdV); tb.appendChild(tr);
  });
}
function renameLabel(i) {
  const v = prompt('Kriterium umbenennen:', labels[i]);
  if (v === null || !v.trim()) return;
  labels[i] = v.trim(); save(); render(); toast('Kriterium umbenannt');
}

// ---------- Render ----------
function render() {
  drawArtSelect(); drawRadar(); drawOverlayInfo(); drawEgalRow(); drawList(); drawTable();
  const demoBtn = document.getElementById('btn-demo');
  const hasDemo = restaurants.some(r => String(r.id).startsWith('demo-'));
  demoBtn.textContent = hasDemo ? 'Beispiele entfernen' : 'Beispiele laden';
}

document.getElementById('app-version').textContent = 'v' + GF_VERSION;
document.getElementById('footer-version').textContent = 'Gastroführer v' + GF_VERSION;
render();
if (!restaurants.length) loadDemo(true); // leere Liste: Beispiele automatisch laden
