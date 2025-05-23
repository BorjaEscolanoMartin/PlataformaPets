import { createContext, useState } from 'react'

export const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const openLogin = () => {
    setShowRegister(false)
    setShowLogin(true)
  }

  const openRegister = () => {
    setShowLogin(false)
    setShowRegister(true)
  }

  const closeModal = () => {
    setShowLogin(false)
    setShowRegister(false)
  }

  return (
    <ModalContext.Provider value={{
      showLogin,
      showRegister,
      openLogin,
      openRegister,
      closeModal
    }}>
      {children}
    </ModalContext.Provider>
  )
}
