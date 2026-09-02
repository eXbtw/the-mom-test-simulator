import { describe, expect, it } from 'vitest'
import { gradeForScore } from './grading'

describe('gradeForScore', () => {
  it('grades boundary scores at each tier', () => {
    expect(gradeForScore(0)).toBe('Novice Researcher')
    expect(gradeForScore(39)).toBe('Novice Researcher')
    expect(gradeForScore(40)).toBe('Junior Researcher')
    expect(gradeForScore(59)).toBe('Junior Researcher')
    expect(gradeForScore(60)).toBe('Middle Researcher')
    expect(gradeForScore(79)).toBe('Middle Researcher')
    expect(gradeForScore(80)).toBe('Senior Researcher')
    expect(gradeForScore(100)).toBe('Senior Researcher')
  })
})
