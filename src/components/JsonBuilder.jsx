// ALTERADO
import { useMemo } from 'react';
import { JsonPreview } from './JsonPreview';

const DEFAULT_SAMPLE = {
  papel: "Analista Financeiro Sênior",
  objetivo: "Explicar a variação de receita entre Agosto e Setembro",
  contexto: "Apresentação para a diretoria. A receita caiu 8% devido à perda de 1 cliente grande.",
  entrada: "Agosto: R$ 420.000. Setembro: R$ 386.400.",
  regras: "Máximo de 3 parágrafos objetivos\nDestacar o impacto da perda do cliente grande\nPropor 2 medidas práticas para o próximo mês",
  formato_saida: "Diagnóstico curto + 2 Ações recomendadas"
};

const EMPTY_FORM = {
  papel: "",
  objetivo: "",
  contexto: "",
  entrada: "",
  regras: "",
  formato_saida: ""
};

export function JsonBuilder({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFillSample = () => {
    setFormData(DEFAULT_SAMPLE);
  };

  const handleClear = () => {
    setFormData(EMPTY_FORM);
  };

  const { jsonObject, jsonString, isValid, missingFields } = useMemo(() => {
    const rulesArray = formData.regras
      ? formData.regras
          .split('\n')
          .map(r => r.trim())
          .filter(Boolean)
      : [];

    const obj = {};
    if (formData.papel?.trim()) obj.papel = formData.papel.trim();
    if (formData.objetivo?.trim()) obj.objetivo = formData.objetivo.trim();
    if (formData.contexto?.trim()) obj.contexto = formData.contexto.trim();
    if (formData.entrada?.trim()) obj.entrada = formData.entrada.trim();
    if (rulesArray.length > 0) obj.regras = rulesArray;
    if (formData.formato_saida?.trim()) obj.formato_saida = formData.formato_saida.trim();

    const missing = [];
    if (!formData.papel?.trim()) missing.push('"papel"');
    if (!formData.objetivo?.trim()) missing.push('"objetivo"');
    if (!formData.formato_saida?.trim()) missing.push('"formato_saida"');

    const valid = missing.length === 0;

    return {
      jsonObject: obj,
      jsonString: JSON.stringify(obj, null, 2),
      isValid: valid,
      missingFields: missing
    };
  }, [formData]);

  return (
    <div className="json-builder-layout">
      <div className="builder-form-pane">
        <div className="builder-header-bar">
          <div>
            <h2 className="builder-title">Construtor de Pedido em Modelo Organizado</h2>
            <p className="builder-subtitle">Preencha os campos abaixo para gerar um pedido direto e sem erros:</p>
          </div>
          <div className="builder-header-actions">
            <button
              type="button"
              className="btn-pill-action"
              onClick={handleFillSample}
              title="Preencher com exemplo completo"
            >
              Preencher Exemplo
            </button>
            <button
              type="button"
              className="btn-pill-subtle"
              onClick={handleClear}
              title="Limpar todos os campos"
            >
              Limpar
            </button>
          </div>
        </div>

        <form className="builder-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="field-papel" className="field-label">
                1. Quem a IA deve ser <span className="req-asterisk">*</span>
              </label>
              <span className="field-hint">Qual o cargo ou especialidade da IA?</span>
            </div>
            <input
              id="field-papel"
              name="papel"
              type="text"
              className="form-input"
              placeholder="Ex: Analista financeiro sênior, Redator, Advogado..."
              value={formData.papel || ''}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="field-objetivo" className="field-label">
                2. O que você quer <span className="req-asterisk">*</span>
              </label>
              <span className="field-hint">Qual a ação principal em uma frase?</span>
            </div>
            <input
              id="field-objetivo"
              name="objetivo"
              type="text"
              className="form-input"
              placeholder="Ex: Explicar variação de custos, Escrever e-mail curto..."
              value={formData.objetivo || ''}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="field-contexto" className="field-label">
                3. Informações de fundo <span className="opt-tag">(Opcional)</span>
              </label>
              <span className="field-hint">Quem lê a resposta e qual é a situação?</span>
            </div>
            <textarea
              id="field-contexto"
              name="contexto"
              rows={3}
              className="form-textarea"
              placeholder="Ex: Apresentação para a diretoria, cliente parceiro há 2 anos..."
              value={formData.contexto || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="field-entrada" className="field-label">
                4. O dado que a IA vai usar <span className="opt-tag">(Opcional)</span>
              </label>
              <span className="field-hint">Cole o texto bruto ou relatório a ser processado</span>
            </div>
            <textarea
              id="field-entrada"
              name="entrada"
              rows={3}
              className="form-textarea"
              placeholder="Ex: Cole os números, e-mail bruto ou relatório aqui..."
              value={formData.entrada || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="field-regras" className="field-label">
                5. O que ela pode e não pode fazer <span className="opt-tag">(Uma por linha)</span>
              </label>
              <span className="field-hint">Limites de tamanho, tom e o que evitar</span>
            </div>
            <textarea
              id="field-regras"
              name="regras"
              rows={4}
              className="form-textarea"
              placeholder="Digite cada regra em uma linha diferente. Ex:&#10;Máximo de 3 parágrafos&#10;Tom acolhedor e direto&#10;Não use termos difíceis"
              value={formData.regras || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="field-formato" className="field-label">
                6. Como você quer a resposta <span className="req-asterisk">*</span>
              </label>
              <span className="field-hint">Como a resposta deve vir organizada?</span>
            </div>
            <input
              id="field-formato"
              name="formato_saida"
              type="text"
              className="form-input"
              placeholder="Ex: Lista com 3 tópicos, Tabela simples, Texto direto..."
              value={formData.formato_saida || ''}
              onChange={handleChange}
              aria-required="true"
            />
          </div>
        </form>
      </div>

      <div className="builder-preview-pane">
        <JsonPreview
          jsonString={jsonString}
          isValid={isValid}
          missingFields={missingFields}
        />
      </div>
    </div>
  );
}
