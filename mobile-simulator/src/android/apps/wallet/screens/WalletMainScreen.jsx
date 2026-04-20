// src/android/apps/wallet/screens/WalletMainScreen.jsx
// Screen 1 — Wallet main. Shows pre-seeded MasterCard + any added transit passes.
import { Plus } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { SEED_PASS } from '../data/walletSeed.js'
import { AppSurface, TopBar, TEXT_PRIMARY, TEXT_MUTED, ACCENT, SUBTLE_BG } from '../ui/primitives.jsx'

function MasterCardHero() {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#2C5E7F 0%, #1E3A5F 55%, #142B46 100%)',
      borderRadius: 16,
      padding: 20,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Decorative rings */}
      <div aria-hidden="true" style={{ position: 'absolute', right: -60, top: -40, width: 220, height: 220, borderRadius: '50%', border: '30px solid rgba(255,255,255,0.06)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', right: -120, top: 20, width: 260, height: 260, borderRadius: '50%', border: '22px solid rgba(255,255,255,0.04)' }} />
      <p style={{ margin: 0, fontSize: 20, fontWeight: 500, letterSpacing: '0.2px' }}>MasterCard</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: 13, letterSpacing: '1px', color: 'rgba(255,255,255,0.85)' }}>•••• {SEED_PASS.last4}</p>
        <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EB001B', marginRight: -8 }} />
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0099DF' }} />
        </div>
      </div>
    </div>
  )
}

function GtiPassChip({ pass, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={pass.brand}
      style={{
        background: '#0A0A0A',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        marginBottom: 8,
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.2px' }}>
        little<span style={{ color: '#2DB87E' }}>pay</span>
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 500 }}>{pass.brand}</p>
    </button>
  )
}

export function WalletMainScreen() {
  const { passes, goTo } = useWalletFlow()
  return (
    <AppSurface style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <TopBar
        title="Wallet"
        right={
          <button
            onClick={() => goTo('settings')}
            aria-label="Wallet settings"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#B9421C', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 500,
              border: 'none', cursor: 'pointer',
              fontFamily: 'Roboto, sans-serif',
            }}
          >L</button>
        }
      />

      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        <MasterCardHero />

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '12px 0 0', fontSize: 14, color: TEXT_MUTED }}>Hold to reader</p>
        </div>

        {/* Activation passes only (post-Add-to-Wallet flow) — clickable, reopens the pass detail.
            Purchased pass products (with amount) live exclusively on the pass-detail page. */}
        {passes.filter((p) => !p.amount).map((p) => (
          <GtiPassChip key={p.id} pass={p} onClick={() => goTo('pass-detail')} />
        ))}

        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <p style={{ margin: 0, fontSize: 14, color: ACCENT, fontWeight: 500 }}>Archived passes</p>
        </div>
      </div>

      {/* Add to Wallet FAB — pinned bottom-right */}
      <div style={{ position: 'absolute', bottom: 50, right: 20 }}>
        <button
          onClick={() => goTo('categories')}
          aria-label="Add to Wallet"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#F4E4C8',
            color: TEXT_PRIMARY,
            border: 'none',
            borderRadius: 16,
            padding: '14px 22px',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <Plus size={18} strokeWidth={2} aria-hidden="true" />
          Add to Wallet
        </button>
      </div>
    </AppSurface>
  )
}
