import React, { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import { useChat } from '../../context/useChat';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatModal = ({ isOpen, onClose }) => {
    const { activeChat, loadChats, markMessagesAsRead } = useChat();
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
    }, []);    // Cargar chats cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            // Siempre intentar recargar chats cuando se abre el modal
            loadChats();
        }
    }, [isOpen, loadChats]);    // Auto-hide chat list on mobile when chat is selected
    useEffect(() => {
        if (isMobile && activeChat) {
            setIsChatListVisible(false);
        }
    }, [activeChat, isMobile]);

    // Marcar mensajes como leídos cuando se selecciona un chat activo
    useEffect(() => {
        if (activeChat && isOpen) {
            markMessagesAsRead(activeChat.id);
        }
    }, [activeChat, isOpen, markMessagesAsRead]);    // No necesitamos refrescar el contador al cerrar el modal
    // ya que se resetea cuando se abre desde el header

    if (!isOpen) return null;    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-blue-900/30 backdrop-blur-sm flex items-start justify-center pt-20 p-4 z-[9999]">
            {/* Overlay */}
            <div 
                className="absolute inset-0"
                onClick={onClose}
            />
              {/* Modal */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-6xl h-[calc(100vh-6rem)] max-h-[80vh] flex overflow-hidden border border-blue-100 transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                {/* Header with close button */}
                <div className="absolute top-0 right-0 z-[70] p-4">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-200 flex items-center justify-center group shadow-lg border border-gray-200"
                    >
                        <X className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                </div>

                {/* Mobile menu toggle */}
                {isMobile && (
                    <div className="absolute top-0 left-0 z-[70] p-4">
                        <button
                            onClick={() => setIsChatListVisible(!isChatListVisible)}
                            className="w-10 h-10 rounded-full bg-white/80 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all duration-200 flex items-center justify-center shadow-lg border border-gray-200"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Chat Content */}
                <div className="flex w-full h-full">
                    {/* Lista de chats */}
                    <div className={`
                        ${isChatListVisible ? (isMobile ? 'w-full' : 'w-80') : 'w-0'} 
                        transition-all duration-300 overflow-hidden
                        border-r border-blue-200/50 bg-gradient-to-b from-blue-50/80 to-purple-50/80 backdrop-blur-sm
                        ${isMobile && isChatListVisible ? 'absolute inset-0 z-[65] rounded-3xl' : ''}
                    `}>
                        <div className="p-6 border-b border-blue-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-lg">💬</span>
                                </div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mensajes</h2>
                            </div>
                        </div>
                        <ChatList onChatSelect={() => isMobile && setIsChatListVisible(false)} />
                    </div>

                    {/* Ventana de chat */}
                    <div className={`
                        ${isChatListVisible && isMobile ? 'hidden' : 'flex-1'} 
                        flex flex-col bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm
                    `}>
                        {activeChat ? (
                            <ChatWindow 
                                onToggleChatList={() => setIsChatListVisible(!isChatListVisible)}
                                isChatListVisible={isChatListVisible}
                                isMobile={isMobile}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="mb-6">
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg border border-blue-200">
                                            <span className="text-4xl">💬</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                                        Selecciona una conversación
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                                        Elige un chat de la lista para comenzar a conversar con otros usuarios
                                    </p>
                                    {isMobile && (
                                        <button
                                            onClick={() => setIsChatListVisible(true)}
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Menu className="w-4 h-4" />
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
