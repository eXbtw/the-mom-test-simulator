import { callGemini } from './_gemini.js'
import { checkRateLimit, getClientIp } from './_rateLimit.js'

const SYSTEM_INSTRUCTION = `Ты помогаешь основателям тренироваться в проблемных интервью по методологии The Mom Test (Роб Фицпатрик) на их СОБСТВЕННОЙ реальной идее.

Пользователь опишет свой продукт или бизнес-идею. Твоя задача — придумать одного правдоподобного представителя ЦЕЛЕВОЙ АУДИТОРИИ этой идеи: человека, который потенциально сталкивается с проблемой, решаемой этой идеей.

Критически важно: этот человек НЕ ЗНАЕТ о существовании продукта пользователя и ничего не знает о предложенном решении. У него есть только реальная боль в проблемном пространстве идеи — животрепещущая, конкретная, из повседневной жизни или работы. Если он узнает о решении заранее, интервью превратится в питч, а не в исследование, поэтому никогда не упоминай сам продукт пользователя в описании персоны, вступительной фразе или инсайтах.

Сначала определи, кто именно является целевой аудиторией: представитель бизнеса (B2B) или частный пользователь (B2C) — исходя из описания идеи.

Требования к полям:
- branch: "b2b" или "b2c"
- name: правдоподобное русское имя (для b2c достаточно имени, для b2b — имя и фамилия)
- role: короткая должность/роль, одна строка
- description: 1-2 предложения о его основной боли/контексте, связанной с проблемным пространством идеи — конкретно и приземлённо, без упоминания решения пользователя
- difficulty: одно из "Easy", "Medium", "Hard" — насколько легко человек раскрывается в разговоре
- difficultyPrompt: одно предложение-инструкция для ролевой игры о его манере общения, соответствующей уровню сложности
- category.label: короткое название сферы/аудитории, 2-4 слова
- category.tagline: 3-5 слов через запятую с ключевыми болями
- trafficSource.label: короткое название источника трафика (например «Холодный аутрич», «Реферал от друга», «Платная реклама», «Органический поиск», «Вебинар»)
- trafficSource.prompt: одно предложение о его настрое в начале разговора, соответствующее источнику трафика
- openingLine: короткая реплика приветствия от первого лица (1-2 предложения) — то, что человек говорит, беря трубку/начиная разговор; не должна звучать как ответ на незаданный вопрос
- insights: ровно 3 строки — конкретные боли из проблемного пространства идеи, которые можно раскрыть в разговоре, каждая 2-4 слова

Отвечай только на русском языке.`

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    branch: { type: 'string', enum: ['b2b', 'b2c'] },
    name: { type: 'string' },
    role: { type: 'string' },
    description: { type: 'string' },
    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
    difficultyPrompt: { type: 'string' },
    category: {
      type: 'object',
      properties: {
        label: { type: 'string' },
        tagline: { type: 'string' },
      },
      required: ['label', 'tagline'],
    },
    trafficSource: {
      type: 'object',
      properties: {
        label: { type: 'string' },
        prompt: { type: 'string' },
      },
      required: ['label', 'prompt'],
    },
    openingLine: { type: 'string' },
    insights: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: [
    'branch',
    'name',
    'role',
    'description',
    'difficulty',
    'difficultyPrompt',
    'category',
    'trafficSource',
    'openingLine',
    'insights',
  ],
}

function slugify(text, index) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug || 'insight'}-${index}`
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

  const { idea } = req.body ?? {}
  if (!idea) {
    res.status(400).json({ error: 'idea is required' })
    return
  }

  try {
    const raw = await callGemini({
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [{ role: 'user', parts: [{ text: `Идея пользователя: ${idea}` }] }],
      responseSchema: RESPONSE_SCHEMA,
    })

    const parsed = JSON.parse(raw)

    const persona = {
      id: `custom-${Date.now()}`,
      branch: parsed.branch,
      category: parsed.category,
      name: parsed.name,
      role: parsed.role,
      description: parsed.description,
      difficulty: parsed.difficulty,
      difficultyPrompt: parsed.difficultyPrompt,
      trafficSource: parsed.trafficSource,
      openingLine: parsed.openingLine,
      insights: parsed.insights.map((label, i) => ({ id: slugify(label, i), label })),
    }

    res.status(200).json({ persona })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
