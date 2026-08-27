const DIFFICULTY_STYLES = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
}

export default function PersonaCard({ persona, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(persona.id)}
      className={`w-full rounded-xl border p-5 text-left transition-colors ${
        selected
          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{persona.name}</h3>
          <p className="text-sm text-gray-600">{persona.role}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            DIFFICULTY_STYLES[persona.difficulty] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {persona.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm text-gray-500">{persona.description}</p>
    </button>
  )
}
