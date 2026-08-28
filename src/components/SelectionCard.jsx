export default function SelectionCard({ title, subtitle, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-xl border border-gray-200 bg-white p-5 text-left transition-colors hover:border-[#C6402F]/50 hover:bg-[#FDF2EF] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#FF6E56]/50 dark:hover:bg-gray-700"
    >
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </button>
  )
}
