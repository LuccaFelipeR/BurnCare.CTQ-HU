
import { View, StyleSheet, useWindowDimensions, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Sidebar from "../components/SideBar";
import Home from "../pages/Home";
import NovoPedido from "../pages/NovoPedido";
import HistoricoPedidos from "../pages/HistoricoPedidos";

const Stack = createNativeStackNavigator();

// Layout utilizado por todas as páginas
function Layout({ navigation, paginaAtual, children }) {
  const { width } = useWindowDimensions();
  const telaPequena = width < 768;

  return (
    <View style={[
      estilos.container,
      telaPequena && estilos.containerMobile
    ]}>
      <Sidebar
        paginaAtual={paginaAtual}
        onNavegar={(tela) => navigation.navigate(tela)}
        telaPequena={telaPequena}
      />

      <View style={[estilos.conteudo, telaPequena && estilos.conteudoMobile]}
      >
        {children}
      </View>
    </View>
  );
}

// Visão geral
function TelaHome({ navigation }) {
  return (
    <Layout navigation={navigation} paginaAtual="VisaoGeral">
      <Home navigation={navigation} />
    </Layout>
  );
}

// Novo pedido

function TelaNovoPedido({ navigation }) {
  return (
    <Layout navigation={navigation} paginaAtual="NovoPedido">
      <NovoPedido />
    </Layout>
  );
}


// Histórico de pedidos
function TelaHistorico({ navigation }) {
  return (
    <Layout navigation={navigation} paginaAtual="Historico">
      <HistoricoPedidos />
    </Layout>
  );
}

// Rotas principais
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VisaoGeral" component={TelaHome} />
      <Stack.Screen name="NovoPedido" component={TelaNovoPedido} />
      <Stack.Screen name="Historico" component={TelaHistorico} />
    </Stack.Navigator>
  );
}


const estilos = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F4F8FA",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden"
  },

  containerMobile: {
    flexDirection: "column",
    width: "100%"
  },

  conteudo: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    width: "100%",
    overflow: "hidden"
  }
});
