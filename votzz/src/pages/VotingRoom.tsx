import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { getAssemblyById, getChatMessages } from '../services/apiService';
import { Assembly, User, ChatMessage } from '../types';

const VotingRoom: React.FC<{ user: User }> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);

  useEffect(() => {
    if (!id) return;

    getAssemblyById(id).then(setAssembly);
    getChatMessages(id).then(setMessages);

    const socket = new SockJS('http://localhost:8080/ws-votzz');
    const client = Stomp.over(socket);
    
    client.connect({}, () => {
      client.subscribe(`/topic/chat/${id}`, (msg) => {
        const receivedMsg: ChatMessage = JSON.parse(msg.body);
        setMessages(prev => [...prev, receivedMsg]);
      });
    });
    setStompClient(client);

    return () => {
      if (client.connected) client.disconnect(() => {});
    };
  }, [id]);

  const handleSendMessage = () => {
    if (stompClient?.connected && newMessage.trim()) {
      stompClient.send(`/app/chat/${id}/send`, {}, JSON.stringify({ 
        content: newMessage, 
        senderName: user.name 
      }));
      setNewMessage('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{assembly?.titulo}</h1>
      <div className="h-64 overflow-y-auto border p-4 my-4 bg-white">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold">{m.senderName}: </span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">Enviar</button>
      </div>
    </div>
  );
};

export default VotingRoom;