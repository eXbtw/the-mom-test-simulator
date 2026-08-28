// The page's thesis, visualized: a bad, hypothetical interview question,
// typed and struck through, corrected by hand in red — the exact
// bad-question-to-good-question move this whole app trains.
export default function TranscriptHero() {
  return (
    <div className="relative mx-auto w-full max-w-sm -rotate-1">
      <div className="absolute -top-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#C6402F] shadow-sm" />
      <div className="rounded-lg border border-[#DDD2B0] bg-[#FFFCF5] px-5 py-5 shadow-[0_14px_28px_-14px_rgba(0,0,0,0.35)] dark:border-[#3A3226] dark:bg-[#211C15]">
        <p className="font-display text-[13px] uppercase tracking-widest text-[#B4A888] dark:text-[#6B6152]">
          Из интервью
        </p>
        <p className="mt-2 font-display text-[15px] leading-relaxed text-[#8A8065] line-through decoration-[#C6402F] decoration-2 dark:text-[#6B6152]">
          «А вы бы купили такую страховку?»
        </p>
        <p className="mt-2 font-hand text-2xl leading-snug text-[#C6402F] dark:text-[#FF6E56]">
          Расскажите, как вы решали это в прошлый раз.
        </p>
      </div>
    </div>
  )
}
