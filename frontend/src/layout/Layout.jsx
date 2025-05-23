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
    <div className="min-h-screen bg-gray-100">
      <Header onLogin={openLogin} onRegister={openRegister} />
      <main className="pt-6 px-4">
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
