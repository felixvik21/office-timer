import { useMemo } from 'react'
import styles from './VorsFun.module.css'
import { VORS_ACCENT } from '../config'
import { clamp } from '../time'
import { ProgressBar } from './ProgressBar'

function pickOracleLine(secondsLeft: number, nowMs: number): string {
  const minutesLeft = Math.floor(secondsLeft / 60)
  const hoursLeft = Math.floor(secondsLeft / 3600)

  const pools: string[][] = [
    [
      'Prognose: 93% sjanse for at noen sier “vi tar det rolig i kveld”.',
      'Vors-fakta: “bare én” er en fabel (som drager).',
      'Husk: ansvar er en myte fra HR.',
      'Dette er ikke en nedtelling. Det er en nedtrapping av kontroll.',
      'Vors-energi kan ikke måles i watt, bare i volum.',
    ],
    [
      'Tipset: legg fram klær nå. Du kommer til å hate deg selv senere.',
      'Hvis du begynner å “rydde litt”… stopp. Det er en felle.',
      'Oppdrag: finn høyttaleren (og dens ladekabel, ikke vær en klovn).',
      'Når du sier “jeg kommer om 5”, mener du “jeg kommer i morgen”.',
    ],
    [
      'Nå: for-hydrer. Ikke diskuter. Bare gjør det.',
      'Nå: send én melding som inneholder ordet “vibe”. Ferdig.',
      'Nå: øv på å late som du har sovet 8 timer.',
      'Nå: ikke start et nytt prosjekt. (Du kommer til å.)',
    ],
    [
      'SISTE TIMER: alle beslutninger tas med hjertet. Og litt med kaos.',
      'SISTE TIMER: du trenger ikke flere planer. Du trenger en taxi.',
      'SISTE TIMER: “jeg skal bare dusje” er starten på en saga.',
    ],
    [
      'SISTE MINUTTER: finn nøkler, legitimasjon, og en siste rest av verdighet.',
      'SISTE MINUTTER: IKKE sett deg ned. Da er du ferdig.',
      'SISTE MINUTTER: alle er “på vei”. Ingen er på vei.',
    ],
  ]

  let pool = pools[0]
  if (hoursLeft <= 48) pool = pools[1]
  if (hoursLeft <= 18) pool = pools[2]
  if (hoursLeft <= 6) pool = pools[3]
  if (minutesLeft <= 45) pool = pools[4]

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
    if (isEventTime) return 'Orakelet: du er der. Ikke gjør det rart (du gjør det rart).'
    return pickOracleLine(secondsLeft, nowMs)
  }, [isEventTime, nowMs, secondsLeft])

  return (
    <section className={styles.wrap} aria-label="Vors-o-meter">
      <h2 className={styles.title}>Vors-o-meter</h2>
      <div className={styles.oracle}>{oracle}</div>

      <div className={styles.bar}>
        <ProgressBar
          unused={0}
          active={progress}
          dayStartLabel="Start 02.03"
          endLabel="Vors"
          color={VORS_ACCENT}
          label="Vors progress"
          disabled={false}
        />
      </div>
    </section>
  )
}
