import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { FLEXIBLE_MONTH } from '../data/c3.js'

const C3Context = createContext(null)

export function C3Provider({ children }) {
  // Phase 1 — qualitative (drives country recommendations)
  const [qual, setQual] = useState({
    who: 'Couple',          // optional
    vibes: ['relax'],       // multi-select
    budget: [50000, 150000],
    months: ['Apr'],
  })
  const setQ = useCallback((key, value) => setQual((q) => ({ ...q, [key]: value })), [])

  const toggleVibe = useCallback((key) => {
    setQual((q) => ({
      ...q,
      vibes: q.vibes.includes(key) ? q.vibes.filter((v) => v !== key) : [...q.vibes, key],
    }))
  }, [])

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
    duration: 'Short (4–6 days)',
    food: 'All cuisines',
    stays: ['4✭ Hotels'],
    transport: 'Private transfer',
    activities: [],
  })
  const setPref = useCallback((key, value) => setPrefs((p) => ({ ...p, [key]: value })), [])
  const toggleStay = useCallback((key) => {
    setPrefs((p) => ({
      ...p,
      stays: p.stays.includes(key) ? p.stays.filter((s) => s !== key) : [...p.stays, key],
    }))
  }, [])
  const toggleActivity = useCallback((key) => {
    setPrefs((p) => ({
      ...p,
      activities: p.activities.includes(key) ? p.activities.filter((a) => a !== key) : [...p.activities, key],
    }))
  }, [])

  // Which country the user drilled into
  const [countryKey, setCountryKey] = useState(null)

  const value = useMemo(
    () => ({
      qual, setQ, toggleMonth, toggleVibe,
      prefs, setPref, toggleStay, toggleActivity,
      countryKey, setCountryKey,
    }),
    [qual, setQ, toggleMonth, toggleVibe, prefs, setPref, toggleStay, toggleActivity, countryKey],
  )

  return <C3Context.Provider value={value}>{children}</C3Context.Provider>
}

export function useC3() {
  const ctx = useContext(C3Context)
  if (!ctx) throw new Error('useC3 must be used within C3Provider')
  return ctx
}
