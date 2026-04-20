// src/android/apps/wallet/WalletFlowContext.jsx
// State machine for the Android Wallet "Add Transit Pass" flow.
import { createContext, useContext, useState } from 'react'

export const STEPS = {
  main: 'main',
  categories: 'categories',
  search: 'search',
  insights: 'insights',
  payment: 'payment',
  ready: 'ready',
  passDetail: 'pass-detail',
  passlist: 'passlist',
  review: 'review',
  processing: 'processing',
}

// Linear back stack — each step's parent
const BACK = {
  categories:   'main',
  search:       'categories',
  insights:     'search',
  payment:      'insights',
  ready:        'payment',
  'pass-detail':'main',
  settings:     'main',
  passlist:     'pass-detail',
  review:       'passlist',
}

const WalletFlowContext = createContext(null)

export function useWalletFlow() {
  const v = useContext(WalletFlowContext)
  if (!v) throw new Error('useWalletFlow must be used inside WalletFlowProvider')
  return v
}

export function WalletFlowProvider({ children, initialStep = 'main' }) {
  const [step, setStep] = useState(initialStep)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [passes, setPasses] = useState([])
  const [termsOpen, setTermsOpen] = useState(false)
  const [selectedPass, setSelectedPass] = useState(null)

  function goTo(nextStep) { setStep(nextStep) }
  function close() { setStep('main'); setTermsOpen(false) }
  function back() { setStep((s) => BACK[s] ?? 'main'); setTermsOpen(false) }
  function addPass(pass) { setPasses((p) => [...p, pass]) }
  function openTerms() { setTermsOpen(true) }
  function closeTerms() { setTermsOpen(false) }

  return (
    <WalletFlowContext.Provider value={{
      step, selectedPayment, passes, termsOpen, selectedPass,
      goTo, back, close, addPass, setSelectedPayment, openTerms, closeTerms, setSelectedPass,
    }}>
      {children}
    </WalletFlowContext.Provider>
  )
}
