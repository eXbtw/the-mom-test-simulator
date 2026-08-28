import { useEffect, useState } from 'react'

const TAKES = [
  'Комплимент — это не данные.',
  'Мнения обманывают, факты — нет.',
  'Прошлое не врёт, будущее обещает что угодно.',
  'Хороший вопрос лишает соврать возможности.',
]

export default function TakesRotator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % TAKES.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <p key={index} className="animate-take-fade-in font-hand text-xl text-[#C6402F] dark:text-[#FF6E56]">
      {TAKES[index]}
    </p>
  )
}
