import styles from './PersonCard.module.css'
import { formatDuration, formatHHMM, parseHHMM } from '../time'
import type { PersonConfig } from '../config'
import { ProgressBar } from './ProgressBar'

export type PersonCardProps = {
  person: PersonConfig
  nowHHMM: string
  nowSeconds: number
  concertSeconds: number
  isConcertTime: boolean
}

export function PersonCard({
  person,
  nowHHMM,
  nowSeconds,
  concertSeconds,
  isConcertTime,
}: PersonCardProps) {
  const parsedStart = person.startTime ? parseHHMM(person.startTime) : null

  const hasValidStart = Boolean(person.startTime && parsedStart)
  const isMissing = !person.startTime || !parsedStart

  const startSeconds = parsedStart ? parsedStart.hours * 3600 + parsedStart.minutes * 60 : null

  const startIsInFuture = startSeconds !== null && startSeconds > nowSeconds && !isConcertTime

  const isOnOffice = startSeconds !== null && nowSeconds >= startSeconds && !isConcertTime

  const showRangeText = !isConcertTime

  const rangeText = hasValidStart && person.startTime
    ? `${person.startTime} – ${nowHHMM}`
    : `HH:MM – ${nowHHMM}`

  const endSeconds = Math.min(nowSeconds, concertSeconds)
  const totalSeconds = startSeconds !== null ? Math.max(0, endSeconds - startSeconds) : 0

  const denom = startSeconds !== null ? Math.max(1, concertSeconds - startSeconds) : 1
  const progress = startSeconds !== null ? clamp01((nowSeconds - startSeconds) / denom) : 0

  const officeNowSeconds = startSeconds !== null ? Math.max(0, Math.min(nowSeconds, concertSeconds) - startSeconds) : 0

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.who}>
          <div className={styles.emoji} aria-hidden="true">
            {person.emoji}
          </div>
          <div>
            <div className={styles.name}>{person.name}</div>
            <div className={styles.sub}>
              {showRangeText ? rangeText : `${formatDuration(totalSeconds)}`}
            </div>
            {!isConcertTime && isOnOffice && (
              <div className={styles.sub2}>Tid på kontoret: {formatDuration(officeNowSeconds)}</div>
            )}
          </div>
        </div>

        <div className={styles.badges}>
          {startIsInFuture ? (
            <span className={styles.badgeWarn}>Starttid i fremtiden</span>
          ) : isMissing ? (
            <span className={styles.badgeOff}>Ikke kommet</span>
          ) : isOnOffice ? (
            <span className={styles.badgeOn}>På kontoret</span>
          ) : (
            <span className={styles.badgeOff}>Ikke kommet</span>
          )}
        </div>
      </header>

      <ProgressBar
        value={progress}
        color={person.color}
        label={`${person.name} progress`}
        disabled={isMissing}
      />

      <div className={styles.footer}>
        <span className={styles.mini}>
          Start: {isMissing ? 'ikke satt' : person.startTime}
        </span>
        <span className={styles.mini}>
          Nå: {nowHHMM}
        </span>
        <span className={styles.mini}>
          Slutt: {formatHHMM(Math.floor(concertSeconds / 3600), Math.floor((concertSeconds % 3600) / 60))}
        </span>
      </div>
    </article>
  )
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}
