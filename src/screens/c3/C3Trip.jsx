import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen } from '../../components/Chrome.jsx'
import { Button, CategoryPill, Sheet } from '../../components/ui.jsx'
import Icon from '../../components/Icon.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { getCountry, getItinerary, inr, traitPills, costTiles, monthsLabel } from '../../data/c3.js'

// Scripted AI edits — each applies to the live day list and cycles.
const AI_ACTIONS = [
  {
    prompt: 'Make the first morning more relaxed',
    reply: "Done — I pushed your first stop to a gentler start so you're not rushing at dawn. Locals rarely go early anyway 👇",
    apply: (days) => {
      const d = days.map((x) => ({ ...x, stops: x.stops.map((s) => ({ ...s })) }))
      const s = d[0].stops[0]; s.time = '10:00'; s.updated = true
      return { days: d, id: `0-0` }
    },
  },
  {
    prompt: 'Add a standout local dinner',
    reply: "Added a dinner our experts rate highly — small, family-run, always booked out. I've reserved the slot on day 1 👇",
    apply: (days) => {
      const d = days.map((x) => ({ ...x, stops: x.stops.map((s) => ({ ...s })) }))
      d[0].stops.push({ time: '20:00', name: 'Local expert’s dinner pick', category: 'food', updated: true })
      return { days: d, id: `0-${d[0].stops.length - 1}` }
    },
  },
  {
    prompt: 'Swap something touristy for a hidden gem',
    reply: "Swapped a busy spot for a quieter one our experts love — same vibe, a fraction of the crowd 👇",
    apply: (days) => {
      const d = days.map((x) => ({ ...x, stops: x.stops.map((s) => ({ ...s })) }))
      const last = d[d.length - 1]; const s = last.stops[last.stops.length - 1]
      s.name = 'Hidden local favourite'; s.category = 'hidden'; s.updated = true
      return { days: d, id: `${d.length - 1}-${last.stops.length - 1}` }
    },
  },
]

export default function C3Trip() {
  const navigate = useNavigate()
  const { dest, id } = useParams()
  const { qual, countryKey } = useC3()

  const country = getCountry(dest)
  const itinerary = getItinerary(dest, id)
  const [days, setDays] = useState(() => (itinerary ? itinerary.days.map((d) => ({ ...d, stops: d.stops.map((s) => ({ ...s })) })) : []))
  const [bookOpen, setBookOpen] = useState(false)
  const [booked, setBooked] = useState(false)
  const [paying, setPaying] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [editStop, setEditStop] = useState(null) // { di, si }
  const [editName, setEditName] = useState('')
  const [updatedId, setUpdatedId] = useState(null)

  if (!country || !itinerary) return <Navigate to="/c3/countries" replace />

  const tiles = costTiles(itinerary, dest)
  const total = tiles.reduce((s, t) => s + t.value, 0)

  function confirm() {
    setPaying(true)
    setTimeout(() => { setPaying(false); setBooked(true) }, 1400)
  }

  function openEdit(di, si) {
    setEditStop({ di, si })
    setEditName(days[di].stops[si].name)
  }
  function saveEdit() {
    const { di, si } = editStop
    setDays((prev) => prev.map((d, i) => i !== di ? d : { ...d, stops: d.stops.map((s, j) => j !== si ? s : { ...s, name: editName, updated: true }) }))
    setUpdatedId(`${di}-${si}`)
    setEditStop(null)
    setTimeout(() => setUpdatedId(null), 2600)
  }

  function applyAI(action) {
    const { days: next, id: uid } = action.apply(days)
    setDays(next)
    setUpdatedId(uid)
    setTimeout(() => document.getElementById(`c3stop-${uid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120)
    setTimeout(() => setUpdatedId(null), 2800)
  }

  return (
    <Screen>
      <div className="screen-body" style={{ paddingBottom: 16 }}>
        <div className="detail-hero detail-hero--tall" style={{ background: itinerary.grad }}>
          <img className="detail-hero__img" src={itinerary.photo} alt="" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <div className="detail-hero__scrim" />
          <button className="detail-hero__back" onClick={() => navigate(`/c3/itineraries/${dest}`)} aria-label="Back"><Icon name="back" size={22} /></button>
          <div className="detail-hero__tags">
            {traitPills(itinerary).map((t, i) => <span key={i} className="itin-tag">{t}</span>)}
          </div>
          <div className="detail-hero__cap">
            <div className="t-lb-sm" style={{ color: 'rgba(255,255,255,0.82)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{country.name}</div>
            <h1 className="detail-hero__title">{itinerary.title}</h1>
            <div className="t-p-small" style={{ color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{itinerary.tag} · {itinerary.nights}</div>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="pad" style={{ marginTop: 18 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 className="t-hd-sm">What you'll pay</h2>
            <span className="t-lb-sm muted">per person</span>
          </div>
          <div className="cost-grid" style={{ marginTop: 12 }}>
            {tiles.map((c) => (
              <div key={c.label} className="cost-cell">
                <span className="cost-cell__emoji">{c.emoji}</span>
                <div>
                  <div className="cost-cell__label">{c.label}</div>
                  <div className="cost-cell__value">{c.approx ? '~' : ''}{inr(c.value)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="cost-total">
            <span>Estimated total</span>
            <b>{inr(total)} <span className="muted" style={{ fontWeight: 400 }}>/pax</span></b>
          </div>
        </div>

        {/* Day-by-day (each stop editable) */}
        <div className="pad" style={{ marginTop: 22 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 className="t-hd-sm">Day by day</h2>
            <span className="t-lb-sm muted">tap ✎ to edit a stop</span>
          </div>
          {days.map((day, di) => (
            <div key={di} style={{ marginTop: di ? 24 : 14 }}>
              <div className="day-label">{day.label} · {day.date}</div>
              <div className="col" style={{ marginTop: 10 }}>
                {day.stops.map((stop, si) => (
                  <motion.div key={`${di}-${si}-${stop.name}`} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <div className={`stop${updatedId === `${di}-${si}` ? ' is-updated' : ''}`} id={`c3stop-${di}-${si}`} style={{ marginTop: si ? 8 : 0 }}>
                      <span className="stop__time">{stop.time || '—'}</span>
                      <div className="stop__body">
                        <div className="stop__name">{stop.name}</div>
                        <div className="row" style={{ gap: 6, marginTop: 5 }}>
                          <CategoryPill category={stop.category} />
                          {stop.updated && <span className="badge badge--new">Updated</span>}
                        </div>
                      </div>
                      <button className="stop__edit" aria-label={`Edit ${stop.name}`} onClick={() => openEdit(di, si)}><Icon name="pencil" size={16} /></button>
                    </div>
                    {stop.transitAfter && (
                      <div className="transit">
                        <Icon name={stop.transitAfter.mode === 'walk' ? 'walk' : stop.transitAfter.mode === 'metro' ? 'metro' : 'car'} size={15} />
                        {stop.transitAfter.mode} · {stop.transitAfter.mins} min
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI chat FAB */}
      {!chatOpen && (
        <motion.button
          className="fab fab--ai" aria-label="Chat with the AI trip designer"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26, delay: 0.2 }}
          onClick={() => setChatOpen(true)}
        >
          <Icon name="sparkle" size={24} />
          <span className="fab__label">Ask AI</span>
        </motion.button>
      )}

      <div className="footer">
        <Button full onClick={() => setBookOpen(true)}>Book this trip on scapia</Button>
      </div>

      {/* Booking sheet */}
      <Sheet open={bookOpen} onClose={() => setBookOpen(false)} height="56%">
        {booked ? (
          <div className="empty" style={{ minHeight: 240 }}>
            <motion.span className="celebrate__tick" style={{ width: 56, height: 56 }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 20 }}>
              <Icon name="check" size={26} />
            </motion.span>
            <div className="t-hd-med">Trip booked 🎉</div>
            <p className="t-p-small muted" style={{ maxWidth: 280 }}>
              Your {country.name} plan is locked in for {monthsLabel(qual.months)}. Tickets and vouchers land on your scapia app.
            </p>
            <Button variant="soft" onClick={() => { setBookOpen(false); navigate('/c3') }}>Back to start</Button>
          </div>
        ) : (
          <>
            <div className="t-hd-med" style={{ paddingTop: 6 }}>Book this trip</div>
            <p className="t-p-small muted" style={{ marginTop: 3 }}>{itinerary.tag} · {itinerary.nights} · {qual.who}</p>
            <div className="card" style={{ marginTop: 16 }}>
              <div className="bookrow"><span>Package ({qual.who.toLowerCase()})</span><b>{inr(itinerary.price)} /pax</b></div>
              <div className="bookrow"><span>Scapia coins on booking</span><b style={{ color: 'var(--success-green-500)' }}>+{Math.round(itinerary.price / 20).toLocaleString('en-IN')}</b></div>
              <div className="bookrow"><span>Pay today to hold</span><b>{inr(999)}</b></div>
            </div>
            <p className="t-lb-sm muted" style={{ marginTop: 12 }}>Free cancellation for 48 hours. Zero forex markup with your scapia card.</p>
            <div style={{ marginTop: 16 }}>
              <Button full variant="dark" onClick={confirm} disabled={paying}>{paying ? 'Processing…' : `Hold for ${inr(999)}`}</Button>
            </div>
          </>
        )}
      </Sheet>

      {/* Per-stop edit sheet */}
      <Sheet open={!!editStop} onClose={() => setEditStop(null)} height="42%">
        <div className="t-hd-med" style={{ paddingTop: 6 }}>Edit stop</div>
        <p className="t-p-small muted" style={{ marginTop: 3 }}>Rename this stop or swap it for your own pick.</p>
        <input
          className="textbox" style={{ marginTop: 14, minHeight: 0, padding: 14 }}
          value={editName} onChange={(e) => setEditName(e.target.value)}
          placeholder="Stop name" autoFocus
        />
        <div style={{ marginTop: 16 }}>
          <Button full variant="dark" disabled={!editName.trim()} onClick={saveEdit}>Save change</Button>
        </div>
      </Sheet>

      <ChatSheet open={chatOpen} onClose={() => setChatOpen(false)} country={country} onApply={applyAI} />
    </Screen>
  )
}

/* ── AI trip-designer chat ─────────────────────────────────────── */
function ChatSheet({ open, onClose, country, onApply }) {
  const seed = [{ from: 'ai', text: `Hi! I'm your AI trip designer — I've learned from hundreds of ${country.name} trips our destination experts have built. Want me to tweak anything?` }]
  const [msgs, setMsgs] = useState(seed)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const idx = useRef(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, typing, open])

  function send(preset, chosen) {
    const t = (preset ?? text).trim()
    if (!t) return
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setText('')
    setTyping(true)
    // Use the tapped suggestion's action; free-text cycles through them.
    const action = chosen || AI_ACTIONS[idx.current % AI_ACTIONS.length]
    idx.current += 1
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'ai', text: action.reply }])
      onApply(action)
      setTimeout(() => onClose(), 1100)
    }, 1300)
  }

  return (
    <Sheet open={open} onClose={onClose} height="66%">
      <div className="chat-head">
        <span className="chat-head__ai"><Icon name="sparkle" size={20} /></span>
        <div>
          <div className="t-hd-sm">AI trip designer</div>
          <div className="chat-head__status"><span className="dot-online" /> Trained on our {country.name} experts' trips</div>
        </div>
      </div>

      <div className="chat-msgs" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className="row" style={{ gap: 8, alignItems: 'flex-end', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            {m.from === 'ai' && <span className="chat-msg-ai"><Icon name="sparkle" size={14} /></span>}
            <div className={`bubble bubble--${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="row" style={{ gap: 8, alignItems: 'flex-end' }}>
            <span className="chat-msg-ai"><Icon name="sparkle" size={14} /></span>
            <div className="bubble bubble--them bubble--typing"><span /><span /><span /></div>
          </div>
        )}
      </div>

      {msgs.length <= 1 && (
        <div className="chips" style={{ padding: '4px 2px 10px' }}>
          {AI_ACTIONS.map((a) => (
            <button key={a.prompt} className="chip" onClick={() => send(a.prompt, a)}>{a.prompt}</button>
          ))}
        </div>
      )}

      <div className="chat-input">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }} placeholder="Ask for a change…" />
        <button className="chat-send" onClick={() => send()} aria-label="Send"><Icon name="send" size={20} /></button>
      </div>
    </Sheet>
  )
}
