// ALTERADO
export function PresenterNotes({ notes, tempo, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="presenter-notes-panel" role="region" aria-label="Notas de apoio">
      <div className="presenter-notes-header">
        <div className="presenter-notes-title-group">
          <h3 className="presenter-notes-title">Notas de apoio ao slide</h3>
          {tempo && <span className="badge-tempo">Tempo sugerido: {tempo} min</span>}
        </div>
        <button
          type="button"
          className="btn-icon-close"
          onClick={onClose}
          aria-label="Fechar notas"
          title="Fechar notas (tecla N)"
        >
          ✕
        </button>
      </div>

      <div className="presenter-notes-body" style={{ padding: '12px 16px' }}>
        <p className="speaker-speech" style={{ margin: 0 }}>
          {notes || 'Siga os pontos do slide e conduza a explicacao em dupla.'}
        </p>
      </div>
    </div>
  );
}
