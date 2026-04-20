import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { FrameContext } from '../context/FrameContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsContext } from '../context/NotificationsContext'
import { HelpCentrePage } from '../pages/HelpCentrePage'

const concessionValue = {
  enrolled: false, concessionData: null,
  setEnrolled: () => {}, setConcessionData: () => {}, resetConcession: () => {},
}
const notificationsValue = {
  notifications: [], unreadCount: 0,
  addNotification: () => {}, clearUnread: () => {}, resetNotifications: () => {},
}

function renderPage() {
  return render(
    <MemoryRouter>
      <LangProvider>
        <FrameContext.Provider value={{ showControls: false, setShowControls: () => {}, platform: 'ios', setPlatform: () => {} }}>
          <NotificationsContext.Provider value={notificationsValue}>
            <ConcessionContext.Provider value={concessionValue}>
              <HelpCentrePage />
            </ConcessionContext.Provider>
          </NotificationsContext.Provider>
        </FrameContext.Provider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('HelpCentrePage', () => {
  test('renders Help Centre title', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /help centre/i, level: 1 })).toBeInTheDocument()
  })

  test('renders General Information section', () => {
    renderPage()
    expect(screen.getByText(/general information/i)).toBeInTheDocument()
  })

  test('renders Contact Us section', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument()
  })

  test('renders support phone number', () => {
    renderPage()
    expect(screen.getByText(/\+44 444 444444/)).toBeInTheDocument()
  })

  test('renders support email', () => {
    renderPage()
    expect(screen.getByText(/support@operator\.com/i)).toBeInTheDocument()
  })

  test('renders Privacy Policy link', () => {
    renderPage()
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
  })

  test('renders Terms & Conditions link', () => {
    renderPage()
    expect(screen.getByText(/terms & conditions/i)).toBeInTheDocument()
  })

  test('renders Refund Policy link', () => {
    renderPage()
    expect(screen.getByText(/refund policy/i)).toBeInTheDocument()
  })

  test('renders hamburger menu button', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  test('renders language toggle', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /switch to spanish|cambiar a ingl/i })).toBeInTheDocument()
  })

  test('renders notification bell', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })
})

describe('HelpCentrePage — translation', () => {
  test('title translates to Spanish when language toggled', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /switch to spanish/i }))
    expect(screen.getByRole('heading', { name: /centro de ayuda/i, level: 1 })).toBeInTheDocument()
  })

  test('General Information heading translates', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /switch to spanish/i }))
    expect(screen.getByText(/información general/i)).toBeInTheDocument()
  })

  test('Contact Us heading translates', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /switch to spanish/i }))
    expect(screen.getByRole('heading', { name: /contáctenos/i })).toBeInTheDocument()
  })

  test('Privacy Policy link translates', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /switch to spanish/i }))
    expect(screen.getByText(/política de privacidad/i)).toBeInTheDocument()
  })

  test('Terms & Conditions link translates', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /switch to spanish/i }))
    expect(screen.getByText(/términos y condiciones/i)).toBeInTheDocument()
  })

  test('Refund Policy link translates', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /switch to spanish/i }))
    expect(screen.getByText(/política de reembolso/i)).toBeInTheDocument()
  })

  test('phone number is unchanged after translation', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /switch to spanish/i }))
    expect(screen.getByText(/\+44 444 444444/)).toBeInTheDocument()
  })
})
