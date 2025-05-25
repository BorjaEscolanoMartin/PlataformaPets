import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext' 
import './lib/echo';
// Importamos el nuevo contexto

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ModalProvider> 
        <App />
      </ModalProvider>
    </AuthProvider>
  </StrictMode>
)

