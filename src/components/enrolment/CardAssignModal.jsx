// src/components/enrolment/CardAssignModal.jsx
import { useState } from 'react'
import { X, CreditCard, PlusCircle, Smartphone } from 'lucide-react'
import { Button } from '../ui/Button.jsx'
import { addExtraCard } from '../../utils/cardsStore.js'

function formatCardNumber(raw) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function isFormComplete({ name, cardNumber, expiry, cvv }) {
  return (
    name.trim().length > 0 &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3
  )
}

const TILE_BASE = 'flex items-center gap-3 bg-[#F4F6F8] rounded-2xl px-4 py-3 cursor-pointer border-2 transition-colors duration-150 min-h-[56px]'

export function CardAssignModal({ cards, onSelect, onClose }) {
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: '', cardNumber: '', expiry: '', cvv: '' })

  const isConfirmEnabled = selected !== null && (
    selected === '__new-card__' ? isFormComplete(form) : true
  )

  function handleConfirm() {
    if (selected === '__new-card__') {
      const digits = form.cardNumber.replace(/\s/g, '')
      const newCard = {
        id: `card-new-${Date.now()}`,
        name: form.name.trim(),
        pan: `•••• •••• •••• ${digits.slice(-4)}`,
        panFull: form.cardNumber,
        panSuffix: digits.slice(-4),
        expiry: form.expiry,
        status: 'new',
        cardType: 'digital',
        balance: 0,
        spent: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      addExtraCard(newCard)
      onSelect(newCard.id)
    } else if (selected === '__new-digital-card__') {
      onClose()
    } else {
      onSelect(selected)
    }
  }

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
              className={`${TILE_BASE} ${selected === card.id ? 'border-[#2DB87E]' : 'border-transparent'}`}
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

          {/* Add a new card tile + expandable form */}
          <label className={`${TILE_BASE} ${selected === '__new-card__' ? 'border-[#2DB87E]' : 'border-transparent'}`}>
            <input
              type="radio"
              name="assign-card"
              value="__new-card__"
              checked={selected === '__new-card__'}
              onChange={() => setSelected('__new-card__')}
              className="accent-[#2DB87E] w-4 h-4 cursor-pointer"
              aria-label="Add a new card"
            />
            <PlusCircle size={18} className="text-[#6B7280] shrink-0" />
            <span className="text-[#1A1F2E] text-sm font-medium">Add a new card</span>
          </label>

          {selected === '__new-card__' && (
            <div className="flex flex-col gap-3 px-1 pb-1">
              <div className="flex flex-col gap-1">
                <label htmlFor="new-card-name" className="text-[#1A1F2E] text-xs font-medium">Name</label>
                <input
                  id="new-card-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Cardholder name"
                  className="w-full bg-[#F4F6F8] rounded-xl px-4 py-3 text-sm text-[#1A1F2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
                  aria-label="Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="new-card-number" className="text-[#1A1F2E] text-xs font-medium">Card Number</label>
                <input
                  id="new-card-number"
                  type="text"
                  inputMode="numeric"
                  value={form.cardNumber}
                  onChange={e => setForm(f => ({ ...f, cardNumber: formatCardNumber(e.target.value) }))}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={19}
                  className="w-full bg-[#F4F6F8] rounded-xl px-4 py-3 text-sm text-[#1A1F2E] font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
                  aria-label="Card Number"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="new-card-expiry" className="text-[#1A1F2E] text-xs font-medium">Expiry</label>
                  <input
                    id="new-card-expiry"
                    type="text"
                    inputMode="numeric"
                    value={form.expiry}
                    onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-[#F4F6F8] rounded-xl px-4 py-3 text-sm text-[#1A1F2E] font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
                    aria-label="Expiry"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label htmlFor="new-card-cvv" className="text-[#1A1F2E] text-xs font-medium">CVV</label>
                  <input
                    id="new-card-cvv"
                    type="text"
                    inputMode="numeric"
                    value={form.cvv}
                    onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full bg-[#F4F6F8] rounded-xl px-4 py-3 text-sm text-[#1A1F2E] font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
                    aria-label="CVV"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Create a new digital card tile */}
          <label className={`${TILE_BASE} ${selected === '__new-digital-card__' ? 'border-[#2DB87E]' : 'border-transparent'}`}>
            <input
              type="radio"
              name="assign-card"
              value="__new-digital-card__"
              checked={selected === '__new-digital-card__'}
              onChange={() => setSelected('__new-digital-card__')}
              className="accent-[#2DB87E] w-4 h-4 cursor-pointer"
              aria-label="Create a new digital card"
            />
            <Smartphone size={18} className="text-[#6B7280] shrink-0" />
            <span className="text-[#1A1F2E] text-sm font-medium">Create a new digital card</span>
          </label>
        </div>

        {/* CTA */}
        <div className="px-5 pb-8 pt-2">
          <Button
            className="w-full"
            disabled={!isConfirmEnabled}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
