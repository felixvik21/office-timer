import { useEffect, useMemo, useState } from 'react'
import armorImage from './assets/minecraft_armor_nobg.png'
import foodImage from './assets/minecraft_food.png'
import kontoretImage from './assets/minecraft_kontoret.png'
import heartImage from './assets/minecraft_heart.png'
import jegerImage from './assets/minecraft_jeger.png'
import pizzaImage from './assets/minecraft_pizza.png'
import tuborgImage from './assets/minecraft_tuborg.png'
import iphoneImage from './assets/minecraft_iphone.png'
import toolbarImage from './assets/toolbar.png'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const ONE_SECOND_MS = 1000
const ONE_WEEK_MS = 7 * ONE_DAY_MS
const TOOLBAR_SLOT_COUNT = 10
const SELECTED_TOOLBAR_SLOT = 1
const COUNTDOWN_PAGE_STORAGE_KEY = 'countdown-active-page'
const HEART_COUNT = 10
type CountdownPage = 1 | 2

const COUNTDOWN_PAGES: Array<{ id: CountdownPage; label: string }> = [
  { id: 1, label: 'DT-torsdag' },
  { id: 2, label: 'default' },
]

const CHAT_MESSAGES: string[] = [
  '<Femux> Det blir draken takedown 18:00 på torsdag - kjør da',
  '<TonyWorep> Dette blir en kveld for historiebøkene',
  '<MagnusBrecke> TonyWorep kan jeg låne sengen din?',
  '<Ch0rizo> Nei! Lån min!',
]

type ToolbarItem = {
  id: string
  slot: number
  imageSrc: string
  alt: string
  sizePct?: number
  offsetX?: number
  offsetY?: number
}

const toolbarItems: ToolbarItem[] = [
  { id: 'jeger', slot: 4, imageSrc: jegerImage, alt: 'Jeger i toolbar', sizePct: 68, offsetY: -1 },
  { id: 'pizza', slot: 2, imageSrc: pizzaImage, alt: 'Pizza i toolbar', sizePct: 68, offsetY: -1 },
  { id: 'tuborg', slot: 3, imageSrc: tuborgImage, alt: 'Tuborg i toolbar', sizePct: 68, offsetY: -1 },
  { id: 'iphone', slot: SELECTED_TOOLBAR_SLOT, imageSrc: iphoneImage, alt: 'Iphone i toolbar', sizePct: 68, offsetY: -1 },
]

const toolbarItemsBySlot = new Map(toolbarItems.map((item) => [item.slot, item]))

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getWeekXpState(now: Date): { progress: number; remainingSeconds: number } {
  const nowMs = now.getTime()
  const day = now.getDay() // 0=sun, 5=fri

  const cycleStart = new Date(now)
  const daysSinceFriday = (day - 5 + 7) % 7
  cycleStart.setDate(now.getDate() - daysSinceFriday)
  cycleStart.setHours(3, 0, 0, 0)

  if (nowMs < cycleStart.getTime()) {
    cycleStart.setTime(cycleStart.getTime() - ONE_WEEK_MS)
  }

  const cycleStartMs = cycleStart.getTime()
  const countdownEnd = new Date(cycleStart)
  countdownEnd.setDate(countdownEnd.getDate() + 6)
  countdownEnd.setHours(18, 0, 0, 0)
  const countdownEndMs = countdownEnd.getTime()

  const nextCycleStartMs = cycleStartMs + ONE_WEEK_MS

  if (nowMs >= countdownEndMs && nowMs < nextCycleStartMs) {
    return { progress: 0, remainingSeconds: 0 }
  }

  const cycleDurationMs = countdownEndMs - cycleStartMs
  const elapsedMs = clamp(nowMs - cycleStartMs, 0, cycleDurationMs)
  const progress = clamp(1 - elapsedMs / cycleDurationMs, 0, 1)
  const remainingSeconds = Math.max(0, Math.floor((countdownEndMs - nowMs) / ONE_SECOND_MS))

  return { progress, remainingSeconds }
}

function formatRemainingDhMS(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  return `${days}d ${hours}t ${minutes}m ${seconds}s`
}

function App() {
  const [activePage, setActivePage] = useState<CountdownPage>(() => {
    if (typeof window === 'undefined') {
      return 1
    }

    const storedPage = Number(window.localStorage.getItem(COUNTDOWN_PAGE_STORAGE_KEY))
    return storedPage === 2 ? 2 : 1
  })
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const timerId = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(COUNTDOWN_PAGE_STORAGE_KEY, String(activePage))
  }, [activePage])

  const xpState = useMemo(() => getWeekXpState(new Date(nowMs)), [nowMs])
  const progressWidth = `${Math.round(xpState.progress * 100)}%`
  const remainingText = useMemo(() => formatRemainingDhMS(xpState.remainingSeconds), [xpState.remainingSeconds])

  return (
    <main className="app-root">
      <div className="page-toggle" aria-label="Velg countdown-side">
        {COUNTDOWN_PAGES.map((page) => {
          const isActive = activePage === page.id

          return (
            <button
              key={page.id}
              type="button"
              className={isActive ? 'page-toggle-button page-toggle-button-active' : 'page-toggle-button'}
              onClick={() => setActivePage(page.id)}
            >
              {page.label}
            </button>
          )
        })}
      </div>

      {activePage === 1 ? (
        <>
          <h1 className="dt-torsdag-title">DRAKEN-TAKEDOWN-TORSDAG</h1>
          <img src={kontoretImage} alt="Kontoret" className="scene-image" />

          <div
            className="countdown-text"
            style={{
              textShadow:
                '-1px 0 #1f5d10, 1px 0 #1f5d10, 0 -1px #1f5d10, 0 1px #1f5d10, -1px -1px #1f5d10, 1px -1px #1f5d10, -1px 1px #1f5d10, 1px 1px #1f5d10',
            }}
          >
            {remainingText}
          </div>

          <div className="xp-bar-shell">
            <div
              className="xp-bar-fill"
              style={{
                width: progressWidth,
                backgroundImage:
                  'repeating-linear-gradient(to right, #54a916 0 28px, #7bd12d 28px 56px)',
                boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.18)',
              }}
            />
          </div>

          <div className="toolbar-wrap">
            <div className="toolbar-armor" aria-hidden="true">
              <img src={armorImage} alt="" className="toolbar-armor-image" />
            </div>

            <div className="toolbar-food" aria-hidden="true">
              <img src={foodImage} alt="" className="toolbar-food-image" />
            </div>

            <div className="toolbar-hearts" aria-hidden="true">
              {Array.from({ length: HEART_COUNT }, (_, index) => (
                <img key={index} src={heartImage} alt="" className="toolbar-heart" />
              ))}
            </div>

            <img src={toolbarImage} alt="Toolbar" className="toolbar-image" />
            <div className="toolbar-slots-layer" aria-hidden="true">
              {Array.from({ length: TOOLBAR_SLOT_COUNT }, (_, index) => {
                const slot = index + 1
                const item = toolbarItemsBySlot.get(slot)
                const slotClassName =
                  slot === SELECTED_TOOLBAR_SLOT ? 'toolbar-slot toolbar-slot-selected' : 'toolbar-slot'

                if (!item) {
                  return <div key={slot} className={slotClassName} />
                }

                const toolbarItemStyle = {
                  '--toolbar-item-size': `${item.sizePct ?? 82}%`,
                  '--toolbar-item-offset-x': `${item.offsetX ?? 0}px`,
                  '--toolbar-item-offset-y': `${item.offsetY ?? 0}px`,
                } as React.CSSProperties

                return (
                  <div key={slot} className={slotClassName}>
                    <img
                      src={item.imageSrc}
                      alt={item.alt}
                      className="toolbar-slot-item"
                      style={toolbarItemStyle}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="minecraft-chat" aria-label="Minecraft chat">
            {CHAT_MESSAGES.map((message, index) => (
              <p key={`${message}-${index}`} className="minecraft-chat-line">
                {message}
              </p>
            ))}
          </div>
        </>
      ) : null}
    </main>
  )
}

export default App
