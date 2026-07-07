import './styles.css';
import {
  Box,
  Camera,
  ClipboardList,
  Database,
  Download,
  FileText,
  FolderOpen,
  Link,
  Map,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  createIcons,
} from 'lucide';
import {
  GOBO_KINDS,
  GOBO_STANDARD_SIZES,
  KIT_SIZES,
  MIC_TYPES,
  PATTERNS,
  clone,
  createDefaultState,
  createId,
  goboStandardSizeById,
  inferGoboStandardSize,
  inft,
} from './data/defaultState.js';
import {
  applyKitSize,
  clampGoboToRoom,
  clampMicToRoom,
  duplicateAsNewProject,
  setKitSize,
  validatePlannerState,
} from './data/validation.js';
import { MIC_CATALOG_FALLBACK, SETUP_TEMPLATES_FALLBACK } from './data/catalogFallback.js';
import { decodeShare, encodeShare } from './data/share.js';
import { deleteProject, getLastProjectId, listProjects, loadProject, saveProject } from './data/storage.js';
import {
  overheadReport,
  patchRows,
  phaseRiskRows,
  rowsToCsv,
  selectedMicReport,
} from './data/metrics.js';
import { REFERENCE_PRESET_CONTEXTS, REFERENCE_PRESET_LAYOUTS } from './data/referencePresetLayouts.js';
import { createPlannerScene } from './render/scene.js';

const DATA_BASE = `${import.meta.env.BASE_URL}data/`;

const app = document.getElementById('app');

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand-block">
        <div class="brand">Drum Mic Planner</div>
        <div class="status-line sr-only" id="statusLine" aria-live="polite"></div>
        <div class="degraded-banner" id="storageWarning" role="status" hidden></div>
      </div>
      <div class="project-bar">
        <label class="field compact-field">
          <span>Project</span>
          <input id="projectName" type="text" autocomplete="off" />
        </label>
        <label class="field compact-field">
          <span>Saved</span>
          <select id="projectSelect"></select>
        </label>
        <button id="btnNewProject" type="button"><i data-lucide="plus"></i><span>New</span></button>
        <button id="btnSaveProject" class="primary" type="button"><i data-lucide="save"></i><span>Save</span></button>
        <button id="btnDeleteProject" type="button"><i data-lucide="trash-2"></i><span>Delete</span></button>
      </div>
    </header>

    <main class="workspace">
      <section class="stage-column">
        <div id="viewport">
          <div id="tooltip"></div>
          <div id="toast"></div>
          <div class="viewer-toolbar">
            <button id="btnOrbitView" type="button"><i data-lucide="rotate-ccw"></i><span>Orbit</span></button>
            <button id="btnTopView" type="button"><i data-lucide="map"></i><span>Top</span></button>
            <button id="btnSnapshot" type="button"><i data-lucide="camera"></i><span>PNG</span></button>
          </div>
        </div>

      </section>

      <aside class="inspector">
        <nav class="tabs" aria-label="Planner panels">
          <button class="tab active" type="button" data-tab="project"><i data-lucide="folder-open"></i><span>Project</span></button>
          <button class="tab" type="button" data-tab="room"><i data-lucide="box"></i><span>Room</span></button>
          <button class="tab" type="button" data-tab="kit"><i data-lucide="database"></i><span>Kit</span></button>
          <button class="tab" type="button" data-tab="mic"><i data-lucide="clipboard-list"></i><span>Mics</span></button>
          <button class="tab" type="button" data-tab="gobos"><i data-lucide="map"></i><span>Gobos</span></button>
          <button class="tab" type="button" data-tab="data"><i data-lucide="file-text"></i><span>Data</span></button>
        </nav>

        <div class="tab-panel active" data-panel="project">
          <section>
            <p class="sec-title">Session</p>
            <div class="row">
              <label class="field"><span>Engineer</span><input id="projectEngineer" type="text" autocomplete="off" /></label>
              <label class="field"><span>Date</span><input id="projectDate" type="date" /></label>
            </div>
            <label class="field"><span>Venue</span><input id="projectVenue" type="text" autocomplete="off" /></label>
            <label class="field"><span>Notes</span><textarea id="projectNotes" rows="5"></textarea></label>
          </section>
          <section>
            <p class="sec-title">Templates</p>
            <div class="row">
              <label class="field"><span>Mic package</span><select id="templateSelect"></select></label>
              <button id="btnApplyTemplate" type="button"><i data-lucide="refresh-cw"></i><span>Apply</span></button>
            </div>
            <div id="templateDetails" class="data-readout"></div>
          </section>
          <section>
            <p class="sec-title">Reference presets</p>
            <label class="field"><span>Preset</span><select id="referenceConfigSelect"></select></label>
            <div class="row">
              <label class="field"><span>Layout</span><select id="referencePresetSelect"></select></label>
              <button id="btnApplyReferencePreset" type="button"><i data-lucide="refresh-cw"></i><span>Apply</span></button>
            </div>
            <div id="referenceConfigDetails" class="data-readout reference-readout"></div>
          </section>
        </div>

        <div class="tab-panel" data-panel="room">
          <section>
            <p class="sec-title">Room</p>
            <div class="row three">
              <label class="field"><span>Width</span><input id="roomW" type="number" min="4" max="200" step="0.5" /></label>
              <label class="field"><span>Length</span><input id="roomL" type="number" min="4" max="200" step="0.5" /></label>
              <label class="field"><span>Height</span><input id="roomH" type="number" min="4" max="60" step="0.5" /></label>
            </div>
            <label class="check"><input id="measurementRays" type="checkbox" /> Measurement ray for selected mic</label>
            <label class="check"><input id="autoSave" type="checkbox" /> Autosave project data</label>
          </section>
        </div>

        <div class="tab-panel" data-panel="kit">
          <section>
            <p class="sec-title">Kit position</p>
            <div class="slider-stack">
              <label class="field slider-field"><span>Kit X <output id="kitGroupXValue"></output></span><input id="kitGroupX" type="range" step="0.25" /></label>
              <label class="field slider-field"><span>Kit Y <output id="kitGroupYValue"></output></span><input id="kitGroupY" type="range" step="0.25" /></label>
            </div>
            <div class="button-row">
              <button id="btnStandardKit" type="button"><i data-lucide="refresh-cw"></i><span>Standard right-handed kit</span></button>
              <button id="btnLeftHandedKit" type="button"><i data-lucide="refresh-cw"></i><span>Standard left-handed kit</span></button>
            </div>
            <details class="advanced-panel">
              <summary>Drum nudges</summary>
              <div class="row">
                <label class="field"><span>Piece</span><select id="kitPiece"></select></label>
                <label class="field"><span>Standard size</span><select id="kitSize"></select></label>
              </div>
              <div class="slider-stack">
                <label class="field slider-field"><span>X <output id="kitXValue"></output></span><input id="kitX" type="range" step="0.1" /></label>
                <label class="field slider-field"><span>Y <output id="kitYValue"></output></span><input id="kitY" type="range" step="0.1" /></label>
                <label class="field slider-field"><span>Z <output id="kitZValue"></output></span><input id="kitZ" type="range" min="0.1" step="0.1" /></label>
                <label class="field slider-field"><span>Diameter <output id="kitDiaValue"></output></span><input id="kitDia" type="range" min="6" max="30" step="1" /></label>
                <label class="field slider-field"><span>Depth <output id="kitDepthValue"></output></span><input id="kitDepth" type="range" min="1" max="24" step="0.5" /></label>
              </div>
            </details>
          </section>
        </div>

        <div class="tab-panel" data-panel="mic">
          <section>
            <p class="sec-title">Microphone</p>
            <label class="field"><span>Selected mic</span><select id="micSelect"></select></label>
            <div class="row">
              <label class="field"><span>Add standard mic</span><select id="standardMicSelect"></select></label>
              <button id="btnAddMic" type="button"><i data-lucide="plus"></i><span>Add</span></button>
            </div>
            <div class="row">
              <label class="field small-field"><span>Channel</span><input id="micChannel" type="number" min="1" max="128" step="1" /></label>
              <label class="field"><span>Name</span><input id="micName" type="text" autocomplete="off" /></label>
            </div>
            <label class="field"><span>Catalog profile</span><select id="micCatalog"></select></label>
            <div id="catalogDetails" class="data-readout"></div>
            <div class="row">
              <label class="field"><span>Body</span><select id="micType"></select></label>
              <label class="field"><span>Pattern</span><select id="micPattern"></select></label>
            </div>
            <label class="field"><span>Target</span><select id="micTarget"></select></label>
            <div class="slider-stack">
              <label class="field slider-field"><span>X <output id="micXValue"></output></span><input id="micX" type="range" step="0.1" /></label>
              <label class="field slider-field"><span>Y <output id="micYValue"></output></span><input id="micY" type="range" step="0.1" /></label>
              <label class="field slider-field"><span>Z <output id="micZValue"></output></span><input id="micZ" type="range" min="0.1" step="0.1" /></label>
            </div>
            <label class="check"><input id="micStand" type="checkbox" /> Stand</label>
            <label class="field"><span>Mic notes</span><textarea id="micNotes" rows="3"></textarea></label>
            <div class="button-row single-action">
              <button id="btnDeleteMic" type="button"><i data-lucide="trash-2"></i><span>Delete mic</span></button>
            </div>
          </section>
        </div>

        <div class="tab-panel" data-panel="gobos">
          <section>
            <p class="sec-title">Gobos</p>
            <div class="row">
              <label class="field"><span>Selected gobo</span><select id="goboSelect"></select></label>
              <label class="field"><span>Standard size</span><select id="goboSize"></select></label>
            </div>
            <div class="slider-stack">
              <label class="field slider-field"><span>X <output id="goboXValue"></output></span><input id="goboX" type="range" step="0.1" /></label>
              <label class="field slider-field"><span>Y <output id="goboYValue"></output></span><input id="goboY" type="range" step="0.1" /></label>
              <label class="field slider-field"><span>Angle <output id="goboRotValue"></output></span><input id="goboRot" type="range" min="-180" max="180" step="1" /></label>
            </div>
            <div class="button-row">
              <button id="btnAddGobo" type="button"><i data-lucide="plus"></i><span>Add gobo</span></button>
              <button id="btnDeleteGobo" type="button"><i data-lucide="trash-2"></i><span>Delete gobo</span></button>
            </div>
            <details class="advanced-panel">
              <summary>Specialized specs</summary>
              <label class="field"><span>Name</span><input id="goboName" type="text" autocomplete="off" /></label>
              <div class="row">
                <label class="field"><span>Type</span><select id="goboKind"></select></label>
                <label class="field slider-field"><span>Depth <output id="goboDepthValue"></output></span><input id="goboDepth" type="range" min="0.02" max="2" step="0.01" /></label>
              </div>
              <div class="slider-stack">
                <label class="field slider-field"><span>Width <output id="goboWValue"></output></span><input id="goboW" type="range" min="1" max="12" step="0.1" /></label>
                <label class="field slider-field"><span>Height <output id="goboHValue"></output></span><input id="goboH" type="range" min="1" max="12" step="0.1" /></label>
              </div>
            </details>
          </section>
        </div>

        <div class="tab-panel" data-panel="data">
          <section>
            <p class="sec-title">Exports</p>
            <div class="button-grid">
              <button id="btnExportJson" type="button"><i data-lucide="download"></i><span>JSON</span></button>
              <button id="btnImportJson" type="button"><i data-lucide="upload"></i><span>Import</span></button>
              <button id="btnShare" type="button"><i data-lucide="link"></i><span>Share</span></button>
              <button id="btnCsv" type="button"><i data-lucide="clipboard-list"></i><span>CSV</span></button>
              <button id="btnReport" type="button"><i data-lucide="file-text"></i><span>Report</span></button>
              <button id="btnReset" type="button"><i data-lucide="refresh-cw"></i><span>Reset</span></button>
            </div>
            <div id="libraryDetails" class="data-readout library-readout"></div>
            <input id="importFile" type="file" accept=".json,application/json" hidden />
          </section>
          <section>
            <p class="sec-title">Studio inventory</p>
            <label class="field">
              <span>Mic / gear list</span>
              <textarea id="studioImportText" rows="6" placeholder="MICS&#10;4x Shure SM57&#10;2x Sennheiser MD 421&#10;GEAR&#10;Neve 1073 preamp"></textarea>
            </label>
            <div class="button-row">
              <button id="btnImportStudioList" type="button"><i data-lucide="upload"></i><span>Import list</span></button>
              <button id="btnClearStudioInventory" type="button"><i data-lucide="trash-2"></i><span>Clear inventory</span></button>
            </div>
            <div id="studioInventoryDetails" class="data-readout studio-readout"></div>
          </section>
          <section>
            <p class="sec-title">Technical checks</p>
            <div class="technical-checks">
              <div class="check-group">
                <p class="check-title">Selected mic</p>
                <div id="selectedMetrics" class="metric-grid"></div>
              </div>
              <div class="check-group">
                <p class="check-title">Phase checks</p>
                <div id="phaseMetrics" class="metric-list"></div>
              </div>
              <div class="check-group">
                <p class="check-title">Overheads</p>
                <div id="overheadMetrics" class="metric-list"></div>
              </div>
            </div>
          </section>
          <section>
            <p class="sec-title">Patch list</p>
            <div id="patchTable" class="table-wrap"></div>
          </section>
        </div>
      </aside>
    </main>
  </div>
`;

createIcons({
  icons: {
    Box,
    Camera,
    ClipboardList,
    Database,
    Download,
    FileText,
    FolderOpen,
    Link,
    Map,
    Plus,
    RefreshCw,
    RotateCcw,
    Save,
    Trash2,
    Upload,
  },
});

const $ = (id) => document.getElementById(id);

let state = validatePlannerState(createDefaultState());
let selectedMicIndex = 0;
let selectedGoboIndex = 0;
let catalog = [];
let templates = [];
let referenceConfigs = [];
let projects = [];
let autosaveTimer = null;
let sceneApi = null;
let storageAvailable = true;
let sharedImportNotice = false;

const REF_NOTE_START = '[Reference preset context]';
const REF_NOTE_END = '[/Reference preset context]';
const MIC_FORM_IDS = [
  'micChannel',
  'micName',
  'micCatalog',
  'micType',
  'micPattern',
  'micTarget',
  'micX',
  'micY',
  'micZ',
  'micStand',
  'micNotes',
];

const GOBO_FORM_IDS = [
  'goboName',
  'goboKind',
  'goboX',
  'goboY',
  'goboRot',
  'goboDepth',
  'goboW',
  'goboH',
];

const STANDARD_MIC_PRESETS = [
  { id: 'kick-in', name: 'Kick In', catalogId: 'akg-d112', target: 'Kick', x: 0, y: -1.35, z: 0.9 },
  { id: 'kick-out', name: 'Kick Out', catalogId: 'neumann-fet47', micType: 'ldc', target: 'Kick', x: 0, y: -2.5, z: 1.1 },
  { id: 'snare-top', name: 'Snare Top', catalogId: 'shure-sm57', target: 'Snare', x: 1.6, y: 1.8, z: 1.9 },
  { id: 'snare-bottom', name: 'Snare Btm', catalogId: 'akg-c451', micType: 'pencil', target: 'Snare', x: 1.35, y: 1.55, z: 0.9 },
  { id: 'rack-tom', name: 'Rack Tom', catalogId: 'sennheiser-md421', target: 'Hi/Mid Tom', x: 0.75, y: 0.1, z: 3.1 },
  { id: 'floor-tom', name: 'Floor Tom', catalogId: 'sennheiser-md421', target: 'Low Tom', x: -2.4, y: 1.9, z: 2.1 },
  { id: 'hi-hat', name: 'Hi Hat', catalogId: 'akg-c451', micType: 'pencil', target: 'Hi Hat', x: 2.8, y: 1.6, z: 3.2 },
  { id: 'ride', name: 'Ride Spot', catalogId: 'neumann-km184', micType: 'pencil', target: 'Ride', x: -2.8, y: -0.8, z: 3.7 },
  { id: 'overhead-l', name: 'Overhead L', catalogId: 'akg-c414', micType: 'ldc', target: 'Snare', x: 2.4, y: 0.15, z: 5.8 },
  { id: 'overhead-r', name: 'Overhead R', catalogId: 'akg-c414', micType: 'ldc', target: 'Snare', x: -2.4, y: 0.15, z: 5.8 },
  { id: 'mono-overhead', name: 'Mono Overhead', catalogId: 'rca-ribbon', micType: 'ldc', pattern: 'figure-8', target: 'Snare', x: 0, y: 0.25, z: 5.0 },
  { id: 'front-crush', name: 'Front/Crush', catalogId: 'shure-sm7b', micType: 'dynamic', target: 'Kick', x: 0, y: -4.0, z: 2.5 },
  { id: 'room-l', name: 'Room L', catalogId: 'neumann-u87', micType: 'ldc', pattern: 'omni', target: 'Kick', x: 3.2, y: -8.5, z: 4.2 },
  { id: 'room-r', name: 'Room R', catalogId: 'neumann-u87', micType: 'ldc', pattern: 'omni', target: 'Kick', x: -3.2, y: -8.5, z: 4.2 },
  { id: 'mono-room', name: 'Mono Room', catalogId: 'altec-639', micType: 'ldc', pattern: 'figure-8', target: 'Kick', x: 0, y: -10.5, z: 4.1 },
  { id: 'trash-room', name: 'Trash Room', catalogId: 'ev-635a', micType: 'dynamic', pattern: 'omni', target: 'Kick', x: -4.5, y: -7.5, z: 1.4 },
];

const MIC_BRANDS = [
  'AKG',
  'Altec',
  'Audio-Technica',
  'Audix',
  'Beyerdynamic',
  'Blue',
  'Cascade',
  'Coles',
  'DPA',
  'Earthworks',
  'Electro-Voice',
  'EV',
  'Heil',
  'Lewitt',
  'Mojave',
  'Neumann',
  'RCA',
  'Royer',
  'Schoeps',
  'Sennheiser',
  'Shure',
  'Sony',
  'Telefunken',
  'Warm Audio',
];

const MIC_MODEL_NEEDLES = [
  'sm57',
  'sm7',
  'md421',
  'md 421',
  're20',
  're 20',
  'd112',
  'd 112',
  'c414',
  'c 414',
  'c451',
  'c 451',
  'km184',
  'km 184',
  'u87',
  'u 87',
  'fet 47',
  '4038',
  'm160',
  'm 160',
  'm201',
  'm 201',
  'm88',
  'm 88',
  'r121',
  'r-121',
  'm49',
  'm 49',
  'u67',
  'u 67',
  '635a',
];

function fmt(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

function compactNumber(value, digits = 1) {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(digits).replace(/\.0$/, '');
}

function writeValue(id, value) {
  const el = $(id);
  if (!el) return;
  const next = value == null ? '' : String(value);
  if (el.value !== next) el.value = next;
}

function writeSlider(id, value, { min, max, step = 0.1, suffix = ' ft', digits = 1, disabled = false } = {}) {
  const el = $(id);
  if (!el) return;
  if (min != null) el.min = String(min);
  if (max != null) el.max = String(max);
  el.step = String(step);
  el.disabled = disabled;
  const fallback = Number(el.min || 0);
  const numeric = Number.isFinite(value) ? value : fallback;
  const clamped = Math.min(Number(el.max || numeric), Math.max(Number(el.min || numeric), numeric));
  writeValue(id, compactNumber(clamped, digits));
  const readout = $(`${id}Value`);
  if (readout) readout.textContent = disabled ? '—' : `${compactNumber(clamped, digits)}${suffix}`;
}

function updateSliderOutput(id, { suffix = ' ft', digits = 1 } = {}) {
  const el = $(id);
  const readout = $(`${id}Value`);
  if (!el || !readout) return;
  readout.textContent = el.disabled ? '—' : `${compactNumber(Number(el.value), digits)}${suffix}`;
}

function setDisabled(ids, disabled) {
  ids.forEach((id) => {
    const el = $(id);
    if (el) el.disabled = disabled;
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return entities[char];
  });
}

function setChecked(id, checked) {
  const el = $(id);
  if (el) el.checked = !!checked;
}

function option(label, value, selected = false) {
  return `<option value="${escapeHtml(value)}" ${selected ? 'selected' : ''}>${escapeHtml(label)}</option>`;
}

function toast(message) {
  const node = $('toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove('show'), 1600);
}

function setStatus(message) {
  const node = $('statusLine');
  if (node) node.textContent = message;
}

function markStorageDegraded(message = 'Local storage unavailable. Autosave is off; export JSON to keep this project.') {
  const firstFailure = storageAvailable;
  storageAvailable = false;
  clearTimeout(autosaveTimer);
  if (state?.options) state.options.autosave = false;

  const node = $('storageWarning');
  if (node) {
    node.textContent = message;
    node.hidden = false;
  }
  const autosaveToggle = $('autoSave');
  if (autosaveToggle) {
    autosaveToggle.checked = false;
    autosaveToggle.disabled = true;
  }
  setStatus(message);
  if (firstFailure) toast(message);
}

function clearShareHash() {
  if (!location.hash.startsWith('#setup=')) return;
  history.replaceState(null, document.title, `${location.pathname}${location.search}`);
}

async function loadJsonFile(path, fallback) {
  if (window.__DRUM_PLANNER_INLINE_DATA__) return fallback;
  try {
    const response = await fetch(`${DATA_BASE}${path}`);
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Could not load ${path}`, error);
    return fallback;
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeLookup(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function combinedCatalog() {
  return [...catalog, ...(state.studioInventory?.mics || [])];
}

function catalogById(id) {
  return combinedCatalog().find((item) => item.id === id) || null;
}

function kitAnchor() {
  const kick = state.kit.find((drum) => drum.id === 'kick' || drum.name === 'Kick');
  if (kick) return { x: kick.x, y: kick.y };
  if (!state.kit.length) return { x: 0, y: 0 };
  return state.kit.reduce(
    (anchor, drum, index, drums) => ({
      x: anchor.x + drum.x / drums.length,
      y: anchor.y + drum.y / drums.length,
    }),
    { x: 0, y: 0 },
  );
}

function moveKitLayout(dx, dy) {
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return;
  const kitTargets = new Set(state.kit.map((drum) => drum.name));
  state.kit.forEach((drum) => {
    drum.x += dx;
    drum.y += dy;
  });
  state.mics.forEach((mic) => {
    if (!kitTargets.has(mic.target)) return;
    mic.x += dx;
    mic.y += dy;
    clampMicToRoom(mic, state.room);
  });
}

function goboSizeLabel(size) {
  return size ? size.name : '4 x 6 ft large panel';
}

function defaultGoboSize() {
  return goboStandardSizeById('large-4x6') || GOBO_STANDARD_SIZES[0];
}

function goboKindById(id) {
  return GOBO_KINDS.find((kind) => kind.id === id) || GOBO_KINDS[0];
}

function applyGoboStandardSize(gobo, sizeId) {
  const size = goboStandardSizeById(sizeId);
  if (!gobo || !size) return gobo;
  gobo.standardSizeId = size.id;
  gobo.w = size.w;
  gobo.h = size.h;
  gobo.depth = size.depth;
  if (!gobo.kind) gobo.kind = 'panel';
  return gobo;
}

function createGoboFromStandardSize(sizeId) {
  const size = goboStandardSizeById(sizeId) || defaultGoboSize();
  const count = state.gobos.length + 1;
  return clampGoboToRoom(
    {
      id: createId('gobo'),
      name: `Gobo ${count}`,
      standardSizeId: size.id,
      kind: 'panel',
      x: Math.min(state.room.width / 2 - 1, Math.max(-state.room.width / 2 + 1, (count - 1) * 0.6)),
      y: Math.min(state.room.length / 2 - 1, 3 + (count - 1) * 0.5),
      rot: 0,
      w: size.w,
      h: size.h,
      depth: size.depth,
    },
    state.room,
  );
}

function cleanInventoryLine(line) {
  return String(line || '')
    .replace(/^[\s>*•-]+/, '')
    .replace(/^\[[ x-]\]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inventorySection(line) {
  const normalized = line.replace(/:$/, '').trim().toLowerCase();
  if (/^(mics?|microphones?|microphone list)$/.test(normalized)) return 'mics';
  if (/^(gear|outboard|equipment|backline|instruments|studio gear|preamps?|compressors?)$/.test(normalized)) return 'gear';
  return '';
}

function extractQuantity(line) {
  const prefix = line.match(/^(\d{1,2})\s*(?:x|×)\s+(.+)$/i);
  if (prefix) return { quantity: Number(prefix[1]), item: prefix[2].trim() };
  const suffix = line.match(/^(.+?)\s*(?:x|×)\s*(\d{1,2})$/i);
  if (suffix) return { quantity: Number(suffix[2]), item: suffix[1].trim() };
  const parens = line.match(/^(.+?)\s*\((?:x|qty\s*)?(\d{1,2})\)$/i);
  if (parens) return { quantity: Number(parens[2]), item: parens[1].trim() };
  return { quantity: 1, item: line };
}

function micBrandForLine(line) {
  const normalized = normalizeLookup(line);
  const brands = MIC_BRANDS.slice().sort((a, b) => b.length - a.length);
  const brand = brands.find((candidate) => normalized.startsWith(normalizeLookup(candidate)));
  if (!brand) return null;
  const canonical = brand === 'EV' ? 'Electro-Voice' : brand;
  const variants = [brand, brand.replace('-', ' '), canonical, canonical.replace('-', ' ')].filter(Boolean);
  const matched = variants.find((variant) => line.toLowerCase().startsWith(variant.toLowerCase()));
  const model = matched ? line.slice(matched.length).replace(/^[-\s]+/, '').trim() : line;
  return { manufacturer: canonical, model };
}

function catalogMatchForImport(manufacturer, model, raw) {
  const fullNeedle = normalizeLookup(`${manufacturer} ${model}`);
  const modelNeedle = normalizeLookup(model || raw);
  const rawNeedle = normalizeLookup(raw);
  return (
    catalog.find((item) => {
      const full = normalizeLookup(`${item.manufacturer} ${item.model}`);
      const itemModel = normalizeLookup(item.model);
      return full === fullNeedle || itemModel === modelNeedle || itemModel === rawNeedle;
    }) || null
  );
}

function looksLikeMicInventoryLine(line) {
  const normalized = normalizeLookup(line);
  if (MIC_BRANDS.some((brand) => normalized.startsWith(normalizeLookup(brand)))) return true;
  return MIC_MODEL_NEEDLES.some((needle) => normalized.includes(normalizeLookup(needle)));
}

function inferImportedMicType(raw, match) {
  if (match?.micType) return match.micType;
  const normalized = normalizeLookup(raw);
  if (/d112|beta52|d20|m88|re20/.test(normalized)) return 'kickmic';
  if (/km184|km84|c451|c460|pencil|smallcondenser|sdch/.test(normalized)) return 'pencil';
  if (/c414|u87|u67|fet47|u47|m49|ela|251|4038|r121|ribbon|m160/.test(normalized)) return 'ldc';
  return 'dynamic';
}

function inferImportedPattern(raw, match) {
  if (match?.defaultPattern) return match.defaultPattern;
  const normalized = normalizeLookup(raw);
  if (/4038|r121|ribbon|m160|figure8|figureeight/.test(normalized)) return 'figure-8';
  if (/omni|635a|measurement/.test(normalized)) return 'omni';
  if (/hypercardioid/.test(normalized)) return 'hypercardioid';
  if (/supercardioid/.test(normalized)) return 'supercardioid';
  return 'cardioid';
}

function parseStudioMicLine(line, quantity) {
  const branded = micBrandForLine(line);
  const modelOnlyMatch = branded ? null : catalogMatchForImport('', line, line);
  const manufacturer = branded?.manufacturer || modelOnlyMatch?.manufacturer || '';
  const model = branded?.model || modelOnlyMatch?.model || line;
  const match = catalogMatchForImport(manufacturer, model, line);
  const id = `studio-mic-${slugify(`${manufacturer || 'studio'}-${model}`) || createId('mic')}`;
  const notes = [`Studio inventory import`, quantity > 1 ? `Qty ${quantity}` : '', match ? `Matched catalog: ${match.manufacturer} ${match.model}` : ''].filter(Boolean).join(' · ');
  return {
    id,
    manufacturer,
    model,
    micType: inferImportedMicType(`${manufacturer} ${model}`, match),
    defaultPattern: inferImportedPattern(`${manufacturer} ${model}`, match),
    sources: match?.sources || ['Studio Inventory'],
    maxSpl: match?.maxSpl ?? null,
    notes,
    quantity,
    imported: true,
  };
}

function parseStudioGearLine(line, quantity) {
  return {
    id: `studio-gear-${slugify(line) || createId('gear')}`,
    name: line,
    category: 'Studio gear',
    quantity,
    notes: 'Studio inventory import',
    imported: true,
  };
}

function mergeInventoryItems(existing, incoming) {
  const byId = new Map(existing.map((item) => [item.id, item]));
  incoming.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
}

function parseStudioInventoryText(text) {
  const result = { mics: [], gear: [] };
  let section = 'mixed';
  String(text || '')
    .split(/\r?\n/)
    .map(cleanInventoryLine)
    .filter(Boolean)
    .forEach((line) => {
      const nextSection = inventorySection(line);
      if (nextSection) {
        section = nextSection;
        return;
      }
      const { quantity, item } = extractQuantity(line.replace(/[,;]+$/, ''));
      if (!item) return;
      const isMic = section === 'mics' || (section === 'mixed' && looksLikeMicInventoryLine(item));
      if (isMic) result.mics.push(parseStudioMicLine(item, quantity));
      else result.gear.push(parseStudioGearLine(item, quantity));
    });
  return result;
}

function applyCatalogToMic(mic, catalogId) {
  const item = catalogById(catalogId);
  mic.catalogId = catalogId || '';
  if (item) {
    mic.micType = item.micType;
    mic.pattern = item.defaultPattern;
  }
}

function updateState({ autosave = true, refreshForms = false } = {}) {
  state = validatePlannerState(state);
  selectedMicIndex = state.mics.length ? Math.max(0, Math.min(selectedMicIndex, state.mics.length - 1)) : 0;
  selectedGoboIndex = state.gobos.length ? Math.max(0, Math.min(selectedGoboIndex, state.gobos.length - 1)) : 0;
  state.project.updatedAt = new Date().toISOString();
  sceneApi.setState(state);
  sceneApi.setSelectedMicIndex(selectedMicIndex);
  sceneApi.setSelectedGoboIndex(selectedGoboIndex);
  renderAnalysis();
  renderPatchTable();
  updateCatalogDetails();
  updateTemplateDetails();
  updateReferenceConfigDetails();
  renderLibraryDetails();
  renderStudioInventoryDetails();
  if (refreshForms) renderForms();
  if (autosave) scheduleAutosave();
}

function scheduleAutosave() {
  if (!state.options.autosave || !storageAvailable) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(async () => {
    try {
      state = await saveProject(state);
      await refreshProjectList();
      setStatus(`Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      console.error(error);
      markStorageDegraded('Autosave failed. Local storage is unavailable; export JSON to keep this project.');
    }
  }, 700);
}

async function refreshProjectList() {
  if (!storageAvailable) {
    projects = [];
    $('projectSelect').innerHTML = option('Local storage unavailable', '');
    $('projectSelect').disabled = true;
    return;
  }
  try {
    projects = await listProjects();
  } catch (error) {
    console.error(error);
    projects = [];
    markStorageDegraded('Project storage unavailable. Autosave is off; export JSON to keep this project.');
    $('projectSelect').innerHTML = option('Local storage unavailable', '');
    $('projectSelect').disabled = true;
    return;
  }
  const currentId = state.project.id;
  $('projectSelect').disabled = false;
  $('projectSelect').innerHTML =
    `<option value="">Recent projects</option>` +
    projects
      .map((project) => {
        const date = project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '';
        return option(`${project.name} · ${date}`, project.id, project.id === currentId);
      })
      .join('');
}

function renderProjectFields() {
  writeValue('projectName', state.project.name);
  writeValue('projectEngineer', state.project.engineer);
  writeValue('projectVenue', state.project.venue);
  writeValue('projectDate', state.project.date);
  writeValue('projectNotes', state.project.notes);
}

function renderRoomFields() {
  writeValue('roomW', state.room.width);
  writeValue('roomL', state.room.length);
  writeValue('roomH', state.room.height);
  setChecked('measurementRays', state.options.measurementRays);
  setChecked('autoSave', state.options.autosave);
  $('autoSave').disabled = !storageAvailable;
}

function renderKitSelectors() {
  const anchor = kitAnchor();
  writeSlider('kitGroupX', anchor.x, { min: -state.room.width / 2, max: state.room.width / 2, step: 0.25 });
  writeSlider('kitGroupY', anchor.y, { min: -state.room.length / 2, max: state.room.length / 2, step: 0.25 });
  if (!state.kit.length) return;
  $('kitPiece').innerHTML = state.kit.map((drum, index) => option(drum.name, index, index === Number($('kitPiece').value || 0))).join('');
  const index = Math.min(Number($('kitPiece').value || 0), state.kit.length - 1);
  const drum = state.kit[index];
  const sizes = KIT_SIZES[drum.id] || [];
  const current = applyKitSize(drum);
  $('kitSize').innerHTML =
    sizes
      .map((size, sizeIndex) => {
        const label = Array.isArray(size) ? `${size[0]}" × ${size[1]}"` : `${size}"`;
        return option(label, String(sizeIndex), JSON.stringify(size) === JSON.stringify(current));
      })
      .join('') + option('Custom', 'custom', current === 'custom');
  writeSlider('kitX', drum.x, { min: -state.room.width / 2, max: state.room.width / 2 });
  writeSlider('kitY', drum.y, { min: -state.room.length / 2, max: state.room.length / 2 });
  writeSlider('kitZ', drum.z, { min: 0.1, max: state.room.height, suffix: ' ft' });
  writeSlider('kitDia', drum.diameter * 12, { min: 6, max: 30, step: 1, suffix: '"', digits: 0 });
  writeSlider('kitDepth', (drum.height || 0) * 12, {
    min: 1,
    max: 24,
    step: 0.5,
    suffix: '"',
    disabled: drum.type === 'cymbal',
  });
}

function standardMicAlreadyAdded(preset) {
  const name = preset.name.toLowerCase();
  return state.mics.some((mic) => {
    if (mic.standardId === preset.id || mic.name.toLowerCase() === name) return true;
    if (preset.id === 'rack-tom') return mic.target === 'Hi/Mid Tom' && /tom/i.test(mic.name);
    if (preset.id === 'mono-room') return mic.target === 'Kick' && /room mic|mono room/i.test(mic.name);
    return false;
  });
}

function renderStandardMicPicker() {
  const select = $('standardMicSelect');
  if (!select) return;
  const available = STANDARD_MIC_PRESETS.filter((preset) => !standardMicAlreadyAdded(preset));
  select.innerHTML = available.length
    ? available.map((preset) => option(preset.name, preset.id)).join('')
    : option('All standard mics added', '');
  $('btnAddMic').disabled = !available.length;
}

function catalogSelectLabel(item) {
  const qty = item.imported && item.quantity > 1 ? ` x${item.quantity}` : '';
  const prefix = item.imported ? 'Studio · ' : '';
  return `${prefix}${[item.manufacturer, item.model].filter(Boolean).join(' ')}${qty}`;
}

function renderMicSelectors() {
  const hasMic = state.mics.length > 0;
  $('micSelect').innerHTML = hasMic
    ? state.mics.map((mic, index) => option(`CH ${mic.channel} · ${mic.name}`, index, index === selectedMicIndex)).join('')
    : option('None', '');
  renderStandardMicPicker();
  setDisabled(MIC_FORM_IDS, !hasMic);
  $('btnDeleteMic').disabled = !hasMic;
  const mic = state.mics[selectedMicIndex];
  if (!mic) {
    writeValue('micChannel', '');
    writeValue('micName', '');
    writeValue('micNotes', '');
    $('micCatalog').innerHTML = option('Unassigned', '');
    $('micType').innerHTML = MIC_TYPES.map((type) => option(type, type)).join('');
    $('micPattern').innerHTML = PATTERNS.map((pattern) => option(pattern, pattern)).join('');
    $('micTarget').innerHTML = option('— none —', '');
    writeSlider('micX', 0, { min: -state.room.width / 2, max: state.room.width / 2, disabled: true });
    writeSlider('micY', 0, { min: -state.room.length / 2, max: state.room.length / 2, disabled: true });
    writeSlider('micZ', 0, { min: 0.1, max: state.room.height + 1, disabled: true });
    setChecked('micStand', false);
    return;
  }
  writeValue('micSelect', selectedMicIndex);
  writeValue('micChannel', mic.channel);
  writeValue('micName', mic.name);
  $('micCatalog').innerHTML =
    option('Unassigned', '', !mic.catalogId) +
    combinedCatalog()
      .map((item) => option(catalogSelectLabel(item), item.id, item.id === mic.catalogId))
      .join('');
  $('micType').innerHTML = MIC_TYPES.map((type) => option(type, type, type === mic.micType)).join('');
  $('micPattern').innerHTML = PATTERNS.map((pattern) => option(pattern, pattern, pattern === mic.pattern)).join('');
  $('micTarget').innerHTML =
    option('— none —', '', !mic.target) + state.kit.map((drum) => option(drum.name, drum.name, drum.name === mic.target)).join('');
  writeSlider('micX', mic.x, { min: -state.room.width / 2 - 1, max: state.room.width / 2 + 1 });
  writeSlider('micY', mic.y, { min: -state.room.length / 2 - 1, max: state.room.length / 2 + 1 });
  writeSlider('micZ', mic.z, { min: 0.1, max: state.room.height + 1 });
  writeValue('micNotes', mic.notes);
  setChecked('micStand', mic.stand);
}

function updateMicSelectLabel() {
  const mic = state.mics[selectedMicIndex];
  const select = $('micSelect');
  if (!mic || !select?.options[selectedMicIndex]) return;
  select.options[selectedMicIndex].textContent = `CH ${mic.channel} · ${mic.name}`;
  select.value = String(selectedMicIndex);
}

function updateGoboSelectLabel() {
  const gobo = state.gobos[selectedGoboIndex];
  const select = $('goboSelect');
  if (!gobo || !select?.options[selectedGoboIndex]) return;
  select.options[selectedGoboIndex].textContent = gobo.name;
  select.value = String(selectedGoboIndex);
}

function renderGoboSizeOptions() {
  const gobo = state.gobos[selectedGoboIndex];
  const matchedSize = inferGoboStandardSize(gobo);
  const selectedSize = matchedSize || defaultGoboSize();
  $('goboSize').innerHTML =
    GOBO_STANDARD_SIZES.map((size) => option(goboSizeLabel(size), size.id, size.id === selectedSize.id)).join('') +
    (gobo && !matchedSize ? option('Custom/spec', 'custom', true) : '');
}

function renderGoboSelectors() {
  const hasGobo = state.gobos.length > 0;
  $('goboSelect').innerHTML = hasGobo
    ? state.gobos.map((gobo, index) => option(gobo.name, index, index === selectedGoboIndex)).join('')
    : option('None', '');
  const gobo = state.gobos[selectedGoboIndex];
  renderGoboSizeOptions();
  const selectedSize = inferGoboStandardSize(gobo) || defaultGoboSize();
  setDisabled(GOBO_FORM_IDS, !gobo);
  $('btnDeleteGobo').disabled = !gobo;

  if (!gobo) {
    writeSlider('goboX', 0, { min: -state.room.width / 2, max: state.room.width / 2, disabled: true });
    writeSlider('goboY', 0, { min: -state.room.length / 2, max: state.room.length / 2, disabled: true });
    writeSlider('goboRot', 0, { min: -180, max: 180, step: 1, suffix: '°', digits: 0, disabled: true });
    writeValue('goboName', '');
    $('goboKind').innerHTML = GOBO_KINDS.map((kind) => option(kind.name, kind.id)).join('');
    writeSlider('goboDepth', selectedSize.depth, { min: 0.02, max: 2, step: 0.01, suffix: ' ft', digits: 2, disabled: true });
    writeSlider('goboW', selectedSize.w, { min: 1, max: 12, disabled: true });
    writeSlider('goboH', selectedSize.h, { min: 1, max: Math.min(12, state.room.height), disabled: true });
    return;
  }

  writeValue('goboSelect', selectedGoboIndex);
  writeValue('goboName', gobo.name);
  $('goboKind').innerHTML = GOBO_KINDS.map((kind) => option(kind.name, kind.id, kind.id === gobo.kind)).join('');
  writeSlider('goboX', gobo.x, { min: -state.room.width / 2, max: state.room.width / 2 });
  writeSlider('goboY', gobo.y, { min: -state.room.length / 2, max: state.room.length / 2 });
  writeSlider('goboRot', gobo.rot, { min: -180, max: 180, step: 1, suffix: '°', digits: 0 });
  writeSlider('goboDepth', gobo.depth, { min: 0.02, max: 2, step: 0.01, suffix: ' ft', digits: 2 });
  writeSlider('goboW', gobo.w, { min: 1, max: 12 });
  writeSlider('goboH', gobo.h, { min: 1, max: Math.min(12, state.room.height) });
}

function renderLibraryDetails() {
  const node = $('libraryDetails');
  if (!node) return;
  const importedMics = state.studioInventory?.mics?.length || 0;
  const importedGear = state.studioInventory?.gear?.length || 0;
  const imported = importedMics || importedGear ? ` · ${importedMics} studio mics · ${importedGear} gear` : '';
  node.textContent = `${catalog.length + importedMics} mic profiles · ${templates.length} mic packages · ${referenceConfigs.length} reference presets${imported}`;
}

function renderStudioInventoryDetails() {
  const node = $('studioInventoryDetails');
  if (!node) return;
  const importedMics = state.studioInventory?.mics || [];
  const importedGear = state.studioInventory?.gear || [];
  if (!importedMics.length && !importedGear.length) {
    node.textContent = 'No studio inventory imported';
    $('btnClearStudioInventory').disabled = true;
    return;
  }
  $('btnClearStudioInventory').disabled = false;
  const micText = importedMics.slice(0, 6).map(catalogSelectLabel).join(', ');
  const micExtra = importedMics.length > 6 ? ` +${importedMics.length - 6}` : '';
  const gearText = importedGear
    .slice(0, 5)
    .map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`)
    .join(', ');
  const gearExtra = importedGear.length > 5 ? ` +${importedGear.length - 5}` : '';
  node.innerHTML = `
    <div class="readout-grid">
      <span>Mics</span><strong>${escapeHtml(importedMics.length ? `${micText}${micExtra}` : 'None')}</strong>
      <span>Gear</span><strong>${escapeHtml(importedGear.length ? `${gearText}${gearExtra}` : 'None')}</strong>
    </div>
  `;
}

function renderTemplates() {
  const select = $('templateSelect');
  const selectedTemplate =
    templates.find((template) => template.id === select.value) ||
    templates.find((template) => template.isDefault) ||
    templates[0] ||
    null;
  select.innerHTML = templates
    .map((template) => option(template.name, template.id, template.id === selectedTemplate?.id))
    .join('');
  updateTemplateDetails();
}

function updateTemplateDetails() {
  const selected = templates.find((template) => template.id === $('templateSelect').value);
  if (!selected) {
    $('templateDetails').textContent = 'No template data loaded';
    return;
  }
  const category = selected.category ? `${selected.category} - ` : '';
  const useCase = selected.useCase ? ` ${selected.useCase}` : '';
  $('templateDetails').textContent = `${category}${selected.mics.length} channels. ${selected.description}${useCase}`;
}

function selectedReferenceConfig() {
  return referenceConfigs.find((config) => config.id === $('referenceConfigSelect')?.value) || referenceConfigs[0] || null;
}

function referenceConfigLabel(config) {
  return config?.artistAlbumEngineer?.album || config?.name || 'Reference preset';
}

function referenceConfigContext(config) {
  const meta = config?.artistAlbumEngineer || {};
  const studio = meta.studio || (meta.knownStudios || []).slice(0, 2).join(' / ');
  return [meta.artist, meta.year, studio].filter(Boolean).join(' · ');
}

function referenceLayoutLabel(candidate) {
  if (!candidate) return '—';
  if (candidate.candidateType === 'minimum') return `${candidate.name} (minimum/core)`;
  if (candidate.candidateType === 'workflow') return `${candidate.name} (workflow expansion)`;
  if (candidate.candidateType === 'studio-expansion') return `${candidate.name} (studio expansion)`;
  if (/minimum|minimal|basic/i.test(candidate.id) || /minimum|minimal|basic/i.test(candidate.name)) return `${candidate.name} (minimum/core)`;
  if (/expanded|controlled/i.test(candidate.id) || /expanded|controlled/i.test(candidate.name)) return `${candidate.name} (expanded)`;
  return candidate.name;
}

function referenceLayoutScope(candidate) {
  if (!candidate) return 'No layout scope';
  const type = candidate.candidateType ? candidate.candidateType.replaceAll('-', ' ') : 'reference';
  const confidence = candidate.confidenceScope ? candidate.confidenceScope.replaceAll('-', ' ') : 'scope unspecified';
  return `${type} / ${confidence}`;
}

function referenceTone(config) {
  const album = referenceConfigLabel(config).toLowerCase();
  if (album === 'pinkerton') return 'Raw room rock; close punch; controlled cymbals.';
  if (album === 'antics') return 'Room-heavy post-punk; close punch; compressed far room.';
  if (album === 'fever to tell') return 'Raw trio drums; midrange kit picture; room edge.';
  if (album === 'solid gold') return 'Dry close funk-punk; tight kit image; controlled room.';
  if (album === 'songs for the deaf') return 'Dry shell pass; separate cymbal overdub; no sample replacement.';
  return String(config?.soundGoal?.summary || config?.soundGoal || config?.accuracyBoundary?.summary || '').split('.')[0] || 'Reference drum layout.';
}

function referenceRoomText(room) {
  if (!room) return 'No preset room context';
  return `${room.width} ft W x ${room.length} ft L x ${room.height} ft H`;
}

function referenceCandidateLabels(config) {
  return config?.appDataNotes?.candidateSetupLabels || [];
}

function selectedReferenceCandidate(config = selectedReferenceConfig()) {
  const candidates = referenceCandidateLabels(config);
  const selectedId = $('referencePresetSelect')?.value;
  return (
    candidates.find((candidate) => candidate.id === selectedId) ||
    candidates.find((candidate) => candidate.id === config?.recommendedDefaultLayoutId) ||
    candidates.find((candidate) => candidate.preferredDefault) ||
    candidates[0] ||
    null
  );
}

function renderReferenceConfigs() {
  const select = $('referenceConfigSelect');
  if (!select) return;
  select.innerHTML = referenceConfigs.length
    ? referenceConfigs.map((config) => option(referenceConfigLabel(config), config.id, config.id === select.value)).join('')
    : option('No reference presets loaded', '');
  renderReferencePresetSelect();
  updateReferenceConfigDetails();
}

function renderReferencePresetSelect() {
  const config = selectedReferenceConfig();
  const candidates = referenceCandidateLabels(config);
  const select = $('referencePresetSelect');
  if (!select) return;
  const selectedCandidate = selectedReferenceCandidate(config);
  select.innerHTML = candidates.length
    ? candidates
        .map((candidate) => option(referenceLayoutLabel(candidate), candidate.id, candidate.id === selectedCandidate?.id))
        .join('')
    : option('No app layout labels', '');
}

function compactList(values = [], limit = 4) {
  const filtered = values.filter(Boolean);
  const items = filtered.slice(0, limit);
  const extra = filtered.length > limit ? ` +${filtered.length - limit}` : '';
  return items.length ? `${items.join(', ')}${extra}` : '—';
}

function updateReferenceConfigDetails() {
  const node = $('referenceConfigDetails');
  if (!node) return;
  const config = selectedReferenceConfig();
  if (!config) {
    node.textContent = 'No reference presets loaded';
    return;
  }
  const candidate = selectedReferenceCandidate(config);
  const sourceGroups = candidate?.channels || [];
  const layout = candidate ? REFERENCE_PRESET_LAYOUTS[candidate.id] || [] : [];
  const context = referenceConfigContext(config);
  const presetContext = candidate ? REFERENCE_PRESET_CONTEXTS[candidate.id] : null;
  const room = presetContext?.room || null;
  node.innerHTML = `
    <div class="readout-head">
      <strong>${escapeHtml(referenceConfigLabel(config))}</strong>
      ${context ? `<span>${escapeHtml(context)}</span>` : ''}
    </div>
    <div class="readout-grid">
      <span>Layout</span><strong>${escapeHtml(referenceLayoutLabel(candidate))}</strong>
      <span>Scope</span><strong>${escapeHtml(referenceLayoutScope(candidate))}</strong>
      <span>Mics</span><strong>${escapeHtml(layout.length ? `${layout.length} rows` : '—')}</strong>
      <span>Sources</span><strong>${escapeHtml(compactList(sourceGroups, 5))}</strong>
      <span>Room</span><strong>${escapeHtml(referenceRoomText(room))}</strong>
      <span>Basis</span><strong>${escapeHtml(room?.confidence || 'No room context')}</strong>
      <span>Focus</span><strong>${escapeHtml(referenceTone(config))}</strong>
    </div>
    ${candidate?.note ? `<div class="readout-note">${escapeHtml(candidate.note)}</div>` : ''}
    ${room?.source ? `<div class="readout-note">${escapeHtml(room.source)}</div>` : ''}
  `;
}

function updateCatalogDetails() {
  const mic = state.mics[selectedMicIndex];
  const item = mic ? catalogById(mic.catalogId) : null;
  $('catalogDetails').textContent = item
    ? `${item.sources.join(', ')} · ${item.notes}`
    : 'No catalog profile assigned';
}

function renderForms() {
  renderProjectFields();
  renderRoomFields();
  renderKitSelectors();
  renderMicSelectors();
  renderGoboSelectors();
  renderLibraryDetails();
  renderStudioInventoryDetails();
  renderTemplates();
  renderReferenceConfigs();
  renderAnalysis();
  renderPatchTable();
}

function metric(label, value, tone = '') {
  return `<div class="metric ${tone}"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderAnalysis() {
  const report = selectedMicReport(state, selectedMicIndex);
  if (!report) {
    $('selectedMetrics').innerHTML = metric('Mic', 'None');
  } else {
    $('selectedMetrics').innerHTML = [
      metric('Target distance', report.distance == null ? '—' : `${fmt(report.distance)} ft`),
      metric('Arrival', report.arrival == null ? '—' : `${fmt(report.arrival)} ms`),
    ].join('');
  }

  const riskRows = phaseRiskRows(state, selectedMicIndex).slice(0, 4);
  $('phaseMetrics').innerHTML = riskRows.length
    ? riskRows
        .map(
          (row) => `
            <div class="risk-row ${row.status}">
              <span>${escapeHtml(row.mic.name)}</span>
              <strong>${fmt(row.ratio, 1)}:1</strong>
              <em>${fmt(row.deltaMs)} ms</em>
            </div>
          `,
        )
        .join('')
    : '<div class="empty">No selected source target</div>';

  const overhead = overheadReport(state);
  $('overheadMetrics').innerHTML = overhead
    ? [
        `<div class="risk-row ${overhead.status}"><span>Snare L/R diff</span><strong>${fmt(overhead.snareDiff * 12, 1)} in</strong><em>${fmt(overhead.snareDiffMs)} ms</em></div>`,
        `<div class="risk-row ${overhead.status}"><span>Kick L/R diff</span><strong>${fmt(overhead.kickDiff * 12, 1)} in</strong><em>${fmt(overhead.kickDiffMs)} ms</em></div>`,
      ].join('')
    : '<div class="empty">No overhead pair found</div>';
}

function renderPatchTable() {
  const rows = patchRows(state, combinedCatalog());
  $('patchTable').innerHTML = `
    <table>
      <thead>
        <tr><th>Ch</th><th>Mic</th><th>Source</th><th>Model</th></tr>
      </thead>
      <tbody>
        ${
          rows.length
            ? rows
                .map(
                  (row) => `
              <tr>
                <td>${row.channel}</td>
                <td>${escapeHtml(row.name)}</td>
                <td>${escapeHtml(row.target)}</td>
                <td>${escapeHtml(row.model || row.type)}</td>
              </tr>
            `,
                )
                .join('')
            : '<tr><td colspan="4">No microphones</td></tr>'
        }
      </tbody>
    </table>
  `;
}

function readNumber(id, fallback) {
  const value = Number($(id).value);
  return Number.isFinite(value) ? value : fallback;
}

function syncProjectFromFields() {
  state.project.name = $('projectName').value.trim() || 'Untitled Drum Session';
  state.project.engineer = $('projectEngineer').value;
  state.project.venue = $('projectVenue').value;
  state.project.date = $('projectDate').value;
  state.project.notes = $('projectNotes').value;
  updateState({ refreshForms: false });
}

function syncRoomFromFields({ autosave = true, refreshForms = false } = {}) {
  state.room.width = readNumber('roomW', state.room.width);
  state.room.length = readNumber('roomL', state.room.length);
  state.room.height = readNumber('roomH', state.room.height);
  state.options.measurementRays = $('measurementRays').checked;
  state.options.autosave = storageAvailable && $('autoSave').checked;
  updateState({ autosave, refreshForms });
}

function selectedKitIndex() {
  return Math.min(Number($('kitPiece').value || 0), state.kit.length - 1);
}

function syncKitGroupFromFields() {
  const anchor = kitAnchor();
  const nextX = readNumber('kitGroupX', anchor.x);
  const nextY = readNumber('kitGroupY', anchor.y);
  moveKitLayout(nextX - anchor.x, nextY - anchor.y);
  updateSliderOutput('kitGroupX');
  updateSliderOutput('kitGroupY');
  updateState({ refreshForms: false });
  renderKitSelectors();
  renderMicSelectors();
}

function syncKitFromFields() {
  const drum = state.kit[selectedKitIndex()];
  if (!drum) return;
  drum.x = readNumber('kitX', drum.x);
  drum.y = readNumber('kitY', drum.y);
  drum.z = readNumber('kitZ', drum.z);
  drum.diameter = inft(readNumber('kitDia', drum.diameter * 12));
  if (drum.type !== 'cymbal') drum.height = inft(readNumber('kitDepth', (drum.height || 0) * 12));
  ['kitX', 'kitY', 'kitZ'].forEach((id) => updateSliderOutput(id));
  updateSliderOutput('kitDia', { suffix: '"', digits: 0 });
  updateSliderOutput('kitDepth', { suffix: '"' });
  updateState({ refreshForms: false });
  renderKitSelectors();
}

function syncMicFromFields() {
  const mic = state.mics[selectedMicIndex];
  if (!mic) return;
  mic.channel = Math.round(readNumber('micChannel', mic.channel));
  mic.name = $('micName').value.trim() || `Mic ${selectedMicIndex + 1}`;
  mic.micType = $('micType').value;
  mic.pattern = $('micPattern').value;
  mic.target = $('micTarget').value;
  mic.x = readNumber('micX', mic.x);
  mic.y = readNumber('micY', mic.y);
  mic.z = readNumber('micZ', mic.z);
  mic.stand = $('micStand').checked;
  mic.notes = $('micNotes').value;
  clampMicToRoom(mic, state.room);
  ['micX', 'micY', 'micZ'].forEach((id) => updateSliderOutput(id));
  updateState({ refreshForms: false });
  updateMicSelectLabel();
}

function syncGoboFromFields() {
  const gobo = state.gobos[selectedGoboIndex];
  if (!gobo) return;
  gobo.name = $('goboName').value.trim() || `Gobo ${selectedGoboIndex + 1}`;
  gobo.kind = $('goboKind').value || 'panel';
  gobo.x = readNumber('goboX', gobo.x);
  gobo.y = readNumber('goboY', gobo.y);
  gobo.rot = readNumber('goboRot', gobo.rot);
  gobo.depth = readNumber('goboDepth', gobo.depth || goboKindById(gobo.kind).depth);
  gobo.w = readNumber('goboW', gobo.w);
  gobo.h = readNumber('goboH', gobo.h);
  gobo.standardSizeId = inferGoboStandardSize(gobo)?.id || 'custom';
  clampGoboToRoom(gobo, state.room);
  ['goboX', 'goboY', 'goboW', 'goboH'].forEach((id) => updateSliderOutput(id));
  updateSliderOutput('goboRot', { suffix: '°', digits: 0 });
  updateSliderOutput('goboDepth', { suffix: ' ft', digits: 2 });
  updateState({ refreshForms: false });
  updateGoboSelectLabel();
  renderGoboSizeOptions();
}

function syncGoboSizeFromFields() {
  const gobo = state.gobos[selectedGoboIndex];
  if (!gobo) return;
  const sizeId = $('goboSize').value;
  if (sizeId === 'custom') {
    gobo.standardSizeId = 'custom';
    updateState({ refreshForms: false });
    return;
  }
  applyGoboStandardSize(gobo, sizeId);
  clampGoboToRoom(gobo, state.room);
  updateState({ refreshForms: true });
}

function importStudioInventoryFromField() {
  const text = $('studioImportText').value;
  const parsed = parseStudioInventoryText(text);
  if (!parsed.mics.length && !parsed.gear.length) {
    toast('No inventory found');
    return;
  }
  state.studioInventory = {
    mics: mergeInventoryItems(state.studioInventory?.mics || [], parsed.mics),
    gear: mergeInventoryItems(state.studioInventory?.gear || [], parsed.gear),
  };
  writeValue('studioImportText', '');
  updateState({ refreshForms: true });
  toast(`${parsed.mics.length} mics · ${parsed.gear.length} gear imported`);
}

function clearStudioInventory() {
  const hasInventory = (state.studioInventory?.mics?.length || 0) || (state.studioInventory?.gear?.length || 0);
  if (!hasInventory) return;
  if (!confirm('Clear imported studio inventory from this project?')) return;
  const importedIds = new Set((state.studioInventory?.mics || []).map((mic) => mic.id));
  state.mics.forEach((mic) => {
    if (importedIds.has(mic.catalogId)) {
      mic.catalogId = '';
    }
  });
  state.studioInventory = { mics: [], gear: [] };
  updateState({ refreshForms: true });
  toast('Studio inventory cleared');
}

function downloadText(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildReport() {
  const rows = patchRows(state, combinedCatalog());
  const selected = selectedMicReport(state, selectedMicIndex);
  const overhead = overheadReport(state);
  const risks = phaseRiskRows(state, selectedMicIndex).filter((row) => row.status !== 'ok');
  return [
    `# ${state.project.name}`,
    '',
    `Engineer: ${state.project.engineer || ''}`,
    `Venue: ${state.project.venue || ''}`,
    `Date: ${state.project.date || ''}`,
    '',
    `Room: ${state.room.width} ft W x ${state.room.length} ft L x ${state.room.height} ft H`,
    '',
    '## Patch List',
    '',
    '| Ch | Mic | Source | Model | Pattern | Target ft | Arrival ms |',
    '| --- | --- | --- | --- | --- | ---: | ---: |',
    ...rows.map(
      (row) =>
        `| ${row.channel} | ${row.name} | ${row.target} | ${row.model || row.type} | ${row.pattern} | ${
          row.distance == null ? '' : row.distance.toFixed(2)
        } | ${row.arrival == null ? '' : row.arrival.toFixed(2)} |`,
    ),
    '',
    '## Selected Mic',
    '',
    selected
      ? `${selected.mic.name}: ${selected.distance == null ? 'no target' : `${selected.distance.toFixed(2)} ft, ${selected.arrival.toFixed(2)} ms`}`
      : 'No selected mic',
    '',
    '## Phase Checks',
    '',
    risks.length
      ? risks.map((row) => `- ${row.mic.name}: ${row.ratio.toFixed(1)}:1, ${row.deltaMs.toFixed(2)} ms`).join('\n')
      : '- No selected-source 3:1 warnings',
    '',
    '## Overhead Match',
    '',
    overhead
      ? `Snare diff ${fmt(overhead.snareDiff * 12, 1)} in (${fmt(overhead.snareDiffMs)} ms); Kick diff ${fmt(
          overhead.kickDiff * 12,
          1,
        )} in (${fmt(overhead.kickDiffMs)} ms)`
      : 'No overhead pair found',
    '',
    state.project.notes ? `## Notes\n\n${state.project.notes}` : '',
  ].join('\n');
}

function applyTemplate(templateId) {
  const template = templates.find((item) => item.id === templateId);
  if (!template) return;
  if (
    !confirmDestructiveApply(`Apply "${template.name}" mic package?`, [
      `Mics: ${state.mics.length} -> ${template.mics.length}`,
    ])
  ) {
    return;
  }
  state.mics = template.mics.map((mic, index) => {
    const item = catalogById(mic.catalogId);
    return clampMicToRoom(
      {
        id: createId('mic'),
        channel: mic.channel || index + 1,
        name: mic.name || `Mic ${index + 1}`,
        catalogId: mic.catalogId || '',
        micType: mic.micType || item?.micType || 'dynamic',
        pattern: mic.pattern || item?.defaultPattern || 'cardioid',
        target: mic.target || '',
        x: mic.x ?? 0,
        y: mic.y ?? 0,
        z: mic.z ?? 3,
        stand: mic.stand !== false,
        notes: '',
      },
      state.room,
    );
  });
  selectedMicIndex = 0;
  updateState({ refreshForms: true });
  toast('Template applied');
}

function nextMicChannel() {
  return Math.max(0, ...state.mics.map((mic) => Number(mic.channel) || 0)) + 1;
}

function createMicFromStandardPreset(preset) {
  const item = catalogById(preset.catalogId);
  const targetExists = state.kit.some((drum) => drum.name === preset.target);
  return clampMicToRoom(
    {
      id: createId('mic'),
      standardId: preset.id,
      channel: nextMicChannel(),
      name: preset.name,
      catalogId: preset.catalogId || '',
      micType: preset.micType || item?.micType || 'dynamic',
      pattern: preset.pattern || item?.defaultPattern || 'cardioid',
      target: targetExists ? preset.target : '',
      x: preset.x,
      y: preset.y,
      z: preset.z,
      stand: preset.stand !== false,
      notes: '',
    },
    state.room,
  );
}

function restoreStandardKit(handedness = 'right') {
  const standard = createDefaultState();
  const title = handedness === 'left' ? 'Restore standard left-handed kit?' : 'Restore standard right-handed kit?';
  if (
    !confirmDestructiveApply(title, [
      `Kit pieces: ${state.kit.length} -> ${standard.kit.length}`,
      `Mics: ${state.mics.length} -> ${standard.mics.length}`,
    ])
  ) {
    return;
  }
  state.kit = clone(standard.kit);
  state.mics = clone(standard.mics);
  if (handedness === 'left') {
    state.kit.forEach((drum) => {
      if (drum.id !== 'kick') drum.x *= -1;
    });
    state.mics.forEach((mic) => {
      mic.x *= -1;
    });
  }
  selectedMicIndex = 0;
  selectedGoboIndex = Math.min(selectedGoboIndex, Math.max(0, state.gobos.length - 1));
  updateState({ refreshForms: true });
  toast(handedness === 'left' ? 'Left-handed kit restored' : 'Standard kit restored');
}

function referenceMicRows(config) {
  return [...(config?.micList || []), ...(config?.recommendedModernReproduction || [])];
}

function findReferenceMicRow(config, sourceName) {
  if (!sourceName) return null;
  const needle = sourceName.toLowerCase();
  return referenceMicRows(config).find((row) => {
    const source = String(row.source || '').toLowerCase();
    return source.includes(needle) || needle.includes(source);
  });
}

function referenceMicNotes(config, candidate, layoutMic) {
  const row = findReferenceMicRow(config, layoutMic.researchSource);
  const lines = [`Reference: ${referenceConfigLabel(config)}`, `Layout: ${referenceLayoutLabel(candidate) || layoutMic.name}`];
  if (layoutMic.researchSource) lines.push(`Research source: ${layoutMic.researchSource}`);
  if (row?.confidence) lines.push(`Confidence: ${row.confidence}`);
  if (row?.placement) lines.push(`Placement: ${row.placement}`);
  if (row?.phaseRelationship) lines.push(`Phase: ${row.phaseRelationship}`);
  if (row?.processingNotes) lines.push(`Processing: ${row.processingNotes}`);
  if (!row?.confidence && config.accuracyBoundary?.summary) lines.push(config.accuracyBoundary.summary);
  return lines.join('\n');
}

function referencePresetProjectNote(config, candidate, presetContext) {
  const room = presetContext?.room || null;
  const lines = [
    REF_NOTE_START,
    `Reference: ${referenceConfigLabel(config)}`,
    `Layout: ${referenceLayoutLabel(candidate)}`,
    `Layout scope: ${referenceLayoutScope(candidate)}`,
  ];
  if (candidate?.note) lines.push(`Layout note: ${candidate.note}`);
  if (room) {
    lines.push(`Planner room: ${room.label || 'Reference room'} - ${referenceRoomText(room)}`);
    lines.push(`Room confidence: ${room.confidence}`);
    lines.push(`Room source: ${room.source}`);
  }
  lines.push(REF_NOTE_END);
  return lines.join('\n');
}

function replacementRoomText(room) {
  return `${room.width} ft W x ${room.length} ft L x ${room.height} ft H`;
}

function confirmDestructiveApply(title, details) {
  return confirm([title, '', ...details, '', 'This replaces existing project setup data.'].join('\n'));
}

function replaceReferencePresetProjectNote(notes, nextNote) {
  const source = String(notes || '').trim();
  const start = source.indexOf(REF_NOTE_START);
  const end = source.indexOf(REF_NOTE_END);
  let kept = source;

  if (start !== -1 && end !== -1 && end >= start) {
    kept = `${source.slice(0, start).trim()}\n\n${source.slice(end + REF_NOTE_END.length).trim()}`.trim();
  }

  return [kept, nextNote].filter(Boolean).join('\n\n');
}

function applyReferencePresetContext(config, candidate, presetContext) {
  if (!presetContext) return;
  if (presetContext.room) {
    state.room = {
      width: presetContext.room.width,
      length: presetContext.room.length,
      height: presetContext.room.height,
    };
  }
  if (Array.isArray(presetContext.kit)) state.kit = clone(presetContext.kit);
  if (Array.isArray(presetContext.gobos)) {
    state.gobos = clone(presetContext.gobos).map((gobo) => clampGoboToRoom(gobo, state.room));
  } else {
    state.gobos = [];
  }
  selectedGoboIndex = 0;
  state.project.notes = replaceReferencePresetProjectNote(
    state.project.notes,
    referencePresetProjectNote(config, candidate, presetContext),
  );
}

function createMicFromReferencePreset(config, candidate, layoutMic, index) {
  const item = catalogById(layoutMic.catalogId);
  return clampMicToRoom(
    {
      id: createId('mic'),
      channel: layoutMic.channel || index + 1,
      name: layoutMic.name || `Mic ${index + 1}`,
      catalogId: layoutMic.catalogId || '',
      micType: layoutMic.micType || item?.micType || 'dynamic',
      pattern: layoutMic.pattern || item?.defaultPattern || 'cardioid',
      target: layoutMic.target || '',
      x: layoutMic.x ?? 0,
      y: layoutMic.y ?? 0,
      z: layoutMic.z ?? 3,
      stand: layoutMic.stand !== false,
      notes: referenceMicNotes(config, candidate, layoutMic),
    },
    state.room,
  );
}

function applyReferencePreset(configId, presetId) {
  const config = referenceConfigs.find((item) => item.id === configId);
  const candidate = config ? referenceCandidateLabels(config).find((item) => item.id === presetId) : null;
  const layout = candidate ? REFERENCE_PRESET_LAYOUTS[candidate.id] : null;
  const presetContext = candidate ? REFERENCE_PRESET_CONTEXTS[candidate.id] : null;
  if (!config || !candidate || !layout) {
    toast('Preset unavailable');
    return;
  }
  const nextRoom = presetContext?.room || state.room;
  const nextKitCount = Array.isArray(presetContext?.kit) ? presetContext.kit.length : state.kit.length;
  const nextGoboCount = Array.isArray(presetContext?.gobos) ? presetContext.gobos.length : 0;
  const details = [
    `Mics: ${state.mics.length} -> ${layout.length}`,
    `Kit pieces: ${state.kit.length} -> ${nextKitCount}`,
    `Gobos: ${state.gobos.length} -> ${nextGoboCount}`,
  ];
  if (presetContext?.room) {
    details.push(`Room: ${replacementRoomText(state.room)} -> ${replacementRoomText(nextRoom)}`);
  }
  if (!confirmDestructiveApply(`Apply "${referenceConfigLabel(config)}" ${referenceLayoutLabel(candidate)} layout?`, details)) return;
  applyReferencePresetContext(config, candidate, presetContext);
  state.mics = layout.map((mic, index) => createMicFromReferencePreset(config, candidate, mic, index));
  selectedMicIndex = 0;
  updateState({ refreshForms: true });
  toast('Reference preset applied');
}

function bindEvents() {
  document.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab === button));
      document
        .querySelectorAll('.tab-panel')
        .forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === button.dataset.tab));
    });
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('#btnImportStudioList, #btnClearStudioInventory');
    if (!button) return;
    if (button.id === 'btnImportStudioList') importStudioInventoryFromField();
    else clearStudioInventory();
  });

  ['projectName', 'projectEngineer', 'projectVenue', 'projectDate', 'projectNotes'].forEach((id) => {
    $(id).addEventListener('input', syncProjectFromFields);
  });

  ['roomW', 'roomL', 'roomH'].forEach((id) => {
    $(id)?.addEventListener('input', () => syncRoomFromFields({ autosave: false }));
    $(id)?.addEventListener('change', () => syncRoomFromFields({ autosave: true, refreshForms: true }));
  });
  ['measurementRays', 'autoSave'].forEach((id) => $(id)?.addEventListener('change', () => syncRoomFromFields()));

  $('kitPiece').addEventListener('change', renderKitSelectors);
  $('kitSize').addEventListener('change', () => {
    const drum = state.kit[selectedKitIndex()];
    const sizes = KIT_SIZES[drum.id] || [];
    const value = $('kitSize').value;
    if (value !== 'custom') setKitSize(drum, sizes[Number(value)]);
    updateState({ refreshForms: true });
  });
  ['kitGroupX', 'kitGroupY'].forEach((id) => $(id).addEventListener('input', syncKitGroupFromFields));
  ['kitX', 'kitY', 'kitZ', 'kitDia', 'kitDepth'].forEach((id) => $(id).addEventListener('input', syncKitFromFields));
  $('btnStandardKit').addEventListener('click', () => restoreStandardKit('right'));
  $('btnLeftHandedKit').addEventListener('click', () => restoreStandardKit('left'));

  $('micSelect').addEventListener('change', () => {
    selectedMicIndex = Number($('micSelect').value || 0);
    sceneApi.setSelectedMicIndex(selectedMicIndex);
    renderMicSelectors();
    renderAnalysis();
  });
  $('micCatalog').addEventListener('change', () => {
    const mic = state.mics[selectedMicIndex];
    if (!mic) return;
    applyCatalogToMic(mic, $('micCatalog').value);
    updateState({ refreshForms: true });
  });
  ['micChannel', 'micName', 'micX', 'micY', 'micZ', 'micNotes'].forEach((id) => $(id).addEventListener('input', syncMicFromFields));
  ['micType', 'micPattern', 'micTarget', 'micStand'].forEach((id) => $(id).addEventListener('change', syncMicFromFields));
  $('btnAddMic').addEventListener('click', () => {
    const preset = STANDARD_MIC_PRESETS.find((item) => item.id === $('standardMicSelect').value);
    if (!preset) return;
    state.mics.push(createMicFromStandardPreset(preset));
    selectedMicIndex = state.mics.length - 1;
    updateState({ refreshForms: true });
    toast(`${preset.name} added`);
  });
  $('btnDeleteMic').addEventListener('click', () => {
    if (!state.mics.length) return;
    state.mics.splice(selectedMicIndex, 1);
    selectedMicIndex = Math.max(0, selectedMicIndex - 1);
    updateState({ refreshForms: true });
  });

  $('goboSelect').addEventListener('change', () => {
    selectedGoboIndex = Number($('goboSelect').value);
    sceneApi.setSelectedGoboIndex(selectedGoboIndex);
    renderGoboSelectors();
  });
  $('goboSize').addEventListener('change', syncGoboSizeFromFields);
  ['goboName', 'goboX', 'goboY', 'goboRot', 'goboDepth', 'goboW', 'goboH'].forEach((id) =>
    $(id).addEventListener('input', syncGoboFromFields),
  );
  $('goboKind').addEventListener('change', syncGoboFromFields);
  $('btnAddGobo').addEventListener('click', () => {
    state.gobos.push(createGoboFromStandardSize($('goboSize').value));
    selectedGoboIndex = state.gobos.length - 1;
    updateState({ refreshForms: true });
  });
  $('btnDeleteGobo').addEventListener('click', () => {
    if (!state.gobos.length) return;
    state.gobos.splice(selectedGoboIndex, 1);
    selectedGoboIndex = Math.max(0, selectedGoboIndex - 1);
    updateState({ refreshForms: true });
  });

  $('btnApplyTemplate').addEventListener('click', () => applyTemplate($('templateSelect').value));
  $('templateSelect').addEventListener('change', updateTemplateDetails);
  $('referenceConfigSelect').addEventListener('change', () => {
    renderReferencePresetSelect();
    updateReferenceConfigDetails();
  });
  $('referencePresetSelect').addEventListener('change', updateReferenceConfigDetails);
  $('btnApplyReferencePreset').addEventListener('click', () =>
    applyReferencePreset($('referenceConfigSelect').value, $('referencePresetSelect').value),
  );

  $('btnNewProject').addEventListener('click', () => {
    state = duplicateAsNewProject(state, 'Untitled Drum Session');
    selectedMicIndex = 0;
    selectedGoboIndex = 0;
    updateState({ refreshForms: true });
    refreshProjectList();
  });
  $('btnSaveProject').addEventListener('click', async () => {
    if (!storageAvailable) {
      toast('Local storage unavailable; export JSON to keep this project');
      return;
    }
    try {
      state = await saveProject(state);
      await refreshProjectList();
      toast('Project saved');
      setStatus('Saved');
    } catch (error) {
      console.error(error);
      markStorageDegraded('Save failed. Local storage is unavailable; export JSON to keep this project.');
    }
  });
  $('projectSelect').addEventListener('change', async () => {
    const id = $('projectSelect').value;
    if (!id || !storageAvailable) return;
    let loaded = null;
    try {
      loaded = await loadProject(id);
    } catch (error) {
      console.error(error);
      markStorageDegraded('Project load failed. Local storage is unavailable; export JSON to keep current work.');
      return;
    }
    if (!loaded) {
      toast('Project not found');
      return;
    }
    state = loaded;
    selectedMicIndex = 0;
    selectedGoboIndex = 0;
    updateState({ autosave: false, refreshForms: true });
    await refreshProjectList();
    toast('Project loaded');
  });
  $('btnDeleteProject').addEventListener('click', async () => {
    if (!state.project.id) return;
    if (!storageAvailable) {
      toast('Local storage unavailable; nothing was deleted');
      return;
    }
    if (!confirm(`Delete local project "${state.project.name}"?`)) return;
    try {
      await deleteProject(state.project.id);
    } catch (error) {
      console.error(error);
      markStorageDegraded('Delete failed. Local storage is unavailable; export JSON to keep current work.');
      return;
    }
    state = validatePlannerState(createDefaultState());
    selectedMicIndex = 0;
    selectedGoboIndex = 0;
    updateState({ autosave: false, refreshForms: true });
    await refreshProjectList();
    toast('Project deleted');
  });

  $('btnExportJson').addEventListener('click', () => {
    downloadText(`${state.project.name.replaceAll(/\W+/g, '-').toLowerCase()}-setup.json`, JSON.stringify(state, null, 2));
  });
  $('btnImportJson').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = validatePlannerState(reader.result);
      if (!parsed) {
        toast('Import rejected');
        return;
      }
      state = parsed;
      selectedMicIndex = 0;
      selectedGoboIndex = 0;
      updateState({ refreshForms: true });
      toast('JSON imported');
    };
    reader.readAsText(file);
    event.target.value = '';
  });
  $('btnShare').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#setup=${encodeShare(state)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Share link copied');
    } catch {
      window.prompt('Copy share link', url);
    }
  });
  $('btnCsv').addEventListener('click', () => {
    downloadText(`${state.project.name.replaceAll(/\W+/g, '-').toLowerCase()}-patch-list.csv`, rowsToCsv(patchRows(state, combinedCatalog())), 'text/csv');
  });
  $('btnReport').addEventListener('click', () => {
    downloadText(`${state.project.name.replaceAll(/\W+/g, '-').toLowerCase()}-report.md`, buildReport(), 'text/markdown');
  });
  $('btnReset').addEventListener('click', () => {
    if (!confirm('Reset current project to the default planner state?')) return;
    state = validatePlannerState(createDefaultState());
    selectedMicIndex = 0;
    selectedGoboIndex = 0;
    updateState({ refreshForms: true });
  });
  $('btnSnapshot').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${state.project.name.replaceAll(/\W+/g, '-').toLowerCase()}-stage.png`;
    link.href = sceneApi.capturePng();
    link.click();
  });
  $('btnTopView').addEventListener('click', () => {
    state.options.topView = true;
    updateState({ refreshForms: false });
  });
  $('btnOrbitView').addEventListener('click', () => {
    state.options.topView = false;
    sceneApi.resetOrbitView();
    updateState({ refreshForms: false });
  });
}

async function bootState() {
  const shared = decodeShare(location.hash);
  if (shared) {
    const imported = duplicateAsNewProject(shared, shared.project.name || 'Imported Drum Session');
    clearShareHash();
    sharedImportNotice = true;
    return imported;
  }
  try {
    const lastId = await getLastProjectId();
    const loaded = await loadProject(lastId);
    return loaded || validatePlannerState(createDefaultState());
  } catch (error) {
    console.error(error);
    markStorageDegraded('Project storage unavailable. Autosave is off; export JSON to keep this project.');
    const fallback = validatePlannerState(createDefaultState());
    fallback.options.autosave = false;
    return fallback;
  }
}

async function init() {
  [catalog, templates, referenceConfigs] = await Promise.all([
    loadJsonFile('mic-catalog.json', MIC_CATALOG_FALLBACK),
    loadJsonFile('setup-templates.json', SETUP_TEMPLATES_FALLBACK),
    loadJsonFile('reference-configurations.json', []),
  ]);
  state = validatePlannerState(await bootState());
  sceneApi = createPlannerScene({
    viewport: $('viewport'),
    tooltip: $('tooltip'),
    onMicSelect(index) {
      selectedMicIndex = index;
      renderMicSelectors();
      renderAnalysis();
    },
    onGoboSelect(index) {
      selectedGoboIndex = index;
      renderGoboSelectors();
    },
  });
  bindEvents();
  sceneApi.setState(state);
  await refreshProjectList();
  renderForms();
  if (!storageAvailable) markStorageDegraded();
  if (sharedImportNotice) toast('Shared setup imported as a new project');
  if (storageAvailable) setStatus('Data loaded');
}

init().catch((error) => {
  console.error(error);
  setStatus('App failed to start');
  toast('App failed to start');
});
