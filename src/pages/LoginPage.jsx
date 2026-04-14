// src/pages/LoginPage.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'
import { login } from '../utils/auth.js'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/home'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  // Clean up pending redirect if component unmounts before timer fires
  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    timerRef.current = setTimeout(() => {
      login()
      setLoading(false)
      navigate(from, { replace: true })
    }, 800)
  }

  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1F2E]">
            little<span className="text-[#2DB87E]">pay</span>
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Sign in to your Traveller Wallet</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[#1A1F2E]">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-describedby={error ? 'login-error' : undefined}
              className="border border-gray-200 rounded-xl px-4 py-3 text-[#1A1F2E] text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow duration-150"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-[#1A1F2E]">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-describedby={error ? 'login-error' : undefined}
              className="border border-gray-200 rounded-xl px-4 py-3 text-[#1A1F2E] text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2DB87E] transition-shadow duration-150"
            />
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-[#DC2626] text-xs font-medium">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-1">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
