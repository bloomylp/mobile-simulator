// src/components/layout/BottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { CreditCard, Home, User } from 'lucide-react'

const tabs = [
  { label: 'Cards', icon: CreditCard, path: '/cards' },
  { label: 'Home',  icon: Home,       path: '/home'  },
  { label: 'Profile', icon: User,     path: '/profile' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 z-40"
      aria-label="Main navigation"
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] ${
              active ? 'text-[#2DB87E]' : 'text-[#6B7280]'
            }`}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.75}
              aria-hidden="true"
            />
            <span className={`text-xs font-medium ${active ? 'text-[#2DB87E]' : 'text-[#6B7280]'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
