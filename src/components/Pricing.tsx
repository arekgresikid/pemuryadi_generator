import React, { useState, useEffect } from 'react';
import { Shield, Check, Star, Zap, Crown, Award, X, CreditCard, Send, Copy, Landmark, BookOpen, Gamepad2 } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Pricing() {
  const { user, profile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [packageCategory, setPackageCategory] = useState<'administrasi' | 'games' | 'kombinasi'>('kombinasi');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const currentTier = profile?.tier || profile?.role || (user ? 'Free' : null);

  const plans = [
    {
      name: 'Free',
      description: 'Akses pengenalan untuk mengeksplorasi fitur dasar',
      price: 'Rp 0',
      period: ' Selamanya',
      tokens: 2,
      tokenDesc: 'x generate / hari',
      features: [
        'Hasil dokumen menyertakan Watermark',
        'Pembaruan otomatis kuota setiap hari',
        'Akses ke fitur generator standar'
      ],
      icon: <Shield size={24} className="text-gray-600" />,
      color: 'slate',
      buttonText: 'Paket Saat Ini'
    },
    {
      name: 'Essential',
      description: 'Cukup untuk kebutuhan ngajar bulanan',
      price: 'Rp 170.000',
      period: ' / 1 Bulan',
      tokens: 85,
      tokenDesc: 'x generate total',
      features: [
        'Tanpa Watermark (WM)',
        'Masa Aktif 1 Bulan',
        'Prioritas generate dasar',
        'Akses fitur RPP & Modul'
      ],
      icon: <Star size={24} className="text-amber-600" />,
      color: 'amber',
      buttonText: 'Pilih Essential'
    },
    {
      name: 'Premium',
      description: 'Cocok untuk penyusunan materi padat',
      price: 'Rp 408.000',
      period: ' / 3 Bulan',
      tokens: 250,
      tokenDesc: 'x generate total',
      features: [
        'Tanpa Watermark (WM)',
        'Masa Aktif 3 Bulan',
        'Kecepatan AI Premium',
        'Akses semua modul premium',
        'Dukungan customer service'
      ],
      icon: <Zap size={24} className="text-red-300" />,
      color: 'emerald',
      buttonText: 'Sangat Direkomendasikan',
      popular: true
    },
    {
      name: 'Ultimate',
      description: 'Paket super untuk sekolah / pengawas',
      price: 'Rp 816.000',
      period: ' / 6 Bulan',
      tokens: 600,
      tokenDesc: 'x generate total',
      features: [
        'Tanpa Watermark (WM)',
        'Masa Aktif 6 Bulan',
        'Akses prioritas tertinggi',
        'Sistem manajemen lanjutan',
        'Termasuk pembuatan soal adaptif'
      ],
      icon: <Crown size={24} className="text-red-500" />,
      color: 'blue',
      buttonText: 'Pilih Ultimate'
    },
    {
      name: 'SUPREME',
      description: 'Tak terbatas dengan segala kemampuan full power.',
      price: 'Rp 1.000.000',
      period: ' / 1 Tahun',
      tokens: 1000,
      tokenDesc: 'x generate total',
      features: [
        'Tanpa Watermark (WM)',
        'Masa Aktif 1 Tahun',
        'Teknologi AI Terbaru 2026',
        'Generate Kilat Tanpa Antre',
        'Spesial badge SUPREME'
      ],
      icon: <Award size={24} className="text-yellow-300" />,
      color: 'supreme',
      buttonText: 'Beli SUPREME'
    },
    {
      name: 'Titan',
      description: 'Paket Ultimate Terkuat untuk Instansi Skala Besar',
      price: 'Rp 2.000.000',
      period: ' Selamanya',
      tokens: 'Unlimited',
      tokenDesc: 'Akses tanpa batas',
      features: [
        'Tanpa Watermark (WM)',
        'Akses Lifetime (Selamanya)',
        'Server Eksklusif Dedicated',
        'Whitelist semua fitur VIP',
        'Custom Fitur Sistem'
      ],
      icon: <Crown size={24} className="text-rose-500" />,
      color: 'rose',
      buttonText: 'Beli Titan'
    }
  ];

  const administrasiPlans = [
    {
      name: 'Guru Pertama',
      description: 'Paket Administrasi Guru Pertama',
      price: 'Rp 46.000',
      period: ' / 1 Bulan',
      tokens: 80,
      tokenDesc: 'x generate total',
      features: [
        '70 Kali Buat Dokumen',
        'Semua Akses Administrasi',
        'Bonus 10x Generate'
      ],
      icon: <BookOpen size={24} className="text-blue-500" />,
      color: 'blue',
      buttonText: 'Pilih Guru Pertama'
    },
    {
      name: 'Guru Muda',
      description: 'Paket Administrasi Guru Muda',
      price: 'Rp 125.000',
      period: ' / 3 Bulan',
      tokens: 220,
      tokenDesc: 'x generate total',
      features: [
        '210 Kali Buat Dokumen',
        'Semua Akses Administrasi',
        'Bonus 10x Generate'
      ],
      icon: <Shield size={24} className="text-indigo-500" />,
      color: 'indigo',
      buttonText: 'Pilih Guru Muda'
    },
    {
      name: 'Guru Madya',
      description: 'Paket Administrasi Guru Madya',
      price: 'Rp 550.000',
      period: ' / 6 Bulan',
      tokens: 880,
      tokenDesc: 'x generate total',
      features: [
        '870 Kali Buat Dokumen',
        'Semua Akses Administrasi',
        'Bonus 10x Generate'
      ],
      icon: <Award size={24} className="text-purple-500" />,
      color: 'purple',
      buttonText: 'Pilih Guru Madya',
      popular: true
    },
    {
      name: 'Guru Utama',
      description: 'Paket Administrasi Guru Utama',
      price: 'Rp 1.240.000',
      period: ' / 1 Tahun',
      tokens: 2110,
      tokenDesc: 'x generate total',
      features: [
        '2100 Kali Buat Dokumen',
        'Semua Akses Administrasi',
        'Bonus 10x Generate'
      ],
      icon: <Crown size={24} className="text-rose-500" />,
      color: 'rose',
      buttonText: 'Pilih Guru Utama'
    }
  ];

  const gamesPlans = [
    {
      name: 'Gold',
      description: 'Paket Games - Rank Gold',
      price: 'Rp 79.000',
      period: ' / 1 Bulan',
      tokens: 85,
      tokenDesc: 'x generate total',
      features: [
        '75 Kali Buat Game',
        'Akses Semua Template Game',
        'Bonus 10x Generate'
      ],
      icon: <Gamepad2 size={24} className="text-amber-500" />,
      color: 'amber',
      buttonText: 'Pilih Paket Gold'
    },
    {
      name: 'Platinum',
      description: 'Paket Games - Rank Platinum',
      price: 'Rp 245.000',
      period: ' / 3 Bulan',
      tokens: 240,
      tokenDesc: 'x generate total',
      features: [
        '230 Kali Buat Game',
        'Akses Semua Template Game',
        'Bonus 10x Generate'
      ],
      icon: <Zap size={24} className="text-red-500" />,
      color: 'red',
      buttonText: 'Pilih Paket Platinum'
    },
    {
      name: 'Diamond',
      description: 'Paket Games - Rank Diamond',
      price: 'Rp 735.000',
      period: ' / 6 Bulan',
      tokens: 710,
      tokenDesc: 'x generate total',
      features: [
        '700 Kali Buat Game',
        'Akses Semua Template Game',
        'Bonus 10x Generate'
      ],
      icon: <Award size={24} className="text-rose-500" />,
      color: 'rose',
      buttonText: 'Pilih Paket Diamond',
      popular: true
    },
    {
      name: 'Grandmaster',
      description: 'Paket Games - Rank Grandmaster',
      price: 'Rp 1.650.000',
      period: ' / 1 Tahun',
      tokens: 1610,
      tokenDesc: 'x generate total',
      features: [
        '1600 Kali Buat Game',
        'Akses Semua Template Game',
        'Bonus 10x Generate'
      ],
      icon: <Crown size={24} className="text-purple-500" />,
      color: 'purple',
      buttonText: 'Pilih Grandmaster'
    }
  ];

  const activePlans = packageCategory === 'administrasi' ? administrasiPlans : packageCategory === 'games' ? gamesPlans : plans;

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const confirmPayment = () => {
    const phoneNumber = "6281347697809"; // WA number
    const message = encodeURIComponent(`Hallo Admin Pemuryadi Generator, saya sudah transfer untuk pembelian paket ${selectedPlan?.name} (Akun: ${profile?.email || ''}). Berikut adalah bukti pembayarannya:`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowModal(false);
  };

  return (
    <div className="p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Banner Khusus Pengguna Baru */}
      {(!currentTier || currentTier.toLowerCase() === 'free') && (
        <div className="max-w-7xl mx-auto mb-10 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Spesial Pengguna Baru</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-2 drop-shadow-md">Voucher Diskon 20%</h2>
            <p className="text-white/90 text-sm md:text-lg font-medium">Klaim potongan harga eksklusif Anda untuk berlangganan paket Premium atau Ultimate sekarang juga!</p>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => {
                const message = encodeURIComponent(`Hallo Admin Pemuryadi Generator, saya pengguna baru (${profile?.email || 'Guest'}) dan ingin mengklaim Voucher Diskon 20% untuk berlangganan.`);
                window.open(`https://wa.me/6281347697809?text=${message}`, '_blank');
              }}
              className="w-full md:w-auto bg-white text-red-600 hover:bg-gray-50 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg hover:scale-105 hover:shadow-xl"
            >
              <Send size={20} />
              Klaim via WhatsApp
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">
          Tingkatkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Performa Mengajar</span> Anda
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pilih paket yang sesuai dengan kebutuhan mengajar dan persiapkan materi jauh lebih cepat dengan kekuatan penuh Pemuryadi.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-white rounded-full p-1.5 border border-gray-200 shadow-sm relative overflow-hidden flex-col sm:flex-row">
          <button 
            onClick={() => setPackageCategory('administrasi')}
            className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold transition-all z-10 ${packageCategory === 'administrasi' ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Paket Administrasi
          </button>
          <button 
            onClick={() => setPackageCategory('games')}
            className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold transition-all z-10 ${packageCategory === 'games' ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Paket Games
          </button>
          <button 
            onClick={() => setPackageCategory('kombinasi')}
            className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold transition-all z-10 ${packageCategory === 'kombinasi' ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Paket Kombinasi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {activePlans.map((plan, i) => {
          const isSupreme = plan.name === 'SUPREME';
          const isCurrent = currentTier?.toLowerCase() === plan.name.toLowerCase() || (plan.name === 'Free' && !currentTier);
          const isTitan = plan.name === 'Titan';
          
          return (
            <div 
              key={i} 
              className={`relative gen-card rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? 'border-2 border-red-300 scale-105 z-10' : 
                isSupreme ? 'border-2 border-transparent bg-gradient-to-b from-purple-600/30 to-amber-500/20' : 
                isTitan ? 'border-2 border-rose-500/50 bg-gradient-to-b from-rose-900/40 to-slate-900/80 shadow-sm' :
                'border border-black bg-white'
              }`}
            >
              {isSupreme && (
                <div className="absolute inset-0 bg-gradient-to-dr from-violet-600/20 via-transparent to-amber-400/20 z-0"></div>
              )}
              {isTitan && (
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-red-500/10 z-0 pointer-events-none"></div>
              )}
              {plan.popular && (
                <div className="bg-red-300 text-black text-xs font-bold uppercase tracking-widest text-center py-1 absolute top-0 w-full z-20">
                  Best Offer
                </div>
              )}

              <div className={`p-6 z-10 ${plan.popular ? 'pt-8' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${
                    isTitan ? 'bg-gradient-to-br from-rose-500 to-red-600' :
                    isSupreme ? 'bg-gradient-to-br from-violet-600 to-amber-400' :
                    plan.name === 'Premium' ? 'bg-emerald-500/20' :
                    plan.name === 'Ultimate' ? 'bg-blue-500/20' :
                    plan.name === 'Essential' ? 'bg-amber-500/20' :
                    'bg-red-50'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className={`text-xl font-bold uppercase tracking-widest ${
                    isTitan ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500 drop-shadow-sm' :
                    isSupreme ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#8A2BE2] to-[#FFD700] drop-shadow-sm' :
                    plan.name === 'Premium' ? 'text-red-300' :
                    plan.name === 'Ultimate' ? 'text-red-400' :
                    plan.name === 'Essential' ? 'text-amber-600' :
                    'text-black'
                  }`}>
                    {plan.name}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-600 mb-6 h-8">{plan.description}</p>
                
                <div className="mb-6 pb-6 border-b border-white/10">
                  <span className="text-3xl font-bold tracking-tighter text-black">{plan.price}</span>
                  <span className="text-gray-600 text-sm">{plan.period}</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-1">
                    <span className={`text-4xl font-bold ${isTitan ? 'text-rose-400' : isSupreme ? 'text-amber-600' : 'text-black'}`}>{plan.tokens}</span>
                    <span className="text-xs text-gray-600 pb-1">{plan.tokenDesc}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={16} className={`mt-0.5 shrink-0 ${
                        isTitan ? 'text-rose-400' :
                        isSupreme ? 'text-amber-600' :
                        plan.name === 'Premium' ? 'text-red-300' :
                        'text-red-500'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => handleUpgrade(plan)}
                    disabled={isCurrent && plan.name === 'Free'}
                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
                      isCurrent && plan.name === 'Free' ? 'bg-red-50 text-gray-500 cursor-not-allowed' :
                      isTitan ? 'bg-gradient-to-r from-rose-600 to-red-600 text-black hover:shadow-sm shadow-lg hover:scale-105' :
                      isSupreme ? 'bg-gradient-to-r from-violet-600 to-amber-500 text-black hover:shadow-sm shadow-lg hover:scale-105' :
                      plan.popular ? 'bg-red-300 text-black hover:bg-red-300/90 shadow-lg shadow-red-300/20' :
                      plan.name === 'Ultimate' ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' :
                      plan.name === 'Essential' ? 'bg-amber-500/20 text-amber-600 border border-amber-500/50 hover:bg-amber-500/30' :
                      'bg-red-50 text-black hover:bg-red-100'
                    }`}
                  >
                    {isCurrent ? (plan.name === 'Free' ? 'Paket Saat Ini' : 'Beli Lagi') : plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center max-w-2xl mx-auto p-6 bg-white border border-black rounded-2xl">
        <h4 className="text-black font-bold mb-2 flex justify-center items-center gap-2"><Shield size={18} className="text-red-500"/> Bagaimana sistem Tokens bekerja?</h4>
        <p className="text-sm text-gray-600">
          Satu token setara dengan satu kali tekan tombol Generate. Pembuatan soal, perangkat ajar, atau kegiatan di tab apa pun akan memakan 1 Token. Jika token habis, Anda bisa membeli paket token secara terpisah kapan pun.
        </p>
      </div>

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-300">
          <div className="bg-white border border-black p-6 md:p-8 rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-black mb-2 pr-6">Pilih Metode Pembayaran</h3>
            <p className="text-gray-600 text-sm mb-6">
              Selesaikan pembayaran untuk paket <strong className="text-black">{selectedPlan.name}</strong> sebesar <strong className="text-red-300">{selectedPlan.price}</strong>.
            </p>

            <div className="space-y-4 mb-8">
              {/* E-Wallet Section */}
              <div className="bg-red-50 rounded-xl p-4 border border-black">
                <div className="flex items-center gap-3 mb-3 text-black font-semibold">
                  <CreditCard size={20} className="text-red-500" />
                  Transfer E-Wallet (a.n. Praswara Eko Muryadi)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {['GoPay', 'DANA', 'ShopeePay'].map((wallet) => (
                    <div key={wallet} className="bg-white p-3 rounded-lg border border-black flex justify-between items-center group">
                      <div>
                        <span className="text-xs text-gray-600 block mb-1">{wallet}</span>
                        <span className="font-mono font-bold text-black">081330763633</span>
                      </div>
                      <button 
                        onClick={() => handleCopy('081330763633', wallet)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Salin Nomor"
                      >
                        {copiedId === wallet ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Transfer Section */}
              <div className="bg-blue-50 rounded-xl p-4 border border-black">
                <div className="flex items-center gap-3 mb-3 text-black font-semibold">
                  <Landmark size={20} className="text-blue-500" />
                  Transfer Bank (a.n. Praswara Eko Muryadi)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    { name: 'BCA', no: '6595489656' }
                  ].map((bank) => (
                    <div key={bank.name} className="bg-white p-3 rounded-lg border border-black flex justify-between items-center group">
                      <div>
                        <span className="text-xs text-gray-600 block mb-1">{bank.name}</span>
                        <span className="font-mono font-bold text-black">{bank.no}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(bank.no, bank.name)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Salin Nomor"
                      >
                        {copiedId === bank.name ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
              <p className="text-sm text-green-800 font-medium">
                Setelah melakukan transfer, silakan klik tombol di bawah untuk mengonfirmasi pembayaran melalui WhatsApp. Admin akan segera mengaktifkan paket Anda.
              </p>
            </div>

            <button 
              onClick={confirmPayment}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black py-3 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105"
            >
              <Send size={18} />
              Konfirmasi via WA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
