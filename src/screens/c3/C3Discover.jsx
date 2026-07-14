import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { Screen } from '../../components/Chrome.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { ALL_ITINERARIES, sortByMatch, inr, traitPills, costTiles } from '../../data/c3.js'

const SWIPE_DISTANCE = 90
const FLY_X = 640

export default function C3Discover() {
  const navigate = useNavigate()
  const { prefs, shortlist, addShortlist } = useC3()
  const topRef = useRef(null)

  // Order the whole pool so best matches to the chosen vibes come up first.
  // Pace nudges the ranking too: a packed pace favours "packed" trips, a
  // relaxed pace favours "wellness".
  const [deck] = useState(() => {
    const weights = [...prefs.vibes]
    if (prefs.pace >= 65) weights.push('packed')
    if (prefs.pace <= 35) weights.push('wellness')
    return sortByMatch(ALL_ITINERARIES, weights)
  })
  const [index, setIndex] = useState(0)
  const [pop, setPop] = useState(false) // shortlist-badge pop on save

  const done = index >= deck.length
  const count = shortlist.length

  function advance() { setIndex((i) => i + 1) }

  function handleDecided(it, liked) {
    if (liked) {
      addShortlist(it.dest, it.id)
      setPop(true)
      setTimeout(() => setPop(false), 420)
    }
    advance()
  }

  return (
    <Screen>
      {/* Header — back left, shortlist icon + count right */}
      <div className="pad discover-head">
        <button className="appbar__back" style={{ marginLeft: -8 }} onClick={() => navigate('/c3/vibes')} aria-label="Back"><Icon name="back" /></button>
        <div className="discover-head__title">
          <div className="t-hd-sm">Trips for you</div>
          <div className="t-lb-sm muted">Swipe right to shortlist</div>
        </div>
        <motion.button
          className="shortlist-btn"
          animate={pop ? { scale: [1, 1.28, 1] } : { scale: 1 }}
          transition={{ duration: 0.42 }}
          onClick={() => navigate('/c3/shortlist')}
          aria-label={`Shortlist, ${count} saved`}
        >
          <Icon name="bookmark" size={22} />
          {count > 0 && (
            <motion.span
              key={count}
              className="shortlist-btn__badge"
              initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              {count}
            </motion.span>
          )}
        </motion.button>
      </div>

      <div className="screen-body" style={{ display: 'flex', flexDirection: 'column', padding: '8px 20px calc(16px + env(safe-area-inset-bottom))' }}>
        <div className="itin-deck">
          {done ? (
            <div className="empty" style={{ height: '100%' }}>
              <span className="paywall__icn" style={{ width: 56, height: 56 }}><Icon name="bookmark" size={26} /></span>
              <div className="t-hd-sm">That's everything</div>
              <p className="t-p-small muted" style={{ maxWidth: 250 }}>
                {count > 0 ? `You shortlisted ${count} trip${count === 1 ? '' : 's'}.` : 'You didn’t shortlist any — swipe again?'}
              </p>
              <button className="btn btn--dark btn--md" onClick={() => (count > 0 ? navigate('/c3/shortlist') : setIndex(0))}>
                {count > 0 ? 'View shortlist' : 'Start over'}
              </button>
            </div>
          ) : (
            <>
              {deck.slice(index + 1, index + 3).reverse().map((it) => {
                const pos = deck.indexOf(it) - index
                return (
                  <motion.div
                    key={it.dest + it.id}
                    className="itin-card"
                    style={{ zIndex: 10 - pos }}
                    initial={false}
                    animate={{ scale: 1 - pos * 0.04, y: pos * 16 }}
                  >
                    <ItinFace it={it} />
                  </motion.div>
                )
              })}
              <TopCard
                key={deck[index].dest + deck[index].id}
                ref={topRef}
                it={deck[index]}
                onDecided={handleDecided}
                onOpen={() => navigate(`/c3/trip/${deck[index].dest}/${deck[index].id}`)}
              />
            </>
          )}
        </div>

        {!done && (
          <>
            <div className="swipe-actions">
              <button className="swipe-btn swipe-btn--nope" onClick={() => topRef.current?.fling(-1)} aria-label="Skip">
                <Icon name="close" size={20} />
              </button>
              <button className="swipe-btn swipe-btn--like" onClick={() => topRef.current?.fling(1)} aria-label="Shortlist">
                <Icon name="bookmark" size={18} />
              </button>
            </div>
            <div className="t-lb-sm muted center" style={{ marginTop: 10 }}>{index + 1} of {deck.length}</div>
          </>
        )}
      </div>
    </Screen>
  )
}

/* Top, draggable itinerary card. Owns its own motion values so nothing
   lingers on screen once the deck advances. */
const TopCard = forwardRef(function TopCard({ it, onDecided, onOpen }, ref) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-12, 12])
  const saveOpacity = useTransform(x, [30, 110], [0, 1])
  const skipOpacity = useTransform(x, [-110, -30], [1, 0])
  const leaving = useRef(false)

  function fling(dir) {
    if (leaving.current) return
    leaving.current = true
    let fired = false
    const finish = () => { if (fired) return; fired = true; onDecided(it, dir > 0) }
    animate(x, dir * FLY_X, { duration: 0.32, ease: [0.3, 0.7, 0.4, 1], onComplete: finish })
    setTimeout(finish, 500) // rAF throttling backstop
  }

  useImperativeHandle(ref, () => ({ fling }))

  function onDragEnd(_, info) {
    const dx = info.offset.x
    const dy = info.offset.y
    if (Math.abs(dx) > SWIPE_DISTANCE || (Math.abs(dx) > 30 && Math.abs(info.velocity.x) > 600)) {
      fling(dx + info.velocity.x * 0.2 > 0 ? 1 : -1)
    } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      // barely moved → it was a tap, not a swipe: open the full itinerary
      if (!leaving.current) onOpen()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 })
    }
  }

  return (
    <motion.div
      className="itin-card"
      style={{ x, rotate, zIndex: 10, cursor: 'pointer' }}
      drag="x" dragElastic={0.9} dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      onTap={(_, info) => { if (!leaving.current && Math.abs(info.offset?.x || 0) < 8) onOpen() }}
    >
      <ItinFace it={it}>
        <motion.span className="swipe-stamp swipe-stamp--like" style={{ opacity: saveOpacity }}>Shortlist</motion.span>
        <motion.span className="swipe-stamp swipe-stamp--nope" style={{ opacity: skipOpacity }}>Skip</motion.span>
      </ItinFace>
    </motion.div>
  )
})

function ItinFace({ it, children }) {
  return (
    <>
      <div className="itin-card__photo" style={{ background: it.grad }}>
        <img src={it.photo} alt="" loading="lazy" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
      </div>
      <div className="itin-card__fade" />
      {children}
      <div className="itin-card__tags">
        {traitPills(it).map((t, i) => <span key={i} className="itin-tag">{t}</span>)}
      </div>

      <div className="cost-strip">
        {costTiles(it, it.dest).map((c) => (
          <div key={c.label} className="cost-tile">
            <span className="cost-tile__emoji">{c.emoji}</span>
            <span className="cost-tile__value">{c.approx ? '~' : ''}{inr(c.value)}</span>
            <span className="cost-tile__label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="itin-card__foot">
        <h2 className="itin-card__title">{it.title}</h2>
        <div className="itin-card__price">Starting {inr(it.price)} /pax</div>
      </div>
    </>
  )
}
