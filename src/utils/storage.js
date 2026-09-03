// All local — no backend. Data lives per-browser via localStorage, so it
// won't sync across devices, but needs no auth/DB for an MVP.
const HISTORY_KEY = 'mom-test-history'
const SAVED_PERSONAS_KEY = 'mom-test-saved-personas'
const UPCOMING_INTERVIEW_KEY = 'mom-test-upcoming-interview'
const CHAT_HINT_SEEN_KEY = 'mom-test-chat-hint-seen'
const DAILY_CHALLENGE_KEY = 'mom-test-daily-challenge'
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

export function hasSeenChatHint() {
  return readJson(CHAT_HINT_SEEN_KEY, false)
}

export function markChatHintSeen() {
  writeJson(CHAT_HINT_SEEN_KEY, true)
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function getDailyChallengeState() {
  return readJson(DAILY_CHALLENGE_KEY, { lastDate: null, streak: 0 })
}

export function recordDailyChallengeCompletion() {
  const today = todayStr()
  const state = getDailyChallengeState()
  if (state.lastDate === today) return state

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const streak = state.lastDate === yesterday ? state.streak + 1 : 1
  const next = { lastDate: today, streak }
  writeJson(DAILY_CHALLENGE_KEY, next)
  return next
}
