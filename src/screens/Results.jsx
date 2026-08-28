import { useState } from 'react'
import { BookOpen, Copy, Download, Printer } from 'lucide-react'
import MistakeAccordion from '../components/MistakeAccordion'
import ThemeToggle from '../components/ThemeToggle'
import PrintableReport from '../components/PrintableReport'
import { buildMarkdownReport, downloadTextFile } from '../utils/report'

export default function Results({ result, persona, onRestart, onShowRules }) {
  const { score, grade, mistakes, insightsRevealed, insightsTotal, blindMode } = result
  const [copied, setCopied] = useState(false)

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
        <div className="mb-2 flex shrink-0 justify-end">
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
        </header>

        <section className="flex-1 overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Разбор ошибок</h2>
            <button
              type="button"
              onClick={onShowRules}
              className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-[#C6402F] dark:text-gray-500 dark:hover:text-[#FF5A42]"
            >
              <BookOpen size={12} />
              Освежить правила
            </button>
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
