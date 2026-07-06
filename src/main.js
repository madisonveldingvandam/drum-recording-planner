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
import { createDefaultState, createId, KIT_SIZES, MIC_TYPES, PATTERNS } from './data/defaultState.js';
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
import { REFERENCE_PRESET_LAYOUTS } from './data/referencePresetLayouts.js';
import { createPlannerScene } from './render/scene.js';

const DATA_BASE = `${import.meta.env.BASE_URL}data/`;

const app = document.getElementById('app');

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand-block">
        <div class="brand">Drum Mic Planner</div>
        <div class="status-line" id="statusLine">Loading data</div>
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

        <div class="analysis-dock">
          <section>
            <p class="sec-title">Selected mic</p>
            <div id="selectedMetrics" class="metric-grid"></div>
          </section>
          <section>
            <p class="sec-title">Phase checks</p>
            <div id="phaseMetrics" class="metric-list"></div>
          </section>
          <section>
            <p class="sec-title">Overheads</p>
            <div id="overheadMetrics" class="metric-list"></div>
          </section>
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
            <label class="field"><span>Configuration</span><select id="referenceConfigSelect"></select></label>
            <div class="row">
              <label class="field"><span>Preset</span><select id="referencePresetSelect"></select></label>
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
            <label class="check"><input id="showCables" type="checkbox" /> Cable runs to stage box</label>
            <label class="check"><input id="measurementRays" type="checkbox" /> Measurement ray for selected mic</label>
            <label class="check"><input id="autoSave" type="checkbox" /> Autosave project data</label>
          </section>
        </div>

        <div class="tab-panel" data-panel="kit">
          <section>
            <p class="sec-title">Kit piece</p>
            <div class="row">
              <label class="field"><span>Piece</span><select id="kitPiece"></select></label>
              <label class="field"><span>Standard size</span><select id="kitSize"></select></label>
            </div>
            <div class="row three">
              <label class="field"><span>X</span><input id="kitX" type="number" step="0.1" /></label>
              <label class="field"><span>Y</span><input id="kitY" type="number" step="0.1" /></label>
              <label class="field"><span>Z</span><input id="kitZ" type="number" step="0.1" /></label>
            </div>
            <div class="row">
              <label class="field"><span>Diameter</span><input id="kitDia" type="number" min="0.3" max="4" step="0.01" /></label>
              <label class="field"><span>Depth</span><input id="kitDepth" type="number" min="0.02" max="3" step="0.01" /></label>
            </div>
            <button id="btnStandardKit" type="button"><i data-lucide="refresh-cw"></i><span>Standard right-handed kit</span></button>
          </section>
        </div>

        <div class="tab-panel" data-panel="mic">
          <section>
            <p class="sec-title">Microphone</p>
            <label class="field"><span>Selected mic</span><select id="micSelect"></select></label>
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
            <div class="row three">
              <label class="field"><span>X</span><input id="micX" type="number" step="0.1" /></label>
              <label class="field"><span>Y</span><input id="micY" type="number" step="0.1" /></label>
              <label class="field"><span>Z</span><input id="micZ" type="number" min="0.1" step="0.1" /></label>
            </div>
            <label class="check"><input id="micStand" type="checkbox" /> Stand</label>
            <label class="field"><span>Mic notes</span><textarea id="micNotes" rows="3"></textarea></label>
            <div class="button-row">
              <button id="btnAddMic" type="button"><i data-lucide="plus"></i><span>Add mic</span></button>
              <button id="btnDeleteMic" type="button"><i data-lucide="trash-2"></i><span>Delete mic</span></button>
            </div>
          </section>
        </div>

        <div class="tab-panel" data-panel="gobos">
          <section>
            <p class="sec-title">Gobos</p>
            <label class="field"><span>Selected gobo</span><select id="goboSelect"></select></label>
            <div class="row three">
              <label class="field"><span>X</span><input id="goboX" type="number" step="0.1" /></label>
              <label class="field"><span>Y</span><input id="goboY" type="number" step="0.1" /></label>
              <label class="field"><span>Angle</span><input id="goboRot" type="number" min="-180" max="180" step="1" /></label>
            </div>
            <div class="row">
              <label class="field"><span>Width</span><input id="goboW" type="number" min="1" max="12" step="0.1" /></label>
              <label class="field"><span>Height</span><input id="goboH" type="number" min="1" max="12" step="0.1" /></label>
            </div>
            <div class="button-row">
              <button id="btnAddGobo" type="button"><i data-lucide="plus"></i><span>Add gobo</span></button>
              <button id="btnDeleteGobo" type="button"><i data-lucide="trash-2"></i><span>Delete gobo</span></button>
            </div>
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
            <input id="importFile" type="file" accept=".json,application/json" hidden />
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

function fmt(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

function writeValue(id, value) {
  const el = $(id);
  if (!el) return;
  const next = value == null ? '' : String(value);
  if (el.value !== next) el.value = next;
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
  $('statusLine').textContent = message;
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

function catalogById(id) {
  return catalog.find((item) => item.id === id) || null;
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
  selectedMicIndex = Math.min(selectedMicIndex, Math.max(0, state.mics.length - 1));
  selectedGoboIndex = Math.min(selectedGoboIndex, Math.max(0, state.gobos.length - 1));
  state.project.updatedAt = new Date().toISOString();
  sceneApi.setState(state);
  sceneApi.setSelectedMicIndex(selectedMicIndex);
  sceneApi.setSelectedGoboIndex(selectedGoboIndex);
  renderAnalysis();
  renderPatchTable();
  updateCatalogDetails();
  updateTemplateDetails();
  updateReferenceConfigDetails();
  if (refreshForms) renderForms();
  if (autosave) scheduleAutosave();
}

function scheduleAutosave() {
  if (!state.options.autosave) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(async () => {
    try {
      state = await saveProject(state);
      await refreshProjectList();
      setStatus(`Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      console.error(error);
      setStatus('Autosave failed');
    }
  }, 700);
}

async function refreshProjectList() {
  projects = await listProjects();
  const currentId = state.project.id;
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
  setChecked('showCables', state.options.cables);
  setChecked('measurementRays', state.options.measurementRays);
  setChecked('autoSave', state.options.autosave);
}

function renderKitSelectors() {
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
  writeValue('kitX', drum.x);
  writeValue('kitY', drum.y);
  writeValue('kitZ', drum.z);
  writeValue('kitDia', drum.diameter);
  writeValue('kitDepth', drum.height ?? '');
  $('kitDepth').disabled = drum.type === 'cymbal';
}

function renderMicSelectors() {
  $('micSelect').innerHTML = state.mics
    .map((mic, index) => option(`CH ${mic.channel} · ${mic.name}`, index, index === selectedMicIndex))
    .join('');
  const mic = state.mics[selectedMicIndex];
  if (!mic) return;
  writeValue('micSelect', selectedMicIndex);
  writeValue('micChannel', mic.channel);
  writeValue('micName', mic.name);
  $('micCatalog').innerHTML =
    option('Unassigned', '', !mic.catalogId) +
    catalog
      .map((item) => option(`${item.manufacturer} ${item.model}`, item.id, item.id === mic.catalogId))
      .join('');
  $('micType').innerHTML = MIC_TYPES.map((type) => option(type, type, type === mic.micType)).join('');
  $('micPattern').innerHTML = PATTERNS.map((pattern) => option(pattern, pattern, pattern === mic.pattern)).join('');
  $('micTarget').innerHTML =
    option('— none —', '', !mic.target) + state.kit.map((drum) => option(drum.name, drum.name, drum.name === mic.target)).join('');
  writeValue('micX', mic.x);
  writeValue('micY', mic.y);
  writeValue('micZ', mic.z);
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

function renderGoboSelectors() {
  $('goboSelect').innerHTML = state.gobos.map((gobo, index) => option(gobo.name, index, index === selectedGoboIndex)).join('');
  const gobo = state.gobos[selectedGoboIndex];
  if (!gobo) return;
  writeValue('goboSelect', selectedGoboIndex);
  writeValue('goboX', gobo.x);
  writeValue('goboY', gobo.y);
  writeValue('goboRot', gobo.rot);
  writeValue('goboW', gobo.w);
  writeValue('goboH', gobo.h);
}

function renderTemplates() {
  $('templateSelect').innerHTML = templates.map((template) => option(template.name, template.id)).join('');
  updateTemplateDetails();
}

function updateTemplateDetails() {
  const selected = templates.find((template) => template.id === $('templateSelect').value);
  $('templateDetails').textContent = selected ? `${selected.mics.length} channels · ${selected.description}` : 'No template data loaded';
}

function selectedReferenceConfig() {
  return referenceConfigs.find((config) => config.id === $('referenceConfigSelect')?.value) || referenceConfigs[0] || null;
}

function referenceCandidateLabels(config) {
  return config?.appDataNotes?.candidateSetupLabels || [];
}

function selectedReferenceCandidate(config = selectedReferenceConfig()) {
  const candidates = referenceCandidateLabels(config);
  return candidates.find((candidate) => candidate.id === $('referencePresetSelect')?.value) || candidates[0] || null;
}

function renderReferenceConfigs() {
  const select = $('referenceConfigSelect');
  if (!select) return;
  select.innerHTML = referenceConfigs.length
    ? referenceConfigs.map((config) => option(config.name, config.id, config.id === select.value)).join('')
    : option('No reference presets loaded', '');
  renderReferencePresetSelect();
  updateReferenceConfigDetails();
}

function renderReferencePresetSelect() {
  const config = selectedReferenceConfig();
  const candidates = referenceCandidateLabels(config);
  const select = $('referencePresetSelect');
  if (!select) return;
  select.innerHTML = candidates.length
    ? candidates.map((candidate) => option(candidate.name, candidate.id, candidate.id === select.value)).join('')
    : option('No app layout labels', '');
}

function compactList(values = [], limit = 4) {
  const items = values.filter(Boolean).slice(0, limit);
  const extra = values.length > limit ? ` +${values.length - limit}` : '';
  return items.length ? `${items.join(', ')}${extra}` : '—';
}

function sourceLinks(config) {
  return (config?.sources || [])
    .slice(0, 4)
    .map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>`)
    .join('');
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
  const channels = candidate?.channels || [];
  const soundGoal = config.soundGoal?.summary || config.soundGoal || '';
  const unknowns = config.unknowns || config.unresolvedQuestions || config.accuracyBoundary?.undocumentedScope || [];
  node.innerHTML = `
    <div class="readout-block"><strong>${escapeHtml(config.name)}</strong></div>
    <div class="readout-block">${escapeHtml(soundGoal || config.accuracyBoundary?.summary || '')}</div>
    <div class="readout-grid">
      <span>Preset</span><strong>${escapeHtml(candidate?.name || '—')}</strong>
      <span>Channels</span><strong>${escapeHtml(compactList(channels, 6))}</strong>
      <span>Unknowns</span><strong>${escapeHtml(compactList(unknowns, 3))}</strong>
    </div>
    <div class="source-links">${sourceLinks(config)}</div>
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
      metric('Cable estimate', `${fmt(report.cable, 1)} ft`),
      metric('Cable pick', `${report.standardCable} ft`),
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
  const rows = patchRows(state, catalog);
  $('patchTable').innerHTML = `
    <table>
      <thead>
        <tr><th>Ch</th><th>Mic</th><th>Source</th><th>Model</th><th>Cable</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${row.channel}</td>
                <td>${escapeHtml(row.name)}</td>
                <td>${escapeHtml(row.target)}</td>
                <td>${escapeHtml(row.model || row.type)}</td>
                <td>${row.standardCable} ft</td>
              </tr>
            `,
          )
          .join('')}
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

function syncRoomFromFields() {
  state.room.width = readNumber('roomW', state.room.width);
  state.room.length = readNumber('roomL', state.room.length);
  state.room.height = readNumber('roomH', state.room.height);
  state.options.cables = $('showCables').checked;
  state.options.measurementRays = $('measurementRays').checked;
  state.options.autosave = $('autoSave').checked;
  state.mics.forEach((mic) => clampMicToRoom(mic, state.room));
  state.gobos.forEach((gobo) => clampGoboToRoom(gobo, state.room));
  updateState({ refreshForms: false });
}

function selectedKitIndex() {
  return Math.min(Number($('kitPiece').value || 0), state.kit.length - 1);
}

function syncKitFromFields() {
  const drum = state.kit[selectedKitIndex()];
  if (!drum) return;
  drum.x = readNumber('kitX', drum.x);
  drum.y = readNumber('kitY', drum.y);
  drum.z = readNumber('kitZ', drum.z);
  drum.diameter = readNumber('kitDia', drum.diameter);
  if (drum.type !== 'cymbal') drum.height = readNumber('kitDepth', drum.height);
  updateState({ refreshForms: false });
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
  updateState({ refreshForms: false });
  updateMicSelectLabel();
}

function syncGoboFromFields() {
  const gobo = state.gobos[selectedGoboIndex];
  if (!gobo) return;
  gobo.x = readNumber('goboX', gobo.x);
  gobo.y = readNumber('goboY', gobo.y);
  gobo.rot = readNumber('goboRot', gobo.rot);
  gobo.w = readNumber('goboW', gobo.w);
  gobo.h = readNumber('goboH', gobo.h);
  clampGoboToRoom(gobo, state.room);
  updateState({ refreshForms: false });
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
  const rows = patchRows(state, catalog);
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
    '| Ch | Mic | Source | Model | Pattern | Target ft | Arrival ms | Cable |',
    '| --- | --- | --- | --- | --- | ---: | ---: | ---: |',
    ...rows.map(
      (row) =>
        `| ${row.channel} | ${row.name} | ${row.target} | ${row.model || row.type} | ${row.pattern} | ${
          row.distance == null ? '' : row.distance.toFixed(2)
        } | ${row.arrival == null ? '' : row.arrival.toFixed(2)} | ${row.standardCable} ft |`,
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
  const lines = [`Reference: ${config.name}`, `Preset: ${candidate?.name || layoutMic.name}`];
  if (layoutMic.researchSource) lines.push(`Research source: ${layoutMic.researchSource}`);
  if (row?.confidence) lines.push(`Confidence: ${row.confidence}`);
  if (row?.placement) lines.push(`Placement: ${row.placement}`);
  if (row?.phaseRelationship) lines.push(`Phase: ${row.phaseRelationship}`);
  if (row?.processingNotes) lines.push(`Processing: ${row.processingNotes}`);
  if (!row?.confidence && config.accuracyBoundary?.summary) lines.push(config.accuracyBoundary.summary);
  return lines.join('\n');
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
  if (!config || !candidate || !layout) {
    toast('Preset unavailable');
    return;
  }
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

  ['projectName', 'projectEngineer', 'projectVenue', 'projectDate', 'projectNotes'].forEach((id) => {
    $(id).addEventListener('input', syncProjectFromFields);
  });

  ['roomW', 'roomL', 'roomH'].forEach((id) => $(id).addEventListener('input', syncRoomFromFields));
  ['showCables', 'measurementRays', 'autoSave'].forEach((id) => $(id).addEventListener('change', syncRoomFromFields));

  $('kitPiece').addEventListener('change', renderKitSelectors);
  $('kitSize').addEventListener('change', () => {
    const drum = state.kit[selectedKitIndex()];
    const sizes = KIT_SIZES[drum.id] || [];
    const value = $('kitSize').value;
    if (value !== 'custom') setKitSize(drum, sizes[Number(value)]);
    updateState({ refreshForms: true });
  });
  ['kitX', 'kitY', 'kitZ', 'kitDia', 'kitDepth'].forEach((id) => $(id).addEventListener('input', syncKitFromFields));
  $('btnStandardKit').addEventListener('click', () => {
    const standard = createDefaultState();
    state.kit = standard.kit;
    state.mics = standard.mics;
    selectedMicIndex = 0;
    selectedGoboIndex = Math.min(selectedGoboIndex, Math.max(0, state.gobos.length - 1));
    updateState({ refreshForms: true });
    toast('Standard kit restored');
  });

  $('micSelect').addEventListener('change', () => {
    selectedMicIndex = Number($('micSelect').value);
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
    const selectedCatalog = catalogById($('micCatalog').value) || catalog[0];
    const channel = Math.max(0, ...state.mics.map((mic) => Number(mic.channel) || 0)) + 1;
    state.mics.push(
      clampMicToRoom(
        {
          id: createId('mic'),
          channel,
          name: selectedCatalog ? selectedCatalog.model : `Mic ${channel}`,
          catalogId: selectedCatalog?.id || '',
          micType: selectedCatalog?.micType || 'dynamic',
          pattern: selectedCatalog?.defaultPattern || 'cardioid',
          target: state.kit[0]?.name || '',
          x: 0,
          y: -2,
          z: 3,
          stand: true,
          notes: '',
        },
        state.room,
      ),
    );
    selectedMicIndex = state.mics.length - 1;
    updateState({ refreshForms: true });
  });
  $('btnDeleteMic').addEventListener('click', () => {
    if (state.mics.length <= 1) return;
    state.mics.splice(selectedMicIndex, 1);
    selectedMicIndex = Math.max(0, selectedMicIndex - 1);
    updateState({ refreshForms: true });
  });

  $('goboSelect').addEventListener('change', () => {
    selectedGoboIndex = Number($('goboSelect').value);
    sceneApi.setSelectedGoboIndex(selectedGoboIndex);
    renderGoboSelectors();
  });
  ['goboX', 'goboY', 'goboRot', 'goboW', 'goboH'].forEach((id) => $(id).addEventListener('input', syncGoboFromFields));
  $('btnAddGobo').addEventListener('click', () => {
    state.gobos.push({ id: createId('gobo'), name: `Gobo ${state.gobos.length + 1}`, x: 0, y: 3, rot: 0, w: 4, h: 6 });
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
    try {
      state = await saveProject(state);
      await refreshProjectList();
      toast('Project saved');
      setStatus('Saved');
    } catch (error) {
      console.error(error);
      toast('Save failed');
    }
  });
  $('projectSelect').addEventListener('change', async () => {
    const id = $('projectSelect').value;
    if (!id) return;
    const loaded = await loadProject(id);
    if (!loaded) return;
    state = loaded;
    selectedMicIndex = 0;
    selectedGoboIndex = 0;
    updateState({ autosave: false, refreshForms: true });
    await refreshProjectList();
    toast('Project loaded');
  });
  $('btnDeleteProject').addEventListener('click', async () => {
    if (!state.project.id) return;
    if (!confirm(`Delete local project "${state.project.name}"?`)) return;
    await deleteProject(state.project.id);
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
    downloadText(`${state.project.name.replaceAll(/\W+/g, '-').toLowerCase()}-patch-list.csv`, rowsToCsv(patchRows(state, catalog)), 'text/csv');
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
  if (shared) return shared;
  const lastId = await getLastProjectId();
  const loaded = await loadProject(lastId);
  return loaded || validatePlannerState(createDefaultState());
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
  setStatus(`${catalog.length} mic profiles · ${templates.length} templates · ${referenceConfigs.length} presets`);
}

init().catch((error) => {
  console.error(error);
  setStatus('App failed to start');
});
