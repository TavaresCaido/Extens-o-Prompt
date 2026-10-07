import React from 'react';

export function IndicadorDeConexao({ conectado, segundosSemResposta = 0 }) {
  let texto = 'Servidor: conectado';
  let classe = 'conexao-ok';

  if (!conectado) {
    if (segundosSemResposta > 0) {
      texto = `Servidor: sem resposta ha ${segundosSemResposta} s`;
    } else {
      texto = 'Sem conexao com o servidor. Tentando novamente';
    }
    classe = 'conexao-erro';
  }

  return (
    <div
      className={`indicador-conexao ${classe}`}
      role="status"
      aria-live="polite"
    >
      <span className="conexao-ponto" aria-hidden="true" />
      <span className="conexao-texto">{texto}</span>
    </div>
  );
}
