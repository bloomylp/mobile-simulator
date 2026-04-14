// src/utils/filterTransactions.js
// Returns transactions between fromDate and toDate (inclusive).
// fromDate and toDate are "YYYY-MM-DD" strings or empty string (= no bound).
// NOTE: t.date must be a local-time ISO string (no Z suffix, no UTC offset).
// Lexicographic slice comparison is only correct for local-time strings.
export function filterTransactions(transactions, fromDate, toDate) {
  return transactions.filter((t) => {
    const txDate = t.date.slice(0, 10) // "YYYY-MM-DD"
    if (fromDate && txDate < fromDate) return false
    if (toDate   && txDate > toDate)   return false
    return true
  })
}

// Groups a transactions array by date label and returns sorted [label, txs][]
// descending by date (most recent first). Input does not need to be pre-sorted.
export function groupByDate(transactions) {
  const groups = {}
  for (const t of transactions) {
    const label = new Date(t.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    if (!groups[label]) groups[label] = []
    groups[label].push(t)
  }
  return Object.entries(groups).sort(([, aTxs], [, bTxs]) =>
    new Date(bTxs[0].date) - new Date(aTxs[0].date)
  )
}
