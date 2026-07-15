import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import { WHO_OPTIONS, QUAL_VIBES } from '../../data/c3.js'
import { QHead, Pill } from './qparts.jsx'

export default function C3Qual1() {
  const navigate = useNavigate()
  const { qual, setQ, toggleVibe } = useC3()
  const ready = qual.vibes.length > 0

  return (
    <Screen>
      <QHead step={1} total={2} onBack={() => navigate('/c3')} />

      <div className="screen-body pad" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div style={{ marginTop: 4 }}>
            <div className="row" style={{ gap: 8, alignItems: 'baseline' }}>
              <h2 className="q-title q-title--sm">Who's travelling?</h2>
              <span className="q-optional">Optional</span>
            </div>
            <div className="chips" style={{ marginTop: 12 }}>
              {WHO_OPTIONS.map((w) => (
                <Pill key={w} on={qual.who === w} onClick={() => setQ('who', qual.who === w ? '' : w)}>{w}</Pill>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <h2 className="q-title q-title--sm">What's the vibe you're after?</h2>
            <div className="chips" style={{ marginTop: 12 }}>
              {QUAL_VIBES.map((v) => (
                <Pill key={v.key} on={qual.vibes.includes(v.key)} onClick={() => toggleVibe(v.key)}>{v.label}</Pill>
              ))}
            </div>
          </div>
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
