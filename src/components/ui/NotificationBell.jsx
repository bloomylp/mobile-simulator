// src/components/ui/NotificationBell.jsx
import { useState } from 'react'
import { Bell, X, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationsContext'

function NotifIcon({ type }) {
  if (type === 'low-balance') {
    return (
      <div
        data-testid="notif-icon-low-balance"
        style={{ width: 32, height: 32, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <Bell size={14} style={{ color: '#EF4444' }} aria-hidden="true" />
      </div>
    )
  }
  if (type === 'promotion') {
    return (
      <div
        data-testid="notif-icon-promotion"
        style={{ width: 32, height: 32, borderRadius: 10, background: '#E8F7F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <Tag size={14} style={{ color: '#2DB87E' }} aria-hidden="true" />
      </div>
    )
  }
  return (
    <div
      data-testid="notif-icon-default"
      style={{ width: 32, height: 32, borderRadius: 10, background: '#E8F7F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
    >
      <Bell size={14} style={{ color: '#2DB87E' }} aria-hidden="true" />
    </div>
  )
}

export function NotificationBell({ light = false }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { notifications, unreadCount, clearUnread } = useNotifications()

  function handleOpen() {
    setOpen((v) => !v)
    if (!open) clearUnread()
  }

  function handleNotifClick(destination) {
    setOpen(false)
    if (destination) navigate(destination)
  }

  return (
    <>
      <button
        aria-label="Notifications"
        aria-expanded={open}
        onClick={handleOpen}
        style={{ position: 'relative' }}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 ${
          light
            ? 'text-white/80 focus-visible:ring-white'
            : 'text-[#6B7280] hover:text-[#2DB87E] hover:bg-[#E8F7F0] focus-visible:ring-[#2DB87E]'
        }`}
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            data-testid="notif-badge"
            className="absolute top-0 right-0 min-w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center px-[3px] leading-none pointer-events-none"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Grey backdrop */}
          <div
            data-testid="notification-backdrop"
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          {/* Centred floating panel */}
          <div
            role="dialog"
            aria-label="Notifications"
            aria-modal="true"
            className="fixed inset-x-4 top-[88px] z-50 bg-white rounded-2xl shadow-xl max-w-sm mx-auto px-5 pb-6 pt-5"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#1A1F2E] text-base font-bold">Notifications</h2>
              <button
                aria-label="Close notifications"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-full text-[#6B7280] hover:text-[#1A1F2E] hover:bg-[#F4F6F8] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {notifications.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell size={32} className="text-[#D1D5DB]" aria-hidden="true" />
                <p className="text-[#6B7280] text-sm">No new notifications</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      aria-label={n.message}
                      onClick={() => handleNotifClick(n.destination)}
                      className="w-full text-left px-3 py-3 rounded-xl hover:bg-[#F4F6F8] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <NotifIcon type={n.type} />
                        </div>
                        <p className="text-[#1A1F2E] text-sm leading-snug flex-1">{n.message}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  )
}
