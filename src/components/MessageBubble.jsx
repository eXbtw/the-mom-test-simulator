export default function MessageBubble({ role, text }) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-gray-200 text-gray-900 rounded-br-sm dark:bg-gray-700 dark:text-gray-100'
            : 'bg-[#C6402F] text-white rounded-bl-sm dark:bg-[#FF5A42]'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
