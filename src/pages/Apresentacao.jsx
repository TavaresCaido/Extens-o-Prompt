// ALTERADO
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SLIDES } from '../data/slides';
import { Botao } from '../components/Botao';
import {
  obterToken,
  consultarStatus
} from '../api';

export function Apresentacao({ aoNavegar }) {
  const token = obterToken();

  const [indiceAtual, setIndiceAtual] = useState(() => {
    try {
      const salvo = window.sessionStorage.getItem('slide_atual');
      const num = parseInt(salvo, 10);
      return !isNaN(num) && num >= 0 && num < SLIDES.length ? num : 0;
    } catch (e) {
      return 0;
    }
  });

  const [mostrarNotas, setMostrarNotas] = useState(false);
  const [painelIndiceAberto, setPainelIndiceAberto] = useState(false);
  const [controlesVisiveis, setControlesVisiveis] = useState(true);
  const [emTelaCheia, setEmTelaCheia] = useState(() => Boolean(document.fullscreenElement));
  const [segundosSlide, setSegundosSlide] = useState(0);
  const [segundosTotal, setSegundosTotal] = useState(0);
  const [atividadeLiberada, setAtividadeLiberada] = useState(false);

  const slide = SLIDES[indiceAtual];
  const totalSlides = SLIDES.length;
  const tempoPrevistoSegundos = (slide.minutos || 1) * 60;
  const passouDoTempo = segundosSlide > tempoPrevistoSegundos;

  useEffect(() => {
    if (!token) {
      aoNavegar('#/login-admin');
    }
  }, [token, aoNavegar]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('slide_atual', String(indiceAtual));
    } catch (e) {}
  }, [indiceAtual]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setEmTelaCheia(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    let cancelado = false;
    consultarStatus()
      .then((d) => {
        if (!cancelado) setAtividadeLiberada(Boolean(d.liberada));
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundosSlide((s) => s + 1);
      setSegundosTotal((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const irParaSlide = useCallback((novoIndice) => {
    if (novoIndice >= 0 && novoIndice < totalSlides) {
      setIndiceAtual(novoIndice);
      setSegundosSlide(0);
      setPainelIndiceAberto(false);
    }
  }, [totalSlides]);

  const proximo = useCallback(() => {
    irParaSlide(indiceAtual + 1);
  }, [indiceAtual, irParaSlide]);

  const anterior = useCallback(() => {
    irParaSlide(indiceAtual - 1);
  }, [indiceAtual, irParaSlide]);

  const reiniciarCronometroSlide = useCallback(() => {
    setSegundosSlide(0);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          proximo();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          anterior();
          break;
        case ' ':
          e.preventDefault();
          if (e.shiftKey) anterior();
          else proximo();
          break;
        case 'Home':
          e.preventDefault();
          irParaSlide(0);
          break;
        case 'End':
          e.preventDefault();
          irParaSlide(totalSlides - 1);
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setMostrarNotas((v) => !v);
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setPainelIndiceAberto((v) => !v);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleToggleFullscreen();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setControlesVisiveis((v) => !v);
          break;
        case 't':
        case 'T':
          e.preventDefault();
          reiniciarCronometroSlide();
          break;
        case 'Escape':
          e.preventDefault();
          setPainelIndiceAberto(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [proximo, anterior, irParaSlide, totalSlides, reiniciarCronometroSlide, handleToggleFullscreen]);

  const formatarTempo = (segundos) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const percentualProgresso = Math.round(((indiceAtual + 1) / totalSlides) * 100);
  const isSlideExercicio = slide.titulo.includes('Exercício');
  const mostrarRodape = controlesVisiveis && !emTelaCheia;

  return (
    <div className="apresentacao-container apresentacao-modo-limpo">
      <div
        className="barra-progresso"
        role="progressbar"
        aria-valuenow={percentualProgresso}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="barra-progresso-preenchimento"
          style={{ width: `${percentualProgresso}%` }}
        />
      </div>

      <main id="conteudo-principal" className="apresentacao-palco">
        <article className="slide-cartao">
          <header className="slide-cabecalho">
            <h1 className="slide-titulo">{slide.titulo}</h1>
          </header>

          <div className="slide-corpo">
            <ul className="slide-pontos">
              {slide.pontos.map((ponto, i) => (
                <li key={i} className="slide-ponto-item">
                  {ponto}
                </li>
              ))}
            </ul>

            {indiceAtual === 3 && (
              <div className="slide-comparativo-caixas">
                <div className="cartao comparativo-lado">
                  <h2 className="titulo-sm">Pedido solto</h2>
                  <p className="texto-suave">
                    Faça um e-mail cobrando o cliente que atrasou o pagamento.
                  </p>
                  <span className="texto-aviso">
                    Resultado: a IA adivinha tamanho, inventa o tom e gera enrolação.
                  </span>
                </div>
                <div className="cartao comparativo-lado">
                  <h2 className="titulo-sm">Pedido em modelo organizado</h2>
                  <pre className="bloco-codigo">
{`{
  "quem a IA deve ser": "Analista financeiro",
  "o que você quer": "Cobrar fatura em aberto",
  "o que ela pode fazer": ["máximo 3 linhas", "tom cordial"],
  "como quer a resposta": "texto direto"
}`}
                  </pre>
                </div>
              </div>
            )}

            {indiceAtual === 4 && (
              <pre className="bloco-codigo" style={{ marginTop: '20px' }}>
{`{
  "quem a IA deve ser": "Cargo e senioridade",
  "o que você quer": "Verbo de ação direta",
  "informações de fundo": "Cenário e público",
  "o dado que a IA vai usar": "Matéria-prima bruta",
  "o que ela pode fazer": ["Regra 1", "Regra 2"],
  "como quer a resposta": "Formato final"
}`}
              </pre>
            )}

            {isSlideExercicio && (
              <div className="slide-acao-exercicio" style={{ marginTop: '20px' }}>
                <div
                  className="cartao"
                  style={{
                    padding: '16px 20px',
                    background: 'var(--superficie-elevada)',
                    border: '1px solid var(--borda)',
                    borderRadius: 'var(--raio)'
                  }}
                >
                  <h3 className="titulo-sm" style={{ color: 'var(--destaque)', marginBottom: '10px' }}>
                    Como fazer o exercício no seu computador:
                  </h3>
                  <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Acesse a aba <strong>Praticar</strong> no menu superior do site.</li>
                    <li>Escolha um dos exercícios ou use o <strong>Construtor de Pedidos</strong>.</li>
                    <li>Preencha as 6 partes e teste a resposta na ferramenta de IA.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </article>

        {mostrarNotas && (
          <aside className="slide-painel-notas" role="region" aria-label="Notas de apoio">
            <h2 className="titulo-sm">Notas de apoio</h2>
            <p className="slide-notas-texto">{slide.notas}</p>
          </aside>
        )}
      </main>

      {painelIndiceAberto && (
        <div
          className="modal-backdrop"
          onClick={() => setPainelIndiceAberto(false)}
        >
          <aside
            className="painel-lateral-indice cartao"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Índice dos slides"
          >
            <div className="indice-topo">
              <h2 className="titulo-sm">Índice da apresentação</h2>
              <button
                type="button"
                className="botao botao-secundario botao-sm"
                onClick={() => setPainelIndiceAberto(false)}
              >
                Fechar
              </button>
            </div>
            <ol className="indice-lista">
              {SLIDES.map((s, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    className={`item-indice-btn ${idx === indiceAtual ? 'ativo' : ''}`}
                    onClick={() => irParaSlide(idx)}
                  >
                    <span className="indice-numero">{idx + 1}.</span>
                    <span className="indice-nome">{s.titulo}</span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}

      {mostrarRodape && (
        <footer className="apresentacao-rodape" role="contentinfo">
          <div className="rodape-esq">
            <Botao
              variante="secundario"
              aoClicar={anterior}
              desabilitado={indiceAtual === 0}
              aria-label="Slide anterior"
            >
              Anterior
            </Botao>
            <Botao
              variante="primario"
              aoClicar={proximo}
              desabilitado={indiceAtual === totalSlides - 1}
              aria-label="Próximo slide"
            >
              Próximo
            </Botao>
            <span className="contador-slides" aria-live="polite">
              {indiceAtual + 1} / {totalSlides}
            </span>
          </div>

          <div className={`rodape-cronometro ${passouDoTempo ? 'cronometro-alerta' : ''}`}>
            <span>Slide: {formatarTempo(segundosSlide)} / {formatarTempo(tempoPrevistoSegundos)}</span>
            <span className="cronometro-separador">|</span>
            <span>Total: {formatarTempo(segundosTotal)}</span>
          </div>

          <div className="rodape-dir">
            <button
              type="button"
              className="botao botao-secundario botao-sm"
              onClick={handleToggleFullscreen}
              title="Tela cheia (Tecla F ou F11)"
            >
              Tela Cheia (F)
            </button>

            <button
              type="button"
              className={`botao botao-secundario botao-sm ${mostrarNotas ? 'botao-ativo' : ''}`}
              onClick={() => setMostrarNotas((v) => !v)}
              title="Alternar notas (Tecla N)"
            >
              Notas (N)
            </button>

            <button
              type="button"
              className="botao botao-secundario botao-sm"
              onClick={() => setPainelIndiceAberto((v) => !v)}
              title="Índice de slides (Tecla I)"
            >
              Índice (I)
            </button>

            <button
              type="button"
              className="botao botao-secundario botao-sm"
              onClick={() => aoNavegar('#/admin')}
            >
              Painel do Organizador
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
