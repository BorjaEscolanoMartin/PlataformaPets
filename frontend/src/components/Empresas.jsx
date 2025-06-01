import { useEffect, useState } from 'react'
import api from '../lib/axios'
import { Building2, MapPin, Phone, Users, Award, Briefcase } from 'lucide-react'

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  const fetchEmpresas = async () => {
    try {
      setLoading(true)
      const res = await api.get('/empresas')
      setEmpresas(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Error al cargar empresas:', err)
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
        return '⚕️'
      case 'vacunacion':
        return '💉'
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
                    </div>
                  </div>                  {/* Información de contacto */}
                  <div className="space-y-3 mb-6">
                    {empresa.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{empresa.location}</span>
                      </div>
                    )}
                      {empresa.host?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">{empresa.host.phone}</span>
                      </div>
                    )}

                    {empresa.fiscal_address && empresa.fiscal_address !== empresa.location && (
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500">Dirección fiscal</p>
                          <p className="text-sm text-gray-700">{empresa.fiscal_address}</p>
                        </div>
                      </div>
                    )}
                  </div>                  {/* Licencias y certificaciones */}
                  {empresa.host?.licenses && (
                    <div className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Licencias y certificaciones
                      </h5>
                      <p className="text-sm text-gray-700 leading-relaxed">{empresa.host.licenses}</p>
                    </div>
                  )}{/* Servicios ofrecidos con precios */}
                  {empresa.servicios_ofrecidos && empresa.servicios_ofrecidos.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        Servicios y tarifas
                      </h4>                      <div className="space-y-2">                        {empresa.servicios_ofrecidos.map((servicio, idx) => {
                          // Buscar el precio para este servicio en host.service_prices
                          const precioServicio = empresa.host?.service_prices?.find(
                            precio => precio.service_type === servicio || 
                                     precio.service_type?.toLowerCase() === servicio?.toLowerCase()
                          );
                          
                          return (
                            <div key={`serv-${empresa.id}-${idx}`} className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span>{getServiceIcon(servicio)}</span>
                                {formatServiceType(servicio)}
                              </span>
                              {precioServicio ? (
                                <span className="text-sm font-bold text-purple-700">
                                  {precioServicio.price}€ {precioServicio.price_unit}
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
                  )}                  {/* Descripción */}
                  {empresa.description && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">📝 Descripción</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{empresa.description}</p>
                    </div>
                  )}

                  {/* Información del equipo */}
                  {empresa.team_info && (
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        Equipo profesional
                      </h5>
                      <p className="text-sm text-gray-700 leading-relaxed">{empresa.team_info}</p>
                    </div>
                  )}                       
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
