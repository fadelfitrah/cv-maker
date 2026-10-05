import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { usePrintResume } from '../../hooks/usePrintResume';
import { Button } from '../common/Button';
import { FileText, Globe, LayoutTemplate, Settings, Printer, Undo2, Redo2, CheckCircle2, RefreshCw } from 'lucide-react';

export function Navbar() {
  const { resumeData, activePage, setActivePage, saveStatus, undo, redo, canUndo, canRedo } = useResume();
  const { printResume, isPrinting } = usePrintResume(resumeData.personalInfo?.fullName);
  const navItems = [
    { id: 'editor', label: 'Editor', icon: FileText },
    { id: 'preview', label: 'Preview', icon: Printer },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'templates', label: 'Template', icon: LayoutTemplate },
    { id: 'settings', label: 'Data', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 glass-header border-b border-slate-200/80 no-print">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-5 xl:px-7">
        <div className="flex items-center justify-between h-[68px] gap-4">
          <button onClick={() => setActivePage('editor')} className="flex items-center gap-2.5 text-left group cursor-pointer min-w-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-[13px] bg-slate-950 text-white shadow-lg shadow-slate-950/10 group-hover:-translate-y-0.5 transition-transform">
              <FileText className="w-5 h-5" />
              <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[17px] tracking-tight text-slate-950">ProCV</span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-600 px-1.5 py-1">Maker</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">CV & Portfolio workspace</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-100/75 p-1">
            {navItems.map((item) => {
              const Icon = item.icon; const active = activePage === item.id;
              return <button key={item.id} onClick={() => setActivePage(item.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${active ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/70' : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'}`}>
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />{item.label}
              </button>;
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
              <button type="button" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"><Undo2 className="w-4 h-4" /></button>
              <button type="button" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"><Redo2 className="w-4 h-4" /></button>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 px-1">
              {saveStatus === 'saving' ? <><RefreshCw className="w-3 h-3 text-amber-500 animate-spin" /> Menyimpan</> : saveStatus === 'error' ? <span className="text-rose-500">Gagal menyimpan</span> : <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Tersimpan</>}
            </div>
            <Button variant="primary" size="sm" icon={Printer} onClick={printResume} loading={isPrinting} className="rounded-xl bg-slate-950 hover:bg-slate-800 shadow-lg shadow-slate-950/10">
              <span className="hidden sm:inline">Unduh</span> PDF
            </Button>
          </div>
        </div>
        <div className="flex lg:hidden overflow-x-auto pb-2 gap-1.5 scrollbar-none">
          {navItems.map((item) => { const Icon=item.icon; const active=activePage===item.id; return <button key={item.id} onClick={() => setActivePage(item.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap ${active ? 'bg-slate-950 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}><Icon className="w-3.5 h-3.5" />{item.label}</button>; })}
        </div>
      </div>
    </header>
  );
}
