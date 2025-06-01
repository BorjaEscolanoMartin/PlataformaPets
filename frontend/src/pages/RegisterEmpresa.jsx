import { useEffect, useRef, useState } from 'react'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function RegisterEmpresa() {
  const [host, setHost] = useState({
    name: '',
    type: 'empresa',
    location: '',
    description: '',
    title: '',
    phone: '',
    // Campos específicos de empresas
    cif: '',
    fiscal_address: '',
    licenses: '',
    team_info: '',
  })

  const [profilePhotoFile, setProfilePhotoFile] = useState(null)

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const locationRef = useRef(null)
  const fiscalAddressRef = useRef(null)

  useEffect(() => {
    loadGoogleMaps().then(() => {
      // Configurar autocompletado para ubicación principal
      if (locationRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(locationRef.current, {
          types: ['geocode'],
          componentRestrictions: { country: 'es' },
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry) return

          setHost(prev => ({
            ...prev,
            location: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          }))
        })
      }

      // Configurar autocompletado para dirección fiscal
      if (fiscalAddressRef.current) {
        const fiscalAutocomplete = new window.google.maps.places.Autocomplete(fiscalAddressRef.current, {
          types: ['geocode'],
          componentRestrictions: { country: 'es' },
        })

        fiscalAutocomplete.addListener('place_changed', () => {
          const place = fiscalAutocomplete.getPlace()
          if (!place.geometry) return

          setHost(prev => ({
            ...prev,
            fiscal_address: place.formatted_address,
          }))
        })
      }
    }).catch(console.error)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      Object.entries(host).forEach(([key, value]) => {
        formData.append(key, value !== null && value !== undefined ? value : '')
      })

      if (profilePhotoFile instanceof File) {
        formData.append('profile_photo', profilePhotoFile)
      }

      await api.post('/hosts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const userResponse = await api.get('/user')
      setUser(userResponse.data)

      setSuccess('Perfil de empresa creado correctamente ✅')
      setTimeout(() => {
        navigate('/perfil-host')
      }, 2000)
    } catch (err) {
      console.error(err)
      setError('Error al registrar la empresa')
    }
  }
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header con título estilizado */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Registro de Empresa
              </h1>
              <p className="text-gray-600 text-sm font-medium pt-4">
                Únete como profesional y ofrece servicios veterinarios o de adiestramiento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {success && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <p className="text-green-700 font-semibold">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Formulario principal */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 space-y-6">
        
        {/* Información básica */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-blue-600">✨</span>
              Título del perfil
            </label>
            <input
              type="text"
              placeholder="Ej: Clínica veterinaria con 10 años de experiencia"
              value={host.title}
              onChange={e => setHost({ ...host, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-purple-600">🏢</span>
              Nombre de la empresa
            </label>
            <input
              type="text"
              placeholder="Nombre comercial de tu empresa"
              value={host.name}
              onChange={e => setHost({ ...host, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Ubicación y contacto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-green-600">📍</span>
              Dirección principal
            </label>
            <input
              ref={locationRef}
              type="text"
              placeholder="Dirección de tu establecimiento"
              value={host.location}
              onChange={e => setHost({ ...host, location: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-orange-600">📞</span>
              Número de contacto
            </label>
            <input
              type="tel"
              placeholder="Teléfono de contacto"
              value={host.phone}
              onChange={e => setHost({ ...host, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Campos específicos de empresas */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 space-y-6">
          <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <span className="text-xl">🏪</span>
            Información empresarial
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-blue-600">🆔</span>
                CIF / NIF de la empresa
              </label>
              <input
                type="text"
                placeholder="A12345678"
                value={host.cif}
                onChange={e => setHost({ ...host, cif: e.target.value })}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-indigo-600">🏛️</span>
                Dirección fiscal
              </label>
              <input
                ref={fiscalAddressRef}
                type="text"
                placeholder="Puede ser diferente a la principal"
                value={host.fiscal_address}
                onChange={e => setHost({ ...host, fiscal_address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-emerald-600">📜</span>
              Licencias y certificaciones
            </label>
            <textarea
              placeholder="Describe las licencias veterinarias, de adiestramiento canino, certificaciones profesionales, etc."
              value={host.licenses}
              onChange={e => setHost({ ...host, licenses: e.target.value })}
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 outline-none text-sm font-medium bg-white resize-vertical"
              rows="3"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-violet-600">👥</span>
              Información del equipo
            </label>
            <textarea
              placeholder="Número de veterinarios, adiestradores, especialidades del equipo, años de experiencia, etc."
              value={host.team_info}
              onChange={e => setHost({ ...host, team_info: e.target.value })}
              className="w-full px-4 py-3 border-2 border-violet-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all duration-200 outline-none text-sm font-medium bg-white resize-vertical"
              rows="3"
            />
          </div>
        </div>

        {/* Descripción de servicios */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-teal-600">📝</span>
            Descripción de servicios
          </label>
          <textarea
            placeholder="Describe los servicios que ofreces: consultas veterinarias, cirugías, adiestramiento básico/avanzado, etc."
            value={host.description}
            onChange={e => setHost({ ...host, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 outline-none text-sm font-medium resize-vertical"
            rows="4"
          />
        </div>

        {/* Logo/imagen */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-pink-600">🖼️</span>
            Logo o imagen principal de la empresa
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="text-3xl mb-2">📷</span>
                <p className="mb-2 text-sm text-gray-500 font-medium">
                  <span className="font-semibold">Haz clic para subir</span> tu logo
                </p>
                <p className="text-xs text-gray-400">PNG, JPG o JPEG (MAX. 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={e => setProfilePhotoFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          {profilePhotoFile && (
            <p className="text-sm text-green-600 font-medium flex items-center gap-2">
              <span>✅</span>
              Archivo seleccionado: {profilePhotoFile.name}
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 text-lg"
          >
            <span className="text-xl">🚀</span>
            Registrar empresa
          </button>
        </div>
      </form>
    </div>
  )
}
