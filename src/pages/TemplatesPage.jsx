import React from 'react';
import { useResume } from '../context/ResumeContext';
import { TEMPLATE_LIST } from '../types/resume';
import { Button } from '../components/common/Button';
import { Check, Sparkles, LayoutTemplate, ArrowRight } from 'lucide-react';

export function TemplatesPage() {
  const { resumeData, updateTheme, setActivePage, showToast } = useResume();
  const currentTemplateId = resumeData.theme?.templateId || 'modern';

  const handleSelectTemplate = (id, name) => {
    updateTheme({ templateId: id });
    showToast(`Template diubah menjadi ${name}`);
    setActivePage('editor');
  };

  const getTemplateFeatures = (id) => {
    switch (id) {
      case 'modern':
        return ['Header aksen warna elegan', 'Dua kolom seimbang', 'Cocok untuk semua profesi', 'Dukungan foto profil'];
      case 'minimalist':
        return ['100% ATS Friendly & Scanner safe', 'Monochrome hitam-putih bersih', 'Hierarki teks rapi', 'Fokus pada pencapaian'];
      case 'tech':
        return ['Format khusus Developer / IT', 'Tag teknologi & repositori GitHub', 'Tautan demo proyek langsung', 'Gaya terminal modern'];
      case 'executive':
        return ['Tipografi Serif berkelas (Playfair)', 'Struktur korporat formal', 'Cocok untuk posisi Manajer/Lead/Direktur', 'Fokus kepemimpinan'];
      case 'creative':
        return ['Sidebar kontras warna gelap', 'Visual timeline yang menarik', 'Cocok untuk Desainer UI/UX & Kreator', 'Skill bar visual'];
      default:
        return ['Desain responsif', 'Format cetak A4'];
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Pilihan Desain
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
          Koleksi Template CV & Portofolio
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Pilih tata letak yang paling sesuai dengan industri dan tingkatan karier Anda. Data Anda akan otomatis disesuaikan tanpa perlu mengetik ulang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATE_LIST.map((tpl) => {
          const isSelected = currentTemplateId === tpl.id;
          const features = getTemplateFeatures(tpl.id);

          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-2xl border-2 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-lg ${
                isSelected
                  ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {tpl.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" /> Sedang Aktif
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900">{tpl.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.description}</p>

                {/* Features list */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Keunggulan:
                  </div>
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Button
                  variant={isSelected ? 'secondary' : 'primary'}
                  size="md"
                  className="w-full"
                  onClick={() => handleSelectTemplate(tpl.id, tpl.name)}
                >
                  {isSelected ? 'Lanjut Edit CV Ini' : 'Gunakan Template Ini'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
