// src/components/topup/CardPaymentForm.jsx
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { formatCardNumber, formatExpiry } from '../../utils/formatCard.js'

export function CardPaymentForm({ amount, onSuccess }) {
  const [fields, setFields] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const processingTimerRef = useRef(null)

  useEffect(() => () => clearTimeout(processingTimerRef.current), [])

  function update(key, value) {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const errs = {}
    const digits = fields.cardNumber.replace(/\s/g, '')
    if (digits.length < 13) errs.cardNumber = 'Enter a valid card number'
    if (!/^\d{2}\/\d{2}$/.test(fields.expiry)) errs.expiry = 'Enter expiry as MM/YY'
    if (fields.cvv.length < 3) errs.cvv = 'Enter 3-digit CVV'
    if (!fields.name.trim()) errs.name = 'Enter cardholder name'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    processingTimerRef.current = setTimeout(() => { setLoading(false); onSuccess() }, 1200)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Card number */}
      <div className="flex flex-col gap-1">
        <label htmlFor="pay-card-number" className="text-sm font-medium text-[#1A1F2E]">Card Number</label>
        <input
          id="pay-card-number"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          value={fields.cardNumber}
          onChange={(e) => update('cardNumber', formatCardNumber(e.target.value))}
          aria-describedby={errors.cardNumber ? 'err-card' : undefined}
          aria-invalid={!!errors.cardNumber}
          className={`border rounded-xl px-4 py-3 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.cardNumber ? 'border-[#DC2626]' : 'border-gray-200'}`}
        />
        {errors.cardNumber && <p id="err-card" className="text-[#DC2626] text-xs" role="alert">{errors.cardNumber}</p>}
      </div>

      {/* Expiry + CVV */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="pay-expiry" className="text-sm font-medium text-[#1A1F2E]">Expiry</label>
          <input
            id="pay-expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={fields.expiry}
            onChange={(e) => update('expiry', formatExpiry(e.target.value))}
            aria-describedby={errors.expiry ? 'err-expiry' : undefined}
            aria-invalid={!!errors.expiry}
            className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.expiry ? 'border-[#DC2626]' : 'border-gray-200'}`}
          />
          {errors.expiry && <p id="err-expiry" className="text-[#DC2626] text-xs" role="alert">{errors.expiry}</p>}
        </div>
        <div className="flex flex-col gap-1 w-20 shrink-0">
          <label htmlFor="pay-cvv" className="text-sm font-medium text-[#1A1F2E]">CVV</label>
          <input
            id="pay-cvv"
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            value={fields.cvv}
            onChange={(e) => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            aria-describedby={errors.cvv ? 'err-cvv' : undefined}
            aria-invalid={!!errors.cvv}
            className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.cvv ? 'border-[#DC2626]' : 'border-gray-200'}`}
          />
          {errors.cvv && <p id="err-cvv" className="text-[#DC2626] text-xs" role="alert">{errors.cvv}</p>}
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="pay-name" className="text-sm font-medium text-[#1A1F2E]">Name on Card</label>
        <input
          id="pay-name"
          type="text"
          autoComplete="cc-name"
          placeholder="John Smith"
          value={fields.name}
          onChange={(e) => update('name', e.target.value)}
          aria-describedby={errors.name ? 'err-name' : undefined}
          aria-invalid={!!errors.name}
          className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow ${errors.name ? 'border-[#DC2626]' : 'border-gray-200'}`}
        />
        {errors.name && <p id="err-name" className="text-[#DC2626] text-xs" role="alert">{errors.name}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing…' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  )
}
