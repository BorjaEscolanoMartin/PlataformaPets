import React, { useState } from 'react';
import { useChat } from '../../context/useChat';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { Card } from '../ui/card';

const ChatContainer = () => {
    const { activeChat } = useChat();
    const [isChatListVisible, setIsChatListVisible] = useState(true);

    return (
        <div className="h-full flex bg-gray-50">
            {/* Lista de chats */}
            <div className={`
                ${isChatListVisible ? 'w-80' : 'w-0'} 
                transition-all duration-300 overflow-hidden
                border-r border-gray-200 bg-white
            `}>
                <ChatList onChatSelect={() => setIsChatListVisible(false)} />
            </div>

            {/* Ventana de chat */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <ChatWindow 
                        onToggleChatList={() => setIsChatListVisible(!isChatListVisible)}
                        isChatListVisible={isChatListVisible}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <Card className="p-8 text-center">
                            <div className="text-gray-500">
                                <div className="text-4xl mb-4">💬</div>
                                <h3 className="text-lg font-medium mb-2">
                                    Selecciona una conversación
                                </h3>
                                <p className="text-sm">
                                    Elige una conversación de la lista para comenzar a chatear
                                </p>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatContainer;
