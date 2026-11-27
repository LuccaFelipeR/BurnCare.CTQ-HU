// Apenas configuração pública do Expo. Nunca colocar chaves Resend/service_role aqui.
const url = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const chave = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
export const emailConfigurado = () => /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) && !!chave;
async function post(path, body, token) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const resposta = await fetch(`${url}${path}`, { method: 'POST', headers: { apikey: chave, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body), signal: controller.signal });
    const dados = await resposta.json().catch(() => ({}));
    return { ok: resposta.ok, dados };
  } finally { clearTimeout(timer); }
}
export async function entrarEmail(email, senha) {
  if (!emailConfigurado()) throw new Error('Configure as variáveis públicas do Supabase primeiro.');
  const { ok, dados } = await post('/auth/v1/token?grant_type=password', { email: email.trim(), password: senha });
  if (!ok || !dados.access_token) throw new Error('Não foi possível autenticar a conta de teste. Confira as credenciais.');
  // Token somente em memória; a senha não é armazenada.
  return { token: dados.access_token, email: dados.user?.email ?? email.trim(), expira: Date.now() + Number(dados.expires_in || 3600) * 1000 };
}
export async function enviarNotificacaoPedido({ sessao, fornecedor, pedidoId }) {
  if (!emailConfigurado() || !sessao || !fornecedor?.email) return { status: 'desativado', mensagem: 'E-mail não enviado: integração desativada ou fornecedor sem e-mail.' };
  if (Date.now() >= sessao.expira) return { status: 'recusado', mensagem: 'Sessão de e-mail expirada. Entre novamente na tela Fornecedores.' };
  // ID aleatório de tentativa, sem informações do paciente; evita colisões entre sessões locais.
  const tentativa = `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  const { ok, dados } = await post('/functions/v1/notificar-fornecedor', { pedidoId, email: fornecedor.email, tentativa }, sessao.token);
  if (!ok || dados.status !== 'aceito') return { status: dados.status === 'indeterminado' ? 'indeterminado' : 'recusado', mensagem: 'Notificação não confirmada. Confira autorização, destinatário e logs do Supabase/Resend. O pedido permanece registrado.' };
  return { status: 'aceito', mensagem: 'Notificação demonstrativa aceita pelo serviço de e-mail. A entrega na caixa de entrada ainda depende do provedor.' };
}
