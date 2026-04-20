import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { HomePage } from '../pages/HomePage'
import { addExtraCard, removeExtraCard, buildNewCard, resetCardsStore, topUpCard } from '../utils/cardsStore'

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
            <HomePage />
          </ConcessionContext.Provider>
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('HomePage — header layout', () => {
  beforeEach(() => {
    resetCardsStore()
    mockNavigate.mockClear()
  })

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

describe('HomePage — card count reflects store deletions', () => {
  beforeEach(() => {
    resetCardsStore()
    mockNavigate.mockClear()
  })

  test('shows one digital card label when one of two extra cards has been removed', () => {
    const cardA = buildNewCard('digital')
    const cardB = buildNewCard('digital')
    addExtraCard(cardA)
    addExtraCard(cardB)
    removeExtraCard(cardA.id)
    renderPage()
    expect(screen.getAllByText(/digital card/i)).toHaveLength(1)
  })

  test('shows no digital card label when the only extra card has been removed', () => {
    const card = buildNewCard('digital')
    addExtraCard(card)
    removeExtraCard(card.id)
    renderPage()
    expect(screen.queryByText(/digital card/i)).not.toBeInTheDocument()
  })

  test('shows all three extra cards when none are removed', () => {
    addExtraCard(buildNewCard('digital'))
    addExtraCard(buildNewCard('digital'))
    addExtraCard(buildNewCard('digital'))
    renderPage()
    expect(screen.getAllByText(/digital card/i)).toHaveLength(3)
  })
})

describe('HomePage — auto-updates on store mutations (no remount)', () => {
  beforeEach(() => {
    resetCardsStore()
    mockNavigate.mockClear()
  })

  test('balance display updates when topUpCard runs without remount', () => {
    renderPage()
    // Balance header is a `tabular-nums` paragraph containing `$X.XX` + "Balance"
    const header = () => document.querySelector('p.tabular-nums')
    expect(header().textContent).toMatch(/\$0\.00/)
    act(() => { topUpCard('card-001', 25) })
    expect(header().textContent).toMatch(/\$25\.00/)
  })

  test('card list reflects addExtraCard without remount', () => {
    renderPage()
    expect(screen.queryByText(/digital card/i)).not.toBeInTheDocument()
    act(() => { addExtraCard(buildNewCard('digital')) })
    expect(screen.getByText(/digital card/i)).toBeInTheDocument()
  })
})

describe('HomePage — card labels', () => {
  beforeEach(() => {
    resetCardsStore()
    mockNavigate.mockClear()
  })

  test('seed card shows "Primary Card"', () => {
    renderPage()
    expect(screen.getByText(/primary card/i)).toBeInTheDocument()
  })

  test('newly ordered digital card shows "Digital Card"', () => {
    addExtraCard(buildNewCard('digital'))
    renderPage()
    expect(screen.getByText(/digital card/i)).toBeInTheDocument()
  })

  test('newly ordered physical card shows "Physical Card"', () => {
    addExtraCard(buildNewCard('physical'))
    renderPage()
    expect(screen.getByText(/physical card/i)).toBeInTheDocument()
  })

  test('digital card does not show "Additional Card"', () => {
    addExtraCard(buildNewCard('digital'))
    renderPage()
    expect(screen.queryByText(/additional card/i)).not.toBeInTheDocument()
  })

  test('physical card does not show "Additional Card"', () => {
    addExtraCard(buildNewCard('physical'))
    renderPage()
    expect(screen.queryByText(/additional card/i)).not.toBeInTheDocument()
  })
})
