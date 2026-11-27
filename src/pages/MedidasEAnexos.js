import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CORES } from "./theme/cores";
import { gabaritoDoProduto, validarMedidasProdutos } from "../data/gabaritosMedidas";

// Formulário de Ana Mantella, integrado ao estado de NovoPedido.
// O layout externo e o menu de etapas pertencem ao NovoPedido.
export default function MedidasAnexos({ produtos = [], dados, onAlterar, onVoltar, onContinuar }) {
  const [ativo, setAtivo] = useState(produtos[0]?.id ?? "");
  const [erro, setErro] = useState("");
  const [selecionando, setSelecionando] = useState(false);
  const produto = produtos.find((item) => item.id === ativo) ?? produtos[0];
  if (!produto || !dados || typeof onAlterar !== "function") {
    return <Text style={styles.erro}>Selecione os produtos na etapa anterior para preencher as medidas.</Text>;
  }
  const ficha = dados.fichas[produto.id] ?? { modelo: "", medidas: {} };
  const gabarito = gabaritoDoProduto(produto.id);
  const fotos = dados.fotos;
  function alterarFicha(atualizar) {
    onAlterar((anterior) => ({ ...anterior, fichas: { ...anterior.fichas,
      [produto.id]: atualizar(anterior.fichas[produto.id] ?? { modelo: "", medidas: {} })
    } }));
    setErro("");
  }
  async function selecionarFotos() {
    if (selecionando) return;
    setSelecionando(true);
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], allowsMultipleSelection: true, quality: 0.7,
      });
      if (!resultado.canceled) {
        onAlterar((anterior) => ({ ...anterior, fotos: resultado.assets ?? [] }));
        setErro("");
      }
    } catch {
      setErro("Não foi possível selecionar as imagens fictícias. Tente novamente.");
    } finally {
      setSelecionando(false);
    }
  }
  function continuar() {
    const erros = validarMedidasProdutos(produtos, dados);
    if (erros.length) {
      setErro(erros.join("\n"));
      const pendente = produtos.find((item) => validarMedidasProdutos([item], dados).length);
      if (pendente) setAtivo(pendente.id);
      return;
    }
    setErro("");
    onContinuar?.();
  }
  return (
    <View style={{ gap: 12, minWidth: 0 }}>
      <Text style={styles.descricao}>Uma ficha de medidas por produto. Os campos reproduzem o protótipo de validação e as regras clínicas definitivas dependem do CTQ.</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {produtos.map((item) => (
          <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: item.id === produto.id }}
            onPress={() => { setAtivo(item.id); setErro(""); }}
            style={[styles.opcaoModelo, item.id === produto.id && styles.opcaoModeloAtiva]}>
            <Text style={[styles.opcaoTexto, item.id === produto.id && styles.opcaoTextoAtivo]}>{item.descricao}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.info}>
        <Text style={styles.infoTitulo}>{produto.descricao}</Text>
        <Text style={styles.infoTexto}>{gabarito?.name ?? "Gabarito pendente"} · unidade: centímetros (cm).</Text>
      </View>
      {gabarito?.variants?.length > 0 && <View>
        <Text style={styles.label}>Modelo / acabamento (se aplicável)</Text>
        <View style={styles.modelos} accessibilityRole="radiogroup">
          {["", ...gabarito.variants].map((modelo) => (
            <Pressable key={modelo || "sem-modelo"} accessibilityRole="radio" accessibilityState={{ checked: ficha.modelo === modelo }}
              onPress={() => alterarFicha((atual) => ({ ...atual, modelo }))}
              style={[styles.opcaoModelo, ficha.modelo === modelo && styles.opcaoModeloAtiva]}>
              <Text style={[styles.opcaoTexto, ficha.modelo === modelo && styles.opcaoTextoAtivo]}>{modelo || "Escolher (se aplicável)"}</Text>
            </Pressable>
          ))}
        </View>
      </View>}
      {gabarito && <View style={styles.listaMedidas}>
        {gabarito.fields.map((nome) => (
          <View key={nome} style={styles.linhaMedida}>
            <Text style={styles.nomeMedida}>{nome}</Text>
            <View style={styles.campoUnidade}>
              <TextInput accessibilityLabel={`${nome}, em centímetros`} keyboardType="decimal-pad"
                value={ficha.medidas[nome] ?? ""} onChangeText={(valor) => alterarFicha((atual) => ({ ...atual, medidas: { ...atual.medidas, [nome]: valor } }))}
                style={styles.inputMedida} placeholder="0" />
              <Text style={styles.unidade}>cm</Text>
            </View>
          </View>
        ))}
      </View>}
      <View style={styles.aviso}><Text style={styles.avisoTexto}>Preencha pelo menos duas medidas positivas por produto para a demonstração. Não se trata de uma exigência clínica validada.</Text></View>
      <View style={styles.divisor} />
      <Text style={styles.tituloDocumentacao}>Documentação de apoio</Text>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: dados.termoConferido }}
        onPress={() => onAlterar((anterior) => ({ ...anterior, termoConferido: !anterior.termoConferido }))} style={styles.termo}>
        <View style={[styles.checkbox, dados.termoConferido && styles.checkboxAtivo]}>{dados.termoConferido && <Text style={styles.checkTexto}>✓</Text>}</View>
        <View style={styles.termoTexto}><Text style={styles.termoTitulo}>Termo de autorização de imagem conferido (simulação)</Text></View>
      </Pressable>
      <Text style={styles.label}>Imagens fictícias de demonstração</Text>
      <Pressable onPress={selecionarFotos} disabled={selecionando} style={styles.upload}>
        <Text style={styles.uploadBotao}>{selecionando ? "Selecionando…" : "Escolher arquivos"}</Text>
        <Text style={styles.uploadTexto}>{fotos.length} imagem(ns) selecionada(s)</Text>
      </Pressable>
      <Text style={styles.infoTexto}>Não selecione fotografias reais de pacientes. As imagens ficam apenas nesta sessão.</Text>
      {fotos.map((foto, index) => <View key={`${foto.uri}-${index}`} style={styles.upload}>
        <Image source={{ uri: foto.uri }} style={{ width: 48, height: 48, borderRadius: 5 }} />
        <Text style={[styles.uploadTexto, { flex: 1 }]}>{foto.fileName || `Imagem ${index + 1}`}</Text>
        <Pressable accessibilityLabel={`Remover imagem ${index + 1}`} onPress={() => onAlterar((anterior) => ({ ...anterior, fotos: anterior.fotos.filter((_, i) => i !== index) }))}>
          <Text style={styles.textoVoltar}>Remover</Text>
        </Pressable>
      </View>)}
      {erro !== "" && <Text accessibilityRole="alert" style={styles.erro}>{erro}</Text>}
      <View style={[styles.acoes, styles.acoesCompactas]}>
        <Pressable onPress={onVoltar} disabled={selecionando} style={styles.botaoVoltar}><Text style={styles.textoVoltar}>← Voltar</Text></Pressable>
        <Pressable onPress={continuar} disabled={selecionando} style={styles.botaoContinuar}><Text style={styles.textoContinuar}>Continuar →</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    app: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: CORES.fundo,
  },
  principal: {
    flex: 1,
    minWidth: 0,
  },
  topbar: {
    minHeight: 68,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#D8E5EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topTitulo: {
    color: "#173650",
    fontSize: 14,
    fontWeight: "bold",
  },
  topSubtitulo: {
    color: "#61798A",
    fontSize: 12,
    marginTop: 5,
  },
  scrollPrincipal: {
    flex: 1,
  },
  conteudo: {
    width: "100%",
    maxWidth: 1400,
    alignSelf: "center",
    padding: 30,
  },
  conteudoCelular: {
    padding: 12,
  },
  eyebrow: {
    color: "#087D78",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  titulo: {
    color: "#173650",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 5,
  },
  subtitulo: {
    color: "#61798A",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  workspace: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
  },
  workspaceCompacto: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  etapas: {
    width: 174,
    flexShrink: 0,
    gap: 6,
  },
  etapasCompactas: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  etapa: {
    minHeight: 46,
    padding: 9,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flexGrow: 1,
  },
  etapaAtual: {
    backgroundColor: "#E1F3EE",
  },
  etapaNumero: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#CAD9E1",
    alignItems: "center",
    justifyContent: "center",
  },
  etapaNumeroAtivo: {
    backgroundColor: "#087C73",
    borderColor: "#087C73",
  },
  etapaNumeroTexto: {
    color: "#647D8D",
    fontSize: 13,
    fontWeight: "bold",
  },
  etapaNumeroTextoAtivo: {
    color: "#FFFFFF",
  },
  etapaTexto: {
    flex: 1,
    color: "#647D8D",
    fontSize: 12,
    fontWeight: "bold",
  },
  etapaTextoAtual: {
    color: "#087C73",
  },
  cartao: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE7ED",
    borderWidth: 1,
    borderRadius: 17,
    padding: 22,
  },
  cartaoEyebrow: {
    color: "#087D78",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  divisor: {
    height: 1,
    backgroundColor: "#D8E5EC",
    marginTop: 20,
    marginBottom: 21,
  },
  tituloSecao: {
    color: "#173650",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descricao: {
    color: "#61798A",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  abaSelecionada: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#45B5A6",
    backgroundColor: "#E2F5F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 9,
    marginBottom: 14,
  },
  abaTexto: {
    color: "#086B65",
    fontSize: 11,
    fontWeight: "bold",
  },
  info: {
    padding: 13,
    backgroundColor: "#EFF6FD",
    borderLeftWidth: 4,
    borderLeftColor: "#79B9E6",
    borderRadius: 9,
    gap: 5,
    marginBottom: 16,
  },
  infoTitulo: {
    color: "#31536F",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoTexto: {
    color: "#58738A",
    fontSize: 11,
    lineHeight: 17,
  },
  label: {
    color: "#173650",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modelos: {
    gap: 7,
  },
  opcaoModelo: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CFDEE7",
    borderRadius: 9,
  },
  opcaoModeloAtiva: {
    borderColor: "#168D82",
    backgroundColor: "#E2F5F0",
  },
  opcaoTexto: {
    color: "#173650",
    fontSize: 12,
  },
  opcaoTextoAtivo: {
    color: "#087C73",
    fontWeight: "bold",
  },
  listaMedidas: {
    marginTop: 20,
  },
  linhaMedida: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F4",
  },
  nomeMedida: {
    flex: 1,
    color: "#173650",
    fontSize: 12,
    lineHeight: 18,
  },
  campoUnidade: {
    width: 110,
    height: 43,
    position: "relative",
    justifyContent: "center",
  },
  inputMedida: {
    width: "100%",
    height: 43,
    borderWidth: 1,
    borderColor: "#CFDEE7",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 32,
    color: "#173650",
    fontSize: 13,
  },
  unidade: {
    position: "absolute",
    right: 10,
    color: "#748696",
    fontSize: 12,
    pointerEvents: "none",
  },
  aviso: {
    marginTop: 20,
    padding: 13,
    backgroundColor: "#FFF7E9",
    borderLeftWidth: 4,
    borderLeftColor: "#EDB35E",
    borderRadius: 8,
  },
  avisoTexto: {
    color: "#607D94",
    fontSize: 11,
    lineHeight: 17,
  },
  tituloDocumentacao: {
    color: "#173650",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  termo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginBottom: 30,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#91A5B2",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxAtivo: {
    backgroundColor: "#087C73",
    borderColor: "#087C73",
  },
  checkTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  termoTexto: {
    flex: 1,
    gap: 5,
  },
  termoTitulo: {
    color: "#173650",
    fontSize: 12,
    fontWeight: "bold",
  },
  upload: {
    minHeight: 44,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    padding: 9,
    borderWidth: 1,
    borderColor: "#CFDEE7",
    borderRadius: 10,
  },
  uploadBotao: {
    color: "#173650",
    fontSize: 12,
    fontWeight: "bold",
     borderColor: "#D8E5EC",
    borderWidth: 1.5,
    borderRadius: 5,
  },
  uploadTexto: {
    color: "#61798A",
    fontSize: 12,
  },
  erro: {
    color: "#A32626",
    backgroundColor: "#FFF0F0",
    padding: 10,
    marginTop: 12,
    borderRadius: 8,
    fontSize: 12,
  },
  acoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 18,
    marginLeft: 192,
  },
  acoesCompactas: {
    marginLeft: 0,
  },
  botaoVoltar: {
    minHeight: 41,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CFDEE7",
    borderRadius: 11,
  },
  textoVoltar: {
    color: "#173650",
    fontSize: 13,
    fontWeight: "bold",
  },
  botaoContinuar: {
    minHeight: 41,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#087C73",
    borderRadius: 11,
  },
  textoContinuar: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  }
});
