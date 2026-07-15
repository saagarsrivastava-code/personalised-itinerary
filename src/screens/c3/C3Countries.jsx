import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, AppBar } from '../../components/Chrome.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { rankedCountries, matchTags } from '../../data/c3.js'

export default function C3Countries() {
  const navigate = useNavigate()
  const { qual, setCountryKey } = useC3()
  const ranked = rankedCountries(qual)

  function open(key) {
    setCountryKey(key)
    navigate(`/c3/country/${key}`)
  }

  return (
    <Screen>
      <AppBar
        title="Where you should go"
        subtitle="Ranked for your vibe, budget and timing"
        onBack={() => navigate('/c3/q/2')}
      />

      <div className="screen-body pad" style={{ paddingTop: 8, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
        <div className="cgrid">
          {ranked.map(({ country }, i) => {
            const tags = matchTags(country, qual)
            return (
              <motion.button
                key={country.key}
                className="ccard"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
                onClick={() => open(country.key)}
              >
                <div className="ccard__photo" style={{ background: country.grad }}>
                  <img src={country.hero} alt="" loading="lazy" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  {i === 0 && <span className="ccard__best">Top match</span>}
                  <div className="ccard__scrim" />
                  <div className="ccard__name">{country.name}</div>
                </div>
                <div className="ccard__body">
                  <div className="ccard__matchline">
                    <span className="ccard__matchcount">{tags.length} matches</span>
                    <Icon name="arrowRight" size={14} style={{ color: 'var(--content-tertiary)' }} />
                  </div>
                  <div className="ccard__tags">
                    {tags.slice(0, 4).map((t) => (
                      <span key={t} className="ccard__tag">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}
