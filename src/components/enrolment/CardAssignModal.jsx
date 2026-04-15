// src/components/enrolment/CardAssignModal.jsx
import { useState } from 'react'
import { X, CreditCard } from 'lucide-react'
import { Button } from '../ui/Button.jsx'

export function CardAssignModal({ cards, onSelect, onClose }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
      <div className="bg-white w-full rounded-t-3xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[#1A1F2E] text-base font-semibold">Select a Card</h2>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
            aria-label="Close"
          >
            <X size={20} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Card list */}
        <div className="flex flex-col gap-3 px-5 py-4">
          {cards.map(card => (
            <label
              key={card.id}
              className={`flex items-center gap-3 bg-[#F4F6F8] rounded-2xl px-4 py-3 cursor-pointer border-2 transition-colors duration-150 min-h-[56px]
                ${selected === card.id ? 'border-[#2DB87E]' : 'border-transparent'}`}
            >
              <input
                type="radio"
                name="assign-card"
                value={card.id}
                checked={selected === card.id}
                onChange={() => setSelected(card.id)}
                className="accent-[#2DB87E] w-4 h-4 cursor-pointer"
                aria-label={`Card ending ${card.panSuffix}`}
              />
              <CreditCard size={18} className="text-[#6B7280] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#1A1F2E] text-sm font-medium">{card.name}</span>
                <span className="text-[#6B7280] text-xs">•••• {card.panSuffix}</span>
              </div>
            </label>
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-8 pt-2">
          <Button
            className="w-full"
            disabled={!selected}
            onClick={() => onSelect(selected)}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
