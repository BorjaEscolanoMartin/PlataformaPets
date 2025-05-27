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
    }  }, [user, location.pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-blue-100">
          {/* Animated loading icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">Verificando autenticación</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Comprobando tus credenciales de acceso...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/" />

  if (checkingHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-blue-100">
          {/* Animated loading icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">Verificando perfil de cuidador</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Comprobando si tienes acceso a esta sección...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (shouldRedirect) return <Navigate to="/mi-perfil-cuidador" />

  return children
}

