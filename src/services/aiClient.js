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

export async function fetchPersonaReply(persona, history, message) {
  const data = await postJson('/api/persona', { persona, history, message })
  return data.reply
}

export async function fetchEvaluation(message) {
  const data = await postJson('/api/evaluator', { message })
  return data.type === 'neutral' ? null : data
}
