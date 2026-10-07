import { useLocalStorage } from '../hooks/useLocalStorage';

const CHECKLIST_ITEMS = [
  { id: 'papel', label: 'Defini quem a IA deve ser (papel)?' },
  { id: 'objetivo', label: 'Deixei claro o que eu quero (objetivo)?' },
  { id: 'publico', label: 'Disse para quem é a resposta (público / contexto)?' },
  { id: 'entrada', label: 'Informei com base em quê (contexto + matéria-prima de entrada)?' },
  { id: 'regras', label: 'Listei as regras inegociáveis (tom, tamanho, restrições)?' },
  { id: 'formato', label: 'Especifiquei o formato de saída?' },
  { id: 'sintaxe', label: 'Revisei as vírgulas e aspas do JSON?' },
  { id: 'vago', label: 'Evitei campos vagos como "fazer algo" ou "texto legal"?' }
];

export function Checklist() {
  const [checkedItems, setCheckedItems] = useLocalStorage('workshop_checklist_state', {});

  const toggleItem = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = CHECKLIST_ITEMS.filter(item => checkedItems[item.id]).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const isAllDone = completedCount === totalCount;

  const handleReset = () => {
    setCheckedItems({});
  };

  const handleSelectAll = () => {
    const all = {};
    CHECKLIST_ITEMS.forEach(item => {
      all[item.id] = true;
    });
    setCheckedItems(all);
  };

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <div>
          <h2 className="checklist-title">Checklist de Validação de Prompt</h2>
          <p className="checklist-subtitle">
            Passe por estas 8 perguntas antes de apertar Enter em qualquer IA. Suas respostas ficam salvas no navegador:
          </p>
        </div>
        <div className="checklist-actions-top">
          <button
            type="button"
            className="btn-pill-subtle"
            onClick={handleSelectAll}
            title="Marcar todos os itens"
          >
            ✓ Marcar todos
          </button>
          <button
            type="button"
            className="btn-pill-subtle"
            onClick={handleReset}
            title="Desmarcar todos os itens"
          >
            Desmarcar todos
          </button>
        </div>
      </div>

      <div className="checklist-progress-card">
        <div className="progress-info-row">
          <span className="progress-label">Progresso do Checklist:</span>
          <span className="progress-score">
            <strong>{completedCount}</strong> / {totalCount} ({percent}%)
          </span>
        </div>
        <div className="progress-bar-container" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
          <div
            className={`progress-bar-fill ${isAllDone ? 'fill-completed' : ''}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {isAllDone && (
        <div className="checklist-celebration-banner fade-in" role="status">
          <span className="celebration-icon">🎉</span>
          <div>
            <h3 className="celebration-title">Tudo pronto!</h3>
            <p className="celebration-text">
              Seu prompt está 100% blindado contra respostas genéricas. Pode colar na IA com confiança!
            </p>
          </div>
        </div>
      )}

      <div className="checklist-items-list" role="group" aria-label="Itens do checklist">
        {CHECKLIST_ITEMS.map((item, index) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <label
              key={item.id}
              className={`checklist-item-card ${isChecked ? 'checked' : ''}`}
              htmlFor={`chk-${item.id}`}
            >
              <input
                id={`chk-${item.id}`}
                type="checkbox"
                className="checklist-checkbox"
                checked={isChecked}
                onChange={() => toggleItem(item.id)}
              />
              <span className="checkbox-custom-indicator">
                {isChecked ? '✓' : ''}
              </span>
              <div className="checklist-item-label-group">
                <span className="checklist-item-number">#{index + 1}</span>
                <span className="checklist-item-text">{item.label}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
