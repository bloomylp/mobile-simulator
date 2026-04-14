// src/components/card/CardActions.jsx
import { useState } from 'react'
import { Eye, EyeOff, Settings } from 'lucide-react'

export function CardActions({ card, onShowDetails }) {
  const [revealed, setRevealed] = useState(false)

  function handleToggle() {
    setRevealed((prev) => !prev)
    onShowDetails?.(!revealed)
  }

  return (
    <div className="flex flex-col gap-1 px-1">
      {/* Action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleToggle}
          className="flex items-center gap-1.5 text-[#2DB87E] text-sm font-medium cursor-pointer hover:text-[#1A7A50] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px] px-2"
          aria-label={revealed ? 'Hide card details' : 'Show card details'}
          aria-expanded={revealed}
        >
          {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
          {revealed ? 'Hide Details' : 'Show Details'}
        </button>

        <button
          className="flex items-center gap-1.5 text-[#6B7280] text-sm font-medium cursor-pointer hover:text-[#1A1F2E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded min-h-[44px] px-3"
          aria-label="Manage card"
        >
          Manage <Settings size={13} />
        </button>
      </div>

      {/* PAN reveal — below the action row to avoid layout shift between buttons */}
      {revealed && (
        <p className="text-[#1A1F2E] font-mono text-xs tracking-widest px-2 pb-1" aria-live="polite">
          {card.panFull}
        </p>
      )}
    </div>
  )
}
