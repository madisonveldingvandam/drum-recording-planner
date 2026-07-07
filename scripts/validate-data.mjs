import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MIC_CATALOG_FALLBACK, SETUP_TEMPLATES_FALLBACK } from '../src/data/catalogFallback.js';
import { PATTERNS } from '../src/data/defaultState.js';
import { REFERENCE_PRESET_CONTEXTS, REFERENCE_PRESET_LAYOUTS } from '../src/data/referencePresetLayouts.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

async function readJson(relativePath) {
  const text = await readFile(path.join(root, relativePath), 'utf8');
  return JSON.parse(text);
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function uniqueIds(items, label) {
  const ids = new Set();
  for (const item of items) {
    if (!item?.id) {
      fail(`${label} has an entry without an id`);
      continue;
    }
    if (ids.has(item.id)) fail(`${label} has duplicate id "${item.id}"`);
    ids.add(item.id);
  }
  return ids;
}

function assertPattern(pattern, label) {
  if (pattern && !PATTERNS.includes(pattern)) fail(`${label} uses unsupported pattern "${pattern}"`);
}

function assertCatalogId(catalogIds, catalogId, label) {
  if (catalogId && !catalogIds.has(catalogId)) fail(`${label} references missing catalogId "${catalogId}"`);
}

function canonical(value) {
  return JSON.stringify(value);
}

const publicCatalog = await readJson('public/data/mic-catalog.json');
const publicTemplates = await readJson('public/data/setup-templates.json');
const referenceConfigs = await readJson('public/data/reference-configurations.json');

const publicCatalogIds = uniqueIds(publicCatalog, 'public mic catalog');
const fallbackCatalogIds = uniqueIds(MIC_CATALOG_FALLBACK, 'fallback mic catalog');

for (const mic of publicCatalog) {
  assertPattern(mic.defaultPattern, `public mic catalog "${mic.id}"`);
}

for (const mic of MIC_CATALOG_FALLBACK) {
  assertPattern(mic.defaultPattern, `fallback mic catalog "${mic.id}"`);
}

for (const id of publicCatalogIds) {
  if (!fallbackCatalogIds.has(id)) fail(`fallback mic catalog is missing public id "${id}"`);
}

for (const id of fallbackCatalogIds) {
  if (!publicCatalogIds.has(id)) fail(`fallback mic catalog has extra id "${id}"`);
}

for (const mic of publicCatalog) {
  const fallback = MIC_CATALOG_FALLBACK.find((item) => item.id === mic.id);
  if (fallback && canonical(fallback) !== canonical(mic)) {
    fail(`fallback mic catalog differs from public catalog for "${mic.id}"`);
  }
}

function validateTemplateSet(templates, label) {
  const templateIds = uniqueIds(templates, label);
  for (const template of templates) {
    if (!Array.isArray(template.mics)) {
      fail(`${label} "${template.id}" has no mics array`);
      continue;
    }
    template.mics.forEach((mic, index) => {
      assertCatalogId(publicCatalogIds, mic.catalogId, `${label} "${template.id}" mic ${index + 1}`);
      assertPattern(mic.pattern, `${label} "${template.id}" mic ${index + 1}`);
    });
  }
  return templateIds;
}

validateTemplateSet(publicTemplates, 'public setup templates');
validateTemplateSet(SETUP_TEMPLATES_FALLBACK, 'fallback setup templates');

const candidateIds = new Set();
for (const config of referenceConfigs) {
  const candidates = config?.appDataNotes?.candidateSetupLabels || [];
  if (!candidates.length) fail(`reference config "${config.id}" has no candidateSetupLabels`);
  for (const candidate of candidates) {
    if (!candidate?.id) {
      fail(`reference config "${config.id}" has a candidate without an id`);
      continue;
    }
    if (candidateIds.has(candidate.id)) fail(`reference candidate id "${candidate.id}" is duplicated`);
    candidateIds.add(candidate.id);

    const layout = REFERENCE_PRESET_LAYOUTS[candidate.id];
    const context = REFERENCE_PRESET_CONTEXTS[candidate.id];
    if (!layout) fail(`reference candidate "${candidate.id}" is missing REFERENCE_PRESET_LAYOUTS`);
    if (!context) fail(`reference candidate "${candidate.id}" is missing REFERENCE_PRESET_CONTEXTS`);
    if (layout && !layout.length) fail(`reference candidate "${candidate.id}" has an empty layout`);

    if (layout) {
      layout.forEach((mic, index) => {
        assertCatalogId(publicCatalogIds, mic.catalogId, `reference layout "${candidate.id}" mic ${index + 1}`);
        assertPattern(mic.pattern, `reference layout "${candidate.id}" mic ${index + 1}`);
      });
      if (Array.isArray(candidate.channels) && candidate.channels.length !== layout.length) {
        warn(
          `reference candidate "${candidate.id}" has ${candidate.channels.length} grouped source labels and ${layout.length} mic rows; UI must display the layout row count for mic/channel count`,
        );
      }
    }
  }
}

for (const key of Object.keys(REFERENCE_PRESET_LAYOUTS)) {
  if (!candidateIds.has(key)) fail(`REFERENCE_PRESET_LAYOUTS has no matching public candidate "${key}"`);
}

for (const key of Object.keys(REFERENCE_PRESET_CONTEXTS)) {
  if (!candidateIds.has(key)) fail(`REFERENCE_PRESET_CONTEXTS has no matching public candidate "${key}"`);
}

if (warnings.length) {
  console.warn(`Data validation warnings (${warnings.length}):`);
  warnings.forEach((message) => console.warn(`- ${message}`));
}

if (errors.length) {
  console.error(`Data validation failed (${errors.length}):`);
  errors.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log('Data validation passed.');
}
