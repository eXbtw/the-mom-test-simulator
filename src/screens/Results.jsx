import MistakeAccordion from '../components/MistakeAccordion'

export default function Results({ result, onRestart }) {
  const { score, grade, mistakes, insightsRevealed, insightsTotal } = result

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-6 py-8">
      <header className="mb-6 shrink-0 text-center">
        <p className="text-sm text-gray-500">Итоги сессии</p>
        <h1 className="mt-1 text-3xl font-semibold text-gray-900">
          {score}/100 · {grade}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Раскрыто инсайтов: {insightsRevealed} из {insightsTotal}
        </p>
      </header>

      <section className="flex-1 overflow-y-auto">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Разбор ошибок</h2>
        <MistakeAccordion mistakes={mistakes} />
      </section>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 w-full shrink-0 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Попробовать снова
      </button>
    </div>
  )
}
