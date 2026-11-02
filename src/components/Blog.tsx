import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Globe, FileText, Lightbulb } from 'lucide-react';

const extractCoverImage = (content: string): string | null => {
  if (!content) return null;
  const match = content.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/);
  return match ? match[1] : null;
};

const getCategoryInfo = (title: string, content: string) => {
  const t = (title + ' ' + content).toLowerCase();
  if (t.includes('koding') || t.includes('kecerdasan buatan') || t.includes('ai') || t.includes('algoritma')) {
    return { name: 'Koding & AI', gradient: 'from-cyan-600 via-sky-600 to-blue-700', icon: Sparkles };
  }
  if (t.includes('kurikulum merdeka') || t.includes('modul ajar') || t.includes('rpp') || t.includes('cp ') || t.includes('atp')) {
    return { name: 'Kurikulum Merdeka', gradient: 'from-blue-600 via-indigo-600 to-indigo-800', icon: BookOpen };
  }
  if (t.includes('muatan lokal') || t.includes('daerah') || t.includes('bahasa') || t.includes('budaya') || t.includes('banjar') || t.includes('jawa') || t.includes('sunda') || t.includes('dayak') || t.includes('kutai')) {
    return { name: 'Muatan Lokal', gradient: 'from-emerald-600 via-teal-600 to-teal-800', icon: Globe };
  }
  if (t.includes('soal') || t.includes('asesmen') || t.includes('ujian') || t.includes('kisi-kisi') || t.includes('kktp')) {
    return { name: 'Asesmen & Evaluasi', gradient: 'from-purple-600 via-fuchsia-600 to-pink-700', icon: FileText };
  }
  return { name: 'Inspirasi Guru', gradient: 'from-amber-500 via-orange-500 to-rose-600', icon: Lightbulb };
};

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/public?page=${page}&limit=${postsPerPage}`);
      if (res.ok) {
        const data = await res.json() as { posts: any[], total: number };
        setPosts(data.posts);
        setTotalPosts(data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50/50 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-2">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
            Blog & Pembaruan
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Temukan artikel terbaru, panduan Kurikulum Merdeka, dan informasi pembaruan mengenai Pemuryadi Generator.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-3xl h-80 border border-gray-100 animate-pulse overflow-hidden">
                <div className="w-full h-44 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm mt-12">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada artikel</h3>
            <p className="text-gray-500">Kami sedang menyiapkan konten menarik untuk Anda. Coba kembali lagi nanti!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {posts.map((post) => {
                const coverImg = extractCoverImage(post.content);
                const category = getCategoryInfo(post.title, post.content);
                const IconComponent = category.icon;
                const cleanSnippet = post.content
                  .replace(/!\[.*?\]\(.*?\)/g, '')
                  .replace(/#+\s/g, '')
                  .replace(/[*_~`]/g, '')
                  .trim()
                  .substring(0, 140) + '...';

                return (
                  <a 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full overflow-hidden"
                  >
                    {/* Card Cover Banner: Rasio 16:9 Proporsional Sesuai Card */}
                    <div className="w-full aspect-[16/9] relative overflow-hidden bg-slate-100">
                      {coverImg ? (
                        <img 
                          src={coverImg} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${category.gradient} flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="p-3 bg-white/20 rounded-2xl mb-2 backdrop-blur-md shadow-sm">
                              <IconComponent size={24} className="text-white drop-shadow" />
                            </div>
                            <span className="font-bold text-sm md:text-base line-clamp-2 px-4 drop-shadow text-white/95">
                              {post.title}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[11px] font-extrabold px-2.5 py-1 bg-white/95 backdrop-blur-md text-gray-800 rounded-lg shadow-sm border border-gray-100 flex items-center gap-1">
                          <IconComponent size={12} className="text-blue-600" />
                          {category.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-3">
                        <Calendar size={14} />
                        {new Date(post.published_at || post.uploaded_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {cleanSnippet}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all mt-auto pt-4 border-t border-gray-50">
                        Baca Selengkapnya <ArrowRight size={16} />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPosts > postsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman Sebelumnya"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: Math.ceil(totalPosts / postsPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      currentPage === i + 1 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalPosts / postsPerPage)))}
                  disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman Selanjutnya"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
