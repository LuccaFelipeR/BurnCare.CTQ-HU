// Contrato demonstrativo entre Novo Pedido, Histórico e Portal do fornecedor.
import { STATUS, FORNECEDORES, dataHoje } from "./acompanhamentoPedidos";
import { gabaritoDoProduto, medidaNumerica, validarMedidasProdutos } from "./gabaritosMedidas";

export const novoDadosMedidas = () => ({ fichas: {}, fotos: [], termoConferido: false });
export const novaIdentificacao = () => ({ tipoSolicitacao: "Primeira malha" });

export function validarIdentificacao(formData) {
  const erros = [];
  if (!String(formData.nome ?? "").trim()) erros.push("Informe o nome fictício do paciente.");
  if (!String(formData.prontuario ?? "").trim()) erros.push("Informe o prontuário demonstrativo.");
  if (!["Primeira malha", "Segunda malha"].includes(formData.tipoSolicitacao)) erros.push("Selecione o tipo de solicitação.");
  return erros;
}

export function validarSelecao(regioes, produtos) {
  const erros = [];
  if (!regioes.length) erros.push("Selecione uma região anatômica.");
  if (!produtos.length) erros.push("Selecione pelo menos um produto.");
  return erros;
}

export function validarPedido({ formData, regioes, produtos, dadosMedidas, fornecedor }) {
  return [...validarIdentificacao(formData), ...validarSelecao(regioes, produtos),
    ...validarMedidasProdutos(produtos, dadosMedidas),
    ...(!FORNECEDORES.includes(fornecedor) ? ["Escolha um fornecedor demonstrativo."] : [])];
}

export function criarPedidoDemonstrativo(dados, pedidos, hoje = dataHoje()) {
  const erros = validarPedido(dados);
  if (erros.length) throw new Error(erros.join("\n"));
  const { formData, regioes, produtos, dadosMedidas, fornecedor, justificativa } = dados;
  const ano = hoje.split("/")[2];
  const prefixo = `BC-${ano}-`;
  const maior = pedidos.reduce((max, p) => {
    if (!p.id.startsWith(prefixo)) return max;
    const numero = Number(p.id.slice(prefixo.length));
    return Number.isSafeInteger(numero) && numero >= 0 ? Math.max(max, numero) : max;
  }, 0);
  const id = `${prefixo}${String(maior + 1).padStart(3, "0")}`;
  const fichas = produtos.map((produto) => {
    const ficha = dadosMedidas.fichas[produto.id];
    const medidas = Object.fromEntries(gabaritoDoProduto(produto.id).fields
      .filter((nome) => medidaNumerica(ficha.medidas?.[nome]) !== null)
      .map((nome) => [nome, `${medidaNumerica(ficha.medidas[nome])} cm`]));
    return { ...produto, modelo: ficha.modelo ?? "", medidas };
  });
  // Campos planos mantêm a compatibilidade com PortalFornecedor e ReciboEntrega.
  // O prefixo do produto impede confundir medidas entre peças distintas.
  const medidas = Object.fromEntries(fichas.flatMap((ficha) => [
    ...Object.entries(ficha.medidas).map(([nome, valor]) => [`${ficha.descricao} · ${nome}`, valor]),
    ...(ficha.modelo ? [[`${ficha.descricao} · Acabamento`, ficha.modelo]] : []),
  ]));
  return {
    id, paciente: formData.nome.trim(), prontuario: formData.prontuario.trim(),
    tipo: formData.tipoSolicitacao === "Segunda malha" ? "2ª malha" : "1ª malha",
    regiao: regioes.map((r) => `${r.nome} (${r.vista === "frente" ? "frente" : "costas"})`).join("; "),
    produto: produtos.map((p) => p.descricao).join("; "),
    fornecedor, dataPedido: hoje, medidas, fichas,
    identificacao: { ...formData }, justificativa: justificativa ?? "",
    termoConferido: Boolean(dadosMedidas.termoConferido), fotos: [...dadosMedidas.fotos],
    status: STATUS.ENVIADO_CONFECCAO, ajustes: [], entrega: null,
    historico: [{ data: hoje, status: STATUS.ENVIADO_CONFECCAO,
      descricao: "Pedido fictício registrado nesta sessão. Encaminhamento à confecção apenas simulado, sem envio externo.", responsavel: "Equipe CTQ (simulação)" }],
  };
}
