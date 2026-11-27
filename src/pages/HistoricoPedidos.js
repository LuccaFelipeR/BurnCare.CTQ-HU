// Histórico de Pedidos — frente 6: acompanhamento, fornecedor, prova, ajustes e entrega.
// Responsável: Matheus Albertini
// Dados FICTÍCIOS e sem persistência (as alterações somem ao recarregar a página).
//
// A tela tem duas visões sobre os MESMOS pedidos:
//  - Equipe CTQ: histórico completo, recebimento/conferência, prova, ajustes e entrega
//  - Portal do fornecedor: só dados de confecção (sem identificação do paciente)

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions
} from "react-native";

import StatusBadge from "../components/acompanhamento/StatusBadge";
import LinhaDoTempo from "../components/acompanhamento/LinhaDoTempo";
import PainelAcao from "../components/acompanhamento/PainelAcao";
import PortalFornecedor from "../components/acompanhamento/PortalFornecedor";
import ReciboEntrega from "../components/acompanhamento/ReciboEntrega";
import {
  ATOR,
  FILTROS,
  PEDIDOS_FICTICIOS,
  aplicarAcao,
  contarPorFiltro,
  filtrarPedidos
} from "../data/acompanhamentoPedidos";

export default function HistoricoPedidos() {
  const [pedidos, setPedidos] = useState(PEDIDOS_FICTICIOS);
  const [visao, setVisao] = useState(ATOR.CTQ);
  const [filtro, setFiltro] = useState("TODOS");
  const [busca, setBusca] = useState("");
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const { width } = useWindowDimensions();
  // Lista e detalhe lado a lado só em telas largas (a sidebar ocupa 246px)
  const duasColunas = width >= 1100;

  const lista = filtrarPedidos(pedidos, filtro, busca);
  const selecionado = pedidos.find((p) => p.id === idSelecionado) || null;

  // Usado pelas duas visões
  function registrarNoPedido(id, dados) {
    setPedidos((anteriores) => anteriores.map((p) => (p.id === id ? aplicarAcao(p, dados) : p)));
  }

  function registrarCTQ(dados) {
    registrarNoPedido(idSelecionado, dados);
    setMensagem("Registro salvo (apenas nesta sessão — dados fictícios).");
  }

  function selecionar(id) {
    setIdSelecionado(id);
    setMensagem("");
  }

  // ---------------- Lista (CTQ) ----------------
  const blocoLista = (
    <View style={[estilos.coluna, duasColunas && estilos.colunaLista]}>
      <TextInput
        style={estilos.busca}
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar por paciente, nº do pedido ou prontuário"
        placeholderTextColor="#9AAAB6"
      />

      <View style={estilos.filtros}>
        {FILTROS.map((f) => {
          const ativo = filtro === f.chave;
          return (
            <Pressable
              key={f.chave}
              onPress={() => setFiltro(f.chave)}
              style={[estilos.chip, ativo && estilos.chipAtivo]}
            >
              <Text style={[estilos.textoChip, ativo && estilos.textoChipAtivo]}>
                {f.rotulo} ({contarPorFiltro(pedidos, f.chave)})
              </Text>
            </Pressable>
          );
        })}
      </View>

      {lista.length === 0 ? (
        <View style={estilos.cartao}>
          <Text style={estilos.cartaoTitulo}>Nenhum pedido encontrado</Text>
          <Text style={estilos.texto}>Altere o filtro ou a busca.</Text>
        </View>
      ) : (
        lista.map((pedido) => {
          const ativo = pedido.id === idSelecionado;
          return (
            <Pressable
              key={pedido.id}
              onPress={() => selecionar(pedido.id)}
              style={[estilos.cartao, ativo && estilos.itemAtivo]}
            >
              <View style={estilos.linhaTopo}>
                <Text style={estilos.idPedido}>{pedido.id}</Text>
                <StatusBadge status={pedido.status} />
              </View>
              <Text style={estilos.cartaoTitulo}>{pedido.paciente}</Text>
              <Text style={estilos.texto}>
                {pedido.produto} · {pedido.regiao}
              </Text>
              <Text style={estilos.textoPequeno}>
                {pedido.tipo} · {pedido.fornecedor} · pedido em {pedido.dataPedido}
                {pedido.ajustes.length > 0 ? ` · ${pedido.ajustes.length} ajuste(s)` : ""}
              </Text>
            </Pressable>
          );
        })
      )}
    </View>
  );

  // ---------------- Detalhe (CTQ) ----------------
  const blocoDetalhe = selecionado ? (
    <View style={[estilos.coluna, duasColunas && estilos.colunaDetalhe]}>
      {!duasColunas && (
        <Pressable onPress={() => selecionar(null)} style={estilos.voltar}>
          <Text style={estilos.textoVoltar}>← Voltar para a lista</Text>
        </Pressable>
      )}

      <View style={estilos.cartao}>
        <View style={estilos.linhaTopo}>
          <Text style={estilos.idPedido}>{selecionado.id}</Text>
          <StatusBadge status={selecionado.status} />
        </View>
        <Text style={estilos.detalheTitulo}>{selecionado.paciente}</Text>

        <View style={estilos.grade}>
          <Info rotulo="Prontuário" valor={selecionado.prontuario} />
          <Info rotulo="Tipo" valor={selecionado.tipo} />
          <Info rotulo="Região" valor={selecionado.regiao} />
          <Info rotulo="Produto" valor={selecionado.produto} />
          <Info rotulo="Fornecedor" valor={selecionado.fornecedor} />
          <Info rotulo="Data do pedido" valor={selecionado.dataPedido} />
        </View>
      </View>

      {mensagem !== "" && (
        <View style={estilos.sucesso}>
          <Text style={estilos.textoSucesso}>{mensagem}</Text>
        </View>
      )}

      {selecionado.entrega ? (
        <ReciboEntrega pedido={selecionado} />
      ) : (
        <PainelAcao
          key={`${selecionado.id}-${selecionado.status}-${selecionado.historico.length}`}
          pedido={selecionado}
          ator={ATOR.CTQ}
          onConfirmar={registrarCTQ}
        />
      )}

      {selecionado.ajustes.length > 0 && (
        <View style={estilos.cartao}>
          <Text style={estilos.secao}>Ajustes (mesmo pedido original)</Text>
          {selecionado.ajustes.map((ajuste) => (
            <View key={ajuste.numero} style={estilos.ajuste}>
              <Text style={estilos.cartaoTitulo}>
                Ajuste nº {ajuste.numero} · origem: {ajuste.origem}
              </Text>
              <Text style={estilos.texto}>{ajuste.descricao}</Text>
              {ajuste.novasMedidas ? (
                <Text style={estilos.texto}>Novas medidas: {ajuste.novasMedidas}</Text>
              ) : null}
              <Text style={estilos.textoPequeno}>
                Solicitado em {ajuste.dataSolicitacao}
                {ajuste.envioFornecedor
                  ? ` · devolvido ao fornecedor em ${ajuste.envioFornecedor.data} (rastreio ${ajuste.envioFornecedor.rastreio})`
                  : " · aguardando logística reversa"}
                {ajuste.dataRetorno ? ` · retornou em ${ajuste.dataRetorno}` : ""}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={estilos.cartao}>
        <Text style={estilos.secao}>Histórico do pedido</Text>
        <LinhaDoTempo historico={selecionado.historico} />
      </View>
    </View>
  ) : (
    duasColunas && (
      <View style={[estilos.coluna, estilos.colunaDetalhe]}>
        <View style={estilos.cartao}>
          <Text style={estilos.cartaoTitulo}>Selecione um pedido</Text>
          <Text style={estilos.texto}>
            Clique em um pedido da lista para ver o histórico e registrar
            recebimento, conferência, prova, ajustes ou entrega.
          </Text>
        </View>
      </View>
    )
  );

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={estilos.titulo}>Histórico de pedidos</Text>
      <Text style={estilos.descricao}>
        Acompanhe fornecedor, prova, ajustes e entrega das malhas compressivas.
      </Text>

      {/* Alternância entre as visões */}
      <View style={estilos.abas}>
        <Pressable
          onPress={() => setVisao(ATOR.CTQ)}
          style={[estilos.aba, visao === ATOR.CTQ && estilos.abaAtiva]}
        >
          <Text style={[estilos.textoAba, visao === ATOR.CTQ && estilos.textoAbaAtiva]}>
            Equipe CTQ
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setVisao(ATOR.FORNECEDOR)}
          style={[estilos.aba, visao === ATOR.FORNECEDOR && estilos.abaAtiva]}
        >
          <Text style={[estilos.textoAba, visao === ATOR.FORNECEDOR && estilos.textoAbaAtiva]}>
            Portal do fornecedor
          </Text>
        </Pressable>
      </View>

      {visao === ATOR.CTQ ? (
        <View style={[estilos.area, duasColunas && estilos.areaDuasColunas]}>
          {/* Em telas menores, mostra a lista OU o detalhe */}
          {(duasColunas || !selecionado) && blocoLista}
          {blocoDetalhe}
        </View>
      ) : (
        <PortalFornecedor pedidos={pedidos} onRegistrar={registrarNoPedido} />
      )}

      <Text style={estilos.aviso}>
        Ambiente demonstrativo — dados fictícios, sem armazenamento.
      </Text>
    </ScrollView>
  );
}

function Info({ rotulo, valor }) {
  return (
    <View style={estilos.info}>
      <Text style={estilos.infoRotulo}>{rotulo}</Text>
      <Text style={estilos.infoValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8FA" },
  conteudo: { padding: 16, gap: 6 },

  titulo: { fontSize: 27, fontWeight: "bold", color: "#19384C" },
  descricao: { fontSize: 14, color: "#657888", marginBottom: 6 },

  abas: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#DDE8EE",
    borderRadius: 10,
    padding: 4,
    gap: 4,
    marginBottom: 10
  },
  aba: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  abaAtiva: { backgroundColor: "#FFFFFF" },
  textoAba: { fontSize: 13, fontWeight: "bold", color: "#657888" },
  textoAbaAtiva: { color: "#19384C" },

  area: { gap: 16 },
  areaDuasColunas: { flexDirection: "row", alignItems: "flex-start" },
  coluna: { gap: 12, minWidth: 0 },
  colunaLista: { flexBasis: 360, flexGrow: 0, flexShrink: 0 },
  colunaDetalhe: { flex: 1 },

  busca: {
    borderWidth: 1,
    borderColor: "#C9D7E0",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#19384C",
    backgroundColor: "#FFFFFF"
  },

  filtros: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#C9D7E0",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12
  },
  chipAtivo: { backgroundColor: "#19384C", borderColor: "#19384C" },
  textoChip: { fontSize: 12, fontWeight: "bold", color: "#3E5566" },
  textoChipAtivo: { color: "#FFFFFF" },

  cartao: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8EE",
    borderRadius: 12,
    padding: 16,
    gap: 4
  },
  itemAtivo: { borderColor: "#0C716B", borderWidth: 2 },

  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  idPedido: { fontSize: 12, fontWeight: "bold", color: "#718696" },
  cartaoTitulo: { fontSize: 15, fontWeight: "bold", color: "#19384C" },
  detalheTitulo: { fontSize: 20, fontWeight: "bold", color: "#19384C", marginTop: 6 },
  texto: { fontSize: 13, color: "#3E5566", lineHeight: 19 },
  textoPequeno: { fontSize: 12, color: "#718696" },

  grade: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10 },
  info: { flexBasis: 160, flexGrow: 1, minWidth: 0 },
  infoRotulo: { fontSize: 11, color: "#718696" },
  infoValor: { fontSize: 14, color: "#19384C", fontWeight: "bold" },

  secao: { fontSize: 16, fontWeight: "bold", color: "#19384C", marginBottom: 10 },

  ajuste: {
    borderLeftWidth: 3,
    borderLeftColor: "#B03A2E",
    paddingLeft: 10,
    marginBottom: 10,
    gap: 2
  },

  voltar: { alignSelf: "flex-start", paddingVertical: 6 },
  textoVoltar: { color: "#0C716B", fontWeight: "bold" },

  sucesso: { backgroundColor: "#DDF3E9", borderRadius: 8, padding: 12 },
  textoSucesso: { color: "#0C716B", fontWeight: "bold", fontSize: 13 },

  aviso: { color: "#718696", fontSize: 12, marginTop: 15 }
});
