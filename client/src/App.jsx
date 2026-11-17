import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'
import VerifyOtp from './pages/auth/VerifyOtp.tsx'
import Success from './pages/auth/Success.tsx'
import Admin from './pages/Admin.tsx'
import Customer from './pages/Customer.tsx'
import RiskManager from './pages/RiskManager.tsx'
import SupportAgent from './pages/SupportAgent.tsx'
import FeatureUnavailable from './components/FeatureUnavailable.tsx'

function ProtectedRoute({ children, roles }) {
  let user = {};
  try { user = JSON.parse(localStorage.getItem('trustshield_user') || '{}'); } catch (error) {}
  const token = localStorage.getItem('trustshield_token');
  if (!token || !user.role) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<ProtectedRoute roles={['Admin']}><Admin /></ProtectedRoute>} />
        <Route path="/customer" element={<ProtectedRoute roles={['Customer']}><Customer /></ProtectedRoute>} />
        <Route path="/riskmanager" element={<ProtectedRoute roles={['RiskManager']}><RiskManager /></ProtectedRoute>} />
        <Route path="/supportagent" element={<ProtectedRoute roles={['SupportAgent']}><SupportAgent /></ProtectedRoute>} />
        <Route path="/kyc" element={<ProtectedRoute roles={['Customer','Admin','RiskManager','SupportAgent']}><FeatureUnavailable /></ProtectedRoute>} />
        <Route path="/disputes" element={<ProtectedRoute roles={['Customer','Admin','SupportAgent']}><FeatureUnavailable /></ProtectedRoute>} />
        <Route path="/scheduled" element={<ProtectedRoute roles={['Customer','Admin']}><FeatureUnavailable /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute roles={['Admin']}><FeatureUnavailable /></ProtectedRoute>} />
        <Route path="/2fa" element={<ProtectedRoute roles={['Customer','Admin','RiskManager','SupportAgent']}><FeatureUnavailable /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
