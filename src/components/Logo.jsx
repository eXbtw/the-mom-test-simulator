export default function Logo({ size = 'md' }) {
  const isSmall = size === 'sm'

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-[#C6402F] font-display font-bold text-[#FFFCF5] ${
          isSmall ? 'h-8 w-8 text-[11px]' : 'h-10 w-10 text-sm'
        }`}
      >
        MT
      </div>
      <div className="min-w-0 leading-tight">
        <p
          className={`font-display font-bold text-gray-900 dark:text-gray-100 ${
            isSmall ? 'text-sm' : 'text-base'
          }`}
        >
          The Mom Test
        </p>
        {!isSmall && (
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Interview Simulator
          </p>
        )}
      </div>
    </div>
  )
}
