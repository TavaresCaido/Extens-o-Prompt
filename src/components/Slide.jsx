import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

export function Slide({ slide, onGoToActivity }) {
  const [quizAnswersRevealed, setQuizAnswersRevealed] = useState({});

  const toggleQuizAnswer = (idx) => {
    setQuizAnswersRevealed(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const renderContent = () => {
    switch (slide.id) {
      case 'capa':
        return (
          <div className="slide-capa-layout">
            <div className="capa-badge">🚀 WORKSHOP INTERATIVO</div>
            <h1 className="capa-title">{slide.titulo}</h1>
            <p className="capa-subtitle">{slide.subtitulo}</p>

            <div className="capa-highlight-box">
              <span className="sparkle-icon">✨</span>
              <p>{slide.conteudo.promessa}</p>
            </div>


            <div className="capa-footer-note">
              <span>{slide.conteudo.destaque}</span>
              <span className="dot-divider">•</span>
              <span>Use as teclas <code>←</code> e <code>→</code> para navegar</span>
            </div>
          </div>
        );

      case 'quebra-gelo':
        return (
          <div className="slide-quebra-gelo">
            <div className="scenarios-grid">
              {slide.conteudo.cenarios.map((c, i) => (
                <div key={i} className="scenario-card">
                  <div className="scenario-icon">{c.icone}</div>
                  <h3 className="scenario-title">{c.titulo}</h3>
                  <p className="scenario-desc">{c.descricao}</p>
                </div>
              ))}
            </div>
            <div className="moral-banner">
              <span className="moral-icon">💡</span>
              <strong>Conclusão: </strong>
              <span>{slide.conteudo.moral}</span>
            </div>
          </div>
        );

      case 'agenda':
        return (
          <div className="slide-agenda">
            <div className="agenda-timeline">
              {slide.conteudo.blocos.map((bloco, i) => (
                <div key={i} className="agenda-item-card">
                  <div className="agenda-number-badge">{bloco.numero}</div>
                  <div className="agenda-item-content">
                    <div className="agenda-item-header">
                      <h3 className="agenda-item-title">{bloco.nome}</h3>
                      <span className="agenda-item-time">{bloco.tempo}</span>
                    </div>
                    <p className="agenda-item-desc">{bloco.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="agenda-tip-box">
              <span>{slide.conteudo.dica}</span>
            </div>
          </div>
        );

      case 'div-1':
      case 'div-2':
      case 'div-3':
        return (
          <div className="slide-divisor-layout">
            <div className="divisor-tag-badge">{slide.tag}</div>
            <h1 className="divisor-title">{slide.titulo}</h1>
            <p className="divisor-subtitle">{slide.subtitulo}</p>
            <div className="divisor-quote-card">
              <p className="divisor-quote-text">{slide.conteudo.frase}</p>
            </div>
          </div>
        );

      case 'o-que-e':
        return (
          <div className="slide-o-que-e">
            <div className="columns-compare">
              {slide.conteudo.comparacao.map((col, i) => (
                <div key={i} className={`compare-card ${col.tipo}`}>
                  <h3 className="compare-card-title">{col.titulo}</h3>
                  <ul className="compare-list">
                    {col.itens.map((item, j) => (
                      <li key={j}>
                        <span className="check-bullet">{col.tipo === 'positivo' ? '✓' : '⚠️'}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="highlight-callout">
              <p>{slide.conteudo.conclusao}</p>
            </div>
          </div>
        );

      case 'fluxo':
        return (
          <div className="slide-fluxo">
            <div className="steps-flow-container">
              {slide.conteudo.etapas.map((etapa, i) => (
                <div key={i} className="step-flow-item">
                  <div className="step-flow-badge">{etapa.destaque}</div>
                  <div className="step-circle">{etapa.passo}</div>
                  <h3 className="step-title">{etapa.nome}</h3>
                  <p className="step-desc">{etapa.desc}</p>
                  {i < slide.conteudo.etapas.length - 1 && (
                    <div className="step-arrow-connector">➔</div>
                  )}
                </div>
              ))}
            </div>
            <div className="fluxo-key-card">
              <strong>🔑 Por que isso importa: </strong>
              <span>{slide.conteudo.chave}</span>
            </div>
          </div>
        );

      case 'o-que-muda':
        return (
          <div className="slide-o-que-muda">
            <div className="table-responsive-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Dimensão</th>
                    <th className="th-sem">❌ Sem Estrutura (Texto Solto)</th>
                    <th className="th-com">✅ Com Estrutura (JSON)</th>
                  </tr>
                </thead>
                <tbody>
                  {slide.conteudo.tabela.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.aspecto}</strong></td>
                      <td className="td-sem">{row.sem}</td>
                      <td className="td-com">{row.com}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'comparativo':
        return (
          <div className="slide-comparativo">
            <div className="split-compare-grid">
              <div className="compare-pane pane-bad">
                <h3 className="pane-title">{slide.conteudo.ladoA.titulo}</h3>
                <div className="bubble-text">
                  "{slide.conteudo.ladoA.texto}"
                </div>
                <div className="pane-consequence">
                  <strong>O que acontece: </strong>
                  <span>{slide.conteudo.ladoA.resultado}</span>
                </div>
              </div>

              <div className="compare-pane pane-good">
                <h3 className="pane-title">{slide.conteudo.ladoB.titulo}</h3>
                <CodeBlock
                  code={slide.conteudo.ladoB.codigo}
                  language="json"
                  title="Prompt Estruturado em JSON"
                  maxHeight="280px"
                />
              </div>
            </div>
          </div>
        );

      case 'modelo-6':
        return (
          <div className="slide-modelo-6">
            <div className="model-grid-6">
              {slide.conteudo.campos.map((campo, i) => (
                <div key={i} className={`model-card ${campo.obrigatorio ? 'required' : 'optional'}`}>
                  <div className="model-card-header">
                    <code className="model-field-key">"{campo.chave}"</code>
                    <span className={`status-badge ${campo.obrigatorio ? 'req' : 'opt'}`}>
                      {campo.obrigatorio ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                  <h4 className="model-field-label">{campo.rotulo}</h4>
                  <p className="model-field-desc">{campo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'antes-depois':
        return (
          <div className="slide-antes-depois">
            <div className="refine-steps-grid">
              {slide.conteudo.passos.map((p, i) => (
                <div key={i} className="refine-step-card">
                  <span className="refine-step-num">{p.num}</span>
                  <h3 className="refine-step-title">{p.nome}</h3>
                  <div className="refine-step-question">
                    <strong>Pergunta-guia:</strong>
                    <p>{p.pergunta}</p>
                  </div>
                  <div className="refine-step-action">
                    <strong>Ação prática:</strong>
                    <p>{p.acao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'adaptacao':
        return (
          <div className="slide-adaptacao">
            <div className="use-cases-grid">
              {slide.conteudo.exemplosCasos.map((c, i) => (
                <div key={i} className="use-case-card">
                  <div className="use-case-type-badge">{c.tipo}</div>
                  <h3 className="use-case-title">{c.caso}</h3>
                  <div className="use-case-snippet">
                    <code>{c.campoChave}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'saida-json':
        return (
          <div className="slide-saida-json">
            <p className="lead-text">{slide.conteudo.explicacao}</p>
            <CodeBlock
              code={slide.conteudo.codigoExemplo}
              language="json"
              title="Exemplo: Pedindo Resposta em JSON Estrito"
              maxHeight="240px"
            />
            <div className="benefit-badge">
              <span>🚀 <strong>Benefício imediato: </strong>{slide.conteudo.beneficio}</span>
            </div>
          </div>
        );

      case 'exemplos-area':
        return (
          <div className="slide-exemplos-area">
            <div className="areas-grid-6">
              {slide.conteudo.cards.map((c, i) => (
                <div key={i} className="area-card-preview">
                  <div className="area-badge">{c.badge}</div>
                  <h3 className="area-name">{c.area}</h3>
                  <p className="area-case">{c.caso}</p>
                </div>
              ))}
            </div>
            <div className="area-cta-bar">
              <span>{slide.conteudo.notaRodape}</span>
              <button
                type="button"
                className="btn-link-action"
                onClick={onGoToActivity}
              >
                Ver modelos completos na aba Atividade →
              </button>
            </div>
          </div>
        );

      case 'erros':
        return (
          <div className="slide-erros">
            <div className="traps-list">
              {slide.conteudo.armadilhas.map((a, i) => (
                <div key={i} className="trap-item">
                  <div className="trap-num">{a.num}</div>
                  <div className="trap-body">
                    <h3 className="trap-title">{a.titulo}</h3>
                    <p className="trap-desc">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'atividade':
        return (
          <div className="slide-atividade">
            <div className="lab-intro-box">
              <span className="lab-timer-badge">⏱️ {slide.conteudo.tempoSugerido}</span>
              <p className="lab-lead">Tudo pronto para você criar o seu prompt agora:</p>
            </div>
            <div className="lab-steps-list">
              {slide.conteudo.roteiro.map((r, i) => (
                <div key={i} className="lab-step-row">
                  <span className="lab-step-tag">{r.passo}</span>
                  <span className="lab-step-text">{r.desc}</span>
                </div>
              ))}
            </div>
            <div className="lab-action-area">
              <button
                type="button"
                className="btn-primary-action btn-large pulse-glow"
                onClick={onGoToActivity}
              >
                Abrir o Construtor na Aba Atividade ➔
              </button>
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="slide-checklist">
            <div className="checklist-preview-list">
              {slide.conteudo.itensChecklist.map((item, i) => (
                <div key={i} className="checklist-preview-row">
                  <span className="check-box-icon">☑️</span>
                  <span className="checklist-preview-text">{item}</span>
                </div>
              ))}
            </div>
            <div className="checklist-footer-action">
              <span>{slide.conteudo.lembrete}</span>
              <button
                type="button"
                className="btn-outline-action"
                onClick={onGoToActivity}
              >
                Ir para o Checklist Interativo →
              </button>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="slide-quiz">
            <div className="quiz-questions-grid">
              {slide.conteudo.questoes.map((q, i) => {
                const isRevealed = !!quizAnswersRevealed[i];
                return (
                  <div key={i} className="quiz-card">
                    <h3 className="quiz-question">{q.pergunta}</h3>
                    <div className="quiz-action-area">
                      <button
                        type="button"
                        className="btn-quiz-reveal"
                        onClick={() => toggleQuizAnswer(i)}
                      >
                        {isRevealed ? 'Ocultar Resposta' : '👁️ Revelar Resposta'}
                      </button>
                      {isRevealed && (
                        <div className="quiz-answer-box fade-in">
                          <strong>Resposta: </strong>{q.resposta}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'proximos':
        return (
          <div className="slide-proximos">
            <div className="mission-grid">
              {slide.conteudo.missao.map((m, i) => (
                <div key={i} className="mission-card">
                  <div className="mission-badge">{m.foco}</div>
                  <p className="mission-text">{m.meta}</p>
                </div>
              ))}
            </div>
            <div className="proximos-closing-banner">
              <h2>{slide.conteudo.agradecimento}</h2>
              <p>Conduzido com entusiasmo por <strong>{slide.conteudo.dupla}</strong></p>
              <div className="closing-actions">
                <button
                  type="button"
                  className="btn-primary-action"
                  onClick={onGoToActivity}
                >
                  Ir para a Atividade & Laboratório ➔
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>{JSON.stringify(slide.conteudo)}</div>;
    }
  };

  return (
    <article className={`slide-container slide-type-${slide.tipo}`} aria-label={`Slide: ${slide.titulo}`}>
      {slide.tipo !== 'capa' && (
        <header className="slide-header">
          <div className="slide-header-meta">
            <span className="slide-tag">{slide.tag}</span>
          </div>
          <h2 className="slide-title">{slide.titulo}</h2>
          {slide.subtitulo && <p className="slide-subtitle">{slide.subtitulo}</p>}
        </header>
      )}

      <div className="slide-body">
        {renderContent()}
      </div>
    </article>
  );
}
