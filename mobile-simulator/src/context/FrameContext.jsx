// src/context/FrameContext.jsx
// Top-level shell state: showControls (side panel + toggle visibility) + platform (ios/android).
import { createContext, useContext, useState } from 'react'

export const FrameContext = createContext({
  showControls: false,
  setShowControls: () => {},
  platform: 'ios',
  setPlatform: () => {},
})

export function FrameProvider({ children }) {
  const [showControls, setShowControls] = useState(false)
  const [platform, setPlatform] = useState('ios')
  return (
    <FrameContext.Provider value={{ showControls, setShowControls, platform, setPlatform }}>
      {children}
    </FrameContext.Provider>
  )
}

export function useFrame() {
  return useContext(FrameContext)
}
