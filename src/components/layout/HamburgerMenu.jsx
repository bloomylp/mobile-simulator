// src/components/layout/HamburgerMenu.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Home, CreditCard, Tag, Percent, User, LogOut, LifeBuoy } from 'lucide-react'
import { useLang } from '../../context/LangContext.jsx'
import { useFrame } from '../../context/FrameContext.jsx'
import { useConcession } from '../../context/ConcessionContext.jsx'
import { useNotifications } from '../../context/NotificationsContext.jsx'
import { resetCardsStore } from '../../utils/cardsStore.js'

const BASE_ITEMS = [
  { key: 'home',       icon: Home,       path: '/home'       },
  { key: 'cards',      icon: CreditCard, path: '/cards'      },
  { key: 'concession', icon: Percent,    path: '/concession'  },
  { key: 'profile',    icon: User,       path: '/profile'     },
]

const PROMOTIONS_ITEM = { key: 'promotions', icon: Tag, path: '/promotions' }

export function HamburgerMenu({ light = false }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useLang()
  const { showControls } = useFrame()
  const { resetConcession } = useConcession()
  const { resetNotifications } = useNotifications()

  const items = showControls
    ? [...BASE_ITEMS.slice(0, 3), PROMOTIONS_ITEM, BASE_ITEMS[3]]
    : BASE_ITEMS

  const iconColor = light ? 'text-white/80 hover:text-white hover:bg-white/15 focus-visible:ring-white'
                          : 'text-[#6B7280] hover:text-[#2DB87E] hover:bg-[#E8F7F0] focus-visible:ring-[#2DB87E]'

  function handleNav(path) {
    setOpen(false)
    navigate(path)
  }

  function handleLogout() {
    setOpen(false)
    resetConcession()
    resetCardsStore()
    resetNotifications()
    sessionStorage.clear()
    navigate('/login')
  }

  return (
    <>
      {/* ── Hamburger trigger ── */}
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 ${iconColor}`}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {open && (
        <>
          {/* ── Backdrop ── */}
          <div
            data-testid="menu-backdrop"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-black/40"
            aria-hidden="true"
          />

          {/* ── Slide-in panel ── */}
          <div
            role="dialog"
            aria-label="Navigation menu"
            aria-modal="true"
            className="fixed top-0 left-0 bottom-0 z-[100] w-64 bg-white shadow-2xl flex flex-col"
            style={{ animation: 'menu-slide-in 0.28s cubic-bezier(0.32,0.72,0,1)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-12 pb-6 border-b border-gray-100">
              <span className="text-[#1A1F2E] text-base font-bold">
                little<span className="text-[#2DB87E]">pay</span>
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-[#6B7280] hover:text-[#1A1F2E] hover:bg-[#F4F6F8] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col px-3 pt-4 gap-1" aria-label="Main navigation">
              {items.map(({ key, icon: Icon, path }) => {
                const active = pathname === path
                return (
                  <button
                    key={path}
                    aria-label={t[key]}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => handleNav(path)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] ${
                      active
                        ? 'bg-[#E8F7F0] text-[#2DB87E]'
                        : 'text-[#6B7280] hover:bg-[#F4F6F8] hover:text-[#1A1F2E]'
                    }`}
                  >
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.75} aria-hidden="true" />
                    {t[key]}
                  </button>
                )
              })}
            </nav>

            {/* Help Centre + Logout — below separator */}
            <hr className="mx-3 border-gray-100 my-2" />
            <div className="px-3 pb-4 flex flex-col gap-1">
              <button
                aria-label={t.helpCentre}
                onClick={() => handleNav('/help-centre')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] ${
                  pathname === '/help-centre'
                    ? 'bg-[#E8F7F0] text-[#2DB87E]'
                    : 'text-[#6B7280] hover:bg-[#F4F6F8] hover:text-[#1A1F2E]'
                }`}
              >
                <LifeBuoy size={20} strokeWidth={1.75} aria-hidden="true" />
                {t.helpCentre}
              </button>
              <button
                aria-label="Log out"
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium cursor-pointer text-[#6B7280] hover:bg-[#F4F6F8] hover:text-[#1A1F2E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E]"
              >
                <LogOut size={20} strokeWidth={1.75} aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
