export const APP_SCHEMA_VERSION = 5;

export const SPEED_OF_SOUND_FTPS = 1125;

export const PATTERNS = ['cardioid', 'supercardioid', 'hypercardioid', 'omni', 'figure-8'];

export const MIC_TYPES = ['dynamic', 'pencil', 'ldc', 'kickmic'];

export const KIT_SIZES = {
  kick: [
    [18, 14],
    [20, 14],
    [22, 14],
    [22, 16],
    [24, 14],
  ],
  snare: [
    [13, 6],
    [14, 5],
    [14, 5.5],
    [14, 6.5],
  ],
  'tom-hi': [
    [8, 7],
    [10, 8],
    [12, 9],
    [13, 10],
  ],
  'tom-lo': [
    [14, 14],
    [16, 16],
    [18, 16],
  ],
  hihat: [13, 14, 15],
  crash: [16, 17, 18, 19, 20],
  ride: [20, 21, 22, 24],
};

export const GOBO_STANDARD_SIZES = [
  { id: 'amp-3x2', name: '3 x 2 ft amp screen', w: 3, h: 2, depth: 0.25 },
  { id: 'portable-2x4', name: '2 x 4 ft portable panel', w: 2, h: 4, depth: 0.25 },
  { id: 'low-4x3', name: '4 x 3 ft low screen', w: 4, h: 3, depth: 0.3 },
  { id: 'square-4x4', name: '4 x 4 ft square panel', w: 4, h: 4, depth: 0.3 },
  { id: 'tall-3x6', name: '3 x 6 ft tall panel', w: 3, h: 6, depth: 0.3 },
  { id: 'large-4x6', name: '4 x 6 ft large panel', w: 4, h: 6, depth: 0.3 },
  { id: 'vocal-4x7', name: '4 x 7 ft vocal screen', w: 4, h: 7, depth: 0.3 },
  { id: 'full-4x8', name: '4 x 8 ft full baffle', w: 4, h: 8, depth: 0.3 },
];

export const GOBO_KINDS = [
  { id: 'panel', name: 'Gobo panel', depth: 0.3 },
  { id: 'curtain', name: 'Curtain', depth: 0.05 },
  { id: 'blanket', name: 'Sound blanket', depth: 0.08 },
  { id: 'custom', name: 'Custom item', depth: 0.25 },
];

export const inft = (inches) => inches / 12;

export function goboStandardSizeById(id) {
  return GOBO_STANDARD_SIZES.find((size) => size.id === id) || null;
}

export function inferGoboStandardSize(gobo) {
  if (!gobo) return null;
  return (
    GOBO_STANDARD_SIZES.find(
      (size) => Math.abs(Number(gobo.w) - size.w) < 0.05 && Math.abs(Number(gobo.h) - size.h) < 0.05,
    ) || null
  );
}

export function createId(prefix = 'id') {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createDefaultState() {
  const now = new Date().toISOString();
  return {
    schemaVersion: APP_SCHEMA_VERSION,
    project: {
      id: createId('project'),
      name: 'Untitled Drum Session',
      engineer: '',
      venue: '',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
      createdAt: now,
      updatedAt: now,
    },
    room: { width: 18, length: 24, height: 10 },
    options: {
      autosave: true,
      measurementRays: true,
      topView: false,
    },
    kit: [
      {
        id: 'kick',
        name: 'Kick',
        type: 'kick',
        x: 0.0,
        y: 0.0,
        z: 0.97,
        diameter: inft(22),
        height: inft(14),
      },
      {
        id: 'snare',
        name: 'Snare',
        type: 'drum',
        x: 1.1,
        y: 1.25,
        z: 1.2,
        diameter: inft(14),
        height: inft(5.5),
      },
      {
        id: 'tom-hi',
        name: 'Hi/Mid Tom',
        type: 'drum',
        x: 0.45,
        y: 0.35,
        z: 2.35,
        diameter: inft(12),
        height: inft(9),
      },
      {
        id: 'tom-lo',
        name: 'Low Tom',
        type: 'drum',
        x: -1.8,
        y: 1.3,
        z: 1.3,
        diameter: inft(16),
        height: inft(16),
      },
      {
        id: 'hihat',
        name: 'Hi Hat',
        type: 'cymbal',
        x: 2.35,
        y: 1.05,
        z: 2.55,
        diameter: inft(14),
      },
      {
        id: 'crash',
        name: 'Crash',
        type: 'cymbal',
        x: 2.0,
        y: -0.9,
        z: 3.6,
        diameter: inft(18),
      },
      {
        id: 'ride',
        name: 'Ride',
        type: 'cymbal',
        x: -2.1,
        y: -0.5,
        z: 3.2,
        diameter: inft(20),
      },
    ],
    mics: [
      {
        id: 'mic-kick-in',
        channel: 1,
        name: 'Kick In',
        catalogId: 'akg-d112',
        micType: 'kickmic',
        x: 0.0,
        y: -1.4,
        z: 0.9,
        pattern: 'cardioid',
        target: 'Kick',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-kick-out',
        channel: 2,
        name: 'Kick Out',
        catalogId: 'neumann-fet47',
        micType: 'ldc',
        x: 0.0,
        y: -2.45,
        z: 1.1,
        pattern: 'cardioid',
        target: 'Kick',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-snare',
        channel: 3,
        name: 'Snare Top',
        catalogId: 'shure-sm57',
        micType: 'dynamic',
        x: 1.6,
        y: 1.8,
        z: 1.9,
        pattern: 'cardioid',
        target: 'Snare',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-snare-bottom',
        channel: 4,
        name: 'Snare Bottom',
        catalogId: 'akg-c451',
        micType: 'pencil',
        x: 1.35,
        y: 1.55,
        z: 0.9,
        pattern: 'cardioid',
        target: 'Snare',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-tom',
        channel: 5,
        name: 'Rack Tom',
        catalogId: 'sennheiser-md421',
        micType: 'dynamic',
        x: 0.75,
        y: 0.1,
        z: 3.1,
        pattern: 'cardioid',
        target: 'Hi/Mid Tom',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-tom-lo',
        channel: 6,
        name: 'Floor Tom',
        catalogId: 'sennheiser-md421',
        micType: 'dynamic',
        x: -2.4,
        y: 1.9,
        z: 2.1,
        pattern: 'cardioid',
        target: 'Low Tom',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-hihat',
        channel: 7,
        name: 'Hi Hat',
        catalogId: 'akg-c451',
        micType: 'pencil',
        x: 2.8,
        y: 1.6,
        z: 3.2,
        pattern: 'cardioid',
        target: 'Hi Hat',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-ride',
        channel: 8,
        name: 'Ride',
        catalogId: 'neumann-km184',
        micType: 'pencil',
        x: -2.8,
        y: -0.8,
        z: 3.7,
        pattern: 'cardioid',
        target: 'Ride',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-oh-l',
        channel: 9,
        name: 'Overhead L',
        catalogId: 'akg-c414',
        micType: 'ldc',
        x: 2.4,
        y: 0.15,
        z: 5.8,
        pattern: 'cardioid',
        target: 'Snare',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-oh-r',
        channel: 10,
        name: 'Overhead R',
        catalogId: 'akg-c414',
        micType: 'ldc',
        x: -2.4,
        y: 0.15,
        z: 5.8,
        pattern: 'cardioid',
        target: 'Snare',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-room-l',
        channel: 11,
        name: 'Room L',
        catalogId: 'neumann-u87',
        micType: 'ldc',
        x: 3.2,
        y: -8.5,
        z: 4.2,
        pattern: 'omni',
        target: 'Kick',
        stand: true,
        notes: '',
      },
      {
        id: 'mic-room-r',
        channel: 12,
        name: 'Room R',
        catalogId: 'neumann-u87',
        micType: 'ldc',
        x: -3.2,
        y: -8.5,
        z: 4.2,
        pattern: 'omni',
        target: 'Kick',
        stand: true,
        notes: '',
      },
    ],
    gobos: [],
    studioInventory: {
      mics: [],
      gear: [],
    },
  };
}
