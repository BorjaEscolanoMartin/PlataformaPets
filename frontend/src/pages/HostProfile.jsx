import { useEffect, useRef, useState } from 'react'
import api from '../lib/axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

export default function HostProfile() {
  const { user, setUser } = useAuth()
  
  const [host, setHost] = useState({
    name: '',
    type: 'particular',
    location: '',
    description: '',
    title: '',
    phone: '',
    experience_years: '',
    experience_details: '',
    has_own_pets: false,
    own_pets_description: '',
    // Campos específicos de empresas
    cif: '',
    fiscal_address: '',
    licenses: '',
    team_info: '',
  })

  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [tamanos, setTamanos] = useState([])
  const [especies, setEspecies] = useState([])
  const [servicios, setServicios] = useState([])
  
  // Estado para precios de servicios
  const [precios, setPrecios] = useState({})
  
  // Servicios disponibles según el tipo de usuario
  const serviciosDisponibles = user?.role === 'empresa' ? [
    { key: 'veterinario', label: 'Servicios veterinarios', unidad: 'por_consulta' },
    { key: 'adiestrador', label: 'Servicios de adiestramiento', unidad: 'por_sesion' },
    { key: 'emergencias', label: 'Atención de emergencias', unidad: 'por_consulta' },
    { key: 'cirugia', label: 'Cirugías', unidad: 'por_intervencion' },
    { key: 'vacunacion', label: 'Vacunación', unidad: 'por_vacuna' },
    { key: 'adiestramiento_basico', label: 'Adiestramiento básico', unidad: 'por_sesion' },
    { key: 'adiestramiento_avanzado', label: 'Adiestramiento avanzado', unidad: 'por_sesion' },
    { key: 'modificacion_conducta', label: 'Modificación de conducta', unidad: 'por_sesion' },  ] : [
    { key: 'paseo', label: 'Paseo', unidad: 'por_hora' },
    { key: 'alojamiento', label: 'Alojamiento', unidad: 'por_noche' },
    { key: 'guarderia', label: 'Guardería', unidad: 'por_dia' },
    { key: 'cuidado_a_domicilio', label: 'Cuidado a domicilio', unidad: 'por_dia' },
    { key: 'visitas_a_domicilio', label: 'Visitas a domicilio', unidad: 'por_visita' },
  ]

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const locationRef = useRef(null)
  const fiscalAddressRef = useRef(null)
  
  useEffect(() => {
    api.get('/hosts')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0 && res.data[0]?.id) {
          const hostData = res.data[0]          // Asegurar que todos los campos no sean null
          const cleanedHostData = {
            ...hostData,
            name: hostData.name || '',
            location: hostData.location || '',
            description: hostData.description || '',
            title: hostData.title || '',
            phone: hostData.phone || '',
            experience_years: hostData.experience_years || '',
            experience_details: hostData.experience_details || '',
            own_pets_description: hostData.own_pets_description || '',
            cif: hostData.cif || '',
            fiscal_address: hostData.fiscal_address || '',
            licenses: hostData.licenses || '',
            team_info: hostData.team_info || '',
          }
          setHost(cleanedHostData)
          
          // Cargar precios de servicios si el host existe
          if (hostData.id) {
            api.get(`/hosts/${hostData.id}/service-prices`)
              .then(pricesRes => {
                const preciosObj = {}
                pricesRes.data.forEach(precio => {
                  preciosObj[precio.service_type] = {
                    price: precio.price,
                    price_unit: precio.price_unit,
                    description: precio.description
                  }
                })
                setPrecios(preciosObj)
              })
              .catch(() => console.log('No hay precios configurados aún'))
          }
        }
      })

    api.get('/user')
      .then(res => {
        setTamanos(res.data.tamanos_aceptados || [])
        setEspecies(res.data.especie_preferida || [])
        setServicios(res.data.servicios_ofrecidos || [])
      })
      .catch(() => setError('Error al cargar tus datos'))
  }, [])

  // Efecto para sincronizar el tipo basado en el rol del usuario
  useEffect(() => {
    if (user?.role === 'empresa') {
      setHost(prev => ({ ...prev, type: 'empresa' }))
    } else if (user?.role === 'cuidador') {
      setHost(prev => ({ ...prev, type: 'particular' }))
    }
  }, [user])
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

      // Configurar autocompletado para dirección fiscal (solo para empresas)
      if (fiscalAddressRef.current && user?.role === 'empresa') {
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
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      Object.entries(host).forEach(([key, value]) => {
        if (key === 'profile_photo') return
        formData.append(key, value !== null && value !== undefined ? value : '')
      })

      formData.set('has_own_pets', host.has_own_pets ? 1 : 0)

      if (profilePhotoFile instanceof File) {
        formData.append('profile_photo', profilePhotoFile)
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      if (host?.id) {
        await api.post(`/hosts/${host.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/hosts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      await api.put('/user', {
        tamanos_aceptados: tamanos,
        especie_preferida: especies,
        servicios_ofrecidos: servicios,
      })

      const userResponse = await api.get('/user')
      setUser(userResponse.data)      // Actualizar precios de servicios si hay alguno configurado
      const preciosConfigurados = Object.entries(precios).filter(([, data]) => data.price && data.price > 0)
      
      if (preciosConfigurados.length > 0 && host?.id) {
        const preciosArray = preciosConfigurados.map(([service_type, data]) => ({
          service_type,
          price: parseFloat(data.price),
          price_unit: data.price_unit,
          description: data.description || ''
        }))

        await api.post(`/hosts/${host.id}/service-prices`, {
          prices: preciosArray
        })
      }

      setSuccess('Perfil actualizado correctamente ✅')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('Errores de validación:', err.response.data.errors)
      } else {
        console.error(err)
      }

      setError('Error al guardar los datos')
    }
  }
  const toggleArrayValue = (array, value) =>
    array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-8 text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {user?.role === 'empresa' ? 'Perfil de Empresa' : 'Perfil de Cuidador'}
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Completa tu perfil para empezar a recibir solicitudes
          </p>
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
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 space-y-6">          {/* Información básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-blue-600">✨</span>
                Título del perfil
              </label>
              <input
                type="text"
                placeholder="Ej: Cuidador profesional con 5 años de experiencia"
                value={host.title}
                onChange={e => setHost({ ...host, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-purple-600">👤</span>
                Nombre del perfil
              </label>
              <input
                type="text"
                placeholder="Tu nombre o nombre de la empresa"
                value={host.name}
                onChange={e => setHost({ ...host, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium"
              />
            </div>
          </div>          {/* Tipo de perfil */}
          {user?.role === 'empresa' ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-green-600">🏢</span>
                Tipo de empresa
              </label>
              <select
                value={host.type}
                onChange={e => setHost({ ...host, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
              >
                <option value="empresa">Empresa</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-blue-600">👤</span>
                Tipo de cuidador
              </label>
              <select
                value={host.type}
                onChange={e => setHost({ ...host, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
              >
                <option value="particular">Particular</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
          )}

          {/* Ubicación y contacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-green-600">📍</span>
                Ubicación
              </label>
              <input
                ref={locationRef}
                type="text"
                placeholder="Introduce tu ubicación"
                value={host.location}
                onChange={e => setHost({ ...host, location: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-blue-600">📱</span>
                Número de móvil
              </label>
              <input
                type="tel"
                placeholder="Ej: +34 123 456 789"
                value={host.phone}
                onChange={e => setHost({ ...host, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium"
              />
            </div>
          </div>          {/* Campos específicos según el tipo */}
          {user?.role === 'empresa' ? (
            // CAMPOS ESPECÍFICOS PARA EMPRESAS
            <>
              {/* Información de la empresa */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  🏢 Información de la empresa
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <span className="text-green-600">🆔</span>
                      CIF/NIF de la empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: B12345678"
                      value={host.cif}
                      onChange={e => setHost({ ...host, cif: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <span className="text-green-600">⭐</span>
                      Años en el mercado
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Años de actividad"
                      value={host.experience_years}
                      onChange={e => setHost({ ...host, experience_years: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <span className="text-green-600">🏠</span>
                    Dirección fiscal
                  </label>                  <input
                    ref={fiscalAddressRef}
                    type="text"
                    placeholder="Dirección completa de la empresa"
                    value={host.fiscal_address}
                    onChange={e => setHost({ ...host, fiscal_address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Licencias y certificaciones */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="text-blue-600">📜</span>
                  Licencias y certificaciones
                </label>
                <textarea
                  placeholder="Describe las licencias, seguros, certificaciones y acreditaciones de tu empresa..."
                  value={host.licenses}
                  onChange={e => setHost({ ...host, licenses: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
                />
              </div>

              {/* Descripción de servicios empresariales */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="text-indigo-600">💼</span>
                  Servicios profesionales
                </label>
                <textarea
                  placeholder="Describe los servicios profesionales de tu empresa, instalaciones, equipo, metodología..."
                  value={host.description}
                  onChange={e => setHost({ ...host, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
                />
              </div>

              {/* Equipo de trabajo */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="text-purple-600">👥</span>
                  Nuestro equipo
                </label>
                <textarea
                  placeholder="Describe tu equipo de trabajo, profesionales, veterinarios, experiencia del personal..."
                  value={host.team_info}
                  onChange={e => setHost({ ...host, team_info: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
                />
              </div>
            </>
          ) : (
            // CAMPOS ESPECÍFICOS PARA CUIDADORES PARTICULARES
            <>
              {/* Experiencia personal */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="text-orange-600">⭐</span>
                  Años de experiencia
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Número de años"
                  value={host.experience_years}
                  onChange={e => setHost({ ...host, experience_years: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 outline-none text-sm font-medium"
                />
              </div>

              {/* Descripción de experiencia personal */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="text-purple-600">📝</span>
                  Cuéntanos tu experiencia con mascotas
                </label>
                <textarea
                  placeholder="Describe tu experiencia personal cuidando mascotas, certificaciones, cursos realizados..."
                  value={host.experience_details}
                  onChange={e => setHost({ ...host, experience_details: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
                />
              </div>

              {/* Descripción personal del servicio */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span className="text-indigo-600">💬</span>
                  Descripción de tu servicio
                </label>
                <textarea
                  placeholder="Presenta tu servicio personal, horarios, metodología, qué hace especial tu cuidado..."
                  value={host.description}
                  onChange={e => setHost({ ...host, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
                />
              </div>
            </>
          )}{/* Foto de perfil */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-pink-600">📸</span>
              Foto de perfil
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors duration-300">
              <input
                type="file"
                accept="image/*"
                onChange={e => setProfilePhotoFile(e.target.files[0])}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">Sube una foto que transmita confianza</p>
            </div>
          </div>          {/* Mascotas propias - Solo para cuidadores particulares */}
          {user?.role !== 'empresa' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={host.has_own_pets}
                  onChange={e => setHost({ ...host, has_own_pets: e.target.checked })}
                  className="w-5 h-5 text-yellow-600 border-2 border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <span className="text-yellow-600">🐕</span>
                Tengo mascotas en casa
              </label>

              {host.has_own_pets && (
                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <span className="text-yellow-600">🏠</span>
                    Describe a tus mascotas
                  </label>
                  <textarea
                    placeholder="Cuéntanos sobre tus mascotas: raza, tamaño, temperamento, cómo se llevan con otros animales..."
                    value={host.own_pets_description}
                    onChange={e => setHost({ ...host, own_pets_description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 transition-all duration-200 outline-none text-sm font-medium resize-none"
                  />
                </div>
              )}
            </div>
          )}

        {/* Tipo de mascotas - Solo para cuidadores particulares */}
        {user?.role !== 'empresa' && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                🐾
              </div>
              ¿Qué tipo de mascota aceptas?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {['perro', 'gato'].map(especie => (
                <label key={especie} className="group cursor-pointer">
                  <div className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                    especies.includes(especie)
                      ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                  }`}>
                    <input
                      type="checkbox"
                      checked={especies.includes(especie)}
                      onChange={() =>
                        setEspecies(prev => toggleArrayValue(prev, especie))
                      }
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className={`ml-3 font-medium ${
                      especies.includes(especie) ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {especie.charAt(0).toUpperCase() + especie.slice(1)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tamaños - Solo para cuidadores particulares */}
        {user?.role !== 'empresa' && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                📏
              </div>
              ¿Qué tamaños aceptas?
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {['pequeño', 'mediano', 'grande', 'gigante'].map(t => (
                <label key={t} className="group cursor-pointer">
                  <div className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                    tamanos.includes(t)
                      ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-cyan-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}>
                    <input
                      type="checkbox"
                      checked={tamanos.includes(t)}
                      onChange={() =>
                        setTamanos(prev => toggleArrayValue(prev, t))
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className={`ml-3 font-medium ${
                      tamanos.includes(t) ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Servicios */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              {user?.role === 'empresa' ? '🏥' : '🏥'}
            </div>
            {user?.role === 'empresa' ? '¿Qué servicios profesionales ofreces?' : '¿Qué servicios ofreces?'}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {serviciosDisponibles.map(({ key, label }) => (
              <label key={key} className="group cursor-pointer">
                <div className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                  servicios.includes(key)
                    ? 'border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 shadow-md'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                }`}>
                  <input
                    type="checkbox"
                    checked={servicios.includes(key)}
                    onChange={() =>
                      setServicios(prev => toggleArrayValue(prev, key))
                    }
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className={`ml-3 font-medium ${
                    servicios.includes(key) ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>{/* Configuración de precios */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
              💰
            </div>
            Precios de tus servicios
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Configura los precios para los servicios que ofreces. Solo aparecerán en tu perfil los servicios que tengan precio configurado.
          </p>
          
          <div className="space-y-4">
            {serviciosDisponibles.map(({ key, label, unidad }) => {
              // Solo mostrar servicios que el usuario ha seleccionado como ofrecidos
              if (!servicios.includes(key)) return null;
              
              return (
                <div key={key} className="bg-white p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{label}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {unidad === 'por_hora' ? 'Por hora' :
                       unidad === 'por_noche' ? 'Por noche' :
                       unidad === 'por_dia' ? 'Por día' :
                       unidad === 'por_visita' ? 'Por visita' : unidad}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ej: 15.00"
                        value={precios[key]?.price || ''}
                        onChange={(e) => setPrecios(prev => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            price: e.target.value,
                            price_unit: unidad
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción adicional (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Incluye paseo de 1 hora"
                        value={precios[key]?.description || ''}
                        onChange={(e) => setPrecios(prev => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            description: e.target.value,
                            price_unit: unidad
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {servicios.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p>Primero selecciona los servicios que ofreces para configurar sus precios.</p>
              </div>
            )}
          </div>
        </div>

        {/* Botón de envío */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 text-lg"
            >
              <span className="text-2xl">✨</span>
              {host?.id ? 'Actualizar perfil' : 'Crear perfil'}
            </button>
          </div>
        </form>        {/* Enlace de navegación */}
          <div className="text-center pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-lg">🏠</span>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}