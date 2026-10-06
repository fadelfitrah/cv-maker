import React from 'react';
import { ShieldCheck, Database, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-blue-100/80 py-8 mt-auto text-xs text-slate-500 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
            CV
          </div>
          <span className="font-bold text-slate-800">ProCV Maker</span>
          <span className="hidden sm:inline text-slate-400">— Sistem Pembuat CV & Portofolio Profesional</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 text-blue-600 font-medium">
            <Database className="w-3.5 h-3.5" /> Database MySQL XAMPP
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Standar ATS Recruiter
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <Zap className="w-3.5 h-3.5" /> Mode Free & Pro Download
          </span>
        </div>
      </div>
    </footer>
  );
}
