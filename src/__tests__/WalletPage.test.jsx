// src/__tests__/WalletPage.test.jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { WalletPage } from '../pages/WalletPage'
import { resetTrips } from '../android/apps/wallet/data/androidTripsStore'

function renderWalletPage() {
  return render(
    <MemoryRouter initialEntries={['/wallet']}>
      <Routes>
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/home" element={<div data-testid="home-page">Home</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('WalletPage — /wallet route', () => {
  beforeEach(() => resetTrips())

  test('renders the Littlepay GTI pass detail heading', () => {
    renderWalletPage()
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
  })

  test('shows Transit Loyalty Card', () => {
    renderWalletPage()
    expect(screen.getByText(/transit loyalty card/i)).toBeInTheDocument()
  })

  test('shows connected payment method row', () => {
    renderWalletPage()
    expect(screen.getByText(/connected payment method/i)).toBeInTheDocument()
  })

  test('shows Recent activity section', () => {
    renderWalletPage()
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument()
  })

  test('shows empty activity state when no trips', () => {
    renderWalletPage()
    expect(screen.getByText(/no activity yet/i)).toBeInTheDocument()
  })

  test('Add pass button is present', () => {
    renderWalletPage()
    expect(screen.getByRole('button', { name: /^add pass$/i })).toBeInTheDocument()
  })

  test('back button navigates to /home', () => {
    renderWalletPage()
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })

  test('Add pass button opens pass product list', () => {
    renderWalletPage()
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
    expect(screen.getByText('Daily Travel Pass')).toBeInTheDocument()
    expect(screen.getByText('Monthly Travel Pass')).toBeInTheDocument()
  })

  test('back from pass list returns to pass detail', () => {
    renderWalletPage()
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('heading', { name: /littlepay gti/i })).toBeInTheDocument()
  })

  test('full product flow completes and shows selected pass in detail', () => {
    vi.useFakeTimers()
    renderWalletPage()
    fireEvent.click(screen.getByRole('button', { name: /^add pass$/i }))
    fireEvent.click(screen.getByRole('button', { name: /daily travel pass/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }))
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByText('Daily Travel Pass')).toBeInTheDocument()
    vi.useRealTimers()
  })
})
