import { useState } from 'react'
import ChatPanel from '../components/ChatPanel'
import ScoreWidget from '../components/ScoreWidget'
import ScoreDeltaPopup from '../components/ScoreDeltaPopup'
import InsightChips from '../components/InsightChips'
import AlertBox from '../components/AlertBox'
import PersonaAvatar from '../components/PersonaAvatar'
import PersonaContextPanel from '../components/PersonaContextPanel'
import ThemeToggle from '../components/ThemeToggle'
import { fetchEvaluation, fetchPersonaReply } from '../services/aiClient'
import { gradeForScore } from '../utils/grading'

const MISTAKE_TYPES = new Set(['hypothetical', 'leading_question', 'pitching'])

let messageId = 0
const nextId = () => ++messageId

export default function Workspace({ persona, blindMode, onFinish }) {
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

        if (!blindMode) {
          setScoreDelta({ id: nextId(), value: result.delta })
          setTimeout(() => setScoreDelta(null), 1300)
          setAlert({ type: result.type, message: result.message })
          setTimeout(() => setAlert(null), 4000)
        }

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
      insights,
      insightsRevealed: insights.filter((i) => i.revealed).length,
      insightsTotal: insights.length,
      messages,
      blindMode,
    })
  }

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900 md:px-6 md:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <PersonaAvatar categoryId={persona.category?.id} size="sm" />
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 md:text-lg">
              The Mom Test Simulator
            </h1>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400 md:text-sm">
              {persona.role} · {persona.difficulty} · {persona.trafficSource.label}
              {blindMode && (
                <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  🙈 Вслепую
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleFinish}
            disabled={!started}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 md:px-3 md:text-sm"
          >
            Завершить интервью
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <PersonaContextPanel persona={persona} />

        {!blindMode && (
          <aside className="flex shrink-0 items-center gap-4 overflow-x-auto border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:order-3 md:w-72 md:flex-col md:items-stretch md:gap-6 md:overflow-y-auto md:overflow-x-visible md:border-b-0 md:border-l md:bg-transparent md:p-6">
            <div className="relative flex shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900 md:w-full md:flex-col md:px-0 md:py-6">
              <ScoreDeltaPopup delta={scoreDelta} />
              <ScoreWidget score={score} />
            </div>

            <div className="min-w-0 flex-1 md:flex-none">
              <h2 className="mb-2 hidden text-sm font-semibold text-gray-700 dark:text-gray-300 md:block">
                Выявленные инсайты
              </h2>
              <InsightChips insights={insights} />
            </div>

            <div className="hidden md:block">
              <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Подсказка аудитора
              </h2>
              <AlertBox alert={alert} />
            </div>
          </aside>
        )}

        <section className="relative min-h-0 flex-1 bg-white dark:bg-gray-900 md:order-2">
          {!blindMode && (
            <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center px-4 md:hidden">
              <div className="pointer-events-auto w-full max-w-sm">
                <AlertBox alert={alert} />
              </div>
            </div>
          )}

          {started ? (
            <ChatPanel messages={messages} onSend={handleSend} isThinking={isThinking} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Сейчас вы позвоните:{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">{persona.name}</span>,{' '}
                {persona.role.toLowerCase()}. Нажмите, чтобы начать разговор.
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
      </main>
    </div>
  )
}
