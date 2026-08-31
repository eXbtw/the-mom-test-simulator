const STYLES = {
  leading_question: 'bg-[#FDF2EF] border-[#C6402F]/30 text-[#C6402F] dark:bg-gray-800 dark:border-[#FF5A42]/30 dark:text-[#FF5A42]',
  hypothetical: 'bg-[#FDF2EF] border-[#C6402F]/30 text-[#C6402F] dark:bg-gray-800 dark:border-[#FF5A42]/30 dark:text-[#FF5A42]',
  pitching: 'bg-[#FDF2EF] border-[#C6402F]/30 text-[#C6402F] dark:bg-gray-800 dark:border-[#FF5A42]/30 dark:text-[#FF5A42]',
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
