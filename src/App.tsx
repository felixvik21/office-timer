import { useEffect, useState } from 'react'
import './App.css'
import { TIME_ZONE, concertTime, dayStartTime, people, artists } from './config'
import { getOsloNow, parseHHMM, secondsSinceMidnight } from './time'
import { Countdown } from './components/Countdown'
import { PersonCard } from './components/PersonCard'
import { Waves } from "lucide-react"
import { ScheduleBar } from './components/ScheduleBar'

function App() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((v) => v + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const now = getOsloNow(TIME_ZONE)

  const nowSeconds = secondsSinceMidnight(now)
  const nowHHMM = `${String(now.hours).padStart(2, '0')}:${String(now.minutes).padStart(2, '0')}`

  const concertParsed = parseHHMM(concertTime)
  const concertSeconds = concertParsed ? concertParsed.hours * 3600 + concertParsed.minutes * 60 : 21 * 3600 + 30 * 60

  const dayStartParsed = parseHHMM(dayStartTime)
  const dayStartSeconds = dayStartParsed ? dayStartParsed.hours * 3600 + dayStartParsed.minutes * 60 : 8 * 3600

  const isConcertTime = nowSeconds >= concertSeconds
  const secondsLeft = Math.max(0, concertSeconds - nowSeconds)

  return (
    <div className="page">
      <div className="confetti" aria-hidden="true" />

      <header className="top">
        <div className="brand">
          <div className="kicker">Kontor-timer</div>
          <h1>
            I dag • {nowHHMM} • <span className="tz">{TIME_ZONE}</span>
          </h1>
        </div>
        <div className="pill"><Waves size={18}/> One-day vibe</div>
      </header>

      <main className="grid">
        <Countdown secondsLeft={secondsLeft} isConcertTime={isConcertTime} concertTime={concertTime} />

        <section className="cards">
          {people.map((person) => (
            <PersonCard
              key={person.name}
              person={person}
              nowHHMM={nowHHMM}
              nowSeconds={nowSeconds}
              dayStartSeconds={dayStartSeconds}
              dayStartLabel={dayStartTime}
              concertSeconds={concertSeconds}
              isConcertTime={isConcertTime}
            />
          ))}
        </section>
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerTop">
            <span className="footerBadge">Gjenfødt Kultur</span>
            <span className="footerText">tre40fire (support)</span>
            <span className="footerTiny">— husk ørepropper —</span>
          </div>

          <div className="lineup" aria-label="Lineup">
            {artists.map((artist) => (
              <article key={artist.name} className="artistCard">
                <div className="artistTop">
                  <div className="artistEmoji" aria-hidden="true"><artist.icon /></div>
                  <div className="artistMeta">
                    <div className="artistName">{artist.name}</div>
                    <div className="artistRole">{artist.role}</div>
                  </div>
                  <div className="artistStat">
                    <div className="artistStatLabel">Månedlige lyttere</div>
                    <div className="artistStatValue">{artist.listeners ?? '— (sett i config)'}</div>
                  </div>
                </div>

                <div className="artistBlurb">{artist.blurb}</div>

                <div className="artistHighlights">
                  <div className="artistChip">{artist.highlights[0]}</div>
                  <div className="artistChip">{artist.highlights[1]}</div>
                </div>
              </article>
            ))}
          </div>
          <ScheduleBar nowSeconds={nowSeconds} />
        </div>
      </footer>
    </div>
  )
}

export default App
