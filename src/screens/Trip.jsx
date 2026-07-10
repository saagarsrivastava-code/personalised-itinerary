import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen } from '../components/Chrome.jsx'
import { Button, CategoryPill, Sheet } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { EXPERT, TRIP, onAvatarError } from '../data/trip.js'

const FREE_MESSAGES = 100
const SEED = [
  { from: 'them', text: 'Hi Rahul, let me know how can I help you improve your itinerary' },
]

// Scripted itinerary edits — each chat request applies the next one, with a
// matching reply from the expert. Cycles when exhausted.
const CHANGES = [
  {
    prompt: 'Swap Wat Chalong for something quieter?',
    stopId: 's5',
    patch: { name: 'Freedom Beach (quiet cove)', category: 'nature' },
    reply: 'Done — swapped Wat Chalong for Freedom Beach, a quiet cove most tourists miss. Take a look 👇',
  },
  {
    prompt: 'Can Big Buddha be earlier? I want to avoid the crowds',
    stopId: 's1',
    patch: { time: '08:30' },
    reply: "Moved Big Buddha to 08:30 — you'll beat the tour-bus crowds. Updated on your plan 👇",
  },
  {
    prompt: 'Add a good dinner spot on Day 1',
    insertAfter: 's2',
    stop: { id: 's9', time: '20:00', name: 'Suay Restaurant', category: 'food' },
    reply: 'Added Suay for dinner on Day 1 — book ahead, it fills up. Check the itinerary 👇',
  },
]

const FREE_EDITS = 2

export default function Trip() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(searchParams.get('tab') === 'chat')
  const [days, setDays] = useState(TRIP.days)
  const [updatedId, setUpdatedId] = useState(null)
  const [changesDone, setChangesDone] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const changeIdx = useRef(0)

  function nextChange() {
    const c = CHANGES[changeIdx.current % CHANGES.length]
    changeIdx.current += 1
    return c
  }

  // Called by the chat once the expert's reply has landed: close the sheet,
  // then animate the edit into the list.
  function scheduleApply(change) {
    setTimeout(() => setChatOpen(false), 900)
    setTimeout(() => {
      setDays((prev) => prev.map((day) => {
        if (change.patch) {
          return { ...day, stops: day.stops.map((s) => (s.id === change.stopId ? { ...s, ...change.patch, updated: true } : s)) }
        }
        const at = day.stops.findIndex((s) => s.id === change.insertAfter)
        if (at === -1) return day
        const stops = [...day.stops]
        stops.splice(at + 1, 0, { ...change.stop, updated: true })
        return { ...day, stops }
      }))
      const id = change.stopId || change.stop.id
      setUpdatedId(id)
      setChangesDone((n) => n + 1)
      setTimeout(() => document.getElementById(`stop-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
      setTimeout(() => setUpdatedId(null), 3000)
    }, 1400)
  }

  return (
    <Screen>
      {/* Header — trip identity on top, price + book CTA in a row below */}
      <div className="trip-head trip-head--v2">
        <div className="trip-head__top">
          <h1 className="t-hd-large">{TRIP.title}</h1>
          <div className="t-p-small muted" style={{ marginTop: 2 }}>{TRIP.durationDays} days · {TRIP.dateRange}</div>
        </div>
        <div className="trip-head__book">
          <div>
            <div className="t-lb-sm muted">Total / person</div>
            <div className="t-hd-sm">{TRIP.price}</div>
          </div>
          <Button variant="dark" size="md" onClick={() => navigate('/checkout')}>Proceed to book</Button>
        </div>
      </div>

      {/* Itinerary editor */}
      <div className="screen-body pad" style={{ paddingTop: 16, paddingBottom: 110 }}>
        {days.map((day, di) => (
          <div key={day.label} style={{ marginTop: di ? 24 : 0 }}>
            <div className="day-label">{day.label} · {day.date}</div>
            <div className="col" style={{ marginTop: 10 }}>
              {day.stops.map((stop, si) => (
                <motion.div
                  key={stop.id} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: updatedId ? 0 : (di * 3 + si) * 0.05, duration: 0.25 }}
                >
                  <div className={`stop${stop.updated ? ' stop--edited' : ''}${updatedId === stop.id ? ' is-updated' : ''}`} id={`stop-${stop.id}`} style={{ marginTop: si ? 8 : 0 }}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={stop.time || '—'} className="stop__time"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        {stop.time || '—'}
                      </motion.span>
                    </AnimatePresence>
                    <div className="stop__body">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={stop.name}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.28 }}
                        >
                          <div className="stop__name">{stop.name}</div>
                          <div className="row" style={{ gap: 6, marginTop: 5 }}>
                            <CategoryPill category={stop.category} />
                            {stop.updated && <span className="badge badge--new">Updated by {EXPERT.name.split(' ')[0]}</span>}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <button className="stop__edit" aria-label={`Edit ${stop.name}`}><Icon name="pencil" size={16} /></button>
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

      {/* Floating chat CTA */}
      {!chatOpen && (
        <motion.button
          className="fab fab--ext"
          initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26, delay: 0.2 }}
          onClick={() => setChatOpen(true)}
        >
          <Icon name="chat" size={20} />
          Customise your itinerary with {EXPERT.name.split(' ')[0]}
        </motion.button>
      )}

      <ChatSheet
        open={chatOpen} onClose={() => setChatOpen(false)}
        nextChange={nextChange} onApplied={scheduleApply}
        suggestion={CHANGES[changeIdx.current % CHANGES.length].prompt}
        blocked={changesDone >= FREE_EDITS && !unlocked}
        onUnlock={() => setUnlocked(true)}
      />
    </Screen>
  )
}

/* ── Chat sheet over the itinerary ────────────────────────────── */
function ChatSheet({ open, onClose, nextChange, onApplied, suggestion, blocked, onUnlock }) {
  const [msgs, setMsgs] = useState(SEED)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [paying, setPaying] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const sent = msgs.filter((m) => m.from === 'me').length
  const left = Math.max(0, FREE_MESSAGES - sent)

  // Auto-grow the composer so the full message stays visible. Add the border
  // delta (offset − client) so border-box sizing doesn't clip the last line.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    const border = el.offsetHeight - el.clientHeight
    el.style.height = `${Math.min(el.scrollHeight + border, 120)}px`
  }, [text, open])

  // Pre-fill the composer with the upcoming scripted request whenever the
  // sheet opens empty — the tester just hits send (or types over it).
  useEffect(() => {
    if (open && !blocked && suggestion) setText((t) => (t.trim() ? t : suggestion))
  }, [open, blocked, suggestion])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, typing, open, blocked])

  function send() {
    const t = text.trim()
    if (!t || left === 0 || blocked) return
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setText('')
    setTyping(true)
    const change = nextChange()
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'them', text: change.reply }])
      onApplied(change)
    }, 1300)
  }

  function pay() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      onUnlock()
      setMsgs((m) => [...m, { from: 'them', text: "You're all set 🎉 The ₹499 will be deducted from your package price when you book. What should we tweak next?" }])
    }, 1400)
  }

  return (
    <Sheet open={open} onClose={onClose} height="64%">
      <div className="msgs-strip">{blocked ? 'Free expert edits used' : `${left} free messages remaining`}</div>

      <div className="chat-msgs" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className="row" style={{ gap: 8, alignItems: 'flex-end', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            {m.from === 'them' && <img src={EXPERT.avatar} onError={onAvatarError} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />}
            <div className={`bubble bubble--${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="row" style={{ gap: 8, alignItems: 'flex-end' }}>
            <img src={EXPERT.avatar} onError={onAvatarError} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
            <div className="bubble bubble--them bubble--typing"><span /><span /><span /></div>
          </div>
        )}
      </div>

      {blocked ? (
        <motion.div className="paywall" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <span className="paywall__icn"><Icon name="lock" size={20} /></span>
          <div className="t-hd-sm" style={{ marginTop: 8 }}>Keep planning with {EXPERT.name.split(' ')[0]}</div>
          <p className="t-p-small muted" style={{ marginTop: 4 }}>
            Free edits used. ₹499 to continue — included in your package cost when you book.
          </p>
          <div style={{ marginTop: 12 }}>
            <Button full variant="dark" onClick={pay} disabled={paying}>
              {paying ? 'Processing…' : 'Continue for ₹499'}
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="chat-input">
          <button className="chat-mic" aria-label="Voice message"><Icon name="mic" size={19} /></button>
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={left === 0 ? 'You’re out of free messages' : `Message ${EXPERT.name.split(' ')[0]}…`}
            disabled={left === 0}
          />
          <button className="chat-send" onClick={send} aria-label="Send"><Icon name="send" size={20} /></button>
        </div>
      )}
    </Sheet>
  )
}
