export type HHMM = `${number}${number}:${number}${number}`

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function parseHHMM(value: string): { hours: number; minutes: number } | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim())
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])
  return { hours, minutes }
}

export function minutesSinceMidnightFromHHMM(value: string): number | null {
  const parsed = parseHHMM(value)
  if (!parsed) return null
  return parsed.hours * 60 + parsed.minutes
}

export function minutesSinceMidnight(now: { hours: number; minutes: number }): number {
  return now.hours * 60 + now.minutes
}

export function format2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatHHMM(hours: number, minutes: number): HHMM {
  return `${format2(hours)}:${format2(minutes)}` as HHMM
}

export function formatMinutesAsHHMM(totalMinutes: number): HHMM {
  const safe = Math.max(0, Math.floor(totalMinutes))
  const hours = Math.floor(safe / 60)
  const minutes = safe % 60
  return formatHHMM(hours, minutes)
}

export function formatHHMMSS(hours: number, minutes: number, seconds: number): string {
  return `${format2(hours)}:${format2(minutes)}:${format2(seconds)}`
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)

  if (hours <= 0) return `${minutes}m`
  return `${hours}t ${minutes}m`
}

export function formatDurationHMS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return formatHHMMSS(hours, minutes, seconds)
}

export type OsloNow = {
  year: number
  month: number
  day: number
  hours: number
  minutes: number
  seconds: number
}

export function getOsloNow(timeZone: string): OsloNow {
  const date = new Date()
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const map: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hours: Number(map.hour),
    minutes: Number(map.minute),
    seconds: Number(map.second),
  }
}

export function secondsSinceMidnight(now: { hours: number; minutes: number; seconds: number }): number {
  return now.hours * 3600 + now.minutes * 60 + now.seconds
}
