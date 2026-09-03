import { useState } from 'react'
import AppShell from './components/AppShell'
import Onboarding from './screens/Onboarding'
import Workspace from './screens/Workspace'
import Results from './screens/Results'
import RulesGuide from './screens/RulesGuide'
import SessionHistory from './screens/SessionHistory'
import TransitionScreen from './components/TransitionScreen'
import { addHistoryEntry, getHistory } from './utils/storage'
import { computeAchievements } from './utils/achievements'
import { PERSONAS } from './data/personas'

const TRANSITION_MS = 550

function App() {
  const [persona, setPersona] = useState(null)
  const [blindMode, setBlindMode] = useState(false)
  const [result, setResult] = useState(null)
  const [overlay, setOverlay] = useState(null)
  const [transition, setTransition] = useState(null)
  const [campaign, setCampaign] = useState(null)

  const runTransition = (message, applyChange) => {
    setTransition({ message })
    setTimeout(() => {
      applyChange()
      setTransition(null)
    }, TRANSITION_MS)
  }

  const handleStart = (selectedPersona, isBlindMode) => {
    runTransition('Готовим интервью…', () => {
      setPersona(selectedPersona)
      setBlindMode(isBlindMode)
    })
  }

  const handleStartCampaign = (branchId) => {
    const queue = PERSONAS.filter((p) => p.branch === branchId)
    runTransition('Готовим марафон интервью…', () => {
      setCampaign({ queue, index: 0, results: [] })
      setPersona(queue[0])
      setBlindMode(false)
    })
  }

  const handleFinish = (sessionResult) => {
    runTransition('Подводим итоги…', () => {
      const beforeAchievements = computeAchievements(getHistory())

      addHistoryEntry({
        id: `session-${Date.now()}`,
        date: new Date().toISOString(),
        personaId: persona.id,
        personaName: persona.name,
        personaRole: persona.role,
        categoryLabel: persona.category?.label,
        branch: persona.branch,
        score: sessionResult.score,
        grade: sessionResult.grade,
        insightsRevealed: sessionResult.insightsRevealed,
        insightsTotal: sessionResult.insightsTotal,
        mistakesCount: sessionResult.mistakes.length,
        blindMode: sessionResult.blindMode,
        transcript: sessionResult.messages,
      })

      const afterAchievements = computeAchievements(getHistory())
      const newAchievements = afterAchievements.filter(
        (a, i) => a.unlocked && !beforeAchievements[i].unlocked,
      )

      if (campaign) {
        setCampaign((c) => ({
          ...c,
          results: [
            ...c.results,
            {
              personaName: persona.name,
              score: sessionResult.score,
              insightsRevealed: sessionResult.insightsRevealed,
              insightsTotal: sessionResult.insightsTotal,
            },
          ],
        }))
      }

      setResult({ ...sessionResult, newAchievements })
    })
  }

  const handleNextCampaignPersona = () => {
    const nextIndex = campaign.index + 1
    runTransition('Следующий респондент…', () => {
      setCampaign((c) => ({ ...c, index: nextIndex }))
      setPersona(campaign.queue[nextIndex])
      setResult(null)
    })
  }

  const handleRestart = () => {
    runTransition('Возвращаемся на главный…', () => {
      setPersona(null)
      setResult(null)
      setCampaign(null)
    })
  }

  let screen
  let phaseKey

  if (transition) {
    screen = <TransitionScreen message={transition.message} />
    phaseKey = 'transition'
  } else if (overlay === 'rules') {
    screen = <RulesGuide onExit={() => setOverlay(null)} />
    phaseKey = 'rules'
  } else if (overlay === 'history') {
    screen = <SessionHistory onExit={() => setOverlay(null)} />
    phaseKey = 'history'
  } else if (!persona) {
    screen = (
      <Onboarding
        onStart={handleStart}
        onStartCampaign={handleStartCampaign}
        onShowRules={() => setOverlay('rules')}
        onShowHistory={() => setOverlay('history')}
      />
    )
    phaseKey = 'onboarding'
  } else if (result) {
    screen = (
      <Results
        result={result}
        persona={persona}
        campaign={campaign}
        onNextCampaignPersona={handleNextCampaignPersona}
        onRestart={handleRestart}
        onShowRules={() => setOverlay('rules')}
        onShowHistory={() => setOverlay('history')}
      />
    )
    phaseKey = 'results'
  } else {
    screen = (
      <Workspace persona={persona} blindMode={blindMode} onFinish={handleFinish} onExit={handleRestart} />
    )
    phaseKey = 'workspace'
  }

  return (
    <AppShell>
      <div key={phaseKey} className="animate-screen-in h-full w-full">
        {screen}
      </div>
    </AppShell>
  )
}

export default App
