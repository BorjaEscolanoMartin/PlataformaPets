import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await api.post('/login', { email, password })
      
      if (response.data.token) {
        // Guardar token y usuario
        localStorage.setItem('auth-token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Configurar header de autorización para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        
        setUser(response.data.user)

        // Redireccionar si había una ruta guardada
        const redirectPath = localStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin')
          navigate(redirectPath)
        } else {
          navigate('/')
        }
        
        onClose()
      }
    } catch (err) {
      console.error(err)
      setError('Credenciales incorrectas')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl border border-blue-100 relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        {/* Botón de cierre con animación */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all duration-200 flex items-center justify-center group"
        >
          <span className="transform group-hover:rotate-90 transition-transform duration-200">✕</span>
        </button>        {/* Header con icono y gradiente */}
        <div className="text-center space-y-3">
          <div className="w-24 h-24 mx-auto flex items-center justify-center">
            <img 
              src="/LogoWeb-sinfondo.png" 
              alt="Pet Hosting Logo" 
              className="w-24 h-24 object-contain"
              onError={(e) => {
                // Fallback al icono original si la imagen no se encuentra
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-2xl">🐾</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenido
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Accede a tu cuenta de <span className="text-blue-600 font-semibold">Pets</span>
          </p>
        </div>

        {/* Formulario mejorado */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input de email con icono */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">📧</span>
              </div>
            </div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input de contraseña con icono */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
            </div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error mejorado */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Botón de envío con loading */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        {/* Link de registro mejorado */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:text-purple-600 font-semibold hover:underline transition-colors duration-200"
              onClick={onSwitchToRegister}
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
