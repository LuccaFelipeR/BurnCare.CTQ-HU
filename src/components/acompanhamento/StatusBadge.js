import { View, Text, StyleSheet } from "react-native";
import { INFO_STATUS } from "../../data/acompanhamentoPedidos";

// Etiqueta colorida com o status do pedido
export default function StatusBadge({ status }) {
  const info = INFO_STATUS[status] || { rotulo: status, cor: "#19384C", fundo: "#DDE8EE" };

  return (
    <View style={[estilos.badge, { backgroundColor: info.fundo }]}>
      <Text style={[estilos.texto, { color: info.cor }]}>{info.rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20
  },

  texto: {
    fontSize: 12,
    fontWeight: "bold"
  }
});
