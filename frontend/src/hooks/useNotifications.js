import { useState, useEffect } from 'react'
import api from '../lib/axios'
import { useAuth } from '../context/useAuth'

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    try {
      setLoading(true)
      const response = await api.get('/notifications/unread-count')
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error('Error fetching unread notifications count:', error)
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  const resetUnreadCount = () => {
    setUnreadCount(0)
  }

  const decrementUnreadCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  useEffect(() => {
    fetchUnreadCount()
  }, [user])

  return {
    unreadCount,
    loading,
    fetchUnreadCount,
    resetUnreadCount,
    decrementUnreadCount
  }
}
