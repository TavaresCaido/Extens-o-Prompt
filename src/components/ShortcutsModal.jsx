export function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "→ / Espaço / PgDn", desc: "Avançar para o próximo slide" },
    { key: "← / Shift+Espaço / PgUp", desc: "Voltar para o slide anterior" },
    { key: "Home", desc: "Ir para o primeiro slide (Capa)" },
    { key: "End", desc: "Ir para o último slide (Encerramento)" },
    { key: "N", desc: "Ligar / Desligar notas do apresentador (P1 e P2)" },
    { key: "I", desc: "Abrir / Fechar índice geral dos 20 slides" },
    { key: "F", desc: "Alternar modo tela cheia (Fullscreen)" },
    { key: "Esc", desc: "Fechar modais abertos" }
  ];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Atalhos de Teclado"
    >
      <div className="modal-content shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">⌨️ Atalhos de Teclado</h2>
            <p className="modal-subtitle">Controle total da apresentação na ponta dos dedos</p>
          </div>
          <button
            type="button"
            className="btn-icon-close"
            onClick={onClose}
            aria-label="Fechar atalhos"
          >
            ✕
          </button>
        </div>

        <div className="shortcuts-table-container">
          <table className="shortcuts-table">
            <thead>
              <tr>
                <th>Tecla / Combinação</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <kbd className="kbd-badge">{item.key}</kbd>
                  </td>
                  <td>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <span className="modal-tip">Os atalhos funcionam na área de Apresentação.</span>
        </div>
      </div>
    </div>
  );
}
