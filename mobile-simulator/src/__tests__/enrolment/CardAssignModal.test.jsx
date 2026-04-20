import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardAssignModal } from '../../components/enrolment/CardAssignModal'
import { addExtraCard } from '../../utils/cardsStore'

vi.mock('../../utils/cardsStore', () => ({
  addExtraCard: vi.fn(),
}))

const mockCards = [
  { id: 'card-001', name: 'John Smith', pan: '122*******31230', panSuffix: '31230', status: 'active' },
  { id: 'card-002', name: 'John Smith', pan: '456*******99999', panSuffix: '99999', status: 'pending' },
]

const onSelect    = vi.fn()
const onClose     = vi.fn()
const onNewCard   = vi.fn()

function renderModal(cards = mockCards) {
  return render(<CardAssignModal cards={cards} onSelect={onSelect} onClose={onClose} onNewCard={onNewCard} />)
}

describe('CardAssignModal', () => {
  beforeEach(() => { onSelect.mockClear(); onClose.mockClear(); onNewCard.mockClear(); vi.mocked(addExtraCard).mockClear() })

  test('renders heading', () => {
    renderModal()
    expect(screen.getByText(/Select a Card/i)).toBeInTheDocument()
  })

  test('renders each card with suffix', () => {
    renderModal()
    expect(screen.getByText(/31230/)).toBeInTheDocument()
    expect(screen.getByText(/99999/)).toBeInTheDocument()
  })

  test('Confirm disabled when no card selected', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled()
  })

  test('selecting a card enables Confirm', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText(/ending 31230/i))
    expect(screen.getByRole('button', { name: /confirm/i })).not.toBeDisabled()
  })

  test('Confirm calls onSelect with chosen card id', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText(/ending 31230/i))
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onSelect).toHaveBeenCalledWith('card-001')
  })

  test('X button calls onClose', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('renders "Add a new card" option tile', () => {
    renderModal()
    expect(screen.getByText('Add a new card')).toBeInTheDocument()
  })

  test('renders "Create a new digital card" option tile', () => {
    renderModal()
    expect(screen.getByText('Create a new digital card')).toBeInTheDocument()
  })

  test('selecting "Add a new card" disables Confirm (form empty)', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled()
  })

  test('selecting "Create a new digital card" enables Confirm', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Create a new digital card'))
    expect(screen.getByRole('button', { name: /confirm/i })).not.toBeDisabled()
  })

  test('confirming "Create a new digital card" calls onClose, not onSelect', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Create a new digital card'))
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onSelect).not.toHaveBeenCalled()
  })
})

describe('CardAssignModal — Add a new card form', () => {
  beforeEach(() => { onSelect.mockClear(); onClose.mockClear(); onNewCard.mockClear(); vi.mocked(addExtraCard).mockClear() })

  test('form fields hidden initially', () => {
    renderModal()
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
  })

  test('selecting "Add a new card" reveals Name, Card Number, Expiry, CVV fields', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Card Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Expiry')).toBeInTheDocument()
    expect(screen.getByLabelText('CVV')).toBeInTheDocument()
  })

  test('switching to an existing card collapses the form', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.click(screen.getByLabelText(/ending 31230/i))
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
  })

  test('switching to "Create a new digital card" collapses the form', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.click(screen.getByLabelText('Create a new digital card'))
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
  })

  test('card number auto-formats to XXXX XXXX XXXX XXXX', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
    expect(screen.getByLabelText('Card Number')).toHaveValue('4111 1111 1111 1111')
  })

  test('expiry auto-formats to MM/YY', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.type(screen.getByLabelText('Expiry'), '1228')
    expect(screen.getByLabelText('Expiry')).toHaveValue('12/28')
  })

  test('Confirm enabled when all new card fields are valid', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.type(screen.getByLabelText('Name'), 'Jane Smith')
    await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
    await user.type(screen.getByLabelText('Expiry'), '1228')
    await user.type(screen.getByLabelText('CVV'), '123')
    expect(screen.getByRole('button', { name: /confirm/i })).not.toBeDisabled()
  })

  test('confirming new card calls onNewCard with card data including name and panSuffix', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.type(screen.getByLabelText('Name'), 'Jane Smith')
    await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
    await user.type(screen.getByLabelText('Expiry'), '1228')
    await user.type(screen.getByLabelText('CVV'), '123')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onNewCard).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Jane Smith',
      panSuffix: '1111',
      expiry: '12/28',
      cardType: 'physical',
    }))
  })

  test('confirming new card does NOT call addExtraCard', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.type(screen.getByLabelText('Name'), 'Jane Smith')
    await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
    await user.type(screen.getByLabelText('Expiry'), '1228')
    await user.type(screen.getByLabelText('CVV'), '123')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(addExtraCard).not.toHaveBeenCalled()
  })

  test('confirming new card does NOT call onSelect', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByLabelText('Add a new card'))
    await user.type(screen.getByLabelText('Name'), 'Jane Smith')
    await user.type(screen.getByLabelText('Card Number'), '4111111111111111')
    await user.type(screen.getByLabelText('Expiry'), '1228')
    await user.type(screen.getByLabelText('CVV'), '123')
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
