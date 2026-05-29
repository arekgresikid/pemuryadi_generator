import React, { createContext, useContext, useEffect, useState } from 'react';
import { updateProfile } from './api';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role?: 'owner' | 'guest' | 'admin'; 
  tier?: 'Free' | 'Essential' | 'Premium' | 'Ultimate' | 'SUPREME' | 'owner' | 'admin';
  createdAt: string;
  tokens?: number;
  lastResetDate?: string; 
  nip?: string;
  jenjang?: string;
  tahunPelajaran?: string;
  namaSekolah?: string;
  kepalaSekolah?: string;
  jenisNipKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  nama?: string;
  jenisNipGuru?: string;
}

interface AuthContextType {
  user: any | null; // Simulating Firebase User structure
  profile: UserProfile | null;
  loading: boolean;
  consumeToken: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  consumeToken: async () => false,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // Map to match the shape expected by components originally relying on Firebase User
          setUser({ ...data.user, photoURL: data.profile?.photoURL });
          setProfile(data.profile);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    } catch (e) {
      console.error("Failed to fetch session", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    
    const handleTokenConsumed = (e: any) => {
      setProfile(prev => prev ? { ...prev, tokens: e.detail } : null);
    };
    window.addEventListener('tokenConsumed', handleTokenConsumed);
    return () => window.removeEventListener('tokenConsumed', handleTokenConsumed);
  }, []);

  const consumeToken = async (): Promise<boolean> => {
    if (!user || !profile) return false;
    
    try {
      const tier = profile.tier || 'Free';
      const role = profile.role || 'siswa';
      const isPrivileged = tier === 'Titan' || role === 'owner' || role === 'admin';
      
      if (isPrivileged || tier !== 'Free') return true;

      // Use the secure backend endpoint
      const { useToken } = await import('./api');
      const data = await useToken();
      if (data.success) {
        setProfile(prev => prev ? { ...prev, tokens: data.tokens } : null);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error consuming token", e);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, consumeToken, refreshProfile: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
};
