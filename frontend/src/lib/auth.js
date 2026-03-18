// src/lib/auth.js
// Helpers for reading/writing auth state in localStorage

export const getToken = () => localStorage.getItem('token')
export const getUser  = () => JSON.parse(localStorage.getItem('user') || '{}')
export const isLoggedIn = () => !!getToken()

export const saveAuth = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuth = () => localStorage.clear()
