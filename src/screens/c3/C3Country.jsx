import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { getCountry, matchCountry, weatherInsight } from '../../data/c3.js'

export default function C3Country() {
  const navigate = useNavigate()
  const { key } = useParams()
  const { qual, setCountryKey } = useC3()

  const country = getCountry(key)
  if (!country) return <Navigate to="/c3/countries" replace />

  const { reasons } = matchCountry(country, qual)
  const monthsText = country.bestMonths.slice(0, 4).join(', ')
  const weather = weatherInsight(country, qual.months)

  function viewItineraries() {
    setCountryKey(key)
    navigate('/c3/refine')
  }

  return (
    <Screen>
      <div className="screen-body" style={{ paddingBottom: 16 }}>
        <div className="detail-hero detail-hero--tall" style={{ background: country.grad }}>
          <img className="detail-hero__img" src={country.hero} alt="" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <div className="detail-hero__scrim" />
          <button className="detail-hero__back" onClick={() => navigate('/c3/countries')} aria-label="Back"><Icon name="back" size={22} /></button>
          <div className="detail-hero__cap">
            {country.country !== country.name && (
              <div className="t-lb-sm" style={{ color: 'rgba(255,255,255,0.82)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{country.country}</div>
            )}
            <h1 className="detail-hero__title">{country.name}</h1>
          </div>
        </div>

        <div className="pad" style={{ marginTop: 18 }}>
          <p className="t-p-med" style={{ color: 'var(--content-primary)' }}>{country.blurb}</p>

          {weather && (
            <div className="weather-note">
              <span className="weather-note__icn">{weather.emoji}</span>
              <span><b>{weather.month} — {weather.peak ? 'a great time to visit' : 'shoulder season'}.</b> Expect {weather.note}.</span>
            </div>
          )}

          <h2 className="t-hd-sm" style={{ marginTop: 22 }}>Why it's a match for you</h2>
          <div style={{ marginTop: 12 }}>
            {reasons.map((r, i) => (
              <motion.div
                key={r.title} className="matchrow"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05 + i * 0.06 }}
              >
                <span className="matchrow__tick"><Icon name="check" size={13} /></span>
                <div>
                  <div className="matchrow__title">{r.title}</div>
                  {r.detail && <div className="matchrow__detail">{r.detail}</div>}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <div className="detailrow">
              <div className="detailrow__left">
                <span className="detailrow__icn"><Icon name="calendar" size={16} /></span>
                <span className="detailrow__label">Best time to go</span>
              </div>
              <div className="detailrow__right"><span className="detailrow__value">{monthsText}</span></div>
            </div>
          </div>

        </div>
      </div>

      <div className="footer">
        <Button full onClick={viewItineraries}>Let's plan your trip</Button>
      </div>
    </Screen>
  )
}
