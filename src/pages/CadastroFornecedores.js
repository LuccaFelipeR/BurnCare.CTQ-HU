// Cadastro de fornecedores (confecções). Dados em memória, somente nesta sessão.
// O e-mail cadastrado aqui é o destinatário do aviso de novo pedido
// (ver src/services/emailFornecedor.js e docs/INTEGRACAO_EMAIL.md).

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

import { useFornecedores } from "../context/FornecedoresContext";
import { usePedidos } from "../context/PedidosContext";
import { formatarCnpj, novoFornecedor, validarFornecedor } from "../data/fornecedores";
import { emailIntegracaoAtiva } from "../services/emailFornecedor";

const CAMPOS = [
  { nome: "nome", rotulo: "Nome do fornecedor *", placeholder: "Ex.: Malharia Terapêutica Norte Paraná" },
  { nome: "email", rotulo: "E-mail para receber pedidos *", placeholder: "pedidos@empresa.com.br", teclado: "email-address" },
  { nome: "cnpj", rotulo: "CNPJ", placeholder: "00.000.000/0000-00", teclado: "numeric", formatar: formatarCnpj },
  { nome: "telefone", rotulo: "Telefone", placeholder: "(43) 0000-0000", teclado: "phone-pad" },
  { nome: "contato", rotulo: "Pessoa / setor de contato", placeholder: "Ex.: Setor de pedidos" },
  { nome: "cidade", rotulo: "Cidade - UF", placeholder: "Ex.: Londrina - PR" },
  { nome: "observacoes", rotulo: "Observações", placeholder: "Prazos, condições de ajuste etc.", multilinha: true }
];

export default function CadastroFornecedores() {
  const { fornecedores, salvarFornecedor, alternarAtivo } = useFornecedores();
  const { pedidos } = usePedidos();
  const [form, setForm] = useState(novoFornecedor);
  const [erros, setErros] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const { width } = useWindowDimensions();
  const duasColunas = width >= 1000;
  const editando = Boolean(form.id);

  const pedidosDe = (nome) => pedidos.filter((p) => p.fornecedor === nome).length;

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros([]);
    setMensagem("");
  }

  function salvar() {
    const pendencias = validarFornecedor(form, fornecedores);
    if (pendencias.length) {
      setErros(pendencias);
      return;
    }
    const salvo = salvarFornecedor(form);
    setMensagem(editando ? `“${salvo.nome}” atualizado.` : `“${salvo.nome}” cadastrado.`);
    setForm(novoFornecedor());
  }

  function editar(fornecedor) {
    setForm({ ...fornecedor });
    setErros([]);
    setMensagem("");
  }

  function cancelar() {
    setForm(novoFornecedor());
    setErros([]);
    setMensagem("");
  }

  const lista = (
    <View style={[estilos.cartao, duasColunas && estilos.colunaLista]}>
      <Text style={estilos.secao}>Fornecedores cadastrados ({fornecedores.length})</Text>
      {fornecedores.map((f) => (
        <View key={f.id} style={[estilos.item, !f.ativo && estilos.itemInativo, form.id === f.id && estilos.itemEditando]}>
          <View style={estilos.itemCabecalho}>
            <Text style={estilos.itemNome}>{f.nome}</Text>
            <Text style={[estilos.selo, f.ativo ? estilos.seloAtivo : estilos.seloInativo]}>
              {f.ativo ? "Ativo" : "Inativo"}
            </Text>
          </View>
          <Text style={estilos.itemTexto}>✉ {f.email}</Text>
          {!!f.telefone && <Text style={estilos.itemTexto}>☎ {f.telefone}{f.contato ? ` · ${f.contato}` : ""}</Text>}
          {!!(f.cnpj || f.cidade) && (
            <Text style={estilos.itemTexto}>{[f.cnpj && `CNPJ ${f.cnpj}`, f.cidade].filter(Boolean).join(" · ")}</Text>
          )}
          <Text style={estilos.itemTexto}>{pedidosDe(f.nome)} pedido(s) nesta sessão</Text>
          {/\.example$/i.test(f.email) && (
            <Text style={estilos.alertaTexto}>E-mail fictício: troque pelo real antes de ativar o envio.</Text>
          )}
          <View style={estilos.acoes}>
            <Pressable accessibilityRole="button" style={estilos.botaoSecundario} onPress={() => editar(f)}>
              <Text style={estilos.textoSecundario}>Editar</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={estilos.botaoSecundario} onPress={() => alternarAtivo(f.id)}>
              <Text style={estilos.textoSecundario}>{f.ativo ? "Desativar" : "Reativar"}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );

  const formulario = (
    <View style={[estilos.cartao, duasColunas && estilos.colunaForm]}>
      <Text style={estilos.secao}>{editando ? "Editar fornecedor" : "Novo fornecedor"}</Text>
      {CAMPOS.map((campo) => (
        <View key={campo.nome} style={estilos.campo}>
          <Text style={estilos.rotulo}>{campo.rotulo}</Text>
          <TextInput
            accessibilityLabel={campo.rotulo.replace(" *", "")}
            value={form[campo.nome] ?? ""}
            onChangeText={(valor) => alterar(campo.nome, campo.formatar ? campo.formatar(valor) : valor)}
            placeholder={campo.placeholder}
            keyboardType={campo.teclado}
            autoCapitalize={campo.nome === "email" ? "none" : "sentences"}
            multiline={campo.multilinha}
            style={[estilos.input, campo.multilinha && estilos.inputMultilinha]}
          />
        </View>
      ))}
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: form.ativo }}
        onPress={() => alterar("ativo", !form.ativo)}
        style={estilos.linhaCheck}
      >
        <View style={[estilos.checkbox, form.ativo && estilos.checkboxAtivo]}>
          {form.ativo && <Text style={estilos.check}>✓</Text>}
        </View>
        <Text style={estilos.rotulo}>Ativo (aparece na escolha de fornecedor do Novo Pedido)</Text>
      </Pressable>

      {erros.length > 0 && (
        <View accessibilityRole="alert" style={estilos.alerta}>
          {erros.map((e) => <Text key={e} style={estilos.alertaTexto}>{e}</Text>)}
        </View>
      )}
      {!!mensagem && <Text style={estilos.sucesso}>{mensagem}</Text>}

      <View style={estilos.acoesForm}>
        {editando && (
          <Pressable accessibilityRole="button" style={estilos.botaoSecundario} onPress={cancelar}>
            <Text style={estilos.textoSecundario}>Cancelar</Text>
          </Pressable>
        )}
        <Pressable accessibilityRole="button" style={estilos.botaoPrimario} onPress={salvar}>
          <Text style={estilos.textoPrimario}>{editando ? "Salvar alterações" : "Cadastrar fornecedor"}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={estilos.titulo}>Fornecedores</Text>
      <Text style={estilos.descricao}>
        Cadastre as confecções que recebem os pedidos de malha. O e-mail informado recebe o aviso de cada novo pedido.
      </Text>
      <View style={[estilos.statusEmail, emailIntegracaoAtiva() ? estilos.statusAtivo : estilos.statusInativo]}>
        <Text style={estilos.statusTexto}>
          {emailIntegracaoAtiva()
            ? "Envio de e-mail ATIVO: novos pedidos geram e-mail para o fornecedor escolhido."
            : "Envio de e-mail DESATIVADO (modo simulação). Veja docs/INTEGRACAO_EMAIL.md para ativar."}
        </Text>
      </View>
      <View style={[estilos.area, duasColunas && estilos.areaDuasColunas]}>
        {formulario}
        {lista}
      </View>
      <Text style={estilos.aviso}>Ambiente demonstrativo: o cadastro fica apenas nesta sessão, sem armazenamento permanente.</Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8FA" },
  conteudo: { padding: 16, gap: 10 },
  titulo: { fontSize: 27, fontWeight: "bold", color: "#19384C" },
  descricao: { fontSize: 14, color: "#657888" },
  statusEmail: { padding: 10, borderRadius: 8 },
  statusAtivo: { backgroundColor: "#DDF3E9" },
  statusInativo: { backgroundColor: "#FFF4E5" },
  statusTexto: { fontSize: 12, color: "#334155" },
  area: { gap: 12 },
  areaDuasColunas: { flexDirection: "row", alignItems: "flex-start" },
  cartao: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, gap: 10 },
  colunaLista: { flex: 1, minWidth: 0 },
  colunaForm: { width: 420 },
  secao: { fontSize: 16, fontWeight: "bold", color: "#19384C" },
  item: { borderWidth: 1, borderColor: "#DDE8EE", borderRadius: 8, padding: 12, gap: 4 },
  itemInativo: { opacity: 0.6 },
  itemEditando: { borderColor: "#0C716B", backgroundColor: "#F2FAF7" },
  itemCabecalho: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" },
  itemNome: { fontSize: 14, fontWeight: "bold", color: "#19384C", flexShrink: 1 },
  itemTexto: { fontSize: 12, color: "#657888" },
  selo: { fontSize: 11, fontWeight: "bold", paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10, overflow: "hidden" },
  seloAtivo: { color: "#0C716B", backgroundColor: "#DDF3E9" },
  seloInativo: { color: "#5B6B7A", backgroundColor: "#EEF2F5" },
  acoes: { flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" },
  acoesForm: { flexDirection: "row", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" },
  campo: { gap: 4 },
  rotulo: { color: "#334155", fontSize: 13, fontWeight: "600", flexShrink: 1 },
  input: {
    minHeight: 40, borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, color: "#1E293B", backgroundColor: "#FFFFFF"
  },
  inputMultilinha: { minHeight: 70, textAlignVertical: "top" },
  linhaCheck: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 18, height: 18, borderWidth: 1, borderColor: "#91A4AF", borderRadius: 3,
    alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF"
  },
  checkboxAtivo: { backgroundColor: "#0C716B", borderColor: "#0C716B" },
  check: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold", lineHeight: 15 },
  alerta: { padding: 10, borderRadius: 8, backgroundColor: "#FFF4E5", gap: 2 },
  alertaTexto: { color: "#B45309", fontSize: 12 },
  sucesso: { color: "#0C716B", fontSize: 13, fontWeight: "bold" },
  botaoPrimario: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 6, backgroundColor: "#0C716B" },
  textoPrimario: { color: "#FFFFFF", fontSize: 13, fontWeight: "bold" },
  botaoSecundario: {
    paddingVertical: 7, paddingHorizontal: 12, borderRadius: 6,
    borderWidth: 1, borderColor: "#DDE8EE", backgroundColor: "#FFFFFF"
  },
  textoSecundario: { color: "#4B6070", fontSize: 12, fontWeight: "bold" },
  aviso: { fontSize: 11, color: "#8A9AA8", marginTop: 6 }
});
