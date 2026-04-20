// Screen — Processing animation, auto-advances to pass-detail after 3s.
import { useEffect } from 'react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { AppSurface, TEXT_PRIMARY } from '../ui/primitives.jsx'

const BLOB_STYLE = `
@keyframes wallet-blob-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`

export function ProcessingScreen() {
  const { goTo, addPass, selectedPass } = useWalletFlow()

  useEffect(() => {
    const t = setTimeout(() => {
      if (selectedPass) {
        addPass({ id: `pass-${Date.now()}`, brand: selectedPass.name, amount: selectedPass.amount })
      }
      goTo('pass-detail')
    }, 3000)
    return () => clearTimeout(t)
  // goTo and addPass are inline functions in WalletFlowProvider (stable state setters);
  // selectedPass is fixed at navigate time and won't change while this screen mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppSurface style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <style>{BLOB_STYLE}</style>

      <div style={{ padding: '80px 20px 0' }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.3px', color: '#2DB87E' }}>
          little<span style={{ color: TEXT_PRIMARY }}>bus</span>
        </p>
        <h1 style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 400, color: TEXT_PRIMARY }}>
          Processing…
        </h1>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          aria-hidden="true"
          style={{
            width: 90,
            height: 90,
            borderRadius: '30% 70% 65% 35% / 40% 35% 65% 60%',
            background: '#F4A57A',
            animation: 'wallet-blob-spin 1.4s linear infinite',
          }}
        />
      </div>
    </AppSurface>
  )
}
