import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SheerIDModal } from '../../components/enrolment/SheerIDModal'

const onVerified = vi.fn()
const onClose    = vi.fn()

function renderModal() {
  return render(<SheerIDModal onVerified={onVerified} onClose={onClose} />)
}

async function fillForm(user) {
  await user.type(screen.getByLabelText(/first name/i), 'John')
  await user.type(screen.getByLabelText(/last name/i), 'Smith')
  await user.selectOptions(screen.getByLabelText(/month/i), 'January')
  await user.type(screen.getByLabelText(/day/i), '15')
  await user.type(screen.getByLabelText(/year/i), '1990')
  await user.type(screen.getByLabelText(/postal code/i), 'SW1A 1AA')
  await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
}

describe('SheerIDModal', () => {
  beforeEach(() => { onVerified.mockClear(); onClose.mockClear() })

  test('renders form in initial state', () => {
    renderModal()
    expect(screen.getByText('Identity Verification')).toBeInTheDocument()
    expect(screen.getByText('Register for Concession')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verify and continue/i })).toBeInTheDocument()
  })

  test('shows TEST MODE banner', () => {
    renderModal()
    expect(screen.getByText(/TEST MODE/i)).toBeInTheDocument()
  })

  test('"Verify and continue" disabled when fields empty', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /verify and continue/i })).toBeDisabled()
  })

  test('"Verify and continue" enabled when all required fields filled', async () => {
    const user = userEvent.setup()
    renderModal()
    await fillForm(user)
    expect(screen.getByRole('button', { name: /verify and continue/i })).not.toBeDisabled()
  })

  test('submitting form shows verified screen', async () => {
    const user = userEvent.setup()
    renderModal()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /verify and continue/i }))
    expect(screen.getByText("You've been verified")).toBeInTheDocument()
    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument()
  })

  test('X button on verified screen calls onVerified', async () => {
    const user = userEvent.setup()
    renderModal()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /verify and continue/i }))
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onVerified).toHaveBeenCalledTimes(1)
  })

  test('X button on form screen calls onClose', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
