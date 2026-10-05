import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Plus, Trash2, Briefcase, Calendar, MapPin, Sparkles } from 'lucide-react';

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, deleteExperience } = useResume();
  const experiences = resumeData.experiences || [];

  const handleAddHighlight = (expId, currentHighlights = []) => {
    updateExperience(expId, {
      highlights: [...currentHighlights, ''],
    });
  };

  const handleUpdateHighlight = (expId, currentHighlights, index, value) => {
    const updated = [...currentHighlights];
    updated[index] = value;
    updateExperience(expId, { highlights: updated });
  };

  const handleDeleteHighlight = (expId, currentHighlights, index) => {
    const updated = currentHighlights.filter((_, i) => i !== index);
    updateExperience(expId, { highlights: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pengalaman Kerja</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cantumkan riwayat karier Anda dari yang paling terkini.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={addExperience}>
          Tambah Pengalaman
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">Belum ada pengalaman kerja yang ditambahkan</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Tambahkan riwayat magang, freelance, atau pekerjaan tetap Anda.
          </p>
          <Button variant="outline" size="sm" icon={Plus} onClick={addExperience}>
            Tambah Pengalaman Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4 transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Pengalaman #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteExperience(exp.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  title="Hapus pengalaman ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Jabatan / Role"
                  placeholder="e.g. Lead Frontend Engineer"
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                  required
                />
                <Input
                  label="Nama Perusahaan / Organisasi"
                  placeholder="e.g. PT Solusi Digital"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <Input
                  label="Lokasi"
                  placeholder="e.g. Jakarta, Indonesia"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  icon={MapPin}
                />
                <Input
                  label="Tanggal Mulai"
                  placeholder="YYYY-MM (e.g. 2022-01)"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  icon={Calendar}
                />
                <div>
                  <Input
                    label="Tanggal Selesai"
                    placeholder="YYYY-MM (e.g. 2024-05)"
                    value={exp.isCurrent ? 'Sekarang' : exp.endDate}
                    disabled={exp.isCurrent}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    icon={Calendar}
                  />
                  <label className="flex items-center gap-2 mt-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!exp.isCurrent}
                      onChange={(e) =>
                        updateExperience(exp.id, {
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? '' : exp.endDate,
                        })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Masih bekerja di sini saat ini</span>
                  </label>
                </div>
              </div>

              <Textarea
                label="Deskripsi Umum Tanggung Jawab"
                rows={2}
                placeholder="Rangkum peran umum Anda dalam tim atau perusahaan..."
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
              />

              {/* Bullet Highlights / Pencapaian */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Poin Pencapaian & Dampak (Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddHighlight(exp.id, exp.highlights)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                  >
                    + Tambah Poin
                  </button>
                </div>

                {exp.highlights?.map((point, pIndex) => (
                  <div key={pIndex} className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">•</span>
                    <input
                      type="text"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      placeholder="e.g. Meningkatkan kecepatan loading 40% dengan code splitting..."
                      value={point}
                      onChange={(e) =>
                        handleUpdateHighlight(exp.id, exp.highlights, pIndex, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(exp.id, exp.highlights, pIndex)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
