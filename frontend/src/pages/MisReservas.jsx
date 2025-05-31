import { useEffect, useState } from 'react'
import api from '../lib/axios'
import { Link } from 'react-router-dom'
import { useChat } from '../context/useChat'
import ChatModal from '../components/chat/ChatModal'

export default function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const { createPrivateChat, setActiveChat } = useChat()
    const handleContactarCuidador = async (cuidadorUserId) => {
    try {
      console.log('🚀 Iniciando chat con cuidador User ID:', cuidadorUserId)
      
      // Crear o obtener el chat privado con el cuidador
      const chat = await createPrivateChat(cuidadorUserId)
      console.log('✅ Chat creado/obtenido:', chat)
      console.log('👥 Participantes del chat:', chat.participants)
      console.log('👤 Otro participante:', chat.other_participant)
      
      // Establecer como chat activo
      setActiveChat(chat)
      console.log('✅ Chat establecido como activo')
      
      // Esperar un momento para que se establezca el estado
      setTimeout(() => {
        // Abrir el modal de chat
        setIsChatModalOpen(true)
        console.log('✅ Modal de chat abierto')
      }, 100)
    } catch (error) {
      console.error('❌ Error al abrir chat con cuidador:', error)
      alert(`Error al abrir chat: ${error.message}`)
    }
  }
  useEffect(() => {
    api.get('/reservations')
      .then(res => {
        console.log('📋 Reservas cargadas:', res.data)
        setReservas(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar tus reservas')
        setLoading(false)
      })
  }, [])
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'aceptada': return 'bg-green-50 text-green-700 border-green-200'
      case 'rechazada': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': return '⏳'
      case 'aceptada': return '✅'
      case 'rechazada': return '❌'
      default: return '📋'
    }
  }

  const getServiceIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case 'alojamiento': return '🏠'
      case 'cuidado_a_domicilio': return '🏡'
      case 'visitas_a_domicilio': return '🚪'
      case 'guarderia': return '🌅'
      case 'paseo': return '🚶'
      default: return '⚡'
    }
  }

  const formatServiceType = (serviceType) => {
    const services = {
      'alojamiento': 'Alojamiento en casa del cuidador',
      'cuidado_a_domicilio': 'Cuidado en tu domicilio',
      'visitas_a_domicilio': 'Visitas a domicilio',
      'guarderia': 'Guardería de día',
      'paseo': 'Paseo'
    }
    return services[serviceType] || serviceType
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-blue-100">
          {/* Animated loading icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cargando reservas</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Obteniendo tus solicitudes de cuidado...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Error Message */}
        {error && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200">
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <p className="text-red-800 font-medium">Error al cargar</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {!error && reservas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
                <span className="text-white text-xl">📊</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Resumen de reservas</h2>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{reservas.length}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-600">
                  {reservas.filter(r => r.status?.toLowerCase() === 'pendiente').length}
                </div>
                <div className="text-sm text-yellow-700">Pendientes</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {reservas.filter(r => r.status?.toLowerCase() === 'aceptada').length}
                </div>
                <div className="text-sm text-green-700">Confirmadas</div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de reservas */}
        {reservas.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-blue-100">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No hay reservas registradas</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Aún no has realizado ninguna solicitud de cuidado para tus mascotas. ¡Busca cuidadores y haz tu primera reserva!
            </p>
            <Link
              to="/cuidadores"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="text-lg">🔍</span>
              Buscar cuidadores
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reservas.map(reserva => (
              <div key={reserva.id} className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">
                          {getServiceIcon(reserva.service_type)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {formatServiceType(reserva.service_type)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Reserva #{reserva.id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐾</span>
                        <div>
                          <p className="text-sm text-gray-500">Mascota</p>
                          <p className="font-medium text-gray-800">{reserva.pet?.name || 'Desconocida'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        <div>
                          <p className="text-sm text-gray-500">Cuidador</p>
                          <p className="font-medium text-gray-800">{reserva.host?.name || 'Desconocido'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <div>
                          <p className="text-sm text-gray-500">Fecha de inicio</p>
                          <p className="font-medium text-gray-800">{reserva.start_date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <div>
                          <p className="text-sm text-gray-500">Fecha de fin</p>
                          <p className="font-medium text-gray-800">{reserva.end_date}</p>
                        </div>
                      </div>
                    </div>

                    {reserva.address && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">📍</span>
                        <div>
                          <p className="text-sm text-gray-500">Dirección</p>
                          <p className="font-medium text-gray-800">{reserva.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Estado y acciones */}
                  <div className="lg:text-right space-y-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(reserva.status)}`}>
                      <span>{getStatusIcon(reserva.status)}</span>
                      <span className="capitalize">{reserva.status || 'Desconocido'}</span>
                    </div>                    {reserva.status?.toLowerCase() === 'aceptada' && reserva.host && (
                      <div className="flex flex-col sm:flex-row gap-2">                        <button 
                          onClick={() => {
                            console.log('🎯 Botón contactar clickeado para reserva:', reserva.id)
                            console.log('👤 Datos del host:', reserva.host)
                            console.log('👤 Usuario del cuidador:', reserva.host.user)
                            console.log('🆔 User ID del cuidador:', reserva.host.user?.id)
                            handleContactarCuidador(reserva.host.user?.id)
                          }}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-2 px-4 rounded-xl transition-all duration-200 text-sm"
                        >
                          📞 Contactar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón volver */}
        <div className="text-center pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-lg">🏠</span>
            Volver al Inicio
          </Link>        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  )
}
