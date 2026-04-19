import { render, screen, act, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { CardsPage } from '../pages/CardsPage'
import { resetCardsStore, getExtraCards } from '../utils/cardsStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderPage() {
  return render(
    <MemoryRouter>
      <LangProvider>
        <NotificationsProvider>
          <ConcessionContext.Provider value={{ enrolled: false, concessionData: null, setEnrolled: () => {}, setConcessionData: () => {}, resetConcession: () => {} }}>
            <CardsPage />
          </ConcessionContext.Provider>
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('CardsPage — header layout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockNavigate.mockClear()
    resetCardsStore()
  })
  afterEach(() => vi.useRealTimers())

  test('renders notifications bell button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  test('language toggle appears before bell in DOM order', () => {
    renderPage()
    const langBtn = screen.getByRole('button', { name: /switch to spanish/i })
    const bellBtn = screen.getByRole('button', { name: /notifications/i })
    expect(langBtn.compareDocumentPosition(bellBtn)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})

describe('CardsPage — order new card', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockNavigate.mockClear()
    resetCardsStore()
  })
  afterEach(() => vi.useRealTimers())

  test('selecting digital card navigates to /order-complete and shows ordering spinner', () => {
    renderPage()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order a new card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /digital card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /add card to wallet/i })) })
    // Spinner visible during the 1500ms delay
    expect(screen.getByRole('button', { name: /order a new card/i }).closest('button')).toBeDisabled()
    act(() => { vi.advanceTimersByTime(2000) })
    expect(mockNavigate).toHaveBeenCalledWith('/order-complete', { state: { cardType: 'digital' } })
  })

  test('card is added to the store (not the local list) before navigating away', () => {
    renderPage()
    const before = getExtraCards().length
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order a new card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /digital card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /add card to wallet/i })) })
    act(() => { vi.advanceTimersByTime(2000) })
    expect(getExtraCards().length).toBe(before + 1)
  })
})

describe('CardsPage — delete animation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockNavigate.mockClear()
    resetCardsStore()
  })
  afterEach(() => vi.useRealTimers())

  test('card container gets data-deleting="true" immediately when delete triggered', () => {
    renderPage()
    const deleteBtn = screen.getAllByRole('button', { name: /delete card/i })[0]
    act(() => { fireEvent.click(deleteBtn) })
    const deleting = document.querySelectorAll('[data-deleting="true"]')
    expect(deleting.length).toBe(1)
  })

  test('card is removed from DOM after animation completes', () => {
    renderPage()
    const initialCards = document.querySelectorAll('[data-card-container]')
    const deleteBtn = screen.getAllByRole('button', { name: /delete card/i })[0]
    act(() => { fireEvent.click(deleteBtn) })
    act(() => { vi.advanceTimersByTime(500) })
    const remainingCards = document.querySelectorAll('[data-card-container]')
    expect(remainingCards.length).toBe(initialCards.length - 1)
  })

  test('other cards are not affected during delete animation', () => {
    renderPage()
    const initialCards = document.querySelectorAll('[data-card-container]')
    if (initialCards.length < 2) return
    const deleteBtn = screen.getAllByRole('button', { name: /delete card/i })[0]
    act(() => { fireEvent.click(deleteBtn) })
    const notDeleting = document.querySelectorAll('[data-card-container]:not([data-deleting="true"])')
    expect(notDeleting.length).toBe(initialCards.length - 1)
  })
})

describe('CardsPage — navigate state on order complete', () => {
  beforeEach(() => { vi.useFakeTimers(); mockNavigate.mockClear(); resetCardsStore() })
  afterEach(() => vi.useRealTimers())

  test('navigates to /order-complete with digital cardType state when digital selected', () => {
    renderPage()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order a new card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /digital card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /add card to wallet/i })) })
    act(() => { vi.advanceTimersByTime(2000) })
    expect(mockNavigate).toHaveBeenCalledWith('/order-complete', { state: { cardType: 'digital' } })
  })

  test('navigates to /order-complete with physical cardType state when physical selected', () => {
    renderPage()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order a new card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /physical card/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /order physical card/i })) })
    act(() => { vi.advanceTimersByTime(2000) })
    expect(mockNavigate).toHaveBeenCalledWith('/order-complete', { state: { cardType: 'physical' } })
  })
})

describe('CardsPage — active/deactivated toggle re-renders via store', () => {
  beforeEach(() => { mockNavigate.mockClear(); resetCardsStore() })

  test('clicking toggle flips label between Active and Deactivated', () => {
    renderPage()
    const toggle = screen.getAllByRole('switch')[0]
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(screen.getAllByText(/^Active$/)[0]).toBeInTheDocument()
    act(() => { fireEvent.click(toggle) })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(screen.getAllByText(/^Deactivated$/)[0]).toBeInTheDocument()
    act(() => { fireEvent.click(toggle) })
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })
})
