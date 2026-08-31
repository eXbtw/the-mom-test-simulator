// All local — no backend. Data lives per-browser via localStorage, so it
// won't sync across devices, but needs no auth/DB for an MVP.
const HISTORY_KEY = 'mom-test-history'
const SAVED_PERSONAS_KEY = 'mom-test-saved-personas'
const UPCOMING_INTERVIEW_KEY = 'mom-test-upcoming-interview'
const MAX_HISTORY = 50

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // private browsing / quota exceeded — fail silently, it's not critical
  }
}

export function getHistory() {
  return readJson(HISTORY_KEY, [])
}

export function addHistoryEntry(entry) {
  const history = getHistory()
  history.unshift(entry)
  writeJson(HISTORY_KEY, history.slice(0, MAX_HISTORY))
}

export function clearHistory() {
  writeJson(HISTORY_KEY, [])
}

export function getSavedPersonas() {
  return readJson(SAVED_PERSONAS_KEY, [])
}

export function savePersona(persona) {
  const saved = getSavedPersonas()
  if (saved.some((p) => p.id === persona.id)) return
  writeJson(SAVED_PERSONAS_KEY, [persona, ...saved])
}

export function removeSavedPersona(id) {
  writeJson(SAVED_PERSONAS_KEY, getSavedPersonas().filter((p) => p.id !== id))
}

export function isPersonaSaved(id) {
  return getSavedPersonas().some((p) => p.id === id)
}

export function getUpcomingInterview() {
  return readJson(UPCOMING_INTERVIEW_KEY, null)
}

export function setUpcomingInterview(record) {
  writeJson(UPCOMING_INTERVIEW_KEY, record)
}

export function clearUpcomingInterview() {
  writeJson(UPCOMING_INTERVIEW_KEY, null)
}
