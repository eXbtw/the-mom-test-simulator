import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BRANCHES, PERSONAS } from '../data/personas'
import SelectionCard from '../components/SelectionCard'
import PersonaCard from '../components/PersonaCard'
import CustomPersonaForm from '../components/CustomPersonaForm'
import ThemeToggle from '../components/ThemeToggle'

const STEP_TITLES = {
  branch: 'С кем тренируемся?',
  category: 'Выберите направление',
  custom: 'Своя сфера',
  confirm: 'Ваш респондент',
}

export default function Onboarding({ onStart }) {
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

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center overflow-y-auto px-6 py-10">
      <div className="mb-2 flex justify-end">
        <ThemeToggle />
      </div>

      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">The Mom Test Simulator</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Потренируйте проблемные интервью на AI-персоне и получите разбор ошибок
          по методологии «Спроси маму».
        </p>
      </header>

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
          {BRANCHES.map((branch) => (
            <SelectionCard
              key={branch.id}
              title={branch.label}
              subtitle={branch.description}
              onSelect={() => handleBranchSelect(branch.id)}
            />
          ))}
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
              className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
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
            className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Начать интервью
          </button>
        </>
      )}
    </div>
  )
}
