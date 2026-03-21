import { useEffect, useState } from 'react'
import './App.css'
import { COUNTDOWN_START_ISO, EVENT_START_ISO, EVENT_TITLE, TIME_ZONE } from './config'
import { format2, formatYMD, getOsloNow } from './time'
import { Countdown } from './components/Countdown'
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

  const eventLabel = `Nedtelling fra 19:00 • Draken faller 23:25`

  return (
    <div className="page">
      <header className="mcTitle">
        <h1 className="mcLogo">WEBKOM</h1>
        <div className="mcEditionRow">
          <span className="mcEditionMain">Java Edition</span>
          <span className="mcEditionTag">vors-edition!</span>
        </div>
        <p className="mcDateLine">{EVENT_TITLE} · {nowDate} · <span className="tz">{TIME_ZONE}</span></p>
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
            <span className="footerBadge">Kveldsprogram</span>
            <span className="footerText">19:00 → 23:25</span>
            <span className="footerTiny">— draken skal falle —</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
