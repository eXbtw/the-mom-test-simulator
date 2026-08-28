export function buildMarkdownReport({ persona, result }) {
  const { score, grade, mistakes, insights, messages } = result
  const revealedCount = insights.filter((i) => i.revealed).length

  const lines = []

  lines.push('# Отчёт The Mom Test Simulator')
  lines.push('')
  lines.push(`**Респондент:** ${persona.name} — ${persona.role}`)
  lines.push(`**Дата:** ${new Date().toLocaleDateString('ru-RU')}`)
  lines.push(`**Итоговый счёт:** ${score}/100 · ${grade}`)
  lines.push('')

  lines.push(`## Выявленные боли (${revealedCount} из ${insights.length})`)
  insights.forEach((i) => lines.push(`- ${i.revealed ? '✅' : '⬜'} ${i.label}`))
  lines.push('')

  lines.push('## Разбор ошибок')
  if (mistakes.length === 0) {
    lines.push('Ошибок не найдено — все вопросы были открытыми и без давления.')
  } else {
    mistakes.forEach((m) => {
      lines.push(`### «${m.question}»`)
      lines.push(`- **Почему это ошибка:** ${m.why}`)
      lines.push(`- **Как надо было спросить:** ${m.suggestion}`)
      lines.push('')
    })
  }
  lines.push('')

  lines.push('## Транскрипт разговора')
  messages.forEach((m) => {
    lines.push(`**${m.role === 'user' ? 'Вы' : persona.name}:** ${m.text}`)
    lines.push('')
  })

  return lines.join('\n')
}

export function downloadTextFile(filename, content, mimeType = 'text/markdown') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
