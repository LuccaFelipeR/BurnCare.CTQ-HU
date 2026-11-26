
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  useWindowDimensions
} from "react-native";

import IdentificacaoForm from "../components/forms/IdentificacaoForm";
import MapaCorporal from "../components/MapaCorporal";

export default function NovoPedido() {
  const [formData, setFormData] = useState({});
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [regioesSelecionadas, setRegioesSelecionadas] = useState([]);
  const [justificativaRegiao, setJustificativaRegiao] = useState("");
  const { width } = useWindowDimensions();

  // Em telas menores que 768px, organiza tudo verticalmente.
  const isMobile = width < 768;

  const etapas = [
    "1. Paciente e prescrição",
    "2. Região e produto",
    "3. Medidas e anexos",
    "4. Conferência"
  ];

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={[
        estilos.conteudo,
        isMobile && estilos.conteudoMobile
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <Text style={[
          estilos.titulo,
          isMobile && estilos.tituloMobile
        ]}>
          Novo pedido de malha
        </Text>

        <Text style={estilos.descricao}>
          Preencha os dados para encaminhar à confecção.
        </Text>
      </View>

      {/* Etapas e formulário */}
      <View style={[
        estilos.areaEtapas,
        isMobile && estilos.areaEtapasMobile
      ]}>

        {/* Menu de etapas */}
        <View style={[
          estilos.menuEtapas,
          isMobile && estilos.menuEtapasMobile
        ]}>
          {etapas.map((etapa, index) => (
            <Pressable
              key={etapa}
              style={[
                estilos.itemEtapa,
                index === etapaAtual && estilos.itemEtapaAtiva
              ]}
              onPress={() => setEtapaAtual(index)}
            >
              <Text style={[
                estilos.textoEtapa,
                index === etapaAtual && estilos.textoEtapaAtiva
              ]}>
                {etapa}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Formulário */}
        <View style={[
          estilos.formulario,
          isMobile && estilos.formularioMobile
        ]}>
          <Text style={[
            estilos.tituloFormulario,
            isMobile && estilos.tituloFormularioMobile
          ]}>
            {etapaAtual === 0
              ? "Prescrição médica e identificação"
              : etapaAtual === 1
                ? "Região e produto"
                : etapaAtual === 2
                  ? "Medidas e anexos"
                  : "Conferência"}
          </Text>

          {etapaAtual === 0 && (
            <IdentificacaoForm
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {etapaAtual === 1 && (
            <View style={estilos.etapaRegiao}>
              <Text style={estilos.descricaoEtapa}>
                Selecione a região anatômica e os produtos necessários.
              </Text>

              <View
                style={[
                  estilos.conteudoRegiao,
                  isMobile && estilos.conteudoRegiaoMobile
                ]}
              >
                <MapaCorporal
                  selecionadas={regioesSelecionadas}
                  onChange={setRegioesSelecionadas}
                />

                <View style={estilos.catalogo}>
                  <Text style={estilos.rotuloCampo}>
                    Buscar produto
                  </Text>

                  <TextInput
                    accessibilityLabel="Buscar produto"
                    placeholder="Disponível após validação do catálogo"
                    style={[estilos.campoBusca, estilos.campoBuscaDesabilitado]}
                    editable={false}
                  />

                  <View style={estilos.listaVazia}>
                    <Text style={estilos.textoListaVazia}>
                      {regioesSelecionadas.length > 0
                        ? "Os produtos associados às regiões selecionadas aparecerão quando o catálogo for validado pelo CTQ/HU."
                        : "Selecione uma região. Os produtos correspondentes serão exibidos após validação do catálogo pelo CTQ/HU."}
                    </Text>
                  </View>

                  <View style={estilos.avisoCatalogo}>
                    <Text style={estilos.textoAvisoCatalogo}>
                      Catálogo e associações anatômicas ainda não validados.
                      Nenhum produto demonstrativo será tratado como recomendação.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={estilos.campoJustificativa}>
                <Text style={estilos.rotuloCampo}>
                  Justificativa / indicação clínica
                </Text>
                <TextInput
                  accessibilityLabel="Justificativa ou indicação clínica"
                  placeholder="Campo demonstrativo para validação do protótipo."
                  value={justificativaRegiao}
                  onChangeText={setJustificativaRegiao}
                  style={estilos.campoBusca}
                />
              </View>

              <Text style={estilos.avisoDesenho}>
                Desenhos feitos no mapa são temporários e não são salvos.
              </Text>

              <View style={estilos.navegacaoEtapas}>
                <Pressable
                  style={estilos.botaoVoltar}
                  onPress={() => setEtapaAtual(0)}
                >
                  <Text style={estilos.textoVoltar}>Voltar</Text>
                </Pressable>

                <Pressable
                  style={estilos.botaoContinuar}
                  onPress={() => setEtapaAtual(2)}
                >
                  <Text style={estilos.textoContinuar}>Continuar →</Text>
                </Pressable>
              </View>
            </View>
          )}

          {etapaAtual > 1 && (
            <View style={estilos.etapaPendente}>
              <Text style={estilos.textoEtapaPendente}>
                Esta etapa ainda será integrada ao módulo correspondente.
              </Text>

              <Pressable
                style={estilos.botaoVoltar}
                onPress={() => setEtapaAtual((anterior) =>
                  Math.max(0, anterior - 1)
                )}
              >
                <Text style={estilos.textoVoltar}>Voltar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8fa"
  },

  conteudo: {
    flexGrow: 1,
    padding: 24
  },

  conteudoMobile: {
    padding: 12
  },

  cabecalho: {
    marginBottom: 20
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#203449"
  },

  tituloMobile: {
    fontSize: 23
  },

  descricao: {
    fontSize: 14,
    color: "#657888",
    marginTop: 12
  },

  areaEtapas: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-start"
  },

  areaEtapasMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12
  },

  menuEtapas: {
    width: 190,
    gap: 12
  },

  menuEtapasMobile: {
    width: "100%",
    gap: 6
  },

  itemEtapa: {
    padding: 12,
    borderRadius: 6
  },

  itemEtapaAtiva: {
    backgroundColor: "#e4f4ee"
  },

  textoEtapa: {
    color: "#657888",
    fontWeight: "bold",
    fontSize: 13
  },

  textoEtapaAtiva: {
    color: "#0c716b"
  },

  formulario: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12
  },

  formularioMobile: {
    flex: 0,
    width: "100%",
    padding: 12
  },

  tituloFormulario: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#203449",
    marginBottom: 20
  },

  tituloFormularioMobile: {
    fontSize: 18,
    marginBottom: 14
  },

  etapaRegiao: {
    gap: 14
  },

  conteudoRegiao: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18
  },

  conteudoRegiaoMobile: {
    flexDirection: "column",
    alignItems: "center"
  },

  catalogo: {
    flex: 1,
    minWidth: 0,
    gap: 8
  },

  descricaoEtapa: {
    color: "#718696",
    fontSize: 12
  },

  rotuloCampo: {
    color: "#718696",
    fontSize: 11,
    fontWeight: "bold"
  },

  campoBusca: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1E293B",
    backgroundColor: "#FFFFFF"
  },

  campoBuscaDesabilitado: {
    color: "#718696",
    backgroundColor: "#F8FAFC"
  },

  listaVazia: {
    minHeight: 96,
    justifyContent: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 6,
    backgroundColor: "#FFFFFF"
  },

  textoListaVazia: {
    color: "#718696",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },

  avisoCatalogo: {
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F4C64D",
    borderRadius: 6,
    backgroundColor: "#FFF5CC"
  },

  textoAvisoCatalogo: {
    color: "#7A5A10",
    fontSize: 11,
    lineHeight: 16
  },

  campoJustificativa: {
    gap: 6
  },

  avisoDesenho: {
    color: "#718696",
    fontSize: 11,
    lineHeight: 16
  },

  navegacaoEtapas: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8
  },

  botaoVoltar: {
    alignItems: "center",
    minWidth: 88,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 6,
    backgroundColor: "#FFFFFF"
  },

  textoVoltar: {
    color: "#718696",
    fontSize: 12,
    fontWeight: "bold"
  },

  botaoContinuar: {
    alignItems: "center",
    minWidth: 105,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#0C716B"
  },

  textoContinuar: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold"
  },

  etapaPendente: {
    gap: 16
  },

  textoEtapaPendente: {
    color: "#718696",
    fontSize: 13
  }
});
