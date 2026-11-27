// Supabase Edge Function (Deno, JavaScript puro para não exigir TypeScript no app Expo): envia ao fornecedor o e-mail de novo pedido do BurnCare.
// Chamada por src/services/emailFornecedor.js. Envio feito pela API do Resend.
//
// Secrets necessários (supabase secrets set ...), ver docs/INTEGRACAO_EMAIL.md:
//   RESEND_API_KEY                    chave da API do Resend (re_...)
//   EMAIL_REMETENTE                   ex.: "BurnCare CTQ <pedidos@seudominio.com.br>" (domínio verificado no Resend)
//   EMAILS_FORNECEDORES_PERMITIDOS    e-mails que PODEM receber, separados por vírgula
//   ORIGENS_PERMITIDAS                sites que podem chamar a função, separados por vírgula
//                                     ex.: "https://seudominio.com.br,http://localhost:8081"
// Opcional:
//   EMAIL_COPIA_CTQ                   e-mail do CTQ que recebe cópia (CC) de cada pedido
//
// Segurança: a função só envia para e-mails da lista permitida e monta o HTML
// aqui mesmo (o app não consegue mandar HTML/texto livre). Assim ela não pode
// ser usada para disparar e-mails para qualquer pessoa.

const lista = (nome) =>
  (Deno.env.get(nome) ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const ORIGENS = lista("ORIGENS_PERMITIDAS");
const PERMITIDOS = lista("EMAILS_FORNECEDORES_PERMITIDOS");

function cabecalhosCors(origem) {
  const liberada = origem && ORIGENS.includes(origem.toLowerCase()) ? origem : ORIGENS[0] ?? "";
  return {
    "Access-Control-Allow-Origin": liberada,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin"
  };
}

const escapar = (valor) =>
  String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .slice(0, 500);

function montarHtml(fornecedor, pedido) {
  const produtos = (Array.isArray(pedido.produtos) ? pedido.produtos : []).slice(0, 20);
  const blocos = produtos
    .map((p) => {
      const medidas = Object.entries(p.medidas ?? {})
        .slice(0, 40)
        .map(([nome, valor]) => `<tr><td style="padding:2px 12px 2px 0">${escapar(nome)}</td><td><b>${escapar(valor)}</b></td></tr>`)
        .join("");
      return `
        <h3 style="margin:18px 0 4px;color:#19384C">${escapar(p.descricao)}</h3>
        <div style="color:#657888;font-size:13px">Código ${escapar(p.codigo)} · SUS ${escapar(p.codigoSus)} · Modelo/acabamento: ${escapar(p.modelo)}</div>
        <table style="font-size:13px;margin-top:6px">${medidas || "<tr><td>Sem medidas</td></tr>"}</table>`;
    })
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;color:#334155">
    <h2 style="color:#0C716B;margin-bottom:4px">Novo pedido de malha compressiva</h2>
    <div style="color:#657888">CTQ · Hospital Universitário de Londrina</div>
    <p>Olá, ${escapar(fornecedor)}.</p>
    <p>Um novo pedido foi encaminhado para confecção:</p>
    <table style="font-size:14px">
      <tr><td style="padding-right:12px">Pedido</td><td><b>${escapar(pedido.id)}</b></td></tr>
      <tr><td style="padding-right:12px">Data</td><td>${escapar(pedido.dataPedido)}</td></tr>
      <tr><td style="padding-right:12px">Tipo</td><td>${escapar(pedido.tipo)}</td></tr>
      <tr><td style="padding-right:12px">Região</td><td>${escapar(pedido.regiao)}</td></tr>
      <tr><td style="padding-right:12px">Anexos</td><td>${escapar(pedido.quantidadeAnexos)} (disponíveis no sistema)</td></tr>
    </table>
    ${blocos}
    <p style="margin-top:24px">Confirme o recebimento pelo Portal do fornecedor do BurnCare.</p>
    <p style="font-size:11px;color:#8A9AA8">Mensagem automática. Os dados de identificação do paciente não são enviados por e-mail.</p>
  </div>`;
}

Deno.serve(async (req) => {
  const cors = cabecalhosCors(req.headers.get("origin"));
  const responder = (status, corpo) =>
    new Response(JSON.stringify(corpo), { status, headers: { ...cors, "Content-Type": "application/json" } });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return responder(405, { erro: "Método não permitido" });

  const origem = req.headers.get("origin");
  if (origem && ORIGENS.length && !ORIGENS.includes(origem.toLowerCase())) {
    return responder(403, { erro: "Origem não autorizada" });
  }

  const chave = Deno.env.get("RESEND_API_KEY");
  const remetente = Deno.env.get("EMAIL_REMETENTE");
  if (!chave || !remetente) return responder(500, { erro: "Função sem RESEND_API_KEY/EMAIL_REMETENTE configurados" });

  let dados;
  try {
    dados = await req.json();
  } catch {
    return responder(400, { erro: "JSON inválido" });
  }

  const para = String(dados.para ?? "").trim().toLowerCase();
  if (!para || !dados.pedido?.id) return responder(400, { erro: "Campos 'para' e 'pedido.id' são obrigatórios" });
  if (!PERMITIDOS.includes(para)) {
    return responder(403, { erro: "E-mail do fornecedor não está em EMAILS_FORNECEDORES_PERMITIDOS" });
  }

  const copia = Deno.env.get("EMAIL_COPIA_CTQ");
  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: remetente,
      to: [para],
      ...(copia ? { cc: [copia], reply_to: copia } : {}),
      subject: `[BurnCare] Novo pedido ${String(dados.pedido.id).slice(0, 40)}`,
      html: montarHtml(String(dados.fornecedor ?? "fornecedor"), dados.pedido)
    })
  });

  const resultado = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    console.error("Resend recusou o envio", resposta.status, resultado);
    return responder(502, { erro: resultado?.message ?? "Falha no provedor de e-mail" });
  }
  return responder(200, { ok: true, id: resultado.id });
});
