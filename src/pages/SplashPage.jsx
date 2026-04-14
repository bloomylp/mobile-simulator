// src/pages/SplashPage.jsx
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'

function TransitIllustration() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs" aria-hidden="true">
      {/* Train floor */}
      <rect x="20" y="150" width="280" height="10" rx="2" fill="#1A7A50" opacity="0.5" />
      {/* Handrail */}
      <rect x="40" y="60" width="240" height="4" rx="2" fill="#1A7A50" opacity="0.4" />
      {/* Pole left */}
      <rect x="80" y="60" width="4" height="95" rx="2" fill="#1A7A50" opacity="0.4" />
      {/* Pole center */}
      <rect x="158" y="60" width="4" height="95" rx="2" fill="#1A7A50" opacity="0.4" />
      {/* Pole right */}
      <rect x="236" y="60" width="4" height="95" rx="2" fill="#1A7A50" opacity="0.4" />
      {/* Person 1 — seated left */}
      <ellipse cx="70" cy="148" rx="20" ry="5" fill="#1A7A50" opacity="0.3" />
      <rect x="52" y="108" width="36" height="40" rx="6" fill="#1DB87E" opacity="0.7" />
      <circle cx="70" cy="98" r="12" fill="#E8F7F0" opacity="0.9" />
      <rect x="62" y="110" width="16" height="3" rx="1.5" fill="#1A7A50" opacity="0.4" />

      {/* Person 2 — standing center */}
      <rect x="140" y="80" width="40" height="70" rx="6" fill="#E8F7F0" opacity="0.7" />
      <circle cx="160" cy="68" r="14" fill="#E8F7F0" opacity="0.9" />
      <rect x="158" y="62" width="6" height="20" rx="3" fill="#E8F7F0" opacity="0.8" />
      {/* Person 3 — seated right */}
      <ellipse cx="250" cy="148" rx="20" ry="5" fill="#1A7A50" opacity="0.3" />
      <rect x="232" y="108" width="36" height="40" rx="6" fill="#1DB87E" opacity="0.7" />
      <circle cx="250" cy="98" r="12" fill="#E8F7F0" opacity="0.9" />
      <rect x="255" y="115" width="10" height="16" rx="2" fill="#1A7A50" opacity="0.5" />
      {/* Window frames */}
      <rect x="30" y="20" width="60" height="45" rx="4" fill="#1A7A50" opacity="0.2" />
      <rect x="130" y="20" width="60" height="45" rx="4" fill="#1A7A50" opacity="0.2" />
      <rect x="230" y="20" width="60" height="45" rx="4" fill="#1A7A50" opacity="0.2" />
    </svg>
  )
}

export function SplashPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-between px-6 py-12"
      style={{ background: 'linear-gradient(180deg, #2DB87E 0%, #1A7A50 100%)' }}
    >
      {/* Top — logo + tagline */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
          <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" aria-hidden="true">
            <rect x="4" y="10" width="32" height="22" rx="4" fill="white" opacity="0.9" />
            <rect x="4" y="16" width="32" height="5" fill="#2DB87E" />
            <rect x="8" y="24" width="10" height="3" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-bold text-center">Welcome to<br />Traveller Wallet</h1>
        <p className="text-white/70 text-sm text-center">
          Powered by <span className="text-white font-semibold">little<span className="text-[#E8F7F0]">pay</span></span>
        </p>
      </div>

      {/* Middle — illustration */}
      <TransitIllustration />

      {/* Bottom — CTAs */}
      <div className="w-full flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full bg-white text-[#1A7A50] border-0 hover:bg-white/90"
          onClick={() => navigate('/login')}
        >
          Proceed to Login
        </Button>
        <span className="text-white/60 text-sm text-center min-h-[44px] flex items-center justify-center" aria-label="Privacy and Policy — coming soon">
          Privacy and Policy
        </span>
      </div>
    </div>
  )
}
