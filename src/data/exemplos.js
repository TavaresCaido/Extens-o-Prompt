// ALTERADO
export const EXEMPLOS = [
  {
    id: 'rh',
    area: 'RH',
    titulo: 'Estruturação de conversa de alinhamento',
    campos: {
      papel: 'Especialista em gestão de pessoas',
      objetivo: 'Escrever roteiro de conversa de alinhamento com colaboradora',
      contexto: 'Profissional com boa entrega técnica, mas com dificuldades de pontualidade em reuniões',
      entrada: 'Atrasou 15 minutos em três reuniões de alinhamento na semana passada',
      regras: [
        'Adotar tom acolhedor e direto',
        'Não usar palavras acusatórias',
        'Incluir duas perguntas abertas de reflexão'
      ],
      formato_saida: 'Três blocos curtos com abertura, reflexão e combinado'
    }
  },
  {
    id: 'vendas',
    area: 'Vendas',
    titulo: 'Retorno de proposta comercial',
    campos: {
      papel: 'Vendedor consultivo de sistemas',
      objetivo: 'Retomar contato com cliente potencial sem parecer insistente',
      contexto: 'Proposta enviada há sete dias sem retorno',
      entrada: 'Orçamento de R$ 15.000 para modernização do sistema de estoque',
      regras: [
        'Máximo de quatro frases',
        'Destacar o ganho no controle de estoque',
        'Propor conversa rápida de 10 minutos'
      ],
      formato_saida: 'Mensagem direta pronta para envio por e-mail'
    }
  },
  {
    id: 'marketing',
    area: 'Marketing',
    titulo: 'Publicação sobre aprendizado de trabalho',
    campos: {
      papel: 'Redator de comunicação',
      objetivo: 'Escrever texto curto sobre aprendizado com uma falha',
      contexto: 'Público de gestores de produto e líderes',
      entrada: 'Falha no sistema resolvida em 20 minutos com criação de checklist novo',
      regras: [
        'Frase inicial curta para chamar atenção',
        'Frases curtas e objetivas',
        'Sem termos exagerados',
        'Pergunta de engajamento no final'
      ],
      formato_saida: 'Texto formatado em parágrafos curtos'
    }
  },
  {
    id: 'juridico',
    area: 'Jurídico',
    titulo: 'Análise simples de cláusula de contrato',
    campos: {
      papel: 'Advogado de empresa',
      objetivo: 'Analisar cláusula de cancelamento de contrato e apontar riscos',
      contexto: 'Contrato de prestação de serviços de tecnologia por 12 meses',
      entrada: 'Cláusula de multa equivalente a 70% das parcelas restantes',
      regras: [
        'Dizer se o risco é Baixo, Médio ou Alto',
        'Explicar o motivo de forma simples',
        'Sugerir redação alternativa equilibrada'
      ],
      formato_saida: 'Relatório em tópicos com diagnóstico, risco e redação sugerida'
    }
  },
  {
    id: 'suporte',
    area: 'Suporte',
    titulo: 'Resposta a cliente com cobrança duplicada',
    campos: {
      papel: 'Atendente de suporte ao cliente',
      objetivo: 'Responder cliente com esclarecimento e resolução imediata',
      contexto: 'Uma falha cobrou duas vezes no cartão. A devolução já foi feita e cai em até 48 horas.',
      entrada: 'Cliente enviou mensagem chateado pedindo cancelamento imediato',
      regras: [
        'Assumir o erro de imediato sem desculpas',
        'Confirmar o prazo de devolução de até 48 horas',
        'Tom calmo, empático e resolutivo'
      ],
      formato_saida: 'Resposta completa pronta para envio'
    }
  },
  {
    id: 'financeiro',
    area: 'Financeiro',
    titulo: 'Resumo de despesas acima do esperado',
    campos: {
      papel: 'Analista de finanças',
      objetivo: 'Explicar aumento de custos do mês anterior para a diretoria',
      contexto: 'Apresentação executiva para diretoria',
      entrada: 'Despesas subiram 12% devido ao aumento do dólar e serviços de segurança',
      regras: [
        'Dividir em motivo do aumento e ações de controle',
        'Linguagem simples sem termos difíceis',
        'Máximo de 200 palavras'
      ],
      formato_saida: 'Resumo em três blocos curtos'
    }
  }
];
