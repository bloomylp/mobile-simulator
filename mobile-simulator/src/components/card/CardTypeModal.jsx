// src/components/card/CardTypeModal.jsx
import { useState } from 'react'
import { X, CreditCard, Smartphone } from 'lucide-react'
import { Button } from '../ui/Button.jsx'

function CardPreview({ type, selected, onClick }) {
  const isPhysical = type === 'physical'

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-3 cursor-pointer focus:outline-none group`}
      aria-pressed={selected}
      aria-label={isPhysical ? 'Physical card' : 'Digital card'}
    >
      {/* Card shape */}
      <div
        className={`w-full rounded-2xl p-4 flex flex-col justify-between transition-all duration-150
          ${selected
            ? 'ring-2 ring-[#2DB87E] shadow-md scale-[1.03]'
            : 'ring-1 ring-gray-200 group-hover:ring-[#2DB87E]/50 group-hover:scale-[1.01]'}
        `}
        style={{
          aspectRatio: '1.586 / 1',
          background: selected
            ? 'linear-gradient(135deg, #4CC48A 0%, #1A7A50 100%)'
            : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        }}
      >
        {/* Top row: mini chip + label */}
        <div className="flex items-start justify-between">
          <div
            className={`w-6 h-4 rounded-sm ${selected ? 'bg-white/60' : 'bg-[#2DB87E]/40'}`}
          />
          <span
            className={`text-[10px] font-bold tracking-wider ${selected ? 'text-white/70' : 'text-[#1A7A50]/60'}`}
          >
            littlepay
          </span>
        </div>

        {/* Centre icon */}
        <div className="flex items-center justify-center py-1">
          {isPhysical
            ? <CreditCard size={28} className={selected ? 'text-white' : 'text-[#1A7A50]/70'} strokeWidth={1.5} />
            : <Smartphone  size={28} className={selected ? 'text-white' : 'text-[#1A7A50]/70'} strokeWidth={1.5} />
          }
        </div>

        {/* Bottom row: mock pan dots */}
        <div className="flex items-center gap-1.5">
          {[0,1,2].map(i => (
            <div
              key={i}
              className={`flex gap-0.5`}
            >
              {[0,1,2,3].map(j => (
                <div
                  key={j}
                  className={`w-1 h-1 rounded-full ${selected ? 'bg-white/60' : 'bg-[#1A7A50]/40'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={`text-sm font-semibold ${selected ? 'text-[#1A7A50]' : 'text-[#1A1F2E]'}`}>
          {isPhysical ? 'Physical Card' : 'Digital Card'}
        </p>
        <p className="text-[11px] text-[#6B7280] mt-0.5">
          {isPhysical ? 'Delivered to your door' : 'Ready instantly'}
        </p>
      </div>
    </button>
  )
}

export function CardTypeModal({ onConfirm, onClose }) {
  const [selected, setSelected] = useState(null)

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-type-title"
    >
      {/* Dim layer */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-sm bg-white rounded-t-3xl px-6 pt-5 pb-8 shadow-xl animate-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="card-type-title" className="text-[#1A1F2E] text-lg font-bold">
            Choose Card Type
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#6B7280] hover:bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] transition-colors duration-150"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card options */}
        <div className="flex gap-4 mb-7">
          <CardPreview
            type="physical"
            selected={selected === 'physical'}
            onClick={() => setSelected('physical')}
          />
          <CardPreview
            type="digital"
            selected={selected === 'digital'}
            onClick={() => setSelected('digital')}
          />
        </div>

        {/* CTA */}
        <Button
          className="w-full"
          disabled={!selected}
          onClick={() => onConfirm(selected)}
        >
          {selected === 'digital' ? 'Add Card to Wallet' : selected === 'physical' ? 'Order Physical Card' : 'Order Card'}
        </Button>
      </div>
    </div>
  )
}
