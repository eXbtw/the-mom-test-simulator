export default function InsightChips({ insights }) {
  return (
    <div className="flex flex-wrap gap-2">
      {insights.map((insight) => (
        <span
          key={insight.id}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            insight.revealed
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-400 border border-gray-200'
          }`}
        >
          {insight.label}
        </span>
      ))}
    </div>
  )
}
