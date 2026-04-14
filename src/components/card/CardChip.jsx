// src/components/card/CardChip.jsx
export function CardChip({ card }) {
  return (
    <div
      role="region"
      aria-label={`${card.status} card ending ${card.pan.slice(-4)}`}
      className="relative rounded-2xl p-5 overflow-hidden select-none min-h-[160px]"
      style={{
        background: 'linear-gradient(135deg, #4CC48A 0%, #2DB87E 60%, #1A7A50 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 bg-white" />

      {/* Header row */}
      <div className="relative flex items-center justify-between mb-6">
        <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
          Traveller Wallet
        </span>
        <span className="text-white font-bold text-sm tracking-tight">
          little<span className="text-[#E8F7F0]">pay</span>
        </span>
      </div>

      {/* Cardholder name */}
      <div className="relative mb-3">
        <p className="text-white font-semibold text-lg leading-tight">{card.name}</p>
      </div>

      {/* PAN + Expiry row */}
      <div className="relative flex items-end justify-between">
        <p className="text-white/90 font-mono text-sm tracking-widest">{card.pan}</p>
        <p className="text-white/80 text-xs font-medium">{card.expiry}</p>
      </div>
    </div>
  )
}
