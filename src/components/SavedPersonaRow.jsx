import { Trash2 } from 'lucide-react'

export default function SavedPersonaRow({ persona, onSelect, onDelete }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
          ⭐ {persona.name}
        </h3>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{persona.role}</p>
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Удалить сохранённую персону"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
