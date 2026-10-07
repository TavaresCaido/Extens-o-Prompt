// ALTERADO
import React from 'react';
import { Card } from '../components/Card';
import { Botao } from '../components/Botao';

export function Inicio({ aoNavegar }) {
  return (
    <main id="conteudo-principal" className="pagina-centro">
      <Card classeExtra="cartao-inicio">
        <h1 className="titulo-lg">Pedido em Modelo Organizado</h1>
        <p className="texto-suave subtitulo-inicio">
          Aprenda a fazer pedidos para inteligência artificial de forma clara, direta e sem erros.
        </p>

        <div className="botoes-inicio">
          <Botao
            variante="primario"
            classeExtra="botao-lg"
            aoClicar={() => aoNavegar('#/atividade')}
          >
            Sou participante
          </Botao>

          <Botao
            variante="secundario"
            classeExtra="botao-lg"
            aoClicar={() => aoNavegar('#/login-admin')}
          >
            Sou organizador
          </Botao>
        </div>
      </Card>
    </main>
  );
}
