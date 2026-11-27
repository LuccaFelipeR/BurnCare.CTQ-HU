import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

// Recibo de entrega + registro do encaminhamento administrativo.
// O BurnCare só REGISTRA o encaminhamento: não faz pagamento, lançamento ESTHOS nem emissão de OPM.
export default function ReciboEntrega({ pedido }) {
  const entrega = pedido.entrega;
  if (!entrega) return null;

  const podeImprimir = Platform.OS === "web" && typeof window !== "undefined" && window.print;

  return (
    <View style={estilos.recibo}>
      <Text style={estilos.titulo}>Recibo de entrega de malha compressiva</Text>
      <Text style={estilos.subtitulo}>CTQ · Hospital Universitário de Londrina — documento fictício</Text>

      <Linha rotulo="Pedido" valor={pedido.id} />
      <Linha rotulo="Paciente" valor={`${pedido.paciente} (${pedido.prontuario})`} />
      <Linha rotulo="Produto" valor={`${pedido.produto} — ${pedido.regiao}`} />
      <Linha rotulo="Tipo" valor={pedido.tipo} />
      <Linha rotulo="Ajustes realizados" valor={String(pedido.ajustes.length)} />
      <Linha rotulo="Data da entrega" valor={entrega.data} />
      <Linha rotulo="Recebido por" valor={entrega.recebidoPor} />
      <Linha rotulo="Recibo" valor={entrega.reciboAssinado ? "Assinado" : "Pendente"} />
      {entrega.orientacoes ? <Linha rotulo="Orientações" valor={entrega.orientacoes} /> : null}

      <View style={estilos.encaminhamento}>
        <Text style={estilos.rotulo}>Encaminhamento administrativo</Text>
        <Text style={estilos.valor}>{entrega.encaminhamento}</Text>
        <Text style={estilos.nota}>
          Registro apenas. Pagamento, lançamento ESTHOS e emissão de OPM são feitos fora do BurnCare.
        </Text>
      </View>

      {podeImprimir && (
        <Pressable style={estilos.botao} onPress={() => window.print()}>
          <Text style={estilos.textoBotao}>Imprimir recibo</Text>
        </Pressable>
      )}
    </View>
  );
}

function Linha({ rotulo, valor }) {
  return (
    <View style={estilos.linha}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  recibo: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#19384C",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 18,
    gap: 6
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#19384C"
  },

  subtitulo: {
    fontSize: 12,
    color: "#718696",
    marginBottom: 6
  },

  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },

  rotulo: {
    fontSize: 12,
    color: "#718696",
    minWidth: 130
  },

  valor: {
    fontSize: 13,
    color: "#19384C",
    fontWeight: "bold",
    flexShrink: 1
  },

  encaminhamento: {
    backgroundColor: "#F4F8FA",
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    gap: 4
  },

  nota: {
    fontSize: 11,
    color: "#718696"
  },

  botao: {
    borderWidth: 1,
    borderColor: "#0C716B",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8
  },

  textoBotao: {
    color: "#0C716B",
    fontWeight: "bold"
  }
});
