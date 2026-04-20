// src/__tests__/TopUpSheet.test.jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TopUpSheet } from '../components/topup/TopUpSheet'

describe('TopUpSheet — custom amount aria-label', () => {
  test('custom amount input label says "dollars" not "pounds"', () => {
    render(<TopUpSheet onClose={() => {}} onTopUp={() => {}} />)
    const input = screen.getByLabelText(/custom top-up amount/i)
    expect(input.getAttribute('aria-label')).toMatch(/dollar/i)
    expect(input.getAttribute('aria-label')).not.toMatch(/pound/i)
  })
})

describe('TopUpSheet — timer cleanup on unmount', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  test('does not call onClose after unmount when success timer is pending', () => {
    const onClose = vi.fn()
    const { unmount } = render(<TopUpSheet onClose={onClose} onTopUp={() => {}} />)

    // Fill card form
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '4111111111111111' } })
    fireEvent.change(screen.getByLabelText(/expiry/i),      { target: { value: '1228' } })
    fireEvent.change(screen.getByLabelText(/cvv/i),         { target: { value: '123' } })
    fireEvent.change(screen.getByLabelText(/name on card/i),{ target: { value: 'Test User' } })

    // Submit — triggers CardPaymentForm's 1200ms processing timer
    fireEvent.click(screen.getByRole('button', { name: /pay \$/i }))

    // Fire CardPaymentForm timer → calls onSuccess → handleSuccess runs
    // → setSuccess(true) + setTimeout(onClose, 2000) starts
    act(() => vi.advanceTimersByTime(1200))

    expect(screen.getByText(/balance updated/i)).toBeInTheDocument()

    // Unmount while TopUpSheet's 2000ms onClose timer is still pending
    unmount()

    // Advance past the 2s timer
    act(() => vi.advanceTimersByTime(2000))

    // onClose must NOT fire — the timer should have been cancelled on unmount
    expect(onClose).not.toHaveBeenCalled()
  })
})
