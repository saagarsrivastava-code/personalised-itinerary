// Concept 3 — two-phase flow. Dummy data only.
// Phase 1 (qualitative) → recommended countries. Phase 2 (quantitative) → itineraries.

const PHOTO = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`
export const inr = (n) => '₹' + n.toLocaleString('en-IN')

// ── Phase 1 · qualitative questions ─────────────────────────────
export const WHO_OPTIONS = ['Solo', 'Couple', 'Family with kids', 'Friends group']

export const QUAL_VIBES = [
  { key: 'relax', label: 'Relax & unwind' },
  { key: 'adventure', label: 'Adventure & outdoors' },
  { key: 'culture', label: 'Culture & history' },
  { key: 'food', label: 'Food & nightlife' },
  { key: 'nature', label: 'Nature & wildlife' },
  { key: 'wellness', label: 'Wellness & reset' },
]
export const QUAL_VIBE_LABEL = Object.fromEntries(QUAL_VIBES.map((v) => [v.key, v.label]))

export const REASON_OPTIONS = [
  'Honeymoon', 'Vacation', 'Staycation', 'Workation',
  'Bachelor / ette', 'Solo trip', 'Birthday / Anniversary',
]

export const DURATION_OPTIONS = [
  'Weekend (2–3 days)', 'Short (4–6 days)', 'Week+ (7–10 days)', 'Extended (10+ days)',
]

export const WEATHER_OPTIONS = [
  { key: 'beach', label: 'Beach & warm' },
  { key: 'mountains', label: 'Cool & mountains' },
  { key: 'mild', label: 'Pleasant & mild' },
  { key: 'any', label: 'Don’t mind, surprise me' },
]
export const WEATHER_LABEL = Object.fromEntries(WEATHER_OPTIONS.map((w) => [w.key, w.label]))

export const C3_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
export const FLEXIBLE_MONTH = "I'm flexible"
export function monthsLabel(months) {
  if (!months || !months.length || months.includes(FLEXIBLE_MONTH)) return 'flexible dates'
  return months.join(', ')
}

// Budget per person (excl. flights), ₹ — two-grabber slider.
export const BUDGET_MIN = 20000
export const BUDGET_MAX = 300000
export const BUDGET_STEP = 5000
export function budgetTier([lo, hi]) {
  const mid = (lo + hi) / 2
  if (mid < 50000) return 'Budget'
  if (mid < 120000) return 'Mid-range'
  if (mid < 200000) return 'Comfortable'
  return 'Luxury'
}
function budgetBandOf([lo, hi]) {
  const mid = (lo + hi) / 2
  if (mid < 50000) return 'low'
  if (mid < 120000) return 'mid'
  return 'high'
}

// ── Phase 2 · quantitative questions ────────────────────────────
export const FOOD_OPTIONS = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'All cuisines']
export const STAY_OPTIONS = ['3✭ Hotels', '4✭ Hotels', '5✭ Hotels', 'Boutique stays', 'Homestays', 'Hostels']
export const TRANSPORT_OPTIONS = ['Public transport', 'Private transfer']

// maps a qualitative vibe to itinerary traits, for ranking within a country
const VIBE_TO_TRAIT = {
  relax: 'wellness', adventure: 'adventure', culture: 'culture',
  food: 'food', nature: 'nature', wellness: 'wellness',
}

// ── Itinerary + country data ────────────────────────────────────
const st = (time, name, category, transitAfter = null) => ({ time, name, category, transitAfter })
const tr = (mode, mins) => ({ mode, mins })

export const COUNTRIES = [
  {
    key: 'bali', name: 'Bali', country: 'Indonesia',
    hero: PHOTO('1573790387438-4da905039392'), grad: 'linear-gradient(160deg, #2E5D3E, #14361f)',
    vibes: ['relax', 'nature', 'wellness', 'food'],
    weather: ['beach'], bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'],
    budgetBand: 'mid', goodFor: ['Couple', 'Solo', 'Friends group'],
    reasons: ['Honeymoon', 'Vacation', 'Solo trip', 'Bachelor / ette'],
    blurb: 'Rice terraces, temple towns and beach clubs — Bali flexes from barefoot-luxe to backpacker without missing a beat.',
    itineraries: [
      {
        id: 'b1', title: 'Bali adventure tales', tag: 'Adventure based', tags: ['🏄 Adventure', '🌳 Nature'], traits: ['adventure', 'nature', 'packed'],
        photo: PHOTO('1573790387438-4da905039392'), grad: 'linear-gradient(160deg, #2E5D3E, #14361f)', price: 40300, nights: '5N · Ubud + Kintamani',
        days: [
          { label: 'Day 1 — Ubud', date: 'Mon 13 Apr', stops: [
            st('06:00', 'Mount Batur sunrise trek', 'nature', tr('car', 45)),
            st('11:30', 'Tegalalang rice terrace swing', 'nature', tr('car', 20)),
            st('19:00', 'Ubud night warung crawl', 'food'),
          ]},
          { label: 'Day 2 — Nusa Penida', date: 'Tue 14 Apr', stops: [
            st('08:00', 'Kelingking cliff hike', 'nature', tr('car', 25)),
            st('13:00', 'Crystal Bay snorkelling', 'nature', tr('car', 30)),
            st('18:30', 'Beach BBQ at Jungut Batu', 'food'),
          ]},
        ],
      },
      {
        id: 'b2', title: 'Flavours of Bali', tag: 'Food based', tags: ['🍜 Food', '💎 Hidden gems'], traits: ['food', 'hidden', 'culture'],
        photo: PHOTO('1567337710282-00832b415979'), grad: 'linear-gradient(160deg, #8A3B1E, #3d1a0d)', price: 38900, nights: '5N · Ubud + Seminyak',
        days: [
          { label: 'Day 1 — Ubud', date: 'Mon 13 Apr', stops: [
            st('09:30', 'Ubud traditional market walk', 'food', tr('walk', 10)),
            st('12:30', 'Balinese cooking class, Laplapan', 'food', tr('car', 15)),
            st('19:00', 'Babi guling at Ibu Oka', 'food'),
          ]},
          { label: 'Day 2 — Seminyak', date: 'Tue 14 Apr', stops: [
            st('10:00', 'Pasar Badung spice tour', 'food', tr('car', 20)),
            st('18:00', 'Sunset seafood at Jimbaran Bay', 'food'),
          ]},
        ],
      },
      {
        id: 'b3', title: 'Slow mornings in Bali', tag: 'Chill trip', tags: ['🧘 Wellness', '🌳 Nature'], traits: ['wellness', 'nature'],
        photo: PHOTO('1604999565976-8913ad2ddb7c'), grad: 'linear-gradient(160deg, #1E6E63, #0c3029)', price: 45200, nights: '5N · Ubud + Uluwatu',
        days: [
          { label: 'Day 1 — Ubud', date: 'Mon 13 Apr', stops: [
            st('10:00', 'Morning yoga at The Yoga Barn', 'nature', tr('walk', 12)),
            st('14:00', 'Balinese spa & flower bath', 'stay', tr('walk', 6)),
            st('18:00', 'Slow dinner overlooking rice fields', 'food'),
          ]},
          { label: 'Day 2 — Uluwatu', date: 'Tue 14 Apr', stops: [
            st('11:00', 'Padang Padang beach morning', 'nature', tr('car', 15)),
            st('17:30', 'Uluwatu temple sunset', 'culture'),
          ]},
        ],
      },
    ],
  },
  {
    key: 'thailand', name: 'Thailand', country: 'Thailand',
    hero: PHOTO('1552465011-b4e21bf6e79a'), grad: 'linear-gradient(160deg, #8A3B1E, #3d1a0d)',
    vibes: ['food', 'relax', 'adventure', 'nature'],
    weather: ['beach'], bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    budgetBand: 'mid', goodFor: ['Friends group', 'Couple', 'Solo'],
    reasons: ['Bachelor / ette', 'Vacation', 'Solo trip', 'Birthday / Anniversary'],
    blurb: 'Street-food capitals, island-hopping and legendary nights — Thailand is the easiest big trip you’ll ever plan.',
    itineraries: [
      {
        id: 't1', title: 'Thailand street eats', tag: 'Food based', tags: ['🍜 Food', '🌙 Nightlife'], traits: ['food', 'nightlife', 'hidden'],
        photo: PHOTO('1504674900247-0877df9cc836'), grad: 'linear-gradient(160deg, #8A3B1E, #3d1a0d)', price: 52000, nights: '5N · Bangkok + Phuket',
        days: [
          { label: 'Day 1 — Bangkok', date: 'Mon 13 Apr', stops: [
            st('10:00', 'Khlong Toei wet market walk', 'food', tr('metro', 15)),
            st('13:00', 'Michelin street food, Chinatown', 'food', tr('walk', 10)),
            st('20:00', 'Rooftop bars, Sukhumvit', 'food'),
          ]},
          { label: 'Day 2 — Phuket', date: 'Tue 14 Apr', stops: [
            st('12:00', 'Old Town café crawl', 'food', tr('walk', 8)),
            st('19:30', 'Bangla Road night market', 'food'),
          ]},
        ],
      },
      {
        id: 't2', title: 'Andaman island hop', tag: 'Island hopping', tags: ['🌳 Nature', '🏄 Adventure'], traits: ['nature', 'adventure'],
        photo: PHOTO('1552465011-b4e21bf6e79a'), grad: 'linear-gradient(160deg, #1E7E8A, #0c353d)', price: 58000, nights: '5N · Phuket + Krabi',
        days: [
          { label: 'Day 1 — Phuket', date: 'Mon 13 Apr', stops: [
            st('08:30', 'Phi Phi + Maya Bay speedboat', 'nature', tr('car', 20)),
            st('16:00', 'Kata Noi sunset swim', 'nature'),
          ]},
          { label: 'Day 2 — Krabi', date: 'Tue 14 Apr', stops: [
            st('09:00', 'Railay beach + lagoon hike', 'nature', tr('walk', 15)),
            st('14:30', '4-island longtail tour', 'nature'),
          ]},
        ],
      },
    ],
  },
  {
    key: 'vietnam', name: 'Vietnam', country: 'Vietnam',
    hero: PHOTO('1528127269322-539801943592'), grad: 'linear-gradient(160deg, #8A6A1E, #3d2e0d)',
    vibes: ['culture', 'food', 'adventure', 'nature'],
    weather: ['mild'], bestMonths: ['Feb', 'Mar', 'Apr', 'Oct', 'Nov'],
    budgetBand: 'low', goodFor: ['Solo', 'Friends group', 'Couple'],
    reasons: ['Solo trip', 'Vacation', 'Bachelor / ette'],
    blurb: 'Lantern-lit old towns, motorbike passes and bowls of pho at dawn — Vietnam rewards the curious on any budget.',
    itineraries: [
      {
        id: 'v1', title: 'Old town Vietnam', tag: 'Culture & food', tags: ['🛕 Culture', '🍜 Food'], traits: ['culture', 'food', 'hidden'],
        photo: PHOTO('1528127269322-539801943592'), grad: 'linear-gradient(160deg, #8A6A1E, #3d2e0d)', price: 47000, nights: '5N · Hanoi + Hoi An',
        days: [
          { label: 'Day 1 — Hanoi', date: 'Mon 13 Apr', stops: [
            st('09:00', 'Old Quarter walking tour', 'culture', tr('walk', 10)),
            st('13:00', 'Bun cha at Huong Lien', 'food', tr('walk', 12)),
            st('19:00', 'Train street egg coffee', 'food'),
          ]},
          { label: 'Day 2 — Hoi An', date: 'Tue 14 Apr', stops: [
            st('10:00', 'Ancient town + lantern quarter', 'culture', tr('walk', 8)),
            st('18:30', 'Riverside night market dinner', 'food'),
          ]},
        ],
      },
      {
        id: 'v2', title: 'Northern Vietnam loop', tag: 'Adventure north', tags: ['🏄 Adventure', '🌳 Nature'], traits: ['adventure', 'nature', 'packed'],
        photo: PHOTO('1470240731273-7821a6eeb6bd'), grad: 'linear-gradient(160deg, #2E5D3E, #14361f)', price: 51000, nights: '5N · Ha Giang + Ha Long',
        days: [
          { label: 'Day 1 — Ha Giang', date: 'Mon 13 Apr', stops: [
            st('08:00', 'Ha Giang loop by motorbike', 'nature', tr('car', 30)),
            st('16:00', 'Ma Pi Leng pass viewpoint', 'nature'),
          ]},
          { label: 'Day 2 — Ha Long', date: 'Tue 14 Apr', stops: [
            st('09:30', 'Kayaking through Luon cave', 'nature', tr('walk', 10)),
            st('14:00', 'Ti Top island summit climb', 'nature'),
          ]},
        ],
      },
    ],
  },
  {
    key: 'africa', name: 'Africa', country: 'Kenya · South Africa',
    hero: PHOTO('1516426122078-c23e76319801'), grad: 'linear-gradient(160deg, #8A5A1E, #3d270d)',
    vibes: ['nature', 'adventure'],
    weather: ['mild'], bestMonths: ['Jul', 'Aug', 'Sep', 'Oct'],
    budgetBand: 'high', goodFor: ['Couple', 'Family with kids'],
    reasons: ['Honeymoon', 'Vacation', 'Birthday / Anniversary'],
    blurb: 'Big-Five game drives, balloon safaris and wild coastlines — the trip that quietly outranks every other you take.',
    itineraries: [
      {
        id: 'a1', title: 'The great Mara safari', tag: 'Safari classic', tags: ['🌳 Nature', '📍 Landmarks'], traits: ['nature', 'landmarks', 'adventure'],
        photo: PHOTO('1516426122078-c23e76319801'), grad: 'linear-gradient(160deg, #8A5A1E, #3d270d)', price: 148000, nights: '6N · Masai Mara + Nairobi',
        days: [
          { label: 'Day 1 — Masai Mara', date: 'Mon 13 Apr', stops: [
            st('06:00', 'Sunrise game drive (Big Five)', 'nature', tr('car', 30)),
            st('13:00', 'Bush lunch at camp', 'food', tr('car', 20)),
            st('16:30', 'Evening drive — river crossing', 'nature'),
          ]},
          { label: 'Day 2 — Masai Mara', date: 'Tue 14 Apr', stops: [
            st('05:30', 'Hot-air balloon over the Mara', 'nature', tr('car', 25)),
            st('15:00', 'Maasai village visit', 'culture'),
          ]},
        ],
      },
      {
        id: 'a3', title: 'Zanzibar slow days', tag: 'Chill coastal', tags: ['🧘 Wellness', '🌳 Nature'], traits: ['wellness', 'nature'],
        photo: PHOTO('1509233725247-49e657c54213'), grad: 'linear-gradient(160deg, #1E7E8A, #0c353d)', price: 132000, nights: '6N · Zanzibar',
        days: [
          { label: 'Day 1 — Zanzibar', date: 'Mon 13 Apr', stops: [
            st('10:30', 'Nungwi beach morning', 'nature', tr('walk', 8)),
            st('15:00', 'Seaside spa session', 'stay', tr('walk', 5)),
            st('18:30', 'Rooftop dinner, Stone Town', 'food'),
          ]},
          { label: 'Day 2 — Zanzibar', date: 'Tue 14 Apr', stops: [
            st('11:00', 'Mnemba lagoon sandbank picnic', 'nature'),
          ]},
        ],
      },
    ],
  },
  {
    key: 'japan', name: 'Japan', country: 'Japan',
    hero: PHOTO('1493976040374-85c8e12f0c0e'), grad: 'linear-gradient(160deg, #7A2B4E, #351122)',
    vibes: ['culture', 'food', 'nature'],
    weather: ['mild', 'mountains'], bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
    budgetBand: 'high', goodFor: ['Couple', 'Solo', 'Family with kids'],
    reasons: ['Honeymoon', 'Vacation', 'Birthday / Anniversary'],
    blurb: 'Neon cities, temple gardens and the world’s best food at every price point — precise, polite and endlessly deep.',
    itineraries: [
      {
        id: 'j1', title: 'Tokyo to Kyoto classics', tag: 'Culture & food', tags: ['🛕 Culture', '🍜 Food'], traits: ['culture', 'food', 'landmarks'],
        photo: PHOTO('1493976040374-85c8e12f0c0e'), grad: 'linear-gradient(160deg, #7A2B4E, #351122)', price: 168000, nights: '7N · Tokyo + Kyoto',
        days: [
          { label: 'Day 1 — Tokyo', date: 'Mon 13 Apr', stops: [
            st('09:00', 'Tsukiji outer market breakfast', 'food', tr('metro', 20)),
            st('13:00', 'Senso-ji + Asakusa lanes', 'culture', tr('metro', 25)),
            st('19:00', 'Omoide Yokocho izakaya night', 'food'),
          ]},
          { label: 'Day 3 — Kyoto', date: 'Wed 15 Apr', stops: [
            st('08:00', 'Fushimi Inari at dawn', 'culture', tr('metro', 30)),
            st('14:00', 'Arashiyama bamboo grove', 'nature'),
          ]},
        ],
      },
      {
        id: 'j2', title: 'Japan alps & onsen', tag: 'Nature & reset', tags: ['🌳 Nature', '🧘 Wellness'], traits: ['nature', 'wellness', 'adventure'],
        photo: PHOTO('1526481280693-3bfa7568e0f3'), grad: 'linear-gradient(160deg, #1E5A8A, #0d2a3d)', price: 175000, nights: '7N · Hakone + Takayama',
        days: [
          { label: 'Day 1 — Hakone', date: 'Mon 13 Apr', stops: [
            st('11:00', 'Lake Ashi & Mt Fuji views', 'nature', tr('car', 20)),
            st('16:00', 'Private onsen ryokan check-in', 'stay'),
          ]},
          { label: 'Day 3 — Takayama', date: 'Wed 15 Apr', stops: [
            st('09:00', 'Old town morning market', 'food', tr('walk', 10)),
            st('13:00', 'Shirakawa-go village day trip', 'culture'),
          ]},
        ],
      },
    ],
  },
  {
    key: 'maldives', name: 'Maldives', country: 'Maldives',
    hero: PHOTO('1514282401047-d79a71a590e8'), grad: 'linear-gradient(160deg, #1E7E8A, #0c353d)',
    vibes: ['relax', 'wellness'],
    weather: ['beach'], bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    budgetBand: 'high', goodFor: ['Couple'],
    reasons: ['Honeymoon', 'Birthday / Anniversary', 'Vacation'],
    blurb: 'Overwater villas, house reefs and nowhere to be — the Maldives is the purest form of switching off there is.',
    itineraries: [
      {
        id: 'm1', title: 'Overwater honeymoon', tag: 'Chill trip', tags: ['🧘 Wellness', '🏄 Snorkel'], traits: ['wellness', 'nature'],
        photo: PHOTO('1514282401047-d79a71a590e8'), grad: 'linear-gradient(160deg, #1E7E8A, #0c353d)', price: 195000, nights: '5N · Baa Atoll',
        days: [
          { label: 'Day 1 — Baa Atoll', date: 'Mon 13 Apr', stops: [
            st('12:00', 'Seaplane transfer + villa check-in', 'stay'),
            st('16:00', 'House-reef snorkel', 'nature'),
            st('19:30', 'Private beach dinner', 'food'),
          ]},
          { label: 'Day 2 — Baa Atoll', date: 'Tue 14 Apr', stops: [
            st('09:00', 'Couples’ spa ritual', 'stay'),
            st('15:00', 'Manta ray snorkel trip', 'nature'),
          ]},
        ],
      },
      {
        id: 'm2', title: 'Reef & dive escape', tag: 'Adventure based', tags: ['🏄 Adventure', '🌳 Nature'], traits: ['adventure', 'nature'],
        photo: PHOTO('1573843981267-be1999ff37cd'), grad: 'linear-gradient(160deg, #135EB4, #0b2645)', price: 182000, nights: '5N · North Malé',
        days: [
          { label: 'Day 1 — North Malé', date: 'Mon 13 Apr', stops: [
            st('10:00', 'Discover scuba session', 'nature', tr('car', 15)),
            st('15:00', 'Sandbank picnic', 'nature'),
          ]},
          { label: 'Day 2 — North Malé', date: 'Tue 14 Apr', stops: [
            st('07:00', 'Shark & turtle dive', 'nature'),
            st('18:00', 'Sunset dolphin cruise', 'nature'),
          ]},
        ],
      },
    ],
  },
]

// Flat list of every itinerary, tagged with its country key.
export const ALL_ITINERARIES = COUNTRIES.flatMap((c) =>
  c.itineraries.map((it) => ({ ...it, dest: c.key, destName: c.name })),
)

export function getCountry(key) { return COUNTRIES.find((c) => c.key === key) }
export function getDestination(key) { return getCountry(key) } // alias
export function getItinerary(destKey, id) {
  return getCountry(destKey)?.itineraries.find((it) => it.id === id)
}

// Why a country matches the qualitative answers — score + human reasons.
export function matchCountry(country, qual) {
  const reasons = []
  let score = 0
  const vibeHits = (qual.vibes || []).filter((v) => country.vibes.includes(v))
  vibeHits.forEach((v) => { score += 3; reasons.push(`Made for ${QUAL_VIBE_LABEL[v].toLowerCase()}`) })
  if (qual.months?.includes(FLEXIBLE_MONTH)) { score += 1; reasons.push('Flexible timing opens up the best windows here') }
  else if (qual.months?.length) {
    const overlap = country.bestMonths.filter((m) => qual.months.includes(m))
    if (overlap.length) { score += 2; reasons.push(`At its best in ${overlap.slice(0, 3).join(', ')}`) }
  }
  if (qual.who && country.goodFor?.includes(qual.who)) { score += 1; reasons.push(`Loved by a ${qual.who.toLowerCase()}`) }
  if (budgetBandOf(qual.budget || [50000, 150000]) === country.budgetBand) { score += 1; reasons.push('Sits right in your budget') }
  return { score, reasons }
}

// Compact "why it matched" tags for the grid cards. First is the strongest.
const VIBE_EMOJI = { relax: '🌴', adventure: '🧗', culture: '🛕', food: '🍜', nature: '🦁', wellness: '🧘' }
const VIBE_SHORT = { relax: 'Relax', adventure: 'Adventure', culture: 'Culture', food: 'Food & drink', nature: 'Wildlife', wellness: 'Wellness' }
const WEATHER_EMOJI = { beach: '☀️', mountains: '⛰️', mild: '🌤️' }
const WEATHER_SHORT = { beach: 'Beach', mountains: 'Mountains', mild: 'Mild weather' }
const REASON_EMOJI = {
  Honeymoon: '💛', Vacation: '🏖️', Staycation: '🛋️', Workation: '💻',
  'Bachelor / ette': '🎉', 'Solo trip': '🎒', 'Birthday / Anniversary': '🎂',
}

export function matchTags(country, qual) {
  const t = []
  ;(qual.vibes || []).filter((v) => country.vibes.includes(v)).forEach((v) => t.push(`${VIBE_EMOJI[v]} ${VIBE_SHORT[v]}`))
  if (qual.months && !qual.months.includes(FLEXIBLE_MONTH)) {
    const overlap = country.bestMonths.filter((m) => qual.months.includes(m))
    if (overlap.length) t.push(`📅 Great in ${overlap[0]}`)
  }
  if (budgetBandOf(qual.budget || [50000, 150000]) === country.budgetBand) t.push('💰 In budget')
  if (qual.who && country.goodFor?.includes(qual.who)) t.push(`👥 ${qual.who}`)
  return t
}

export function rankedCountries(qual) {
  return [...COUNTRIES]
    .map((c) => ({ country: c, ...matchCountry(c, qual) }))
    .sort((a, b) => b.score - a.score)
}

// Rank a country's itineraries against the chosen vibe + pace.
export function rankItineraries(country, qual, prefs) {
  const wanted = []
  ;(qual?.vibes || []).forEach((v) => { if (VIBE_TO_TRAIT[v]) wanted.push(VIBE_TO_TRAIT[v]) })
  if (prefs?.pace >= 65) wanted.push('packed')
  if (prefs?.pace <= 35) wanted.push('wellness')
  const score = (it) => it.traits.filter((t) => wanted.includes(t)).length
  return [...country.itineraries].sort((a, b) => score(b) - score(a))
}

// Weather insight — why the picked month is (or isn't) a good time to go.
const CLIMATE = {
  bali:     { peak: 'dry, sunny beach days with calm seas', shoulder: 'lush green season with short showers — fewer crowds and better prices' },
  thailand: { peak: 'cool, dry weather — the best beach season of the year', shoulder: 'warm with the odd shower — quieter beaches and better deals' },
  vietnam:  { peak: 'mild and dry — comfortable for cities and coast alike', shoulder: 'warm with some rain — greener scenery and fewer tourists' },
  africa:   { peak: 'dry season — wildlife gathers at waterholes for prime game-viewing', shoulder: 'green season — dramatic skies, newborn wildlife and lush plains' },
  japan:    { peak: 'crisp, clear skies with cherry blossom or autumn colour', shoulder: 'quieter and atmospheric — pack layers for changeable weather' },
  maldives: { peak: 'endless sun, calm lagoons and superb snorkelling visibility', shoulder: 'warm with passing showers — great value and quiet resorts' },
}
export function weatherInsight(country, months) {
  const c = CLIMATE[country.key]
  if (!c) return null
  const sel = (months || []).filter((m) => m !== FLEXIBLE_MONTH)
  let month, peak
  if (sel.length) { month = sel.find((x) => country.bestMonths.includes(x)) || sel[0]; peak = country.bestMonths.includes(month) }
  else { month = country.bestMonths[0]; peak = true } // flexible → show the sweet spot
  return { emoji: peak ? '☀️' : '🌦️', month, peak, note: peak ? c.peak : c.shoulder }
}

// ── Activities (visual, image-based selection step) ────────────
export const ACTIVITIES = [
  { key: 'beach',     label: 'Beaches & islands',    img: PHOTO('1518548419970-58e3b4079ab2'), vibes: ['relax', 'nature'] },
  { key: 'trek',      label: 'Treks & viewpoints',   img: PHOTO('1470240731273-7821a6eeb6bd'), vibes: ['adventure', 'nature'] },
  { key: 'food',      label: 'Food trails',          img: PHOTO('1504674900247-0877df9cc836'), vibes: ['food'] },
  { key: 'culture',   label: 'Temples & heritage',   img: PHOTO('1528127269322-539801943592'), vibes: ['culture'] },
  { key: 'water',     label: 'Snorkel & dive',       img: PHOTO('1573843981267-be1999ff37cd'), vibes: ['nature', 'adventure'] },
  { key: 'spa',       label: 'Spa & wellness',       img: PHOTO('1604999565976-8913ad2ddb7c'), vibes: ['wellness', 'relax'] },
  { key: 'wildlife',  label: 'Wildlife & safari',    img: PHOTO('1516426122078-c23e76319801'), vibes: ['nature'] },
  { key: 'scenic',    label: 'Scenic & photo spots', img: PHOTO('1573790387438-4da905039392'), vibes: ['nature', 'relax'] },
  { key: 'market',    label: 'Markets & shopping',   img: PHOTO('1567337710282-00832b415979'), vibes: ['food', 'culture'] },
  { key: 'nightlife', label: 'Nightlife & bars',     img: PHOTO('1552465011-b4e21bf6e79a'),    vibes: ['food'] },
]

// Activities relevant to a country, user's vibes surfaced first.
export function activitiesFor(country, qual) {
  const uv = qual?.vibes || []
  const relevant = ACTIVITIES.filter((a) => a.vibes.some((v) => country.vibes.includes(v)))
  const pick = relevant.length >= 4 ? relevant : ACTIVITIES
  return [...pick].sort((a, b) => (b.vibes.some((v) => uv.includes(v)) ? 1 : 0) - (a.vibes.some((v) => uv.includes(v)) ? 1 : 0))
}

// Comparison matrix: does each country tick the boxes the user selected?
export function compareMatrix(qual, ranked) {
  const rows = []
  ;(qual.vibes || []).forEach((v) => rows.push({ label: `${VIBE_EMOJI[v]} ${VIBE_SHORT[v]}`, test: (c) => c.vibes.includes(v) }))
  if (qual.months && !qual.months.includes(FLEXIBLE_MONTH) && qual.months.length) {
    rows.push({ label: `📅 ${qual.months.slice(0, 2).join(', ')}`, test: (c) => c.bestMonths.some((m) => qual.months.includes(m)) })
  }
  rows.push({ label: '💰 In budget', test: (c) => budgetBandOf(qual.budget || [50000, 150000]) === c.budgetBand })
  if (qual.who) rows.push({ label: `👥 ${qual.who}`, test: (c) => c.goodFor?.includes(qual.who) })
  return {
    criteria: rows.map((r) => r.label),
    cols: ranked.map(({ country }) => ({
      key: country.key, name: country.name, hero: country.hero, grad: country.grad,
      cells: rows.map((r) => r.test(country)),
      score: rows.filter((r) => r.test(country)).length,
    })),
  }
}

// ── Cost breakdown + stay tier (shown on itinerary cards & detail) ──
export function stayLabel(it) {
  if (it.stay) return it.stay
  const p = it.price
  if (it.traits.includes('adventure') && p < 60000) return 'Hostels'
  if (it.traits.includes('wellness')) return '5✭ Hotels'
  if (p >= 120000) return '5✭ Hotels'
  if (p < 40000) return '3✭ Hotels'
  return '4✭ Hotels'
}

const FLIGHT_EST = { bali: 42000, africa: 95000, thailand: 30000, vietnam: 28000, japan: 68000, maldives: 40000 }
export function costTiles(it, destKey) {
  const round1k = (n) => Math.round(n / 1000) * 1000
  const stay = stayLabel(it)
  return [
    { emoji: '✈️', label: 'Flights', value: FLIGHT_EST[destKey] || 40000 },
    { emoji: stay === 'Hostels' ? '🛏️' : '🏨', label: stay, value: round1k(it.price * (stay === 'Hostels' ? 0.32 : 0.5)) },
    { emoji: '🪂', label: 'Activities', value: round1k(it.price * 0.28) },
    { emoji: '🥬', label: 'Food', value: round1k(it.price * 0.1), approx: true },
  ]
}

export function traitPills(it) {
  return it.tags || []
}
