import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './pages/Portfolio'
import Minigames from './pages/Minigames'
import TypeRacer from './pages/games/TypeRacer/TypeRacer'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/minigames" element={<Minigames />} />
        <Route path="/minigames/typeracer" element={<TypeRacer />} />
      </Routes>
    </Router>
  )
}

export default App
