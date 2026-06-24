import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ai_ethics_token')
    if (token) {
      api.me()
        .then(u => setUser(u))
        .catch(() => localStorage.removeItem('ai_ethics_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { user: u, token } = await api.login({ email, password })
    localStorage.setItem('ai_ethics_token', token)
    setUser(u)
    return u
  }

  const register = async (email, password, name) => {
    const { user: u, token } = await api.register({ email, password, name })
    localStorage.setItem('ai_ethics_token', token)
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('ai_ethics_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
