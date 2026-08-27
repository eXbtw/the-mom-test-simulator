// Mock stand-in for Агент-Аудитор (Mom Test Evaluator).
// Real version will call an LLM and return structured JSON per the PRD triggers.

const RULES = [
  {
    type: 'hypothetical',
    delta: -10,
    message: 'Гипотетический вопрос: реальные ответы про будущее почти всегда врут.',
    suggestion: 'Спросите про прошлый опыт: «Расскажите, как в последний раз вы решали похожую проблему?»',
    test: (t) => /\bбы\b|купил(и|и бы)?|хотели бы|стали бы|планируете ли/i.test(t),
  },
  {
    type: 'leading_question',
    delta: -10,
    message: 'Наводящий вопрос: собеседник просто соглашается с вашей формулировкой.',
    suggestion: 'Уберите оценку из вопроса: «Как вы обычно справляетесь с такими ситуациями?»',
    test: (t) => /не думаете ли|согласны( ли)? вы|разве не|правда ведь/i.test(t),
  },
  {
    type: 'pitching',
    delta: -20,
    message: 'Питчинг вместо исследования: вы продаёте идею, а не изучаете проблему.',
    suggestion: 'Сфокусируйтесь на проблеме, а не решении: «Как сейчас вы справляетесь с этой задачей?»',
    test: (t) => /наш(а|у|его)? (продукт|сервис|решение|идея)|мы (сделали|создали|разрабатываем)/i.test(t),
  },
  {
    type: 'good_question',
    delta: 15,
    message: 'Открытый вопрос о прошлом опыте — так и раскрываются реальные боли.',
    suggestion: null,
    test: (t) => /расскажите|как вы (решали|справлялись|поступили)|что вы делали|в прошлый раз/i.test(t),
  },
]

export function evaluateMessage(text) {
  const rule = RULES.find((r) => r.test(text))
  if (!rule) return null
  const { type, delta, message, suggestion } = rule
  return { type, delta, message, suggestion }
}
