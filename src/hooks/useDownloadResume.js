import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { exportService } from '../services/exportService';

export function useDownloadResume() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { isLoggedIn, isPro, openAuthModal, openUpgradeModal } = useAuth();
  const { resumeData, showToast } = useResume();

  const downloadResume = useCallback(async () => {
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }
    if (!isPro) {
      openUpgradeModal();
      return;
    }

    setIsDownloading(true);
    try {
      await exportService.downloadPdf(resumeData);
      showToast('CV berhasil diunduh dalam format PDF.');
    } catch (error) {
      console.error('Gagal mengekspor CV ke PDF:', error);
      showToast(error.message || 'Gagal mengunduh CV PDF.', 'error');
    } finally {
      setIsDownloading(false);
    }
  }, [
    isLoggedIn,
    isPro,
    openAuthModal,
    openUpgradeModal,
    resumeData,
    showToast,
  ]);

  return { downloadResume, isDownloading };
}
