import styles from './PersonCard.module.css'
import { formatDuration, formatHHMM, parseHHMM } from '../time'
import type { PersonConfig } from '../config'
import { ProgressBar } from './ProgressBar'


export type PersonCardProps = {
    person: PersonConfig
    nowHHMM: string
    nowSeconds: number
    dayStartSeconds: number
    dayStartLabel: string
    concertSeconds: number
    isConcertTime: boolean
}

export function PersonCard({
    person,
    nowSeconds,
    dayStartSeconds,
    dayStartLabel,
    concertSeconds,
    isConcertTime,
}: PersonCardProps) {
    const parsedStart = person.startTime ? parseHHMM(person.startTime) : null

    const hasValidStart = Boolean(person.startTime && parsedStart)
    const isMissing = !person.startTime || !parsedStart

    const startSeconds = parsedStart ? parsedStart.hours * 3600 + parsedStart.minutes * 60 : null

    const startIsInFuture = startSeconds !== null && startSeconds > nowSeconds && !isConcertTime

    const isOnOffice = startSeconds !== null && nowSeconds >= startSeconds && !isConcertTime

    const officeNowSeconds = startSeconds !== null ? Math.max(0, Math.min(nowSeconds, concertSeconds) - startSeconds) : 0

    const dayDenom = Math.max(1, concertSeconds - dayStartSeconds)
    const safeStartSeconds = startSeconds !== null ? Math.max(dayStartSeconds, startSeconds) : null
    const unused = safeStartSeconds !== null
        ? clamp01((safeStartSeconds - dayStartSeconds) / dayDenom)
        : 1

    const active = safeStartSeconds !== null
        ? clamp01((Math.min(nowSeconds, concertSeconds) - safeStartSeconds) / dayDenom)
        : 0

    const showMarker = hasValidStart && safeStartSeconds !== null && safeStartSeconds > dayStartSeconds
    const markerOffset = showMarker ? unused : undefined
    const markerLabel = showMarker ? person.startTime ?? undefined : undefined

    const endLabel = formatHHMM(
        Math.floor(concertSeconds / 3600),
        Math.floor((concertSeconds % 3600) / 60)
    )

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.who}>
                    <div className={styles.emoji} aria-hidden="true">
                        <person.icon />
                    </div>
                    <div className={styles.name}>{person.name}</div>
                    {!isConcertTime && isOnOffice && (
                        <div className={styles.sub}>Tid: {formatDuration(officeNowSeconds)}</div>
                    )}
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
                unused={unused}
                active={active}
                markerLabel={markerLabel}
                markerOffset={markerOffset}
                dayStartLabel={dayStartLabel}
                endLabel={endLabel}
                color={person.color}
                label={`${person.name} progress`}
                disabled={isMissing}
            />
        </article>
    )
}

function clamp01(value: number): number {
    return Math.max(0, Math.min(1, value))
}
