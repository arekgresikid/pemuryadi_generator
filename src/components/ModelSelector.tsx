import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, Crown } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface ModelInfo {
  name: string;
  description: string;
}

interface ModelSelectorProps {
  modality?: 'text' | 'image';
  value: string;
  onChange: (model: string) => void;
  disabled?: boolean;
  label?: string;
}

export default function ModelSelector({ modality = 'text', value, onChange, disabled, label = 'Model AI' }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

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

  const valueRef = React.useRef(value);
  
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let isMounted = true;
    const defaults = modality === 'image' ? defaultImageModels : defaultTextModels;
    setModels(defaults);

    fetch(`https://gen.pollinations.ai/models`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: any[]) => {
        if (!isMounted || !Array.isArray(data)) return;
        
        const isFree = !profile || profile.tier === 'Free';

        // Filter out by category ('text' or 'image')
        let filteredData = data.filter(m => m.category === modality || (modality === 'text' && !m.category));
        
        const mapped = filteredData.map(m => {
          if (typeof m === 'string') {
            return { name: m, description: m };
          }
          return { name: m?.name || '', description: m?.description || m?.name || '' };
        }).filter(m => m.name);

        if (mapped.length > 0) {
          setModels(mapped);
          
          if (!mapped.some(m => m.name === valueRef.current)) {
            if (!isFree) {
               const proDefault = modality === 'text' ? 'openai-large' : 'wan-image';
               if (mapped.some(m => m.name === proDefault)) {
                 onChange(proDefault);
               } else {
                 onChange(mapped[0].name);
               }
            } else {
               onChange(mapped[0].name);
            }
          }
        }
      })
      .catch((e) => {
        if (isMounted) {
          console.error("Failed to fetch models from", `https://gen.pollinations.ai/models`, e);
          // Defaults are already set
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [modality, profile]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedInfo = models.find(m => m.name === value);
  const isSelectedPremium = selectedInfo ? (modality === 'text' ? selectedInfo.name !== 'openai' : selectedInfo.name !== 'flux') : false;

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-red-500" />
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white text-black text-sm rounded-lg px-3 py-2 pr-8 border border-black outline-none transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-between"
        >
          <span className="flex items-center gap-2 truncate">
            {value}
            {isSelectedPremium && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {models.map(m => {
              const isPremiumModel = modality === 'text' ? m.name !== 'openai' : m.name !== 'flux';
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => {
                    const isFree = !profile || profile.tier === 'Free';
                    if (isFree && isPremiumModel) {
                      window.dispatchEvent(new Event('showPremiumModal'));
                      setIsOpen(false);
                      return;
                    }
                    onChange(m.name);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${value === m.name ? 'bg-blue-50 font-medium' : ''}`}
                >
                  <span className="truncate">{m.name}</span>
                  {isPremiumModel && <Crown className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {selectedInfo && (
        <p className="text-[11px] text-gray-500 italic truncate">{selectedInfo.description}</p>
      )}
    </div>
  );
}
