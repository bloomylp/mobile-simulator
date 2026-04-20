// Screen 2 — Add to Wallet categories.
import { X, CreditCard, Train, Heart, Gift, Camera } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { AppSurface, TopBar, IconButton, TEXT_PRIMARY, TEXT_MUTED, SUBTLE_BG } from '../ui/primitives.jsx'

const CATEGORIES = [
  { id: 'payment',  label: 'Payment card',   sub: 'Pay everywhere Google Pay is accepted',                 Icon: CreditCard, enabled: false },
  { id: 'transit',  label: 'Transit pass',   sub: 'Get around town with your phone',                       Icon: Train,      enabled: true  },
  { id: 'loyalty',  label: 'Loyalty card',   sub: 'Earn and use your rewards and points',                  Icon: Heart,      enabled: false },
  { id: 'gift',     label: 'Gift card',      sub: 'Shop and pay with a gift card',                         Icon: Gift,       enabled: false },
  { id: 'other',    label: 'Everything else',sub: 'Take a photo of any pass like an event ticket, gym membership, or insurance card', Icon: Camera,     enabled: false },
]

function CategoryRow({ item, onSelect }) {
  const { Icon } = item
  return (
    <button
      onClick={item.enabled ? onSelect : undefined}
      disabled={!item.enabled}
      aria-label={item.label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        background: 'transparent',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: item.enabled ? 'pointer' : 'default',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: '#F4E4C8',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} strokeWidth={1.8} color={TEXT_PRIMARY} aria-hidden="true" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: TEXT_PRIMARY }}>{item.label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: TEXT_MUTED, lineHeight: 1.35 }}>{item.sub}</p>
      </div>
    </button>
  )
}

export function AddToWalletCategoriesScreen() {
  const { close, goTo } = useWalletFlow()
  return (
    <AppSurface>
      <TopBar
        left={
          <IconButton onClick={close} ariaLabel="Close">
            <X size={22} aria-hidden="true" />
          </IconButton>
        }
        right={<div aria-hidden="true" style={{ width: 22, height: 22 }} />}
      />
      <div style={{ padding: '0 20px 8px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 400, color: TEXT_PRIMARY, letterSpacing: '0.1px' }}>
          Add to Wallet
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 12 }}>
        {CATEGORIES.map((cat) => (
          <CategoryRow
            key={cat.id}
            item={cat}
            onSelect={() => cat.id === 'transit' && goTo('search')}
          />
        ))}
      </div>

      {/* Info tile */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          background: SUBTLE_BG,
          borderRadius: 16,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div aria-hidden="true" style={{ width: 44, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#4285F4,#1a56db)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.4 }}>
              Look for the “Add to Google Wallet” button online and in other apps
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8B6B3F', fontWeight: 500 }}>
              Learn how to add to Wallet
            </p>
          </div>
        </div>
      </div>
    </AppSurface>
  )
}
