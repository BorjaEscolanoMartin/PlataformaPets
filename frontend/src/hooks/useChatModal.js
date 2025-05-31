import { useState } from 'react'
import { useMessages } from './useMessages.jsx'

export const useChatModal = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const { updateAfterRead } = useMessages()

  const openChatModal = () => {
    setIsChatModalOpen(true)
  }

  const closeChatModal = async () => {
    setIsChatModalOpen(false)
    // Actualizar el contador de mensajes no leídos cuando se cierre el modal
    await updateAfterRead()
  }

  return {
    isChatModalOpen,
    openChatModal,
    closeChatModal
  }
}
