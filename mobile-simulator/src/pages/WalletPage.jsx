// src/pages/WalletPage.jsx
// Standalone /wallet route — renders the transit pass detail + Add Pass sub-flow.
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WalletFlowProvider, useWalletFlow } from '../android/apps/wallet/WalletFlowContext.jsx'
import { TransitPassDetailScreen } from '../android/apps/wallet/screens/TransitPassDetailScreen.jsx'
import { PassListScreen } from '../android/apps/wallet/screens/PassListScreen.jsx'
import { ReviewPaymentScreen } from '../android/apps/wallet/screens/ReviewPaymentScreen.jsx'
import { ProcessingScreen } from '../android/apps/wallet/screens/ProcessingScreen.jsx'

function WalletStepRouter() {
  const { step } = useWalletFlow()
  const navigate = useNavigate()

  useEffect(() => {
    if (step === 'main') navigate('/home')
  }, [step, navigate])

  switch (step) {
    case 'passlist':   return <PassListScreen />
    case 'review':     return <ReviewPaymentScreen />
    case 'processing': return <ProcessingScreen />
    default:           return <TransitPassDetailScreen />
  }
}

export function WalletPage() {
  return (
    <WalletFlowProvider initialStep="pass-detail">
      <WalletStepRouter />
    </WalletFlowProvider>
  )
}
