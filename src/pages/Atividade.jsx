// ALTERADO
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '../components/Card';
import { Campo } from '../components/Campo';
import { Botao } from '../components/Botao';
import { IndicadorDeConexao } from '../components/IndicadorDeConexao';
import { EXEMPLOS } from '../data/exemplos';
import { ITENS_CHECKLIST } from '../data/checklist';
import { consultarStatus, copiarTexto } from '../api';
import { Praticar } from '../components/Praticar';

const RASCUNHO_INICIAL = {
  papel: '',
  objetivo: '',
  contexto: '',
  entrada: '',
  regras: '',
  formato_saida: ''
};

export function Atividade({ aoNavegar }) {
  const [liberada, setLiberada] = useState(false);
  const [conectado, setConectado] = useState(true);
  const [segundosSemResposta, setSegundosSemResposta] = useState(0);

  const [abaAtiva, setAbaAtiva] = useState('construtor');

  const [form, setForm] = useState(() => {
    try {
      const salvo = localStorage.getItem('participante_prompt_rascunho');
      return salvo ? JSON.parse(salvo) : RASCUNHO_INICIAL;
    } catch (e) {
      return RASCUNHO_INICIAL;
    }
  });

  const [confirmandoLimpar, setConfirmandoLimpar] = useState(false);
  const [copiadoFeedback, setCopiadoFeedback] = useState(false);
  const [abaExemploId, setAbaExemploId] = useState(EXEMPLOS[0].id);

  const [checklistMarcados, setChecklistMarcados] = useState(() => {
    try {
      const salvo = localStorage.getItem('participante_checklist');
      return salvo ? JSON.parse(salvo) : {};
    } catch (e) {
      return {};
    }
  });

  const intervaloFalhaRef = useRef(3000);
  const ultimaRespostaMsRef = useRef(Date.now());

  useEffect(() => {
    try {
      localStorage.setItem('participante_prompt_rascunho', JSON.stringify(form));
    } catch (e) {}
  }, [form]);

  useEffect(() => {
    try {
      localStorage.setItem('participante_checklist', JSON.stringify(checklistMarcados));
    } catch (e) {}
  }, [checklistMarcados]);

  useEffect(() => {
    let cancelado = false;
    let timerId = null;

    const executarConsulta = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const dados = await consultarStatus(controller.signal);
        clearTimeout(timeoutId);

        if (cancelado) return;
        setLiberada(Boolean(dados.liberada));
        setConectado(true);
        setSegundosSemResposta(0);
        ultimaRespostaMsRef.current = Date.now();
        intervaloFalhaRef.current = 3000;
      } catch (err) {
        clearTimeout(timeoutId);
        if (cancelado) return;

        setConectado(false);
        const decorrido = Math.floor((Date.now() - ultimaRespostaMsRef.current) / 1000);
        setSegundosSemResposta(decorrido);

        if (intervaloFalhaRef.current === 3000) intervaloFalhaRef.current = 5000;
        else if (intervaloFalhaRef.current === 5000) intervaloFalhaRef.current = 8000;
        else intervaloFalhaRef.current = 10000;
      }

      if (!cancelado) {
        const variacaoTempo = Math.floor(Math.random() * 500);
        timerId = setTimeout(executarConsulta, intervaloFalhaRef.current + variacaoTempo);
      }
    };

    executarConsulta();

    return () => {
      cancelado = true;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleCampoMudar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const { jsonString, objetivoValido } = useMemo(() => {
    const obj = {};
    if (form.papel.trim()) obj.papel = form.papel.trim();
    if (form.objetivo.trim()) obj.objetivo = form.objetivo.trim();
    if (form.contexto.trim()) obj.contexto = form.contexto.trim();
    if (form.entrada.trim()) obj.entrada = form.entrada.trim();

    if (form.regras.trim()) {
      const listaRegras = form.regras
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
      if (listaRegras.length > 0) obj.regras = listaRegras;
    }

    if (form.formato_saida.trim()) obj.formato_saida = form.formato_saida.trim();

    return {
      jsonString: JSON.stringify(obj, null, 2),
      objetivoValido: Boolean(form.objetivo.trim())
    };
  }, [form]);

  const handleCopiarJson = async () => {
    if (!objetivoValido) return;
    const sucesso = await copiarTexto(jsonString);
    if (sucesso) {
      setCopiadoFeedback(true);
      setTimeout(() => setCopiadoFeedback(false), 2000);
    }
  };

  const handleBaixarJson = () => {
    if (!objetivoValido) return;
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'meu-pedido.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {}
  };

  const handleLimpar = () => {
    setForm(RASCUNHO_INICIAL);
    setConfirmandoLimpar(false);
  };

  const handleCarregarExemplo = (exemploCampos) => {
    setForm({
      papel: exemploCampos.papel || '',
      objetivo: exemploCampos.objetivo || '',
      contexto: exemploCampos.contexto || '',
      entrada: exemploCampos.entrada || '',
      regras: Array.isArray(exemploCampos.regras)
        ? exemploCampos.regras.join('\n')
        : (exemploCampos.regras || ''),
      formato_saida: exemploCampos.formato_saida || ''
    });
    setAbaAtiva('construtor');
  };

  const toggleChecklist = (indice) => {
    setChecklistMarcados((prev) => ({
      ...prev,
      [indice]: !prev[indice]
    }));
  };

  const totalChecklist = ITENS_CHECKLIST.length;
  const marcadosCount = ITENS_CHECKLIST.filter((_, i) => checklistMarcados[i]).length;

  const exemploAtual = EXEMPLOS.find((e) => e.id === abaExemploId) || EXEMPLOS[0];

  if (!liberada) {
    return (
      <main id="conteudo-principal" className="pagina-centro" aria-live="polite">
        <Card classeExtra="cartao-espera">
          <h1 className="titulo-md">Aguardando liberação</h1>
          <p className="texto-suave" style={{ margin: '16px 0' }}>
            A atividade ainda não foi liberada. Aguarde a liberação do computador do evento. Esta página atualiza sozinha.
          </p>

          <div style={{ marginTop: '24px' }}>
            <IndicadorDeConexao
              conectado={conectado}
              segundosSemResposta={segundosSemResposta}
            />
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main id="conteudo-principal" className="pagina-atividade" aria-live="polite">
      <div className="atividade-topo">
        <div>
          <h1 className="titulo-md">Laboratório de Pedidos em Modelo Organizado</h1>
          <p className="texto-suave">
            Monte, valide e teste o seu pedido.
          </p>
        </div>

        <IndicadorDeConexao
          conectado={conectado}
          segundosSemResposta={segundosSemResposta}
        />
      </div>

      <nav className="abas-navegacao" role="tablist" aria-label="Abas da atividade">
        <button
          type="button"
          role="tab"
          id="aba-construtor"
          aria-selected={abaAtiva === 'construtor'}
          aria-controls="painel-construtor"
          className={`aba-item ${abaAtiva === 'construtor' ? 'aba-item-ativo' : ''}`}
          onClick={() => setAbaAtiva('construtor')}
        >
          Construtor
        </button>

        <button
          type="button"
          role="tab"
          id="aba-praticar"
          aria-selected={abaAtiva === 'praticar'}
          aria-controls="painel-praticar"
          className={`aba-item ${abaAtiva === 'praticar' ? 'aba-item-ativo' : ''}`}
          onClick={() => setAbaAtiva('praticar')}
        >
          Praticar
        </button>

        <button
          type="button"
          role="tab"
          id="aba-exemplos"
          aria-selected={abaAtiva === 'exemplos'}
          aria-controls="painel-exemplos"
          className={`aba-item ${abaAtiva === 'exemplos' ? 'aba-item-ativo' : ''}`}
          onClick={() => setAbaAtiva('exemplos')}
        >
          Exemplos
        </button>

        <button
          type="button"
          role="tab"
          id="aba-checklist"
          aria-selected={abaAtiva === 'checklist'}
          aria-controls="painel-checklist"
          className={`aba-item ${abaAtiva === 'checklist' ? 'aba-item-ativo' : ''}`}
          onClick={() => setAbaAtiva('checklist')}
        >
          Checklist ({marcadosCount} de {totalChecklist})
        </button>
      </nav>

      {abaAtiva === 'construtor' && (
        <section
          id="painel-construtor"
          role="tabpanel"
          aria-labelledby="aba-construtor"
          className="grade-construtor"
        >
          <Card classeExtra="construtor-formulario">
            <h2 className="titulo-sm">Preencha os campos do pedido</h2>

            <Campo
              rotulo="1. Quem a IA deve ser"
              id="campo-papel"
              valor={form.papel}
              aoMudar={(e) => handleCampoMudar('papel', e.target.value)}
              ajuda="Quem a IA deve representar (cargo e experiência)"
              placeholder="Ex.: Analista financeiro sênior"
            />

            <Campo
              rotulo="2. O que você quer"
              id="campo-objetivo"
              valor={form.objetivo}
              aoMudar={(e) => handleCampoMudar('objetivo', e.target.value)}
              obrigatorio
              ajuda="Verbo de ação em uma frase direta"
              placeholder="Ex.: Explicar variação de despesas operacionais"
              erro={!objetivoValido ? 'Preencha o que você quer' : undefined}
            />

            <Campo
              rotulo="3. Informações de fundo"
              id="campo-contexto"
              tipo="textarea"
              linhas={2}
              valor={form.contexto}
              aoMudar={(e) => handleCampoMudar('contexto', e.target.value)}
              ajuda="Quem lê a resposta e qual é a situação"
              placeholder="Ex.: Apresentação para a diretoria"
            />

            <Campo
              rotulo="4. O dado que a IA vai usar"
              id="campo-entrada"
              tipo="textarea"
              linhas={3}
              valor={form.entrada}
              aoMudar={(e) => handleCampoMudar('entrada', e.target.value)}
              ajuda="Cole aqui o texto bruto ou dados"
              placeholder="Ex.: Despesas subiram 12% por conta do dólar"
            />

            <Campo
              rotulo="5. O que ela pode e não pode fazer (uma por linha)"
              id="campo-regras"
              tipo="textarea"
              linhas={3}
              valor={form.regras}
              aoMudar={(e) => handleCampoMudar('regras', e.target.value)}
              ajuda="Limites de tamanho, tom e o que evitar"
              placeholder="Ex.: Máximo 3 parágrafos&#10;Tom calmo e direto&#10;Sem termos difíceis"
            />

            <Campo
              rotulo="6. Como você quer a resposta"
              id="campo-formato"
              valor={form.formato_saida}
              aoMudar={(e) => handleCampoMudar('formato_saida', e.target.value)}
              ajuda="Tipo, tamanho e tom esperado"
              placeholder="Ex.: Tabela simples com colunas Causa e Ação"
            />

            <div className="formulario-acoes">
              {!confirmandoLimpar ? (
                <Botao
                  variante="secundario"
                  classeExtra="botao-sm"
                  aoClicar={() => setConfirmandoLimpar(true)}
                >
                  Limpar formulário
                </Botao>
              ) : (
                <div className="confirmacao-inline cartao">
                  <span className="texto-aviso">Deseja apagar os campos?</span>
                  <div className="confirmacao-acoes">
                    <Botao
                      variante="primario"
                      classeExtra="botao-sm"
                      aoClicar={handleLimpar}
                    >
                      Sim, limpar
                    </Botao>
                    <Botao
                      variante="secundario"
                      classeExtra="botao-sm"
                      aoClicar={() => setConfirmandoLimpar(false)}
                    >
                      Cancelar
                    </Botao>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card classeExtra="construtor-preview">
            <h2 className="titulo-sm">Preview do Modelo Organizado</h2>
            <p className="texto-suave">
              Atualizado automaticamente. Cole este texto na sua ferramenta de IA.
            </p>

            <pre className="bloco-codigo codigo-preview" aria-live="polite">
              {jsonString}
            </pre>

            <div className="preview-acoes">
              <Botao
                variante="primario"
                aoClicar={handleCopiarJson}
                desabilitado={!objetivoValido}
              >
                {copiadoFeedback ? 'Copiado para a área de transferência' : 'Copiar modelo'}
              </Botao>

              <Botao
                variante="secundario"
                aoClicar={handleBaixarJson}
                desabilitado={!objetivoValido}
              >
                Baixar arquivo .json
              </Botao>
            </div>
          </Card>
        </section>
      )}

      {abaAtiva === 'praticar' && (
        <section
          id="painel-praticar"
          role="tabpanel"
          aria-labelledby="aba-praticar"
        >
          <Praticar />
        </section>
      )}

      {abaAtiva === 'exemplos' && (
        <section
          id="painel-exemplos"
          role="tabpanel"
          aria-labelledby="aba-exemplos"
          className="secao-exemplos"
        >
          <div className="exemplos-menu" role="tablist" aria-label="Áreas de exemplo">
            {EXEMPLOS.map((ex) => (
              <button
                key={ex.id}
                type="button"
                role="tab"
                aria-selected={abaExemploId === ex.id}
                className={`botao botao-sm ${abaExemploId === ex.id ? 'botao-primario' : 'botao-secundario'}`}
                onClick={() => setAbaExemploId(ex.id)}
              >
                {ex.area}
              </button>
            ))}
          </div>

          <Card classeExtra="exemplo-detalhes">
            <div className="exemplo-cabecalho">
              <div>
                <span className="slide-apresentador">{exemploAtual.area}</span>
                <h2 className="titulo-sm">{exemploAtual.titulo}</h2>
              </div>
              <Botao
                variante="primario"
                classeExtra="botao-sm"
                aoClicar={() => handleCarregarExemplo(exemploAtual.campos)}
              >
                Usar no construtor
              </Botao>
            </div>

            <pre className="bloco-codigo" style={{ marginTop: '16px' }}>
              {JSON.stringify(exemploAtual.campos, null, 2)}
            </pre>
          </Card>
        </section>
      )}

      {abaAtiva === 'checklist' && (
        <section
          id="painel-checklist"
          role="tabpanel"
          aria-labelledby="aba-checklist"
          className="secao-checklist"
        >
          <Card>
            <div className="checklist-topo">
              <div>
                <h2 className="titulo-sm">Checklist de revisão</h2>
                <p className="texto-suave">
                  Progresso: {marcadosCount} de {totalChecklist} itens concluídos
                </p>
              </div>
              <Botao
                variante="secundario"
                classeExtra="botao-sm"
                aoClicar={() => setChecklistMarcados({})}
              >
                Reiniciar checklist
              </Botao>
            </div>

            <div
              className="barra-progresso"
              style={{ margin: '16px 0 24px' }}
              role="progressbar"
              aria-valuenow={Math.round((marcadosCount / totalChecklist) * 100)}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="barra-progresso-preenchimento"
                style={{
                  width: `${(marcadosCount / totalChecklist) * 100}%`
                }}
              />
            </div>

            <ul className="checklist-lista">
              {ITENS_CHECKLIST.map((item, idx) => {
                const marcado = Boolean(checklistMarcados[idx]);
                return (
                  <li key={idx} className="checklist-item">
                    <label className="checklist-rotulo">
                      <input
                        type="checkbox"
                        className="checklist-checkbox"
                        checked={marcado}
                        onChange={() => toggleChecklist(idx)}
                      />
                      <span className={marcado ? 'checklist-texto-marcado' : ''}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>
      )}
    </main>
  );
}
