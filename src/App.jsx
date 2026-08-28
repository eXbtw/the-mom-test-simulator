import { useState } from 'react'
import AppShell from './components/AppShell'
import Onboarding from './screens/Onboarding'
import Workspace from './screens/Workspace'
import Results from './screens/Results'
import RulesGuide from './screens/RulesGuide'

function App() {
  const [persona, setPersona] = useState(null)
  const [blindMode, setBlindMode] = useState(false)
  const [result, setResult] = useState(null)
  const [showRules, setShowRules] = useState(false)

  const handleStart = (selectedPersona, isBlindMode) => {
    setPersona(selectedPersona)
    setBlindMode(isBlindMode)
  }

  const handleRestart = () => {
    setPersona(null)
    setResult(null)
  }

  let screen
  if (showRules) {
    screen = <RulesGuide onExit={() => setShowRules(false)} />
  } else if (!persona) {
    screen = <Onboarding onStart={handleStart} onShowRules={() => setShowRules(true)} />
  } else if (result) {
    screen = (
      <Results
        result={result}
        persona={persona}
        onRestart={handleRestart}
        onShowRules={() => setShowRules(true)}
      />
    )
  } else {
    screen = (
      <Workspace
        persona={persona}
        blindMode={blindMode}
        onFinish={setResult}
        onExit={handleRestart}
      />
    )
  }

  return <AppShell>{screen}</AppShell>
}

export default App
