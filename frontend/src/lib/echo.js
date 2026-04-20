import Echo from 'laravel-echo';
import io from 'socket.io-client';

// Stack actual del backend: laravel-echo-server (protocolo socket.io)
// Si se migra a Laravel Reverb habrá que cambiar a broadcaster 'pusher' con pusher-js.

let echoInstance = null;

export function getEcho() {
    if (echoInstance) return echoInstance;

    const token = localStorage.getItem('auth-token');
    if (!token) return null;

    const host = import.meta.env.VITE_ECHO_HOST || 'http://localhost:6001';
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        echoInstance = new Echo({
            broadcaster: 'socket.io',
            host,
            client: io,
            transports: ['websocket', 'polling'],
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            },
            authEndpoint: `${apiUrl}/broadcasting/auth`,
        });
    } catch (err) {
        console.error('[echo] init failed:', err);
        echoInstance = null;
    }

    return echoInstance;
}

export function resetEcho() {
    if (echoInstance) {
        try { echoInstance.disconnect(); } catch { /* ignore */ }
        echoInstance = null;
    }
}

export default { getEcho, resetEcho };
