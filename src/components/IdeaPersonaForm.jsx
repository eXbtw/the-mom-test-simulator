import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { generateIdeaPersona } from '../services/aiClient'
import { setUpcomingInterview } from '../utils/storage'

export default function IdeaPersonaForm({ initialIdea = '', onGenerated }) {
  const [idea, setIdea] = useState(initialIdea)
  const [interviewDate, setInterviewDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = idea.trim()
    if (!trimmed || isLoading) return

    setIsLoading(true)
    setError(null)
    try {
      const persona = await generateIdeaPersona(trimmed)
      if (interviewDate) {
        setUpcomingInterview({ date: interviewDate, idea: trimmed, personaId: persona.id })
      }
      onGenerated(persona)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Опишите свой реальный продукт или идею — AI подберёт архетип целевой аудитории и
        сгенерирует респондента с болью из этого проблемного пространства. Респондент не будет
        знать о вашем решении, только о своей проблеме.
      </p>
      <label className="block text-sm text-gray-600 dark:text-gray-400">
        Ваша идея
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Например: приложение для трекинга привычек с геймификацией для подростков…"
          rows={4}
          disabled={isLoading}
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#C6402F] disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-[#FF5A42] dark:disabled:bg-gray-900"
        />
      </label>

      <label className="block text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <CalendarClock size={14} />
          Когда реальное интервью? (необязательно)
        </span>
        <input
          type="date"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          disabled={isLoading}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#C6402F] disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-[#FF5A42] dark:disabled:bg-gray-900"
        />
        <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
          Напомним потренироваться ещё раз, когда снова откроете тренажёр
        </span>
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">Не удалось сгенерировать: {error}</p>}

      <button
        type="submit"
        disabled={!idea.trim() || isLoading}
        className="w-full rounded-lg bg-[#C6402F] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A32F21] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Подбираю респондента…' : 'Найти респондента под мою идею'}
      </button>
    </form>
  )
}
