import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, Lock, Mail, Home } from 'lucide-react';
import { login } from '../services/apiService';
import { Logo } from '../components/Logo';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.isRegister) {
      setIsLogin(false);
    }
  }, [location.state]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await login(email);
      onLogin(user);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Restante do JSX, use handleLogin no submit
  return (
    // JSX original
  );
};

export default Auth;