import { createContext, useState, useCallback, useEffect } from 'react'
import { authAPI } from '../utils/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('accessToken') !== null
  )
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem('userEmail') || ''
  )
  const [userId, setUserId] = useState(
    localStorage.getItem('userId') || ''
  )
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem('isAdmin') === 'true'
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Verify token on mount
  useEffect(() => {
    verifyAuth()
  }, [])

  const verifyAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      const response = await authAPI.verify()

      if (response.success) {
        setIsAuthenticated(true)
        setUserEmail(response.user.email)
        setIsAdmin(response.user.is_admin || false)
        localStorage.setItem('isAdmin', response.user.is_admin ? 'true' : 'false')
      } else {
        logout()
      }
    } catch (err) {
      console.error('Auth verification error:', err)
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginAdmin = useCallback(async (email, password) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.adminLogin(email, password)

      if (response.success && response.tokens && response.user) {
        setIsAuthenticated(true)
        setUserEmail(response.user.email)
        setUserId(response.user.id)
        setIsAdmin(response.user.is_admin || true)
        localStorage.setItem('userEmail', response.user.email)
        localStorage.setItem('userId', response.user.id)
        localStorage.setItem('isAdmin', 'true')
        return { success: true }
      } else {
        const errorMsg = response.error || 'Login failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = 'Connection error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.login(email, password)

      if (response.success && response.tokens && response.user) {
        setIsAuthenticated(true)
        setUserEmail(response.user.email)
        setUserId(response.user.id)
        setIsAdmin(response.user.is_admin || false)
        localStorage.setItem('userEmail', response.user.email)
        localStorage.setItem('userId', response.user.id)
        localStorage.setItem('isAdmin', response.user.is_admin ? 'true' : 'false')
        return { success: true }
      } else {
        const errorMsg = response.error || 'Login failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const errorMsg = 'Connection error. Please try again.'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsAuthenticated(false)
      setUserEmail('')
      setUserId('')
      setIsAdmin(false)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userId')
      localStorage.removeItem('isAdmin')
    }
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        logout()
        return false
      }

      const response = await authAPI.refreshToken(refreshToken)
      
      if (response.success && response.tokens) {
        localStorage.setItem('accessToken', response.tokens.accessToken)
        localStorage.setItem('refreshToken', response.tokens.refreshToken)
        return true
      } else {
        logout()
        return false
      }
    } catch (err) {
      console.error('Token refresh error:', err)
      logout()
      return false
    }
  }, [])

  const value = {
    isAuthenticated,
    isLoading,
    userEmail,
    userId,
    isAdmin,
    error,
    login,
    loginAdmin,
    logout,
    refreshToken,
    verifyAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
