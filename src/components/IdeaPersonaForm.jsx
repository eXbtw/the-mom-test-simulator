import { useState } from 'react'
import { generateIdeaPersona } from '../services/aiClient'

export default function IdeaPersonaForm({ onGenerated }) {
  const [idea, setIdea] = useState('')
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
