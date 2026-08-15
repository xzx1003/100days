import { ArrowDown } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const HeroModelStage = lazy(() => import('./components/HeroModelStage'))
const CharacterField = lazy(() => import('./components/CharacterField'))
const OilShader = lazy(() => import('./components/OilShader'))
const WaveText = lazy(() => import('./components/WaveText'))
const PinkNewsletterPage = lazy(() => import('./components/PinkNewsletterPage'))
const RichTextEditorPage = lazy(() => import('./components/RichTextEditorPage'))

const archiveImageModules = import.meta.glob('../alum/*.{jpg,jpeg,png,webp,avif,gif}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const archiveImages = Object.entries(archiveImageModules)
  .sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))
  .map(([, src]) => src as string)
const archiveTilts = [-9, -4, 3, 7, -6, 5, -3, 8, -8, 4, -5, 6]
const archiveDepths = [0, 34, -18, 22, -30, 12, 30, -12, 8, -24, 26, -8]
const archiveCards = archiveImages.map((image, index) => ({
  id: index + 1,
  image,
  lit: index % 5 === 1,
  tilt: archiveTilts[index % archiveTilts.length],
  depth: archiveDepths[index % archiveDepths.length],
}))

type ArchiveCardData = (typeof archiveCards)[number]

const cardTiltBase = {
  x: 0,
  y: 0,
}

const anniversaryStart = new Date(2026, 4, 10, 10, 0, 0)
const sliderOptions = [
  {
    id: 0,
    icon: '01',
    defaultColor: '#ED5565',
    image: new URL('../pic/微信图片_20260813150945_24_132.jpg', import.meta.url).href,
    ratio: 1706 / 1280,
  },
  {
    id: 1,
    icon: '02',
    defaultColor: '#FC6E51',
    image: new URL('../pic/微信图片_20260813150946_25_132.jpg', import.meta.url).href,
    ratio: 1279 / 1706,
  },
  {
    id: 2,
    icon: '03',
    defaultColor: '#FFCE54',
    image: new URL('../pic/微信图片_20260813150947_26_132.jpg', import.meta.url).href,
    ratio: 1279 / 2275,
  },
  {
    id: 3,
    icon: '04',
    defaultColor: '#2ECC71',
    image: new URL('../pic/微信图片_20260813150948_27_132.jpg', import.meta.url).href,
    ratio: 1700 / 1276,
  },
  {
    id: 4,
    icon: '05',
    defaultColor: '#5D9CEC',
    image: new URL('../pic/微信图片_20260813150949_28_132.jpg', import.meta.url).href,
    ratio: 1260 / 2632,
  },
]
const wordPalettes = [
  ['#ff6b9d', '#ff9f1c'],
  ['#42a5f5', '#7c4dff'],
  ['#00b894', '#00cec9'],
  ['#f06292', '#ba68c8'],
  ['#ff7043', '#ffd54f'],
  ['#26c6da', '#5c6bc0'],
  ['#66bb6a', '#d4e157'],
  ['#ec407a', '#ff8a65'],
]
const floatingWords = [
  {
    id: 0,
    text: '狗狗',
    note: '我是你的狗，汪汪汪',
    x: 10,
    y: 14,
    rotate: -16,
    size: 48,
  },
  { id: 1, text: '海鲜', note: '好耶，共同爱好', x: 24, y: 10, rotate: 9, size: 56 },
  { id: 2, text: '智性恋', note: '其实两个人都是 nerd', x: 40, y: 18, rotate: -8, size: 34 },
  { id: 3, text: '爬山', note: '爬山好玩，还想爬', x: 58, y: 12, rotate: 20, size: 60 },
  { id: 4, text: '科幻片', note: '科幻片好看', x: 76, y: 20, rotate: -12, size: 40 },
  {
    id: 5,
    text: '探索',
    note: '总会有新的事物会让我们俩都喜欢的，我相信',
    x: 86,
    y: 14,
    rotate: 6,
    size: 46,
  },
  {
    id: 6,
    text: '翻译',
    note: '我们需要学会翻译，从对方的话里看见对方真正想表达的东西',
    x: 14,
    y: 35,
    rotate: 14,
    size: 64,
  },
  {
    id: 7,
    text: '灵感',
    note: '小松鼠想邀请你一起吃松果（可怜巴巴）',
    x: 32,
    y: 29,
    rotate: -20,
    size: 38,
  },
  {
    id: 8,
    text: '尊重',
    note: '我可以不同意你的观点，但我尊重你的判断',
    x: 49,
    y: 38,
    rotate: 5,
    size: 52,
  },
  {
    id: 9,
    text: '理解',
    note: '我们的优势恰好来自于差异，你保留自己的坚定，同时增加温度，我保留自己的敏锐，同时增加稳定',
    x: 66,
    y: 31,
    rotate: -10,
    size: 44,
  },
  {
    id: 10,
    text: '成长',
    note: '我们不是固定互补，而是动态互相影响',
    x: 82,
    y: 36,
    rotate: 18,
    size: 66,
  },
  {
    id: 11,
    text: '温柔的坚定',
    note: '最适合我们共同追求的状态',
    x: 18,
    y: 56,
    rotate: -7,
    size: 38,
  },
  {
    id: 12,
    text: '长期主义',
    note: '因为遇见彼此，我们都成为了更好的人',
    x: 36,
    y: 50,
    rotate: 12,
    size: 58,
  },
  {
    id: 13,
    text: '互为外挂',
    note: '两个人各装了对方的一部分技能。我身上有你缺少的敏锐、想象、情绪感知，你身上有我缺少的果断、稳定、行动力',
    x: 55,
    y: 61,
    rotate: -15,
    size: 46,
  },
  {
    id: 14,
    text: '雷达和引擎',
    note: '我容易想到很多可能性，看到细节和趋势，你更容易把想法变成计划和行动',
    x: 74,
    y: 54,
    rotate: 8,
    size: 60,
  },
].map((word, index) => ({
  ...word,
  palette: wordPalettes[index % wordPalettes.length],
}))

function getAnniversaryTime() {
  const diff = Math.max(0, Date.now() - anniversaryStart.getTime())
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

type AnniversaryTime = ReturnType<typeof getAnniversaryTime>

function HeroTitle({
  elapsed,
  onPointerMove,
  onPointerLeave,
}: {
  elapsed: AnniversaryTime
  onPointerMove: (event: React.MouseEvent<HTMLHeadingElement>) => void
  onPointerLeave: () => void
}) {
  const timeParts = [
    { value: elapsed.days, unit: '天' },
    { value: elapsed.hours, unit: '小时' },
    { value: elapsed.minutes, unit: '分钟' },
    { value: elapsed.seconds, unit: '秒' },
  ]
  const label = timeParts.map((part) => `${part.value}${part.unit}`).join('')

  return (
    <h1
      className="hero-title"
      aria-label={`我们在一起已经 ${label}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="hero-title-line">我们在一起已经</span>
      <span className="hero-title-line hero-time-line">
        {timeParts.map((part) => (
          <span className="time-pill" key={part.unit}>
            <span className="time-number">{part.value}</span>
            <span className="time-unit">{part.unit}</span>
          </span>
        ))}
      </span>
    </h1>
  )
}

function CatSlider() {
  const [activeOption, setActiveOption] = useState<number>(0)

  return (
    <div className="cat-slider-container">
      <div className="cat-slider-spotlight" aria-hidden="true" />
      <div className="cat-slider-wrapper">
        {sliderOptions.map((option) => (
          <button
            key={option.id}
            className={`cat-option-item ${activeOption === option.id ? 'active' : ''}`}
            style={
              {
                '--defaultBackground': option.defaultColor,
                '--photo-ratio': option.ratio,
              } as React.CSSProperties
            }
            type="button"
            onPointerEnter={() => setActiveOption(option.id)}
            aria-label="请输入文本"
          >
            <div className="cat-photo-placeholder">
              <img src={option.image} alt="" loading={option.id === 0 ? 'eager' : 'lazy'} />
            </div>
          </button>
        ))}

        <div className="cat-inactive-options">
          {sliderOptions.map(
            (option) =>
              option.id !== activeOption && (
                <button
                  key={option.id}
                  className="cat-inactive-option"
                  type="button"
                  style={{ '--defaultBackground': option.defaultColor } as React.CSSProperties}
                  onPointerEnter={() => setActiveOption(option.id)}
                  onClick={() => setActiveOption(option.id)}
                  aria-label="请输入文本"
                >
                  <span className="cat-inactive-option-inner">{option.icon}</span>
                </button>
              ),
          )}
        </div>
        <div className="cat-slider-dots" aria-hidden="true">
          {sliderOptions.map((option) => (
            <span
              key={option.id}
              className={`cat-slider-dot ${option.id === activeOption ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FloatingWordsPage() {
  const [hoveredWord, setHoveredWord] = useState<null | {
    id: number
    x: number
    y: number
    note: string
    placement: 'top' | 'bottom'
  }>(null)

  const handleWordEnter = (event: React.PointerEvent<HTMLDivElement>, word: (typeof floatingWords)[number]) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const placement = word.y <= 30 ? 'bottom' : 'top'
    setHoveredWord({
      id: word.id,
      x: rect.left + rect.width * 0.5,
      y: placement === 'bottom' ? rect.bottom - rect.height * 0.1 : rect.top + rect.height * 0.16,
      note: word.note,
      placement,
    })
  }

  return (
    <div className="floating-words-stage">
      {floatingWords.map((word) => (
        <div
          className={`floating-word ${hoveredWord?.id === word.id ? 'is-hovered' : ''}`}
          key={word.id}
          onPointerEnter={(event) => handleWordEnter(event, word)}
          onPointerLeave={() => setHoveredWord(null)}
          style={
            {
              left: `${word.x}%`,
              top: `${word.y}%`,
              '--word-rotate': `${word.rotate}deg`,
              '--word-size': `${word.size}px`,
              '--word-delay': `${word.id * 95}ms`,
              '--word-color-a': word.palette[0],
              '--word-color-b': word.palette[1],
              '--word-phase': `${word.id * 0.37}rad`,
            } as React.CSSProperties
          }
        >
          <Suspense fallback={<span className="word-fallback">词语</span>}>
            <WaveText text={word.text} />
          </Suspense>
        </div>
      ))}
      {hoveredWord && (
        <div
          className={`word-tooltip is-${hoveredWord.placement}`}
          style={
            {
              left: `${hoveredWord.x}px`,
              top: `${hoveredWord.y}px`,
            } as React.CSSProperties
          }
        >
          <p>{hoveredWord.note}</p>
        </div>
      )}
    </div>
  )
}

function useSectionPreload(refs: Array<React.RefObject<HTMLElement | null>>) {
  const [loadedSections, setLoadedSections] = useState(() => new Set([0]))

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    refs.forEach((ref, index) => {
      const target = ref.current
      if (!target || loadedSections.has(index)) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadedSections((current) => {
              if (current.has(index)) return current
              const next = new Set(current)
              next.add(index)
              return next
            })
            observer.disconnect()
          }
        },
        { rootMargin: '80% 0px', threshold: 0.01 },
      )

      observer.observe(target)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [refs, loadedSections])

  return loadedSections
}

function ArchiveCard({ id, image, lit, tilt, depth }: ArchiveCardData) {
  const [cardTilt, setCardTilt] = useState(cardTiltBase)

  const handleCardMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setCardTilt({ x: y * -4.5, y: x * 6 })
  }

  return (
    <div
      className={`archive-card-frame with-photo ${lit ? 'is-lit' : ''}`}
      data-tilt={tilt}
      data-depth={depth}
      style={{
        '--tilt': `${tilt}deg`,
        '--depth': `${depth}px`,
        '--delay': `${Math.min(id - 1, 28) * 34}ms`,
      } as React.CSSProperties}
    >
      <article
        className="archive-card"
        style={
          {
            '--card-rx': `${cardTilt.x}deg`,
            '--card-ry': `${cardTilt.y}deg`,
          } as React.CSSProperties
        }
        onPointerMove={handleCardMove}
        onPointerLeave={() => setCardTilt(cardTiltBase)}
      >
        <img src={image} alt="" loading={id <= 8 ? 'eager' : 'lazy'} draggable="false" />
      </article>
    </div>
  )
}

function App() {
  const heroRef = useRef<HTMLElement | null>(null)
  const sliderRef = useRef<HTMLElement | null>(null)
  const archiveRef = useRef<HTMLElement | null>(null)
  const wordsRef = useRef<HTMLElement | null>(null)
  const newsletterRef = useRef<HTMLElement | null>(null)
  const editorRef = useRef<HTMLElement | null>(null)
  const archiveViewportRef = useRef<HTMLDivElement | null>(null)
  const [archiveVisible, setArchiveVisible] = useState(false)
  const [transitionStarted, setTransitionStarted] = useState(false)
  const [titleTilt, setTitleTilt] = useState({ x: 0, y: 0 })
  const [hitMark, setHitMark] = useState<{ id: number; x: number; y: number } | null>(null)
  const [elapsed, setElapsed] = useState(getAnniversaryTime)
  const sectionRefs = useMemo(() => [heroRef, sliderRef, archiveRef, wordsRef, newsletterRef, editorRef], [])
  const loadedSections = useSectionPreload(sectionRefs)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed(getAnniversaryTime())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const target = archiveRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArchiveVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.36 },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let locked = false

    const scrollToSection = (target: HTMLElement | null) => {
      if (!target) return

      locked = true
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.setTimeout(() => {
        locked = false
      }, 920)
    }

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

      const archiveViewport = archiveViewportRef.current
      const isInsideArchiveViewport =
        archiveViewport instanceof HTMLElement && event.target instanceof Node && archiveViewport.contains(event.target)

      if (isInsideArchiveViewport) {
        const maxScroll = archiveViewport.scrollWidth - archiveViewport.clientWidth
        const atStart = archiveViewport.scrollLeft <= 2
        const atEnd = archiveViewport.scrollLeft >= maxScroll - 2
        const shouldPage = (event.deltaY > 0 && atEnd) || (event.deltaY < 0 && atStart)

        if (!shouldPage) return
      }

      event.preventDefault()
      if (locked) return

      const sections = [
        heroRef.current,
        sliderRef.current,
        archiveRef.current,
        wordsRef.current,
        newsletterRef.current,
        editorRef.current,
      ].filter((section): section is HTMLElement => section instanceof HTMLElement)
      const currentIndex = sections.reduce((closestIndex, section, index) => {
        const currentDistance = Math.abs(section.getBoundingClientRect().top)
        const closestDistance = Math.abs(sections[closestIndex]?.getBoundingClientRect().top ?? 0)
        return currentDistance < closestDistance ? index : closestIndex
      }, 0)
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + (event.deltaY > 0 ? 1 : -1)))

      if (nextIndex !== currentIndex) {
        if (sections[nextIndex] === archiveRef.current) setArchiveVisible(true)
        scrollToSection(sections[nextIndex])
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  useEffect(() => {
    const target = archiveViewportRef.current
    if (!target) return

    let raf = 0
    let velocity = 0
    let lastX = 0
    let isDragging = false

    const clampScroll = (value: number) => {
      const maxScroll = target.scrollWidth - target.clientWidth
      return Math.min(maxScroll, Math.max(0, value))
    }

    const paintDepth = () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const viewportRect = target.getBoundingClientRect()
      const viewportCenter = viewportRect.left + viewportRect.width / 2
      const speed = Math.min(1, Math.abs(velocity) / 24)

      target.style.setProperty('--flow-velocity', `${speed}`)
      target.style.setProperty('--particle-drift', `${velocity * -1.6}px`)

      target.querySelectorAll<HTMLElement>('.archive-card-frame').forEach((card) => {
        const rect = card.getBoundingClientRect()
        const center = rect.left + rect.width / 2
        const offset = Math.max(-1.18, Math.min(1.18, (center - viewportCenter) / (viewportRect.width * 0.48)))
        const edge = Math.min(1, Math.abs(offset))
        const clarity = 1 - edge
        const baseTilt = Number.parseFloat(card.dataset.tilt ?? '0')
        const baseDepth = Number.parseFloat(card.dataset.depth ?? '0')

        if (reduceMotion) {
          card.style.opacity = '1'
          card.style.filter = 'none'
          card.style.transform = 'none'
          card.style.zIndex = '1'
          return
        }

        card.style.opacity = `${0.36 + clarity * 0.64}`
        card.style.filter = [
          `blur(${edge * 2.8 + speed * edge * 4.2}px)`,
          `grayscale(${card.classList.contains('is-lit') ? edge * 0.08 : 0.72 + edge * 0.14})`,
          `saturate(${card.classList.contains('is-lit') ? 1 + clarity * 0.08 : 0.42 + clarity * 0.22})`,
          `brightness(${0.88 + clarity * 0.14})`,
        ].join(' ')
        card.style.transform = [
          `translateZ(${baseDepth - edge * 260 + clarity * 42}px)`,
          `rotateY(${-offset * 28 + velocity * 0.08}deg)`,
          `rotateZ(${baseTilt * (0.45 + clarity * 0.55) + velocity * 0.035}deg)`,
          `scale(${0.76 + clarity * 0.26 - speed * edge * 0.035})`,
        ].join(' ')
        card.style.zIndex = `${Math.round(100 + clarity * 100)}`
      })
    }

    const delayedPaint = window.setTimeout(paintDepth, 260)

    const runInertia = () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!isDragging && !reduceMotion) {
        target.scrollLeft = clampScroll(target.scrollLeft + velocity)
        velocity *= 0.935
      }

      paintDepth()

      if (!isDragging && Math.abs(velocity) < 0.08) {
        velocity = 0
        raf = 0
        return
      }

      raf = window.requestAnimationFrame(runInertia)
    }

    const startLoop = () => {
      if (!raf) raf = window.requestAnimationFrame(runInertia)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

      isDragging = true
      lastX = event.clientX
      velocity = 0
      target.classList.add('is-dragging')
      target.setPointerCapture(event.pointerId)
      startLoop()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return

      const delta = event.clientX - lastX
      lastX = event.clientX
      velocity = velocity * 0.42 - delta * 0.58
      target.scrollLeft = clampScroll(target.scrollLeft - delta)
      startLoop()
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDragging) return

      isDragging = false
      target.classList.remove('is-dragging')
      target.releasePointerCapture(event.pointerId)
      startLoop()
    }

    const handleScroll = () => {
      paintDepth()
    }

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 3 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

      const maxScroll = target.scrollWidth - target.clientWidth
      const atStart = target.scrollLeft <= 2
      const atEnd = target.scrollLeft >= maxScroll - 2

      if ((event.deltaY > 0 && atEnd) || (event.deltaY < 0 && atStart)) {
        velocity = 0
        if (raf) {
          window.cancelAnimationFrame(raf)
          raf = 0
        }
        paintDepth()
        return
      }

      event.preventDefault()
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const wheelVelocity = Math.max(-30, Math.min(30, event.deltaY * 0.28))

      if (reduceMotion) {
        target.scrollLeft = clampScroll(target.scrollLeft + wheelVelocity * 6)
        paintDepth()
        return
      }

      velocity = velocity * 0.38 + wheelVelocity
      startLoop()
    }

    paintDepth()
    window.addEventListener('resize', paintDepth)
    target.addEventListener('pointerdown', handlePointerDown)
    target.addEventListener('pointermove', handlePointerMove)
    target.addEventListener('pointerup', handlePointerUp)
    target.addEventListener('pointercancel', handlePointerUp)
    target.addEventListener('wheel', handleWheel, { passive: false })
    target.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', paintDepth)
      target.removeEventListener('pointerdown', handlePointerDown)
      target.removeEventListener('pointermove', handlePointerMove)
      target.removeEventListener('pointerup', handlePointerUp)
      target.removeEventListener('pointercancel', handlePointerUp)
      target.removeEventListener('wheel', handleWheel)
      target.removeEventListener('scroll', handleScroll)
      window.clearTimeout(delayedPaint)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const openArchive = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    setHitMark({
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
    setTransitionStarted(true)
    window.setTimeout(() => {
      sliderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 780)
  }

  const openEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleTitleMove = (event: React.MouseEvent<HTMLHeadingElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTitleTilt({ x: y * -5, y: x * 7 })
  }

  return (
    <main id="top" className={`inspiration-page ${transitionStarted ? 'is-transitioning' : ''}`}>
      <div className="ambient-glow glow-a" />
      <div className="ambient-glow glow-b" />

      <section className="hero-shell" ref={heroRef} aria-label="请输入文本">
        <Suspense fallback={null}>
          <div className="character-field-layer">
            <CharacterField />
          </div>
        </Suspense>
        <div className="hero-center">
          <div
            className="hero-title-wrap"
            style={
              {
                '--tilt-x': `${titleTilt.x}deg`,
                '--tilt-y': `${titleTilt.y}deg`,
              } as React.CSSProperties
            }
          >
            <HeroTitle
              elapsed={elapsed}
              onPointerMove={handleTitleMove}
              onPointerLeave={() => setTitleTilt({ x: 0, y: 0 })}
            />
          </div>
          <Suspense
            fallback={
              <div className="hero-model-stage is-loading" aria-label="3D模型加载中" />
            }
          >
            {loadedSections.has(0) && <HeroModelStage />}
          </Suspense>
          <a className="primary-action" href="#slider" onClick={openArchive}>
            点开看看
            <ArrowDown size={16} />
            {hitMark && (
              <span
                className="hit-diamond"
                key={hitMark.id}
                style={{ left: hitMark.x, top: hitMark.y }}
                aria-hidden="true"
              />
            )}
          </a>
        </div>
      </section>

      <section ref={sliderRef} className="cat-slider-section" id="slider" aria-label="请输入文本">
        <CatSlider />
      </section>

      <section
        ref={archiveRef}
        className={`archive-section ${archiveVisible ? 'is-visible' : ''}`}
        id="archive"
        aria-label="请输入文本"
      >
        <Suspense fallback={null}>{loadedSections.has(2) && <OilShader />}</Suspense>
        <div className="archive-viewport" ref={archiveViewportRef}>
          <div className="archive-track">
            {archiveCards.map((card) => (
              <ArchiveCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section ref={wordsRef} className="floating-words-section" id="words" aria-label="词语">
        {loadedSections.has(3) && <FloatingWordsPage />}
      </section>

      <section ref={newsletterRef} className="newsletter-section" id="newsletter" aria-label="Coming Soon">
        <Suspense fallback={null}>{loadedSections.has(4) && <PinkNewsletterPage onOpen={openEditor} />}</Suspense>
      </section>

      <section ref={editorRef} className="rich-editor-section" id="editor" aria-label="Rich text editor">
        <Suspense fallback={null}>{loadedSections.has(5) && <RichTextEditorPage />}</Suspense>
      </section>
    </main>
  )
}

export default App
