import React, { useState } from 'react';
import { GoogleGenAI } from '../lib/genai';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
  contextPrompt?: string;
}

export default function AIAssistedTextarea({ onValueChange, contextPrompt, className = '', placeholder, ...props }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({});
      const promptContext = contextPrompt || placeholder || 'ide acak berupa beberapa baris teks edukasi';
      
      const prompt = `Berikan contoh konten yang cukup panjang dan detail (bisa dalam bentuk beberapa baris atau poin) untuk text area dengan konteks: "${promptContext}".
Jawab LANGSUNG dengan isinya saja, tanpa tanda kutip di awal/akhir, tanpa basa-basi. Jika formatnya butuh dipisah baris, gunakan newline.`;

      const response = await ai.models.generateContent({
        model: 'openai',
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah asisten pendidikan pembuat ide. Berikan jawaban yang terstruktur rapi dan langsung pada intinya.',
        }
      });
      
      let result = response.text?.trim() || '';
      
      if (onValueChange) {
        onValueChange(result);
      } else if (props.onChange) {
        const e = {
          target: { value: result }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        props.onChange(e);
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full group">
      <textarea 
        className={`${className} pr-12`} 
        placeholder={placeholder}
        {...props} 
      />
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        title="Bantu isi dengan AI"
        className="absolute right-3 top-3 text-blue-500 hover:text-blue-600 disabled:opacity-50 transition-all opacity-70 hover:opacity-100 bg-white/80 rounded-full p-1.5 shadow-sm border border-blue-100 hover:scale-110 active:scale-95"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
