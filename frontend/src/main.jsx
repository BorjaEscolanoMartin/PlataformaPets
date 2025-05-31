import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ModalProvider> 
        <ChatProvider>
          <App />
        </ChatProvider>
      </ModalProvider>
    </AuthProvider>
  </StrictMode>
)

