import { render, screen, act } from '@testing-library/react'
import { ConcessionProvider, useConcession } from '../context/ConcessionContext'

function TestConsumer() {
  const { enrolled, setEnrolled, concessionData, setConcessionData, resetConcession } = useConcession()
  return (
    <div>
      <span data-testid="enrolled">{String(enrolled)}</span>
      <span data-testid="group">{concessionData?.group ?? 'none'}</span>
      <span data-testid="card">{concessionData?.card?.panSuffix ?? 'none'}</span>
      <span data-testid="enrolledAt">{concessionData?.enrolledAt ?? 'none'}</span>
      <button onClick={() => setEnrolled(true)}>enrol</button>
      <button onClick={() => setEnrolled(false)}>reset</button>
      <button onClick={() => setConcessionData('student', { panSuffix: '31230' })}>set-student</button>
      <button onClick={() => setConcessionData('senior', { panSuffix: '99999' })}>set-senior</button>
      <button onClick={resetConcession}>reset-concession</button>
    </div>
  )
}

describe('ConcessionContext', () => {
  test('enrolled is false by default', () => {
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    expect(screen.getByTestId('enrolled').textContent).toBe('false')
  })

  test('setEnrolled(true) marks enrolled', async () => {
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    await act(async () => screen.getByText('enrol').click())
    expect(screen.getByTestId('enrolled').textContent).toBe('true')
  })

  test('setEnrolled(false) clears enrolled', async () => {
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    await act(async () => screen.getByText('enrol').click())
    await act(async () => screen.getByText('reset').click())
    expect(screen.getByTestId('enrolled').textContent).toBe('false')
  })

  test('concessionData is null by default', () => {
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    expect(screen.getByTestId('group').textContent).toBe('none')
    expect(screen.getByTestId('card').textContent).toBe('none')
    expect(screen.getByTestId('enrolledAt').textContent).toBe('none')
  })

  test('setConcessionData stores group and card', async () => {
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    await act(async () => screen.getByText('set-student').click())
    expect(screen.getByTestId('group').textContent).toBe('student')
    expect(screen.getByTestId('card').textContent).toBe('31230')
  })

  test('setConcessionData stores enrolledAt timestamp', async () => {
    const before = Date.now()
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    await act(async () => screen.getByText('set-student').click())
    const after = Date.now()
    const stored = Number(screen.getByTestId('enrolledAt').textContent)
    expect(stored).toBeGreaterThanOrEqual(before)
    expect(stored).toBeLessThanOrEqual(after)
  })

  test('setConcessionData updates group on second call', async () => {
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    await act(async () => screen.getByText('set-student').click())
    await act(async () => screen.getByText('set-senior').click())
    expect(screen.getByTestId('group').textContent).toBe('senior')
  })

  test('resetConcession clears enrolled and concessionData', async () => {
    render(<ConcessionProvider><TestConsumer /></ConcessionProvider>)
    await act(async () => screen.getByText('set-student').click())
    await act(async () => screen.getByText('enrol').click())
    await act(async () => screen.getByText('reset-concession').click())
    expect(screen.getByTestId('enrolled').textContent).toBe('false')
    expect(screen.getByTestId('group').textContent).toBe('none')
  })

  test('useConcession throws outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow()
    spy.mockRestore()
  })
})
