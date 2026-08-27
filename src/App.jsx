import { useState } from 'react'
import Onboarding from './screens/Onboarding'
import Workspace from './screens/Workspace'

function App() {
  const [persona, setPersona] = useState(null)

  if (!persona) {
    return <Onboarding onStart={setPersona} />
  }

  return <Workspace persona={persona} />
}

export default App
