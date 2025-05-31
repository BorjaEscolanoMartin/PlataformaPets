import React from 'react';
import { useChat } from '../../context/useChat';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ChatList = ({ onChatSelect }) => {
    const { chats, activeChat, setActiveChat, loading, onlineUsers } = useChat();

    const handleChatClick = (chat) => {
        setActiveChat(chat);
        onChatSelect && onChatSelect();
    };

    const getChatDisplayInfo = (chat) => {
        if (chat.type === 'private') {
            // Para chats privados, mostrar info del otro participante
            return {
                name: chat.other_participant?.name || 'Usuario',
                avatar: chat.other_participant?.avatar,
                isOnline: onlineUsers.has(chat.other_participant?.id)
            };
        } else {
            // Para chats grupales
            return {
                name: chat.name || 'Chat grupal',
                avatar: null,
                isOnline: false
            };
        }
    };

    const formatMessageTime = (date) => {
        if (!date) return '';
        return formatDistanceToNow(new Date(date), { 
            addSuffix: true, 
            locale: es 
        });
    };    const getUnreadCount = () => {
        // Esta funcionalidad se puede implementar después
        return 0;
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Conversaciones
                </h2>
            </div>

            {/* Lista de chats */}
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <div className="text-2xl mb-2">💬</div>
                        <p className="text-sm">No tienes conversaciones aún</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {chats.map((chat) => {
                            const displayInfo = getChatDisplayInfo(chat);
                            const unreadCount = getUnreadCount();
                            const isActive = activeChat?.id === chat.id;

                            return (
                                <div
                                    key={chat.id}
                                    className={`
                                        p-4 cursor-pointer hover:bg-gray-50 transition-colors
                                        ${isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                                    `}
                                    onClick={() => handleChatClick(chat)}
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Avatar */}
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

                                        {/* Contenido del chat */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {displayInfo.name}
                                                </h3>
                                                <div className="flex items-center space-x-1">
                                                    {chat.latest_message && (
                                                        <span className="text-xs text-gray-500">
                                                            {formatMessageTime(chat.latest_message.created_at)}
                                                        </span>
                                                    )}
                                                    {unreadCount > 0 && (
                                                        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                            {unreadCount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {chat.latest_message && (
                                                <p className="text-sm text-gray-600 truncate mt-1">
                                                    {chat.latest_message.user?.name === 'Tú' ? 'Tú: ' : ''}
                                                    {chat.latest_message.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
