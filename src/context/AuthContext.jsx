import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'
import * as supabaseAuthService from '../services/supabaseAuthService'
import { isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try Supabase session first if configured
        if (isSupabaseConfigured()) {
          const session = await supabaseAuthService.getSupabaseSession()
          if (session) {
            localStorage.setItem('authToken', session.token)
            setUser(session.user)
            setLoading(false)
            return
          }
        }
        
        // Fallback to local auth
        const token = localStorage.getItem('authToken')
        if (token) {
          const { user } = await authService.verifyToken(token)
          setUser(user)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  // Login function - Uses Supabase if configured, otherwise local auth
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true)
      setError(null)
      
      let token, user
      
      // Try Supabase login if configured
      if (isSupabaseConfigured()) {
        try {
          const result = await supabaseAuthService.loginWithSupabase(email, password)
          token = result.token
          user = result.user
        } catch (supabaseErr) {
          // If Supabase fails, fall back to local auth
          console.warn('Supabase login failed, falling back to local auth:', supabaseErr.message)
          const result = await authService.login(email, password, rememberMe)
          token = result.token
          user = result.user
        }
      } else {
        // Use local auth if Supabase not configured
        const result = await authService.login(email, password, rememberMe)
        token = result.token
        user = result.user
      }
      
      localStorage.setItem('authToken', token)
      setUser(user)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const { token, user } = await authService.register(userData)
      
      localStorage.setItem('authToken', token)
      setUser(user)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Logout from Supabase if configured
      if (isSupabaseConfigured()) {
        await supabaseAuthService.logoutWithSupabase()
      }
      
      // Also clear local auth
      await authService.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      const { user: updatedUser } = await authService.updateProfile(user.id, updates)
      setUser(updatedUser)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      setError(null)
      
      await authService.changePassword(user.id, currentPassword, newPassword)
      
      return { success: true, message: 'Password changed successfully' }
    } catch (err) {
      const errorMessage = err.message || 'Password change failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await authService.requestPasswordReset(email)
      
      return { success: true, message: result.message }
    } catch (err) {
      const errorMessage = err.message || 'Password reset request failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
