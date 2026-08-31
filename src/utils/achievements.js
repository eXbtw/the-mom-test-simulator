import { EyeOff, Flame, Gem, Library, Target, Trophy } from 'lucide-react'

export function computeStreak(history) {
  let streak = 0
  for (const entry of history) {
    if (entry.score >= 60) streak++
    else break
  }
  return streak
}

const DEFINITIONS = [
  {
    id: 'first_interview',
    icon: Target,
    label: 'Первое интервью',
    check: (history) => history.length >= 1,
  },
  {
    id: 'hot_streak',
    icon: Flame,
    label: '3 подряд ≥60',
    check: (history) => computeStreak(history) >= 3,
  },
  {
    id: 'flawless',
    icon: Gem,
    label: 'Без ошибок',
    check: (history) => history.some((h) => h.mistakesCount === 0),
  },
  {
    id: 'personal_best',
    icon: Trophy,
    label: 'Личный рекорд',
    check: (history) =>
      history.length > 0 && history[0].score === Math.max(...history.map((h) => h.score)),
  },
  {
    id: 'marathon',
    icon: Library,
    label: '10 интервью',
    check: (history) => history.length >= 10,
  },
  {
    id: 'brave',
    icon: EyeOff,
    label: 'Смельчак',
    check: (history) => history.some((h) => h.blindMode),
  },
]

export function computeAchievements(history) {
  return DEFINITIONS.map((def) => ({
    id: def.id,
    icon: def.icon,
    label: def.label,
    unlocked: def.check(history),
  }))
}
