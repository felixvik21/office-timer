export const TIME_ZONE = 'Europe/Oslo'

// Budapest med webkom – flyet letter 13.3.26 kl. 15:05
// NB: ISO med eksplisitt offset gjør at countdown blir riktig selv om skjermen står i feil timezone.
// (13. mars 2026 er CET, altså +01:00.)
export const EVENT_TITLE = 'Budapest med webkom' as const
export const EVENT_START_ISO = '2026-03-13T15:05:00+01:00' as const

// Nedtellingen starter mandag 9.3.26.
export const COUNTDOWN_START_ISO = '2026-03-09T08:00:00+01:00' as const

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

// Ukens plan (seksjoner delt inn i dager) – uke som leder opp til Budapest.
export const weekPlan: WeekPlanDay[] = [
  {
    date: '2026-03-09',
    dayLabel: 'Mandag',
    items: [
      { label: 'Jobb (med Budapest i tankene)', start: '08:00', end: '12:00' },
      { label: 'Lunsj + Google Maps: Budapest', start: '12:00', end: '13:00' },
      { label: 'Jobb (produktiv, lover)', start: '13:00', end: '16:00' },
      { label: 'Pakkeliste runde 1 (urealistisk)', start: '20:00', end: '21:00' },
    ],
  },
  {
    date: '2026-03-10',
    dayLabel: 'Tirsdag',
    items: [
      { label: 'Jobb (halvparten av hodet her)', start: '08:00', end: '12:00' },
      { label: 'Research: ruin bars vs. budsjett', start: '12:00', end: '13:00' },
      { label: 'Jobb (den andre halvparten)', start: '13:00', end: '16:00' },
      { label: 'Valutaveksling (for syns skyld)', start: '16:00', end: '17:00' },
    ],
  },
  {
    date: '2026-03-11',
    dayLabel: 'Onsdag',
    items: [
      { label: 'Jobb (siste møter, lover)', start: '08:00', end: '14:00' },
      { label: 'Webkom-brief: Budapest-regler', start: '14:00', end: '15:00' },
      { label: 'Pakkeliste runde 2 (realistisk)', start: '15:00', end: '17:00' },
      { label: 'Legg deg tidlig (lol)', start: '22:00', end: '23:00' },
    ],
  },
  {
    date: '2026-03-12',
    dayLabel: 'Torsdag',
    items: [
      { label: 'Jobb (out of office satt)', start: '08:00', end: '12:00' },
      { label: 'Lunsj + sjekk flytider 17 ganger', start: '12:00', end: '13:00' },
      { label: 'Pakk sekken (endelig)', start: '16:00', end: '18:00' },
      { label: 'Boardingkort, pass, panikk', start: '20:00', end: '21:00' },
    ],
  },
  {
    date: '2026-03-13',
    dayLabel: 'Fredag',
    items: [
      { label: 'Morgenstell (superhelt-tempo)', start: '08:00', end: '09:00' },
      { label: 'Siste sjekk: ladere, pass, vibes', start: '09:00', end: '10:00' },
      { label: 'Til Gardermoen!', start: '11:00', end: '13:00' },
      { label: 'BUDAPEST', start: '15:05', end: '15:05' },
    ],
  },
]

// Rebruker en eksisterende “palette”-farge fra prosjektet.
export const VORS_ACCENT = '#F97316' as const
