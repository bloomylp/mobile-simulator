// src/components/card/CardActions.jsx
import { useState } from 'react'
import { Eye, EyeOff, Settings } from 'lucide-react'

function AddToWalletButton() {
  return (
    <button
      disabled
      aria-label="Added to Wallet"
      className="w-full rounded-xl focus:outline-none disabled:opacity-70"
    >
      <div className="flex items-center justify-center bg-black text-white rounded-xl py-3 text-sm font-semibold min-h-[50px]">
        Added to Wallet
      </div>
    </button>
  )
}

export function CardActions({ card, onManage }) {
  const [revealed, setRevealed] = useState(false)

  // Append T00:00:00 so the date is parsed as local midnight, not UTC midnight
  const formattedDate = card.createdAt
    ? new Date(card.createdAt + 'T00:00:00').toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  return (
    <div className="flex flex-col gap-1 px-1">
      {/* Action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setRevealed((v) => !v)}
          className="flex items-center gap-1.5 text-[#2DB87E] text-sm font-medium cursor-pointer hover:text-[#1A7A50] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded min-h-[44px] px-2"
          aria-label={revealed ? 'Hide card details' : 'Show card details'}
          aria-expanded={revealed}
        >
          {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
          {revealed ? 'Hide Details' : 'Show Details'}
        </button>

        <button
          onClick={onManage}
          className="flex items-center gap-1.5 text-[#6B7280] text-sm font-medium cursor-pointer hover:text-[#1A1F2E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded min-h-[44px] px-3"
          aria-label="Manage card"
        >
          Manage <Settings size={13} />
        </button>
      </div>

      {/* Creation date reveal */}
      {revealed && (
        <p className="text-[#6B7280] text-xs px-2 pb-1" aria-live="polite">
          Created: {formattedDate}
        </p>
      )}

      {/* Add to Wallet — only for newly issued digital cards */}
      {card.status === 'new' && card.cardType === 'digital' && (
        <div className="px-1 pt-1 pb-1">
          <AddToWalletButton />
        </div>
      )}
    </div>
  )
}
