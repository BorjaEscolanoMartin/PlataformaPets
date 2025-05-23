import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';

export default function ChatPage() {
  const { id } = useParams();

  return (
    <div className="mt-4">
      <Chat receiverId={parseInt(id)} />
    </div>
  );
}
