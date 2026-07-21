import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen } from '../../components/Chrome.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { QUAL_VIBE_LABEL, budgetTier, monthsLabel, rankedCountries, getCountry, rankItineraries } from '../../data/c3.js'

export default function C3Building({ mode = 'countries' }) {
  const navigate = useNavigate()
  const { qual, prefs, countryKey } = useC3()

  if (mode === 'countries') return <SortingScreen qual={qual} onDone={() => navigate('/c3/countries')} />

  // Straight to the tailored itinerary — no intermediate list.
  const dest = countryKey || 'bali'
  const country = getCountry(dest)
  const topId = country ? rankItineraries(country, qual, prefs)[0].id : null
  return <OrbScreen prefs={prefs} onDone={() => navigate(`/c3/trip/${dest}/${topId}`)} />
}

/* Card-sorting animation for the qualitative → countries step */
function SortingScreen({ qual, onDone }) {
  const [flung, setFlung] = useState(0)
  const [step, setStep] = useState(0)

  const ranked = rankedCountries(qual)
  const keepers = ranked.slice(0, 3).map((r) => r.country)
  const discards = ranked.slice(3).map((r) => r.country)
  const stack = [...discards, ...keepers] // top→bottom: discards fly off, best keeper ends on top

  const pills = [
    qual.who && `👥 ${qual.who}`,
    ...qual.vibes.map((v) => QUAL_VIBE_LABEL[v]),
    `💰 ${budgetTier(qual.budget)}`,
    `📅 ${monthsLabel(qual.months)}`,
  ].filter(Boolean)

  const lines = ['Reading your picks…', 'Sorting through destinations…', 'Ruling out the ones that don’t fit…', 'Ranking your best matches…']

  useEffect(() => {
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, lines.length - 1)), 800)
    const flings = discards.map((_, i) => setTimeout(() => setFlung(i + 1), 900 + i * 500))
    const go = setTimeout(onDone, 3500)
    return () => { clearInterval(tick); flings.forEach(clearTimeout); clearTimeout(go) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Screen>
      <div className="screen-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px calc(20px + env(safe-area-inset-bottom))' }}>
        <div className="sort-pills">
          {pills.map((p, i) => (
            <motion.span
              key={p + i} className="sort-pill"
              initial={{ opacity: 0, scale: 0.8, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 400, damping: 24 }}
            >
              {p}
            </motion.span>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="sort-stage">
            {stack.map((c, i) => {
              const flown = i < discards.length && flung > i
              const depth = Math.max(0, i - flung)
              const dir = i % 2 ? 1 : -1
              return (
                <motion.div
                  key={c.key} className="sort-card" style={{ zIndex: 100 - i }} initial={false}
                  animate={flown
                    ? { x: dir * 380, y: -30, rotate: dir * 22, opacity: 0 }
                    : { x: 0, y: depth * 9, scale: 1 - depth * 0.05, rotate: depth ? dir * 3 : 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                >
                  <img src={c.hero} alt="" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  <div className="sort-card__scrim" />
                  <span className="sort-card__name">{c.name}</span>
                </motion.div>
              )
            })}
          </div>

          <div className="t-hd-med" style={{ marginTop: 28 }}>Finding your destinations</div>
          <div style={{ height: 42, marginTop: 6 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={step} className="t-p-med muted" style={{ maxWidth: 290, textAlign: 'center' }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {lines[step]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Screen>
  )
}

/* Orb loader for the quantitative → itineraries step */
function OrbScreen({ prefs, onDone }) {
  const [step, setStep] = useState(0)
  const lines = [
    'Reading your preferences…',
    prefs.pace >= 60 ? 'Packing your days efficiently…' : 'Leaving room to slow down…',
    `Slotting in ${prefs.food.toLowerCase()} spots and your stays…`,
    'Building itineraries you can book…',
  ]
  useEffect(() => {
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, lines.length - 1)), 850)
    const go = setTimeout(onDone, 3600)
    return () => { clearInterval(tick); clearTimeout(go) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Screen>
      <div className="screen-body pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="loader-orb">
          <motion.div className="loader-orb__ring" animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
          <span className="loader-orb__core"><Icon name="sparkle" size={30} /></span>
        </div>
        <div className="t-hd-med" style={{ marginTop: 26 }}>Crafting your itineraries</div>
        <div style={{ height: 46, marginTop: 8 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={step} className="t-p-med muted" style={{ maxWidth: 290 }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {lines[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Screen>
  )
}
