import { useEffect, useRef } from 'react';

/**
 * SlideIndex drawer/modal allowing quick jump between all slides
 */
export function SlideIndex({ slides, currentIndex, onSelectSlide, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Índice de Slides"
    >
      <div
        className="modal-content index-modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Índice da Apresentação</h2>
            <p className="modal-subtitle">20 slides · 35 a 45 minutos no total</p>
          </div>
          <button
            type="button"
            className="btn-icon-close"
            onClick={onClose}
            aria-label="Fechar índice"
          >
            ✕
          </button>
        </div>

        <div className="slide-index-grid">
          {slides.map((s, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={s.id}
                type="button"
                className={`slide-index-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectSlide(index);
                  onClose();
                }}
              >
                <div className="slide-index-top">
                  <span className="slide-index-num">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="slide-index-tag">{s.tag}</span>
                  <span className="slide-index-time">{s.tempo}</span>
                </div>
                <div className="slide-index-title">{s.titulo}</div>
              </button>
            );
          })}
        </div>

        <div className="modal-footer">
          <span className="modal-tip">Dica: Pressione <code>Esc</code> para fechar ou <code>I</code> para alternar</span>
        </div>
      </div>
    </div>
  );
}
