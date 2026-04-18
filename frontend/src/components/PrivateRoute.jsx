import { useAuth } from '../context/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/axios'

const ROUTES_REQUIRING_HOST_PROFILE = ['/reservas-recibidas']

function LoadingCard({ title, message, gradient }) {
  return (
    <div className="min-h-screen py-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-blue-100">
        <div className="relative mb-6">
          <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center`}>
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className={`absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r ${gradient} rounded-full opacity-20 animate-pulse`}></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [checkingHost, setCheckingHost] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const checkHost = async () => {
      if (user?.role !== 'cliente') return

      const necesitaPerfil = ROUTES_REQUIRING_HOST_PROFILE.some((ruta) =>
        location.pathname.startsWith(ruta)
      )
      if (!necesitaPerfil) return

      setCheckingHost(true)
      try {
        const res = await api.get('/hosts')
        if (res.data.length === 0) setShouldRedirect(true)
      } catch {
        // Error checking host profile
      } finally {
        setCheckingHost(false)
      }
    }

    if (user) checkHost()
  }, [user, location.pathname])

  if (loading) {
    return (
      <LoadingCard
        title="Verificando autenticación"
        message="Comprobando tus credenciales de acceso..."
        gradient="from-blue-600 to-purple-600"
      />
    )
  }

  if (!user) {
    if (location.pathname !== '/') {
      localStorage.setItem('redirectAfterLogin', location.pathname + location.search)
    }
    return <Navigate to="/" />
  }

  if (checkingHost) {
    return (
      <LoadingCard
        title="Verificando perfil de cuidador"
        message="Comprobando si tienes acceso a esta sección..."
        gradient="from-purple-600 to-pink-600"
      />
    )
  }

  if (shouldRedirect) return <Navigate to="/mi-perfil-cuidador" />

  return children
}
