
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

export default function Home({ navigation }) {
  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.conteudo}
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
          Sistema de acompanhamento de solicitações
          de malhas compressivas.
        </Text>
      </View>

      <Text style={estilos.secao}>Acesso rápido</Text>

      <Pressable
        style={estilos.cartao}
        onPress={() => navigation.navigate("NovoPedido")}
      >
        <Text style={estilos.cartaoTitulo}>
          + Novo pedido
        </Text>
        <Text style={estilos.descricao}>
          Iniciar uma nova solicitação de malha.
        </Text>
      </Pressable>

      <Pressable
        style={estilos.cartao}
        onPress={() => navigation.navigate("Historico")}
      >
        <Text style={estilos.cartaoTitulo}>
          Histórico de pedidos
        </Text>
        <Text style={estilos.descricao}>
          Acompanhar solicitações e seus status.
        </Text>
      </Pressable>

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
    padding: 25,
    gap: 15
  },

  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#19384C"
  },

  subtitulo: {
    color: "#718696",
    fontSize: 13
  },

  destaque: {
    backgroundColor: "#DDF3E9",
    padding: 25,
    borderRadius: 12,
    marginTop: 15
  },

  destaqueTitulo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#19384C"
  },

  descricao: {
    color: "#657888",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21
  },

  secao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#19384C",
    marginTop: 12
  },

  cartao: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE8EE"
  },

  cartaoTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0C716B"
  },

  aviso: {
    color: "#718696",
    fontSize: 12,
    marginTop: 15
  }
});
