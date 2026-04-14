// src/components/transaction/TransactionRow.jsx
import { Bus, Train, Tram, Zap } from 'lucide-react'

const TYPE_ICON = {
  bus:   Bus,
  metro: Zap,
  rail:  Train,
  tram:  Tram,
}

const TYPE_LABEL = {
  bus: 'Bus', metro: 'Metro', rail: 'Rail', tram: 'Tram',
}

export function TransactionRow({ transaction: t }) {
  const Icon = TYPE_ICON[t.type] ?? Bus
  const time = new Date(t.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const amount = `−£${Math.abs(t.amount).toFixed(2)}`

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0">
      {/* Icon */}
      <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center flex-shrink-0" aria-hidden="true">
        <Icon size={16} className="text-[#2DB87E]" strokeWidth={2} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[#1A1F2E] text-sm font-medium truncate">{t.operator}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[#6B7280] text-xs">{time} · {TYPE_LABEL[t.type]}</span>
          {t.discounted && (
            <span className="text-[10px] font-semibold text-[#1A7A50] bg-[#E8F7F0] px-1.5 py-0.5 rounded-full">Discounted</span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="text-right flex-shrink-0">
        <p className="text-[#1A1F2E] text-sm font-semibold tabular-nums">{amount}</p>
        <span className="text-[10px] font-medium text-[#2DB87E] bg-[#E8F7F0] px-1.5 py-0.5 rounded-full">
          Complete Trip
        </span>
      </div>
    </div>
  )
}
