import React from 'react';

export function Botao({
  children,
  tipo = 'button',
  variante = 'primario',
  desabilitado = false,
  aoClicar,
  classeExtra = '',
  ...outros
}) {
  const classeVariante = variante === 'secundario' ? 'botao-secundario' : 'botao-primario';
  return (
    <button
      type={tipo}
      className={`botao ${classeVariante} ${classeExtra}`}
      disabled={desabilitado}
      onClick={aoClicar}
      {...outros}
    >
      {children}
    </button>
  );
}
