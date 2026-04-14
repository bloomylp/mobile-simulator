// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './utils/auth.js'
import { SplashPage }        from './pages/SplashPage.jsx'
import { LoginPage }         from './pages/LoginPage.jsx'

// Placeholder pages — will be replaced in later tasks
function PlaceholderPage({ name }) {
  return (
    <div className="min-h-dvh bg-[#F4F6F8] flex items-center justify-center">
      <p className="text-[#6B7280] text-sm">{name} — coming soon</p>
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
        <Route path="/cards"          element={<RequireAuth><PlaceholderPage name="Cards" /></RequireAuth>} />
        <Route path="/home"           element={<RequireAuth><PlaceholderPage name="Home" /></RequireAuth>} />
        <Route path="/order-complete" element={<RequireAuth><PlaceholderPage name="Order Complete" /></RequireAuth>} />
        <Route path="/profile"        element={<RequireAuth><PlaceholderPage name="Profile" /></RequireAuth>} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
