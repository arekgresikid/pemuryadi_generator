import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Edit2, Users, Search, Save, X, Calendar, Crown, Trash2, Plus, Settings, Power, Download, Activity, MessageSquare, Phone, DollarSign } from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('All');
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editRole, setEditRole] = useState('guest');
  const [editTier, setEditTier] = useState('Free');
  const [editActiveUntil, setEditActiveUntil] = useState('');
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  const [activeTab, setActiveTab] = useState('users');
  const [voucherActive, setVoucherActive] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [maintenanceEndTime, setMaintenanceEndTime] = useState('');
  const [maintenanceReason, setMaintenanceReason] = useState('');
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [waNumber2, setWaNumber2] = useState('');
  const [priceEssential, setPriceEssential] = useState('');
  const [pricePremium, setPricePremium] = useState('');
  const [priceUltimate, setPriceUltimate] = useState('');
  const [priceSupreme, setPriceSupreme] = useState('');
  const [priceTitan, setPriceTitan] = useState('');
  
  const [savedSettings, setSavedSettings] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{uid: string, email: string} | null>(null);
  
  const getBtnClass = (key: string, currentValue: string | boolean, baseClass: string) => {
    const isUnsaved = savedSettings[key] !== String(currentValue);
    if (isUnsaved) {
      return `${baseClass} bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all`;
    }
    return `${baseClass} bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all`;
  };

  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchSettings();
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) setStats(await res.json());
    } catch(e) {}
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) setLogs(await res.json());
    } catch(e) {}
  };

  const postLog = async (action: string) => {
    try {
      await fetch('/api/admin/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      fetchLogs(); // refresh logs
    } catch(e) {}
  };

  const fetchSettings = async () => {
    try {
      const fetchSet = async (k: string, setter: any, isBool = false) => {
        const res = await fetch(`/api/settings/${k}`);
        if (res.ok) {
          const data = await res.json() as any;
          if (data.value) {
            setter(isBool ? data.value === 'true' : data.value);
            setSavedSettings(prev => ({ ...prev, [k]: String(data.value) }));
          }
        }
      };
      await Promise.all([
        fetchSet('promo_voucher_active', setVoucherActive, true),
        fetchSet('promo_voucher_code', setVoucherCode),
        fetchSet('maintenance_active', setMaintenanceActive, true),
        fetchSet('maintenance_end_time', setMaintenanceEndTime),
        fetchSet('maintenance_reason', setMaintenanceReason),
        fetchSet('global_announcement', setGlobalAnnouncement),
        fetchSet('whatsapp_admin_number', setWaNumber),
        fetchSet('whatsapp_admin_number_2', setWaNumber2),
        fetchSet('price_essential', setPriceEssential),
        fetchSet('price_premium', setPricePremium),
        fetchSet('price_ultimate', setPriceUltimate),
        fetchSet('price_supreme', setPriceSupreme),
        fetchSet('price_titan', setPriceTitan),
      ]);
    } catch (e) {
      console.error('Failed to fetch settings', e);
    }
  };

  const saveSetting = async (key: string, value: string, notify = true) => {
    try {
      setIsSavingSettings(true);
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      postLog(`Mengubah pengaturan: ${key}`);
      if (notify) toast.success("Pengaturan berhasil disimpan!");
      setSavedSettings(prev => ({ ...prev, [key]: String(value) }));
    } catch (e) {
      console.error('Failed to save setting', e);
      if (notify) toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleVoucherToggle = async () => {
    const newValue = !voucherActive;
    setVoucherActive(newValue);
    await saveSetting('promo_voucher_active', newValue ? 'true' : 'false', false);
  };

  const confirmMaintenanceToggle = () => {
    setPendingMaintenanceState(!maintenanceActive);
    setShowMaintenanceConfirm(true);
  };

  const handleMaintenanceToggle = async () => {
    const newValue = pendingMaintenanceState;
    setMaintenanceActive(newValue);
    await saveSetting('maintenance_active', newValue ? 'true' : 'false', false);
    setShowMaintenanceConfirm(false);
  };

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

  const confirmDeleteUser = (uid: string, email: string) => {
    setUserToDelete({uid, email});
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.uid}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("User dihapus");
        postLog(`Menghapus pengguna: ${userToDelete.email}`);
        await fetchUsers();
        await fetchStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUserToDelete(null);
    }
  };

  const submitAddUser = async () => {
    if (!newEmail) return toast.error('Email wajib diisi');
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, displayName: newName, role: editRole, tier: editTier, activeUntil: editActiveUntil })
      });
      if (res.ok) {
        setIsAdding(false);
        toast.success('User berhasil ditambahkan');
        postLog(`Menambahkan pengguna baru: ${newEmail} (${editTier})`);
        await fetchUsers();
        await fetchStats();
      } else {
        const data = (await res.json()) as any;
        toast.error(data.error || 'Gagal menambahkan user');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan jaringan');
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
        toast.success("Perubahan disimpan");
        postLog(`Memperbarui profil ${editingUser.email} (Role: ${editRole}, Tier: ${editTier})`);
        setEditingUser(null);
        await fetchUsers();
        await fetchStats();
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const setPresetDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setEditActiveUntil(d.toISOString().split('T')[0]);
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Name', 'Role', 'Tier', 'Active Until', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...users.map(u => `"${u.email || ''}","${u.displayName || ''}","${u.role || ''}","${u.tier || ''}","${u.activeUntil || ''}","${u.createdAt || ''}"`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    postLog("Mengekspor data pengguna ke CSV");
  };

  const filteredUsers = users.filter(u => 
    ((u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterTier === 'All' || u.tier === filterTier)
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
          <p className="text-xs text-gray-500">Kelola pengguna, log aktivitas, dan pengaturan sistem.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={16} /> Pengguna
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'logs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Activity size={16} /> Log
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Settings size={16} /> Pengaturan
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-xs font-bold mb-1">Total Pengguna</div>
                <div className="text-2xl font-black text-blue-600">{stats.totalUsers}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-xs font-bold mb-1">Premium</div>
                <div className="text-2xl font-black text-green-600">{stats.totalPremium}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-xs font-bold mb-1">Ultimate</div>
                <div className="text-2xl font-black text-indigo-600">{stats.totalUltimate}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-xs font-bold mb-1">Titan</div>
                <div className="text-2xl font-black text-amber-500">{stats.totalTitan}</div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 w-full justify-between items-center mb-4">
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={handleAdd} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex-1 md:flex-none">
                <Plus size={16} /> Tambah
              </button>
              <button onClick={handleExportCSV} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm flex-1 md:flex-none">
                <Download size={16} /> Ekspor CSV
              </button>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="All">Semua Tier</option>
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
                <option value="Ultimate">Ultimate</option>
                <option value="Titan">Titan</option>
              </select>
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari email/nama..."
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
                          onClick={() => confirmDeleteUser(u.uid, u.email)}
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
      </>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" /> Log Aktivitas Admin
            </h3>
            <p className="text-xs text-gray-500">Merekam perubahan penting yang dilakukan oleh seluruh tim Admin.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Admin Email</th>
                  <th className="px-6 py-4 w-full">Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Belum ada aktivitas tercatat.</td>
                  </tr>
                ) : (
                  logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {log.created_at || log.timestamp ? new Date(log.created_at || log.timestamp).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-800 text-xs">{log.admin_email || 'Sistem'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600 text-xs">{log.action || log.msg || '-'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-3xl animate-in fade-in slide-in-from-right-4">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Settings size={20} className="text-blue-500" /> Pengaturan Global Aplikasi
          </h3>
          
          <div className="space-y-8">
            {/* Section: Mode Pemeliharaan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-800">Mode Pemeliharaan (Maintenance)</h2>
                  <p className="text-xs text-gray-500">Tutup akses aplikasi untuk umum dengan waktu batas.</p>
                </div>
                <div className="ml-auto">
                  <button 
                    onClick={confirmMaintenanceToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceActive ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {maintenanceActive && (
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <label className="block text-xs font-bold text-indigo-800 mb-2">Batas Waktu Maintenance (Selesai pada)</label>
                  <p className="text-[10px] text-indigo-500 mb-2 font-medium">💡 Klik ikon kalender/jam di ujung kolom input ini untuk memilih tanggal secara visual tanpa harus mengetik manual.</p>
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch mb-4">
                    <div className="relative flex-1">
                      <input
                        type="datetime-local"
                        value={maintenanceEndTime}
                        onChange={(e) => setMaintenanceEndTime(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-indigo-200 rounded-xl text-sm font-bold text-indigo-900 bg-white shadow-inner focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                      />
                    </div>
                    <button 
                      onClick={() => saveSetting('maintenance_end_time', maintenanceEndTime)}
                      className={getBtnClass('maintenance_end_time', maintenanceEndTime, "px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap shadow-sm w-full sm:w-auto")}
                    >
                      Simpan
                    </button>
                  </div>
                  
                  <label className="block text-xs font-bold text-indigo-800 mb-2">Pesan/Alasan Maintenance (Opsional)</label>
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch mb-2">
                    <div className="relative flex-1">
                      <textarea
                        value={maintenanceReason}
                        onChange={(e) => setMaintenanceReason(e.target.value)}
                        placeholder="Contoh: Kami sedang melakukan peningkatan sistem database..."
                        className="w-full px-4 py-3 border border-indigo-200 rounded-xl text-sm text-indigo-900 bg-white shadow-inner focus:outline-none focus:border-indigo-500 min-h-[80px]"
                      />
                    </div>
                    <button 
                      onClick={() => saveSetting('maintenance_reason', maintenanceReason)}
                      className={getBtnClass('maintenance_reason', maintenanceReason, "px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap shadow-sm w-full sm:w-auto h-auto sm:h-full")}
                    >
                      Simpan
                    </button>
                  </div>
                  <p className="text-[10px] text-indigo-600 mt-2">Hanya Admin dan Owner yang dapat melihat sistem selama mode ini aktif.</p>
                </div>
              )}
            </div>

            {/* Section: Promo */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b pb-2 flex items-center gap-2"><Crown size={16}/> Promo Voucher</h4>
              
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <Power size={16} className={voucherActive ? 'text-green-500' : 'text-gray-400'} /> 
                    Status Promo Voucher (Diskon 20%)
                  </div>
                  <div className="text-xs text-gray-500">Aktifkan atau nonaktifkan klaim voucher.</div>
                </div>
                <button 
                  onClick={handleVoucherToggle}
                  disabled={isSavingSettings}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${voucherActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${voucherActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Kode Voucher</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: MERDEKA20"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold tracking-widest uppercase focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    onClick={() => saveSetting('promo_voucher_code', voucherCode)}
                    disabled={isSavingSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>

            {/* Section: Pengumuman Global */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b pb-2 flex items-center gap-2"><MessageSquare size={16}/> Pengumuman</h4>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Teks Banner Pengumuman</label>
                <p className="text-[10px] text-gray-500 mb-2">Akan muncul di bagian paling atas aplikasi. Kosongkan jika tidak ada pengumuman.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={globalAnnouncement}
                    onChange={(e) => setGlobalAnnouncement(e.target.value)}
                    placeholder="Server sedang dalam pemeliharaan..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    onClick={() => saveSetting('global_announcement', globalAnnouncement)}
                    disabled={isSavingSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>

            {/* Section: Harga & Kontak */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b pb-2 flex items-center gap-2"><DollarSign size={16}/> Harga & Kontak</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Harga Essential</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={priceEssential}
                      onChange={(e) => setPriceEssential(e.target.value)}
                      placeholder="Rp 170.000"
                      className="w-full pl-4 pr-20 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => saveSetting('price_essential', priceEssential)}
                      className={getBtnClass('price_essential', priceEssential, "absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold")}
                    >Simpan</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Harga Premium</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pricePremium}
                      onChange={(e) => setPricePremium(e.target.value)}
                      placeholder="Rp 408.000"
                      className="w-full pl-4 pr-20 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => saveSetting('price_premium', pricePremium)}
                      className={getBtnClass('price_premium', pricePremium, "absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold")}
                    >Simpan</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Harga Ultimate</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={priceUltimate}
                      onChange={(e) => setPriceUltimate(e.target.value)}
                      placeholder="Rp 816.000"
                      className="w-full pl-4 pr-20 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => saveSetting('price_ultimate', priceUltimate)}
                      className={getBtnClass('price_ultimate', priceUltimate, "absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold")}
                    >Simpan</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Harga SUPREME</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={priceSupreme}
                      onChange={(e) => setPriceSupreme(e.target.value)}
                      placeholder="Rp 1.250.000"
                      className="w-full pl-4 pr-20 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => saveSetting('price_supreme', priceSupreme)}
                      className={getBtnClass('price_supreme', priceSupreme, "absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold")}
                    >Simpan</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Harga Titan</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={priceTitan}
                      onChange={(e) => setPriceTitan(e.target.value)}
                      placeholder="Rp 2.000.000"
                      className="w-full pl-4 pr-20 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => saveSetting('price_titan', priceTitan)}
                      className={getBtnClass('price_titan', priceTitan, "absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold")}
                    >Simpan</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Nomor WhatsApp Admin 1 (Tanpa +)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      placeholder="628123456789"
                      className="w-full pl-4 pr-20 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => saveSetting('whatsapp_admin_number', waNumber)}
                      className={getBtnClass('whatsapp_admin_number', waNumber, "absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold")}
                    >Simpan</button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Gunakan format 62xxx. Akan dihubungi oleh klien.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Nomor WhatsApp Admin 2 (Opsional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={waNumber2}
                      onChange={(e) => setWaNumber2(e.target.value)}
                      placeholder="628987654321"
                      className="w-full pl-4 pr-20 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => saveSetting('whatsapp_admin_number_2', waNumber2)}
                      className={getBtnClass('whatsapp_admin_number_2', waNumber2, "absolute right-1 top-1 bottom-1 px-3 rounded-lg text-xs font-bold")}
                    >Simpan</button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Jika diisi, chat klien akan dibagi rata antara Admin 1 dan Admin 2.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

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

      {/* Maintenance Confirmation Modal */}
      {showMaintenanceConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 relative border border-gray-100">
            <button onClick={() => setShowMaintenanceConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm ${pendingMaintenanceState ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-xl font-black text-center text-gray-800 mb-2">
              Konfirmasi {pendingMaintenanceState ? 'Aktivasi' : 'Nonaktifkan'}
            </h3>
            <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
              {pendingMaintenanceState 
                ? 'Mode Pemeliharaan akan diaktifkan. Pengguna umum tidak dapat mengakses aplikasi hingga batas waktu yang ditentukan.' 
                : 'Mode Pemeliharaan akan dinonaktifkan. Pengguna umum akan dapat mengakses aplikasi kembali.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowMaintenanceConfirm(false)} 
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleMaintenanceToggle} 
                className={`flex-1 px-4 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 ${pendingMaintenanceState ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'}`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={() => setUserToDelete(null)}>
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transform transition-all border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Pengguna?</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Tindakan ini permanen dan tidak dapat dibatalkan. Pengguna <span className="font-bold text-gray-800">{userToDelete.email}</span> akan dihapus dari sistem.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={executeDeleteUser}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Force Vite HMR reload
