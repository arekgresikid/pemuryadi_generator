import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/blog/public');
        if (res.ok) {
          const posts = await res.json() as any[];
          const found = posts.find((p: any) => p.slug === slug);
          setPost(found);
          if (found) {
            const others = posts.filter((p: any) => p.slug !== slug);
            // Acak urutan agar artikel terkait bervariasi, ambil 3
            const shuffled = others.sort(() => 0.5 - Math.random());
            setRelatedPosts(shuffled.slice(0, 3));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mt-8"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Artikel Tidak Ditemukan</h2>
        <button onClick={() => window.history.back()} className="text-blue-600 font-bold hover:underline">Kembali ke Blog</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Kembali
        </button>
        
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 border-y border-gray-100 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              {new Date(post.published_at || post.uploaded_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <User size={16} className="text-gray-400" />
              Admin
            </div>
          </div>
        </header>

        {/* Thumbnail Default via CSS (Tanpa Load Gambar) */}
        <div className="w-full h-48 sm:h-64 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-inner flex items-center justify-center mb-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm mix-blend-overlay"></div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-white/90">
            <svg className="w-20 h-20 mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-bold tracking-widest uppercase text-sm opacity-80">Digen.id Blog</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-2xl prose-img:shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content.replace(/^\s*#\s+[^\n]*\n?/, '')}
          </ReactMarkdown>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Artikel Terkait</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <a 
                  href={`/blog/${rp.slug}`} 
                  key={rp.id}
                  className="group block bg-gray-50/50 p-5 rounded-3xl hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-200"
                >
                  <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 text-sm leading-relaxed">
                    {rp.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Calendar size={12} />
                    {new Date(rp.published_at || rp.uploaded_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
      </article>
    </div>
  );
}
