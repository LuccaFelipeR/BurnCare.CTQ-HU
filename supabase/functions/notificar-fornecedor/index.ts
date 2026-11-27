// Edge Function: notificação demonstrativa de conteúdo fixo. Não aceita dados clínicos.
// JWT validado pela API Auth e conta/destinatário conferidos em allowlists privadas.
const env = (name: string) => Deno.env.get(name) ?? '';
const lista = (name: string) => env(name).split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
Deno.serve(async (req) => {
  const origin = req.headers.get('origin') ?? '';
  const allowedOrigins = env('BURNCARE_ALLOWED_ORIGINS').split(',').map((s) => s.trim()).filter(Boolean);
  const cors = { 'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
  const reply = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  if (origin && !allowedOrigins.includes(origin)) return reply(403, { status: 'recusado' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return reply(405, { status: 'recusado' });
  if (env('BURNCARE_EMAIL_ENABLED') !== 'true') return reply(503, { status: 'recusado' });
  const token = req.headers.get('authorization') ?? '';
  if (!/^Bearer \S+$/.test(token)) return reply(401, { status: 'recusado' });
  const base = env('SUPABASE_URL');
  const publicKey = env('BURNCARE_PUBLIC_KEY') || env('SUPABASE_ANON_KEY');
  const service = env('SUPABASE_SERVICE_ROLE_KEY');
  const resend = env('RESEND_API_KEY');
  const from = env('BURNCARE_EMAIL_FROM');
  if (!base || !publicKey || !service || !resend || !from) return reply(503, { status: 'recusado' });
  try {
    const userResponse = await fetch(`${base}/auth/v1/user`, { headers: { apikey: publicKey, Authorization: token } });
    if (!userResponse.ok) return reply(401, { status: 'recusado' });
    const user = await userResponse.json();
    if (!user.id || !lista('BURNCARE_CTQ_USER_IDS').includes(String(user.id).toLowerCase())) return reply(403, { status: 'recusado' });
    const raw = await req.text();
    if (raw.length > 2048) return reply(413, { status: 'recusado' });
    let body;
    try { body = JSON.parse(raw); } catch { return reply(400, { status: 'recusado' }); }
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some((k) => !['pedidoId','email','tentativa'].includes(k))) return reply(400, { status: 'recusado' });
    const { pedidoId, email, tentativa } = body;
    if (typeof pedidoId !== 'string' || !/^BC-\d{4}-\d{3,10}$/.test(pedidoId) || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof tentativa !== 'string' || !/^[a-z0-9-]{10,100}$/.test(tentativa)) return reply(400, { status: 'recusado' });
    const destinatario = email.trim().toLowerCase();
    if (!lista('BURNCARE_ALLOWED_RECIPIENTS').includes(destinatario)) return reply(403, { status: 'recusado' });
    // Limite atômico de 10 tentativas/dia por usuário; falha fechada se o banco estiver indisponível.
    const quota = await fetch(`${base}/rest/v1/rpc/burncare_reservar_email`, { method:'POST', headers:{ apikey:service, Authorization:`Bearer ${service}`, 'Content-Type':'application/json' }, body: JSON.stringify({ p_user: user.id }) });
    if (!quota.ok) return reply(503, { status: 'recusado' });
    if (await quota.json() !== true) return reply(429, { status: 'recusado' });
    const sent = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ Authorization:`Bearer ${resend}`, 'Content-Type':'application/json', 'Idempotency-Key':`burncare/${user.id}/${tentativa}` }, body: JSON.stringify({ from, to:[destinatario], subject:`[SIMULAÇÃO] BurnCare — pedido ${pedidoId}`, text:`Olá!\n\nUma solicitação demonstrativa (${pedidoId}) foi registrada no BurnCare. Este é um teste acadêmico sem validade clínica, sem obrigação de produção e sem dados de pacientes.\n\nEquipe BurnCare` }) });
    if (!sent.ok) return reply(502, { status: sent.status >= 500 ? 'indeterminado' : 'recusado' });
    const result = await sent.json();
    if (!result.id) return reply(502, { status: 'indeterminado' });
    return reply(200, { status:'aceito', id:result.id });
  } catch { return reply(502, { status:'indeterminado' }); }
});
