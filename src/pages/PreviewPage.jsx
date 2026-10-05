import React from 'react';
import { useResume } from '../context/ResumeContext';
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
} from 'lucide-react';

export function PreviewPage() {
  const { resumeData, setActivePage, showToast } = useResume();
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
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
            icon={Printer}
            onClick={printResume}
            loading={isPrinting}
          >
            Cetak / Simpan PDF
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
