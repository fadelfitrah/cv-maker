import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Plus, Trash2, GraduationCap, Calendar, Award } from 'lucide-react';

export function EducationForm() {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResume();
  const educationList = resumeData.education || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Riwayat Pendidikan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendidikan formal, universitas, sekolah, atau bootcamp intensif.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={addEducation}>
          Tambah Pendidikan
        </Button>
      </div>

      {educationList.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">Belum ada riwayat pendidikan yang ditambahkan</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Tambahkan informasi jenjang sarjana, diploma, atau SMK.
          </p>
          <Button variant="outline" size="sm" icon={Plus} onClick={addEducation}>
            Tambah Pendidikan Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {educationList.map((edu, index) => (
            <div
              key={edu.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4 transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Pendidikan #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteEducation(edu.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  title="Hapus pendidikan ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Institusi / Universitas"
                  placeholder="e.g. Institut Teknologi Bandung"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  icon={GraduationCap}
                  required
                />
                <Input
                  label="Gelar / Jenjang"
                  placeholder="e.g. Sarjana Komputer (S.Kom)"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Jurusan / Program Studi"
                  placeholder="e.g. Teknik Informatika"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                />
                <Input
                  label="Tahun Mulai"
                  placeholder="YYYY (e.g. 2018)"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  icon={Calendar}
                />
                <Input
                  label="Tahun Lulus"
                  placeholder="YYYY (e.g. 2022)"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                  icon={Calendar}
                />
              </div>

              <Input
                label="IPK / Nilai / Predikat Kelulusan"
                placeholder="e.g. IPK 3.82 / 4.00 (Cum Laude)"
                value={edu.score}
                onChange={(e) => updateEducation(edu.id, { score: e.target.value })}
                icon={Award}
              />

              <Textarea
                label="Keterangan / Aktivitas Akademik (Opsional)"
                rows={2}
                placeholder="Fokus skripsi, organisasi mahasiswa, riset laboratorium..."
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
