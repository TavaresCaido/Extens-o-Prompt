import { useState, useCallback } from 'react';
import { SLIDES } from '../data/slides';
import { Slide } from './Slide';
import { ProgressBar } from './ProgressBar';
import { PresenterNotes } from './PresenterNotes';
import { SlideIndex } from './SlideIndex';
import { ShortcutsModal } from './ShortcutsModal';
import { useKeyboard } from '../hooks/useKeyboard';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Presentation({ onGoToActivity }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useLocalStorage('workshop_slide_index', 0);
  const [showNotes, setShowNotes] = useLocalStorage('workshop_show_notes', false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Bounds check in case slides length changed
  const safeIndex = Math.min(Math.max(0, currentSlideIndex), SLIDES.length - 1);
  const currentSlide = SLIDES[safeIndex] || SLIDES[0];

  const handleNext = useCallback(() => {
    setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDES.length - 1));
  }, [setCurrentSlideIndex]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
  }, [setCurrentSlideIndex]);

  const handleFirst = useCallback(() => {
    setCurrentSlideIndex(0);
  }, [setCurrentSlideIndex]);

  const handleLast = useCallback(() => {
    setCurrentSlideIndex(SLIDES.length - 1);
  }, [setCurrentSlideIndex]);

  const handleToggleNotes = useCallback(() => {
    setShowNotes(prev => !prev);
  }, [setShowNotes]);

  const handleToggleIndex = useCallback(() => {
    setIsIndexOpen(prev => !prev);
  }, []);

  const handleCloseIndex = useCallback(() => {
    setIsIndexOpen(false);
    setIsShortcutsOpen(false);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Keyboard navigation
  useKeyboard({
    onNext: handleNext,
    onPrev: handlePrev,
    onFirst: handleFirst,
    onLast: handleLast,
    onToggleNotes: handleToggleNotes,
    onToggleIndex: handleToggleIndex,
    onCloseIndex: handleCloseIndex,
    onToggleFullscreen: handleToggleFullscreen,
    enabled: true
  });

  return (
    <div className="presentation-view">
      <ProgressBar current={safeIndex} total={SLIDES.length} />

      <main className="presentation-viewport">
        <Slide
          slide={currentSlide}
          onGoToActivity={onGoToActivity}
        />
      </main>

      <PresenterNotes
        notes={currentSlide.notes || currentSlide.notas}
        tempo={currentSlide.tempo}
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
      />

      <footer className="presentation-controls">
        <div className="controls-left">
          <button
            type="button"
            className="btn-control"
            onClick={handlePrev}
            disabled={safeIndex === 0}
            aria-label="Slide anterior (Seta para a esquerda)"
            title="Slide anterior (←)"
          >
            ← Anterior
          </button>

          <button
            type="button"
            className="btn-control"
            onClick={handleNext}
            disabled={safeIndex === SLIDES.length - 1}
            aria-label="Próximo slide (Seta para a direita ou espaço)"
            title="Próximo slide (→ ou Espaço)"
          >
            Próximo →
          </button>

          <span className="slide-counter-badge" aria-live="polite">
            <strong>{safeIndex + 1}</strong> / {SLIDES.length}
          </span>
        </div>

        <div className="controls-center">
          <span className="current-slide-tag-label">{currentSlide.tag}</span>
        </div>

        <div className="controls-right">
          <button
            type="button"
            className={`btn-control-toggle ${showNotes ? 'active' : ''}`}
            onClick={handleToggleNotes}
            title="Alternar notas do apresentador (Tecla N)"
            aria-pressed={showNotes}
          >
            🎙️ Notas {showNotes ? '(Ativas)' : ''}
          </button>

          <button
            type="button"
            className="btn-control-toggle"
            onClick={handleToggleIndex}
            title="Abrir índice de slides (Tecla I)"
          >
            📑 Índice
          </button>

          <button
            type="button"
            className="btn-control-toggle btn-icon-only"
            onClick={handleToggleFullscreen}
            title="Tela cheia (Tecla F)"
            aria-label="Tela cheia"
          >
            ⛶
          </button>

          <button
            type="button"
            className="btn-control-toggle btn-icon-only"
            onClick={() => setIsShortcutsOpen(true)}
            title="Atalhos do teclado"
            aria-label="Atalhos do teclado"
          >
            ⌨️
          </button>

          {safeIndex === SLIDES.length - 1 && (
            <button
              type="button"
              className="btn-primary-action btn-sm"
              onClick={onGoToActivity}
            >
              Ir para a atividade →
            </button>
          )}
        </div>
      </footer>

      <SlideIndex
        slides={SLIDES}
        currentIndex={safeIndex}
        onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
