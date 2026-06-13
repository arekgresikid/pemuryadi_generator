import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Download, Printer, Save, RefreshCw } from 'lucide-react';
import { QRCode } from 'react-qrcode-logo';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGenerator() {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('INVOICE');
  const [qrData, setQrData] = useState('https://digen.id');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [fromName, setFromName] = useState('DIGEN.ID');
  const [fromAddress, setFromAddress] = useState('Jl. Pendidikan No. 1, Samarinda');
  const [fromEmail, setFromEmail] = useState('admin@digen.id');
  const [fromPhone, setFromPhone] = useState('0812-3456-7890');
  const [fromLogo, setFromLogo] = useState(''); // URL logo

  const [toName, setToName] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [toPhone, setToPhone] = useState('');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: Date.now().toString(), description: 'Paket Ultimate (1 Tahun)', quantity: 1, price: 500000 }
  ]);

  const [taxPercent, setTaxPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('Terima kasih atas kepercayaan Anda menggunakan layanan kami.');

  const [isSaved, setIsSaved] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('digen_id_admin_invoice');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.invoiceNo) setInvoiceNo(data.invoiceNo);
        if (data.invoiceTitle) setInvoiceTitle(data.invoiceTitle);
        if (data.qrData) setQrData(data.qrData);
        if (data.date) setDate(data.date);
        if (data.dueDate) setDueDate(data.dueDate);
        if (data.fromName) setFromName(data.fromName);
        if (data.fromAddress) setFromAddress(data.fromAddress);
        if (data.fromEmail) setFromEmail(data.fromEmail);
        if (data.fromPhone) setFromPhone(data.fromPhone);
        if (data.fromLogo) setFromLogo(data.fromLogo);
        if (data.toName) setToName(data.toName);
        if (data.toAddress) setToAddress(data.toAddress);
        if (data.toEmail) setToEmail(data.toEmail);
        if (data.toPhone) setToPhone(data.toPhone);
        if (data.items) setItems(data.items);
        if (data.taxPercent !== undefined) setTaxPercent(data.taxPercent);
        if (data.discountAmount !== undefined) setDiscountAmount(data.discountAmount);
        if (data.notes) setNotes(data.notes);
      } catch (e) {
        console.error('Failed to parse saved invoice data', e);
      }
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setDueDate(nextMonth.toISOString().split('T')[0]);
      setInvoiceNo(`INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    }
  }, []);

  // Save to LocalStorage automatically whenever data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = {
        invoiceNo, invoiceTitle, qrData, date, dueDate, fromName, fromAddress, fromEmail, fromPhone, fromLogo,
        toName, toAddress, toEmail, toPhone, items, taxPercent, discountAmount, notes
      };
      localStorage.setItem('digen_id_admin_invoice', JSON.stringify(data));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [invoiceNo, invoiceTitle, qrData, date, dueDate, fromName, fromAddress, fromEmail, fromPhone, fromLogo, toName, toAddress, toEmail, toPhone, items, taxPercent, discountAmount, notes]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = (subtotal - discountAmount) * (taxPercent / 100);
  const total = subtotal - discountAmount + taxAmount;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrCanvas = document.getElementById('invoice-qr') as HTMLCanvasElement;
    const qrImageHtml = qrCanvas ? `<img src="${qrCanvas.toDataURL()}" alt="QR Code" width="80" height="80" />` : `<img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrData)}" alt="QR Code" width="80" height="80" />`;

    const itemsHtml = items.map(item => `
      <tr class="border-b border-gray-100">
        <td class="py-3 px-4 text-gray-800">${item.description || '-'}</td>
        <td class="py-3 px-4 text-gray-800 text-center">${item.quantity}</td>
        <td class="py-3 px-4 text-gray-800 text-right">${formatRupiah(item.price)}</td>
        <td class="py-3 px-4 text-gray-800 text-right font-medium">${formatRupiah(item.quantity * item.price)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>${invoiceTitle || 'INVOICE'} ${invoiceNo}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              @page { size: A4; margin: 0; }
              @media print {
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
              body { font-family: 'Arial', sans-serif; background: white; margin: 0; padding: 40px; }
          </style>
      </head>
      <body>
          <div class="max-w-4xl mx-auto">
            <!-- Header Invoice -->
            <div class="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-8">
              <div>
                ${fromLogo ? `<img src="${fromLogo}" alt="Logo" class="h-16 mb-4 object-contain max-w-[200px]" />` : `<div class="text-3xl font-black text-blue-600 mb-4 tracking-tighter">${invoiceTitle || 'INVOICE'}</div>`}
                <div class="text-gray-800 font-bold text-lg mb-1">${fromName || 'Nama Perusahaan'}</div>
                <div class="text-gray-500 text-sm whitespace-pre-wrap">${fromAddress || 'Alamat Perusahaan'}</div>
                <div class="text-gray-500 text-sm">${fromPhone} ${fromEmail ? ` • ${fromEmail}` : ''}</div>
              </div>
              <div class="text-right">
                <h1 class="text-4xl font-black text-gray-200 uppercase tracking-widest mb-4">${invoiceTitle || 'INVOICE'}</h1>
                <div class="text-sm">
                  <div class="grid grid-cols-2 gap-x-4 mb-1">
                    <span class="text-gray-500 font-medium text-left">Nomor Invoice:</span>
                    <span class="font-bold text-gray-800 text-right">${invoiceNo || '-'}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4 mb-1">
                    <span class="text-gray-500 font-medium text-left">Tanggal:</span>
                    <span class="font-bold text-gray-800 text-right">${date || '-'}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4">
                    <span class="text-gray-500 font-medium text-left">Jatuh Tempo:</span>
                    <span class="font-bold text-gray-800 text-right">${dueDate || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bill To -->
            <div class="mb-8">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Tagihan Kepada:</h3>
              <div class="text-gray-800 font-bold text-lg mb-1">${toName || 'Nama Klien'}</div>
              <div class="text-gray-600 text-sm whitespace-pre-wrap mb-1">${toAddress || 'Alamat Klien'}</div>
              <div class="text-gray-600 text-sm">${toPhone} ${toEmail ? ` • ${toEmail}` : ''}</div>
            </div>

            <!-- Table Items -->
            <div class="mb-8">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="bg-gray-50 border-y border-gray-200">
                    <th class="py-3 px-4 font-bold text-gray-700">Deskripsi</th>
                    <th class="py-3 px-4 font-bold text-gray-700 text-center w-24">Kuantitas</th>
                    <th class="py-3 px-4 font-bold text-gray-700 text-right w-40">Harga Satuan</th>
                    <th class="py-3 px-4 font-bold text-gray-700 text-right w-40">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml || `<tr><td colspan="4" class="py-8 text-center text-gray-400 italic">Belum ada item tagihan.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Totals -->
            <div class="flex justify-end mb-12">
              <div class="w-full sm:w-1/2 lg:w-2/3 xl:w-1/2">
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${formatRupiah(subtotal)}</span>
                  </div>
                  ${discountAmount > 0 ? `
                  <div class="flex justify-between text-red-500">
                    <span>Diskon</span>
                    <span>- ${formatRupiah(discountAmount)}</span>
                  </div>` : ''}
                  ${taxPercent > 0 ? `
                  <div class="flex justify-between text-gray-600">
                    <span>Pajak (${taxPercent}%)</span>
                    <span>${formatRupiah(taxAmount)}</span>
                  </div>` : ''}
                  <div class="flex justify-between text-lg font-black text-blue-600 border-t-2 border-gray-200 pt-3 mt-3">
                    <span>Total Tagihan</span>
                    <span>${formatRupiah(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes & Footer -->
            <div class="mt-auto border-t border-gray-100 pt-8 flex justify-between items-end">
              <div class="w-3/4">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Catatan / Syarat & Ketentuan:</h4>
                <p class="text-sm text-gray-600 whitespace-pre-wrap">${notes}</p>
              </div>
              <div class="w-1/4 flex justify-end">
                ${qrData ? qrImageHtml : ''}
              </div>
            </div>
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const resetForm = () => {
    if (window.confirm("Apakah Anda yakin ingin mengulang form ini? Data yang belum disimpan akan hilang.")) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setDueDate(nextMonth.toISOString().split('T')[0]);
      setInvoiceNo(`INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
      setInvoiceTitle('INVOICE');
      setQrData('https://digen.id');
      setToName('');
      setToAddress('');
      setToEmail('');
      setToPhone('');
      setItems([{ id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
      setTaxPercent(0);
      setDiscountAmount(0);
      setNotes('Terima kasih atas kepercayaan Anda menggunakan layanan kami.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText size={24} className="text-blue-600" />
            Invoice Generator
          </h2>
          <p className="text-xs text-gray-500">Kelola dan terbitkan faktur secara profesional.</p>
        </div>
        <div className="flex gap-2">
          {isSaved && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><Save size={14}/> Tersimpan otomatis</span>}
          <button onClick={resetForm} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
            <RefreshCw size={14} /> Reset
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} /> Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Grid Utama: Kiri Form (print:hidden), Kanan Preview (print:w-full) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: Form Input */}
        <div className="space-y-6 print:hidden">
          {/* Detail Invoice */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-700 text-sm border-b pb-2">Detail Invoice</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Judul Dokumen</label>
                  <input type="text" value={invoiceTitle} onChange={e => setInvoiceTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="INVOICE" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nomor</label>
                  <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="INV-2026..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Tanggal</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Jatuh Tempo</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" />
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Data QR Code (Link/Teks)</label>
                <input type="text" value={qrData} onChange={e => setQrData(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="https://digen.id" />
              </div>
            </div>
          </div>

          {/* Dari & Kepada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-700 text-sm border-b pb-2">Dari (Pengirim)</h3>
              <div>
                <input type="text" value={fromName} onChange={e => setFromName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2" placeholder="Nama Perusahaan/Instansi" />
                <textarea value={fromAddress} onChange={e => setFromAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2" placeholder="Alamat" rows={2} />
                <input type="text" value={fromEmail} onChange={e => setFromEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2" placeholder="Email" />
                <input type="text" value={fromPhone} onChange={e => setFromPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2" placeholder="Nomor Telepon/WA" />
                <input type="text" value={fromLogo} onChange={e => setFromLogo(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" placeholder="URL Logo (Opsional)" />
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-700 text-sm border-b pb-2">Kepada (Klien)</h3>
              <div>
                <input type="text" value={toName} onChange={e => setToName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2" placeholder="Nama Klien/Sekolah" />
                <textarea value={toAddress} onChange={e => setToAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2" placeholder="Alamat Klien" rows={2} />
                <input type="text" value={toEmail} onChange={e => setToEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2" placeholder="Email Klien" />
                <input type="text" value={toPhone} onChange={e => setToPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" placeholder="Nomor Telepon/WA" />
              </div>
            </div>
          </div>

          {/* Daftar Item */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-gray-700 text-sm">Daftar Item</h3>
              <button onClick={addItem} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1 font-bold">
                <Plus size={14} /> Tambah
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="w-full sm:w-2/5">
                    <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm" placeholder="Deskripsi layanan/produk" />
                  </div>
                  <div className="w-full sm:w-1/5 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 sm:hidden">Qty:</span>
                    <input type="number" min="1" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm" placeholder="Qty" />
                  </div>
                  <div className="w-full sm:w-1/4 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 sm:hidden">Harga:</span>
                    <input type="number" min="0" value={item.price} onChange={e => updateItem(item.id, 'price', parseInt(e.target.value) || 0)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm" placeholder="Harga Satuan" />
                  </div>
                  <div className="w-full sm:w-auto flex justify-end shrink-0">
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Pajak (%)</label>
                <input type="number" min="0" max="100" value={taxPercent} onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Diskon (Rp)</label>
                <input type="number" min="0" value={discountAmount} onChange={e => setDiscountAmount(parseInt(e.target.value) || 0)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 mt-2">Catatan / Syarat Ketentuan</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" rows={3} />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Preview Invoice */}
        <div className="print:col-span-2">
          <div id="printArea" className="bg-white rounded-xl shadow-md border border-gray-200 p-8 min-h-[800px] print:shadow-none print:border-none print:p-0 print:min-h-auto print:w-full print:m-0 w-full overflow-hidden">
            
            {/* Header Invoice */}
            <div className="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-8">
              <div>
                {fromLogo ? (
                  <img src={fromLogo} alt="Logo" className="h-16 mb-4 object-contain max-w-[200px]" />
                ) : (
                  <div className="text-3xl font-black text-blue-600 mb-4 tracking-tighter">{invoiceTitle || 'INVOICE'}</div>
                )}
                <div className="text-gray-800 font-bold text-lg mb-1">{fromName || 'Nama Perusahaan'}</div>
                <div className="text-gray-500 text-sm whitespace-pre-wrap">{fromAddress || 'Alamat Perusahaan'}</div>
                <div className="text-gray-500 text-sm">{fromPhone} {fromEmail ? ` • ${fromEmail}` : ''}</div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-4">{invoiceTitle || 'INVOICE'}</h1>
                <div className="text-sm">
                  <div className="grid grid-cols-2 gap-x-4 mb-1">
                    <span className="text-gray-500 font-medium">Nomor Invoice:</span>
                    <span className="font-bold text-gray-800">{invoiceNo || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 mb-1">
                    <span className="text-gray-500 font-medium">Tanggal:</span>
                    <span className="font-bold text-gray-800">{date || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4">
                    <span className="text-gray-500 font-medium">Jatuh Tempo:</span>
                    <span className="font-bold text-gray-800">{dueDate || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Tagihan Kepada:</h3>
              <div className="text-gray-800 font-bold text-lg mb-1">{toName || 'Nama Klien'}</div>
              <div className="text-gray-600 text-sm whitespace-pre-wrap mb-1">{toAddress || 'Alamat Klien'}</div>
              <div className="text-gray-600 text-sm">{toPhone} {toEmail ? ` • ${toEmail}` : ''}</div>
            </div>

            {/* Table Items */}
            <div className="mb-8">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="py-3 px-4 font-bold text-gray-700">Deskripsi</th>
                    <th className="py-3 px-4 font-bold text-gray-700 text-center w-24">Kuantitas</th>
                    <th className="py-3 px-4 font-bold text-gray-700 text-right w-40">Harga Satuan</th>
                    <th className="py-3 px-4 font-bold text-gray-700 text-right w-40">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-800">{item.description || '-'}</td>
                      <td className="py-3 px-4 text-gray-800 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-gray-800 text-right">{formatRupiah(item.price)}</td>
                      <td className="py-3 px-4 text-gray-800 text-right font-medium">{formatRupiah(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 italic">Belum ada item tagihan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-full sm:w-1/2 lg:w-2/3 xl:w-1/2">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Diskon</span>
                      <span>- {formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                  {taxPercent > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Pajak ({taxPercent}%)</span>
                      <span>{formatRupiah(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black text-blue-600 border-t-2 border-gray-200 pt-3 mt-3">
                    <span>Total Tagihan</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Footer */}
            <div className="mt-auto border-t border-gray-100 pt-8 flex justify-between items-end">
              <div className="w-3/4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Catatan / Syarat & Ketentuan:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
              </div>
              <div className="w-1/4 flex justify-end">
                {qrData && (
                  <QRCode id="invoice-qr" value={qrData} size={80} qrStyle="squares" eyeRadius={4} />
                )}
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
