import { Routes, Route, useLocation } from 'react-router-dom'

import Landing from './screens/Landing.jsx'
import Ideas from './screens/Ideas.jsx'
import Questions from './screens/Questions.jsx'
import Planning from './screens/Planning.jsx'
import ItineraryReady from './screens/ItineraryReady.jsx'
import Trip from './screens/Trip.jsx'

import C3Landing from './screens/c3/C3Landing.jsx'
import C3Qual1 from './screens/c3/C3Qual1.jsx'
import C3Qual2 from './screens/c3/C3Qual2.jsx'
import C3Building from './screens/c3/C3Building.jsx'
import C3Countries from './screens/c3/C3Countries.jsx'
import C3Country from './screens/c3/C3Country.jsx'
import C3Refine from './screens/c3/C3Refine.jsx'
import C3Activities from './screens/c3/C3Activities.jsx'
import C3Itineraries from './screens/c3/C3Itineraries.jsx'
import C3Trip from './screens/c3/C3Trip.jsx'

export default function App() {
  const location = useLocation()

  return (
    <div className="app">
      {/* No AnimatePresence: each Screen plays its own enter animation on
          mount, and keying by path remounts cleanly on every nav. */}
      <div className="screen-stack" key={location.pathname}>
        <Routes location={location}>
          {/* Destination Matchmaker — two-phase flow */}
          <Route path="/" element={<C3Landing />} />
          <Route path="/c3" element={<C3Landing />} />
          <Route path="/c3/q/1" element={<C3Qual1 />} />
          <Route path="/c3/q/2" element={<C3Qual2 />} />
          <Route path="/c3/finding" element={<C3Building mode="countries" />} />
          <Route path="/c3/countries" element={<C3Countries />} />
          <Route path="/c3/country/:key" element={<C3Country />} />
          <Route path="/c3/refine" element={<C3Refine />} />
          <Route path="/c3/activities" element={<C3Activities />} />
          <Route path="/c3/building" element={<C3Building mode="itineraries" />} />
          <Route path="/c3/itineraries/:key" element={<C3Itineraries />} />
          <Route path="/c3/trip/:dest/:id" element={<C3Trip />} />

          {/* Earlier expert-planned concept, kept for reference */}
          <Route path="/expert" element={<Landing />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/ready" element={<ItineraryReady />} />
          <Route path="/trip" element={<Trip />} />

          <Route path="*" element={<C3Landing />} />
        </Routes>
      </div>
    </div>
  )
}
