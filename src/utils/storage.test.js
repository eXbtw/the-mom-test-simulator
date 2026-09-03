import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addHistoryEntry,
  clearHistory,
  clearUpcomingInterview,
  getDailyChallengeState,
  getHistory,
  getSavedPersonas,
  getUpcomingInterview,
  hasSeenChatHint,
  isPersonaSaved,
  markChatHintSeen,
  recordDailyChallengeCompletion,
  removeSavedPersona,
  savePersona,
  setUpcomingInterview,
} from './storage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('history', () => {
  it('starts empty and grows with new entries, most recent first', () => {
    expect(getHistory()).toEqual([])
    addHistoryEntry({ id: 'a' })
    addHistoryEntry({ id: 'b' })
    expect(getHistory().map((e) => e.id)).toEqual(['b', 'a'])
  })

  it('caps history at 50 entries', () => {
    for (let i = 0; i < 55; i++) addHistoryEntry({ id: `s${i}` })
    expect(getHistory()).toHaveLength(50)
  })

  it('clearHistory empties it', () => {
    addHistoryEntry({ id: 'a' })
    clearHistory()
    expect(getHistory()).toEqual([])
  })
})

describe('saved personas', () => {
  it('saves, detects, and removes a persona without duplicates', () => {
    const persona = { id: 'p1', name: 'Anna' }
    expect(isPersonaSaved('p1')).toBe(false)
    savePersona(persona)
    savePersona(persona)
    expect(getSavedPersonas()).toHaveLength(1)
    expect(isPersonaSaved('p1')).toBe(true)
    removeSavedPersona('p1')
    expect(isPersonaSaved('p1')).toBe(false)
  })
})

describe('upcoming interview', () => {
  it('round-trips a record and clears it', () => {
    expect(getUpcomingInterview()).toBeNull()
    setUpcomingInterview({ date: '2026-01-01', idea: 'x', personaId: 'p1' })
    expect(getUpcomingInterview()).toMatchObject({ date: '2026-01-01' })
    clearUpcomingInterview()
    expect(getUpcomingInterview()).toBeNull()
  })
})

describe('chat hint', () => {
  it('is unseen by default and stays seen once marked', () => {
    expect(hasSeenChatHint()).toBe(false)
    markChatHintSeen()
    expect(hasSeenChatHint()).toBe(true)
  })
})

describe('daily challenge streak', () => {
  it('starts at zero with no completions', () => {
    expect(getDailyChallengeState()).toEqual({ lastDate: null, streak: 0 })
  })

  it('starts a streak at 1 on first completion', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-10T12:00:00Z'))
    const state = recordDailyChallengeCompletion()
    expect(state).toEqual({ lastDate: '2026-03-10', streak: 1 })
  })

  it('does not double-count a second completion on the same day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-10T12:00:00Z'))
    recordDailyChallengeCompletion()
    vi.setSystemTime(new Date('2026-03-10T20:00:00Z'))
    const state = recordDailyChallengeCompletion()
    expect(state).toEqual({ lastDate: '2026-03-10', streak: 1 })
  })

  it('increments the streak on a consecutive day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-10T12:00:00Z'))
    recordDailyChallengeCompletion()
    vi.setSystemTime(new Date('2026-03-11T09:00:00Z'))
    const state = recordDailyChallengeCompletion()
    expect(state).toEqual({ lastDate: '2026-03-11', streak: 2 })
  })

  it('resets the streak to 1 after a skipped day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-10T12:00:00Z'))
    recordDailyChallengeCompletion()
    vi.setSystemTime(new Date('2026-03-12T09:00:00Z'))
    const state = recordDailyChallengeCompletion()
    expect(state).toEqual({ lastDate: '2026-03-12', streak: 1 })
  })
})
