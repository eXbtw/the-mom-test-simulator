const DIFFICULTY_STYLES = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
}

export default function PersonaCard({ persona }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 text-left">
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
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
          Источник: {persona.trafficSource.label}
        </span>
      </div>
    </div>
  )
}
