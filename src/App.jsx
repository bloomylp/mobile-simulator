// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './utils/auth.js'
import { LangProvider } from './context/LangContext.jsx'
import { EnrolmentProvider } from './context/EnrolmentContext.jsx'
import { ConcessionProvider } from './context/ConcessionContext.jsx'
import { NotificationsProvider } from './context/NotificationsContext.jsx'
import { FrameProvider, useFrame } from './context/FrameContext.jsx'
import { IPhoneFrame } from './components/layout/IPhoneFrame.jsx'
import { AndroidFrame } from './components/layout/AndroidFrame.jsx'
import { AndroidHomeScreen } from './android/AndroidHomeScreen.jsx'
import { LoginPage }               from './pages/LoginPage.jsx'
import { CardsPage }               from './pages/CardsPage.jsx'
import { HomePage }                from './pages/HomePage.jsx'
import { OrderCompletePage }       from './pages/OrderCompletePage.jsx'
import { ProfilePage }             from './pages/ProfilePage.jsx'
import { EnrolmentIntroPage }      from './pages/enrolment/EnrolmentIntroPage.jsx'
import { EnrolmentStep1Page }      from './pages/enrolment/EnrolmentStep1Page.jsx'
import { EnrolmentStep2Page }      from './pages/enrolment/EnrolmentStep2Page.jsx'
import { EnrolmentStep3Page }      from './pages/enrolment/EnrolmentStep3Page.jsx'
import { EnrolmentStep4Page }      from './pages/enrolment/EnrolmentStep4Page.jsx'
import { EnrolmentCompletePage }   from './pages/enrolment/EnrolmentCompletePage.jsx'
import { ConcessionPage }          from './pages/ConcessionPage.jsx'
import { PromotionsPage }          from './pages/PromotionsPage.jsx'
import { WalletPage }              from './pages/WalletPage.jsx'
import { HelpCentrePage }          from './pages/HelpCentrePage.jsx'

function RequireAuth({ children }) {
  const location = useLocation()
  return isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />
}

function PlatformShell() {
  const { platform } = useFrame()
  if (platform === 'android') {
    return (
      <AndroidFrame>
        <AndroidHomeScreen />
      </AndroidFrame>
    )
  }
  return (
    <BrowserRouter>
      <IPhoneFrame>
        <Routes>
          <Route path="/"               element={<Navigate to="/login" replace />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/cards"          element={<RequireAuth><CardsPage /></RequireAuth>} />
          <Route path="/home"           element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/order-complete" element={<RequireAuth><OrderCompletePage /></RequireAuth>} />
          <Route path="/profile"        element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/concession"     element={<RequireAuth><ConcessionPage /></RequireAuth>} />
          <Route path="/promotions"     element={<RequireAuth><PromotionsPage /></RequireAuth>} />
          <Route path="/wallet"         element={<RequireAuth><WalletPage /></RequireAuth>} />
          <Route path="/help-centre"    element={<RequireAuth><HelpCentrePage /></RequireAuth>} />

          {/* Enrolment flow — wrapped in shared EnrolmentProvider */}
          <Route path="/enrolment/*" element={
            <RequireAuth>
              <EnrolmentProvider>
                <Routes>
                  <Route index             element={<EnrolmentIntroPage />} />
                  <Route path="step-1"     element={<EnrolmentStep1Page />} />
                  <Route path="step-2"     element={<EnrolmentStep2Page />} />
                  <Route path="step-3"     element={<EnrolmentStep3Page />} />
                  <Route path="step-4"     element={<EnrolmentStep4Page />} />
                  <Route path="complete"   element={<EnrolmentCompletePage />} />
                </Routes>
              </EnrolmentProvider>
            </RequireAuth>
          } />

          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </IPhoneFrame>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <LangProvider>
      <FrameProvider>
        <NotificationsProvider>
          <ConcessionProvider>
            <PlatformShell />
          </ConcessionProvider>
        </NotificationsProvider>
      </FrameProvider>
    </LangProvider>
  )
}
