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
  }
}

export function getChecklistTips(profile, max = 2) {
  if (!profile.ready) {
    return ['Задавай открытые вопросы о прошлом опыте собеседника, а не о гипотезах и будущем']
  }
  return profile.items.slice(0, max).map((item) => META[item.type].tip)
}
