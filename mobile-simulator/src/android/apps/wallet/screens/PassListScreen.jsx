// Screen — Pass product list (Littlepay GTI agency passes).
import { ArrowLeft } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { PASS_PRODUCTS } from '../data/walletSeed.js'
import { AppSurface, IconButton, TEXT_PRIMARY, TEXT_MUTED, SUBTLE_BG } from '../ui/primitives.jsx'

function PassRow({ product, onSelect }) {
  return (
    <button
      onClick={onSelect}
      aria-label={product.name}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px',
        background: SUBTLE_BG,
        border: 'none',
        borderRadius: 16,
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <p style={{ margin: 0, fontSize: 15, color: TEXT_PRIMARY, fontWeight: 400 }}>{product.name}</p>
      <p style={{ margin: 0, fontSize: 15, color: TEXT_PRIMARY, fontWeight: 500 }}>{product.amount}</p>
    </button>
  )
}

export function PassListScreen() {
  const { back, goTo, setSelectedPass } = useWalletFlow()

  function handleSelect(product) {
    setSelectedPass(product)
    goTo('review')
  }

  return (
    <AppSurface>
      <div style={{ padding: '56px 12px 8px' }}>
        <IconButton onClick={back} ariaLabel="Back">
          <ArrowLeft size={22} aria-hidden="true" />
        </IconButton>
      </div>

      <div style={{ padding: '8px 20px 16px' }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.3px', color: '#2DB87E' }}>
          little<span style={{ color: TEXT_PRIMARY }}>bus</span>
        </p>
        <h1 style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 400, color: TEXT_PRIMARY }}>
          Littlepay GTI
        </h1>
      </div>

      <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PASS_PRODUCTS.map((p) => (
          <PassRow key={p.id} product={p} onSelect={() => handleSelect(p)} />
        ))}
      </div>
    </AppSurface>
  )
}
