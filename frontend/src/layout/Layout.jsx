import { useState } from 'react'
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'

export default function Layout({ children }) {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleLoginOpen = () => {
    setShowRegister(false)
    setShowLogin(true)
  }

  const handleRegisterOpen = () => {
    setShowLogin(false)
    setShowRegister(true)
  }

  const handleClose = () => {
    setShowLogin(false)
    setShowRegister(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogin={handleLoginOpen} onRegister={handleRegisterOpen} />
      <main className="pt-6 px-4">
        {children}
      </main>

      {showLogin && (
        <LoginModal
          onClose={handleClose}
          onSwitchToRegister={handleRegisterOpen}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={handleClose}
          onSwitchToLogin={handleLoginOpen}
        />
      )}
    </div>
  )
}

