import React from 'react';

export function Button({ children, variant='primary', size='md', className='', icon: Icon, disabled=false, loading=false, onClick, type='button', ...props }) {
  const base='inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-45 disabled:cursor-not-allowed active:scale-[.98] cursor-pointer';
  const variants={
    primary:'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow-md',
    secondary:'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    outline:'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-indigo-500 shadow-sm',
    ghost:'text-slate-600 hover:text-slate-950 hover:bg-slate-100 focus:ring-slate-400',
    danger:'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 focus:ring-rose-500',
    success:'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm',
  };
  const sizes={xs:'px-2 py-1 text-[10px] gap-1',sm:'px-3 py-2 text-[11px] gap-1.5',md:'px-4 py-2.5 text-sm gap-2',lg:'px-5 py-3 text-base gap-2.5'};
  return <button type={type} disabled={disabled||loading} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
    {loading ? <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : Icon ? <Icon className={size==='xs'||size==='sm'?'w-3.5 h-3.5':'w-4 h-4'} /> : null}
    {children}
  </button>;
}
