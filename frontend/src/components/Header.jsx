import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useModal } from '../hooks/useModal'
import { useNotifications } from '../hooks/useNotifications'
import { useChatUnreadCount } from '../hooks/useChatUnreadCount'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import ChatModal from './chat/ChatModal'
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
  Menu,
  X,
  MessageCircle,
} from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { openLogin, openRegister } = useModal()
  const { unreadCount } = useNotifications()
  const { unreadCount: chatUnreadCount, resetUnreadCount } = useChatUnreadCount()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  
  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsMenuOpen(false)
  }
    const handleOpenChat = () => {
    console.log('handleOpenChat called, current chatUnreadCount:', chatUnreadCount)
    resetUnreadCount() // Reset unread count immediately when opening chat
    console.log('resetUnreadCount called')
    setIsChatModalOpen(true)
    setIsMenuOpen(false)
  }
  
  const closeMenu = () => setIsMenuOpen(false)

  const esCliente = user?.role === 'cliente'
  const esCuidador = user?.role === 'cuidador'
  const esEmpresa = user?.role === 'empresa'
  return (
    <header className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm">
     <Link to="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 hover:scale-105 transition-transform duration-300">        <div className="w-12 h-12">
          <img 
            src="/LogoWeb-sinfondo.png" 
            alt="Pet Hosting Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback al icono original si la imagen no se encuentra
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center rounded-xl" style={{display: 'none'}}>
            <PawPrint className="w-6 h-6 text-white" />
          </div>
        </div>
        <span className="hidden md:inline">Pets</span>
        <span className="md:hidden">Pets</span>
      </Link>{/* Botón hamburguesa solo para móvil */}
      <button
        className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>      {/* Navegación para tablets y desktop */}
      <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-sm relative">        {(!user || esCliente) && (
          <Button variant="default" size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-0 mr-1 xl:mr-2">
            <Link to="/cuidadores" className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3">
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Buscar cuidadores</span>
              <span className="md:hidden">Buscar</span>
            </Link>
          </Button>
        )}

        {esCliente && (
          <Button variant="ghost" size="sm" asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 transition-all duration-300">
            <Link to="/empresas" className="flex items-center gap-1 xl:gap-2 font-semibold text-gray-700 hover:text-purple-600 px-2 xl:px-3">
              <Building2 className="w-4 h-4" />
              <span className="hidden md:inline">Ver empresas</span>
              <span className="md:hidden">Empresas</span>
            </Link>
          </Button>
        )}

        {esCliente && (
          <Button variant="outline" size="sm" asChild className="border-2 border-orange-300 text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <Link to="/mi-perfil-cuidador" className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline">Quiero ser cuidador</span>
              <span className="xl:hidden">Ser cuidador</span>
            </Link>
          </Button>
        )}

        {esCliente && (
          <Button variant="outline" size="sm" asChild className="border-2 border-green-300 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-green-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <Link to="/registro-empresa" className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3">
              <Building2 className="w-4 h-4" />
              <span className="hidden xl:inline">Soy una empresa</span>
              <span className="xl:hidden">Empresa</span>
            </Link>
          </Button>
        )}        {/* Opciones principales para cuidadores en la barra */}
        {(esCuidador || esEmpresa) && (
          <>
            <Button variant="outline" size="sm" asChild className="border-2 border-indigo-300 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg">
              <Link to="/reservas-recibidas" className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3">
                <Bookmark className="w-4 h-4" />
                <span className="hidden md:inline">Reservas recibidas</span>
                <span className="md:hidden">Reservas</span>
              </Link>
            </Button>            <Button variant="outline" size="sm" asChild className="border-2 border-orange-300 text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
              <Link to="/notificaciones" className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3 relative">
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg border-2 border-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline">Notificaciones</span>
                <span className="md:hidden">Notific.</span>
              </Link>
            </Button>
          </>
        )}{!user ? (
          <>
            <Button variant="ghost" size="sm" onClick={openRegister} className="font-semibold text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 px-2 xl:px-3">
              <span className="hidden md:inline">Registrarse</span>
              <span className="md:hidden">Registro</span>
            </Button>
            <Button variant="default" size="sm" onClick={openLogin} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-2 xl:px-3">
              <span className="hidden md:inline">Iniciar sesión</span>
              <span className="md:hidden">Entrar</span>
            </Button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-bold text-gray-800 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 flex items-center gap-1 xl:gap-2 transition-all duration-300 px-2 xl:px-4 py-2 rounded-xl shadow-md hover:shadow-lg">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <UserRound className="w-3 h-3 text-white" />
                </div>
                <span className="hidden md:inline max-w-[80px] xl:max-w-none truncate">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-2">              {esCliente && (
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
                  </DropdownMenuItem>                  <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300">
                    <Link to="/notificaciones" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-orange-600">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative">
                        <Bell className="w-3 h-3 text-orange-600" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 shadow-lg border border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>                      Notificaciones
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                    <button 
                      onClick={handleOpenChat}
                      className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-blue-600 w-full text-left"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                        <MessageCircle className="w-3 h-3 text-blue-600" />
                        {chatUnreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 shadow-lg border border-white">
                            {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                          </span>
                        )}
                      </div>
                      Mensajes
                    </button>
                  </DropdownMenuItem>
                </>
              )}{(esCuidador || esEmpresa) && (
                <>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
                    <Link to="/mi-perfil-cuidador" className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-purple-600">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <UserRound className="w-3 h-3 text-purple-600" />
                      </div>                      {esEmpresa ? 'Mi perfil de empresa' : 'Mi perfil de cuidador'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                    <button 
                      onClick={handleOpenChat}
                      className="flex items-center gap-3 p-2 font-medium text-gray-700 hover:text-blue-600 w-full text-left"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
                        <MessageCircle className="w-3 h-3 text-blue-600" />
                        {chatUnreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 shadow-lg border border-white">
                            {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                          </span>
                        )}
                      </div>
                      Mensajes
                    </button>
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
            </DropdownMenuContent>          </DropdownMenu>
        )}
      </nav>      {/* Menú móvil overlay - solo para pantallas pequeñas */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] bg-black/50 backdrop-blur-sm z-40">
          <div className="bg-white w-full min-h-screen p-6 shadow-xl">
            <nav className="flex flex-col space-y-4">
              {/* Opciones principales */}
              {(!user || esCliente) && (
                <Link 
                  to="/cuidadores" 
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                  <span className="font-semibold">Buscar cuidadores</span>
                </Link>
              )}              {esCliente && (
                <>
                  <Link 
                    to="/empresas" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-700">Ver empresas</span>
                  </Link>
                  
                  <Link 
                    to="/mi-perfil-cuidador" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <ShieldCheck className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-gray-700">Quiero ser cuidador</span>
                  </Link>
                  
                  <Link 
                    to="/registro-empresa" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <Building2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-700">Soy una empresa</span>
                  </Link>
                </>
              )}              {/* Opciones principales para cuidadores en móvil */}
              {(esCuidador || esEmpresa) && (
                <>
                  <Link 
                    to="/reservas-recibidas" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Bookmark className="w-5 h-5" />
                    <span className="font-semibold">Reservas recibidas</span>
                  </Link>
                    <Link 
                    to="/notificaciones" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-700 hover:to-yellow-700"
                  >
                    <div className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-lg border border-orange-200">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold">Notificaciones</span>
                  </Link>
                </>
              )}

              {/* Opciones de usuario autenticado */}
              {user ? (
                <>
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
                          onClick={closeMenu}
                          className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300"
                        >
                          <PawPrint className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-700">Mis mascotas</span>
                        </Link>
                        
                        <Link 
                          to="/mis-reservas" 
                          onClick={closeMenu}
                          className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-xl transition-all duration-300"
                        >
                          <Calendar className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-700">Mis reservas</span>
                        </Link>
                          <Link 
                          to="/notificaciones" 
                          onClick={closeMenu}
                          className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 rounded-xl transition-all duration-300"
                        >
                          <div className="relative">
                            <Bell className="w-5 h-5 text-orange-600" />
                            {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-lg border border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                          </div>                          <span className="font-medium text-gray-700">Notificaciones</span>
                        </Link>
                        
                        <button 
                          onClick={handleOpenChat}
                          className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 w-full text-left"
                        >
                          <div className="relative">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                            {chatUnreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-lg border border-white">
                                {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">Mensajes</span>
                        </button>
                      </>
                    )}{(esCuidador || esEmpresa) && (
                      <>
                        <Link 
                          to="/mi-perfil-cuidador" 
                          onClick={closeMenu}
                          className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-300"
                        >
                          <UserRound className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-gray-700">
                            {esEmpresa ? 'Mi perfil de empresa' : 'Mi perfil de cuidador'}
                          </span>
                        </Link>
                          <button 
                          onClick={handleOpenChat}
                          className="flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 w-full text-left"
                        >
                          <div className="relative">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                            {chatUnreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-lg border border-white">
                                {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">Mensajes</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                      >
                        <LogOut className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-600">Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                  <button 
                    onClick={() => { openRegister(); closeMenu(); }}
                    className="w-full p-4 text-center font-semibold text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-300"
                  >
                    Registrarse
                  </button>
                  
                  <button 
                    onClick={() => { openLogin(); closeMenu(); }}
                    className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>      )}

      {/* Chat Modal - Renderizado con portal fuera del header */}
      {createPortal(
        <ChatModal 
          isOpen={isChatModalOpen} 
          onClose={() => setIsChatModalOpen(false)}
        />,
        document.body
      )}
    </header>
  )
}
