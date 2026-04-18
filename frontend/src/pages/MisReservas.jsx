import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChat } from '../context/useChat'
import { useToast } from '../context/ToastContext'
import { useConfirm } from '../hooks/useModal'
import { useMyReservations, useCancelReservation } from '../hooks/useReservations'
import ChatModal from '../components/chat/ChatModal'
import { computeEstimatedPrice } from '../utils/pricing'

function PrecioEstimado({ reserva }) {
  const info = computeEstimatedPrice({
    serviceType:   reserva.service_type,
    startDate:     reserva.start_date,
    endDate:       reserva.end_date,
    servicePrices: reserva.host?.service_prices || [],
  })
  if (!info.match) return null
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">💶</span>
      <div>
        <p className="text-sm text-gray-500">Precio estimado <span className="text-xs">(informativo)</span></p>
        <p className="font-medium text-gray-800">
          {info.total !== null
            ? `${info.total.toFixed(2)}€ (${info.unitPrice.toFixed(2)}€ ${info.unitLabel} × ${info.days})`
            : `${info.unitPrice.toFixed(2)}€ ${info.unitLabel}`}
        </p>
      </div>
    </div>
  )
}

export default function MisReservas() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const { createPrivateChat, setActiveChat } = useChat()
  const { error: showError, success: showSuccess } = useToast()
  const confirm = useConfirm()

  const { data: reservas = [], isLoading, isError } = useMyReservations()
  const cancelReservation = useCancelReservation()

  const error = isError ? 'Error al cargar tus reservas' : null

  const handleContactarCuidador = async (cuidadorUserId) => {
    try {
      const chat = await createPrivateChat(cuidadorUserId)
      setActiveChat(chat)
      setTimeout(() => setIsChatModalOpen(true), 100)
    } catch (error) {
      showError(`Error al abrir chat: ${error.message}`)
    }
  }

  const handleCancelarReserva = async (reservaId) => {
    const confirmed = await confirm('¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.')
    if (!confirmed) return

    try {
      await cancelReservation.mutateAsync(reservaId)
      showSuccess('Reserva cancelada exitosamente. El cuidador ha sido notificado.')
    } catch (error) {
      if (error.response?.status === 400) {
        showError('No se puede cancelar esta reserva en su estado actual.')
      } else if (error.response?.status === 403) {
        showError('No tienes permisos para cancelar esta reserva.')
      } else {
        showError(`Error al cancelar reserva: ${error.response?.data?.error || error.message}`)
      }
    }
  }
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'aceptada': return 'bg-green-50 text-green-700 border-green-200'
      case 'rechazada': return 'bg-red-50 text-red-700 border-red-200'
      case 'cancelada': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': return '⏳'
      case 'aceptada': return '✅'
      case 'rechazada': return '❌'
      case 'cancelada': return '🚫'
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
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString)
    // Formatear como día/mes/año
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
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
    <div className="p-6">
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
            </div>              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-gray-600">
                  {reservas.filter(r => r.status?.toLowerCase() === 'cancelada').length}
                </div>
                <div className="text-sm text-gray-700">Canceladas</div>
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
                          <p className="font-medium text-gray-800">{formatDate(reserva.start_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <div>
                          <p className="text-sm text-gray-500">Fecha de fin</p>
                          <p className="font-medium text-gray-800">{formatDate(reserva.end_date)}</p>
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

                    <PrecioEstimado reserva={reserva} />
                  </div>

                  {/* Estado y acciones */}
                  <div className="lg:text-right space-y-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(reserva.status)}`}>
                      <span>{getStatusIcon(reserva.status)}</span>
                      <span className="capitalize">{reserva.status || 'Desconocido'}</span>
                    </div>                    {reserva.status?.toLowerCase() === 'aceptada' && reserva.host && (
                      <div className="flex flex-col sm:flex-row gap-2">                        <button 
                          onClick={() => {
                            handleContactarCuidador(reserva.host.user?.id)
                          }}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-2 px-4 rounded-xl transition-all duration-200 text-sm"
                        >
                          📞 Contactar
                        </button>
                        <button
                          onClick={() => handleCancelarReserva(reserva.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-xl transition-all duration-200 text-sm"
                        >
                          🚫 Cancelar
                        </button>
                      </div>
                    )}
                    
                    {(reserva.status?.toLowerCase() === 'pendiente') && (
                      <div className="flex flex-col sm:flex-row gap-2">                        <button
                          onClick={() => handleCancelarReserva(reserva.id)}
                          className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-xl transition-all duration-200 text-sm"
                        >
                          🚫 Cancelar reserva
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
