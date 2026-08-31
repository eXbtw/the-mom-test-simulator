import { useState } from 'react'
import { ArrowLeft, EyeOff, Trash2 } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { clearHistory, getHistory } from '../utils/storage'
import { computeAchievements, computeStreak } from '../utils/achievements'

function scoreColor(score) {
  if (score >= 70) return 'text-green-600 dark:text-green-400'
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SessionHistory({ onExit }) {
  const [history, setHistory] = useState(() => getHistory())

  const handleClear = () => {
    if (!window.confirm('Удалить всю историю интервью? Это необратимо.')) return
    clearHistory()
    setHistory([])
  }

  const avgScore = history.length
    ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
    : 0
  const bestScore = history.length ? Math.max(...history.map((h) => h.score)) : 0
  const streak = computeStreak(history)
  const achievements = computeAchievements(history)

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

        <h1 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
          История интервью
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Хранится локально в этом браузере — не синхронизируется между устройствами.
        </p>

        {history.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Пока пусто — пройдите первое интервью, и оно появится здесь.
          </p>
        ) : (
          <>
            <div className="mb-3 grid grid-cols-4 gap-1.5">
              <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="font-display text-lg font-bold text-gray-900 dark:text-gray-100">
                  {history.length}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">интервью</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="font-display text-lg font-bold text-gray-900 dark:text-gray-100">{avgScore}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">средний</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="font-display text-lg font-bold text-gray-900 dark:text-gray-100">{bestScore}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">лучший</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="font-display text-lg font-bold text-gray-900 dark:text-gray-100">{streak}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">подряд ≥60</p>
              </div>
            </div>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {achievements.map((a) => {
                const Icon = a.icon
                return (
                  <div
                    key={a.id}
                    title={a.label}
                    className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 text-center ${
                      a.unlocked
                        ? 'border-[#C6402F]/25 bg-[#FDF2EF] dark:border-[#FF5A42]/25 dark:bg-gray-800'
                        : 'border-gray-200 bg-gray-50 opacity-40 dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={a.unlocked ? 'text-[#C6402F] dark:text-[#FF5A42]' : 'text-gray-400'}
                    />
                    <span className="max-w-[70px] text-[10px] leading-tight text-gray-600 dark:text-gray-400">
                      {a.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pb-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {entry.personaName}
                      {entry.blindMode && <EyeOff size={12} className="shrink-0 text-gray-400" />}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {entry.categoryLabel ?? entry.personaRole} · {formatDate(entry.date)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-display text-base font-bold ${scoreColor(entry.score)}`}>
                      {entry.score}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{entry.grade}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="mt-4 flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Trash2 size={13} />
              Очистить историю
            </button>
          </>
        )}
      </div>
    </div>
  )
}
