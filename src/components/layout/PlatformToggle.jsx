// src/components/layout/PlatformToggle.jsx
import { useFrame } from '../../context/FrameContext.jsx'

const SEGMENTS = [
  { value: 'ios',     label: 'iPhone' },
  { value: 'android', label: 'Android' },
]

export function PlatformToggle() {
  const { showControls, platform, setPlatform } = useFrame()
  if (!showControls) return null

  return (
    <div
      role="radiogroup"
      aria-label="Device platform"
      style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        padding: 4,
        borderRadius: 999,
        background: '#F4F6F8',
        border: '1px solid #D1D5DB',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        flexShrink: 0,
      }}
    >
      {SEGMENTS.map((seg) => {
        const active = platform === seg.value
        return (
          <button
            key={seg.value}
            role="radio"
            aria-checked={active}
            aria-label={seg.label}
            onClick={() => setPlatform(seg.value)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '8px 0',
              width: 84,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.1px',
              cursor: 'pointer',
              background: active ? '#1A1F2E' : 'transparent',
              color: active ? '#FFFFFF' : '#6B7280',
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
