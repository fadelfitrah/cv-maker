import { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';

/**
 * Hook untuk auto-save dengan debouncing dan indikator status
 */
export function useAutoSave(data, delayMs = 600) {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Lewati save pada render awal
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const success = storageService.saveResumeData(data);
        setSaveStatus(success ? 'saved' : 'error');
      } catch (err) {
        console.error('AutoSave error:', err);
        setSaveStatus('error');
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [data, delayMs]);

  return saveStatus;
}
