// This replaces the old firebase.ts

declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (name: string, ...args: any[]) => Promise<any>;
    };
  }
}

export const loginWithGoogle = async () => {
  // Check if we are inside the Flutter WebView app
  if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
    try {
      const result = await window.flutter_inappwebview.callHandler('requestNativeGoogleLogin');
      if (result && result.success && result.idToken) {
        // Send idToken to backend to create session
        const res = await fetch('/api/auth/native-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: result.idToken })
        });
        if (res.ok) {
          window.location.reload();
          return;
        } else {
          alert('Login server gagal');
        }
      } else if (result && result.error) {
        console.error("Native login error:", result.error);
        if (result.error !== 'Dibatalkan') {
          alert('Google Sign-In Error: ' + result.error);
        }
        return;
      }
    } catch (e) {
      console.error("Handler error:", e);
    }
  }

  // Fallback to Web OAuth
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
