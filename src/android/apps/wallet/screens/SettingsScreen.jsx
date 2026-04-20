// SettingsScreen — phone-settings style page opened from L avatar on Wallet main.
// Dark theme per reference screenshot. Clicking the Search pill resets the Android
// app (goHome). Clicking any row returns to the previous page (Wallet main).
import { Search, MapPin, Cross, Key, HeartPulse, Globe, Info, CircleHelp, SlidersHorizontal, Smartphone } from 'lucide-react'
import { useWalletFlow } from '../WalletFlowContext.jsx'
import { useAndroid } from '../../../../components/layout/AndroidFrame.jsx'
import { resetTrips } from '../data/androidTripsStore.js'
import { resetPaymentIssue } from '../data/androidPaymentIssueStore.js'

const DARK_BG = '#0F0F10'
const ROW_TEXT = '#E5E7EB'
const SUB_TEXT = '#9BA1A6'
const PILL_BG = '#1F2124'

const ROWS = [
  { id: 'location',  Icon: MapPin,         label: 'Location',                                  sub: 'On – 3 apps have access to location' },
  { id: 'safety',    Icon: Cross,          label: 'Safety and emergency',                      sub: 'Emergency SOS, medical info, alerts' },
  { id: 'passwords', Icon: Key,            label: 'Passwords and accounts',                    sub: 'Saved passwords, autofill, synced accounts' },
  { id: 'wellbeing', Icon: HeartPulse,     label: 'Digital Wellbeing and parental controls',   sub: 'Screen time, app timers, bedtime schedules' },
  { id: 'google',    Icon: Globe,          label: 'Google',                                    sub: 'Services and preferences' },
  { id: 'system',    Icon: Info,           label: 'System',                                    sub: 'Languages, gestures, time, backup' },
  { id: 'about',     Icon: Smartphone,     label: 'About phone',                               sub: 'Pixel 8' },
  { id: 'tips',      Icon: CircleHelp,     label: 'Tips and support',                          sub: 'Help articles, phone and chat' },
]

function SettingsRow({ row, onSelect }) {
  const { Icon } = row
  return (
    <button
      onClick={onSelect}
      aria-label={row.label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '14px 20px',
        background: 'transparent',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
        color: ROW_TEXT,
      }}
    >
      <Icon size={22} strokeWidth={1.7} color={ROW_TEXT} aria-hidden="true" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 400, color: ROW_TEXT }}>{row.label}</p>
        <p style={{ margin: '3px 0 0', fontSize: 13, color: SUB_TEXT, lineHeight: 1.35 }}>{row.sub}</p>
      </div>
    </button>
  )
}

export function SettingsScreen() {
  const { back } = useWalletFlow()
  const { goHome } = useAndroid()

  return (
    <div
      data-testid="android-settings-screen"
      style={{
        position: 'absolute',
        inset: 0,
        background: DARK_BG,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Roboto, sans-serif',
        overflowY: 'auto',
      }}
    >
      {/* Search settings pill — clicking it resets (goHome) */}
      <div style={{ padding: '64px 16px 8px' }}>
        <button
          onClick={() => { resetTrips(); resetPaymentIssue(); goHome() }}
          aria-label="Search settings"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderRadius: 999,
            background: PILL_BG,
            border: 'none',
            color: ROW_TEXT,
            fontSize: 15,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          <Search size={18} strokeWidth={1.8} color={SUB_TEXT} aria-hidden="true" />
          <input
            readOnly
            placeholder="Search settings"
            aria-label="Search settings"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: ROW_TEXT,
              fontSize: 15,
              pointerEvents: 'none',
              fontFamily: 'Roboto, sans-serif',
            }}
          />
        </button>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 4, paddingBottom: 24 }}>
        {ROWS.map((row) => (
          <SettingsRow key={row.id} row={row} onSelect={back} />
        ))}
      </div>
    </div>
  )
}
