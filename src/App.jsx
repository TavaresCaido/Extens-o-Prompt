// ALTERADO
import React, { useState, useEffect } from 'react';
import { Cabecalho } from './components/Cabecalho';
import { Router } from './router';

export function App() {
  const [tema, setTema] = useState(() => {
    try {
      const salvo = localStorage.getItem('workshop_tema');
      return salvo === 'escuro' ? 'escuro' : 'claro';
    } catch (e) {
      return 'claro';
    }
  });

  const [hashRota, setHashRota] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const handleHash = () => setHashRota(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    try {
      if (tema === 'escuro') {
        document.documentElement.setAttribute('data-tema', 'escuro');
      } else {
        document.documentElement.removeAttribute('data-tema');
      }
      localStorage.setItem('workshop_tema', tema);
    } catch (e) {}
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'escuro' ? 'claro' : 'escuro'));
  };

  const eModoApresentacao = hashRota === '#/apresentacao';

  return (
    <div className="aplicacao-layout">
      {!eModoApresentacao && (
        <Cabecalho tema={tema} aoAlternarTema={alternarTema} rotaAtual={hashRota} />
      )}
      <div className={`aplicacao-conteudo ${eModoApresentacao ? 'conteudo-apresentacao-limpo' : ''}`}>
        <Router />
      </div>
    </div>
  );
}

export default App;
