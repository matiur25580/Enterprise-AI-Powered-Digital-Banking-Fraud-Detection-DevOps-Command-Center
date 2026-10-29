import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'
import Success from './pages/auth/Success.tsx'
import Admin from './pages/Admin.tsx'
import Customer from './pages/Customer.tsx'
import RiskManager from './pages/RiskManager.tsx'
import SupportAgent from './pages/SupportAgent.tsx'
import Kyc from './pages/bank/Kyc.tsx'
import Disputes from './pages/bank/Disputes.tsx'
import Scheduled from './pages/bank/Scheduled.tsx'
import Staff from './pages/bank/Staff.tsx'
import TwoFA from './pages/bank/TwoFA.tsx'
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/riskmanager" element={<RiskManager />} />
        <Route path="/supportagent" element={<SupportAgent />} />
        <Route path="/kyc" element={<Kyc />} />
        <Route path="/disputes" element={<Disputes />} />
        <Route path="/scheduled" element={<Scheduled />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/2fa" element={<TwoFA />} />
      </Routes>
    </BrowserRouter>
  )
}
