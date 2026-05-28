import React, { useState } from 'react';
import { Image, Download, Loader2, FileText, Layout, Map, CreditCard } from 'lucide-react';
import { useToken } from '../api';
import ModelSelector from './ModelSelector';

interface AIVisualGeneratorProps {
  context: {
    subject: string;
    topic: string;
    level: string;
    phase: string;
    class: string;
  };
}

type VisualType = 'poster' | 'infographic' | 'mindmap' | 'flashcard';

interface ModelInfo {
  name: string;
  description: string;
}

const VISUAL_TYPES: { id: VisualType; label: string; icon: any; description: string }[] = [
  { id: 'poster', label: 'Poster', icon: Layout, description: 'Poster edukatif yang menarik' },
  { id: 'infographic', label: 'Infografis', icon: FileText, description: 'Visualisasi data dan informasi' },
  { id: 'mindmap', label: 'Mind Map', icon: Map, description: 'Peta konsep materi pembelajaran' },
  { id: 'flashcard', label: 'Flashcard', icon: CreditCard, description: 'Kartu belajar interaktif' },
];

export default function AIVisualGenerator({ context }: AIVisualGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<VisualType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('flux');

  const generateVisual = async (type: VisualType) => {
    setIsGenerating(true);
    setError(null);
    setSelectedType(type);

    try {
      await useToken(); // Potong token

      const prompt = `Educational ${type} about ${context.subject}: ${context.topic} for ${context.level} students. High quality, clear, modern style. Vibrant colors, no text overlay.`;
      const encodedPrompt = encodeURIComponent(prompt);
      const randomSeed = Math.floor(Math.random() * 1000000);

      const imageUrlStr = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${selectedModel}&nologo=true&seed=${randomSeed}`;

      const imageResponse = await fetch(imageUrlStr);
      if (!imageResponse.ok) {
        throw new Error('Gagal menghasilkan gambar. Silakan coba lagi.');
      }

      const blob = await imageResponse.blob();
      const objectUrl = URL.createObjectURL(blob);
      setGeneratedImage(objectUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat menghasilkan gambar.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${selectedType}-${context.topic.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
  };


  return (
    <div className="gen-card bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <Image className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Media Pembelajaran AI</h2>
          <p className="text-sm text-slate-400">Hasilkan media visual otomatis untuk materi {context.topic}</p>
        </div>
      </div>

      {/* Model Selector */}
      <div className="mb-6">
        <ModelSelector modality="image" value={selectedModel} onChange={setSelectedModel} disabled={isGenerating} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {VISUAL_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => generateVisual(type.id)}
            disabled={isGenerating}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
              selectedType === type.id && !generatedImage
                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <type.icon className="w-8 h-8" />
            <div className="text-center">
              <div className="text-sm font-semibold">{type.label}</div>
              <div className="text-[10px] opacity-60">{type.description}</div>
            </div>
          </button>
        ))}
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-slate-300 animate-pulse">Sedang merancang {selectedType} terbaik untuk Anda...</p>
          <p className="text-xs text-slate-500">Model: {selectedModel}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {generatedImage && !isGenerating && (
        <div className="space-y-4">
          <div className="relative group rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <img
              src={generatedImage}
              alt="Generated Visual"
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={downloadImage}
                className="p-4 bg-white text-slate-900 rounded-full shadow-xl hover:scale-110 transition-transform"
              >
                <Download className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-5 h-5" />
              Unduh {selectedType}
            </button>
            <button
              onClick={() => setGeneratedImage(null)}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
            >
              Buat Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
