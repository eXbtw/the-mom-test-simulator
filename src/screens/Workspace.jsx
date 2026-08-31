import { useEffect, useState } from 'react'
import { Clock, EyeOff, Home } from 'lucide-react'
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
const TIMER_SECONDS = 10 * 60

let messageId = 0
const nextId = () => ++messageId

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Workspace({ persona, blindMode, onFinish, onExit }) {
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
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS)

  useEffect(() => {
    if (!started) return
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [started])

  const handleStart = () => {
    setMessages([{ id: nextId(), role: 'ai', text: persona.openingLine }])
    setStarted(true)
  }

  const handleSend = async (text) => {
    const history = messages.map((m) => ({ role: m.role, text: m.text }))
    const userMsgId = nextId()
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', text }])
    setIsThinking(true)

    try {
      const [result, reply] = await Promise.all([
        fetchEvaluation(text),
        fetchPersonaReply(persona, history, text),
      ])

      if (result) {
        setScore((prev) => Math.max(0, Math.min(100, prev + result.delta)))
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMsgId
              ? { ...m, evalType: result.type, evalWhy: result.message, evalSuggestion: result.suggestion }
              : m,
          ),
        )

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

  const handleExit = () => {
    if (started && !window.confirm('Выйти на главный экран? Прогресс интервью не сохранится.')) {
      return
    }
    onExit()
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
          <button
            type="button"
            onClick={handleExit}
            aria-label="На главный экран"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Home size={16} />
          </button>
          <PersonaAvatar categoryId={persona.category?.id} size="sm" />
          <div className="min-w-0">
            <h1 className="font-display text-base font-semibold text-gray-900 dark:text-gray-100 md:text-lg">
              The Mom Test Simulator
            </h1>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400 md:text-sm">
              {persona.role} · {persona.difficulty} · {persona.trafficSource.label}
              {blindMode && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <EyeOff size={10} />
                  Вслепую
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {started && (
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                secondsLeft === 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : secondsLeft <= 60
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <Clock size={12} />
              {secondsLeft === 0 ? 'Время вышло' : formatTime(secondsLeft)}
            </span>
          )}
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
          <aside className="flex shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:order-3 md:w-72 md:flex-col md:items-stretch md:gap-6 md:overflow-y-auto md:overflow-x-visible md:border-b-0 md:border-l md:bg-transparent md:p-6">
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
                className="rounded-lg bg-[#C6402F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A32F21]"
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
