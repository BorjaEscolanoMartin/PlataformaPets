import { useEffect, useState } from "react";
import axios from "../lib/axios"; // usa tu config de axios con withCredentials
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchUnreadCount, decrementUnreadCount } = useNotifications();
  useEffect(() => {
    axios.get("/notifications")
      .then((res) => {
        setNotificaciones(res.data);
        setLoading(false);
        
        // Marcar todas las notificaciones no leídas como leídas y actualizar el contador
        const unreadNotifications = res.data.filter(notif => !notif.read_at);
        if (unreadNotifications.length > 0) {
          // Marcar como leídas en el servidor
          unreadNotifications.forEach(async (notif) => {
            try {
              await axios.post(`/notifications/${notif.id}/read`);
            } catch (error) {
              console.error('Error marking notification as read:', error);
            }
          });
          
          // Actualizar el contador local
          fetchUnreadCount();
        }
      })
      .catch((err) => {
        console.error("Error al obtener notificaciones", err);
        setError("Error al cargar las notificaciones");
        setLoading(false);
      });
  }, [fetchUnreadCount]);
  const handleEliminarNotificacion = async (notificationId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      return;
    }

    try {
      await axios.delete(`/notifications/${notificationId}`);
      console.log('✅ Notificación eliminada exitosamente');
      
      // Verificar si la notificación eliminada no estaba leída para decrementar el contador
      const notificationToDelete = notificaciones.find(notif => notif.id === notificationId);
      if (notificationToDelete && !notificationToDelete.read_at) {
        decrementUnreadCount();
      }
      
      // Actualizar la lista local removiendo la notificación eliminada
      setNotificaciones(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('❌ Error al eliminar notificación:', error);
      alert('Error al eliminar la notificación. Por favor intenta de nuevo.');
    }
  };
  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'reserva_solicitada': return '📩'
      case 'reserva_actualizada': return '🔄'
      case 'reserva_cancelada': return '🚫'
      case 'mensaje': return '💬'
      case 'recordatorio': return '⏰'
      default: return '🔔'
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'reserva_solicitada': return 'bg-blue-50 border-blue-200'
      case 'reserva_actualizada': return 'bg-green-50 border-green-200'
      case 'reserva_cancelada': return 'bg-red-50 border-red-200'
      case 'mensaje': return 'bg-purple-50 border-purple-200'
      case 'recordatorio': return 'bg-yellow-50 border-yellow-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return "Fecha inválida";
    }
  };

  const renderNotificationContent = (notif) => {
    const { data } = notif;
    
    if (data.tipo === "reserva_solicitada") {
      return (
        <div>
          <p className="font-medium text-gray-800 mb-2">Nueva solicitud de reserva</p>
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-blue-600">{data.usuario_nombre}</strong> ha solicitado una reserva para{" "}
            <strong className="text-purple-600">{data.mascota_nombre}</strong> del{" "}
            <strong className="text-gray-800">{data.fecha_inicio?.split("T")[0]}</strong> al{" "}
            <strong className="text-gray-800">{data.fecha_fin?.split("T")[0]}</strong>.
          </p>
        </div>
      );
    }    if (data.tipo === "reserva_actualizada") {
      const estadoColor = data.estado === 'aceptada' ? 'text-green-600' : 
                         data.estado === 'rechazada' ? 'text-red-600' : 'text-yellow-600';
      return (
        <div>
          <p className="font-medium text-gray-800 mb-2">Estado de reserva actualizado</p>
          <p className="text-gray-700 leading-relaxed">
            Tu reserva del <strong className="text-gray-800">{data.fecha_inicio?.split("T")[0]}</strong> al{" "}
            <strong className="text-gray-800">{data.fecha_fin?.split("T")[0]}</strong> fue{" "}
            <strong className={estadoColor}>{data.estado}</strong> por{" "}
            <strong className="text-blue-600">{data.cuidador_nombre}</strong>.
          </p>
        </div>      );
    }

    if (data.tipo === "reserva_cancelada") {
      return (
        <div>
          <p className="font-medium text-gray-800 mb-2">Reserva cancelada</p>
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-blue-600">{data.cliente_nombre}</strong> ha cancelado su reserva para{" "}
            <strong className="text-purple-600">{data.mascota_nombre}</strong> del{" "}
            <strong className="text-gray-800">{data.fecha_inicio?.split("T")[0]}</strong> al{" "}
            <strong className="text-gray-800">{data.fecha_fin?.split("T")[0]}</strong>.{" "}
            <span className="text-red-600 font-medium">Las fechas han quedado disponibles nuevamente.</span>
          </p>
        </div>
      );
    }

    // Contenido por defecto para otros tipos
    return (
      <div>
        <p className="font-medium text-gray-800 mb-2">Notificación</p>
        <p className="text-gray-700">Contenido de la notificación no disponible.</p>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center">
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
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cargando notificaciones</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Obteniendo tus últimas actualizaciones...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto space-y-8 px-6">

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
        {!error && notificaciones.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
                <span className="text-white text-xl">📊</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Notificaciones</h2>
            </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{notificaciones.length}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">
                  {notificaciones.filter(n => n.data?.tipo === 'reserva_solicitada').length}
                </div>
                <div className="text-sm text-purple-700">Solicitudes</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {notificaciones.filter(n => n.data?.tipo === 'reserva_actualizada').length}
                </div>
                <div className="text-sm text-green-700">Actualizaciones</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                <div className="text-2xl font-bold text-red-600">
                  {notificaciones.filter(n => n.data?.tipo === 'reserva_cancelada').length}
                </div>
                <div className="text-sm text-red-700">Cancelaciones</div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de notificaciones */}
        {notificaciones.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-blue-100">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🔔</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No hay notificaciones</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Cuando tengas nuevas solicitudes de reserva o actualizaciones importantes, aparecerán aquí.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="text-lg">🏠</span>
              Ir al dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notificaciones.map((notif) => (
              <div 
                key={notif.id} 
                className={`bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${getNotificationColor(notif.data?.tipo)} ${!notif.read_at ? 'ring-2 ring-blue-200' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icono */}
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xl">
                      {getNotificationIcon(notif.data?.tipo)}
                    </span>
                  </div>                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {!notif.read_at && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(notif.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notif.read_at && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            Nueva
                          </span>
                        )}
                        <button
                          onClick={() => handleEliminarNotificacion(notif.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center"
                          title="Eliminar notificación"
                        >
                          <span className="text-sm">🗑️</span>
                        </button>
                      </div>
                    </div>
                    
                    {renderNotificationContent(notif)}
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;
