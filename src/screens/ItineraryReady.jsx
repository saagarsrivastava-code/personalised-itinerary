import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen } from '../components/Chrome.jsx'
import { Button, CategoryPill } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { EXPERT, TRIP, onAvatarError } from '../data/trip.js'

export default function ItineraryReady() {
  const navigate = useNavigate()

  return (
    <Screen>
      <div className="pad" style={{ paddingTop: 8 }}>
        <button className="appbar__back" style={{ marginLeft: -8 }} onClick={() => navigate(-1)} aria-label="Back"><Icon name="back" /></button>
      </div>
      {/* Itinerary runs the full page and scrolls behind the sticky sheet below. */}
      <div className="screen-body pad" style={{ paddingTop: 8, paddingBottom: 210 }}>
        <h1 className="t-hd-large">Your itinerary is ready</h1>
        <div className="t-p-small muted" style={{ marginTop: 4 }}>{TRIP.destination} · {TRIP.durationDays} days · {TRIP.dateRange}</div>

        <motion.div
          className="ready-preview" role="button" tabIndex={0}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          onClick={() => navigate('/trip?tab=itinerary')}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/trip?tab=itinerary') }}
        >
          <div className="ready-preview__page">
            {TRIP.days.map((day, di) => (
              <div key={day.label} style={{ marginTop: di ? 18 : 0 }}>
                <div className="day-label" style={{ fontSize: 12 }}>{day.label} · {day.date}</div>
                {day.stops.map((stop, si) => (
                  <div key={stop.id}>
                    <div className="stop" style={{ marginTop: si ? 8 : 10 }}>
                      <span className="stop__time">{stop.time || '—'}</span>
                      <div className="stop__body">
                        <div className="stop__name" style={{ fontSize: 15 }}>{stop.name}</div>
                        <div style={{ marginTop: 5 }}><CategoryPill category={stop.category} /></div>
                      </div>
                    </div>
                    {stop.transitAfter && (
                      <div className="transit">
                        <Icon name={stop.transitAfter.mode === 'walk' ? 'walk' : 'car'} size={15} />
                        {stop.transitAfter.mode} · {stop.transitAfter.mins} min
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sticky sheet — floats over the itinerary */}
      <div className="ready-sheet">
        <motion.div
          className="expert-card" style={{ marginBottom: 10 }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}
        >
          <span className="avwrap">
            <img className="expert-card__av" src={EXPERT.avatar} onError={onAvatarError} alt={EXPERT.name} />
            <span className="avwrap__flag">{EXPERT.flag}</span>
          </span>
          <div>
            <div className="t-lb-sm muted">Vetted by</div>
            <div className="t-hd-sm">{EXPERT.name}</div>
            <span className="expert-card__verify"><Icon name="check" size={13} />{EXPERT.title}</span>
          </div>
        </motion.div>
        <Button full variant="dark" onClick={() => navigate('/trip?tab=chat')}>Edit this itinerary</Button>
      </div>
    </Screen>
  )
}
