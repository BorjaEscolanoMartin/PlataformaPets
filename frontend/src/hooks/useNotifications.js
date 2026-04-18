import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'
import { getEcho } from '../lib/echo'

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    try {
      setLoading(true)
      const response = await api.get('/notifications/unread-count')
      setUnreadCount(response.data.count)
    } catch {
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

  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  // Refrescar al volver a la pestaña/ventana como red de seguridad frente a
  // eventos de Echo perdidos durante ventanas de reconexión del socket.
  useEffect(() => {
    if (!user) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchUnreadCount()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', fetchUnreadCount)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', fetchUnreadCount)
    }
  }, [user, fetchUnreadCount])

  // Escuchar notificaciones en tiempo real vía Echo
  useEffect(() => {
    if (!user) return
    const echo = getEcho()
    if (!echo) {
      console.warn('[useNotifications] Echo no inicializado')
      return
    }

    const channel = echo.private(`user.${user.id}`)

    const onNotification = (payload) => {
      const data = payload?.data ?? payload
      setUnreadCount(prev => prev + 1)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      if (data?.tipo?.startsWith('reserva_')) {
        queryClient.invalidateQueries({ queryKey: ['reservations'] })
      }
    }
    channel.listen('.notification.created', onNotification)

    // Fallback: tras reconectar el socket, refrescar el contador desde BBDD
    // (cubre el hueco en que puedan llegar eventos mientras el socket estaba
    // desconectado).
    const socket = echo.connector?.socket
    const onReconnect = () => { fetchUnreadCount() }
    socket?.on('reconnect', onReconnect)

    return () => {
      try { channel.stopListening('.notification.created') } catch { /* ignore */ }
      try { socket?.off('reconnect', onReconnect) } catch { /* ignore */ }
    }
  }, [user, queryClient, fetchUnreadCount])

  return {
    unreadCount,
    loading,
    fetchUnreadCount,
    resetUnreadCount,
    decrementUnreadCount
  }
}
