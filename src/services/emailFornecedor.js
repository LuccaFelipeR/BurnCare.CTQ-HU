// Envio do aviso de novo pedido por e-mail ao fornecedor.
//
// Como funciona:
//   App (navegador)  →  Supabase Edge Function "enviar-pedido-fornecedor"  →  Resend (API de e-mail)  →  fornecedor
//
// A chave da API de e-mail NUNCA fica no app: ela fica como "secret" na Edge Function.
// O app só conhece a URL do projeto Supabase e a chave pública (anon/publishable),
// que podem ficar no código do site sem problema.
//
// Enquanto as variáveis abaixo não estiverem preenchidas, o envio fica DESATIVADO
// e o app segue em modo simulação (nada sai do navegador).
// Passo a passo para ativar: docs/INTEGRACAO_EMAIL.md
//
// Variáveis (arquivo .env na raiz, ver .env.example):
//   EXPO_PUBLIC_EMAIL_FORNECEDOR_ATIVO=true
//   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   EXPO_PUBLIC_SUPABASE_ANON_KEY=...

const CONFIG = {
  // O Expo só substitui process.env.EXPO_PUBLIC_* quando escrito assim, por extenso.
  ativo: process.env.EXPO_PUBLIC_EMAIL_FORNECEDOR_ATIVO === "true",
  supabaseUrl: (process.env.EXPO_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, ""),
  chavePublica: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ""
};

const NOME_FUNCAO = "enviar-pedido-fornecedor";
const TEMPO_LIMITE_MS = 15000;

export function emailIntegracaoAtiva() {
  return CONFIG.ativo && Boolean(CONFIG.supabaseUrl) && Boolean(CONFIG.chavePublica);
}

// Monta o conteúdo do e-mail SEM dados de identificação do paciente
// (nome, prontuário, endereço, telefone). O fornecedor recebe apenas o que
// precisa para confeccionar a malha, igual ao Portal do fornecedor.
export function montarDadosEmail(pedido, fornecedor) {
  return {
    para: fornecedor.email,
    fornecedor: fornecedor.nome,
    pedido: {
      id: pedido.id,
      dataPedido: pedido.dataPedido,
      tipo: pedido.tipo,
      regiao: pedido.regiao,
      produtos: (pedido.fichas ?? []).map((ficha) => ({
        descricao: ficha.descricao,
        codigo: ficha.codigo,
        codigoSus: ficha.codigoSus,
        modelo: ficha.modelo || "Não informado",
        medidas: ficha.medidas ?? {}
      })),
      quantidadeAnexos: pedido.fotos?.length ?? 0
    }
  };
}

// Retorna sempre um objeto { status, mensagem } e nunca lança erro:
//   status "simulado" → integração desativada (nada foi enviado)
//   status "enviado"  → e-mail aceito pelo provedor
//   status "erro"     → falhou (o pedido continua registrado normalmente)
export async function enviarEmailNovoPedido(pedido, fornecedor) {
  if (!emailIntegracaoAtiva()) {
    return {
      status: "simulado",
      mensagem: "Envio de e-mail desativado (modo simulação). Nenhum e-mail foi enviado."
    };
  }
  if (!fornecedor?.email) {
    return { status: "erro", mensagem: "O fornecedor escolhido não tem e-mail cadastrado." };
  }

  const controlador = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controlador ? setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS) : null;

  try {
    const resposta = await fetch(`${CONFIG.supabaseUrl}/functions/v1/${NOME_FUNCAO}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: CONFIG.chavePublica,
        Authorization: `Bearer ${CONFIG.chavePublica}`
      },
      body: JSON.stringify(montarDadosEmail(pedido, fornecedor)),
      signal: controlador?.signal
    });
    const corpo = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      return {
        status: "erro",
        mensagem: `Não foi possível enviar o e-mail (${resposta.status}): ${corpo.erro ?? "erro desconhecido"}.`
      };
    }
    return { status: "enviado", mensagem: `E-mail enviado para ${fornecedor.email}.`, id: corpo.id };
  } catch (erro) {
    const tempoEsgotado = erro?.name === "AbortError";
    return {
      status: "erro",
      mensagem: tempoEsgotado
        ? "O envio do e-mail demorou demais e foi cancelado."
        : "Falha de conexão ao enviar o e-mail."
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
