import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Send, Lock, Clock, ArrowLeft, Download, MessageSquare, AlertCircle, Eye, EyeOff, Gavel, Scale, FileCheck, Shield } from 'lucide-react';
import { analyzeSentiment } from '../services/geminiService';
import { getAssemblyById, registerVote, getChatMessages } from '../services/apiService';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Assembly, User, VotePrivacy, AssemblyStatus } from '../types';

const VotingRoom: React.FC<{ user: User }> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState<any>(null);

  useEffect(() => {
    const loadAssembly = async () => {
      try {
        const data = await getAssemblyById(id!);
        setAssembly(data);
        const chatMsgs = await getChatMessages(id!);
        setMessages(chatMsgs);
      } catch (error) {
        console.error(error);
      }
    };
    loadAssembly();

    // Conectar WebSocket
    const socket = new SockJS('http://localhost:8080/ws-votzz');
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe(`/topic/chat/${id}`, (msg) => {
        const newMsg = JSON.parse(msg.body);
        setMessages(prev => [...prev, newMsg]);
      });
    });
    setStompClient(client);

    return () => client.disconnect();
  }, [id]);

  const handleSendMessage = () => {
    if (stompClient && newMessage) {
      stompClient.send(`/app/chat/${id}/send`, {}, JSON.stringify({ content: newMessage, senderName: user.name }));
      setNewMessage('');
    }
  };

  const handleVote = async (option: string) => {
    try {
      await registerVote(id!, user.id, option);
      // Atualize assembly localmente ou recarregue
    } catch (error) {
      console.error(error);
    }
  };

  // Restante do JSX permanece igual, integre handleVote e chat
  // Exemplo para chat input:
  // <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
  // <button onClick={handleSendMessage}>Enviar</button>

  return (
    // JSX original, com dados de assembly e messages reais
  );
};

export default VotingRoom;