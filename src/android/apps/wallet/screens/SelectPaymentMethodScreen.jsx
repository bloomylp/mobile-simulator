// Screen 5 — Select payment method + Screen 6 (Activation terms modal).
import { ArrowLeft } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { PAYMENT_METHODS } from '../data/walletSeed.js'
import { AppSurface, IconButton, PillButton, TEXT_PRIMARY, TEXT_MUTED, SUBTLE_BG, ACCENT } from '../ui/primitives.jsx'

function CardRow({ method, onSelect }) {
  const isVisa = method.brand === 'Visa'
  return (
    <button
      onClick={onSelect}
      aria-label={method.label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        background: SUBTLE_BG,
        border: 'none',
        borderRadius: 16,
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div aria-hidden="true" style={{
        width: 44, height: 32, borderRadius: 6,
        background: isVisa
          ? 'linear-gradient(135deg,#1A1F71 0%, #12296E 100%)'
          : 'linear-gradient(135deg,#2C5E7F 0%, #142B46 100%)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 4,
      }}>
        {isVisa
          ? <span style={{ color: '#F6C056', fontSize: 9, fontWeight: 700 }}>VISA</span>
          : <div style={{ display: 'flex' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#EB001B', marginRight: -3 }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#F79E1B' }} />
            </div>
        }
      </div>
      <p style={{ margin: 0, fontSize: 15, color: TEXT_PRIMARY, fontWeight: 500 }}>
        {method.brand} •••• {method.last4}
      </p>
    </button>
  )
}

function ActivationTermsModal({ onCancel, onContinue }) {
  return (
    <>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40,
      }} />
      <div
        role="dialog"
        aria-label="Activation terms"
        aria-modal="true"
        style={{
          position: 'absolute',
          left: 20, right: 20, top: '50%',
          transform: 'translateY(-50%)',
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 24,
          zIndex: 41,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY }}>
          Activation terms
        </h2>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: TEXT_PRIMARY, lineHeight: 1.5 }}>
          The Transit Insights pass from Littlobus in Google Wallet is subject to the <span style={{ color: ACCENT, textDecoration: 'underline' }}>Google Terms of Service</span>.
        </p>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: TEXT_PRIMARY, lineHeight: 1.5 }}>
          When you connect your payment card to your Transit Insights pass, Google Wallet will share your payment card, account and device information with Littlobus and their service providers, and Google Wallet will receive transaction and account info from them. Google's <span style={{ color: ACCENT, textDecoration: 'underline' }}>Privacy Policy</span> describes how Google handles your data.
        </p>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: TEXT_PRIMARY, lineHeight: 1.5 }}>
          Review the Privacy Policy from Littlobus to learn how Littlobus uses your personal information.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <PillButton variant="ghost" onClick={onCancel}>No thanks</PillButton>
          <PillButton variant="ghost" onClick={onContinue} style={{ color: ACCENT }}>Continue</PillButton>
        </div>
      </div>
    </>
  )
}

export function SelectPaymentMethodScreen() {
  const {
    back, termsOpen, openTerms, closeTerms,
    setSelectedPayment, addPass, goTo,
  } = useWalletFlow()

  function handleCardPick(method) {
    setSelectedPayment(method.label)
    openTerms()
  }

  function handleContinue() {
    closeTerms()
    addPass({ id: `pass-${Date.now()}`, brand: 'Littlepay GTI' })
    goTo('ready')
  }

  return (
    <AppSurface style={{ position: 'absolute', inset: 0 }}>
      <div style={{ padding: '56px 12px 8px' }}>
        <IconButton onClick={back} ariaLabel="Back">
          <ArrowLeft size={22} aria-hidden="true" />
        </IconButton>
      </div>

      <div style={{ padding: '8px 20px' }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.3px', color: '#2DB87E' }}>
          Littlobus
        </p>
        <h1 style={{ margin: '16px 0 6px', fontSize: 28, fontWeight: 400, color: TEXT_PRIMARY }}>
          Select payment method
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: TEXT_MUTED, lineHeight: 1.4 }}>
          Choose which card you'd like to use to ride transit
        </p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PAYMENT_METHODS.map((m) => (
          <CardRow key={m.id} method={m} onSelect={() => handleCardPick(m)} />
        ))}
      </div>

      {termsOpen && (
        <ActivationTermsModal
          onCancel={closeTerms}
          onContinue={handleContinue}
        />
      )}
    </AppSurface>
  )
}
