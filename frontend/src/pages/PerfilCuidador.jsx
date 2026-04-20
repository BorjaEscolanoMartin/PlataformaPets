import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReservaForm from '../components/ReservaForm'
import { useAuth } from '../context/useAuth'
import { useModal } from '../hooks/useModal'
import { useCuidador } from '../hooks/useCuidadores'
import { useHostReviews } from '../hooks/useReviews'
import StartChatButton from '../components/chat/StartChatButton'

import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'

export default function PerfilCuidador() {
  const { id } = useParams()
  const { user } = useAuth()
  const { openLogin } = useModal()

  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const { data: cuidador, isLoading, isError } = useCuidador(id)
  const { data: reviews = [] } = useHostReviews(cuidador?.host?.id)

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-3xl">⏳</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Cargando perfil...</h3>
          <p className="text-gray-600">Obteniendo información del cuidador</p>
        </div>
      </div>
    )
  }

  if (isError || !cuidador) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cuidador no encontrado</h3>
          <p className="text-gray-600 mb-6">No pudimos encontrar el perfil que buscas. Es posible que haya sido eliminado o no exista.</p>
          <Link
            to="/cuidadores"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            <span className="text-lg">👥</span>
            Ver todos los cuidadores
          </Link>
        </div>
      </div>
    )
  }
  const host = cuidador.host
  const userReview = user ? reviews.find(r => r.user.id === user.id) : null
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {host?.profile_photo && (
                <img
                  src={`http://localhost:8000/storage/${host.profile_photo}`}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{cuidador.name}</h1>
                {host?.title && (
                  <p className="text-xl text-blue-100 mt-1">{host.title}</p>
                )}
                <p className="text-blue-100 mt-2 flex items-center gap-2">
                  <span>✉️</span>
                  {cuidador.email}
                </p>
                {host?.average_rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(host.average_rating))}
                      {'☆'.repeat(5 - Math.round(host.average_rating))}
                    </div>
                    <span className="text-blue-100">
                      {host.average_rating} / 5
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cuidador.especie_preferida?.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    🐕 Mascotas que acepta
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cuidador.especie_preferida.map((especie, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {especie.charAt(0).toUpperCase() + especie.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {cuidador.tamanos_aceptados?.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    📏 Tamaños aceptados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cuidador.tamanos_aceptados.map((tamano, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {tamano.charAt(0).toUpperCase() + tamano.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cuidador.servicios_ofrecidos?.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    ⚡ Servicios ofrecidos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cuidador.servicios_ofrecidos.map((servicio, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {servicio.charAt(0).toUpperCase() + servicio.slice(1).replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>      {host ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact & Basic Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📋 Información básica
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-sm text-gray-600">Ubicación</p>
                      <p className="font-medium">{host.location}</p>
                    </div>
                  </div>
                  {host.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">📱</span>
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-medium">{host.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-medium capitalize">{host.type}</p>
                    </div>
                  </div>
                  {host.experience_years && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">🐾</span>
                      <div>
                        <p className="text-sm text-gray-600">Experiencia</p>
                        <p className="font-medium">{host.experience_years} años</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Precios de servicios */}
              {host.service_prices && host.service_prices.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    💰 Tarifas de servicios
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {host.service_prices.map((precio, idx) => {
                      const getServiceIcon = (serviceType) => {
                        switch(serviceType) {
                          case 'paseo': return '🚶'
                          case 'alojamiento': return '🏠'
                          case 'guarderia': return '🏢'
                          case 'cuidado_a_domicilio': return '🏡'
                          case 'visitas_a_domicilio': return '🚪'
                          default: return '⭐'
                        }
                      }
                      
                      const getServiceLabel = (serviceType) => {
                        switch(serviceType) {
                          case 'paseo': return 'Paseo'
                          case 'alojamiento': return 'Alojamiento'
                          case 'guarderia': return 'Guardería'
                          case 'cuidado_a_domicilio': return 'Cuidado a domicilio'
                          case 'visitas_a_domicilio': return 'Visitas a domicilio'
                          default: return serviceType
                        }
                      }
                      
                      const getPriceUnit = (priceUnit) => {
                        switch(priceUnit) {
                          case 'por_hora': return 'por hora'
                          case 'por_noche': return 'por noche'
                          case 'por_dia': return 'por día'
                          case 'por_visita': return 'por visita'
                          default: return priceUnit
                        }
                      }

                      return (
                        <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getServiceIcon(precio.service_type)}</span>
                              <h3 className="font-semibold text-gray-800">{getServiceLabel(precio.service_type)}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold text-green-700">{precio.price}€</span>
                              <div className="text-xs text-gray-600">{getPriceUnit(precio.price_unit)}</div>
                            </div>
                          </div>
                          {precio.description && (
                            <p className="text-sm text-gray-600 mt-2">{precio.description}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Experience Details */}
              {host.experience_details && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    💼 Sobre mi experiencia
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {host.experience_details}
                  </p>
                </div>
              )}

              {/* Environment Description */}
              {host.description && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    🏠 Mi entorno
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {host.description}
                  </p>
                </div>
              )}

              {/* Own Pets */}
              {host.has_own_pets && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    🐶 Mis mascotas
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {host.own_pets_description || 'Tengo mascotas propias.'}
                  </p>
                </div>
              )}

              {/* Reviews Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  ⭐ Reseñas de otros usuarios
                </h2>

                {user && (
                  <div className="mb-6">
                    <ReviewForm
                      hostId={host.id}
                      existingReview={userReview}
                    />
                  </div>
                )}

                <ReviewList reviews={reviews} />
              </div>
            </div>            {/* Sidebar */}
            <div className="lg:col-span-1">              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Contactar cuidador</h3>
                
                {user && user.id !== cuidador.id && (                  <div className="mb-4">
                    <StartChatButton 
                      userId={cuidador.id} 
                      className="w-full"
                    />
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Solicitar reserva</h4>
                  
                  {!mostrarFormulario ? (
                    <button
                      onClick={() => {
                        if (user) {
                          setMostrarFormulario(true)
                        } else {
                          openLogin()
                        }
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      📅 Hacer reserva
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <ReservaForm hostId={host.id} servicePrices={host.service_prices || []} />
                      <button
                        onClick={() => setMostrarFormulario(false)}
                        className="text-sm text-red-600 hover:underline w-full text-center"
                      >
                        Cancelar solicitud
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Al contactar, aceptas nuestros términos de servicio
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-lg text-gray-600">Este cuidador aún no ha completado su perfil.</p>
            <p className="text-sm text-gray-500 mt-2">Por favor, inténtalo más tarde.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/cuidadores"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:bg-blue-50"
          >
            ← Volver a cuidadores
          </Link>
        </div>
      </div>
    </div>
  )
}
