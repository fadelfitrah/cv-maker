import { SAMPLE_ENGINEER_DATA, SAMPLE_DESIGNER_DATA } from './sampleData';
import { INITIAL_RESUME_STATE } from '../types/resume';

const STORAGE_KEY = 'procv_resume_data_v1';
const TEMPLATE_PREF_KEY = 'procv_user_pref_v1';

/**
 * Service untuk mengelola persistence data CV di LocalStorage & Import/Export
 */
export const storageService = {
  /**
   * Mengambil data CV dari LocalStorage atau default sample jika belum ada
   */
  loadResumeData: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Pastikan struktur lengkap dengan fallback
        return {
          ...INITIAL_RESUME_STATE,
          ...parsed,
          personalInfo: { ...INITIAL_RESUME_STATE.personalInfo, ...(parsed.personalInfo || {}) },
          theme: { ...INITIAL_RESUME_STATE.theme, ...(parsed.theme || {}) },
          experiences: parsed.experiences || [],
          education: parsed.education || [],
          skills: parsed.skills || [],
          projects: parsed.projects || [],
          certifications: parsed.certifications || [],
          languages: parsed.languages || [],
          customSections: parsed.customSections || [],
        };
      }
    } catch (err) {
      console.error('Error loading resume data from localStorage:', err);
    }
    // Default pertama kali buka: gunakan data sampel Engineer agar langsung ada visualnya
    return SAMPLE_ENGINEER_DATA;
  },

  /**
   * Menyimpan data CV ke LocalStorage
   */
  saveResumeData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Error saving resume data to localStorage:', err);
      return false;
    }
  },

  /**
   * Menghapus semua data kembali ke template kosong
   */
  clearResumeData: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return INITIAL_RESUME_STATE;
    } catch (err) {
      console.error('Error clearing resume data:', err);
      return INITIAL_RESUME_STATE;
    }
  },

  /**
   * Memuat preset contoh (Engineer / Designer)
   */
  loadPreset: (type = 'engineer') => {
    const data = type === 'designer' ? SAMPLE_DESIGNER_DATA : SAMPLE_ENGINEER_DATA;
    storageService.saveResumeData(data);
    return data;
  },

  /**
   * Export data ke file JSON
   */
  exportToJSONFile: (data) => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      const filename = `CV_${(data.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_Backup.json`;
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return true;
    } catch (err) {
      console.error('Failed to export JSON:', err);
      return false;
    }
  },

  /**
   * Import data dari file JSON
   */
  importFromJSONFile: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed || typeof parsed !== 'object') {
            throw new Error('Format file tidak valid.');
          }
          const merged = {
            ...INITIAL_RESUME_STATE,
            ...parsed,
            personalInfo: { ...INITIAL_RESUME_STATE.personalInfo, ...(parsed.personalInfo || {}) },
            theme: { ...INITIAL_RESUME_STATE.theme, ...(parsed.theme || {}) },
          };
          storageService.saveResumeData(merged);
          resolve(merged);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsText(file);
    });
  }
};
