import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Edit2, Users, Search, Save, X, Calendar, Crown, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function AdminPanel() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editRole, setEditRole] = useState('guest');
  const [editTier, setEditTier] = useState('Free');
  const [editActiveUntil, setEditActiveUntil] = useState('');
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = (await res.json()) as any[];
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditName(user.displayName || '');
    setEditRole(user.role || 'siswa');
    setEditTier(user.tier || 'Free');
    setEditActiveUntil(user.activeUntil || '');
  };

  const handleAdd = () => {
    setIsAdding(true);
    setNewEmail('');
    setNewName('');
    setEditRole('siswa');
    setEditTier('Free');
    setEditActiveUntil('');
  };

  const deleteUser = async (uid: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    try {
      const res = await fetch(`/api/admin/users/${uid}`, { method: 'DELETE' });
      if (res.ok) await fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const submitAddUser = async () => {
    if (!newEmail) return alert('Email wajib diisi');
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, displayName: newName, role: editRole, tier: editTier, activeUntil: editActiveUntil })
      });
      if (res.ok) {
        setIsAdding(false);
        await fetchUsers();
      } else {
        const data = (await res.json()) as any;
        alert(data.error || 'Gagal menambahkan user');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveUser = async () => {
    if (!editingUser) return;
    try {
      setIsSaving(true);
      const res = await fetch(`/api/admin/users/${editingUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: editRole,
          tier: editTier,
          activeUntil: editActiveUntil,
          displayName: editName
        })
      });
      
      if (res.ok) {
        setEditingUser(null);
        await fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const setPresetDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setEditActiveUntil(d.toISOString().split('T')[0]);
  };

  const filteredUsers = users.filter(u => 
    (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (profile?.role?.toLowerCase() !== 'owner' && profile?.role?.toLowerCase() !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-red-100 shadow-sm animate-in fade-in">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Akses Ditolak</h2>
        <p className="text-gray-500 text-sm mt-2">Halaman ini khusus untuk Administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black italic text-blue-600 flex items-center gap-2">
            <Shield size={24} /> ADMIN DASHBOARD
          </h2>
          <p className="text-xs text-gray-500">Kelola pengguna, masa aktif langganan, dan peran.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button onClick={handleAdd} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} /> Tambah User
          </button>
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari user..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Active Until</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Tidak ada user ditemukan.</td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.uid} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{u.displayName || 'Unknown'}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role === 'owner' ? <Crown size={10} /> : <Shield size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.tier === 'Titan' ? 'bg-amber-100 text-amber-700' :
                        u.tier === 'SUPREME' ? 'bg-purple-100 text-purple-700' :
                        u.tier === 'Ultimate' ? 'bg-indigo-100 text-indigo-700' :
                        u.tier === 'Premium' ? 'bg-blue-100 text-blue-700' :
                        u.tier === 'Essential' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {u.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {u.activeUntil ? (
                        <span className={new Date(u.activeUntil) < new Date() ? 'text-red-500 font-bold' : 'text-emerald-600'}>
                          {u.activeUntil}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No Expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(u)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-xs font-bold uppercase transition-colors"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => deleteUser(u.uid)}
                          className="inline-flex items-center px-2 py-1.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Edit2 size={16} className="text-blue-500" /> Edit User
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">User Info</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nama Pengguna"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 mb-2"
                />
                <div className="text-[10px] font-mono text-gray-500">{editingUser.email}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Role</label>
                <div className="flex gap-2 flex-wrap">
                  {['siswa', 'staf', 'admin', 'owner'].map(r => (
                    <button
                      key={r}
                      onClick={() => setEditRole(r)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${editRole === r ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subscription Tier</label>
                <div className="flex gap-2 flex-wrap">
                  {['Free', 'Essential', 'Premium', 'Ultimate', 'SUPREME', 'Titan'].map(t => (
                    <button
                      key={t}
                      onClick={() => setEditTier(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${editTier === t ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Active Until (YYYY-MM-DD)</label>
                <div className="relative mb-2">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={editActiveUntil}
                    onChange={(e) => setEditActiveUntil(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditActiveUntil('')} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[10px] font-bold uppercase">Clear</button>
                  <button onClick={() => setPresetDate(30)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase">+30 Hari</button>
                  <button onClick={() => setPresetDate(180)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase">+6 Bln</button>
                  <button onClick={() => setPresetDate(365)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase">+1 Thn</button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 transition-colors"
              >
                BATAL
              </button>
              <button 
                onClick={saveUser}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : <><Save size={14} /> SIMPAN</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Plus size={16} className="text-blue-500" /> Tambah User Baru
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Nama Pengguna (Opsional)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 mb-4"
                />
                
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Role</label>
                <div className="flex gap-2 flex-wrap">
                  {['siswa', 'staf', 'admin', 'owner'].map(r => (
                    <button
                      key={r}
                      onClick={() => setEditRole(r)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${editRole === r ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subscription Tier</label>
                <div className="flex gap-2 flex-wrap">
                  {['Free', 'Essential', 'Premium', 'Ultimate', 'SUPREME', 'Titan'].map(t => (
                    <button
                      key={t}
                      onClick={() => setEditTier(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${editTier === t ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Active Until (YYYY-MM-DD)</label>
                <div className="relative mb-2">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={editActiveUntil}
                    onChange={(e) => setEditActiveUntil(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditActiveUntil('')} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[10px] font-bold uppercase">Clear</button>
                  <button onClick={() => setPresetDate(30)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase">+30 Hari</button>
                  <button onClick={() => setPresetDate(180)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase">+6 Bln</button>
                  <button onClick={() => setPresetDate(365)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold uppercase">+1 Thn</button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 transition-colors"
              >
                BATAL
              </button>
              <button 
                onClick={submitAddUser}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : <><Save size={14} /> TAMBAH USER</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
