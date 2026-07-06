import { validatePlannerState } from './validation.js';

export function encodeShare(state) {
  const json = JSON.stringify(validatePlannerState(state));
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeShare(hash) {
  if (!hash) return null;
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw.startsWith('setup=')) return null;
  try {
    const encoded = raw.slice('setup='.length);
    const json = decodeURIComponent(escape(atob(encoded)));
    return validatePlannerState(json);
  } catch {
    return null;
  }
}
