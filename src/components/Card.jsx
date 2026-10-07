import React from 'react';

export function Card({ children, classeExtra = '', ...outros }) {
  return (
    <div className={`cartao ${classeExtra}`} {...outros}>
      {children}
    </div>
  );
}
