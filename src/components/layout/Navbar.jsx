import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { usePrintResume } from '../../hooks/usePrintResume';
import { Button } from '../common/Button';
import {
  FileText,
  Globe,
  LayoutTemplate,
  Settings,
  Printer,
  Undo2,
  Redo2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const {
    resumeData,
    activePage,
    setActivePage,
    saveStatus,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResume();

  const { printResume, isPrinting } = usePrintResume(resumeData.personalInfo?.fullName);

  const navItems = [
    { id: 'editor', label: 'Editor CV', icon: FileText },
    { id: 'preview', label: 'Cetak / PDF', icon: Printer },
    { id: 'portfolio', label: 'Web Portofolio', icon: Globe, highlight: true },
    { id: 'templates', label: 'Template', icon: LayoutTemplate },
    { id: 'settings', label: 'Data & Backup', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('editor')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent flex items-center gap-1.5">
                  ProCV <span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-semibold">Maker</span>
                </span>
                <p className="text-[11px] text-slate-500 hidden sm:block">CV & Portfolio Builder</p>
              </div>
            </button>

            {/* Auto Save Status Badge */}
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200 text-xs text-slate-500">
              {saveStatus === 'saving' ? (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </span>
              ) : saveStatus === 'error' ? (
                <span className="text-rose-500">Gagal menyimpan</span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tersimpan otomatis
                </span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Undo / Redo */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded cursor-pointer"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Print CV Button */}
            <Button
              variant="primary"
              size="sm"
              icon={Printer}
              onClick={printResume}
              loading={isPrinting}
            >
              <span className="hidden sm:inline">Cetak / Unduh</span> PDF
            </Button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
