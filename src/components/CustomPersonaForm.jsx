import { useState } from 'react'
import { generatePersona } from '../services/aiClient'

export default function CustomPersonaForm({ branch, onGenerated }) {
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = description.trim()
    if (!trimmed || isLoading) return

    setIsLoading(true)
    setError(null)
    try {
      const persona = await generatePersona(branch, trimmed)
      onGenerated(persona)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm text-gray-600 dark:text-gray-400">
        Опишите сферу деятельности респондента
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Например: розничный магазин цветов, стоматологическая клиника, интернет-магазин косметики…"
          rows={3}
          disabled={isLoading}
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#C6402F] disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-[#FF5A42] dark:disabled:bg-gray-900"
        />
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">Не удалось сгенерировать: {error}</p>}

      <button
        type="submit"
        disabled={!description.trim() || isLoading}
        className="w-full rounded-lg bg-[#C6402F] py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A32F21] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
      >
        {isLoading ? 'Придумываю респондента…' : 'Сгенерировать респондента'}
      </button>
    </form>
  )
}
