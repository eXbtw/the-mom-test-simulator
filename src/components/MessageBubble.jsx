export default function MessageBubble({ role, text }) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-gray-200 text-gray-900 rounded-br-sm'
            : 'bg-blue-600 text-white rounded-bl-sm'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
