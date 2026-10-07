// ALTERADO
import React, { useState } from 'react';
import { Botao } from './Botao';
import { copiarTexto } from '../api';

export function EnderecoDosParticipantes({ info, aoAtualizar, carregando = false }) {
  const [copiadoIdx, setCopiadoIdx] = useState(null);

  const enderecos = info?.enderecos || [];
  const porta = info?.porta || 3000;

  const montarUrl = (endereco) => {
    const protocolo = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const portaPadrao = (protocolo === 'https:' && porta === 443) || (protocolo === 'http:' && porta === 80);
    return `${protocolo}//${endereco}${portaPadrao ? '' : ':' + porta}/#/atividade`;
  };

  const handleCopiar = async (endereco, idx) => {
    const url = montarUrl(endereco);
    const sucesso = await copiarTexto(url);
    if (sucesso) {
      setCopiadoIdx(idx);
      setTimeout(() => setCopiadoIdx(null), 2000);
    }
  };

  return (
    <div className="cartao endereco-participantes">
      <div className="endereco-topo">
        <div>
          <h2 className="titulo-sm">Endereço para os participantes</h2>
          <p className="texto-suave">
            Compartilhe este endereço com a sala para que todos entrem direto na tela de atividade.
          </p>
        </div>
        <Botao
          variante="secundario"
          classeExtra="botao-sm"
          aoClicar={aoAtualizar}
          desabilitado={carregando}
        >
          {carregando ? 'Atualizando...' : 'Atualizar'}
        </Botao>
      </div>

      {enderecos.length === 0 ? (
        <p className="texto-suave">Não foi possível obter o endereço do servidor</p>
      ) : (
        <ul className="lista-enderecos">
          {enderecos.map((ip, idx) => {
            const urlCompleta = montarUrl(ip);
            const isPrimeiro = idx === 0;
            return (
              <li
                key={ip}
                className={`item-endereco ${isPrimeiro ? 'item-endereco-principal' : ''}`}
              >
                <code className="codigo-endereco">{urlCompleta}</code>
                <Botao
                  variante="secundario"
                  classeExtra="botao-sm"
                  aoClicar={() => handleCopiar(ip, idx)}
                  aria-label={`Copiar endereço ${urlCompleta}`}
                >
                  {copiadoIdx === idx ? 'Endereço copiado' : 'Copiar'}
                </Botao>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
