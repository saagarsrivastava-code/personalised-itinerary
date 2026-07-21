import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

  const genres = activitiesFor(country, qual)
  const chosen = prefs.activities

  // Genres matching the user's vibes open by default.
  const [open, setOpen] = useState(() =>
    new Set(genres.filter((g) => g.vibes.some((v) => qual.vibes.includes(v))).map((g) => g.key)),
  )
  const toggleOpen = (key) => setOpen((prev) => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

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
          <p className="t-p-small muted" style={{ marginTop: 4 }}>Optional — open a category and pick the experiences you'd like in your {country.name} plan.</p>

          <div style={{ marginTop: 18 }}>
            {genres.map((g) => {
              const isOpen = open.has(g.key)
              const pickedInGenre = g.items.filter((it) => chosen.includes(`${g.key}:${it}`)).length
              return (
                <div key={g.key} className={`acc${isOpen ? ' is-open' : ''}`}>
                  <button className="acc__head" onClick={() => toggleOpen(g.key)}>
                    <span className="acc__thumb" style={{ background: g.grad || 'var(--brand-dark)' }}>
                      <img src={g.img} alt="" loading="lazy" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    </span>
                    <span className="acc__label">
                      {g.label}
                      {pickedInGenre > 0 && <span className="acc__count">{pickedInGenre}</span>}
                    </span>
                    <span className="acc__chev"><Icon name="arrowDown" size={18} /></span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="acc__body"
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="acc__items">
                          {g.items.map((it) => {
                            const key = `${g.key}:${it}`
                            const on = chosen.includes(key)
                            return (
                              <button key={key} className={`acc-item${on ? ' is-sel' : ''}`} onClick={() => toggleActivity(key)}>
                                <span className={`acc-item__check${on ? ' is-on' : ''}`}>{on && <Icon name="check" size={12} />}</span>
                                {it}
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
