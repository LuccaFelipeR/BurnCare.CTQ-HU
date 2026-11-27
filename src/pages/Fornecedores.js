import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { usePedidos } from '../context/PedidosContext';
import { emailConfigurado, entrarEmail } from '../services/emailFornecedor';
const vazio = () => ({ nome: '', contato: '', email: '', telefone: '' });
export default function Fornecedores() {
  const { fornecedores, salvarFornecedor, sessaoEmail, setSessaoEmail } = usePedidos();
  const [dados, setDados] = useState(vazio);
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState([]);
  const [emailConta, setEmailConta] = useState('');
  const [senha, setSenha] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [avisoLogin, setAvisoLogin] = useState('');
  function salvar() {
    const resultado = salvarFornecedor(dados);
    setErros(resultado); setMensagem(resultado.length ? '' : 'Fornecedor salvo nesta sessão.');
    if (!resultado.length) setDados(vazio());
  }
  async function entrar() {
    if (ocupado) return;
    setOcupado(true); setAvisoLogin('');
    try { setSessaoEmail(await entrarEmail(emailConta, senha)); setAvisoLogin('Sessão de teste ativada. Somente e-mails autorizados no servidor poderão receber notificações.'); }
    catch (e) { setAvisoLogin(e.message || 'Falha de conexão.'); }
    finally { setSenha(''); setOcupado(false); }
  }
  return <ScrollView style={s.container} contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
    <Text style={s.titulo}>Fornecedores</Text><Text style={s.texto}>Cadastro e contatos para confecção de malhas compressivas.</Text>
    <View style={s.aviso}><Text style={s.texto}>SIMULAÇÃO — cadastros locais, sem dados de pacientes. Use apenas contatos de teste autorizados. Os dados são perdidos ao recarregar.</Text></View>
    <View style={s.card}><Text style={s.subtitulo}>{dados.id ? 'Editar contato do fornecedor' : 'Cadastrar fornecedor'}</Text>
      {[[ 'nome', 'Nome do fornecedor *', 'Ex.: Empresa demonstrativa'], ['contato','Responsável / contato','Nome fictício'], ['email','E-mail para notificações','Seu endereço de teste autorizado'], ['telefone','Telefone','Contato demonstrativo']].map(([campo, rotulo, placeholder]) => <View key={campo} style={s.grupo}><Text style={s.rotulo}>{rotulo}</Text><TextInput accessibilityLabel={rotulo} style={[s.input, dados.id && campo === 'nome' && { backgroundColor: '#EEF2F5' }]} editable={!(dados.id && campo === 'nome')} value={dados[campo]} placeholder={placeholder} keyboardType={campo === 'email' ? 'email-address' : campo === 'telefone' ? 'phone-pad' : 'default'} autoCapitalize={campo === 'email' ? 'none' : 'sentences'} onChangeText={(valor) => {setDados((d) => ({...d,[campo]:valor}));setErros([]);setMensagem('');}} /></View>)}
      {dados.id && <Text style={s.texto}>Nome fixo para manter o vínculo com os pedidos existentes.</Text>}
      {erros.map((e) => <Text key={e} accessibilityRole="alert" style={s.erro}>{e}</Text>)}{!!mensagem && <Text style={s.sucesso}>{mensagem}</Text>}
      <View style={s.linha}><Pressable style={s.botaoSec} onPress={() => {setDados(vazio());setErros([]);setMensagem('');}}><Text style={s.link}>Limpar / novo</Text></Pressable><Pressable style={s.botao} onPress={salvar}><Text style={s.branco}>Salvar fornecedor</Text></Pressable></View>
    </View>
    <Text style={s.subtitulo}>Fornecedores cadastrados ({fornecedores.length})</Text>
    {fornecedores.map((f) => <View key={f.id} style={s.card}><Text style={s.subtitulo}>{f.nome}</Text><Text style={s.texto}>Contato: {f.contato || 'Não informado'}</Text><Text style={s.texto}>E-mail: {f.email || 'Não cadastrado'}</Text><Text style={s.texto}>Telefone: {f.telefone || 'Não informado'}</Text><Pressable onPress={() => {setDados({...f});setErros([]);setMensagem('');}}><Text style={s.link}>Editar contato</Text></Pressable></View>)}
    <View style={s.card}><Text style={s.subtitulo}>Notificações de e-mail — teste</Text><Text style={s.texto}>A autenticação abaixo habilita somente notificações de teste nesta sessão, não protege as outras telas nem habilita uso clínico.</Text>
      {!emailConfigurado() ? <Text style={s.texto}>Integração desativada. Configure o Supabase conforme docs/ATIVAR_EMAIL.md.</Text> : sessaoEmail ? <><Text style={s.sucesso}>Conta de teste: {sessaoEmail.email}</Text><Text style={s.texto}>Ao confirmar um pedido com e-mail cadastrado, o sistema tentará enviar uma notificação genérica ao destinatário autorizado.</Text><Pressable style={s.botaoSec} onPress={() => {setSessaoEmail(null);setAvisoLogin('Notificações desativadas nesta sessão.');}}><Text style={s.link}>Desativar / sair</Text></Pressable></> : <><TextInput style={s.input} accessibilityLabel="E-mail da conta de teste" placeholder="E-mail da conta Supabase Auth" autoCapitalize="none" keyboardType="email-address" value={emailConta} onChangeText={setEmailConta}/><TextInput style={s.input} accessibilityLabel="Senha da conta de teste" placeholder="Senha da conta de teste" secureTextEntry value={senha} onChangeText={setSenha}/><Pressable disabled={ocupado || !senha || !emailConta} style={[s.botao, (ocupado || !senha || !emailConta) && {opacity:0.55}]} onPress={entrar}><Text style={s.branco}>{ocupado ? 'Autenticando…' : 'Ativar envio de teste'}</Text></Pressable></>}
      {!!avisoLogin && <Text accessibilityRole="alert" style={s.texto}>{avisoLogin}</Text>}
    </View>
  </ScrollView>;
}
const s = StyleSheet.create({container:{flex:1,backgroundColor:'#F4F8FA'},conteudo:{padding:16,gap:12},titulo:{fontSize:27,fontWeight:'bold',color:'#19384C'},subtitulo:{fontSize:17,fontWeight:'bold',color:'#19384C'},texto:{fontSize:13,color:'#516879',lineHeight:20},aviso:{backgroundColor:'#FFF3DC',borderRadius:8,padding:12},card:{padding:16,gap:10,borderRadius:12,borderWidth:1,borderColor:'#DDE8EE',backgroundColor:'#FFFFFF'},grupo:{gap:5},rotulo:{fontSize:13,fontWeight:'600',color:'#334155'},input:{borderWidth:1,borderColor:'#CBD5E1',borderRadius:6,padding:10,minHeight:42,color:'#19384C',backgroundColor:'#FFFFFF'},linha:{flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-end',gap:8},botao:{backgroundColor:'#0C716B',padding:12,borderRadius:7,alignItems:'center'},botaoSec:{borderColor:'#CBD5E1',borderWidth:1,padding:12,borderRadius:7,alignItems:'center'},branco:{color:'#FFFFFF',fontWeight:'bold'},link:{color:'#0C716B',fontWeight:'bold'},erro:{color:'#A32626'},sucesso:{color:'#0C716B',fontWeight:'bold'}});
