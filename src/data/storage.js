import { validatePlannerState } from './validation.js';

const DB_NAME = 'drum-mic-planner';
const DB_VERSION = 1;
const PROJECT_STORE = 'projects';
const META_STORE = 'meta';
const LAST_PROJECT_KEY = 'lastProjectId';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PROJECT_STORE)) {
        const store = db.createObjectStore(PROJECT_STORE, { keyPath: 'project.id' });
        store.createIndex('updatedAt', 'project.updatedAt');
        store.createIndex('name', 'project.name');
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function saveProject(state) {
  const valid = validatePlannerState(state);
  if (!valid) throw new Error('Invalid planner state');
  valid.project.updatedAt = new Date().toISOString();
  const db = await openDb();
  const tx = db.transaction([PROJECT_STORE, META_STORE], 'readwrite');
  tx.objectStore(PROJECT_STORE).put(valid);
  tx.objectStore(META_STORE).put({ key: LAST_PROJECT_KEY, value: valid.project.id });
  await txDone(tx);
  db.close();
  return valid;
}

export async function listProjects() {
  const db = await openDb();
  const tx = db.transaction(PROJECT_STORE, 'readonly');
  const request = tx.objectStore(PROJECT_STORE).getAll();
  const projects = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return projects
    .map((item) => item.project)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

export async function loadProject(id) {
  if (!id) return null;
  const db = await openDb();
  const tx = db.transaction(PROJECT_STORE, 'readonly');
  const request = tx.objectStore(PROJECT_STORE).get(id);
  const value = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return value ? validatePlannerState(value) : null;
}

export async function deleteProject(id) {
  const db = await openDb();
  const tx = db.transaction([PROJECT_STORE, META_STORE], 'readwrite');
  tx.objectStore(PROJECT_STORE).delete(id);
  tx.objectStore(META_STORE).put({ key: LAST_PROJECT_KEY, value: '' });
  await txDone(tx);
  db.close();
}

export async function getLastProjectId() {
  const db = await openDb();
  const tx = db.transaction(META_STORE, 'readonly');
  const request = tx.objectStore(META_STORE).get(LAST_PROJECT_KEY);
  const row = await new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
  db.close();
  return row?.value || '';
}
