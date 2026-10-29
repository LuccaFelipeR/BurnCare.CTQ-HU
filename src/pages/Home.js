import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import CardIndicador from "../components/CardIndicador";

export default function Home({ navigation }) {
  // Indicadores sem dados reais por enquanto
  const indicadores = [
    { titulo: "Pedidos em aberto", valor: 0 },
    { titulo: "Em produção", valor: 0 },
    { titulo: "Aguardando prova", valor: 0 },
    { titulo: "Concluídos", valor: 0 }
  ];

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

      <View style={estilos.cartao}>
        <Text style={estilos.cartaoTitulo}>
          Nenhum pedido disponível
        </Text>

        <Text style={estilos.descricao}>
          Os pedidos recentes serão exibidos aqui
          quando o sistema estiver integrado.
        </Text>
      </View>

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
        Ambiente demonstrativo — sem dados reais de pacientes.
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
