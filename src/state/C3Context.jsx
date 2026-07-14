import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { FLEXIBLE_MONTH } from '../data/c3.js'

const C3Context = createContext(null)

export function C3Provider({ children }) {
  // Phase 1 — qualitative (drives country recommendations)
  const [qual, setQual] = useState({
    who: 'Couple',
    vibe: 'relax',
    reason: 'Vacation',
    budget: [50000, 150000],
    duration: 'Short (4–6 days)',
    months: ['Apr'],
    weather: 'beach',
  })
  const setQ = useCallback((key, value) => setQual((q) => ({ ...q, [key]: value })), [])

  const toggleMonth = useCallback((m) => {
    setQual((q) => {
      if (m === FLEXIBLE_MONTH) {
        return { ...q, months: q.months.includes(FLEXIBLE_MONTH) ? [] : [FLEXIBLE_MONTH] }
      }
      const base = q.months.filter((x) => x !== FLEXIBLE_MONTH)
      return { ...q, months: base.includes(m) ? base.filter((x) => x !== m) : [...base, m] }
    })
  }, [])

  // Phase 2 — quantitative (refines itineraries within a country)
  const [prefs, setPrefs] = useState({
    pace: 50,
    food: 'All cuisines',
    stays: ['4✭ Hotels'],
    transport: 'Private transfer',
  })
  const setPref = useCallback((key, value) => setPrefs((p) => ({ ...p, [key]: value })), [])
  const toggleStay = useCallback((key) => {
    setPrefs((p) => ({
      ...p,
      stays: p.stays.includes(key) ? p.stays.filter((s) => s !== key) : [...p.stays, key],
    }))
  }, [])

  // Which country the user drilled into
  const [countryKey, setCountryKey] = useState(null)

  const value = useMemo(
    () => ({
      qual, setQ, toggleMonth,
      prefs, setPref, toggleStay,
      countryKey, setCountryKey,
    }),
    [qual, setQ, toggleMonth, prefs, setPref, toggleStay, countryKey],
  )

  return <C3Context.Provider value={value}>{children}</C3Context.Provider>
}

export function useC3() {
  const ctx = useContext(C3Context)
  if (!ctx) throw new Error('useC3 must be used within C3Provider')
  return ctx
}
