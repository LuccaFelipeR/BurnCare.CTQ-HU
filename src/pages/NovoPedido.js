
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

const produtosPorRegiao = {
  "perna-direita": [
    "meia-joelho-direita",
    "meio-cano-perna-direita",
    "meia-tres-quartos-direita",
    "meia-perna-inteira-direita",
    "meia-calca"
  ],
  "perna-esquerda": [
    "meia-joelho-esquerda",
    "meio-cano-perna-esquerda",
    "meia-tres-quartos-esquerda",
    "meia-perna-inteira-esquerda",
    "meia-calca"
  ],
  "braco-direito": [
    "meio-cano-braco-direito",
    "luva-ombro-direita"
  ],
  "braco-esquerdo": [
    "meio-cano-braco-esquerdo",
    "luva-ombro-esquerda"
  ],
  tronco: [
    "torax-com-mangas",
    "torax-sem-mangas"
  ],
  cabeca: [
    "cabeca-pescoco-mascara",
    "cabeca-pescoco-colar-cervical"
  ],
  "mao-direita": [
    "luva-punho-direita",
    "luva-ombro-direita"
  ],
  "mao-esquerda": [
    "luva-punho-esquerda",
    "luva-ombro-esquerda"
  ]
};

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
  const idsProdutosDisponiveis = new Set(
    regioesSelecionadas.flatMap(
      ({ regiao }) => produtosPorRegiao[regiao] || []
    )
  );
  const produtosDisponiveis = catalogoProdutos.filter((produto) =>
    idsProdutosDisponiveis.has(produto.id)
  );
  const termoBuscaProduto = buscaProduto.trim().toLocaleLowerCase("pt-BR");
  const produtosFiltrados = produtosDisponiveis.filter((produto) => {
    const dadosProduto =
      `${produto.descricao} ${produto.codigo} ${produto.codigoSus}`
        .toLocaleLowerCase("pt-BR");

    return dadosProduto.includes(termoBuscaProduto);
  });

  function atualizarRegioesSelecionadas(novasRegioes) {
    const idsDisponiveis = new Set(
      novasRegioes.flatMap(
        ({ regiao }) => produtosPorRegiao[regiao] || []
      )
    );

    setRegioesSelecionadas(novasRegioes);
    setProdutosSelecionados((selecionados) =>
      selecionados.filter((id) => idsDisponiveis.has(id))
    );
  }

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
                  onChange={atualizarRegioesSelecionadas}
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

                  <ScrollView
                    style={estilos.listaProdutos}
                    contentContainerStyle={estilos.conteudoListaProdutos}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    keyboardShouldPersistTaps="handled"
                  >
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
                        {regioesSelecionadas.length === 0
                          ? "Selecione uma parte do corpo para ver os produtos correspondentes."
                          : produtosDisponiveis.length === 0
                            ? "Não há produtos da lista informada para as partes selecionadas."
                            : "Nenhum produto encontrado para essa busca."}
                      </Text>
                    )}
                  </ScrollView>

                  <View
                    accessibilityRole="alert"
                    style={estilos.alertaSelecao}
                  >
                    <Text style={estilos.textoAlertaSelecao}>
                      O modelo da malha requer validação clínica!
                    </Text>
                  </View>
                </View>
              </View>

              {regioesSelecionadas.length > 0 && (
                <View style={estilos.regioesSelecionadas}>
                  <Text style={estilos.rotuloCampo}>Regiões selecionadas</Text>
                  <View style={estilos.listaRegioesSelecionadas}>
                    {regioesSelecionadas.map((item) => (
                      <Text
                        key={item.id}
                        style={estilos.itemRegiaoSelecionada}
                      >
                        {item.nome} · {item.vista === "frente" ? "Frente" : "Costas"}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

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
    fontSize: 27,
    fontWeight: "bold",
    color: "#19384C"
  },

  tituloMobile: {
    fontSize: 23
  },

  descricao: {
    fontSize: 14,
    color: "#657888",
    marginTop: 10
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
    color: "#0C716B"
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#19384C",
    marginBottom: 16
  },

  tituloFormularioMobile: {
    fontSize: 18,
    marginBottom: 14
  },

  etapaRegiao: {
    gap: 14
  },

  regioesSelecionadas: {
    gap: 6
  },

  listaRegioesSelecionadas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 6
  },

  itemRegiaoSelecionada: {
    color: "#0C716B",
    fontSize: 12,
    lineHeight: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#9CCFC3",
    borderRadius: 14,
    backgroundColor: "#E4F4EE"
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
    color: "#657888",
    fontSize: 14
  },

  rotuloCampo: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600"
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
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center"
  },

  listaProdutos: {
    height: 300,
    flexGrow: 0,
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 6
  },

  conteudoListaProdutos: {
    flexGrow: 1,
    gap: 6,
    padding: 6
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
    color: "#334155",
    fontSize: 13,
    fontWeight: "bold"
  },

  detalhesProduto: {
    color: "#718696",
    fontSize: 12,
    lineHeight: 16
  },

  alertaSelecao: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFF4E5"
  },

  textoAlertaSelecao: {
    color: "#B45309",
    fontSize: 12,
    lineHeight: 18
  },

  campoJustificativa: {
    gap: 6
  },

  avisoDesenho: {
    color: "#718696",
    fontSize: 12,
    lineHeight: 18
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
    fontSize: 13,
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
    fontSize: 13,
    fontWeight: "bold"
  },

  etapaPendente: {
    gap: 16
  },

  textoEtapaPendente: {
    color: "#657888",
    fontSize: 14
  }
});
