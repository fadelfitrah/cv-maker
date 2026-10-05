import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  FolderKanban,
  FolderGit2,
  ExternalLink,
} from "lucide-react";

export function ModernTemplate({ data }) {
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
  const primaryColor = theme?.primaryColor || "#4f46e5";

  return (
    <div className="text-slate-800 p-8 sm:p-10 leading-normal">
      {/* Top Header */}
      <div className="border-b-2 pb-6" style={{ borderColor: primaryColor }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || "Nama Lengkap"}
            </h1>
            <p
              className="text-lg font-semibold mt-1"
              style={{ color: primaryColor }}
            >
              {personalInfo.jobTitle || "Profesi / Posisi Impian"}
            </p>

            {/* Contacts Bar */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                  LinkedIn
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  Portfolio/GitHub
                </a>
              )}
            </div>
          </div>

          {/* Photo */}
          {theme?.showPhoto && personalInfo.avatarUrl && (
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm shrink-0 border-2 border-white ring-2 ring-slate-100">
              <img
                src={personalInfo.avatarUrl}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Bio / Summary */}
        {personalInfo.bio && (
          <p className="text-xs text-slate-600 mt-4 leading-relaxed border-t border-slate-100 pt-3">
            {personalInfo.bio}
          </p>
        )}
      </div>

      {/* Main Content Sections */}
      <div className="mt-6 space-y-6">
        {/* Experience Section */}
        {experiences?.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <span>Pengalaman Kerja</span>
              <span className="flex-1 h-px bg-slate-200" />
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      {exp.role}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500">
                      {exp.startDate} —{" "}
                      {exp.isCurrent ? "Sekarang" : exp.endDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span className="font-semibold text-slate-700">
                      {exp.company}
                    </span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-600">
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

        {/* Projects Section */}
        {projects?.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <span>Portofolio & Proyek Pilihan</span>
              <span className="flex-1 h-px bg-slate-200" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      {proj.title}
                    </h4>
                    {proj.date && (
                      <span className="text-[10px] text-slate-400">
                        {proj.date}
                      </span>
                    )}
                  </div>
                  {proj.subtitle && (
                    <p className="text-[11px] text-indigo-600 font-medium">
                      {proj.subtitle}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                  {proj.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <span>Pendidikan</span>
                <span className="flex-1 h-px bg-slate-200" />
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-xs font-bold text-slate-900">
                        {edu.institution}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      {edu.degree}{" "}
                      {edu.fieldOfStudy ? `– ${edu.fieldOfStudy}` : ""}
                    </p>
                    {edu.score && (
                      <p className="text-[11px] text-indigo-600 font-medium">
                        {edu.score}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <span>Keahlian (Skills)</span>
                <span className="flex-1 h-px bg-slate-200" />
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk) => (
                  <span
                    key={sk.id}
                    className="text-xs px-2.5 py-1 rounded-md font-medium text-slate-700 bg-slate-100 border border-slate-200"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications & Languages */}
        {(certifications?.length > 0 || languages?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {certifications?.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: primaryColor }}
                >
                  Sertifikasi
                </h2>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {certifications.map((c) => (
                    <div key={c.id}>
                      <span className="font-semibold text-slate-800">
                        {c.name}
                      </span>{" "}
                      – {c.issuer}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages?.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: primaryColor }}
                >
                  Bahasa
                </h2>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  {languages.map((l) => (
                    <span
                      key={l.id}
                      className="bg-slate-50 px-2 py-1 rounded border border-slate-200"
                    >
                      <strong>{l.name}</strong> ({l.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
