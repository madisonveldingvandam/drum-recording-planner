import {
  APP_SCHEMA_VERSION,
  GOBO_KINDS,
  KIT_SIZES,
  MIC_TYPES,
  PATTERNS,
  clone,
  createDefaultState,
  createId,
  goboStandardSizeById,
  inferGoboStandardSize,
  inft,
} from './defaultState.js';

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function num(value, fallback) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function text(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function near(value, expected) {
  return Math.abs(num(value, 0) - expected) < 0.01;
}

function isLegacyDefaultGoboSet(gobos) {
  if (!Array.isArray(gobos) || gobos.length !== 2) return false;
  const [left, right] = gobos;
  return (
    left?.id === 'gobo-l' &&
    right?.id === 'gobo-r' &&
    left?.name === 'Gobo L' &&
    right?.name === 'Gobo R' &&
    near(left.x, -5.5) &&
    near(left.y, 2.5) &&
    near(left.rot, 25) &&
    near(left.w, 4) &&
    near(left.h, 6) &&
    near(right.x, 5.5) &&
    near(right.y, 2.5) &&
    near(right.rot, -25) &&
    near(right.w, 4) &&
    near(right.h, 6)
  );
}

function normalizeImportedMic(mic, index) {
  const sources = Array.isArray(mic.sources) ? mic.sources.map((source) => text(source, '')).filter(Boolean) : [];
  return {
    id: text(mic.id, `studio-mic-${index + 1}`),
    manufacturer: text(mic.manufacturer, ''),
    model: text(mic.model || mic.name, `Studio Mic ${index + 1}`),
    micType: MIC_TYPES.includes(mic.micType) ? mic.micType : 'dynamic',
    defaultPattern: PATTERNS.includes(mic.defaultPattern) ? mic.defaultPattern : 'cardioid',
    sources: sources.length ? sources : ['Studio Inventory'],
    maxSpl: mic.maxSpl == null ? null : num(mic.maxSpl, null),
    notes: text(mic.notes, ''),
    quantity: clamp(Math.round(num(mic.quantity, 1)), 1, 999),
    imported: true,
  };
}

function normalizeImportedGear(item, index) {
  return {
    id: text(item.id, `studio-gear-${index + 1}`),
    name: text(item.name, `Gear ${index + 1}`),
    category: text(item.category, 'Studio gear'),
    quantity: clamp(Math.round(num(item.quantity, 1)), 1, 999),
    notes: text(item.notes, ''),
    imported: true,
  };
}

export function clampMicToRoom(mic, room) {
  const halfWidth = room.width / 2 + 1;
  const halfLength = room.length / 2 + 1;
  mic.x = clamp(num(mic.x, 0), -halfWidth, halfWidth);
  mic.y = clamp(num(mic.y, 0), -halfLength, halfLength);
  mic.z = clamp(num(mic.z, 3), 0.1, room.height + 1);
  return mic;
}

export function clampGoboToRoom(gobo, room) {
  const halfWidth = room.width / 2;
  const halfLength = room.length / 2;
  const inferredSize = inferGoboStandardSize(gobo);
  const standardSize = goboStandardSizeById(gobo.standardSizeId) || inferredSize;
  const kind = GOBO_KINDS.find((item) => item.id === gobo.kind) || GOBO_KINDS[0];
  gobo.x = clamp(num(gobo.x, 0), -halfWidth, halfWidth);
  gobo.y = clamp(num(gobo.y, 0), -halfLength, halfLength);
  gobo.rot = clamp(num(gobo.rot, 0), -180, 180);
  gobo.w = clamp(num(gobo.w, 4), 1, 12);
  gobo.h = clamp(num(gobo.h, 6), 1, Math.min(12, room.height));
  gobo.standardSizeId = standardSize?.id || 'custom';
  gobo.kind = kind.id;
  gobo.depth = clamp(num(gobo.depth, standardSize?.depth || kind.depth || 0.3), 0.02, 2);
  return gobo;
}

export function validatePlannerState(input) {
  let obj;
  try {
    obj = typeof input === 'string' ? JSON.parse(input) : input;
  } catch {
    return null;
  }
  if (!obj || typeof obj !== 'object') return null;

  const def = createDefaultState();
  const now = new Date().toISOString();
  const roomSource = obj.room || {};
  const projectSource = obj.project || {};

  const out = {
    schemaVersion: APP_SCHEMA_VERSION,
    project: {
      id: text(projectSource.id, createId('project')),
      name: text(projectSource.name || obj.name, def.project.name),
      engineer: text(projectSource.engineer, ''),
      venue: text(projectSource.venue, ''),
      date: text(projectSource.date, def.project.date),
      notes: text(projectSource.notes, ''),
      createdAt: text(projectSource.createdAt, now),
      updatedAt: text(projectSource.updatedAt, now),
    },
    room: {
      width: clamp(num(roomSource.width, def.room.width), 4, 200),
      length: clamp(num(roomSource.length, def.room.length), 4, 200),
      height: clamp(num(roomSource.height, def.room.height), 4, 60),
    },
    options: {
      autosave: obj.options ? obj.options.autosave !== false : true,
      measurementRays: obj.options ? obj.options.measurementRays !== false : true,
      topView: obj.options ? obj.options.topView === true : false,
    },
    kit: [],
    mics: [],
    gobos: [],
    studioInventory: {
      mics: [],
      gear: [],
    },
  };

  const kitSource = Array.isArray(obj.kit) && obj.kit.length ? obj.kit : def.kit;
  out.kit = kitSource.map((drum, index) => ({
    id: text(drum.id, `drum-${index + 1}`),
    name: text(drum.name, `Drum ${index + 1}`),
    type: ['kick', 'drum', 'cymbal'].includes(drum.type) ? drum.type : 'drum',
    x: num(drum.x, 0),
    y: num(drum.y, 0),
    z: num(drum.z, 1),
    diameter: clamp(num(drum.diameter, 1.2), 0.3, 4),
    height: drum.type === 'cymbal' ? undefined : clamp(num(drum.height, 0.8), 0.02, 3),
  }));

  const micSource = Array.isArray(obj.mics) ? obj.mics : def.mics;
  out.mics = micSource.map((mic, index) => ({
    id: text(mic.id, `mic-${index + 1}`),
    standardId: text(mic.standardId, ''),
    channel: clamp(Math.round(num(mic.channel, index + 1)), 1, 128),
    name: text(mic.name, `Mic ${index + 1}`),
    catalogId: text(mic.catalogId, ''),
    micType: MIC_TYPES.includes(mic.micType) ? mic.micType : 'dynamic',
    x: num(mic.x, 0),
    y: num(mic.y, 0),
    z: clamp(num(mic.z, 3), 0.1, 200),
    pattern: PATTERNS.includes(mic.pattern) ? mic.pattern : 'cardioid',
    target: text(mic.target, ''),
    stand: mic.stand !== false,
    notes: text(mic.notes, ''),
  }));

  const goboSource = isLegacyDefaultGoboSet(obj.gobos) ? [] : Array.isArray(obj.gobos) ? obj.gobos : def.gobos;
  out.gobos = goboSource.map((gobo, index) => {
    const inferredSize = inferGoboStandardSize(gobo);
    const standardSize = goboStandardSizeById(gobo.standardSizeId) || inferredSize;
    const kind = GOBO_KINDS.find((item) => item.id === gobo.kind) || GOBO_KINDS[0];
    return {
      id: text(gobo.id, `gobo-${index + 1}`),
      name: text(gobo.name, `Gobo ${index + 1}`),
      standardSizeId: standardSize?.id || 'custom',
      kind: kind.id,
      x: num(gobo.x, 0),
      y: num(gobo.y, 0),
      rot: clamp(num(gobo.rot, 0), -180, 180),
      w: clamp(num(gobo.w, 4), 1, 12),
      h: clamp(num(gobo.h, 6), 1, 12),
      depth: clamp(num(gobo.depth, standardSize?.depth || kind.depth || 0.3), 0.02, 2),
    };
  });

  const inventorySource = obj.studioInventory || {};
  out.studioInventory = {
    mics: Array.isArray(inventorySource.mics) ? inventorySource.mics.map(normalizeImportedMic) : [],
    gear: Array.isArray(inventorySource.gear) ? inventorySource.gear.map(normalizeImportedGear) : [],
  };

  return out;
}

export function applyKitSize(drum) {
  const sizes = KIT_SIZES[drum.id] || [];
  const match = sizes.find((size) => {
    if (Array.isArray(size)) {
      return Math.abs(drum.diameter - inft(size[0])) < 0.01 && Math.abs((drum.height || 0) - inft(size[1])) < 0.01;
    }
    return Math.abs(drum.diameter - inft(size)) < 0.01;
  });
  return match ? clone(match) : 'custom';
}

export function setKitSize(drum, size) {
  if (!size || size === 'custom') return drum;
  if (Array.isArray(size)) {
    const top = drum.z + (drum.height || 0) / 2;
    drum.diameter = inft(size[0]);
    drum.height = inft(size[1]);
    if (drum.type === 'kick') {
      drum.z = drum.diameter / 2 + 0.05;
    } else {
      drum.z = top - drum.height / 2;
    }
  } else {
    drum.diameter = inft(size);
  }
  return drum;
}

export function duplicateAsNewProject(state, name = 'Untitled Drum Session') {
  const next = validatePlannerState(state);
  const now = new Date().toISOString();
  next.project.id = createId('project');
  next.project.name = name;
  next.project.createdAt = now;
  next.project.updatedAt = now;
  return next;
}
