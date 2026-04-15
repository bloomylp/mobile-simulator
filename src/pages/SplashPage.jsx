// src/pages/SplashPage.jsx
import { useNavigate } from 'react-router-dom'

const DARK = '#1A6640'
const MID  = '#229A52'

function LogoIcon() {
  return (
    <div className="w-14 h-14 rounded-[18px] bg-white/20 flex items-center justify-center">
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8" aria-hidden="true">
        {/* Card body */}
        <rect x="4" y="11" width="24" height="15" rx="3" fill="white" opacity="0.95" />
        {/* Magnetic stripe */}
        <rect x="4" y="15" width="24" height="5" fill="#2DB87E" />
        {/* Card number dots */}
        <rect x="7" y="21" width="7" height="2.5" rx="1.25" fill="white" opacity="0.55" />
        {/* Chip */}
        <rect x="7" y="12.5" width="5" height="4" rx="1" fill="white" opacity="0.7" />
        {/* Contactless waves */}
        <path d="M13.5 9 Q16 6.5 18.5 9"   stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M11.5 7 Q16 3.5 20.5 7"   stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      </svg>
    </div>
  )
}

function TransitScene() {
  return (
    <svg
      viewBox="0 0 390 295"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* ── Train structure ── */}

      {/* Ceiling strip */}
      <rect x="0" y="0" width="390" height="34" fill={DARK} opacity="0.3" />

      {/* Overhead grab rail */}
      <rect x="0" y="32" width="390" height="8" rx="4" fill={DARK} />

      {/* Window panels */}
      <rect x="10"  y="4" width="72" height="24" rx="4" fill={DARK} opacity="0.45" />
      <rect x="159" y="4" width="72" height="24" rx="4" fill={DARK} opacity="0.45" />
      <rect x="308" y="4" width="72" height="24" rx="4" fill={DARK} opacity="0.45" />

      {/* Vertical poles */}
      <rect x="90"  y="32" width="8" height="232" rx="4" fill={DARK} />
      <rect x="192" y="32" width="8" height="232" rx="4" fill={DARK} />
      <rect x="294" y="32" width="8" height="232" rx="4" fill={DARK} />

      {/* Left bench — back then seat */}
      <rect x="0" y="194" width="88" height="10" rx="4" fill={DARK} opacity="0.6" />
      <rect x="0" y="200" width="88" height="28" rx="4" fill={DARK} />

      {/* Right bench */}
      <rect x="302" y="194" width="88" height="10" rx="4" fill={DARK} opacity="0.6" />
      <rect x="302" y="200" width="88" height="28" rx="4" fill={DARK} />

      {/* Floor */}
      <rect x="0" y="264" width="390" height="31" fill={DARK} opacity="0.5" />

      {/* ── Person 1: Seated left ── */}
      {/* Head */}
      <ellipse cx="46" cy="163" rx="21" ry="22" fill={MID} />
      {/* Neck */}
      <rect x="39" y="181" width="14" height="8" rx="4" fill={MID} />
      {/* Torso */}
      <rect x="16" y="186" width="60" height="22" rx="7" fill={DARK} />
      {/* Body resting on bench */}
      <rect x="4"  y="200" width="82" height="28" rx="4" fill={DARK} opacity="0.7" />

      {/* ── Person 2: Standing center — focal ── */}
      {/* Right arm UP to grab rail */}
      <line x1="224" y1="113" x2="197" y2="40"  stroke={DARK} strokeWidth="14" strokeLinecap="round" />
      {/* Left arm hanging down */}
      <line x1="170" y1="117" x2="156" y2="188" stroke={DARK} strokeWidth="13" strokeLinecap="round" />
      {/* Torso (suit jacket) */}
      <rect x="167" y="104" width="56" height="102" rx="8" fill={DARK} />
      {/* Subtle suit V detail */}
      <path d="M195 104 L183 130 L195 135 L207 130 Z" fill={MID} opacity="0.18" />
      {/* Head */}
      <ellipse cx="195" cy="81" rx="24" ry="26" fill={MID} />
      {/* Neck */}
      <rect x="188" y="103" width="14" height="8" rx="4" fill={MID} />
      {/* Right leg */}
      <rect x="174" y="206" width="21" height="60" rx="8" fill={DARK} />
      {/* Left leg */}
      <rect x="200" y="206" width="21" height="60" rx="8" fill={DARK} />
      {/* Shoes */}
      <ellipse cx="184" cy="267" rx="15" ry="7" fill={DARK} />
      <ellipse cx="211" cy="267" rx="15" ry="7" fill={DARK} />

      {/* ── Person 3: Seated right, phone in hand ── */}
      {/* Head */}
      <ellipse cx="344" cy="163" rx="21" ry="22" fill={MID} />
      {/* Neck */}
      <rect x="337" y="181" width="14" height="8" rx="4" fill={MID} />
      {/* Torso */}
      <rect x="314" y="186" width="60" height="22" rx="7" fill={DARK} />
      {/* Arm leaning forward holding phone */}
      <line x1="317" y1="192" x2="300" y2="220" stroke={DARK} strokeWidth="13" strokeLinecap="round" />
      {/* Phone */}
      <rect x="289" y="213" width="14" height="22" rx="3" fill={MID} opacity="0.85" />
      {/* Body on bench */}
      <rect x="304" y="200" width="82" height="28" rx="4" fill={DARK} opacity="0.7" />
    </svg>
  )
}

export function SplashPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full bg-[#2DB87E] flex flex-col justify-between">
      {/* ── Top: logo + heading ── */}
      <div className="flex flex-col items-center px-6 pt-16 gap-5">
        <LogoIcon />
        <h1 className="text-white text-3xl font-bold text-center leading-tight">
          Welcome to<br />Traveller Wallet
        </h1>
        <p className="text-white/70 text-sm text-center">
          Powered by{' '}
          <span className="text-white font-semibold">
            little<span className="text-[#E8F7F0]">pay</span>
          </span>
        </p>
      </div>

      {/* ── Middle: train illustration ── */}
      <TransitScene />

      {/* ── Bottom: CTAs ── */}
      <div className="px-6 pb-10 flex flex-col items-center gap-2">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white text-[#2DB87E] font-semibold text-base rounded-full py-4 cursor-pointer hover:bg-white/90 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2DB87E]"
        >
          Proceed to Login
        </button>
        <span
          className="text-white/60 text-sm py-3 min-h-[44px] flex items-center"
          aria-label="Privacy and Policy — coming soon"
        >
          Privacy and Policy
        </span>
      </div>
    </div>
  )
}
