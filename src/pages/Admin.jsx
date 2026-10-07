// ALTERADO
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../components/Card';
import { Botao } from '../components/Botao';
import { IndicadorDeEstado } from '../components/IndicadorDeEstado';
import { IndicadorDeConexao } from '../components/IndicadorDeConexao';
import { EnderecoDosParticipantes } from '../components/EnderecoDosParticipantes';
import { Mensagem } from '../components/Mensagem';
import {
  obterToken,
  consultarStatus,
  liberarAtividade,
  renovarSessao,
  sairAdmin,
  obterInfoAdmin
} from '../api';

export function Admin({ aoNavegar }) {
  const token = obterToken();

  const [liberada, setLiberada] = useState(false);
  const [conectado, setConectado] = useState(true);
  const [segundosSemResposta, setSegundosSemResposta] = useState(0);
  const [confirmandoBloqueio, setConfirmandoBloqueio] = useState(false);
  const [mensagemFeedback, setMensagemFeedback] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [infoServidor, setInfoServidor] = useState(null);
  const [carregandoInfo, setCarregandoInfo] = useState(false);
  const [processandoAcao, setProcessandoAcao] = useState(false);

  const intervaloFalhaRef = useRef(3000);
  const ultimaRespostaMsRef = useRef(Date.now());

  useEffect(() => {
    if (!token) {
      aoNavegar('#/login-admin');
    }
  }, [token, aoNavegar]);

  const carregarInfo = useCallback(async () => {
    if (!token) return;
    setCarregandoInfo(true);
    try {
      const dados = await obterInfoAdmin(token);
      setInfoServidor(dados);
    } catch (e) {
      if (e.message?.includes('expirada')) {
        aoNavegar('#/login-admin');
      }
    } finally {
      setCarregandoInfo(false);
    }
  }, [token, aoNavegar]);

  useEffect(() => {
    carregarInfo();
  }, [carregarInfo]);

  useEffect(() => {
    if (!token) return;
    const intervalRenovacao = setInterval(() => {
      renovarSessao(token).catch(() => {});
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalRenovacao);
  }, [token]);

  useEffect(() => {
    let cancelado = false;
    let timerId = null;

    const executarConsulta = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const dados = await consultarStatus(controller.signal);
        clearTimeout(timeoutId);

        if (cancelado) return;
        setLiberada(Boolean(dados.liberada));
        setConectado(true);
        setSegundosSemResposta(0);
        ultimaRespostaMsRef.current = Date.now();
        intervaloFalhaRef.current = 3000;
      } catch (err) {
        clearTimeout(timeoutId);
        if (cancelado) return;

        setConectado(false);
        const decorrido = Math.floor((Date.now() - ultimaRespostaMsRef.current) / 1000);
        setSegundosSemResposta(decorrido);

        if (intervaloFalhaRef.current === 3000) intervaloFalhaRef.current = 5000;
        else if (intervaloFalhaRef.current === 5000) intervaloFalhaRef.current = 8000;
        else intervaloFalhaRef.current = 10000;
      }

      if (!cancelado) {
        const variacaoTempo = Math.floor(Math.random() * 500);
        timerId = setTimeout(executarConsulta, intervaloFalhaRef.current + variacaoTempo);
      }
    };

    executarConsulta();

    return () => {
      cancelado = true;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleAlternarLiberacao = async (novoEstado) => {
    if (!token || processandoAcao) return;
    setProcessandoAcao(true);
    setMensagemErro('');
    setMensagemFeedback('');

    try {
      const res = await liberarAtividade(novoEstado, token);
      setLiberada(Boolean(res.liberada));
      setConfirmandoBloqueio(false);
      setMensagemFeedback(
        res.liberada ? 'Atividade liberada com sucesso' : 'Atividade bloqueada com sucesso'
      );
      setTimeout(() => setMensagemFeedback(''), 4000);
    } catch (err) {
      if (err.message?.includes('expirada')) {
        aoNavegar('#/login-admin');
        return;
      }
      setMensagemErro(err.message || 'Falha ao comunicar com o computador do evento');
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleSair = async () => {
    if (token) {
      await sairAdmin(token);
    }
    aoNavegar('#/login-admin');
  };

  return (
    <main id="conteudo-principal" className="pagina-painel">
      <div className="painel-cabecalho">
        <div>
          <h1 className="titulo-md">Painel do Organizador</h1>
          <p className="texto-suave">
            Controle a liberação da atividade e acompanhe a conexão com a sala.
          </p>
        </div>

        <div className="painel-acoes-topo">
          <Botao
            variante="primario"
            aoClicar={() => aoNavegar('#/apresentacao')}
          >
            Abrir apresentação
          </Botao>

          <Botao
            variante="secundario"
            aoClicar={handleSair}
          >
            Sair
          </Botao>
        </div>
      </div>

      <div className="painel-grade">
        <Card classeExtra="painel-secao">
          <h2 className="titulo-sm">Estado da atividade</h2>

          <div style={{ margin: '16px 0' }}>
            <IndicadorDeEstado liberada={liberada} />
          </div>

          <div style={{ margin: '8px 0 20px' }}>
            <IndicadorDeConexao
              conectado={conectado}
              segundosSemResposta={segundosSemResposta}
            />
          </div>

          {mensagemFeedback && (
            <Mensagem tipo="sucesso">{mensagemFeedback}</Mensagem>
          )}

          {mensagemErro && (
            <Mensagem tipo="erro">{mensagemErro}</Mensagem>
          )}

          {!confirmandoBloqueio ? (
            <div>
              {liberada ? (
                <Botao
                  variante="secundario"
                  classeExtra="botao-lg"
                  aoClicar={() => setConfirmandoBloqueio(true)}
                  desabilitado={processandoAcao}
                >
                  Bloquear atividade
                </Botao>
              ) : (
                <Botao
                  variante="primario"
                  classeExtra="botao-lg"
                  aoClicar={() => handleAlternarLiberacao(true)}
                  desabilitado={processandoAcao}
                >
                  {processandoAcao ? 'Liberando...' : 'Liberar atividade'}
                </Botao>
              )}
            </div>
          ) : (
            <div className="confirmacao-inline cartao" role="region" aria-label="Confirmação de bloqueio">
              <p className="texto-aviso">
                Deseja bloquear a atividade para todos os participantes?
              </p>
              <div className="confirmacao-acoes">
                <Botao
                  variante="primario"
                  aoClicar={() => handleAlternarLiberacao(false)}
                  desabilitado={processandoAcao}
                >
                  {processandoAcao ? 'Bloqueando...' : 'Sim, bloquear'}
                </Botao>
                <Botao
                  variante="secundario"
                  aoClicar={() => setConfirmandoBloqueio(false)}
                  desabilitado={processandoAcao}
                >
                  Cancelar
                </Botao>
              </div>
            </div>
          )}
        </Card>

        <EnderecoDosParticipantes
          info={infoServidor}
          aoAtualizar={carregarInfo}
          carregando={carregandoInfo}
        />
      </div>
    </main>
  );
}
