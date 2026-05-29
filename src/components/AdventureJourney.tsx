import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, MapPin, Info, Coins, Landmark, Compass, ChevronRight, Map as MapIcon, Sparkles, X, Brain, Target, MessageCircle, Loader2, Users } from 'lucide-react';
import { GoogleGenAI } from '../lib/genai';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

interface Pin {
  name: string;
  characteristic: string;
  coordinates: [number, number]; // [longitude, latitude]
  details?: {
    adatBudaya?: string;
    senjataTradisional?: string;
    makananKhas?: string;
    pakaian?: string;
    bahasa?: string;
    kearifanLokal?: string;
  };
}

interface CountryData {
  currency: string;
  characteristic: string;
  flag: string;
  center: [number, number];
  zoom: number;
  pins: Pin[];
  islands?: Pin[]; // Special for Indonesia
  deepInfo?: string;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WORLD_DATA: Record<string, Record<string, CountryData>> = {
  'Asia': {
    'Indonesia': {
      currency: 'Rupiah (IDR)',
      characteristic: 'Negara Kepulauan Terbesar di Dunia dengan kekayaan budaya dan alam yang luar biasa.',
      flag: '🇮🇩',
      center: [118, -2],
      zoom: 5,
      pins: [],
      islands: [
        { 
          name: 'Sumatera', 
          characteristic: 'Gajah Sumatera, Danau Toba, dan Rendang.', 
          coordinates: [101.69, -0.58],
          details: {
            adatBudaya: 'Budaya Melayu, Minangkabau (Matrilineal), Batak.',
            senjataTradisional: 'Rencong (Aceh), Keris (Melayu), Pedang Jenawi.',
            makananKhas: 'Rendang, Pempek, Mie Aceh, Arsik.',
            pakaian: 'Ulos, Aesan Gede, Baju Kurung.',
            bahasa: 'Bahasa Melayu, Batak, Minang, Lampung.',
            kearifanLokal: 'Sistem irigasi tradisional, hukum adat yang kuat.'
          }
        },
        { 
          name: 'Jawa', 
          characteristic: 'Candi Borobudur, Gunung Bromo, dan pusat pemerintahan.', 
          coordinates: [110.10, -7.61],
          details: {
            adatBudaya: 'Budaya Jawa, Sunda, Madura. Wayang Kulit, Gamelan.',
            senjataTradisional: 'Keris, Kujang (Sunda), Clurit (Madura).',
            makananKhas: 'Gudeg, Sate, Bakso, Nasi Liwet.',
            pakaian: 'Kebaya, Beskap, Batik.',
            bahasa: 'Bahasa Jawa, Sunda, Madura.',
            kearifanLokal: 'Gotong royong, tata krama (unggah-ungguh).'
          }
        },
        { 
          name: 'Kalimantan', 
          characteristic: 'Orangutan, Hutan Hujan Tropis, dan Ibu Kota Nusantara.', 
          coordinates: [114.0, 1.0],
          details: {
            adatBudaya: 'Budaya Dayak, Banjar. Upacara Tiwah, Tari Enggang.',
            senjataTradisional: 'Mandau, Sumpit.',
            makananKhas: 'Soto Banjar, Ketupat Kandangan.',
            pakaian: 'King Baba, King Bibinge.',
            bahasa: 'Bahasa Dayak, Banjar, Kutai.',
            kearifanLokal: 'Hutan larangan, rumah betang.'
          }
        },
        { 
          name: 'Sulawesi', 
          characteristic: 'Taman Nasional Wakatobi dan bentuk pulau yang unik.', 
          coordinates: [119.5, -2.5],
          details: {
            adatBudaya: 'Budaya Bugis, Makassar, Toraja. Rambu Solo.',
            senjataTradisional: 'Badik.',
            makananKhas: 'Coto Makassar, Konro, Kapurung.',
            pakaian: 'Baju Bodo.',
            bahasa: 'Bahasa Bugis, Makassar, Toraja, Manado.',
            kearifanLokal: "Filosofi Siri' na Paccé, pelaut ulung."
          }
        },
        { 
          name: 'Papua', 
          characteristic: 'Raja Ampat, Burung Cendrawasih, dan Puncak Jaya.', 
          coordinates: [138.0, -4.0],
          details: {
            adatBudaya: 'Budaya Asmat, Dani. Bakar Batu.',
            senjataTradisional: 'Busur dan Panah, Belati Tulang Kasuari.',
            makananKhas: 'Papeda, Ikan Kuah Kuning.',
            pakaian: 'Koteka, Sali.',
            bahasa: 'Bahasa Dani, Asmat, Biak.',
            kearifanLokal: 'Penghormatan terhadap alam (Hutan adalah Ibu).'
          }
        },
        { 
          name: 'Bali & Nusa Tenggara', 
          characteristic: 'Pulau Dewata, Komodo, dan pantai eksotis.', 
          coordinates: [118.0, -8.5],
          details: {
            adatBudaya: 'Budaya Bali (Hindu), Sasak, Sumba. Ngaben, Nyepi.',
            senjataTradisional: 'Keris Bali, Tulup.',
            makananKhas: 'Ayam Betutu, Babi Guling, Plecing Kangkung.',
            pakaian: 'Payas Agung, Kain Tenun Ikat.',
            bahasa: 'Bahasa Bali, Sasak, Sumbawa.',
            kearifanLokal: 'Subak (Sistem irigasi Bali), Tri Hita Karana.'
          }
        }
      ]
    },
    'Jepang': {
      currency: 'Yen (JPY)',
      characteristic: 'Negara Matahari Terbit yang memadukan tradisi kuno dengan teknologi masa depan.',
      flag: '🇯🇵',
      center: [138, 36],
      zoom: 6,
      pins: [
        { name: 'Tokyo', characteristic: 'Metropolitan terbesar dan pusat teknologi.', coordinates: [139.69, 35.68] },
        { name: 'Kyoto', characteristic: 'Pusat budaya dengan ribuan kuil bersejarah.', coordinates: [135.76, 35.01] },
        { name: 'Gunung Fuji', characteristic: 'Ikon nasional dan gunung tertinggi di Jepang.', coordinates: [138.72, 35.36] }
      ]
    },
    'Arab Saudi': {
      currency: 'Riyal (SAR)',
      characteristic: "Negara di Semenanjung Arab, pusat agama Islam dengan Ka'bah di Mekkah.",
      flag: '🇸🇦',
      center: [45, 24],
      zoom: 4,
      pins: [
        { name: 'Mekkah', characteristic: "Kota suci umat Islam dan lokasi Ka'bah.", coordinates: [39.82, 21.42] },
        { name: 'Madinah', characteristic: 'Kota suci kedua dan lokasi Masjid Nabawi.', coordinates: [39.61, 24.46] },
        { name: 'Riyadh', characteristic: 'Ibu kota dan pusat ekonomi modern.', coordinates: [46.71, 24.71] }
      ]
    },
    'Tiongkok': {
      currency: 'Yuan (CNY)',
      characteristic: 'Negara dengan populasi terbesar kedua dan sejarah peradaban yang sangat tua.',
      flag: '🇨🇳',
      center: [104, 35],
      zoom: 3,
      pins: [
        { name: 'Tembok Besar', characteristic: 'Struktur pertahanan kuno terpanjang di dunia.', coordinates: [116.57, 40.43] },
        { name: 'Beijing', characteristic: 'Ibu kota dan lokasi Kota Terlarang.', coordinates: [116.40, 39.90] },
        { name: 'Shanghai', characteristic: 'Pusat keuangan dan kota pelabuhan modern.', coordinates: [121.47, 31.23] }
      ]
    },
    'India': {
      currency: 'Rupee (INR)',
      characteristic: 'Negara dengan keragaman budaya, bahasa, dan ikon arsitektur Taj Mahal.',
      flag: '🇮🇳',
      center: [78, 22],
      zoom: 4,
      pins: [
        { name: 'Taj Mahal', characteristic: 'Monumen cinta yang merupakan Situs Warisan Dunia UNESCO.', coordinates: [78.04, 27.17] },
        { name: 'New Delhi', characteristic: 'Ibu kota negara dengan sejarah yang kaya.', coordinates: [77.20, 28.61] },
        { name: 'Mumbai', characteristic: 'Pusat industri film Bollywood.', coordinates: [72.87, 19.07] }
      ]
    },
    'Korea Selatan': {
      currency: 'Won (KRW)',
      characteristic: 'Negara dengan perpaduan budaya tradisional dan modernitas K-Pop.',
      flag: '🇰🇷',
      center: [127.5, 36],
      zoom: 6,
      pins: [
        { name: 'Seoul', characteristic: 'Ibu kota metropolitan dengan Istana Gyeongbokgung.', coordinates: [126.97, 37.56] },
        { name: 'Pulau Jeju', characteristic: 'Pulau vulkanik dengan keindahan alam yang eksotis.', coordinates: [126.53, 33.49] }
      ]
    },
    'Thailand': {
      currency: 'Baht (THB)',
      characteristic: 'Negara Gajah Putih yang terkenal dengan kuil emas dan pantai tropis.',
      flag: '🇹🇭',
      center: [100, 15],
      zoom: 5,
      pins: [
        { name: 'Bangkok', characteristic: 'Kota dengan kuil-kuil megah dan pasar terapung.', coordinates: [100.50, 13.75] },
        { name: 'Phuket', characteristic: 'Destinasi wisata pantai kelas dunia.', coordinates: [98.39, 7.88] }
      ]
    }
  },
  'Eropa': {
    'Prancis': {
      currency: 'Euro (EUR)',
      characteristic: 'Negara mode, seni, dan kuliner yang terkenal dengan Menara Eiffel.',
      flag: '🇫🇷',
      center: [2, 46],
      zoom: 5,
      pins: [
        { name: 'Paris', characteristic: 'Kota Cahaya dan lokasi Menara Eiffel.', coordinates: [2.35, 48.85] },
        { name: 'Lyon', characteristic: 'Pusat kuliner dunia.', coordinates: [4.83, 45.76] },
        { name: 'Riviera', characteristic: 'Pantai mewah di selatan Prancis.', coordinates: [7.26, 43.71] }
      ]
    },
    'Inggris': {
      currency: 'Pound Sterling (GBP)',
      characteristic: 'Negara kerajaan dengan sejarah panjang dan pengaruh global.',
      flag: '🇬🇧',
      center: [-2, 54],
      zoom: 5,
      pins: [
        { name: 'London', characteristic: 'Big Ben, London Eye, dan Istana Buckingham.', coordinates: [-0.12, 51.50] },
        { name: 'Stonehenge', characteristic: 'Situs prasejarah misterius.', coordinates: [-1.82, 51.17] }
      ]
    },
    'Italia': {
      currency: 'Euro (EUR)',
      characteristic: 'Negara dengan warisan Romawi, seni Renaisans, dan pizza.',
      flag: '🇮🇹',
      center: [12, 42],
      zoom: 5,
      pins: [
        { name: 'Roma', characteristic: 'Koloseum dan pusat peradaban Romawi.', coordinates: [12.49, 41.90] },
        { name: 'Venesia', characteristic: 'Kota kanal yang romantis.', coordinates: [12.31, 45.44] },
        { name: 'Menara Pisa', characteristic: 'Menara miring yang ikonik.', coordinates: [10.39, 43.72] }
      ]
    },
    'Jerman': {
      currency: 'Euro (EUR)',
      characteristic: 'Negara dengan sejarah kuat, teknologi otomotif, dan kastil megah.',
      flag: '🇩🇪',
      center: [10, 51],
      zoom: 5,
      pins: [
        { name: 'Berlin', characteristic: 'Ibu kota dengan Gerbang Brandenburg.', coordinates: [13.40, 52.52] },
        { name: 'Kastil Neuschwanstein', characteristic: 'Kastil dongeng yang menginspirasi Disney.', coordinates: [10.74, 47.55] }
      ]
    },
    'Spanyol': {
      currency: 'Euro (EUR)',
      characteristic: 'Negara dengan budaya flamenco, arsitektur Gaudi, dan sepak bola.',
      flag: '🇪🇸',
      center: [-4, 40],
      zoom: 5,
      pins: [
        { name: 'Madrid', characteristic: 'Ibu kota dengan istana kerajaan yang megah.', coordinates: [-3.70, 40.41] },
        { name: 'Barcelona', characteristic: 'Kota dengan mahakarya Sagrada Familia.', coordinates: [2.17, 41.38] }
      ]
    }
  },
  'Amerika': {
    'Amerika Serikat': {
      currency: 'US Dollar (USD)',
      characteristic: 'Negara adidaya dengan keragaman lanskap dari kota besar hingga taman nasional.',
      flag: '🇺🇸',
      center: [-98, 38],
      zoom: 3,
      pins: [
        { name: 'New York', characteristic: 'Patung Liberty dan pusat keuangan dunia.', coordinates: [-74.00, 40.71] },
        { name: 'Grand Canyon', characteristic: 'Keajaiban alam geologi yang luar biasa.', coordinates: [-112.11, 36.10] },
        { name: 'Hollywood', characteristic: 'Pusat industri film dunia.', coordinates: [-118.32, 34.09] }
      ]
    },
    'Brasil': {
      currency: 'Real (BRL)',
      characteristic: 'Negara terbesar di Amerika Latin, terkenal dengan Amazon dan Karnaval.',
      flag: '🇧🇷',
      center: [-52, -10],
      zoom: 3,
      pins: [
        { name: 'Rio de Janeiro', characteristic: 'Patung Kristus Penebus dan Pantai Copacabana.', coordinates: [-43.17, -22.90] },
        { name: 'Hutan Amazon', characteristic: 'Paru-paru dunia dengan biodiversitas tinggi.', coordinates: [-60.02, -3.11] }
      ]
    },
    'Kanada': {
      currency: 'Canadian Dollar (CAD)',
      characteristic: 'Negara terbesar kedua di dunia, terkenal dengan keindahan alam dan sirup maple.',
      flag: '🇨🇦',
      center: [-95, 60],
      zoom: 2,
      pins: [
        { name: 'Air Terjun Niagara', characteristic: 'Air terjun spektakuler di perbatasan AS.', coordinates: [-79.03, 43.08] },
        { name: 'Toronto', characteristic: 'Kota terbesar dengan CN Tower.', coordinates: [-79.38, 43.65] }
      ]
    },
    'Meksiko': {
      currency: 'Peso Meksiko (MXN)',
      characteristic: 'Negara dengan warisan suku Maya dan Aztec serta kuliner pedas.',
      flag: '🇲🇽',
      center: [-102, 23],
      zoom: 4,
      pins: [
        { name: 'Chichen Itza', characteristic: 'Piramida kuno suku Maya.', coordinates: [-88.56, 20.68] },
        { name: 'Mexico City', characteristic: 'Ibu kota yang dibangun di atas kota kuno Aztec.', coordinates: [-99.13, 19.43] }
      ]
    }
  },
  'Afrika': {
    'Mesir': {
      currency: 'Pound Mesir (EGP)',
      characteristic: 'Negara piramida dan peradaban kuno di sepanjang Sungai Nil.',
      flag: '🇪🇬',
      center: [30, 26],
      zoom: 5,
      pins: [
        { name: 'Kairo', characteristic: 'Ibu kota dan lokasi Piramida Giza.', coordinates: [31.23, 30.04] },
        { name: 'Luxor', characteristic: 'Museum terbuka terbesar di dunia.', coordinates: [32.63, 25.68] }
      ]
    },
    'Afrika Selatan': {
      currency: 'Rand (ZAR)',
      characteristic: 'Negara dengan keragaman hayati luar biasa dan sejarah perjuangan Nelson Mandela.',
      flag: '🇿🇦',
      center: [24, -29],
      zoom: 5,
      pins: [
        { name: 'Cape Town', characteristic: 'Table Mountain dan pemandangan pesisir yang indah.', coordinates: [18.42, -33.92] },
        { name: 'Taman Nasional Kruger', characteristic: 'Salah satu cagar alam terbesar di Afrika.', coordinates: [31.59, -23.98] }
      ]
    },
    'Maroko': {
      currency: 'Dirham Maroko (MAD)',
      characteristic: 'Negara di Afrika Utara dengan perpaduan budaya Arab, Berber, dan Eropa.',
      flag: '🇲🇦',
      center: [-7, 31],
      zoom: 5,
      pins: [
        { name: 'Marrakesh', characteristic: 'Kota merah dengan pasar tradisional (souk) yang ramai.', coordinates: [-8.00, 31.62] },
        { name: 'Casablanca', characteristic: 'Kota pelabuhan modern dan pusat ekonomi.', coordinates: [-7.58, 33.57] }
      ]
    },
    'Nigeria': {
      currency: 'Naira (NGN)',
      characteristic: 'Negara dengan ekonomi terbesar di Afrika dan industri film Nollywood.',
      flag: '🇳🇬',
      center: [8, 9],
      zoom: 5,
      pins: [
        { name: 'Lagos', characteristic: 'Kota metropolitan terbesar dan pusat hiburan.', coordinates: [3.37, 6.52] },
        { name: 'Abuja', characteristic: 'Ibu kota negara yang terencana.', coordinates: [7.49, 9.07] }
      ]
    }
  },
  'Australia': {
    'Australia': {
      currency: 'Australian Dollar (AUD)',
      characteristic: 'Negara benua dengan satwa unik seperti Kanguru dan Koala.',
      flag: '🇦🇺',
      center: [133, -25],
      zoom: 4,
      pins: [
        { name: 'Sydney', characteristic: 'Opera House dan Jembatan Harbour.', coordinates: [151.20, -33.86] },
        { name: 'Great Barrier Reef', characteristic: 'Terumbu karang terbesar di dunia.', coordinates: [145.81, -16.48] },
        { name: 'Uluru', characteristic: 'Batu raksasa suci di tengah gurun.', coordinates: [131.03, -25.34] }
      ]
    },
    'Selandia Baru': {
      currency: 'New Zealand Dollar (NZD)',
      characteristic: 'Negara kepulauan dengan pemandangan alam yang menakjubkan, lokasi syuting Lord of the Rings.',
      flag: '🇳🇿',
      center: [174, -41],
      zoom: 5,
      pins: [
        { name: 'Auckland', characteristic: 'Kota layar dengan pelabuhan yang indah.', coordinates: [174.76, -36.84] },
        { name: 'Queenstown', characteristic: 'Pusat petualangan dunia di Pulau Selatan.', coordinates: [168.66, -45.03] }
      ]
    },
    'Fiji': {
      currency: 'Fijian Dollar (FJD)',
      characteristic: 'Negara kepulauan tropis yang terkenal dengan keramahan penduduknya dan terumbu karang.',
      flag: '🇫🇯',
      center: [178, -18],
      zoom: 6,
      pins: [
        { name: 'Suva', characteristic: 'Ibu kota dengan arsitektur kolonial Inggris.', coordinates: [178.44, -18.14] },
        { name: 'Kepulauan Mamanuca', characteristic: 'Lokasi syuting film Cast Away.', coordinates: [177.10, -17.65] }
      ]
    }
  }
};

export default function AdventureJourney() {
  const [selectedContinent, setSelectedContinent] = useState<string>('Asia');
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [selectedCountry, setSelectedCountry] = useState<string>('Indonesia');
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [challenge, setChallenge] = useState<{question: string, answer: string} | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const continents = Object.keys(WORLD_DATA);
  const countries = Object.keys(WORLD_DATA[selectedContinent] || {});
  const currentData = WORLD_DATA[selectedContinent]?.[selectedCountry];

  const generateDeepInfo = async (country: string, region?: string) => {
    setIsGenerating(true);
    setChallenge(null);
    try {
      const ai = new GoogleGenAI({});

      const prompt = `Anda adalah ahli geografi dan budaya dunia. Berikan informasi mendalam tentang ${region ? region + ' di ' : ''}${country}. 
      Informasi ini akan digunakan oleh siswa dan guru, jadi pastikan bahasa yang digunakan edukatif dan menarik.
      Fokus pada: Adat Budaya, Senjata Tradisional, Makanan Khas, Pakaian Adat, Bahasa, dan Kearifan Lokal.
      SANGAT PENTING: Pastikan semua informasi, terutama bagian "challenge", benar-benar spesifik untuk ${region || country}. JANGAN memberikan informasi dari daerah lain.
      
      Berikan dalam format JSON murni tanpa markdown:
      {
        "adatBudaya": "...",
        "senjataTradisional": "...",
        "makananKhas": "...",
        "pakaian": "...",
        "bahasa": "...",
        "kearifanLokal": "...",
        "challenge": {
          "question": "Tantangan: Sebutkan satu fakta unik atau ciri khas dari ${region || country} yang jarang diketahui orang, namun sangat penting dalam sejarah atau budayanya?",
          "answer": "..."
        }
      }`;
      
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      
      const text = response.text || '{}';
      const cleanJson = text.replace(/\`\`\`json|\`\`\`/gi, '').trim();
      const data = JSON.parse(cleanJson);
      
      if (activePin) {
        setActivePin({
          ...activePin,
          details: {
            adatBudaya: data.adatBudaya,
            senjataTradisional: data.senjataTradisional,
            makananKhas: data.makananKhas,
            pakaian: data.pakaian,
            bahasa: data.bahasa,
            kearifanLokal: data.kearifanLokal
          }
        });
        setChallenge(data.challenge);
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startChallenge = () => {
    if (activePin && !challenge) {
      generateDeepInfo(selectedCountry, activePin.name);
    }
    setShowChallengeModal(true);
  };

  const handleContinentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const continent = e.target.value;
    setSelectedContinent(continent);
    const firstCountry = Object.keys(WORLD_DATA[continent])[0];
    setSelectedCountry(firstCountry);
    setActivePin(null);
    setChallenge(null);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setActivePin(null);
    setChallenge(null);
  };

  const pinsToDisplay = useMemo(() => {
    if (!currentData) return [];
    return currentData.islands || currentData.pins || [];
  }, [currentData]);

  return (
    <div className="min-h-[600px] bg-gray-50 rounded-3xl overflow-hidden border border-black shadow-2xl flex flex-col">
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black flex items-center gap-2 italic tracking-tighter">
            <Globe className="text-red-500 animate-spin-slow" />
            ADVENTURE JOURNEY <span className="text-red-400">MAP</span>
          </h2>
          <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">Jelajahi keunikan negara-negara di dunia</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-bold text-red-500 uppercase tracking-tighter z-10">Benua</label>
            <select 
              value={selectedContinent}
              onChange={handleContinentChange}
              className="bg-white border border-red-500/30 rounded-xl px-4 py-2 text-xs text-black outline-none focus:border-red-500 transition-all appearance-none pr-10 min-w-[120px]"
            >
              {continents.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-red-500 pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-bold text-red-400 uppercase tracking-tighter z-10">Negara</label>
            <select 
              value={selectedCountry}
              onChange={handleCountryChange}
              className="bg-white border border-red-400/30 rounded-xl px-4 py-2 text-xs text-black outline-none focus:border-red-400 transition-all appearance-none pr-10 min-w-[150px]"
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-red-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-[800px]">
        {/* Map Stage */}
        <div className="flex-1 relative bg-white p-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedContinent}-${selectedCountry}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full h-full max-w-[1000px] aspect-[16/10] bg-[#eef2ff] rounded-[2rem] shadow-inner border border-black overflow-hidden"
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 150 }}
                className="w-full h-full"
              >
                <ZoomableGroup 
                  center={currentData?.center || [0, 0]} 
                  zoom={currentData?.zoom || 1}
                  minZoom={1}
                  maxZoom={20}
                  translateExtent={[[0, 0], [800, 600]]}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#cbd5e1"
                          stroke="#ffffff"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#94a3b8", outline: "none", cursor: "pointer" },
                            pressed: { fill: "#64748b", outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  {pinsToDisplay.map((pin) => (
                    <Marker 
                      key={pin.name} 
                      coordinates={pin.coordinates}
                      onClick={() => {
                        setActivePin(pin);
                        setChallenge(null);
                      }}
                    >
                      <g
                        className="cursor-pointer transition-all duration-300"
                        style={{
                          transform: activePin?.name === pin.name ? 'scale(1.5)' : 'scale(1)',
                        }}
                      >
                        <circle cx="0" cy="0" r="4" fill={activePin?.name === pin.name ? "#ef4444" : "#2563eb"} stroke="#fff" strokeWidth={1.5} />
                        <text
                          textAnchor="middle"
                          y={-10}
                          style={{
                            fontFamily: "system-ui",
                            fill: "#000",
                            fontSize: "8px",
                            fontWeight: "800",
                            pointerEvents: "none"
                          }}
                        >
                          {pin.name}
                        </text>
                      </g>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
              
              {/* Country Name Overlay */}
              <div className="absolute top-4 left-6 z-10 pointer-events-none">
                <div className="text-4xl font-black text-black/20 italic select-none">{selectedCountry.toUpperCase()}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Info Card */}
          <AnimatePresence>
            {activePin && (
              <>
                {/* Backdrop for mobile to allow closing by clicking outside */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePin(null)}
                  className="absolute inset-0 bg-black/20  z-40 lg:hidden"
                />
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="absolute md:right-6 md:top-1/2 md:-translate-y-1/2 md:w-80 w-[90%] left-1/2 -translate-x-1/2 md:translate-x-0 top-1/2 -translate-y-1/2 bg-white  border border-red-500/30 rounded-3xl p-6 shadow-xl z-50 max-h-[90%] overflow-y-auto custom-scrollbar"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <MapPin size={16} className="text-red-500" />
                      </div>
                      <h4 className="text-lg font-black text-black italic uppercase tracking-tighter">{activePin.name}</h4>
                    </div>
                    <button onClick={() => { setActivePin(null); setShowChallengeModal(false); setChallenge(null); }} className="text-gray-500 hover:text-black p-2 hover:bg-black/5 rounded-full transition-all"><X size={20} /></button>
                  </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 flex items-center gap-1">
                      <Sparkles size={10} className="text-amber-500" /> Deskripsi Umum
                    </p>
                    <p className="text-sm text-gray-900 leading-relaxed">{activePin.characteristic}</p>
                  </div>

                  {activePin.details && (
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: 'Adat & Budaya', value: activePin.details.adatBudaya, icon: <Users size={12} /> },
                        { label: 'Senjata Tradisional', value: activePin.details.senjataTradisional, icon: <Target size={12} /> },
                        { label: 'Makanan Khas', value: activePin.details.makananKhas, icon: <Coins size={12} /> },
                        { label: 'Pakaian Adat', value: activePin.details.pakaian, icon: <Sparkles size={12} /> },
                        { label: 'Bahasa', value: activePin.details.bahasa, icon: <MessageCircle size={12} /> },
                        { label: 'Kearifan Lokal', value: activePin.details.kearifanLokal, icon: <Brain size={12} /> },
                      ].map((item, i) => item.value && (
                        <div key={i} className="p-3 bg-red-50 rounded-xl border border-red-100">
                          <p className="text-[9px] text-red-500 font-bold uppercase mb-1 flex items-center gap-1">
                            {item.icon} {item.label}
                          </p>
                          <p className="text-xs text-gray-700">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showChallengeModal ? (
                    <button 
                      onClick={startChallenge}
                      disabled={isGenerating}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-red-400 text-white font-black uppercase tracking-widest rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Target size={16} />}
                      Tantangan Eksplorasi
                    </button>
                  ) : (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
                      <p className="text-[10px] text-red-500 font-bold uppercase">Tantangan Aktif</p>
                      <p className="text-[9px] text-gray-500">Lihat kartu tantangan di layar</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { setActivePin(null); setShowChallengeModal(false); setChallenge(null); }}
                    className="w-full py-2 text-gray-400 hover:text-gray-700 text-[10px] font-bold uppercase tracking-widest transition-all mt-2"
                  >
                    Tutup Detail
                  </button>
                </div>
              </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Challenge Modal / Card Overlay */}
          <AnimatePresence>
            {showChallengeModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowChallengeModal(false)}
                className="absolute inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-gray-900/60 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, rotateY: 20, y: 40 }}
                  animate={{ scale: 1, rotateY: 0, y: 0 }}
                  exit={{ scale: 0.8, rotateY: -20, y: 40 }}
                  transition={{ type: "spring", damping: 15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-2xl border-4 border-red-400/40 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-y-auto max-h-[95%] flex flex-col items-center text-center custom-scrollbar bg-white"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-gradient-x"></div>
                  
                  <button 
                    onClick={() => setShowChallengeModal(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all z-10"
                  >
                    <X size={32} />
                  </button>

                  <div className="space-y-8 w-full">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center border border-red-100">
                        <Brain size={48} className="text-red-500 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-black text-black italic uppercase tracking-tighter mb-1">KARTU TANTANGAN</h3>
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-3 py-1 bg-red-100 rounded-full text-[10px] font-bold text-red-600 uppercase tracking-widest border border-red-200">
                            {selectedCountry}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-600 font-medium">{activePin?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="relative w-full p-8 md:p-10 bg-gray-50 rounded-3xl border border-gray-200 min-h-[180px] flex items-center justify-center shadow-inner">
                        {isGenerating ? (
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-red-500" size={40} />
                            <p className="text-sm text-gray-500 font-medium animate-pulse">Menyiapkan tantangan eksplorasi...</p>
                          </div>
                        ) : (
                          <p className="text-xl md:text-2xl text-black font-bold leading-relaxed italic">
                            "{challenge?.question || "Tantangan tidak tersedia. Silakan coba lagi."}"
                          </p>
                        )}
                      </div>
                    </div>

                    {!isGenerating && challenge && (
                      <div className="w-full space-y-6">
                        <details className="group">
                          <summary className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl cursor-pointer transition-all list-none flex items-center justify-center gap-3 border border-gray-300">
                            <Info size={20} />
                            <span>LIHAT KUNCI JAWABAN</span>
                            <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                          </summary>
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-6 bg-green-50 border border-green-200 rounded-2xl text-base text-gray-700 text-left relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                            <p className="font-black text-green-600 mb-3 flex items-center gap-2 uppercase tracking-tighter italic">
                              <Sparkles size={16} /> Jawaban Edukasi:
                            </p>
                            <p className="leading-relaxed text-gray-800">{challenge.answer}</p>
                          </motion.div>
                        </details>

                        <button 
                          onClick={() => setShowChallengeModal(false)}
                          className="w-full py-5 bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-lg uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:shadow-red-500/50 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Selesaikan Misi
                        </button>

                        <button 
                          onClick={() => setShowChallengeModal(false)}
                          className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest transition-all"
                        >
                          Kembali ke Peta
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 bg-white border-l border-black p-6 space-y-6 overflow-y-auto">
          <div className="gen-card p-5 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{currentData?.flag}</span>
              <div>
                <h3 className="text-lg font-black text-black italic tracking-tighter">{selectedCountry}</h3>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{selectedContinent}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                  <Coins size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Mata Uang</p>
                  <p className="text-xs text-black font-medium">{currentData?.currency}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                  <Landmark size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Karakteristik Utama</p>
                  <p className="text-xs text-black font-medium leading-relaxed">{currentData?.characteristic}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
               Titik Eksplorasi ({pinsToDisplay.length})
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {pinsToDisplay.map(pin => (
                <button
                  key={pin.name}
                  onClick={() => {
                    setActivePin(pin);
                    setChallenge(null);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left shadow-sm ${activePin?.name === pin.name ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'}`}
                >
                  <span className="text-xs font-bold">{pin.name}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-[10px] text-blue-600 font-bold uppercase mb-1 flex items-center gap-1"><Compass size={12} /> Tips Petualang</p>
            <p className="text-[10px] text-gray-600 leading-relaxed italic">
              Klik pada pin biru di peta vektor atau gunakan daftar di atas untuk melompat langsung dan melihat detail unik dari setiap lokasi bersejarah di {selectedCountry}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
