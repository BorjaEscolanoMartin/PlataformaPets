// Hook para usar el contexto de chat
import { useContext } from 'react';
import { ChatContext } from './chatContext';

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
