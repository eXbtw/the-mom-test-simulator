import { describe, expect, it } from 'vitest'
import { computeAchievements, computeStreak } from './achievements'

describe('computeStreak', () => {
  it('counts consecutive sessions scoring 60+ from the most recent', () => {
    expect(computeStreak([{ score: 70 }, { score: 65 }, { score: 30 }, { score: 90 }])).toBe(2)
  })

  it('is 0 when the most recent session is below 60', () => {
    expect(computeStreak([{ score: 10 }, { score: 90 }])).toBe(0)
  })

  it('is 0 on empty history', () => {
    expect(computeStreak([])).toBe(0)
  })
})

describe('computeAchievements', () => {
  it('unlocks nothing on empty history', () => {
    const achievements = computeAchievements([])
    expect(achievements.every((a) => !a.unlocked)).toBe(true)
  })

  it('unlocks first_interview and personal_best after one session', () => {
    const achievements = computeAchievements([{ score: 50, mistakesCount: 1, blindMode: false }])
    const byId = Object.fromEntries(achievements.map((a) => [a.id, a.unlocked]))
    expect(byId.first_interview).toBe(true)
    expect(byId.personal_best).toBe(true)
    expect(byId.hot_streak).toBe(false)
  })

  it('unlocks flawless when any session has zero mistakes', () => {
    const achievements = computeAchievements([{ score: 40, mistakesCount: 0 }])
    expect(achievements.find((a) => a.id === 'flawless').unlocked).toBe(true)
  })

  it('unlocks marathon at 10 sessions', () => {
    const history = Array(10).fill({ score: 50, mistakesCount: 1 })
    expect(computeAchievements(history).find((a) => a.id === 'marathon').unlocked).toBe(true)
  })
})
