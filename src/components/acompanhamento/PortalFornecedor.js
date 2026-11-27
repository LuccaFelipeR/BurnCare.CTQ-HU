// Portal do fornecedor — acesso LIMITADO aos dados necessários à confecção.
// O fornecedor não vê nome, prontuário, prova, conferência nem entrega do paciente.
// Responsável: Matheus Albertini

import { useState } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";

import StatusBadge from "./StatusBadge";
import LinhaDoTempo from "./LinhaDoTempo";
import PainelAcao from "./PainelAcao";
import BotaoConfirmar from "./BotaoConfirmar";
import {
  ATOR,
  FORNECEDORES,
  pedidosDoFornecedor,
  podeDesfazer,
  textoAlteracoes
} from "../../data/acompanhamentoPedidos";

export default function PortalFornecedor({ pedidos, onRegistrar, onDesfazer }) {
  const [fornecedor, setFornecedor] = useState(FORNECEDORES[0]);
  const [somentePendentes, setSomentePendentes] = useState(true);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const { width } = useWindowDimensions();
  const duasColunas = width >= 1100;

  const lista = pedidosDoFornecedor(pedidos, fornecedor, somentePendentes);
  const todosDoFornecedor = pedidosDoFornecedor(pedidos, fornecedor, false);
  const selecionado = todosDoFornecedor.find((p) => p.id === idSelecionado) || null;
  const pedidoCompleto = pedidos.find((p) => p.id === idSelecionado) || null;

  function trocarFornecedor(nome) {
    setFornecedor(nome);
    setIdSelecionado(null);
    setMensagem("");
  }

  function selecionar(id) {
    setIdSelecionado(id);
    setMensagem("");
  }

  function registrar(dados) {
    onRegistrar(idSelecionado, dados);
    setMensagem("Registro enviado ao CTQ (apenas nesta sessão — dados fictícios).");
  }

  function desfazer() {
    onDesfazer(idSelecionado);
    setMensagem("Último registro excluído. O pedido voltou ao status anterior.");
  }

  const blocoLista = (
    <View style={[estilos.coluna, duasColunas && estilos.colunaLista]}>
      <Text style={estilos.rotuloSecao}>Entrar como (simulação)</Text>
      <View style={estilos.chips}>
        {FORNECEDORES.map((nome) => (
          <Chip key={nome} ativo={fornecedor === nome} onPress={() => trocarFornecedor(nome)}>
            {nome}
          </Chip>
        ))}
      </View>

      <View style={estilos.chips}>
        <Chip ativo={somentePendentes} onPress={() => setSomentePendentes(true)}>
          Pendentes ({pedidosDoFornecedor(pedidos, fornecedor, true).length})
        </Chip>
        <Chip ativo={!somentePendentes} onPress={() => setSomentePendentes(false)}>
          Todos ({todosDoFornecedor.length})
        </Chip>
      </View>

      {lista.length === 0 ? (
        <View style={estilos.cartao}>
          <Text style={estilos.cartaoTitulo}>Nenhum pedido pendente</Text>
          <Text style={estilos.texto}>Não há etapas aguardando este fornecedor.</Text>
        </View>
      ) : (
        lista.map((pedido) => (
          <Pressable
            key={pedido.id}
            onPress={() => selecionar(pedido.id)}
            style={[estilos.cartao, pedido.id === idSelecionado && estilos.itemAtivo]}
          >
            <View style={estilos.linhaTopo}>
              <Text style={estilos.idPedido}>{pedido.id}</Text>
              <StatusBadge status={pedido.status} />
            </View>
            <Text style={estilos.cartaoTitulo}>{pedido.produto}</Text>
            <Text style={estilos.texto}>{pedido.regiao} · {pedido.tipo}</Text>
            <Text style={estilos.textoPequeno}>Pedido em {pedido.dataPedido}</Text>
          </Pressable>
        ))
      )}
    </View>
  );

  const blocoDetalhe = selecionado && pedidoCompleto ? (
    <View style={[estilos.coluna, duasColunas && estilos.colunaDetalhe]}>
      {!duasColunas && (
        <Pressable onPress={() => selecionar(null)} style={estilos.voltar}>
          <Text style={estilos.textoVoltar}>← Voltar para a lista</Text>
        </Pressable>
      )}

      <View style={estilos.restrito}>
        <Text style={estilos.textoRestrito}>
          🔒 Acesso restrito: dados de identificação do paciente ocultos para o fornecedor.
        </Text>
      </View>

      <View style={estilos.cartao}>
        <View style={estilos.linhaTopo}>
          <Text style={estilos.idPedido}>{selecionado.id}</Text>
          <StatusBadge status={selecionado.status} />
        </View>
        <Text style={estilos.detalheTitulo}>{selecionado.produto}</Text>
        <Text style={estilos.texto}>{selecionado.regiao} · {selecionado.tipo} · pedido em {selecionado.dataPedido}</Text>

        <Text style={[estilos.rotuloSecao, { marginTop: 12 }]}>Medidas para confecção</Text>
        {Object.entries(selecionado.medidas || {}).map(([nome, valor]) => (
          <View key={nome} style={estilos.medida}>
            <Text style={estilos.texto}>{nome}</Text>
            <Text style={estilos.valorMedida}>{valor}</Text>
          </View>
        ))}
      </View>

      {selecionado.ajusteAtual && (
        <View style={[estilos.cartao, estilos.cartaoAjuste]}>
          <Text style={estilos.cartaoTitulo}>Ajuste solicitado nº {selecionado.ajusteAtual.numero}</Text>
          <Text style={estilos.texto}>{selecionado.ajusteAtual.descricao}</Text>
          {selecionado.ajusteAtual.alteracoesMedidas.length > 0 && (
            <Text style={estilos.texto}>
              Novas medidas: {textoAlteracoes(selecionado.ajusteAtual.alteracoesMedidas)}
            </Text>
          )}
        </View>
      )}

      {mensagem !== "" && (
        <View style={estilos.sucesso}>
          <Text style={estilos.textoSucesso}>{mensagem}</Text>
        </View>
      )}

      <PainelAcao
        key={`${pedidoCompleto.id}-${pedidoCompleto.status}-${pedidoCompleto.historico.length}`}
        pedido={pedidoCompleto}
        ator={ATOR.FORNECEDOR}
        onConfirmar={registrar}
      />

      <View style={estilos.cartao}>
        <Text style={estilos.secao}>Confecção e logística</Text>
        {podeDesfazer(pedidoCompleto, ATOR.FORNECEDOR) && (
          <View style={estilos.desfazer}>
            <BotaoConfirmar
              key={`desfazer-${pedidoCompleto.id}-${pedidoCompleto.historico.length}`}
              rotulo="Excluir meu último registro"
              pergunta="Excluir o último registro do fornecedor? O pedido volta ao status anterior."
              onConfirmar={desfazer}
            />
          </View>
        )}
        <LinhaDoTempo historico={selecionado.historico} />
      </View>
    </View>
  ) : (
    duasColunas && (
      <View style={[estilos.coluna, estilos.colunaDetalhe]}>
        <View style={estilos.cartao}>
          <Text style={estilos.cartaoTitulo}>Selecione um pedido</Text>
          <Text style={estilos.texto}>
            Confirme o recebimento do pedido, registre a postagem da malha ou o retorno de um ajuste.
          </Text>
        </View>
      </View>
    )
  );

  return (
    <View style={[estilos.area, duasColunas && estilos.areaDuasColunas]}>
      {(duasColunas || !selecionado) && blocoLista}
      {blocoDetalhe}
    </View>
  );
}

function Chip({ ativo, onPress, children }) {
  return (
    <Pressable onPress={onPress} style={[estilos.chip, ativo && estilos.chipAtivo]}>
      <Text style={[estilos.textoChip, ativo && estilos.textoChipAtivo]}>{children}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  area: { gap: 16 },
  areaDuasColunas: { flexDirection: "row", alignItems: "flex-start" },
  coluna: { gap: 12, minWidth: 0 },
  colunaLista: { flexBasis: 360, flexGrow: 0, flexShrink: 0 },
  colunaDetalhe: { flex: 1 },

  rotuloSecao: { fontSize: 12, fontWeight: "bold", color: "#718696" },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
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
  cartaoAjuste: { borderLeftWidth: 4, borderLeftColor: "#B03A2E" },
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
  secao: { fontSize: 16, fontWeight: "bold", color: "#19384C", marginBottom: 10 },

  medida: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F5",
    paddingVertical: 6,
    gap: 8
  },
  valorMedida: { fontSize: 13, fontWeight: "bold", color: "#19384C" },

  restrito: { backgroundColor: "#FFF3DC", borderRadius: 8, padding: 12 },
  textoRestrito: { color: "#9A6200", fontSize: 13, fontWeight: "bold" },

  desfazer: { marginBottom: 12 },
  voltar: { alignSelf: "flex-start", paddingVertical: 6 },
  textoVoltar: { color: "#0C716B", fontWeight: "bold" },

  sucesso: { backgroundColor: "#DDF3E9", borderRadius: 8, padding: 12 },
  textoSucesso: { color: "#0C716B", fontWeight: "bold", fontSize: 13 }
});
