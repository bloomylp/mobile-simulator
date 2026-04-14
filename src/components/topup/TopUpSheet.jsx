// src/components/topup/TopUpSheet.jsx
import { useEffect, useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { CardPaymentForm } from './CardPaymentForm.jsx'
import { ApplePayButton }  from './ApplePayButton.jsx'
import { GooglePayButton } from './GooglePayButton.jsx'

const PRESET_AMOUNTS = [10, 20, 50, 100]

export function TopUpSheet({ onClose }) {
  const [amount, setAmount] = useState(20)
  const [customAmount, setCustomAmount] = useState('')
  const [tab, setTab] = useState('card')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSuccess() {
    setSuccess(true)
    setTimeout(onClose, 2000)
  }

  const displayAmount = customAmount ? parseFloat(customAmount) || 0 : amount

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Top up your card"
      >
        <div className="w-full max-w-sm bg-white rounded-t-3xl shadow-2xl max-h-[90dvh] overflow-y-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" aria-hidden="true" />
          </div>

          <div className="px-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between py-4">
              <h2 className="text-[#1A1F2E] text-lg font-bold">Top Up</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close top up"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <CheckCircle2 size={56} className="text-[#2DB87E]" strokeWidth={1.5} />
                <p className="text-[#1A1F2E] font-bold text-lg">Balance Updated!</p>
                <p className="text-[#6B7280] text-sm">£{displayAmount.toFixed(2)} added to your card</p>
              </div>
            ) : (
              <>
                {/* Amount presets */}
                <div className="mb-5">
                  <p className="text-sm font-medium text-[#1A1F2E] mb-3">Select amount</p>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {PRESET_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustomAmount('') }}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] min-h-[44px] ${
                          amount === a && !customAmount
                            ? 'bg-[#2DB87E] text-white border-[#2DB87E]'
                            : 'bg-white text-[#1A1F2E] border-gray-200 hover:border-[#2DB87E]'
                        }`}
                        aria-pressed={amount === a && !customAmount}
                      >
                        £{a}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#2DB87E]">
                    <span className="text-[#6B7280] text-sm mr-2">£</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setAmount(0) }}
                      className="flex-1 text-sm text-[#1A1F2E] focus:outline-none bg-transparent"
                      aria-label="Custom top-up amount in pounds"
                    />
                  </div>
                </div>

                {/* Payment method tabs */}
                <div className="flex gap-2 mb-5">
                  {[
                    { id: 'card',   label: 'Card' },
                    { id: 'apple',  label: 'Apple Pay' },
                    { id: 'google', label: 'Google Pay' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] min-h-[44px] ${
                        tab === id
                          ? 'bg-[#E8F7F0] text-[#1A7A50] border-[#2DB87E]'
                          : 'bg-white text-[#6B7280] border-gray-200 hover:border-[#2DB87E]'
                      }`}
                      aria-pressed={tab === id}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Payment content */}
                {tab === 'card' && (
                  <CardPaymentForm amount={displayAmount} onSuccess={handleSuccess} />
                )}
                {tab === 'apple' && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[#6B7280] text-sm text-center">
                      Confirm £{displayAmount.toFixed(2)} top-up with Apple Pay
                    </p>
                    <ApplePayButton onClick={handleSuccess} />
                  </div>
                )}
                {tab === 'google' && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[#6B7280] text-sm text-center">
                      Confirm £{displayAmount.toFixed(2)} top-up with Google Pay
                    </p>
                    <GooglePayButton onClick={handleSuccess} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
