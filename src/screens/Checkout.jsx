import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../components/Chrome.jsx'
import { Button } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { EXPERT, TRIP, CHECKOUT, CVPS, fmtINR, onAvatarError } from '../data/trip.js'

export default function Checkout() {
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)

  const subtotal = CHECKOUT.items.reduce((s, i) => s + i.amount, 0)
  const total = subtotal + CHECKOUT.taxes

  function pay() {
    setPaying(true)
    setTimeout(() => setPaying(false), 1600)
  }

  return (
    <Screen>
      <div className="pad" style={{ paddingTop: 8 }}>
        <button className="appbar__back" style={{ marginLeft: -8 }} onClick={() => navigate(-1)} aria-label="Back"><Icon name="back" /></button>
      </div>

      <div className="screen-body pad" style={{ paddingTop: 6, paddingBottom: 20 }}>
        <h1 className="t-hd-large">Review &amp; book</h1>

        {/* Trip summary */}
        <div className="card" style={{ padding: 14, marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="avwrap">
            <img className="expert-card__av" style={{ width: 48, height: 48 }} src={EXPERT.avatar} onError={onAvatarError} alt={EXPERT.name} />
            <span className="avwrap__flag">{EXPERT.flag}</span>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-hd-sm">{TRIP.title}</div>
            <div className="t-p-small muted" style={{ marginTop: 2 }}>{TRIP.durationDays} days · {TRIP.dateRange}</div>
            <span className="expert-card__verify"><Icon name="check" size={13} />Vetted by {EXPERT.name}</span>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="section-label">Cost breakdown</div>
        <div className="card" style={{ padding: '6px 14px' }}>
          {CHECKOUT.items.map((it) => (
            <div key={it.label} className="costrow">
              <div style={{ minWidth: 0 }}>
                <div className="t-p-med" style={{ fontWeight: 500 }}>{it.label}</div>
                <div className="t-lb-sm muted">{it.sub}</div>
              </div>
              <div className="t-p-med" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtINR(it.amount)}</div>
            </div>
          ))}
          <div className="costrow costrow--plain">
            <span className="t-p-med muted">Subtotal</span>
            <span className="t-p-med">{fmtINR(subtotal)}</span>
          </div>
          <div className="costrow costrow--plain">
            <span className="t-p-med muted">Taxes &amp; fees</span>
            <span className="t-p-med">{fmtINR(CHECKOUT.taxes)}</span>
          </div>
          <div className="costrow costrow--total">
            <span className="t-hd-sm">Total <span className="t-lb-sm muted">/ person</span></span>
            <span className="t-hd-sm">{fmtINR(total)}</span>
          </div>
        </div>

        {/* Value props */}
        <div className="section-label">Why book with Scapia</div>
        <div className="card" style={{ padding: '4px 14px' }}>
          {CVPS.map((c, i) => (
            <motion.div
              key={c.title} className="cvp"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            >
              <span className="cvp__icn"><Icon name={c.icon} size={20} /></span>
              <div>
                <div className="t-shd-sm">{c.title}</div>
                <div className="t-p-small muted" style={{ marginTop: 1 }}>{c.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div className="t-lb-sm muted">Total / person</div>
            <div className="t-hd-med">{fmtINR(total)}</div>
          </div>
          <div className="t-lb-sm muted" style={{ textAlign: 'right', maxWidth: 150 }}>
            Free cancellation up to 48 hrs before
          </div>
        </div>
        <Button full variant="dark" onClick={pay} disabled={paying}>
          {paying ? 'Processing…' : 'Confirm & pay'}
        </Button>
      </Footer>
    </Screen>
  )
}
