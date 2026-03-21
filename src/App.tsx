import { useEffect, useState } from 'react'
import './App.css'
import { COUNTDOWN_START_ISO, EVENT_START_ISO, EVENT_TITLE, TIME_ZONE } from './config'
import { format2, formatYMD, getOsloNow } from './time'
import { Countdown } from './components/Countdown'
import { Waves } from "lucide-react"
import { WeekPlan } from './components/WeekPlan.tsx'
import { VorsFun } from './components/VorsFun.tsx'

function App() {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const now = getOsloNow(TIME_ZONE, new Date(nowMs))

  const nowDate = `${format2(now.day)}.${format2(now.month)}.${String(now.year).slice(-2)}`
  const todayKey = formatYMD(now.year, now.month, now.day)

  const eventMs = Date.parse(EVENT_START_ISO)
  const countdownStartMs = Date.parse(COUNTDOWN_START_ISO)

  const secondsLeft = Math.max(0, Math.floor((eventMs - nowMs) / 1000))
  const isEventTime = nowMs >= eventMs

  const eventLabel = `Starter 06.03.26 19:00 • Nedtelling siden 02.03.26`

  return (
    <div className="page">
      <div className="confetti" aria-hidden="true" />

      <header className="top">
        <div className="brand">
          <div className="kicker">{EVENT_TITLE}</div>
          <h1>
            I dag • {nowDate} • <span className="tz">{TIME_ZONE}</span>
          </h1>
        </div>
        <div className="pill"><Waves size={14}/> Uke 10 vibe</div>
      </header>

      <main className="grid">
        <Countdown
          title={`Countdown til ${EVENT_TITLE}`}
          secondsLeft={secondsLeft}
          isEventTime={isEventTime}
          label={eventLabel}
        />

        <VorsFun
          nowMs={nowMs}
          countdownStartMs={countdownStartMs}
          eventMs={eventMs}
          secondsLeft={secondsLeft}
          isEventTime={isEventTime}
        />

        <WeekPlan todayKey={todayKey} />
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerTop">
            <span className="footerBadge">Ukesplan</span>
            <span className="footerText">Mandag 02.03 → Fredag 06.03</span>
            <span className="footerTiny">— ingen kontortid, bare vors-fokus —</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
