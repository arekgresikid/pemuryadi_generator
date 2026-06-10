import React, { useState, useEffect } from 'react';
import { Shield, Check, Star, Zap, Crown, Award, X, CreditCard, Send, Copy, Landmark, BookOpen, Gamepad2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const getDiscountedPrice = (priceStr?: string) => {
  if (!priceStr) return '';
  const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return priceStr;
  const discounted = num * 0.8;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(discounted).replace('IDR', 'Rp').trim();
};

export default function Pricing() {
  const { user, profile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherClaimed, setVoucherClaimed] = useState(false);
  const [globalVoucherActive, setGlobalVoucherActive] = useState(true); // Default true until fetched
  const [globalVoucherCode, setGlobalVoucherCode] = useState('');
  const [trialActive, setTrialActive] = useState(false);
  const [trialDays, setTrialDays] = useState('3');
  const [trialTokens, setTrialTokens] = useState('50');
  const [trialTier, setTrialTier] = useState('Premium');
  const [waNumber, setWaNumber] = useState('6281347697809');
  const [waNumber2, setWaNumber2] = useState('');
  const [priceEssential, setPriceEssential] = useState('Rp 170.000');
  const [pricePremium, setPricePremium] = useState('Rp 408.000');
  const [priceUltimate, setPriceUltimate] = useState('Rp 816.000');
  const [priceSupreme, setPriceSupreme] = useState('Rp 1.250.000');
  const [priceTitan, setPriceTitan] = useState('Rp 2.000.000');
  const [packageCategory, setPackageCategory] = useState<'administrasi' | 'games' | 'kombinasi'>('kombinasi');

  useEffect(() => {
    const fetchVoucherSettings = async () => {
      try {
        const fetchSet = async (k: string, setter: any, isBool = false) => {
          const res = await fetch(`/api/settings/${k}`);
          if (res.ok) {
            const data = await res.json() as any;
            if (data.value) setter(isBool ? data.value === 'true' : data.value);
          }
        };
        await Promise.all([
          fetchSet('promo_voucher_active', setGlobalVoucherActive, true),
          fetchSet('promo_voucher_code', setGlobalVoucherCode),
          fetchSet('promo_trial_active', setTrialActive, true),
          fetchSet('promo_trial_days', setTrialDays),
          fetchSet('promo_trial_tokens', setTrialTokens),
          fetchSet('promo_trial_tier', setTrialTier),
          fetchSet('whatsapp_admin_number', setWaNumber),
          fetchSet('whatsapp_admin_number_2', setWaNumber2),
          fetchSet('price_essential', setPriceEssential),
          fetchSet('price_premium', setPricePremium),
          fetchSet('price_ultimate', setPriceUltimate),
          fetchSet('price_supreme', setPriceSupreme),
          fetchSet('price_titan', setPriceTitan),
        ]);
      } catch (e) {}
    };
    fetchVoucherSettings();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const handleClaimVoucher = () => {
    if (!globalVoucherActive) {
      return toast.error("Mohon maaf, promo voucher sedang tidak aktif saat ini.");
    }
    const code = voucherInput.trim().toUpperCase();
    if (globalVoucherCode && code === globalVoucherCode) {
      setVoucherClaimed(true);
      toast.success("Berhasil! Voucher Diskon 20% telah diterapkan secara otomatis pada seluruh paket berlangganan.");
    } else if (!globalVoucherCode && (code === 'GURUHEBAT20' || code === 'DISKON20')) {
      setVoucherClaimed(true);
      toast.success("Berhasil! Voucher Diskon 20% telah diterapkan secara otomatis pada seluruh paket berlangganan.");
    } else {
      toast.error("Kode voucher tidak valid atau sudah kadaluarsa.");
    }
  };

  const currentTier = profile?.tier || profile?.role || (user ? 'Free' : null);
  const isEligibleForDiscount = voucherClaimed && (!currentTier || currentTier.toLowerCase() === 'free');

  const plans = [
    ...(trialActive ? [{
      name: 'Free Trial',
      description: `Coba gratis fitur ${trialTier} selama ${trialDays} hari`,
      price: 'Rp 0',
      period: ` / ${trialDays} Hari`,
      tokens: parseInt(trialTokens) || 50,
      tokenDesc: 'x generate total',
      features: [
        trialTier === 'Free' ? 'Dengan Watermark (WM)' : 'Tanpa Watermark (WM)',
        `Masa Aktif ${trialDays} Hari`,
        'Aktivasi manual via WhatsApp',
        'Tanpa kartu kredit'
      ],
      icon: <Star size={24} className="text-blue-600" />,
      color: 'blue',
      badge: 'PROMO KHUSUS',
      buttonText: 'Klaim via WhatsApp'
    }] : []),
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
      badge: 'PEMULA',
      buttonText: 'Mulai Gratis'
    },
    {
      name: 'Essential',
      description: 'Cukup untuk kebutuhan ngajar bulanan',
      price: priceEssential,
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
      badge: 'TERJANGKAU',
      buttonText: 'Pilih Essential'
    },
    {
      name: 'Premium',
      description: 'Cocok untuk penyusunan materi padat',
      price: pricePremium,
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
      badge: 'PALING DIMINATI',
      buttonText: 'Aktivasi Premium',
      popular: true
    },
    {
      name: 'Ultimate',
      description: 'Paket super untuk sekolah / pengawas',
      price: priceUltimate,
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
      badge: 'PROFESIONAL',
      buttonText: 'Aktivasi Ultimate'
    },
    {
      name: 'SUPREME',
      description: 'Tak terbatas dengan segala kemampuan full power.',
      price: priceSupreme,
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
      badge: 'TERBAIK',
      buttonText: 'Dapatkan Supreme'
    },
    {
      name: 'Titan',
      description: 'Paket Ultimate Terkuat untuk Instansi Skala Besar',
      price: priceTitan,
      period: ' / 1 Tahun',
      tokens: '2500',
      tokenDesc: 'x generate / tahun (FUP)',
      features: [
        'Tanpa Watermark (WM)',
        'Akses Lifetime (Selamanya)',
        'Server Eksklusif Dedicated',
        'Whitelist semua fitur VIP',
        'Custom Fitur Sistem'
      ],
      icon: <Crown size={24} className="text-rose-500" />,
      color: 'rose',
      badge: 'ENTERPRISE',
      buttonText: 'Hubungi Sales'
    }
  ];

  const administrasiPlans = [
    ...(trialActive ? [{
      name: 'Free Trial',
      description: `Coba gratis fitur ${trialTier} selama ${trialDays} hari`,
      price: 'Rp 0',
      period: ` / ${trialDays} Hari`,
      tokens: parseInt(trialTokens) || 50,
      tokenDesc: 'x generate total',
      features: [
        trialTier === 'Free' ? 'Dengan Watermark (WM)' : 'Tanpa Watermark (WM)',
        `Masa Aktif ${trialDays} Hari`,
        'Aktivasi manual via WhatsApp',
        'Tanpa kartu kredit'
      ],
      icon: <Star size={24} className="text-blue-600" />,
      color: 'blue',
      badge: 'PROMO KHUSUS',
      buttonText: 'Klaim via WhatsApp'
    }] : []),
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
        'Akses ke fitur administrasi dasar'
      ],
      icon: <Shield size={24} className="text-gray-600" />,
      color: 'slate',
      badge: 'PEMULA',
      buttonText: 'Mulai Gratis'
    },
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
    ...(trialActive ? [{
      name: 'Free Trial',
      description: `Coba gratis fitur ${trialTier} selama ${trialDays} hari`,
      price: 'Rp 0',
      period: ` / ${trialDays} Hari`,
      tokens: parseInt(trialTokens) || 50,
      tokenDesc: 'x generate total',
      features: [
        trialTier === 'Free' ? 'Dengan Watermark (WM)' : 'Tanpa Watermark (WM)',
        `Masa Aktif ${trialDays} Hari`,
        'Aktivasi manual via WhatsApp',
        'Tanpa kartu kredit'
      ],
      icon: <Star size={24} className="text-blue-600" />,
      color: 'blue',
      badge: 'PROMO KHUSUS',
      buttonText: 'Klaim via WhatsApp'
    }] : []),
    {
      name: 'Free',
      description: 'Akses pengenalan untuk mengeksplorasi fitur dasar',
      price: 'Rp 0',
      period: ' Selamanya',
      tokens: 2,
      tokenDesc: 'x generate / hari',
      features: [
        'Hasil game menyertakan Watermark',
        'Pembaruan otomatis kuota setiap hari',
        'Akses ke fitur template dasar'
      ],
      icon: <Shield size={24} className="text-gray-600" />,
      color: 'slate',
      badge: 'PEMULA',
      buttonText: 'Mulai Gratis'
    },
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
    if (plan.name === 'Free Trial') {
      const email = profile?.email || user?.email || '[Tulis email Anda di sini]';
      const message = encodeURIComponent(`Halo Admin, saya ingin mencoba Free Trial aplikasi. Mohon bantuannya untuk mengaktifkan akses trial untuk akun dengan alamat email: ${email}`);
      const finalWaNumber = waNumber || '6281347697809';
      window.open(`https://wa.me/${finalWaNumber}?text=${message}`, '_blank');
      return;
    }

    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk berlangganan");
      return;
    }

    setSelectedPlan(plan);
    setShowModal(true);
  };
  const confirmPayment = () => {
    if (!selectedPlan) return;
    const finalPriceStr = isEligibleForDiscount ? getDiscountedPrice(selectedPlan?.price || '') : selectedPlan?.price;
    
    // Gunakan nomor dari pengaturan Admin, jika kosong gunakan nomor default E-Wallet
    let finalWaNumber = waNumber && waNumber.trim() !== '' ? waNumber : '081330763633';
    
    // Bersihkan dari spasi, tanda hubung, atau karakter lain, lalu pastikan diawali dengan kode negara
    finalWaNumber = finalWaNumber.replace(/\D/g, '');
    if (finalWaNumber.startsWith('0')) {
      finalWaNumber = '62' + finalWaNumber.substring(1);
    }
    
    const message = encodeURIComponent(`Hallo Admin Pemuryadi Generator, saya (${profile?.email || 'Guest'}) ingin mengkonfirmasi pembayaran untuk upgrade paket *${selectedPlan.name}* senilai *${finalPriceStr}*. Mohon info untuk langkah selanjutnya.`);
    window.open(`https://wa.me/${finalWaNumber}?text=${message}`, '_blank');
    setShowModal(false);
  };

  return (
    <div className="p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Banner Khusus Pengguna Baru */}
      {globalVoucherActive && (!currentTier || currentTier.toLowerCase() === 'free') && (
        <div className="max-w-7xl mx-auto mb-10 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Spesial Pengguna Baru</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-2 drop-shadow-md">Voucher Diskon 20%</h2>
            <p className="text-white/90 text-sm md:text-lg font-medium">Klaim potongan harga eksklusif Anda untuk berlangganan paket Premium atau Ultimate sekarang juga!</p>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto flex flex-col gap-2">
            {!voucherClaimed ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input 
                  type="text" 
                  placeholder="Ketik Kode Voucher..." 
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClaimVoucher()}
                  className="px-4 py-3 w-full bg-white/95 rounded-xl text-slate-800 font-bold outline-none sm:flex-1 md:w-56 placeholder:text-slate-400 placeholder:font-normal uppercase shadow-inner border-2 border-transparent focus:border-red-300 transition-colors"
                />
                <button 
                  onClick={handleClaimVoucher}
                  className="w-full sm:w-auto bg-white text-red-600 hover:bg-gray-50 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg hover:scale-105"
                >
                  Klaim
                </button>
              </div>
            ) : (
              <div className="bg-green-500 text-white flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg cursor-default">
                <Check size={20} /> Telah Diklaim
              </div>
            )}
            {!voucherClaimed && <div className="text-white/80 text-xs text-center md:text-right mt-1">Gunakan kode: <span className="font-bold">{globalVoucherCode || 'GURUHEBAT20'}</span></div>}
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
              className={`relative rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 group ${
                plan.popular ? 'border-2 border-blue-500 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] scale-105 z-10 bg-white' : 
                isSupreme ? 'border border-purple-300/50 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-xl' : 
                isTitan ? 'border border-rose-300/50 bg-gradient-to-br from-rose-50 via-white to-orange-50 shadow-xl' :
                'border border-gray-100 bg-white shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Modern Glow Effects */}
              {isSupreme && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              )}
              {isTitan && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              )}
              {plan.popular && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              )}

              {plan.badge && (
                <div className="absolute top-6 -right-10 w-40 transform rotate-45 z-20 shadow-md">
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] text-center py-1.5 ${
                    isTitan ? 'bg-rose-600 text-white' :
                    isSupreme ? 'bg-purple-600 text-white' :
                    plan.popular ? 'bg-blue-600 text-white' :
                    'bg-gray-800 text-white'
                  }`}>
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8 z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl ${
                    isTitan ? 'bg-gradient-to-br from-rose-100 to-orange-100 text-rose-600' :
                    isSupreme ? 'bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600' :
                    plan.name === 'Premium' ? 'bg-emerald-100 text-emerald-600' :
                    plan.name === 'Ultimate' ? 'bg-blue-100 text-blue-600' :
                    plan.name === 'Essential' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-black uppercase tracking-wider ${
                      isTitan ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500' :
                      isSupreme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600' :
                      plan.name === 'Premium' ? 'text-emerald-700' :
                      plan.name === 'Ultimate' ? 'text-blue-700' :
                      plan.name === 'Essential' ? 'text-amber-700' :
                      'text-slate-700'
                    }`}>
                      {plan.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 font-medium mb-6 h-10 leading-relaxed">{plan.description}</p>
                
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline flex-wrap gap-2">
                    <span className={`text-4xl font-black tracking-tighter ${plan.popular ? 'text-blue-950' : 'text-gray-900'}`}>
                      {isEligibleForDiscount && plan.name !== 'Free' ? getDiscountedPrice(plan.price) : plan.price}
                    </span>
                    {isEligibleForDiscount && plan.name !== 'Free' && (
                      <span className="text-sm font-bold line-through text-gray-400 decoration-red-500/50">{plan.price}</span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mt-2">{plan.period}</span>
                </div>

                <div className="mb-8 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Kuota</span>
                  <div className="flex items-baseline gap-1 text-right">
                    <span className={`text-2xl font-black ${
                      isTitan ? 'text-rose-600' : 
                      isSupreme ? 'text-purple-600' : 
                      plan.popular ? 'text-blue-600' : 
                      'text-gray-800'
                    }`}>{plan.tokens}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Generate</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                      <div className={`mt-0.5 p-1 rounded-full shrink-0 ${
                        isTitan ? 'bg-rose-100 text-rose-600' :
                        isSupreme ? 'bg-purple-100 text-purple-600' :
                        plan.popular ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto pt-4">
                  <button 
                    onClick={() => handleUpgrade(plan)}
                    disabled={isCurrent && plan.name === 'Free'}
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                      isCurrent && plan.name === 'Free' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                      isCurrent ? 'bg-gray-900 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]' :
                      isTitan ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-[0_10px_20px_-10px_rgba(244,63,94,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(244,63,94,0.6)] hover:scale-[1.02]' :
                      isSupreme ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_10px_20px_-10px_rgba(147,51,234,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(147,51,234,0.6)] hover:scale-[1.02]' :
                      plan.popular ? 'bg-blue-600 text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(37,99,235,0.6)] hover:bg-blue-700 hover:scale-[1.02]' :
                      'bg-white text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    {isCurrent ? (plan.name === 'Free' ? 'Paket Saat Ini' : 'Perpanjang Layanan') : plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center max-w-2xl mx-auto p-6 bg-white border border-gray-300 rounded-2xl">
        <h4 className="text-black font-bold mb-2 flex justify-center items-center gap-2"><Shield size={18} className="text-red-500"/> Bagaimana sistem Tokens bekerja?</h4>
        <p className="text-sm text-gray-600">
          Satu token setara dengan satu kali tekan tombol Generate. Pembuatan soal, perangkat ajar, atau kegiatan di tab apa pun akan memakan 1 Token. Jika token habis, Anda bisa membeli paket token secara terpisah kapan pun.
        </p>
      </div>

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-300">
          <div className="bg-white border border-gray-300 p-6 md:p-8 rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-black mb-2 pr-6">Pilih Metode Pembayaran</h3>
            <p className="text-gray-600 text-sm mb-6">
              Selesaikan pembayaran untuk paket <strong className="text-black">{selectedPlan.name}</strong> sebesar{' '}
              {isEligibleForDiscount ? (
                <>
                  <span className="line-through text-gray-400 mr-2">{selectedPlan.price}</span>
                  <strong className="text-red-500 text-lg">{getDiscountedPrice(selectedPlan.price)}</strong>
                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Diskon 20%</span>
                </>
              ) : (
                <strong className="text-red-300">{selectedPlan.price}</strong>
              )}
              .
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
