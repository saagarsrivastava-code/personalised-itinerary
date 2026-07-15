import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { getCountry, activitiesFor } from '../../data/c3.js'

export default function C3Activities() {
  const navigate = useNavigate()
  const { countryKey, qual, prefs, toggleActivity } = useC3()
  const country = getCountry(countryKey)
  if (!country) return <Navigate to="/c3/countries" replace />

  const activities = activitiesFor(country, qual)
  const chosen = prefs.activities

  return (
    <Screen>
      <div className="pad" style={{ paddingTop: 8 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="appbar__back" style={{ marginLeft: -8 }} onClick={() => navigate('/c3/refine')} aria-label="Back"><Icon name="back" /></button>
          <span className="t-p-small muted">{country.name}</span>
          <span style={{ width: 30 }} />
        </div>
      </div>

      <div className="screen-body pad" style={{ paddingTop: 16, paddingBottom: 20 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <h1 className="q-title">What do you want to do?</h1>
          <p className="t-p-small muted" style={{ marginTop: 4 }}>Pick the experiences to build into your {country.name} plan.</p>

          <div className="actgrid" style={{ marginTop: 18 }}>
            {activities.map((a) => {
              const on = chosen.includes(a.key)
              return (
                <button key={a.key} className={`actcard${on ? ' is-sel' : ''}`} onClick={() => toggleActivity(a.key)}>
                  <div className="actcard__photo">
                    <img src={a.img} alt="" loading="lazy" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <div className="actcard__scrim" />
                    <span className={`actcard__check${on ? ' is-on' : ''}`}><Icon name="check" size={14} /></span>
                  </div>
                  <span className="actcard__label">{a.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>

      <Footer>
        <Button full variant="dark" onClick={() => navigate('/c3/building')}>
          {chosen.length ? `Build my itinerary · ${chosen.length} picked` : 'Surprise me — build it'}
        </Button>
      </Footer>
    </Screen>
  )
}
