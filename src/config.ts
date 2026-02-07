export const TIME_ZONE = 'Europe/Oslo'

// Endre startTime her når de kommer.
// - Sett til "HH:MM" når personen kommer (f.eks. "08:00")
// - Sett til null hvis personen ikke har kommet enda
export const concertTime = '21:30' as const

export type PersonConfig = {
  name: string
  startTime: string | null
  color: string
  emoji: string
}

export type ArtistInfo = {
  name: string
  role: 'Hovedartist' | 'Support'
  emoji: string
  listeners: string | null
  blurb: string
  highlights: [string, string]
}

export const people: PersonConfig[] = [
  { name: 'Felix', startTime: '08:00', color: '#7C3AED', emoji: '🧃' },
  { name: 'Chriz', startTime: null, color: '#06B6D4', emoji: '🎧' },
  { name: 'Viljen', startTime: null, color: '#F97316', emoji: '🕺' },
]

// Endre tekst/tall her hvis du vil (f.eks. månedlige lyttere).
export const artists: ArtistInfo[] = [
  {
    name: 'Gjenfødt Kultur',
    role: 'Hovedartist',
    emoji: '🎤',
    listeners: "37k",
    blurb: 'Kveldens store øyeblikk. Mørkt, varmt og litt for høyt (på den gode måten).',
    highlights: ['Ta med venner', 'Syng med på refrenget'],
  },
  {
    name: 'tre40fire',
    role: 'Support',
    emoji: '⚡️',
    listeners: "1.5k",
    blurb: 'Support-sett som setter tempoet. Møt opp tidlig og få med deg hele greia.',
    highlights: ['Kom før køen', 'Få med første drop'],
  },
]
