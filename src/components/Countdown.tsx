import styles from './Countdown.module.css'
import { formatDurationHMS } from '../time'

export function Countdown({
  secondsLeft,
  isConcertTime,
  concertTime,
}: {
  secondsLeft: number
  isConcertTime: boolean
  concertTime: string
}) {
  if (isConcertTime) {
    return (
      <section className={styles.wrap}>
        <h2 className={styles.title}>Countdown til konsert</h2>
        <div className={styles.big}>Kos dere på konsert 🎫</div>
        <div className={styles.label}>Konsert kl. {concertTime}</div>
      </section>
    )
  }

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>Countdown til konsert</h2>
      <div className={styles.big}>{formatDurationHMS(secondsLeft)}</div>
      <div className={styles.label}>Konsert kl. {concertTime}</div>
    </section>
  )
}
