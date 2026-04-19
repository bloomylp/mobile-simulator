// src/components/layout/AndroidFrame.jsx
// Pixel 10 Obsidian shell. Separate view stack for Android apps via AndroidContext.
import { createContext, useContext, useState } from 'react'
import { Home as HomeIcon, MapPin, Ticket, AlertTriangle } from 'lucide-react'
import { useFrame } from '../../context/FrameContext.jsx'
import { PlatformToggle } from './PlatformToggle.jsx'
import { addTrip } from '../../android/apps/wallet/data/androidTripsStore.js'
import { showPaymentIssue } from '../../android/apps/wallet/data/androidPaymentIssueStore.js'

const AndroidContext = createContext({ currentApp: null, launchApp: () => {}, goHome: () => {} })

export function useAndroid() {
  return useContext(AndroidContext)
}

function CtrlBtn({ label, bg, onClick, icon: Icon = HomeIcon }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        background: bg,
        color: 'white',
        border: 'none',
        borderRadius: 10,
        padding: '10px 16px',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.3px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'opacity 0.15s ease',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Icon size={14} strokeWidth={2.2} />
      {label}
    </button>
  )
}

export function AndroidFrame({ children }) {
  const { showControls, setShowControls } = useFrame()
  const [currentApp, setCurrentApp] = useState(null)
  const launchApp = (id) => setCurrentApp(id)
  const goHome = () => setCurrentApp(null)

  return (
    <AndroidContext.Provider value={{ currentApp, launchApp, goHome }}>
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* ── Pixel 10 Obsidian outer shell ── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>

        {/* Right-side buttons: Power + Volume */}
        <div aria-hidden="true" style={{ position: 'absolute', right: -3, top: 165, width: 3, height: 60, background: '#1a1a1a', borderRadius: 2 }} />
        <div aria-hidden="true" style={{ position: 'absolute', right: -3, top: 240, width: 3, height: 90, background: '#1a1a1a', borderRadius: 2 }} />

        {/* Frame body — Obsidian (deep black) */}
        <div
          style={{
            width: 400,
            height: 860,
            borderRadius: 44,
            padding: 8,
            background: 'linear-gradient(145deg, #2a2a2a 0%, #0a0a0a 40%, #1a1a1a 70%, #050505 100%)',
            boxShadow:
              '0 50px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.5)',
          }}
        >
          {/* Screen */}
          <div
            data-testid="android-screen"
            style={{
              width: 384,
              height: 844,
              borderRadius: 38,
              overflow: 'hidden',
              position: 'relative',
              background: '#0A0A0A',
              transform: 'translateZ(0)',
            }}
          >
            {/* Punch-hole camera — clickable (toggles controls like iOS Dynamic Island) */}
            <button
              aria-label="Toggle controls"
              onClick={() => setShowControls((v) => !v)}
              style={{
                position: 'absolute',
                top: 14,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 14,
                height: 14,
                background: '#000',
                borderRadius: '50%',
                zIndex: 110,
                border: '1.5px solid #1a1a1a',
                boxShadow: 'inset 0 0 2px rgba(50,50,70,0.6)',
                cursor: 'pointer',
                padding: 0,
              }}
            />

            {/* Status bar */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                zIndex: 105,
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'white', letterSpacing: '0.2px', fontFamily: 'Roboto, sans-serif' }}>
                9:41
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="white" aria-hidden="true">
                  <path d="M7 0L14 10H0L7 0Z" opacity="0.95" />
                </svg>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="white" aria-hidden="true">
                  <path d="M7 2a6 6 0 0 0-5 2.4l1 .8A4.7 4.7 0 0 1 7 3.4c1.6 0 3 .7 4 1.8l1-.8A6 6 0 0 0 7 2ZM7 5.5a3 3 0 0 0-2.4 1.2l1 .8a1.7 1.7 0 0 1 1.4-.7c.6 0 1 .3 1.4.7l1-.8A3 3 0 0 0 7 5.5ZM7 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
                </svg>
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="white" strokeOpacity="0.7" />
                  <rect x="2" y="2" width="15" height="6" fill="white" />
                  <rect x="19.5" y="3" width="2" height="4" fill="white" opacity="0.7" />
                </svg>
              </div>
            </div>

            {/* Scrollable app content */}
            <div
              className="hide-scrollbar"
              style={{
                position: 'absolute',
                inset: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* ── Android side controls panel ── */}
      {showControls && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'center', marginLeft: 130 }}>
          <PlatformToggle />
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            paddingLeft: 2,
          }}>
            Android Controls
          </span>

          <div style={{
            border: '1.5px solid #D1D5DB',
            borderRadius: 20,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: 'rgba(255,255,255,0.6)',
          }}>
            <CtrlBtn
              label="Home"
              bg="linear-gradient(135deg,#3b82f6,#1d4ed8)"
              onClick={goHome}
            />
            <CtrlBtn
              label="$2.00 Trip"
              bg="linear-gradient(135deg,#2DB87E,#1A7A50)"
              icon={MapPin}
              onClick={() => addTrip({
                name: 'Station 1',
                amount: '$2.00',
                value: 2,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              })}
            />
            <CtrlBtn
              label="$5.00 Trip"
              bg="linear-gradient(135deg,#2DB87E,#1A7A50)"
              icon={MapPin}
              onClick={() => addTrip({
                name: 'Station 3',
                amount: '$5.00',
                value: 5,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              })}
            />
            <CtrlBtn
              label="$10.00 Trip"
              bg="linear-gradient(135deg,#2DB87E,#1A7A50)"
              icon={MapPin}
              onClick={() => addTrip({
                name: 'Station 2',
                amount: '$10.00',
                value: 10,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              })}
            />
            <CtrlBtn
              label="Pass Trip"
              bg="linear-gradient(135deg,#2DB87E,#1A7A50)"
              icon={Ticket}
              onClick={() => addTrip({
                name: 'Pass',
                amount: 'Pass Used',
                value: 0,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              })}
            />
            <CtrlBtn
              label="Payment Issue"
              bg="linear-gradient(135deg,#EF4444,#B91C1C)"
              icon={AlertTriangle}
              onClick={() => showPaymentIssue()}
            />
          </div>
        </div>
      )}
      </div>
    </div>
    </AndroidContext.Provider>
  )
}
