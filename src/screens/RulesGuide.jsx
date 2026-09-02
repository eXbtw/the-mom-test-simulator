import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { RULES } from '../data/rules'

export default function RulesGuide({ onExit }) {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            aria-label="Назад"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
          </button>
          <Logo size="sm" />
          <ThemeToggle />
        </div>

        <h1 className="screen-title mb-1">Как читать реакции</h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Четыре типа вопросов, на которых строится оценка в этом тренажёре.
        </p>

        <blockquote className="mb-6 rounded-lg border border-[#C6402F]/25 bg-[#FDF2EF] px-5 py-4 dark:border-[#FF5A42]/25 dark:bg-gray-800">
          <p className="font-hand text-2xl leading-snug text-[#C6402F] dark:text-[#FF5A42]">
            «Вам соврут, если вы зададите плохой вопрос»
          </p>
          <cite className="mt-1 block text-xs not-italic text-gray-500 dark:text-gray-400">
            — Роб Фицпатрик, «Спроси маму»
          </cite>
        </blockquote>

        <div className="space-y-3 pb-4">
          {RULES.map((rule) => {
            const Icon = rule.icon
            const isGood = rule.id === 'good_question'
            return (
              <div
                key={rule.id}
                className="rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isGood
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-[#C6402F]/10 text-[#C6402F] dark:bg-[#FF5A42]/15 dark:text-[#FF5A42]'
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <h3 className="font-display text-sm font-bold text-gray-900 dark:text-gray-100">
                    {rule.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{rule.explanation}</p>
                <div className="mt-3 space-y-1.5 text-sm">
                  {rule.bad && (
                    <p className="rounded-lg bg-[#FDF2EF] px-3 py-2 text-[#C6402F] dark:bg-gray-900 dark:text-[#FF5A42]">
                      ✗ «{rule.bad}»
                    </p>
                  )}
                  <p className="rounded-lg bg-green-50 px-3 py-2 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    ✓ «{rule.good}»
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
