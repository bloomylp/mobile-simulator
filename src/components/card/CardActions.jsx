// src/components/card/CardActions.jsx
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Settings } from 'lucide-react'

function AppleWalletOverlay({ onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger slide-up on next frame
    const showTimer = requestAnimationFrame(() => setVisible(true))
    // Slide back down after 2s, then call onDone
    const hideTimer = setTimeout(() => setVisible(false), 3000)
    const doneTimer = setTimeout(onDone, 3450) // after slide-down finishes
    return () => {
      cancelAnimationFrame(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <img
        src="/apple_wallet.png"
        alt="Apple Wallet"
        style={{
          width: '100%',
          maxWidth: '390px',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
          borderRadius: '24px 24px 0 0',
          display: 'block',
        }}
        draggable="false"
      />
    </div>
  )
}

function AddToWalletButton() {
  const [state, setState] = useState('idle') // idle | animating | added

  function handleClick() {
    if (state !== 'idle') return
    setState('animating')
  }

  function handleDone() {
    setState('added')
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state === 'added'}
        className="w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] rounded-xl disabled:opacity-70 active:scale-95 transition-transform duration-150"
        aria-label="Add to Apple Wallet"
      >
        {state === 'added' ? (
          <div className="flex items-center justify-center gap-2 bg-black text-white rounded-xl py-3 text-sm font-semibold min-h-[50px]">
            Added to Wallet
          </div>
        ) : (
          <img
            src="/wallet.png"
            alt="Add to Apple Wallet"
            width={155}
            height={48}
            className="rounded-xl"
            draggable="false"
          />
        )}
      </button>

      {state === 'animating' && <AppleWalletOverlay onDone={handleDone} />}
    </>
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
