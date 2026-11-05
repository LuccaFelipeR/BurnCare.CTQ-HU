import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const campos = [
  {
    nome: "nome",
    rotulo: "Nome do paciente *",
    placeholder: "Paciente demonstrativo",
    larguraTotal: true
  },
  {
    nome: "prontuario",
    rotulo: "Prontuário HU *",
    placeholder: "DEMO-HU-0000"
  },
  {
    nome: "dataAtendimento",
    rotulo: "Data do atendimento",
    placeholder: "DD-MM-AAAA"
  },
  {
    nome: "idade",
    rotulo: "Idade",
    placeholder: "Ex: 32",
    keyboardType: "numeric"
  },
  {
    nome: "cidade",
    rotulo: "Cidade",
    placeholder: "Ex: Londrina"
  },
  {
    nome: "endereco",
    rotulo: "Endereço",
    placeholder: "Rua Exemplo, 123",
    larguraTotal: true
  },
  {
    nome: "telefone",
    rotulo: "Telefone",
    placeholder: "(43) 99999-0000"
  },
  {
    nome: "peso",
    rotulo: "Peso (kg)",
    placeholder: "Ex: 70",
    keyboardType: "decimal-pad"
  },
  {
    nome: "altura",
    rotulo: "Altura (cm)",
    placeholder: "Ex: 170",
    keyboardType: "decimal-pad"
  },
  {
    nome: "profissional",
    rotulo: "Profissional solicitante",
    placeholder: "Médico responsável pela prescrição",
    larguraTotal: true
  }
];

const tiposSolicitacao = [
  "Primeira malha",
  "Segunda malha",
];

function Campo({ campo, valor, onChangeText }) {
  const ehData = campo.nome === "dataAtendimento";

  return (
    <View
      style={[
        estilos.campo,
        campo.larguraTotal && estilos.campoInteiro
      ]}
    >
      <Text style={estilos.rotulo}>{campo.rotulo}</Text>

      {ehData ? (
        <input
          aria-label={campo.rotulo}
          type="date"
          value={valor || ""}
          onChange={(event) => onChangeText(event.currentTarget.value)}
          style={estilos.entradaData}
        />
      ) : (
        <TextInput
          accessibilityLabel={campo.rotulo}
          style={estilos.entrada}
          value={valor}
          onChangeText={onChangeText}
          placeholder={campo.placeholder}
          placeholderTextColor="rgba(0, 0, 0, 0.31)"
          keyboardType={campo.keyboardType || "default"}
        />
      )}
    </View>
  );
}

export default function IdentificacaoForm({ formData, setFormData }) {
  const peso = Number.parseFloat(formData.peso);
  const altura = Number.parseFloat(formData.altura) / 100;
  const imc = Number.isFinite(peso) && Number.isFinite(altura) && peso > 0 && altura > 0
    ? (peso / (altura * altura)).toFixed(1)
    : null;

  const atualizarCampo = (nome, valor) => {
    setFormData((anterior) => ({ ...anterior, [nome]: valor }));
  };

  return (
    <View style={estilos.container}>
      <View>
        <Text style={estilos.titulo}>
        </Text>
      </View>

      <View style={estilos.grade}>
        {campos.slice(0, 2).map((campo) => (
          <Campo
            key={campo.nome}
            campo={campo}
            valor={formData[campo.nome] || ""}
            onChangeText={(valor) => atualizarCampo(campo.nome, valor)}
          />
        ))}

        <View style={estilos.campoInteiro}>
          <Text style={estilos.rotulo}>Tipo de solicitação *</Text>
          <View style={estilos.opcoes}>
            {tiposSolicitacao.map((tipo) => {
              const selecionado = (formData.tipoSolicitacao || tiposSolicitacao[0]) === tipo;

              return (
                <Pressable
                  key={tipo}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selecionado }}
                  onPress={() => atualizarCampo("tipoSolicitacao", tipo)}
                  style={[
                    estilos.opcao,
                    selecionado && estilos.opcaoSelecionada
                  ]}
                >
                  <Text style={[
                    estilos.textoOpcao,
                    selecionado && estilos.textoOpcaoSelecionada
                  ]}>
                    {tipo}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {campos.slice(2).map((campo) => (
          <Campo
            key={campo.nome}
            campo={campo}
            valor={formData[campo.nome] || ""}
            onChangeText={(valor) => atualizarCampo(campo.nome, valor)}
          />
        ))}
      </View>

      {imc && (
        <View style={estilos.destaqueImc}>
          <Text style={estilos.textoImc}>
            IMC estimado com base no peso e altura: {imc} kg/m²
          </Text>
        </View>
      )}

      <View style={estilos.aviso}>
        <Text style={estilos.tituloAviso}>Observação importante:</Text>
        <Text style={estilos.textoAviso}>
          A segunda malha é uma indicação da ficha médica. O ajuste de uma peça já produzida é outro processo e permanece vinculado ao pedido original.
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    gap: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 6
  },
  descricao: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 19
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  campo: {
    width: "48%",
    minWidth: 140,
    gap: 6
  },
  campoInteiro: {
    width: "100%"
  },
  rotulo: {
    fontSize: 13,
    fontWeight: "650",
    color: "#334155"

  },
  entrada: {
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
  entradaData: {
   minHeight: 42,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingLeft: 10,
    alignItems: "center",
    fontSize: 14,
    color: "#1E293B",
    backgroundColor: "#FFFFFF"
  },
  opcoes: {
    marginTop: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  opcao: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6
  },
  opcaoSelecionada: {
    borderColor: "#0C716B",
    backgroundColor: "#E4F4EE"
  },
  textoOpcao: {
    color: "#475569",
    fontSize: 13
  },
  textoOpcaoSelecionada: {
    color: "#0C716B",
    fontWeight: "bold"
  },
  destaqueImc: {
    padding: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 6
  },
  textoImc: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "bold"
  },
  aviso: {
    gap: 4,
    padding: 14,
    backgroundColor: "#FFFBEB",
    borderLeftWidth: 4,
    borderLeftColor: "#FBBF24",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6
  },
  tituloAviso: {
    color: "#78350F",
    fontSize: 14,
    fontWeight: "600"
  },
  textoAviso: {
    color: "#92400E",
    fontSize: 12,
    lineHeight: 18
  }
});
