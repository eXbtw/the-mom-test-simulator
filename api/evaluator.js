import { callGemini } from './_gemini.js'
import { checkRateLimit, getClientIp } from './_rateLimit.js'

const SYSTEM_INSTRUCTION = `Ты — Агент-Аудитор, оцениваешь качество вопросов интервьюера по методологии The Mom Test (Роб Фицпатрик).

Проанализируй последнюю реплику интервьюера и классифицируй её ровно одним типом:
- "leading_question" — наводящий вопрос, подсказывающий желаемый ответ (delta: -10)
- "hypothetical" — вопрос о будущем или гипотезах, а не о прошлом опыте (delta: -10)
- "pitching" — продажа своей идеи/продукта вместо исследования проблемы (delta: -20)
- "good_question" — открытый вопрос о конкретном прошлом опыте (delta: +15)
- "neutral" — реплика не подпадает ни под одну из категорий (small talk, уточнение, приветствие) (delta: 0)

Для "good_question" и "neutral" поле "suggestion" должно быть null.
Поле "message" — короткое объяснение (1 предложение) на русском, почему это ошибка или хороший вопрос.
Поле "suggestion" для ошибок — короткий пример, как лучше было сформулировать вопрос.`

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['leading_question', 'hypothetical', 'pitching', 'good_question', 'neutral'],
    },
    delta: { type: 'integer' },
    message: { type: 'string' },
    suggestion: { type: 'string', nullable: true },
  },
  required: ['type', 'delta', 'message', 'suggestion'],
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!checkRateLimit(getClientIp(req))) {
    res.status(429).json({ error: 'Слишком много запросов, попробуйте через минуту' })
    return
  }

  const { message } = req.body ?? {}
  if (!message) {
    res.status(400).json({ error: 'message is required' })
    return
  }

  try {
    const raw = await callGemini({
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [{ role: 'user', parts: [{ text: message }] }],
      responseSchema: RESPONSE_SCHEMA,
    })

    const parsed = JSON.parse(raw)
    res.status(200).json(parsed)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
