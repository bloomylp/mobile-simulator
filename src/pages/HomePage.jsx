// src/pages/HomePage.jsx
import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { PageShell }          from '../components/layout/PageShell.jsx'
import { BottomNav }          from '../components/layout/BottomNav.jsx'
import { DateRangeFilter }    from '../components/transaction/DateRangeFilter.jsx'
import { TransactionList }    from '../components/transaction/TransactionList.jsx'
import { TopUpSheet }         from '../components/topup/TopUpSheet.jsx'
import { Button }             from '../components/ui/Button.jsx'
import { cards }              from '../data/cards.js'
import { transactions }       from '../data/transactions.js'
import { filterTransactions } from '../utils/filterTransactions.js'

const activeCard = cards.find((c) => c.status === 'active') ?? cards[0]

export function HomePage() {
  const [showTopUp, setShowTopUp] = useState(false)
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' })

  const filtered = filterTransactions(transactions, dateRange.fromDate, dateRange.toDate)

  return (
    <PageShell className="pb-20">
      {/* Green header banner */}
      <div
        className="px-5 pt-10 pb-8"
        style={{ background: 'linear-gradient(160deg, #2DB87E 0%, #1A7A50 100%)' }}
      >
        <p className="text-white/80 text-sm font-medium mb-1">Welcome to Traveller Wallet</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-xs font-medium mb-0.5">
              Active · little<span className="text-[#E8F7F0]">pay</span>
            </p>
            <h1 className="text-white text-2xl font-bold">{activeCard.name}</h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wallet size={22} className="text-white" aria-hidden="true" />
          </div>
        </div>

        {/* Spend summary */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Total Spent</p>
            <p className="text-white text-3xl font-bold mt-0.5 tabular-nums">
              £{activeCard.spent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Balance</p>
            <p className="text-white text-xl font-bold mt-0.5 tabular-nums">
              £{activeCard.balance.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mt-5 w-full bg-white/15 text-white border-white/30 hover:bg-white/25"
          onClick={() => setShowTopUp(true)}
        >
          Load Money
        </Button>
      </div>

      {/* Transactions panel */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[#1A1F2E] text-base font-bold">Transactions</h2>
          <span className="text-[#6B7280] text-xs">{filtered.length} trips</span>
        </div>

        <DateRangeFilter
          fromDate={dateRange.fromDate}
          toDate={dateRange.toDate}
          onChange={setDateRange}
        />

        <TransactionList transactions={filtered} />
      </div>

      {/* Top-up bottom sheet */}
      {showTopUp && <TopUpSheet onClose={() => setShowTopUp(false)} />}

      <BottomNav />
    </PageShell>
  )
}
