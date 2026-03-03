import styles from './Countdown.module.css'
import { formatDurationDHMS } from '../time'

export function Countdown({
  title,
  secondsLeft,
  isEventTime,
  label,
}: {
  title: string
  secondsLeft: number
  isEventTime: boolean
  label?: string
}) {
  if (isEventTime) {
    return (
      <section className={styles.wrap}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.big}>DET ER VORS.</div>
        {label && <div className={styles.label}>{label}</div>}
      </section>
    )
  }

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.big}>{formatDurationDHMS(secondsLeft)}</div>
      {label && <div className={styles.label}>{label}</div>}
    </section>
  )
}
