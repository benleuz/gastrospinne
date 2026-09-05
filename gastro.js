/* Gastroführer – gastro.js */
'use strict';

const GF_VERSION = '0.1.0';

// ---------- Konstanten ----------
const DEFAULT_LABELS = [
  'Preisniveau', 'Ambiente', 'Weinkarte', 'Essen',
  'Sehen und gesehen werden', 'Weitere Option 1', 'Weitere Option 2'
];
const N = DEFAULT_LABELS.length;
const LEVELS = 5;
const DEFAULT_VALUE = 3;
const PALETTE = ['#1f6fe0', '#e0561f', '#1fa05a', '#a23fd9', '#d9a21f', '#1fb2c9', '#c92f6b'];

const LS_THEME = 'gf-theme';
const LS_PROFILES = 'gf-profiles';
const LS_LABELS = 'gf-labels';

// SVG-Geometrie
const SIZE = 640, CX = 320, CY = 320, R = 235, LABEL_R = R + 34;

// ---------- Zustand ----------
let labels = loadJSON(LS_LABELS, null);
if (!Array.isArray(labels) || labels.length !== N) labels = [...DEFAULT_LABELS];

let state = loadJSON(LS_PROFILES, null);
if (!state || !Array.isArray(state.profiles) || !state.profiles.length) {
  state = { profiles: [newProfile('Profil 1')], activeId: null };
  state.activeId = state.profiles[0].id;
}
if (!state.profiles.some(p => p.id === state.activeId)) state.activeId = state.profiles[0].id;

function newProfile(name) {
  return {
    id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    values: Array(N).fill(DEFAULT_VALUE) // 1–5 oder null (= egal)
  };
}
function active() { return state.profiles.find(p => p.id === state.activeId); }
function colorOf(p) { return PALETTE[state.profiles.indexOf(p) % PALETTE.length]; }

// ---------- Speichern / Laden ----------
function loadJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save() {
  try {
    localStorage.setItem(LS_PROFILES, JSON.stringify(state));
    localStorage.setItem(LS_LABELS, JSON.stringify(labels));
  } catch { /* privater Modus o.ä. */ }
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

// ---------- Toast ----------
function toast(msg) {
  const box = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

// ---------- Geometrie ----------
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

// ---------- Netz zeichnen ----------
const svg = document.getElementById('radar');

function drawRadar() {
  svg.innerHTML = '';
  const act = active();

  // Ringe
  for (let l = 1; l <= LEVELS; l++) {
    const pts = [];
    for (let i = 0; i < N; i++) pts.push(point(i, l).join(','));
    svgEl('polygon', { class: 'ring', points: pts.join(' ') }, svg);
    const [x, y] = point(0, l);
    svgEl('text', { class: 'level-num', x: x + 6, y: y + 4 }, svg).textContent = l;
  }

  // Achsen + Titel + Trefferzonen
  for (let i = 0; i < N; i++) {
    const off = act.values[i] === null;
    const [x, y] = point(i, LEVELS);
    svgEl('line', { class: 'axis' + (off ? ' off' : ''), x1: CX, y1: CY, x2: x, y2: y }, svg);
    const hit = svgEl('line', { class: 'axis-hit', x1: CX, y1: CY, x2: x, y2: y, 'data-axis': i }, svg);
    hit.addEventListener('pointerdown', onAxisPointerDown);

    // Stufenpunkte
    for (let l = 1; l <= LEVELS; l++) {
      const [sx, sy] = point(i, l);
      const c = svgEl('circle', {
        class: 'step' + (off ? ' off' : ''), cx: sx, cy: sy, r: 5,
        'data-axis': i, 'data-level': l
      }, svg);
      c.addEventListener('pointerdown', onAxisPointerDown);
    }

    // Achsentitel
    const a = angle(i);
    const lx = CX + LABEL_R * Math.cos(a), ly = CY + LABEL_R * Math.sin(a);
    const cos = Math.cos(a);
    const anchor = Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end';
    const t = svgEl('text', {
      class: 'label' + (off ? ' off' : ''), x: lx, y: ly + 5,
      'text-anchor': anchor, 'data-axis': i
    }, svg);
    t.textContent = labels[i] + (off ? ' (egal)' : '');
    t.addEventListener('click', () => toggleOff(i));
  }

  // Polygone: inaktive zuerst, aktives zuletzt (oben)
  const ordered = [...state.profiles.filter(p => p !== act), act];
  for (const p of ordered) {
    const col = colorOf(p);
    const isAct = p === act;
    const pts = [];
    for (let i = 0; i < N; i++) if (p.values[i] !== null) pts.push(point(i, p.values[i]));
    if (pts.length >= 2) {
      svgEl(pts.length >= 3 ? 'polygon' : 'polyline', {
        class: 'poly' + (isAct ? '' : ' inactive'),
        points: pts.map(q => q.join(',')).join(' '),
        fill: col, stroke: col
      }, svg);
    }
    for (let i = 0; i < N; i++) {
      if (p.values[i] === null) continue;
      const [dx, dy] = point(i, p.values[i]);
      const d = svgEl('circle', {
        class: 'dot' + (isAct ? ' active' : ''), cx: dx, cy: dy,
        r: isAct ? 7 : 4, fill: col, stroke: 'var(--card)', 'stroke-width': isAct ? 2 : 1,
        'data-axis': i
      }, svg);
      if (isAct) d.addEventListener('pointerdown', onAxisPointerDown);
    }
  }
}

// ---------- Interaktion Netz ----------
let drag = null; // { axis }

function svgPoint(evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  const m = svg.getScreenCTM().inverse();
  const p = pt.matrixTransform(m);
  return [p.x, p.y];
}
function levelFromPointer(axis, evt) {
  const [px, py] = svgPoint(evt);
  const a = angle(axis);
  // Projektion auf die Achse
  const proj = (px - CX) * Math.cos(a) + (py - CY) * Math.sin(a);
  let l = Math.round((proj / R) * LEVELS);
  return Math.max(1, Math.min(LEVELS, l));
}
function onAxisPointerDown(evt) {
  evt.preventDefault();
  const axis = +evt.currentTarget.dataset.axis;
  const explicit = evt.currentTarget.dataset.level;
  const level = explicit ? +explicit : levelFromPointer(axis, evt);
  setValue(axis, level, false);
  drag = { axis, last: level };
  svg.setPointerCapture?.(evt.pointerId);
}
svg.addEventListener('pointermove', evt => {
  if (!drag) return;
  const l = levelFromPointer(drag.axis, evt);
  if (l !== drag.last) { drag.last = l; setValue(drag.axis, l, false); }
});
function endDrag() { if (drag) { drag = null; save(); } }
svg.addEventListener('pointerup', endDrag);
svg.addEventListener('pointercancel', endDrag);

function setValue(axis, level, persist = true) {
  const p = active();
  p.values[axis] = level;
  if (persist) save();
  render();
}
function toggleOff(axis) {
  const p = active();
  p.values[axis] = p.values[axis] === null ? DEFAULT_VALUE : null;
  save(); render();
}

// ---------- Legende ----------
function drawLegend() {
  const box = document.getElementById('legend');
  box.innerHTML = '';
  for (const p of state.profiles) {
    const b = document.createElement('button');
    b.className = 'chip' + (p.id === state.activeId ? ' active' : '');
    b.style.setProperty('--chip', colorOf(p));
    b.innerHTML = `<span class="swatch" style="background:${colorOf(p)}"></span>`;
    b.appendChild(document.createTextNode(p.name));
    b.title = 'Profil aktivieren';
    b.addEventListener('click', () => { state.activeId = p.id; save(); render(); });
    box.appendChild(b);
  }
}

// ---------- Tabelle ----------
function drawTable() {
  const tb = document.getElementById('table-body');
  tb.innerHTML = '';
  const p = active();
  labels.forEach((lab, i) => {
    const tr = document.createElement('tr');
    const tdC = document.createElement('td'); tdC.className = 'crit';
    const nameBtn = document.createElement('button');
    nameBtn.textContent = lab; nameBtn.title = 'Umbenennen';
    nameBtn.addEventListener('click', () => renameLabel(i));
    tdC.appendChild(nameBtn);
    tr.appendChild(tdC);

    const tdV = document.createElement('td'); tdV.className = 'vals';
    const off = document.createElement('button');
    off.className = 'btn small off' + (p.values[i] === null ? ' active' : '');
    off.textContent = 'egal';
    off.addEventListener('click', () => { p.values[i] = null; save(); render(); });
    tdV.appendChild(off);
    for (let l = 1; l <= LEVELS; l++) {
      const b = document.createElement('button');
      b.className = 'btn small' + (p.values[i] === l ? ' active' : '');
      b.textContent = l;
      b.addEventListener('click', () => setValue(i, l));
      tdV.appendChild(b);
    }
    tr.appendChild(tdV);
    tb.appendChild(tr);
  });
}
function renameLabel(i) {
  const v = prompt('Kriterium umbenennen:', labels[i]);
  if (v === null) return;
  const name = v.trim();
  if (!name) return;
  labels[i] = name; save(); render();
  toast('Kriterium umbenannt');
}

// ---------- Profile ----------
document.getElementById('btn-add').addEventListener('click', () => {
  const p = newProfile('Profil ' + (state.profiles.length + 1));
  state.profiles.push(p); state.activeId = p.id;
  save(); render(); toast(`«${p.name}» angelegt`);
});
document.getElementById('btn-rename').addEventListener('click', () => {
  const p = active();
  const v = prompt('Profil umbenennen:', p.name);
  if (v === null || !v.trim()) return;
  p.name = v.trim(); save(); render(); toast('Profil umbenannt');
});
document.getElementById('btn-reset').addEventListener('click', () => {
  const p = active();
  p.values = Array(N).fill(DEFAULT_VALUE);
  save(); render(); toast(`«${p.name}» zurückgesetzt`);
});
document.getElementById('btn-delete').addEventListener('click', () => {
  const p = active();
  if (state.profiles.length === 1) {
    p.values = Array(N).fill(DEFAULT_VALUE); p.name = 'Profil 1';
    save(); render(); toast('Letztes Profil zurückgesetzt'); return;
  }
  if (!confirm(`Profil «${p.name}» löschen?`)) return;
  const idx = state.profiles.indexOf(p);
  state.profiles.splice(idx, 1);
  state.activeId = state.profiles[Math.max(0, idx - 1)].id;
  save(); render(); toast(`«${p.name}» gelöscht`);
});

// ---------- Theme-Knopf ----------
document.getElementById('btn-theme').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});

// ---------- Render ----------
function render() { drawRadar(); drawLegend(); drawTable(); }

document.getElementById('app-version').textContent = 'v' + GF_VERSION;
document.getElementById('footer-version').textContent = 'Gastroführer v' + GF_VERSION;
render();
