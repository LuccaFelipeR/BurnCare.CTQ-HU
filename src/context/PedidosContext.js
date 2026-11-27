import { createContext, useContext, useState } from "react";
import { PEDIDOS_FICTICIOS } from "../data/acompanhamentoPedidos";

const PedidosContext = createContext(null);

export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useState(() => [...PEDIDOS_FICTICIOS]);
  return <PedidosContext.Provider value={{ pedidos, setPedidos }}>{children}</PedidosContext.Provider>;
}

export function usePedidos() {
  const contexto = useContext(PedidosContext);
  if (!contexto) throw new Error("usePedidos requer PedidosProvider");
  return contexto;
}
