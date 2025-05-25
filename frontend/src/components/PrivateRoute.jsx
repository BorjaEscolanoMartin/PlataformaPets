import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/axios'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [checkingHost, setCheckingHost] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  console.log('🧪 PrivateRoute:', {
    user,
    pathname: location.pathname,
    loading,
    checkingHost,
    shouldRedirect
  })

  useEffect(() => {
    const checkHost = async () => {
      if (user?.role === 'cliente') {
        setCheckingHost(true)
        try {
          const res = await api.get('/hosts')
          const hasHost = res.data.length > 0

          const rutasProtegidasPorPerfil = [
            '/reservas-recibidas',
            '/mi-perfil-cuidador',
            // añade más si hace falta
          ]

          const necesitaPerfil = rutasProtegidasPorPerfil.some(ruta =>
            location.pathname.startsWith(ruta)
          )

          if (!hasHost && necesitaPerfil) {
            setShouldRedirect(true)
          }
        } catch (e) {
          console.error('Error al comprobar perfil de cuidador:', e)
        } finally {
          setCheckingHost(false)
        }
      }
    }

    if (user) {
      checkHost()
    }
  }, [user, location.pathname])

  if (loading) return <p>Cargando autenticación...</p>

  if (!user) return <Navigate to="/login" />

  if (checkingHost) return <p>Comprobando perfil de cuidador...</p>

  if (shouldRedirect) return <Navigate to="/mi-perfil-cuidador" />

  return children
}

