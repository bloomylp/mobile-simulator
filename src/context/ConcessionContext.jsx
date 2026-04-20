// src/context/ConcessionContext.jsx
import { createContext, useContext, useState } from 'react'

export const ConcessionContext = createContext(null)

export function ConcessionProvider({ children }) {
  const [enrolled, setEnrolled] = useState(false)
  const [concessionData, setConcessionDataState] = useState(null)

  function setConcessionData(group, card) {
    setConcessionDataState({ group, card, enrolledAt: Date.now() })
  }

  function resetConcession() {
    setEnrolled(false)
    setConcessionDataState(null)
  }

  return (
    <ConcessionContext.Provider value={{ enrolled, setEnrolled, concessionData, setConcessionData, resetConcession }}>
      {children}
    </ConcessionContext.Provider>
  )
}

export function useConcession() {
  const ctx = useContext(ConcessionContext)
  if (!ctx) throw new Error('useConcession must be used inside ConcessionProvider')
  return ctx
}
