// src/components/layout/IPhoneFrame.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { HomeScreenView } from './HomeScreenView.jsx'
import { useNotifications } from '../../context/NotificationsContext.jsx'
import { useFrame } from '../../context/FrameContext.jsx'
import { PlatformToggle } from './PlatformToggle.jsx'

const BTN = {
  position: 'absolute',
  background: 'linear-gradient(90deg, #3a3a3a, #4a4a4a)',
  borderRadius: 3,
}

function PushNotification({ message, dismissing, onDismiss }) {
  return (
    <button
      data-testid="push-notification"
      data-dismissing={dismissing ? 'true' : undefined}
      onClick={onDismiss}
      style={{
        position: 'absolute',
        top: 56,
        left: 12,
        right: 12,
        zIndex: 200,
        background: 'rgba(30,30,30,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 18,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        animation: dismissing
          ? 'notif-slide-out 0.35s cubic-bezier(0.32,0.72,0,1) forwards'
          : 'notif-slide-in 0.35s cubic-bezier(0.32,0.72,0,1)',
      }}
      aria-label="Push notification"
    >
      {/* App icon */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 9,
        background: 'linear-gradient(145deg,#2DB87E,#1A7A50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Wallet size={18} color="white" strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '-0.1px' }}>
          Littlepay
        </p>
        <p style={{ margin: '1px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.35, fontWeight: 400, whiteSpace: 'pre-line' }}>
          {message}
        </p>
      </div>
    </button>
  )
}

function CtrlBtn({ label, bg, onClick }) {
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
      }}
    >
      {label}
    </button>
  )
}

function Divider() {
  return <div style={{ height: 1, background: '#E5E7EB', margin: '2px 0' }} />
}

export function IPhoneFrame({ children }) {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { showControls, setShowControls } = useFrame()
  const [homeScreen, setHomeScreen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [notifDismissing, setNotifDismissing] = useState(false)
  const notifTimer = useRef(null)
  const notifOutTimer = useRef(null)

  function showNotification(message, destination) {
    clearTimeout(notifTimer.current)
    clearTimeout(notifOutTimer.current)
    setNotifDismissing(false)
    setNotification({ message, destination })
    notifTimer.current = setTimeout(() => {
      setNotifDismissing(true)
      notifOutTimer.current = setTimeout(() => {
        setNotification(null)
        setNotifDismissing(false)
      }, 350)
    }, 5000)
  }

  function handleNotificationClick() {
    clearTimeout(notifTimer.current)
    clearTimeout(notifOutTimer.current)
    const dest = notification?.destination
    setNotification(null)
    setNotifDismissing(false)
    setHomeScreen(false)
    if (dest) navigate(dest)
  }

  useEffect(() => () => {
    clearTimeout(notifTimer.current)
    clearTimeout(notifOutTimer.current)
  }, [])

  return (
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
            <button
              aria-label="Toggle controls"
              onClick={() => setShowControls((v) => !v)}
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
                border: 'none',
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

            {notification && (
              <PushNotification
                message={notification.message}
                dismissing={notifDismissing}
                onDismiss={handleNotificationClick}
              />
            )}

            {homeScreen ? (
              <HomeScreenView onLaunchApp={() => setHomeScreen(false)} />
            ) : (
              <>
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

              </>
            )}

          </div>
        </div>
      </div>

      {/* ── Side control panel (shown only when toggled) ── */}
      {showControls && <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignSelf: 'center',
        marginLeft: 130,
      }}>
        {/* Platform toggle above controls */}
        <PlatformToggle />

        {/* Title */}
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#9CA3AF',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          paddingLeft: 2,
        }}>
          iPhone Controls
        </span>

        {/* Box */}
        <div style={{
          border: '1.5px solid #D1D5DB',
          borderRadius: 20,
          padding: '14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'rgba(255,255,255,0.6)',
        }}>
          {/* ── Phone controls ── */}
          <CtrlBtn
            label="Home Screen"
            bg={homeScreen ? 'linear-gradient(135deg,#1c4fa0,#2e8bc8)' : 'linear-gradient(135deg,#2DB87E,#1A7A50)'}
            onClick={() => setHomeScreen(true)}
          />

          <Divider />

          {/* ── Push notifications ── */}
          <CtrlBtn
            label="Push Notification (Trip)"
            bg="linear-gradient(135deg,#f59e0b,#d97706)"
            onClick={() => showNotification('Thank you for traveling on MST, click to see your transit information', '/home')}
          />
          <CtrlBtn label="Push Notification (Low Balance)" bg="linear-gradient(135deg,#ef4444,#b91c1c)" onClick={() => {
            const msg = 'You have a low balance on your card\n\u2022\u2022\u2022\u2022\u2022\u2022\u202231230 Click here to top up.'
            showNotification(msg, '/home')
            addNotification(msg, '/home', 'low-balance')
          }} />
          <CtrlBtn label="Push Notification (Info)" bg="linear-gradient(135deg,#3b82f6,#1d4ed8)" onClick={() => {
            showNotification('View a promotion that has been shared with you.', '/promotions')
            addNotification('Click here to see our latest promotions.', '/promotions', 'promotion')
          }} />
        </div>
      </div>}
      </div>
    </div>
  )
}
