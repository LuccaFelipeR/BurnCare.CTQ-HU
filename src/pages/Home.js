import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import CardIndicador from "../components/CardIndicador";
import StatusBadge from "../components/acompanhamento/StatusBadge";
import { usePedidos } from "../context/PedidosContext";
import { calcularIndicadores } from "../data/acompanhamentoPedidos";

export default function Home({ navigation }) {
  const { pedidos } = usePedidos();
  const indicadores = calcularIndicadores(pedidos).map((indicador) =>
    indicador.titulo === "Em produção" ? { ...indicador, titulo: "Fornecedor e logística" } : indicador);
  const recentes = [...pedidos].sort((a, b) => b.dataPedido.split("/").reverse().join("").localeCompare(a.dataPedido.split("/").reverse().join("")) || b.id.localeCompare(a.id)).slice(0, 5);

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.conteudo}
      horizontal={false}
    >
      <Text style={estilos.titulo}>Visão geral</Text>

      <Text style={estilos.subtitulo}>
        Hospital Universitário de Londrina · CTQ
      </Text>

      <View style={estilos.destaque}>
        <Text style={estilos.destaqueTitulo}>
          Bem-vindo ao BurnCare
        </Text>

        <Text style={estilos.descricao}>
          Acompanhe as solicitações de malhas compressivas
          em um só lugar.
        </Text>
      </View>

      <Text style={estilos.secao}>Resumo dos pedidos</Text>

      <View style={estilos.indicadores}>
        {indicadores.map((indicador) => (
          <CardIndicador
            key={indicador.titulo}
            titulo={indicador.titulo}
            valor={indicador.valor}
          />
        ))}
      </View>

      <Text style={estilos.secao}>Pedidos recentes</Text>

      {recentes.length === 0 ? <View style={estilos.cartao}><Text style={estilos.cartaoTitulo}>Nenhum pedido disponível</Text></View> : recentes.map((pedido) => (
        <Pressable key={pedido.id} style={[estilos.cartao, { gap: 6 }]} onPress={() => navigation.navigate("Historico", { pedidoId: pedido.id })}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 6 }}>
            <Text style={estilos.cartaoTitulo}>{pedido.id} · {pedido.paciente}</Text><StatusBadge status={pedido.status} />
          </View>
          <Text style={estilos.descricao}>{pedido.produto} · {pedido.dataPedido}</Text>
        </Pressable>
      ))}

      <Text style={estilos.secao}>Acesso rápido</Text>

      <View style={estilos.acessos}>
        <Pressable
          style={estilos.botaoPrincipal}
          onPress={() => navigation.navigate("NovoPedido")}
        >
          <Text style={estilos.textoBotaoPrincipal}>
            + Novo pedido
          </Text>
        </Pressable>

        <Pressable
          style={estilos.botaoSecundario}
          onPress={() => navigation.navigate("Historico")}
        >
          <Text style={estilos.textoBotaoSecundario}>
            Ver histórico
          </Text>
        </Pressable>
      </View>

      <Text style={estilos.aviso}>
        Ambiente demonstrativo — dados fictícios, alterações apenas nesta sessão.
      </Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FA"
  },

  conteudo: {
    padding: 16,
    gap: 12
  },

  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#19384C"
  },

  subtitulo: {
    fontSize: 13,
    color: "#718696"
  },

  destaque: {
    backgroundColor: "#DDF3E9",
    padding: 25,
    borderRadius: 12,
    marginTop: 10
  },

  destaqueTitulo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#19384C"
  },

  descricao: {
    fontSize: 14,
    color: "#657888",
    marginTop: 8,
    lineHeight: 21
  },

  secao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#19384C",
    marginTop: 12
  },

  indicadores: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%"
  },

  indicador: {
    flexGrow: 1,
    flexBasis: 140,
    flexShrink: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 12,
    padding: 16
  },

  valor: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0C716B"
  },

  indicadorTitulo: {
    fontSize: 13,
    color: "#657888",
    marginTop: 8
  },

  cartao: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 12,
    padding: 22
  },

  cartaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#19384C"
  },

  acessos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },

  botaoPrincipal: {
    backgroundColor: "#0C716B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 150
  },

  textoBotaoPrincipal: {
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  botaoSecundario: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0C716B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 150
  },

  textoBotaoSecundario: {
    color: "#0C716B",
    fontWeight: "bold"
  },

  aviso: {
    color: "#718696",
    fontSize: 12,
    marginTop: 15
  }
});
