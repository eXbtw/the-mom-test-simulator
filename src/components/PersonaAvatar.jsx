import { Activity, Building2, Calculator, ListChecks, Truck, Users, Wallet } from 'lucide-react'

const ICONS = {
  logistics: Truck,
  'smb-saas': Calculator,
  fitness: Activity,
  'personal-finance': Wallet,
  'hr-recruiting': Users,
  productivity: ListChecks,
}

const SIZES = {
  sm: { box: 'h-8 w-8', icon: 14 },
  md: { box: 'h-10 w-10', icon: 18 },
  lg: { box: 'h-14 w-14', icon: 26 },
}

export default function PersonaAvatar({ categoryId, size = 'md' }) {
  const Icon = ICONS[categoryId] ?? Building2
  const { box, icon } = SIZES[size] ?? SIZES.md

  return (
    <div
      className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300`}
    >
      <Icon size={icon} />
    </div>
  )
}
