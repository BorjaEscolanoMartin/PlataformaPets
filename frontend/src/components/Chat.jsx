import { useEffect, useState } from 'react';
import api from '../lib/axios'; // tu instancia de Axios

export default function Chat({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  // Obtener la cookie CSRF al cargar
  useEffect(() => {
    api.get('/sanctum/csrf-cookie');
  }, []);

  // Cargar mensajes del chat
  useEffect(() => {
    if (!receiverId) return;

    api.get(`/messages/${receiverId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [receiverId]);

  // Enviar mensaje
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/messages', {
        receiver_id: receiverId,
        content,
      });
      setMessages(prev => [...prev, res.data]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <div className="mb-2 font-bold text-lg">Chat con usuario #{receiverId}</div>
      <div className="h-64 overflow-y-auto border p-2 mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-1 ${msg.sender_id === receiverId ? 'text-left' : 'text-right'}`}>
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
