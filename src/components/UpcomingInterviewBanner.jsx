import { CalendarClock, X } from 'lucide-react'

function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dateStr}T00:00:00`)
  return Math.round((target - today) / 86400000)
}

export default function UpcomingInterviewBanner({ record, tips = [], onPractice, onDismiss }) {
  const days = daysUntil(record.date)
  const isPast = days < 0

  let label
  if (days > 1) label = `Интервью с клиентом через ${days} дн.`
  else if (days === 1) label = 'Интервью с клиентом завтра'
  else if (days === 0) label = 'Интервью с клиентом сегодня'
  else label = 'Как прошло интервью с клиентом?'

  return (
    <div className="animate-hero-in mb-4 flex items-start gap-3 rounded-lg border border-[#C6402F]/25 bg-[#FDF2EF] p-3 dark:border-[#FF5A42]/25 dark:bg-gray-800">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C6402F]/10 text-[#C6402F] dark:bg-[#FF5A42]/15 dark:text-[#FF5A42]">
        <CalendarClock size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-gray-900 dark:text-gray-100">{label}</p>
        {!isPast && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Потренируйтесь ещё раз перед разговором
          </p>
        )}
        {!isPast && tips.length > 0 && (
          <ul className="mt-1.5 space-y-0.5">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-gray-500 dark:text-gray-400">
                · {tip}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="button"
        onClick={isPast ? onDismiss : onPractice}
        className="shrink-0 rounded-lg bg-[#C6402F] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A32F21] hover:shadow-lg active:translate-y-0"
      >
        {isPast ? 'Готово' : 'Потренироваться'}
      </button>
      {!isPast && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Скрыть напоминание"
          className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
