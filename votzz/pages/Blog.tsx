import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// REMOVIDO: MockService para evitar erro 404
import { api } from '../services/api'; 
import { BlogPost } from '../types';

// ... Componentes de Header, Footer e Sidebar mantidos ...

const Blog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Chamada real à API do backend
        const response = await api.get('/blog/posts');
        const allPosts = response.data; // Axios utiliza .data
        setPosts(allPosts);
        
        if (slug) {
          const post = allPosts.find((p: BlogPost) => p.slug === slug);
          setCurrentPost(post || null);
        } else {
          setCurrentPost(null);
        }
      } catch (error) {
        console.error("Erro ao carregar posts do blog:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* ... Restante do JSX mantido conforme original ... */}
    </div>
  );
};

export default Blog;