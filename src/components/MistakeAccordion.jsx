import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function MistakeAccordion({ mistakes }) {
  const [openId, setOpenId] = useState(null)

  if (mistakes.length === 0) {
    return (
      <p className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
        Ошибок не найдено — все вопросы были открытыми и без давления. Отличная работа!
      </p>
    )
  }

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
      {mistakes.map((mistake) => {
        const isOpen = openId === mistake.id
        return (
          <div key={mistake.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : mistake.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">«{mistake.question}»</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-gray-400 transition-transform dark:text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="space-y-2 px-4 pb-4 text-sm">
                <p>
                  <span className="font-medium text-red-700 dark:text-red-400">Почему это ошибка: </span>
                  <span className="text-gray-600 dark:text-gray-400">{mistake.why}</span>
                </p>
                <p>
                  <span className="font-medium text-green-700 dark:text-green-400">Как надо было спросить: </span>
                  <span className="text-gray-600 dark:text-gray-400">{mistake.suggestion}</span>
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
