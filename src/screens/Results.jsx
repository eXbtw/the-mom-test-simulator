import { useState } from 'react'
import { BookOpen, Copy, Download, History, Home, Printer } from 'lucide-react'
import MistakeAccordion from '../components/MistakeAccordion'
import ThemeToggle from '../components/ThemeToggle'
import PrintableReport from '../components/PrintableReport'
import { buildMarkdownReport, downloadTextFile } from '../utils/report'
import { getHistory } from '../utils/storage'

export default function Results({ result, persona, onRestart, onShowRules, onShowHistory }) {
  const { score, grade, mistakes, insightsRevealed, insightsTotal, blindMode, newAchievements } = result
  const [copied, setCopied] = useState(false)

  const sameRespondent = getHistory().filter((h) => h.personaId === persona.id)
  const previousAttempt = sameRespondent[1]
  const delta = previousAttempt ? score - previousAttempt.score : null

  const handleCopy = async () => {
    const markdown = buildMarkdownReport({ persona, result })
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const markdown = buildMarkdownReport({ persona, result })
    downloadTextFile(`the-mom-test-${persona.id}.md`, markdown)
  }

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-6 py-8 print:hidden">
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={onRestart}
            aria-label="На главный экран"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Home size={16} />
          </button>
          <ThemeToggle />
        </div>

        <header className="mb-6 shrink-0 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Итоги сессии
            {blindMode && (
              <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                🙈 Пройдено вслепую
              </span>
            )}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {score}/100 · {grade}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Раскрыто инсайтов: {insightsRevealed} из {insightsTotal}
          </p>
          {previousAttempt && (
            <p
              className={`mt-1 text-sm font-medium ${
                delta > 0
                  ? 'text-green-600 dark:text-green-400'
                  : delta < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {delta > 0 ? '↑' : delta < 0 ? '↓' : '='} {delta > 0 ? `+${delta}` : delta} к прошлой попытке
              с {persona.name}
            </p>
          )}
        </header>

        {newAchievements?.length > 0 && (
          <div className="animate-take-fade-in mb-6 shrink-0 rounded-xl border border-[#C6402F]/25 bg-[#FDF2EF] p-3 text-center dark:border-[#FF5A42]/25 dark:bg-gray-800">
            <p className="text-sm font-semibold text-[#C6402F] dark:text-[#FF5A42]">
              🎉 Новое достижение{newAchievements.length > 1 ? 'я' : ''}!
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {newAchievements.map((a) => (
                <div key={a.id} className="flex flex-col items-center gap-1">
                  <span className="text-2xl leading-none">{a.icon}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="flex-1 overflow-y-auto">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Разбор ошибок</h2>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={onShowRules}
                className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-[#C6402F] dark:text-gray-500 dark:hover:text-[#FF5A42]"
              >
                <BookOpen size={12} />
                Правила
              </button>
              <button
                type="button"
                onClick={onShowHistory}
                className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-[#C6402F] dark:text-gray-500 dark:hover:text-[#FF5A42]"
              >
                <History size={12} />
                История
              </button>
            </div>
          </div>
          <MistakeAccordion mistakes={mistakes} />

          <h2 className="mb-3 mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Экспорт отчёта
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Copy size={14} />
              {copied ? 'Скопировано!' : 'Copy as Notion Page'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Download size={14} />
              Скачать .md
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Printer size={14} />
              Сохранить как PDF
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 w-full shrink-0 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>

      <PrintableReport persona={persona} result={result} />
    </>
  )
}
