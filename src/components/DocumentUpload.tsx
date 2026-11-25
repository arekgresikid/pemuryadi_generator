import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { processReferenceFile } from '../utils/referenceFiles';

export interface UploadedFile {
  data: string;
  mimeType: string;
  name: string;
  /** Teks terstruktur hasil ekstraksi untuk dokumen non-gambar (PDF, DOCX, XLSX, TXT) */
  extractedText?: string;
}

interface DocumentUploadProps {
  onFileUploaded: (file: UploadedFile | null) => void;
  label?: string;
}

export default function DocumentUpload({ onFileUploaded, label = "Upload Dokumen Referensi" }: DocumentUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [statusLabel, setStatusLabel] = useState<string>('File siap digunakan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      const processed = await processReferenceFile(file);
      setFileName(file.name);

      if (processed.kind === 'image' && processed.base64) {
        setStatusLabel('Gambar siap dianalisis');
        onFileUploaded({
          data: processed.base64,
          mimeType: processed.mimeType || file.type || 'image/jpeg',
          name: file.name
        });
      } else {
        const charCount = (processed.text || '').length;
        setStatusLabel(`Dokumen terbaca (${charCount.toLocaleString('id-ID')} karakter)`);
        onFileUploaded({
          data: '',
          mimeType: file.type || 'text/plain',
          name: file.name,
          extractedText: processed.text || ''
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal membaca file. Gunakan PDF, DOCX, XLSX, TXT, PNG, atau JPG.');
      setFileName(null);
      onFileUploaded(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">{label}</label>
        {fileName && !isProcessing && (
          <button 
            type="button"
            onClick={() => {
              setFileName(null);
              setError(null);
              onFileUploaded(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center gap-2
          ${fileName ? 'border-red-500/50 bg-red-500/5' : 'border-black hover:border-red-500/50 hover:bg-white/5'}
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.txt"
          className="hidden"
        />
        
        {isProcessing ? (
          <>
            <Loader2 className="text-blue-500 animate-spin" size={24} />
            <span className="text-xs text-gray-700 font-medium">Membaca isi dokumen...</span>
          </>
        ) : fileName ? (
          <>
            {fileName.toLowerCase().endsWith('.pdf') || fileName.toLowerCase().includes('.doc') || fileName.toLowerCase().includes('.xls') || fileName.toLowerCase().endsWith('.txt') ? (
              <FileText className="text-red-500" size={24} />
            ) : (
              <ImageIcon className="text-red-500" size={24} />
            )}
            <span className="text-xs text-gray-700 font-medium truncate max-w-full px-2">{fileName}</span>
            <span className="text-[10px] text-emerald-700 font-bold">{statusLabel}</span>
          </>
        ) : (
          <>
            <Upload className="text-gray-500" size={24} />
            <span className="text-xs text-gray-600 font-medium text-center">Klik untuk Upload PDF, Word (.docx), Excel (.xlsx), TXT, PNG, JPG</span>
          </>
        )}
      </div>
      
      {error && (
        <p className="text-[10px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
