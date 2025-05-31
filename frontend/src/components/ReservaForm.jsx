import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function ReservaForm({ hostId }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    pet_id: '',
    service_type: 'alojamiento',
    address: '',
    start_date: '',
    end_date: '',
    size: '',
  })
  const [mascotas, setMascotas] = useState([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  // const [latLng, setLatLng] = useState(null) // Para futuras funcionalidades
  const direccionRef = useRef(null)
  useEffect(() => {
    if (user) {
      api.get('/pets')
        .then(res => setMascotas(res.data))
        .catch(() => setError('Error cargando tus mascotas'))
    }
  }, [user])
  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!direccionRef.current) return

      const autocomplete = new window.google.maps.places.Autocomplete(direccionRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'es' },
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry) return

        // const lat = place.geometry.location.lat()
        // const lng = place.geometry.location.lng()

        setForm(prev => ({ ...prev, address: place.formatted_address }))
        // setLatLng({ lat, lng }) // Para futuras funcionalidades
      })
    }).catch(console.error)
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSuccess(false)
    setError(null)

    if (new Date(form.start_date) > new Date(form.end_date)) {
      setError('La fecha de entrada no puede ser posterior a la de salida.')
      return
    }    try {
      const reservationData = {
        ...form,
        host_id: hostId,
      }
      
      // No enviamos lat/lng al backend por ahora ya que no están en el modelo
      // Las coordenadas se guardan solo localmente para futuras funcionalidades

      await api.post('/reservations', reservationData)
      setSuccess(true)
      setForm(prev => ({ ...prev, start_date: '', end_date: '' })) // opcional: limpia fechas
    } catch (err) {
      console.error(err)
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(' '))
      } else {
        setError('No se pudo crear la reserva.')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Cargando información...</p>
      </div>
    )
  }
  if (!user) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl">👤</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Inicia sesión para continuar</h3>
        <p className="text-gray-600 mb-6">Para contactar con este cuidador necesitas tener una cuenta en nuestra plataforma.</p>
        <button
          onClick={() => {
            localStorage.setItem('redirectAfterLogin', location.pathname)
            navigate('/login')
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <span className="text-lg">🔐</span>
          Iniciar sesión
        </button>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-3">
          <span className="text-white text-xl">📋</span>
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Solicitar reserva
        </h2>
        <p className="text-gray-600 text-sm mt-2">Completa los datos para tu solicitud de cuidado</p>
      </div>

      {/* Mensajes de estado */}
      {success && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-green-800 font-semibold">¡Solicitud enviada!</p>
            <p className="text-green-700 text-sm">El cuidador recibirá tu solicitud y te contactará pronto</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-800 font-semibold">Error en la solicitud</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selección de mascota */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-purple-600">🐾</span>
            Selecciona tu mascota
          </label>
          <select 
            name="pet_id" 
            value={form.pet_id} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
            required
          >
            <option value="">¿Cuál de tus mascotas necesita cuidado?</option>
            {mascotas.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Tipo de servicio */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-blue-600">🏥</span>
            Tipo de servicio
          </label>          <select 
            name="service_type" 
            value={form.service_type} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
          >
            <option value="alojamiento">🏠 Alojamiento en casa del cuidador</option>
            <option value="domicilio">🏡 Cuidado en tu domicilio</option>
            <option value="visitas">🚪 Visitas a domicilio</option>
            <option value="guarderia">🌅 Guardería de día</option>
            <option value="paseo">🚶 Paseo de perros</option>
          </select>        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-orange-600">📍</span>
            Dirección del servicio
          </label>
          <input
            ref={direccionRef}
            type="text"
            name="address"
            placeholder="Introduce la dirección donde se realizará el servicio"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 outline-none text-sm font-medium"
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-blue-600">📅</span>
              Fecha inicio
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-purple-600">📅</span>
              Fecha fin
            </label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium"
              required
            />
          </div>
        </div>

        {/* Tamaño de mascota */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-indigo-600">📏</span>
            Tamaño de tu mascota
          </label>
          <select 
            name="size" 
            value={form.size} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
          >
            <option value="">Selecciona el tamaño</option>
            <option value="pequeño">🐕‍🦺 Pequeño (0-7 kg)</option>
            <option value="mediano">🐕 Mediano (7-18 kg)</option>
            <option value="grande">🐕‍🦮 Grande (18-45 kg)</option>
            <option value="gigante">🦮 Gigante (45+ kg)</option>
          </select>
        </div>

        {/* Botón de envío */}
        <div className="pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <span className="text-2xl">📨</span>
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  )
}