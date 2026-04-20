import { useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'
import { getEcho } from '../lib/echo'

export const useChatUnreadCount = () => {
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

  const incrementUnreadCount = () => {
    setUnreadCount(prev => prev + 1)
  }

  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  // Echo: escuchar mensajes entrantes en el canal personal del usuario.
  // MessageSent emite a `user.{recipientId}` sólo para destinatarios distintos
  // al emisor, así que cualquier mensaje que llegue aquí es para nosotros.
  useEffect(() => {
    if (!user) return
    const echo = getEcho()
    if (!echo) return

    const channel = echo.private(`user.${user.id}`)
    const onMessage = () => {
      setUnreadCount(prev => prev + 1)
    }
    channel.listen('.message.sent', onMessage)

    return () => {
      try { channel.stopListening('.message.sent') } catch { /* ignore */ }
    }
  }, [user])

  return {
    unreadCount,
    loading,
    fetchUnreadCount,
    resetUnreadCount,
    decrementUnreadCount,
    incrementUnreadCount
  }
}
