// src/components/transaction/TransactionList.jsx
import { groupByDate } from '../../utils/filterTransactions.js'
import { TransactionRow } from './TransactionRow.jsx'

export function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
        <p className="text-[#6B7280] text-sm font-medium">No transactions found</p>
        <p className="text-[#6B7280] text-xs mt-1">Try adjusting the date range</p>
      </div>
    )
  }

  const grouped = groupByDate(transactions)

  return (
    <div>
      {grouped.map(([dateLabel, txs]) => (
        <section key={dateLabel}>
          <h2 className="px-5 py-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider bg-[#F4F6F8] border-b border-gray-100">
            {dateLabel}
          </h2>
          {txs.map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}
        </section>
      ))}
    </div>
  )
}
