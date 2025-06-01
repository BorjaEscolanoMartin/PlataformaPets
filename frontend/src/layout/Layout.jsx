import Header from '../components/Header'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import { useModal } from '../hooks/useModal'

export default function Layout({ children }) {
  const {
    showLogin,
    showRegister,
    openLogin,
    openRegister,
    closeModal
  } = useModal()
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%),
          url('/Fondo3.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30 pointer-events-none"></div>
        {/* Contenido principal */}
      <div className="relative z-10">
        <Header onLogin={openLogin} onRegister={openRegister} />
        <main>
          {children}
        </main>
        <Footer />
      </div>

      {showLogin && (
        <LoginModal
          onClose={closeModal}
          onSwitchToRegister={openRegister}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={closeModal}
          onSwitchToLogin={openLogin}
        />
      )}
    </div>
  )
}
