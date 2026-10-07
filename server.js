import express from 'express';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// Trust proxy configuravel
if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

const getClientIp = (req) => {
  if (process.env.TRUST_PROXY === '1' && req.ip) {
    return req.ip;
  }
  return req.socket?.remoteAddress || '127.0.0.1';
};

// Estado em memoria
let liberada = false;
const tokens = new Map();
const tentativasIp = new Map();

// Hash padrao para senha 'blockchainia' caso ADMIN_SENHA_HASH nao seja informado
const HASH_PADRAO = '5b989295813160013d2972113f0f68c5:5a12dd94d3be28bbd41949fc8b464fb505d4d36e49a223b69f5abac36f1f0854c244dcb301291333b9af327f3c258b20aafc5f9ff17cc3f2016d1046f710aba9';

const verificarSenha = (senhaDigitada) => {
  const hashEsperadoStr = process.env.ADMIN_SENHA_HASH || HASH_PADRAO;
  const partes = hashEsperadoStr.split(':');
  if (partes.length !== 2) return false;

  const [salt, hashOriginal] = partes;
  try {
    const hashCalculado = crypto.scryptSync(String(senhaDigitada || ''), salt, 64).toString('hex');
    const bufCalculado = Buffer.from(hashCalculado, 'hex');
    const bufOriginal = Buffer.from(hashOriginal, 'hex');
    if (bufCalculado.length !== bufOriginal.length) return false;
    return crypto.timingSafeEqual(bufCalculado, bufOriginal);
  } catch (e) {
    return false;
  }
};

// Limpeza de tokens expirados a cada 10 minutos
setInterval(() => {
  const agora = Math.floor(Date.now() / 1000);
  for (const [token, data] of tokens.entries()) {
    if (data.expiraEm <= agora) {
      tokens.delete(token);
    }
  }
}, 10 * 60 * 1000);

// Middleware de autenticacao de administrador
const autenticarAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Acesso nao autorizado' });
  }

  const token = authHeader.substring(7).trim();
  const tokenData = tokens.get(token);
  const agora = Math.floor(Date.now() / 1000);

  if (!tokenData || tokenData.expiraEm <= agora) {
    if (tokenData) tokens.delete(token);
    return res.status(401).json({ erro: 'Sessao expirada' });
  }

  req.adminToken = token;
  req.tokenData = tokenData;
  next();
};

// Parser para corpo JSON limitado a 1 KB
const jsonParser = express.json({ limit: '1kb' });

// 1. GET /api/status - Publico, sem cache
app.get('/api/status', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    liberada,
    timestamp: Math.floor(Date.now() / 1000)
  });
});

// 2. POST /api/admin/login - Publico
app.post('/api/admin/login', jsonParser, (req, res) => {
  const ip = getClientIp(req);
  const agoraMs = Date.now();
  const registro = tentativasIp.get(ip) || { erros: 0, bloqueadoAte: 0 };

  // Verifica bloqueio por tentativas excessivas
  if (registro.bloqueadoAte > agoraMs) {
    const restanteSegundos = Math.ceil((registro.bloqueadoAte - agoraMs) / 1000);
    return res.status(429).json({
      erro: 'Muitas tentativas incorretas. Aguarde ' + restanteSegundos + ' segundos.',
      bloqueadoAte: restanteSegundos
    });
  }

  const { senha } = req.body || {};

  if (!senha || !verificarSenha(senha)) {
    registro.erros += 1;
    if (registro.erros >= 5) {
      registro.bloqueadoAte = agoraMs + 30 * 1000;
      registro.erros = 0;
    }
    tentativasIp.set(ip, registro);

    // Atraso fixo de 500 ms antes de responder
    return setTimeout(() => {
      res.status(401).json({ erro: 'Senha incorreta' });
    }, 500);
  }

  // Sucesso: zera contador do IP e gera token
  tentativasIp.delete(ip);
  const token = crypto.randomBytes(32).toString('hex');
  const expiraEm = Math.floor(Date.now() / 1000) + 4 * 60 * 60; // 4 horas
  tokens.set(token, { expiraEm });

  return res.json({ token, expiraEm });
});

// 3. POST /api/admin/liberar - Requer token
app.post('/api/admin/liberar', jsonParser, autenticarAdmin, (req, res) => {
  if (typeof req.body?.liberada === 'boolean') {
    liberada = req.body.liberada;
  }
  res.json({ liberada });
});

// 4. POST /api/admin/renovar - Requer token
app.post('/api/admin/renovar', autenticarAdmin, (req, res) => {
  const novaExp = Math.floor(Date.now() / 1000) + 4 * 60 * 60;
  req.tokenData.expiraEm = novaExp;
  res.json({ expiraEm: novaExp });
});

// 5. POST /api/admin/sair - Requer token
app.post('/api/admin/sair', autenticarAdmin, (req, res) => {
  tokens.delete(req.adminToken);
  res.json({ ok: true });
});

// 6. GET /api/admin/info - Requer token
app.get('/api/admin/info', autenticarAdmin, (req, res) => {
  const enderecos = [];
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        enderecos.push(net.address);
      }
    }
  }

  if (enderecos.length === 0) {
    enderecos.push('localhost');
  }

  res.json({
    porta: PORT,
    enderecos
  });
});

// Servir arquivos estaticos do build em producao
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback para index.html em rotas do SPA
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ erro: 'Rota nao encontrada' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Tratamento de erros express retornando sempre JSON
app.use((err, req, res, next) => {
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Prevencao de encerramento por excecoes nao tratadas
process.on('uncaughtException', (err) => {
  console.error('Excecao nao tratada:', err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Rejeicao nao tratada:', reason);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor iniciado em http://0.0.0.0:${PORT}`);
});
