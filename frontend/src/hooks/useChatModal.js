import { useState } from 'react'
import { useChatUnreadCount } from './useChatUnreadCount'

export const useChatModal = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const { resetUnreadCount } = useChatUnreadCount()

  const openChatModal = () => {
    setIsChatModalOpen(true)
  }

  const closeChatModal = () => {
    setIsChatModalOpen(false)
    // Resetear el contador de mensajes no leídos cuando se cierre el modal
    resetUnreadCount()
  }

  return {
    isChatModalOpen,
    openChatModal,
    closeChatModal
  }
}
