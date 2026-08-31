import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const TYPE_STYLES = {
  leading_question: 'border-l-4 border-red-400 dark:border-red-500',
  hypothetical: 'border-l-4 border-yellow-400 dark:border-yellow-500',
  pitching: 'border-l-4 border-red-400 dark:border-red-500',
  good_question: 'border-l-4 border-green-400 dark:border-green-500',
}

const TYPE_LABELS = {
  leading_question: 'Наводящий вопрос',
  hypothetical: 'Вопрос о будущем',
  pitching: 'Питчинг решения',
  good_question: 'Хороший вопрос',
}

export default function TranscriptReplay({ entry, onBack }) {
  const [openId, setOpenId] = useState(null)
  const transcript = entry.transcript ?? []

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {entry.personaName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Счёт {entry.score} · {entry.grade}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {transcript.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Транскрипт для этой сессии недоступен.
          </p>
        )}

        {transcript.map((m) => {
          if (m.role !== 'user') {
            return (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-[#C6402F] px-4 py-2 text-sm text-white">
                  {m.text}
                </div>
              </div>
            )
          }

          const hasEval = Boolean(m.evalType && TYPE_STYLES[m.evalType])
          const isOpen = openId === m.id

          return (
            <div key={m.id} className="flex flex-col items-end">
              <button
                type="button"
                onClick={() => hasEval && setOpenId(isOpen ? null : m.id)}
                className={`max-w-[75%] rounded-2xl rounded-br-sm bg-gray-200 px-4 py-2 text-left text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100 ${
                  hasEval ? TYPE_STYLES[m.evalType] : ''
                }`}
              >
                {m.text}
              </button>
              {isOpen && hasEval && (
                <div className="mt-1 max-w-[75%] space-y-1 rounded-lg bg-gray-50 p-2.5 text-xs dark:bg-gray-800">
                  <p className="font-medium text-gray-600 dark:text-gray-400">{TYPE_LABELS[m.evalType]}</p>
                  <p className="text-gray-500 dark:text-gray-400">{m.evalWhy}</p>
                  {m.evalSuggestion && (
                    <p className="text-green-700 dark:text-green-400">Лучше: {m.evalSuggestion}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
