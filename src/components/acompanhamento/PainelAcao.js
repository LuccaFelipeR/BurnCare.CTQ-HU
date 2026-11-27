import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import {
  ACOES,
  ATOR,
  campoVisivel,
  dataHoje,
  mascaraData,
  validarAcao
} from "../../data/acompanhamentoPedidos";

// Formulário da próxima etapa do pedido.
// ator = "CTQ" ou "FORNECEDOR": cada um só registra as próprias etapas.
// O componente pai deve usar key={pedido.id + pedido.status + historico.length}
// para limpar o formulário quando o pedido mudar.
export default function PainelAcao({ pedido, ator, onConfirmar }) {
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
      <View style={[estilos.painel, estilos.painelNeutro]}>
        <Text style={estilos.titulo}>Pedido encerrado</Text>
        <Text style={estilos.descricao}>
          A malha já foi entregue. Para uma nova malha, abra um novo pedido.
        </Text>
      </View>
    );
  }

  // Etapa de responsabilidade do outro lado (CTQ x fornecedor)
  if (acao.ator !== ator) {
    return (
      <View style={[estilos.painel, estilos.painelNeutro]}>
        <Text style={estilos.titulo}>
          {acao.ator === ATOR.FORNECEDOR ? "Aguardando o fornecedor" : "Aguardando o CTQ"}
        </Text>
        <Text style={estilos.descricao}>
          {acao.ator === ATOR.FORNECEDOR
            ? `${acao.aguardando} Esta etapa é registrada no Portal do fornecedor.`
            : "A próxima etapa é registrada pela equipe do CTQ."}
        </Text>
      </View>
    );
  }

  function alterar(nome, valor) {
    setDados((anterior) => ({ ...anterior, [nome]: valor }));
  }

  function confirmar() {
    const encontrados = validarAcao(pedido, dados, ator);
    setErros(encontrados);
    if (encontrados.length === 0) onConfirmar(dados);
  }

  const campos = acao.campos.filter((campo) => campoVisivel(campo, dados));

  return (
    <View style={estilos.painel}>
      <Text style={estilos.titulo}>{acao.titulo}</Text>
      <Text style={estilos.descricao}>{acao.descricao}</Text>

      {campos.map((campo) => (
        <View key={campo.nome} style={estilos.campo}>
          <Text style={estilos.rotulo}>
            {campo.rotulo}
            {campo.obrigatorio && <Text style={estilos.obrigatorio}> *</Text>}
          </Text>

          {campo.tipo === "opcoes" ? (
            <View style={estilos.opcoes}>
              {campo.opcoes.map((opcao) => {
                const ativa = dados[campo.nome] === opcao.valor;
                return (
                  <Pressable
                    key={opcao.valor}
                    // Com uma única opção, clicar de novo desmarca (ex.: recibo assinado)
                    onPress={() =>
                      alterar(campo.nome, ativa && campo.opcoes.length === 1 ? "" : opcao.valor)
                    }
                    style={[estilos.opcao, ativa && estilos.opcaoAtiva]}
                  >
                    <Text style={[estilos.textoOpcao, ativa && estilos.textoOpcaoAtiva]}>
                      {campo.opcoes.length === 1 ? (ativa ? "☑ " : "☐ ") : ""}
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

  painelNeutro: {
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
    marginBottom: 8,
    lineHeight: 19
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
