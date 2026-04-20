import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { TransactionList } from '../components/transaction/TransactionList'

function renderList(txs) {
  return render(
    <MemoryRouter>
      <LangProvider>
        <TransactionList transactions={txs} />
      </LangProvider>
    </MemoryRouter>
  )
}

describe('TransactionList — empty state', () => {
  test('shows "No trips" when transaction list is empty', () => {
    renderList([])
    expect(screen.getByText(/no trips/i)).toBeInTheDocument()
  })

  test('shows "balance loading completed" in empty state', () => {
    renderList([])
    expect(screen.getByText(/balance loading completed/i)).toBeInTheDocument()
  })

  test('does not show empty state when transactions exist', () => {
    const tx = { id: 't1', date: '2024-01-11T07:54:00', type: 'bus', route: 'Bus 42', operator: 'Bradford Bus', status: 'complete', amount: -1.50, discounted: false }
    renderList([tx])
    expect(screen.queryByText(/no trips/i)).not.toBeInTheDocument()
  })
})

describe('TransactionList — renders rows', () => {
  test('renders one row per transaction', () => {
    const txs = [
      { id: 't1', date: '2024-01-11T07:54:00', type: 'bus',   route: 'Bus 42', operator: 'Bradford Bus',      status: 'complete', amount: -1.50, discounted: false },
      { id: 't2', date: '2024-01-11T09:12:00', type: 'metro', route: 'Yellow', operator: 'Tyne & Wear Metro', status: 'complete', amount: -0.75, discounted: false },
    ]
    renderList(txs)
    expect(screen.getByText('Bradford Bus')).toBeInTheDocument()
    expect(screen.getByText('Tyne & Wear Metro')).toBeInTheDocument()
  })
})
