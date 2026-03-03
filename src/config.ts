export const TIME_ZONE = 'Europe/Oslo'

// Helga Singsaker Vors – starter 6.3.26
// NB: ISO med eksplisitt offset gjør at countdown blir riktig selv om skjermen står i feil timezone.
// (6. mars 2026 er CET, altså +01:00.)
export const EVENT_TITLE = 'Helga Singsaker Vors' as const
export const EVENT_START_ISO = '2026-03-06T18:00:00+01:00' as const

// Nedtellingen starter mandag 2.3.26.
export const COUNTDOWN_START_ISO = '2026-03-02T08:00:00+01:00' as const

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

// Ukens plan (seksjoner delt inn i dager) – uke som leder opp til vors.
export const weekPlan: WeekPlanDay[] = [
  {
    date: '2026-03-02',
    dayLabel: 'Mandag',
    items: [
      { label: 'Kaffekjøring (strategisk)', start: '08:00', end: '10:00' },
      { label: 'Jobb (late as if)', start: '10:00', end: '15:00' },
      { label: 'Handle inn “bare litt”', start: '15:00', end: '17:00' },
      { label: 'Tren på å si “én øl” uten å lyve', start: '17:00', end: '18:00' },
    ],
  },
  {
    date: '2026-03-03',
    dayLabel: 'Tirsdag',
    items: [
      { label: 'Jobb (med skyld)', start: '08:00', end: '12:00' },
      { label: 'Lunsj + vors-logistikk', start: '12:00', end: '13:00' },
      { label: 'Jobb (uten skyld)', start: '13:00', end: '16:00' },
      { label: 'Playlist war (friendly fire)', start: '16:00', end: '18:00' },
    ],
  },
  {
    date: '2026-03-04',
    dayLabel: 'Onsdag',
    items: [
      { label: 'Jobb (siste sjanse)', start: '08:00', end: '14:00' },
      { label: 'Vors-brief (uten PowerPoint)', start: '14:00', end: '15:00' },
      { label: 'Outfit-krise (planlagt)', start: '15:00', end: '17:00' },
      { label: 'Legg deg tidlig (lol)', start: '22:00', end: '23:00' },
    ],
  },
  {
    date: '2026-03-05',
    dayLabel: 'Torsdag',
    items: [
      { label: 'Jobb (autopilot)', start: '08:00', end: '12:00' },
      { label: 'Lunsj + “sjekk bare en ting”', start: '12:00', end: '13:00' },
      { label: 'Forhånds-hydrering', start: '16:00', end: '18:00' },
      { label: 'Stryke skjorte / stryke planer', start: '19:00', end: '20:00' },
    ],
  },
  {
    date: '2026-03-06',
    dayLabel: 'Fredag',
    items: [
      { label: 'Jobb (minimum viable effort)', start: '08:00', end: '12:00' },
      { label: 'Pakk: høyttaler, vibe, ansvar', start: '12:00', end: '13:00' },
      { label: 'POWER NAP (valgfri, men legendarisk)', start: '15:00', end: '16:00' },
      { label: 'VORS', start: '19:00', end: '23:59' },
    ],
  },
]

// Rebruker en eksisterende “palette”-farge fra prosjektet.
export const VORS_ACCENT = '#F97316' as const
