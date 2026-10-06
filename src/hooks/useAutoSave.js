import { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { cvApi } from '../services/apiService';

/**
 * Hook untuk auto-save langsung ke database MySQL dengan debouncing dan indikator status
 */
export function useAutoSave(data, userId = null, delayMs = 700) {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const isFirstRender = useRef(true);
  const currentUserIdRef = useRef(userId);

  // Jika user ID berubah (misal user baru login/logout), tandai sebagai first render untuk user tersebut
  useEffect(() => {
    if (currentUserIdRef.current !== userId) {
      currentUserIdRef.current = userId;
      isFirstRender.current = true;
    }
  }, [userId]);

  useEffect(() => {
    // Lewati save pada render awal pemuatan data
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        if (userId) {
          // 1. Simpan langsung ke database MySQL
          await cvApi.saveUserActiveCv(userId, data);
          // 2. Cache cadangan lokal per-user
          storageService.saveUserResumeData(userId, data);
        } else {
          // Pengunjung tanpa login
          storageService.saveResumeData(data);
        }
        setSaveStatus('saved');
      } catch (err) {
        console.error('AutoSave database error:', err);
        setSaveStatus('error');
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [data, userId, delayMs]);

  return saveStatus;
}
