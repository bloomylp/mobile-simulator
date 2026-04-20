// src/__tests__/CardPaymentForm.test.jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CardPaymentForm } from '../components/topup/CardPaymentForm'

describe('CardPaymentForm — timer cleanup on unmount', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  function fillAndSubmit(onSuccess = vi.fn()) {
    const { unmount } = render(<CardPaymentForm amount={20} onSuccess={onSuccess} />)
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '4111111111111111' } })
    fireEvent.change(screen.getByLabelText(/expiry/i),      { target: { value: '1228' } })
    fireEvent.change(screen.getByLabelText(/cvv/i),         { target: { value: '123' } })
    fireEvent.change(screen.getByLabelText(/name on card/i),{ target: { value: 'Test User' } })
    fireEvent.click(screen.getByRole('button', { name: /pay/i }))
    return { unmount, onSuccess }
  }

  test('does not call onSuccess after unmount when processing timer is pending', () => {
    const onSuccess = vi.fn()
    const { unmount } = fillAndSubmit(onSuccess)

    // Timer is running (1200ms processing delay). Unmount before it fires.
    unmount()

    act(() => vi.advanceTimersByTime(1200))

    expect(onSuccess).not.toHaveBeenCalled()
  })
})
