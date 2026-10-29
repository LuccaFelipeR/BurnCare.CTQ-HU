
import { View, Text, StyleSheet, ScrollView } from "react-native";
import IdentificacaoForm from '../components/forms/IdentificacaoForm';

export default function NovoPedido() {
  return (
    // VIEW 1 — Área principal da página
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.conteudo}
    >

      {/* VIEW 2 — Título e descrição */}
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>
          Novo pedido de malha
        </Text>

        <Text style={estilos.descricao}>
          Preencha os dados para encaminhar à confecção.
        </Text>
      </View>

      {/* VIEW 3 — Área que organiza etapas e formulário */}
      <View style={estilos.areaEtapas}>

        {/* VIEW 4 — Menu de etapas (lado esquerdo) */}
        <View style={estilos.menuEtapas}>
          <Text style={estilos.etapaAtiva}>
            1. Paciente e prescrição
          </Text>

          <Text style={estilos.etapa}>
            2. Região e produto
          </Text>

          <Text style={estilos.etapa}>
            3. Medidas e anexos
          </Text>

          <Text style={estilos.etapa}>
            4. Conferência
          </Text>
        </View>

        {/* VIEW 5 — Formulário (lado direito) */}
        <View style={estilos.formulario}>
          <Text style={estilos.tituloFormulario}>
            Prescrição médica e identificação
          </Text>

          {/* VIEW 6 — Área dos campos */}
          <View>
            <IdentificacaoForm
              formData={{}}
              setFormData={() => {}}
              />
            {/* Campos serão adicionados aqui */}
          </View>

          {/* VIEW 7 — Área dos botões */}
          <View>
            {/* Cancelar e Continuar serão adicionados aqui */}
          </View>
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

  cabecalho: {
    marginBottom: 20
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#203449"
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

  menuEtapas: {
    width: 190,
    gap: 16
  },

  etapaAtiva: {
    backgroundColor: "#e4f4ee",
    color: "#0c716b",
    fontWeight: "bold",
    padding: 12,
    borderRadius: 6
  },

  etapa: {
    color: "#657888",
    fontWeight: "bold",
    padding: 12
  },

  formulario: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12
  },

  tituloFormulario: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#203449",
    marginBottom: 20
  }
});
