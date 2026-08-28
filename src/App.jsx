import { useState } from 'react'
import AppShell from './components/AppShell'
import Onboarding from './screens/Onboarding'
import Workspace from './screens/Workspace'
import Results from './screens/Results'
import RulesGuide from './screens/RulesGuide'
import SessionHistory from './screens/SessionHistory'
import TransitionScreen from './components/TransitionScreen'
import { addHistoryEntry } from './utils/storage'

const TRANSITION_MS = 550

function App() {
  const [persona, setPersona] = useState(null)
  const [blindMode, setBlindMode] = useState(false)
  const [result, setResult] = useState(null)
  const [overlay, setOverlay] = useState(null)
  const [transition, setTransition] = useState(null)

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

  const handleFinish = (sessionResult) => {
    runTransition('Подводим итоги…', () => {
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
      })
      setResult(sessionResult)
    })
  }

  const handleRestart = () => {
    runTransition('Возвращаемся на главный…', () => {
      setPersona(null)
      setResult(null)
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
