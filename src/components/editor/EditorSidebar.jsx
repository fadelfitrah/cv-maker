import React from 'react';
import { useResume } from '../../context/ResumeContext';
import {
  User,
  Briefcase,
  GraduationCap,
  Cpu,
  FolderGit2,
  Award,
  Palette,
} from 'lucide-react';

export function EditorSidebar() {
  const { activeEditorSection, setActiveEditorSection, resumeData } = useResume();

  const sections = [
    {
      id: 'personal',
      label: 'Info Pribadi',
      icon: User,
      badge: resumeData.personalInfo?.fullName ? '✓' : null,
    },
    {
      id: 'experience',
      label: 'Pengalaman',
      icon: Briefcase,
      badge: resumeData.experiences?.length || 0,
    },
    {
      id: 'education',
      label: 'Pendidikan',
      icon: GraduationCap,
      badge: resumeData.education?.length || 0,
    },
    {
      id: 'skills',
      label: 'Keahlian',
      icon: Cpu,
      badge: resumeData.skills?.length || 0,
    },
    {
      id: 'projects',
      label: 'Proyek',
      icon: FolderGit2,
      badge: resumeData.projects?.length || 0,
    },
    {
      id: 'certifications',
      label: 'Sertifikasi & Bahasa',
      icon: Award,
      badge: (resumeData.certifications?.length || 0) + (resumeData.languages?.length || 0),
    },
    {
      id: 'design',
      label: 'Desain & Tema',
      icon: Palette,
      badge: null,
    },
  ];

  return (
    <div className="w-full lg:w-60 bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs space-y-1">
      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Navigasi Editor
      </div>
      {sections.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeEditorSection === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveEditorSection(sec.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{sec.label}</span>
            </div>
            {sec.badge !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {sec.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
