import { useMemo } from 'react'
import styles from './ScheduleBar.module.css'
import { concertTime, dayStartTime, schedule } from '../config'
import { clamp, formatMinutesAsHHMM, minutesSinceMidnightFromHHMM } from '../time'

type Segment = {
  label: string
  shortLabel: string
  startMin: number
  endMin: number
  durationMin: number
}

const SHORT_LABEL: Record<string, string> = {
  'Vibe-coding': 'Vibe',
  Jobbe: 'Jobb',
  Lunsj: 'Lunsj',
  Middag: 'Mat',
  Vors: 'Vors',
}

export function ScheduleBar({ nowSeconds }: { nowSeconds: number }) {
  const dayStartMin = minutesSinceMidnightFromHHMM(dayStartTime) ?? 8 * 60
  const dayEndMin = minutesSinceMidnightFromHHMM(concertTime) ?? 21 * 60 + 30

  const segments = useMemo((): Segment[] => {
    return schedule
      .map((item) => {
        const startMin = minutesSinceMidnightFromHHMM(item.start)
        const endMin = minutesSinceMidnightFromHHMM(item.end)
        if (startMin == null || endMin == null) return null
        if (endMin <= startMin) return null

        return {
          label: item.label,
          shortLabel: SHORT_LABEL[item.label] ?? item.label,
          startMin,
          endMin,
          durationMin: endMin - startMin,
        }
      })
      .filter((v): v is Segment => Boolean(v))
      .sort((a, b) => a.startMin - b.startMin)
  }, [])

  const totalMin = Math.max(1, dayEndMin - dayStartMin)

  const boundaryTimes = useMemo(() => {
    const boundaries = [
      dayStartMin,
      ...segments.flatMap((s) => [s.startMin, s.endMin]),
      dayEndMin,
    ]
      .filter((m) => m >= dayStartMin && m <= dayEndMin)
      .filter((m, idx, arr) => arr.indexOf(m) === idx)
      .sort((a, b) => a - b)

    return boundaries.map((m, idx) => {
      const pct = ((m - dayStartMin) / totalMin) * 100
      const edge: 'left' | 'right' | 'mid' = idx === 0 ? 'left' : idx === boundaries.length - 1 ? 'right' : 'mid'
      return { minutes: m, pct, label: formatMinutesAsHHMM(m), edge }
    })
  }, [dayEndMin, dayStartMin, segments, totalMin])

  if (segments.length === 0) return null

  const nowMinRaw = Math.floor(nowSeconds / 60)
  const nowMinClamped = clamp(nowMinRaw, dayStartMin, dayEndMin)
  const nowPct = ((nowMinClamped - dayStartMin) / totalMin) * 100
  const isDone = nowMinRaw >= dayEndMin

  return (
    <aside
      className={styles.fixed}
      data-done={isDone ? 'true' : 'false'}
      style={{ ['--nowPct' as never]: `${nowPct}%` }}
      aria-label="Dagens plan"
    >
      <div className={styles.inner}>
        <div className={styles.ticket}>
          <div className={styles.header}>
            <div className={styles.title}>Dagens plan</div>
            <div className={styles.window}>
              <span className={styles.time}>{dayStartTime}</span>
              <span className={styles.sep}>→</span>
              <span className={styles.time}>{concertTime}</span>
            </div>
          </div>

          <div className={styles.trackWrap}>
            <div className={styles.track} role="presentation">
              {segments.map((s, i) => {
                const isLast = i === segments.length - 1
                const isActive = isLast
                  ? nowMinRaw >= s.startMin && nowMinRaw <= s.endMin
                  : nowMinRaw >= s.startMin && nowMinRaw < s.endMin

                const leftPct = ((s.startMin - dayStartMin) / totalMin) * 100
                const widthPct = ((s.durationMin) / totalMin) * 100

                let state: 'past' | 'active' | 'future' = 'future'
                if (isActive) state = 'active'
                else if (nowMinRaw >= s.endMin) state = 'past'
                else if (nowMinRaw < s.startMin) state = 'future'

                return (
                  <div
                    key={`${s.label}-${s.startMin}-${s.endMin}-${i}`}
                    className={styles.seg}
                    data-active={isActive ? 'true' : 'false'}
                    data-state={state}
                    style={{
                      ['--segLeft' as never]: `${leftPct}%`,
                      ['--segWidth' as never]: `${widthPct}%`,
                    }}
                  >
                    <div className={styles.segInner}>
                      <div className={styles.segLabel}>
                        <span className={styles.labelFull}>{s.label}</span>
                        <span className={styles.labelShort}>{s.shortLabel}</span>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className={styles.now} aria-hidden="true">
                <div className={styles.nowPin} />
                <div className={styles.nowLine} />
              </div>
            </div>

            <div className={styles.boundsRow} aria-hidden="true">
              {boundaryTimes.map((t) => (
                <span
                  key={t.minutes}
                  className={styles.boundLabel}
                  data-edge={t.edge}
                  style={{ left: `${t.pct}%` }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.footerRow}>
            {isDone && <span className={styles.done}>Done</span>}
          </div>
        </div>
      </div>
    </aside>
  )
}
