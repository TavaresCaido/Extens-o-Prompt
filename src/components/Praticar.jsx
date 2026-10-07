// ALTERADO - v2.0: 4 atividades em abas, 7 perguntas curtas cada
import React, { useState } from 'react';
import { Card } from './Card';
import { Botao } from './Botao';
import { Mensagem } from './Mensagem';

class CapturadorDeErro extends React.Component {
  constructor(props) {
    super(props);
    this.state = { temErro: false };
  }

  static getDerivedStateFromError() {
    return { temErro: true };
  }

  componentDidCatch(error, info) {
    console.error('Erro na atividade:', error, info);
  }

  render() {
    if (this.state.temErro) {
      return (
        <div className="cartao atividade-erro">
          <p className="texto-aviso">Nao foi possivel carregar esta atividade.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ROTULOS_PEDIDO = {
  quem: 'Quem a IA deve ser',
  quer: 'O que voce quer',
  info: 'Informacoes de fundo',
  dado: 'O dado que a IA vai usar',
  regras: 'O que ela pode e nao pode fazer',
  formato: 'Como voce quer a resposta'
};

const CAMPOS_POSSIVEIS = [
  'Quem a IA deve ser',
  'O que voce quer',
  'Informacoes de fundo',
  'O dado que a IA vai usar',
  'O que ela pode e nao pode fazer',
  'Como voce quer a resposta'
];

/* --------------------------------------------------------------------------
   DADOS DAS ATIVIDADES
   -------------------------------------------------------------------------- */

const ATIVIDADE_ORDEM = [
  {
    numero: 1,
    cenario: 'A Ana quer pedir um resumo para a IA',
    blocos: [
      { id: 'quem', ordem_correta: 1, texto: 'Voce e um professor de historia' },
      { id: 'quer', ordem_correta: 2, texto: 'Resuma o texto abaixo em 5 topicos' },
      { id: 'info', ordem_correta: 3, texto: 'O publico e uma turma do 9o ano' },
      { id: 'como', ordem_correta: 4, texto: 'Linguagem simples, sem palavras dificeis' }
    ],
    feedback_correto: 'Boa ordem. Primeiro quem a IA e, depois o que fazer, depois para quem e por fim como fazer',
    feedback_incorreto: 'A ordem mais comum e: quem a IA e, o que voce quer, para quem e, e como fazer'
  },
  {
    numero: 2,
    cenario: 'O Bruno quer um e-mail de cobranca',
    blocos: [
      { id: 'quem', ordem_correta: 1, texto: 'Voce e um analista financeiro' },
      { id: 'quer', ordem_correta: 2, texto: 'Escreva um e-mail de cobranca amigavel' },
      { id: 'info', ordem_correta: 3, texto: 'O cliente atrasou o pagamento em 5 dias' },
      { id: 'como', ordem_correta: 4, texto: 'Maximo 100 palavras, tom cordial' }
    ],
    feedback_correto: 'Perfeito. A IA ja sabe o papel dela, o que fazer, o cenario e o formato',
    feedback_incorreto: 'Comece dizendo quem a IA e. Depois o que fazer. Depois o cenario. Por ultimo o formato'
  },
  {
    numero: 3,
    cenario: 'A Carla quer uma legenda para Instagram',
    blocos: [
      { id: 'quem', ordem_correta: 1, texto: 'Voce e um social media' },
      { id: 'quer', ordem_correta: 2, texto: 'Crie uma legenda para o post abaixo' },
      { id: 'info', ordem_correta: 3, texto: 'Marca de cafe artesanal, publico de 25 a 40 anos' },
      { id: 'como', ordem_correta: 4, texto: 'Ate 120 caracteres, com 5 hashtags' }
    ],
    feedback_correto: 'Isso. Papel, acao, contexto, formato. Nessa ordem a IA nao se perde',
    feedback_incorreto: 'Lembre: quem a IA e, o que fazer, o contexto e por ultimo o formato'
  },
  {
    numero: 4,
    cenario: 'O Diego quer ajuda com um codigo',
    blocos: [
      { id: 'quem', ordem_correta: 1, texto: 'Voce e um programador senior' },
      { id: 'quer', ordem_correta: 2, texto: 'Explique o erro abaixo em 3 passos' },
      { id: 'info', ordem_correta: 3, texto: 'O codigo esta em JavaScript' },
      { id: 'como', ordem_correta: 4, texto: 'Linguagem simples, com exemplo de correcao' }
    ],
    feedback_correto: 'Certo. A IA sabe o papel dela, o que fazer, o cenario e o formato',
    feedback_incorreto: 'A ordem e: quem a IA e, o que fazer, o cenario, o formato'
  },
  {
    numero: 5,
    cenario: 'A Elisa quer um plano de aula',
    blocos: [
      { id: 'quem', ordem_correta: 1, texto: 'Voce e um professor experiente' },
      { id: 'quer', ordem_correta: 2, texto: 'Crie um plano de aula de 50 minutos' },
      { id: 'info', ordem_correta: 3, texto: 'Turma do 7o ano, 30 alunos' },
      { id: 'como', ordem_correta: 4, texto: 'Em 4 blocos: abertura, conteudo, pratica, fechamento' }
    ],
    feedback_correto: 'Perfeito. Esse e o esqueleto que a IA segue sem errar',
    feedback_incorreto: 'Comece pelo papel, siga com a acao, o cenario e por fim o formato'
  },
  {
    numero: 6,
    cenario: 'O Fabio quer um resumo de reuniao',
    blocos: [
      { id: 'quem', ordem_correta: 1, texto: 'Voce e um assistente executivo' },
      { id: 'quer', ordem_correta: 2, texto: 'Resuma a transcricao abaixo' },
      { id: 'info', ordem_correta: 3, texto: 'Reuniao de planejamento de marketing' },
      { id: 'como', ordem_correta: 4, texto: 'Em 5 topicos com decisoes e responsaveis' }
    ],
    feedback_correto: 'Isso. Ordem clara, resposta clara',
    feedback_incorreto: 'A ordem que funciona e: papel, acao, contexto, formato'
  },
  {
    numero: 7,
    cenario: 'A Gabi quer uma resposta para um cliente',
    blocos: [
      { id: 'quem', ordem_correta: 1, texto: 'Voce e um atendente de suporte' },
      { id: 'quer', ordem_correta: 2, texto: 'Responda a reclamacao abaixo' },
      { id: 'info', ordem_correta: 3, texto: 'Cliente insatisfeito com atraso na entrega' },
      { id: 'como', ordem_correta: 4, texto: 'Maximo 80 palavras, tom empatico' }
    ],
    feedback_correto: 'Fechou. Voce usou a ordem certa em todas as 7 perguntas',
    feedback_incorreto: 'A regra e sempre a mesma: papel, acao, contexto, formato'
  }
];

const ATIVIDADE_FALTANDO = [
  {
    numero: 1,
    pedido_mostrado: 'Escreva um e-mail para o cliente avisando que o pedido atrasou.',
    campos_que_faltam: ['Quem a IA deve ser', 'Informacoes de fundo', 'O dado que a IA vai usar', 'O que ela pode e nao pode fazer', 'Como voce quer a resposta'],
    feedback_correto: 'Isso. So diz o que fazer. Falta quem a IA e, quem e o cliente, o que aconteceu e como responder',
    feedback_incorreto: 'Repare: o pedido so diz o que fazer. Todo o resto esta faltando'
  },
  {
    numero: 2,
    pedido_mostrado: 'Resuma o texto que vou colar abaixo.',
    campos_que_faltam: ['Quem a IA deve ser', 'Informacoes de fundo', 'O que ela pode e nao pode fazer', 'Como voce quer a resposta'],
    feedback_correto: 'Certo. Falta dizer quem a IA e, para quem e o resumo, o tamanho e o formato',
    feedback_incorreto: 'O pedido tem o objetivo e o dado, mas falta quem a IA e, para quem, as regras e o formato'
  },
  {
    numero: 3,
    pedido_mostrado: 'Voce e um analista. Analise os dados abaixo.',
    campos_que_faltam: ['Informacoes de fundo', 'O que ela pode e nao pode fazer', 'Como voce quer a resposta'],
    feedback_correto: 'Isso. Falta o cenario, as regras e o formato. E o que faz a analise sair util ou solta',
    feedback_incorreto: 'Tem o papel e o objetivo. Falta o cenario, as regras e o formato'
  },
  {
    numero: 4,
    pedido_mostrado: 'Crie uma legenda para este produto. Tom divertido.',
    campos_que_faltam: ['Quem a IA deve ser', 'Informacoes de fundo', 'O dado que a IA vai usar', 'Como voce quer a resposta'],
    feedback_correto: 'Certo. Falta o papel, o contexto, o produto em si e o formato da legenda',
    feedback_incorreto: 'Tem o objetivo e uma regra (tom). Falta o papel, o contexto, o dado e o formato'
  },
  {
    numero: 5,
    pedido_mostrado: 'Voce e um professor. Explique fotossintese para alunos do 6o ano em 5 minutos.',
    campos_que_faltam: ['O dado que a IA vai usar'],
    feedback_correto: 'Isso. Esse pedido esta quase completo. So falta dizer com base em qual material explicar',
    feedback_incorreto: 'Repare: tem papel, objetivo, contexto e regras. So falta o material de base'
  },
  {
    numero: 6,
    pedido_mostrado: 'Voce e um vendedor. Escreva uma mensagem de retomada para cliente inativo. Tom cordial, ate 5 linhas.',
    campos_que_faltam: ['Informacoes de fundo', 'O dado que a IA vai usar', 'Como voce quer a resposta'],
    feedback_correto: 'Certo. Falta quem e o cliente, o historico da conversa e em qual formato enviar',
    feedback_incorreto: 'Tem papel, objetivo e uma regra. Falta o contexto do cliente, o historico e o formato final'
  },
  {
    numero: 7,
    pedido_mostrado: 'Escreva algo legal.',
    campos_que_faltam: ['Quem a IA deve ser', 'Informacoes de fundo', 'O dado que a IA vai usar', 'O que ela pode e nao pode fazer', 'Como voce quer a resposta'],
    feedback_correto: 'Isso. Esse e o pior tipo de pedido. Falta quase tudo. A IA so vai adivinhar',
    feedback_incorreto: 'Esse pedido e um dos mais vagos possiveis. So tem um objetivo vago. Falta todo o resto'
  }
];

const ATIVIDADE_COMPLETE = [
  {
    numero: 1,
    pedido_mostrado: { quem: 'Vendedor experiente', quer: 'Mensagem de retomada para cliente', info: 'Cliente comprou ha 6 meses e sumiu', dado: 'Ultima conversa foi sobre preco', regras: 'Tom cordial, sem pressao', formato: '___' },
    opcoes: [
      { texto: 'Mensagem curta de ate 5 linhas, pronta para WhatsApp', correta: true },
      { texto: 'Pode ser do tamanho que precisar', correta: false },
      { texto: 'Responda como quiser', correta: false }
    ],
    feedback_correto: 'Certo. Dizer o formato faz a IA acertar de primeira',
    feedback_incorreto: 'As duas ultimas deixam a IA decidir sozinha. A opcao certa e a primeira'
  },
  {
    numero: 2,
    pedido_mostrado: { quem: 'Analista financeiro', quer: 'Resumir variacao de despesas', info: 'Diretoria vai ler em reuniao', dado: 'Despesas subiram 12% por causa do dolar', regras: 'Sem opiniao, so dados', formato: '___' },
    opcoes: [
      { texto: '3 topicos com numero e causa', correta: true },
      { texto: 'Texto bem longo explicando tudo', correta: false },
      { texto: 'Uma frase so para nao cansar', correta: false }
    ],
    feedback_correto: 'Isso. Formato curto e direto para diretoria funciona melhor',
    feedback_incorreto: 'O pedido e para diretoria e quer so dados. 3 topicos com numero e causa e o formato que funciona'
  },
  {
    numero: 3,
    pedido_mostrado: { quem: 'Social media', quer: 'Legenda para post de cafe artesanal', info: 'Publico de 25 a 40 anos, Instagram', dado: 'Foto de pacote novo e o preco promocional', regras: 'Tom proximo, sem gíria', formato: '___' },
    opcoes: [
      { texto: 'Ate 120 caracteres e 5 hashtags', correta: true },
      { texto: 'Um texto medio sem limite', correta: false },
      { texto: 'So hashtags, sem frase', correta: false }
    ],
    feedback_correto: 'Isso. Instagram pede formato especifico. Com tamanho e hashtags, sai pronto',
    feedback_incorreto: 'Instagram tem limite pratico. O formato certo e com tamanho e hashtags'
  },
  {
    numero: 4,
    pedido_mostrado: { quem: 'Professor de ciencias', quer: 'Explicar fotossintese', info: 'Turma do 6o ano, 30 alunos', dado: 'Conteudo do capitulo 4 do livro', regras: 'Linguagem simples, sem formulas', formato: '___' },
    opcoes: [
      { texto: 'Explicacao em 3 blocos com exemplo do dia a dia', correta: true },
      { texto: 'Resumo em uma frase', correta: false },
      { texto: 'Texto cientifico completo', correta: false }
    ],
    feedback_correto: 'Certo. Criancas entendem melhor com blocos e exemplo pratico',
    feedback_incorreto: 'Para o 6o ano, funciona melhor em blocos curtos com exemplo do dia a dia'
  },
  {
    numero: 5,
    pedido_mostrado: { quem: 'Atendente de suporte', quer: 'Responder reclamacao de atraso', info: 'Cliente esta esperando ha 5 dias', dado: 'Produto chega em 2 dias uteis', regras: 'Tom empatico, sem culpar transportadora', formato: '___' },
    opcoes: [
      { texto: 'Maximo 80 palavras com proximo passo claro', correta: true },
      { texto: 'Texto longo explicando os detalhes', correta: false },
      { texto: 'Apenas um pedido de desculpas', correta: false }
    ],
    feedback_correto: 'Isso. Resposta curta com proximo passo acalma o cliente',
    feedback_incorreto: 'Reclamacao pede resposta curta com solucao. Maximo 80 palavras com proximo passo e o formato que funciona'
  },
  {
    numero: 6,
    pedido_mostrado: { quem: 'Consultora de RH', quer: 'Roteiro de feedback para colaborador', info: 'Colaboradora senior, boa entrega, mas interrompe colegas', dado: 'Reuniao de planejamento de terca', regras: 'Metodo SBI, tom acolhedor', formato: '___' },
    opcoes: [
      { texto: '3 blocos: abertura, situacao e combinado final', correta: true },
      { texto: 'Uma lista de criticas diretas', correta: false },
      { texto: 'Um texto livre sem estrutura', correta: false }
    ],
    feedback_correto: 'Certo. Feedback funciona melhor quando tem comeco, meio e fim',
    feedback_incorreto: 'Feedback dificil pede estrutura. 3 blocos com abertura, situacao e combinado e o formato mais claro'
  },
  {
    numero: 7,
    pedido_mostrado: { quem: 'Programador senior', quer: 'Explicar erro em codigo', info: 'Codigo em JavaScript, dev junior vai ler', dado: 'Trecho com erro de referencia', regras: 'Sem jargao, mostrar a correcao', formato: '___' },
    opcoes: [
      { texto: '3 passos: o que e o erro, por que aconteceu, como corrigir', correta: true },
      { texto: 'So o codigo corrigido, sem explicacao', correta: false },
      { texto: 'Um texto longo sobre teoria', correta: false }
    ],
    feedback_correto: 'Isso. Quem esta aprendendo precisa do porque, nao so da correcao',
    feedback_incorreto: 'Para quem esta comecando, o formato com 3 passos ensina. So o codigo pronto nao explica'
  }
];

const ATIVIDADE_ESCOLHA = [
  {
    numero: 1,
    tarefa: 'Pedir um resumo de um relatorio',
    pedidos: [
      { id: 'A', texto: 'Resuma esse relatorio', nivel: 'fraco' },
      { id: 'B', texto: 'Voce e um analista. Resuma o relatorio em 5 topicos para a diretoria. Tom direto, sem opiniao', nivel: 'forte' },
      { id: 'C', texto: 'Faca um resumo bem completo e detalhado de tudo', nivel: 'medio' }
    ],
    feedback: {
      A: 'Esse pedido deixa tudo em aberto. A IA vai escolher tamanho, tom e publico. Sai generico',
      B: 'Esse e o mais claro. Diz quem a IA e, tamanho, publico e tom. Sai pronto',
      C: 'Quer tudo mas nao diz como. Sem tamanho e publico, devolve um texto enorme'
    }
  },
  {
    numero: 2,
    tarefa: 'Pedir um e-mail de cobranca',
    pedidos: [
      { id: 'A', texto: 'Cobre o cliente', nivel: 'fraco' },
      { id: 'B', texto: 'Escreva um e-mail de cobranca firme e educado. Maximo 100 palavras', nivel: 'medio' },
      { id: 'C', texto: 'Voce e um analista financeiro. Escreva e-mail de cobranca amigavel para o cliente Joao, atraso de 5 dias, valor R$ 1.200. Maximo 100 palavras, tom cordial', nivel: 'forte' }
    ],
    feedback: {
      A: 'So diz o que fazer. Falta quem a IA e, quem e o cliente, quanto e o formato',
      B: 'Tem acao, tom e tamanho. Falta o nome do cliente e o valor. Ainda da para melhorar',
      C: 'Esse e o mais completo. Nome, valor, tamanho e tom. Sai pronto para enviar'
    }
  },
  {
    numero: 3,
    tarefa: 'Pedir uma legenda para Instagram',
    pedidos: [
      { id: 'A', texto: 'Faca uma legenda legal para o post', nivel: 'fraco' },
      { id: 'B', texto: 'Voce e um social media. Crie uma legenda para o post do cafe novo. Publico de 25 a 40 anos, tom proximo, ate 120 caracteres', nivel: 'forte' },
      { id: 'C', texto: 'Crie uma legenda para Instagram', nivel: 'medio' }
    ],
    feedback: {
      A: 'Vago. Nao diz publico, tom, tamanho nem do que e o post',
      B: 'Esse e o melhor. Papel, publico, tamanho e tom definidos',
      C: 'Falta o contexto, o publico e o tom. Sem isso, sai generico'
    }
  },
  {
    numero: 4,
    tarefa: 'Pedir um plano de aula',
    pedidos: [
      { id: 'A', texto: 'Faca um plano de aula para mim', nivel: 'fraco' },
      { id: 'B', texto: 'Voce e um professor de ciencias. Crie um plano de aula de 50 minutos sobre fotossintese para o 7o ano. Em 4 blocos: abertura, conteudo, pratica, fechamento', nivel: 'forte' },
      { id: 'C', texto: 'Preciso de um plano de aula sobre ciencias', nivel: 'medio' }
    ],
    feedback: {
      A: 'Nao diz materia, serie, tempo nem formato. A IA vai adivinhar tudo',
      B: 'Esse e o melhor. Materia, serie, tempo e formato definidos',
      C: 'Diz a materia, mas falta serie, tempo e formato. Ainda fica vago'
    }
  },
  {
    numero: 5,
    tarefa: 'Pedir uma resposta de suporte',
    pedidos: [
      { id: 'A', texto: 'Responda o cliente', nivel: 'fraco' },
      { id: 'B', texto: 'Voce e um atendente de suporte. Responda a reclamacao abaixo com tom empatico, maximo 80 palavras, indicando proximo passo', nivel: 'forte' },
      { id: 'C', texto: 'Escreva uma resposta educada', nivel: 'medio' }
    ],
    feedback: {
      A: 'Nao diz quem e a IA, qual e a reclamacao nem como responder',
      B: 'Esse e o melhor. Papel, tom, tamanho e formato definidos',
      C: 'Tem tom, mas falta o contexto da reclamacao e o formato'
    }
  },
  {
    numero: 6,
    tarefa: 'Pedir um resumo de reuniao',
    pedidos: [
      { id: 'A', texto: 'Resuma a reuniao', nivel: 'fraco' },
      { id: 'B', texto: 'Voce e um assistente executivo. Resuma a transcricao abaixo em 5 topicos com decisoes e responsaveis', nivel: 'forte' },
      { id: 'C', texto: 'Faca um resumo da reuniao de hoje', nivel: 'medio' }
    ],
    feedback: {
      A: 'Falta o formato e o que priorizar. O resumo vai sair solto',
      B: 'Esse e o melhor. Papel, formato e o que destacar definidos',
      C: 'Diz o que fazer, mas falta formato e o que priorizar'
    }
  },
  {
    numero: 7,
    tarefa: 'Pedir ajuda com codigo',
    pedidos: [
      { id: 'A', texto: 'Conserta esse codigo', nivel: 'fraco' },
      { id: 'B', texto: 'Voce e um programador senior. Explique o erro abaixo em 3 passos: o que e, por que aconteceu, como corrigir. Linguagem simples, com exemplo de correcao', nivel: 'forte' },
      { id: 'C', texto: 'Ache o erro nesse codigo JavaScript', nivel: 'medio' }
    ],
    feedback: {
      A: 'Sem contexto, sem formato. A IA pode reescrever tudo de um jeito que voce nao entende',
      B: 'Esse e o melhor. Papel, formato, tom e exemplos definidos',
      C: 'Diz a linguagem, mas falta o formato da explicacao. A IA pode devolver so o codigo pronto'
    }
  }
];

/* --------------------------------------------------------------------------
   UTILITARIOS E COMPONENTES DE APOIO
   -------------------------------------------------------------------------- */

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const troca = copia[i];
    copia[i] = copia[j];
    copia[j] = troca;
  }
  return copia;
}

function ProgressoDaAtividade({ atual, total }) {
  return (
    <div className="atividade-progresso">
      <span className="atividade-contagem">
        Pergunta {atual} de {total}
      </span>
      <div
        className="barra-progresso"
        role="progressbar"
        aria-valuenow={atual}
        aria-valuemin="1"
        aria-valuemax={total}
      >
        <div className={`barra-progresso-preenchimento progresso-etapa-${atual}-de-${total}`} />
      </div>
    </div>
  );
}

function Feedback({ acertou, texto }) {
  return <Mensagem tipo={acertou ? 'sucesso' : 'erro'}>{texto}</Mensagem>;
}

function Resultado({ acertos, total, resumo, aoRecomecar }) {
  return (
    <Card classeExtra="atividade-resultado">
      <h3 className="titulo-sm">
        Voce acertou {acertos} de {total}
      </h3>
      <p className="texto-suave">{resumo}</p>
      <Botao variante="primario" aoClicar={aoRecomecar}>
        Recomecar
      </Botao>
    </Card>
  );
}

function FluxoAtividade({ titulo, questoes, resumo, renderPergunta }) {
  const total = questoes.length;
  const [indice, setIndice] = useState(0);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const registrar = (acertou) => {
    setRespondida(true);
    if (acertou) setAcertos((valor) => valor + 1);
  };

  const proxima = () => {
    if (indice >= total - 1) {
      setFinalizado(true);
      return;
    }
    setIndice((valor) => valor + 1);
    setRespondida(false);
  };

  const recomecar = () => {
    setIndice(0);
    setRespondida(false);
    setAcertos(0);
    setFinalizado(false);
  };

  if (finalizado) {
    return (
      <Resultado acertos={acertos} total={total} resumo={resumo} aoRecomecar={recomecar} />
    );
  }

  const questao = questoes[indice];

  return (
    <div className="atividade-fluxo">
      <h3 className="titulo-sm">{titulo}</h3>
      <ProgressoDaAtividade atual={indice + 1} total={total} />
      {renderPergunta({ questao, indice, respondida, aoResponder: registrar })}
      {respondida && (
        <div className="atividade-rodape">
          <Botao variante="primario" aoClicar={proxima}>
            {indice >= total - 1 ? 'Ver resultado' : 'Proxima'}
          </Botao>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   ATIVIDADE 1: Ordem do pedido
   -------------------------------------------------------------------------- */

function PerguntaOrdem({ questao, respondida, aoResponder }) {
  const [disponiveis, setDisponiveis] = useState(() => embaralhar(questao.blocos));
  const [montagem, setMontagem] = useState([]);
  const [acertou, setAcertou] = useState(false);

  const escolher = (bloco) => {
    if (respondida) return;
    const novaMontagem = [...montagem, bloco];
    const restantes = disponiveis.filter((item) => item.id !== bloco.id);
    setMontagem(novaMontagem);
    setDisponiveis(restantes);

    if (novaMontagem.length === questao.blocos.length) {
      const correto = novaMontagem.every(
        (item, posicao) => item.ordem_correta === posicao + 1
      );
      setAcertou(correto);
      aoResponder(correto);
    }
  };

  return (
    <div className="atividade-questao">
      <p className="pergunta-cenario">{questao.cenario}</p>

      {!respondida && (
        <div className="ordem-blocos">
          {disponiveis.map((bloco) => (
            <Botao
              key={bloco.id}
              variante="secundario"
              classeExtra="ordem-bloco"
              aoClicar={() => escolher(bloco)}
            >
              {bloco.texto}
            </Botao>
          ))}
        </div>
      )}

      <ol className="ordem-espacos">
        {questao.blocos.map((_, posicao) => {
          const bloco = montagem[posicao];
          return (
            <li
              key={posicao}
              className={`ordem-espaco ${bloco ? 'ordem-espaco-preenchido' : ''}`}
            >
              <span className="ordem-espaco-numero">{posicao + 1}.</span>
              <span className="ordem-espaco-texto">{bloco ? bloco.texto : ''}</span>
            </li>
          );
        })}
      </ol>

      {respondida && (
        <Feedback
          acertou={acertou}
          texto={acertou ? questao.feedback_correto : questao.feedback_incorreto}
        />
      )}
    </div>
  );
}

function AtividadeOrdem() {
  return (
    <FluxoAtividade
      titulo="Coloque na ordem certa"
      questoes={ATIVIDADE_ORDEM}
      resumo="A ordem e sempre: quem a IA e, o que fazer, o cenario e o formato"
      renderPergunta={({ questao, indice, respondida, aoResponder }) => (
        <PerguntaOrdem
          key={indice}
          questao={questao}
          respondida={respondida}
          aoResponder={aoResponder}
        />
      )}
    />
  );
}

/* --------------------------------------------------------------------------
   ATIVIDADE 2: O que esta faltando
   -------------------------------------------------------------------------- */

function PerguntaFaltando({ questao, respondida, aoResponder }) {
  const [marcados, setMarcados] = useState([]);
  const [conferido, setConferido] = useState(false);
  const [acertou, setAcertou] = useState(false);

  const alternar = (campo) => {
    if (conferido) return;
    setMarcados((atuais) =>
      atuais.includes(campo)
        ? atuais.filter((item) => item !== campo)
        : [...atuais, campo]
    );
  };

  const conferir = () => {
    const faltam = questao.campos_que_faltam;
    const correto =
      marcados.length === faltam.length &&
      marcados.every((campo) => faltam.includes(campo));
    setAcertou(correto);
    setConferido(true);
    aoResponder(correto);
  };

  return (
    <div className="atividade-questao">
      <div className="pedido-analisado">
        <span className="pedido-rotulo">Pedido mostrado:</span>
        <p className="pedido-texto">{questao.pedido_mostrado}</p>
      </div>

      <p className="atividade-pergunta">Marque os campos que faltam neste pedido.</p>

      <div className="campos-grade">
        {CAMPOS_POSSIVEIS.map((campo) => {
          const marcado = marcados.includes(campo);
          const faltava = questao.campos_que_faltam.includes(campo);
          let extra = '';
          if (marcado) extra = 'campo-opcao-marcado';
          if (conferido) {
            if (marcado === faltava) extra = marcado ? 'campo-opcao-correto' : '';
            else extra = 'campo-opcao-errado';
          }
          return (
            <Botao
              key={campo}
              variante="secundario"
              classeExtra={`campo-opcao ${extra}`}
              desabilitado={conferido}
              aoClicar={() => alternar(campo)}
            >
              {campo}
            </Botao>
          );
        })}
      </div>

      {!conferido && (
        <div className="atividade-rodape">
          <Botao variante="primario" aoClicar={conferir}>
            Conferir
          </Botao>
        </div>
      )}

      {conferido && (
        <Feedback
          acertou={acertou}
          texto={acertou ? questao.feedback_correto : questao.feedback_incorreto}
        />
      )}
    </div>
  );
}

function AtividadeFaltando() {
  return (
    <FluxoAtividade
      titulo="Aponte o que falta no pedido"
      questoes={ATIVIDADE_FALTANDO}
      resumo="Todo pedido bom tem 6 partes. Quando falta alguma, a resposta sai generica"
      renderPergunta={({ questao, indice, respondida, aoResponder }) => (
        <PerguntaFaltando
          key={indice}
          questao={questao}
          respondida={respondida}
          aoResponder={aoResponder}
        />
      )}
    />
  );
}

/* --------------------------------------------------------------------------
   ATIVIDADE 3: Complete o pedido
   -------------------------------------------------------------------------- */

function PerguntaComplete({ questao, respondida, aoResponder }) {
  const [escolhida, setEscolhida] = useState(null);
  const [acertou, setAcertou] = useState(false);

  const escolher = (opcao, indice) => {
    if (respondida) return;
    setEscolhida(indice);
    setAcertou(opcao.correta);
    aoResponder(opcao.correta);
  };

  return (
    <div className="atividade-questao">
      <div className="pedido-analisado">
        <div className="pedido-linhas">
          {Object.entries(questao.pedido_mostrado).map(([chave, valor]) => (
            <div key={chave} className="pedido-linha">
              <span className="pedido-linha-rotulo">{ROTULOS_PEDIDO[chave]}:</span>
              <span className={valor === '___' ? 'pedido-vazio' : ''}>{valor}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="atividade-pergunta">Escolha o preenchimento que faz mais sentido.</p>

      <div className="opcoes-lista">
        {questao.opcoes.map((opcao, indice) => (
          <Botao
            key={indice}
            variante={respondida && opcao.correta ? 'primario' : 'secundario'}
            classeExtra="botao-opcao"
            desabilitado={respondida}
            aoClicar={() => escolher(opcao, indice)}
          >
            {opcao.texto}
          </Botao>
        ))}
      </div>

      {respondida && (
        <Feedback
          acertou={acertou}
          texto={acertou ? questao.feedback_correto : questao.feedback_incorreto}
        />
      )}
    </div>
  );
}

function AtividadeComplete() {
  return (
    <FluxoAtividade
      titulo="Complete a parte que falta"
      questoes={ATIVIDADE_COMPLETE}
      resumo="Formato e o que transforma pedido bom em resposta pronta para usar"
      renderPergunta={({ questao, indice, respondida, aoResponder }) => (
        <PerguntaComplete
          key={indice}
          questao={questao}
          respondida={respondida}
          aoResponder={aoResponder}
        />
      )}
    />
  );
}

/* --------------------------------------------------------------------------
   ATIVIDADE 4: Escolha o melhor
   -------------------------------------------------------------------------- */

function PerguntaEscolha({ questao, respondida, aoResponder }) {
  const [escolhida, setEscolhida] = useState(null);

  const escolher = (pedido) => {
    if (respondida) return;
    setEscolhida(pedido.id);
    aoResponder(pedido.nivel === 'forte');
  };

  const pedidoEscolhido = questao.pedidos.find((item) => item.id === escolhida);

  return (
    <div className="atividade-questao">
      <p className="pergunta-cenario">{questao.tarefa}</p>

      <div className="comparar-grade">
        {questao.pedidos.map((pedido) => {
          const selecionado = escolhida === pedido.id;
          let nivelClasse = '';
          if (selecionado) {
            if (pedido.nivel === 'forte') nivelClasse = 'opcao-comparar-forte';
            else if (pedido.nivel === 'fraco') nivelClasse = 'opcao-comparar-fraca';
          }
          return (
            <button
              key={pedido.id}
              type="button"
              className={`opcao-comparar ${selecionado ? 'selecionada' : ''} ${nivelClasse}`}
              onClick={() => escolher(pedido)}
              disabled={respondida}
              aria-label={`Opcao ${pedido.id}`}
            >
              <strong className="opcao-titulo">Opcao {pedido.id}</strong>
              <span className="opcao-comparar-texto">{pedido.texto}</span>
            </button>
          );
        })}
      </div>

      {respondida && pedidoEscolhido && (
        <Feedback
          acertou={pedidoEscolhido.nivel === 'forte'}
          texto={questao.feedback[pedidoEscolhido.id]}
        />
      )}
    </div>
  );
}

function AtividadeEscolha() {
  return (
    <FluxoAtividade
      titulo="Qual pedido voce usaria?"
      questoes={ATIVIDADE_ESCOLHA}
      resumo="A diferenca entre um pedido fraco e um forte esta em dizer quem, o que, para quem, com base em que e como"
      renderPergunta={({ questao, indice, respondida, aoResponder }) => (
        <PerguntaEscolha
          key={indice}
          questao={questao}
          respondida={respondida}
          aoResponder={aoResponder}
        />
      )}
    />
  );
}

/* --------------------------------------------------------------------------
   COMPONENTE PRINCIPAL: ABA PRATICAR
   -------------------------------------------------------------------------- */

const ABAS = [
  { id: 1, nome: 'Ordem do pedido' },
  { id: 2, nome: 'O que esta faltando' },
  { id: 3, nome: 'Complete o pedido' },
  { id: 4, nome: 'Escolha o melhor' }
];

export function Praticar() {
  const [ativa, setAtiva] = useState(1);

  return (
    <CapturadorDeErro>
      <section className="secao-praticar">
        <div className="exemplos-menu praticar-menu" role="tablist" aria-label="Atividades de pratica">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              type="button"
              role="tab"
              aria-selected={ativa === aba.id}
              className={`botao botao-sm ${ativa === aba.id ? 'botao-primario' : 'botao-secundario'}`}
              onClick={() => setAtiva(aba.id)}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        {ativa === 1 && <AtividadeOrdem />}
        {ativa === 2 && <AtividadeFaltando />}
        {ativa === 3 && <AtividadeComplete />}
        {ativa === 4 && <AtividadeEscolha />}
      </section>
    </CapturadorDeErro>
  );
}

export default Praticar;
