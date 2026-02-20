import type { LucideIcon } from "lucide-react"
import { Balloon, Banana, ChartScatter, Frown, Smile } from "lucide-react"

export const TIME_ZONE = 'Europe/Oslo'

// Endre startTime her når de kommer.
// - Sett til "HH:MM" når personen kommer (f.eks. "08:00")
// - Sett til null hvis personen ikke har kommet enda
export const concertTime = '20:15' as const

// Baren viser alltid intervallet 08:00 → konsert.
export const dayStartTime = '08:00' as const

export type ScheduleItem = {
  label: string
  start: string
  end: string
}

// Dagens plan (vises i sticky bar nederst)
export const schedule: ScheduleItem[] = [
  { label: 'Vibe-coding', start: '08:00', end: '11:00' },
  { label: 'Jobbe', start: '11:00', end: '12:00' },
  { label: 'Lunsj', start: '12:00', end: '13:00' },
  { label: 'Jobbe', start: '13:00', end: '17:00' },
  { label: 'Middag', start: '17:00', end: '18:00' },
  { label: 'Chilling', start: '18:00', end: '20:15' },
]

export type PersonConfig = {
  name: string
  startTime: string | null
  color: string
  icon: LucideIcon
}

export type ArtistInfo = {
  name: string
  role: 'Hovedartist' | 'Support'
  icon: LucideIcon
  listeners: string | null
  blurb: string
  highlights: [string, string]
}

export const people: PersonConfig[] = [
  // Lucida-vennlige ikon-glyphs (tekst, ikke emoji)
  { name: 'Felix', startTime: '19:00', color: '#7C3AED', icon: Balloon },
  { name: 'Chriz', startTime: '12:23', color: '#06B6D4', icon: ChartScatter },
  { name: 'Viljen', startTime: '10:00', color: '#F97316', icon: Banana },
]

// Endre tekst/tall her hvis du vil (f.eks. månedlige lyttere).
export const artists: ArtistInfo[] = [
  {
    name: 'Gjenfødt Kultur',
    role: 'Hovedartist',
    icon: Frown,
    listeners: "37k",
    blurb: 'Kveldens store øyeblikk. Mørkt, varmt og litt for høyt (på den gode måten).',
    highlights: ['Ta med venner', 'Syng med på refrenget'],
  },
  {
    name: 'tre40fire',
    role: 'Support',
    icon: Smile,
    listeners: "1.5k",
    blurb: 'Support-sett som setter tempoet. Møt opp tidlig og få med deg hele greia.',
    highlights: ['Kom før køen', 'Få med første drop'],
  },
]
