import { createContext, useContext, useState } from "react";
import { FORNECEDORES_INICIAIS, gerarIdFornecedor } from "../data/fornecedores";
import { usePedidos } from "./PedidosContext";

// Cadastro de fornecedores em memória (somente nesta sessão).
// Quando houver backend autorizado, troque o useState por consultas ao banco
// (ex.: tabela "fornecedores" no Supabase) mantendo a mesma interface.
const FornecedoresContext = createContext(null);

export function FornecedoresProvider({ children }) {
  const { setPedidos } = usePedidos();
  const [fornecedores, setFornecedores] = useState(() =>
    FORNECEDORES_INICIAIS.map((f) => ({ ...f }))
  );

  // Cria ou atualiza. Se o nome mudar, os pedidos existentes acompanham a mudança
  // (os pedidos guardam o nome do fornecedor).
  function salvarFornecedor(dados) {
    const limpo = Object.fromEntries(
      Object.entries(dados).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );
    if (!limpo.id) {
      const novo = { ...limpo, id: gerarIdFornecedor(limpo.nome) };
      setFornecedores((lista) => [...lista, novo]);
      return novo;
    }
    const anterior = fornecedores.find((f) => f.id === limpo.id);
    setFornecedores((lista) => lista.map((f) => (f.id === limpo.id ? { ...f, ...limpo } : f)));
    if (anterior && anterior.nome !== limpo.nome) {
      setPedidos((pedidos) =>
        pedidos.map((p) => (p.fornecedor === anterior.nome ? { ...p, fornecedor: limpo.nome } : p))
      );
    }
    return limpo;
  }

  function alternarAtivo(id) {
    setFornecedores((lista) => lista.map((f) => (f.id === id ? { ...f, ativo: !f.ativo } : f)));
  }

  const fornecedorPorNome = (nome) => fornecedores.find((f) => f.nome === nome) ?? null;

  return (
    <FornecedoresContext.Provider
      value={{ fornecedores, salvarFornecedor, alternarAtivo, fornecedorPorNome }}
    >
      {children}
    </FornecedoresContext.Provider>
  );
}

export function useFornecedores() {
  const contexto = useContext(FornecedoresContext);
  if (!contexto) throw new Error("useFornecedores requer FornecedoresProvider");
  return contexto;
}
