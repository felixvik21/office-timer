import styles from './ProgressBar.module.css'

export function ProgressBar({
  unused,
  active,
  markerLabel,
  markerOffset,
  dayStartLabel,
  endLabel,
  color,
  label,
  disabled,
}: {
  unused: number
  active: number
  markerLabel?: string
  markerOffset?: number
  dayStartLabel: string
  endLabel: string
  color: string
  label?: string
  disabled?: boolean
}) {
  const safeUnused = Math.max(0, Math.min(1, unused))
  const safeActive = Math.max(0, Math.min(1, active))
  const activeLeftPct = Math.round(safeUnused * 100)
  const activeWidthPct = Math.round(safeActive * 100)
  const markerPct = markerOffset === undefined ? null : Math.max(0, Math.min(1, markerOffset))

  return (
    <div
      className={styles.wrap}
      data-disabled={disabled ? 'true' : 'false'}
      aria-label={label}
    >
      <div className={styles.trackOuter}>
        {markerPct !== null && markerPct > 0 && (
          <div className={styles.marker} style={{ left: `${Math.round(markerPct * 100)}%` }}>
            <div className={styles.markerLine} />
            {markerLabel && <div className={styles.markerLabel}>{markerLabel}</div>}
          </div>
        )}

        <div className={styles.track}>
          <div className={styles.unused} style={{ width: `${Math.round(safeUnused * 100)}%` }} />
          <div
            className={styles.fill}
            style={{
              left: `${activeLeftPct}%`,
              width: `${activeWidthPct}%`,
              background: disabled ? 'rgba(255,255,255,0.12)' : color,
            }}
          />
        </div>
      </div>
      <div className={styles.meta}>
        <span>{dayStartLabel}</span>
        <span className={styles.end}>{endLabel}</span>
      </div>
    </div>
  )
}
