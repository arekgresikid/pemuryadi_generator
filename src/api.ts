// This replaces the old firebase.ts

export const loginWithGoogle = () => {
  // Redirect to Cloudflare Pages Function which handles Google OAuth
  window.location.href = '/api/auth/login';
};

export const logout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  } catch (error) {
    console.error("Error logging out", error);
    throw error;
  }
};

export const updateProfile = async (uid: string, data: Partial<any>) => {
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export const incrementFavorites = async () => {
  try {
    await fetch('/api/stats/increment', { method: 'POST' });
  } catch (error) {
    console.error("Error incrementing favorites", error);
  }
};

export const addActivityLog = async (msg: string, status: string, color: string) => {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg, status, color })
    });
  } catch (error) {
    console.error("Error adding activity log", error);
  }
};

export const useToken = async () => {
  try {
    const response = await fetch('/api/tokens/use', { method: 'POST' });
    let data: any = {};
    try { data = await response.json(); } catch(e) {}
    
    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showLoginModal'));
        }
        throw new Error('Silakan login terlebih dahulu untuk menggunakan fitur AI.');
      }
      if (response.status === 403) throw new Error('Token harian Anda sudah habis. Silakan upgrade ke Premium untuk akses tanpa batas.');
      throw new Error(data.error || 'Gagal memverifikasi token.');
    }
    
    if (typeof window !== 'undefined') {
      if (data.tokens !== undefined) {
        window.dispatchEvent(new CustomEvent('tokenConsumed', { detail: data.tokens }));
      }
      if (data.isFree) {
        window.dispatchEvent(new CustomEvent('showFreeTokenWarning'));
      }
    }
    return data;
  } catch (error) {
    console.error("Error using token", error);
    throw error;
  }
};
