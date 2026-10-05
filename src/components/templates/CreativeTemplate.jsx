import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  FolderKanban,
  FolderGit2,
  Award,
  CheckCircle2,
} from "lucide-react";

export function CreativeTemplate({ data }) {
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
    <div className="flex flex-col sm:flex-row min-h-full font-sans text-slate-800">
      {/* Left Sidebar */}
      <div className="w-full sm:w-1/3 bg-slate-900 text-slate-200 p-6 sm:p-7 space-y-6">
        {/* Avatar */}
        {theme?.showPhoto && personalInfo.avatarUrl ? (
          <div className="text-center">
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.fullName}
              className={`w-28 h-28 mx-auto object-cover border-4 border-slate-700 shadow-lg ${
                personalInfo.avatarShape === "square" ? "rounded-lg" : "rounded-full"
              }`}
            />
          </div>
        ) : null}

        {/* Contact Info */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
            Kontak
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2 break-all text-slate-300">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 text-slate-300">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>LinkedIn</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
              Keahlian
            </h3>
            <div className="space-y-1.5">
              {skills.map((sk) => (
                <div key={sk.id} className="text-xs">
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>{sk.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {sk.level}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: primaryColor,
                        width:
                          sk.level === "Expert"
                            ? "95%"
                            : sk.level === "Advanced"
                              ? "80%"
                              : sk.level === "Intermediate"
                                ? "65%"
                                : "45%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
              Pendidikan
            </h3>
            <div className="space-y-2.5 text-xs">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="font-bold text-slate-100">
                    {edu.institution}
                  </div>
                  <div className="text-slate-400">{edu.degree}</div>
                  <div className="text-[11px] text-slate-500">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div className="space-y-1.5 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
              Bahasa
            </h3>
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between text-slate-300">
                <span>{l.name}</span>
                <span className="text-slate-500 text-[11px]">
                  {l.proficiency}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Body */}
      <div className="w-full sm:w-2/3 p-6 sm:p-8 space-y-6 bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personalInfo.fullName || "Nama Lengkap"}
          </h1>
          <p
            className="text-base font-semibold mt-1"
            style={{ color: primaryColor }}
          >
            {personalInfo.jobTitle || "Profesi / Posisi"}
          </p>
          {personalInfo.bio && (
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {personalInfo.bio}
            </p>
          )}
        </div>

        {/* Experience Timeline */}
        {experiences?.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-4 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Pengalaman Kerja
            </h2>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-4 border-l-2 border-slate-200"
                >
                  <div
                    className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">
                      {exp.role}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {exp.startDate} -{" "}
                      {exp.isCurrent ? "Sekarang" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    {exp.company}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-xs text-slate-600">
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

        {/* Selected Projects */}
        {projects?.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Portofolio & Karya
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex justify-between items-baseline">
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
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
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

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Sertifikasi
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  • <strong>{c.name}</strong> ({c.issuer})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
