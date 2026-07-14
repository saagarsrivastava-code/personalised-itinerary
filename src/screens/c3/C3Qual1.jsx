import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { WHO_OPTIONS, QUAL_VIBES, REASON_OPTIONS } from '../../data/c3.js'
import { QHead, QSection, Pill } from './qparts.jsx'

export default function C3Qual1() {
  const navigate = useNavigate()
  const { qual, setQ } = useC3()
  const ready = qual.who && qual.vibe && qual.reason

  return (
    <Screen>
      <QHead step={1} total={2} onBack={() => navigate('/c3')} />

      <div className="screen-body pad" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <QSection title="Who's travelling?" first>
            {WHO_OPTIONS.map((w) => (
              <Pill key={w} on={qual.who === w} onClick={() => setQ('who', w)}>{w}</Pill>
            ))}
          </QSection>

          <QSection title="What's the vibe you're after?">
            {QUAL_VIBES.map((v) => (
              <Pill key={v.key} on={qual.vibe === v.key} onClick={() => setQ('vibe', v.key)}>{v.label}</Pill>
            ))}
          </QSection>

          <QSection title="What's the reason for the trip?">
            {REASON_OPTIONS.map((r) => (
              <Pill key={r} on={qual.reason === r} onClick={() => setQ('reason', r)}>{r}</Pill>
            ))}
          </QSection>
        </motion.div>
      </div>

      <Footer>
        <Button full variant="dark" disabled={!ready} onClick={() => navigate('/c3/q/2')}>
          Next
        </Button>
      </Footer>
    </Screen>
  )
}
