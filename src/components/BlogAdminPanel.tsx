import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, FileText, Upload, Calendar, Save, Edit, Info, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

export default function BlogAdminPanel() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'upload' | 'edit'>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [previewPost, setPreviewPost] = useState<any | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/admin/posts?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json() as any[];
        setPosts(data);
      }
    } catch (e) {
      toast.error('Gagal mengambil data blog');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      const res = await fetch('/api/blog/admin/action', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (res.ok) {
        toast.success(`Artikel berhasil di-${action}`);
        fetchPosts();
      } else {
        toast.error('Gagal memproses aksi');
      }
    } catch (e) {
      toast.error('Kesalahan jaringan');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadContent) {
      return toast.error('Judul dan konten wajib diisi');
    }
    
    setIsUploading(true);
    try {
      const res = await fetch('/api/blog/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: uploadTitle, content: uploadContent })
      });
      if (res.ok) {
        toast.success('Artikel berhasil diunggah dan masuk status pending');
        setUploadTitle('');
        setUploadContent('');
        setActiveTab('list');
        fetchPosts();
      } else {
        const data = await res.json() as any;
        toast.error(data.error || 'Gagal mengunggah');
      }
    } catch (e) {
      toast.error('Kesalahan jaringan');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setIsBulkDeleting(false);
    setShowDeleteModal(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedPosts.length === 0) return;
    setPostToDelete(null);
    setIsBulkDeleting(true);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (isBulkDeleting) {
      try {
        const toastId = toast.loading('Menghapus artikel massal...');
        const res = await fetch('/api/blog/admin/posts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedPosts })
        });
        if (res.ok) {
          toast.success(`${selectedPosts.length} artikel berhasil dihapus`);
          setSelectedPosts([]);
          fetchPosts();
        } else {
          toast.error('Gagal menghapus artikel massal');
        }
        toast.dismiss(toastId);
      } catch (e) {
        toast.error('Kesalahan jaringan');
      }
    } else if (postToDelete) {
      try {
        const toastId = toast.loading('Menghapus artikel...');
        const res = await fetch(`/api/blog/admin/post/${postToDelete}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Artikel berhasil dihapus');
          setSelectedPosts(prev => prev.filter(postId => postId !== postToDelete));
          fetchPosts();
        } else {
          toast.error('Gagal menghapus artikel');
        }
        toast.dismiss(toastId);
      } catch (e) {
        toast.error('Kesalahan jaringan');
      }
    }
    setShowDeleteModal(false);
    setPostToDelete(null);
    setIsBulkDeleting(false);
  };

  const toggleSelectPost = (id: string) => {
    setSelectedPosts(prev => 
      prev.includes(id) ? prev.filter(postId => postId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const toastId = toast.loading('Memuat data artikel...');
      const res = await fetch(`/api/blog/admin/post/${id}`);
      if (res.ok) {
        const data = await res.json() as any;
        setUploadTitle(data.title);
        setUploadContent(data.content);
        setEditingPostId(id);
        setActiveTab('edit');
        toast.dismiss(toastId);
      } else {
        toast.dismiss(toastId);
        toast.error('Gagal memuat konten artikel');
      }
    } catch (e) {
      toast.error('Kesalahan jaringan');
    }
  };

  const handlePreviewClick = async (id: string) => {
    try {
      const toastId = toast.loading('Memuat data artikel...');
      const res = await fetch(`/api/blog/admin/post/${id}`);
      if (res.ok) {
        const data = await res.json() as any;
        setPreviewPost(data);
        toast.dismiss(toastId);
      } else {
        toast.dismiss(toastId);
        toast.error('Gagal memuat konten artikel untuk pratinjau');
      }
    } catch (e) {
      toast.error('Kesalahan jaringan');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadContent || !editingPostId) {
      return toast.error('Judul dan konten wajib diisi');
    }
    
    setIsUploading(true);
    try {
      const res = await fetch(`/api/blog/admin/post/${editingPostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: uploadTitle, content: uploadContent })
      });
      if (res.ok) {
        toast.success('Artikel berhasil diperbarui');
        setUploadTitle('');
        setUploadContent('');
        setEditingPostId(null);
        setActiveTab('list');
        fetchPosts();
      } else {
        const data = await res.json() as any;
        toast.error(data.error || 'Gagal memperbarui');
      }
    } catch (e) {
      toast.error('Kesalahan jaringan');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'published': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={16} /> Daftar Artikel
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Upload size={16} /> Unggah Artikel Baru
          </button>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
          title="Bantuan & Alur Kerja"
        >
          <Info size={20} />
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse">Memuat data...</div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <FileText size={48} className="mb-4 text-gray-300" />
              <p>Belum ada artikel blog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {selectedPosts.length > 0 && (
                <div className="bg-red-50 p-3 flex justify-between items-center border-b border-red-100">
                  <span className="text-red-700 text-sm font-bold ml-2">{selectedPosts.length} artikel dipilih</span>
                  <button 
                    onClick={handleBulkDeleteClick}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
                  >
                    <Trash2 size={16} /> Hapus Terpilih
                  </button>
                </div>
              )}
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                        checked={posts.length > 0 && selectedPosts.length === posts.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 font-bold text-gray-600 text-xs">JUDUL</th>
                    <th className="p-4 font-bold text-gray-600 text-xs">STATUS</th>
                    <th className="p-4 font-bold text-gray-600 text-xs">TANGGAL UNGGAH</th>
                    <th className="p-4 font-bold text-gray-600 text-xs text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {posts.map(post => (
                    <tr key={post.id} className={`hover:bg-gray-50/50 transition-colors ${selectedPosts.includes(post.id) ? 'bg-blue-50/30' : ''}`}>
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => toggleSelectPost(post.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{post.title}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{post.slug}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(post.status)}`}>
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-xs">
                        {new Date(post.uploaded_at).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {post.status !== 'approved' && post.status !== 'published' && (
                              <button onClick={() => handleAction(post.id, 'approve')} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors" title="Publikasikan / Setujui">
                                <Check size={16} />
                              </button>
                            )}
                            <button onClick={() => handleEditClick(post.id)} className="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors" title="Edit Konten">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handlePreviewClick(post.id)} className="p-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-lg transition-colors" title="Lihat Pratinjau">
                              <Eye size={16} />
                            </button>
                            {post.status !== 'draft' && (
                              <button onClick={() => handleAction(post.id, 'draft')} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors" title="Jadikan Draf">
                                <Save size={16} />
                              </button>
                            )}
                            {post.status !== 'rejected' && (
                              <button onClick={() => handleAction(post.id, 'reject')} className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg transition-colors" title="Tolak / Sembunyikan">
                                <X size={16} />
                              </button>
                            )}
                            <button onClick={() => handleDeleteClick(post.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors" title="Hapus Permanen">
                              <Trash2 size={16} />
                            </button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <form onSubmit={handleUploadSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Artikel</label>
            <input 
              type="text" 
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Masukkan judul artikel"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Konten Markdown</label>
            <textarea 
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm h-64 resize-y"
              placeholder="Ketik isi artikel dalam format Markdown..."
              required
            ></textarea>
            <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <strong className="text-blue-700 block mb-1">Panduan Format Markdown:</strong>
              <ul className="list-disc pl-4 space-y-1">
                <li>Gunakan <code>**tebal**</code> untuk teks tebal dan <code>*miring*</code> untuk teks miring.</li>
                <li>Buat judul (Heading) menggunakan tanda pagar: <code>## Subjudul</code> atau <code>### Sub-subjudul</code>. <span className="text-red-500">Jangan gunakan <code># Judul Utama</code></span> karena judul utama otomatis ditambahkan dari isian Judul Artikel.</li>
                <li>Tambahkan gambar dengan format: <code>![Teks Alternatif](URL_GAMBAR)</code></li>
                <li>Buat daftar dengan tanda minus <code>- item 1</code> atau angka <code>1. item pertama</code>.</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isUploading ? 'Menyimpan...' : 'Unggah & Masukkan Antrean'}
              <Upload size={18} />
            </button>
          </div>
        </form>
      )}

      {activeTab === 'edit' && (
        <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800 text-lg">Edit Artikel</h3>
            <button type="button" onClick={() => { setActiveTab('list'); setEditingPostId(null); setUploadTitle(''); setUploadContent(''); }} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Artikel</label>
            <input 
              type="text" 
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="Masukkan judul artikel"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Konten Markdown</label>
            <textarea 
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm h-64 resize-y"
              placeholder="Ketik isi artikel dalam format Markdown..."
              required
            ></textarea>
            <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <strong className="text-blue-700 block mb-1">Panduan Format Markdown:</strong>
              <ul className="list-disc pl-4 space-y-1">
                <li>Gunakan <code>**tebal**</code> untuk teks tebal dan <code>*miring*</code> untuk teks miring.</li>
                <li>Buat judul (Heading) menggunakan tanda pagar: <code>## Subjudul</code> atau <code>### Sub-subjudul</code>. <span className="text-red-500">Jangan gunakan <code># Judul Utama</code></span> karena judul utama otomatis ditambahkan dari isian Judul Artikel.</li>
                <li>Tambahkan gambar dengan format: <code>![Teks Alternatif](URL_GAMBAR)</code></li>
                <li>Buat daftar dengan tanda minus <code>- item 1</code> atau angka <code>1. item pertama</code>.</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isUploading ? 'Menyimpan...' : 'Simpan Perubahan'}
              <Save size={18} />
            </button>
          </div>
        </form>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Info size={24} />
                Alur Kerja Editorial Blog (AI & Admin)
              </h2>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 text-gray-700 max-h-[70vh] overflow-y-auto">
              <p className="text-lg font-medium text-gray-900 border-b pb-4">
                Sistem blog ini menggunakan pendekatan <strong>"AI-Assisted Editorial Workflow"</strong>, yang menggabungkan kecepatan AI dengan kontrol penuh dari tim Redaksi (Anda).
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900">AI Menulis & Menyimpan Draf (Otomatis)</h3>
                    <p className="mt-1 text-sm leading-relaxed">
                      Sistem AI akan menulis artikel baru secara berkala. Artikel tersebut akan otomatis diunggah ke database dengan status <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold mx-1">PENDING</span>. Artikel ini <strong>bersembunyi secara aman</strong> dan tidak akan tampil di hadapan publik sebelum Anda menyetujuinya.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Melihat Pratinjau (Preview)</h3>
                    <p className="mt-1 text-sm leading-relaxed">
                      Gunakan tombol <strong>Mata (Nila/Indigo)</strong> untuk melihat bagaimana artikel akan ditampilkan kepada audiens nantinya (pratinjau) sebelum Anda memutuskan untuk mempublikasikannya.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Review, Edit & Simpan Sebagai Draf</h3>
                    <p className="mt-1 text-sm leading-relaxed">
                      Jika konten butuh penyesuaian, klik tombol <strong>Edit (Ungu)</strong> untuk memperbaiki gaya bahasa. Jika masih belum selesai diedit namun Anda ingin menyimpannya, tekan tombol <strong>Disket (Abu-abu)</strong> untuk mengubah statusnya menjadi <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold mx-1">DRAFT</span>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Publikasi Instan (Tayang Seketika)</h3>
                    <p className="mt-1 text-sm leading-relaxed">
                      Setelah artikel dirasa sempurna, Anda cukup menekan tombol <strong>Centang Biru (Publikasikan/Setujui)</strong>. Status artikel akan langsung berubah menjadi <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold mx-1">PUBLISHED</span> dan <strong>seketika itu juga langsung tayang</strong> dan dapat dibaca oleh audiens di halaman Blog. Tidak ada waktu tunggu <em>build</em> ulang.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <strong>Catatan:</strong> Anda memegang kendali 100%. Jika ada artikel dari AI yang topiknya tidak relevan, Anda bisa langsung menghapus atau menolaknya menggunakan tombol Tolak (Merah).
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 p-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-red-100">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Konfirmasi Hapus</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {isBulkDeleting 
                ? `Apakah Anda yakin ingin menghapus ${selectedPosts.length} artikel yang dipilih secara permanen?`
                : 'Apakah Anda yakin ingin menghapus artikel ini secara permanen?'}
              <br/>
              <span className="font-bold text-red-500 mt-2 block">Tindakan ini tidak dapat dibatalkan!</span>
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setPostToDelete(null);
                  setIsBulkDeleting(false);
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5"
              >
                Ya, Hapus!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
              <h3 className="font-bold text-gray-900 text-xl">Pratinjau Artikel</h3>
              <button onClick={() => setPreviewPost(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto prose prose-blue max-w-none prose-img:rounded-xl">
              <h1 className="text-3xl font-black text-gray-900 mb-6">{previewPost.title}</h1>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {previewPost.content}
              </ReactMarkdown>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end rounded-b-3xl">
              <button 
                onClick={() => setPreviewPost(null)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
