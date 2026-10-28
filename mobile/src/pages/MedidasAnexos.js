import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CORES } from "../theme/colors";

const MEDIDAS = [
    "Circunferência da Palma",
    "Circunferência do Dorso",
    "Circunferência do Punho",
    "Circunferência do Polegar",
    "Circunferência do Indicador",
    "Circunferência do Dedo Médio",
    "Circunferência do Anelar",
    "Circunferência do Dedo mínimo",
    "Altura da palma",
    "Altura do polegar",
    "Altura do indicador",
    "Altura do dedo médio",
    "Altura do anelar",
    "Altura do dedo mínimo",
    "Comprimento total da luva"
];

function nomeMedida(index, nome){
    if(index < 9) return `${index + 1} · ${nome}`;
    if(index === 14) return `10 · ${nome}`;
    return `${String.fromCharCode(97 + index - 9)} · ${nome}`;
}

export default function MedidasAnexos({navigation, OnVoltar, OnContinuar}){
    const { width } = useWindowDimensions();
  const compacto = width < 850;
  const celular = width < 600;

  const [modelo, setModelo] = useState("");
  const [medidas, setMedidas] = useState({});
  const [termoConferido, setTermoConferido] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [erro, setErro] = useState("");

  function atualizarMedida(nome, valor) {
    setMedidas((anterior) => ({
      ...anterior,
      [nome]: valor,
    }));
    setErro("");
  }

  async function selecionarFotos() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      if (!resultado.canceled) {
        setFotos(resultado.assets || []);
      }
    } catch {
      Alert.alert(
        "Não foi possível selecionar as imagens",
        "Tente novamente."
      );
    }
  }

  function continuar() {
    const preenchidas = Object.values(medidas).filter(
      (valor) => valor.trim() !== ""
    );

    if (preenchidas.length < 2) {
      setErro("Preencha pelo menos duas medidas para continuar.");
      return;
    }

    setErro("");

    onContinuar?.({
      modelo,
      medidas,
      termoConferido,
      quantidadeFotos: fotos.length,
    });
  }
  return(
     <View style={styles.app}>
      {/* MENU LATERAL */}
      <View
        style={[
          styles.sidebar,
          compacto && styles.sidebarCompacto,
          celular && styles.sidebarCelular,
        ]}
      >
        <View style={styles.logoLinha}>
          <View style={styles.logoIcone}>
            <Text style={styles.logoMais}>✚</Text>
          </View>
          <Text style={styles.logoTexto}>BurnCare</Text>
        </View>

        <Text style={styles.versao}>CTQ · PROTÓTIPO V2</Text>

        <View style={[styles.menu, celular && styles.menuCelular]}>
          <Text style={styles.menuItem}>▦ Visão geral</Text>
          <View style={styles.menuAtivo}>
            <Text style={styles.menuAtivoTexto}>＋ Novo pedido</Text>
          </View>
          <Text style={styles.menuItem}>▤ Histórico de pedidos</Text>
          <Text style={styles.menuItem}>◫ Gestão e documentos</Text>
        </View>

        {!celular && (
          <View style={styles.perfil}>
            <Text style={styles.perfilTitulo}>Equipe HU / CTQ</Text>
            <Text style={styles.perfilSubtitulo}>
              Ambiente demonstrativo
            </Text>
            <Text style={styles.sair}>Sair / mudar perfil</Text>
          </View>
        )}
      </View>

      {/* ÁREA PRINCIPAL */}
      <View style={styles.principal}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.topTitulo}>Nova solicitação</Text>
            <Text style={styles.topSubtitulo}>
              Hospital Universitário de Londrina · CTQ
            </Text>
          </View>

          <View style={styles.selo}>
            <Text style={styles.seloTexto}>
              SIMULAÇÃO - SEM DADOS REAIS
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollPrincipal}
          contentContainerStyle={[
            styles.conteudo,
            celular && styles.conteudoCelular,
          ]}
        >
          <Text style={styles.eyebrow}>
            HOSPITAL UNIVERSITÁRIO
          </Text>
          <Text style={styles.titulo}>Solicitação de malha</Text>
          <Text style={styles.subtitulo}>
            Um único formulário, quatro etapas. A prescrição e a
            mensuração são atividades distintas.
          </Text>

          <View
            style={[
              styles.workspace,
              compacto && styles.workspaceCompacto,
            ]}
          >
            {/* ETAPAS */}
            <View
              style={[
                styles.etapas,
                compacto && styles.etapasCompactas,
              ]}
            >
              {[
                "Paciente e prescrição",
                "Região e produto",
                "Medidas e anexos",
                "Conferência",
              ].map((nome, index) => {
                const concluida = index < 2;
                const atual = index === 2;

                return (
                  <View
                    key={nome}
                    style={[
                      styles.etapa,
                      atual && styles.etapaAtual,
                    ]}
                  >
                    <View
                      style={[
                        styles.etapaNumero,
                        (concluida || atual) &&
                          styles.etapaNumeroAtivo,
                      ]}
                    >
                      <Text
                        style={[
                          styles.etapaNumeroTexto,
                          (concluida || atual) &&
                            styles.etapaNumeroTextoAtivo,
                        ]}
                      >
                        {concluida ? "✓" : index + 1}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.etapaTexto,
                        atual && styles.etapaTextoAtual,
                      ]}
                    >
                      {nome}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* CARTÃO DO FORMULÁRIO */}
            <View style={styles.cartao}>
              <Text style={styles.cartaoEyebrow}>
                ETAPA 3 DE 4 · MEDIDAS E ANEXOS
              </Text>

              <View style={styles.divisor} />

              <Text style={styles.tituloSecao}>Medidas e anexos</Text>
              <Text style={styles.descricao}>
                Os campos abaixo reproduzem os títulos dos sete
                gabaritos de medidas recebidos. Cada peça possui
                sua própria ficha.
              </Text>

              <View style={styles.abaSelecionada}>
                <Text style={styles.abaTexto}>
                  1. Luvas com dedos até o punho
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.infoTitulo}>
                  Luvas com dedos até o punho — mão direita
                </Text>
                <Text style={styles.infoTexto}>
                  Medidas da mão · gabarito, pág. 1 · unidade:
                  centímetros (cm). Campos obrigatórios definitivos
                  pendentes de validação clínica.
                </Text>
              </View>

              <Text style={styles.label}>
                Modelo / acabamento (conforme gabarito)
              </Text>

              <View style={styles.modelos}>
                {[
                  { valor: "", texto: "Escolher (se aplicável)" },
                  { valor: "Padrao", texto: "Padrão" },
                  { valor: "Personalizado", texto: "Personalizado" },
                ].map((opcao) => (
                  <Pressable
                    key={opcao.valor || "vazio"}
                    onPress={() => setModelo(opcao.valor)}
                    style={[
                      styles.opcaoModelo,
                      modelo === opcao.valor &&
                        styles.opcaoModeloAtiva,
                    ]}
                  >
                    <Text
                      style={[
                        styles.opcaoTexto,
                        modelo === opcao.valor &&
                          styles.opcaoTextoAtivo,
                      ]}
                    >
                      {opcao.texto}
                      {modelo === opcao.valor ? "  ✓" : ""}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* CAMPOS DE MEDIDAS */}
              <View style={styles.listaMedidas}>
                {MEDIDAS.map((nome, index) => (
                  <View key={nome} style={styles.linhaMedida}>
                    <Text style={styles.nomeMedida}>
                      {nomeMedida(index, nome)}
                    </Text>

                    <View style={styles.campoUnidade}>
                      <TextInput
                        value={medidas[nome] ?? ""}
                        onChangeText={(valor) =>
                          atualizarMedida(nome, valor)
                        }
                        keyboardType="decimal-pad"
                        placeholder=" "
                        accessibilityLabel={`${nome}, em centímetros`}
                        style={styles.inputMedida}
                      />
                      <Text style={styles.unidade}>cm</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.aviso}>
                <Text style={styles.avisoTexto}>
                  A demonstração exige duas medidas preenchidas por
                  produto; em produção, a equipe do CTQ deverá
                  confirmar todas as medidas obrigatórias por modelo.
                </Text>
              </View>

              <View style={styles.divisor} />

              <Text style={styles.tituloDocumentacao}>
                Documentação de apoio
              </Text>

              <Pressable
                onPress={() => setTermoConferido(!termoConferido)}
                style={styles.termo}
              >
                <View
                  style={[
                    styles.checkbox,
                    termoConferido && styles.checkboxAtivo,
                  ]}
                >
                  {termoConferido && (
                    <Text style={styles.checkTexto}>✓</Text>
                  )}
                </View>

                <View style={styles.termoTexto}>
                  <Text style={styles.termoTitulo}>
                    Termo de autorização de imagem conferido
                  </Text>
                  <Text style={styles.termoSubtitulo}>
                    Anexo 2 listado no fluxograma. O arquivo original
                    não foi fornecido nesta conversa.
                  </Text>
                </View>
              </Pressable>

              <Text style={styles.label}>
                Fotos da cicatriz (simulação)
              </Text>

              <Pressable
                onPress={selecionarFotos}
                style={styles.upload}
              >
                <Text style={styles.uploadBotao}>
                  Escolher arquivos
                </Text>
                <Text style={styles.uploadTexto}>
                  {fotos.length === 0
                    ? "Nenhum arquivo escolhido"
                    : `${fotos.length} imagem(ns) selecionada(s)`}
                </Text>
              </Pressable>

              <Text style={styles.ajuda}>
                Use apenas imagens fictícias. O protótipo não salva
                nem envia arquivos; registra apenas a quantidade
                selecionada.
              </Text>

              {erro !== "" && (
                <Text style={styles.erro}>{erro}</Text>
              )}
            </View>
          </View>

          {/* BOTÕES */}
          <View
            style={[
              styles.acoes,
              compacto && styles.acoesCompactas,
            ]}
          >
            <Pressable
              onPress={OnVoltar}
              style={styles.botaoVoltar}
            >
              <Text style={styles.textoVoltar}>← Voltar</Text>
            </Pressable>

            <Pressable
              onPress={OnContinuar}
              style={styles.botaoContinuar}
            >
              <Text style={styles.textoContinuar}>
                Continuar →
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    app: {
    flex: 1,
    minHeight: "100vh",
    flexDirection: "row",
    backgroundColor: CORES.fundo,
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: 224,
    flexShrink: 0,
    minHeight: "100vh",
    backgroundColor: "#19384C",
    padding: 20,
  },
  sidebarCompacto: {
    width: 190,
    padding: 12,
  },
  sidebarCelular: {
    width: 115,
    minHeight: "100vh",
    padding: 8,
  },
  logoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  logoIcone: {
    width: 38,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#22B3A5",
    alignItems: "center",
    justifyContent: "center",
  },
  logoMais: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  logoTexto: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  versao: {
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 8,
    marginBottom: 38,
  },
  menu: {
    gap: 7,
  },
  menuCelular: {
    gap: 10,
  },
  menuItem: {
    color: "#F2F7FA",
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 13,
  },
  menuAtivo: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#365368",
  },
  menuAtivoTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  perfil: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#496174",
  },
  perfilTitulo: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  perfilSubtitulo: {
    color: "#C7D9E5",
    fontSize: 11,
    marginTop: 6,
  },
  sair: {
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 16,
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
  selo: {
    backgroundColor: "#FFF0DB",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  seloTexto: {
    color: "#99520B",
    fontSize: 10,
    fontWeight: "bold",
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
    outlineStyle: "none",
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
  termoSubtitulo: {
    color: "#657E91",
    fontSize: 11,
    lineHeight: 17,
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
  },
  uploadTexto: {
    color: "#61798A",
    fontSize: 12,
  },
  ajuda: {
    color: "#657E91",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
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
  },
});

