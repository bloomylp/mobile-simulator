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
    <div className="flex items-center justify-between px-1 py-2">
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-[#2DB87E] text-sm font-medium cursor-pointer hover:text-[#1A7A50] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded"
        aria-label={revealed ? 'Hide card details' : 'Show card details'}
      >
        {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
        {revealed ? 'Hide Details' : 'Show Details'}
      </button>

      {revealed && (
        <p className="text-[#1A1F2E] font-mono text-xs tracking-widest">{card.panFull}</p>
      )}

      <button
        className="flex items-center gap-1.5 text-[#6B7280] text-sm font-medium cursor-pointer hover:text-[#1A1F2E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
        aria-label="Manage card"
      >
        Manage <Settings size={13} />
      </button>
    </div>
  )
}
