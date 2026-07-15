import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { getCountry, DURATION_OPTIONS, FOOD_OPTIONS, STAY_OPTIONS, TRANSPORT_OPTIONS } from '../../data/c3.js'
import { QSection, Pill } from './qparts.jsx'

export default function C3Refine() {
  const navigate = useNavigate()
  const { countryKey, prefs, setPref, toggleStay } = useC3()
  const country = getCountry(countryKey)
  if (!country) return <Navigate to="/c3/countries" replace />

  const { pace, duration, food, stays, transport } = prefs
  const ready = !!duration && !!food && stays.length > 0 && !!transport

  return (
    <Screen>
      <div className="pad" style={{ paddingTop: 8 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="appbar__back" style={{ marginLeft: -8 }} onClick={() => navigate(`/c3/country/${countryKey}`)} aria-label="Back"><Icon name="back" /></button>
          <span className="t-p-small muted">Fine-tune {country.name}</span>
          <span style={{ width: 30 }} />
        </div>
      </div>

      <div className="screen-body pad" style={{ paddingTop: 16, paddingBottom: 20 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <h1 className="q-title">A few details</h1>
          <p className="t-p-small muted" style={{ marginTop: 4 }}>So we can tailor the {country.name} plans to you.</p>

          <h2 className="q-title q-title--sm" style={{ marginTop: 26 }}>How much free time do you want?</h2>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 14, alignItems: 'flex-start', gap: 16 }}>
            <div className="pace-end">
              <span className={`pace-icn${pace <= 35 ? ' is-on' : ''}`}><Icon name="sun" size={19} /></span>
              <div className="t-lb-sm" style={{ marginTop: 6 }}><b>More free time</b></div>
            </div>
            <div className="pace-end" style={{ textAlign: 'right', alignItems: 'flex-end' }}>
              <span className={`pace-icn${pace >= 65 ? ' is-on' : ''}`}><Icon name="bolt" size={19} /></span>
              <div className="t-lb-sm" style={{ marginTop: 6 }}><b>More activities</b></div>
            </div>
          </div>
          <div className="slider-wrap" style={{ marginTop: 18 }}>
            <div className="slider-track">
              <div className="slider-fill" style={{ width: `${pace}%` }} />
              <div className="slider-knob" style={{ left: `${pace}%` }} />
              <input className="slider-input" type="range" min="0" max="100" step="5" value={pace} onChange={(e) => setPref('pace', Number(e.target.value))} aria-label="Travel pace" />
            </div>
          </div>

          <QSection title="How long is the trip?">
            {DURATION_OPTIONS.map((d) => <Pill key={d} on={duration === d} onClick={() => setPref('duration', d)}>{d}</Pill>)}
          </QSection>

          <QSection title="What's your food preference?">
            {FOOD_OPTIONS.map((f) => <Pill key={f} on={food === f} onClick={() => setPref('food', f)}>{f}</Pill>)}
          </QSection>

          <QSection title="What kind of stays do you want?">
            {STAY_OPTIONS.map((s) => <Pill key={s} on={stays.includes(s)} onClick={() => toggleStay(s)}>{s}</Pill>)}
          </QSection>

          <QSection title="How do you prefer to get around?">
            {TRANSPORT_OPTIONS.map((t) => <Pill key={t} on={transport === t} onClick={() => setPref('transport', t)}>{t}</Pill>)}
          </QSection>
        </motion.div>
      </div>

      <Footer>
        <Button full variant="dark" disabled={!ready} onClick={() => navigate('/c3/activities')}>
          Next — pick activities
        </Button>
      </Footer>
    </Screen>
  )
}
