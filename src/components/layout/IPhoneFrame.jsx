// src/components/layout/IPhoneFrame.jsx
import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav.jsx'

const NAV_ROUTES = ['/home', '/cards', '/profile']

const BTN = {
  position: 'absolute',
  background: 'linear-gradient(90deg, #3a3a3a, #4a4a4a)',
  borderRadius: 3,
}

export function IPhoneFrame({ children }) {
  const { pathname } = useLocation()
  const showNav = NAV_ROUTES.includes(pathname)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}
    >
      {/* ── iPhone outer shell ── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>

        {/* Left: Action button */}
        <div style={{ ...BTN, left: -4, top: 148, width: 4, height: 30 }} aria-hidden="true" />
        {/* Left: Volume Up */}
        <div style={{ ...BTN, left: -4, top: 194, width: 4, height: 46 }} aria-hidden="true" />
        {/* Left: Volume Down */}
        <div style={{ ...BTN, left: -4, top: 252, width: 4, height: 46 }} aria-hidden="true" />
        {/* Right: Power */}
        <div style={{ ...BTN, right: -4, top: 210, width: 4, height: 72 }} aria-hidden="true" />

        {/* Frame body — titanium-like */}
        <div
          style={{
            width: 410,
            height: 864,
            borderRadius: 52,
            padding: 10,
            background: 'linear-gradient(145deg, #3c3c3c 0%, #1e1e1e 40%, #2e2e2e 70%, #1a1a1a 100%)',
            boxShadow:
              '0 50px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)',
          }}
        >
          {/* Screen */}
          <div
            style={{
              width: 390,
              height: 844,
              borderRadius: 44,
              overflow: 'hidden',
              position: 'relative',
              background: '#F4F6F8',
              transform: 'translateZ(0)',
            }}
          >
            {/* Dynamic Island */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 63,
                height: 19,
                background: '#000',
                borderRadius: 12,
                zIndex: 110,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
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
                height: 54,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: '0 28px 18px',
                zIndex: 105,
                pointerEvents: 'none',
              }}
            >
              {/* Time */}
              <span style={{ fontSize: 15, fontWeight: 600, color: 'white', letterSpacing: '-0.3px', textShadow: '0 1px 3px rgba(0,0,0,0.4)', position: 'relative', top: 2 }}>
                9:41
              </span>
              {/* Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', top: -2 }}>
                {/* Signal bars */}
                <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
                  <rect x="0"    y="8"   width="3" height="4"  rx="0.8" />
                  <rect x="4.5"  y="5"   width="3" height="7"  rx="0.8" />
                  <rect x="9"    y="2.5" width="3" height="9.5" rx="0.8" />
                  <rect x="13.5" y="0"   width="3" height="12" rx="0.8" />
                </svg>
                {/* WiFi */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
                  <circle cx="8" cy="10.5" r="1.3" />
                  <path d="M5.1 7.8a4.1 4.1 0 0 1 5.8 0l1.2-1.2a5.8 5.8 0 0 0-8.2 0z" />
                  <path d="M2.4 5.1a7.9 7.9 0 0 1 11.2 0l1.2-1.2A9.6 9.6 0 0 0 1.2 3.9z" />
                </svg>
                {/* Battery */}
                <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
                  <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="white" strokeOpacity="0.4" />
                  <rect x="2" y="2" width="18" height="9" rx="2" fill="white" />
                  <path d="M24 4.5v4c1-.5 1.5-1.2 1.5-2s-.5-1.5-1.5-2z" fill="white" fillOpacity="0.45" />
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

            {/* BottomNav — floats above scroll content, inside screen */}
            {showNav && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 40,
                }}
              >
                <BottomNav />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
