import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Menu, Send, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ChatWindow = ({ 
    onToggleChatList, 
    isChatListVisible, 
    isMobile = false 
}) => {
    const { activeChat, messages, sendMessage, onlineUsers } = useChat();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll al final cuando llegan nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            await sendMessage(activeChat.id, newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            // Aquí podrías mostrar una notificación de error
        } finally {
            setSending(false);
        }
    };

    const getChatDisplayInfo = () => {
        if (activeChat.type === 'private') {
            return {
                name: activeChat.other_participant?.name || 'Usuario',
                avatar: activeChat.other_participant?.avatar,
                isOnline: onlineUsers.has(activeChat.other_participant?.id)
            };
        } else {
            return {
                name: activeChat.name || 'Chat grupal',
                avatar: null,
                isOnline: false
            };
        }
    };

    const formatMessageTime = (date) => {
        return formatDistanceToNow(new Date(date), { 
            addSuffix: true, 
            locale: es 
        });
    };

    const displayInfo = getChatDisplayInfo();

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header del chat */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">                    {/* Botón para mostrar/ocultar lista de chats */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleChatList}
                        className={isMobile ? "" : "lg:hidden"}
                    >
                        {isChatListVisible ? <ArrowLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>

                    {/* Info del chat */}
                    <div className="relative">
                        <Avatar className="h-10 w-10">
                            <AvatarImage 
                                src={displayInfo.avatar} 
                                alt={displayInfo.name} 
                            />
                            <AvatarFallback>
                                {displayInfo.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {displayInfo.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {displayInfo.name}
                        </h2>
                        {displayInfo.isOnline && (
                            <p className="text-sm text-green-600">En línea</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-4">👋</div>
                            <p className="text-sm">
                                ¡Comienza la conversación enviando un mensaje!
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.user_id === user?.id;
                        
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex max-w-xs lg:max-w-md space-x-2 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    {!isOwnMessage && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage 
                                                src={message.user?.avatar} 
                                                alt={message.user?.name} 
                                            />
                                            <AvatarFallback>
                                                {message.user?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    
                                    <div className={`
                                        rounded-lg p-3 
                                        ${isOwnMessage 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-100 text-gray-900'
                                        }
                                    `}>
                                        <p className="text-sm">{message.content}</p>
                                        <div className={`
                                            text-xs mt-1 
                                            ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}
                                        `}>
                                            {formatMessageTime(message.created_at)}
                                            {isOwnMessage && message.read_at && (
                                                <span className="ml-1">✓✓</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Área de entrada de mensaje */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={sending}
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2"
                    >
                        {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
