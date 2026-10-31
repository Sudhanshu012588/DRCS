import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  title: string;
  detail: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-slide-up">
      <div
        className={`p-4 rounded-lg border shadow-xl flex items-start gap-3 backdrop-blur bg-slate-900/95 ${
          isError
            ? 'border-rose-500/50 text-rose-200'
            : 'border-emerald-500/50 text-emerald-200'
        }`}
      >
        <div className="mt-0.5">
          {isError ? (
            <AlertTriangle size={18} className="text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
          )}
        </div>

        <div className="flex-1 text-xs">
          <div className="font-bold text-slate-100 font-mono mb-0.5">
            {toast.title}
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">{toast.detail}</p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};