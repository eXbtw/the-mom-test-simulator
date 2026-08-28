import PersonaAvatar from './PersonaAvatar'

const DIFFICULTY_STYLES = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export default function PersonaCard({ persona }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 text-left dark:border-[#3A3226] dark:bg-[#211C15]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PersonaAvatar categoryId={persona.category?.id} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{persona.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{persona.role}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            DIFFICULTY_STYLES[persona.difficulty] ?? 'bg-gray-100 text-gray-600 dark:bg-[#2A2318] dark:text-gray-300'
          }`}
        >
          {persona.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{persona.description}</p>
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-[#3A3226] dark:text-gray-400">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600 dark:bg-[#2A2318] dark:text-gray-300">
          Источник: {persona.trafficSource.label}
        </span>
      </div>
    </div>
  )
}
