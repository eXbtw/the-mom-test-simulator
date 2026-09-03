import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import MessageBubble from './MessageBubble'

export default function ChatPanel({ messages, onSend, isThinking, inputDisabled = false, hint }) {
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
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#C6402F]/70 px-4 py-3 dark:bg-[#FF5A42]/70">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="animate-pulse-soft motion-reduce:animate-none h-1.5 w-1.5 rounded-full bg-white"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {hint}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-800">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={inputDisabled ? 'Дождитесь ответа респондента…' : 'Задайте вопрос…'}
          disabled={inputDisabled}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-[#C6402F] disabled:bg-gray-50 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#FF5A42] dark:disabled:bg-gray-900"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-lg bg-[#C6402F] px-4 py-2 text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A32F21] hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          disabled={inputDisabled || !draft.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
