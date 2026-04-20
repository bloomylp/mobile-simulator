// src/__tests__/CardActions.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CardActions } from '../components/card/CardActions'
import { resetCardsStore } from '../utils/cardsStore'

const digitalNewCard = {
  id: 'test-digital-001',
  status: 'new',
  cardType: 'digital',
  createdAt: '2026-04-16',
  panFull: '1234 5678 9012 3456',
  panSuffix: '3456',
}

const physicalCard = {
  id: 'test-physical-001',
  status: 'new',
  cardType: 'physical',
  createdAt: '2026-04-16',
  panFull: '1234 5678 9012 7890',
  panSuffix: '7890',
}

const seedCard = {
  id: 'card-001',
  status: 'active',
  cardType: 'digital',
  createdAt: '2026-04-01',
  panFull: '1222 3333 4444 5555',
  panSuffix: '5555',
}

function renderActions(card, onManage = () => {}) {
  return render(<CardActions card={card} onManage={onManage} />)
}

beforeEach(() => resetCardsStore())

describe('CardActions — Added to Wallet button', () => {
  test('digital new card shows disabled Added to Wallet button', () => {
    renderActions(digitalNewCard)
    const btn = screen.getByRole('button', { name: /added to wallet/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toBeDisabled()
  })

  test('Added to Wallet button is not clickable (stays disabled after click)', () => {
    renderActions(digitalNewCard)
    const btn = screen.getByRole('button', { name: /added to wallet/i })
    fireEvent.click(btn)
    expect(btn).toBeDisabled()
  })

  test('physical new card does not show Added to Wallet button', () => {
    renderActions(physicalCard)
    expect(screen.queryByRole('button', { name: /added to wallet/i })).not.toBeInTheDocument()
  })

  test('seed card (active, no status new) does not show Added to Wallet button', () => {
    renderActions(seedCard)
    expect(screen.queryByRole('button', { name: /added to wallet/i })).not.toBeInTheDocument()
  })
})

describe('CardActions — show/hide details', () => {
  test('Show Details button is present', () => {
    renderActions(digitalNewCard)
    expect(screen.getByRole('button', { name: /show card details/i })).toBeInTheDocument()
  })

  test('clicking Show Details reveals creation date', () => {
    renderActions(digitalNewCard)
    fireEvent.click(screen.getByRole('button', { name: /show card details/i }))
    expect(screen.getByText(/created:/i)).toBeInTheDocument()
  })

  test('Manage card button is present', () => {
    renderActions(digitalNewCard)
    expect(screen.getByRole('button', { name: /manage card/i })).toBeInTheDocument()
  })

  test('clicking Manage card calls onManage', () => {
    const onManage = vi.fn()
    renderActions(digitalNewCard, onManage)
    fireEvent.click(screen.getByRole('button', { name: /manage card/i }))
    expect(onManage).toHaveBeenCalledTimes(1)
  })
})
