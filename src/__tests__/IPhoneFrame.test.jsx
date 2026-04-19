import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LangProvider } from '../context/LangContext'
import { ConcessionContext } from '../context/ConcessionContext'
import { NotificationsProvider, useNotifications } from '../context/NotificationsContext'
import { FrameProvider } from '../context/FrameContext'
import { IPhoneFrame } from '../components/layout/IPhoneFrame'
import { NotificationBell } from '../components/ui/NotificationBell'
import { HamburgerMenu } from '../components/layout/HamburgerMenu'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const concessionValue = { enrolled: false, concessionData: null, setEnrolled: () => {}, setConcessionData: () => {}, resetConcession: () => {} }

// Reads unread count from context and exposes it in the DOM for assertions
function NotifCounter() {
  const { unreadCount } = useNotifications()
  return <span data-testid="notif-count">{unreadCount}</span>
}

function renderFrame(path = '/home') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LangProvider>
        <FrameProvider>
          <NotificationsProvider>
            <ConcessionContext.Provider value={concessionValue}>
              <IPhoneFrame>
                <HamburgerMenu />
                <div data-testid="app-content">App Content</div>
              </IPhoneFrame>
              <NotifCounter />
              <NotificationBell />
            </ConcessionContext.Provider>
          </NotificationsProvider>
        </FrameProvider>
      </LangProvider>
    </MemoryRouter>
  )
}

describe('IPhoneFrame — dynamic island toggle', () => {
  test('controls hidden by default', () => {
    renderFrame()
    expect(screen.queryByRole('button', { name: /push notification/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /home screen/i })).not.toBeInTheDocument()
  })

  test('dynamic island is a clickable button', () => {
    renderFrame()
    expect(screen.getByRole('button', { name: /toggle controls/i })).toBeInTheDocument()
  })

  test('clicking dynamic island shows controls', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /push notification \(trip\)/i })).toBeInTheDocument()
  })

  test('clicking dynamic island again hides controls', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.queryByRole('button', { name: /push notification/i })).not.toBeInTheDocument()
  })
})

describe('IPhoneFrame — Push Notification (Trip)', () => {
  beforeEach(() => { vi.useFakeTimers(); mockNavigate.mockClear() })
  afterEach(() => vi.useRealTimers())

  test('notification appears when Trip button clicked', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(trip\)/i })) })
    expect(screen.getByTestId('push-notification')).toBeInTheDocument()
  })

  test('notification shows trip message', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(trip\)/i })) })
    expect(screen.getByText(/thank you for traveling on mst/i)).toBeInTheDocument()
  })

  test('notification still visible at 3 seconds', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(trip\)/i })) })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByTestId('push-notification')).toBeInTheDocument()
  })

  test('notification begins dismissing after 5 seconds', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(trip\)/i })) })
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.getByTestId('push-notification')).toHaveAttribute('data-dismissing', 'true')
  })

  test('notification removed from DOM after slide-out completes', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(trip\)/i })) })
    act(() => { vi.advanceTimersByTime(5400) })
    expect(screen.queryByTestId('push-notification')).not.toBeInTheDocument()
  })

  test('clicking notification navigates to /home', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(trip\)/i })) })
    act(() => { fireEvent.click(screen.getByTestId('push-notification')) })
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  test('clicking notification dismisses it', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(trip\)/i })) })
    act(() => { fireEvent.click(screen.getByTestId('push-notification')) })
    expect(screen.queryByTestId('push-notification')).not.toBeInTheDocument()
  })
})

describe('IPhoneFrame — Push Notification (Low Balance)', () => {
  beforeEach(() => { vi.useFakeTimers(); mockNavigate.mockClear() })
  afterEach(() => vi.useRealTimers())

  test('notification appears when Low Balance button clicked', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(low balance\)/i })) })
    expect(screen.getByTestId('push-notification')).toBeInTheDocument()
  })

  test('notification shows low balance message', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(low balance\)/i })) })
    expect(screen.getByText(/you have a low balance on your card/i)).toBeInTheDocument()
  })

  test('clicking low balance notification navigates to /home', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(low balance\)/i })) })
    act(() => { fireEvent.click(screen.getByTestId('push-notification')) })
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })
})

describe('IPhoneFrame — control panel buttons', () => {
  test('renders Push Notification (Trip) button when controls open', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /push notification \(trip\)/i })).toBeInTheDocument()
  })

  test('renders Push Notification (Low Balance) button when controls open', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /push notification \(low balance\)/i })).toBeInTheDocument()
  })

  test('renders Push Notification (Info) button when controls open', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /push notification \(info\)/i })).toBeInTheDocument()
  })
})

describe('IPhoneFrame — Home Screen button', () => {
  test('renders "Home Screen" control button when controls open', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    expect(screen.getByRole('button', { name: /home screen/i })).toBeInTheDocument()
  })

  test('app content visible by default', () => {
    renderFrame()
    expect(screen.getByTestId('app-content')).toBeInTheDocument()
  })

  test('clicking Home Screen hides app content', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    await user.click(screen.getByRole('button', { name: /home screen/i }))
    expect(screen.queryByTestId('app-content')).not.toBeInTheDocument()
  })

  test('clicking Home Screen shows iOS home screen', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    await user.click(screen.getByRole('button', { name: /home screen/i }))
    expect(screen.getByTestId('ios-home-screen')).toBeInTheDocument()
  })

  test('Littlepay app icon visible on home screen', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    await user.click(screen.getByRole('button', { name: /home screen/i }))
    expect(screen.getByRole('button', { name: /littlepay/i })).toBeInTheDocument()
  })

  test('clicking Littlepay icon returns to app', async () => {
    const user = userEvent.setup()
    renderFrame()
    await user.click(screen.getByRole('button', { name: /toggle controls/i }))
    await user.click(screen.getByRole('button', { name: /home screen/i }))
    await user.click(screen.getByRole('button', { name: /littlepay/i }))
    expect(screen.getByTestId('app-content')).toBeInTheDocument()
    expect(screen.queryByTestId('ios-home-screen')).not.toBeInTheDocument()
  })
})

describe('IPhoneFrame — Push Notification (Info)', () => {
  beforeEach(() => { vi.useFakeTimers(); mockNavigate.mockClear() })
  afterEach(() => vi.useRealTimers())

  test('Info button shows toast notification', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    expect(screen.getByTestId('push-notification')).toBeInTheDocument()
  })

  test('Info toast shows promotion message', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    expect(screen.getByText(/view a promotion/i)).toBeInTheDocument()
  })

  test('Info button adds 1 to notification centre unread count', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    expect(screen.getByTestId('notif-count').textContent).toBe('1')
  })

  test('pressing Info button 3 times accumulates count to 3', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    expect(screen.getByTestId('notif-count').textContent).toBe('3')
  })

  test('bell badge shows 1 after pressing Info once', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    expect(screen.getByTestId('notif-badge').textContent).toBe('1')
  })

  test('bell badge increments to 2 after pressing Info twice', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    expect(screen.getByTestId('notif-badge').textContent).toBe('2')
  })

  test('bell badge increments to 3 after pressing Info three times', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    expect(screen.getByTestId('notif-badge').textContent).toBe('3')
  })

  test('Info notification centre message says click here to see latest promotions', async () => {
    const user = userEvent.setup({ delay: null })
    vi.useRealTimers()
    renderFrame()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByText(/click here to see our latest promotions/i)).toBeInTheDocument()
  })

  test('clicking Info toast navigates to /promotions', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i })) })
    act(() => { fireEvent.click(screen.getByTestId('push-notification')) })
    expect(mockNavigate).toHaveBeenCalledWith('/promotions')
  })

  test('clicking Info notification in notification centre navigates to /promotions', () => {
    vi.useRealTimers()
    renderFrame()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /push notification \(info\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /^notifications$/i }))
    fireEvent.click(screen.getByRole('button', { name: /click here to see our latest promotions/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/promotions')
  })
})

describe('IPhoneFrame — Low Balance adds to notification centre', () => {
  beforeEach(() => { vi.useFakeTimers(); mockNavigate.mockClear() })
  afterEach(() => vi.useRealTimers())

  test('Low Balance button adds 1 to notification centre unread count', () => {
    renderFrame()
    act(() => { fireEvent.click(screen.getByRole('button', { name: /toggle controls/i })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /push notification \(low balance\)/i })) })
    expect(screen.getByTestId('notif-count').textContent).toBe('1')
  })

  test('Low Balance notification centre message shows low balance text', async () => {
    vi.useRealTimers()
    renderFrame()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /push notification \(low balance\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /^notifications$/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent(/you have a low balance/i)
  })
})

describe('IPhoneFrame — dynamic island controls Promotions nav visibility', () => {
  test('Promotions nav item hidden by default', () => {
    renderFrame()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.queryByRole('button', { name: /^promotions$/i })).not.toBeInTheDocument()
  })

  test('Promotions nav item appears when controls are shown', () => {
    renderFrame()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /^promotions$/i })).toBeInTheDocument()
  })

  test('Promotions nav item hidden again when controls are toggled off', () => {
    renderFrame()
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /toggle controls/i }))
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.queryByRole('button', { name: /^promotions$/i })).not.toBeInTheDocument()
  })
})
