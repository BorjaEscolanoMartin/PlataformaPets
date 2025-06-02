import { createContext, useState, useCallback } from 'react'

export const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null)

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
  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmModal({
        message,
        onConfirm: () => {
          setConfirmModal(null)
          resolve(true)
        },
        onCancel: () => {
          setConfirmModal(null)
          resolve(false)
        }
      })
    })
  }, [])

  const hideConfirm = useCallback(() => {
    setConfirmModal(null)
  }, [])

  return (
    <ModalContext.Provider value={{
      showLogin,
      showRegister,
      confirmModal,
      openLogin,
      openRegister,
      closeModal,
      showConfirm,
      hideConfirm
    }}>
      {children}
    </ModalContext.Provider>
  )
}
