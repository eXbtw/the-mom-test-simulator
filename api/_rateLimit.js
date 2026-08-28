// Cheap first line of defense against API abuse: an in-memory sliding
// window per IP, shared across all AI endpoints. Resets on cold start and
// doesn't share state across concurrent instances — good enough to stop a
// script hammering the free Gemini quota, not a substitute for real infra.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 30

const hits = new Map()

export function checkRateLimit(ip) {
  const now = Date.now()
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  timestamps.push(now)
  hits.set(ip, timestamps)

  if (hits.size > 5000) {
    for (const [key, arr] of hits) {
      if (arr.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }

  return timestamps.length <= MAX_REQUESTS
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress ?? 'unknown'
}
