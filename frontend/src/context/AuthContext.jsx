import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true hasta comprobar sesión

  // Comprobar sesión activa al iniciar la app
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await api.get('/user')
        setUser(res.data)
      } catch {
        console.warn('No hay sesión activa')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verificarSesion()
  }, [])

  const logout = async () => {
    try {
      await api.post('/logout')
      setUser(null)
    } catch (err) {
      console.error('Error al cerrar sesión', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

