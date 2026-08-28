import { callGemini } from './_gemini.js'

const SYSTEM_INSTRUCTION = `Ты создаёшь короткие тренировочные карточки для навыка проблемных интервью по методологии The Mom Test.

Придумай короткую сцену на русском языке: случайного человека (имя и короткая роль/контекст, например «Настя, владелица шоу-рума одежды») и ОДНУ его реплику, в которой он мимоходом упоминает проблему, неопределённость или неудобство в своей работе или жизни. Реплика не должна быть прямым вопросом и не должна сама предлагать решение — это просто фрагмент разговора, к которому пользователь должен задать хороший уточняющий вопрос.

Каждый раз придумывай новую сферу деятельности и новую боль, разнообразь тематику максимально широко.`

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    speaker: { type: 'string' },
    line: { type: 'string' },
  },
  required: ['speaker', 'line'],
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const raw = await callGemini({
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [{ role: 'user', parts: [{ text: 'Сгенерируй новую карточку.' }] }],
      responseSchema: RESPONSE_SCHEMA,
    })

    const parsed = JSON.parse(raw)
    res.status(200).json(parsed)
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
