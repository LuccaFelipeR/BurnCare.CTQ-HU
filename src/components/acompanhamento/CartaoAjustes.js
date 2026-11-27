// Ajustes do pedido (mesmo pedido original) — listar, editar e excluir.
// Responsável: Matheus Albertini

import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

import BotaoConfirmar from "./BotaoConfirmar";
import {
  podeEditarAjuste,
  podeExcluirAjuste,
  textoAlteracoes,
  validarEdicaoAjuste
} from "../../data/acompanhamentoPedidos";

export default function CartaoAjustes({ pedido, onEditar, onExcluir }) {
  const [editando, setEditando] = useState(null); // número do ajuste em edição

  if (pedido.ajustes.length === 0) return null;

  return (
    <View style={estilos.cartao}>
      <Text style={estilos.secao}>Ajustes (mesmo pedido original)</Text>

      {pedido.ajustes.map((ajuste) =>
        editando === ajuste.numero ? (
          <FormEdicao
            key={ajuste.numero}
            pedido={pedido}
            ajuste={ajuste}
            onCancelar={() => setEditando(null)}
            onSalvar={(dados) => {
              onEditar(ajuste.numero, dados);
              setEditando(null);
            }}
          />
        ) : (
          <View key={ajuste.numero} style={estilos.ajuste}>
            <Text style={estilos.titulo}>
              Ajuste nº {ajuste.numero} · origem: {ajuste.origem}
            </Text>
            <Text style={estilos.texto}>{ajuste.descricao}</Text>
            {ajuste.alteracoesMedidas.length > 0 && (
              <Text style={estilos.texto}>Novas medidas: {textoAlteracoes(ajuste.alteracoesMedidas)}</Text>
            )}
            <Text style={estilos.textoPequeno}>
              Solicitado em {ajuste.dataSolicitacao}
              {ajuste.envioFornecedor
                ? ` · devolvido ao fornecedor em ${ajuste.envioFornecedor.data} (rastreio ${ajuste.envioFornecedor.rastreio})`
                : " · aguardando logística reversa"}
              {ajuste.dataRetorno ? ` · retornou em ${ajuste.dataRetorno}` : ""}
            </Text>

            {(podeEditarAjuste(pedido, ajuste.numero) || podeExcluirAjuste(pedido, ajuste.numero)) && (
              <View style={estilos.acoes}>
                {podeEditarAjuste(pedido, ajuste.numero) && (
                  <Pressable onPress={() => setEditando(ajuste.numero)} style={estilos.botaoEditar}>
                    <Text style={estilos.textoEditar}>Editar</Text>
                  </Pressable>
                )}
                {podeExcluirAjuste(pedido, ajuste.numero) && (
                  <BotaoConfirmar
                    rotulo="Excluir ajuste"
                    pergunta={`Excluir o ajuste nº ${ajuste.numero}? O pedido volta para o status anterior.`}
                    onConfirmar={() => onExcluir(ajuste.numero)}
                  />
                )}
              </View>
            )}
          </View>
        )
      )}
    </View>
  );
}

function FormEdicao({ pedido, ajuste, onSalvar, onCancelar }) {
  // Medidas: as que existiam antes do ajuste + as alteradas por ele
  const valoresAntes = {};
  Object.keys(pedido.medidas || {}).forEach((nome) => {
    valoresAntes[nome] = pedido.medidas[nome];
  });
  ajuste.alteracoesMedidas.forEach((m) => {
    valoresAntes[m.nome] = m.antes;
  });

  const inicialMedidas = {};
  ajuste.alteracoesMedidas.forEach((m) => {
    inicialMedidas[m.nome] = m.depois;
  });

  const [descricao, setDescricao] = useState(ajuste.descricao);
  const [medidas, setMedidas] = useState(inicialMedidas);
  const [erros, setErros] = useState([]);
  const mostraMedidas = ajuste.origem === "Prova";

  function salvar() {
    const dados = { descricao, medidas: mostraMedidas ? medidas : undefined };
    const encontrados = validarEdicaoAjuste(pedido, ajuste.numero, dados);
    setErros(encontrados);
    if (encontrados.length === 0) onSalvar(dados);
  }

  return (
    <View style={[estilos.ajuste, estilos.ajusteEditando]}>
      <Text style={estilos.titulo}>Editando ajuste nº {ajuste.numero}</Text>

      <Text style={estilos.rotulo}>
        Descrição do ajuste <Text style={estilos.obrigatorio}>*</Text>
      </Text>
      <TextInput
        style={estilos.input}
        value={descricao}
        onChangeText={setDescricao}
        maxLength={300}
        accessibilityLabel="Descrição do ajuste"
      />

      {mostraMedidas && (
        <>
          <Text style={estilos.rotulo}>Novas medidas (deixe em branco as que não mudam)</Text>
          {Object.entries(valoresAntes).map(([nome, antes]) => (
            <View key={nome} style={estilos.medida}>
              <Text style={estilos.texto}>
                {nome} <Text style={estilos.textoPequeno}>(antes: {antes})</Text>
              </Text>
              <TextInput
                style={[estilos.input, estilos.inputMedida]}
                value={medidas[nome] || ""}
                onChangeText={(texto) => setMedidas((m) => ({ ...m, [nome]: texto }))}
                placeholder="nova medida"
                placeholderTextColor="#9AAAB6"
                maxLength={20}
                accessibilityLabel={`Nova medida: ${nome}`}
              />
            </View>
          ))}
        </>
      )}

      {erros.length > 0 && (
        <View style={estilos.caixaErros}>
          {erros.map((erro) => (
            <Text key={erro} style={estilos.erro}>• {erro}</Text>
          ))}
        </View>
      )}

      <View style={estilos.acoes}>
        <Pressable onPress={salvar} style={estilos.botaoSalvar}>
          <Text style={estilos.textoSalvar}>Salvar alterações</Text>
        </Pressable>
        <Pressable onPress={onCancelar} style={estilos.botaoEditar}>
          <Text style={estilos.textoEditar}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 12,
    padding: 16,
    gap: 4
  },

  secao: { fontSize: 16, fontWeight: "bold", color: "#19384C", marginBottom: 10 },

  ajuste: {
    borderLeftWidth: 3,
    borderLeftColor: "#B03A2E",
    paddingLeft: 10,
    marginBottom: 12,
    gap: 4
  },

  ajusteEditando: {
    backgroundColor: "#F4F8FA",
    borderRadius: 8,
    padding: 12
  },

  titulo: { fontSize: 15, fontWeight: "bold", color: "#19384C" },
  texto: { fontSize: 13, color: "#3E5566", lineHeight: 19, flexShrink: 1 },
  textoPequeno: { fontSize: 12, color: "#718696" },

  acoes: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, alignItems: "flex-start" },

  botaoEditar: {
    borderWidth: 1,
    borderColor: "#0C716B",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12
  },
  textoEditar: { color: "#0C716B", fontWeight: "bold", fontSize: 12 },

  botaoSalvar: {
    backgroundColor: "#0C716B",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  textoSalvar: { color: "#FFFFFF", fontWeight: "bold", fontSize: 12 },

  rotulo: { fontSize: 13, fontWeight: "bold", color: "#3E5566", marginTop: 8 },
  obrigatorio: { color: "#B03A2E" },

  input: {
    borderWidth: 1,
    borderColor: "#C9D7E0",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#19384C",
    backgroundColor: "#FFFFFF"
  },

  medida: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  inputMedida: { width: 130, paddingVertical: 7 },

  caixaErros: { backgroundColor: "#FBE6E3", borderRadius: 8, padding: 10, marginTop: 8 },
  erro: { color: "#B03A2E", fontSize: 13 }
});
