import { useState } from 'react'
import { ArrowLeft, BookOpen, Briefcase, EyeOff, History, Lightbulb, PenLine, UserRound, Zap } from 'lucide-react'
import { BRANCHES, PERSONAS } from '../data/personas'
import SelectionCard from '../components/SelectionCard'
import PersonaCard from '../components/PersonaCard'
import SavedPersonaRow from '../components/SavedPersonaRow'
import CustomPersonaForm from '../components/CustomPersonaForm'
import IdeaPersonaForm from '../components/IdeaPersonaForm'
import UpcomingInterviewBanner from '../components/UpcomingInterviewBanner'
import ThemeToggle from '../components/ThemeToggle'
import Logo from '../components/Logo'
import TranscriptHero from '../components/TranscriptHero'
import TakesRotator from '../components/TakesRotator'
import QuickChallenge from './QuickChallenge'
import {
  clearUpcomingInterview,
  getHistory,
  getSavedPersonas,
  getUpcomingInterview,
  isPersonaSaved,
  removeSavedPersona,
  savePersona,
} from '../utils/storage'
import { computeWeaknessProfile, getChecklistTips } from '../utils/weaknessProfile'

const STEP_TITLES = {
  branch: 'С кем тренируемся?',
  category: 'Выберите направление',
  custom: 'Своя сфера',
  idea: 'Проверь свою идею',
  confirm: 'Ваш респондент',
}

const BRANCH_ICONS = {
  b2b: Briefcase,
  b2c: UserRound,
}

export default function Onboarding({ onStart, onShowRules, onShowHistory }) {
  const [step, setStep] = useState('branch')
  const [branchId, setBranchId] = useState(null)
  const [persona, setPersona] = useState(null)
  const [confirmOrigin, setConfirmOrigin] = useState('category')
  const [blindMode, setBlindMode] = useState(false)
  const [savedPersonas, setSavedPersonas] = useState(() => getSavedPersonas())
  const [isSaved, setIsSaved] = useState(false)
  const [ideaPrefill, setIdeaPrefill] = useState('')
  const [upcomingInterview, setUpcomingInterviewState] = useState(() => {
    const record = getUpcomingInterview()
    if (!record) return null
    const daysOld = Math.round((Date.now() - new Date(`${record.date}T00:00:00`)) / 86400000)
    if (daysOld > 3) {
      clearUpcomingInterview()
      return null
    }
    return record
  })

  const categories = branchId
    ? PERSONAS.filter((p) => p.branch === branchId)
    : []
  const savedForBranch = branchId
    ? savedPersonas.filter((p) => p.branch === branchId)
    : []

  const handleBranchSelect = (id) => {
    setBranchId(id)
    setStep('category')
  }

  const handleCategorySelect = (selectedPersona) => {
    setPersona(selectedPersona)
    setConfirmOrigin('category')
    setIsSaved(isPersonaSaved(selectedPersona.id))
    setStep('confirm')
  }

  const handleGenerated = (generatedPersona) => {
    setPersona(generatedPersona)
    setConfirmOrigin('custom')
    setIsSaved(false)
    setStep('confirm')
  }

  const handleIdeaGenerated = (generatedPersona) => {
    setPersona(generatedPersona)
    setConfirmOrigin('idea')
    setIsSaved(false)
    setStep('confirm')
  }

  const handleToggleSave = () => {
    if (isSaved) {
      removeSavedPersona(persona.id)
    } else {
      savePersona(persona)
    }
    setIsSaved((v) => !v)
    setSavedPersonas(getSavedPersonas())
  }

  const handleDeleteSaved = (id) => {
    removeSavedPersona(id)
    setSavedPersonas(getSavedPersonas())
  }

  const handlePracticeFromReminder = () => {
    const savedMatch = getSavedPersonas().find((p) => p.id === upcomingInterview.personaId)
    if (savedMatch) {
      setPersona(savedMatch)
      setConfirmOrigin('idea')
      setIsSaved(true)
      setStep('confirm')
    } else {
      setIdeaPrefill(upcomingInterview.idea)
      setStep('idea')
    }
  }

  const handleDismissReminder = () => {
    clearUpcomingInterview()
    setUpcomingInterviewState(null)
  }

  const goBack = () => {
    if (step === 'category' || step === 'custom' || step === 'idea') {
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
      <div className="justify-safe-center mx-auto flex h-full w-full max-w-2xl flex-col px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        {step === 'branch' && upcomingInterview && (
          <UpcomingInterviewBanner
            record={upcomingInterview}
            tips={getChecklistTips(computeWeaknessProfile(getHistory()))}
            onPractice={handlePracticeFromReminder}
            onDismiss={handleDismissReminder}
          />
        )}

        {step === 'branch' && (
          <div className="animate-hero-in mb-8">
            <TranscriptHero />
            <div className="mx-auto mt-4 max-w-sm text-center">
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                <span className="mr-0.5 font-display text-[#C6402F] dark:text-[#FF5A42]">”</span>
                Вам соврут, если вы зададите плохой вопрос
                <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                  — Роб Фицпатрик, «Спроси маму»
                </span>
              </p>
              <TakesRotator />
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 border-t border-gray-200/70 pt-3 dark:border-gray-800">
              <button
                type="button"
                onClick={onShowRules}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-[#C6402F] dark:text-gray-500 dark:hover:text-[#FF5A42]"
              >
                <BookOpen size={13} />
                Правила
              </button>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <button
                type="button"
                onClick={onShowHistory}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-[#C6402F] dark:text-gray-500 dark:hover:text-[#FF5A42]"
              >
                <History size={13} />
                История
              </button>
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center gap-2">
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
          <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
            {STEP_TITLES[step]}
          </h2>
        </div>

        {step === 'branch' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {BRANCHES.map((branch, i) => (
                <div
                  key={branch.id}
                  className="animate-hero-in"
                  style={{ animationDelay: `${100 + i * 80}ms` }}
                >
                  <SelectionCard
                    compact
                    title={branch.label}
                    subtitle={branch.description}
                    icon={BRANCH_ICONS[branch.id]}
                    onSelect={() => handleBranchSelect(branch.id)}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 px-1">
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-600">
                или
              </span>
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="space-y-2">
              <div className="animate-hero-in" style={{ animationDelay: `${100 + BRANCHES.length * 80}ms` }}>
                <button
                  type="button"
                  onClick={() => setStep('challenge')}
                  className="group flex w-full items-center gap-3 rounded-lg border-y border-r border-l-[3px] border-gray-200 border-l-gray-200 bg-white py-3 pl-3.5 pr-4 text-left transition-all duration-200 ease-out hover:border-l-[#C6402F] hover:bg-[#FDF2EF]/60 dark:border-gray-700 dark:border-l-gray-700 dark:bg-gray-800 dark:hover:border-l-[#FF5A42] dark:hover:bg-gray-700/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-[#C6402F]/10 group-hover:text-[#C6402F] dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-[#FF5A42]/15 dark:group-hover:text-[#FF5A42]">
                    <Zap size={16} />
                  </span>
                  <span className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-gray-900 dark:text-gray-100">
                      Задача дня
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Один фрагмент диалога, один ваш ответ
                    </p>
                  </span>
                </button>
              </div>

              <div className="animate-hero-in" style={{ animationDelay: `${180 + BRANCHES.length * 80}ms` }}>
                <button
                  type="button"
                  onClick={() => setStep('idea')}
                  className="group flex w-full items-center gap-3 rounded-lg border-y border-r border-l-[3px] border-gray-200 border-l-gray-200 bg-white py-3 pl-3.5 pr-4 text-left transition-all duration-200 ease-out hover:border-l-[#C6402F] hover:bg-[#FDF2EF]/60 dark:border-gray-700 dark:border-l-gray-700 dark:bg-gray-800 dark:hover:border-l-[#FF5A42] dark:hover:bg-gray-700/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-[#C6402F]/10 group-hover:text-[#C6402F] dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-[#FF5A42]/15 dark:group-hover:text-[#FF5A42]">
                    <Lightbulb size={16} />
                  </span>
                  <span className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-gray-900 dark:text-gray-100">
                      Проверь свою идею
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Опишите продукт — подберём респондента под вашу аудиторию
                    </p>
                  </span>
                </button>
              </div>
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
              title="Своя сфера"
              subtitle="Опишите нишу своими словами — респондента сгенерирует AI"
              icon={PenLine}
              onSelect={() => setStep('custom')}
            />

            {savedForBranch.length > 0 && (
              <>
                <p className="eyebrow pt-2">Сохранённые</p>
                {savedForBranch.map((p) => (
                  <SavedPersonaRow
                    key={p.id}
                    persona={p}
                    onSelect={() => handleCategorySelect(p)}
                    onDelete={() => handleDeleteSaved(p.id)}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {step === 'custom' && (
          <CustomPersonaForm branch={branchId} onGenerated={handleGenerated} />
        )}

        {step === 'idea' && (
          <IdeaPersonaForm initialIdea={ideaPrefill} onGenerated={handleIdeaGenerated} />
        )}

        {step === 'confirm' && persona && (
          <>
            <PersonaCard
              persona={persona}
              isSaved={isSaved}
              onToggleSave={persona.id.startsWith('custom-') ? handleToggleSave : undefined}
            />

            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
              <input
                type="checkbox"
                checked={blindMode}
                onChange={(e) => setBlindMode(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#C6402F]"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <EyeOff size={14} />
                  Режим вслепую
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
              className="mt-3 w-full rounded-lg bg-[#C6402F] py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A32F21] hover:shadow-lg active:translate-y-0"
            >
              Начать интервью
            </button>
          </>
        )}
      </div>
    </div>
  )
}
