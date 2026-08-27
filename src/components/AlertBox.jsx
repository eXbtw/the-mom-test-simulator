const STYLES = {
  leading_question: 'bg-red-50 border-red-300 text-red-700',
  hypothetical: 'bg-red-50 border-red-300 text-red-700',
  pitching: 'bg-red-50 border-red-300 text-red-700',
  good_question: 'bg-green-50 border-green-300 text-green-700',
}

export default function AlertBox({ alert }) {
  if (!alert) return null

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm ${STYLES[alert.type] ?? 'bg-gray-50 border-gray-300 text-gray-700'}`}
    >
      {alert.message}
    </div>
  )
}
