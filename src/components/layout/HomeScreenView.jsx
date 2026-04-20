// src/components/layout/HomeScreenView.jsx
import {
  Wallet, Globe, Mail, MessageSquare, Camera, Music,
  Settings, Phone, Map, Image, AppWindow, Cloud,
} from 'lucide-react'

// ── Wallpaper ────────────────────────────────────────────────────────────────
const WALLPAPER = 'linear-gradient(180deg, #1c4fa0 0%, #1a6bcc 30%, #2e8bc8 60%, #4aaee0 85%, #60c4f0 100%)'

// ── App icon definitions ─────────────────────────────────────────────────────
const PLACEHOLDER_ICONS = [
  { label: 'Phone',    Icon: Phone,       bg: 'linear-gradient(145deg,#34c759,#248a3d)' },
  { label: 'Safari',   Icon: Globe,       bg: 'linear-gradient(145deg,#0984ff,#0060d0)' },
  { label: 'Messages', Icon: MessageSquare, bg: 'linear-gradient(145deg,#34c759,#28a745)' },
  { label: 'Mail',     Icon: Mail,        bg: 'linear-gradient(145deg,#0984ff,#0060d0)' },
  { label: 'Maps',     Icon: Map,         bg: 'linear-gradient(145deg,#34c759,#0984ff)' },
  { label: 'Camera',   Icon: Camera,      bg: 'linear-gradient(145deg,#636366,#3a3a3c)' },
  { label: 'Photos',   Icon: Image,       bg: 'linear-gradient(145deg,#ff9500,#ff3b30,#af52de,#0984ff)' },
  { label: 'Music',    Icon: Music,       bg: 'linear-gradient(145deg,#ff2d55,#d70015)' },
  { label: 'Cloud',    Icon: Cloud,       bg: 'linear-gradient(145deg,#0984ff,#005ecb)' },
  { label: 'App Store',Icon: AppWindow,   bg: 'linear-gradient(145deg,#0984ff,#0060d0)' },
  { label: 'Settings', Icon: Settings,    bg: 'linear-gradient(145deg,#636366,#3a3a3c)' },
]

const DOCK_ICONS = [
  { label: 'Phone',    Icon: Phone,       bg: 'linear-gradient(145deg,#34c759,#248a3d)' },
  { label: 'Safari',   Icon: Globe,       bg: 'linear-gradient(145deg,#0984ff,#0060d0)' },
  { label: 'Messages', Icon: MessageSquare, bg: 'linear-gradient(145deg,#34c759,#28a745)' },
  { label: 'Mail',     Icon: Mail,        bg: 'linear-gradient(145deg,#0984ff,#0060d0)' },
]

function AppIcon({ label, Icon, bg, onPress, size = 60 }) {
  return (
    <button
      onClick={onPress}
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        width: size,
        height: size,
        borderRadius: size * 0.2232,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
        <Icon size={size * 0.47} color="white" strokeWidth={1.8} />
      </div>
      <span style={{
        fontSize: 11,
        color: 'white',
        fontWeight: 500,
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        maxWidth: size + 12,
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: '-0.1px',
      }}>
        {label}
      </span>
    </button>
  )
}

export function HomeScreenView({ onLaunchApp }) {
  // Current time
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Littlepay icon (first in grid)
  const littlepayIcon = (
    <AppIcon
      key="littlepay"
      label="Littlepay"
      Icon={Wallet}
      bg="linear-gradient(145deg,#2DB87E,#1A7A50)"
      onPress={onLaunchApp}
    />
  )

  return (
    <div
      data-testid="ios-home-screen"
      style={{
        position: 'absolute',
        inset: 0,
        background: WALLPAPER,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Clock ── */}
      <div style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 4 }}>
        <div style={{ fontSize: 72, fontWeight: 200, color: 'white', letterSpacing: '-3px', lineHeight: 1 }}>
          {timeStr}
        </div>
        <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: 400 }}>
          {dateStr}
        </div>
      </div>

      {/* ── App grid ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '18px 0',
        padding: '20px 16px 0',
        alignContent: 'start',
      }}>
        {littlepayIcon}
        {PLACEHOLDER_ICONS.map(({ label, Icon, bg }) => (
          <AppIcon key={label} label={label} Icon={Icon} bg={bg} />
        ))}
      </div>

      {/* ── Dock ── */}
      <div style={{
        margin: '12px 16px 28px',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 28,
        padding: '14px 12px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {DOCK_ICONS.map(({ label, Icon, bg }) => (
          <AppIcon key={label} label={label} Icon={Icon} bg={bg} size={56} />
        ))}
      </div>
    </div>
  )
}
