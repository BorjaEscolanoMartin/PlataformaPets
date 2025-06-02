import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import { ChatProvider } from './context/ChatContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './components/ToastContainer.jsx'
import ConfirmModal from './components/ConfirmModal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ModalProvider> 
        <ToastProvider>
          <ChatProvider>
            <App />
            <ToastContainer />
            <ConfirmModal />
          </ChatProvider>
        </ToastProvider>
      </ModalProvider>
    </AuthProvider>
  </StrictMode>
)

