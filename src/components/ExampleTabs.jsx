import { useState } from 'react';
import { EXAMPLES } from '../data/examples';
import { CodeBlock } from './CodeBlock';

export function ExampleTabs({ onLoadExample }) {
  const [selectedId, setSelectedId] = useState(EXAMPLES[0].id);

  const currentExample = EXAMPLES.find(e => e.id === selectedId) || EXAMPLES[0];

  const jsonFormatted = JSON.stringify(currentExample.dados, null, 2);

  return (
    <div className="example-tabs-container">
      <div className="example-tabs-header">
        <h2 className="example-tabs-title">Exemplos Prontos por Área de Negócio</h2>
        <p className="example-tabs-subtitle">
          Templates validados e prontos para uso. Você pode copiar diretamente ou carregá-los no Construtor para editar:
        </p>
      </div>

      <div className="area-tab-nav" role="tablist" aria-label="Áreas de exemplos">
        {EXAMPLES.map(ex => {
          const isActive = ex.id === selectedId;
          return (
            <button
              key={ex.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${ex.id}`}
              id={`tab-${ex.id}`}
              type="button"
              className={`area-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedId(ex.id)}
            >
              <span className="tab-icon">{ex.icone}</span>
              <span className="tab-name">{ex.area}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${currentExample.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentExample.id}`}
        className="example-content-panel"
      >
        <div className="example-details-card">
          <div className="example-meta-row">
            <span className="example-badge">{currentExample.badge}</span>
            <span className="example-area-tag">{currentExample.area}</span>
          </div>

          <h3 className="example-title">{currentExample.titulo}</h3>

          <div className="example-why-box">
            <strong className="why-label">💡 Por que esta estrutura funciona:</strong>
            <p className="why-text">{currentExample.why}</p>
          </div>

          <div className="example-action-bar">
            <button
              type="button"
              className="btn-primary-action btn-sm"
              onClick={() => onLoadExample(currentExample.dados)}
              title="Carrega este modelo no Construtor para você personalizar"
            >
              ⚡ Carregar este modelo no Construtor
            </button>
          </div>
        </div>

        <div className="example-code-pane">
          <CodeBlock
            code={jsonFormatted}
            language="json"
            title={`Prompt JSON · ${currentExample.area}`}
            maxHeight="420px"
          />
        </div>
      </div>
    </div>
  );
}
