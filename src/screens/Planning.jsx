import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen } from '../components/Chrome.jsx'
import Icon from '../components/Icon.jsx'
import { useFlow } from '../state/FlowContext.jsx'
import { EXPERT, EXPERT_POOL, EXPERT_FALLBACK_LARGE, onAvatarError, buildPlanningTasks } from '../data/trip.js'

export default function Planning() {
  const navigate = useNavigate()
  const { answers } = useFlow()
  const tasks = useMemo(() => buildPlanningTasks(answers), [answers])

  // finding → assigned → planning (all on this screen)
  const [phase, setPhase] = useState('finding')
  const [faceIdx, setFaceIdx] = useState(0)
  const [done, setDone] = useState(0)

  // Phase 1 — flip through the expert pool, then land on Aanya.
  useEffect(() => {
    if (phase !== 'finding') return
    const cycle = setInterval(() => setFaceIdx((i) => (i + 1) % EXPERT_POOL.length), 420)
    const assign = setTimeout(() => setPhase('assigned'), 2600)
    return () => { clearInterval(cycle); clearTimeout(assign) }
  }, [phase])

  // Phase 2 — a short "expert assigned" beat…
  useEffect(() => {
    if (phase !== 'assigned') return
    const t = setTimeout(() => { setPhase('planning'); setDone(1) }, 1200)
    return () => clearTimeout(t)
  }, [phase])

  // Phase 3 — …then the checklist ticks through. Advancing is manual:
  // once everything is checked, a double-tap anywhere opens the ready screen.
  useEffect(() => {
    if (phase !== 'planning') return
    const timers = tasks.map((_, i) => setTimeout(() => setDone(i + 1), 1300 * (i + 1)))
    return () => timers.forEach(clearTimeout)
  }, [phase, tasks])

  const searching = phase === 'finding'
  const avatar = searching ? EXPERT_POOL[faceIdx] : EXPERT.avatar
  const allDone = phase === 'planning' && done >= tasks.length

  const lastTap = useRef(0)
  function handleTap() {
    if (!allDone) return
    const now = Date.now()
    if (now - lastTap.current < 350) navigate('/ready')
    lastTap.current = now
  }

  return (
    <Screen>
      <div className="pad" style={{ paddingTop: 8 }}>
        <button className="appbar__back" style={{ marginLeft: -8 }} onClick={() => navigate('/questions')} aria-label="Back"><Icon name="back" /></button>
      </div>
      <div
        className="screen-body pad"
        style={{ display: 'flex', flexDirection: 'column', paddingTop: 24, paddingBottom: 0 }}
        onPointerDown={handleTap}
      >
        <div className="plan-orb">
          {searching && (
            <motion.span
              className="plan-orb__pulse"
              animate={{ scale: [1, 1.18], opacity: [0.45, 0] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          )}
          <AnimatePresence mode="popLayout">
            <motion.img
              key={avatar} src={avatar} alt={searching ? 'Finding your expert' : EXPERT.name}
              data-fallback={EXPERT_FALLBACK_LARGE} onError={onAvatarError}
              initial={{ opacity: 0.2, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
            />
          </AnimatePresence>
          {!searching && <span className="plan-orb__flag">{EXPERT.flag}</span>}
        </div>

        <AnimatePresence mode="wait">
          {searching ? (
            <motion.h1
              key="finding" className="t-hd-med" style={{ marginTop: 26, textAlign: 'center' }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            >
              Finding you a local expert…
            </motion.h1>
          ) : (
            <motion.div
              key="expert" style={{ marginTop: 20, textAlign: 'center' }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className="t-lb-sm muted">Your local expert</div>
              <div className="t-hd-med" style={{ marginTop: 2 }}>{EXPERT.name}</div>
              <span className="expert-card__verify"><Icon name="check" size={13} />{EXPERT.title}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'planning' && (
          <>
            <motion.h2
              className="q-title q-title--sm" style={{ marginTop: 30 }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            >
              {EXPERT.name.split(' ')[0]} is planning your trip
            </motion.h2>
            <div style={{ marginTop: 8 }}>
              {tasks.map((t, i) => {
                const isDone = i < done
                return (
                  <motion.div
                    key={t} className="plan-check"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <span className={`plan-check__box${isDone ? ' is-on' : ''}`}>
                      {isDone && <Icon name="check" size={13} />}
                    </span>
                    <span className="t-p-med" style={{ color: isDone ? 'var(--content-primary)' : 'var(--content-secondary)' }}>{t}</span>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        <div className="spacer" />
        {phase === 'planning' && (
          <motion.div className="plan-eta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="plan-eta__icn"><Icon name="list" size={18} /></span>
            <div>
              <div className="t-shd-sm" style={{ fontWeight: 700 }}>Your itinerary will be ready in 6 business hrs</div>
              <div className="t-p-small" style={{ marginTop: 3 }}>Feel free to exit this screen — we'll send you a notification.</div>
            </div>
          </motion.div>
        )}
      </div>
    </Screen>
  )
}
