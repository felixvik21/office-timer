import { useEffect, useMemo, useState } from 'react'
import kontoretImage from './assets/minecraft_kontoret.png'
import toolbarImage from './assets/toolbar.png'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const ONE_SECOND_MS = 1000

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getWeekXpState(now: Date): { progress: number; remainingSeconds: number } {
  const day = now.getDay() // 0=sun, 4=thu

  const thisThursday = new Date(now)
  const daysSinceThursday = (day - 4 + 7) % 7
  thisThursday.setDate(now.getDate() - daysSinceThursday)
  thisThursday.setHours(0, 0, 0, 0)

  const endThursday = new Date(thisThursday)
  if (day !== 4) {
    endThursday.setDate(endThursday.getDate() + 7)
  }

  const startThursday = new Date(endThursday)
  startThursday.setDate(startThursday.getDate() - 7)

  const fillStartMs = startThursday.getTime()
  const fillEndMs = new Date(
    endThursday.getFullYear(),
    endThursday.getMonth(),
    endThursday.getDate(),
    18,
    0,
    0,
    0,
  ).getTime()

  const fullUntilMidnightMs = endThursday.getTime() + ONE_DAY_MS
  const nowMs = now.getTime()

  if (nowMs >= fillEndMs && nowMs < fullUntilMidnightMs) {
    return { progress: 1, remainingSeconds: 0 }
  }

  const progress = clamp((nowMs - fillStartMs) / (fillEndMs - fillStartMs), 0, 1)
  const remainingSeconds = Math.max(0, Math.floor((fillEndMs - nowMs) / ONE_SECOND_MS))

  return { progress, remainingSeconds }
}

function formatRemainingDhS(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
  const seconds = totalSeconds % 60

  return `${days}d ${hours}t ${seconds}s`
}

function App() {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const timerId = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [])

  const xpState = useMemo(() => getWeekXpState(new Date(nowMs)), [nowMs])
  const progressWidth = `${Math.round(xpState.progress * 100)}%`
  const remainingText = useMemo(() => formatRemainingDhS(xpState.remainingSeconds), [xpState.remainingSeconds])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      <img src={kontoretImage} alt="Kontoret" className="h-full w-full object-cover" />

      <div
        className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 font-['Press_Start_2P'] text-[22px] leading-none text-[#6dff2b] md:text-[28px]"
        style={{
          textShadow:
            '-2px 0 #1f5d10, 2px 0 #1f5d10, 0 -2px #1f5d10, 0 2px #1f5d10, -2px -2px #1f5d10, 2px -2px #1f5d10, -2px 2px #1f5d10, 2px 2px #1f5d10',
        }}
      >
        {remainingText}
      </div>

      <div className="pointer-events-none absolute bottom-24 left-1/2 h-3 w-[min(92vw,640px)] -translate-x-1/2 border-2 border-black bg-[#1b1b1b]">
        <div
          className="h-full border-r-2 border-[#2f730f]"
          style={{
            width: progressWidth,
            backgroundImage:
              'repeating-linear-gradient(to right, #54a916 0 28px, #7bd12d 28px 56px)',
            boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.18)',
          }}
        />
      </div>

      <img
        src={toolbarImage}
        alt="Toolbar"
        className="pointer-events-none absolute bottom-4 left-1/2 w-[min(92vw,640px)] -translate-x-1/2"
      />
    </main>
  )
}

export default App
