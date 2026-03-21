import styles from './WeekPlan.module.css'
import { weekPlan } from '../config'

function formatDDMM(date: string): string {
  const parts = date.split('-')
  if (parts.length !== 3) return date
  const [, mm, dd] = parts
  return `${dd}.${mm}`
}

export function WeekPlan({ todayKey }: { todayKey: string }) {
  return (
    <section className={styles.wrap} aria-label="Kveldsprogram">
      <h2 className={styles.title}>Kveldsprogram</h2>

      <div className={styles.grid}>
        {weekPlan.map((day) => {
          const isToday = day.date === todayKey
          return (
            <article key={day.date} className={styles.card} data-today={isToday ? 'true' : 'false'}>
              <header className={styles.header}>
                <div className={styles.day}>{day.dayLabel}</div>
                <div className={styles.date}>{formatDDMM(day.date)}</div>
              </header>

              <ul className={styles.list}>
                {day.items.map((item, idx) => (
                  <li key={`${item.label}-${item.start}-${item.end}-${idx}`} className={styles.item}>
                    <span className={styles.time}>{item.start}–{item.end}</span>
                    <span className={styles.label}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
