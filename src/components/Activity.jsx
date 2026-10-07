import { useState } from 'react';
import { JsonBuilder } from './JsonBuilder';
import { ExampleTabs } from './ExampleTabs';
import { Checklist } from './Checklist';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Activity({ onBackToPresentation }) {
  const [activeTab, setActiveTab] = useLocalStorage('workshop_activity_tab', 'builder');
  const [formData, setFormData] = useLocalStorage('workshop_builder_form', {
    papel: '',
    objetivo: '',
    contexto: '',
    entrada: '',
    regras: '',
    formato_saida: ''
  });

  const handleLoadExample = (exampleData) => {
    setFormData({
      papel: exampleData.papel || '',
      objetivo: exampleData.objetivo || '',
      contexto: exampleData.contexto || '',
      entrada: exampleData.entrada || '',
      regras: Array.isArray(exampleData.regras) ? exampleData.regras.join('\n') : (exampleData.regras || ''),
      formato_saida: exampleData.formato_saida || ''
    });
    setActiveTab('builder');
  };

  return (
    <div className="activity-container">
      <div className="activity-nav-bar">
        <div className="activity-nav-left">
          <button
            type="button"
            className="btn-back-presentation"
            onClick={onBackToPresentation}
            title="Voltar para a apresentação de onde parou"
          >
            ← Voltar para a Apresentação
          </button>
        </div>

        <div className="activity-tab-group" role="tablist" aria-label="Abas da atividade">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'builder'}
            id="activity-tab-builder"
            className={`activity-tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            🛠️ Construtor
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'examples'}
            id="activity-tab-examples"
            className={`activity-tab-btn ${activeTab === 'examples' ? 'active' : ''}`}
            onClick={() => setActiveTab('examples')}
          >
            📚 Exemplos por Área
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'checklist'}
            id="activity-tab-checklist"
            className={`activity-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            ✅ Checklist de Validação
          </button>
        </div>
      </div>

      <main className="activity-content-body">
        {activeTab === 'builder' && (
          <div role="tabpanel" aria-labelledby="activity-tab-builder" className="tab-pane-fade">
            <JsonBuilder formData={formData} setFormData={setFormData} />
          </div>
        )}

        {activeTab === 'examples' && (
          <div role="tabpanel" aria-labelledby="activity-tab-examples" className="tab-pane-fade">
            <ExampleTabs onLoadExample={handleLoadExample} />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div role="tabpanel" aria-labelledby="activity-tab-checklist" className="tab-pane-fade">
            <Checklist />
          </div>
        )}
      </main>
    </div>
  );
}
