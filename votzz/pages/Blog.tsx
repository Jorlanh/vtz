import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, Calendar, User, Tag, ArrowRight, ChevronRight, Mail, Facebook, Twitter, Linkedin, Instagram, Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { BlogPost } from '../types';

// DADOS ESTÁTICOS PARA SUBSTITUIR MOCK
const BLOG_DATA: BlogPost[] = [
  {
    id: '1',
    slug: 'assembleia-virtual-legalidade',
    title: 'Assembleia Virtual é Legal? O Que Diz a Lei em 2024',
    excerpt: 'Entenda as mudanças no Código Civil e como realizar votações digitais com segurança jurídica.',
    content: '<p>Texto completo sobre legalidade...</p>',
    author: 'Dra. Ana Silva',
    date: '2024-03-10T10:00:00Z',
    category: 'Legislação',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80',
    tags: ['Lei 14.309', 'Digital']
  },
  {
    id: '2',
    slug: 'reduzir-inadimplencia',
    title: '5 Estratégias para Reduzir a Inadimplência',
    excerpt: 'Dicas práticas para síndicos melhorarem a saúde financeira do condomínio.',
    content: '<p>Conteúdo sobre finanças...</p>',
    author: 'Carlos Gestor',
    date: '2024-03-05T14:30:00Z',
    category: 'Finanças',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-98406858d0be?auto=format&fit=crop&q=80',
    tags: ['Finanças', 'Gestão']
  }
];

const Blog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carga rápida sem MockService
    setPosts(BLOG_DATA);
    if (slug) {
      const found = BLOG_DATA.find(p => p.slug === slug);
      setCurrentPost(found || null);
    }
    setLoading(false);
  }, [slug]);

  // Header e Footer simplificados para brevidade (mantenha os originais se preferir)
  const BlogHeader = () => (
    <header className="bg-slate-900 text-white py-4 px-4 flex justify-between items-center">
        <Link to="/"><Logo theme="dark" /></Link>
        <Link to="/login" className="text-emerald-400 font-bold">Acessar Sistema</Link>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <BlogHeader />
      
      {!slug && (
        <div className="bg-slate-900 text-white py-20 px-4 text-center">
           <h1 className="text-4xl md:text-6xl font-black mb-4">Blog Votzz</h1>
           <p className="text-xl text-slate-300">Notícias e dicas de gestão condominial.</p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? <div>Carregando...</div> : slug ? (
          currentPost ? (
            <article className="bg-white p-8 rounded-xl shadow-sm">
                <img src={currentPost.imageUrl} className="w-full h-64 object-cover rounded-xl mb-6" alt={currentPost.title}/>
                <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
                <Link to="/blog" className="mt-8 inline-block text-emerald-600 font-bold">← Voltar</Link>
            </article>
          ) : <div>Artigo não encontrado</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                 <img src={post.imageUrl} className="h-48 w-full object-cover" alt={post.title} />
                 <div className="p-6">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{post.category}</span>
                    <h3 className="text-xl font-bold mt-2 mb-2"><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                    <p className="text-slate-600 text-sm line-clamp-3">{post.excerpt}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;