// src/components/enrolment/SheerIDModal.jsx
import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { Button } from '../ui/Button.jsx'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const EMPTY_FORM = { firstName: '', lastName: '', month: '', day: '', year: '', postalCode: '', email: '' }

function isComplete(form) {
  return Object.values(form).every(v => v.trim() !== '')
}

export function SheerIDModal({ onVerified, onClose }) {
  const [form, setForm]         = useState(EMPTY_FORM)
  const [verified, setVerified] = useState(false)

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setVerified(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-[#1A1F2E] text-base font-semibold">Identity Verification</h2>
        <button
          onClick={verified ? onVerified : onClose}
          className="p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
          aria-label="Close"
        >
          <X size={20} className="text-[#6B7280]" />
        </button>
      </div>

      {/* TEST MODE banner */}
      <div className="bg-[#D32F2F] text-white text-xs font-semibold text-center py-2 tracking-wide">
        TEST MODE <span className="underline font-normal cursor-pointer">(learn more)</span>
      </div>

      {verified ? (
        <div className="flex flex-col flex-1 px-6 py-12">
          <div className="flex flex-col items-center text-center gap-4 flex-1">
            <CheckCircle size={56} className="text-gray-300" strokeWidth={1.25} />
            <h3 className="text-[#1A1F2E] text-lg font-bold">You've been verified</h3>
            <p className="text-[#6B7280] text-sm">Thank you for completing</p>
            <p className="text-[#6B7280] text-sm mt-2">
              If you have any questions contact us{' '}
              <span className="text-[#2DB87E]">support@littlepay.com</span>
            </p>
            <p className="text-[#9CA3AF] text-xs mt-4 max-w-xs">
              SheerID handles verification only. Now that you've been approved, please direct all questions about the promotion terms to Littlepay customer service.
            </p>
          </div>
          <Button className="w-full mt-8 -translate-y-[20px]" onClick={onVerified}>
            Continue
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-6 flex-1">
          <div className="text-center mb-2">
            <h3 className="text-[#1A1F2E] text-base font-bold">Register for Concession</h3>
            <p className="text-[#6B7280] text-sm mt-1">Verify your current age.</p>
            <button type="button" className="text-[#2DB87E] text-sm underline cursor-pointer focus:outline-none">
              How does verifying work?
            </button>
          </div>

          <p className="text-[#6B7280] text-xs">* Required information</p>

          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-first" className="text-[#1A1F2E] text-sm font-medium">First name*</label>
            <input
              id="sheer-first"
              aria-label="First name"
              value={form.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="given-name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-last" className="text-[#1A1F2E] text-sm font-medium">Last name*</label>
            <input
              id="sheer-last"
              aria-label="Last name"
              value={form.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="family-name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#1A1F2E] text-sm font-medium">Date of birth*</span>
            <p className="text-[#6B7280] text-xs">Used for verification purposes only</p>
            <div className="flex gap-2">
              <select
                aria-label="Month"
                value={form.month}
                onChange={e => handleChange('month', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#2DB87E] cursor-pointer"
              >
                <option value="">Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input
                aria-label="Day"
                placeholder="Day"
                value={form.day}
                onChange={e => handleChange('day', e.target.value.replace(/\D/g, '').slice(0, 2))}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
                inputMode="numeric"
              />
              <input
                aria-label="Year"
                placeholder="Year"
                value={form.year}
                onChange={e => handleChange('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-postal" className="text-[#1A1F2E] text-sm font-medium">Postal code*</label>
            <input
              id="sheer-postal"
              aria-label="Postal code"
              value={form.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="postal-code"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sheer-email" className="text-[#1A1F2E] text-sm font-medium">Email address*</label>
            <p className="text-[#6B7280] text-xs">Personal email address is recommended</p>
            <input
              id="sheer-email"
              aria-label="Email address"
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={!isComplete(form)}
            className="w-full bg-[#424242] hover:bg-[#303030] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-3.5 cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 mt-2 min-h-[48px]"
            aria-label="Verify and continue"
          >
            Verify and continue
          </button>
        </form>
      )}
    </div>
  )
}
