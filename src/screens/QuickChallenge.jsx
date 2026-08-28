import { useEffect, useState } from 'react'
import { ArrowLeft, Zap } from 'lucide-react'
import { fetchChallenge, fetchChallengeFeedback } from '../services/aiClient'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function QuickChallenge({ onExit }) {
  const [phase, setPhase] = useState('loading')
  const [fragment, setFragment] = useState(null)
  const [response, setResponse] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)

  const loadFragment = async () => {
    setPhase('loading')
    setError(null)
    try {
      const data = await fetchChallenge()
      setFragment(data)
      setPhase('answering')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  useEffect(() => {
    loadFragment()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = response.trim()
    if (!trimmed) return

    setPhase('submitting')
    try {
      const result = await fetchChallengeFeedback(fragment, trimmed)
      setFeedback(result)
      setPhase('result')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  const handleRetry = () => {
    setResponse('')
    setFeedback(null)
    loadFragment()
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            aria-label="Назад"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
          </button>
          <Logo size="sm" />
          <ThemeToggle />
        </div>

        <h1 className="mb-1 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          <Zap size={20} className="text-[#C6402F] dark:text-[#FF5A42]" />
          Задача дня
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Прочитайте реплику и напишите вопрос, который раскроет реальную проблему.
        </p>

        {phase === 'loading' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Придумываю фрагмент диалога…</p>
        )}

        {phase === 'error' && (
          <div className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400">Не удалось загрузить: {error}</p>
            <button
              type="button"
              onClick={loadFragment}
              className="rounded-lg bg-[#C6402F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#A32F21]"
            >
              Повторить
            </button>
          </div>
        )}

        {(phase === 'answering' || phase === 'submitting') && fragment && (
          <>
            <div className="animate-take-fade-in rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {fragment.speaker}
              </p>
              <p className="mt-2 text-base text-gray-900 dark:text-gray-100">«{fragment.line}»</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Ваш вопрос в ответ…"
                rows={3}
                disabled={phase === 'submitting'}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#C6402F] disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-[#FF5A42] dark:disabled:bg-gray-900"
              />
              <button
                type="submit"
                disabled={!response.trim() || phase === 'submitting'}
                className="w-full rounded-lg bg-[#C6402F] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A32F21] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {phase === 'submitting' ? 'Оцениваю…' : 'Отправить ответ'}
              </button>
            </form>
          </>
        )}

        {phase === 'result' && feedback && (
          <div className="animate-take-fade-in space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="font-display text-4xl font-bold text-gray-900 dark:text-gray-100">
                {feedback.score}/100
              </p>
              <p className="mt-1 text-sm font-semibold text-[#C6402F] dark:text-[#FF5A42]">
                {feedback.verdict}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-green-700 dark:text-green-400">Что хорошо: </span>
                <span className="text-gray-600 dark:text-gray-400">{feedback.praise}</span>
              </p>
              <p>
                <span className="font-medium text-[#C6402F] dark:text-[#FF5A42]">Совет: </span>
                <span className="text-gray-600 dark:text-gray-400">{feedback.tip}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Ещё раз
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 rounded-lg bg-[#C6402F] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A32F21]"
              >
                На главный экран
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
