import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'
import axios from 'axios'

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
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      })

      const xsrf = decodeURIComponent(
        document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1]
      )

      await api.post('/login', { email, password }, {
        headers: { 'X-XSRF-TOKEN': xsrf },
        withCredentials: true,
      })

      const res = await api.get('/user', { withCredentials: true })
      setUser(res.data)

      navigate('/')
      onClose()
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
        </button>

        {/* Header con icono y gradiente */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🐾</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenido
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Accede a tu cuenta de <span className="text-blue-600 font-semibold">PetHosting</span>
          </p>
        </div>

        {/* Botón de Google mejorado */}
        <button
          className="w-full border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center gap-3 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
          onClick={() => alert('Integración con Google pendiente')}
        >
          <div className="w-5 h-5 group-hover:scale-110 transition-transform duration-200">
            <img src="https://www.svgrepo.com/show/512317/google.svg" alt="Google" className="w-full h-full" />
          </div>
          <span className="font-medium text-gray-700">Continuar con Google</span>
        </button>

        {/* Divisor elegante */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">o accede con tu email</span>
          </div>
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
