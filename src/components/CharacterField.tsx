import { useEffect, useRef } from 'react'

const glyphs = '░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯'

function CharacterField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let time = 0
    let pointerX = -1000
    let pointerY = -1000
    let pointerActive = false
    let visible = false
    let cells: Array<{ x: number; y: number; glyph: string; phase: number; weight: number }> = []

    const buildCells = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.floor(rect.width * dpr))
      const height = Math.max(1, Math.floor(rect.height * dpr))
      const spacing = Math.max(14, Math.min(20, rect.width / 72))
      const columns = Math.ceil(rect.width / spacing) + 2
      const rows = Math.ceil(rect.height / spacing) + 2

      canvas.width = width
      canvas.height = height
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      cells = Array.from({ length: columns * rows }, (_, index) => {
        const col = index % columns
        const row = Math.floor(index / columns)
        const hash = Math.sin((col + 1) * 12.9898 + (row + 1) * 78.233) * 43758.5453
        const normalized = hash - Math.floor(hash)

        return {
          x: col * spacing - spacing * 0.5,
          y: row * spacing - spacing * 0.5,
          glyph: glyphs[Math.floor(normalized * glyphs.length)],
          phase: normalized * Math.PI * 2,
          weight: 0.7 + normalized * 0.6,
        }
      })
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerX = event.clientX - rect.left
      pointerY = event.clientY - rect.top
      pointerActive = true
    }

    const handlePointerLeave = () => {
      pointerActive = false
    }

    const render = () => {
      if (!visible) {
        frameRef.current = window.requestAnimationFrame(render)
        return
      }

      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const radius = Math.min(width, height) * 0.24

      context.clearRect(0, 0, width, height)
      context.font = '12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      cells.forEach((cell) => {
        const driftX = Math.sin(time * 0.36 + cell.phase) * 1.4
        const driftY = Math.cos(time * 0.28 + cell.phase * 1.3) * 1.1
        const baseX = cell.x + driftX
        const baseY = cell.y + driftY
        const dx = baseX - pointerX
        const dy = baseY - pointerY
        const distance = Math.hypot(dx, dy)
        const force = pointerActive ? Math.max(0, 1 - distance / radius) : 0
        const angle = Math.atan2(dy || 0.001, dx || 0.001)
        const easedForce = force * force * (3 - 2 * force)
        const scatter = easedForce * 42 * cell.weight
        const x = baseX + Math.cos(angle) * scatter
        const y = baseY + Math.sin(angle) * scatter
        const fade = 1 - easedForce * 0.78
        const breath = reduceMotion ? 0.95 : 0.86 + Math.sin(time * 0.8 + cell.phase) * 0.08
        const alpha = Math.max(0.03, 0.18 * fade * breath)

        context.fillStyle = `rgba(70, 74, 82, ${alpha})`
        context.fillText(cell.glyph, x, y)
      })

      if (!reduceMotion) time += 0.018
      frameRef.current = window.requestAnimationFrame(render)
    }

    buildCells()
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting)
      },
      { threshold: 0.01 },
    )
    visibilityObserver.observe(canvas)

    render()
    window.addEventListener('resize', buildCells)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('blur', handlePointerLeave)

    return () => {
      window.removeEventListener('resize', buildCells)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handlePointerLeave)
      visibilityObserver.disconnect()
      window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="character-field" aria-hidden="true" />
}

export default CharacterField
