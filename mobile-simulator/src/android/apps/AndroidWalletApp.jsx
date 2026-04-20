// src/android/apps/AndroidWalletApp.jsx
// Entry for the Android Wallet app — wraps flow state, branches on step.
import { WalletFlowProvider, useWalletFlow } from './wallet/WalletFlowContext.jsx'
import { WalletMainScreen } from './wallet/screens/WalletMainScreen.jsx'
import { AddToWalletCategoriesScreen } from './wallet/screens/AddToWalletCategoriesScreen.jsx'
import { SearchAgencyScreen } from './wallet/screens/SearchAgencyScreen.jsx'
import { TransitInsightsOptInScreen } from './wallet/screens/TransitInsightsOptInScreen.jsx'
import { SelectPaymentMethodScreen } from './wallet/screens/SelectPaymentMethodScreen.jsx'
import { RideReadyScreen } from './wallet/screens/RideReadyScreen.jsx'
import { TransitPassDetailScreen } from './wallet/screens/TransitPassDetailScreen.jsx'
import { PassListScreen } from './wallet/screens/PassListScreen.jsx'
import { ReviewPaymentScreen } from './wallet/screens/ReviewPaymentScreen.jsx'
import { ProcessingScreen } from './wallet/screens/ProcessingScreen.jsx'
import { SettingsScreen } from './wallet/screens/SettingsScreen.jsx'

function StepRouter() {
  const { step } = useWalletFlow()
  switch (step) {
    case 'categories':  return <AddToWalletCategoriesScreen />
    case 'search':      return <SearchAgencyScreen />
    case 'insights':    return <TransitInsightsOptInScreen />
    case 'payment':     return <SelectPaymentMethodScreen />
    case 'ready':       return <RideReadyScreen />
    case 'pass-detail': return <TransitPassDetailScreen />
    case 'passlist':    return <PassListScreen />
    case 'review':      return <ReviewPaymentScreen />
    case 'processing':  return <ProcessingScreen />
    case 'settings':    return <SettingsScreen />
    case 'main':
    default:            return <WalletMainScreen />
  }
}

export function AndroidWalletApp() {
  return (
    <div data-testid="android-wallet-app" style={{ minHeight: '100%', background: '#FFFFFF' }}>
      <WalletFlowProvider>
        <StepRouter />
      </WalletFlowProvider>
    </div>
  )
}
