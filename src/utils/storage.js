/**
 * utils/storage.js
 * -----------------------------------------------------------------------
 * Thin wrapper around localStorage for the spin history board.
 * Isolated here so the storage strategy (key names, schema, error
 * handling) can change without touching any component code.
 * -----------------------------------------------------------------------
 */

const HISTORY_KEY = "ssbt-fusion-wheel.history.v1";

/**
 * @typedef {Object} SpinRecord
 * @property {string} id
 * @property {string} playerName
 * @property {number} number
 * @property {string} date   - localized date string, e.g. "18 Aug 2026"
 * @property {string} time   - localized time string, e.g. "14:32:07"
 * @property {number} timestamp - epoch ms, used for sorting
 */

/** Reads the full spin history, newest first. Never throws. */
export function loadHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to read spin history from localStorage:", error);
    return [];
  }
}

/**
 * Appends a new spin record and persists it. Returns the updated,
 * newest-first history array.
 * @param {{ playerName: string, number: number }} entry
 */
export function addHistoryRecord({ playerName, number }) {
  const now = new Date();

  /** @type {SpinRecord} */
  const record = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    playerName,
    number,
    date: now.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    timestamp: now.getTime(),
  };

  const history = [record, ...loadHistory()];

  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to persist spin history to localStorage:", error);
  }

  return history;
}

/** Clears all spin history from localStorage. */
export function clearHistory() {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear spin history from localStorage:", error);
  }
  return [];
}
