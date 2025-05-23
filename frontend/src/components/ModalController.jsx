import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'

export default function ModalController() {
  const [modal, setModal] = useState(null) // null | 'login' | 'register'

  return (
    <>
      <header className="p-4 flex justify-end">
        <button onClick={() => setModal('login')} className="text-blue-600 hover:underline">Iniciar sesión</button>
        <button onClick={() => setModal('register')} className="ml-4 text-blue-600 hover:underline">Registrarse</button>
      </header>

      {modal === 'login' && <LoginModal onClose={() => setModal(null)} onSwitch={() => setModal('register')} />}
      {modal === 'register' && <RegisterModal onClose={() => setModal(null)} onSwitch={() => setModal('login')} />}
    </>
  )
}