// Screen 7 — You're ready to ride.
import { Check } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { AppSurface, PillButton, TEXT_PRIMARY, TEXT_MUTED } from '../ui/primitives.jsx'

function ReaderIllustration() {
  return (
    <svg width="200" height="160" viewBox="0 0 220 160" aria-hidden="true">
      {/* Reader block */}
      <path d="M40 60 L130 60 L150 80 L150 130 L60 130 L40 110 Z" fill="#FCD34D" />
      <path d="M40 60 L60 40 L150 40 L130 60 Z" fill="#FDE68A" />
      <path d="M150 80 L150 130 L170 110 L170 60 Z" fill="#F59E0B" />
      {/* Contactless waves on reader */}
      <path d="M95 90 Q105 100 95 110" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M105 86 Q120 100 105 114" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M115 82 Q135 100 115 118" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Phone */}
      <rect x="120" y="30" width="60" height="85" rx="8" fill="#BFDBFE" />
      <rect x="126" y="38" width="48" height="68" rx="3" fill="#DBEAFE" />
      <text x="150" y="78" textAnchor="middle" fontSize="14" fill="#93C5FD" fontFamily="Roboto, sans-serif">12:30</text>
    </svg>
  )
}

export function RideReadyScreen() {
  const { selectedPayment, goTo } = useWalletFlow()
  return (
    <AppSurface>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px 0', gap: 24 }}>
        {/* Big blue tick */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#3B82F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={44} color="white" strokeWidth={3} aria-hidden="true" />
        </div>

        <ReaderIllustration />

        <div style={{ alignSelf: 'stretch' }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 400, color: TEXT_PRIMARY }}>You're ready to ride</h1>
          <p style={{ margin: '12px 0 0', fontSize: 14, color: TEXT_MUTED, lineHeight: 1.5 }}>
            Pay and ride with {selectedPayment ?? 'your card'} to see progress towards free and reduced rides, reminders, and more
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 32px' }}>
        <PillButton onClick={() => goTo('pass-detail')}>View in Wallet</PillButton>
      </div>
    </AppSurface>
  )
}
