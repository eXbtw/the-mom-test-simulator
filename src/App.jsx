import { useState } from 'react'
import AppShell from './components/AppShell'
import Onboarding from './screens/Onboarding'
import Workspace from './screens/Workspace'
import Results from './screens/Results'

function App() {
  const [persona, setPersona] = useState(null)
  const [result, setResult] = useState(null)

  const handleRestart = () => {
    setPersona(null)
    setResult(null)
  }

  let screen
  if (!persona) {
    screen = <Onboarding onStart={setPersona} />
  } else if (result) {
    screen = <Results result={result} onRestart={handleRestart} />
  } else {
    screen = <Workspace persona={persona} onFinish={setResult} />
  }

  return <AppShell>{screen}</AppShell>
}

export default App
