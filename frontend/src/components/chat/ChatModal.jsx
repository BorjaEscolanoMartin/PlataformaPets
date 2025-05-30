import React, { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatModal = ({ isOpen, onClose }) => {
    const { activeChat } = useChat();
    const [isChatListVisible, setIsChatListVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsChatListVisible(false);
            } else {
                setIsChatListVisible(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Auto-hide chat list on mobile when chat is selected
    useEffect(() => {
        if (isMobile && activeChat) {
            setIsChatListVisible(false);
        }
    }, [activeChat, isMobile]);

    if (!isOpen) return null;    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-5rem)] flex overflow-hidden">
                {/* Header with close button */}
                <div className="absolute top-0 right-0 z-[70] p-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Mobile menu toggle */}
                {isMobile && (
                    <div className="absolute top-0 left-0 z-[70] p-4">
                        <button
                            onClick={() => setIsChatListVisible(!isChatListVisible)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Menu className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                )}

                {/* Chat Content */}
                <div className="flex w-full h-full">
                    {/* Lista de chats */}
                    <div className={`
                        ${isChatListVisible ? (isMobile ? 'w-full' : 'w-80') : 'w-0'} 
                        transition-all duration-300 overflow-hidden
                        border-r border-gray-200 bg-gray-50
                        ${isMobile && isChatListVisible ? 'absolute inset-0 z-[65]' : ''}
                    `}>
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Mensajes</h2>
                        </div>
                        <ChatList onChatSelect={() => isMobile && setIsChatListVisible(false)} />
                    </div>

                    {/* Ventana de chat */}
                    <div className={`
                        ${isChatListVisible && isMobile ? 'hidden' : 'flex-1'} 
                        flex flex-col
                    `}>
                        {activeChat ? (
                            <ChatWindow 
                                onToggleChatList={() => setIsChatListVisible(!isChatListVisible)}
                                isChatListVisible={isChatListVisible}
                                isMobile={isMobile}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-gray-50">
                                <div className="text-center p-8">
                                    <div className="text-gray-400 mb-4">
                                        <div className="text-6xl">💬</div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                                        Selecciona una conversación
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Elige un chat de la lista para comenzar a conversar
                                    </p>
                                    {isMobile && (
                                        <button
                                            onClick={() => setIsChatListVisible(true)}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Ver conversaciones
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
