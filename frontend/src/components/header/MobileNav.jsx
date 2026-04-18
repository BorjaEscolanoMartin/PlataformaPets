import { Link } from 'react-router-dom'
import {
  PawPrint,
  Building2,
  ShieldCheck,
  Search,
  Bell,
  Calendar,
  Bookmark,
  LogOut,
  UserRound,
  MessageCircle,
} from 'lucide-react'

function UnreadBadgeMd({ count, borderClass = 'border-white' }) {
  if (!count) return null
  return (
    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-lg border ${borderClass}`}>
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function MobileNav({
  user,
  esCliente,
  esCuidador,
  esEmpresa,
  unreadCount,
  chatUnreadCount,
  onOpenChat,
  onOpenNotifications,
  onLogout,
  onOpenLogin,
  onOpenRegister,
  onClose,
}) {
  return (
    <div className="lg:hidden fixed inset-0 top-[88px] bg-black/50 backdrop-blur-sm z-40">
      <div className="bg-white w-full min-h-screen p-6 shadow-xl">
        <nav className="flex flex-col space-y-4">
          {(!user || esCliente) && (
            <Link
              to="/cuidadores"
              onClick={onClose}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Search className="w-5 h-5" />
              <span className="font-semibold">Buscar cuidadores</span>
            </Link>
          )}

          {esCliente && (
            <>
              <Link
                to="/empresas"
                onClick={onClose}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <Building2 className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-700">Ver empresas</span>
              </Link>

              <Link
                to="/mi-perfil-cuidador"
                onClick={onClose}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-gray-700">Quiero ser cuidador</span>
              </Link>

              <Link
                to="/registro-empresa"
                onClick={onClose}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <Building2 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">Soy una empresa</span>
              </Link>
            </>
          )}

          {(esCuidador || esEmpresa) && (
            <>
              <Link
                to="/reservas-recibidas"
                onClick={onClose}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
              >
                <Bookmark className="w-5 h-5" />
                <span className="font-semibold">Reservas recibidas</span>
              </Link>
              <Link
                to="/notificaciones"
                onClick={() => { onOpenNotifications?.(); onClose() }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-700 hover:to-yellow-700"
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  <UnreadBadgeMd count={unreadCount} borderClass="border-orange-200" />
                </div>
                <span className="font-semibold">Notificaciones</span>
              </Link>
            </>
          )}

          {user ? (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <UserRound className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800">{user.name}</span>
              </div>

              {esCliente && (
                <>
                  <Link
                    to="/mascotas"
                    onClick={onClose}
                    className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300"
                  >
                    <PawPrint className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Mis mascotas</span>
                  </Link>

                  <Link
                    to="/mis-reservas"
                    onClick={onClose}
                    className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-xl transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-700">Mis reservas</span>
                  </Link>
                  <Link
                    to="/notificaciones"
                    onClick={() => { onOpenNotifications?.(); onClose() }}
                    className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 rounded-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <Bell className="w-5 h-5 text-orange-600" />
                      <UnreadBadgeMd count={unreadCount} />
                    </div>
                    <span className="font-medium text-gray-700">Notificaciones</span>
                  </Link>

                  <button
                    onClick={onOpenChat}
                    className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 w-full text-left"
                  >
                    <div className="relative">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <UnreadBadgeMd count={chatUnreadCount} />
                    </div>
                    <span className="font-medium text-gray-700">Mensajes</span>
                  </button>
                </>
              )}

              {(esCuidador || esEmpresa) && (
                <>
                  <Link
                    to="/mi-perfil-cuidador"
                    onClick={onClose}
                    className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-300"
                  >
                    <UserRound className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-700">
                      {esEmpresa ? 'Mi perfil de empresa' : 'Mi perfil de cuidador'}
                    </span>
                  </Link>
                  <button
                    onClick={onOpenChat}
                    className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 w-full text-left"
                  >
                    <div className="relative">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <UnreadBadgeMd count={chatUnreadCount} />
                    </div>
                    <span className="font-medium text-gray-700">Mensajes</span>
                  </button>
                </>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-600">Cerrar sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
              <button
                onClick={() => { onOpenRegister(); onClose() }}
                className="w-full p-4 text-center font-semibold text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-300"
              >
                Registrarse
              </button>

              <button
                onClick={() => { onOpenLogin(); onClose() }}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Iniciar sesión
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}
