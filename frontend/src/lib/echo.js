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
  host: 'http://localhost:6001',
  authEndpoint: 'http://localhost:8000/broadcasting/auth',
  withCredentials: true,
  transports: ['websocket'],
  enabledTransports: ['ws', 'wss'],
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
        axios.post('http://localhost:8000/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name,
        }, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': decodeURIComponent(
              document.cookie.split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] || ''
            ),
          },
        })
        .then(response => callback(false, response.data))
        .catch(error => callback(true, error));
      }
    };
  }
});


window.Echo.connector.socket.on('error', (error) => {
  console.error('Socket error:', error);
});

window.Echo.connector.socket.on('connect_error', (error) => {
  console.error('Connect error:', error);
});

window.Echo.connector.socket.on('disconnect', (reason) => {
  console.warn('Socket disconnected:', reason);
});


