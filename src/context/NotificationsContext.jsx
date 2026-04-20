// src/context/NotificationsContext.jsx
import { createContext, useContext, useState } from 'react'

export const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  function addNotification(message, destination, type) {
    const notif = { id: Date.now() + Math.random(), message, destination, type }
    setNotifications((prev) => [notif, ...prev])
    setUnreadCount((n) => n + 1)
  }

  function clearUnread() {
    setUnreadCount(0)
  }

  function resetNotifications() {
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, clearUnread, resetNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}
