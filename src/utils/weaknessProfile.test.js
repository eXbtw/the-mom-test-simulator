import { describe, expect, it } from 'vitest'
import { computeArchetype, computeWeaknessProfile, getChecklistTips } from './weaknessProfile'

function entryWithTypes(types) {
  return {
    transcript: types.map((evalType, i) => ({ id: i, role: 'user', evalType })),
  }
}

describe('computeWeaknessProfile', () => {
  it('is not ready with fewer than 3 mistakes', () => {
    const profile = computeWeaknessProfile([entryWithTypes(['leading_question', 'good_question'])])
    expect(profile.ready).toBe(false)
    expect(profile.totalMistakes).toBe(1)
  })

  it('aggregates counts across multiple history entries', () => {
    const history = [
      entryWithTypes(['leading_question', 'leading_question', 'pitching']),
      entryWithTypes(['hypothetical', 'good_question']),
    ]
    const profile = computeWeaknessProfile(history)
    expect(profile.ready).toBe(true)
    expect(profile.totalMistakes).toBe(4)
    expect(profile.goodQuestionCount).toBe(1)
    expect(profile.items[0]).toMatchObject({ type: 'leading_question', count: 2 })
  })

  it('ignores entries without a transcript', () => {
    const profile = computeWeaknessProfile([{}, { transcript: undefined }])
    expect(profile.ready).toBe(false)
    expect(profile.totalEvaluated).toBe(0)
  })

  it('only counts user messages, not ai replies', () => {
    const history = [
      {
        transcript: [
          { role: 'ai', evalType: 'leading_question' },
          { role: 'user', evalType: 'leading_question' },
        ],
      },
    ]
    expect(computeWeaknessProfile(history).totalMistakes).toBe(1)
  })
})

describe('getChecklistTips', () => {
  it('returns a generic tip when the profile is not ready', () => {
    const tips = getChecklistTips({ ready: false, items: [] })
    expect(tips).toHaveLength(1)
  })

  it('returns tips for the top weakness types, capped at max', () => {
    const profile = computeWeaknessProfile([
      entryWithTypes(['leading_question', 'leading_question', 'pitching', 'hypothetical']),
    ])
    const tips = getChecklistTips(profile, 2)
    expect(tips).toHaveLength(2)
  })
})

describe('computeArchetype', () => {
  it('returns null when not enough evaluated messages', () => {
    expect(computeArchetype(computeWeaknessProfile([entryWithTypes(['leading_question'])]))).toBeNull()
  })

  it('picks Мастер Mom Test when good questions dominate', () => {
    const profile = computeWeaknessProfile([
      entryWithTypes(['good_question', 'good_question', 'good_question', 'good_question', 'leading_question']),
    ])
    expect(computeArchetype(profile).label).toBe('Мастер Mom Test')
  })

  it('picks Дознаватель when leading questions dominate', () => {
    const profile = computeWeaknessProfile([
      entryWithTypes(['leading_question', 'leading_question', 'leading_question', 'leading_question', 'good_question']),
    ])
    expect(computeArchetype(profile).label).toBe('Дознаватель')
  })
})
