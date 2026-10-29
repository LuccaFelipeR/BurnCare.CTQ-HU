import { View, Text, StyleSheet } from "react-native";

export default function CardIndicador({ titulo, valor }) {
  return (
    <View style={estilos.cartao}>
      <Text style={estilos.valor}>
        {valor}
      </Text>

      <Text style={estilos.titulo}>
        {titulo}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
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

  titulo: {
    fontSize: 13,
    color: "#657888",
    marginTop: 8
  }
});
