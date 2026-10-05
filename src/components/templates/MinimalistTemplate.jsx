import React from 'react';

export function MinimalistTemplate({ data }) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;

  return (
    <div className="text-neutral-900 p-8 sm:p-12 leading-normal font-sans">
      {/* Centered ATS Header */}
      <div className="text-center border-b border-neutral-300 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
          {personalInfo.fullName || 'NAMA LENGKAP'}
        </h1>
        <p className="text-sm font-medium text-neutral-600 mt-1 uppercase tracking-wider">
          {personalInfo.jobTitle || 'Profesi / Posisi'}
        </p>

        {/* ATS-friendly contact line */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-2.5">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && (
            <span>• {personalInfo.website.replace(/^https?:\/\//, '')}</span>
          )}
          {personalInfo.linkedin && (
            <span>• {personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
          )}
          {personalInfo.github && (
            <span>• {personalInfo.github.replace(/^https?:\/\//, '')}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.bio && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-200 pb-1 mb-2">
            Ringkasan Profesional
          </h2>
          <p className="text-xs text-neutral-700 leading-relaxed">{personalInfo.bio}</p>
        </div>
      )}

      {/* Experience */}
      {experiences?.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-200 pb-1 mb-3">
            Pengalaman Kerja
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-neutral-900">
                    {exp.role} <span className="font-normal text-neutral-600">| {exp.company}</span>
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {exp.startDate} - {exp.isCurrent ? 'Sekarang' : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[11px] text-neutral-500 italic">{exp.location}</p>
                )}
                {exp.description && (
                  <p className="text-xs text-neutral-700 mt-1">{exp.description}</p>
                )}
                {exp.highlights?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-0.5 text-xs text-neutral-700">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-200 pb-1 mb-3">
            Proyek Pilihan
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-neutral-900">
                    {proj.title}{' '}
                    {proj.tags?.length > 0 && (
                      <span className="font-normal text-neutral-500">
                        ({proj.tags.join(', ')})
                      </span>
                    )}
                  </h3>
                  {proj.date && <span className="text-[11px] text-neutral-400">{proj.date}</span>}
                </div>
                {proj.description && (
                  <p className="text-xs text-neutral-700 mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-200 pb-1 mb-3">
            Pendidikan
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-xs font-bold text-neutral-900">{edu.institution}</h3>
                  <p className="text-xs text-neutral-700">
                    {edu.degree} {edu.fieldOfStudy ? `– ${edu.fieldOfStudy}` : ''}
                    {edu.score && ` (${edu.score})`}
                  </p>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-200 pb-1 mb-2">
            Keterampilan Teknis
          </h2>
          <p className="text-xs text-neutral-700 leading-relaxed">
            {skills.map((s) => s.name).join(' • ')}
          </p>
        </div>
      )}

      {/* Certifications & Languages */}
      {(certifications?.length > 0 || languages?.length > 0) && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-200 pb-1 mb-2">
                Sertifikasi
              </h2>
              <div className="space-y-1 text-xs text-neutral-700">
                {certifications.map((c) => (
                  <div key={c.id}>
                    • <strong>{c.name}</strong> ({c.issuer})
                  </div>
                ))}
              </div>
            </div>
          )}
          {languages?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-200 pb-1 mb-2">
                Bahasa
              </h2>
              <div className="text-xs text-neutral-700">
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(' • ')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
