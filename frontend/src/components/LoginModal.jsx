import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'
import axios from 'axios'

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

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
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6 shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        <h2 className="text-2xl font-bold text-center">
          Bienvenido a <span className="text-blue-600">PetHosting</span>
        </h2>
        <p className="text-sm text-center text-gray-500">Gestión inteligente de alojamiento para mascotas</p>

        <button
          className="w-full border flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100"
          onClick={() => alert('Integración con Google pendiente')}
        >
          <img src="https://www.svgrepo.com/show/512317/google.svg" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>

        <div className="text-center text-gray-500 text-sm">o accede con tu email</div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border rounded px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border rounded px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={onSwitchToRegister}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  )
}
