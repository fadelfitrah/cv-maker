import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { TEMPLATE_LIST, COLOR_PALETTES } from '../../types/resume';
import { Palette, Type, Check, Eye } from 'lucide-react';

export function DesignForm() {
  const { resumeData, updateTheme } = useResume();
  const theme = resumeData.theme || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Desain & Kustomisasi CV</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilih tata letak template, skema warna aksen, dan tipografi dokumen Anda.
        </p>
      </div>

      {/* Pilih Template CV */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Pilih Template Resume
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_LIST.map((tpl) => {
            const isSelected = theme.templateId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => updateTheme({ templateId: tpl.id })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{tpl.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {tpl.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warna Aksen */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          Warna Aksen Tema
        </label>
        <div className="flex flex-wrap gap-3">
          {COLOR_PALETTES.map((color) => {
            const isSelected = theme.primaryColor === color.value;
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => updateTheme({ primaryColor: color.value })}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-all"
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: color.value }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </span>
                <span className="text-xs font-medium text-slate-700">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tipografi & Ukuran Teks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Type className="w-4 h-4 text-indigo-600" />
            Jenis Font
          </label>
          <div className="space-y-2">
            {[
              { id: 'sans', label: 'Plus Jakarta Sans (Modern & Bersih)' },
              { id: 'serif', label: 'Playfair Display (Elegan & Formal)' },
              { id: 'mono', label: 'Fira Code (Developer & Tech)' },
            ].map((f) => (
              <label
                key={f.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-xs font-medium ${
                  theme.fontFamily === f.id
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="fontFamily"
                  checked={theme.fontFamily === f.id}
                  onChange={() => updateTheme({ fontFamily: f.id })}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Kepadatan Teks (Spacing)
          </label>
          <div className="space-y-2">
            {[
              { id: 'compact', label: 'Rapat (Compact - Muat Banyak Data)' },
              { id: 'normal', label: 'Standar (Ideal & Seimbang)' },
              { id: 'large', label: 'Lapang (Lebih Mudah Dibaca)' },
            ].map((s) => (
              <label
                key={s.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-xs font-medium ${
                  theme.fontSize === s.id
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="fontSize"
                  checked={theme.fontSize === s.id}
                  onChange={() => updateTheme({ fontSize: s.id })}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Tampilkan Foto Profil di CV */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Tampilkan Foto Profil di Lembar CV</h4>
          <p className="text-xs text-slate-500">
            Sebagian negara / perusahaan merekomendasikan CV tanpa foto untuk menghindari bias ATS.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={theme.showPhoto !== false}
            onChange={(e) => updateTheme({ showPhoto: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>
    </div>
  );
}
