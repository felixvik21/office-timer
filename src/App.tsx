import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import DefaultScreen from './screens/DefaultScreen'
import DtTorsdagScreen from './screens/DtTorsdagScreen'

const COUNTDOWN_PAGE_STORAGE_KEY = 'countdown-active-page'
type CountdownPage = 1 | 2

const COUNTDOWN_PAGES: Array<{ id: CountdownPage; label: string; screen: ComponentType }> = [
  { id: 1, label: 'Kontoret', screen: DefaultScreen },
  { id: 2, label: 'DT-torsdag', screen: DtTorsdagScreen },
]

function App() {
  const [activePage, setActivePage] = useState<CountdownPage>(() => {
    if (typeof window === 'undefined') {
      return 1
    }

    const storedPage = Number(window.localStorage.getItem(COUNTDOWN_PAGE_STORAGE_KEY))
    return storedPage === 2 ? 2 : 1
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') {
        setActivePage(1)
      }

      if (event.key === '2') {
        setActivePage(2)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  useEffect(() => {
    window.localStorage.setItem(COUNTDOWN_PAGE_STORAGE_KEY, String(activePage))
  }, [activePage])

  const activeScreen = COUNTDOWN_PAGES.find((page) => page.id === activePage) ?? COUNTDOWN_PAGES[0]
  const ActiveScreen = activeScreen.screen

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
              {page.id}. {page.label}
            </button>
          )
        })}
      </div>

      <ActiveScreen />
    </main>
  )
}

export default App
