import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';

export default function ChatPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💬 Chat</h1>
          <p className="text-gray-600">Mantén una conversación en tiempo real</p>
        </div>

        {/* Componente Chat */}
        <Chat receiverId={parseInt(id)} />
      </div>
    </div>
  );
}
