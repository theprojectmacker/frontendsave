import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { AuthProvider } from './context/AuthContext'

function AppRoutes() {
  const { isAuthenticated, isLoading, userEmail, isAdmin, logout } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated && !isLoading ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <AdminDashboard onLogout={logout} userEmail={userEmail} isAdmin={isAdmin} />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
