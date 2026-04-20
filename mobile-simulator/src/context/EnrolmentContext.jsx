// src/context/EnrolmentContext.jsx
import { createContext, useContext, useState } from 'react'

const INITIAL = { group: null, verified: false, card: null, pendingCard: null }

const EnrolmentContext = createContext(null)

export function EnrolmentProvider({ children, initialState = {} }) {
  const [state, setState] = useState({ ...INITIAL, ...initialState })

  function setGroup(group) { setState(s => ({ ...s, group })) }
  function setVerified(verified) { setState(s => ({ ...s, verified })) }
  function setCard(card) { setState(s => ({ ...s, card })) }
  function setPendingCard(pendingCard) { setState(s => ({ ...s, pendingCard })) }
  function resetEnrolment() { setState(INITIAL) }

  return (
    <EnrolmentContext.Provider value={{ state, setGroup, setVerified, setCard, setPendingCard, resetEnrolment }}>
      {children}
    </EnrolmentContext.Provider>
  )
}

export function useEnrolment() {
  const ctx = useContext(EnrolmentContext)
  if (!ctx) throw new Error('useEnrolment must be used inside EnrolmentProvider')
  return ctx
}
