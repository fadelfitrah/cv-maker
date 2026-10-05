import React from 'react';

const labelClass = 'block text-[11px] font-bold text-slate-700 mb-1.5';
const fieldBase = 'block w-full rounded-xl border text-[13px] transition-all duration-200 py-2.5 bg-white placeholder:text-slate-300';

export function Input({ label, id, type = 'text', placeholder = '', value = '', onChange, icon: Icon, error, helperText, required = false, className = '', ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={inputId} className={labelClass}>{label} {required && <span className="text-rose-500">*</span>}</label>}
      <div className="relative group">
        {Icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-500"><Icon className="h-4 w-4" /></div>}
        <input id={inputId} type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder} required={required}
          className={`${fieldBase} ${Icon ? 'pl-9 pr-3' : 'px-3.5'} ${error ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 text-slate-900 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`} {...props} />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{helperText}</p>}
    </div>
  );
}

export function Textarea({ label, id, placeholder = '', value = '', onChange, rows = 3, error, helperText, required = false, className = '', ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={inputId} className={labelClass}>{label} {required && <span className="text-rose-500">*</span>}</label>}
      <textarea id={inputId} rows={rows} value={value ?? ''} onChange={onChange} placeholder={placeholder} required={required}
        className={`${fieldBase} px-3.5 resize-y ${error ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 text-slate-900 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`} {...props} />
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{helperText}</p>}
    </div>
  );
}

export function Select({ label, id, value, onChange, options = [], error, helperText, className = '', ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={inputId} className={labelClass}>{label}</label>}
      <select id={inputId} value={value} onChange={onChange} className={`${fieldBase} px-3.5 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`} {...props}>
        {options.map((opt) => <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>)}
      </select>
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-[10px] text-slate-400">{helperText}</p>}
    </div>
  );
}
