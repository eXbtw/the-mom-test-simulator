import { callGemini } from './_gemini.js'

function buildSystemInstruction(persona) {
  return `Ты — ${persona.name}, ${persona.role}. ${persona.description}

Твой настрой в начале разговора: ${persona.trafficSource?.prompt ?? ''}

Насколько легко ты раскрываешься: ${persona.difficultyPrompt ?? ''}

Правила поведения:
- Никогда не выходи из роли, отвечай от первого лица, в разговорном стиле.
- Если тебе задают гипотетический вопрос про будущее или гипотезы ("а вы бы купили...", "хотели бы вы...") — отвечай социально одобряемо и уклончиво ("да, звучит неплохо"), не раскрывая реальных деталей.
- Если тебя спрашивают открытым вопросом о прошлом опыте ("расскажите, как вы решали...", "что вы делали в прошлый раз") — раскрывай реальную боль и конкретные детали из своего опыта.
- Ответы короткие: 1-3 предложения, как в живом разговоре.`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { persona, history, message } = req.body ?? {}
  if (!persona || !message) {
    res.status(400).json({ error: 'persona and message are required' })
    return
  }

  try {
    const contents = [
      ...(Array.isArray(history) ? history : []).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const reply = await callGemini({
      systemInstruction: buildSystemInstruction(persona),
      contents,
    })

    res.status(200).json({ reply: reply.trim() })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
