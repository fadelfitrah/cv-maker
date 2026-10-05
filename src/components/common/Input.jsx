import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  icon: Icon,
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-2xs">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors py-2 ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error
              ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
              : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export function Textarea({
  label,
  id,
  placeholder = '',
  value = '',
  onChange,
  rows = 3,
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`block w-full rounded-lg border text-sm transition-colors p-3 ${
          error
            ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  helperText,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        value={value}
        onChange={onChange}
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
