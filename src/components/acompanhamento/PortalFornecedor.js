// Portal de demonstração — baseado na implementação de Matheus Albertini.
// Mantém a projeção de dados de confecção sem exibir identificação do paciente.
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import StatusBadge from "./StatusBadge";
import LinhaDoTempo from "./LinhaDoTempo";
import PainelAcao from "./PainelAcao";
import { ATOR, pedidosDoFornecedor } from "../../data/acompanhamentoPedidos";
import { usePedidos } from "../../context/PedidosContext";

export default function PortalFornecedor({ pedidos, onRegistrar }) {
  const { fornecedores } = usePedidos();
  const [fornecedor, setFornecedor] = useState(fornecedores[0]?.nome ?? "");
  const [somentePendentes, setSomentePendentes] = useState(true);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const { width } = useWindowDimensions();
  const duasColunas = width >= 1100;
  const lista = pedidosDoFornecedor(pedidos, fornecedor, somentePendentes);
  const todos = pedidosDoFornecedor(pedidos, fornecedor, false);
  const selecionado = todos.find((p) => p.id === idSelecionado);
  const pedidoCompleto = pedidos.find((p) => p.id === selecionado?.id);
  function selecionar(id) { setIdSelecionado(id); setMensagem(""); }
  function registrar(dados) {
    if (!pedidoCompleto) return;
    onRegistrar(pedidoCompleto.id, dados);
    setMensagem("Registro salvo nesta sessão demonstrativa.");
  }
  const blocoLista = <View style={[estilos.coluna, duasColunas && { flexBasis: 360, flexShrink: 0 }]}>
    <Text style={estilos.rotulo}>Entrar como (simulação)</Text>
    <View style={estilos.chips}>{fornecedores.map(({ nome }) => <Chip key={nome} ativo={fornecedor === nome} onPress={() => { setFornecedor(nome); selecionar(null); }}>{nome}</Chip>)}</View>
    <View style={estilos.chips}><Chip ativo={somentePendentes} onPress={() => setSomentePendentes(true)}>Pendentes ({pedidosDoFornecedor(pedidos, fornecedor, true).length})</Chip><Chip ativo={!somentePendentes} onPress={() => setSomentePendentes(false)}>Todos ({todos.length})</Chip></View>
    {!lista.length && <View style={estilos.cartao}><Text style={estilos.titulo}>Nenhum pedido encontrado</Text><Text style={estilos.texto}>Não há pedidos neste filtro para o fornecedor.</Text></View>}
    {lista.map((pedido) => <Pressable key={pedido.id} onPress={() => selecionar(pedido.id)} style={[estilos.cartao, pedido.id === idSelecionado && { borderColor: '#0C716B', borderWidth: 2 }]}>
      <View style={estilos.linha}><Text style={estilos.rotulo}>{pedido.id}</Text><StatusBadge status={pedido.status} /></View><Text style={estilos.titulo}>{pedido.produto}</Text><Text style={estilos.texto}>{pedido.regiao} · {pedido.tipo}</Text><Text style={estilos.rotulo}>Pedido em {pedido.dataPedido}</Text>
    </Pressable>)}
  </View>;
  const blocoDetalhe = selecionado && pedidoCompleto ? <View style={[estilos.coluna, duasColunas && { flex: 1 }]}>
    {!duasColunas && <Pressable onPress={() => selecionar(null)}><Text style={estilos.link}>← Voltar para a lista</Text></Pressable>}
    <View style={estilos.restrito}><Text style={{ color: '#9A6200', fontWeight: 'bold' }}>Visão demonstrativa: identificação do paciente oculta. Não é autenticação real.</Text></View>
    <View style={estilos.cartao}><View style={estilos.linha}><Text style={estilos.rotulo}>{selecionado.id}</Text><StatusBadge status={selecionado.status} /></View><Text style={[estilos.titulo, { fontSize: 20 }]}>{selecionado.produto}</Text><Text style={estilos.texto}>{selecionado.regiao} · {selecionado.tipo} · pedido em {selecionado.dataPedido}</Text><Text style={[estilos.rotulo, { marginTop: 12 }]}>Medidas para confecção</Text>
      {Object.entries(selecionado.medidas || {}).map(([nome, valor]) => <View key={nome} style={[estilos.linha, { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#EDF1F4' }]}><Text style={[estilos.texto, { flex: 1 }]}>{nome}</Text><Text style={estilos.titulo}>{valor}</Text></View>)}
    </View>
    {selecionado.ajusteAtual && <View style={[estilos.cartao, { borderLeftWidth: 4, borderLeftColor: '#B03A2E' }]}><Text style={estilos.titulo}>Ajuste solicitado nº {selecionado.ajusteAtual.numero}</Text><Text style={estilos.texto}>{selecionado.ajusteAtual.descricao}</Text>{selecionado.ajusteAtual.novasMedidas ? <Text style={estilos.texto}>Novas medidas: {selecionado.ajusteAtual.novasMedidas}</Text> : null}</View>}
    {!!mensagem && <View style={{ backgroundColor: '#DDF3E9', padding: 12, borderRadius: 8 }}><Text style={estilos.link}>{mensagem}</Text></View>}
    <PainelAcao key={`${pedidoCompleto.id}-${pedidoCompleto.status}-${pedidoCompleto.historico.length}`} pedido={pedidoCompleto} ator={ATOR.FORNECEDOR} onConfirmar={registrar} />
    <View style={estilos.cartao}><Text style={estilos.titulo}>Confecção e logística</Text><LinhaDoTempo historico={selecionado.historico} /></View>
  </View> : duasColunas ? <View style={[estilos.cartao, { flex: 1 }]}><Text style={estilos.titulo}>Selecione um pedido</Text><Text style={estilos.texto}>Confirme o recebimento, postagem ou retorno de ajuste.</Text></View> : null;
  return <View style={[{ gap: 16 }, duasColunas && { flexDirection: 'row', alignItems: 'flex-start' }]}>{(duasColunas || !selecionado) && blocoLista}{blocoDetalhe}</View>;
}
function Chip({ ativo, onPress, children }) { return <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: ativo }} style={[estilos.chip, ativo && { backgroundColor: '#19384C', borderColor: '#19384C' }]}><Text style={[estilos.rotulo, { color: ativo ? '#FFFFFF' : '#3E5566' }]}>{children}</Text></Pressable>; }
const estilos = StyleSheet.create({
  coluna: { gap: 12, minWidth: 0 }, rotulo: { fontSize: 12, color: '#718696', fontWeight: 'bold' }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { borderWidth: 1, borderColor: '#C9D7E0', backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 7, paddingHorizontal: 12 }, cartao: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDE8EE', borderRadius: 12, padding: 16, gap: 4 }, linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }, titulo: { fontSize: 15, fontWeight: 'bold', color: '#19384C' }, texto: { fontSize: 13, color: '#3E5566', lineHeight: 19 }, restrito: { backgroundColor: '#FFF3DC', borderRadius: 8, padding: 12 }, link: { color: '#0C716B', fontWeight: 'bold' }
});
