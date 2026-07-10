// Dummy data for the prototype — Phuket & Krabi, Thailand, 5 days.
// Photos: Unsplash CDN (keyless, ?w=… sized). Swap for licensed assets before release.

const IMG = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

export const CATEGORIES = {
  food:      { label: 'Food',      color: 'var(--cat-food)' },
  culture:   { label: 'Culture',   color: 'var(--cat-culture)' },
  nature:    { label: 'Nature',    color: 'var(--cat-nature)' },
  stay:      { label: 'Stay',      color: 'var(--cat-stay)' },
  transport: { label: 'Transport', color: 'var(--cat-transport)' },
}

// The expert-built itinerary shown on the trip screen.
export const TRIP = {
  destination: 'Thailand',
  title: 'Your trip to Thailand',
  durationDays: 5,
  dateRange: 'Mon 14 – Fri 18 Dec',
  price: '₹50,000',
  origin: 'Bengaluru',
  days: [
    {
      label: 'Day 1 — Phuket',
      date: 'Mon 14 Dec',
      stops: [
        { id: 's1', time: '09:30', name: 'Big Buddha Phuket', category: 'culture', transitAfter: { mode: 'walk', mins: 13 } },
        { id: 's2', time: '13:00', name: 'Blue Elephant Restaurant', category: 'food', transitAfter: { mode: 'car', mins: 18 } },
        { id: 's3', time: null, name: 'Kata Beach Resort & Spa', category: 'stay' },
      ],
    },
    {
      label: 'Day 2 — Phuket',
      date: 'Tue 15 Dec',
      stops: [
        { id: 's4', time: '09:00', name: 'Phi Phi Islands Day Tour', category: 'nature', transitAfter: { mode: 'car', mins: 9 } },
        { id: 's5', time: '13:30', name: 'Wat Chalong', category: 'culture', transitAfter: { mode: 'car', mins: 22 } },
        { id: 's6', time: '19:30', name: 'Bangla Road Night Market', category: 'food' },
      ],
    },
    {
      label: 'Day 3 — Krabi',
      date: 'Wed 16 Dec',
      stops: [
        { id: 's7', time: '10:00', name: 'Railay Beach Viewpoint', category: 'nature', transitAfter: { mode: 'walk', mins: 6 } },
        { id: 's8', time: '15:00', name: 'Wat Tham Suea (Tiger Cave Temple)', category: 'culture' },
      ],
    },
  ],
}

// ── Checkout — per-person cost breakdown (items + taxes = ₹50,000) ──
export const CHECKOUT = {
  items: [
    { label: 'Flights · return', sub: 'Bengaluru ⇄ Phuket', amount: 22000 },
    { label: 'Stays · 4 nights', sub: 'Kata Beach Resort & Spa', amount: 13500 },
    { label: 'Activities & entries', sub: '6 experiences', amount: 6000 },
    { label: 'Local transfers', sub: 'Airport + intercity', amount: 3000 },
    { label: 'Expert planning fee', sub: 'Vetted by Linh', amount: 499 },
  ],
  taxes: 5001,
}
export const fmtINR = (n) => `₹${n.toLocaleString('en-IN')}`

// Three core value props shown at checkout.
export const CVPS = [
  { icon: 'shield', title: 'Price-match guarantee', desc: "Find this trip cheaper elsewhere and we'll match it." },
  { icon: 'sparkle', title: 'Scapia promise', desc: 'Every stop vetted by a local expert — or your money back.' },
  { icon: 'phone', title: 'On-trip assistance', desc: '24×7 support from India for anything you need on the ground.' },
]

// Asset base — respects Vite's configured base so paths work on the
// GitHub Pages project subpath (…/itinerary-scorer-app/) and in local dev.
export const ASSET_BASE = import.meta.env.BASE_URL

// Local travel experts who vet and edit the itinerary.
// Linh's photo lives at public/linh.png; stock stand-in only if it goes missing.
export const EXPERT = {
  name: 'Linh Fa',
  title: 'Thai travel expert, living in Bangkok',
  flag: '🇹🇭',
  avatar: `${ASSET_BASE}linh.png`,
}
export const EXPERT_FALLBACK = IMG('1573496359142-b8d87734a5a2', 200) + '&crop=faces'
export const EXPERT_FALLBACK_LARGE = IMG('1573496359142-b8d87734a5a2', 600) + '&crop=faces'
export function onAvatarError(e) {
  const img = e.currentTarget
  if (img.src.endsWith('linh.png')) img.src = img.dataset.fallback || EXPERT_FALLBACK
}
export const EXPERTS = [
  EXPERT,
  {
    name: 'Rohit Menon',
    title: 'Bali & Vietnam expert',
    avatar: IMG('1507003211169-0a1dd7228f2d', 200) + '&crop=faces',
  },
]

// Faces cycled through on the "finding you a local expert" screen.
export const EXPERT_POOL = [
  IMG('1507003211169-0a1dd7228f2d', 200) + '&crop=faces',
  IMG('1438761681033-6461ffad8d80', 200) + '&crop=faces',
  IMG('1500648767791-00dcc994a43e', 200) + '&crop=faces',
  IMG('1544005313-94ddf0286df2', 200) + '&crop=faces',
]

// ── Ideas screen — ways to add what you've planned so far ───────
export const UPLOAD_TILES = [
  { key: 'documents', icon: 'doc', label: 'upload documents' },
  { key: 'images', icon: 'image', label: 'upload images' },
  { key: 'reels', icon: 'reel', label: 'instagram reels' },
  { key: 'screenshot', icon: 'screenshot', label: 'screenshot' },
  { key: 'blogs', icon: 'link', label: 'blog links' },
  { key: 'video', icon: 'play', label: 'yt video' },
]

// ── Questionnaire (3 screens: basics, preferences, food & notes) ─
export const QUESTIONS_TOTAL = 3

export const FOOD_PREFS = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Jain', 'No preference']

export const PARTY = ['Solo', 'Partner', 'Friends', 'Family (kids)', 'With my parents', 'Group (5+)']

export const DURATIONS = ['2–3 days', '4–6 days', '1–2 weeks', '2+ weeks']

export const MONTH_FLEXIBLE = "I'm flexible"
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
  MONTH_FLEXIBLE,
]

export const VIBES = [
  'Food & dining', 'Culture & history', 'Hidden gems', 'Nature & outdoors', 'Nightlife',
  'Shopping', 'Wellness', 'Adventure', 'Local life', 'Popular landmarks',
]
export const VIBES_MAX = 3

// Total for the whole trip, per person. `short` keeps the pills compact.
export const BUDGETS = [
  { key: 'Budget', label: 'Budget', range: 'under ₹30,000', short: 'under ₹30k' },
  { key: 'Mid-range', label: 'Mid-range', range: '₹30,000–60,000', short: '₹30k–60k' },
  { key: 'Comfortable', label: 'Comfortable', range: '₹60,000–1,00,000', short: '₹60k–1L' },
  { key: 'Luxury', label: 'Luxury', range: '₹1,00,000+', short: '₹1L+' },
]

// ── Planning screen — checklist derived from stated preferences ─
const VIBE_TASKS = {
  'Food & dining': 'Shortlisting places to eat worth planning a day around',
  'Culture & history': 'Weaving in the temples and old towns worth your time',
  'Hidden gems': 'Digging up hidden gems locals actually go to',
  'Nature & outdoors': 'Finding the beaches and trails that fit your route',
  'Nightlife': 'Scoping out the best evenings and night markets',
  'Shopping': 'Mapping the markets and shopping streets',
  'Wellness': 'Slotting in downtime, spas and slow mornings',
  'Adventure': 'Lining up the adventure activities worth booking ahead',
  'Local life': 'Picking corners where you can live like a local',
  'Popular landmarks': 'Timing the big landmarks to dodge the crowds',
}

export function buildPlanningTasks({ budget, pace, vibes, month, food }) {
  const tasks = []
  const b = BUDGETS.find((x) => x.key === budget) || BUDGETS[1]
  tasks.push(`Sorting through hotels for ${b.label.toLowerCase()} budget`)
  if (month === MONTH_FLEXIBLE) tasks.push('Finding the cheapest weeks to travel')
  else if (month) tasks.push(`Checking prices and weather for ${month}`)
  tasks.push(pace <= 50 ? 'Crafting a route which is not rushed' : 'Packing your days without wasting time in transit')
  if (food && food !== 'No preference') tasks.push(`Making sure every stop has solid ${food.toLowerCase()} options`)
  ;(vibes.length ? vibes : ['Popular landmarks']).slice(0, 1).forEach((v) => {
    if (VIBE_TASKS[v]) tasks.push(VIBE_TASKS[v])
  })
  return tasks
}
