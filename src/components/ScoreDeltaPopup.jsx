export default function ScoreDeltaPopup({ delta }) {
  if (!delta) return null

  const positive = delta.value > 0

  return (
    <span
      key={delta.id}
      className={`animate-score-float pointer-events-none absolute left-1/2 top-0 text-lg font-bold ${
        positive ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {positive ? `+${delta.value}` : delta.value}
    </span>
  )
}
