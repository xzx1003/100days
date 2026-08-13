import { Warp } from '@paper-design/shaders-react'
import { useState } from 'react'

function PinkNewsletterPage({ onOpen }: { onOpen: () => void }) {
  const [hitMark, setHitMark] = useState<{ id: number; x: number; y: number } | null>(null)
  const [opening, setOpening] = useState(false)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (opening) return
    const rect = event.currentTarget.getBoundingClientRect()
    setHitMark({
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
    setOpening(true)
    window.setTimeout(onOpen, 560)
  }

  return (
    <div className={`pink-newsletter-page ${opening ? 'is-opening' : ''}`}>
      <div className="pink-newsletter-shader">
        <Warp
          style={{ height: '100%', width: '100%' }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={['hsl(340, 100%, 20%)', 'hsl(320, 100%, 75%)', 'hsl(350, 90%, 30%)', 'hsl(330, 100%, 80%)']}
        />
      </div>

      <div className="pink-newsletter-content">
        <div className="pink-newsletter-panel">
          <h2>见字如面</h2>

          <div className="pink-newsletter-form">
            <button type="button" onClick={handleOpen} aria-label="点击查看">
              点击查看
              {hitMark && (
                <span
                  className="hit-diamond"
                  key={hitMark.id}
                  style={{ left: hitMark.x, top: hitMark.y }}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinkNewsletterPage
