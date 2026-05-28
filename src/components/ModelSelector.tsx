import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';

interface ModelInfo {
  name: string;
  description: string;
}

interface ModelSelectorProps {
  modality?: 'text' | 'image';
  value: string;
  onChange: (model: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ modality = 'text', value, onChange, disabled }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback models
  const defaultTextModels: ModelInfo[] = [
    { name: 'openai', description: 'GPT-5.4 Nano - Fast & Balanced' },
    { name: 'openai-large', description: 'GPT-5.4 - Most Powerful & Intelligent' },
    { name: 'deepseek', description: 'DeepSeek V4 Flash - Fast Reasoning' },
    { name: 'gemma', description: 'Gemma 4 26B - Open-source, fast inference' },
    { name: 'mistral', description: 'Mistral Small 3.2 - Multilingual' },
    { name: 'claude-fast', description: 'Claude Haiku 4.5 - Fast & Intelligent' },
    { name: 'qwen-large', description: 'Qwen3.6 Plus - 396B MoE Flagship' },
  ];

  const defaultImageModels: ModelInfo[] = [
    { name: 'flux', description: 'Flux Schnell - Fast high-quality image generation' },
    { name: 'zimage', description: 'Z-Image Turbo - Fast 6B Flux with 2x upscaling' },
    { name: 'gptimage', description: 'GPT Image 1 Mini - Fast & affordable' },
    { name: 'gptimage-large', description: 'GPT Image 1.5 - High-fidelity generation' },
    { name: 'klein', description: 'FLUX.2 Klein 4B - Fast generation and editing' },
    { name: 'qwen-image', description: 'Qwen Image Plus - Text-to-image and editing' },
    { name: 'nova-canvas', description: 'Nova Canvas - Image generation & inpainting' },
    { name: 'wan-image', description: 'Wan 2.7 Image - Text-to-image up to 2K' },
  ];

  useEffect(() => {
    const defaults = modality === 'image' ? defaultImageModels : defaultTextModels;
    setModels(defaults);

    // Filter types to exclude audio/video-only, paid_only, etc.
    const excludeTypes = modality === 'image'
      ? ['video', 'audio']
      : ['image', 'video'];

    fetch('https://gen.pollinations.ai/models')
      .then(res => res.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        const filtered = data
          .filter(m =>
            m.output_modalities &&
            m.output_modalities.includes(modality) &&
            !m.paid_only &&
            !excludeTypes.some((t: string) => m.output_modalities.length === 1 && m.output_modalities[0] === t)
          )
          .map(m => ({ name: m.name, description: m.description || m.name }));

        if (filtered.length > 0) {
          setModels(filtered);
          // Set default to first if current not in list
          if (!filtered.some(m => m.name === value)) {
            onChange(filtered[0].name);
          }
        }
      })
      .catch(() => {
        // Use fallback defaults on error
      })
      .finally(() => setLoading(false));
  }, [modality]);

  const selectedInfo = models.find(m => m.name === value);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        Model AI
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full appearance-none bg-slate-900 text-white text-sm rounded-lg px-3 py-2 pr-8 border border-slate-700 outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {models.map(m => (
            <option key={m.name} value={m.name}>{m.name}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>
      {selectedInfo && (
        <p className="text-[11px] text-slate-500 italic truncate">{selectedInfo.description}</p>
      )}
    </div>
  );
}
