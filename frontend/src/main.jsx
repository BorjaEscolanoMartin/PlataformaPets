import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import { ChatProvider } from './context/ChatContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './components/ToastContainer.jsx'
import ConfirmModal from './components/ConfirmModal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
