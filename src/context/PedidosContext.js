import { createContext, useContext, useState } from "react";
import { PEDIDOS_FICTICIOS } from "../data/acompanhamentoPedidos";
import { FORNECEDORES_DEMO, nomeFornecedorLegado, validarFornecedor } from "../data/fornecedores";

const PedidosContext = createContext(null);

export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useState(() => PEDIDOS_FICTICIOS.map((p) => ({ ...p, fornecedor: nomeFornecedorLegado(p.fornecedor) })));
  const [fornecedores, setFornecedores] = useState(() => FORNECEDORES_DEMO.map((f) => ({ ...f })));
  const [sessaoEmail, setSessaoEmail] = useState(null);
  function salvarFornecedor(dados) {
    const anterior = fornecedores.find((f) => f.id === dados.id);
    // Nome estável: o modelo de acompanhamento existente usa o nome como vínculo.
    const registro = { ...dados, nome: anterior?.nome ?? String(dados.nome ?? '').trim(), email: String(dados.email ?? '').trim().toLowerCase(), contato: String(dados.contato ?? '').trim(), telefone: String(dados.telefone ?? '').trim() };
    const erros = validarFornecedor(registro, fornecedores);
    if (erros.length) return erros;
    registro.id = anterior?.id ?? `fornecedor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setFornecedores((lista) => anterior ? lista.map((f) => f.id === registro.id ? registro : f) : [...lista, registro]);
    return [];
  }
  return <PedidosContext.Provider value={{ pedidos, setPedidos, fornecedores, salvarFornecedor, sessaoEmail, setSessaoEmail }}>{children}</PedidosContext.Provider>;
}
export function usePedidos() {
  const contexto = useContext(PedidosContext);
  if (!contexto) throw new Error("usePedidos requer PedidosProvider");
  return contexto;
}
