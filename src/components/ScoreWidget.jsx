const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function colorForScore(score) {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

export default function ScoreWidget({ score }) {
  const clamped = Math.max(0, Math.min(100, score))
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE
  const color = colorForScore(clamped)

  return (
    <div className="flex flex-col items-center gap-1 md:gap-2">
      <svg viewBox="0 0 120 120" className="h-14 w-14 -rotate-90 md:h-[120px] md:w-[120px]">
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 origin-center fill-gray-900 font-display text-2xl font-bold dark:fill-gray-100"
        >
          {clamped}
        </text>
      </svg>
      <span className="hidden text-sm text-gray-500 dark:text-gray-400 md:block">Счёт</span>
    </div>
  )
}
