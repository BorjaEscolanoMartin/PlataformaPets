import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useMyHost, useHostServicePrices } from '../hooks/useHosts'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'
import EmpresaFieldsSection from '../components/host-profile/EmpresaFieldsSection'
import ParticularFieldsSection from '../components/host-profile/ParticularFieldsSection'
import PreferencesSection from '../components/host-profile/PreferencesSection'
import ServicesSection from '../components/host-profile/ServicesSection'
import ServicePricesSection from '../components/host-profile/ServicePricesSection'

const EMPTY_HOST = {
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
  cif: '',
  fiscal_address: '',
  licenses: '',
  team_info: '',
}

const SERVICIOS_EMPRESA = [
  { key: 'veterinario',             label: 'Servicios veterinarios',       unidad: 'por_consulta' },
  { key: 'adiestrador',             label: 'Servicios de adiestramiento',  unidad: 'por_sesion' },
  { key: 'emergencias',             label: 'Atención de emergencias',      unidad: 'por_consulta' },
  { key: 'cirugia',                 label: 'Cirugías',                     unidad: 'por_intervencion' },
  { key: 'vacunacion',              label: 'Vacunación',                   unidad: 'por_vacuna' },
  { key: 'adiestramiento_basico',   label: 'Adiestramiento básico',        unidad: 'por_sesion' },
  { key: 'adiestramiento_avanzado', label: 'Adiestramiento avanzado',      unidad: 'por_sesion' },
  { key: 'modificacion_conducta',   label: 'Modificación de conducta',     unidad: 'por_sesion' },
]

const SERVICIOS_PARTICULAR = [
  { key: 'paseo',               label: 'Paseo',                unidad: 'por_hora' },
  { key: 'alojamiento',         label: 'Alojamiento',          unidad: 'por_noche' },
  { key: 'guarderia',           label: 'Guardería',            unidad: 'por_dia' },
  { key: 'cuidado_a_domicilio', label: 'Cuidado a domicilio',  unidad: 'por_dia' },
  { key: 'visitas_a_domicilio', label: 'Visitas a domicilio',  unidad: 'por_visita' },
]

export default function HostProfile() {
  const { user, setUser } = useAuth()
  const qc = useQueryClient()

  const { data: existingHost } = useMyHost()
  const { data: servicePrices } = useHostServicePrices(existingHost?.id)

  const [host, setHost] = useState(EMPTY_HOST)
  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [tamanos, setTamanos] = useState(user?.tamanos_aceptados || [])
  const [especies, setEspecies] = useState(user?.especie_preferida || [])
  const [servicios, setServicios] = useState(user?.servicios_ofrecidos || [])
  const [precios, setPrecios] = useState({})

  const isEmpresa = user?.role === 'empresa'
  const serviciosDisponibles = isEmpresa ? SERVICIOS_EMPRESA : SERVICIOS_PARTICULAR

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const locationRef = useRef(null)
  const fiscalAddressRef = useRef(null)

  useEffect(() => {
    if (!existingHost) return
    setHost({
      ...EMPTY_HOST,
      ...existingHost,
      name: existingHost.name || '',
      location: existingHost.location || '',
      description: existingHost.description || '',
      title: existingHost.title || '',
      phone: existingHost.phone || '',
      experience_years: existingHost.experience_years || '',
      experience_details: existingHost.experience_details || '',
      own_pets_description: existingHost.own_pets_description || '',
      cif: existingHost.cif || '',
      fiscal_address: existingHost.fiscal_address || '',
      licenses: existingHost.licenses || '',
      team_info: existingHost.team_info || '',
    })
  }, [existingHost])

  useEffect(() => {
    if (!Array.isArray(servicePrices)) return
    const preciosObj = {}
    servicePrices.forEach((precio) => {
      preciosObj[precio.service_type] = {
        price: precio.price,
        price_unit: precio.price_unit,
        description: precio.description,
      }
    })
    setPrecios(preciosObj)
  }, [servicePrices])

  useEffect(() => {
    if (user?.role === 'empresa') {
      setHost(prev => ({ ...prev, type: 'empresa' }))
    } else if (user?.role === 'cuidador') {
      setHost(prev => ({ ...prev, type: 'particular' }))
    }
  }, [user])

  useEffect(() => {
    loadGoogleMaps().then(() => {
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

      if (fiscalAddressRef.current && isEmpresa) {
        const fiscalAutocomplete = new window.google.maps.places.Autocomplete(fiscalAddressRef.current, {
          types: ['geocode'],
          componentRestrictions: { country: 'es' },
        })
        fiscalAutocomplete.addListener('place_changed', () => {
          const place = fiscalAutocomplete.getPlace()
          if (!place.geometry) return
          setHost(prev => ({ ...prev, fiscal_address: place.formatted_address }))
        })
      }
    }).catch(() => {})
  }, [user, isEmpresa])

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

      let hostResponse
      if (host?.id) {
        hostResponse = await api.post(`/hosts/${host.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        hostResponse = await api.post('/hosts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setHost(hostResponse.data)
      }

      await api.put('/user', {
        tamanos_aceptados: tamanos,
        especie_preferida: especies,
        servicios_ofrecidos: servicios,
      })

      const userResponse = await api.get('/user')
      setUser(userResponse.data)

      const preciosConfigurados = Object.entries(precios).filter(([, data]) => data.price && data.price > 0)
      const hostId = hostResponse.data.id || host?.id

      if (preciosConfigurados.length > 0 && hostId) {
        const preciosArray = preciosConfigurados.map(([service_type, data]) => ({
          service_type,
          price: parseFloat(data.price),
          price_unit: data.price_unit,
          description: data.description || '',
        }))
        await api.post(`/hosts/${hostId}/service-prices`, { prices: preciosArray })
      }

      qc.invalidateQueries({ queryKey: ['hosts'] })
      setSuccess('Perfil actualizado correctamente ✅')
    } catch {
      setError('Error al guardar los datos')
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-8 text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {isEmpresa ? 'Perfil de Empresa' : 'Perfil de Cuidador'}
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Completa tu perfil para empezar a recibir solicitudes
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 space-y-6">
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
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <span className={isEmpresa ? 'text-green-600' : 'text-blue-600'}>
                {isEmpresa ? '🏢' : '👤'}
              </span>
              {isEmpresa ? 'Tipo de empresa' : 'Tipo de cuidador'}
            </label>
            <select
              value={host.type}
              onChange={e => setHost({ ...host, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium bg-white"
            >
              {isEmpresa ? (
                <option value="empresa">Empresa</option>
              ) : (
                <>
                  <option value="particular">Particular</option>
                  <option value="empresa">Empresa</option>
                </>
              )}
            </select>
          </div>

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
          </div>

          {isEmpresa
            ? <EmpresaFieldsSection host={host} setHost={setHost} fiscalAddressRef={fiscalAddressRef} />
            : <ParticularFieldsSection host={host} setHost={setHost} />}

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
          </div>

          {!isEmpresa && (
            <PreferencesSection
              host={host}
              setHost={setHost}
              especies={especies}
              setEspecies={setEspecies}
              tamanos={tamanos}
              setTamanos={setTamanos}
            />
          )}

          <ServicesSection
            isEmpresa={isEmpresa}
            serviciosDisponibles={serviciosDisponibles}
            servicios={servicios}
            setServicios={setServicios}
          />

          <ServicePricesSection
            serviciosDisponibles={serviciosDisponibles}
            servicios={servicios}
            precios={precios}
            setPrecios={setPrecios}
          />

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 text-lg"
            >
              <span className="text-2xl">✨</span>
              {host?.id ? 'Actualizar perfil' : 'Crear perfil'}
            </button>
          </div>
        </form>

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
