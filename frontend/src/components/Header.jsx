import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useModal } from '../hooks/useModal'
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
  Building2,
  ShieldCheck,
  Search,
  Bell,
  Calendar,
  Bookmark,
  LogOut,
  UserRound,
  ChevronDown,
} from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { openLogin, openRegister } = useModal()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const esCliente = user?.role === 'cliente'
  const esCuidador = user?.role === 'cuidador'
  const esEmpresa = user?.role === 'empresa'
  return (
    <header className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 shadow-lg border-b border-blue-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm">
      <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 hover:scale-105 transition-transform duration-300">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        Pet Hosting
      </Link>      <nav className="flex items-center gap-3 text-sm relative">
        {(!user || esCliente) && (
          <Button variant="default" size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-0 mr-2">
            <Link to="/cuidadores" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar cuidadores
            </Link>
          </Button>
        )}

        {esCliente && (
          <Button variant="ghost" size="sm" asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 transition-all duration-300">
            <Link to="/empresas" className="flex items-center gap-2 font-semibold text-gray-700 hover:text-purple-600">
              <Building2 className="w-4 h-4" />
              Ver empresas
            </Link>
          </Button>
        )}

        {esCliente && (
          <Button variant="outline" size="sm" asChild className="border-2 border-orange-300 text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <Link to="/mi-perfil-cuidador" className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Quiero ser cuidador
            </Link>
          </Button>
        )}

        {esCliente && (
          <Button variant="outline" size="sm" asChild className="border-2 border-green-300 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-green-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <Link to="/registro-empresa" className="flex items-center gap-2 font-semibold">
              <Building2 className="w-4 h-4" />
              Soy una empresa
            </Link>
          </Button>
        )}        {!user ? (
          <>
            <Button variant="ghost" size="sm" onClick={openRegister} className="font-semibold text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
              Registrarse
            </Button>
            <Button variant="default" size="sm" onClick={openLogin} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              Iniciar sesión
            </Button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-bold text-gray-800 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 flex items-center gap-2 transition-all duration-300 px-4 py-2 rounded-xl shadow-md hover:shadow-lg">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <UserRound className="w-3 h-3 text-white" />
                </div>
                {user.name}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-2">
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
                    <Link to="/notificaciones" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-orange-600">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                        <Bell className="w-3 h-3 text-orange-600" />
                      </div>
                      Notificaciones
                    </Link>
                  </DropdownMenuItem>
                </>
              )}              {(esCuidador || esEmpresa) && (
                <>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
                    <Link to="/mi-perfil-cuidador" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-purple-600">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <UserRound className="w-3 h-3 text-purple-600" />
                      </div>
                      {esEmpresa ? 'Mi perfil de empresa' : 'Mi perfil de cuidador'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300">
                    <Link to="/reservas-recibidas" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-indigo-600">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <Bookmark className="w-3 h-3 text-indigo-600" />
                      </div>
                      Reservas recibidas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300">
                    <Link to="/notificaciones" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-orange-600">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                        <Bell className="w-3 h-3 text-orange-600" />
                      </div>
                      Notificaciones
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300">
                <div className="flex items-center gap-3 p-2 font-medium text-red-600 hover:text-red-700">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                    <LogOut className="w-3 h-3 text-red-600" />
                  </div>
                  Cerrar sesión
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </header>
  )
}
