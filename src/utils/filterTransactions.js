// src/utils/filterTransactions.js
// Returns transactions between fromDate and toDate (inclusive).
// fromDate and toDate are ISO date strings "YYYY-MM-DD" or empty string.
export function filterTransactions(transactions, fromDate, toDate) {
  return transactions.filter((t) => {
    const txDate = t.date.slice(0, 10) // "YYYY-MM-DD"
    if (fromDate && txDate < fromDate) return false
    if (toDate   && txDate > toDate)   return false
    return true
  })
}

// Groups a sorted transactions array by date label ("11 Jan 2024")
export function groupByDate(transactions) {
  const groups = {}
  for (const t of transactions) {
    const label = new Date(t.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    if (!groups[label]) groups[label] = []
    groups[label].push(t)
  }
  return groups // { "11 Jan 2024": [...], "10 Jan 2024": [...] }
}
