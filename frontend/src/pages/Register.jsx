import { useState } from 'react'
import api from '../lib/axios'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
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
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      // 1. Obtener la cookie CSRF
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      })

      // 2. Extraer el token CSRF desde las cookies
      const xsrf = decodeURIComponent(
        document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1]
      )

      // 3. Enviar el formulario con el token CSRF
      await api.post('/register', form, {
        headers: {
          'X-XSRF-TOKEN': xsrf,
        },
        withCredentials: true,
      })

      // 4. Obtener usuario autenticado y verificar sesión
      const userResponse = await api.get('/user', { withCredentials: true })

      if (userResponse.data && userResponse.data.id) {
        setUser(userResponse.data)
        setSuccess(true)
        navigate('/')
      } else {
        setError('No se pudo recuperar la sesión después del registro')
      }

    } catch (err) {
      console.error(err)
      setError('Error al registrar usuario')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Registro</h2>

        <input
          type="text"
          name="name"
          className="w-full border px-3 py-2 rounded"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="text"
          name="postal_code"
          className="w-full border px-3 py-2 rounded"
          placeholder="Código postal"
          value={form.postal_code}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">¡Registro exitoso!</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Registrarse
        </button>
      </form>
    </div>
  )
}