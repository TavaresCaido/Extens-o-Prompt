// ALTERADO
import React from 'react';

export function Cabecalho({ tema, aoAlternarTema, rotaAtual }) {
  return (
    <>
      <a href="#conteudo-principal" className="pular-conteudo">
        Pular para o conteúdo
      </a>

      <header className="cabecalho" role="banner">
        <div className="cabecalho-container">
          <div className="cabecalho-marca">
            <a href="#/" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span className="cabecalho-titulo">Pedido em Modelo Organizado</span>
              <span className="cabecalho-separador">|</span>
              <span className="cabecalho-subtitulo">Workshop</span>
            </a>
          </div>

          <div className="cabecalho-acoes" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="botao botao-secundario botao-sm"
              onClick={aoAlternarTema}
              aria-label={`Alternar para tema ${tema === 'escuro' ? 'claro' : 'escuro'}`}
            >
              {tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
