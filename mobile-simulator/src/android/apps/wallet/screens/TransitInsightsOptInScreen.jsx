// Screen 4 — Transit Insights opt-in for Littlepay.
import { X } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { AppSurface, TopBar, IconButton, PillButton, TEXT_PRIMARY, TEXT_MUTED, ACCENT } from '../ui/primitives.jsx'

function InsightsIllustration() {
  // Simple stylised phone + gauge per ref image
  return (
    <svg width="200" height="160" viewBox="0 0 200 160" aria-hidden="true">
      <rect x="30" y="20" width="90" height="130" rx="14" fill="#BFDBFE" />
      <rect x="40" y="38" width="70" height="100" rx="4" fill="#DBEAFE" />
      <rect x="50" y="50" width="22" height="10" rx="2" fill="#F59E0B" />
      <rect x="70" y="90" width="110" height="36" rx="8" fill="#F59E0B" />
      <circle cx="92" cy="108" r="4" fill="white" />
      <circle cx="110" cy="108" r="4" fill="white" />
      <circle cx="128" cy="108" r="4" fill="white" />
      <circle cx="146" cy="108" r="4" fill="white" />
      <path d="M150 30 L155 40 L150 40 Z" fill="#FCD34D" />
      <circle cx="162" cy="28" r="3" fill="#FCD34D" />
      <circle cx="168" cy="40" r="2" fill="#FCD34D" />
    </svg>
  )
}

export function TransitInsightsOptInScreen() {
  const { close, goTo } = useWalletFlow()
  return (
    <AppSurface>
      <TopBar
        left={
          <IconButton onClick={close} ariaLabel="Close">
            <X size={22} aria-hidden="true" />
          </IconButton>
        }
      />

      <div style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400, color: TEXT_PRIMARY, lineHeight: 1.2 }}>
          Get Transit Insights when you ride with Littlepay
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: TEXT_MUTED, lineHeight: 1.5 }}>
          See progress towards fare discounts and fare capping, get reminders, and more. You can still tap and pay to ride if you don't want to opt in.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
          <InsightsIllustration />
        </div>
        <p style={{ margin: 0, fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
          You can't change payment methods for this Transit Insights pass. The features of the Transit Insights pass only apply when you pay for rides with the linked payment method.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
          After adding your Transit Insights card to Wallet, you'll see notifications and updates in places like Maps, Shopping, and more. You can turn this off in <span style={{ color: ACCENT, textDecoration: 'underline' }}>manage passes data</span> or in the pass details.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 32px' }}>
        <PillButton variant="ghost" onClick={close}>No thanks</PillButton>
        <PillButton onClick={() => goTo('payment')}>I'm in</PillButton>
      </div>
    </AppSurface>
  )
}
