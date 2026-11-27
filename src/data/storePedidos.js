// Store simples dos pedidos de malha, compartilhado entre as telas.
// Responsável: Matheus Albertini
//
// Fica só na MEMÓRIA do app (some ao recarregar). Não é banco de dados.
// Serve para o Histórico, a Home e o Novo Pedido enxergarem os mesmos pedidos
// sem precisar alterar App.js nem a navegação.
//
// Uso em qualquer tela:
//   import { usePedidos, registrarNovoPedido } from "../data/storePedidos";
//   const pedidos = usePedidos();                    // lista atualizada automaticamente
//   registrarNovoPedido({ identificacao, regiao, produtos, medidas }); // no fim do Novo Pedido
//
// Na Home (indicadores reais):
//   import { calcularIndicadores } from "../data/acompanhamentoPedidos";
//   const indicadores = calcularIndicadores(usePedidos());

import { useSyncExternalStore } from "react";
import { PEDIDOS_FICTICIOS, criarPedidosDoNovoPedido } from "./acompanhamentoPedidos";

let pedidos = PEDIDOS_FICTICIOS;
const ouvintes = new Set();

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function inscrever(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function obterPedidos() {
  return pedidos;
}

export function usePedidos() {
  return useSyncExternalStore(inscrever, obterPedidos, obterPedidos);
}

// Substitui um pedido aplicando uma função (pedido) => novoPedido
export function atualizarPedido(id, transformar) {
  pedidos = pedidos.map((p) => (p.id === id ? transformar(p) : p));
  avisar();
}

// Chamado pelo Novo Pedido ao concluir a Conferência. Retorna os pedidos criados.
export function registrarNovoPedido(dadosDoNovoPedido) {
  const novos = criarPedidosDoNovoPedido(dadosDoNovoPedido, pedidos);
  pedidos = [...novos, ...pedidos];
  avisar();
  return novos;
}

// Volta aos dados fictícios iniciais (útil para apresentação)
export function reiniciarDemonstracao() {
  pedidos = PEDIDOS_FICTICIOS;
  avisar();
}
