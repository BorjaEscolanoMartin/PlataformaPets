import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useChat } from '../../context/useChat';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/button';
import { MessageCircle } from 'lucide-react';
import ChatModal from './ChatModal';

const StartChatButton = ({ userId, className = '' }) => {
    const { createPrivateChat, setActiveChat } = useChat();
    const { error: showError } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);const handleStartChat = async () => {
        try {
            setIsCreatingChat(true);
            const chat = await createPrivateChat(userId);
            setActiveChat(chat);
            setIsModalOpen(true);        } catch (error) {
            showError(`Error al crear chat: ${error.message}`);
        } finally {
            setIsCreatingChat(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };    return (
        <>
            <Button
                onClick={handleStartChat}
                disabled={isCreatingChat}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                           text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl 
                           transform hover:scale-[1.02] transition-all duration-300 
                           flex items-center justify-center space-x-2 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
            >
                <MessageCircle className="h-5 w-5" />
                <span>{isCreatingChat ? 'Iniciando...' : 'Enviar mensaje'}</span>
            </Button>

            {isModalOpen && createPortal(
                <ChatModal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal}
                />,
                document.body
            )}
        </>
    );
};

export default StartChatButton;
