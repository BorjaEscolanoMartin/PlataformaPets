import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/axios'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [checkingHost, setCheckingHost] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const checkHost = async () => {
      if (user?.role === 'cliente') {
        setCheckingHost(true)
        try {
          const res = await api.get('/hosts')
          const hasHost = res.data.length > 0

          // Solo redirigir si se intenta acceder a páginas que requieren perfil
          const rutasProtegidasPorPerfil = [
            '/mis-reservas',
            '/reservas-recibidas',
            '/mi-perfil-cuidador',
            // otras rutas si aplica
          ]

          const necesitaPerfil = rutasProtegidasPorPerfil.some(ruta =>
            location.pathname.startsWith(ruta)
          )

          if (!hasHost && necesitaPerfil) {
            setShouldRedirect(true)
          }
        } catch (e) {
          console.error('Error al comprobar si el usuario tiene perfil de cuidador:', e)
        } finally {
          setCheckingHost(false)
        }
      }
    }

    if (user) {
      checkHost()
    }
  }, [user, location.pathname])

  if (loading || checkingHost) return <p>Cargando autenticación...</p>

  if (!user) return <Navigate to="/login" />

  if (shouldRedirect) return <Navigate to="/mi-perfil-cuidador" />

  return children
}
