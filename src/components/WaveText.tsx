import type { CSSProperties } from 'react'

interface WaveTextProps {
  text?: string
  className?: string
}

function WaveText({ text = '', className = '' }: WaveTextProps) {
  const characters = Array.from(text)

  if (!characters.length) return null

  return (
    <div className={`wave-text inline-flex flex-wrap gap-[1px] ${className}`}>
      {characters.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="wave-text-char"
          style={{
            '--char-delay': `${index * 0.1}s`,
          } as CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}

export default WaveText
