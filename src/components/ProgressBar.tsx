import styles from './ProgressBar.module.css'

export function ProgressBar({
  value,
  color,
  label,
  disabled,
}: {
  value: number
  color: string
  label?: string
  disabled?: boolean
}) {
  const percent = Math.round(Math.max(0, Math.min(1, value)) * 100)

  return (
    <div
      className={styles.wrap}
      data-disabled={disabled ? 'true' : 'false'}
      aria-label={label}
    >
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percent}%`, background: disabled ? 'rgba(255,255,255,0.12)' : color }}
        />
      </div>
      <div className={styles.meta}>
        <span>{disabled ? 'Venter på starttid' : `${percent}%`}</span>
        <span className={styles.end}>21:30</span>
      </div>
    </div>
  )
}
