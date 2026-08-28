export default function TransitionScreen({ message }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
      <div className="animate-pulse-soft motion-reduce:animate-none flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6402F] font-display text-lg font-bold text-[#FFFCF5]">
        MT
      </div>
      <p className="font-display text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  )
}
