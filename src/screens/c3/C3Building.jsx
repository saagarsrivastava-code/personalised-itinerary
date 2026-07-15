import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen } from '../../components/Chrome.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { QUAL_VIBE_LABEL, monthsLabel, inr } from '../../data/c3.js'

export default function C3Building({ mode = 'countries' }) {
  const navigate = useNavigate()
  const { qual, prefs, countryKey } = useC3()
  const [step, setStep] = useState(0)

  const lines = mode === 'countries'
    ? [
        `Matching your love of ${qual.vibes.map((v) => QUAL_VIBE_LABEL[v]?.toLowerCase()).filter(Boolean).slice(0, 2).join(' & ') || 'travel'}…`,
        `Scanning weather for ${monthsLabel(qual.months)}…`,
        `Fitting your ${inr(qual.budget[0])}–${inr(qual.budget[1])} budget…`,
        'Ranking the best-fit countries…',
      ]
    : [
        'Reading your preferences…',
        prefs.pace >= 60 ? 'Packing your days efficiently…' : 'Leaving room to slow down…',
        `Slotting in ${prefs.food.toLowerCase()} spots and your stays…`,
        'Building itineraries you can book…',
      ]

  const title = mode === 'countries' ? 'Finding your destinations' : 'Crafting your itineraries'
  const next = mode === 'countries' ? '/c3/countries' : `/c3/itineraries/${countryKey || 'bali'}`

  useEffect(() => {
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, lines.length - 1)), 850)
    const go = setTimeout(() => navigate(next), 3600)
    return () => { clearInterval(tick); clearTimeout(go) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Screen>
      <div className="screen-body pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="loader-orb">
          <motion.div className="loader-orb__ring" animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
          <span className="loader-orb__core"><Icon name="sparkle" size={30} /></span>
        </div>
        <div className="t-hd-med" style={{ marginTop: 26 }}>{title}</div>
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
