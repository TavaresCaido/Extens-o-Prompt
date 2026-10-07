// ALTERADO
import React, { useState, useEffect, useRef } from 'react';
import { Inicio } from './pages/Inicio';
import { LoginAdmin } from './pages/LoginAdmin';
import { Admin } from './pages/Admin';
import { Apresentacao } from './pages/Apresentacao';
import { Atividade } from './pages/Atividade';
import { obterToken } from './api';

const ROTAS = {
  '#/': {
    titulo: 'Início - Workshop Pedido em Modelo Organizado',
    componente: Inicio,
    protegida: false
  },
  '#/login-admin': {
    titulo: 'Acesso do Organizador - Workshop Pedido em Modelo Organizado',
    componente: LoginAdmin,
    protegida: false
  },
  '#/admin': {
    titulo: 'Painel do Organizador - Workshop Pedido em Modelo Organizado',
    componente: Admin,
    protegida: true
  },
  '#/apresentacao': {
    titulo: 'Modo Apresentação - Workshop Pedido em Modelo Organizado',
    componente: Apresentacao,
    protegida: true
  },
  '#/atividade': {
    titulo: 'Atividade Prática - Workshop Pedido em Modelo Organizado',
    componente: Atividade,
    protegida: false
  }
};

export function Router() {
  const [rotaAtual, setRotaAtual] = useState(() => {
    return window.location.hash || '#/';
  });

  const focoH1TimerRef = useRef(null);

  const normalizarRota = (hash) => {
    if (!hash || hash === '#' || hash === '') return '#/';
    if (ROTAS[hash]) return hash;
    return '#/';
  };

  const aoNavegar = (novaRota) => {
    window.location.hash = novaRota;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const nova = normalizarRota(window.location.hash);
      setRotaAtual(nova);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let rotaAtiva = normalizarRota(rotaAtual);
  const defRota = ROTAS[rotaAtiva] || ROTAS['#/'];

  if (defRota.protegida && !obterToken()) {
    rotaAtiva = '#/login-admin';
  }

  const definicaoFinal = ROTAS[rotaAtiva] || ROTAS['#/'];
  const ComponentePagina = definicaoFinal.componente;

  useEffect(() => {
    document.title = definicaoFinal.titulo;

    if (focoH1TimerRef.current) clearTimeout(focoH1TimerRef.current);
    focoH1TimerRef.current = setTimeout(() => {
      const h1 = document.querySelector('h1');
      if (h1) {
        h1.setAttribute('tabindex', '-1');
        h1.focus();
      }
    }, 50);

    return () => {
      if (focoH1TimerRef.current) clearTimeout(focoH1TimerRef.current);
    };
  }, [definicaoFinal.titulo, rotaAtiva]);

  return (
    <ComponentePagina
      aoNavegar={aoNavegar}
      rotaAtual={rotaAtiva}
    />
  );
}
