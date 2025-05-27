import Header from '../components/Header'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header onLogin={openLogin} onRegister={openRegister} />
      <main>
        {children}
      </main>

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
