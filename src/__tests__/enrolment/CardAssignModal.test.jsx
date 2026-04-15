import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardAssignModal } from '../../components/enrolment/CardAssignModal'

const mockCards = [
  { id: 'card-001', name: 'John Smith', pan: '122*******31230', panSuffix: '31230', status: 'active' },
  { id: 'card-002', name: 'John Smith', pan: '456*******99999', panSuffix: '99999', status: 'pending' },
]

const onSelect = vi.fn()
const onClose  = vi.fn()

function renderModal(cards = mockCards) {
  return render(<CardAssignModal cards={cards} onSelect={onSelect} onClose={onClose} />)
}

describe('CardAssignModal', () => {
  beforeEach(() => { onSelect.mockClear(); onClose.mockClear() })

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
})
