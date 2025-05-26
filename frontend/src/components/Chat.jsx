import { useEffect, useState } from 'react';
import api from '../lib/axios';
import axios from 'axios';
import '../lib/echo';
console.log('[DEBUG] Echo:', window.Echo);

export default function Chat({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [authUserId, setAuthUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
        const res = await api.get('/user');
        setAuthUserId(res.data.id);
        console.log('[Chat.jsx] Usuario autenticado:', res.data);
      } catch (err) {
        console.error('Error obteniendo usuario:', err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!receiverId) return;

    api.get(`/messages/${receiverId}`)
      .then(res => {
        setMessages(res.data);
        console.log('[Chat.jsx] Mensajes iniciales cargados.');
      })
      .catch(err => console.error('Error cargando mensajes:', err));
  }, [receiverId]);

  useEffect(() => {
    if (!authUserId) return;

    const channelName = `private-chat.${authUserId}`;
    console.log(`🛰️ Suscribiéndose al canal: ${channelName}`);

    window.Echo.private(channelName)
      .listen('.MessageSent', (e) => {
        console.log('[Echo] Evento recibido:', e);
        setMessages((prev) => [...prev, e]);
      });
      window.Echo.connector.socket.on('error', (error) => {
        console.error('Error en la conexión socket:', error);
      });


    return () => {
      console.log(`🧹 Saliendo del canal: ${channelName}`);
      window.Echo.leave(channelName);
    };
  }, [authUserId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await api.post('/messages', {
        receiver_id: receiverId,
        content,
      });

      // 👇 Esta es la forma correcta para tu caso
      setMessages((prev) => [...prev, res.data]);

      setContent('');

    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  };
  if (!authUserId) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 text-center max-w-md mx-auto">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Iniciando chat...</h3>
        <p className="text-gray-600">Conectando con el sistema de mensajería</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 max-w-2xl mx-auto">
      {/* Header del chat */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">💬</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Chat en vivo</h2>
            <p className="text-blue-100 text-sm">Usuario #{receiverId}</p>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="h-80 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 mb-4 bg-gradient-to-b from-gray-50 to-white space-y-3 scroll-smooth">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <p className="font-medium">No hay mensajes aún</p>
            <p className="text-sm">¡Envía el primer mensaje para iniciar la conversación!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender_id === authUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                msg.sender_id === authUserId 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
              }`}>
                <p className="text-sm font-medium break-words">{msg.content}</p>
                <div className={`text-xs mt-1 ${
                  msg.sender_id === authUserId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.sender_id === authUserId ? 'Tú' : 'Usuario'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario de envío */}
      <form onSubmit={sendMessage} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-sm font-medium"
            placeholder="Escribe tu mensaje aquí..."
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <span className="text-lg">✏️</span>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={!content.trim()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-lg">🚀</span>
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
}
