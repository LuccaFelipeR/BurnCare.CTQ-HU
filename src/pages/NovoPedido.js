
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions
} from "react-native";

import IdentificacaoForm from "../components/forms/IdentificacaoForm";

export default function NovoPedido() {
  const [formData, setFormData] = useState({});
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
            <View
              key={etapa}
              style={[
                estilos.itemEtapa,
                index === 0 && estilos.itemEtapaAtiva
              ]}
            >
              <Text style={[
                estilos.textoEtapa,
                index === 0 && estilos.textoEtapaAtiva
              ]}>
                {etapa}
              </Text>
            </View>
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
            Prescrição médica e identificação
          </Text>

          <IdentificacaoForm
            formData={formData}
            setFormData={setFormData}
          />
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
  }
});
