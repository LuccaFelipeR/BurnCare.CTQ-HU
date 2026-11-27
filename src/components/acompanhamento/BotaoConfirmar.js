import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

// Botão de ação perigosa (excluir/desfazer) com confirmação na própria tela.
// Não usa Alert porque o Alert do React Native não funciona no navegador.
export default function BotaoConfirmar({ rotulo, pergunta, rotuloConfirmar = "Sim, excluir", onConfirmar }) {
  const [confirmando, setConfirmando] = useState(false);

  if (!confirmando) {
    return (
      <Pressable onPress={() => setConfirmando(true)} style={estilos.botao}>
        <Text style={estilos.textoBotao}>{rotulo}</Text>
      </Pressable>
    );
  }

  return (
    <View style={estilos.caixa}>
      <Text style={estilos.pergunta}>{pergunta}</Text>
      <View style={estilos.linha}>
        <Pressable
          onPress={() => {
            setConfirmando(false);
            onConfirmar();
          }}
          style={estilos.confirmar}
        >
          <Text style={estilos.textoConfirmar}>{rotuloConfirmar}</Text>
        </Pressable>
        <Pressable onPress={() => setConfirmando(false)} style={estilos.cancelar}>
          <Text style={estilos.textoCancelar}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  botao: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#B03A2E",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12
  },

  textoBotao: {
    color: "#B03A2E",
    fontWeight: "bold",
    fontSize: 12
  },

  caixa: {
    backgroundColor: "#FBE6E3",
    borderRadius: 8,
    padding: 12,
    gap: 8
  },

  pergunta: {
    color: "#B03A2E",
    fontSize: 13,
    fontWeight: "bold"
  },

  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },

  confirmar: {
    backgroundColor: "#B03A2E",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14
  },

  textoConfirmar: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12
  },

  cancelar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14
  },

  textoCancelar: {
    color: "#3E5566",
    fontWeight: "bold",
    fontSize: 12
  }
});
