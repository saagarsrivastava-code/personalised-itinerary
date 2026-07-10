import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Landing from './screens/Landing.jsx'
import Ideas from './screens/Ideas.jsx'
import Questions from './screens/Questions.jsx'
import Planning from './screens/Planning.jsx'
import ItineraryReady from './screens/ItineraryReady.jsx'
import Trip from './screens/Trip.jsx'
import Checkout from './screens/Checkout.jsx'

export default function App() {
  const location = useLocation()

  return (
    <div className="app">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/ready" element={<ItineraryReady />} />
          <Route path="/trip" element={<Trip />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
