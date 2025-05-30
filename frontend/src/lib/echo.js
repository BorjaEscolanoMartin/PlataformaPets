import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configurar Pusher
window.Pusher = Pusher;

// Función para crear instancia de Echo solo cuando sea necesario
export const createEcho = (token = null) => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY || 'local',
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
        wsHost: window.location.hostname,
        wsPort: 6001,
        wssPort: 6001,
        forceTLS: false,
        encrypted: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
        auth: {
            headers
        }
    });
};

// Instancia por defecto (sin conectar automáticamente)
let echo = null;

export const getEcho = (token = null) => {
    if (!echo || token) {
        echo = createEcho(token);
    }
    return echo;
};

export default {
    getEcho,
    createEcho
};
