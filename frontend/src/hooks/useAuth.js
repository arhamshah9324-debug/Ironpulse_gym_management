// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { getUser, getToken, clearAuth, saveAuth } from '../lib/auth'
import api from '../lib/api'

export function useAuth() {
  const [user, setUser]       = useState(getUser)
  const [token, setToken]     = useState(getToken)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const login = async (email, password) => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      saveAuth(data.access_token, data.user)
      setToken(data.access_token)
      setUser(data.user)
      return data.user
    } catch (e) {
      setError(e.response?.data?.detail || 'Login failed')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password, role) => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/signup', { name, email, password, role })
      saveAuth(data.access_token, data.user)
      setToken(data.access_token)
      setUser(data.user)
      return data.user
    } catch (e) {
      setError(e.response?.data?.detail || 'Signup failed')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuth()
    setUser({})
    setToken(null)
  }

  return { user, token, loading, error, login, signup, logout, isLoggedIn: !!token }
}
