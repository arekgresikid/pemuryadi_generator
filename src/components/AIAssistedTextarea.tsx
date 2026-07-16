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
      
      const randomSeed = Math.floor(Math.random() * 10000);
      const prompt = `Berikan contoh konten acak, unik, dan detail (bisa dalam bentuk beberapa baris atau poin) untuk text area dengan konteks: "${promptContext}".
Pastikan konten ini memiliki sudut pandang atau variasi yang berbeda dari biasanya (Seed: ${randomSeed}).
Jawab LANGSUNG dengan isinya saja, tanpa tanda kutip di awal/akhir, tanpa basa-basi. Jika formatnya butuh dipisah baris, gunakan newline.`;

      const response = await ai.models.generateContent({
        model: 'openai',
        contents: prompt,
        config: {
          temperature: 0.9,
          systemInstruction: 'Anda adalah asisten pendidikan pembuat ide kreatif. Berikan jawaban yang selalu bervariasi, terstruktur rapi dan langsung pada intinya.',
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
        className={`w-full ${className}`} 
        placeholder={placeholder}
        onChange={(e) => {
          if (onValueChange) onValueChange(e.target.value);
          if (props.onChange) props.onChange(e);
        }}
        {...props} 
      />
    </div>
  );
}
