import { callGemini } from './_gemini.js'

const SYSTEM_INSTRUCTION = `Ты помогаешь создавать профили вымышленных респондентов для тренажёра проблемных интервью по методологии The Mom Test (Роб Фицпатрик).

По краткому описанию сферы деятельности от пользователя и типу респондента (B2B — представитель бизнеса, B2C — частный пользователь) придумай одного правдоподобного человека на русском языке.

Требования к полям:
- name: правдоподобное русское имя (для B2C достаточно имени, для B2B — имя и фамилия)
- role: короткая должность/роль, одна строка
- description: 1-2 предложения о его основной боли/контексте — конкретно и приземлённо, без общих фраз
- difficulty: одно из "Easy", "Medium", "Hard" — насколько легко человек раскрывается в разговоре
- difficultyPrompt: одно предложение-инструкция для ролевой игры о его манере общения, соответствующей уровню сложности
- category.label: короткое название сферы, 2-4 слова
- category.tagline: 3-5 слов через запятую с ключевыми болями
- trafficSource.label: короткое название источника трафика (например «Холодный аутрич», «Реферал от друга», «Платная реклама», «Органический поиск», «Вебинар»)
- trafficSource.prompt: одно предложение о его настрое в начале разговора, соответствующее источнику трафика
- openingLine: короткая реплика приветствия от первого лица (1-2 предложения) — то, что человек говорит, беря трубку/начиная разговор; не должна звучать как ответ на незаданный вопрос
- insights: ровно 3 строки — конкретные боли, которые можно раскрыть в разговоре, каждая 2-4 слова

Отвечай только на русском языке.`

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
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

  const { branch, description } = req.body ?? {}
  if (!branch || !description) {
    res.status(400).json({ error: 'branch and description are required' })
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
              text: `Тип респондента: ${branch === 'b2b' ? 'B2B' : 'B2C'}\nСфера деятельности: ${description}`,
            },
          ],
        },
      ],
      responseSchema: RESPONSE_SCHEMA,
    })

    const parsed = JSON.parse(raw)

    const persona = {
      id: `custom-${Date.now()}`,
      branch,
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
