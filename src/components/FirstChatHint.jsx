import { Lightbulb, X } from 'lucide-react'

const TIPS = [
  'Спрашивайте про реальный прошлый опыт, а не мнения о будущем',
  'Не предлагайте решение — сначала поймите проблему целиком',
]

export default function FirstChatHint({ onDismiss }) {
  return (
    <div className="animate-hero-in mx-4 mt-3 flex items-start gap-3 rounded-lg border border-[#C6402F]/25 bg-[#FDF2EF] p-3 dark:border-[#FF5A42]/25 dark:bg-gray-800">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C6402F]/10 text-[#C6402F] dark:bg-[#FF5A42]/15 dark:text-[#FF5A42]">
        <Lightbulb size={15} />
      </span>
      <ul className="min-w-0 flex-1 space-y-1">
        {TIPS.map((tip) => (
          <li key={tip} className="text-xs leading-snug text-gray-600 dark:text-gray-400">
            {tip}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Скрыть подсказку"
        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X size={15} />
      </button>
    </div>
  )
}
