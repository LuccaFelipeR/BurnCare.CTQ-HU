
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

export default function Sidebar({ paginaAtual, onNavegar, telaPequena }) {
  const menus = [
    { nome: "VisaoGeral", titulo: "Visão geral" },
    { nome: "NovoPedido", titulo: "Novo pedido" },
    { nome: "Historico", titulo: "Histórico" }
  ];

  return (
    <View style={[estilos.sidebar, telaPequena && estilos.sidebarMobile]}>
      <Text style={[estilos.logo, telaPequena && estilos.logoMobile]}>
        ✚ BurnCare
      </Text>

      {!telaPequena && (
        <Text style={estilos.identificacao}>
          CTQ · HOSPITAL UNIVERSITÁRIO
        </Text>
      )}

      <ScrollView
        horizontal={telaPequena}
        showsHorizontalScrollIndicator={false}
        style={telaPequena && estilos.rolagemMobile}
        contentContainerStyle={[estilos.menu, telaPequena && estilos.menuMobile]}
      >
        {menus.map((menu) => (
          <Pressable
            key={menu.nome}
            onPress={() => onNavegar(menu.nome)}
            style={[estilos.botao, telaPequena && estilos.botaoMobile, paginaAtual === menu.nome && estilos.botaoAtivo
            ]}
          >
            <Text style={[estilos.textoMenu, telaPequena && estilos.textoMenuMobile]}>
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
    padding: 10
  },

  logo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12
  },

  logoMobile: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center"
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    gap: 6
  },

  rolagemMobile: {
    flexGrow: 0,
    width: "100%"
  },

  botao: {
    padding: 13,
    borderRadius: 8
  },

  botaoMobile: {
    paddingVertical: 10,
    paddingHorizontal: 12
  },

  botaoAtivo: {
    backgroundColor: "#0C716B"
  },

  textoMenu: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13
  },

  textoMenuMobile: {
    fontSize: 12
  }
});
