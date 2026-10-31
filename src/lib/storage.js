import { useCallback, useEffect, useState } from 'react';

/** Read JSON from localStorage without ever throwing (corrupt data, blocked storage, SSR). */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/**
 * useState that is persisted under `key` and RE-LOADS when the key changes
 * (e.g. a different user signs in).
 *
 * The old implementation saved the previous user's state under the new user's key
 * for one render. Here a write only happens when the in-memory value belongs to the
 * current key, so data can never leak or be overwritten across accounts.
 */
export function usePersistentState(key, fallback, normalize = (v) => v) {
  const load = () => normalize(readJSON(key, fallback));
  const [state, setState] = useState(() => ({ key, value: load() }));

  // Key changed → swap in that key's data during render (no flash of stale data).
  if (state.key !== key) {
    setState({ key, value: load() });
  }

  useEffect(() => {
    if (state.key === key) writeJSON(key, state.value);
  }, [state, key]);

  const update = useCallback((next) => {
    setState((s) => ({ ...s, value: typeof next === 'function' ? next(s.value) : next }));
  }, []);

  return [state.key === key ? state.value : load(), update];
}
