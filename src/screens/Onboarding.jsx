import { useState } from 'react'
import { PERSONAS } from '../data/personas'
import PersonaCard from '../components/PersonaCard'

export default function Onboarding({ onStart }) {
  const [selectedId, setSelectedId] = useState(PERSONAS[0]?.id ?? null)
  const selectedPersona = PERSONAS.find((p) => p.id === selectedId)

  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col justify-center px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">The Mom Test Simulator</h1>
        <p className="mt-2 text-sm text-gray-500">
          Потренируйте проблемные интервью на AI-персоне и получите разбор ошибок
          по методологии «Спроси маму».
        </p>
      </header>

      <div className="space-y-3">
        {PERSONAS.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            selected={persona.id === selectedId}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!selectedPersona}
        onClick={() => selectedPersona && onStart(selectedPersona)}
        className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Начать интервью
      </button>
    </div>
  )
}
