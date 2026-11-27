// Frente 6 — Acompanhamento, fornecedor, prova, ajustes e entrega.
// Responsável: Matheus Albertini
//
// ATENÇÃO: todos os dados abaixo são FICTÍCIOS.
// Não há backend nem persistência — as alterações ficam só na memória do app
// (ver storePedidos.js). Quando existir uma fonte de dados autorizada, basta trocar
// PEDIDOS_FICTICIOS pela consulta real e manter as funções de regra.
//
// Fluxo (README, frente 6):
//  Fornecedor: confirma recebimento -> produção -> postagem
//  CTQ: recebimento + conferência -> prova -> entrega com recibo + encaminhamento administrativo
//  Ajuste: mantém o MESMO pedido -> logística reversa ao fornecedor -> fornecedor reposta
//          -> nova conferência e nova prova
//
// CRUD dos registros:
//  Create: cada etapa registrada (aplicarAcao) e cada ajuste
//  Read:   lista, filtros, detalhe, ajustes e linha do tempo
//  Update: editarAjuste (descrição e novas medidas, enquanto o ajuste está em aberto)
//  Delete: desfazerUltimoRegistro / excluirAjuste (registro lançado por engano)

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
export const STATUS = {
  ENVIADO_CONFECCAO: "ENVIADO_CONFECCAO",
  EM_PRODUCAO: "EM_PRODUCAO",
  EM_TRANSPORTE: "EM_TRANSPORTE",
  AGUARDANDO_PROVA: "AGUARDANDO_PROVA",
  EM_AJUSTE: "EM_AJUSTE",
  AJUSTE_NO_FORNECEDOR: "AJUSTE_NO_FORNECEDOR",
  PRONTA_ENTREGA: "PRONTA_ENTREGA",
  ENTREGUE: "ENTREGUE"
};

export const INFO_STATUS = {
  ENVIADO_CONFECCAO: { rotulo: "Enviado à confecção", cor: "#5B6B7A", fundo: "#EEF2F5" },
  EM_PRODUCAO: { rotulo: "Em produção", cor: "#9A6200", fundo: "#FFF3DC" },
  EM_TRANSPORTE: { rotulo: "Em transporte", cor: "#2D5DA8", fundo: "#E5EEFB" },
  AGUARDANDO_PROVA: { rotulo: "Aguardando prova", cor: "#7A3FA0", fundo: "#F2E8F8" },
  EM_AJUSTE: { rotulo: "Ajuste: devolver ao fornecedor", cor: "#B03A2E", fundo: "#FBE6E3" },
  AJUSTE_NO_FORNECEDOR: { rotulo: "Ajuste no fornecedor", cor: "#B03A2E", fundo: "#FBE6E3" },
  PRONTA_ENTREGA: { rotulo: "Prova aprovada", cor: "#0C716B", fundo: "#DDF3E9" },
  ENTREGUE: { rotulo: "Entregue", cor: "#19384C", fundo: "#DDE8EE" }
};

export const ATOR = { CTQ: "CTQ", FORNECEDOR: "FORNECEDOR" };

export const FORNECEDORES = ["Fornecedor Exemplo 1", "Fornecedor Exemplo 2"];

// Filtros da visão do CTQ
export const FILTROS = [
  { chave: "TODOS", rotulo: "Todos", status: null },
  {
    chave: "ABERTOS",
    rotulo: "Em aberto",
    status: Object.values(STATUS).filter((s) => s !== STATUS.ENTREGUE)
  },
  {
    chave: "FORNECEDOR",
    rotulo: "No fornecedor",
    status: [STATUS.ENVIADO_CONFECCAO, STATUS.EM_PRODUCAO, STATUS.EM_TRANSPORTE, STATUS.AJUSTE_NO_FORNECEDOR]
  },
  { chave: "PROVA", rotulo: "Aguardando prova", status: [STATUS.AGUARDANDO_PROVA] },
  { chave: "AJUSTE", rotulo: "Ajustes", status: [STATUS.EM_AJUSTE, STATUS.AJUSTE_NO_FORNECEDOR] },
  { chave: "ENTREGA", rotulo: "Prontos p/ entrega", status: [STATUS.PRONTA_ENTREGA] },
  { chave: "CONCLUIDOS", rotulo: "Concluídos", status: [STATUS.ENTREGUE] }
];

// Status que aparecem como pendência no Portal do fornecedor
export const STATUS_PENDENTES_FORNECEDOR = [
  STATUS.ENVIADO_CONFECCAO,
  STATUS.EM_PRODUCAO,
  STATUS.AJUSTE_NO_FORNECEDOR
];

// ---------------------------------------------------------------------------
// Ações de cada status
// ---------------------------------------------------------------------------
// Campo: { nome, rotulo, tipo: "texto" | "data" | "opcoes" | "medidas", obrigatorio, opcoes?,
//          mostrarSe?: { campo, valor } }  -> só aparece (e só é exigido) nessa condição
// tipo "medidas": mostra cada medida atual do pedido para informar o novo valor
const CAMPO_DATA = (rotulo) => ({ nome: "data", rotulo, tipo: "data", obrigatorio: true });
const CAMPO_OBS = { nome: "observacao", rotulo: "Observação", tipo: "texto", obrigatorio: false };

export const ACOES = {
  ENVIADO_CONFECCAO: {
    ator: ATOR.FORNECEDOR,
    titulo: "Confirmar recebimento do pedido",
    descricao: "O fornecedor confirma que recebeu o pedido e as medidas.",
    aguardando: "Aguardando o fornecedor confirmar o recebimento do pedido.",
    botao: "Confirmar recebimento",
    campos: [
      CAMPO_DATA("Data da confirmação"),
      { nome: "previsao", rotulo: "Previsão de postagem (opcional)", tipo: "data", obrigatorio: false },
      CAMPO_OBS
    ]
  },
  EM_PRODUCAO: {
    ator: ATOR.FORNECEDOR,
    titulo: "Registrar postagem da malha",
    descricao: "Informe quando a malha foi postada para o HU.",
    aguardando: "Malha em produção no fornecedor. Aguardando postagem.",
    botao: "Registrar postagem",
    campos: [
      CAMPO_DATA("Data da postagem"),
      { nome: "rastreio", rotulo: "Código de rastreio / transportadora", tipo: "texto", obrigatorio: true },
      CAMPO_OBS
    ]
  },
  EM_TRANSPORTE: {
    ator: ATOR.CTQ,
    titulo: "Recebimento e conferência no CTQ",
    descricao: "Confirme a chegada e confira se a malha corresponde ao pedido.",
    botao: "Registrar recebimento",
    campos: [
      CAMPO_DATA("Data do recebimento"),
      { nome: "recebidoPor", rotulo: "Recebido por", tipo: "texto", obrigatorio: true },
      {
        nome: "conferencia",
        rotulo: "Conferência (produto, lado e tamanho)",
        tipo: "opcoes",
        obrigatorio: true,
        opcoes: [
          { valor: "CONFORME", rotulo: "Conforme o pedido" },
          { valor: "DIVERGENTE", rotulo: "Divergente (abrir ajuste)" }
        ]
      },
      {
        nome: "descricaoAjuste",
        rotulo: "Divergência encontrada",
        tipo: "texto",
        obrigatorio: true,
        mostrarSe: { campo: "conferencia", valor: "DIVERGENTE" }
      },
      CAMPO_OBS
    ]
  },
  AGUARDANDO_PROVA: {
    ator: ATOR.CTQ,
    titulo: "Registrar prova da malha",
    descricao: "Informe o resultado da prova no paciente.",
    botao: "Registrar prova",
    campos: [
      CAMPO_DATA("Data da prova"),
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
      {
        nome: "descricaoAjuste",
        rotulo: "Correção necessária",
        tipo: "texto",
        obrigatorio: true,
        mostrarSe: { campo: "resultado", valor: "AJUSTE" }
      },
      {
        nome: "novasMedidas",
        rotulo: "Novas medidas (preencha só as que mudaram)",
        tipo: "medidas",
        obrigatorio: false,
        mostrarSe: { campo: "resultado", valor: "AJUSTE" }
      },
      CAMPO_OBS
    ]
  },
  EM_AJUSTE: {
    ator: ATOR.CTQ,
    titulo: "Logística reversa: devolver ao fornecedor",
    descricao: "Registre o envio da malha de volta ao fornecedor para o ajuste.",
    botao: "Registrar devolução",
    campos: [
      CAMPO_DATA("Data do envio ao fornecedor"),
      { nome: "rastreio", rotulo: "Código de rastreio da devolução", tipo: "texto", obrigatorio: true },
      CAMPO_OBS
    ]
  },
  AJUSTE_NO_FORNECEDOR: {
    ator: ATOR.FORNECEDOR,
    titulo: "Registrar postagem da malha ajustada",
    descricao: "Informe quando a malha ajustada foi postada de volta ao HU.",
    aguardando: "Malha em ajuste no fornecedor. Aguardando postagem de retorno.",
    botao: "Registrar postagem do ajuste",
    campos: [
      CAMPO_DATA("Data da postagem"),
      { nome: "rastreio", rotulo: "Código de rastreio / transportadora", tipo: "texto", obrigatorio: true },
      CAMPO_OBS
    ]
  },
  PRONTA_ENTREGA: {
    ator: ATOR.CTQ,
    titulo: "Entrega ao paciente",
    descricao:
      "Registre a entrega, o recibo e o encaminhamento administrativo. " +
      "O BurnCare apenas registra o encaminhamento — não faz pagamento, lançamento ESTHOS nem emissão de OPM.",
    botao: "Registrar entrega e encerrar",
    campos: [
      CAMPO_DATA("Data da entrega"),
      { nome: "recebidoPor", rotulo: "Recebido por (paciente ou responsável)", tipo: "texto", obrigatorio: true },
      {
        nome: "recibo",
        rotulo: "Recibo de entrega",
        tipo: "opcoes",
        obrigatorio: true,
        opcoes: [{ valor: "ASSINADO", rotulo: "Recibo assinado" }]
      },
      { nome: "encaminhamento", rotulo: "Encaminhamento administrativo (setor/destino)", tipo: "texto", obrigatorio: true },
      { nome: "observacao", rotulo: "Orientações ao paciente / observação", tipo: "texto", obrigatorio: false }
    ]
  },
  ENTREGUE: null
};

export function campoVisivel(campo, dados) {
  if (!campo.mostrarSe) return true;
  return dados[campo.mostrarSe.campo] === campo.mostrarSe.valor;
}

// ---------------------------------------------------------------------------
// Datas (DD/MM/AAAA)
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

function dataParaNumero(texto) {
  const [dia, mes, ano] = texto.split("/");
  return Number(`${ano}${mes}${dia}`);
}

export function mascaraData(texto) {
  const numeros = (texto || "").replace(/\D/g, "").slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

// ---------------------------------------------------------------------------
// Medidas
// ---------------------------------------------------------------------------
const limpar = (v) => (v || "").trim();

// Compara as medidas atuais com as informadas e devolve só as que mudaram
export function alteracoesDeMedidas(medidasAtuais, novas) {
  return Object.entries(novas || {})
    .map(([nome, valor]) => ({ nome, antes: (medidasAtuais || {})[nome] || "—", depois: limpar(valor) }))
    .filter((m) => m.depois && m.depois !== m.antes);
}

function aplicarAlteracoes(medidas, alteracoes) {
  const resultado = { ...(medidas || {}) };
  alteracoes.forEach((m) => {
    resultado[m.nome] = m.depois;
  });
  return resultado;
}

export function textoAlteracoes(alteracoes) {
  return alteracoes.map((m) => `${m.nome}: ${m.antes} → ${m.depois}`).join("; ");
}

// ---------------------------------------------------------------------------
// Create — registrar a etapa atual
// ---------------------------------------------------------------------------
// Retorna a lista de erros (vazia = pode registrar).
export function validarAcao(pedido, dados, ator) {
  const acao = ACOES[pedido.status];
  if (!acao) return ["Este pedido já foi encerrado."];
  if (ator && acao.ator !== ator) {
    return [ator === ATOR.CTQ ? "Esta etapa é registrada pelo fornecedor." : "Esta etapa é registrada pelo CTQ."];
  }

  const erros = [];
  acao.campos.forEach((campo) => {
    if (!campoVisivel(campo, dados) || campo.tipo === "medidas") return;
    const valor = limpar(dados[campo.nome]);
    if (campo.obrigatorio && !valor) {
      erros.push(`Preencha: ${campo.rotulo}.`);
      return;
    }
    if (campo.tipo === "data" && valor && !dataValida(valor)) {
      erros.push(`${campo.rotulo}: use o formato DD/MM/AAAA.`);
    }
  });

  const ultimo = pedido.historico[pedido.historico.length - 1];
  if (ultimo && dataValida(dados.data) && dataValida(ultimo.data)) {
    if (dataParaNumero(dados.data) < dataParaNumero(ultimo.data)) {
      erros.push(`A data não pode ser anterior ao último registro (${ultimo.data}).`);
    }
  }
  return erros;
}

function novoAjuste(pedido, dados, origem, alteracoes) {
  return {
    numero: pedido.ajustes.length + 1,
    origem,
    descricao: limpar(dados.descricaoAjuste),
    alteracoesMedidas: alteracoes,
    dataSolicitacao: dados.data,
    envioFornecedor: null,
    dataRetorno: null
  };
}

function atualizarUltimoAjuste(pedido, alteracao) {
  return pedido.ajustes.map((a, i) => (i === pedido.ajustes.length - 1 ? { ...a, ...alteracao } : a));
}

// Aplica a ação do status atual e devolve um NOVO pedido (o original não é alterado).
// O pedido anterior fica guardado em "anterior" para permitir desfazer.
// Chamar só depois de validarAcao retornar lista vazia.
export function aplicarAcao(pedido, dados, responsavel) {
  const acao = ACOES[pedido.status];
  if (!acao) return pedido;

  const quem = responsavel || (acao.ator === ATOR.FORNECEDOR ? pedido.fornecedor : "Equipe CTQ");
  const obs = limpar(dados.observacao);
  let novoStatus = pedido.status;
  let descricao = "";
  let ajustes = pedido.ajustes;
  let medidas = pedido.medidas;
  let entrega = pedido.entrega || null;
  const ultimoAjuste = pedido.ajustes[pedido.ajustes.length - 1];

  switch (pedido.status) {
    case STATUS.ENVIADO_CONFECCAO:
      novoStatus = STATUS.EM_PRODUCAO;
      descricao = "Fornecedor confirmou o recebimento do pedido. Malha em produção.";
      if (limpar(dados.previsao)) descricao += ` Previsão de postagem: ${dados.previsao}.`;
      break;

    case STATUS.EM_PRODUCAO:
      novoStatus = STATUS.EM_TRANSPORTE;
      descricao = `Malha postada pelo fornecedor. Rastreio: ${limpar(dados.rastreio)}.`;
      break;

    case STATUS.EM_TRANSPORTE:
      if (dados.conferencia === "DIVERGENTE") {
        novoStatus = STATUS.EM_AJUSTE;
        const ajuste = novoAjuste(pedido, dados, "Conferência", []);
        ajustes = [...pedido.ajustes, ajuste];
        descricao = `Malha recebida por ${limpar(dados.recebidoPor)}. Conferência divergente — ajuste nº ${ajuste.numero}: ${ajuste.descricao}.`;
      } else {
        novoStatus = STATUS.AGUARDANDO_PROVA;
        descricao = `Malha recebida por ${limpar(dados.recebidoPor)}. Conferência conforme o pedido.`;
        if (ultimoAjuste && !ultimoAjuste.dataRetorno && ultimoAjuste.envioFornecedor) {
          ajustes = atualizarUltimoAjuste(pedido, { dataRetorno: dados.data });
          descricao += ` Retorno do ajuste nº ${ultimoAjuste.numero}.`;
        }
      }
      break;

    case STATUS.AGUARDANDO_PROVA:
      if (dados.resultado === "AJUSTE") {
        novoStatus = STATUS.EM_AJUSTE;
        const alteracoes = alteracoesDeMedidas(pedido.medidas, dados.novasMedidas);
        const ajuste = novoAjuste(pedido, dados, "Prova", alteracoes);
        ajustes = [...pedido.ajustes, ajuste];
        medidas = aplicarAlteracoes(pedido.medidas, alteracoes);
        descricao = `Prova realizada: precisa de ajuste (nº ${ajuste.numero}): ${ajuste.descricao}.`;
        if (alteracoes.length) descricao += ` Novas medidas: ${textoAlteracoes(alteracoes)}.`;
      } else {
        novoStatus = STATUS.PRONTA_ENTREGA;
        descricao = "Prova realizada: malha aprovada.";
      }
      break;

    case STATUS.EM_AJUSTE:
      novoStatus = STATUS.AJUSTE_NO_FORNECEDOR;
      ajustes = atualizarUltimoAjuste(pedido, {
        envioFornecedor: { data: dados.data, rastreio: limpar(dados.rastreio) }
      });
      descricao = `Logística reversa: malha devolvida ao fornecedor para ajuste. Rastreio: ${limpar(dados.rastreio)}.`;
      break;

    case STATUS.AJUSTE_NO_FORNECEDOR:
      novoStatus = STATUS.EM_TRANSPORTE;
      descricao = `Malha ajustada postada pelo fornecedor. Rastreio: ${limpar(dados.rastreio)}.`;
      break;

    case STATUS.PRONTA_ENTREGA:
      novoStatus = STATUS.ENTREGUE;
      entrega = {
        data: dados.data,
        recebidoPor: limpar(dados.recebidoPor),
        reciboAssinado: dados.recibo === "ASSINADO",
        encaminhamento: limpar(dados.encaminhamento),
        orientacoes: obs
      };
      descricao = `Malha entregue a ${entrega.recebidoPor} com recibo assinado. Encaminhamento administrativo: ${entrega.encaminhamento}. Pedido encerrado.`;
      break;

    default:
      return pedido;
  }

  const extra = obs && pedido.status !== STATUS.PRONTA_ENTREGA ? ` Obs.: ${obs}` : "";

  return {
    ...pedido,
    status: novoStatus,
    ajustes,
    medidas,
    entrega,
    anterior: pedido,
    historico: [
      ...pedido.historico,
      { data: dados.data, status: novoStatus, descricao: descricao + extra, responsavel: quem, ator: acao.ator }
    ]
  };
}

// ---------------------------------------------------------------------------
// Update — editar ajuste
// ---------------------------------------------------------------------------
// Só o CTQ edita, e só enquanto o ajuste está em aberto (ainda não retornou do fornecedor).
export function podeEditarAjuste(pedido, numero) {
  const ajuste = pedido.ajustes.find((a) => a.numero === numero);
  return Boolean(ajuste) && !ajuste.dataRetorno && pedido.status !== STATUS.ENTREGUE;
}

export function validarEdicaoAjuste(pedido, numero, dados) {
  if (!podeEditarAjuste(pedido, numero)) return ["Este ajuste já foi concluído e não pode ser editado."];
  if (!limpar(dados.descricao)) return ["Preencha: descrição do ajuste."];
  return [];
}

// dados = { descricao, medidas: { nome: novoValor } }
// As novas medidas são recalculadas a partir das medidas de ANTES do ajuste.
export function editarAjuste(pedido, numero, dados) {
  const editar = (p) => {
    if (!p) return p;
    const ajuste = p.ajustes.find((a) => a.numero === numero);
    if (!ajuste) return p; // snapshots anteriores à criação do ajuste ficam como estão

    const medidasAntes = { ...p.medidas };
    ajuste.alteracoesMedidas.forEach((m) => {
      medidasAntes[m.nome] = m.antes === "—" ? undefined : m.antes;
    });
    Object.keys(medidasAntes).forEach((k) => medidasAntes[k] === undefined && delete medidasAntes[k]);

    const alteracoes = dados.medidas
      ? alteracoesDeMedidas(medidasAntes, dados.medidas)
      : ajuste.alteracoesMedidas;

    return {
      ...p,
      medidas: aplicarAlteracoes(medidasAntes, alteracoes),
      ajustes: p.ajustes.map((a) =>
        a.numero === numero ? { ...a, descricao: limpar(dados.descricao), alteracoesMedidas: alteracoes } : a
      ),
      anterior: editar(p.anterior)
    };
  };
  return editar(pedido);
}

// ---------------------------------------------------------------------------
// Delete — desfazer o último registro / excluir ajuste
// ---------------------------------------------------------------------------
// Cada lado só desfaz o próprio último registro.
export function podeDesfazer(pedido, ator) {
  const ultimo = pedido.historico[pedido.historico.length - 1];
  return Boolean(pedido.anterior) && Boolean(ultimo) && ultimo.ator === ator;
}

export function desfazerUltimoRegistro(pedido, ator) {
  if (!podeDesfazer(pedido, ator)) return pedido;
  return pedido.anterior;
}

// Um ajuste só pode ser excluído enquanto ainda não foi devolvido ao fornecedor
// (é o último registro do pedido). Excluir = desfazer o registro que abriu o ajuste.
export function podeExcluirAjuste(pedido, numero) {
  const ultimo = pedido.ajustes[pedido.ajustes.length - 1];
  return (
    pedido.status === STATUS.EM_AJUSTE &&
    Boolean(ultimo) &&
    ultimo.numero === numero &&
    !ultimo.envioFornecedor &&
    podeDesfazer(pedido, ATOR.CTQ)
  );
}

export function excluirAjuste(pedido, numero) {
  if (!podeExcluirAjuste(pedido, numero)) return pedido;
  return pedido.anterior;
}

// ---------------------------------------------------------------------------
// Read — busca, filtros e visão do fornecedor
// ---------------------------------------------------------------------------
export function filtrarPedidos(pedidos, chaveFiltro, busca) {
  const filtro = FILTROS.find((f) => f.chave === chaveFiltro) || FILTROS[0];
  const termo = limpar(busca).toLowerCase();
  return pedidos.filter((p) => {
    const passaStatus = !filtro.status || filtro.status.includes(p.status);
    const passaBusca =
      !termo ||
      p.paciente.toLowerCase().includes(termo) ||
      p.id.toLowerCase().includes(termo) ||
      p.prontuario.toLowerCase().includes(termo);
    return passaStatus && passaBusca;
  });
}

export function contarPorFiltro(pedidos, chaveFiltro) {
  return filtrarPedidos(pedidos, chaveFiltro, "").length;
}

// Visão do fornecedor: SÓ os dados necessários à confecção (sem nome, prontuário ou histórico clínico)
export function pedidoParaFornecedor(pedido) {
  const ultimoAjuste = pedido.ajustes[pedido.ajustes.length - 1] || null;
  return {
    id: pedido.id,
    status: pedido.status,
    tipo: pedido.tipo,
    regiao: pedido.regiao,
    produto: pedido.produto,
    dataPedido: pedido.dataPedido,
    medidas: pedido.medidas,
    ajusteAtual:
      pedido.status === STATUS.AJUSTE_NO_FORNECEDOR && ultimoAjuste
        ? {
            numero: ultimoAjuste.numero,
            descricao: ultimoAjuste.descricao,
            alteracoesMedidas: ultimoAjuste.alteracoesMedidas
          }
        : null,
    // Linha do tempo só com eventos de confecção/logística (sem prova, conferência ou entrega)
    historico: pedido.historico.filter((h) =>
      [STATUS.ENVIADO_CONFECCAO, STATUS.EM_PRODUCAO, STATUS.EM_TRANSPORTE, STATUS.AJUSTE_NO_FORNECEDOR].includes(h.status)
    )
  };
}

export function pedidosDoFornecedor(pedidos, fornecedor, somentePendentes) {
  return pedidos
    .filter((p) => p.fornecedor === fornecedor)
    .filter((p) => !somentePendentes || STATUS_PENDENTES_FORNECEDOR.includes(p.status))
    .map(pedidoParaFornecedor);
}

// Para a Home: indicadores da Visão Geral
export function calcularIndicadores(pedidos) {
  const contar = (lista) => pedidos.filter((p) => lista.includes(p.status)).length;
  return [
    { titulo: "Pedidos em aberto", valor: pedidos.filter((p) => p.status !== STATUS.ENTREGUE).length },
    {
      titulo: "Em produção",
      valor: contar([STATUS.ENVIADO_CONFECCAO, STATUS.EM_PRODUCAO, STATUS.EM_TRANSPORTE, STATUS.AJUSTE_NO_FORNECEDOR])
    },
    { titulo: "Aguardando prova", valor: contar([STATUS.AGUARDANDO_PROVA]) },
    { titulo: "Concluídos", valor: contar([STATUS.ENTREGUE]) }
  ];
}

// ---------------------------------------------------------------------------
// Contrato com o Novo Pedido (frentes 2 a 5)
// ---------------------------------------------------------------------------
// Ao final da Conferência, o Novo Pedido pode chamar registrarNovoPedido (storePedidos.js)
// passando este objeto. Cada produto selecionado vira UM pedido de malha.
//
// {
//   identificacao: { nome, prontuario, tipoSolicitacao },   // IdentificacaoForm (Abel / Ana Júlia)
//   regiao: "Membro superior direito",                      // mapa corporal (Ana Fernandes)
//   produtos: [{ descricao: "Luvas com dedos até o punho (mão direita)" }], // catálogo
//   medidas: { "Circunferência do Punho": "16" },           // MedidasEAnexos (Ana Mantella)
//   fornecedor: "Fornecedor Exemplo 1",                     // opcional
//   data: "26/11/2026"                                      // opcional (padrão: hoje)
// }
export function criarPedidosDoNovoPedido(dados, pedidosExistentes = []) {
  const identificacao = dados.identificacao || {};
  const data = dataValida(dados.data) ? dados.data : dataHoje();
  const ano = data.slice(-4);
  const produtos = dados.produtos && dados.produtos.length ? dados.produtos : [{ descricao: "Produto não informado" }];

  let sequencia = pedidosExistentes
    .map((p) => Number((p.id.match(/-(\d+)$/) || [])[1] || 0))
    .reduce((maior, n) => Math.max(maior, n), 0);

  return produtos.map((produto) => {
    sequencia += 1;
    return {
      id: `BC-${ano}-${String(sequencia).padStart(3, "0")}`,
      paciente: limpar(identificacao.nome) || "Paciente não informado",
      prontuario: limpar(identificacao.prontuario) || "—",
      tipo: identificacao.tipoSolicitacao === "Segunda malha" ? "2ª malha" : "1ª malha",
      regiao: dados.regiao || "—",
      produto: produto.descricao,
      fornecedor: dados.fornecedor || FORNECEDORES[0],
      dataPedido: data,
      medidas: { ...(dados.medidas || {}) },
      status: STATUS.ENVIADO_CONFECCAO,
      ajustes: [],
      entrega: null,
      anterior: null,
      historico: [
        {
          data,
          status: STATUS.ENVIADO_CONFECCAO,
          descricao: "Pedido conferido e enviado à confecção.",
          responsavel: "Equipe CTQ",
          ator: ATOR.CTQ
        }
      ]
    };
  });
}

// ---------------------------------------------------------------------------
// Dados FICTÍCIOS — gerados pelas próprias regras (assim tudo pode ser desfeito)
// ---------------------------------------------------------------------------
const F1 = "Fornecedor Exemplo 1";
const F2 = "Fornecedor Exemplo 2";
const ENF = "Enfermagem (fictício)";

function construir(base, passos) {
  let pedido = {
    ...base,
    status: STATUS.ENVIADO_CONFECCAO,
    ajustes: [],
    entrega: null,
    anterior: null,
    historico: [
      {
        data: base.dataPedido,
        status: STATUS.ENVIADO_CONFECCAO,
        descricao: "Pedido conferido e enviado à confecção.",
        responsavel: "Equipe CTQ",
        ator: ATOR.CTQ
      }
    ]
  };
  passos.forEach((dados) => {
    const erros = validarAcao(pedido, dados);
    if (erros.length) throw new Error(`Dado fictício inválido em ${base.id}: ${erros.join(" ")}`);
    pedido = aplicarAcao(pedido, dados);
  });
  return pedido;
}

const recebeu = (data, extra = {}) => ({ data, recebidoPor: ENF, conferencia: "CONFORME", ...extra });

export const PEDIDOS_FICTICIOS = [
  construir(
    {
      id: "BC-2026-001", paciente: "Paciente Fictício A", prontuario: "FIC-0001", tipo: "1ª malha",
      regiao: "Membro superior direito", produto: "Luva com dedos até o punho", fornecedor: F1, dataPedido: "03/11/2026",
      medidas: { "Circunferência do Punho": "16 cm", "Circunferência da Palma": "20 cm", "Comprimento total da luva": "24 cm" }
    },
    []
  ),
  construir(
    {
      id: "BC-2026-002", paciente: "Paciente Fictício B", prontuario: "FIC-0002", tipo: "1ª malha",
      regiao: "Tronco", produto: "Colete compressivo", fornecedor: F2, dataPedido: "28/10/2026",
      medidas: { "Tórax": "92 cm", "Cintura": "84 cm", "Altura do tronco": "48 cm" }
    },
    [{ data: "30/10/2026" }]
  ),
  construir(
    {
      id: "BC-2026-003", paciente: "Paciente Fictício C", prontuario: "FIC-0003", tipo: "2ª malha",
      regiao: "Face", produto: "Máscara facial", fornecedor: F1, dataPedido: "20/10/2026",
      medidas: { "Circunferência da cabeça": "56 cm", "Queixo ao topo": "23 cm" }
    },
    [{ data: "22/10/2026" }, { data: "10/11/2026", rastreio: "EX000000003BR" }]
  ),
  construir(
    {
      id: "BC-2026-004", paciente: "Paciente Fictício D", prontuario: "FIC-0004", tipo: "1ª malha",
      regiao: "Membro inferior esquerdo", produto: "Meia até o joelho", fornecedor: F2, dataPedido: "15/10/2026",
      medidas: { "Tornozelo": "22 cm", "Panturrilha": "34 cm", "Abaixo do joelho": "33 cm" }
    },
    [{ data: "16/10/2026" }, { data: "05/11/2026", rastreio: "EX000000004BR" }, recebeu("12/11/2026")]
  ),
  construir(
    {
      id: "BC-2026-005", paciente: "Paciente Fictício E", prontuario: "FIC-0005", tipo: "1ª malha",
      regiao: "Pescoço", produto: "Colar cervical compressivo", fornecedor: F1, dataPedido: "01/10/2026",
      medidas: { "Circunferência do pescoço": "38 cm", "Altura do colar": "9 cm" }
    },
    [
      { data: "03/10/2026" },
      { data: "28/10/2026", rastreio: "EX000000005BR" },
      recebeu("04/11/2026"),
      {
        data: "14/11/2026", resultado: "AJUSTE",
        descricaoAjuste: "Reduzir circunferência na base do pescoço",
        novasMedidas: { "Circunferência do pescoço": "36 cm" }
      }
    ]
  ),
  construir(
    {
      id: "BC-2026-006", paciente: "Paciente Fictício F", prontuario: "FIC-0006", tipo: "2ª malha",
      regiao: "Membro superior esquerdo", produto: "Meio cano de braço esquerdo", fornecedor: F2, dataPedido: "25/09/2026",
      medidas: { "Punho": "16 cm", "Antebraço": "23 cm", "Braço": "28 cm" }
    },
    [
      { data: "27/09/2026" },
      { data: "20/10/2026", rastreio: "EX000000006BR" },
      recebeu("27/10/2026"),
      { data: "18/11/2026", resultado: "APROVADA" }
    ]
  ),
  construir(
    {
      id: "BC-2026-007", paciente: "Paciente Fictício G", prontuario: "FIC-0007", tipo: "1ª malha",
      regiao: "Tronco", produto: "Body compressivo", fornecedor: F1, dataPedido: "02/09/2026",
      medidas: { "Tórax": "88 cm", "Cintura": "76 cm", "Quadril": "94 cm" }
    },
    [
      { data: "04/09/2026" },
      { data: "25/09/2026", rastreio: "EX000000007BR" },
      recebeu("30/09/2026"),
      { data: "06/10/2026", resultado: "AJUSTE", descricaoAjuste: "Alongar alças em 2 cm" },
      { data: "07/10/2026", rastreio: "EX000000071BR" },
      { data: "17/10/2026", rastreio: "EX000000072BR" },
      recebeu("20/10/2026"),
      { data: "22/10/2026", resultado: "APROVADA" },
      {
        data: "22/10/2026", recebidoPor: "Responsável (fictício)", recibo: "ASSINADO",
        encaminhamento: "Setor administrativo do CTQ (fictício)", observacao: "Usar 23 h por dia."
      }
    ]
  ),
  construir(
    {
      id: "BC-2026-008", paciente: "Paciente Fictício H", prontuario: "FIC-0008", tipo: "1ª malha",
      regiao: "Membro inferior direito", produto: "Meia ¾ direita", fornecedor: F2, dataPedido: "10/10/2026",
      medidas: { "Tornozelo": "23 cm", "Panturrilha": "36 cm", "Coxa": "52 cm" }
    },
    [
      { data: "12/10/2026" },
      { data: "30/10/2026", rastreio: "EX000000008BR" },
      recebeu("06/11/2026", { conferencia: "DIVERGENTE", descricaoAjuste: "Malha recebida com lado trocado (esquerdo)" }),
      { data: "07/11/2026", rastreio: "EX000000081BR" }
    ]
  )
];
