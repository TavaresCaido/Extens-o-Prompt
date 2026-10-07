/**
 * Modulo de comunicacao com a API e utilitarios locais
 * O estado da atividade fica SEMPRE no servidor (server.js), compartilhado por todos os visitantes.
 */

const erroDeRede = () => new Error('Nao foi possivel comunicar com o servidor');

const lerErro = async (resposta, padrao) => {
  const dados = await resposta.json().catch(() => ({}));
  const erro = new Error(dados.erro || padrao);
  erro.status = resposta.status;
  erro.bloqueadoAte = dados.bloqueadoAte;
  return erro;
};

let tokenMemoria = null;

export const obterToken = () => {
  try {
    return window.sessionStorage.getItem('admin_token') || tokenMemoria;
  } catch (e) {
    return tokenMemoria;
  }
};

export const salvarToken = (token) => {
  tokenMemoria = token;
  try {
    window.sessionStorage.setItem('admin_token', token);
  } catch (e) {
    // Mantem apenas em memoria caso sessionStorage esteja bloqueado
  }
};

export const removerToken = () => {
  tokenMemoria = null;
  try {
    window.sessionStorage.removeItem('admin_token');
  } catch (e) {
    // Ignora erro de storage bloqueado
  }
};

export const consultarStatus = async (signal) => {
  const resposta = await fetch('/api/status', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
    signal
  });
  if (!resposta.ok) throw await lerErro(resposta, 'Falha ao consultar status');
  const dados = await resposta.json().catch(() => null);
  if (!dados || typeof dados.liberada !== 'boolean') throw erroDeRede();
  return dados;
};

export const loginAdmin = async (senha) => {
  let resposta;
  try {
    resposta = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ senha })
    });
  } catch (e) {
    throw erroDeRede();
  }

  if (!resposta.ok) throw await lerErro(resposta, 'Senha incorreta');
  return await resposta.json();
};

export const liberarAtividade = async (liberada, token) => {
  let resposta;
  try {
    resposta = await fetch('/api/admin/liberar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ liberada })
    });
  } catch (e) {
    throw erroDeRede();
  }

  if (!resposta.ok) {
    const erro = await lerErro(resposta, 'Falha ao alterar a atividade');
    if (resposta.status === 401) erro.message = 'Sessao expirada';
    throw erro;
  }
  return await resposta.json();
};

export const renovarSessao = async (token) => {
  let resposta;
  try {
    resposta = await fetch('/api/admin/renovar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (e) {
    throw erroDeRede();
  }

  if (!resposta.ok) throw await lerErro(resposta, 'Falha ao renovar sessao');
  return await resposta.json();
};

export const sairAdmin = async (token) => {
  try {
    await fetch('/api/admin/sair', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (e) {
    // Ignora falha de rede
  } finally {
    removerToken();
  }
};

export const obterInfoAdmin = async (token) => {
  // Em dominio publico (ex: Render), o endereco correto e o proprio dominio do site;
  // IPs da rede local so fazem sentido quando acessado por localhost ou por IP.
  const host = window.location.hostname;
  const acessoLocal = !host || host === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(host);

  if (acessoLocal) {
    try {
      const resposta = await fetch('/api/admin/info', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (resposta.ok) {
        return await resposta.json();
      }
    } catch (e) {
      // Usa o hostname atual abaixo
    }
  }

  const hostname = window.location.hostname || 'localhost';
  const porta = window.location.port ? parseInt(window.location.port, 10) : (window.location.protocol === 'https:' ? 443 : 80);
  return {
    porta,
    enderecos: [hostname]
  };
};

export const copiarTexto = (texto) => {
  return new Promise((resolve) => {
    try {
      const elemento = document.createElement('textarea');
      elemento.value = texto;
      elemento.setAttribute('readonly', '');
      elemento.style.position = 'fixed';
      elemento.style.left = '-9999px';
      elemento.style.top = '-9999px';
      document.body.appendChild(elemento);
      elemento.select();
      const copiado = document.execCommand('copy');
      document.body.removeChild(elemento);
      if (copiado) {
        return resolve(true);
      }
    } catch (e) {
      // Tenta API moderna caso fallback falhe
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      resolve(false);
    }
  });
};
