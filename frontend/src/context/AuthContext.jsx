import { createContext, useState, useEffect } from 'react'
import api from '../lib/axios'

const AuthContext = createContext()

export { AuthContext }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Comprobar token al iniciar la app
  useEffect(() => {
    const verificarToken = async () => {
      try {
        const storedToken = localStorage.getItem('auth-token')
        if (!storedToken) {
          setUser(null)
          setToken(null)
          setLoading(false)
          return
        }

        // Configurar header de autorización
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        setToken(storedToken)
        
        const res = await api.get('/user')
        setUser(res.data)      } catch {
        // Token inválido o expirado
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    verificarToken()
  }, [])
  const logout = async () => {
    try {
      const storedToken = localStorage.getItem('auth-token')
      if (storedToken) {
        await api.post('/logout')
      }    } catch {
      // Error al cerrar sesión
    } finally {
      // Limpiar siempre, incluso si falla la petición      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      setToken(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

