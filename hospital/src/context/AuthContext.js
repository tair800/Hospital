import React, { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const authStatus = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH)
    setIsAuthenticated(authStatus === 'true')
    setLoading(false)
  }, [])

  const login = () => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH)
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
