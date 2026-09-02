import { describe, expect, it } from 'vitest'
import { buildMarkdownReport } from './report'

describe('buildMarkdownReport', () => {
  const persona = { name: 'Anna', role: 'Owner' }
  const baseResult = {
    score: 72,
    grade: 'Middle Researcher',
    mistakes: [],
    insights: [
      { label: 'Pain A', revealed: true },
      { label: 'Pain B', revealed: false },
    ],
    messages: [
      { role: 'ai', text: 'Hi' },
      { role: 'user', text: 'How do you do X?' },
    ],
  }

  it('includes score, grade, and revealed insight count', () => {
    const md = buildMarkdownReport({ persona, result: baseResult })
    expect(md).toContain('72/100 · Middle Researcher')
    expect(md).toContain('Выявленные боли (1 из 2)')
    expect(md).toContain('✅ Pain A')
    expect(md).toContain('⬜ Pain B')
  })

  it('reports no mistakes when the list is empty', () => {
    const md = buildMarkdownReport({ persona, result: baseResult })
    expect(md).toContain('Ошибок не найдено')
  })

  it('lists each mistake with its why and suggestion', () => {
    const result = {
      ...baseResult,
      mistakes: [{ question: 'Would you buy this?', why: 'Hypothetical', suggestion: 'Ask about the past' }],
    }
    const md = buildMarkdownReport({ persona, result })
    expect(md).toContain('«Would you buy this?»')
    expect(md).toContain('**Почему это ошибка:** Hypothetical')
    expect(md).toContain('**Как надо было спросить:** Ask about the past')
  })

  it('renders the transcript with speaker labels', () => {
    const md = buildMarkdownReport({ persona, result: baseResult })
    expect(md).toContain('**Anna:** Hi')
    expect(md).toContain('**Вы:** How do you do X?')
  })
})
