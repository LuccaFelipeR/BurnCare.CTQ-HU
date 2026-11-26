
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

const catalogoProdutos = [
  {
    id: "luva-punho-direita",
    descricao: "Luvas com dedos até o punho (mão direita)",
    codigo: "S-47226 / E-183633",
    codigoSus: "07.01.10.001-0"
  },
  {
    id: "luva-punho-esquerda",
    descricao: "Luvas com dedos até o punho (mão esquerda)",
    codigo: "S-47226 / E-183633",
    codigoSus: "07.01.10.001-0"
  },
  {
    id: "meia-joelho-direita",
    descricao: "Meia até joelho (pé direito)",
    codigo: "S-47227 / E-183634",
    codigoSus: "07.01.10.002-8"
  },
  {
    id: "meia-joelho-esquerda",
    descricao: "Meia até joelho (pé esquerdo)",
    codigo: "S-47227 / E-183634",
    codigoSus: "07.01.10.002-8"
  },
  {
    id: "meio-cano-braco-direito",
    descricao: "Meio cano de braço direito",
    codigo: "S-47228 / E-183635",
    codigoSus: "07.01.10.003-6"
  },
  {
    id: "meio-cano-braco-esquerdo",
    descricao: "Meio cano de braço esquerdo",
    codigo: "S-47228 / E-183635",
    codigoSus: "07.01.10.003-6"
  },
  {
    id: "meio-cano-perna-direita",
    descricao: "Meio cano de perna direita",
    codigo: "S-47228 / E-183706",
    codigoSus: "07.01.10.003-6"
  },
  {
    id: "meio-cano-perna-esquerda",
    descricao: "Meio cano de perna esquerda",
    codigo: "S-47228 / E-183706",
    codigoSus: "07.01.10.003-6"
  },
  {
    id: "luva-ombro-direita",
    descricao: "Luvas com dedos até ombro (mão direita)",
    codigo: "S-47229 / E-183636",
    codigoSus: "07.01.10.004-4"
  },
  {
    id: "luva-ombro-esquerda",
    descricao: "Luvas com dedos até ombro (mão esquerda)",
    codigo: "S-47229 / E-183636",
    codigoSus: "07.01.10.004-4"
  },
  {
    id: "meia-tres-quartos-direita",
    descricao: "Meia ¾ direita",
    codigo: "S-47230 / E-183637",
    codigoSus: "07.01.10.005-2"
  },
  {
    id: "meia-tres-quartos-esquerda",
    descricao: "Meia ¾ esquerda",
    codigo: "S-47230 / E-183637",
    codigoSus: "07.01.10.005-2"
  },
  {
    id: "meia-perna-inteira-direita",
    descricao: "Meia perna direita inteira",
    codigo: "S-47231 / E-183638",
    codigoSus: "07.01.10.006-0"
  },
  {
    id: "meia-perna-inteira-esquerda",
    descricao: "Meia perna esquerda inteira",
    codigo: "S-47231 / E-183638",
    codigoSus: "07.01.10.006-0"
  },
  {
    id: "meia-calca",
    descricao: "Meia calça",
    codigo: "S-47232 / E-183639",
    codigoSus: "07.01.10.007-9"
  },
  {
    id: "torax-com-mangas",
    descricao: "Torax com mangas",
    codigo: "S-47233 / E-183640",
    codigoSus: "07.01.10.008-7"
  },
  {
    id: "torax-sem-mangas",
    descricao: "Torax sem mangas",
    codigo: "S-47234 / E-183641",
    codigoSus: "07.01.10.009-5"
  },
  {
    id: "cabeca-pescoco-mascara",
    descricao: "Cabeça e pescoço - mascara",
    codigo: "S-47235 / E-183642",
    codigoSus: "07.01.10.010-9"
  },
  {
    id: "cabeca-pescoco-colar-cervical",
    descricao: "Cabeça e pescoço-colar cervical",
    codigo: "S-47235 / E-183707",
    codigoSus: "07.01.10.010-9"
  }
];

export default function NovoPedido() {
  const [formData, setFormData] = useState({});
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [regioesSelecionadas, setRegioesSelecionadas] = useState([]);
  const [justificativaRegiao, setJustificativaRegiao] = useState("");
  const [buscaProduto, setBuscaProduto] = useState("");
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const { width } = useWindowDimensions();

  // Em telas menores que 768px, organiza tudo verticalmente.
  const isMobile = width < 768;
  const produtosFiltrados = catalogoProdutos.filter((produto) => {
    const termoBusca = buscaProduto.trim().toLocaleLowerCase("pt-BR");
    const dadosProduto =
      `${produto.descricao} ${produto.codigo} ${produto.codigoSus}`
        .toLocaleLowerCase("pt-BR");

    return dadosProduto.includes(termoBusca);
  });

  function alternarProduto(produtoId) {
    setProdutosSelecionados((selecionados) =>
      selecionados.includes(produtoId)
        ? selecionados.filter((id) => id !== produtoId)
        : [...selecionados, produtoId]
    );
  }

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
                    placeholder="Buscar por descrição ou código"
                    value={buscaProduto}
                    onChangeText={setBuscaProduto}
                    style={estilos.campoBusca}
                  />

                  <View style={estilos.listaProdutos}>
                    {produtosFiltrados.length > 0 ? (
                      produtosFiltrados.map((produto) => {
                        const marcado = produtosSelecionados.includes(produto.id);

                        return (
                          <Pressable
                            key={produto.id}
                            accessibilityRole="checkbox"
                            accessibilityLabel={marcado
                              ? `${produto.descricao}. Código ${produto.codigo}. Código SUS ${produto.codigoSus}`
                              : produto.descricao}
                            accessibilityState={{ checked: marcado }}
                            style={[
                              estilos.itemProduto,
                              marcado && estilos.itemProdutoMarcado
                            ]}
                            onPress={() => alternarProduto(produto.id)}
                          >
                            <View
                              style={[
                                estilos.caixaMarcacao,
                                marcado && estilos.caixaMarcacaoMarcada
                              ]}
                            >
                              {marcado && (
                                <Text style={estilos.marcaProduto}>✓</Text>
                              )}
                            </View>
                            <View style={estilos.dadosProduto}>
                              <Text style={estilos.nomeProduto}>
                                {produto.descricao}
                              </Text>
                              {marcado && (
                                <Text style={estilos.detalhesProduto}>
                                  {produto.codigo} · SUS {produto.codigoSus}
                                </Text>
                              )}
                            </View>
                          </Pressable>
                        );
                      })
                    ) : (
                      <Text style={estilos.textoListaVazia}>
                        Nenhum produto encontrado.
                      </Text>
                    )}
                  </View>

                  <Text style={estilos.notaSelecao}>
                    As marcações são temporárias neste protótipo; não são salvas nem enviadas.
                  </Text>
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

  textoListaVazia: {
    color: "#718696",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },

  listaProdutos: {
    gap: 6
  },

  itemProduto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 52,
    padding: 9,
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 6,
    backgroundColor: "#F4F8FA"
  },

  itemProdutoMarcado: {
    borderColor: "#9CCFC3",
    backgroundColor: "#E4F4EE"
  },

  caixaMarcacao: {
    width: 17,
    height: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#91A4AF",
    borderRadius: 3,
    backgroundColor: "#FFFFFF"
  },

  caixaMarcacaoMarcada: {
    borderColor: "#0C716B",
    backgroundColor: "#0C716B"
  },

  marcaProduto: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "bold"
  },

  dadosProduto: {
    flex: 1,
    gap: 3
  },

  nomeProduto: {
    color: "#203449",
    fontSize: 12,
    fontWeight: "bold"
  },

  detalhesProduto: {
    color: "#718696",
    fontSize: 10,
    lineHeight: 14
  },

  notaSelecao: {
    color: "#718696",
    fontSize: 10,
    lineHeight: 14
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
