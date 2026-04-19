// src/android/apps/wallet/ui/primitives.jsx
// Shared small UI bits for the Android Wallet flow. White app surface,
// subtle #F3F4F6 inner fills.

export const WALLET_BG = '#FFFFFF'
export const SUBTLE_BG = '#F3F4F6'
export const TEXT_PRIMARY = '#1F2937'
export const TEXT_MUTED = '#6B7280'
export const ACCENT = '#8B6B3F' // dark olive/brown used for primary actions in the ref images

export function AppSurface({ children, style }) {
  return (
    <div style={{
      minHeight: '100%',
      height: '100%',
      background: WALLET_BG,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, sans-serif',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function TopBar({ left, right, title }) {
  return (
    <div style={{
      padding: '56px 20px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      minHeight: 96,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        {left}
        {title && (
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 400, color: TEXT_PRIMARY, letterSpacing: '0.1px' }}>
            {title}
          </h1>
        )}
      </div>
      {right}
    </div>
  )
}

export function IconButton({ onClick, ariaLabel, children, style }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: TEXT_PRIMARY,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function PillButton({ children, onClick, variant = 'primary', disabled, style }) {
  const bg = variant === 'primary' ? ACCENT : 'transparent'
  const color = variant === 'primary' ? '#FFFFFF' : ACCENT
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color,
        border: 'none',
        borderRadius: 999,
        padding: '14px 28px',
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'Roboto, sans-serif',
        letterSpacing: '0.2px',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
