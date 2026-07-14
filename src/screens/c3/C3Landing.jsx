import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import Icon from '../../components/Icon.jsx'
import { SWIPE_CARDS } from '../../data/c3.js'

// Small fanned deck teasing the swipe interaction ahead.
const FAN = [
  { card: SWIPE_CARDS[3], rot: -9, x: -58, delay: 0.15 },
  { card: SWIPE_CARDS[0], rot: 7, x: 58, delay: 0.25 },
  { card: SWIPE_CARDS[2], rot: -1, x: 0, delay: 0.35 },
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
            style={{ font: '700 29px/1.28 var(--font-body)', letterSpacing: '-0.01em' }}
          >
            Want to go for a trip<br />but stuck on <span style={{ color: 'var(--brand-primary)' }}>where?</span>
          </motion.h1>
          <motion.p
            variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="t-p-med muted"
            style={{ marginTop: 12, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}
          >
            Answer a few quick questions — we'll turn them into final plans you can book.
          </motion.p>
        </motion.div>

        <div className="spacer" style={{ minHeight: 16 }} />

        {/* fanned swipe-card teaser */}
        <div className="fan">
          {FAN.map(({ card, rot, x, delay }) => (
            <motion.div
              key={card.key}
              className="fan__card"
              style={{ background: card.bg, color: card.tint }}
              initial={{ opacity: 0, y: 26, rotate: 0, x: 0 }}
              animate={{ opacity: 1, y: 0, rotate: rot, x }}
              transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon name={card.icon} size={30} stroke={1.6} />
              <span>{card.title}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ height: 28 }} />
        <Button full onClick={() => navigate('/c3/basics')}>Find my trip</Button>
      </div>
    </Screen>
  )
}
