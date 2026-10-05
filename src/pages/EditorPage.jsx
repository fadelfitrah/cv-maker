import React from 'react';
import { useResume } from '../context/ResumeContext';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { PersonalInfoForm } from '../components/editor/PersonalInfoForm';
import { ExperienceForm } from '../components/editor/ExperienceForm';
import { EducationForm } from '../components/editor/EducationForm';
import { SkillsForm } from '../components/editor/SkillsForm';
import { ProjectsForm } from '../components/editor/ProjectsForm';
import { CertificationsForm, LanguagesForm } from '../components/editor/CertificationsForm';
import { DesignForm } from '../components/editor/DesignForm';
import { ResumePreview } from '../components/preview/ResumePreview';
import { Eye, PencilLine } from 'lucide-react';

export function EditorPage() {
  const { activeEditorSection } = useResume();

  const renderActiveSection = () => {
    switch (activeEditorSection) {
      case 'personal': return <PersonalInfoForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'certifications': return (
        <div className="space-y-8">
          <CertificationsForm />
          <div className="border-t border-slate-200 pt-6"><LanguagesForm /></div>
        </div>
      );
      case 'design': return <DesignForm />;
      default: return <PersonalInfoForm />;
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-5 xl:px-7 py-5 lg:py-6 flex-1">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-indigo-600">
            <PencilLine className="w-3.5 h-3.5" /> CV Workspace
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950">Buat CV profesional Anda</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Isi informasi di panel kiri dan lihat perubahan secara langsung di preview.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
          <Eye className="w-3.5 h-3.5 text-indigo-500" /> Live preview
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5 items-start">
        <section className="lg:col-span-7 xl:col-span-7 min-w-0">
          <div className="flex flex-col md:flex-row gap-3 xl:gap-4">
            <aside className="w-full md:w-[218px] xl:w-[232px] shrink-0">
              <EditorSidebar />
            </aside>
            <div className="min-w-0 flex-1 soft-card rounded-2xl p-5 sm:p-6 xl:p-7 overflow-y-auto max-h-[calc(100vh-148px)]">
              {renderActiveSection()}
            </div>
          </div>
        </section>

        <section className="lg:col-span-5 xl:col-span-5 sticky top-[84px] h-[calc(100vh-108px)] min-h-[620px]">
          <div className="h-full rounded-2xl border border-slate-200/80 bg-slate-100/75 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200/80 bg-white/85 backdrop-blur no-print">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600"><Eye className="w-3.5 h-3.5" /></span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Live Preview</p>
                  <p className="text-[10px] text-slate-400">Format A4 · realtime</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif</span>
            </div>
            <div className="h-[calc(100%-54px)] overflow-auto p-3 sm:p-5">
              <ResumePreview />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
