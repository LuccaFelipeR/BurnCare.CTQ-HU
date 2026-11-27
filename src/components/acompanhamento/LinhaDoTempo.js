import { View, Text, StyleSheet } from "react-native";
import { INFO_STATUS } from "../../data/acompanhamentoPedidos";

// Lista os eventos do pedido, do mais recente para o mais antigo
export default function LinhaDoTempo({ historico }) {
  const eventos = [...historico].reverse();

  return (
    <View>
      {eventos.map((evento, index) => {
        const info = INFO_STATUS[evento.status] || { rotulo: evento.status, cor: "#19384C" };
        const ultimo = index === eventos.length - 1;

        return (
          <View key={`${evento.data}-${index}`} style={estilos.item}>
            <View style={estilos.marcador}>
              <View style={[estilos.ponto, { backgroundColor: info.cor }]} />
              {!ultimo && <View style={estilos.linha} />}
            </View>

            <View style={estilos.conteudo}>
              <Text style={estilos.cabecalho}>
                {evento.data} · <Text style={{ color: info.cor }}>{info.rotulo}</Text>
              </Text>
              <Text style={estilos.descricao}>{evento.descricao}</Text>
              <Text style={estilos.responsavel}>{evento.responsavel}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 12
  },

  marcador: {
    alignItems: "center",
    width: 14
  },

  ponto: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4
  },

  linha: {
    flex: 1,
    width: 2,
    backgroundColor: "#DDE8EE",
    marginTop: 4
  },

  conteudo: {
    flex: 1,
    minWidth: 0,
    paddingBottom: 16
  },

  cabecalho: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#19384C"
  },

  descricao: {
    fontSize: 13,
    color: "#3E5566",
    marginTop: 4,
    lineHeight: 19
  },

  responsavel: {
    fontSize: 11,
    color: "#718696",
    marginTop: 2
  }
});
