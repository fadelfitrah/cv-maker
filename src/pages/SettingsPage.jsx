import React, { useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { storageService } from '../services/storageService';
import { exportService } from '../services/exportService';
import { Button } from '../components/common/Button';
import {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  FileCode,
  ShieldCheck,
  Sparkles,
  Layers,
} from 'lucide-react';

export function SettingsPage() {
  const { resumeData, loadPreset, resetToEmpty, importData, showToast, setActivePage } =
    useResume();
  const fileInputRef = useRef(null);

  const handleExportJSON = () => {
    const success = storageService.exportToJSONFile(resumeData);
    if (success) {
      showToast('Cadangan data JSON berhasil diunduh!');
    }
  };

  const handleExportMarkdown = () => {
    exportService.downloadMarkdownFile(resumeData);
    showToast('File Markdown (.md) berhasil diunduh!');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await storageService.importFromJSONFile(file);
      importData(imported);
      e.target.value = '';
      setActivePage('editor');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengimpor file. Pastikan format JSON sesuai.', 'error');
    }
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengosongkan semua data CV? Tindakan ini tidak dapat dibatalkan.'
      )
    ) {
      resetToEmpty();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kelola Data & Cadangan (Backup)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simpan cadangan data Anda, muat contoh preset profil profesional, atau impor file JSON.
        </p>
      </div>

      {/* Preset Profil Cepat */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Muat Preset Contoh Profil</h2>
            <p className="text-xs text-slate-500">
              Gunakan data contoh yang sudah terisi lengkap untuk menguji berbagai template dan fitur portofolio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition bg-slate-50/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase">Preset 1</span>
              <h3 className="font-bold text-slate-900 mt-1">Software Engineer (Fullstack)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Lengkap dengan riwayat proyek cloud, tech stack modern, sertifikasi AWS, dan metrik dampak tinggi.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                loadPreset('engineer');
                setActivePage('editor');
              }}
            >
              Muat Profil Engineer
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition bg-slate-50/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase">Preset 2</span>
              <h3 className="font-bold text-slate-900 mt-1">Product Designer (UI/UX)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Lengkap dengan portofolio visual, design system, studi kasus Figma, dan sertifikat Google UX.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                loadPreset('designer');
                setActivePage('editor');
              }}
            >
              Muat Profil Desainer
            </Button>
          </div>
        </div>
      </div>

      {/* Ekspor & Impor File */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Ekspor & Impor Data (Privat & Mandiri)</h2>
            <p className="text-xs text-slate-500">
              Data Anda 100% tersimpan di browser Anda tanpa perlu mendaftar akun atau bergantung pada server luar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">Cadangkan JSON</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simpan semua formulir ke satu file backup JSON
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              icon={Download}
              onClick={handleExportJSON}
            >
              Unduh .JSON
            </Button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">Pulihkan Data</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Impor file cadangan JSON yang pernah Anda simpan
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
            >
              Pilih File JSON
            </Button>
          </div>

          {/* Export Markdown */}
          <div className="p-4 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">Format Markdown</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Format teks rapi untuk README atau profil LinkedIn
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={FileCode}
              onClick={handleExportMarkdown}
            >
              Unduh .MD
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Clear Data */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 space-y-3">
        <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-600" />
          Zona Bahaya: Hapus Semua Data
        </h3>
        <p className="text-xs text-rose-700 leading-relaxed">
          Tindakan ini akan mengosongkan seluruh formulir informasi pribadi, riwayat kerja, pendidikan, keahlian, dan portofolio. Pastikan Anda sudah mengunduh cadangan JSON terlebih dahulu jika data masih diperlukan.
        </p>
        <div className="pt-2">
          <Button variant="danger" size="sm" icon={Trash2} onClick={handleResetConfirm}>
            Kosongkan Seluruh Data CV
          </Button>
        </div>
      </div>
    </div>
  );
}
