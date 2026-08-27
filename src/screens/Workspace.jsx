import { useState } from 'react'
import ChatPanel from '../components/ChatPanel'
import ScoreWidget from '../components/ScoreWidget'
import InsightChips from '../components/InsightChips'
import AlertBox from '../components/AlertBox'
import { evaluateMessage } from '../mock/evaluator'
import { getPersonaReply } from '../mock/persona'

const INITIAL_INSIGHTS = [
  { id: 'accident_downtime', label: 'Простои из-за ДТП' },
  { id: 'insurance_payouts', label: 'Страховые выплаты' },
  { id: 'driver_turnover', label: 'Текучка водителей' },
]

let messageId = 0
const nextId = () => ++messageId

export default function Workspace({ persona }) {
  const [messages, setMessages] = useState([
    {
      id: nextId(),
      role: 'ai',
      text: 'Здравствуйте! Да, управляю автопарком уже семь лет. Чем могу помочь?',
    },
  ])
  const [score, setScore] = useState(50)
  const [insights, setInsights] = useState(
    INITIAL_INSIGHTS.map((i) => ({ ...i, revealed: false })),
  )
  const [alert, setAlert] = useState(null)
  const [isThinking, setIsThinking] = useState(false)

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }])

    const result = evaluateMessage(text)

    if (result) {
      setScore((prev) => Math.max(0, Math.min(100, prev + result.delta)))
      setAlert({ type: result.type, message: result.message })
      setTimeout(() => setAlert(null), 4000)

      if (result.type === 'good_question') {
        setInsights((prev) => {
          const idx = prev.findIndex((i) => !i.revealed)
          if (idx === -1) return prev
          const next = [...prev]
          next[idx] = { ...next[idx], revealed: true }
          return next
        })
      }
    }

    setIsThinking(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'ai', text: getPersonaReply(result?.type) },
      ])
      setIsThinking(false)
    }, 700)
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-semibold text-gray-900">The Mom Test Simulator</h1>
        <p className="text-sm text-gray-500">
          {persona.role} · {persona.difficulty}
        </p>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 border-r border-gray-200 bg-white">
          <ChatPanel messages={messages} onSend={handleSend} isThinking={isThinking} />
        </section>

        <aside className="flex w-80 flex-col gap-6 overflow-y-auto p-6">
          <div className="flex justify-center rounded-xl border border-gray-200 bg-white py-6">
            <ScoreWidget score={score} />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Выявленные инсайты</h2>
            <InsightChips insights={insights} />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Подсказка аудитора</h2>
            <AlertBox alert={alert} />
          </div>
        </aside>
      </main>
    </div>
  )
}
