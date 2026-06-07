import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Ups, Terjadi Kesalahan</h1>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Sistem kami menemui kendala teknis saat memuat komponen ini. Silakan muat ulang halaman untuk mencoba lagi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
            >
              <RefreshCw size={18} />
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
