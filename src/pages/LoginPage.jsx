// src/pages/LoginPage.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../utils/auth.js'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/home'

  function handleLogin() {
    login()
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-full relative flex flex-col">
      {/* Full-screen login image */}
      <img
        src="/login.png"
        alt="Welcome to Traveller Wallet"
        className="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />

      {/* Overlay buttons matching image layout */}
      <div className="absolute bottom-[117px] left-0 right-0 px-6 flex flex-col items-center">
        <button
          onClick={handleLogin}
          className="bg-white text-[#2DB87E] font-semibold text-sm rounded-full py-[12.5px] cursor-pointer active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ width: 'calc(100% - 50px)' }}
        >
          Proceed to Login
        </button>
      </div>
    </div>
  )
}
