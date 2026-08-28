import PersonaAvatar from './PersonaAvatar'

export default function PersonaContextPanel({ persona }) {
  return (
    <div className="hidden w-64 shrink-0 flex-col gap-4 overflow-y-auto border-r border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950/40 md:flex">
      <PersonaAvatar categoryId={persona.category?.id} size="lg" />

      <div>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">{persona.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{persona.role}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {persona.difficulty}
        </span>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {persona.trafficSource.label}
        </span>
      </div>

      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Контекст
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{persona.description}</p>
      </div>

      {persona.category?.label && (
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Сфера
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{persona.category.label}</p>
        </div>
      )}
    </div>
  )
}
