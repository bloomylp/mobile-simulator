import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { ProfilePage } from '../pages/ProfilePage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderPage(resetConcession = vi.fn()) {
  return render(
    <MemoryRouter>
      <LangProvider>
        <NotificationsProvider>
          <ConcessionContext.Provider value={{ enrolled: true, concessions: [{}], setEnrolled: vi.fn(), setConcessionData: vi.fn(), resetConcession }}>
            <ProfilePage />
          </ConcessionContext.Provider>
        </NotificationsProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('ProfilePage — header layout', () => {
  beforeEach(() => mockNavigate.mockClear())

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

describe('ProfilePage — reset', () => {
  beforeEach(() => mockNavigate.mockClear())

  test('clicking JR avatar calls resetConcession', async () => {
    const resetConcession = vi.fn()
    const user = userEvent.setup()
    renderPage(resetConcession)
    await user.click(screen.getByRole('button', { name: /reset demo/i }))
    expect(resetConcession).toHaveBeenCalled()
  })

  test('clicking JR avatar navigates to /login', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /reset demo/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  test('clicking Log Out menu item performs a full reset (not just auth flag)', async () => {
    const resetConcession = vi.fn()
    const user = userEvent.setup()
    sessionStorage.setItem('lp_authed', '1')
    renderPage(resetConcession)
    await user.click(screen.getByRole('button', { name: /log out/i }))
    expect(resetConcession).toHaveBeenCalled()
    expect(sessionStorage.getItem('lp_authed')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
