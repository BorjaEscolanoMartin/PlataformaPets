import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configurar Pusher
window.Pusher = Pusher;

// Función simplificada para deshabilitar WebSocket y evitar errores
export const createEcho = () => {
    console.log('🔧 WebSocket deshabilitado en desarrollo, usando solo polling HTTP');
    
    // Retornar null para indicar que no hay WebSocket disponible
    // El ChatContext usará polling como fallback
    return null;
};

export const getEcho = () => {
    console.log('🔧 getEcho llamado - WebSocket deshabilitado, retornando null');
    return null;
};

export default {
    getEcho,
    createEcho
};
