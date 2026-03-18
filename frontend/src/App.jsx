// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { isLoggedIn } from './lib/auth'
import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Signup    from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { ToastProvider } from './hooks/useToast'

function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/dashboard/*" element={
          <Protected><Dashboard /></Protected>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}
