import React from 'react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-slate-900 text-white border border-slate-700',
    error: 'bg-rose-600 text-white',
    info: 'bg-indigo-600 text-white',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300">
      <div
        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium ${
          bgStyles[toast.type] || bgStyles.info
        }`}
      >
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white cursor-pointer font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
