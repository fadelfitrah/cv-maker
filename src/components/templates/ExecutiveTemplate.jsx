import React from "react";
import { Mail, Phone, MapPin, Globe, FolderKanban } from "lucide-react";

export function ExecutiveTemplate({ data }) {
  const {
    personalInfo,
    experiences,
    education,
    skills,
    projects,
    certifications,
    languages,
    theme,
  } = data;
  const primaryColor = theme?.primaryColor || "#334155";

  return (
    <div className="text-slate-800 p-8 sm:p-12 leading-relaxed font-serif">
      {/* Executive Header with double border */}
      <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-3xl sm:text-4xl font-normal tracking-wide text-slate-900 uppercase">
          {personalInfo.fullName || "Nama Lengkap"}
        </h1>
        <p className="text-base text-slate-600 tracking-widest uppercase font-sans mt-1">
          {personalInfo.jobTitle || "Executive / Management"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-sans text-slate-600 mt-3 pt-3 border-t border-slate-200">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <FolderKanban className="w-3 h-3 text-slate-400" />
              LinkedIn Profile
            </span>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      {personalInfo.bio && (
        <div className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Ringkasan Eksekutif
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {personalInfo.bio}
          </p>
        </div>
      )}

      {/* Leadership & Work Experience */}
      {experiences?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Pengalaman Profesional & Kepemimpinan
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <h3 className="text-sm font-bold text-slate-900">
                    {exp.role} —{" "}
                    <span className="font-normal text-slate-700">
                      {exp.company}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-xs text-slate-500 font-sans italic">
                    {exp.location}
                  </p>
                )}
                {exp.description && (
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {exp.description}
                  </p>
                )}
                {exp.highlights?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700">
                    {exp.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Latar Belakang Akademik
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="flex justify-between items-baseline font-sans"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {edu.institution}
                  </h4>
                  <p className="text-xs text-slate-700">
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `dalam ${edu.fieldOfStudy}` : ""}
                    {edu.score && ` • ${edu.score}`}
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Competencies & Skills */}
      {skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Kompetensi Kunci & Keahlian
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-sans text-xs text-slate-700">
            {skills.map((sk) => (
              <div key={sk.id} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                <span>{sk.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Kredensial & Sertifikasi
          </h2>
          <div className="space-y-1 font-sans text-xs text-slate-700">
            {certifications.map((c) => (
              <div key={c.id}>
                <strong>{c.name}</strong> — {c.issuer} ({c.issueDate})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
