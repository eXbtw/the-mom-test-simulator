export default function SelectionCard({ title, subtitle, icon: Icon, compact = false, onSelect }) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="group relative flex w-full flex-col items-center gap-2.5 overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-5 text-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#C6402F] hover:shadow-[0_10px_24px_-14px_rgba(198,64,47,0.35)] focus-visible:-translate-y-0.5 focus-visible:border-[#C6402F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6402F]/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#FF5A42] dark:hover:shadow-none dark:focus-visible:border-[#FF5A42] dark:focus-visible:ring-[#FF5A42]/40"
      >
        <span
          aria-hidden="true"
          className="absolute right-0 top-0 h-5 w-5 origin-top-right scale-0 bg-[#C6402F] transition-transform duration-200 ease-out group-hover:scale-100 group-focus-visible:scale-100 dark:bg-[#FF5A42]"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        />
        {Icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-[#C6402F]/10 group-hover:text-[#C6402F] dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-[#FF5A42]/15 dark:group-hover:text-[#FF5A42]">
            <Icon size={20} />
          </span>
        )}
        <span>
          <h3 className="font-display text-sm font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {subtitle && <p className="mt-1 text-xs leading-snug text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex w-full items-start gap-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#C6402F] hover:shadow-[0_10px_24px_-14px_rgba(198,64,47,0.35)] focus-visible:-translate-y-0.5 focus-visible:border-[#C6402F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6402F]/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#FF5A42] dark:hover:shadow-none dark:focus-visible:border-[#FF5A42] dark:focus-visible:ring-[#FF5A42]/40"
    >
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 h-5 w-5 origin-top-right scale-0 bg-[#C6402F] transition-transform duration-200 ease-out group-hover:scale-100 group-focus-visible:scale-100 dark:bg-[#FF5A42]"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-[#C6402F]/10 group-hover:text-[#C6402F] dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-[#FF5A42]/15 dark:group-hover:text-[#FF5A42]">
          <Icon size={18} />
        </span>
      )}
      <span className="min-w-0">
        <h3 className="font-display text-sm font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </span>
    </button>
  )
}
