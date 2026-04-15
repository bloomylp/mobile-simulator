// src/pages/ProfilePage.jsx
import { useNavigate } from 'react-router-dom'
import { Languages, Info, LogOut, MessageCircle, BadgePercent } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell.jsx'
import { LangToggle } from '../components/ui/LangToggle.jsx'
import { logout } from '../utils/auth.js'
import { useLang } from '../context/LangContext.jsx'

const USER = {
  name: 'John Rotterwood',
  email: 'johnrotterwood@email.com',
  initials: 'JR',
  accountCreated: '12/3/2026 12:02:32',
}

function MenuItem({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-4 text-sm font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] transition-colors duration-150 min-h-[44px] ${
        danger ? 'text-[#DC2626] hover:text-[#B91C1C]' : 'text-[#1A1F2E] hover:text-[#2DB87E]'
      }`}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      {label}
    </button>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { t } = useLang()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  function handleReset() {
    sessionStorage.clear()
    navigate('/login', { replace: true })
  }

  return (
    <PageShell className="pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-[#1A1F2E] text-lg font-bold">{t.profile}</h1>
        <LangToggle />
      </div>

      {/* User card */}
      <div className="mx-5 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center gap-2">
        {/* Avatar */}
        <button
          onClick={handleReset}
          className="w-20 h-20 rounded-full bg-[#E8F7F0] border-2 border-[#2DB87E] flex items-center justify-center mb-1 cursor-pointer focus:outline-none"
          aria-label="Reset demo"
          tabIndex={-1}
        >
          <span className="text-[#1A7A50] text-2xl font-bold">{USER.initials}</span>
        </button>

        <p className="text-[#1A1F2E] text-base font-bold">{USER.name}</p>
        <p className="text-[#6B7280] text-sm">{USER.email}</p>

        <hr className="w-full border-gray-100 my-2" />

        <p className="text-[#6B7280] text-xs">Account Created: {USER.accountCreated}</p>
      </div>

      {/* Menu */}
      <div className="mx-5 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
        <MenuItem icon={BadgePercent} label="Enrol for Concession" onClick={() => {}} />
        <MenuItem icon={Languages} label={t.language} onClick={() => {}} />
        <MenuItem icon={Info} label={t.privacyPolicy} onClick={() => {}} />
        <MenuItem icon={LogOut} label={t.logOut} onClick={handleLogout} danger />
      </div>

      {/* Feedback card */}
      <div className="mx-5 mt-4">
        <button
          onClick={() => {}}
          className="flex items-center gap-4 w-full bg-white rounded-2xl shadow-sm px-4 py-4 cursor-pointer hover:shadow-md transition-shadow duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DB87E] min-h-[72px]"
          aria-label="Leave us feedback"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E8F7F0] flex items-center justify-center flex-shrink-0">
            <MessageCircle size={22} className="text-[#2DB87E]" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="text-left">
            <p className="text-[#6B7280] text-xs">{t.leaveUs}</p>
            <p className="text-[#1A1F2E] text-sm font-semibold">{t.feedback}</p>
          </div>
        </button>
      </div>

    </PageShell>
  )
}
