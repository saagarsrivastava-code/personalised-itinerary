import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, animate } from 'framer-motion'
import { Screen, AppBar } from '../../components/Chrome.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { rankedCountries, matchTags, compareMatrix, weatherInsight } from '../../data/c3.js'

export default function C3Countries() {
  const navigate = useNavigate()
  const { qual, setCountryKey } = useC3()
  const ranked = useMemo(() => rankedCountries(qual).slice(0, 3), [qual])
  const byKey = useMemo(() => Object.fromEntries(ranked.map((r) => [r.country.key, r])), [ranked])
  const bestKey = ranked[0]?.country.key

  const [order, setOrder] = useState(ranked.map((r) => r.country.key))
  const [view, setView] = useState('cards')
  const topRef = useRef(null)

  function open(key) { setCountryKey(key); navigate(`/c3/country/${key}`) }
  function cycle() { setOrder((prev) => [...prev.slice(1), prev[0]]) }

  return (
    <Screen>
      <AppBar
        title="Where you should go"
        subtitle={view === 'cards' ? undefined : 'How each stacks up to your picks'}
        onBack={() => navigate('/c3/q/2')}
        right={
          <button className="viewtoggle" onClick={() => setView((v) => (v === 'cards' ? 'compare' : 'cards'))}>
            <Icon name={view === 'cards' ? 'list' : 'compass'} size={15} />
            {view === 'cards' ? 'Compare' : 'Cards'}
          </button>
        }
      />

      {view === 'cards' ? (
        <div className="screen-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 20px calc(16px + env(safe-area-inset-bottom))' }}>
          <div className="cdeck">
            {order.slice(0, 3).map((key) => {
              const pos = order.indexOf(key)
              if (pos === 0) {
                return <TopCard key={key} ref={topRef} r={byKey[key]} bestKey={bestKey} onCycle={cycle} onOpen={() => open(key)} />
              }
              const lean = pos === 1 ? { rotate: 4.5, x: 16 } : { rotate: -5.5, x: -18 }
              return (
                <motion.div
                  key={key} className="cdeck-card" style={{ zIndex: 10 - pos }} initial={false}
                  animate={{ scale: 1 - pos * 0.05, y: pos * 7, ...lean }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <CountryFace r={byKey[key]} bestKey={bestKey} />
                </motion.div>
              )
            })}
          </div>
          <div className="cdeck-hint">
            <button className="cdeck-nav" onClick={() => topRef.current?.fling(-1)} aria-label="Skip left"><Icon name="arrowLeft" size={18} /></button>
            <span>Swipe or tap a card to explore</span>
            <button className="cdeck-nav" onClick={() => topRef.current?.fling(1)} aria-label="Skip right"><Icon name="arrowRight" size={18} /></button>
          </div>
        </div>
      ) : (
        <CompareView ranked={ranked} qual={qual} onOpen={open} />
      )}
    </Screen>
  )
}

/* ── Full-page country card; swipe tucks it to the back of the deck ── */
const TopCard = forwardRef(function TopCard({ r, bestKey, onCycle, onOpen }, ref) {
  // Mount at the same transform the card had while sitting at the back of the
  // stack (pos 1 lean), then animate forward — so it glides in, no jump.
  const x = useMotionValue(16)
  const y = useMotionValue(7)
  const scale = useMotionValue(0.95)
  const opacity = useMotionValue(0.9)
  const rotate = useMotionValue(4.5)
  const [behind, setBehind] = useState(false)
  const leaving = useRef(false)

  useEffect(() => {
    const o = { duration: 0.36, ease: [0.22, 1, 0.36, 1] }
    const a = [animate(x, 0, o), animate(y, 0, o), animate(scale, 1, o), animate(rotate, 0, o), animate(opacity, 1, { duration: 0.3 })]
    return () => a.forEach((v) => v.stop())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function fling(dir) {
    if (leaving.current) return
    leaving.current = true
    setBehind(true) // drop below the stack so it reads as going under
    let done = false
    const finish = () => { if (done) return; done = true; onCycle() }
    const o = { duration: 0.36, ease: [0.4, 0, 0.2, 1] }
    animate(x, dir * 40, o)
    animate(rotate, dir * 7, o)
    animate(scale, 0.78, o)
    animate(opacity, 0.3, o)
    animate(y, 34, { ...o, onComplete: finish })
    setTimeout(finish, 560)
  }
  useImperativeHandle(ref, () => ({ fling }))

  function onDrag(_, info) { rotate.set(info.offset.x / 24) }

  function onDragEnd(_, info) {
    if (Math.abs(info.offset.x) > 90 || (Math.abs(info.offset.x) > 30 && Math.abs(info.velocity.x) > 600)) {
      fling(info.offset.x > 0 ? 1 : -1)
    } else if (Math.abs(info.offset.x) < 8 && Math.abs(info.offset.y) < 8) {
      if (!leaving.current) onOpen()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 })
      animate(rotate, 0, { type: 'spring', stiffness: 420, damping: 32 })
    }
  }

  return (
    <motion.div
      className="cdeck-card" style={{ x, y, scale, opacity, rotate, zIndex: behind ? 1 : 20, cursor: 'pointer' }}
      drag={behind ? false : 'x'} dragElastic={0.9} dragConstraints={{ left: 0, right: 0 }}
      onDrag={onDrag} onDragEnd={onDragEnd} onTap={(_, info) => { if (!leaving.current && Math.abs(info.offset?.x || 0) < 8) onOpen() }}
    >
      <CountryFace r={r} top bestKey={bestKey} />
    </motion.div>
  )
})

function CountryFace({ r, top, bestKey }) {
  const { country } = r
  const { qual } = useC3()
  const tags = matchTags(country, qual)
  const perfect = top && country.key === bestKey
  const weather = weatherInsight(country, qual.months)
  return (
    <>
      <div className="cdeck-card__photo" style={{ background: country.grad }}>
        <img src={country.hero} alt="" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
      </div>
      <div className="cdeck-card__scrim" />
      {perfect && <span className="cdeck-card__badge">✦ Perfect match</span>}
      <div className="cdeck-card__foot">
        {country.country !== country.name && (
          <div className="t-lb-sm" style={{ color: 'rgba(255,255,255,0.82)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{country.country}</div>
        )}
        <h2 className="cdeck-card__name">{country.name}</h2>
        {weather && (
          <div className="cdeck-weather">
            <span className="cdeck-weather__icn">{weather.emoji}</span>
            <span><b>{weather.month}:</b> {weather.note}</span>
          </div>
        )}
        <div className="cdeck-card__reason">Why it's a match</div>
        <div className="cdeck-card__tags">
          {tags.slice(0, 4).map((t) => <span key={t} className="cdeck-tag">{t}</span>)}
        </div>
      </div>
    </>
  )
}

/* ── Comparison table ──────────────────────────────────────────── */
function CompareView({ ranked, qual, onOpen }) {
  const m = compareMatrix(qual, ranked)
  return (
    <div className="screen-body pad" style={{ paddingTop: 8, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
      <div className="cmp-scroll">
        <div className="cmp" style={{ gridTemplateColumns: `1.25fr repeat(${m.cols.length}, minmax(58px, 1fr))` }}>
          <div className="cmp__corner" />
          {m.cols.map((c, i) => (
            <button key={c.key} className={`cmp__head${i === 0 ? ' is-best' : ''}`} onClick={() => onOpen(c.key)}>
              <span className="cmp__thumb" style={{ background: c.grad }}>
                <img src={c.hero} alt="" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </span>
              <span className="cmp__name">{c.name}</span>
            </button>
          ))}

          {m.criteria.map((label, ri) => (
            <div className="cmp__row" style={{ display: 'contents' }} key={label}>
              <div className="cmp__crit">{label}</div>
              {m.cols.map((c) => (
                <div key={c.key} className={`cmp__cell${c.cells[ri] ? ' is-yes' : ''}`}>
                  {c.cells[ri] ? <Icon name="check" size={15} /> : <span className="cmp__dash">–</span>}
                </div>
              ))}
            </div>
          ))}

          <div className="cmp__crit cmp__crit--total">Matches</div>
          {m.cols.map((c) => (
            <div key={c.key} className="cmp__cell cmp__cell--total">{c.score}</div>
          ))}
        </div>
      </div>
      <div className="t-lb-sm muted center" style={{ marginTop: 14 }}>Tap a destination to explore it</div>
    </div>
  )
}
