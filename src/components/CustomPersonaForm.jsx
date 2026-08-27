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
      <label className="block text-sm text-gray-600">
        Опишите сферу деятельности респондента
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Например: розничный магазин цветов, стоматологическая клиника, интернет-магазин косметики…"
          rows={3}
          disabled={isLoading}
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 disabled:bg-gray-50"
        />
      </label>

      {error && <p className="text-sm text-red-600">Не удалось сгенерировать: {error}</p>}

      <button
        type="submit"
        disabled={!description.trim() || isLoading}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Придумываю респондента…' : 'Сгенерировать респондента'}
      </button>
    </form>
  )
}
