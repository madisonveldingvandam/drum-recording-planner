import { SPEED_OF_SOUND_FTPS } from './defaultState.js';

export function targetForMic(state, mic) {
  if (!mic?.target) return null;
  return state.kit.find((drum) => drum.name === mic.target) || null;
}

export function distanceFeet(a, b) {
  if (!a || !b) return null;
  const dx = Number(a.x || 0) - Number(b.x || 0);
  const dy = Number(a.y || 0) - Number(b.y || 0);
  const dz = Number(a.z || 0) - Number(b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function arrivalMs(feet) {
  return (feet / SPEED_OF_SOUND_FTPS) * 1000;
}

export function selectedMicReport(state, selectedMicIndex) {
  const mic = state.mics[selectedMicIndex] || state.mics[0] || null;
  if (!mic) return null;
  const target = targetForMic(state, mic);
  const distance = target ? distanceFeet(mic, target) : null;
  return {
    mic,
    target,
    distance,
    arrival: distance == null ? null : arrivalMs(distance),
  };
}

export function phaseRiskRows(state, selectedMicIndex) {
  const selected = state.mics[selectedMicIndex];
  const target = selected ? targetForMic(state, selected) : null;
  if (!selected || !target) return [];
  const closeDistance = distanceFeet(selected, target);
  if (!closeDistance || closeDistance < 0.01) return [];

  return state.mics
    .filter((mic) => mic.id !== selected.id)
    .map((mic) => {
      const sourceToOther = distanceFeet(target, mic);
      const ratio = sourceToOther / closeDistance;
      return {
        mic,
        source: target.name,
        closeDistance,
        sourceToOther,
        ratio,
        deltaMs: arrivalMs(sourceToOther - closeDistance),
        status: ratio >= 3 ? 'ok' : ratio >= 2 ? 'watch' : 'risk',
      };
    })
    .sort((a, b) => a.ratio - b.ratio);
}

function findMicByNeedle(state, needles) {
  const normalized = needles.map((needle) => needle.toLowerCase());
  return state.mics.find((mic) => {
    const haystack = `${mic.id} ${mic.name}`.toLowerCase();
    return normalized.some((needle) => haystack.includes(needle));
  });
}

export function overheadReport(state) {
  const left = findMicByNeedle(state, ['oh-l', 'overhead l', 'overhead left']);
  const right = findMicByNeedle(state, ['oh-r', 'overhead r', 'overhead right']);
  const snare = state.kit.find((drum) => drum.name === 'Snare');
  const kick = state.kit.find((drum) => drum.name === 'Kick');
  if (!left || !right) return null;

  const snareLeft = snare ? distanceFeet(left, snare) : null;
  const snareRight = snare ? distanceFeet(right, snare) : null;
  const kickLeft = kick ? distanceFeet(left, kick) : null;
  const kickRight = kick ? distanceFeet(right, kick) : null;

  const snareDiff = snareLeft == null || snareRight == null ? null : Math.abs(snareLeft - snareRight);
  const kickDiff = kickLeft == null || kickRight == null ? null : Math.abs(kickLeft - kickRight);

  return {
    left,
    right,
    snareLeft,
    snareRight,
    kickLeft,
    kickRight,
    snareDiff,
    kickDiff,
    snareDiffMs: snareDiff == null ? null : arrivalMs(snareDiff),
    kickDiffMs: kickDiff == null ? null : arrivalMs(kickDiff),
    status: Math.max(snareDiff || 0, kickDiff || 0) <= 0.083 ? 'ok' : 'watch',
  };
}

export function patchRows(state, catalog = []) {
  return state.mics
    .slice()
    .sort((a, b) => Number(a.channel || 0) - Number(b.channel || 0))
    .map((mic) => {
      const target = targetForMic(state, mic);
      const distance = target ? distanceFeet(mic, target) : null;
      const catalogItem = catalog.find((item) => item.id === mic.catalogId);
      return {
        channel: mic.channel,
        name: mic.name,
        target: mic.target || '',
        model: catalogItem ? `${catalogItem.manufacturer} ${catalogItem.model}` : mic.catalogId || '',
        type: mic.micType,
        pattern: mic.pattern,
        stand: mic.stand ? 'Yes' : 'No',
        distance,
        arrival: distance == null ? null : arrivalMs(distance),
        notes: mic.notes || '',
      };
    });
}

export function rowsToCsv(rows) {
  const headers = [
    'Channel',
    'Name',
    'Source',
    'Model',
    'Type',
    'Pattern',
    'Stand',
    'Distance ft',
    'Arrival ms',
    'Notes',
  ];
  const body = rows.map((row) => [
    row.channel,
    row.name,
    row.target,
    row.model,
    row.type,
    row.pattern,
    row.stand,
    row.distance == null ? '' : row.distance.toFixed(2),
    row.arrival == null ? '' : row.arrival.toFixed(2),
    row.notes,
  ]);
  return [headers, ...body]
    .map((line) =>
      line
        .map((value) => String(value ?? '').replaceAll('"', '""'))
        .map((value) => (/[",\n]/.test(value) ? `"${value}"` : value))
        .join(','),
    )
    .join('\n');
}
