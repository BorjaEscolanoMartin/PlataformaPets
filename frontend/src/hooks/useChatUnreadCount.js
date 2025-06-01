import { useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'

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
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error('Error fetching unread messages count:', error)
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
  }, [user, fetchUnreadCount])

  return {
    unreadCount,
    loading,
    fetchUnreadCount,
    resetUnreadCount,
    decrementUnreadCount,
    incrementUnreadCount
  }
}
