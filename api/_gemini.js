// Ordered by preference: full "Flash" models before "Flash Lite" ones,
// newest first within each tier. Each Gemini model has its own separate
// daily quota, so when one is exhausted (or briefly unavailable) callGemini
// falls through to the next one automatically instead of failing the request.
const MODEL_FALLBACKS = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-2.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
]

function endpointFor(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
}

function isAuthError(status) {
  // Wrong/missing API key — identical failure on every model, no point retrying.
  return status === 401 || status === 403
}

export async function callGemini({ systemInstruction, contents, responseSchema }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const body = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
      thinkingConfig: { thinkingLevel: 'low' },
      ...(responseSchema
        ? { responseMimeType: 'application/json', responseSchema }
        : {}),
    },
  }

  let lastError = null

  for (const model of MODEL_FALLBACKS) {
    let res
    try {
      res = await fetch(`${endpointFor(model)}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch (err) {
      lastError = err
      continue
    }

    if (res.ok) {
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (typeof text === 'string') return text
      lastError = new Error(`${model} returned no text`)
      continue
    }

    const errText = await res.text()
    lastError = new Error(`Gemini API error ${res.status} (${model}): ${errText}`)

    if (isAuthError(res.status)) {
      throw lastError
    }
    // quota exhausted (429), model retired/unavailable (404/503), or a
    // param this specific model doesn't like (400) — try the next model.
  }

  throw lastError ?? new Error('All Gemini model fallbacks failed')
}
