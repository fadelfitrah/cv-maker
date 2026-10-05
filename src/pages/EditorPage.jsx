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

export function EditorPage() {
  const { activeEditorSection } = useResume();

  const renderActiveSection = () => {
    switch (activeEditorSection) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'certifications':
        return (
          <div className="space-y-8">
            <CertificationsForm />
            <div className="border-t border-slate-200 pt-6">
              <LanguagesForm />
            </div>
          </div>
        );
      case 'design':
        return <DesignForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
        {/* Kolom Kiri: Sidebar Navigasi + Formulir Input */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col md:flex-row gap-4">
          {/* Sub-navigasi Tabs */}
          <div className="w-full md:w-56 shrink-0">
            <EditorSidebar />
          </div>

          {/* Form Container */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs overflow-y-auto max-h-[calc(100vh-140px)]">
            {renderActiveSection()}
          </div>
        </div>

        {/* Kolom Kanan: Live Realtime Preview Lembar A4 */}
        <div className="lg:col-span-6 xl:col-span-6 sticky top-20 h-[calc(100vh-100px)]">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
