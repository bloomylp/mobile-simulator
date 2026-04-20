// src/__tests__/CardOrderFullCycle.test.jsx
// Tests the full order → /order-complete → back to /cards cycle using real routing.
// These tests catch bugs that only surface on component remount (e.g. duplicate cards).

import { render, screen, act, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { CardsPage } from '../pages/CardsPage'
import { OrderCompletePage } from '../pages/OrderCompletePage'
import { resetCardsStore } from '../utils/cardsStore'

const CONCESSION_VALUE = {
  enrolled: false,
  concessionData: null,
  setEnrolled: () => {},
  setConcessionData: () => {},
  resetConcession: () => {},
}

function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={['/cards']}>
      <LangProvider>
        <NotificationsProvider>
          <ConcessionContext.Provider value={CONCESSION_VALUE}>
            <Routes>
              <Route path="/cards"          element={<CardsPage />} />
              <Route path="/order-complete" element={<OrderCompletePage />} />
            </Routes>
          </ConcessionContext.Provider>
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('CardsPage — full order cycle with real routing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetCardsStore()
  })
  afterEach(() => vi.useRealTimers())

  test('ordering a digital card then returning to /cards adds exactly one card', () => {
    renderWithRoutes()
    const initialCount = document.querySelectorAll('[data-card-container]').length

    // Open modal → select digital → confirm
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order a new card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /digital card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /add card to wallet/i })) })
    act(() => { vi.advanceTimersByTime(2000) })

    // Now on /order-complete — step 1 → step 2 → continue back to /cards
    act(() => { fireEvent.click(screen.getByRole('button', { name: /^next$/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /^continue$/i })) })

    // CardsPage has remounted — should have exactly one new card
    expect(document.querySelectorAll('[data-card-container]').length).toBe(initialCount + 1)
  })

  test('ordering two digital cards and returning each time adds exactly two cards total', () => {
    renderWithRoutes()
    const initialCount = document.querySelectorAll('[data-card-container]').length

    // First order
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order a new card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /digital card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /add card to wallet/i })) })
    act(() => { vi.advanceTimersByTime(2000) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /^next$/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /^continue$/i })) })

    // Second order
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order a new card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /digital card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /add card to wallet/i })) })
    act(() => { vi.advanceTimersByTime(2000) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /^next$/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /^continue$/i })) })

    expect(document.querySelectorAll('[data-card-container]').length).toBe(initialCount + 2)
  })
})
