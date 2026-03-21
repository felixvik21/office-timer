export const TIME_ZONE = 'Europe/Oslo'

// Minecraft-kveld – slå Ender-draken 21.3.26 kl. 23:25
// NB: ISO med eksplisitt offset gjør at countdown blir riktig selv om skjermen står i feil timezone.
// (21. mars 2026 er CET, altså +01:00.)
export const EVENT_TITLE = 'Slå dragen' as const
export const EVENT_START_ISO = '2026-03-21T23:25:00+01:00' as const

// Nedtellingen starter 19:00 samme kveld.
export const COUNTDOWN_START_ISO = '2026-03-21T19:00:00+01:00' as const

export type WeekPlanItem = {
  label: string
  start: string
  end: string
}

export type WeekPlanDay = {
  // YYYY-MM-DD (i Oslo)
  date: string
  dayLabel: string
  items: WeekPlanItem[]
}

// Kveldsplan – veien til å slå Ender-draken.
export const weekPlan: WeekPlanDay[] = [
  {
    date: '2026-03-21',
    dayLabel: 'Lørdag',
    items: [
      { label: 'Logg inn. Noen glemmer å lage seng. Det er dem.', start: '19:00', end: '19:30' },
      { label: 'Samle ressurser. Noen graver rett ned. RIP.', start: '19:30', end: '20:00' },
      { label: 'Nether-ekspedisjon. Bygg portal feil. Bygg om.', start: '20:00', end: '20:45' },
      { label: 'Blaze rods! (etter 3 dødsfall i festningen)', start: '20:45', end: '21:15' },
      { label: 'Kast Eyes of Ender. En peker ned. Klassikeren.', start: '21:15', end: '21:45' },
      { label: 'Strongholden funnet. Alle er tomme for mat.', start: '21:45', end: '22:15' },
      { label: 'Aktiver End-portalen. Noen prøver å sove der. RIP.', start: '22:15', end: '22:40' },
      { label: 'Ødelegg end crystals. Noen skyter med stein-pil.', start: '22:40', end: '23:10' },
      { label: 'FIGHT THE DRAGON', start: '23:10', end: '23:25' },
    ],
  },
]

// Rebruker en eksisterende “palette”-farge fra prosjektet.
export const VORS_ACCENT = '#80FF20' as const
