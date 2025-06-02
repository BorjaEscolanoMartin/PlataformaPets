import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configurar Pusher
window.Pusher = Pusher;

// Función simplificada para deshabilitar WebSocket y evitar errores
export const createEcho = () => {
    // WebSocket deshabilitado en desarrollo, usando solo polling HTTP
    
    // Retornar null para indicar que no hay WebSocket disponible
    // El ChatContext usará polling como fallback
    return null;
};

export const getEcho = () => {
    return null;
};

export default {
    getEcho,
    createEcho
};
