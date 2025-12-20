import React, { useState, useEffect } from 'react';
import { Landmark, BarChart2, CheckSquare, Megaphone, Calendar as CalendarIcon, Plus, Clock, AlertCircle, FileText, UserCheck, Search, CheckCircle, ChevronRight, ShieldCheck, Bell, Target, Eye } from 'lucide-react';
import { getPolls, getAnnouncements, createAnnouncement } from '../services/apiService';
import { Poll, Announcement, User, GovernanceActivity } from '../types';

interface GovernanceProps {
  user: User | null;
}

const Governance: React.FC<GovernanceProps> = ({ user }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getPolls().then(setPolls).catch(console.error);
    getAnnouncements().then(setAnnouncements).catch(console.error);
  }, []);

  const handleCreateAnnouncement = async (data: any) => {
    try {
      const newAnn = await createAnnouncement(data);
      setAnnouncements(prev => [...prev, newAnn]);
    } catch (error) {
      console.error(error);
    }
  };

  // Restante do JSX, use handleCreateAnnouncement
  return (
    // JSX original com dados reais
  );
};

export default Governance;