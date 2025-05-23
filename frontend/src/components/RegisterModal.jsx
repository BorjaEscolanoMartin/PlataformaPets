import { useState } from 'react'
import api from '../lib/axios'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cliente',
    postal_code: '',
  })

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      })

      const xsrf = decodeURIComponent(
        document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1]
      )

      await api.post('/register', form, {
        headers: { 'X-XSRF-TOKEN': xsrf },
        withCredentials: true,
      })

      const res = await api.get('/user', { withCredentials: true })

      if (res.data && res.data.id) {
        setUser(res.data)
        navigate('/')
        onClose()
      } else {
        setError('No se pudo recuperar la sesión después del registro')
      }
    } catch (err) {
      console.error(err)
      setError('Error al registrar usuario')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6 shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        <h2 className="text-2xl font-bold text-center">
          Crea tu cuenta en <span className="text-blue-600">PetHosting</span>
        </h2>
        <p className="text-sm text-center text-gray-500">
          Te damos la bienvenida al alojamiento de mascotas más confiable
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="w-full border rounded px-4 py-2"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full border rounded px-4 py-2"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full border rounded px-4 py-2"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="postal_code"
            placeholder="Código postal"
            className="w-full border rounded px-4 py-2"
            value={form.postal_code}
            onChange={handleChange}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={onSwitchToLogin}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  )
}