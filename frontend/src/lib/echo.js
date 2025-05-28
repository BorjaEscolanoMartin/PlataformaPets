import Echo from 'laravel-echo';
import io from 'socket.io-client';
import axios from 'axios';

// 👉 Forzamos que Axios siempre envíe cookies
axios.defaults.withCredentials = true;

// 👉 Extraemos manualmente el token CSRF de las cookies y lo inyectamos en las cabeceras
const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
if (token) {
  axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token.split('=')[1]);
}

// 👉 Laravel Echo
window.io = io;

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: import.meta.env.VITE_ECHO_HOST || 'http://localhost:6001',
  authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  namespace: 'App.Events',
  auth: {
    headers: {
      'X-XSRF-TOKEN': decodeURIComponent(
        document.cookie.split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1] || ''
      ),
    },
  },

  // 👇 ESTA ES LA CLAVE: forzar el authorizer
  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        const token = document.cookie.split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
        
        if (!token) {
          console.error('No XSRF token found');
          return callback(true, 'No XSRF token');
        }

        axios.post('http://localhost:8000/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name,
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': decodeURIComponent(token),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log('✅ Canal autorizado:', channel.name, response.data);
          callback(false, response.data);
        })
        .catch(error => {
          console.error('❌ Error autorizando canal:', channel.name, error);
          callback(true, error);
        });
      }
    };
  }
});

// Eventos de conexión para debugging
window.Echo.connector.socket.on('connect', () => {
  console.log('✅ Socket conectado exitosamente');
});

window.Echo.connector.socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
});

window.Echo.connector.socket.on('connect_error', (error) => {
  console.error('❌ Connect error:', error);
});

window.Echo.connector.socket.on('disconnect', (reason) => {
  console.warn('⚠️ Socket disconnected:', reason);
});

window.Echo.connector.socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
});


