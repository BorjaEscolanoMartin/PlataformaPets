import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'

// Contexto para manejar el estado global de mensajes
const MessagesContext = createContext()

export const MessagesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    try {
      setLoading(true)
      const response = await api.get('/messages/unread-count')
      setUnreadCount(response.data.count)    } catch {
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }, [user])

  const resetUnreadCount = () => {
    setUnreadCount(0)
  }

  const decrementUnreadCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Función para actualizar el contador cuando se marcan mensajes como leídos
  const updateAfterRead = async () => {
    await fetchUnreadCount()
  }
  
  useEffect(() => {
    fetchUnreadCount()
  }, [user, fetchUnreadCount])

  const value = {
    unreadCount,
    loading,
    fetchUnreadCount,
    resetUnreadCount,
    decrementUnreadCount,
    updateAfterRead
  }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

export const useMessages = () => {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
}
