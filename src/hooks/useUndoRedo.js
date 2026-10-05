import { useState, useCallback, useEffect } from 'react';

/**
 * Hook untuk manajemen riwayat Undo dan Redo state
 */
export function useUndoRedo(initialState, maxHistory = 30) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex] || initialState;

  const set = useCallback(
    (newStateOrUpdater) => {
      setHistory((prevHistory) => {
        const nextState =
          typeof newStateOrUpdater === 'function'
            ? newStateOrUpdater(prevHistory[currentIndex])
            : newStateOrUpdater;

        // Potong history masa depan jika sedang di tengah riwayat
        const updatedHistory = prevHistory.slice(0, currentIndex + 1);

        // Batasi ukuran history
        if (updatedHistory.length >= maxHistory) {
          updatedHistory.shift();
        }

        return [...updatedHistory, nextState];
      });

      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxHistory - 1));
    },
    [currentIndex, maxHistory]
  );

  const undo = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(history.length - 1, prevIndex + 1));
  }, [history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Shortcut keyboard Ctrl+Z dan Ctrl+Y / Ctrl+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          if (canRedo) {
            e.preventDefault();
            redo();
          }
        } else {
          if (canUndo) {
            e.preventDefault();
            undo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (canRedo) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  return {
    state: currentState,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
