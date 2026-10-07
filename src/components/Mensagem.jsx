import React from 'react';

export function Mensagem({ tipo = 'info', children, classeExtra = '' }) {
  if (!children) return null;

  const role = tipo === 'erro' ? 'alert' : 'status';
  const classeTipo = `mensagem-${tipo}`;

  return (
    <div className={`mensagem ${classeTipo} ${classeExtra}`} role={role}>
      {children}
    </div>
  );
}
