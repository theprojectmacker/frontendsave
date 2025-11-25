// Backend API URL
// In development: uses Vite proxy (relative path)
// In production: uses absolute URL from env variable
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api')

// Store token in localStorage
export const setAuthToken = (accessToken, refreshToken, email, userId) => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('userEmail', email)
  localStorage.setItem('userId', userId)
}

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userId')
}

// Get headers with auth token
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return headers
}

// Handle API response errors
const handleApiError = async (response) => {
  if (response.status === 401) {
    // Unauthorized - token expired or invalid
    clearAuth()
    window.location.href = '/login'
    throw new Error('Session expired. Please login again.')
  }
  return response
}

// Wrapper for fetch with error handling
const fetchWithErrorHandling = async (url, options = {}) => {
  const response = await fetch(url, options)
  await handleApiError(response)
  return response
}

// Auth API calls
export const authAPI = {
  adminLogin: async (email, password) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        setAuthToken(
          data.tokens.accessToken,
          data.tokens.refreshToken,
          data.user.email,
          data.user.id
        )
      }
      return data
    } catch (error) {
      console.error('Admin login error:', error)
      throw error
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        setAuthToken(
          data.tokens.accessToken,
          data.tokens.refreshToken,
          data.user.email,
          data.user.id
        )
      }
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      await fetchWithErrorHandling(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({}),
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  },

  verify: async () => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Verify error:', error)
      throw error
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ refreshToken }),
      })
      const data = await response.json()
      if (data.success && data.tokens) {
        setAuthToken(
          data.tokens.accessToken,
          data.tokens.refreshToken,
          localStorage.getItem('userEmail'),
          localStorage.getItem('userId')
        )
      }
      return data
    } catch (error) {
      console.error('Refresh error:', error)
      throw error
    }
  },

  updateStatus: async () => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/update-status`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({}),
      })
      return response.json()
    } catch (error) {
      console.error('Update status error:', error)
      throw error
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/current-user`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  },

  makeAdmin: async (userId) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/make-admin/${userId}`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({}),
      })
      return response.json()
    } catch (error) {
      console.error('Make admin error:', error)
      throw error
    }
  },

  removeAdmin: async (userId) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/auth/remove-admin/${userId}`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({}),
      })
      return response.json()
    } catch (error) {
      console.error('Remove admin error:', error)
      throw error
    }
  },
}

// Jobs API calls
export const jobsAPI = {
  createJob: async (jobData) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(jobData),
      })
      return response.json()
    } catch (error) {
      console.error('Create job error:', error)
      throw error
    }
  },

  getAllJobs: async () => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs`, {
        method: 'GET',
        headers: getHeaders(false),
      })
      return response.json()
    } catch (error) {
      console.error('Get all jobs error:', error)
      throw error
    }
  },

  getAdminJobs: async () => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs/admin/all`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Get admin jobs error:', error)
      throw error
    }
  },

  getJobDetails: async (jobId, userId = null) => {
    try {
      const headers = getHeaders(false)
      if (userId) {
        headers['X-User-Id'] = userId
      }
      const response = await fetchWithErrorHandling(`${API_URL}/jobs/${jobId}`, {
        method: 'GET',
        headers,
      })
      return response.json()
    } catch (error) {
      console.error('Get job details error:', error)
      throw error
    }
  },

  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(applicationData),
      })
      return response.json()
    } catch (error) {
      console.error('Apply for job error:', error)
      throw error
    }
  },

  getJobApplications: async (jobId) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs/${jobId}/applications`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Get job applications error:', error)
      throw error
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(jobData),
      })
      return response.json()
    } catch (error) {
      console.error('Update job error:', error)
      throw error
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        body: JSON.stringify({}),
      })
      return response.json()
    } catch (error) {
      console.error('Delete job error:', error)
      throw error
    }
  },

  getJobAnalytics: async (jobId) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/jobs/${jobId}/analytics`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Get job analytics error:', error)
      throw error
    }
  },
}

// Dashboard API calls
export const dashboardAPI = {
  getUsers: async () => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/dashboard/users`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  },

  getStats: async () => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/dashboard/stats`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Get stats error:', error)
      throw error
    }
  },

  getUserStats: async (userId) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/dashboard/user-stats/${userId}`, {
        method: 'GET',
        headers: getHeaders(true),
      })
      return response.json()
    } catch (error) {
      console.error('Get user stats error:', error)
      throw error
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetchWithErrorHandling(`${API_URL}/dashboard/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        body: JSON.stringify({}),
      })
      return response.json()
    } catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  },
}
