import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
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
  Home,
  Crown,
  LogIn,
  LogOut,
  User,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export function Navbar() {
  const { resumeData, activePage, setActivePage, saveStatus, undo, redo, canUndo, canRedo } = useResume();
  const { user, isLoggedIn, isPro, isAdmin, logout, openAuthModal, openUpgradeModal } = useAuth();
  const { printResume, isPrinting } = usePrintResume(resumeData.personalInfo?.fullName);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'editor', label: 'Editor', icon: FileText, requiresAuth: true },
    { id: 'preview', label: 'Preview', icon: Printer },
    { id: 'templates', label: 'Template', icon: LayoutTemplate },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'settings', label: 'Data', icon: Settings },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: ShieldCheck, requiresAuth: true, highlight: true }] : []),
  ];

  const handleNavClick = (item) => {
    if (item.requiresAuth && !isLoggedIn) {
      openAuthModal('login', item.id);
      return;
    }
    setActivePage(item.id);
  };

  // Handler Download PDF dengan pengecekan plan dari database MySQL
  const handleDownloadPdf = () => {
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }
    if (!isPro) {
      openUpgradeModal();
      return;
    }
    printResume();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-blue-100/80 shadow-xs no-print">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-5 xl:px-7">
        <div className="flex items-center justify-between h-[68px] gap-3">
          {/* Logo & Brand Modern Biru-Putih */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer min-w-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-[13px] bg-blue-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
              <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[17px] tracking-tight text-slate-950">ProCV</span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 px-1.5 py-0.5 border border-blue-100">
                  Maker
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">Sistem CV & Portofolio</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Auth Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Undo Redo for editor */}
            {activePage === 'editor' && (
              <div className="hidden xl:flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Y)"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Save Status indicator */}
            {activePage === 'editor' && (
              <div className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 px-1">
                {saveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" /> Menyimpan
                  </>
                ) : saveStatus === 'error' ? (
                  <span className="text-rose-500">Gagal menyimpan</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Tersimpan
                  </>
                )}
              </div>
            )}

            {/* User Profile / Auth State */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Badge Status Plan User */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-[11px]">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-bold text-[11px] text-slate-800 leading-tight truncate max-w-[100px]">
                      {user?.name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider ${
                        isPro ? 'text-amber-600' : 'text-slate-500'
                      }`}
                    >
                      {isPro ? (
                        <>
                          <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> PRO
                        </>
                      ) : (
                        'FREE'
                      )}
                    </span>
                  </div>
                </div>

                {/* Tombol Akses Khusus Admin */}
                {isAdmin && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={ShieldCheck}
                    onClick={() => setActivePage('admin')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                  >
                    Admin Panel
                  </Button>
                )}

                {/* Tombol Upgrade jika masih status Free */}
                {!isPro && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Zap}
                    onClick={openUpgradeModal}
                    className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold"
                  >
                    <span className="hidden sm:inline">Upgrade</span> Pro
                  </Button>
                )}

                <button
                  type="button"
                  onClick={logout}
                  title="Keluar"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={LogIn}
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-semibold text-slate-700 hover:text-blue-700 hover:border-blue-300"
                >
                  Masuk
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal('register')}
                  className="hidden sm:flex text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Daftar
                </Button>
              </div>
            )}

            {/* Tombol Unduh PDF (Kunci jika Free, Aktif jika Pro) */}
            <Button
              variant="primary"
              size="sm"
              icon={Printer}
              onClick={handleDownloadPdf}
              loading={isPrinting}
              className={`rounded-xl text-xs font-bold transition-all shadow-md ${
                isPro
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span className="hidden sm:inline">Unduh</span> PDF
              {!isPro && (
                <span className="ml-1.5 text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-extrabold uppercase">
                  PRO
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto pb-2 gap-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
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
