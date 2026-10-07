import React from 'react';

export function Campo({
  rotulo,
  id,
  tipo = 'text',
  linhas = 3,
  valor = '',
  aoMudar,
  ajuda,
  erro,
  obrigatorio = false,
  placeholder = ''
}) {
  const idAjuda = ajuda ? `${id}-ajuda` : undefined;
  const idErro = erro ? `${id}-erro` : undefined;
  const idsDescricao = [idAjuda, idErro].filter(Boolean).join(' ') || undefined;

  const isArea = tipo === 'textarea';

  return (
    <div className="campo-grupo">
      <div className="campo-topo">
        <label htmlFor={id} className="campo-rotulo">
          {rotulo}
          {obrigatorio && <span className="campo-obrigatorio"> *</span>}
        </label>
        {ajuda && (
          <span id={idAjuda} className="campo-ajuda">
            {ajuda}
          </span>
        )}
      </div>

      {isArea ? (
        <textarea
          id={id}
          className={`campo-controle campo-area ${erro ? 'campo-com-erro' : ''}`}
          rows={linhas}
          value={valor}
          onChange={aoMudar}
          placeholder={placeholder}
          aria-describedby={idsDescricao}
          aria-invalid={erro ? 'true' : 'false'}
          required={obrigatorio}
        />
      ) : (
        <input
          id={id}
          type={tipo}
          className={`campo-controle ${erro ? 'campo-com-erro' : ''}`}
          value={valor}
          onChange={aoMudar}
          placeholder={placeholder}
          aria-describedby={idsDescricao}
          aria-invalid={erro ? 'true' : 'false'}
          required={obrigatorio}
        />
      )}

      {erro && (
        <span id={idErro} className="mensagem-erro" role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}
