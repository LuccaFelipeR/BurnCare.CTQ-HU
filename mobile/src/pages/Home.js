
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions
} from 'react-native';

export default function Home() {
  const { width } = useWindowDimensions();
  const telaPequena = width < 768;

  return (
    <View style={styles.container}>

      {/* MENU LATERAL */}
      {!telaPequena && (
        <View style={styles.sidebar}>

          <Text style={styles.logo}>✚ BurnCare</Text>

          <Text style={styles.identificacao}>
            CTQ · HOSPITAL UNIVERSITÁRIO
          </Text>

          <View style={styles.menu}>
            <Text style={styles.menuAtivo}>
              Visão geral
            </Text>

            <Text style={styles.menuPendente}>
              Pacientes
            </Text>

            <Text style={styles.menuPendente}>
              Solicitações
            </Text>

            <Text style={styles.menuPendente}>
              Medidas
            </Text>

            <Text style={styles.menuPendente}>
              Fornecedor
            </Text>
          </View>

        </View>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.principal}>

        <View style={styles.cabecalho}>
          <View>
            <Text style={styles.cabecalhoTitulo}>
              {telaPequena ? 'BurnCare' : 'Visão geral'}
            </Text>

            <Text style={styles.cabecalhoSubtitulo}>
              Hospital Universitário de Londrina · CTQ
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.conteudo}
        >
          <Text style={styles.titulo}>
            Acompanhamento de malhas
          </Text>

          <Text style={styles.subtitulo}>
            Gestão de solicitações de malhas compressivas.
          </Text>

          <View style={styles.painel}>
            <Text style={styles.painelTitulo}>
              Pedidos
            </Text>

            <Text style={styles.painelMensagem}>
              A consulta de pedidos ainda não foi implementada.
              Os registros aparecerão aqui após a integração
              com a fonte de dados do sistema.
            </Text>
          </View>

        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f8fa'
  },

  sidebar: {
    width: 246,
    backgroundColor: '#17344c',
    padding: 20
  },

  logo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12
  },

  identificacao: {
    color: '#b5d2da',
    fontSize: 11,
    marginBottom: 35
  },

  menu: {
    gap: 10
  },

  menuAtivo: {
    backgroundColor: '#0c716b',
    color: '#ffffff',
    padding: 14,
    borderRadius: 10,
    fontWeight: 'bold'
  },

  menuPendente: {
    color: '#b5d2da',
    padding: 14
  },

  principal: {
    flex: 1
  },

  cabecalho: {
    backgroundColor: '#ffffff',
    padding: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e8ec'
  },

  cabecalhoTitulo: {
    color: '#203449',
    fontSize: 17,
    fontWeight: 'bold'
  },

  cabecalhoSubtitulo: {
    color: '#657888',
    fontSize: 12,
    marginTop: 4
  },

  conteudo: {
    padding: 30,
    gap: 14
  },

  titulo: {
    color: '#203449',
    fontSize: 27,
    fontWeight: 'bold'
  },

  subtitulo: {
    color: '#657888',
    fontSize: 14,
    marginBottom: 12
  },

  painel: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e0e8ec'
  },

  painelTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#203449',
    marginBottom: 12
  },

  painelMensagem: {
    color: '#657888',
    fontSize: 14,
    lineHeight: 22
  }
});
