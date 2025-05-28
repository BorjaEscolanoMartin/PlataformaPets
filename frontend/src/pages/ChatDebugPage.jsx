import DebugChat from '../components/DebugChat';
import { Link } from 'react-router-dom';

export default function ChatDebugPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🛠️ Modo Debug Chat</h1>
          
          <Link to="/chat" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
            ← Volver a Chat
          </Link>
        </div>
        
        <DebugChat />
      </div>
    </div>
  );
}
