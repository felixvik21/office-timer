import { useMemo } from 'react'
import styles from './VorsFun.module.css'
import { VORS_ACCENT } from '../config'
import { clamp } from '../time'
import { ProgressBar } from './ProgressBar'

function pickOracleLine(secondsLeft: number, nowMs: number): string {
  const minutesLeft = Math.floor(secondsLeft / 60)
  const hoursLeft = Math.floor(secondsLeft / 3600)

  const pools: string[][] = [
    // Tidlig fase – samle ressurser og overleve
    [
      'Noen sier “vi samler bare litt ressurser”. Det varer 2 timer.',
      'Husker du å lage en seng? Nei. Du husker det etter at du dør.',
      'Oppgave 1: finn tre. Oppgave 2: mer tre. Oppgave 3: MER TRE.',
      'Noen har allerede gravd rett ned. De er ikke lenger med oss.',
      'Noen bygger et hus med glassvinduer. Prioriteringer.',
    ],
    // Nether-fasen
    [
      'Ingen har laget blaze rods ennå. Alle vet det. Ingen sier det.',
      'Nether-porten er bygd. Ingen vil gå inn. “Du går først.”',
      'Noen er strandet i Netheret uten portal. Klassikeren.',
      '”Vent, jeg trenger bare litt mer obsidian.” — noen, i evigheten.',
      'Noen prøver å bygge hus i Netheret. Av tre. Oppe ved lava.',
    ],
    // Etter Nether – finne strongholden
    [
      'Eyes of Ender kastet. En pekte ned. “Den liker ikke oss.”',
      'Strongholden er funnet. Alle er tomme for mat. Selvfølgelig.',
      '”Trenger vi egentlig å ta draken i dag?” — personen med full inventory.',
      'Noen har fortsatt tre-sverd. Det er for sent å si noe.',
      'Portalen mangler 4 frames. Hvem brukte opp alle pearls? Ingen vet.',
    ],
    // Inne i The End – ødelegge crystals
    [
      'End-portalen er aktivert. Noen prøver å sove i The End. RIP.',
      'Første end crystal nede. Ingen vet hvordan man tar de andre.',
      'Draken healer. Noen skyter mot den med en stein-pil.',
      '”HOLD DEG UNNA HULLET” — alle, til ingen nytte.',
      'Noen falt i hullet. Vi fortsetter. Det er slik det er.',
    ],
    // Siste kamp mot draken
    [
      'SISTE FASE: draken på det midtre tårnet. Alt eller ingenting.',
      'SISTE FASE: noen falt ned i hullet igjen. Vi fortsetter uten dem.',
      'SISTE FASE: en pil treffer draken. En annen treffer en lagkamerat.',
      'SISTE FASE: draken er nede til 10%! ...og healer. Selvfølgelig.',
      'SISTE FASE: “JEG HAR DEN! JEG HAR CRYSTALEN!” (det hjalp ikke)',
    ],
  ]

  let pool = pools[0]
  if (hoursLeft <= 3) pool = pools[1]
  if (hoursLeft <= 2) pool = pools[2]
  if (hoursLeft <= 1) pool = pools[3]
  if (minutesLeft <= 30) pool = pools[4]

  // Deterministisk “random” som bytter linje omtrent hvert 10. sekund.
  const t = Math.floor(nowMs / 10_000)
  const idx = Math.abs((t * 1103515245 + secondsLeft) % pool.length)
  return pool[idx]
}

export function VorsFun({
  nowMs,
  countdownStartMs,
  eventMs,
  secondsLeft,
  isEventTime,
}: {
  nowMs: number
  countdownStartMs: number
  eventMs: number
  secondsLeft: number
  isEventTime: boolean
}) {
  const total = Math.max(1, eventMs - countdownStartMs)
  const elapsed = clamp(nowMs - countdownStartMs, 0, total)
  const progress = clamp(elapsed / total, 0, 1)

  const oracle = useMemo(() => {
    if (isEventTime) return 'Draken er død. Noen falt i hullet på slutten. Det er slik det alltid er.'
    return pickOracleLine(secondsLeft, nowMs)
  }, [isEventTime, nowMs, secondsLeft])

  return (
    <section className={styles.wrap} aria-label="Drage-o-meter">
      <h2 className={styles.title}>Drage-o-meter</h2>
      <div className={styles.oracle}>{oracle}</div>

      <div className={styles.bar}>
        <ProgressBar
          unused={0}
          active={progress}
          dayStartLabel="Start 19:00"
          endLabel="Dragen"
          color={VORS_ACCENT}
          label="Dragon progress"
          disabled={false}
        />
      </div>
    </section>
  )
}
