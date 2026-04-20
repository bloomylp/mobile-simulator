import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { NotificationsProvider, useNotifications } from '../context/NotificationsContext'
import { NotificationBell } from '../components/ui/NotificationBell'

// Helper: renders bell pre-loaded with N notifications
function renderBell(notifCount = 0, props = {}) {
  let addRef = null

  function Injector() {
    const { addNotification } = useNotifications()
    addRef = addNotification
    return null
  }

  const result = render(
    <MemoryRouter>
      <NotificationsProvider>
        <Injector />
        <NotificationBell {...props} />
      </NotificationsProvider>
    </MemoryRouter>
  )

  if (notifCount > 0) {
    act(() => {
      for (let i = 0; i < notifCount; i++) {
        addRef(`Notification ${i + 1}`, '/home')
      }
    })
  }

  return result
}

// Helper: renders bell with a single typed notification
function renderBellWithType(type) {
  let addRef = null

  function Injector() {
    const { addNotification } = useNotifications()
    addRef = addNotification
    return null
  }

  render(
    <MemoryRouter>
      <NotificationsProvider>
        <Injector />
        <NotificationBell />
      </NotificationsProvider>
    </MemoryRouter>
  )

  act(() => { addRef('Test message', '/home', type) })
}

describe('NotificationBell — toggle', () => {
  test('notification centre hidden on initial render', () => {
    renderBell()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('clicking bell shows notification centre', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('clicking bell again hides notification centre', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('NotificationBell — close button', () => {
  test('X close button renders inside dialog when open', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByRole('button', { name: /close notifications/i })).toBeInTheDocument()
  })

  test('clicking X closes the notification centre', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    await user.click(screen.getByRole('button', { name: /close notifications/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('NotificationBell — backdrop', () => {
  test('grey backdrop renders when notification centre is open', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByTestId('notification-backdrop')).toBeInTheDocument()
  })

  test('clicking backdrop closes the notification centre', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    await user.click(screen.getByTestId('notification-backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('NotificationBell — content', () => {
  test('notification centre has accessible heading', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByRole('heading', { name: /notifications/i })).toBeInTheDocument()
  })

  test('shows empty state when no notifications', async () => {
    const user = userEvent.setup()
    renderBell()
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByText(/no new notifications/i)).toBeInTheDocument()
  })
})

describe('NotificationBell — badge', () => {
  test('no badge when unread count is zero', () => {
    renderBell(0)
    expect(screen.queryByTestId('notif-badge')).not.toBeInTheDocument()
  })

  test('badge shows when there is 1 unread notification', () => {
    renderBell(1)
    expect(screen.getByTestId('notif-badge')).toBeInTheDocument()
  })

  test('badge displays the unread count', () => {
    renderBell(3)
    expect(screen.getByTestId('notif-badge').textContent).toBe('3')
  })

  test('badge disappears after opening the notification centre', async () => {
    const user = userEvent.setup()
    renderBell(2)
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.queryByTestId('notif-badge')).not.toBeInTheDocument()
  })
})

describe('NotificationBell — notification list', () => {
  test('shows notification messages in the panel', async () => {
    const user = userEvent.setup()
    renderBell(1)
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByText('Notification 1')).toBeInTheDocument()
  })

  test('shows all notification messages when multiple exist', async () => {
    const user = userEvent.setup()
    renderBell(2)
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByText('Notification 1')).toBeInTheDocument()
    expect(screen.getByText('Notification 2')).toBeInTheDocument()
  })

  test('does not show empty state when notifications exist', async () => {
    const user = userEvent.setup()
    renderBell(1)
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.queryByText(/no new notifications/i)).not.toBeInTheDocument()
  })

  test('each notification is a clickable button', async () => {
    const user = userEvent.setup()
    renderBell(1)
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByRole('button', { name: /notification 1/i })).toBeInTheDocument()
  })
})

describe('NotificationBell — unread cleared on open', () => {
  test('opening the panel clears the unread count', async () => {
    const user = userEvent.setup()
    renderBell(2)
    // badge visible before open
    expect(screen.getByTestId('notif-badge').textContent).toBe('2')
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.queryByTestId('notif-badge')).not.toBeInTheDocument()
  })
})

describe('NotificationBell — notification icon variants', () => {
  test('low-balance notification shows red icon', async () => {
    const user = userEvent.setup()
    renderBellWithType('low-balance')
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByTestId('notif-icon-low-balance')).toBeInTheDocument()
  })

  test('promotion notification shows promotion (tag) icon', async () => {
    const user = userEvent.setup()
    renderBellWithType('promotion')
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByTestId('notif-icon-promotion')).toBeInTheDocument()
  })

  test('default notification shows default bell icon', async () => {
    const user = userEvent.setup()
    renderBellWithType(undefined)
    await user.click(screen.getByRole('button', { name: /^notifications$/i }))
    expect(screen.getByTestId('notif-icon-default')).toBeInTheDocument()
  })
})
