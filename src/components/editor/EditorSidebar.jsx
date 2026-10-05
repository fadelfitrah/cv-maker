import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { User, Briefcase, GraduationCap, Cpu, FolderGit2, Award, Palette, ChevronRight } from 'lucide-react';

export function EditorSidebar() {
  const { activeEditorSection, setActiveEditorSection, resumeData } = useResume();

  const sections = [
    { id: 'personal', label: 'Info Pribadi', icon: User, badge: resumeData.personalInfo?.fullName ? '✓' : null },
    { id: 'experience', label: 'Pengalaman', icon: Briefcase, badge: resumeData.experiences?.length || 0 },
    { id: 'education', label: 'Pendidikan', icon: GraduationCap, badge: resumeData.education?.length || 0 },
    { id: 'skills', label: 'Keahlian', icon: Cpu, badge: resumeData.skills?.length || 0 },
    { id: 'projects', label: 'Proyek', icon: FolderGit2, badge: resumeData.projects?.length || 0 },
    { id: 'certifications', label: 'Sertifikasi & Bahasa', icon: Award, badge: (resumeData.certifications?.length || 0) + (resumeData.languages?.length || 0) },
    { id: 'design', label: 'Desain & Tema', icon: Palette, badge: null },
  ];

  return (
    <div className="soft-card rounded-2xl p-2 sticky top-0">
      <div className="px-3 pt-2 pb-2.5">
        <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">Editor CV</p>
        <p className="mt-1 text-xs text-slate-500">Lengkapi bagian berikut</p>
      </div>
      <div className="space-y-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeEditorSection === sec.id;
          return (
            <button key={sec.id} type="button" onClick={() => setActiveEditorSection(sec.id)}
              className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${isActive ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${isActive ? 'bg-white/10 text-indigo-300' : 'bg-slate-100 text-slate-400 group-hover:text-indigo-500'}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block truncate text-xs font-bold">{sec.label}</span>
                {isActive && <span className="block text-[9px] text-slate-400 mt-0.5">Sedang diedit</span>}
              </span>
              {sec.badge !== null && <span className={`text-[10px] font-bold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center ${isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>{sec.badge}</span>}
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-slate-400 translate-x-0.5' : 'text-slate-300'}`} />
            </button>
          );
        })}
      </div>
      <div className="mt-3 mx-1 rounded-xl bg-indigo-50/80 border border-indigo-100 px-3 py-3">
        <p className="text-[10px] font-bold text-indigo-700">Tips</p>
        <p className="mt-1 text-[10px] leading-relaxed text-indigo-600/80">Gunakan deskripsi singkat dan pencapaian terukur agar CV lebih mudah dipindai recruiter.</p>
      </div>
    </div>
  );
}
