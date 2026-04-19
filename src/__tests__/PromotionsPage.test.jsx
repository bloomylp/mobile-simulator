import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { PromotionsPage } from '../pages/PromotionsPage'

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
            <PromotionsPage />
          </ConcessionContext.Provider>
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('PromotionsPage — header', () => {
  test('renders Promotions page heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /^promotions$/i })).toBeInTheDocument()
  })

  test('renders hamburger menu button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  test('renders language toggle', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /switch to spanish/i })).toBeInTheDocument()
  })

  test('renders notifications bell button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /^notifications$/i })).toBeInTheDocument()
  })

  test('language toggle appears before bell in DOM order', () => {
    renderPage()
    const lang = screen.getByRole('button', { name: /switch to spanish/i })
    const bell = screen.getByRole('button', { name: /^notifications$/i })
    expect(lang.compareDocumentPosition(bell)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})

describe('PromotionsPage — promotion cards', () => {
  test('renders exactly two promotion cards', () => {
    renderPage()
    expect(document.querySelectorAll('[data-testid="promotion-card"]').length).toBe(2)
  })

  test('first card labelled Offer 1', () => {
    renderPage()
    expect(screen.getByText(/offer 1/i)).toBeInTheDocument()
  })

  test('second card labelled Offer 2', () => {
    renderPage()
    expect(screen.getByText(/offer 2/i)).toBeInTheDocument()
  })

  test('Offer 1 appears before Offer 2 in DOM', () => {
    renderPage()
    const offer1 = screen.getByText(/offer 1/i)
    const offer2 = screen.getByText(/offer 2/i)
    expect(offer1.compareDocumentPosition(offer2)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  test('renders Promotion 1 title: 50% Pass', () => {
    renderPage()
    expect(screen.getByText(/50% pass/i)).toBeInTheDocument()
  })

  test('renders Promotion 1 description', () => {
    renderPage()
    expect(screen.getByText(/you are entitled to a 50% off pass/i)).toBeInTheDocument()
  })

  test('renders Promotion 1 CTA button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /click here to purchase your pass/i })).toBeInTheDocument()
  })

  test('renders Promotion 2 title', () => {
    renderPage()
    expect(screen.getByText(/receive 20% off your next week of travel/i)).toBeInTheDocument()
  })

  test('renders Promotion 2 CTA button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /click here to receive your discounted travel/i })).toBeInTheDocument()
  })
})

describe('PromotionsPage — mailing list', () => {
  test('renders mailing list title', () => {
    renderPage()
    expect(screen.getByText(/sign up to our email mailing list/i)).toBeInTheDocument()
  })

  test('renders email input', () => {
    renderPage()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  test('email input has type email', () => {
    renderPage()
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveAttribute('type', 'email')
  })

  test('email input is empty by default', () => {
    renderPage()
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('')
  })

  test('user can type into the email input', async () => {
    const user = userEvent.setup()
    renderPage()
    const input = screen.getByRole('textbox', { name: /email/i })
    await user.type(input, 'test@example.com')
    expect(input).toHaveValue('test@example.com')
  })

  test('renders submit button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
})
