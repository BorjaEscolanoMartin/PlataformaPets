import { useEffect, useState } from 'react'
import api from '../lib/axios'
import { Building2, MapPin, Phone, Users, Award, Briefcase } from 'lucide-react'

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [expandedLicenses, setExpandedLicenses] = useState({})

  useEffect(() => {
  const fetchEmpresas = async () => {
    try {
      setLoading(true)
      const res = await api.get('/empresas')
      setEmpresas(res.data)
      setLoading(false)    } catch {
      setError('Error al cargar las empresas registradas')
        setLoading(false)
      }
    }

    fetchEmpresas()
  }, [])

  const getServiceIcon = (serviceType) => {
    switch(serviceType?.toLowerCase()) {
      case 'veterinario':
      case 'consulta_veterinaria':
        return '🏥'
      case 'adiestrador':
      case 'adiestramiento_basico':
      case 'adiestramiento_avanzado':
        return '🎯'
      case 'emergencias':
        return '🚨'
      case 'cirugia':
        return '⚕️';
      case 'vacunacion':
        return '💉';
      case 'modificacion_conducta':
        return '🧠'
      default:
        return '🔧'
    }
  }

  const formatServiceType = (serviceType) => {
    const serviceMap = {
      'veterinario': 'Servicios Veterinarios',
      'adiestrador': 'Adiestramiento Canino',
      'emergencias': 'Emergencias 24h',
      'cirugia': 'Cirugía Veterinaria',
      'vacunacion': 'Vacunación',
      'consulta_veterinaria': 'Consulta Veterinaria',
      'adiestramiento_basico': 'Adiestramiento Básico',
      'adiestramiento_avanzado': 'Adiestramiento Avanzado',
      'modificacion_conducta': 'Modificación de Conducta'
    }
    return serviceMap[serviceType] || serviceType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Función para formatear número de teléfono español
  const formatPhoneNumber = (phone) => {
    if (!phone) return phone
    
    // Eliminar espacios y caracteres especiales
    const cleaned = phone.replace(/[\s\-()]/g, '')
    
    // Si es un móvil español (9 dígitos empezando por 6,7,8,9)
    if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
    
    // Si tiene prefijo +34
    if (cleaned.startsWith('34') && cleaned.length === 11) {
      const number = cleaned.slice(2)
      return `+34 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
    }
    
    return phone // Devolver original si no coincide con formato esperado
  }  // Función para formatear dirección
  const formatAddress = (address) => {
    if (!address) return { street: '', city: '', full: '' }
    
    // Lista de países a filtrar
    const countries = ['España', 'Spain', 'France', 'Francia', 'Portugal', 'Italy', 'Italia', 'Germany', 'Alemania']
    
    // Dividir por comas y limpiar espacios
    let parts = address.split(',').map(part => part.trim()).filter(part => part.length > 0)
    
    // Filtrar países de la lista
    parts = parts.filter(part => !countries.some(country => 
      part.toLowerCase() === country.toLowerCase()
    ))
    
    if (parts.length === 0) {
      return { street: '', city: '', full: '' }
    } else if (parts.length === 1) {
      // Solo una parte - podría ser solo la calle o solo la ciudad
      return {
        street: parts[0],
        city: '',
        full: parts[0]
      }
    } else if (parts.length === 2) {
      // Dos partes - generalmente calle y ciudad
      return {
        street: parts[0],
        city: parts[1],
        full: parts.join(', ')
      }
    } else if (parts.length >= 3) {
      // Tres o más partes - calle, ciudad, provincia, etc.
      return {
        street: parts[0],
        city: parts.slice(1).join(', '), // Todo después de la calle como ciudad/localidad
        full: parts.join(', ')
      }
    }
    
    return {
      street: address,
      city: '',
      full: address
    }
  }
  // Función para truncar descripción
  const formatDescription = (description, maxLength = 150) => {
    if (!description) return description
    
    if (description.length <= maxLength) {
      return description
    }
    
    // Truncar en la palabra más cercana
    const truncated = description.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...'
  }

  // Función para verificar si el texto necesita ser truncado
  const needsTruncation = (text, maxLength = 150) => {
    return text && text.length > maxLength
  }

  // Función para alternar la expansión de descripción
  const toggleDescriptionExpansion = (empresaId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [empresaId]: !prev[empresaId]
    }))
  }

  // Función para alternar la expansión de licencias
  const toggleLicensesExpansion = (empresaId) => {
    setExpandedLicenses(prev => ({
      ...prev,
      [empresaId]: !prev[empresaId]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-blue-100">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cargando empresas</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Buscando empresas profesionales disponibles...
          </p>
          
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Empresas Profesionales
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                Servicios veterinarios y de adiestramiento profesional
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}        {/* Lista de empresas */}
        {empresas.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-purple-100">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              No hay empresas registradas
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Aún no hay empresas profesionales registradas en la plataforma.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {empresas.map(empresa => (
              <div key={empresa.id} className="bg-white rounded-2xl shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300">                {/* Header de la empresa */}
                <div className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">                    <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      {empresa.host?.profile_photo_url ? (
                        <img 
                          src={empresa.host.profile_photo_url} 
                          alt={empresa.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-12 h-12 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{empresa.name}</h3>
                      {empresa.host?.title && (
                        <p className="text-sm text-purple-600 font-medium mb-2">{empresa.host.title}</p>
                      )}
                    </div>                  </div>                  {/* 1. Ubicación y Teléfono */}
                  {(empresa.host?.location || empresa.host?.phone) && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        {/* Sección de Ubicación */}
                        {empresa.host?.location && (
                          <div className="flex-1">
                            <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              Ubicación
                            </h5>
                            {(() => {
                              const addressData = formatAddress(empresa.host.location);
                              return (
                                <div>
                                  {addressData.street && (
                                    <p className="text-sm font-medium text-gray-800">{addressData.street}</p>
                                  )}
                                  {addressData.city && (
                                    <p className="text-sm text-green-700 font-semibold mt-1 flex items-center gap-1">
                                      <span className="text-green-600">📍</span>
                                      {addressData.city}
                                    </p>
                                  )}
                                  {!addressData.city && !addressData.street && (
                                    <p className="text-sm font-medium text-gray-800">{addressData.full}</p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        
                        {/* Sección de Teléfono */}
                        {empresa.host?.phone && (
                          <div className="lg:text-right">
                            <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 lg:justify-end">
                              <Phone className="w-4 h-4 text-orange-600" />
                              Teléfono
                            </h5>
                            <p className="text-sm font-medium text-gray-800">{formatPhoneNumber(empresa.host.phone)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}{/* 2. Servicios y tarifas */}
                  {empresa.servicios_ofrecidos && empresa.servicios_ofrecidos.length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        Servicios y tarifas
                      </h5>
                      <div className="space-y-2">
                        {empresa.servicios_ofrecidos.map((servicio, idx) => {
                          // Buscar el precio para este servicio en host.service_prices
                          const precioServicio = empresa.host?.service_prices?.find(
                            precio => precio.service_type === servicio || 
                                     precio.service_type?.toLowerCase() === servicio?.toLowerCase()
                          );
                          
                          return (
                            <div key={`serv-${empresa.id}-${idx}`} className="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-purple-100 shadow-sm">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span>{getServiceIcon(servicio)}</span>
                                {formatServiceType(servicio)}
                              </span>
                              {precioServicio ? (
                                <span className="text-sm font-bold text-purple-700">
                                  {parseFloat(precioServicio.price).toFixed(2)}€ 
                                  <span className="text-xs text-purple-600 ml-1 font-normal">
                                    {precioServicio.price_unit?.replace(/_/g, ' ')}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-xs text-gray-500 italic">
                                  Consultar precio
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}                  {/* 3. Descripción */}
                  {empresa.host?.description && (
                    <div className="mb-6 bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-gray-600">📝</span>
                        Descripción
                      </h5>
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {expandedDescriptions[empresa.id] 
                            ? empresa.host.description 
                            : formatDescription(empresa.host.description)
                          }
                        </p>
                        {needsTruncation(empresa.host.description) && (
                          <button
                            onClick={() => toggleDescriptionExpansion(empresa.id)}
                            className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
                          >
                            {expandedDescriptions[empresa.id] ? 'Leer menos' : 'Leer más'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}                  {/* 4. Licencias y certificaciones */}
                  {empresa.host?.licenses && (
                    <div className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-emerald-600">📜</span>
                        Licencias y certificaciones
                      </h5>
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {expandedLicenses[empresa.id] 
                            ? empresa.host.licenses 
                            : formatDescription(empresa.host.licenses)
                          }
                        </p>
                        {needsTruncation(empresa.host.licenses) && (
                          <button
                            onClick={() => toggleLicensesExpansion(empresa.id)}
                            className="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors duration-200 hover:underline"
                          >
                            {expandedLicenses[empresa.id] ? 'Leer menos' : 'Leer más'}
                          </button>
                        )}
                      </div>
                    </div>                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
