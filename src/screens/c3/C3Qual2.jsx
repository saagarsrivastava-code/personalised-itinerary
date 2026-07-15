import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../../components/Chrome.jsx'
import { Button } from '../../components/ui.jsx'
import { useC3 } from '../../state/C3Context.jsx'
import {
  BUDGET_MIN, BUDGET_MAX, BUDGET_STEP, budgetTier, inr,
  C3_MONTHS, FLEXIBLE_MONTH,
} from '../../data/c3.js'
import { QHead, QSection, Pill } from './qparts.jsx'

export default function C3Qual2() {
  const navigate = useNavigate()
  const { qual, setQ, toggleMonth } = useC3()
  const { budget, months } = qual
  const ready = months.length > 0

  return (
    <Screen>
      <QHead step={2} total={2} onBack={() => navigate('/c3/q/1')} />

      <div className="screen-body pad" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div style={{ marginTop: 4 }}>
            <h2 className="q-title q-title--sm">What's your budget per person?</h2>
            <div className="t-lb-sm muted" style={{ marginTop: 2 }}>Excludes flights</div>
            <BudgetRange value={budget} onChange={(v) => setQ('budget', v)} />
          </div>

          <QSection title="When are you planning to travel?">
            {C3_MONTHS.map((m) => (
              <Pill key={m} on={months.includes(m)} onClick={() => toggleMonth(m)}>{m}</Pill>
            ))}
            <Pill on={months.includes(FLEXIBLE_MONTH)} onClick={() => toggleMonth(FLEXIBLE_MONTH)}>{FLEXIBLE_MONTH}</Pill>
          </QSection>
        </motion.div>
      </div>

      <Footer>
        <Button full variant="dark" disabled={!ready} onClick={() => navigate('/c3/finding')}>
          Find my destinations
        </Button>
      </Footer>
    </Screen>
  )
}

function BudgetRange({ value, onChange }) {
  const [lo, hi] = value
  const pct = (v) => ((v - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100
  const setLo = (v) => onChange([Math.min(v, hi - BUDGET_STEP), hi])
  const setHi = (v) => onChange([lo, Math.max(v, lo + BUDGET_STEP)])

  return (
    <div style={{ marginTop: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="t-hd-sm">{inr(lo)} – {inr(hi)}</span>
        <span className="spend-tier">{budgetTier(value)}</span>
      </div>
      <div className="rslider" style={{ marginTop: 14 }}>
        <div className="rslider__track" />
        <div className="rslider__fill" style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        <input
          type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP}
          value={lo} onChange={(e) => setLo(Number(e.target.value))}
          aria-label="Minimum budget"
          style={{ zIndex: lo > (BUDGET_MIN + BUDGET_MAX) / 2 ? 4 : 3 }}
        />
        <input
          type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP}
          value={hi} onChange={(e) => setHi(Number(e.target.value))}
          aria-label="Maximum budget" style={{ zIndex: 3 }}
        />
      </div>
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <span className="t-lb-sm muted">{inr(BUDGET_MIN)}</span>
        <span className="t-lb-sm muted">{inr(BUDGET_MAX)}+</span>
      </div>
    </div>
  )
}
