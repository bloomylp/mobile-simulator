import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsContext } from '../context/NotificationsContext'
import { FrameContext } from '../context/FrameContext'
import { HamburgerMenu } from '../components/layout/HamburgerMenu'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockResetCardsStore = vi.fn()
vi.mock('../utils/cardsStore', async () => {
  const actual = await vi.importActual('../utils/cardsStore')
  return { ...actual, resetCardsStore: () => mockResetCardsStore() }
})

const mockResetConcession = vi.fn()
const concessionValue = {
  enrolled: false, concessionData: null,
  setEnrolled: () => {}, setConcessionData: () => {},
  resetConcession: mockResetConcession,
}

const mockResetNotifications = vi.fn()
const notificationsValue = {
  notifications: [], unreadCount: 0,
  addNotification: () => {}, clearUnread: () => {},
  resetNotifications: mockResetNotifications,
}

function renderMenu(path = '/home', { showControls = false } = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LangProvider>
        <FrameContext.Provider value={{ showControls }}>
          <NotificationsContext.Provider value={notificationsValue}>
            <ConcessionContext.Provider value={concessionValue}>
              <HamburgerMenu />
            </ConcessionContext.Provider>
          </NotificationsContext.Provider>
        </FrameContext.Provider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('HamburgerMenu — hamburger button', () => {
  test('hamburger button is visible', () => {
    renderMenu()
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  test('menu panel hidden by default', () => {
    renderMenu()
    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument()
  })
})

describe('HamburgerMenu — open/close', () => {
  test('clicking hamburger opens the menu panel', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument()
  })

  test('menu contains 4 nav links by default (no Promotions)', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^cards$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^concession$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^promotions$/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^profile$/i })).toBeInTheDocument()
  })

  test('menu contains Promotions when showControls is true', () => {
    renderMenu('/home', { showControls: true })
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /^promotions$/i })).toBeInTheDocument()
  })

  test('Promotions appears between Concession and Profile in DOM when showControls is true', () => {
    renderMenu('/home', { showControls: true })
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const concession = screen.getByRole('button', { name: /^concession$/i })
    const promotions = screen.getByRole('button', { name: /^promotions$/i })
    const profile    = screen.getByRole('button', { name: /^profile$/i })
    expect(concession.compareDocumentPosition(promotions)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(promotions.compareDocumentPosition(profile)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  test('close button inside panel closes the menu', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument()
  })

  test('clicking backdrop closes the menu', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByTestId('menu-backdrop'))
    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument()
  })
})

describe('HamburgerMenu — navigation', () => {
  test('clicking Promotions navigates to /promotions', () => {
    renderMenu('/home', { showControls: true })
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /^promotions$/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/promotions')
  })

  test('clicking Home navigates to /home', () => {
    renderMenu('/cards')
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /^home$/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  test('clicking nav item closes the menu', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /^cards$/i }))
    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument()
  })
})

describe('HamburgerMenu — logout', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockResetConcession.mockClear()
    mockResetCardsStore.mockClear()
    mockResetNotifications.mockClear()
  })

  test('logout button is visible when menu is open', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })

  test('logout button appears after all nav items in DOM', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const profile = screen.getByRole('button', { name: /^profile$/i })
    const logoutBtn = screen.getByRole('button', { name: /log out/i })
    expect(profile.compareDocumentPosition(logoutBtn)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  test('clicking logout navigates to /login', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /log out/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('clicking logout resets concession', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /log out/i }))
    expect(mockResetConcession).toHaveBeenCalledTimes(1)
  })

  test('clicking logout resets cards store', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /log out/i }))
    expect(mockResetCardsStore).toHaveBeenCalledTimes(1)
  })

  test('clicking logout resets notifications', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /log out/i }))
    expect(mockResetNotifications).toHaveBeenCalledTimes(1)
  })

  test('clicking logout clears session storage', () => {
    sessionStorage.setItem('lp_authed', '1')
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /log out/i }))
    expect(sessionStorage.getItem('lp_authed')).toBeNull()
  })

  test('clicking logout closes the menu', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /log out/i }))
    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument()
  })
})

describe('HamburgerMenu — Help Centre item', () => {
  test('Help Centre button is visible when menu opens', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /help centre/i })).toBeInTheDocument()
  })

  test('Help Centre appears below the Profile nav item and above Log out', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const profile = screen.getByRole('button', { name: /^profile$/i })
    const help = screen.getByRole('button', { name: /help centre/i })
    const logout = screen.getByRole('button', { name: /log out/i })
    expect(profile.compareDocumentPosition(help)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(help.compareDocumentPosition(logout)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  test('clicking Help Centre navigates to /help-centre', () => {
    mockNavigate.mockClear()
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /help centre/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/help-centre')
  })

  test('clicking Help Centre closes the menu', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /help centre/i }))
    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument()
  })
})

describe('HamburgerMenu — active state', () => {
  test('active page link has aria-current="page"', () => {
    renderMenu('/home')
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /^home$/i })).toHaveAttribute('aria-current', 'page')
  })

  test('inactive page links do not have aria-current', () => {
    renderMenu('/home')
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /^cards$/i })).not.toHaveAttribute('aria-current')
  })
})
