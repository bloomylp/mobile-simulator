// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './utils/auth.js'
import { SplashPage }        from './pages/SplashPage.jsx'
import { LoginPage }         from './pages/LoginPage.jsx'
import { CardsPage }         from './pages/CardsPage.jsx'
import { HomePage }          from './pages/HomePage.jsx'
import { OrderCompletePage } from './pages/OrderCompletePage.jsx'

function ProfilePage() {
  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex items-center justify-center">
      <p className="text-[#6B7280] text-sm">Profile — coming soon</p>
    </div>
  )
}

function RequireAuth({ children }) {
  const location = useLocation()
  return isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<SplashPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/cards"          element={<RequireAuth><CardsPage /></RequireAuth>} />
        <Route path="/home"           element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/order-complete" element={<RequireAuth><OrderCompletePage /></RequireAuth>} />
        <Route path="/profile"        element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
