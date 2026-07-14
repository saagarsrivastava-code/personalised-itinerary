import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, AppBar } from '../../components/Chrome.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { getCountry, rankItineraries, inr, costTiles } from '../../data/c3.js'

export default function C3Itineraries() {
  const navigate = useNavigate()
  const { key } = useParams()
  const { qual, prefs } = useC3()

  const country = getCountry(key)
  if (!country) return <Navigate to="/c3/countries" replace />

  const list = rankItineraries(country, qual, prefs)

  return (
    <Screen>
      <AppBar
        title={`${country.name} itineraries`}
        subtitle={`${list.length} plans · tailored to you`}
        onBack={() => navigate(`/c3/country/${key}`)}
      />

      <div className="screen-body pad" style={{ paddingTop: 8, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
        {list.map((it, i) => {
          const stayTile = costTiles(it, key)[1]
          return (
            <motion.button
              key={it.id}
              className="itin-list-card"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.07 }}
              onClick={() => navigate(`/c3/trip/${key}/${it.id}`)}
            >
              <div className="itin-list-card__photo" style={{ background: it.grad }}>
                <img src={it.photo} alt="" loading="lazy" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <div className="itin-list-card__tags">
                  {it.tags.slice(0, 2).map((t) => <span key={t} className="itin-tag">{t}</span>)}
                </div>
                {i === 0 && <span className="itin-list-card__best">Best fit</span>}
              </div>
              <div className="itin-list-card__body">
                <div className="t-hd-sm">{it.title}</div>
                <div className="t-lb-sm muted" style={{ marginTop: 2 }}>{it.nights}</div>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
                  <div>
                    <div className="t-lb-sm muted">{stayTile.emoji} {stayTile.label}</div>
                    <div className="itin-list-card__price">Starting {inr(it.price)} <span>/pax</span></div>
                  </div>
                  <span className="itin-list-card__go"><Icon name="arrowRight" size={16} /></span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </Screen>
  )
}
