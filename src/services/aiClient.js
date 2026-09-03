async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error ?? `Request to ${url} failed`)
  }
  return data
}

export async function fetchPersonaReply(persona, history, message, trust, moodId) {
  const data = await postJson('/api/persona', { persona, history, message, trust, moodId })
  return data.reply
}

export async function fetchEvaluation(message) {
  const data = await postJson('/api/evaluator', { message })
  return data.type === 'neutral' ? null : data
}

export async function generatePersona(branch, description) {
  const data = await postJson('/api/persona-builder', { branch, description })
  return data.persona
}

export async function fetchChallenge() {
  return postJson('/api/challenge', {})
}

export async function fetchChallengeFeedback(fragment, response) {
  return postJson('/api/challenge-feedback', {
    speaker: fragment.speaker,
    line: fragment.line,
    response,
  })
}

export async function generateIdeaPersona(idea) {
  const data = await postJson('/api/idea-persona', { idea })
  return data.persona
}
