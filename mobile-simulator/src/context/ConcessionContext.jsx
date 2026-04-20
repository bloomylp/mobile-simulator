// src/context/ConcessionContext.jsx
import { createContext, useContext, useState } from 'react'

export const ConcessionContext = createContext(null)

export function ConcessionProvider({ children }) {
  const [enrolled, setEnrolled] = useState(false)
  const [concessions, setConcessions] = useState([])

  function setConcessionData(group, card) {
    setConcessions(prev => [...prev, { group, card, enrolledAt: Date.now() }])
  }

  function resetConcession() {
    setEnrolled(false)
    setConcessions([])
  }

  return (
    <ConcessionContext.Provider value={{ enrolled, setEnrolled, concessions, setConcessionData, resetConcession }}>
      {children}
    </ConcessionContext.Provider>
  )
}

export function useConcession() {
  const ctx = useContext(ConcessionContext)
  if (!ctx) throw new Error('useConcession must be used inside ConcessionProvider')
  return ctx
}
