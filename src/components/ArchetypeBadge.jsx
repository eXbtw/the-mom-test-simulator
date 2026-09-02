import { Cloud, Compass, Megaphone, Search } from 'lucide-react'
import { computeArchetype, computeWeaknessProfile } from '../utils/weaknessProfile'

const ICONS = {
  master: Compass,
  inquisitor: Search,
  dreamer: Cloud,
  salesman: Megaphone,
}

export default function ArchetypeBadge({ history }) {
  const archetype = computeArchetype(computeWeaknessProfile(history))
  if (!archetype) return null

  const Icon = ICONS[archetype.id]

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#C6402F]/25 bg-[#FDF2EF] p-3 dark:border-[#FF5A42]/25 dark:bg-gray-800">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C6402F]/10 text-[#C6402F] dark:bg-[#FF5A42]/15 dark:text-[#FF5A42]">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="eyebrow">Ваш архетип интервьюера</p>
        <p className="font-display text-sm font-bold text-gray-900 dark:text-gray-100">{archetype.label}</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{archetype.description}</p>
      </div>
    </div>
  )
}
