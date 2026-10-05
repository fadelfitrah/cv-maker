import { useState, useCallback } from 'react';
import { exportService } from '../services/exportService';

export function usePrintResume(candidateName) {
  const [isPrinting, setIsPrinting] = useState(false);

  const printResume = useCallback(() => {
    setIsPrinting(true);
    exportService.printCV(candidateName);
    setTimeout(() => {
      setIsPrinting(false);
    }, 1000);
  }, [candidateName]);

  return { printResume, isPrinting };
}
