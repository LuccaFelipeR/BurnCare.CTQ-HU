import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { ACOES, dataHoje, mascaraData, validarAcao } from "../../data/acompanhamentoPedidos";

// Formulário da próxima etapa do pedido (fornecedor, recebimento, prova, ajuste ou entrega).
// O componente pai deve usar key={pedido.id + pedido.status} para limpar o formulário
// sempre que o pedido ou o status mudar.
export default function PainelAcao({ pedido, onConfirmar }) {
  const acao = ACOES[pedido.status];

  const [dados, setDados] = useState(() => {
    const inicial = {};
    (acao ? acao.campos : []).forEach((campo) => {
      inicial[campo.nome] = campo.nome === "data" ? dataHoje() : "";
    });
    return inicial;
  });
  const [erros, setErros] = useState([]);

  if (!acao) {
    return (
      <View style={[estilos.painel, estilos.painelEncerrado]}>
        <Text style={estilos.titulo}>Pedido encerrado</Text>
        <Text style={estilos.descricao}>
          A malha já foi entregue. Para uma nova malha, abra um novo pedido.
        </Text>
      </View>
    );
  }

  function alterar(nome, valor) {
    setDados((anterior) => ({ ...anterior, [nome]: valor }));
  }

  function confirmar() {
    const encontrados = validarAcao(pedido, dados);
    setErros(encontrados);
    if (encontrados.length === 0) {
      onConfirmar(dados);
    }
  }

  // A descrição do ajuste só aparece se o resultado da prova for "Precisa de ajuste"
  const campos = acao.campos.filter(
    (campo) => campo.nome !== "descricaoAjuste" || dados.resultado === "AJUSTE"
  );

  return (
    <View style={estilos.painel}>
      <Text style={estilos.titulo}>{acao.titulo}</Text>
      <Text style={estilos.descricao}>{acao.descricao}</Text>

      {campos.map((campo) => (
        <View key={campo.nome} style={estilos.campo}>
          <Text style={estilos.rotulo}>
            {campo.rotulo}
            {(campo.obrigatorio || campo.nome === "descricaoAjuste") && (
              <Text style={estilos.obrigatorio}> *</Text>
            )}
          </Text>

          {campo.tipo === "opcoes" ? (
            <View style={estilos.opcoes}>
              {campo.opcoes.map((opcao) => {
                const ativa = dados[campo.nome] === opcao.valor;
                return (
                  <Pressable
                    key={opcao.valor}
                    onPress={() => alterar(campo.nome, opcao.valor)}
                    style={[estilos.opcao, ativa && estilos.opcaoAtiva]}
                  >
                    <Text style={[estilos.textoOpcao, ativa && estilos.textoOpcaoAtiva]}>
                      {opcao.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <TextInput
              style={[estilos.input, campo.nome === "observacao" && estilos.inputMultilinha]}
              value={dados[campo.nome]}
              onChangeText={(texto) =>
                alterar(campo.nome, campo.tipo === "data" ? mascaraData(texto) : texto)
              }
              placeholder={campo.tipo === "data" ? "DD/MM/AAAA" : ""}
              placeholderTextColor="#9AAAB6"
              keyboardType={campo.tipo === "data" ? "numeric" : "default"}
              maxLength={campo.tipo === "data" ? 10 : 300}
              multiline={campo.nome === "observacao"}
            />
          )}
        </View>
      ))}

      {erros.length > 0 && (
        <View style={estilos.caixaErros}>
          {erros.map((erro) => (
            <Text key={erro} style={estilos.erro}>• {erro}</Text>
          ))}
        </View>
      )}

      <Pressable style={estilos.botao} onPress={confirmar}>
        <Text style={estilos.textoBotao}>{acao.botao}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  painel: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 12,
    padding: 18,
    gap: 4
  },

  painelEncerrado: {
    backgroundColor: "#F4F8FA"
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#19384C"
  },

  descricao: {
    fontSize: 13,
    color: "#657888",
    marginBottom: 8
  },

  campo: {
    marginTop: 8
  },

  rotulo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#3E5566",
    marginBottom: 6
  },

  obrigatorio: {
    color: "#B03A2E"
  },

  input: {
    borderWidth: 1,
    borderColor: "#C9D7E0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#19384C",
    backgroundColor: "#FFFFFF"
  },

  inputMultilinha: {
    minHeight: 70,
    textAlignVertical: "top"
  },

  opcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },

  opcao: {
    borderWidth: 1,
    borderColor: "#C9D7E0",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 14
  },

  opcaoAtiva: {
    backgroundColor: "#0C716B",
    borderColor: "#0C716B"
  },

  textoOpcao: {
    color: "#19384C",
    fontWeight: "bold",
    fontSize: 13
  },

  textoOpcaoAtiva: {
    color: "#FFFFFF"
  },

  caixaErros: {
    backgroundColor: "#FBE6E3",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 4
  },

  erro: {
    color: "#B03A2E",
    fontSize: 13
  },

  botao: {
    backgroundColor: "#0C716B",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 14
  },

  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold"
  }
});
