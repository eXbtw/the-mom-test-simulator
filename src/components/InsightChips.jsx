export default function InsightChips({ insights }) {
  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
      {insights.map((insight) => (
        <span
          key={insight.id}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            insight.revealed
              ? 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
              : 'bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
          }`}
        >
          {insight.label}
        </span>
      ))}
    </div>
  )
}
