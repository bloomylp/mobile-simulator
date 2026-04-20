// src/components/card/CardChip.jsx
import { Trash2, X } from 'lucide-react'

const STATUS_LABEL = { active: 'Active', pending: 'Pending', frozen: 'Frozen', new: 'New' }

const FRONT_GRAD      = 'linear-gradient(135deg, #4CC48A 0%, #2DB87E 60%, #1A7A50 100%)'
const BACK_GRAD       = 'linear-gradient(135deg, #1A7A50 0%, #0D4F34 100%)'
const FRONT_GRAD_OFF  = 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 60%, #4B5563 100%)'
const BACK_GRAD_OFF   = 'linear-gradient(135deg, #4B5563 0%, #374151 100%)'

export function CardChip({
  card,
  showStatus  = false,
  cardLabel   = 'Primary Card',
  displayPan  = null,
  balance     = 0,
  flipped     = false,
  isActive    = true,
  onFlipBack,
  onDelete,
}) {
  const frontGrad = isActive ? FRONT_GRAD : FRONT_GRAD_OFF
  const backGrad  = isActive ? BACK_GRAD  : BACK_GRAD_OFF
  return (
    <div style={{ perspective: '1200px' }}>
      <div
        role="region"
        aria-label={`${card.status} card ending ${(card.panSuffix ?? card.panFull?.replace(/\s/g, '') ?? '').slice(-4)}`}
        style={{
          position:        'relative',
          height:          '160px',
          transformStyle:  'preserve-3d',
          transition:      'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          transform:       flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── Front face ── */}
        <div
          className="absolute inset-0 rounded-2xl p-5 overflow-hidden select-none"
          style={{ backfaceVisibility: 'hidden', background: frontGrad }}
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 bg-white" />

          <div className="relative flex items-center justify-between mb-6">
            {showStatus ? (
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {STATUS_LABEL[card.status] ?? card.status}
              </span>
            ) : (
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
                {cardLabel}
              </span>
            )}
            <span className="text-white font-bold text-sm tracking-tight">
              little<span className="text-[#E8F7F0]">pay</span>
            </span>
          </div>

          <div className="relative mb-3">
            {balance > 0 ? (
              <p className="text-white font-mono text-sm tracking-widest">Balance ${balance.toFixed(2)}</p>
            ) : (
              <p className="text-white font-mono text-sm invisible">Balance $0.00</p>
            )}
          </div>

          <div className="relative flex items-end justify-between">
            <p className="text-white/90 font-mono text-sm tracking-widest">{displayPan ?? card.pan}</p>
            <div className="flex flex-col items-end gap-1">
              {/* Contactless icon */}
              <svg width="24" height="18" viewBox="0 0 20 15" fill="none" aria-hidden="true" style={{ position: 'relative', top: '-5px' }}>
                <circle cx="2" cy="7.5" r="1.5" fill="white" opacity="0.9" />
                <path d="M5.5 4 Q9 7.5 5.5 11" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M9 1.5 Q14.5 7.5 9 13.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d="M12.5 0 Q19.5 7.5 12.5 15" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
              </svg>
              <p className="text-white/80 text-xs font-medium">{card.expiry}</p>
            </div>
          </div>
        </div>

        {/* ── Back face ── */}
        <div
          className="absolute inset-0 rounded-2xl p-5 overflow-hidden select-none"
          style={{
            backfaceVisibility: 'hidden',
            transform:          'rotateY(180deg)',
            background:         backGrad,
          }}
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 bg-white" />

          <div className="relative flex justify-end" style={{ marginTop: '-5px' }}>
            <button
              onClick={onFlipBack}
              className="text-white/60 hover:text-white rounded-full p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors duration-150"
              aria-label="Close card management"
            >
              <X size={16} />
            </button>
          </div>

          <div className="relative flex items-center justify-center" style={{ marginTop: '14px' }}>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-[#DC2626] text-sm font-semibold rounded-xl px-6 py-2.5 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 min-h-[44px]"
            >
              <Trash2 size={14} className="text-[#DC2626]" aria-hidden="true" />
              Delete card
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
