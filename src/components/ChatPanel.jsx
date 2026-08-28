import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import MessageBubble from './MessageBubble'

export default function ChatPanel({ messages, onSend, isThinking }) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} text={m.text} />
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-blue-600/70 px-4 py-2 text-sm text-white dark:bg-blue-500/70">
              печатает…
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-800">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Задайте вопрос…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={!draft.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
