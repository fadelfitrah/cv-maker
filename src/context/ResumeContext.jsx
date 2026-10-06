import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { exportService } from '../services/exportService';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { useAutoSave } from '../hooks/useAutoSave';
import { INITIAL_RESUME_STATE } from '../types/resume';

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  // Cek apakah ada shared portfolio data dari URL hash
  const initialData = React.useMemo(() => {
    const shared = exportService.parseSharedDataFromUrl();
    if (shared) {
      return shared;
    }
    return storageService.loadResumeData();
  }, []);

  const {
    state: resumeData,
    set: setResumeData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo(initialData);

  const saveStatus = useAutoSave(resumeData);

  // App routing / navigation state
  const [activePage, setActivePage] = useState(() => {
    if (window.location.hash.includes('portfolio-share=')) {
      return 'portfolio';
    }
    return 'home';
  });

  const [activeEditorSection, setActiveEditorSection] = useState('personal');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Update Personal Info
  const updatePersonalInfo = useCallback((field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }, [setResumeData]);

  // Update Theme / Customization
  const updateTheme = useCallback((themeUpdates) => {
    setResumeData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...themeUpdates,
      },
    }));
  }, [setResumeData]);

  // EXPERIENCE Actions
  const addExperience = useCallback(() => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      highlights: [''],
    };
    setResumeData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  }, [setResumeData]);

  const updateExperience = useCallback((id, updates) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    }));
  }, [setResumeData]);

  const deleteExperience = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  }, [setResumeData]);

  // EDUCATION Actions
  const addEducation = useCallback(() => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      score: '',
      description: '',
    };
    setResumeData((prev) => ({
      ...prev,
      education: [newEdu, ...prev.education],
    }));
  }, [setResumeData]);

  const updateEducation = useCallback((id, updates) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    }));
  }, [setResumeData]);

  const deleteEducation = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  }, [setResumeData]);

  // SKILLS Actions
  const addSkill = useCallback((category = 'General', name = '', level = 'Intermediate') => {
    const newSkill = {
      id: `sk-${Date.now()}`,
      category,
      name,
      level,
    };
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  }, [setResumeData]);

  const updateSkill = useCallback((id, updates) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((sk) => (sk.id === id ? { ...sk, ...updates } : sk)),
    }));
  }, [setResumeData]);

  const deleteSkill = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((sk) => sk.id !== id),
    }));
  }, [setResumeData]);

  // PROJECTS Actions
  const addProject = useCallback(() => {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      tags: [],
      liveUrl: '',
      githubUrl: '',
      image: '',
      featured: true,
      date: new Date().getFullYear().toString(),
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
  }, [setResumeData]);

  const updateProject = useCallback((id, updates) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, [setResumeData]);

  const deleteProject = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, [setResumeData]);

  // CERTIFICATIONS Actions
  const addCertification = useCallback(() => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialUrl: '',
      credentialId: '',
    };
    setResumeData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  }, [setResumeData]);

  const updateCertification = useCallback((id, updates) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, [setResumeData]);

  const deleteCertification = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  }, [setResumeData]);

  // LANGUAGES Actions
  const addLanguage = useCallback((name = '', proficiency = 'Intermediate') => {
    const newLang = {
      id: `lang-${Date.now()}`,
      name,
      proficiency,
    };
    setResumeData((prev) => ({
      ...prev,
      languages: [...prev.languages, newLang],
    }));
  }, [setResumeData]);

  const updateLanguage = useCallback((id, updates) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  }, [setResumeData]);

  const deleteLanguage = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  }, [setResumeData]);

  // DATA MANAGEMENT Actions
  const loadPreset = useCallback((type) => {
    const data = storageService.loadPreset(type);
    setResumeData(data);
    showToast(`Preset ${type === 'engineer' ? 'Software Engineer' : 'Product Designer'} berhasil dimuat!`);
  }, [setResumeData, showToast]);

  const resetToEmpty = useCallback(() => {
    const empty = storageService.clearResumeData();
    setResumeData(empty);
    showToast('Semua data berhasil dikosongkan.');
  }, [setResumeData, showToast]);

  const importData = useCallback((data) => {
    setResumeData(data);
    showToast('Data CV & Portofolio berhasil diimpor!');
  }, [setResumeData, showToast]);

  const value = {
    resumeData,
    setResumeData,
    saveStatus,
    undo,
    redo,
    canUndo,
    canRedo,
    activePage,
    setActivePage,
    activeEditorSection,
    setActiveEditorSection,
    toastMessage,
    showToast,
    clearToast,
    // Methods
    updatePersonalInfo,
    updateTheme,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    loadPreset,
    resetToEmpty,
    importData,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
