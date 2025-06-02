import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getEcho } from '../lib/echo';
import axios from '../lib/axios';
import { ChatContext } from './chatContext';

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [echo, setEcho] = useState(null);

    // Cargar chats del usuario
    const loadChats = useCallback(async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const response = await axios.get('/chats');
            setChats(response.data.data);
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Cargar mensajes de un chat específico
    const loadMessages = useCallback(async (chatId) => {
        try {
            const response = await axios.get(`/chats/${chatId}/messages`);
            const responseData = response.data.data;
            
            // Manejar tanto arrays directos como objetos paginados
            let messagesData;
            if (Array.isArray(responseData)) {
                messagesData = responseData;
            } else if (responseData && Array.isArray(responseData.data)) {
                // Estructura paginada de Laravel
                messagesData = responseData.data;
            } else {
                messagesData = [];
            }
            
            setMessages(prev => ({
                ...prev,
                [chatId]: messagesData
            }));
        } catch (error) {
            console.error('Error loading messages:', error);
            // En caso de error, asegurar que tenemos un array vacío
            setMessages(prev => ({
                ...prev,
                [chatId]: []
            }));
        }
    }, []);

    // Marcar mensajes como leídos
    const markMessagesAsRead = useCallback(async (chatId) => {
        try {
            await axios.patch(`/chats/${chatId}/messages/read-all`);
            
            // Actualizar estado local solo si prev[chatId] existe y es un array
            setMessages(prev => ({
                ...prev,
                [chatId]: Array.isArray(prev[chatId]) 
                    ? prev[chatId].map(msg => ({ ...msg, read_at: new Date().toISOString() }))
                    : prev[chatId] || []
            }));
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }, []);    // Configurar Echo cuando el usuario se autentique
    useEffect(() => {
        if (token && user) {
            // Configurar axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Crear instancia de Echo con token
            try {
                const echoInstance = getEcho(token);
                
                // Solo setear Echo si se creó exitosamente
                if (echoInstance !== false && echoInstance !== null) {
                    setEcho(echoInstance);
                } else {
                    setEcho(null);
                }
            } catch (error) {
                console.error('Error al crear Echo:', error);
                setEcho(null);
            }
            
            // Cargar chats cuando se configura Echo (o falla)
            loadChats();
        } else {
            // Limpiar cuando no hay usuario autenticado
            setChats([]);
            setActiveChat(null);
            setMessages({});
            setEcho(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [user, token, loadChats]);// Cargar chats inmediatamente cuando el usuario está autenticado
    useEffect(() => {
        if (user && token) {
            loadChats();
        }
    }, [user, token, loadChats]);// Enviar mensaje
    const sendMessage = async (chatId, content, type = 'text') => {
        try {
            const response = await axios.post(`/chats/${chatId}/messages`, {
                content,
                type
            });
            
            // Actualizar mensajes inmediatamente (optimistic update)
            const newMessage = response.data.data;
            setMessages(prev => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), newMessage]
            }));
            
            // Actualizar último mensaje en la lista de chats
            setChats(prev => prev.map(chat => 
                chat.id === parseInt(chatId) 
                    ? { ...chat, latest_message: newMessage }
                    : chat
            ));
            
            return newMessage;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };    // Crear chat privado
    const createPrivateChat = async (otherUserId) => {
        try {
            const response = await axios.post('/chats/private', {
                other_user_id: otherUserId
            });
            
            const newChat = response.data.data;
            
            // Actualizar la lista de chats
            setChats(prev => {
                const existingIndex = prev.findIndex(chat => chat.id === newChat.id);
                if (existingIndex !== -1) {
                    // Reemplazar el chat existente con los datos actualizados
                    const updatedChats = [...prev];
                    updatedChats[existingIndex] = newChat;
                    return updatedChats;
                }
                return [newChat, ...prev];
            });
              
            return newChat;
        } catch (error) {
            console.error('Error creating private chat:', error);
            throw error;
        }
    };// Suscribirse a eventos de chat
    useEffect(() => {
        if (!user || !activeChat || !echo) {
            return;
        }

        try {
            const chatChannel = echo.private(`chat.${activeChat.id}`);
            
            // Agregar listeners para eventos del canal
            chatChannel.subscribed(() => {
                // Canal suscrito exitosamente
            });

            chatChannel.error((error) => {
                console.error('Error al suscribirse al canal:', error);
            });
            
            // Escuchar nuevos mensajes
            chatChannel.listen('.message.sent', (e) => {
                const newMessage = e.message;
                setMessages(prev => ({
                    ...prev,
                    [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
                }));

                // Actualizar último mensaje en la lista de chats
                setChats(prev => prev.map(chat => 
                    chat.id === activeChat.id 
                        ? { ...chat, latest_message: newMessage }
                        : chat
                ));
            });

            // Suscribirse al canal de presencia para ver usuarios online
            const presenceChannel = echo.join(`chat.${activeChat.id}.presence`);
            
            presenceChannel.here((users) => {
                setOnlineUsers(new Set(users.map(u => u.id)));
            });

            presenceChannel.joining((user) => {
                setOnlineUsers(prev => new Set([...prev, user.id]));
            });

            presenceChannel.leaving((user) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(user.id);
                    return newSet;
                });
            });

            presenceChannel.error((error) => {
                console.error('Error en canal de presencia:', error);
            });

            return () => {
                try {
                    echo.leave(`chat.${activeChat.id}`);
                    echo.leave(`chat.${activeChat.id}.presence`);
                } catch (error) {
                    console.error('Error al desconectarse:', error);
                }
            };
        } catch (error) {
            console.error('Error general al configurar eventos de chat:', error);
        }
    }, [user, activeChat, echo]);// Cargar mensajes cuando se selecciona un chat
    useEffect(() => {
        if (activeChat) {
            loadMessages(activeChat.id);
            markMessagesAsRead(activeChat.id);
            
            // Agregar polling como fallback si WebSockets fallan
            const pollInterval = setInterval(() => {
                loadMessages(activeChat.id);
            }, 2000); // Polling cada 2 segundos
            
            return () => clearInterval(pollInterval);
        }
    }, [activeChat, loadMessages, markMessagesAsRead]);

    const value = {
        chats,
        activeChat,
        setActiveChat,
        messages: messages[activeChat?.id] || [],
        loading,
        onlineUsers,
        sendMessage,
        createPrivateChat,
        markMessagesAsRead,
        loadChats,
        loadMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
