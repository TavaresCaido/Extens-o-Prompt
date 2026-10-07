import React from 'react';

export function IndicadorDeEstado({ liberada }) {
  const texto = liberada ? 'Atividade liberada' : 'Atividade bloqueada';
  const classeEstado = liberada ? 'estado-liberada' : 'estado-bloqueada';

  return (
    <div
      className={`indicador-estado ${classeEstado}`}
      role="status"
      aria-live="polite"
    >
      <span className="indicador-ponto" aria-hidden="true" />
      <span className="indicador-texto">{texto}</span>
    </div>
  );
}
