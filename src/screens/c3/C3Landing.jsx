import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import Icon from '../../components/Icon.jsx'
import { COUNTRIES } from '../../data/c3.js'

// Fanned destination photos teasing the recommendations ahead.
const FAN = [
  { c: COUNTRIES[1], rot: -9, x: -62, delay: 0.15 }, // Thailand (left)
  { c: COUNTRIES[5], rot: 8, x: 62, delay: 0.25 },   // Maldives (right)
  { c: COUNTRIES[0], rot: -1, x: 0, delay: 0.35 },   // Bali (front)
]

export default function C3Landing() {
  const navigate = useNavigate()

  return (
    <Screen>
      <div className="screen-body pad" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
        <div style={{ paddingTop: 14 }} className="wordmark">
          <span className="wordmark__dot"><Icon name="compass" size={17} /></span>
          <span className="wordmark__name">scapia<span> trips</span></span>
        </div>

        <motion.div
          initial="hide" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
          style={{ marginTop: 'auto', paddingTop: 36, textAlign: 'center' }}
        >
          <motion.h1
            variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            style={{ font: '700 30px/1.28 var(--font-body)', letterSpacing: '-0.01em' }}
          >
            Not sure <span style={{ color: 'var(--brand-primary)' }}>where to go?</span>
          </motion.h1>
          <motion.p
            variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="t-p-med muted"
            style={{ marginTop: 12, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}
          >
            Answer a few quick questions and find a destination you'll love.
          </motion.p>
        </motion.div>

        <div className="spacer" style={{ minHeight: 16 }} />

        {/* fanned destination-photo teaser */}
        <div className="fan">
          {FAN.map(({ c, rot, x, delay }) => (
            <motion.div
              key={c.key}
              className="fan__photo"
              style={{ background: c.grad }}
              initial={{ opacity: 0, y: 26, rotate: 0, x: 0 }}
              animate={{ opacity: 1, y: 0, rotate: rot, x }}
              transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={c.hero} alt="" draggable="false" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <span className="fan__label">{c.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="t-lb-sm muted center" style={{ marginTop: 16 }}>
          Matched to your vibe — with the reasons why.
        </div>
        <div style={{ height: 16 }} />
        <Button full onClick={() => navigate('/c3/q/1')}>Find my destination</Button>
      </div>
    </Screen>
  )
}
