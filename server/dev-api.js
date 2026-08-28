// Minimal local stand-in for Vercel's serverless runtime. Reuses the same
// handler modules from /api so `npm run dev:api` behaves like production
// without depending on `vercel dev` (which has proven flaky with newer
// Vite/Node combos). Deployment on Vercel itself doesn't use this file.
import http from 'node:http'
import personaHandler from '../api/persona.js'
import evaluatorHandler from '../api/evaluator.js'
import personaBuilderHandler from '../api/persona-builder.js'
import challengeHandler from '../api/challenge.js'
import challengeFeedbackHandler from '../api/challenge-feedback.js'

const ROUTES = {
  '/api/persona': personaHandler,
  '/api/evaluator': evaluatorHandler,
  '/api/persona-builder': personaBuilderHandler,
  '/api/challenge': challengeHandler,
  '/api/challenge-feedback': challengeFeedbackHandler,
}

function addResponseHelpers(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }
}

const server = http.createServer((req, res) => {
  const handler = ROUTES[req.url]
  if (!handler) {
    res.statusCode = 404
    res.end('Not found')
    return
  }

  let raw = ''
  req.on('data', (chunk) => {
    raw += chunk
  })
  req.on('end', async () => {
    try {
      req.body = raw ? JSON.parse(raw) : {}
    } catch {
      req.body = {}
    }
    addResponseHelpers(res)
    try {
      await handler(req, res)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })
})

const PORT = process.env.API_PORT || 8787
server.listen(PORT, () => {
  console.log(`Local API dev server listening on http://localhost:${PORT}`)
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set — requests to /api/* will fail.')
  }
})
