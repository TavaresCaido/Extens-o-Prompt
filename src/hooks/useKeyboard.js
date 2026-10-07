import { useEffect } from 'react';

/**
 * Custom hook to handle presentation keyboard shortcuts
 */
export function useKeyboard({
  onNext,
  onPrev,
  onFirst,
  onLast,
  onToggleNotes,
  onToggleIndex,
  onCloseIndex,
  onToggleFullscreen,
  enabled = true
}) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e) {
      // Ignore key events if focus is inside an input, textarea or editable element
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (isInput) {
        if (e.key === 'Escape' && onCloseIndex) {
          onCloseIndex();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          if (onNext) onNext();
          break;

        case ' ': // Spacebar
          e.preventDefault();
          if (e.shiftKey) {
            if (onPrev) onPrev();
          } else {
            if (onNext) onNext();
          }
          break;

        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          if (onPrev) onPrev();
          break;

        case 'Home':
          e.preventDefault();
          if (onFirst) onFirst();
          break;

        case 'End':
          e.preventDefault();
          if (onLast) onLast();
          break;

        case 'n':
        case 'N':
          e.preventDefault();
          if (onToggleNotes) onToggleNotes();
          break;

        case 'i':
        case 'I':
          e.preventDefault();
          if (onToggleIndex) onToggleIndex();
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          if (onToggleFullscreen) onToggleFullscreen();
          break;

        case 'Escape':
          e.preventDefault();
          if (onCloseIndex) onCloseIndex();
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    onNext,
    onPrev,
    onFirst,
    onLast,
    onToggleNotes,
    onToggleIndex,
    onCloseIndex,
    onToggleFullscreen
  ]);
}
