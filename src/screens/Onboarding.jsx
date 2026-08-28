import { useState } from 'react'
import { ArrowLeft, BookOpen, Briefcase, UserRound, Zap } from 'lucide-react'
import { BRANCHES, PERSONAS } from '../data/personas'
import SelectionCard from '../components/SelectionCard'
import PersonaCard from '../components/PersonaCard'
import CustomPersonaForm from '../components/CustomPersonaForm'
import ThemeToggle from '../components/ThemeToggle'
import Logo from '../components/Logo'
import TranscriptHero from '../components/TranscriptHero'
import TakesRotator from '../components/TakesRotator'
import QuickChallenge from './QuickChallenge'

const STEP_TITLES = {
  branch: 'С кем тренируемся?',
  category: 'Выберите направление',
  custom: 'Своя сфера',
  confirm: 'Ваш респондент',
}

const BRANCH_ICONS = {
  b2b: Briefcase,
  b2c: UserRound,
}

export default function Onboarding({ onStart, onShowRules }) {
  const [step, setStep] = useState('branch')
  const [branchId, setBranchId] = useState(null)
  const [persona, setPersona] = useState(null)
  const [confirmOrigin, setConfirmOrigin] = useState('category')
  const [blindMode, setBlindMode] = useState(false)

  const categories = branchId
    ? PERSONAS.filter((p) => p.branch === branchId)
    : []

  const handleBranchSelect = (id) => {
    setBranchId(id)
    setStep('category')
  }

  const handleCategorySelect = (selectedPersona) => {
    setPersona(selectedPersona)
    setConfirmOrigin('category')
    setStep('confirm')
  }

  const handleGenerated = (generatedPersona) => {
    setPersona(generatedPersona)
    setConfirmOrigin('custom')
    setStep('confirm')
  }

  const goBack = () => {
    if (step === 'category' || step === 'custom') {
      setBranchId(null)
      setStep('branch')
    } else if (step === 'confirm') {
      setPersona(null)
      setStep(confirmOrigin)
    }
  }

  if (step === 'challenge') {
    return <QuickChallenge onExit={() => setStep('branch')} />
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        {step === 'branch' && (
          <div className="animate-hero-in mb-8">
            <TranscriptHero />
            <p className="mx-auto mt-4 max-w-sm text-center text-sm italic text-gray-500 dark:text-gray-400">
              «Вам соврут, если вы зададите плохой вопрос»
              <span className="mt-1 block not-italic text-xs text-gray-400 dark:text-gray-500">
                — Роб Фицпатрик, «Спроси маму»
              </span>
            </p>
            <div className="mt-4 flex justify-center">
              <TakesRotator />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onShowRules}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-[#C6402F] dark:text-gray-500 dark:hover:text-[#FF5A42]"
              >
                <BookOpen size={13} />
                Как читать реакции — гайд по правилам
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2">
          {step !== 'branch' && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Назад"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{STEP_TITLES[step]}</h2>
        </div>

        {step === 'branch' && (
          <div className="space-y-3">
            {BRANCHES.map((branch, i) => (
              <div
                key={branch.id}
                className="animate-hero-in"
                style={{ animationDelay: `${100 + i * 80}ms` }}
              >
                <SelectionCard
                  title={branch.label}
                  subtitle={branch.description}
                  icon={BRANCH_ICONS[branch.id]}
                  onSelect={() => handleBranchSelect(branch.id)}
                />
              </div>
            ))}

            <div className="animate-hero-in" style={{ animationDelay: `${100 + BRANCHES.length * 80}ms` }}>
              <button
                type="button"
                onClick={() => setStep('challenge')}
                className="group flex w-full items-center gap-3 rounded-xl border border-[#C6402F]/25 bg-[#FDF2EF] p-4 text-left transition-colors hover:border-[#C6402F] hover:bg-[#FBE3DD] dark:border-[#FF5A42]/25 dark:bg-gray-800 dark:hover:border-[#FF5A42] dark:hover:bg-gray-700"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C6402F]/10 text-[#C6402F] dark:bg-[#FF5A42]/15 dark:text-[#FF5A42]">
                  <Zap size={18} />
                </span>
                <span className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">⚡ Задача дня</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Один фрагмент диалога, один ваш ответ — быстрая проверка навыка
                  </p>
                </span>
              </button>
            </div>
          </div>
        )}

        {step === 'category' && (
          <div className="space-y-3">
            {categories.map((p) => (
              <SelectionCard
                key={p.id}
                title={p.category.label}
                subtitle={p.category.tagline}
                onSelect={() => handleCategorySelect(p)}
              />
            ))}
            <SelectionCard
              title="✏️ Своя сфера"
              subtitle="Опишите нишу своими словами — респондента сгенерирует AI"
              onSelect={() => setStep('custom')}
            />
          </div>
        )}

        {step === 'custom' && (
          <CustomPersonaForm branch={branchId} onGenerated={handleGenerated} />
        )}

        {step === 'confirm' && persona && (
          <>
            <PersonaCard persona={persona} />

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <input
                type="checkbox"
                checked={blindMode}
                onChange={(e) => setBlindMode(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#C6402F]"
              />
              <span>
                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  🙈 Режим вслепую
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Панель аудитора и подсказки будут скрыты во время разговора — счёт и разбор
                  ошибок откроются только в конце.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={() => onStart(persona, blindMode)}
              className="mt-4 w-full rounded-lg bg-[#C6402F] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A32F21]"
            >
              Начать интервью
            </button>
          </>
        )}
      </div>
    </div>
  )
}
