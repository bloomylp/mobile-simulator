// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './utils/auth.js'
import { LangProvider } from './context/LangContext.jsx'
import { IPhoneFrame } from './components/layout/IPhoneFrame.jsx'
import { LoginPage }         from './pages/LoginPage.jsx'
import { CardsPage }         from './pages/CardsPage.jsx'
import { HomePage }          from './pages/HomePage.jsx'
import { OrderCompletePage } from './pages/OrderCompletePage.jsx'
import { ProfilePage }       from './pages/ProfilePage.jsx'

function RequireAuth({ children }) {
  const location = useLocation()
  return isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <IPhoneFrame>
          <Routes>
            <Route path="/"               element={<Navigate to="/login" replace />} />
            <Route path="/login"          element={<LoginPage />} />
            <Route path="/cards"          element={<RequireAuth><CardsPage /></RequireAuth>} />
            <Route path="/home"           element={<RequireAuth><HomePage /></RequireAuth>} />
            <Route path="/order-complete" element={<RequireAuth><OrderCompletePage /></RequireAuth>} />
            <Route path="/profile"        element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </IPhoneFrame>
      </BrowserRouter>
    </LangProvider>
  )
}
