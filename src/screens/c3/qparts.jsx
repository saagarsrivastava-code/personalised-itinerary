// Shared bits for the question screens.

export function QHead({ step, total, onBack }) {
  return (
    <div className="pad" style={{ paddingTop: 8 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="appbar__back" style={{ marginLeft: -8 }} onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <span className="t-p-small muted">{step} of {total}</span>
        <span style={{ width: 30 }} />
      </div>
      <div style={{ marginTop: 12 }}><Stepper current={step} total={total} /></div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

function Stepper({ current, total }) {
  return (
    <div className="stepper">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`stepper__seg${i < current ? ' is-on' : ''}`} />
      ))}
    </div>
  )
}

export function QSection({ title, first, children }) {
  return (
    <div style={{ marginTop: first ? 4 : 28 }}>
      <h2 className="q-title q-title--sm">{title}</h2>
      <div className="chips" style={{ marginTop: 12 }}>{children}</div>
    </div>
  )
}

export function Pill({ on, onClick, children }) {
  return (
    <button className={`chip${on ? ' is-sel' : ''}`} onClick={onClick}>
      {children}{on ? ' ✓' : ''}
    </button>
  )
}
