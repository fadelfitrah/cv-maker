import React from "react";
import {
  Terminal,
  FolderGit2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

export function TechTemplate({ data }) {
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
  const primaryColor = theme?.primaryColor || "#0284c7";

  return (
    <div className="text-slate-800 p-8 sm:p-10 leading-normal font-sans">
      {/* Terminal-inspired Header */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-mono">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>developer@terminal:~$ whoami</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {personalInfo.fullName || "Nama Lengkap"}
            </h1>
            <p className="text-sm font-semibold text-emerald-400 font-mono mt-1">
              &gt; {personalInfo.jobTitle || "Fullstack Software Engineer"}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 mt-3 font-mono">
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
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-sky-300 hover:underline"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  github.com/{personalInfo.github.split("/").pop()}
                </a>
              )}
            </div>
          </div>

          {theme?.showPhoto && personalInfo.avatarUrl && (
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.fullName}
              className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-400/60 shadow-md shrink-0"
            />
          )}
        </div>

        {personalInfo.bio && (
          <p className="text-xs text-slate-300 mt-4 leading-relaxed font-mono border-t border-slate-800 pt-3">
            {personalInfo.bio}
          </p>
        )}
      </div>

      {/* Tech Skills Matrix */}
      {skills?.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-slate-700 uppercase">
            <span className="text-emerald-600">const</span> skills = [
          </div>
          <div className="flex flex-wrap gap-1.5 pl-4">
            {skills.map((sk) => (
              <span
                key={sk.id}
                className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800"
              >
                "{sk.name}"
              </span>
            ))}
          </div>
          <div className="font-mono text-xs text-slate-700 pl-2 mt-1">];</div>
        </div>
      )}

      {/* Experience */}
      {experiences?.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
            // EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative pl-3 border-l-2 border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <h3 className="text-xs font-bold text-slate-900 font-mono">
                    {exp.role}{" "}
                    <span className="text-emerald-700">@{exp.company}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {exp.description}
                  </p>
                )}
                {exp.highlights?.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-xs text-slate-600 list-disc list-outside ml-4">
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
        <div className="mt-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
            // NOTABLE PROJECTS & REPOSITORIES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 font-mono">
                    {proj.title}
                  </h4>
                  {proj.date && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {proj.date}
                    </span>
                  )}
                </div>
                {proj.subtitle && (
                  <p className="text-[11px] text-slate-600 italic mt-0.5">
                    {proj.subtitle}
                  </p>
                )}
                {proj.description && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200/60">
                  <div className="flex flex-wrap gap-1">
                    {proj.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-1 rounded bg-white text-slate-700 border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      demo <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certs */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
        {education?.length > 0 && (
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-slate-900 mb-2">
              // EDUCATION
            </h3>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs text-slate-700">
                <div className="font-bold">{edu.institution}</div>
                <div>
                  {edu.degree} {edu.fieldOfStudy ? `– ${edu.fieldOfStudy}` : ""}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {edu.startDate} - {edu.endDate}{" "}
                  {edu.score ? `| ${edu.score}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}

        {certifications?.length > 0 && (
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-slate-900 mb-2">
              // CERTIFICATIONS
            </h3>
            <div className="space-y-1 text-xs text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  • <span className="font-semibold">{c.name}</span> ({c.issuer})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
