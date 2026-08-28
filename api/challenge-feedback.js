import { callGemini } from './_gemini.js'
import { checkRateLimit, getClientIp } from './_rateLimit.js'

const SYSTEM_INSTRUCTION = `Ты — дружелюбный тренер по методологии The Mom Test (Роб Фицпатрик).

Тебе дан фрагмент разговора: реплика респондента и ответ пользователя (вопрос или реакция) на неё. Оцени ответ пользователя как продолжение проблемного интервью:
- Открытый ли это вопрос о конкретном прошлом опыте (хорошо)?
- Или это наводящий/гипотетический вопрос, комплимент-ловушка или питчинг своей идеи (плохо)?

Верни JSON:
- score: число от 0 до 100
- verdict: короткий вердикт-заголовок (например «Отлично!», «Неплохо, но есть куда расти», «Мимо цели»), в дружелюбном игровом тоне
- praise: одно предложение — что в ответе сделано хорошо (ободряюще, даже если ответ слабый — найди что похвалить)
- tip: одно предложение — конкретный совет, как сделать вопрос ещё лучше

Отвечай по-русски.`

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    score: { type: 'integer' },
    verdict: { type: 'string' },
    praise: { type: 'string' },
    tip: { type: 'string' },
  },
  required: ['score', 'verdict', 'praise', 'tip'],
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

  const { speaker, line, response } = req.body ?? {}
  if (!speaker || !line || !response) {
    res.status(400).json({ error: 'speaker, line and response are required' })
    return
  }

  try {
    const raw = await callGemini({
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Реплика (${speaker}): «${line}»\n\nОтвет пользователя: «${response}»`,
            },
          ],
        },
      ],
      responseSchema: RESPONSE_SCHEMA,
    })

    const parsed = JSON.parse(raw)
    res.status(200).json(parsed)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
