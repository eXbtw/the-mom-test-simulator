// Aggregates evaluation tags stored on past transcripts into a per-user skill
// profile — no AI calls needed, it's pure math over data we already have.
export const MISTAKE_TYPES = ['leading_question', 'hypothetical', 'pitching']

const MIN_MISTAKES_FOR_PROFILE = 3

const META = {
  leading_question: {
    label: 'Наводящие вопросы',
    tip: 'Не подсказывай ответ в вопросе — спрашивай «Как вы сейчас с этим справляетесь?» вместо «Разве не было бы удобнее, если...»',
  },
  hypothetical: {
    label: 'Вопросы о будущем',
    tip: 'Спрашивай про прошлый опыт, а не про гипотезы: «Расскажите про последний раз, когда...» вместо «Стали бы вы пользоваться...»',
  },
  pitching: {
    label: 'Питчинг решения',
    tip: 'Не продавай решение — сначала до конца пойми проблему собеседника',
  },
}

export function computeWeaknessProfile(history) {
  const counts = { leading_question: 0, hypothetical: 0, pitching: 0, good_question: 0, neutral: 0 }

  for (const entry of history) {
    for (const m of entry.transcript ?? []) {
      if (m.role === 'user' && m.evalType && counts[m.evalType] !== undefined) {
        counts[m.evalType]++
      }
    }
  }

  const totalMistakes = MISTAKE_TYPES.reduce((sum, t) => sum + counts[t], 0)
  const totalEvaluated = totalMistakes + counts.good_question + counts.neutral

  const items = MISTAKE_TYPES.map((type) => ({
    type,
    label: META[type].label,
    count: counts[type],
    share: totalEvaluated ? Math.round((counts[type] / totalEvaluated) * 100) : 0,
  }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)

  return {
    ready: totalMistakes >= MIN_MISTAKES_FOR_PROFILE,
    items,
    totalMistakes,
    totalEvaluated,
    goodQuestionCount: counts.good_question,
  }
}

export function getChecklistTips(profile, max = 2) {
  if (!profile.ready) {
    return ['Задавай открытые вопросы о прошлом опыте собеседника, а не о гипотезах и будущем']
  }
  return profile.items.slice(0, max).map((item) => META[item.type].tip)
}

const MIN_EVALUATED_FOR_ARCHETYPE = 5

const ARCHETYPES = {
  good_question: {
    id: 'master',
    label: 'Мастер Mom Test',
    description: 'Ты задаёшь открытые вопросы о реальном опыте — именно так и работает метод.',
  },
  leading_question: {
    id: 'inquisitor',
    label: 'Дознаватель',
    description: 'Ты часто подсказываешь ответ прямо в вопросе. Попробуй спрашивать нейтральнее.',
  },
  hypothetical: {
    id: 'dreamer',
    label: 'Мечтатель',
    description: 'Тебя тянет спросить про будущее и гипотезы вместо того, что уже было на самом деле.',
  },
  pitching: {
    id: 'salesman',
    label: 'Продавец',
    description: 'Хочется поскорее показать решение — но сначала стоит до конца понять проблему.',
  },
}

export function computeArchetype(profile) {
  if (profile.totalEvaluated < MIN_EVALUATED_FOR_ARCHETYPE) return null

  const candidates = [
    { type: 'good_question', count: profile.goodQuestionCount },
    ...profile.items.map((item) => ({ type: item.type, count: item.count })),
  ]
  const top = candidates.reduce((best, c) => (c.count > best.count ? c : best))

  if (top.count === 0) return null
  return ARCHETYPES[top.type]
}
