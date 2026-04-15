import { describe, test, expect } from 'vitest'
import { filterTransactions, groupByDate } from '../utils/filterTransactions.js'

const tx = (id, date) => ({ id, date: `${date}T12:00:00`, amount: -1.50 })

describe('filterTransactions', () => {
  const txs = [
    tx('a', '2026-04-01'),
    tx('b', '2026-04-07'),
    tx('c', '2026-04-14'),
  ]

  test('returns all when no bounds given', () => {
    expect(filterTransactions(txs, '', '')).toHaveLength(3)
  })

  test('filters out transactions before fromDate', () => {
    const result = filterTransactions(txs, '2026-04-07', '')
    expect(result.map((t) => t.id)).toEqual(['b', 'c'])
  })

  test('filters out transactions after toDate', () => {
    const result = filterTransactions(txs, '', '2026-04-07')
    expect(result.map((t) => t.id)).toEqual(['a', 'b'])
  })

  test('fromDate and toDate are inclusive', () => {
    const result = filterTransactions(txs, '2026-04-07', '2026-04-07')
    expect(result.map((t) => t.id)).toEqual(['b'])
  })

  test('returns empty array when nothing matches', () => {
    expect(filterTransactions(txs, '2026-05-01', '2026-05-31')).toEqual([])
  })

  test('returns empty array when input is empty', () => {
    expect(filterTransactions([], '2026-04-01', '2026-04-30')).toEqual([])
  })
})

describe('groupByDate', () => {
  test('groups transactions under the same date label', () => {
    const txs = [tx('a', '2026-04-07'), tx('b', '2026-04-07')]
    const groups = groupByDate(txs)
    expect(groups).toHaveLength(1)
    expect(groups[0][1]).toHaveLength(2)
  })

  test('sorts groups most-recent first', () => {
    const txs = [tx('old', '2026-04-01'), tx('new', '2026-04-14')]
    const groups = groupByDate(txs)
    expect(groups[0][1][0].id).toBe('new')
    expect(groups[1][1][0].id).toBe('old')
  })

  test('formats ordinal day correctly for 1st, 2nd, 3rd, 4th', () => {
    const labels = [1, 2, 3, 4, 11, 12, 13, 21, 22, 23].map((day) => {
      const date = `2026-04-${String(day).padStart(2, '0')}`
      return groupByDate([tx('x', date)])[0][0]
    })
    expect(labels[0]).toMatch(/^1st/)
    expect(labels[1]).toMatch(/^2nd/)
    expect(labels[2]).toMatch(/^3rd/)
    expect(labels[3]).toMatch(/^4th/)
    expect(labels[4]).toMatch(/^11th/)
    expect(labels[5]).toMatch(/^12th/)
    expect(labels[6]).toMatch(/^13th/)
    expect(labels[7]).toMatch(/^21st/)
    expect(labels[8]).toMatch(/^22nd/)
    expect(labels[9]).toMatch(/^23rd/)
  })
})
