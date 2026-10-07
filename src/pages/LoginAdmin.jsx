// ALTERADO
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Campo } from '../components/Campo';
import { Botao } from '../components/Botao';
import { Mensagem } from '../components/Mensagem';
import { loginAdmin, salvarToken, obterToken } from '../api';

export function LoginAdmin({ aoNavegar }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [bloqueioSegundos, setBloqueioSegundos] = useState(0);

  useEffect(() => {
    if (obterToken()) {
      aoNavegar('#/admin');
    }
  }, [aoNavegar]);

  useEffect(() => {
    if (bloqueioSegundos <= 0) return;
    const timer = setInterval(() => {
      setBloqueioSegundos((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErro('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [bloqueioSegundos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senha || bloqueioSegundos > 0 || carregando) return;

    setCarregando(true);
    setErro('');

    try {
      const resposta = await loginAdmin(senha);
      salvarToken(resposta.token);
      aoNavegar('#/admin');
    } catch (err) {
      if (err.bloqueadoAte) {
        setBloqueioSegundos(err.bloqueadoAte);
        setErro(`Muitas tentativas incorretas. Aguarde ${err.bloqueadoAte} segundos.`);
      } else {
        setErro(err.message || 'Senha incorreta');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main id="conteudo-principal" className="pagina-centro">
      <Card classeExtra="cartao-login">
        <h1 className="titulo-md">Acesso do organizador</h1>
        <p className="texto-suave subtitulo-login">
          Entre com a sua senha. A senha fica embaralhada para ninguém descobrir.
        </p>

        {erro && <Mensagem tipo="erro">{erro}</Mensagem>}

        <form onSubmit={handleSubmit} className="formulario-login">
          <Campo
            rotulo="Senha de acesso"
            id="campo-senha-admin"
            tipo="password"
            valor={senha}
            aoMudar={(e) => setSenha(e.target.value)}
            obrigatorio
            placeholder="Digite a senha"
            desabilitado={carregando || bloqueioSegundos > 0}
          />

          <div className="acoes-login">
            <Botao
              tipo="submit"
              variante="primario"
              desabilitado={carregando || !senha || bloqueioSegundos > 0}
            >
              {carregando
                ? 'Verificando...'
                : bloqueioSegundos > 0
                ? `Bloqueado (${bloqueioSegundos}s)`
                : 'Entrar'}
            </Botao>

            <Botao
              tipo="button"
              variante="secundario"
              aoClicar={() => aoNavegar('#/')}
            >
              Voltar ao início
            </Botao>
          </div>
        </form>
      </Card>
    </main>
  );
}
