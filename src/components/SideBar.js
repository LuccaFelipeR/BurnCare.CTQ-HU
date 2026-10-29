
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

export default function Sidebar({
  paginaAtual,
  onNavegar,
  telaPequena
}) {
  const menus = [
    { nome: "VisaoGeral", titulo: "Visão geral" },
    { nome: "NovoPedido", titulo: "Novo pedido" },
    { nome: "Historico", titulo: "Histórico de pedidos" }
  ];

  return (
    <View style={[
      estilos.sidebar,
      telaPequena && estilos.sidebarMobile
    ]}>
      <Text style={estilos.logo}>✚ BurnCare</Text>

      {!telaPequena && (
        <Text style={estilos.identificacao}>
          CTQ · HOSPITAL UNIVERSITÁRIO
        </Text>
      )}

      <ScrollView
        horizontal={telaPequena}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          estilos.menu,
          telaPequena && estilos.menuMobile
        ]}
      >
        {menus.map((menu) => (
          <Pressable
            key={menu.nome}
            onPress={() => onNavegar(menu.nome)}
            style={[
              estilos.botao,
              paginaAtual === menu.nome && estilos.botaoAtivo
            ]}
          >
            <Text style={estilos.textoMenu}>
              {menu.titulo}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  sidebar: {
    width: 246,
    backgroundColor: "#19384C",
    padding: 20
  },

  sidebarMobile: {
    width: "100%",
    padding: 12
  },

  logo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12
  },

  identificacao: {
    color: "#B5D2DA",
    fontSize: 11,
    marginBottom: 30
  },

  menu: {
    gap: 10
  },

  menuMobile: {
    flexDirection: "row"
  },

  botao: {
    padding: 13,
    borderRadius: 8
  },

  botaoAtivo: {
    backgroundColor: "#0C716B"
  },

  textoMenu: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13
  }
});
