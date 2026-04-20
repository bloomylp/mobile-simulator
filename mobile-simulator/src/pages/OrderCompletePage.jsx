// src/pages/OrderCompletePage.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NotificationBell } from '../components/ui/NotificationBell.jsx'
import { LangToggle }       from '../components/ui/LangToggle.jsx'
import { Button }           from '../components/ui/Button.jsx'

// ── iOS-style chevron ──────────────────────────────────────────────
function Chevron() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
      <path d="M1 1l6 5.5L1 12" stroke="#C7C7CC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Coloured icon cells matching iOS Wallet ────────────────────────
function IconCell({ bg, children }) {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 7,
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {children}
    </div>
  )
}

// ── Wallet icon (black, for Cards Found For You) ───────────────────
function WalletSvg() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <rect x="1" y="3" width="16" height="10" rx="2" stroke="white" strokeWidth="1.4" />
      <path d="M1 6h16" stroke="white" strokeWidth="1.4" />
      <rect x="1" y="1" width="10" height="3" rx="1" fill="white" />
      <circle cx="13.5" cy="9.5" r="1.5" fill="white" />
    </svg>
  )
}

// ── Train icon (green, for Travel Card) ───────────────────────────
function TrainSvg() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <rect x="2" y="1" width="12" height="13" rx="3" stroke="white" strokeWidth="1.4" />
      <circle cx="5" cy="11" r="1.2" fill="white" />
      <circle cx="11" cy="11" r="1.2" fill="white" />
      <path d="M2 7h12" stroke="white" strokeWidth="1.4" />
      <path d="M5 14l-2 3M11 14l2 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// ── Credit card icon (blue) ────────────────────────────────────────
function CardSvg() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <rect x="1" y="1" width="16" height="11" rx="2" stroke="white" strokeWidth="1.4" />
      <path d="M1 5h16" stroke="white" strokeWidth="1.4" />
      <rect x="3" y="8" width="5" height="2" rx="1" fill="white" />
    </svg>
  )
}

// ── Pay later icon (purple) ────────────────────────────────────────
function PaySvg() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <rect x="1" y="1" width="16" height="12" rx="2" stroke="white" strokeWidth="1.4" />
      <path d="M5 7h3M10 7h3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="7" r="1" fill="white" />
    </svg>
  )
}

// ── Spinner dots (Cards Found For You loading) ─────────────────────
function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <circle
          key={deg}
          cx={10 + 7 * Math.cos((deg - 90) * Math.PI / 180)}
          cy={10 + 7 * Math.sin((deg - 90) * Math.PI / 180)}
          r="1.5"
          fill="#C7C7CC"
          opacity={0.25 + i * 0.1}
        />
      ))}
    </svg>
  )
}

// ── Transit card thumbnails ────────────────────────────────────────
function TransitThumb({ bg }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 48, height: 32, borderRadius: 5,
        background: bg,
        flexShrink: 0,
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    />
  )
}

// ── iOS-style row ──────────────────────────────────────────────────
function Row({ icon, title, subtitle, last = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 16px',
      borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.08)',
      background: 'white',
    }}>
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 400, color: '#000', letterSpacing: '-0.2px' }}>{title}</p>
        {subtitle && <p style={{ margin: '1px 0 0', fontSize: 12, color: '#8E8E93' }}>{subtitle}</p>}
      </div>
      <Chevron />
    </div>
  )
}

// ── iOS CTA button ─────────────────────────────────────────────────
function IosButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: '#000',
        color: 'white',
        border: 'none',
        borderRadius: 14,
        padding: '14px 0',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '-0.2px',
      }}
    >
      {label}
    </button>
  )
}

// ── Step 1: Add to Wallet ──────────────────────────────────────────
function AddToWalletStep({ onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F2F2F7', padding: '120px 20px 32px' }}>
      {/* Heading */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#000', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
        Add to Wallet
      </h1>
      <p style={{ fontSize: 17, color: '#6C6C70', margin: '0 0 28px', lineHeight: 1.4, letterSpacing: '-0.2px' }}>
        Keep all the cards, keys and passes you use every day all in one place.
      </p>

      {/* Cards Found For You */}
      <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 16px',
          background: 'white',
        }}>
          <IconCell bg="#1C1C1E"><WalletSvg /></IconCell>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 400, color: '#000', letterSpacing: '-0.2px' }}>Cards Found For You</p>
            <p style={{ margin: '1px 0 0', fontSize: 12, color: '#8E8E93' }}>From other devices</p>
          </div>
          <Spinner />
        </div>
      </div>

      {/* Debit/Credit + Travel Card group */}
      <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <Row
          icon={<IconCell bg="#3478F6"><CardSvg /></IconCell>}
          title="Debit or Credit Card"
        />
        <Row
          icon={<IconCell bg="#34C759"><TrainSvg /></IconCell>}
          title="Travel Card"
          last
        />
      </div>

      {/* Pay Later Options */}
      <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 'auto' }}>
        <Row
          icon={<IconCell bg="#AF52DE"><PaySvg /></IconCell>}
          title="Pay Later Options"
          last
        />
      </div>

      <div style={{ paddingTop: 24 }}>
        <IosButton label="Next" onClick={onNext} />
      </div>
    </div>
  )
}

// ── Step 2: Travel Card ────────────────────────────────────────────
const TRANSIT_CARDS = [
  { id: 'mst',     title: 'MST GO Pass',   subtitle: 'Monterey Salinas Area',      bg: 'linear-gradient(135deg,#8EC5FC,#6CA0DC)' },
  { id: 'hop',     title: 'Hop Fastpass',  subtitle: 'Portland Metropolitan Area', bg: 'linear-gradient(135deg,#6C3FC9,#4B2A9A)' },
  { id: 'smart',   title: 'Smart Trip',     subtitle: null,                         bg: 'linear-gradient(135deg,#1A6BAA,#0D4D80)' },
  { id: 'tap',     title: 'TAP',           subtitle: null,                         bg: 'linear-gradient(135deg,#F5A623,#D4891A)' },
  { id: 'ventra',  title: 'Ventra',        subtitle: 'Chicago Metropolitan Area',  bg: 'linear-gradient(135deg,#0071C1,#005A9C)' },
]

function TravelCardStep({ onContinue }) {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F2F2F7', padding: '120px 20px 32px' }}>
      {/* Heading */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#000', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
        Travel Card
      </h1>
      <p style={{ fontSize: 17, color: '#6C6C70', margin: '0 0 24px', lineHeight: 1.4, letterSpacing: '-0.2px' }}>
        Quickly pass through gates by holding your iPhone near a reader.
      </p>

      {/* Section label */}
      <p style={{ fontSize: 13, fontWeight: 400, color: '#6C6C70', margin: '0 4px 6px', letterSpacing: '-0.1px' }}>
        United States
      </p>

      {/* Transit card list */}
      <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 'auto' }}>
        {TRANSIT_CARDS.map((card, i) => {
          const selected = selectedId === card.id
          return (
            <div
              key={card.id}
              onClick={() => setSelectedId(card.id)}
              style={{
                outline: selected ? '1.5px solid #2DB87E' : 'none',
                outlineOffset: -1,
                borderRadius: i === 0 ? '12px 12px 0 0' : i === TRANSIT_CARDS.length - 1 ? '0 0 12px 12px' : 0,
                cursor: 'pointer',
              }}
            >
              <Row
                icon={<TransitThumb bg={card.bg} />}
                title={card.title}
                subtitle={card.subtitle}
                last={i === TRANSIT_CARDS.length - 1}
              />
            </div>
          )
        })}
      </div>

      {/* Search bar */}
      <div style={{
        margin: '20px 0 24px',
        background: 'rgba(118,118,128,0.12)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" stroke="#8E8E93" strokeWidth="1.4" />
          <path d="M10 10l2.5 2.5" stroke="#8E8E93" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          style={{
            border: 'none', background: 'transparent', fontSize: 15,
            color: '#8E8E93', outline: 'none', flex: 1,
          }}
          aria-label="Search transit cards"
        />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 2v4M8 14v-4M2 8h4M14 8h-4" stroke="#8E8E93" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="8" r="2" stroke="#8E8E93" strokeWidth="1.4" />
        </svg>
      </div>

      <IosButton label="Continue" onClick={onContinue} />
    </div>
  )
}

// ── Physical card success illustration ────────────────────────────
function CardSuccessIllustration() {
  return (
    <svg width="160" height="100" viewBox="0 0 160 100" fill="none" aria-hidden="true">
      <rect x="8" y="16" width="144" height="88" rx="12" fill="#4CC48A" />
      <rect x="8" y="16" width="144" height="88" rx="12" fill="url(#cardGrad)" />
      <rect x="8" y="34" width="144" height="18" fill="rgba(0,0,0,0.12)" />
      <rect x="20" y="62" width="40" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
      <rect x="20" y="76" width="28" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="128" cy="76" r="12" fill="rgba(255,255,255,0.15)" />
      <circle cx="116" cy="76" r="12" fill="rgba(255,255,255,0.25)" />
      <circle cx="80" cy="8" r="5" fill="#2DB87E" />
      <path d="M77 8l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="cardGrad" x1="8" y1="16" x2="152" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4CC48A" />
          <stop offset="1" stopColor="#2DB87E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Physical card legacy flow ──────────────────────────────────────
function PhysicalOrderComplete({ onContinue }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ width: '100%', maxWidth: 360, background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
          little<span style={{ color: '#2DB87E' }}>pay</span>
        </p>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#1A1F2E', letterSpacing: '-0.3px' }}>
            Order Completed
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: '#6B7280' }}>
            You will receive your card shortly
          </p>
        </div>
        <CardSuccessIllustration />
        <button
          onClick={onContinue}
          style={{
            width: '100%', background: '#2DB87E', color: 'white',
            border: 'none', borderRadius: 12, padding: '14px 0',
            fontSize: 16, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.2px',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────
export function OrderCompletePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDigital = location.state?.cardType === 'digital'
  const [step, setStep] = useState(1)

  if (!isDigital) {
    return (
      <div style={{ minHeight: '100%', background: '#F4F6F8', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 41, right: 16, display: 'flex', alignItems: 'center', gap: 5, zIndex: 10 }}>
          <LangToggle />
          <NotificationBell />
        </div>
        <PhysicalOrderComplete onContinue={() => navigate('/cards')} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100%', background: '#F2F2F7', position: 'relative', overflow: 'hidden' }}>
      {/* Utilities top-right */}
      <div style={{ position: 'absolute', top: 41, right: 16, display: 'flex', alignItems: 'center', gap: 5, zIndex: 10 }}>
        <LangToggle />
        <NotificationBell />
      </div>

      {/* Active step — slide in from right when step changes */}
      <div
        key={step}
        style={{
          minHeight: '100vh',
          animation: step === 2 ? 'order-slide-in 0.28s cubic-bezier(0.32,0.72,0,1)' : 'none',
        }}
      >
        {step === 1
          ? <AddToWalletStep onNext={() => setStep(2)} />
          : <TravelCardStep onContinue={() => navigate('/cards')} />
        }
      </div>
    </div>
  )
}
