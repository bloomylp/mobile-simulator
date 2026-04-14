// src/pages/OrderCompletePage.jsx
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'

function CardSuccessIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto mx-auto" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="132" rx="55" ry="6" fill="#1A1F2E" opacity="0.08" />

      {/* Card back (tilted) */}
      <g transform="rotate(-8, 100, 80)">
        <rect x="30" y="50" width="110" height="68" rx="8" fill="#4CC48A" />
        <rect x="30" y="66" width="110" height="14" fill="#2DB87E" />
        <rect x="38" y="88" width="40" height="6" rx="3" fill="white" opacity="0.4" />
      </g>

      {/* Card front */}
      <rect x="58" y="30" width="110" height="70" rx="8" fill="url(#cardGrad)" />
      <rect x="58" y="48" width="110" height="14" fill="#1A7A50" opacity="0.6" />
      <rect x="66" y="70" width="50" height="5" rx="2.5" fill="white" opacity="0.5" />
      <rect x="66" y="82" width="30" height="5" rx="2.5" fill="white" opacity="0.4" />
      {/* Chip */}
      <rect x="66" y="38" width="18" height="13" rx="2" fill="#E8F7F0" opacity="0.7" />

      {/* Coins */}
      <ellipse cx="42" cy="116" rx="12" ry="6" fill="#2DB87E" opacity="0.5" />
      <ellipse cx="42" cy="113" rx="12" ry="6" fill="#4CC48A" />
      <ellipse cx="164" cy="120" rx="10" ry="5" fill="#2DB87E" opacity="0.5" />
      <ellipse cx="164" cy="117" rx="10" ry="5" fill="#4CC48A" />

      <defs>
        <linearGradient id="cardGrad" x1="58" y1="30" x2="168" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4CC48A" />
          <stop offset="1" stopColor="#1A7A50" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function OrderCompletePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex items-center justify-center px-6">
      {/* Country selector (top right) */}
      <div className="absolute top-4 right-4">
        <select
          className="text-sm text-[#1A1F2E] bg-white border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2DB87E]"
          aria-label="Select country"
        >
          <option>US</option>
          <option>GB</option>
          <option>AU</option>
        </select>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center gap-6">
        {/* Brand */}
        <p className="text-[#1A1F2E] text-lg font-bold">
          little<span className="text-[#2DB87E]">pay</span>
        </p>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-[#1A1F2E] text-xl font-bold mb-1">Order Completed</h1>
          <p className="text-[#6B7280] text-sm">You will receive your card shortly</p>
        </div>

        <CardSuccessIllustration />

        <Button className="w-full" onClick={() => navigate('/cards')}>
          Continue
        </Button>
      </div>
    </div>
  )
}
