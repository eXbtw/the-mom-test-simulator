import { describe, expect, it } from 'vitest'
import { MOODS, pickRandomMood } from './moods'

describe('pickRandomMood', () => {
  it('always returns one of the defined moods', () => {
    for (let i = 0; i < 30; i++) {
      const mood = pickRandomMood()
      expect(MOODS).toContainEqual(mood)
    }
  })
})
