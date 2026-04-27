import { createContext, useContext, useState, useEffect } from 'react'
import adminApi from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { setLoading(false); return }
    adminApi.verify()
      .then(data => { if (data?.valid) setAdmin({ username: data.username }) })
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const data = await adminApi.login({ username, password })
    localStorage.setItem('admin_token', data.token)
    setAdmin({ username: data.username })
    return data
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
