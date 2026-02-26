import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Login with Supabase
export const loginWithSupabase = async (email, password) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.user_metadata?.firstName || '',
      lastName: data.user.user_metadata?.lastName || '',
      ...data.user.user_metadata
    }
  }
}

// Register with Supabase
export const registerWithSupabase = async (userData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  }

  const { firstName, lastName, email, password } = userData

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.session) {
    throw new Error('Please check your email to verify your account')
  }

  return {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      firstName: data.user.user_metadata?.firstName || firstName,
      lastName: data.user.user_metadata?.lastName || lastName,
      ...data.user.user_metadata
    }
  }
}

// Logout with Supabase
export const logoutWithSupabase = async () => {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

// Get current session
export const getSupabaseSession = async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }

  return {
    token: session.access_token,
    user: {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.user_metadata?.firstName || '',
      lastName: session.user.user_metadata?.lastName || '',
      ...session.user.user_metadata
    }
  }
}

// Verify token with Supabase
export const verifySupabaseToken = async (token) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw new Error('Invalid token')
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
      ...user.user_metadata
    }
  }
}

// Request password reset
export const requestPasswordResetSupabase = async (email) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    success: true,
    message: 'Password reset email sent. Please check your inbox.'
  }
}

// Update password
export const updatePasswordSupabase = async (newPassword) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export default {
  loginWithSupabase,
  registerWithSupabase,
  logoutWithSupabase,
  getSupabaseSession,
  verifySupabaseToken,
  requestPasswordResetSupabase,
  updatePasswordSupabase
}
