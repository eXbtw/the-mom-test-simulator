import { beforeEach, describe, expect, it } from 'vitest'
import {
  addHistoryEntry,
  clearHistory,
  clearUpcomingInterview,
  getHistory,
  getSavedPersonas,
  getUpcomingInterview,
  isPersonaSaved,
  removeSavedPersona,
  savePersona,
  setUpcomingInterview,
} from './storage'

beforeEach(() => {
  localStorage.clear()
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
