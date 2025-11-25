import { Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ isAuthenticated, isLoading, children }) {
  if (isLoading) {
    return <LoadingSpinner message="Verifying credentials..." fullScreen={true} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
