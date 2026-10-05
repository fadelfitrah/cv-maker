import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Plus, Trash2, Award, Calendar, ExternalLink } from 'lucide-react';

export function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, deleteCertification } = useResume();
  const certs = resumeData.certifications || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Sertifikasi & Lisensi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sertifikasi profesional dari AWS, Google, Meta, Microsoft, dsb.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={addCertification}>
          Tambah Sertifikasi
        </Button>
      </div>

      {certs.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
          <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500">Belum ada sertifikasi yang ditambahkan</p>
          <Button variant="outline" size="sm" className="mt-3" icon={Plus} onClick={addCertification}>
            Tambah Sertifikasi
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {certs.map((c, index) => (
            <div
              key={c.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">
                  Sertifikat #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteCertification(c.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Nama Sertifikasi"
                  placeholder="e.g. AWS Solutions Architect Associate"
                  value={c.name}
                  onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                  required
                />
                <Input
                  label="Penerbit / Organisasi"
                  placeholder="e.g. Amazon Web Services"
                  value={c.issuer}
                  onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Bulan/Tahun Terbit"
                  placeholder="YYYY-MM (e.g. 2023-06)"
                  value={c.issueDate}
                  onChange={(e) => updateCertification(c.id, { issueDate: e.target.value })}
                  icon={Calendar}
                />
                <Input
                  label="ID Kredensial"
                  placeholder="e.g. AWS-12345"
                  value={c.credentialId}
                  onChange={(e) => updateCertification(c.id, { credentialId: e.target.value })}
                />
                <Input
                  label="URL Verifikasi"
                  placeholder="https://..."
                  value={c.credentialUrl}
                  onChange={(e) => updateCertification(c.id, { credentialUrl: e.target.value })}
                  icon={ExternalLink}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LanguagesForm() {
  const { resumeData, addLanguage, updateLanguage, deleteLanguage } = useResume();
  const languages = resumeData.languages || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kemampuan Bahasa</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bahasa yang dikuasai untuk komunikasi kerja harian.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => addLanguage('', 'Intermediate')}>
          Tambah Bahasa
        </Button>
      </div>

      <div className="space-y-3">
        {languages.map((l) => (
          <div key={l.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
            <Input
              placeholder="e.g. Bahasa Indonesia, English, Japanese"
              value={l.name}
              onChange={(e) => updateLanguage(l.id, { name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Tingkat (e.g. Native, Professional, Fluent)"
              value={l.proficiency}
              onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value })}
              className="w-1/3"
            />
            <button
              type="button"
              onClick={() => deleteLanguage(l.id)}
              className="text-slate-400 hover:text-rose-600 p-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
