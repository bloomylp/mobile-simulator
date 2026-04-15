// src/components/layout/BottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Home, User } from 'lucide-react'
import { useLang } from '../../context/LangContext.jsx'

const tabs = [
  { key: 'cards',   icon: CreditCard, path: '/cards'   },
  { key: 'home',    icon: Home,       path: '/home'    },
  { key: 'profile', icon: User,       path: '/profile' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useLang()

  return (
    <nav
      className="bg-white border-t border-gray-100 flex justify-around items-center h-16"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main navigation"
    >
      {tabs.map(({ key, icon: Icon, path }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] ${
              active ? 'bg-[#2DB87E] text-white' : 'text-[#6B7280]'
            }`}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.75}
              fill={active ? 'rgba(255,255,255,0.2)' : 'none'}
              aria-hidden="true"
            />
            <span className={`text-xs font-medium ${active ? 'text-white' : 'text-[#6B7280]'}`}>
              {t[key]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
