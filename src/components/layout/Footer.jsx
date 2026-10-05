import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto text-xs text-slate-500 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">ProCV Maker</span>
          <span>— Platform Pembuat CV & Portofolio Online</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" /> Data Tersimpan Lokal (Aman & Privat)
          </span>
          <span>•</span>
          <span>Siap Cetak Standar A4</span>
        </div>
      </div>
    </footer>
  );
}
