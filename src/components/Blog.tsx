import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-2">
            <BookOpen size={32} className="text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
            Blog & Pembaruan
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Temukan artikel terbaru, panduan, dan informasi pembaruan mengenai Pemuryadi Generator.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64 border border-gray-100 animate-pulse"></div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {posts.map((post) => (
                <a 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4">
                    <Calendar size={14} />
                    {new Date(post.published_at || post.uploaded_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.content.replace(/#+\s/g, '').substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all mt-auto pt-4 border-t border-gray-50">
                    Baca Selengkapnya <ArrowRight size={16} />
                  </div>
                </a>
              ))}
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
