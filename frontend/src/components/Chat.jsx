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
    return <div className="text-center p-4">Cargando chat...</div>;
  }

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <div className="mb-2 font-bold text-lg">Chat con usuario #{receiverId}</div>
      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-white rounded">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-1 ${msg.sender_id === authUserId ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-gray-200 px-2 py-1 rounded">{msg.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Escribe un mensaje"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Enviar</button>
      </form>
    </div>
  );
}
