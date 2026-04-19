// Screen — Review payment before purchasing a pass product.
import { ArrowLeft } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { AppSurface, IconButton, TEXT_PRIMARY, TEXT_MUTED, ACCENT } from '../ui/primitives.jsx'

export function ReviewPaymentScreen() {
  const { back, goTo, selectedPass } = useWalletFlow()

  return (
    <AppSurface style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '56px 12px 8px' }}>
        <IconButton onClick={back} ariaLabel="Back">
          <ArrowLeft size={22} aria-hidden="true" />
        </IconButton>
      </div>

      <div style={{ padding: '8px 20px', flex: 1 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.3px', color: '#2DB87E' }}>
          little<span style={{ color: TEXT_PRIMARY }}>bus</span>
        </p>
        <h1 style={{ margin: '12px 0 24px', fontSize: 28, fontWeight: 400, color: TEXT_PRIMARY }}>
          Review payment
        </h1>

        {selectedPass && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <p style={{ margin: 0, fontSize: 16, color: TEXT_PRIMARY }}>{selectedPass.name}</p>
            <p style={{ margin: 0, fontSize: 16, color: TEXT_PRIMARY, fontWeight: 500 }}>{selectedPass.amount}</p>
          </div>
        )}
      </div>

      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        {selectedPass && (
          <p style={{ margin: 0, fontSize: 15, color: TEXT_MUTED, textAlign: 'center' }}>
            Payment to Littlepay GTI: {selectedPass.amount}
          </p>
        )}
        <button
          onClick={() => goTo('processing')}
          aria-label="Continue"
          style={{
            width: '100%',
            background: ACCENT,
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '16px 0',
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
            letterSpacing: '0.2px',
          }}
        >
          Continue
        </button>
      </div>
    </AppSurface>
  )
}
