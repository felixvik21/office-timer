import styles from './Countdown.module.css'
import { formatDurationHMS } from '../time'

export function Countdown({
  secondsLeft,
  isConcertTime,
}: {
  secondsLeft: number
  isConcertTime: boolean
  concertTime: string
}) {
  if (isConcertTime) {
    return (
      <section className={styles.wrap}>
        <h2 className={styles.title}>Countdown til EUROJACKPOT!</h2>
        <div className={styles.big}>GRATULERER DU VANT! 🎫</div>
      </section>
    )
  }

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>Countdown til EUROJACKPOT!</h2>
      <div className={styles.big}>{formatDurationHMS(secondsLeft)}</div>
    </section>
  )
}
