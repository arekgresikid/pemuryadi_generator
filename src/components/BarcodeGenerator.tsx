import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, Link, FileText, Settings, Image as ImageIcon, CheckCircle, Smartphone } from 'lucide-react';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';

const BarcodeGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qr' | 'barcode'>('qr');
  const [inputValue, setInputValue] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState<string | null>('/favicon.png');
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
  };

  const downloadImage = () => {
    if (!containerRef.current || !inputValue) return;
    
    // Using svg elements to render image
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Setup canvas size
    const svgSize = svgElement.getBoundingClientRect();
    canvas.width = svgSize.width * 2; // High res
    canvas.height = svgSize.height * 2;

    img.onload = () => {
      if (ctx) {
        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const a = document.createElement("a");
        a.download = `Pemuryadi_${activeTab === 'qr' ? 'QRCode' : 'Barcode'}_${Date.now()}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const defaultValue = "https://digen.id";
  const displayValue = inputValue || defaultValue;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
          <Smartphone className="text-blue-600" size={32} />
          Generator Barcode & QR
        </h1>
        <p className="text-gray-600">
          Buat QR Code 2D dan Barcode 1D kustom secara gratis. Anda dapat menyesuaikan warna, serta menambahkan logo khusus pada QR Code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Editor Settings */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'qr' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('qr')}
              >
                <Smartphone size={20} />
                QR Code (2D)
              </button>
              <button
                className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'barcode' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('barcode')}
              >
                <FileText size={20} />
                Barcode (1D)
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Input Value */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Teks atau URL Tujuan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Contoh: https://arekgresik.id"
                  />
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Settings size={16} /> Penyesuaian Warna
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Warna Garis/Kode</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={fgColor} 
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{fgColor.toUpperCase()}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Warna Latar</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{bgColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload - Only for QR */}
              {activeTab === 'qr' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <ImageIcon size={16} /> Logo Tengah (Opsional)
                  </label>
                  
                  {!logoUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/svg+xml"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleLogoUpload}
                      />
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-bold text-gray-700">Pilih Gambar Logo</p>
                      <p className="text-xs text-gray-500 mt-1">Disarankan format PNG/SVG</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-gray-200" />
                        <div>
                          <p className="text-sm font-bold text-blue-900 flex items-center gap-1"><CheckCircle size={14} /> Logo Terpasang</p>
                          <p className="text-xs text-blue-700">Logo akan dirender di tengah QR Code</p>
                        </div>
                      </div>
                      <button 
                        onClick={removeLogo}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Logo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview & Download */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="bg-gray-50 border-b border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 text-center">Pratinjau Langsung</h3>
            </div>
            <div className="p-8 flex flex-col items-center">
              
              <div 
                ref={containerRef}
                className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 w-full flex justify-center mb-6 overflow-hidden"
                style={{ backgroundColor: bgColor }}
              >
                {activeTab === 'qr' ? (
                  <QRCodeSVG 
                    value={displayValue}
                    size={200}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H" // High error correction to accommodate logo
                    imageSettings={logoUrl ? {
                      src: logoUrl,
                      height: 48,
                      width: 48,
                      excavate: true,
                    } : undefined}
                  />
                ) : (
                  <Barcode 
                    value={displayValue} 
                    background={bgColor}
                    lineColor={fgColor}
                    width={2}
                    height={100}
                    fontSize={14}
                    displayValue={true}
                  />
                )}
              </div>

              <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-xs mb-4">
                <strong>Informasi Privasi:</strong> Kode QR dan Barcode yang Anda hasilkan tidak disimpan di database kami demi menjaga kerahasiaan. Pastikan Anda mengunduh hasil generator setelah selesai.
              </div>

              {!inputValue && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-4 text-center border border-amber-200">
                  Menampilkan data default. Masukkan teks untuk melihat perubahan Anda.
                </p>
              )}

              <button
                onClick={downloadImage}
                disabled={!inputValue && displayValue === defaultValue}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
              >
                <Download size={18} />
                Unduh Gambar {activeTab === 'qr' ? 'QR Code' : 'Barcode'}
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
