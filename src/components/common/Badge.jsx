import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  onRemove,
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-slate-900 text-white border border-slate-700',
    error: 'bg-rose-600 text-white',
    info: 'bg-indigo-600 text-white',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${bgStyles[toast.type] || bgStyles.info}`}>
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden transform transition-all z-10`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
