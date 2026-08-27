import { useState } from 'react'
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

  if (!persona) {
    return <Onboarding onStart={setPersona} />
  }

  if (result) {
    return <Results result={result} onRestart={handleRestart} />
  }

  return <Workspace persona={persona} onFinish={setResult} />
}

export default App
