import { render, screen, act } from '@testing-library/react'
import { EnrolmentProvider, useEnrolment } from '../../context/EnrolmentContext'

const PENDING_CARD = { id: 'card-new-1', name: 'Jane', panSuffix: '1111', cardType: 'physical' }

function TestConsumer() {
  const { state, setGroup, setVerified, setCard, setPendingCard, resetEnrolment } = useEnrolment()
  return (
    <div>
      <span data-testid="group">{state.group ?? 'none'}</span>
      <span data-testid="verified">{String(state.verified)}</span>
      <span data-testid="card">{state.card ? state.card.name : 'none'}</span>
      <span data-testid="pendingCard">{state.pendingCard ? state.pendingCard.name : 'none'}</span>
      <button onClick={() => setGroup('student')}>set-student</button>
      <button onClick={() => setGroup('senior')}>set-senior</button>
      <button onClick={() => setVerified(true)}>set-verified</button>
      <button onClick={() => setCard({ name: 'John', number: '4242 4242 4242 4242', expiry: '12/28', cvv: '123' })}>set-card</button>
      <button onClick={() => setPendingCard(PENDING_CARD)}>set-pending-card</button>
      <button onClick={resetEnrolment}>reset</button>
    </div>
  )
}

describe('EnrolmentContext', () => {
  test('provides initial state', () => {
    render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    expect(screen.getByTestId('group').textContent).toBe('none')
    expect(screen.getByTestId('verified').textContent).toBe('false')
    expect(screen.getByTestId('card').textContent).toBe('none')
  })

  test('setGroup updates group', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-student').click())
    expect(getByTestId('group').textContent).toBe('student')
  })

  test('setVerified updates verified', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-verified').click())
    expect(getByTestId('verified').textContent).toBe('true')
  })

  test('setCard updates card', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-card').click())
    expect(getByTestId('card').textContent).toBe('John')
  })

  test('pendingCard is null by default', () => {
    render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    expect(screen.getByTestId('pendingCard').textContent).toBe('none')
  })

  test('setPendingCard updates pendingCard', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-pending-card').click())
    expect(getByTestId('pendingCard').textContent).toBe('Jane')
  })

  test('resetEnrolment clears state', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-student').click())
    await act(async () => getByText('set-verified').click())
    await act(async () => getByText('reset').click())
    expect(getByTestId('group').textContent).toBe('none')
    expect(getByTestId('verified').textContent).toBe('false')
  })

  test('resetEnrolment clears pendingCard', async () => {
    const { getByText, getByTestId } = render(<EnrolmentProvider><TestConsumer /></EnrolmentProvider>)
    await act(async () => getByText('set-pending-card').click())
    await act(async () => getByText('reset').click())
    expect(getByTestId('pendingCard').textContent).toBe('none')
  })
})
