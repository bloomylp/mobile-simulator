// src/__tests__/WalletFlowContext.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { WalletFlowProvider, useWalletFlow } from '../android/apps/wallet/WalletFlowContext'

function Probe() {
  const f = useWalletFlow()
  return (
    <div>
      <span data-testid="step">{f.step}</span>
      <span data-testid="payment">{f.selectedPayment ?? ''}</span>
      <span data-testid="passes">{f.passes.length}</span>
      <button onClick={() => f.goTo('categories')}>goto-categories</button>
      <button onClick={() => f.goTo('search')}>goto-search</button>
      <button onClick={() => f.setSelectedPayment('Mastercard •••• 4444')}>pick-mc</button>
      <button onClick={() => f.addPass({ id: 'p1', brand: 'Littlepay GTI' })}>add-pass</button>
      <button onClick={() => f.close()}>close</button>
      <button onClick={() => f.back()}>back</button>
    </div>
  )
}

function renderProvider() {
  return render(
    <WalletFlowProvider>
      <Probe />
    </WalletFlowProvider>
  )
}

describe('WalletFlowContext', () => {
  test('initial step is main', () => {
    renderProvider()
    expect(screen.getByTestId('step').textContent).toBe('main')
  })

  test('initial selectedPayment is empty', () => {
    renderProvider()
    expect(screen.getByTestId('payment').textContent).toBe('')
  })

  test('initial passes is empty', () => {
    renderProvider()
    expect(screen.getByTestId('passes').textContent).toBe('0')
  })

  test('goTo advances step', () => {
    renderProvider()
    fireEvent.click(screen.getByText('goto-categories'))
    expect(screen.getByTestId('step').textContent).toBe('categories')
  })

  test('setSelectedPayment stores value', () => {
    renderProvider()
    fireEvent.click(screen.getByText('pick-mc'))
    expect(screen.getByTestId('payment').textContent).toBe('Mastercard •••• 4444')
  })

  test('addPass appends to passes array', () => {
    renderProvider()
    fireEvent.click(screen.getByText('add-pass'))
    expect(screen.getByTestId('passes').textContent).toBe('1')
  })

  test('close returns to main', () => {
    renderProvider()
    fireEvent.click(screen.getByText('goto-search'))
    fireEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('step').textContent).toBe('main')
  })

  test('back from categories goes to main', () => {
    renderProvider()
    fireEvent.click(screen.getByText('goto-categories'))
    fireEvent.click(screen.getByText('back'))
    expect(screen.getByTestId('step').textContent).toBe('main')
  })

  test('back from search goes to categories', () => {
    renderProvider()
    fireEvent.click(screen.getByText('goto-categories'))
    fireEvent.click(screen.getByText('goto-search'))
    fireEvent.click(screen.getByText('back'))
    expect(screen.getByTestId('step').textContent).toBe('categories')
  })
})
