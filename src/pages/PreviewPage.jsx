import React from 'react';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { usePrintResume } from '../hooks/usePrintResume';
import { exportService } from '../services/exportService';
import { ResumePreview } from '../components/preview/ResumePreview';
import { Button } from '../components/common/Button';
import {
  Printer,
  FileText,
  Download,
  Share2,
  ArrowLeft,
  CheckCircle,
  Zap,
  Lock,
  Crown,
} from 'lucide-react';

export function PreviewPage() {
  const { resumeData, setActivePage, showToast } = useResume();
  const { isPro, isLoggedIn, openAuthModal, openUpgradeModal } = useAuth();
  const { printResume, isPrinting } = usePrintResume(resumeData.personalInfo?.fullName);

  const handleDownloadMarkdown = () => {
    exportService.downloadMarkdownFile(resumeData);
    showToast('File Markdown (.md) berhasil diunduh!');
  };

  const handleShareLink = () => {
    const link = exportService.generateShareableLink(resumeData);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showToast('Tautan Portofolio Berhasil Disalin ke Clipboard!');
    }
  };

  const handlePrintOrDownload = () => {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
      {/* Banner informasi jika user masih berstatus Free */}
      {!isPro && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 shadow-xs no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Mode Gratis Aktif: Pratinjau Tersedia, Unduh PDF Terkunci
              </p>
              <p className="text-[11px] text-slate-500">
                Tingkatkan akun Anda ke paket berbayar (Pro) untuk dapat mengunduh dan mencetak file PDF CV ini.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            icon={Zap}
            onClick={openUpgradeModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 rounded-xl"
          >
            Aktifkan Mode Unduh PDF
          </Button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs no-print">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => setActivePage('editor')}
          >
            Kembali ke Editor
          </Button>
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />
          <h2 className="text-sm font-bold text-slate-800 hidden sm:block">
            Pratinjau Cetak Lembar CV (Standar A4)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={handleDownloadMarkdown}
          >
            Unduh .MD
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Share2}
            onClick={handleShareLink}
          >
            Salin Link Web
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={isPro ? Printer : Lock}
            onClick={handlePrintOrDownload}
            loading={isPrinting}
            className={isPro ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold' : 'bg-slate-900 hover:bg-slate-800 text-white'}
          >
            {isPro ? 'Cetak / Simpan PDF' : 'Unduh PDF (Pro Only)'}
          </Button>
        </div>
      </div>

      {/* Fullscreen A4 Preview */}
      <div className="flex-1 min-h-[800px]">
        <ResumePreview isFullscreen={true} />
      </div>
    </div>
  );
}
