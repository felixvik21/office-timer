import { useEffect, useMemo, useState } from 'react'
import kontoretImage from './assets/minecraft_kontoret.png'
import jegerImage from './assets/minecraft_jeger.png'
import pizzaImage from './assets/minecraft_pizza.png'
import toolbarImage from './assets/toolbar.png'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const ONE_SECOND_MS = 1000
const TOOLBAR_SLOT_COUNT = 10

type ToolbarItem = {
  id: string
  slot: number
  imageSrc: string
  alt: string
}

type CroppedToolbarImage = {
  src: string
  width: number
  height: number
}

const toolbarItems: ToolbarItem[] = [
  { id: 'jeger', slot: 1, imageSrc: jegerImage, alt: 'Jeger i toolbar' },
  { id: 'pizza', slot: 2, imageSrc: pizzaImage, alt: 'Pizza i toolbar' },
]

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

function getToolbarItemLeft(slot: number): string {
  const slotOffset = slot - 1
  return `calc(var(--toolbar-slot-start) + ${slotOffset} * (var(--toolbar-slot-size) + var(--toolbar-slot-gap)))`
}

function findOpaqueBounds(
  pixelData: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
): { x: number; y: number; width: number; height: number } | null {
  let minX = imageWidth
  let minY = imageHeight
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < imageHeight; y += 1) {
    for (let x = 0; x < imageWidth; x += 1) {
      const alphaIndex = (y * imageWidth + x) * 4 + 3
      if (pixelData[alphaIndex] > 0) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return null
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

function findBackgroundAwareBounds(
  pixelData: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
): { x: number; y: number; width: number; height: number } | null {
  const cornerPoints = [
    [0, 0],
    [imageWidth - 1, 0],
    [0, imageHeight - 1],
    [imageWidth - 1, imageHeight - 1],
  ]

  let cornerR = 0
  let cornerG = 0
  let cornerB = 0
  let cornerA = 0

  for (const [x, y] of cornerPoints) {
    const index = (y * imageWidth + x) * 4
    cornerR += pixelData[index]
    cornerG += pixelData[index + 1]
    cornerB += pixelData[index + 2]
    cornerA += pixelData[index + 3]
  }

  const bgR = cornerR / cornerPoints.length
  const bgG = cornerG / cornerPoints.length
  const bgB = cornerB / cornerPoints.length
  const bgA = cornerA / cornerPoints.length

  const colorTolerance = 34
  const alphaTolerance = 26

  let minX = imageWidth
  let minY = imageHeight
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < imageHeight; y += 1) {
    for (let x = 0; x < imageWidth; x += 1) {
      const index = (y * imageWidth + x) * 4
      const r = pixelData[index]
      const g = pixelData[index + 1]
      const b = pixelData[index + 2]
      const a = pixelData[index + 3]

      const colorDistance = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB)
      const alphaDistance = Math.abs(a - bgA)
      const isContent = colorDistance > colorTolerance || alphaDistance > alphaTolerance

      if (isContent) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return null
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

function cropTransparentPadding(src: string): Promise<CroppedToolbarImage> {
  return new Promise((resolve) => {
    const image = new Image()

    image.onload = () => {
      const sourceCanvas = document.createElement('canvas')
      sourceCanvas.width = image.naturalWidth
      sourceCanvas.height = image.naturalHeight

      const sourceContext = sourceCanvas.getContext('2d')
      if (!sourceContext) {
        resolve({ src, width: image.naturalWidth, height: image.naturalHeight })
        return
      }

      sourceContext.drawImage(image, 0, 0)
      const imageData = sourceContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
      const opaqueBounds = findOpaqueBounds(imageData.data, image.naturalWidth, image.naturalHeight)
      const opaqueArea = opaqueBounds ? opaqueBounds.width * opaqueBounds.height : 0
      const fullArea = image.naturalWidth * image.naturalHeight

      // If alpha-based bounds cover almost all pixels, try a background-color crop.
      const bounds =
        opaqueBounds && opaqueArea / fullArea > 0.95
          ? (findBackgroundAwareBounds(imageData.data, image.naturalWidth, image.naturalHeight) ?? opaqueBounds)
          : opaqueBounds

      if (!bounds) {
        resolve({ src, width: image.naturalWidth, height: image.naturalHeight })
        return
      }

      const isAlreadyTight =
        bounds.x === 0 &&
        bounds.y === 0 &&
        bounds.width === image.naturalWidth &&
        bounds.height === image.naturalHeight

      if (isAlreadyTight) {
        resolve({ src, width: image.naturalWidth, height: image.naturalHeight })
        return
      }

      const cropCanvas = document.createElement('canvas')
      cropCanvas.width = bounds.width
      cropCanvas.height = bounds.height

      const cropContext = cropCanvas.getContext('2d')
      if (!cropContext) {
        resolve({ src, width: image.naturalWidth, height: image.naturalHeight })
        return
      }

      cropContext.drawImage(
        image,
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        0,
        0,
        bounds.width,
        bounds.height,
      )

      resolve({
        src: cropCanvas.toDataURL('image/png'),
        width: bounds.width,
        height: bounds.height,
      })
    }

    image.onerror = () => {
      resolve({ src, width: 1, height: 1 })
    }

    image.src = src
  })
}

function App() {
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [croppedToolbarImages, setCroppedToolbarImages] = useState<Record<string, CroppedToolbarImage>>({})

  useEffect(() => {
    const timerId = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    let isCancelled = false

    Promise.all(
      toolbarItems.map(async (item) => ({
        id: item.id,
        cropped: await cropTransparentPadding(item.imageSrc),
      })),
    ).then((results) => {
      if (isCancelled) return

      const nextImages: Record<string, CroppedToolbarImage> = {}
      for (const result of results) {
        nextImages[result.id] = result.cropped
      }

      setCroppedToolbarImages(nextImages)
    })

    return () => {
      isCancelled = true
    }
  }, [])

  const xpState = useMemo(() => getWeekXpState(new Date(nowMs)), [nowMs])
  const progressWidth = `${Math.round(xpState.progress * 100)}%`
  const remainingText = useMemo(() => formatRemainingDhS(xpState.remainingSeconds), [xpState.remainingSeconds])

  return (
    <main className="app-root">
      <img src={kontoretImage} alt="Kontoret" className="scene-image" />

      <div
        className="countdown-text"
        style={{
          textShadow:
            '-2px 0 #1f5d10, 2px 0 #1f5d10, 0 -2px #1f5d10, 0 2px #1f5d10, -2px -2px #1f5d10, 2px -2px #1f5d10, -2px 2px #1f5d10, 2px 2px #1f5d10',
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
        <img src={toolbarImage} alt="Toolbar" className="toolbar-image" />
        <div className="toolbar-slots-layer" aria-hidden="true">
          {toolbarItems
            .filter((item) => item.slot >= 1 && item.slot <= TOOLBAR_SLOT_COUNT)
            .map((item) => {
              const croppedImage = croppedToolbarImages[item.id]

              return (
                <div
                  key={item.id}
                  className="toolbar-slot"
                  style={{ left: getToolbarItemLeft(item.slot) }}
                >
                  <img
                    src={croppedImage?.src ?? item.imageSrc}
                    alt={item.alt}
                    className="toolbar-slot-item"
                  />
                </div>
              )
            })}
        </div>
      </div>
    </main>
  )
}

export default App
