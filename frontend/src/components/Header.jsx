import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useModal } from '../hooks/useModal'
import { useNotifications } from '../hooks/useNotifications'
import { useChatUnreadCount } from '../hooks/useChatUnreadCount'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import ChatModal from './chat/ChatModal'
import UserMenu from './header/UserMenu'
import MobileNav from './header/MobileNav'
import { Button } from '@/components/ui/button'
import {
  PawPrint,
  Building2,
  ShieldCheck,
  Search,
  Bell,
  Bookmark,
  Menu,
  X,
} from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const { openLogin, openRegister } = useModal()
  const { unreadCount, resetUnreadCount: resetNotificationsCount } = useNotifications()
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
    resetUnreadCount()
    setIsChatModalOpen(true)
    setIsMenuOpen(false)
  }

  const closeMenu = () => setIsMenuOpen(false)

  const esCliente = user?.role === 'cliente'
  const esCuidador = user?.role === 'cuidador'
  const esEmpresa = user?.role === 'empresa'

  return (
    <header className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm">
      <Link to="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 hover:scale-105 transition-transform duration-300">
        <div className="w-12 h-12">
          <img
            src="/LogoWeb-sinfondo.png"
            alt="Pet Hosting Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center rounded-xl" style={{ display: 'none' }}>
            <PawPrint className="w-6 h-6 text-white" />
          </div>
        </div>
        <span className="hidden md:inline">Pets</span>
        <span className="md:hidden">Pets</span>
      </Link>

      <button
        className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-sm relative">
        {(!user || esCliente) && (
          <Button variant="default" size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-0 mr-1 xl:mr-2">
            <Link to="/cuidadores" className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3">
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Buscar cuidadores</span>
              <span className="md:hidden">Buscar</span>
            </Link>
          </Button>
        )}

        {esCliente && (
          <>
            <Button variant="ghost" size="sm" asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 transition-all duration-300">
              <Link to="/empresas" className="flex items-center gap-1 xl:gap-2 font-semibold text-gray-700 hover:text-purple-600 px-2 xl:px-3">
                <Building2 className="w-4 h-4" />
                <span className="hidden md:inline">Ver empresas</span>
                <span className="md:hidden">Empresas</span>
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild className="border-2 border-orange-300 text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
              <Link to="/mi-perfil-cuidador" className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3">
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden xl:inline">Quiero ser cuidador</span>
                <span className="xl:hidden">Ser cuidador</span>
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild className="border-2 border-green-300 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-green-500 transition-all duration-300 shadow-md hover:shadow-lg">
              <Link to="/registro-empresa" className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3">
                <Building2 className="w-4 h-4" />
                <span className="hidden xl:inline">Soy una empresa</span>
                <span className="xl:hidden">Empresa</span>
              </Link>
            </Button>
          </>
        )}

        {(esCuidador || esEmpresa) && (
          <>
            <Button variant="outline" size="sm" asChild className="border-2 border-indigo-300 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg">
              <Link to="/reservas-recibidas" className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3">
                <Bookmark className="w-4 h-4" />
                <span className="hidden md:inline">Reservas recibidas</span>
                <span className="md:hidden">Reservas</span>
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild className="border-2 border-orange-300 text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
              <Link to="/notificaciones" onClick={resetNotificationsCount} className="flex items-center gap-1 xl:gap-2 font-semibold px-2 xl:px-3 relative">
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
        )}

        {!user ? (
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
          <UserMenu
            user={user}
            esCliente={esCliente}
            esCuidador={esCuidador}
            esEmpresa={esEmpresa}
            unreadCount={unreadCount}
            chatUnreadCount={chatUnreadCount}
            onOpenChat={handleOpenChat}
            onOpenNotifications={resetNotificationsCount}
            onLogout={handleLogout}
          />
        )}
      </nav>

      {isMenuOpen && (
        <MobileNav
          user={user}
          esCliente={esCliente}
          esCuidador={esCuidador}
          esEmpresa={esEmpresa}
          unreadCount={unreadCount}
          chatUnreadCount={chatUnreadCount}
          onOpenChat={handleOpenChat}
          onOpenNotifications={resetNotificationsCount}
          onLogout={handleLogout}
          onOpenLogin={openLogin}
          onOpenRegister={openRegister}
          onClose={closeMenu}
        />
      )}

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
