// src/components/layout/BottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Home, User, Tag } from 'lucide-react'
import { useLang } from '../../context/LangContext.jsx'

const TABS = [
  { key: 'home',       icon: Home,       path: '/home'       },
  { key: 'cards',      icon: CreditCard, path: '/cards'      },
  { key: 'concession', icon: Tag,        path: '/concession' },
  { key: 'profile',    icon: User,       path: '/profile'    },
]


export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useLang()
  const tabs = TABS

  return (
    <nav
      className="bg-white border-t border-gray-100 flex items-center h-16"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main navigation"
    >
      {tabs.map(({ key, icon: Icon, path }) => {
        const active = pathname === path

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-label={t[key]}
            aria-current={active ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] h-full ${
              active ? 'text-[#2DB87E]' : 'text-[#6B7280]'
            }`}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.75}
              aria-hidden="true"
            />
            <span className="text-xs font-medium">
              {t[key]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
