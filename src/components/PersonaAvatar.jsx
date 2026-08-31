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
      className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-[#C6402F]/10 text-[#C6402F] dark:bg-[#FF5A42]/15 dark:text-[#FF5A42]`}
    >
      <Icon size={icon} />
    </div>
  )
}
