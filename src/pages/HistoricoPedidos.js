
import { View, Text, StyleSheet } from "react-native";

export default function HistoricoPedidos() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>
        Histórico de pedidos
      </Text>

      <Text style={estilos.descricao}>
        Aqui serão exibidas as solicitações de malhas compressivas.
      </Text>

      <View style={estilos.cartao}>
        <Text style={estilos.mensagem}>
          Funcionalidade em desenvolvimento.
        </Text>

        <Text style={estilos.responsavel}>
          Módulo de acompanhamento de pedidos.
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#F4F8FA"
  },

  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#19384C"
  },

  descricao: {
    fontSize: 14,
    color: "#657888",
    marginTop: 10
  },

  cartao: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 12,
    marginTop: 25
  },

  mensagem: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#19384C"
  },

  responsavel: {
    fontSize: 13,
    color: "#657888",
    marginTop: 10
  }
});
