// Only rendered on paper: `hidden print:block` keeps it out of the normal
// UI and out of the AppShell's fixed-height/overflow-hidden card, which
// print: overrides on AppShell neutralize during printing.
export default function PrintableReport({ persona, result }) {
  const { score, grade, mistakes, insights, messages } = result
  const revealedCount = insights.filter((i) => i.revealed).length

  return (
    <div className="hidden bg-white p-10 text-black print:block">
      <h1 className="text-2xl font-bold">Отчёт The Mom Test Simulator</h1>
      <p className="mt-2 text-sm">
        <strong>Респондент:</strong> {persona.name} — {persona.role}
        <br />
        <strong>Дата:</strong> {new Date().toLocaleDateString('ru-RU')}
        <br />
        <strong>Итоговый счёт:</strong> {score}/100 · {grade}
      </p>

      <h2 className="mt-6 text-lg font-semibold">
        Выявленные боли ({revealedCount} из {insights.length})
      </h2>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {insights.map((i) => (
          <li key={i.id}>
            {i.revealed ? '✅' : '⬜'} {i.label}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-lg font-semibold">Разбор ошибок</h2>
      {mistakes.length === 0 ? (
        <p className="mt-2 text-sm">Ошибок не найдено — все вопросы были открытыми и без давления.</p>
      ) : (
        <div className="mt-2 space-y-3 text-sm">
          {mistakes.map((m) => (
            <div key={m.id} className="break-inside-avoid">
              <p className="font-medium">«{m.question}»</p>
              <p>
                <strong>Почему это ошибка:</strong> {m.why}
              </p>
              <p>
                <strong>Как надо было спросить:</strong> {m.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-6 text-lg font-semibold">Транскрипт разговора</h2>
      <div className="mt-2 space-y-2 text-sm">
        {messages.map((m) => (
          <p key={m.id} className="break-inside-avoid">
            <strong>{m.role === 'user' ? 'Вы' : persona.name}:</strong> {m.text}
          </p>
        ))}
      </div>
    </div>
  )
}
