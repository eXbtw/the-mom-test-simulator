import { callGemini } from './_gemini.js'
import { checkRateLimit, getClientIp } from './_rateLimit.js'

function trustDescription(trust) {
  if (trust >= 70) {
    return 'Ты полностью доверяешь собеседнику и охотно делишься подробностями и реальными деталями.'
  }
  if (trust >= 40) {
    return 'Ты в целом открыт и отвечаешь нормально, как в обычном разговоре.'
  }
  if (trust >= 15) {
    return 'Ты насторожен: тебя уже пытались продавить наводящими вопросами или продать решение. Отвечаешь короче и менее охотно делишься деталями, но остаёшься вежливым.'
  }
  return 'Ты почти закрылся: слишком много наводящих вопросов или попыток продать решение. Отвечаешь односложно и уклончиво, хочешь поскорее закончить разговор, но остаёшься вежливым.'
}

const MOOD_PROMPTS = {
  rushed:
    'Ты сегодня очень занят(а) и спешишь — отвечай короткими фразами (1 предложение) и периодически намекай, что у тебя мало времени.',
  friendly:
    'Ты сегодня в хорошем настроении, открыт(а) и дружелюбен(на) — охотно поддерживаешь разговор, хотя это не отменяет правил ниже про наводящие и гипотетические вопросы.',
  skeptical:
    'Ты сегодня настроен(а) скептично и сдержанно — не спешишь раскрываться, отвечаешь осторожно, пока не почувствуешь, что вопрос действительно по делу.',
  agreeable:
    'Ты сегодня очень вежливый(ая) и неконфликтный(ая) — склонен(на) соглашаться и хвалить всё подряд из вежливости, даже когда это не совсем искренне, и сам(а) не осознаёшь это как проблему.',
}

function buildSystemInstruction(persona, trust, moodId) {
  const moodPrompt = MOOD_PROMPTS[moodId]

  return `Ты — ${persona.name}, ${persona.role}. ${persona.description}

Твой настрой в начале разговора: ${persona.trafficSource?.prompt ?? ''}

Насколько легко ты раскрываешься: ${persona.difficultyPrompt ?? ''}
${moodPrompt ? `\nТвоё сиюминутное настроение сегодня: ${moodPrompt}\n` : ''}
Текущий уровень доверия к интервьюеру (0-100): ${trust}. ${trustDescription(trust)}

Правила поведения:
- Никогда не выходи из роли, отвечай от первого лица, в разговорном стиле.
- Если вопрос гипотетический или наводящий (про будущее, гипотезы, или подсказывает желаемый ответ: "хотели бы вы...", "разве не было бы удобно, если...") — отвечай социально одобряемо и уклончиво ("да, звучит неплохо"), не раскрывая реальных деталей и не давая твёрдых обязательств.
- Если собеседник продаёт своё решение или продукт вместо того чтобы спрашивать про твой опыт — не оценивай и не хвали решение, вежливо уходи от темы, не раскрывай новых деталей о своей проблеме.
- Если тебя спрашивают открытым вопросом о прошлом опыте ("расскажите, как вы решали...", "что вы делали в прошлый раз") — раскрывай реальную боль и конкретные детали из своего опыта, в объёме, который соответствует твоему текущему уровню доверия.
- Ответы короткие: 1-3 предложения, как в живом разговоре.`
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

  const { persona, history, message, trust, moodId } = req.body ?? {}
  if (!persona || !message) {
    res.status(400).json({ error: 'persona and message are required' })
    return
  }

  const clampedTrust = typeof trust === 'number' ? Math.max(0, Math.min(100, trust)) : 50

  try {
    const contents = [
      ...(Array.isArray(history) ? history : []).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const reply = await callGemini({
      systemInstruction: buildSystemInstruction(persona, clampedTrust, moodId),
      contents,
    })

    res.status(200).json({ reply: reply.trim() })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
