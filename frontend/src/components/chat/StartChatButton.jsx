import React, { useState } from 'react';
import { useChat } from '../../context/useChat';
import { Button } from '../ui/button';
import { MessageCircle } from 'lucide-react';
import ChatModal from './ChatModal';

const StartChatButton = ({ userId, className = '' }) => {
    const { createPrivateChat, setActiveChat } = useChat();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);    const handleStartChat = async () => {
        try {
            setIsCreatingChat(true);
            const chat = await createPrivateChat(userId);
            setActiveChat(chat);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error starting chat:', error);
            alert(`Error al crear chat: ${error.message}`);
        } finally {
            setIsCreatingChat(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={handleStartChat}
                variant="outline"
                size="sm"
                disabled={isCreatingChat}
                className={`flex items-center space-x-2 ${className}`}
            >
                <MessageCircle className="h-4 w-4" />
                <span>{isCreatingChat ? 'Iniciando...' : 'Enviar mensaje'}</span>
            </Button>

            <ChatModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
            />
        </>
    );
};

export default StartChatButton;
