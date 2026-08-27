import { useState } from 'react'
import ChatPanel from '../components/ChatPanel'
import ScoreWidget from '../components/ScoreWidget'
import InsightChips from '../components/InsightChips'
import AlertBox from '../components/AlertBox'
import { fetchEvaluation, fetchPersonaReply } from '../services/aiClient'
import { gradeForScore } from '../utils/grading'

const MISTAKE_TYPES = new Set(['hypothetical', 'leading_question', 'pitching'])

let messageId = 0
const nextId = () => ++messageId

export default function Workspace({ persona, onFinish }) {
  const [messages, setMessages] = useState([
    { id: nextId(), role: 'ai', text: persona.openingLine },
  ])
  const [score, setScore] = useState(50)
  const [insights, setInsights] = useState(
    persona.insights.map((i) => ({ ...i, revealed: false })),
  )
  const [alert, setAlert] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [mistakes, setMistakes] = useState([])

  const handleSend = async (text) => {
    const history = messages.map((m) => ({ role: m.role, text: m.text }))
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }])
    setIsThinking(true)

    try {
      const [result, reply] = await Promise.all([
        fetchEvaluation(text),
        fetchPersonaReply(persona, history, text),
      ])

      if (result) {
        setScore((prev) => Math.max(0, Math.min(100, prev + result.delta)))
        setAlert({ type: result.type, message: result.message })
        setTimeout(() => setAlert(null), 4000)

        if (result.type === 'good_question') {
          setInsights((prev) => {
            const idx = prev.findIndex((i) => !i.revealed)
            if (idx === -1) return prev
            const next = [...prev]
            next[idx] = { ...next[idx], revealed: true }
            return next
          })
        }

        if (MISTAKE_TYPES.has(result.type)) {
          setMistakes((prev) => [
            ...prev,
            { id: nextId(), question: text, why: result.message, suggestion: result.suggestion },
          ])
        }
      }

      setMessages((prev) => [...prev, { id: nextId(), role: 'ai', text: reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'ai',
          text: `⚠️ Не удалось получить ответ (${err.message}). Проверьте API-ключ и повторите попытку.`,
        },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const handleFinish = () => {
    onFinish({
      score,
      grade: gradeForScore(score),
      mistakes,
      insightsRevealed: insights.filter((i) => i.revealed).length,
      insightsTotal: insights.length,
    })
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">The Mom Test Simulator</h1>
          <p className="text-sm text-gray-500">
            {persona.role} · {persona.difficulty} · {persona.trafficSource.label}
          </p>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Завершить интервью
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 border-r border-gray-200 bg-white">
          <ChatPanel messages={messages} onSend={handleSend} isThinking={isThinking} />
        </section>

        <aside className="flex w-80 flex-col gap-6 overflow-y-auto p-6">
          <div className="flex justify-center rounded-xl border border-gray-200 bg-white py-6">
            <ScoreWidget score={score} />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Выявленные инсайты</h2>
            <InsightChips insights={insights} />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Подсказка аудитора</h2>
            <AlertBox alert={alert} />
          </div>
        </aside>
      </main>
    </div>
  )
}
