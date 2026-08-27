import { useState } from 'react'
import ChatPanel from '../components/ChatPanel'
import ScoreWidget from '../components/ScoreWidget'
import ScoreDeltaPopup from '../components/ScoreDeltaPopup'
import InsightChips from '../components/InsightChips'
import AlertBox from '../components/AlertBox'
import { fetchEvaluation, fetchPersonaReply } from '../services/aiClient'
import { gradeForScore } from '../utils/grading'

const MISTAKE_TYPES = new Set(['hypothetical', 'leading_question', 'pitching'])

let messageId = 0
const nextId = () => ++messageId

export default function Workspace({ persona, onFinish }) {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [score, setScore] = useState(50)
  const [scoreDelta, setScoreDelta] = useState(null)
  const [insights, setInsights] = useState(
    persona.insights.map((i) => ({ ...i, revealed: false })),
  )
  const [alert, setAlert] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [mistakes, setMistakes] = useState([])

  const handleStart = () => {
    setMessages([{ id: nextId(), role: 'ai', text: persona.openingLine }])
    setStarted(true)
  }

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
        setScoreDelta({ id: nextId(), value: result.delta })
        setTimeout(() => setScoreDelta(null), 1300)
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
    <div className="flex h-full w-full flex-col bg-gray-50">
      <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">The Mom Test Simulator</h1>
          <p className="text-sm text-gray-500">
            {persona.role} · {persona.difficulty} · {persona.trafficSource.label}
          </p>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          disabled={!started}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Завершить интервью
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 border-r border-gray-200 bg-white">
          {started ? (
            <ChatPanel messages={messages} onSend={handleSend} isThinking={isThinking} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="text-sm text-gray-500">
                Сейчас вы позвоните: <span className="font-medium text-gray-700">{persona.name}</span>
                , {persona.role.toLowerCase()}. Нажмите, чтобы начать разговор.
              </p>
              <button
                type="button"
                onClick={handleStart}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Начать интервью
              </button>
            </div>
          )}
        </section>

        <aside className="flex w-80 flex-col gap-6 overflow-y-auto p-6">
          <div className="relative flex justify-center rounded-xl border border-gray-200 bg-white py-6">
            <ScoreDeltaPopup delta={scoreDelta} />
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
