import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  PawPrint,
  Calendar,
  Bell,
  LogOut,
  UserRound,
  ChevronDown,
  MessageCircle,
} from 'lucide-react'

function UnreadBadge({ count }) {
  if (!count) return null
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 shadow-lg border border-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function UserMenu({
  user,
  esCliente,
  esCuidador,
  esEmpresa,
  unreadCount,
  chatUnreadCount,
  onOpenChat,
  onOpenNotifications,
  onLogout,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="font-bold text-gray-800 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 flex items-center gap-1 xl:gap-2 transition-all duration-300 px-2 xl:px-4 py-2 rounded-xl shadow-md hover:shadow-lg">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <UserRound className="w-3 h-3 text-white" />
          </div>
          <span className="hidden md:inline max-w-[80px] xl:max-w-none truncate">{user.name}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-2">
        {esCliente && (
          <>
            <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
              <Link to="/mascotas" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-blue-600">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <PawPrint className="w-3 h-3 text-blue-600" />
                </div>
                Mis mascotas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300">
              <Link to="/mis-reservas" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-green-600">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-green-600" />
                </div>
                Mis reservas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300">
              <Link to="/notificaciones" onClick={onOpenNotifications} className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-orange-600">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative">
                  <Bell className="w-3 h-3 text-orange-600" />
                  <UnreadBadge count={unreadCount} />
                </div>
                Notificaciones
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
              <button
                onClick={onOpenChat}
                className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-blue-600 w-full text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                  <MessageCircle className="w-3 h-3 text-blue-600" />
                  <UnreadBadge count={chatUnreadCount} />
                </div>
                Mensajes
              </button>
            </DropdownMenuItem>
          </>
        )}

        {(esCuidador || esEmpresa) && (
          <>
            <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
              <Link to="/mi-perfil-cuidador" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-purple-600">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <UserRound className="w-3 h-3 text-purple-600" />
                </div>
                {esEmpresa ? 'Mi perfil de empresa' : 'Mi perfil de cuidador'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
              <button
                onClick={onOpenChat}
                className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-blue-600 w-full text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                  <MessageCircle className="w-3 h-3 text-blue-600" />
                  <UnreadBadge count={chatUnreadCount} />
                </div>
                Mensajes
              </button>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem onClick={onLogout} className="rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300">
          <div className="flex items-center gap-3 p-2 font-medium text-red-600 hover:text-red-700">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
              <LogOut className="w-3 h-3 text-red-600" />
            </div>
            Cerrar sesión
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
