import { describe, expect, it } from 'vitest'
import { computeTrust } from './trust'

function userMsg(evalType) {
  return { role: 'user', evalType }
}

describe('computeTrust', () => {
  it('starts at 50 with no evaluated messages', () => {
    expect(computeTrust([])).toBe(50)
  })

  it('ignores ai messages and messages without evalType', () => {
    const messages = [
      { role: 'ai', text: 'hi' },
      { role: 'user', text: 'hi' },
    ]
    expect(computeTrust(messages)).toBe(50)
  })

  it('raises trust on good questions and clamps at 100', () => {
    const messages = Array(10).fill(userMsg('good_question'))
    expect(computeTrust(messages)).toBe(100)
  })

  it('lowers trust on leading/hypothetical/pitching and clamps at 0', () => {
    const messages = Array(10).fill(userMsg('pitching'))
    expect(computeTrust(messages)).toBe(0)
  })

  it('accumulates deltas across a mixed conversation', () => {
    const messages = [userMsg('good_question'), userMsg('leading_question'), userMsg('hypothetical')]
    // 50 + 10 - 8 - 5 = 47
    expect(computeTrust(messages)).toBe(47)
  })

  it('does not change trust on neutral messages', () => {
    expect(computeTrust([userMsg('neutral')])).toBe(50)
  })
})
