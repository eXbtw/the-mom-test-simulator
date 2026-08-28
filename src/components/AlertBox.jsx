const STYLES = {
  leading_question: 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300',
  hypothetical: 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300',
  pitching: 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300',
  good_question: 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300',
}

export default function AlertBox({ alert }) {
  if (!alert) return null

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm shadow-sm ${STYLES[alert.type] ?? 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}
    >
      {alert.message}
    </div>
  )
}
