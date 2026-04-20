// src/android/AndroidHomeScreen.jsx
// Pixel 10 launcher — wallpaper, app grid, dock. Wallet is tappable; others decorative.
import {
  Phone, MessageSquare, Globe, Camera, Mail, Image as ImageIcon,
  PlayCircle, Wallet, Clock, Music, Map, Settings,
} from 'lucide-react'
import { useAndroid } from '../components/layout/AndroidFrame.jsx'
import { AndroidWalletApp } from './apps/AndroidWalletApp.jsx'

const APP_ICONS = [
  { id: 'phone',    label: 'Phone',    Icon: Phone,         bg: 'linear-gradient(135deg,#22C55E,#15803D)' },
  { id: 'messages', label: 'Messages', Icon: MessageSquare, bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' },
  { id: 'chrome',   label: 'Chrome',   Icon: Globe,         bg: 'linear-gradient(135deg,#F4B400,#DB4437)' },
  { id: 'camera',   label: 'Camera',   Icon: Camera,        bg: 'linear-gradient(135deg,#6B7280,#1F2937)' },
  { id: 'gmail',    label: 'Gmail',    Icon: Mail,          bg: 'linear-gradient(135deg,#EA4335,#C5221F)' },
  { id: 'photos',   label: 'Photos',   Icon: ImageIcon,     bg: 'linear-gradient(135deg,#4285F4,#34A853)' },
  { id: 'play',     label: 'Play',     Icon: PlayCircle,    bg: 'linear-gradient(135deg,#00C4B3,#4285F4)' },
  { id: 'wallet',   label: 'Wallet',   Icon: Wallet,        bg: 'linear-gradient(135deg,#2DB87E,#1A7A50)', tappable: true },
  { id: 'clock',    label: 'Clock',    Icon: Clock,         bg: 'linear-gradient(135deg,#F59E0B,#D97706)' },
  { id: 'music',    label: 'Music',    Icon: Music,         bg: 'linear-gradient(135deg,#EF4444,#B91C1C)' },
  { id: 'maps',     label: 'Maps',     Icon: Map,           bg: 'linear-gradient(135deg,#34A853,#0F9D58)' },
  { id: 'settings', label: 'Settings', Icon: Settings,      bg: 'linear-gradient(135deg,#9CA3AF,#4B5563)' },
]

function AppIcon({ app, onLaunch }) {
  const { Icon } = app
  const isTappable = !!app.tappable
  const handleClick = isTappable ? () => onLaunch(app.id) : undefined

  return (
    <button
      onClick={handleClick}
      aria-label={app.label}
      data-testid={`android-app-${app.id}`}
      disabled={!isTappable}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: isTappable ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: app.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        <Icon size={26} color="white" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'white', letterSpacing: '0.1px', textShadow: '0 1px 2px rgba(0,0,0,0.6)', fontFamily: 'Roboto, sans-serif' }}>
        {app.label}
      </span>
    </button>
  )
}

export function AndroidHomeScreen() {
  const { currentApp, launchApp } = useAndroid()

  if (currentApp === 'wallet') {
    return <AndroidWalletApp />
  }

  return (
    <div
      data-testid="android-home-screen"
      style={{
        minHeight: '100%',
        background: 'linear-gradient(180deg, #1E3A5F 0%, #2C5282 50%, #1E4A72 100%)',
        padding: '80px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Widget-ish clock area */}
      <div style={{ textAlign: 'left', paddingLeft: 8, paddingTop: 8 }}>
        <p style={{ margin: 0, fontSize: 48, fontWeight: 300, color: 'white', fontFamily: 'Roboto, sans-serif', lineHeight: 1 }}>9:41</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: 'Roboto, sans-serif' }}>Fri, 17 Apr • 72°F</p>
      </div>

      {/* App grid — 4 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginTop: 16,
        }}
      >
        {APP_ICONS.map((app) => (
          <AppIcon key={app.id} app={app} onLaunch={launchApp} />
        ))}
      </div>

      {/* Search pill */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
        <div
          style={{
            width: '90%',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 999,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.4" />
            <path d="M10 10l2.5 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontFamily: 'Roboto, sans-serif' }}>Search</span>
        </div>
      </div>
    </div>
  )
}
