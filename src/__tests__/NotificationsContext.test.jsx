import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationsProvider, useNotifications } from '../context/NotificationsContext'

function TestConsumer() {
  const { notifications, unreadCount, addNotification, clearUnread, resetNotifications } = useNotifications()
  return (
    <div>
      <span data-testid="count">{unreadCount}</span>
      <span data-testid="length">{notifications.length}</span>
      {notifications.map((n) => (
        <div key={n.id} data-testid="notif-item">{n.message}</div>
      ))}
      <button onClick={() => addNotification('Test message', '/home')}>add</button>
      <button onClick={clearUnread}>clear</button>
      <button onClick={resetNotifications}>reset</button>
    </div>
  )
}

function renderProvider() {
  return render(
    <NotificationsProvider>
      <TestConsumer />
    </NotificationsProvider>
  )
}

describe('NotificationsContext — initial state', () => {
  test('starts with zero notifications', () => {
    renderProvider()
    expect(screen.getByTestId('length').textContent).toBe('0')
  })

  test('starts with zero unread count', () => {
    renderProvider()
    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})

describe('NotificationsContext — addNotification', () => {
  test('adds a notification to the list', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getAllByTestId('notif-item')).toHaveLength(1)
  })

  test('added notification contains the correct message', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByTestId('notif-item').textContent).toBe('Test message')
  })

  test('increments unread count by 1 per call', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  test('accumulates unread count across multiple calls', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByTestId('count').textContent).toBe('3')
  })

  test('accumulates all notifications in the list', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getAllByTestId('notif-item')).toHaveLength(2)
  })
})

describe('NotificationsContext — clearUnread', () => {
  test('resets unread count to 0', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'clear' }))
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  test('does not remove notifications from the list', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'clear' }))
    expect(screen.getAllByTestId('notif-item')).toHaveLength(1)
  })
})

describe('NotificationsContext — resetNotifications', () => {
  test('clears all notifications', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'reset' }))
    expect(screen.queryAllByTestId('notif-item')).toHaveLength(0)
  })

  test('resets unread count to 0', async () => {
    const user = userEvent.setup()
    renderProvider()
    await user.click(screen.getByRole('button', { name: 'add' }))
    await user.click(screen.getByRole('button', { name: 'reset' }))
    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})
