export default function SelectionCard({ title, subtitle, icon: Icon, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition-colors hover:border-[#C6402F]/50 hover:bg-[#FDF2EF] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#FF5A42]/50 dark:hover:bg-gray-700"
    >
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-[#C6402F]/10 group-hover:text-[#C6402F] dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-[#FF5A42]/15 dark:group-hover:text-[#FF5A42]">
          <Icon size={18} />
        </span>
      )}
      <span className="min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </span>
    </button>
  )
}
