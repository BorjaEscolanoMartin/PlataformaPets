import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getEcho } from '../lib/echo';
import axios from '../lib/axios';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [echo, setEcho] = useState(null);    // Cargar chats del usuario
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
    }, [user]);    // Cargar mensajes de un chat específico
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
    }, []);// Marcar mensajes como leídos
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
    }, []);// Configurar Echo cuando el usuario se autentique
    useEffect(() => {
        if (token && user) {
            // Configurar axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Crear instancia de Echo con token
            const echoInstance = getEcho(token);
            setEcho(echoInstance);
            
            // Cargar chats cuando se configura Echo
            loadChats();
        } else {
            // Limpiar cuando no hay usuario autenticado
            setEcho(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token, user, loadChats]);    // Enviar mensaje
    const sendMessage = async (chatId, content, type = 'text') => {
        try {
            const response = await axios.post(`/chats/${chatId}/messages`, {
                content,
                type
            });
            
            // El mensaje se agregará automáticamente via broadcasting
            return response.data.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };    // Crear chat privado
    const createPrivateChat = async (otherUserId) => {
        console.log('🚀 createPrivateChat called with otherUserId:', otherUserId);
        console.log('👤 Current user:', user);
        console.log('🔑 Current token:', token ? 'Token exists' : 'No token');
        
        try {
            console.log('📡 Making POST request to /chats/private...');
            const response = await axios.post('/chats/private', {
                other_user_id: otherUserId
            });
            
            console.log('📨 Response received:', response);
            const newChat = response.data.data;
            console.log('💬 New chat data:', newChat);
            
            setChats(prev => {
                const exists = prev.find(chat => chat.id === newChat.id);
                if (exists) {
                    console.log('⚠️ Chat already exists, returning existing');
                    return prev;
                }
                console.log('✨ Adding new chat to list');
                return [newChat, ...prev];
            });
              
            console.log('✅ createPrivateChat completed successfully');
            return newChat;
        } catch (error) {
            console.error('❌ Error creating private chat:', error);
            console.error('❌ Error details:', error.response?.data);
            throw error;
        }
    };

    // Suscribirse a eventos de chat
    useEffect(() => {
        if (!user || !activeChat || !echo) return;

        const chatChannel = echo.private(`chat.${activeChat.id}`);
        
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

        return () => {
            echo.leave(`chat.${activeChat.id}`);
            echo.leave(`chat.${activeChat.id}.presence`);
        };
    }, [user, activeChat, echo]);    // Cargar mensajes cuando se selecciona un chat
    useEffect(() => {
        if (activeChat) {
            loadMessages(activeChat.id);
            markMessagesAsRead(activeChat.id);
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
