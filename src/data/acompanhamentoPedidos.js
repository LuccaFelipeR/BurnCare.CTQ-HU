// Módulo de acompanhamento: histórico, fornecedor, prova, ajustes e entrega.
// Responsável: Matheus Albertini
//
// ATENÇÃO: todos os dados abaixo são FICTÍCIOS.
// Não há backend nem persistência — as alterações ficam só na memória da tela.
// Quando existir uma fonte de dados autorizada, basta trocar PEDIDOS_FICTICIOS
// pela consulta real e manter as funções de regra (aplicarAcao, etc.).

// ---------------------------------------------------------------------------
// Status do pedido (etapas 6 a 9 do fluxo do README)
// ---------------------------------------------------------------------------
export const STATUS = {
  ENVIADO_CONFECCAO: "ENVIADO_CONFECCAO",
  EM_PRODUCAO: "EM_PRODUCAO",
  EM_TRANSPORTE: "EM_TRANSPORTE",
  AGUARDANDO_PROVA: "AGUARDANDO_PROVA",
  EM_AJUSTE: "EM_AJUSTE",
  PRONTA_ENTREGA: "PRONTA_ENTREGA",
  ENTREGUE: "ENTREGUE"
};

export const INFO_STATUS = {
  ENVIADO_CONFECCAO: { rotulo: "Enviado à confecção", cor: "#5B6B7A", fundo: "#EEF2F5" },
  EM_PRODUCAO: { rotulo: "Em produção", cor: "#9A6200", fundo: "#FFF3DC" },
  EM_TRANSPORTE: { rotulo: "Em transporte", cor: "#2D5DA8", fundo: "#E5EEFB" },
  AGUARDANDO_PROVA: { rotulo: "Aguardando prova", cor: "#7A3FA0", fundo: "#F2E8F8" },
  EM_AJUSTE: { rotulo: "Em ajuste", cor: "#B03A2E", fundo: "#FBE6E3" },
  PRONTA_ENTREGA: { rotulo: "Prova aprovada", cor: "#0C716B", fundo: "#DDF3E9" },
  ENTREGUE: { rotulo: "Entregue", cor: "#19384C", fundo: "#DDE8EE" }
};

// Filtros da tela de histórico
export const FILTROS = [
  { chave: "TODOS", rotulo: "Todos", status: null },
  {
    chave: "ABERTOS",
    rotulo: "Em aberto",
    status: Object.values(STATUS).filter((s) => s !== STATUS.ENTREGUE)
  },
  {
    chave: "PRODUCAO",
    rotulo: "Fornecedor",
    status: [STATUS.ENVIADO_CONFECCAO, STATUS.EM_PRODUCAO, STATUS.EM_TRANSPORTE]
  },
  { chave: "PROVA", rotulo: "Aguardando prova", status: [STATUS.AGUARDANDO_PROVA] },
  { chave: "AJUSTE", rotulo: "Em ajuste", status: [STATUS.EM_AJUSTE] },
  { chave: "ENTREGA", rotulo: "Prontos p/ entrega", status: [STATUS.PRONTA_ENTREGA] },
  { chave: "CONCLUIDOS", rotulo: "Concluídos", status: [STATUS.ENTREGUE] }
];

// ---------------------------------------------------------------------------
// Ações possíveis em cada status (o que o usuário pode registrar)
// ---------------------------------------------------------------------------
// Cada campo: { nome, rotulo, tipo: "texto" | "data" | "opcoes", obrigatorio, opcoes? }
export const ACOES = {
  ENVIADO_CONFECCAO: {
    titulo: "Confirmar início da produção",
    descricao: "Registre quando o fornecedor confirmou o recebimento do pedido.",
    botao: "Confirmar produção",
    campos: [
      { nome: "data", rotulo: "Data da confirmação", tipo: "data", obrigatorio: true },
      { nome: "previsao", rotulo: "Previsão de envio (opcional)", tipo: "data", obrigatorio: false },
      { nome: "observacao", rotulo: "Observação", tipo: "texto", obrigatorio: false }
    ]
  },
  EM_PRODUCAO: {
    titulo: "Registrar envio pelo fornecedor",
    descricao: "Registre quando a malha saiu do fornecedor para o CTQ.",
    botao: "Registrar envio",
    campos: [
      { nome: "data", rotulo: "Data do envio", tipo: "data", obrigatorio: true },
      { nome: "rastreio", rotulo: "Código de rastreio / transportadora", tipo: "texto", obrigatorio: false },
      { nome: "observacao", rotulo: "Observação", tipo: "texto", obrigatorio: false }
    ]
  },
  EM_TRANSPORTE: {
    titulo: "Registrar recebimento no CTQ",
    descricao: "Confirme a chegada da malha ao CTQ para agendar a prova.",
    botao: "Confirmar recebimento",
    campos: [
      { nome: "data", rotulo: "Data do recebimento", tipo: "data", obrigatorio: true },
      { nome: "recebidoPor", rotulo: "Recebido por", tipo: "texto", obrigatorio: true },
      { nome: "observacao", rotulo: "Observação", tipo: "texto", obrigatorio: false }
    ]
  },
  AGUARDANDO_PROVA: {
    titulo: "Registrar prova da malha",
    descricao: "Informe o resultado da prova no paciente.",
    botao: "Registrar prova",
    campos: [
      { nome: "data", rotulo: "Data da prova", tipo: "data", obrigatorio: true },
      {
        nome: "resultado",
        rotulo: "Resultado",
        tipo: "opcoes",
        obrigatorio: true,
        opcoes: [
          { valor: "APROVADA", rotulo: "Aprovada" },
          { valor: "AJUSTE", rotulo: "Precisa de ajuste" }
        ]
      },
      // Obrigatório apenas quando resultado = AJUSTE (validado em validarAcao)
      { nome: "descricaoAjuste", rotulo: "Descrição do ajuste", tipo: "texto", obrigatorio: false },
      { nome: "observacao", rotulo: "Observação", tipo: "texto", obrigatorio: false }
    ]
  },
  EM_AJUSTE: {
    titulo: "Registrar retorno do ajuste",
    descricao: "Registre quando a malha ajustada voltou ao CTQ para nova prova.",
    botao: "Registrar retorno",
    campos: [
      { nome: "data", rotulo: "Data do retorno", tipo: "data", obrigatorio: true },
      { nome: "observacao", rotulo: "Observação", tipo: "texto", obrigatorio: false }
    ]
  },
  PRONTA_ENTREGA: {
    titulo: "Registrar entrega ao paciente",
    descricao: "Ao registrar a entrega, o pedido é encerrado.",
    botao: "Registrar entrega e encerrar",
    campos: [
      { nome: "data", rotulo: "Data da entrega", tipo: "data", obrigatorio: true },
      { nome: "recebidoPor", rotulo: "Recebido por (paciente ou responsável)", tipo: "texto", obrigatorio: true },
      { nome: "observacao", rotulo: "Orientações / observação", tipo: "texto", obrigatorio: false }
    ]
  },
  ENTREGUE: null
};

// ---------------------------------------------------------------------------
// Utilitários de data (formato DD/MM/AAAA)
// ---------------------------------------------------------------------------
export function dataHoje() {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${d.getFullYear()}`;
}

export function dataValida(texto) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto || "")) return false;
  const [dia, mes, ano] = texto.split("/").map(Number);
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

// Converte DD/MM/AAAA em número comparável (AAAAMMDD)
function dataParaNumero(texto) {
  const [dia, mes, ano] = texto.split("/");
  return Number(`${ano}${mes}${dia}`);
}

// Formata enquanto digita: "25112026" -> "25/11/2026"
export function mascaraData(texto) {
  const numeros = (texto || "").replace(/\D/g, "").slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

// ---------------------------------------------------------------------------
// Regras
// ---------------------------------------------------------------------------

// Retorna a lista de erros (vazia se estiver tudo certo)
export function validarAcao(pedido, dados) {
  const acao = ACOES[pedido.status];
  const erros = [];

  if (!acao) {
    erros.push("Este pedido já foi encerrado.");
    return erros;
  }

  acao.campos.forEach((campo) => {
    const valor = (dados[campo.nome] || "").trim();

    if (campo.obrigatorio && !valor) {
      erros.push(`Preencha: ${campo.rotulo}.`);
      return;
    }

    if (campo.tipo === "data" && valor && !dataValida(valor)) {
      erros.push(`${campo.rotulo}: use o formato DD/MM/AAAA.`);
    }
  });

  // A data do registro não pode ser anterior ao último evento do pedido
  const ultimo = pedido.historico[pedido.historico.length - 1];
  if (ultimo && dataValida(dados.data) && dataValida(ultimo.data)) {
    if (dataParaNumero(dados.data) < dataParaNumero(ultimo.data)) {
      erros.push(`A data não pode ser anterior ao último registro (${ultimo.data}).`);
    }
  }

  if (
    pedido.status === STATUS.AGUARDANDO_PROVA &&
    dados.resultado === "AJUSTE" &&
    !(dados.descricaoAjuste || "").trim()
  ) {
    erros.push("Descreva o ajuste necessário.");
  }

  return erros;
}

// Aplica a ação do status atual e devolve um NOVO pedido (não altera o original).
// Deve ser chamada só depois de validarAcao retornar lista vazia.
export function aplicarAcao(pedido, dados, responsavel = "Usuário do CTQ") {
  const obs = (dados.observacao || "").trim();
  const extra = obs ? ` Obs.: ${obs}` : "";
  let novoStatus = pedido.status;
  let descricao = "";
  let ajustes = pedido.ajustes;

  switch (pedido.status) {
    case STATUS.ENVIADO_CONFECCAO:
      novoStatus = STATUS.EM_PRODUCAO;
      descricao = `Fornecedor ${pedido.fornecedor} confirmou a produção.`;
      if ((dados.previsao || "").trim()) descricao += ` Previsão de envio: ${dados.previsao}.`;
      break;

    case STATUS.EM_PRODUCAO:
      novoStatus = STATUS.EM_TRANSPORTE;
      descricao = "Malha enviada pelo fornecedor.";
      if ((dados.rastreio || "").trim()) descricao += ` Rastreio: ${dados.rastreio.trim()}.`;
      break;

    case STATUS.EM_TRANSPORTE:
      novoStatus = STATUS.AGUARDANDO_PROVA;
      descricao = `Malha recebida no CTQ por ${dados.recebidoPor.trim()}.`;
      break;

    case STATUS.AGUARDANDO_PROVA:
      if (dados.resultado === "AJUSTE") {
        novoStatus = STATUS.EM_AJUSTE;
        const numero = pedido.ajustes.length + 1;
        descricao = `Prova realizada: precisa de ajuste (ajuste nº ${numero}): ${dados.descricaoAjuste.trim()}.`;
        ajustes = [
          ...pedido.ajustes,
          {
            numero,
            descricao: dados.descricaoAjuste.trim(),
            dataSolicitacao: dados.data,
            dataRetorno: null
          }
        ];
      } else {
        novoStatus = STATUS.PRONTA_ENTREGA;
        descricao = "Prova realizada: malha aprovada.";
      }
      break;

    case STATUS.EM_AJUSTE:
      novoStatus = STATUS.AGUARDANDO_PROVA;
      descricao = "Malha ajustada retornou ao CTQ para nova prova.";
      ajustes = pedido.ajustes.map((ajuste, i) =>
        i === pedido.ajustes.length - 1 ? { ...ajuste, dataRetorno: dados.data } : ajuste
      );
      break;

    case STATUS.PRONTA_ENTREGA:
      novoStatus = STATUS.ENTREGUE;
      descricao = `Malha entregue a ${dados.recebidoPor.trim()}. Pedido encerrado.`;
      break;

    default:
      return pedido;
  }

  return {
    ...pedido,
    status: novoStatus,
    ajustes,
    historico: [
      ...pedido.historico,
      { data: dados.data, status: novoStatus, descricao: descricao + extra, responsavel }
    ]
  };
}

// Filtra por chave de filtro e por texto (nome do paciente, nº do pedido ou prontuário)
export function filtrarPedidos(pedidos, chaveFiltro, busca) {
  const filtro = FILTROS.find((f) => f.chave === chaveFiltro) || FILTROS[0];
  const termo = (busca || "").trim().toLowerCase();

  return pedidos.filter((pedido) => {
    const passaStatus = !filtro.status || filtro.status.includes(pedido.status);
    const passaBusca =
      !termo ||
      pedido.paciente.toLowerCase().includes(termo) ||
      pedido.id.toLowerCase().includes(termo) ||
      pedido.prontuario.toLowerCase().includes(termo);
    return passaStatus && passaBusca;
  });
}

export function contarPorFiltro(pedidos, chaveFiltro) {
  return filtrarPedidos(pedidos, chaveFiltro, "").length;
}

// Pronto para a Home usar quando for integrada (indicadores da Visão Geral)
export function calcularIndicadores(pedidos) {
  const contar = (lista) => pedidos.filter((p) => lista.includes(p.status)).length;
  return [
    { titulo: "Pedidos em aberto", valor: pedidos.filter((p) => p.status !== STATUS.ENTREGUE).length },
    {
      titulo: "Em produção",
      valor: contar([STATUS.ENVIADO_CONFECCAO, STATUS.EM_PRODUCAO, STATUS.EM_TRANSPORTE])
    },
    { titulo: "Aguardando prova", valor: contar([STATUS.AGUARDANDO_PROVA]) },
    { titulo: "Concluídos", valor: contar([STATUS.ENTREGUE]) }
  ];
}

// ---------------------------------------------------------------------------
// Dados FICTÍCIOS para demonstração
// ---------------------------------------------------------------------------
export const PEDIDOS_FICTICIOS = [
  {
    id: "BC-2026-001",
    paciente: "Paciente Fictício A",
    prontuario: "FIC-0001",
    tipo: "1ª malha",
    regiao: "Membro superior direito",
    produto: "Luva com dedos",
    fornecedor: "Fornecedor Exemplo 1",
    dataPedido: "03/11/2026",
    status: STATUS.ENVIADO_CONFECCAO,
    ajustes: [],
    historico: [
      { data: "03/11/2026", status: STATUS.ENVIADO_CONFECCAO, descricao: "Pedido conferido e enviado à confecção.", responsavel: "Equipe CTQ" }
    ]
  },
  {
    id: "BC-2026-002",
    paciente: "Paciente Fictício B",
    prontuario: "FIC-0002",
    tipo: "1ª malha",
    regiao: "Tronco",
    produto: "Colete compressivo",
    fornecedor: "Fornecedor Exemplo 2",
    dataPedido: "28/10/2026",
    status: STATUS.EM_PRODUCAO,
    ajustes: [],
    historico: [
      { data: "28/10/2026", status: STATUS.ENVIADO_CONFECCAO, descricao: "Pedido conferido e enviado à confecção.", responsavel: "Equipe CTQ" },
      { data: "30/10/2026", status: STATUS.EM_PRODUCAO, descricao: "Fornecedor Exemplo 2 confirmou a produção.", responsavel: "Equipe CTQ" }
    ]
  },
  {
    id: "BC-2026-003",
    paciente: "Paciente Fictício C",
    prontuario: "FIC-0003",
    tipo: "2ª malha",
    regiao: "Face",
    produto: "Máscara facial",
    fornecedor: "Fornecedor Exemplo 1",
    dataPedido: "20/10/2026",
    status: STATUS.EM_TRANSPORTE,
    ajustes: [],
    historico: [
      { data: "20/10/2026", status: STATUS.ENVIADO_CONFECCAO, descricao: "Pedido conferido e enviado à confecção.", responsavel: "Equipe CTQ" },
      { data: "22/10/2026", status: STATUS.EM_PRODUCAO, descricao: "Fornecedor Exemplo 1 confirmou a produção.", responsavel: "Equipe CTQ" },
      { data: "10/11/2026", status: STATUS.EM_TRANSPORTE, descricao: "Malha enviada pelo fornecedor. Rastreio: EX000000003BR.", responsavel: "Equipe CTQ" }
    ]
  },
  {
    id: "BC-2026-004",
    paciente: "Paciente Fictício D",
    prontuario: "FIC-0004",
    tipo: "1ª malha",
    regiao: "Membro inferior esquerdo",
    produto: "Meia-calça compressiva",
    fornecedor: "Fornecedor Exemplo 2",
    dataPedido: "15/10/2026",
    status: STATUS.AGUARDANDO_PROVA,
    ajustes: [],
    historico: [
      { data: "15/10/2026", status: STATUS.ENVIADO_CONFECCAO, descricao: "Pedido conferido e enviado à confecção.", responsavel: "Equipe CTQ" },
      { data: "16/10/2026", status: STATUS.EM_PRODUCAO, descricao: "Fornecedor Exemplo 2 confirmou a produção.", responsavel: "Equipe CTQ" },
      { data: "05/11/2026", status: STATUS.EM_TRANSPORTE, descricao: "Malha enviada pelo fornecedor.", responsavel: "Equipe CTQ" },
      { data: "12/11/2026", status: STATUS.AGUARDANDO_PROVA, descricao: "Malha recebida no CTQ por Enfermagem (fictício).", responsavel: "Equipe CTQ" }
    ]
  },
  {
    id: "BC-2026-005",
    paciente: "Paciente Fictício E",
    prontuario: "FIC-0005",
    tipo: "1ª malha",
    regiao: "Pescoço",
    produto: "Colar cervical compressivo",
    fornecedor: "Fornecedor Exemplo 1",
    dataPedido: "01/10/2026",
    status: STATUS.EM_AJUSTE,
    ajustes: [
      { numero: 1, descricao: "Reduzir circunferência na base do pescoço.", dataSolicitacao: "14/11/2026", dataRetorno: null }
    ],
    historico: [
      { data: "01/10/2026", status: STATUS.ENVIADO_CONFECCAO, descricao: "Pedido conferido e enviado à confecção.", responsavel: "Equipe CTQ" },
      { data: "03/10/2026", status: STATUS.EM_PRODUCAO, descricao: "Fornecedor Exemplo 1 confirmou a produção.", responsavel: "Equipe CTQ" },
      { data: "28/10/2026", status: STATUS.EM_TRANSPORTE, descricao: "Malha enviada pelo fornecedor.", responsavel: "Equipe CTQ" },
      { data: "04/11/2026", status: STATUS.AGUARDANDO_PROVA, descricao: "Malha recebida no CTQ por Enfermagem (fictício).", responsavel: "Equipe CTQ" },
      { data: "14/11/2026", status: STATUS.EM_AJUSTE, descricao: "Prova realizada: precisa de ajuste (ajuste nº 1): Reduzir circunferência na base do pescoço.", responsavel: "Equipe CTQ" }
    ]
  },
  {
    id: "BC-2026-006",
    paciente: "Paciente Fictício F",
    prontuario: "FIC-0006",
    tipo: "2ª malha",
    regiao: "Membro superior esquerdo",
    produto: "Braçadeira compressiva",
    fornecedor: "Fornecedor Exemplo 2",
    dataPedido: "25/09/2026",
    status: STATUS.PRONTA_ENTREGA,
    ajustes: [],
    historico: [
      { data: "25/09/2026", status: STATUS.ENVIADO_CONFECCAO, descricao: "Pedido conferido e enviado à confecção.", responsavel: "Equipe CTQ" },
      { data: "27/09/2026", status: STATUS.EM_PRODUCAO, descricao: "Fornecedor Exemplo 2 confirmou a produção.", responsavel: "Equipe CTQ" },
      { data: "20/10/2026", status: STATUS.EM_TRANSPORTE, descricao: "Malha enviada pelo fornecedor.", responsavel: "Equipe CTQ" },
      { data: "27/10/2026", status: STATUS.AGUARDANDO_PROVA, descricao: "Malha recebida no CTQ por Enfermagem (fictício).", responsavel: "Equipe CTQ" },
      { data: "18/11/2026", status: STATUS.PRONTA_ENTREGA, descricao: "Prova realizada: malha aprovada.", responsavel: "Equipe CTQ" }
    ]
  },
  {
    id: "BC-2026-007",
    paciente: "Paciente Fictício G",
    prontuario: "FIC-0007",
    tipo: "1ª malha",
    regiao: "Tronco",
    produto: "Body compressivo",
    fornecedor: "Fornecedor Exemplo 1",
    dataPedido: "02/09/2026",
    status: STATUS.ENTREGUE,
    ajustes: [
      { numero: 1, descricao: "Alongar alças em 2 cm.", dataSolicitacao: "06/10/2026", dataRetorno: "20/10/2026" }
    ],
    historico: [
      { data: "02/09/2026", status: STATUS.ENVIADO_CONFECCAO, descricao: "Pedido conferido e enviado à confecção.", responsavel: "Equipe CTQ" },
      { data: "04/09/2026", status: STATUS.EM_PRODUCAO, descricao: "Fornecedor Exemplo 1 confirmou a produção.", responsavel: "Equipe CTQ" },
      { data: "25/09/2026", status: STATUS.EM_TRANSPORTE, descricao: "Malha enviada pelo fornecedor.", responsavel: "Equipe CTQ" },
      { data: "30/09/2026", status: STATUS.AGUARDANDO_PROVA, descricao: "Malha recebida no CTQ por Enfermagem (fictício).", responsavel: "Equipe CTQ" },
      { data: "06/10/2026", status: STATUS.EM_AJUSTE, descricao: "Prova realizada: precisa de ajuste (ajuste nº 1): Alongar alças em 2 cm.", responsavel: "Equipe CTQ" },
      { data: "20/10/2026", status: STATUS.AGUARDANDO_PROVA, descricao: "Malha ajustada retornou ao CTQ para nova prova.", responsavel: "Equipe CTQ" },
      { data: "22/10/2026", status: STATUS.PRONTA_ENTREGA, descricao: "Prova realizada: malha aprovada.", responsavel: "Equipe CTQ" },
      { data: "22/10/2026", status: STATUS.ENTREGUE, descricao: "Malha entregue a Responsável (fictício). Pedido encerrado.", responsavel: "Equipe CTQ" }
    ]
  }
];
